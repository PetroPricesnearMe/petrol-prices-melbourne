/**
 * Resource Hints Component
 * Prefetch and preconnect critical resources for faster navigation
 * Optimized for Vercel deployment
 */

'use client';

import { useEffect } from 'react';

import { env } from '@/lib/env';

// ============================================================================
// TYPES
// ============================================================================

interface ResourceHintsProps {
  /** URLs to prefetch */
  prefetchUrls?: string[];
  /** Domains to preconnect */
  preconnectDomains?: string[];
  /** DNS prefetch domains */
  dnsPrefetchDomains?: string[];
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Resource Hints for performance optimization
 * Prefetches critical pages and preconnects to external domains
 */
export function ResourceHints({
  prefetchUrls = [],
  preconnectDomains = [],
  dnsPrefetchDomains = [],
}: ResourceHintsProps) {
  useEffect(() => {
    // Default critical pages to prefetch
    const defaultPrefetchUrls = ['/directory', '/fuel-price-trends', '/about'];

    const urlsToPrefetch = [...defaultPrefetchUrls, ...prefetchUrls];

    // Prefetch critical pages
    urlsToPrefetch.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'document';
      link.href = `${env.appUrl}${url}`;
      document.head.appendChild(link);
    });

    // Preconnect to external domains
    const defaultPreconnectDomains = [
      'https://api.baserow.io',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    [...defaultPreconnectDomains, ...preconnectDomains].forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // DNS prefetch
    const defaultDnsPrefetch = [
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
    ];

    [...defaultDnsPrefetch, ...dnsPrefetchDomains].forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }, [prefetchUrls, preconnectDomains, dnsPrefetchDomains]);

  return null; // This component doesn't render anything
}

export default ResourceHints;
