/**
 * Web Vitals Monitoring
 * Track Core Web Vitals and custom performance metrics
 */

import type { Metric } from 'web-vitals';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

// Types
export type WebVitalsMetric = Metric;

export interface CustomMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
  navigationType?: string;
}

/**
 * Send metrics to analytics endpoint
 */
function sendToAnalytics(metric: Metric | CustomMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vital:', metric.name, Math.round(metric.value), metric);
  }

  // Send to analytics service (Google Analytics, Vercel Analytics, etc.)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Send to custom analytics endpoint
  if (typeof window !== 'undefined' && navigator.sendBeacon) {
    const body = JSON.stringify({
      metric: metric.name,
      value: Math.round(metric.value),
      rating: getRating(metric.name, metric.value),
      page: window.location.pathname,
      timestamp: Date.now(),
    });

    navigator.sendBeacon('/api/analytics/web-vitals', body);
  }
}

/**
 * Get rating for a metric
 */
function getRating(
  name: string,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, [number, number]> = {
    CLS: [0.1, 0.25],
    FCP: [1800, 3000],
    FID: [100, 300],
    LCP: [2500, 4000],
    TTFB: [800, 1800],
    INP: [200, 500],
  };

  const [good, needsImprovement] = thresholds[name] || [0, Infinity];

  if (value <= good) return 'good';
  if (value <= needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * Initialize Web Vitals tracking
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  // Core Web Vitals
  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onINP(sendToAnalytics); // Replaced FID with INP (newer metric)
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);

  // Track custom metrics
  trackCustomMetrics();
}

/**
 * Track custom performance metrics
 */
function trackCustomMetrics() {
  if (typeof window === 'undefined' || !window.performance) return;

  // Time to Interactive (TTI)
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.name === 'TTI') {
          sendToAnalytics({
            name: 'TTI',
            value: entry.duration,
            rating: getRating('TTI', entry.duration),
            id: `v3-${Date.now()}-${Math.random()}`,
          });
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });
  }

  // Page Load Time
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navTiming = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navTiming) {
        const pageLoadTime = navTiming.loadEventEnd - navTiming.fetchStart;
        sendToAnalytics({
          name: 'PageLoad',
          value: pageLoadTime,
          rating: getRating('PageLoad', pageLoadTime),
          id: `v3-${Date.now()}-${Math.random()}`,
        });
      }
    }, 0);
  });

  // Component Mount Time
  trackComponentMetrics();
}

/**
 * Track component-specific metrics
 */
function trackComponentMetrics() {
  if (typeof window === 'undefined') return;

  // Create a custom mark when components mount
  window.__componentMetrics = {
    mark: (name: string) => {
      performance.mark(`component-${name}-start`);
    },
    measure: (name: string) => {
      try {
        performance.mark(`component-${name}-end`);
        performance.measure(
          `component-${name}`,
          `component-${name}-start`,
          `component-${name}-end`
        );

        const measure = performance.getEntriesByName(`component-${name}`)[0];
        if (measure) {
          sendToAnalytics({
            name: `Component_${name}`,
            value: measure.duration,
            rating: getRating('Component', measure.duration),
            id: `v3-${Date.now()}-${Math.random()}`,
          });
        }
      } catch (error) {
        console.warn('Error measuring component:', error);
      }
    },
  };
}

/**
 * Report custom metric
 */
export function reportMetric(name: string, value: number) {
  sendToAnalytics({
    name,
    value,
    rating: getRating(name, value),
    id: `v3-${Date.now()}-${Math.random()}`,
  });
}

/**
 * Track API call performance
 */
export function trackAPICall(
  endpoint: string,
  duration: number,
  _success: boolean
) {
  sendToAnalytics({
    name: 'API_Call',
    value: duration,
    rating: getRating('API', duration),
    id: `${endpoint}-${Date.now()}`,
  });
}

/**
 * Track resource loading
 */
export function trackResourceLoad(resourceType: string, duration: number) {
  sendToAnalytics({
    name: `Resource_${resourceType}`,
    value: duration,
    rating: getRating('Resource', duration),
    id: `v3-${Date.now()}-${Math.random()}`,
  });
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    __componentMetrics?: {
      mark: (name: string) => void;
      measure: (name: string) => void;
    };
  }
}

// Export for use in _app.js
export { sendToAnalytics as reportWebVitals };
