import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Trash2, 
  Copy, 
  Check, 
  FolderOpen,
  Search,
  Grid,
  List,
  X,
  Sparkles,
  Download,
  Eye
} from 'lucide-react';
import { uploadFile, deleteFile as deleteFromStorage, extractFilePathFromUrl } from '../../../services/supabaseCms';
import { supabase } from '../../../lib/supabase';

type MediaFile = {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'other';
  size: number;
  uploadedAt: string;
  previewUrl?: string;
  bucket: 'images' | 'documents' | 'gallery';
  path: string;
};

type StorageBucket = 'images' | 'documents' | 'gallery';

export function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [selectedBucket, setSelectedBucket] = useState<StorageBucket | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files from all Supabase Storage buckets
  useEffect(() => {
    loadMediaFiles();
  }, []);

  const loadMediaFiles = async () => {
    if (!supabase) {
      console.warn('Supabase not configured');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const buckets: StorageBucket[] = ['images', 'documents', 'gallery'];
      const allFiles: MediaFile[] = [];

      for (const bucket of buckets) {
        const { data: files, error } = await supabase.storage.from(bucket).list();
        
        if (error) {
          console.error(`Error listing ${bucket}:`, error);
          continue;
        }

        if (files) {
          for (const file of files) {
            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(file.name);
            
            const mediaFile: MediaFile = {
              id: `${bucket}-${file.name}`,
              name: file.name,
              url: publicUrl,
              type: file.metadata?.mimetype?.startsWith('image/') ? 'image' : 
                    file.metadata?.mimetype?.includes('pdf') ? 'document' : 'other',
              size: file.metadata?.size || 0,
              uploadedAt: file.created_at || new Date().toISOString(),
              previewUrl: file.metadata?.mimetype?.startsWith('image/') ? publicUrl : undefined,
              bucket,
              path: file.name,
            };
            allFiles.push(mediaFile);
          }
        }
      }

      setMedia(allFiles);
    } catch (error) {
      console.error('Failed to load media files:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedia = media.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBucket = selectedBucket === 'all' || file.bucket === selectedBucket;
    return matchesSearch && matchesBucket;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const copyToClipboard = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        // Determine bucket based on file type
        let bucket: 'IMAGES' | 'DOCUMENTS' | 'GALLERY';
        if (file.type.startsWith('image/')) {
          bucket = 'IMAGES';
        } else if (file.type.includes('pdf') || file.type.includes('document')) {
          bucket = 'DOCUMENTS';
        } else {
          bucket = 'GALLERY';
        }

        // Upload to Supabase Storage
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const publicUrl = await uploadFile(bucket, fileName, file);

        console.log('File uploaded successfully:', publicUrl);
      }
      
      // Reload media library
      await loadMediaFiles();
      alert('✓ Files uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDeleteFile = async (file: MediaFile) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      // Map bucket names
      const bucketMap: Record<StorageBucket, 'IMAGES' | 'DOCUMENTS' | 'GALLERY'> = {
        'images': 'IMAGES',
        'documents': 'DOCUMENTS',
        'gallery': 'GALLERY',
      };

      await deleteFromStorage(bucketMap[file.bucket], file.path);
      
      // Remove from local state
      setMedia((prev) => prev.filter((f) => f.id !== file.id));
      if (selectedFile?.id === file.id) setSelectedFile(null);
      
      alert('✓ File deleted successfully!');
    } catch (error) {
      console.error('Failed to delete file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Media Library</h1>
          <p className="mt-1 text-white/60">Upload and manage your images and files.</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] text-white font-semibold rounded-xl shadow-lg shadow-[#C77DFF]/30 hover:shadow-xl hover:shadow-[#C77DFF]/40 hover:-translate-y-0.5 transition-all duration-300"
        >
          <Upload className="w-5 h-5" />
          Upload Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? 'border-[#C77DFF] bg-[#C77DFF]/10'
            : 'border-white/20 bg-[#0B1320]/60 hover:border-white/30'
        }`}
      >
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl mb-4 transition-all ${
            isDragging ? 'bg-[#C77DFF]/20 scale-110' : 'bg-[#0B1320]/80 border border-white/10'
          }`}>
            <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-[#C77DFF]' : 'text-white/60'}`} />
          </div>
          <p className="text-white font-medium mb-1">
            {isDragging ? 'Drop files here' : 'Drag and drop files here'}
          </p>
          <p className="text-white/60 text-sm mb-4">or click the upload button above</p>
          <p className="text-white/40 text-xs">Supports: JPG, PNG, GIF, WebP, PDF, DOC</p>
        </div>
        {isUploading && (
          <div className="absolute inset-0 bg-[#0B1320]/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-[#C77DFF] border-t-transparent rounded-full animate-spin" />
              <span className="text-white font-medium">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1320]/60 border border-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#C77DFF] focus:border-transparent transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedBucket}
            onChange={(e) => setSelectedBucket(e.target.value as typeof selectedBucket)}
            className="px-3 py-2 rounded-xl bg-[#0B1320]/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C77DFF] transition-all"
          >
            <option value="all">All Buckets</option>
            <option value="images">Images</option>
            <option value="documents">Documents</option>
            <option value="gallery">Gallery</option>
          </select>
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#0B1320]/60 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-[#C77DFF]/20 text-[#C77DFF]' : 'text-white/60 hover:text-white'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-[#C77DFF]/20 text-[#C77DFF]' : 'text-white/60 hover:text-white'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-[#0B1320]/80 p-12 text-center">
          <div className="w-12 h-12 border-2 border-[#C77DFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading media files...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#0B1320]/80 p-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0B1320]/80 border border-white/10 mx-auto mb-4">
            <FolderOpen className="w-10 h-10 text-white/60" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No files found</h3>
          <p className="text-white/60 mb-4">
            {searchQuery ? 'Try a different search term' : 'Upload some files to get started'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#C77DFF]/20 text-[#C77DFF] font-medium rounded-lg hover:bg-[#C77DFF]/30 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Files
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((file) => (
            <div
              key={file.id}
              className="group relative rounded-xl overflow-hidden bg-[#0B1320]/80 border border-white/10 hover:border-[#C77DFF]/50 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedFile(file)}
            >
              <div className="aspect-square">
                {file.type === 'image' && file.previewUrl ? (
                  <img src={file.previewUrl} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#0B1320]">
                    <FileText className="w-12 h-12 text-white/40" />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-medium truncate">{file.name}</p>
                  <p className="text-white/60 text-xs">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(file.url, file.id);
                  }}
                  className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-[#C77DFF] transition-colors"
                >
                  {copiedId === file.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file);
                  }}
                  className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[#0B1320]/80 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">File</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider hidden sm:table-cell">Size</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider hidden md:table-cell">Uploaded</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-white/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredMedia.map((file) => (
                <tr key={file.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#0B1320] flex-shrink-0">
                        {file.type === 'image' && file.previewUrl ? (
                          <img src={file.previewUrl} alt={file.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white/40" />
                          </div>
                        )}
                      </div>
                      <span className="text-white font-medium truncate max-w-[200px]">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60 text-sm hidden sm:table-cell">{formatFileSize(file.size)}</td>
                  <td className="px-4 py-3 text-white/60 text-sm hidden md:table-cell">{formatDate(file.uploadedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedFile(file)}
                        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(file.url, file.id)}
                        className="p-2 rounded-lg text-white/60 hover:text-[#C77DFF] hover:bg-[#C77DFF]/10 transition-all"
                      >
                        {copiedId === file.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteFile(file)}
                        className="p-2 rounded-lg text-white/60 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* File Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedFile(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-3xl bg-[#0B1320] rounded-2xl border border-white/10 overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C77DFF]/20">
                  {selectedFile.type === 'image' ? (
                    <ImageIcon className="w-5 h-5 text-[#C77DFF]" />
                  ) : (
                    <FileText className="w-5 h-5 text-[#C77DFF]" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{selectedFile.name}</h3>
                  <p className="text-white/60 text-sm">{formatFileSize(selectedFile.size)} • {formatDate(selectedFile.uploadedAt)}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {selectedFile.type === 'image' && selectedFile.previewUrl ? (
                <img src={selectedFile.previewUrl} alt={selectedFile.name} className="max-h-[60vh] w-full object-contain rounded-lg" />
              ) : (
                <div className="h-60 flex items-center justify-center bg-[#0B1320]/50 rounded-lg">
                  <FileText className="w-20 h-20 text-white/40" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between p-4 border-t border-white/10">
              <div className="flex-1 mr-4">
                <label className="block text-xs text-white/60 mb-1">File URL</label>
                <input
                  type="text"
                  readOnly
                  value={selectedFile.url}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1320]/60 border border-white/10 text-white/80 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(selectedFile.url, selectedFile.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#C77DFF]/20 text-[#C77DFF] font-medium rounded-lg hover:bg-[#C77DFF]/30 transition-colors"
                >
                  {copiedId === selectedFile.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy URL
                </button>
                <a
                  href={selectedFile.url}
                  download={selectedFile.name}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[#C77DFF]/10 border border-[#C77DFF]/20">
        <Sparkles className="w-5 h-5 text-[#C77DFF] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-white font-medium">Ready for Supabase Storage</p>
          <p className="text-white/60 text-sm mt-1">
            Files are currently stored locally. Once Supabase is connected, uploads will be stored in Supabase Storage with permanent URLs.
          </p>
        </div>
      </div>
    </div>
  );
}
