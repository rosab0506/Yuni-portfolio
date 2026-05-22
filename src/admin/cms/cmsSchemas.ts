/**
 * CMS Schema Definitions
 * 
 * Defines the structure of all CMS content types.
 * These schemas drive the admin UI forms and map to database tables.
 * 
 * IMPORTANT CONVENTIONS:
 * - All collections MUST have: id, status, orderIndex, createdAt, updatedAt
 * - All singletons MUST have: id, updatedAt
 * - Field names use camelCase (will be converted to snake_case for Supabase)
 * - URL fields ending with 'Url' are validated as URLs
 * - Image fields use 'image' type for file upload UI
 * 
 * STORAGE FIELDS:
 * - Fields with storageField: true will use Supabase Storage
 * - storageBucket specifies which bucket to use: 'images' | 'resumes' | 'documents' | 'gallery'
 * - Currently works with URLs/base64; will auto-upload to Supabase when configured
 * 
 * TODO [SUPABASE]: Schemas will be validated against Supabase table definitions
 * TODO [SANITIZATION]: Fields marked with 'textarea' containing HTML need sanitization
 */

import type { StorageBucket } from '../../services/storage.service';

export type FieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'date' | 'list' | 'image' | 'url' | 'file' | 'socialLinks' | 'select';

export type FieldSchema = {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: string[]; // For select fields
  placeholder?: string;
  /** Field contains HTML that must be sanitized when displayed */
  htmlContent?: boolean;
  /** Field is a Supabase Storage URL - files will be uploaded to storage */
  storageField?: boolean;
  /** Storage bucket for file uploads: 'images' | 'resumes' | 'documents' | 'gallery' */
  storageBucket?: StorageBucket;
  /** Accepted file types for upload (e.g., 'image/*', '.pdf') */
  acceptedTypes?: string;
  /** Maximum file size in MB */
  maxSizeMB?: number;
};

export type SectionSchema = {
  key: string;
  title: string;
  kind: 'singleton' | 'collection';
  fields: FieldSchema[];
  /** Supabase table name (defaults to key with snake_case) */
  tableName?: string;
};

export const sectionSchemas: Record<string, SectionSchema> = {
  hero: {
    key: 'hero',
    title: 'Hero',
    kind: 'singleton',
    tableName: 'cms_hero',
    fields: [
      { name: 'fullName', label: 'Full Name', required: true },
      { name: 'headline', label: 'Headline', required: true },
      { name: 'subheadline', label: 'Subheadline', type: 'textarea' },
      { name: 'heroImageUrl', label: 'Hero Image', type: 'image', placeholder: 'Upload a professional photo for the hero section', storageField: true, storageBucket: 'images', acceptedTypes: 'image/*', maxSizeMB: 5 },
      { name: 'ctaPrimaryLabel', label: 'Primary Button Label' },
      { name: 'ctaPrimaryHref', label: 'Primary Button Link' },
      { name: 'ctaSecondaryLabel', label: 'Secondary Button Label' },
      { name: 'ctaSecondaryHref', label: 'Secondary Button Link' },
    ],
  },
  about: {
    key: 'about',
    title: 'About',
    kind: 'singleton',
    tableName: 'cms_about',
    fields: [
      { name: 'fullName', label: 'Full Name', required: true },
      { name: 'tagline', label: 'Tagline', type: 'textarea' },
      { name: 'title', label: 'Title', required: true },
      { name: 'bio', label: 'Bio', type: 'textarea', required: true, htmlContent: true },
      { name: 'profileImageUrl', label: 'Profile Image', type: 'image', storageField: true, storageBucket: 'images', acceptedTypes: 'image/*', maxSizeMB: 5 },
      { name: 'currentRole', label: 'Current Role' },
      { name: 'researchInterest', label: 'Research Interest' },
    ],
  },
  contact: {
    key: 'contact',
    title: 'Contact',
    kind: 'singleton',
    tableName: 'cms_contact',
    fields: [
      { name: 'pageIntroText', label: 'Contact Page Intro', type: 'textarea' },
      { name: 'contactInfo.email', label: 'Email', required: true },
      { name: 'contactInfo.phone', label: 'Phone' },
      { name: 'contactInfo.location', label: 'Location' },
      { name: 'socialLinks', label: 'Social Links', type: 'socialLinks' },
      { name: 'hireMeLabel', label: 'Hire Me Label' },
    ],
  },
  resumeSettings: {
    key: 'resumeSettings',
    title: 'Resume Settings',
    kind: 'singleton',
    tableName: 'cms_resume_settings',
    fields: [{ name: 'activeResumeId', label: 'Active Resume ID' }],
  },
  education: {
    key: 'education',
    title: 'Education',
    kind: 'collection',
    fields: [
      { name: 'status', label: 'Status', required: true },
      { name: 'orderIndex', label: 'Order Index', type: 'number' },
      { name: 'institution', label: 'Institution', required: true, placeholder: 'e.g., Harvard University' },
      { name: 'degree', label: 'Degree', required: true, placeholder: 'e.g., Bachelor of Science' },
      { name: 'field', label: 'Field of Study', required: true, placeholder: 'e.g., Computer Science' },
      { name: 'grade', label: 'Grade (Optional)', type: 'text', placeholder: 'e.g., 3.8 GPA, First Class Honours, Cum Laude' },
      { name: 'activities', label: 'Activities & Societies (Optional)', type: 'textarea', placeholder: 'e.g., Chess Club, Student Government, Dean\'s List' },
      { name: 'description', label: 'Description (Optional)', type: 'textarea', placeholder: 'Describe your studies, achievements, or thesis...' },
      { name: 'startDate', label: 'Start Date', type: 'date' },
      { name: 'endDate', label: 'End Date (or expected)', type: 'date' },
    ],
  },
  skills: {
    key: 'skills',
    title: 'Skills',
    kind: 'collection',
    fields: [
      { name: 'status', label: 'Status', required: true },
      { name: 'orderIndex', label: 'Order Index', type: 'number' },
      { name: 'name', label: 'Skill Name', required: true },
      { name: 'level', label: 'Level', type: 'number' },
    ],
  },
  services: {
    key: 'services',
    title: 'Services',
    kind: 'collection',
    fields: [
      { name: 'status', label: 'Status', required: true },
      { name: 'orderIndex', label: 'Order Index', type: 'number' },
      { name: 'title', label: 'Title', required: true },
      { name: 'summary', label: 'Summary', type: 'textarea' },
    ],
  },
  resumes: {
    key: 'resumes',
    title: 'Resumes',
    kind: 'collection',
    fields: [
      { name: 'status', label: 'Status', required: true },
      { name: 'title', label: 'Title', required: true },
      { name: 'fileUrl', label: 'Resume File', type: 'file', required: true, storageField: true, storageBucket: 'resumes', acceptedTypes: '.pdf,.doc,.docx', maxSizeMB: 10 },
      { name: 'uploadedAt', label: 'Uploaded At', type: 'date' },
    ],
  },
  projects: {
    key: 'projects',
    title: 'Projects',
    kind: 'collection',
    fields: [
      { name: 'status', label: 'Status', required: true },
      { name: 'orderIndex', label: 'Order Index', type: 'number' },
      { name: 'slug', label: 'Slug', required: true },
      { name: 'title', label: 'Title', required: true },
      { name: 'summary', label: 'Summary', type: 'textarea', required: true },
      { name: 'description', label: 'Description', type: 'textarea', htmlContent: true },
      { name: 'coverImageUrl', label: 'Cover Image', type: 'image', storageField: true, storageBucket: 'images', acceptedTypes: 'image/*', maxSizeMB: 5 },
      { name: 'galleryImages', label: 'Gallery Images (comma separated)', type: 'list', storageField: true, storageBucket: 'gallery' },
      { name: 'githubUrl', label: 'GitHub URL' },
      { name: 'liveDemoUrl', label: 'Live Demo URL' },
      { name: 'techStack', label: 'Tech Stack (comma separated)', type: 'list' },
      { name: 'featured', label: 'Featured', type: 'checkbox' },
    ],
  },
  publications: {
    key: 'publications',
    title: 'Publications',
    kind: 'collection',
    fields: [
      { name: 'status', label: 'Status', required: true },
      { name: 'orderIndex', label: 'Order Index', type: 'number' },
      { name: 'slug', label: 'Slug', required: true },
      { name: 'title', label: 'Title', required: true },
      { name: 'authors', label: 'Authors (comma separated)', type: 'list', required: true },
      { name: 'venue', label: 'Venue', required: true },
      { name: 'year', label: 'Year', required: true },
      { name: 'abstract', label: 'Abstract', type: 'textarea' },
      { name: 'paperUrl', label: 'Paper URL' },
      { name: 'pdfUrl', label: 'PDF File', type: 'file', storageField: true, storageBucket: 'documents', acceptedTypes: '.pdf', maxSizeMB: 20 },
      { name: 'coverImageUrl', label: 'Cover Image', type: 'image', storageField: true, storageBucket: 'images', acceptedTypes: 'image/*', maxSizeMB: 5 },
      { name: 'citation', label: 'Citation', type: 'textarea' },
    ],
  },
  certifications: {
    key: 'certifications',
    title: 'Certifications',
    kind: 'collection',
    fields: [
      { name: 'status', label: 'Status', required: true },
      { name: 'orderIndex', label: 'Order Index', type: 'number' },
      { name: 'certificateTitle', label: 'Certificate Title', required: true },
      { name: 'issuer', label: 'Issuer', required: true },
      { name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
      { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
      { name: 'credentialId', label: 'Credential ID' },
      { name: 'credentialUrl', label: 'Credential URL' },
      { name: 'certificateImageUrl', label: 'Certificate Image', type: 'image', storageField: true, storageBucket: 'images', acceptedTypes: 'image/*', maxSizeMB: 5 },
      { name: 'certificateFileUrl', label: 'Certificate File', type: 'file', storageField: true, storageBucket: 'documents', acceptedTypes: '.pdf,.png,.jpg,.jpeg', maxSizeMB: 10 },
    ],
  },
  experience: {
    key: 'experience',
    title: 'Experience',
    kind: 'collection',
    fields: [
      { name: 'status', label: 'Status', required: true },
      { name: 'orderIndex', label: 'Order Index', type: 'number' },
      { name: 'company', label: 'Company', required: true },
      { name: 'role', label: 'Role', required: true },
      { name: 'startDate', label: 'Start Date', type: 'date' },
      { name: 'endDate', label: 'End Date', type: 'date' },
      { name: 'description', label: 'Description', type: 'textarea', htmlContent: true },
    ],
  },
  blogs: {
    key: 'blogs',
    title: 'Blogs',
    kind: 'collection',
    fields: [
      { name: 'status', label: 'Status', required: true },
      { name: 'orderIndex', label: 'Order Index', type: 'number' },
      { name: 'title', label: 'Title', required: true },
      { name: 'slug', label: 'Slug', required: true },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      // IMPORTANT: Blog content is user-generated HTML - MUST be sanitized before display
      { name: 'content', label: 'Content', type: 'textarea', htmlContent: true },
      { name: 'coverImageUrl', label: 'Cover Image', type: 'image', storageField: true, storageBucket: 'images', acceptedTypes: 'image/*', maxSizeMB: 5 },
      { name: 'author', label: 'Author' },
      { name: 'publishedDate', label: 'Published Date', type: 'date' },
      { name: 'readTime', label: 'Read Time (minutes)', type: 'number' },
      { name: 'tags', label: 'Tags (comma separated)', type: 'list' },
    ],
  },
  testimonials: {
    key: 'testimonials',
    title: 'Testimonials',
    kind: 'collection',
    fields: [
      { name: 'status', label: 'Status', required: true },
      { name: 'orderIndex', label: 'Order Index', type: 'number' },
      { name: 'author', label: 'Author', required: true },
      { name: 'quote', label: 'Quote', type: 'textarea', required: true },
    ],
  },
  achievements: {
    key: 'achievements',
    title: 'Achievements',
    kind: 'collection',
    fields: [
      { name: 'status', label: 'Status', required: true },
      { name: 'orderIndex', label: 'Order Index', type: 'number' },
      { name: 'title', label: 'Title', required: true },
      { name: 'issuer', label: 'Issuer', required: true },
      { name: 'year', label: 'Year', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'certificateImageUrl', label: 'Certificate Image', type: 'image', storageField: true, storageBucket: 'images', acceptedTypes: 'image/*', maxSizeMB: 5 },
      { name: 'certificateFileUrl', label: 'Certificate File', type: 'file', storageField: true, storageBucket: 'documents', acceptedTypes: '.pdf,.png,.jpg,.jpeg', maxSizeMB: 10 },
      { name: 'externalLink', label: 'External Link' },
    ],
  },
  clients: {
    key: 'clients',
    title: 'Clients',
    kind: 'collection',
    fields: [
      { name: 'status', label: 'Status', required: true },
      { name: 'orderIndex', label: 'Order Index', type: 'number' },
      { name: 'featured', label: 'Featured Client', type: 'checkbox' },
      { name: 'name', label: 'Company Name', required: true },
      { name: 'industry', label: 'Industry', type: 'select', options: ['Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'Media', 'Government', 'Non-profit', 'Startup', 'Enterprise', 'Other'] },
      { name: 'logoUrl', label: 'Company Logo', type: 'image', storageField: true, storageBucket: 'images', acceptedTypes: 'image/*', maxSizeMB: 2 },
      { name: 'websiteUrl', label: 'Website URL', type: 'url', placeholder: 'https://example.com' },
      { name: 'description', label: 'Project Description', type: 'textarea', placeholder: 'Brief description of your work with this client...' },
      { name: 'projectDuration', label: 'Project Duration', placeholder: 'e.g., Jan 2023 - Dec 2023' },
    ],
  },
  techStackCategories: {
    key: 'techStackCategories',
    title: 'Tech Stack Categories',
    kind: 'collection',
    tableName: 'tech_stack_categories',
    fields: [
      { name: 'status', label: 'Status', required: true },
      { name: 'orderIndex', label: 'Order Index', type: 'number' },
      { name: 'categoryName', label: 'Category Name', required: true },
    ],
  },
};

export const sectionList = Object.values(sectionSchemas);

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get schema by key with type safety
 */
export function getSchema(key: string): SectionSchema | undefined {
  return sectionSchemas[key];
}

/**
 * Get all fields that require HTML sanitization
 */
export function getHtmlFields(schema: SectionSchema): FieldSchema[] {
  return schema.fields.filter(field => field.htmlContent);
}

/**
 * Get all fields that use Supabase Storage
 */
export function getStorageFields(schema: SectionSchema): FieldSchema[] {
  return schema.fields.filter(field => field.storageField);
}

/**
 * Check if a schema has a slug field (for URL routing)
 */
export function hasSluggableField(schema: SectionSchema): boolean {
  return schema.fields.some(field => field.name === 'slug');
}
