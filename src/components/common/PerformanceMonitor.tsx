'use client';

import { useEffect } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

/**
 * PerformanceMonitor Component
 * Monitors Core Web Vitals and reports performance metrics
 * Helps track LCP, FID, CLS, FCP, and TTFB for optimization
 */
export const PerformanceMonitor = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    const reportMetric = (metric: Record<string, unknown>) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${metric.name}:`, {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
        });
      }

      // Send to analytics in production
      if (process.env.NODE_ENV === 'production') {
        // Send to Vercel Analytics
        if (typeof window !== 'undefined' && (window as any).va) {
          (window as any).va('track', 'web-vital', {
            name: metric.name,
            value: Math.round(metric.value),
            rating: metric.rating,
          });
        }

        // Send to Google Analytics if available
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.value),
            non_interaction: true,
          });
        }
      }
    };

    // Monitor all Core Web Vitals
    getCLS(reportMetric);
    getFID(reportMetric);
    getFCP(reportMetric);
    getLCP(reportMetric);
    getTTFB(reportMetric);

    // Monitor additional performance metrics
    if (typeof window !== 'undefined') {
      // Monitor First Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-paint') {
            reportMetric({
              name: 'FP',
              value: entry.startTime,
              rating: entry.startTime < 1000 ? 'good' : entry.startTime < 2500 ? 'needs-improvement' : 'poor',
              delta: entry.startTime,
              id: 'fp',
            });
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });

      // Monitor Resource Loading
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resource = entry as PerformanceResourceTiming;
            if (resource.duration > 1000) { // Log slow resources (>1s)
              console.warn(`[Performance] Slow resource: ${resource.name} (${Math.round(resource.duration)}ms)`);
            }
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });

      return () => {
        observer.disconnect();
        resourceObserver.disconnect();
      };
    }
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
