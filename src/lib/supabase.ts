/**
 * Supabase Client Configuration
 * 
 * Secure Supabase client for admin-only authentication.
 * This is a SINGLE-ADMIN system - no public signup allowed.
 */

import { createClient, type SupabaseClient as SupabaseClientType } from '@supabase/supabase-js';

// ============================================================================
// Environment Variables
// ============================================================================

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL) as string | undefined;
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY) as string | undefined;

// ============================================================================
// Client Initialization
// ============================================================================

/**
 * Supabase client instance.
 * 
 * SECURITY NOTES:
 * - Uses anon key which is safe to expose (RLS protects data)
 * - Session is persisted in localStorage for cross-refresh persistence
 * - Auto-refreshes tokens before expiry
 * - This is admin-only auth - no public signup routes exist
 */
function createSupabaseClient(): SupabaseClientType | null {
  console.log('[Supabase] Initializing client...', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlPrefix: supabaseUrl?.substring(0, 30)
  });
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase] Missing environment variables!', {
      VITE_SUPABASE_URL: supabaseUrl ? 'SET' : 'MISSING',
      VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'SET' : 'MISSING'
    });
    return null;
  }

  console.log('[Supabase] Client created successfully');
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Guard localStorage for SSR environments
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      storageKey: 'portfolio-admin-auth',
    },
  });
}

export const supabase = createSupabaseClient();

// Re-export the type for use elsewhere
export type { SupabaseClientType as SupabaseClient };

// ============================================================================
// Validation
// ============================================================================

/**
 * Check if Supabase is configured and ready to use.
 */
export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

/**
 * Get Supabase client with validation.
 * Throws if Supabase is not configured.
 */
export function getSupabaseClient(): SupabaseClientType {
  if (!supabase) {
    throw new Error(
      'Supabase client not initialized. ' +
      'Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
    );
  }
  return supabase;
}

// ============================================================================
// Storage Helpers (Placeholder)
// ============================================================================

/**
 * Storage bucket names that will be used in Supabase Storage
 */
export const STORAGE_BUCKETS = {
  /** Profile images, hero images */
  IMAGES: 'images',
  /** Resume PDFs */
  RESUMES: 'resumes',
  /** Certificates and documents */
  DOCUMENTS: 'documents',
  /** Project gallery images */
  GALLERY: 'gallery',
} as const;

/**
 * Upload a file to Supabase Storage.
 * 
 * TODO [SUPABASE STORAGE]: Implement when credentials are provided
 * 
 * @param bucket - Storage bucket name
 * @param path - File path within bucket
 * @param file - File to upload
 * @returns Public URL of uploaded file
 */
export async function uploadFile(
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string,
  file: File
): Promise<string> {
  if (!supabase) {
    // Mock: Return a placeholder URL in development
    console.warn('[MOCK] uploadFile called - returning placeholder URL');
    return `https://placeholder.supabase.co/storage/v1/object/public/${bucket}/${path}`;
  }
  
  /**
   * TODO [SUPABASE STORAGE]: Implement real upload
   * 
   * const { data, error } = await supabase.storage
   *   .from(STORAGE_BUCKETS[bucket])
   *   .upload(path, file, {
   *     cacheControl: '3600',
   *     upsert: true,
   *   });
   * 
   * if (error) throw error;
   * 
   * const { data: { publicUrl } } = supabase.storage
   *   .from(STORAGE_BUCKETS[bucket])
   *   .getPublicUrl(data.path);
   * 
   * return publicUrl;
   */
  
  throw new Error('Supabase Storage not configured');
}

/**
 * Delete a file from Supabase Storage.
 * 
 * TODO [SUPABASE STORAGE]: Implement when credentials are provided
 */
export async function deleteFile(
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string
): Promise<void> {
  if (!supabase) {
    console.warn('[MOCK] deleteFile called - no action taken');
    return;
  }
  
  /**
   * TODO [SUPABASE STORAGE]: Implement real delete
   * 
   * const { error } = await supabase.storage
   *   .from(STORAGE_BUCKETS[bucket])
   *   .remove([path]);
   * 
   * if (error) throw error;
   */
  
  throw new Error('Supabase Storage not configured');
}

// ============================================================================
// Database Table Names
// ============================================================================

/**
 * Database table names for Supabase queries.
 * These map to the collections/singletons in the CMS.
 */
export const DB_TABLES = {
  // Singletons
  HERO: 'cms_hero',
  ABOUT: 'cms_about',
  CONTACT: 'cms_contact',
  RESUME_SETTINGS: 'cms_resume_settings',
  
  // Collections
  EDUCATION: 'education',
  SKILLS: 'skills',
  SERVICES: 'services',
  RESUMES: 'resumes',
  PROJECTS: 'projects',
  PUBLICATIONS: 'publications',
  CERTIFICATIONS: 'certifications',
  EXPERIENCE: 'experience',
  BLOGS: 'blogs',
  TESTIMONIALS: 'testimonials',
  ACHIEVEMENTS: 'achievements',
  CLIENTS: 'clients',
  TECH_STACK_CATEGORIES: 'tech_stack_categories',
  SOCIAL_LINKS: 'social_links',
  CONTACT_MESSAGES: 'contact_messages',
} as const;
