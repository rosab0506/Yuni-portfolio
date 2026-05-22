/**
 * Storage Service - File Upload Abstraction Layer
 * 
 * Provides a unified interface for file storage operations.
 * Currently uses mock implementation (base64/URL passthrough).
 * 
 * TODO [SUPABASE STORAGE]: Replace mock with Supabase Storage implementation
 * when credentials are available.
 * 
 * IMPORTANT: This abstraction ensures that all file operations go through
 * a single point, making it easy to swap implementations later.
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Storage bucket types matching Supabase Storage buckets
 */
export type StorageBucket = 'images' | 'resumes' | 'documents' | 'gallery';

/**
 * File metadata returned after upload
 */
export interface StorageFileInfo {
  /** Public URL to access the file */
  url: string;
  /** Original filename */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  type: string;
  /** Storage bucket where file is stored */
  bucket: StorageBucket;
  /** Path within the bucket */
  path: string;
}

/**
 * Upload options
 */
export interface UploadOptions {
  /** Target bucket for the file */
  bucket: StorageBucket;
  /** Optional custom path (defaults to auto-generated) */
  path?: string;
  /** Whether to overwrite existing file */
  upsert?: boolean;
  /** Cache control header value */
  cacheControl?: string;
}

/**
 * Storage service interface - all implementations must follow this contract
 */
export interface StorageService {
  /**
   * Upload a file and return its public URL
   * @param file - File object to upload
   * @param options - Upload options including bucket
   * @returns File info including public URL
   */
  uploadFile(file: File, options: UploadOptions): Promise<StorageFileInfo>;

  /**
   * Upload from a data URL (base64)
   * @param dataUrl - Base64 data URL
   * @param filename - Original filename
   * @param options - Upload options
   * @returns File info including public URL
   */
  uploadDataUrl(dataUrl: string, filename: string, options: UploadOptions): Promise<StorageFileInfo>;

  /**
   * Delete a file by URL or path
   * @param urlOrPath - Public URL or storage path
   * @param bucket - Storage bucket
   */
  deleteFile(urlOrPath: string, bucket: StorageBucket): Promise<void>;

  /**
   * Check if a URL is a storage URL managed by this service
   * @param url - URL to check
   */
  isStorageUrl(url: string): boolean;

  /**
   * Get the public URL for a stored file
   * @param path - Storage path
   * @param bucket - Storage bucket
   */
  getPublicUrl(path: string, bucket: StorageBucket): string;
}

/**
 * Storage service configuration
 */
export interface StorageServiceConfig {
  /** Enable debug logging */
  debug?: boolean;
  /** Base URL for mock storage (dev only) */
  mockBaseUrl?: string;
}

// ============================================================================
// Mock Implementation (DEV)
// ============================================================================

/**
 * Mock storage service for development.
 * 
 * BEHAVIOR:
 * - Files are converted to base64 data URLs and stored in memory
 * - URLs passed as strings are returned as-is
 * - No actual file persistence - data is lost on refresh
 * 
 * This allows the admin forms to work with file uploads without
 * requiring Supabase Storage to be configured.
 * 
 * TODO [SUPABASE STORAGE]: Replace with createSupabaseStorageService
 */
export function createMockStorageService(config: StorageServiceConfig = {}): StorageService {
  const { debug = false, mockBaseUrl = 'mock://storage' } = config;

  const log = (message: string, data?: unknown) => {
    if (debug) {
      console.log(`[MockStorage] ${message}`, data ?? '');
    }
  };

  // Generate a unique path for uploads
  const generatePath = (filename: string, bucket: StorageBucket): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${bucket}/${timestamp}-${random}-${sanitizedName}`;
  };

  // Check if a string is a data URL
  const isDataUrl = (str: string): boolean => {
    return str.startsWith('data:');
  };

  // Check if a string is a valid URL
  const isValidUrl = (str: string): boolean => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  return {
    async uploadFile(file: File, options: UploadOptions): Promise<StorageFileInfo> {
      log('uploadFile called', { name: file.name, size: file.size, bucket: options.bucket });

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const path = options.path ?? generatePath(file.name, options.bucket);
          
          // In mock mode, we return the data URL directly
          // This allows images to be previewed immediately
          const fileInfo: StorageFileInfo = {
            url: dataUrl, // Return data URL for immediate display
            name: file.name,
            size: file.size,
            type: file.type,
            bucket: options.bucket,
            path,
          };
          
          log('File uploaded (mock)', { path, size: file.size });
          resolve(fileInfo);
        };

        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
      });
    },

    async uploadDataUrl(dataUrl: string, filename: string, options: UploadOptions): Promise<StorageFileInfo> {
      log('uploadDataUrl called', { filename, bucket: options.bucket });

      // If it's already a regular URL, just return it
      if (!isDataUrl(dataUrl) && isValidUrl(dataUrl)) {
        log('URL passthrough', { url: dataUrl });
        return {
          url: dataUrl,
          name: filename,
          size: 0,
          type: 'unknown',
          bucket: options.bucket,
          path: dataUrl,
        };
      }

      // Parse data URL to get size estimate
      const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      const mimeType = matches?.[1] ?? 'application/octet-stream';
      const base64Data = matches?.[2] ?? '';
      const sizeEstimate = Math.ceil(base64Data.length * 0.75);

      const path = options.path ?? generatePath(filename, options.bucket);

      const fileInfo: StorageFileInfo = {
        url: dataUrl,
        name: filename,
        size: sizeEstimate,
        type: mimeType,
        bucket: options.bucket,
        path,
      };

      log('Data URL uploaded (mock)', { path, size: sizeEstimate });
      return fileInfo;
    },

    async deleteFile(urlOrPath: string, bucket: StorageBucket): Promise<void> {
      log('deleteFile called (no-op in mock)', { urlOrPath, bucket });
      // No-op in mock implementation
      // Files are stored as data URLs in state and will be removed when state changes
    },

    isStorageUrl(url: string): boolean {
      // In mock mode, check for data URLs or mock base URL
      return isDataUrl(url) || url.startsWith(mockBaseUrl);
    },

    getPublicUrl(path: string, bucket: StorageBucket): string {
      // In mock mode, return a placeholder URL
      return `${mockBaseUrl}/${bucket}/${path}`;
    },
  };
}

// ============================================================================
// Supabase Implementation Placeholder
// ============================================================================

/**
 * TODO [SUPABASE STORAGE]: Implement Supabase Storage service
 * 
 * When Supabase credentials are available, implement this function:
 * 
 * ```typescript
 * import { supabase } from '../lib/supabase';
 * 
 * export function createSupabaseStorageService(config?: StorageServiceConfig): StorageService {
 *   return {
 *     async uploadFile(file, options) {
 *       const path = options.path ?? generatePath(file.name, options.bucket);
 *       
 *       const { data, error } = await supabase.storage
 *         .from(options.bucket)
 *         .upload(path, file, {
 *           cacheControl: options.cacheControl ?? '3600',
 *           upsert: options.upsert ?? true,
 *         });
 *       
 *       if (error) throw error;
 *       
 *       const { data: { publicUrl } } = supabase.storage
 *         .from(options.bucket)
 *         .getPublicUrl(data.path);
 *       
 *       return {
 *         url: publicUrl,
 *         name: file.name,
 *         size: file.size,
 *         type: file.type,
 *         bucket: options.bucket,
 *         path: data.path,
 *       };
 *     },
 *     
 *     async uploadDataUrl(dataUrl, filename, options) {
 *       // Convert data URL to Blob, then to File
 *       const res = await fetch(dataUrl);
 *       const blob = await res.blob();
 *       const file = new File([blob], filename, { type: blob.type });
 *       return this.uploadFile(file, options);
 *     },
 *     
 *     async deleteFile(urlOrPath, bucket) {
 *       const path = extractPathFromUrl(urlOrPath);
 *       const { error } = await supabase.storage
 *         .from(bucket)
 *         .remove([path]);
 *       if (error) throw error;
 *     },
 *     
 *     isStorageUrl(url) {
 *       return url.includes('.supabase.co/storage/');
 *     },
 *     
 *     getPublicUrl(path, bucket) {
 *       const { data: { publicUrl } } = supabase.storage
 *         .from(bucket)
 *         .getPublicUrl(path);
 *       return publicUrl;
 *     },
 *   };
 * }
 * ```
 */

// ============================================================================
// Service Factory & Singleton
// ============================================================================

let storageServiceInstance: StorageService | null = null;

/**
 * Get the storage service instance.
 * 
 * TODO [SUPABASE STORAGE]: Check for Supabase configuration and
 * return Supabase implementation when available:
 * 
 * ```typescript
 * if (isSupabaseConfigured()) {
 *   return createSupabaseStorageService({ debug: process.env.NODE_ENV === 'development' });
 * }
 * ```
 */
export function getStorageService(): StorageService {
  if (!storageServiceInstance) {
    storageServiceInstance = createMockStorageService({
      debug: process.env.NODE_ENV === 'development',
    });
  }
  return storageServiceInstance;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Determine the appropriate bucket for a field based on its name
 */
export function getBucketForField(fieldName: string): StorageBucket {
  const lowerName = fieldName.toLowerCase();
  
  if (lowerName.includes('resume') || lowerName.includes('cv')) {
    return 'resumes';
  }
  
  if (lowerName.includes('certificate') || lowerName.includes('document') || lowerName.includes('file')) {
    return 'documents';
  }
  
  if (lowerName.includes('gallery')) {
    return 'gallery';
  }
  
  // Default to images for any other image/photo/avatar fields
  return 'images';
}

/**
 * Check if a value looks like a file that needs uploading
 * vs a URL that's already stored
 */
export function isUploadableFile(value: unknown): value is File {
  return value instanceof File;
}

/**
 * Check if a value is a data URL (base64 encoded)
 */
export function isDataUrl(value: unknown): boolean {
  return typeof value === 'string' && value.startsWith('data:');
}

/**
 * Check if a value is a valid HTTP(S) URL
 */
export function isHttpUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
