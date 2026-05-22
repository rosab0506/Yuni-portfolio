'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollToTop - Automatically scrolls to top on route change
 * Place this component inside BrowserRouter
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}
