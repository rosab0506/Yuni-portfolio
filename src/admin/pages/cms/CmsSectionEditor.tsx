import { useMemo, useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { EntityForm } from '../../components/EntityForm';
import { sectionSchemas, getStorageFields } from '../../cms/cmsSchemas';
import { useCms } from '../../../hooks/useCms';
import { getToolLogoUrl, DEFAULT_LOGO } from '../../../utils/getToolLogoUrl';
import { deleteFile, extractFilePathFromUrl } from '../../../services/supabaseCms';
import type { CollectionItem, CollectionKey, SingletonKey } from '../../../context/CmsContext';

export function CmsSectionEditor({ sectionKey }: { sectionKey: string }) {
  const { data, updateSingleton, createItem, updateItem, deleteItem, replaceCollection } = useCms();
  // ... (rest of file)

  // ... INSIDE onSubmit ...
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTool, setEditingTool] = useState<{ categoryId: string; toolId: string } | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragTool, setDragTool] = useState<{ categoryId: string; toolId: string } | null>(null);

  const schema = sectionSchemas[sectionKey];

  const tableColumns = useMemo(() => {
    if (!schema) return [];

    let fields = schema.fields;

    // Filter columns for complex schemas to prevent horizontal blowout (Desktop View)
    if (schema.key === 'certifications') {
      fields = schema.fields.filter(f => ['certificateTitle', 'issuer', 'issueDate', 'status'].includes(f.name));
    } else if (schema.key === 'education') {
      fields = schema.fields.filter(f => ['institution', 'degree', 'startDate', 'endDate', 'status'].includes(f.name));
    } else if (schema.key === 'experience') {
      fields = schema.fields.filter(f => ['company', 'role', 'startDate', 'endDate', 'status'].includes(f.name));
    } else if (schema.key === 'projects') {
      fields = schema.fields.filter(f => ['title', 'slug', 'status', 'featured'].includes(f.name));
    } else if (schema.key === 'clients') {
      fields = schema.fields.filter(f => ['name', 'industry', 'status', 'featured'].includes(f.name));
    } else if (schema.key === 'blogs') {
      fields = schema.fields.filter(f => ['title', 'slug', 'status', 'publishedDate'].includes(f.name));
    }

    return fields.map((field) => ({ key: field.name, header: field.label }));
  }, [schema]);

  const reorderItems = <T extends { id: string }>(items: T[], fromId: string, toId: string) => {
    const fromIndex = items.findIndex((item) => item.id === fromId);
    const toIndex = items.findIndex((item) => item.id === toId);
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return items;
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
  };

  const moveItem = <T extends { id: string }>(items: T[], id: string, direction: 'up' | 'down') => {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return items;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return items;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    return next;
  };

  const applyOrderIndex = <T extends { id: string }>(items: T[]) =>
    items.map((item, index) => ({ ...item, orderIndex: index + 1 }));

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const withAutoSlug = (values: Record<string, unknown>) => {
    const hasSlugField = schema?.fields.some((field) => field.name === 'slug');
    if (!hasSlugField) return values;
    const slug = String(values.slug ?? '').trim();
    if (slug) return values;
    const title = String(values.title ?? '').trim();
    if (!title) return values;
    return { ...values, slug: slugify(title) };
  };

  if (!schema) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0B1320]/80 p-8">
        <h1 className="text-lg font-semibold text-white">Unknown section</h1>
        <p className="mt-2 text-sm text-white/60">Section not found.</p>
      </div>
    );
  }

  if (schema.kind === 'singleton') {
    const values = data.singletons[schema.key as SingletonKey] ?? {};
    if (schema.key === 'contact') {
      const contactInfoFields = schema.fields.filter((field) =>
        ['pageIntroText', 'contactInfo.email', 'contactInfo.phone', 'contactInfo.location'].includes(field.name)
      );
      const socialLinksFields = schema.fields.filter((field) => field.type === 'socialLinks');
      const hireMeFields = schema.fields.filter((field) => field.name === 'hireMeLabel');

      return (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white">{schema.title}</h1>
            <p className="mt-1 text-white/60">Manage {schema.title.toLowerCase()} content.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0B1320]/80 p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#C77DFF]">Contact Details</h2>
            <div className="mt-5">
              <EntityForm
                fields={contactInfoFields}
                initialValues={values}
                submitLabel="Save Contact Info"
                onSubmit={(nextValues) => updateSingleton(schema.key as SingletonKey, nextValues)}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0B1320]/80 p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#C77DFF]">Social Links</h2>
            <div className="mt-5">
              <EntityForm
                fields={socialLinksFields}
                initialValues={values}
                submitLabel="Save Social Links"
                onSubmit={(nextValues) => updateSingleton(schema.key as SingletonKey, nextValues)}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0B1320]/80 p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#C77DFF]">Hire Me CTA</h2>
            <div className="mt-5">
              <EntityForm
                fields={hireMeFields}
                initialValues={values}
                submitLabel="Save Hire Me Label"
                onSubmit={(nextValues) => updateSingleton(schema.key as SingletonKey, nextValues)}
              />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">{schema.title}</h1>
          <p className="mt-1 text-white/60">Manage {schema.title.toLowerCase()} content.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0B1320]/80 p-6 shadow-sm hover:shadow-md transition-shadow">
          <EntityForm
            fields={schema.fields}
            initialValues={values}
            onSubmit={(nextValues) => updateSingleton(schema.key as SingletonKey, nextValues)}
          />
        </div>
      </div>
    );
  }

  const collectionKey = schema.key as CollectionKey;
  const rows = data.collections[collectionKey] as CollectionItem[];
  const editingItem = rows.find((row) => row.id === editingId);

  const isTechStack = schema.key === 'techStackCategories';
  const isAchievements = schema.key === 'achievements';
  const reorderCollections = new Set(['projects', 'blogs']);
  const isReorderList = isAchievements || reorderCollections.has(schema.key);

  const toolFormFields = [
    { name: 'name', label: 'Tool Name', required: true },
    {
      name: 'logoUrl',
      label: 'Logo URL (optional — leave empty for auto logo, or paste a custom logo URL)',
    },
    { name: 'proficiencyLevel', label: 'Proficiency (0-100)', type: 'number' },
  ] as const;

  // Define mobile renderer for complex tables
  const mobileRenderer = useMemo(() => {
    // Reusable Mobile Card Component
    const MobileCard = ({ title, subtitle, status, meta, row, onEdit, onDelete }: any) => (
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-white text-base truncate">{title}</h3>
            {subtitle && <p className="text-sm text-[#C77DFF] truncate">{subtitle}</p>}
          </div>
          {status && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shrink-0 ${status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-white/10 text-white/50'}`}>
              {status}
            </span>
          )}
        </div>

        {meta && (
          <div className="text-xs text-white/40 grid grid-cols-2 gap-2 border-t border-white/5 pt-2 mt-1">
            {meta}
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t border-white/10 mt-1">
          {onEdit && (
            <button
              onClick={() => onEdit(row)}
              className="flex-1 inline-flex justify-center items-center gap-1.5 rounded-lg bg-[#C77DFF]/10 border border-[#C77DFF]/30 px-3 py-2 text-xs font-medium text-[#C77DFF] hover:bg-[#C77DFF]/20 transition-colors"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(row)}
              className="flex-1 inline-flex justify-center items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Delete
            </button>
          )}
        </div>
      </div>
    );

    if (schema.key === 'certifications') {
      return (row: any, onEdit: any, onDelete: any) => (
        <MobileCard
          title={row.certificateTitle}
          subtitle={row.issuer}
          status={row.status}
          row={row} onEdit={onEdit} onDelete={onDelete}
          meta={
            <>
              <div>
                <span className="block uppercase tracking-wider text-[10px] mb-0.5 text-white/20">Issued</span>
                <span className="text-white/60">{row.issueDate}</span>
              </div>
              {row.expiryDate && (
                <div>
                  <span className="block uppercase tracking-wider text-[10px] mb-0.5 text-white/20">Expires</span>
                  <span className="text-white/60">{row.expiryDate}</span>
                </div>
              )}
            </>
          }
        />
      );
    }

    if (schema.key === 'education') {
      return (row: any, onEdit: any, onDelete: any) => (
        <MobileCard
          title={row.institution}
          subtitle={row.degree}
          status={row.status}
          row={row} onEdit={onEdit} onDelete={onDelete}
          meta={
            <>
              <div className="col-span-2">
                <span className="block uppercase tracking-wider text-[10px] mb-0.5 text-white/20">Period</span>
                <span className="text-white/60">{row.startDate} — {row.endDate || 'Present'}</span>
              </div>
              <div className="col-span-2">
                <span className="block uppercase tracking-wider text-[10px] mb-0.5 text-white/20">Field</span>
                <span className="text-white/60">{row.field}</span>
              </div>
            </>
          }
        />
      );
    }

    if (schema.key === 'experience') {
      return (row: any, onEdit: any, onDelete: any) => (
        <MobileCard
          title={row.company}
          subtitle={row.role}
          status={row.status}
          row={row} onEdit={onEdit} onDelete={onDelete}
          meta={
            <div className="col-span-2">
              <span className="block uppercase tracking-wider text-[10px] mb-0.5 text-white/20">Period</span>
              <span className="text-white/60">{row.startDate} — {row.endDate || 'Present'}</span>
            </div>
          }
        />
      );
    }

    if (schema.key === 'projects' || schema.key === 'blogs') {
      return (row: any, onEdit: any, onDelete: any) => (
        <MobileCard
          title={row.title}
          subtitle={row.slug}
          status={row.status}
          row={row} onEdit={onEdit} onDelete={onDelete}
        />
      );
    }

    if (schema.key === 'clients') {
      return (row: any, onEdit: any, onDelete: any) => (
        <MobileCard
          title={row.name}
          subtitle={row.industry}
          status={row.status}
          row={row} onEdit={onEdit} onDelete={onDelete}
          meta={row.featured && <span className="text-[10px] uppercase font-bold text-amber-400">Featured Client</span>}
        />
      );
    }

    return undefined;
  }, [schema.key]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">{schema.title}</h1>
        <p className="mt-1 text-white/60">Manage {schema.title.toLowerCase()} entries.</p>
      </div>

      {!isTechStack && (
        <div className="rounded-2xl border border-white/10 bg-[#0B1320]/80 p-6 shadow-sm hover:shadow-md transition-shadow">
          <EntityForm
            fields={schema.fields}
            initialValues={editingItem}
            submitLabel={editingId ? 'Update' : 'Create'}
            onSubmit={(values) => {
              const nextValues = withAutoSlug(values);
              if (editingId) {
                updateItem(collectionKey, editingId, nextValues);
                setEditingId(null);
                return;
              }
              createItem(collectionKey, nextValues);
            }}
            onCancel={editingId ? () => setEditingId(null) : undefined}
          />
        </div>
      )}

      {!isTechStack && !isReorderList && (
        <div className="rounded-2xl border border-white/10 bg-[#0B1320]/80 p-6 shadow-sm">
          <DataTable
            columns={tableColumns}
            rows={rows}
            rowKey={(row) => row.id}
            renderMobileItem={mobileRenderer}
            onEdit={(row) => setEditingId(row.id)}
            onDelete={async (row) => {
              const itemTitle = (row as any).title || (row as any).name || (row as any).certificateTitle || 'this item';
              if (!confirm(`Are you sure you want to delete "${itemTitle}"? This will permanently remove it from the database.`)) {
                return;
              }

              try {
                // Get storage fields from schema
                const storageFields = getStorageFields(schema);

                // Map lowercase bucket names to uppercase for supabaseCms functions
                const bucketMap: Record<string, 'IMAGES' | 'RESUMES' | 'DOCUMENTS' | 'GALLERY'> = {
                  'images': 'IMAGES',
                  'resumes': 'RESUMES',
                  'documents': 'DOCUMENTS',
                  'gallery': 'GALLERY',
                };

                // Delete files from storage if they exist
                for (const field of storageFields) {
                  const fileUrl = (row as any)[field.name];
                  if (fileUrl && typeof fileUrl === 'string' && field.storageBucket) {
                    try {
                      const bucket = bucketMap[field.storageBucket] || 'IMAGES';
                      const filePath = extractFilePathFromUrl(fileUrl, bucket);
                      if (filePath) {
                        console.log(`Deleting ${field.label} from storage:`, filePath);
                        await deleteFile(bucket, filePath);
                      }
                    } catch (fileError) {
                      console.error(`Failed to delete ${field.label}:`, fileError);
                      // Continue with other files and database deletion
                    }
                  }
                }

                // Delete database record
                await deleteItem(collectionKey, row.id);
                alert('✓ Item deleted successfully!');
              } catch (error) {
                console.error('Failed to delete item:', error);
                alert('Failed to delete item. Please try again.');
              }
            }}
          />
        </div>
      )}

      {isReorderList && !isTechStack && (
        <div className="rounded-2xl border border-white/10 bg-[#0B1320]/80 p-6 shadow-sm">
          <ul role="list" className="space-y-3">
            {rows.map((item, index) => (
              <li
                key={item.id}
                role="listitem"
                className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0B1320]/60 px-5 py-4 hover:bg-white/5 transition-colors"
                draggable
                onDragStart={(event) => {
                  setDragId(item.id);
                  event.dataTransfer.setData('text/plain', item.id);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const fromId = dragId ?? event.dataTransfer.getData('text/plain');
                  if (!fromId || fromId === item.id) return;
                  const reordered = applyOrderIndex(reorderItems(rows, fromId, item.id));
                  replaceCollection(collectionKey, reordered as CollectionItem[]);
                  setDragId(null);
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C77DFF]/20 text-sm font-semibold text-[#C77DFF]">
                    {index + 1}
                  </span>
                  <button
                    type="button"
                    className="cursor-grab text-white/60 hover:text-[#C9D1D9] transition-colors"
                    aria-label={`Reorder ${schema.title} item`}
                    aria-grabbed={dragId === item.id}
                    draggable
                    onDragStart={(event) => {
                      event.stopPropagation();
                      setDragId(item.id);
                      event.dataTransfer.setData('text/plain', item.id);
                    }}
                  >
                    ⠿
                  </button>
                  <strong className="text-sm font-medium text-white">{String(item.title ?? item.slug ?? item.id)}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-[#C9D1D9] hover:bg-white/10 transition-colors"
                    aria-label="Move item up"
                    onClick={() =>
                      replaceCollection(collectionKey, applyOrderIndex(moveItem(rows, item.id, 'up')) as CollectionItem[])
                    }
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-[#C9D1D9] hover:bg-white/10 transition-colors"
                    aria-label="Move item down"
                    onClick={() =>
                      replaceCollection(collectionKey, applyOrderIndex(moveItem(rows, item.id, 'down')) as CollectionItem[])
                    }
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-[#C77DFF]/30 bg-[#C77DFF]/10 px-3 py-1.5 text-xs font-medium text-[#C77DFF] hover:bg-[#C77DFF]/20 transition-colors"
                    onClick={() => setEditingId(item.id)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                    onClick={() => deleteItem(collectionKey, item.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isTechStack && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#0B1320]/80 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Create Category</h2>
              <button
                onClick={async () => {
                  if (!confirm('This will scan all tools and auto-correct their logos. Continue?')) return;

                  let updateCount = 0;

                  for (const category of rows) {
                    const cat = category as { id: string; tools?: any[] };
                    const tools = cat.tools || [];
                    let hasChanges = false;

                    const updatedTools = tools.map((tool: any) => {
                      const currentLogo = tool.logoUrl || '';
                      const autoLogo = getToolLogoUrl(tool.name);

                      const isDefaultOrEmpty = !currentLogo ||
                        currentLogo === DEFAULT_LOGO ||
                        currentLogo.includes('data:image');

                      // Fix weak matches (broken simpleicons urls) and force overrides
                      const isWeakLogo = currentLogo.includes('simpleicons.org') && currentLogo !== autoLogo;

                      if ((isDefaultOrEmpty || isWeakLogo) && autoLogo !== DEFAULT_LOGO) {
                        hasChanges = true;
                        return { ...tool, logoUrl: autoLogo };
                      }
                      return tool;
                    });

                    if (hasChanges) {
                      await updateItem(collectionKey, cat.id, { ...category, tools: updatedTools });
                      updateCount++;
                    }
                  }

                  alert(`Fixed logos in ${updateCount} categories!`);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                title="Auto-detect and fix logos for all tools"
              >
                <span>✨ Auto-Correct Logos</span>
              </button>
            </div>
            <div className="mt-4">
              <EntityForm
                fields={schema.fields}
                submitLabel="Create Category"
                onSubmit={(values) => createItem(collectionKey, values)}
              />
            </div>
          </div>

          <ul role="list" className="space-y-4">
            {rows.map((category) => {
              const toolRows = (category.tools ?? []) as Array<{
                id: string;
                name: string;
                logoUrl: string;
                proficiencyLevel: number;
              }>;
              const editingToolId = editingTool?.categoryId === category.id ? editingTool.toolId : null;
              const editingToolRow = editingToolId ? toolRows.find((tool) => tool.id === editingToolId) : undefined;

              return (
                <li key={category.id} role="listitem" className="rounded-2xl border border-white/10 bg-[#0B1320]/80 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <details
                    open
                    draggable
                    onDragStart={(event) => {
                      setDragId(category.id);
                      event.dataTransfer.setData('text/plain', category.id);
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      const fromId = dragId ?? event.dataTransfer.getData('text/plain');
                      if (!fromId || fromId === category.id) return;
                      const reordered = applyOrderIndex(reorderItems(rows, fromId, category.id));
                      replaceCollection(collectionKey, reordered as CollectionItem[]);
                      setDragId(null);
                    }}
                  >
                    <summary className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="cursor-grab text-white/60 hover:text-[#C9D1D9] transition-colors"
                          aria-label={`Reorder category ${category.categoryName}`}
                          aria-grabbed={dragId === category.id}
                          draggable
                          onDragStart={(event) => {
                            event.stopPropagation();
                            setDragId(category.id);
                            event.dataTransfer.setData('text/plain', category.id);
                          }}
                        >
                          ⠿
                        </button>
                        <div>
                          <div className="text-base font-semibold text-white">{String(category.categoryName)}</div>
                          <div className="text-xs text-white/60">{toolRows.length} tools</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-[#C9D1D9] hover:bg-white/10 transition-colors"
                          aria-label="Move category up"
                          onClick={() =>
                            replaceCollection(
                              collectionKey,
                              applyOrderIndex(moveItem(rows, category.id, 'up')) as CollectionItem[]
                            )
                          }
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-[#C9D1D9] hover:bg-white/10 transition-colors"
                          aria-label="Move category down"
                          onClick={() =>
                            replaceCollection(
                              collectionKey,
                              applyOrderIndex(moveItem(rows, category.id, 'down')) as CollectionItem[]
                            )
                          }
                        >
                          ↓
                        </button>
                      </div>
                    </summary>
                    <div className="mt-5 space-y-5">
                      <div className="rounded-xl border border-white/10 bg-[#0B1320]/60 p-5">
                        <EntityForm
                          fields={schema.fields}
                          initialValues={category}
                          submitLabel="Update Category"
                          onSubmit={(values) =>
                            updateItem(collectionKey, category.id, {
                              ...category,
                              ...values,
                            })
                          }
                        />
                        <div className="mt-4">
                          <button
                            type="button"
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                            onClick={() => deleteItem(collectionKey, category.id)}
                          >
                            Delete Category
                          </button>
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-[#0B1320]/50 p-5">
                        <h3 className="text-sm font-semibold text-[#C9D1D9]">Tools</h3>
                        <div className="mt-4">
                          <EntityForm
                            fields={[...toolFormFields]}
                            initialValues={editingToolRow}
                            submitLabel={editingToolId ? 'Update Tool' : 'Add Tool'}
                            onSubmit={(values) => {
                              const currentLogo = String(values.logoUrl ?? '').trim();
                              // Check if it's empty, explicitly the default fallback, OR a generic data URI (which our default is)
                              const isDefaultOrEmpty = !currentLogo ||
                                currentLogo === DEFAULT_LOGO ||
                                currentLogo.includes('data:image') ||
                                currentLogo.includes('%3C%2F%3E'); // Checks for encoded </> just in case

                              // Always try to get a fresh auto logo based on the name
                              const autoLogo = getToolLogoUrl(String(values.name ?? ''));

                              // DETECT "WEAK" LOGOS:
                              // If the current logo is from simpleicons but doesn't match our new best guess,
                              // it might be a broken slug from before (e.g. .../agilesoftwaredev... vs .../jira).
                              // We should offer to replace it.
                              const isWeakLogo = currentLogo.includes('simpleicons.org') && currentLogo !== autoLogo;

                              const shouldUpdate = isDefaultOrEmpty || isWeakLogo;

                              const resolvedLogoUrl = (shouldUpdate && autoLogo !== DEFAULT_LOGO) ? autoLogo : (currentLogo || autoLogo);
                              const nextTools = editingToolId
                                ? toolRows.map((tool) =>
                                  tool.id === editingToolId
                                    ? {
                                      ...tool,
                                      ...values,
                                      logoUrl: resolvedLogoUrl,
                                      proficiencyLevel: Number(values.proficiencyLevel ?? tool.proficiencyLevel ?? 0),
                                    }
                                    : tool
                                )
                                : [
                                  ...toolRows,
                                  {
                                    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                                    name: String(values.name ?? ''),
                                    logoUrl: resolvedLogoUrl,
                                    proficiencyLevel: Number(values.proficiencyLevel ?? 0),
                                  },
                                ];

                              updateItem(collectionKey, category.id, {
                                ...category,
                                tools: nextTools,
                              });
                              setEditingTool(null);
                            }}
                            onCancel={editingToolId ? () => setEditingTool(null) : undefined}
                          />
                        </div>

                        <ul role="list" className="mt-4 space-y-2">
                          {toolRows.map((tool) => (
                            <li
                              key={tool.id}
                              role="listitem"
                              className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0B1320]/60 px-4 py-3 hover:bg-white/5 transition-colors"
                              draggable
                              onDragStart={(event) => {
                                setDragTool({ categoryId: category.id, toolId: tool.id });
                                event.dataTransfer.setData('text/plain', tool.id);
                              }}
                              onDragOver={(event) => event.preventDefault()}
                              onDrop={(event) => {
                                event.preventDefault();
                                const from = dragTool?.categoryId === category.id ? dragTool : null;
                                const fromId = from?.toolId ?? event.dataTransfer.getData('text/plain');
                                if (!fromId || fromId === tool.id) return;
                                const reorderedTools = reorderItems(toolRows, fromId, tool.id);
                                updateItem(collectionKey, category.id, {
                                  ...category,
                                  tools: reorderedTools,
                                });
                                setDragTool(null);
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  className="cursor-grab text-white/60 hover:text-[#C9D1D9] transition-colors"
                                  aria-label={`Reorder tool ${tool.name}`}
                                  aria-grabbed={dragTool?.toolId === tool.id}
                                  draggable
                                  onDragStart={(event) => {
                                    event.stopPropagation();
                                    setDragTool({ categoryId: category.id, toolId: tool.id });
                                    event.dataTransfer.setData('text/plain', tool.id);
                                  }}
                                >
                                  ⠿
                                </button>
                                <strong className="text-sm font-medium text-white">{tool.name}</strong>
                                <span className="rounded-full bg-[#C77DFF]/20 px-2 py-0.5 text-xs font-medium text-[#C77DFF]">{tool.proficiencyLevel}%</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="rounded-lg border border-white/10 px-2 py-1 text-xs text-[#C9D1D9] hover:bg-white/10 transition-colors"
                                  aria-label="Move tool up"
                                  onClick={() =>
                                    updateItem(collectionKey, category.id, {
                                      ...category,
                                      tools: moveItem(toolRows, tool.id, 'up'),
                                    })
                                  }
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  className="rounded-lg border border-white/10 px-2 py-1 text-xs text-[#C9D1D9] hover:bg-white/10 transition-colors"
                                  aria-label="Move tool down"
                                  onClick={() =>
                                    updateItem(collectionKey, category.id, {
                                      ...category,
                                      tools: moveItem(toolRows, tool.id, 'down'),
                                    })
                                  }
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  className="rounded-lg border border-[#C77DFF]/30 bg-[#C77DFF]/10 px-3 py-1 text-xs font-medium text-[#C77DFF] hover:bg-[#C77DFF]/20 transition-colors"
                                  onClick={() => setEditingTool({ categoryId: category.id, toolId: tool.id })}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                                  onClick={() => {
                                    const nextTools = toolRows.filter((item) => item.id !== tool.id);
                                    updateItem(collectionKey, category.id, {
                                      ...category,
                                      tools: nextTools,
                                    });
                                    if (editingTool?.categoryId === category.id && editingTool.toolId === tool.id) {
                                      setEditingTool(null);
                                    }
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
