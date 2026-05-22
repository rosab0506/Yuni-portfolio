/**
 * Supabase CMS Service
 * 
 * Handles all database operations for the CMS using Supabase.
 * Maps between frontend camelCase and database snake_case.
 */

import { supabase, isSupabaseConfigured, DB_TABLES, STORAGE_BUCKETS } from '../lib/supabase';
import type { CmsData, CollectionKey, SingletonKey } from '../context/CmsContext';
import cmsMock from '../data/mock/cms.mock.json';

// ============================================================================
// Type Definitions
// ============================================================================

type DbRow = Record<string, unknown>;

// ============================================================================
// Field Mapping: camelCase <-> snake_case
// ============================================================================

/**
 * Convert snake_case to camelCase
 */
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase to snake_case
 */
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Convert object keys from snake_case to camelCase
 */
function mapRowToFrontend<T extends DbRow>(row: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    result[toCamelCase(key)] = value;
  }
  return result;
}

/**
 * Convert object keys from camelCase to snake_case
 */
function mapFrontendToRow<T extends Record<string, unknown>>(obj: T): DbRow {
  const result: DbRow = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip frontend-only fields
    if (key === 'createdAt' || key === 'updatedAt') continue;
    result[toSnakeCase(key)] = value;
  }
  return result;
}

// ============================================================================
// Collection Key to Table Name Mapping
// ============================================================================

const collectionToTable: Record<CollectionKey, string> = {
  education: DB_TABLES.EDUCATION,
  skills: DB_TABLES.SKILLS,
  services: DB_TABLES.SERVICES,
  resumes: DB_TABLES.RESUMES,
  projects: DB_TABLES.PROJECTS,
  publications: DB_TABLES.PUBLICATIONS,
  certifications: DB_TABLES.CERTIFICATIONS,
  experience: DB_TABLES.EXPERIENCE,
  blogs: DB_TABLES.BLOGS,
  testimonials: DB_TABLES.TESTIMONIALS,
  achievements: DB_TABLES.ACHIEVEMENTS,
  clients: DB_TABLES.CLIENTS,
  techStackCategories: DB_TABLES.TECH_STACK_CATEGORIES,
  contactMessages: DB_TABLES.CONTACT_MESSAGES,
  portfolio: DB_TABLES.PROJECTS, // Portfolio maps to projects table
};

const singletonToTable: Record<SingletonKey, string> = {
  hero: DB_TABLES.HERO,
  about: DB_TABLES.ABOUT,
  contact: DB_TABLES.CONTACT,
  resumeSettings: DB_TABLES.RESUME_SETTINGS,
};

// ============================================================================
// Special Field Mappings (for renamed reserved keywords)
// ============================================================================

/**
 * Special mappings for fields that were renamed to avoid PostgreSQL reserved keywords
 */
const specialFieldMappings: Record<string, Record<string, string>> = {
  about: {
    currentRole: 'current_job_role',
    current_job_role: 'currentRole',
  },
  experience: {
    role: 'job_role',
    job_role: 'role',
  },
  publications: {
    year: 'publication_year',
    publication_year: 'year',
  },
  achievements: {
    year: 'award_year',
    award_year: 'year',
  },
};

/**
 * Apply special field mappings when converting to database format
 */
function applySpecialMappingsToDb(tableName: string, data: DbRow): DbRow {
  const mappings = specialFieldMappings[tableName];
  if (!mappings) return data;

  const result = { ...data };
  for (const [frontendKey, dbKey] of Object.entries(mappings)) {
    if (frontendKey in result && !frontendKey.includes('_')) {
      result[dbKey] = result[toSnakeCase(frontendKey)];
      delete result[toSnakeCase(frontendKey)];
    }
  }
  return result;
}

/**
 * Apply special field mappings when converting from database format
 */
function applySpecialMappingsFromDb(tableName: string, data: Record<string, unknown>): Record<string, unknown> {
  const result = { ...data };

  // Handle about table
  if (tableName === 'about' && 'currentJobRole' in result) {
    result.currentRole = result.currentJobRole;
    delete result.currentJobRole;
  }

  // Handle experience table
  if (tableName === 'experience' && 'jobRole' in result) {
    result.role = result.jobRole;
    delete result.jobRole;
  }

  // Handle publications table
  if (tableName === 'publications' && 'publicationYear' in result) {
    result.year = result.publicationYear;
    delete result.publicationYear;
  }

  // Handle achievements table
  if (tableName === 'achievements' && 'awardYear' in result) {
    result.year = result.awardYear;
    delete result.awardYear;
  }

  return result;
}

// ============================================================================
// Fetch All CMS Data
// ============================================================================

// ============================================================================
// Fetch Data (Split Strategy)
// ============================================================================

/**
 * Fetch Critical CMS Data (First Paint)
 * Includes Singletons and key Collections needed for the Home Page.
 */
export async function fetchCriticalCmsData(): Promise<Partial<CmsData> | null> {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('[SupabaseCms] Not configured - using mock data');
    return null;
  }

  try {
    const [
      heroResult,
      aboutResult,
      contactResult,
      resumeSettingsResult,
      projectsResult,
      servicesResult,
      skillsResult,
      techStackResult,
    ] = await Promise.all([
      supabase.from(DB_TABLES.HERO).select('*').single(),
      supabase.from(DB_TABLES.ABOUT).select('*').single(),
      supabase.from(DB_TABLES.CONTACT).select('*').single(),
      supabase.from(DB_TABLES.RESUME_SETTINGS).select('*').single(),
      supabase.from(DB_TABLES.PROJECTS).select('*').order('order_index').limit(6), // Limit initial projects
      supabase.from(DB_TABLES.SERVICES).select('*').order('order_index'),
      supabase.from(DB_TABLES.SKILLS).select('*').order('order_index'),
      supabase.from(DB_TABLES.TECH_STACK_CATEGORIES).select('*').order('order_index'),
    ]);

    // Transform Singletons
    const hero = heroResult.data ? mapRowToFrontend(heroResult.data as DbRow) : getDefaultHero();

    let about = aboutResult.data ? mapRowToFrontend(aboutResult.data as DbRow) : getDefaultAbout();
    about = applySpecialMappingsFromDb('about', about);

    const contactRow = contactResult.data ? mapRowToFrontend(contactResult.data as DbRow) : getDefaultContact();
    const contact = {
      pageIntroText: contactRow.pageIntroText || '',
      hireMeLabel: contactRow.hireMeLabel || 'Hire Me',
      contactInfo: {
        email: contactRow.email || '',
        phone: contactRow.phone || '',
        location: contactRow.location || '',
      },
      socialLinks: contactRow.socialLinks || [],
    };

    const resumeSettings = resumeSettingsResult.data
      ? { activeResumeId: (resumeSettingsResult.data as DbRow).active_resume_id || null }
      : { activeResumeId: null };

    // Helper to transform collection rows
    const transformCollection = (rows: DbRow[] | null, tableName?: string) => {
      if (!rows) return [];
      return rows.map(row => {
        let mapped = mapRowToFrontend(row);
        if (tableName) {
          mapped = applySpecialMappingsFromDb(tableName, mapped);
        }
        return mapped;
      });
    };

    return {
      singletons: {
        hero,
        about,
        contact,
        resumeSettings,
      },
      collections: {
        projects: transformCollection(projectsResult.data),
        services: transformCollection(servicesResult.data),
        skills: transformCollection(skillsResult.data),
        techStackCategories: transformCollection(techStackResult.data),
        // Initialize others as empty arrays
        education: [],
        resumes: [],
        publications: [],
        certifications: [],
        experience: [],
        blogs: [],
        testimonials: [],
        achievements: [],
        clients: [],
        contactMessages: [],
        portfolio: [],
      },
    } as unknown as Partial<CmsData>;
  } catch (error) {
    console.error('[SupabaseCms] Failed to fetch critical CMS data:', error);
    throw error;
  }
}

/**
 * Fetch Deferred CMS Data (Background)
 * Includes secondary collections not immediately visible.
 */
export async function fetchDeferredCmsData(): Promise<Partial<CmsData['collections']> | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const [
      educationResult,
      resumesResult,
      remainingProjectsResult, // Get rest if needed, or just full fetch
      publicationsResult,
      certificationsResult,
      experienceResult,
      blogsResult,
      testimonialsResult,
      achievementsResult,
      clientsResult,
      messagesResult,
    ] = await Promise.all([
      supabase.from(DB_TABLES.EDUCATION).select('*').order('order_index'),
      supabase.from(DB_TABLES.RESUMES).select('*'),
      supabase.from(DB_TABLES.PROJECTS).select('*').order('order_index'), // Fetch full list to replace partial
      supabase.from(DB_TABLES.PUBLICATIONS).select('*').order('order_index'),
      supabase.from(DB_TABLES.CERTIFICATIONS).select('*').order('order_index'),
      supabase.from(DB_TABLES.EXPERIENCE).select('*').order('order_index'),
      supabase.from(DB_TABLES.BLOGS).select('*').order('order_index'),
      supabase.from(DB_TABLES.TESTIMONIALS).select('*').order('order_index'),
      supabase.from(DB_TABLES.ACHIEVEMENTS).select('*').order('order_index'),
      supabase.from(DB_TABLES.CLIENTS).select('*').order('order_index'),
      supabase.from(DB_TABLES.CONTACT_MESSAGES).select('*').order('created_at', { ascending: false }),
    ]);

    const transformCollection = (rows: DbRow[] | null, tableName?: string) => {
      if (!rows) return [];
      return rows.map(row => {
        let mapped = mapRowToFrontend(row);
        if (tableName) {
          mapped = applySpecialMappingsFromDb(tableName, mapped);
        }
        return mapped;
      });
    };

    // Cast specifically to match CmsData['collections'] structure
    return {
      education: transformCollection(educationResult.data),
      resumes: transformCollection(resumesResult.data),
      projects: transformCollection(remainingProjectsResult.data),
      publications: transformCollection(publicationsResult.data, 'publications'),
      certifications: transformCollection(certificationsResult.data),
      experience: transformCollection(experienceResult.data, 'experience'),
      blogs: transformCollection(blogsResult.data),
      testimonials: transformCollection(testimonialsResult.data),
      achievements: transformCollection(achievementsResult.data, 'achievements'),
      clients: transformCollection(clientsResult.data),
      contactMessages: transformCollection(messagesResult.data),
    } as unknown as Partial<CmsData['collections']>;
  } catch (error) {
    console.error('[SupabaseCms] Failed to fetch deferred CMS data:', error);
    throw error;
  }
}

/**
 * Legacy support / Full Fetch
 */
export async function fetchAllCmsData(): Promise<CmsData | null> {
  const critical = await fetchCriticalCmsData();
  if (!critical) return null;
  const deferred = await fetchDeferredCmsData();

  return {
    ...critical,
    collections: {
      ...critical.collections,
      ...deferred,
    }
  } as CmsData;
}

// ============================================================================
// Singleton Operations
// ============================================================================

/**
 * Update a singleton record in Supabase.
 */
export async function updateSingleton(
  key: SingletonKey,
  values: Record<string, unknown>
): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  const tableName = singletonToTable[key];
  let dbValues = mapFrontendToRow(values);

  // Handle special contact structure
  if (key === 'contact' && values.contactInfo) {
    const contactInfo = values.contactInfo as Record<string, string>;
    dbValues = {
      ...dbValues,
      email: contactInfo.email,
      phone: contactInfo.phone,
      location: contactInfo.location,
    };
    delete dbValues.contact_info;
  }

  // Handle special about field mapping
  if (key === 'about' && 'current_role' in dbValues) {
    dbValues.current_job_role = dbValues.current_role;
    delete dbValues.current_role;
  }

  // Handle resumeSettings
  if (key === 'resumeSettings' && 'active_resume_id' in dbValues) {
    // Already in correct format
  }

  dbValues.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from(tableName)
    .update(dbValues)
    .not('id', 'is', null); // Update the single row

  if (error) throw error;
}

// ============================================================================
// Collection Operations
// ============================================================================

/**
 * Create a new item in a collection.
 */
export async function createItem(
  key: CollectionKey,
  values: Record<string, unknown>
): Promise<Record<string, unknown>> {
  if (!supabase) throw new Error('Supabase not configured');

  const tableName = collectionToTable[key];
  let dbValues = mapFrontendToRow(values);

  // Apply special field mappings based on collection type
  if (key === 'experience' && 'role' in dbValues) {
    dbValues.job_role = dbValues.role;
    delete dbValues.role;
  }
  if (key === 'publications' && 'year' in dbValues) {
    dbValues.publication_year = dbValues.year;
    delete dbValues.year;
  }
  if (key === 'achievements' && 'year' in dbValues) {
    dbValues.award_year = dbValues.year;
    delete dbValues.year;
  }

  // Remove id if present (let Supabase generate it)
  delete dbValues.id;

  const { data, error } = await supabase
    .from(tableName)
    .insert(dbValues)
    .select()
    .single();

  if (error) throw error;

  let result = mapRowToFrontend(data as DbRow);
  result = applySpecialMappingsFromDb(key, result);
  return result;
}

/**
 * Update an existing item in a collection.
 */
export async function updateItem(
  key: CollectionKey,
  id: string,
  values: Record<string, unknown>
): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  const tableName = collectionToTable[key];
  let dbValues = mapFrontendToRow(values);

  // Apply special field mappings
  if (key === 'experience' && 'role' in dbValues) {
    dbValues.job_role = dbValues.role;
    delete dbValues.role;
  }
  if (key === 'publications' && 'year' in dbValues) {
    dbValues.publication_year = dbValues.year;
    delete dbValues.year;
  }
  if (key === 'achievements' && 'year' in dbValues) {
    dbValues.award_year = dbValues.year;
    delete dbValues.year;
  }

  dbValues.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from(tableName)
    .update(dbValues)
    .eq('id', id);

  if (error) throw error;
}

/**
 * Delete an item from a collection.
 */
export async function deleteItem(
  key: CollectionKey,
  id: string
): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  const tableName = collectionToTable[key];

  console.log(`[SupabaseCms] Deleting from ${tableName} with id:`, id);

  const { error, data } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    console.error(`[SupabaseCms] Delete error:`, error);
    throw error;
  }

  console.log(`[SupabaseCms] Delete successful, deleted rows:`, data);
}

// ============================================================================
// Contact Messages
// ============================================================================

/**
 * Add a contact message (public - no auth required).
 * Uses direct fetch to ensure anon role is used (bypasses any stored session).
 */
export async function addContactMessage(
  message: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[SupabaseCms] addContactMessage: Supabase not configured');
    throw new Error('Supabase not configured');
  }

  console.log('[SupabaseCms] addContactMessage: Attempting to insert message', {
    name: message.name,
    email: message.email,
    subject: message.subject
  });

  const dbValues = {
    name: message.name,
    email: message.email,
    subject: message.subject,
    message: message.message,
    status: 'new',
  };

  // Use direct fetch with only anon key (no auth session)
  const response = await fetch(`${supabaseUrl}/rest/v1/${DB_TABLES.CONTACT_MESSAGES}`, {
    method: 'POST',
    headers: {
      'apikey': supabaseAnonKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(dbValues),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[SupabaseCms] addContactMessage: Insert failed', errorData);
    throw new Error(errorData.message || 'Failed to send message');
  }

  const data = await response.json();
  console.log('[SupabaseCms] addContactMessage: Insert successful', data);
  return Array.isArray(data) ? mapRowToFrontend(data[0] as DbRow) : mapRowToFrontend(data as DbRow);
}

/**
 * Update a contact message (admin only).
 */
export async function updateContactMessage(
  id: string,
  values: Record<string, unknown>
): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  const dbValues = mapFrontendToRow(values);

  const { error } = await supabase
    .from(DB_TABLES.CONTACT_MESSAGES)
    .update(dbValues)
    .eq('id', id);

  if (error) throw error;
}

/**
 * Delete a contact message (admin only).
 */
export async function deleteContactMessage(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await supabase
    .from(DB_TABLES.CONTACT_MESSAGES)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================================================
// Resume Operations
// ============================================================================

/**
 * Set the active resume.
 */
export async function setActiveResume(resumeId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  // Update all resumes to inactive, then set the selected one to active
  await supabase
    .from(DB_TABLES.RESUMES)
    .update({ status: 'inactive', updated_at: new Date().toISOString() })
    .neq('id', resumeId);

  await supabase
    .from(DB_TABLES.RESUMES)
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('id', resumeId);

  // Update resume settings
  await supabase
    .from(DB_TABLES.RESUME_SETTINGS)
    .update({
      active_resume_id: resumeId,
      updated_at: new Date().toISOString()
    })
    .not('id', 'is', null);
}

// ============================================================================
// Storage Operations
// ============================================================================

/**
 * Upload a file to Supabase Storage.
 */
export async function uploadFile(
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string,
  file: File
): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured');

  const bucketName = STORAGE_BUCKETS[bucket];

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Delete a file from Supabase Storage.
 */
export async function deleteFile(
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string
): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  const bucketName = STORAGE_BUCKETS[bucket];

  console.log(`[SupabaseCms] Deleting file from ${bucketName}:`, path);

  const { error } = await supabase.storage
    .from(bucketName)
    .remove([path]);

  if (error) {
    console.error(`[SupabaseCms] File delete error:`, error);
    throw error;
  }

  console.log(`[SupabaseCms] File deleted successfully from ${bucketName}`);
}

/**
 * Extract file path from Supabase Storage URL
 * @param url - Full Supabase Storage URL
 * @param bucket - Storage bucket name
 * @returns File path or null if invalid URL
 */
export function extractFilePathFromUrl(url: string, bucket: keyof typeof STORAGE_BUCKETS): string | null {
  try {
    const bucketName = STORAGE_BUCKETS[bucket];
    const urlObj = new URL(url);
    // Pattern: /storage/v1/object/public/{bucket}/{filepath}
    const pathMatch = urlObj.pathname.match(new RegExp(`/${bucketName}/(.+)$`));
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
}

// ============================================================================
// Default Values (fallbacks)
// ============================================================================

function getDefaultHero() {
  return { ...cmsMock.singletons.hero };
}

function getDefaultAbout() {
  return { ...cmsMock.singletons.about };
}

function getDefaultContact() {
  const c = cmsMock.singletons.contact;
  return {
    pageIntroText: c.pageIntroText,
    hireMeLabel: c.hireMeLabel,
    email: (c.contactInfo as Record<string, string>)?.email ?? '',
    phone: (c.contactInfo as Record<string, string>)?.phone ?? '',
    location: (c.contactInfo as Record<string, string>)?.location ?? '',
    socialLinks: c.socialLinks ?? [],
  };
}
