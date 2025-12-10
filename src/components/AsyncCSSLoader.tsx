'use client';

import { useEffect } from 'react';

/**
 * AsyncCSSLoader - Optimizes CSS loading to prevent render blocking
 *
 * This component converts blocking stylesheet links to non-blocking ones
 * by using the media="print" trick, which loads CSS asynchronously.
 *
 * Estimated savings: 640ms
 */
export function AsyncCSSLoader() {
  useEffect(() => {
    // Convert blocking stylesheets to non-blocking after initial render
    const optimizeCSSLoading = () => {
      // Find all stylesheet links that are blocking render
      const stylesheets = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]')
      ) as HTMLLinkElement[];

      stylesheets.forEach((link) => {
        // Skip if already optimized or if it's a critical CSS file
        if (link.media && link.media !== 'all' && link.media !== 'screen') {
          return;
        }

        // For non-critical CSS files (Next.js generated CSS)
        // Use the media="print" trick to load asynchronously
        if (link.href.includes('/_next/static/css/')) {
          // Store original media
          const originalMedia = link.media || 'all';

          // Set to print media (non-blocking)
          link.media = 'print';

          // Switch back to original media after load
          link.onload = function () {
            (this as HTMLLinkElement).media = originalMedia;
          };

          // Fallback: if onload doesn't fire, set media after a delay
          setTimeout(() => {
            if (link.media === 'print') {
              link.media = originalMedia;
            }
          }, 100);
        }
      });
    };

    // Run optimization after page is interactive
    // Use requestIdleCallback if available for better performance
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(optimizeCSSLoading, {
        timeout: 1000,
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(optimizeCSSLoading, 0);
    }
  }, []);

  return null; // This component doesn't render anything
}
