/**
 * Storage Hook - React hook for file storage operations
 * 
 * Provides an easy-to-use interface for file uploads in components.
 * Uses the storage service abstraction layer.
 * 
 * TODO [SUPABASE STORAGE]: When Supabase is configured, this will
 * automatically use Supabase Storage for all uploads.
 * 
 * Usage:
 * ```typescript
 * const { uploadFile, isUploading, error } = useStorage();
 * 
 * const handleUpload = async (file: File) => {
 *   const url = await uploadFile(file, 'images');
 *   if (url) {
 *     // File uploaded successfully, url is the public URL
 *   }
 * };
 * ```
 */

import { useState, useCallback, useMemo } from 'react';
import {
  getStorageService,
  type StorageBucket,
  type StorageFileInfo,
  type UploadOptions,
} from '../services/storage.service';

export interface UseStorageReturn {
  /** Upload a file and get its public URL */
  uploadFile: (file: File, bucket: StorageBucket, options?: Partial<UploadOptions>) => Promise<string | null>;
  /** Upload a data URL and get its public URL */
  uploadDataUrl: (dataUrl: string, filename: string, bucket: StorageBucket) => Promise<string | null>;
  /** Delete a file by URL */
  deleteFile: (url: string, bucket: StorageBucket) => Promise<boolean>;
  /** Whether an upload is in progress */
  isUploading: boolean;
  /** Last error message */
  error: string | null;
  /** Clear the error state */
  clearError: () => void;
  /** Last uploaded file info */
  lastUpload: StorageFileInfo | null;
}

export function useStorage(): UseStorageReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpload, setLastUpload] = useState<StorageFileInfo | null>(null);

  const storageService = useMemo(() => getStorageService(), []);

  const uploadFile = useCallback(
    async (
      file: File,
      bucket: StorageBucket,
      options?: Partial<UploadOptions>
    ): Promise<string | null> => {
      setIsUploading(true);
      setError(null);

      try {
        const fileInfo = await storageService.uploadFile(file, {
          bucket,
          ...options,
        });
        setLastUpload(fileInfo);
        return fileInfo.url;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setError(message);
        console.error('[useStorage] Upload error:', err);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [storageService]
  );

  const uploadDataUrl = useCallback(
    async (
      dataUrl: string,
      filename: string,
      bucket: StorageBucket
    ): Promise<string | null> => {
      setIsUploading(true);
      setError(null);

      try {
        const fileInfo = await storageService.uploadDataUrl(dataUrl, filename, {
          bucket,
        });
        setLastUpload(fileInfo);
        return fileInfo.url;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setError(message);
        console.error('[useStorage] Upload error:', err);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [storageService]
  );

  const deleteFile = useCallback(
    async (url: string, bucket: StorageBucket): Promise<boolean> => {
      try {
        await storageService.deleteFile(url, bucket);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Delete failed';
        setError(message);
        console.error('[useStorage] Delete error:', err);
        return false;
      }
    },
    [storageService]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadFile,
    uploadDataUrl,
    deleteFile,
    isUploading,
    error,
    clearError,
    lastUpload,
  };
}
