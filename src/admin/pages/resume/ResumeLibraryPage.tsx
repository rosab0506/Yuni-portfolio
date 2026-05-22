import { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { EntityForm } from '../../components/EntityForm';
import { useCms } from '../../../hooks/useCms';
import type { CollectionItem } from '../../../context/CmsContext';
import { uploadFile, deleteFile } from '../../../services/supabaseCms';

type ResumeItem = CollectionItem & {
  title?: string;
  fileUrl?: string;
  uploadedAt?: string;
  status?: 'active' | 'inactive';
};

export function ResumeLibraryPage() {
  const { data, createItem, updateItem, deleteItem, setActiveResume } = useCms();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState('');

  const resumes = (data.collections.resumes ?? []) as ResumeItem[];
  const settings = data.singletons.resumeSettings ?? {};
  const activeResumeId = settings.activeResumeId as string | undefined;
  const editingItem = resumes.find((item) => item.id === editingId);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
  };

  // Upload file to Supabase Storage
  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadError(null);

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const filename = `resume_${timestamp}_${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `resumes/${filename}`;

      // Upload to Supabase Storage
      const publicUrl = await uploadFile('RESUMES', filePath, selectedFile);
      
      setFileUrl(publicUrl);
      setUploadError(null);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const formFields = [
    { name: 'title', label: 'Title', required: true },
    { name: 'uploadedAt', label: 'Uploaded At', type: 'date' },
  ] as const;

  const columns = [
    { 
      key: 'title', 
      header: 'Title',
      render: (row: ResumeItem) => (
        <div className="flex items-center gap-2">
          <span>{row.title}</span>
          {row.status === 'active' && (
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
              Active
            </span>
          )}
        </div>
      ),
    },
    { key: 'uploadedAt', header: 'Uploaded' },
    {
      key: 'status',
      header: 'Status',
      render: (row: ResumeItem) => (
        <span className={row.status === 'active' ? 'text-emerald-400 font-medium' : 'text-white/60'}>
          {row.status === 'active' ? '● Active' : '○ Inactive'}
        </span>
      ),
    },
    {
      key: 'fileUrl',
      header: 'Preview',
      render: (row: ResumeItem) =>
        row.fileUrl ? (
          <a className="text-[#C77DFF] underline" href={row.fileUrl} target="_blank" rel="noreferrer">
            Preview
          </a>
        ) : (
          '—'
        ),
    },
    {
      key: 'download',
      header: 'Download',
      render: (row: ResumeItem) =>
        row.fileUrl ? (
          <a className="text-[#C77DFF] underline" href={row.fileUrl} download target="_blank" rel="noreferrer">
            Download
          </a>
        ) : (
          '—'
        ),
    },
    {
      key: 'actions',
      header: 'Set Active',
      render: (row: ResumeItem) => (
        <button
          type="button"
          onClick={async () => {
            try {
              await setActiveResume(row.id);
              alert('✓ Resume activated successfully!');
            } catch (error) {
              console.error('Failed to activate resume:', error);
              alert('Failed to activate resume. Please try again.');
            }
          }}
          disabled={row.status === 'active'}
          className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
            row.status === 'active'
              ? 'cursor-not-allowed bg-emerald-500/20 text-emerald-400'
              : 'bg-[#C77DFF] text-white hover:bg-[#C77DFF]/90'
          }`}
        >
          {row.status === 'active' ? 'Active' : 'Set Active'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Resume Library</h1>
        <p className="mt-1 text-sm text-[#C9D1D9]">Manage resume files and set the active resume for the public site.</p>
      </div>

      <div className="rounded border border-white/10 bg-[#0B1320]/80 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-white">Add or Edit Resume</h2>
        
        {/* File Upload Section */}
        <div className="mt-4 space-y-4 border-b border-white/10 pb-6">
          <div>
            <label className="block text-sm font-medium text-[#C9D1D9]">
              Upload Resume File <span className="text-red-400">*</span>
            </label>
            <p className="mt-1 text-xs text-white/60">Upload a PDF file (max 10MB)</p>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="block w-full rounded border border-white/10 bg-[#0B1320]/60 px-3 py-2 text-sm text-[#C9D1D9] file:mr-4 file:rounded file:border-0 file:bg-[#C77DFF] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#C77DFF]/90"
              />
              <button
                type="button"
                onClick={handleFileUpload}
                disabled={!selectedFile || uploading}
                className="whitespace-nowrap rounded bg-[#C77DFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#C77DFF]/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {selectedFile && !uploading && (
              <p className="mt-2 text-xs text-emerald-400">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
            {uploadError && (
              <p className="mt-2 text-xs text-red-400">{uploadError}</p>
            )}
            {fileUrl && (
              <p className="mt-2 text-xs text-emerald-400">
                ✓ File uploaded successfully! URL: {fileUrl}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <EntityForm
            fields={[...formFields]}
            initialValues={editingItem}
            submitLabel={editingId ? 'Update Resume' : 'Add Resume'}
            onSubmit={(values) => {
              // Use uploaded file URL or existing URL
              const resumeFileUrl = fileUrl || editingItem?.fileUrl || '';
              
              if (!resumeFileUrl) {
                alert('Please upload a resume file first');
                return;
              }

              const payload = {
                ...values,
                fileUrl: resumeFileUrl,
                status: editingItem?.status ?? 'inactive',
                uploadedAt: String(values.uploadedAt ?? new Date().toISOString().slice(0, 10)),
              };
              if (editingId) {
                updateItem('resumes', editingId, payload);
                setEditingId(null);
                setFileUrl('');
                setSelectedFile(null);
                return;
              }
              createItem('resumes', payload);
              setFileUrl('');
              setSelectedFile(null);
            }}
            onCancel={editingId ? () => {
              setEditingId(null);
              setFileUrl('');
              setSelectedFile(null);
              setUploadError(null);
            } : undefined}
          />
        </div>
      </div>

      <div className="rounded border border-white/10 bg-[#0B1320]/80 p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Resume List</h2>
          <p className="mt-1 text-sm text-white/60">
            Click "Set Active" to make a resume publicly visible on your site
          </p>
        </div>
        <DataTable
          columns={columns}
          rows={resumes}
          rowKey={(row) => row.id}
          onEdit={(row) => setEditingId(row.id)}
          onDelete={async (row) => {
            if (!confirm(`Are you sure you want to delete "${row.title}"? This will permanently remove the file and database record.`)) {
              return;
            }
            try {
              // Delete file from storage if it exists
              if (row.fileUrl) {
                try {
                  // Extract file path from URL
                  const url = new URL(row.fileUrl);
                  const pathMatch = url.pathname.match(/\/resumes\/(.+)$/);
                  if (pathMatch) {
                    const filePath = pathMatch[1];
                    console.log('Deleting file from storage:', filePath);
                    await deleteFile('RESUMES', filePath);
                    console.log('File deleted from storage successfully');
                  }
                } catch (fileError) {
                  console.error('Failed to delete file from storage:', fileError);
                  // Continue with database deletion even if file deletion fails
                }
              }
              
              // Delete database record
              await deleteItem('resumes', row.id);
              alert('✓ Resume deleted successfully!');
            } catch (error) {
              console.error('Failed to delete resume:', error);
              alert('Failed to delete resume. Please try again.');
            }
          }}
        />
      </div>
    </div>
  );
}
