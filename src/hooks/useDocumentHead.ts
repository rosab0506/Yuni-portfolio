'use client';
import { useEffect } from 'react';

const SITE_NAME = 'Yuna Shimizu';
const SITE_URL = 'https://mahedihasanemon.site';
const DEFAULT_IMAGE = `${SITE_URL}/favicon.png`;

interface DocumentHeadOptions {
  title: string;
  description: string;
  /** Path relative to site root, e.g. "/about" */
  path?: string;
  image?: string;
  type?: string;
}

function setMeta(nameOrProperty: string, content: string) {
  const isOg = nameOrProperty.startsWith('og:') || nameOrProperty.startsWith('twitter:');
  const attr = isOg ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${nameOrProperty}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, nameOrProperty);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

/**
 * Sets document title, meta description, canonical URL, Open Graph, and
 * Twitter Card tags. Cleans up on unmount to restore defaults from index.html.
 */
export function useDocumentHead({ title, description, path = '/', image, type = 'website' }: DocumentHeadOptions) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    const fullUrl = `${SITE_URL}${path}`;
    const img = image || DEFAULT_IMAGE;

    // Store previous values for cleanup
    const prevTitle = document.title;

    document.title = fullTitle;
    setMeta('description', description);
    setCanonical(fullUrl);

    // Open Graph
    setMeta('og:title', fullTitle);
    setMeta('og:description', description);
    setMeta('og:url', fullUrl);
    setMeta('og:image', img);
    setMeta('og:type', type);

    // Twitter
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', img);

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, path, image, type]);
}
