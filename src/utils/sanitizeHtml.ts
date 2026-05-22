/**
 * HTML Sanitization Utility
 * 
 * Provides safe HTML rendering for user-generated content.
 * CRITICAL for security when displaying content from CMS/database.
 * 
 * USAGE:
 *   import { sanitizeHtml, stripHtml } from '../utils/sanitizeHtml';
 *   
 *   // For rendering HTML safely:
 *   <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
 *   
 *   // For plain text extraction:
 *   <p>{stripHtml(content)}</p>
 * 
 * TODO [SUPABASE]: This utility is REQUIRED when real user data is stored.
 * Install DOMPurify: npm install dompurify && npm install -D @types/dompurify
 */

// ============================================================================
// Configuration
// ============================================================================

/**
 * Allowed HTML tags for sanitized content.
 * Restrictive by default - add more as needed for your use case.
 */
const ALLOWED_TAGS = [
  // Text formatting
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup',
  // Headings
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  // Lists
  'ul', 'ol', 'li',
  // Links (with restrictions)
  'a',
  // Code
  'code', 'pre', 'kbd',
  // Quotes
  'blockquote', 'q', 'cite',
  // Horizontal rule
  'hr',
  // Spans for styling
  'span', 'div',
];

/**
 * Allowed attributes for sanitized content.
 */
const ALLOWED_ATTRS = [
  'href', 'target', 'rel', 'class', 'id',
  'title', 'alt', 'aria-label', 'aria-hidden',
];

/**
 * Allowed URL protocols for links.
 */
const ALLOWED_PROTOCOLS = ['http', 'https', 'mailto', 'tel'];

// ============================================================================
// Sanitization Functions
// ============================================================================

/**
 * Check if DOMPurify is available.
 * Returns false during SSR or if not installed.
 */
function isDOMPurifyAvailable(): boolean {
  return typeof window !== 'undefined' && 'DOMPurify' in window;
}

/**
 * Sanitize HTML content for safe rendering.
 * 
 * IMPORTANT: Install DOMPurify for production use:
 *   npm install dompurify
 *   npm install -D @types/dompurify
 * 
 * Then uncomment the DOMPurify import and implementation below.
 * 
 * @param html - Raw HTML string from CMS/database
 * @returns Sanitized HTML safe for dangerouslySetInnerHTML
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';
  
  // Trim whitespace
  const trimmed = html.trim();
  if (!trimmed) return '';
  
  /**
   * PRODUCTION IMPLEMENTATION (uncomment when DOMPurify is installed):
   * 
   * import DOMPurify from 'dompurify';
   * 
   * return DOMPurify.sanitize(trimmed, {
   *   ALLOWED_TAGS,
   *   ALLOWED_ATTR: ALLOWED_ATTRS,
   *   ALLOWED_URI_REGEXP: new RegExp(`^(?:${ALLOWED_PROTOCOLS.join('|')}):`, 'i'),
   *   KEEP_CONTENT: true,
   *   RETURN_DOM: false,
   *   RETURN_DOM_FRAGMENT: false,
   * });
   */
  
  /**
   * FALLBACK IMPLEMENTATION (basic sanitization without DOMPurify)
   * 
   * WARNING: This is NOT as secure as DOMPurify. Use only for development
   * with trusted mock data. Install DOMPurify before going to production!
   */
  return basicSanitize(trimmed);
}

/**
 * Basic HTML sanitization fallback.
 * 
 * WARNING: This is a minimal implementation for development only.
 * It does NOT provide the same level of security as DOMPurify.
 * DO NOT rely on this for production with untrusted user content.
 */
function basicSanitize(html: string): string {
  // Create a temporary element to parse HTML
  if (typeof document === 'undefined') {
    // SSR fallback - strip all HTML
    return stripHtml(html);
  }
  
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Remove script tags and event handlers
  const scripts = temp.querySelectorAll('script, style, iframe, object, embed, form');
  scripts.forEach(el => el.remove());
  
  // Remove event handlers from all elements
  const allElements = temp.querySelectorAll('*');
  allElements.forEach(el => {
    // Remove event handler attributes
    const attrs = Array.from(el.attributes);
    attrs.forEach(attr => {
      const name = attr.name.toLowerCase();
      // Remove on* event handlers
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
      // Remove javascript: URLs
      if (name === 'href' || name === 'src' || name === 'action') {
        const value = attr.value.toLowerCase().trim();
        if (value.startsWith('javascript:') || value.startsWith('data:')) {
          el.removeAttribute(attr.name);
        }
      }
    });
  });
  
  return temp.innerHTML;
}

/**
 * Strip all HTML tags and return plain text.
 * Useful for excerpts, meta descriptions, and plain text displays.
 * 
 * @param html - HTML string
 * @returns Plain text with HTML tags removed
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  
  // SSR-safe implementation
  if (typeof document === 'undefined') {
    // Basic regex fallback for SSR
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace nbsp
      .replace(/&amp;/g, '&')  // Replace ampersand
      .replace(/&lt;/g, '<')   // Replace less than
      .replace(/&gt;/g, '>')   // Replace greater than
      .replace(/&quot;/g, '"') // Replace quotes
      .replace(/&#39;/g, "'")  // Replace apostrophe
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();
  }
  
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return (temp.textContent || temp.innerText || '').trim();
}

/**
 * Truncate HTML content safely.
 * Strips HTML, truncates, and adds ellipsis.
 * 
 * @param html - HTML string
 * @param maxLength - Maximum character length
 * @returns Truncated plain text
 */
export function truncateHtml(html: string | null | undefined, maxLength: number): string {
  const text = stripHtml(html);
  if (text.length <= maxLength) return text;
  
  // Find last space before maxLength to avoid cutting words
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.7) {
    return truncated.slice(0, lastSpace).trim() + '...';
  }
  
  return truncated.trim() + '...';
}

/**
 * Check if a string contains HTML tags.
 * 
 * @param str - String to check
 * @returns true if string contains HTML
 */
export function containsHtml(str: string | null | undefined): boolean {
  if (!str) return false;
  return /<[a-z][\s\S]*>/i.test(str);
}

// ============================================================================
// Export configuration for external use
// ============================================================================

export const SANITIZE_CONFIG = {
  ALLOWED_TAGS,
  ALLOWED_ATTRS,
  ALLOWED_PROTOCOLS,
} as const;
