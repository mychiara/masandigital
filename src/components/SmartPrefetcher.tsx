'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SmartPrefetcher() {
  const router = useRouter();

  useEffect(() => {
    // Keep a cache of prefetched URLs during this session to avoid redundant fetches
    const prefetchedUrls = new Set<string>();

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (!href) return;

      // Only prefetch internal links belonging to the site origin
      const isInternal = href.startsWith('/') || href.startsWith(window.location.origin);
      if (!isInternal) return;

      // Avoid prefetching admin dashboards, login, API endpoints, or anchor hashes
      const isExempt = 
        href.includes('/admin') || 
        href.includes('/login') || 
        href.startsWith('/#') || 
        href.startsWith('javascript:') ||
        href.includes('/api/');
      if (isExempt) return;

      // Normalize target path
      const path = href.startsWith('/') ? href : href.replace(window.location.origin, '');
      
      if (prefetchedUrls.has(path)) return;
      prefetchedUrls.add(path);
      
      // Next.js client-side prefetching
      router.prefetch(path);
    };

    // Use passive listener for best scroll performance
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [router]);

  return null;
}
