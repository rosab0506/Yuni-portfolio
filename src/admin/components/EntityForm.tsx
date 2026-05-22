import { useEffect, useMemo, useState, useCallback } from 'react';
import { z } from 'zod';
import { Plus, X, Save, AlertCircle, Upload, Image as ImageIcon, ChevronDown, FileText, Link as LinkIcon, Check, Loader2 } from 'lucide-react';
import type { FieldSchema } from '../cms/cmsSchemas';
import { detectSocialPlatform, formatPlatformLabel } from '../../utils/detectSocialPlatform';
import { iconMap } from '../../utils/iconMap';
import { getStorageService, getBucketForField, isDataUrl } from '../../services/storage.service';

export type EntityFormProps = {
  fields: FieldSchema[];
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
  onCancel?: () => void;
  submitLabel?: string;
};

const getNested = (obj: Record<string, unknown>, path: string) => {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
};

const setNested = (obj: Record<string, unknown>, path: string, value: unknown) => {
  const keys = path.split('.');
  const next = { ...obj } as Record<string, unknown>;
  let cursor: Record<string, unknown> = next;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
      return;
    }
    const existing = cursor[key];
    cursor[key] = typeof existing === 'object' && existing !== null ? { ...(existing as Record<string, unknown>) } : {};
    cursor = cursor[key] as Record<string, unknown>;
  });
  return next;
};

function buildInitial(fields: FieldSchema[], initialValues?: Record<string, unknown>) {
  let base: Record<string, unknown> = {};
  for (const field of fields) {
    const nestedValue = initialValues ? getNested(initialValues, field.name) : undefined;
    if (initialValues && nestedValue !== undefined) {
      base = setNested(base, field.name, nestedValue) as Record<string, unknown>;
      continue;
    }

    switch (field.type) {
      case 'checkbox':
        base = setNested(base, field.name, false) as Record<string, unknown>;
        break;
      case 'number':
        base = setNested(base, field.name, 0) as Record<string, unknown>;
        break;
      case 'list':
        base = setNested(base, field.name, []) as Record<string, unknown>;
        break;
      default:
        if (field.name === 'status') {
          base = setNested(base, field.name, 'draft') as Record<string, unknown>;
        } else if (field.name === 'orderIndex') {
          base = setNested(base, field.name, 0) as Record<string, unknown>;
        } else {
          base = setNested(base, field.name, '') as Record<string, unknown>;
        }
        break;
    }
  }

  return base;
}

const isEmptyValue = (value: unknown) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
};

const validateValues = (fields: FieldSchema[], values: Record<string, unknown>) => {
  const errors: Record<string, string> = {};

  fields.forEach((field) => {
    const value = getNested(values, field.name);

    if (field.type === 'socialLinks') {
      const links = Array.isArray(value) ? (value as SocialLinkItem[]) : [];
      const emptyLink = links.find((link) => !String(link.url ?? '').trim());
      if (emptyLink) {
        errors[field.name] = 'Social link URL is required.';
        return;
      }
      const invalidLink = links.find((link) =>
        !z.string().url().safeParse(String(link.url ?? '')).success
      );
      if (invalidLink) {
        errors[field.name] = 'Enter valid URLs for social links.';
        return;
      }
    }

    if (field.required && isEmptyValue(value)) {
      errors[field.name] = 'Required';
      return;
    }

    const isUrlField =
      field.type === 'url' || (field.name.toLowerCase().includes('url') && field.type !== 'socialLinks');
    if (!isEmptyValue(value) && isUrlField) {
      if (Array.isArray(value)) {
        const invalid = value.some((item) => !z.string().url().safeParse(String(item)).success);
        if (invalid) {
          errors[field.name] = 'Invalid URL';
        }
      } else if (!z.string().url().safeParse(String(value)).success) {
        errors[field.name] = 'Invalid URL';
      }
    }
  });

  return errors;
};

type SocialLinkItem = {
  url: string;
  platform?: string;
  iconKey?: string;
};

export function EntityForm({ fields, initialValues, onSubmit, onCancel, submitLabel }: EntityFormProps) {
  const initial = useMemo(() => buildInitial(fields, initialValues), [fields, initialValues]);
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [urlInputMode, setUrlInputMode] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const hasSocialLinksField = useMemo(() => fields.some((field) => field.type === 'socialLinks'), [fields]);

  const mediaFields = useMemo(
    () => fields.filter((field) => field.type === 'image'),
    [fields]
  );

  // Get storage service for file uploads
  // TODO [SUPABASE STORAGE]: This will automatically use Supabase when configured
  const storageService = useMemo(() => getStorageService(), []);

  useEffect(() => {
    setValues(initial);
  }, [initial]);

  const handleChange = (name: string, value: unknown) => {
    setValues((prev) => setNested(prev, name, value));
  };

  // Handle file drop for image/file fields
  // TODO [SUPABASE STORAGE]: When Supabase is configured, this will upload to storage
  const handleFileDrop = useCallback(async (fieldName: string, file: File, field: FieldSchema) => {
    // Validate file type if specified
    if (field.acceptedTypes) {
      const acceptedList = field.acceptedTypes.split(',').map(t => t.trim());
      const fileType = file.type;
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
      
      const isAccepted = acceptedList.some(accepted => {
        if (accepted.endsWith('/*')) {
          return fileType.startsWith(accepted.replace('/*', '/'));
        }
        if (accepted.startsWith('.')) {
          return fileExt === accepted.toLowerCase();
        }
        return fileType === accepted;
      });
      
      if (!isAccepted) {
        setErrors(prev => ({ ...prev, [fieldName]: `File type not accepted. Allowed: ${field.acceptedTypes}` }));
        return;
      }
    }
    
    // Validate file size
    const maxSize = (field.maxSizeMB ?? 10) * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, [fieldName]: `File too large. Max: ${field.maxSizeMB ?? 10}MB` }));
      return;
    }
    
    // Clear any previous errors
    setErrors(prev => {
      const { [fieldName]: _, ...rest } = prev;
      return rest;
    });
    
    // Determine bucket based on field schema or name
    const bucket = field.storageBucket ?? getBucketForField(fieldName);
    
    try {
      // Use storage service to handle the upload
      // In mock mode: converts to base64 data URL
      // In Supabase mode: uploads to storage and returns public URL
      const fileInfo = await storageService.uploadFile(file, { bucket });
      handleChange(fieldName, fileInfo.url);
    } catch (err) {
      console.error('Upload error:', err);
      setErrors(prev => ({ ...prev, [fieldName]: 'Failed to process file' }));
    }
  }, [storageService]);

  const handleDragOver = (e: React.DragEvent, fieldName: string) => {
    e.preventDefault();
    setDragOver(fieldName);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, fieldName: string, field: FieldSchema) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) handleFileDrop(fieldName, file, field);
  };

  // Toggle between URL input and file upload modes
  const toggleUrlMode = (fieldName: string) => {
    setUrlInputMode(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  return (
    <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();
        const nextErrors = validateValues(fields, values);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;
        
        setIsSaving(true);
        setSaveSuccess(false);
        try {
          await Promise.resolve(onSubmit(values));
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
          console.error('Save error:', err);
        } finally {
          setIsSaving(false);
        }
      }}
    >
      <div className={mediaFields.length > 0 ? 'grid gap-6 lg:grid-cols-[2fr_1fr]' : ''}>
        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => {
            const isWideField =
              field.type === 'socialLinks' || field.type === 'textarea' || field.name === 'pageIntroText';
            return (
              <div key={field.name} className={`space-y-2 ${isWideField ? 'md:col-span-2' : ''}`}>
              <label className="block text-sm font-medium text-[#C9D1D9]">
                <span className="flex items-center gap-1">
                  {field.label}
                  {field.required && <span className="text-[#C77DFF]">*</span>}
                </span>
                {field.type === 'image' ? (
                  <div className="mt-2 space-y-2">
                    {/* Toggle between upload and URL input */}
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toggleUrlMode(field.name)}
                        className="text-xs text-white/40 hover:text-[#C77DFF] transition-colors flex items-center gap-1"
                      >
                        {urlInputMode[field.name] ? (
                          <>
                            <Upload className="w-3 h-3" />
                            Switch to upload
                          </>
                        ) : (
                          <>
                            <LinkIcon className="w-3 h-3" />
                            Use URL instead
                          </>
                        )}
                      </button>
                    </div>
                    
                    {urlInputMode[field.name] ? (
                      /* URL Input Mode */
                      <input
                        className="w-full rounded-xl border border-white/10 bg-[#0B1320]/50 px-4 py-3 text-sm text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/20 focus:border-[#C77DFF] transition-all placeholder:text-white/30"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={String(getNested(values, field.name) ?? '')}
                        onChange={(event) => handleChange(field.name, event.target.value)}
                      />
                    ) : (
                      /* File Upload Mode */
                      <div
                        className={`relative rounded-xl border-2 border-dashed transition-all ${
                          dragOver === field.name 
                            ? 'border-[#C77DFF] bg-[#C77DFF]/10' 
                            : 'border-white/20 hover:border-[#C77DFF]/50'
                        }`}
                        onDragOver={(e) => handleDragOver(e, field.name)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, field.name, field)}
                      >
                        <input
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          type="file"
                          accept={field.acceptedTypes ?? 'image/*'}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) handleFileDrop(field.name, file, field);
                          }}
                        />
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          {getNested(values, field.name) ? (
                            <div className="relative group">
                              <img 
                                src={String(getNested(values, field.name))} 
                                alt="Preview" 
                                className="h-20 w-20 rounded-xl object-cover border border-white/10"
                              />
                              <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-xs text-white">Change</span>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C77DFF]/20 mb-3">
                                <Upload className="w-5 h-5 text-[#C77DFF]" />
                              </div>
                              <p className="text-sm text-[#C9D1D9]">
                                <span className="text-[#C77DFF] font-medium">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-white/40 mt-1">
                                {field.acceptedTypes ?? 'PNG, JPG, GIF'} up to {field.maxSizeMB ?? 5}MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : field.type === 'file' ? (
                  /* File Upload Field (non-image files like PDFs) */
                  <div className="mt-2 space-y-2">
                    {/* Toggle between upload and URL input */}
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toggleUrlMode(field.name)}
                        className="text-xs text-white/40 hover:text-[#C77DFF] transition-colors flex items-center gap-1"
                      >
                        {urlInputMode[field.name] ? (
                          <>
                            <Upload className="w-3 h-3" />
                            Switch to upload
                          </>
                        ) : (
                          <>
                            <LinkIcon className="w-3 h-3" />
                            Use URL instead
                          </>
                        )}
                      </button>
                    </div>
                    
                    {urlInputMode[field.name] ? (
                      /* URL Input Mode */
                      <input
                        className="w-full rounded-xl border border-white/10 bg-[#0B1320]/50 px-4 py-3 text-sm text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/20 focus:border-[#C77DFF] transition-all placeholder:text-white/30"
                        type="url"
                        placeholder="https://example.com/file.pdf"
                        value={String(getNested(values, field.name) ?? '')}
                        onChange={(event) => handleChange(field.name, event.target.value)}
                      />
                    ) : (
                      /* File Upload Mode */
                      <div
                        className={`relative rounded-xl border-2 border-dashed transition-all ${
                          dragOver === field.name 
                            ? 'border-[#C77DFF] bg-[#C77DFF]/10' 
                            : 'border-white/20 hover:border-[#C77DFF]/50'
                        }`}
                        onDragOver={(e) => handleDragOver(e, field.name)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, field.name, field)}
                      >
                        <input
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          type="file"
                          accept={field.acceptedTypes ?? '*'}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) handleFileDrop(field.name, file, field);
                          }}
                        />
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          {getNested(values, field.name) ? (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B1320]/60 border border-white/10">
                              <FileText className="w-8 h-8 text-[#C77DFF]" />
                              <div className="text-left">
                                <p className="text-sm text-[#C9D1D9] font-medium truncate max-w-[200px]">
                                  {isDataUrl(getNested(values, field.name)) 
                                    ? 'File uploaded' 
                                    : String(getNested(values, field.name)).split('/').pop() ?? 'File'
                                  }
                                </p>
                                <p className="text-xs text-white/40">Click to replace</p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C77DFF]/20 mb-3">
                                <FileText className="w-5 h-5 text-[#C77DFF]" />
                              </div>
                              <p className="text-sm text-[#C9D1D9]">
                                <span className="text-[#C77DFF] font-medium">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-white/40 mt-1">
                                {field.acceptedTypes ?? 'Any file'} up to {field.maxSizeMB ?? 10}MB
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : field.type === 'select' ? (
                  <div className="relative mt-2">
                    <select
                      className="w-full appearance-none rounded-xl border border-white/10 bg-[#0B1320]/50 px-4 py-3 pr-10 text-sm text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/20 focus:border-[#C77DFF] transition-all cursor-pointer"
                      value={String(getNested(values, field.name) ?? '')}
                      onChange={(event) => handleChange(field.name, event.target.value)}
                    >
                      <option value="" className="bg-[#0B1320]">Select {field.label}...</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option} className="bg-[#0B1320]">
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  </div>
                ) : field.type === 'textarea' ? (
                  <textarea
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0B1320]/50 px-4 py-3 text-sm text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/20 focus:border-[#C77DFF] transition-all min-h-[120px] resize-y placeholder:text-white/30"
                    placeholder={field.placeholder}
                    value={String(getNested(values, field.name) ?? '')}
                    onChange={(event) => handleChange(field.name, event.target.value)}
                  />
                ) : field.type === 'checkbox' ? (
                  <div className="mt-2 flex items-center">
                    <input
                      className="h-5 w-5 rounded border-white/10 text-[#C77DFF] focus:ring-[#C77DFF] transition-colors"
                      type="checkbox"
                      checked={Boolean(getNested(values, field.name))}
                      onChange={(event) => handleChange(field.name, event.target.checked)}
                    />
                    <span className="ml-2 text-[#C9D1D9]">Enable</span>
                  </div>
                ) : field.type === 'list' ? (
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0B1320]/50 px-4 py-3 text-sm text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/20 focus:border-[#C77DFF] transition-all"
                    type="text"
                    placeholder="Comma-separated values"
                    value={
                      Array.isArray(getNested(values, field.name))
                        ? ((getNested(values, field.name) as unknown[]) ?? []).join(', ')
                        : ''
                    }
                    onChange={(event) =>
                      handleChange(
                        field.name,
                        event.target.value
                          .split(',')
                          .map((item) => item.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                ) : field.type === 'socialLinks' ? (
                  <div className="mt-2 space-y-3">
                    {(() => {
                      const currentLinks = Array.isArray(getNested(values, field.name))
                        ? (getNested(values, field.name) as SocialLinkItem[])
                        : [];
                      const hasAnyLinks = currentLinks.length > 0;
                      const hasEmptyLink = currentLinks.some((item) => !String(item.url ?? '').trim());
                      const hasInvalidLink = currentLinks.some((item) => {
                        const url = String(item.url ?? '').trim();
                        if (!url) return false;
                        return !z.string().url().safeParse(url).success;
                      });

                      return (
                        <>
                          {currentLinks.map((link, index) => {
                      const detected = detectSocialPlatform(String(link.url ?? ''));
                      const platformKey = (link.platform ?? detected.platform) as keyof typeof iconMap;
                      const iconKey = (link.iconKey ?? detected.iconKey) as keyof typeof iconMap;
                      const Icon = iconMap[iconKey] ?? iconMap.custom;
                      const label = formatPlatformLabel(String(platformKey), detected.label);
                      return (
                        <div key={`${field.name}-${index}`} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#0B1320]/60 p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C77DFF]/20">
                              <Icon className="h-4 w-4 text-[#C77DFF]" />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">{label}</span>
                          </div>
                          <div className="flex flex-col gap-2 md:flex-row md:items-center">
                            <input
                              className="flex-1 rounded-xl border border-white/10 bg-[#0B1320]/50 px-4 py-2.5 text-sm text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/20 focus:border-[#C77DFF] transition-all"
                              placeholder="https://"
                              value={String(link.url ?? '')}
                              onChange={(event) => {
                                const url = event.target.value;
                                const nextDetected = detectSocialPlatform(url);
                                const current = Array.isArray(getNested(values, field.name))
                                  ? ([...(getNested(values, field.name) as SocialLinkItem[])] as SocialLinkItem[])
                                  : [];
                                current[index] = {
                                  url,
                                  platform: nextDetected.platform,
                                  iconKey: nextDetected.iconKey,
                                };
                                handleChange(field.name, current);
                              }}
                            />
                            <button
                              type="button"
                              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                              onClick={() => {
                                const current = Array.isArray(getNested(values, field.name))
                                  ? ([...(getNested(values, field.name) as SocialLinkItem[])] as SocialLinkItem[])
                                  : [];
                                current.splice(index, 1);
                                handleChange(field.name, current);
                              }}
                            >
                              <X className="w-3.5 h-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                          })}
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0B1320]/50 px-4 py-2.5 text-sm font-medium text-[#C9D1D9] hover:bg-white/5 transition-colors"
                              onClick={() => {
                                const current = Array.isArray(getNested(values, field.name))
                                  ? ([...(getNested(values, field.name) as SocialLinkItem[])] as SocialLinkItem[])
                                  : [];
                                current.push({ url: '', platform: 'custom', iconKey: 'custom' });
                                handleChange(field.name, current);
                              }}
                            >
                              <Plus className="w-4 h-4" />
                              Add social link
                            </button>
                            {hasAnyLinks && (
                              <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#C77DFF]/20 hover:shadow-lg hover:shadow-[#C77DFF]/30 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                                disabled={hasEmptyLink || hasInvalidLink}
                              >
                                <Save className="w-4 h-4" />
                                {submitLabel ?? 'Save'}
                              </button>
                            )}
                            {hasAnyLinks && onCancel && (
                              <button
                                type="button"
                                onClick={onCancel}
                                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-[#C9D1D9] hover:bg-white/5 transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <input
                    className={`mt-2 w-full rounded-xl border border-white/10 bg-[#0B1320]/50 px-4 py-3 text-sm text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/20 focus:border-[#C77DFF] transition-all placeholder:text-white/30 ${
                      field.type === 'date' ? '[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:scale-125' : ''
                    }`}
                    type={field.type ?? 'text'}
                    placeholder={field.placeholder}
                    value={String(getNested(values, field.name) ?? '')}
                    onChange={(event) => handleChange(field.name, event.target.value)}
                  />
                )}
              </label>
              {errors[field.name] && (
                <div className="flex items-center gap-1.5 text-xs text-red-600">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors[field.name]}
                </div>
              )}
              </div>
            );
          })}
        </div>

        {mediaFields.length > 0 && (
          <aside className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0B1320]/60 to-[#C77DFF]/10 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-4 h-4 text-[#C77DFF]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Media Preview</span>
            </div>
            <div className="space-y-4">
              {mediaFields.map((field) => {
                const value = getNested(values, field.name);
                return (
                  <div key={field.name} className="space-y-2">
                    <div className="text-xs text-white/60">{field.label}</div>
                    {value ? (
                      <div className="relative group">
                        <img
                          src={String(value)}
                          alt="Preview"
                          className="w-full aspect-square rounded-xl border border-white/10 object-cover shadow-lg transition-transform group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                          <span className="text-xs text-white font-medium">Click upload area to change</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full aspect-square rounded-xl border border-dashed border-white/20 bg-[#0B1320]/40 flex flex-col items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white/20 mb-2" />
                        <span className="text-xs text-white/30">No image uploaded</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>
      {!hasSocialLinksField && (
        <div className="flex items-center gap-3 pt-2">
          <button 
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#C77DFF]/20 hover:shadow-lg hover:shadow-[#C77DFF]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {submitLabel ?? 'Save'}
              </>
            )}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-[#C9D1D9] hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          )}
          {saveSuccess && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-400 animate-fade-in">
              <Check className="w-4 h-4" />
              Changes saved successfully!
            </span>
          )}
        </div>
      )}
    </form>
  );
}
