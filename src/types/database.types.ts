/**
 * Database Types - Supabase-Ready Schema Definitions
 * 
 * These types define the structure for all CMS data models.
 * They are designed to map directly to Supabase database tables.
 * 
 * TODO [SUPABASE]: These types will be auto-generated from Supabase schema
 * using: npx supabase gen types typescript --project-id <project-id>
 */

// ============================================================================
// Base Types - Common fields for all database entities
// ============================================================================

/**
 * Base fields present on all database records
 * Maps to Supabase row-level fields
 */
export interface BaseEntity {
  id: string;
  created_at: string;  // ISO 8601 timestamp
  updated_at: string;  // ISO 8601 timestamp
}

/**
 * Publishable entities have status and ordering
 */
export interface PublishableEntity extends BaseEntity {
  status: 'draft' | 'published' | 'archived';
  order_index: number;
}

/**
 * Content that can be slugged for URLs
 */
export interface SluggableEntity extends PublishableEntity {
  slug: string;
}

// ============================================================================
// Singleton Types - Single-record configuration tables
// ============================================================================

export interface HeroSingleton {
  id: string;
  full_name: string;
  headline: string;
  subheadline: string | null;
  hero_image_url: string | null;  // TODO [SUPABASE STORAGE]: Will be Supabase Storage URL
  cta_primary_label: string | null;
  cta_primary_href: string | null;
  cta_secondary_label: string | null;
  cta_secondary_href: string | null;
  updated_at: string;
}

export interface AboutSingleton {
  id: string;
  full_name: string;
  tagline: string | null;
  title: string;
  bio: string;  // TODO [SANITIZATION]: Sanitize HTML when fetched from DB
  profile_image_url: string | null;  // TODO [SUPABASE STORAGE]: Will be Supabase Storage URL
  current_role: string | null;
  research_interest: string | null;
  highlights: string[];  // Stored as JSONB array in Supabase
  updated_at: string;
}

export interface ContactSingleton {
  id: string;
  page_intro_text: string | null;
  hire_me_label: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  updated_at: string;
}

export interface ResumeSettings {
  id: string;
  active_resume_id: string | null;
  updated_at: string;
}

// ============================================================================
// Collection Types - Multi-record tables
// ============================================================================

export interface Education extends PublishableEntity {
  institution: string;
  degree: string;
  field: string;
  grade: string | null;
  activities: string | null;
  description: string | null;
  start_date: string | null;  // ISO date
  end_date: string | null;    // ISO date
}

export interface Skill extends PublishableEntity {
  name: string;
  level: number;  // 1-5 scale
}

export interface Service extends PublishableEntity {
  title: string;
  summary: string | null;
}

export interface Resume extends BaseEntity {
  status: 'active' | 'inactive';
  title: string;
  file_url: string;  // TODO [SUPABASE STORAGE]: Will be Supabase Storage URL
  uploaded_at: string;
}

export interface Project extends SluggableEntity {
  title: string;
  summary: string;
  description: string | null;  // TODO [SANITIZATION]: Sanitize HTML when fetched from DB
  cover_image_url: string | null;  // TODO [SUPABASE STORAGE]: Will be Supabase Storage URL
  gallery_images: string[];  // TODO [SUPABASE STORAGE]: Array of Storage URLs
  github_url: string | null;
  live_demo_url: string | null;
  tech_stack: string[];  // Stored as JSONB array
  featured: boolean;
}

export interface Publication extends SluggableEntity {
  title: string;
  authors: string[];  // Stored as JSONB array
  venue: string;
  year: string;
  abstract: string | null;
  paper_url: string | null;
  pdf_url: string | null;  // TODO [SUPABASE STORAGE]: Will be Supabase Storage URL
  cover_image_url: string | null;  // TODO [SUPABASE STORAGE]: Will be Supabase Storage URL
  citation: string | null;
}

export interface Certification extends PublishableEntity {
  certificate_title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  certificate_image_url: string | null;  // TODO [SUPABASE STORAGE]: Will be Supabase Storage URL
  certificate_file_url: string | null;   // TODO [SUPABASE STORAGE]: Will be Supabase Storage URL
}

export interface Experience extends PublishableEntity {
  company: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;  // TODO [SANITIZATION]: Sanitize HTML when fetched from DB
}

export interface Blog extends SluggableEntity {
  title: string;
  excerpt: string | null;
  content: string | null;  // TODO [SANITIZATION]: MUST sanitize HTML - user-generated content
  cover_image_url: string | null;  // TODO [SUPABASE STORAGE]: Will be Supabase Storage URL
  author: string | null;
  published_date: string | null;
  read_time: number | null;
  tags: string[];  // Stored as JSONB array
}

export interface Testimonial extends PublishableEntity {
  author: string;
  quote: string;
}

export interface Achievement extends PublishableEntity {
  title: string;
  issuer: string;
  year: string;
  description: string;
  certificate_image_url: string | null;  // TODO [SUPABASE STORAGE]: Will be Supabase Storage URL
  certificate_file_url: string | null;   // TODO [SUPABASE STORAGE]: Will be Supabase Storage URL
  external_link: string | null;
}

export interface Client extends PublishableEntity {
  featured: boolean;
  name: string;
  industry: string | null;
  logo_url: string | null;  // TODO [SUPABASE STORAGE]: Will be Supabase Storage URL
  website_url: string | null;
  description: string | null;
  project_duration: string | null;
}

export interface TechStackTool {
  id: string;
  name: string;
  logo_url: string | null;  // TODO [SUPABASE STORAGE]: Will be Supabase Storage URL
  proficiency_level: number;
}

export interface TechStackCategory extends PublishableEntity {
  category_name: string;
  tools: TechStackTool[];  // Stored as JSONB array, or separate table with FK
}

export interface SocialLink {
  id: string;
  url: string;
  platform: string;
  icon_key: string;
  order_index: number;
}

export interface ContactMessage extends BaseEntity {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  handled_by: string | null;
  handled_at: string | null;
}

// ============================================================================
// API Response Types - For async data fetching
// ============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  loading?: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================================================
// Auth Types - Supabase Auth compatible
// ============================================================================

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  last_sign_in_at: string | null;
}

export interface AuthSession {
  user: AuthUser | null;
  access_token: string | null;
  refresh_token: string | null;
  expires_at: number | null;
}

// ============================================================================
// Field Mapping Utilities
// ============================================================================

/**
 * Maps camelCase field names to snake_case for Supabase
 * TODO [SUPABASE]: Use this for DB operations
 */
export const fieldMapping = {
  // Hero
  fullName: 'full_name',
  heroImageUrl: 'hero_image_url',
  ctaPrimaryLabel: 'cta_primary_label',
  ctaPrimaryHref: 'cta_primary_href',
  ctaSecondaryLabel: 'cta_secondary_label',
  ctaSecondaryHref: 'cta_secondary_href',
  
  // Common
  orderIndex: 'order_index',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  
  // And more mappings as needed...
} as const;

/**
 * Convert camelCase object to snake_case for Supabase insert/update
 */
export function toSnakeCase<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}

/**
 * Convert snake_case object from Supabase to camelCase for frontend
 */
export function toCamelCase<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}
