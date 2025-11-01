/**
 * Core Web Vitals Optimization Utilities
 *
 * Utilities for optimizing and measuring Google Core Web Vitals:
 * - LCP (Largest Contentful Paint) - < 2.5s
 * - FID (First Input Delay) / INP (Interaction to Next Paint) - < 100ms / < 200ms
 * - CLS (Cumulative Layout Shift) - < 0.1
 * - FCP (First Contentful Paint) - < 1.8s
 * - TTFB (Time to First Byte) - < 600ms
 *
 * @module lib/performance/core-web-vitals
 */

// ============================================================================
// Types
// ============================================================================

export interface WebVitalsMetric {
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: 'navigate' | 'reload' | 'back-forward' | 'prerender';
}

export interface PerformanceConfig {
  enableReporting: boolean;
  sampleRate: number;
  debug: boolean;
  endpoint?: string;
}

// ============================================================================
// Web Vitals Thresholds
// ============================================================================

export const WEB_VITALS_THRESHOLDS = {
  LCP: {
    good: 2500,
    poor: 4000,
  },
  FID: {
    good: 100,
    poor: 300,
  },
  INP: {
    good: 200,
    poor: 500,
  },
  CLS: {
    good: 0.1,
    poor: 0.25,
  },
  FCP: {
    good: 1800,
    poor: 3000,
  },
  TTFB: {
    good: 600,
    poor: 1500,
  },
} as const;

// ============================================================================
// Rating Functions
// ============================================================================

/**
 * Get rating for a metric value
 */
export function getRating(
  metricName: WebVitalsMetric['name'],
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[metricName];

  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Check if metric meets "good" threshold
 */
export function isGoodScore(metricName: WebVitalsMetric['name'], value: number): boolean {
  return value <= WEB_VITALS_THRESHOLDS[metricName].good;
}

// ============================================================================
// Web Vitals Reporter
// ============================================================================

class WebVitalsReporter {
  private config: PerformanceConfig;
  private metrics: Map<string, WebVitalsMetric> = new Map();

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enableReporting: config.enableReporting ?? true,
      sampleRate: config.sampleRate ?? 1,
      debug: config.debug ?? false,
      endpoint: config.endpoint,
    };
  }

  /**
   * Report a metric
   */
  report(metric: WebVitalsMetric) {
    // Store metric
    this.metrics.set(metric.name, metric);

    // Debug logging
    if (this.config.debug && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(`[Web Vitals] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      });
    }

    // Sample rate check
    if (Math.random() > this.config.sampleRate) {
      return;
    }

    // Report to analytics
    if (this.config.enableReporting) {
      this.sendToAnalytics(metric);
    }

    // Store in localStorage for dashboard
    this.storeLocally(metric);
  }

  /**
   * Send metric to analytics
   */
  private sendToAnalytics(metric: WebVitalsMetric) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', metric.name, {
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
        metric_rating: metric.rating,
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Custom endpoint
    if (this.config.endpoint) {
      const url = this.config.endpoint;
      const body = JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });

      // Use sendBeacon for reliability
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, body);
      } else {
        fetch(url, {
          method: 'POST',
          body,
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        }).catch(() => {
          // Silently fail
        });
      }
    }
  }

  /**
   * Store metric locally for dashboard
   */
  private storeLocally(metric: WebVitalsMetric) {
    if (typeof window === 'undefined') return;

    try {
      const key = `web-vitals-${metric.name}`;
      const data = {
        value: metric.value,
        rating: metric.rating,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      // Ignore localStorage errors
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(): WebVitalsMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get metric by name
   */
  getMetric(name: WebVitalsMetric['name']): WebVitalsMetric | undefined {
    return this.metrics.get(name);
  }

  /**
   * Get metrics summary
   */
  getSummary() {
    const metrics = this.getMetrics();
    return {
      total: metrics.length,
      good: metrics.filter(m => m.rating === 'good').length,
      needsImprovement: metrics.filter(m => m.rating === 'needs-improvement').length,
      poor: metrics.filter(m => m.rating === 'poor').length,
      metrics: metrics.reduce((acc, metric) => {
        acc[metric.name] = {
          value: metric.value,
          rating: metric.rating,
        };
        return acc;
      }, {} as Record<string, { value: number; rating: string }>),
    };
  }
}

// Global reporter instance
let reporter: WebVitalsReporter | null = null;

/**
 * Initialize Web Vitals reporter
 */
export function initWebVitalsReporter(config?: Partial<PerformanceConfig>) {
  if (typeof window === 'undefined') return;

  reporter = new WebVitalsReporter(config);
  return reporter;
}

/**
 * Get Web Vitals reporter instance
 */
export function getWebVitalsReporter(): WebVitalsReporter {
  if (!reporter) {
    reporter = new WebVitalsReporter();
  }
  return reporter;
}

// ============================================================================
// LCP Optimization Utilities
// ============================================================================

/**
 * Preload critical images for LCP optimization
 */
export function preloadLCPImage(src: string, options?: {
  as?: 'image';
  type?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
}) {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = options?.as || 'image';
  link.href = src;

  if (options?.type) {
    link.type = options.type;
  }

  if (options?.fetchPriority) {
    link.setAttribute('fetchpriority', options.fetchPriority);
  }

  document.head.appendChild(link);
}

/**
 * Preconnect to external domains for faster resource loading
 */
export function preconnect(domains: string[]) {
  if (typeof document === 'undefined') return;

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * DNS prefetch for external domains
 */
export function dnsPrefetch(domains: string[]) {
  if (typeof document === 'undefined') return;

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
}

// ============================================================================
// CLS Optimization Utilities
// ============================================================================

/**
 * Calculate aspect ratio for images to prevent CLS
 */
export function calculateAspectRatio(width: number, height: number): string {
  return `${width} / ${height}`;
}

/**
 * Get placeholder for images to prevent CLS
 */
export function getImagePlaceholder(width: number, height: number, color = '#e0e0e0'): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='${color}'/%3E%3C/svg%3E`;
}

/**
 * Reserve space for dynamic content to prevent CLS
 */
export function reserveSpace(minHeight: number): React.CSSProperties {
  return {
    minHeight: `${minHeight}px`,
    contentVisibility: 'auto',
  };
}

// ============================================================================
// FID/INP Optimization Utilities
// ============================================================================

/**
 * Defer non-critical JavaScript execution
 */
export function deferExecution<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 0
): (...args: Parameters<T>) => void {
  return (...args: Parameters<T>) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => fn(...args), { timeout: 1000 + delay });
    } else {
      setTimeout(() => fn(...args), delay);
    }
  };
}

/**
 * Debounce function for input handlers
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

/**
 * Throttle function for scroll/resize handlers
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================================
// Performance Monitoring
// ============================================================================

interface LayoutShift extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

/**
 * Monitor long tasks that can impact INP
 */
export function monitorLongTasks(callback: (duration: number) => void) {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Long tasks are > 50ms
      if (entry.duration > 50) {
        callback(entry.duration);
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['longtask'] });
  } catch (error) {
    // Long task API not supported
  }

  return () => observer.disconnect();
}

/**
 * Monitor layout shifts
 */
export function monitorLayoutShifts(callback: (shift: number) => void) {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if ((entry as LayoutShift).hadRecentInput) continue;
      callback((entry as LayoutShift).value);
    }
  });

  try {
    observer.observe({ entryTypes: ['layout-shift'] });
  } catch (error) {
    // Layout shift API not supported
  }

  return () => observer.disconnect();
}

// ============================================================================
// Resource Hints
// ============================================================================

/**
 * Generate resource hints for critical resources
 */
export function getResourceHints() {
  return {
    preconnect: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com',
    ],
    dnsPrefetch: [
      'https://www.googletagmanager.com',
      'https://maps.googleapis.com',
    ],
  };
}

// ============================================================================
// Performance Budget
// ============================================================================

export const PERFORMANCE_BUDGET = {
  // Time budgets (milliseconds)
  time: {
    LCP: 2500,
    FID: 100,
    INP: 200,
    FCP: 1800,
    TTFB: 600,
  },
  // Size budgets (kilobytes)
  size: {
    totalPageSize: 1500,
    javascript: 350,
    css: 100,
    images: 800,
    fonts: 100,
    other: 150,
  },
  // Request count budgets
  requests: {
    total: 50,
    javascript: 10,
    css: 5,
    images: 25,
    fonts: 5,
    other: 5,
  },
} as const;

/**
 * Check if performance budget is met
 */
export function checkPerformanceBudget(metrics: {
  LCP?: number;
  FID?: number;
  INP?: number;
  FCP?: number;
  TTFB?: number;
}) {
  const results: Record<string, boolean> = {};

  Object.entries(metrics).forEach(([metric, value]) => {
    if (value !== undefined) {
      const budget = PERFORMANCE_BUDGET.time[metric as keyof typeof PERFORMANCE_BUDGET.time];
      results[metric] = value <= budget;
    }
  });

  return {
    passed: Object.values(results).every(Boolean),
    results,
  };
}

// ============================================================================
// Export reporter utilities
// ============================================================================

export const webVitalsReporter = {
  init: initWebVitalsReporter,
  get: getWebVitalsReporter,
  report: (metric: WebVitalsMetric) => getWebVitalsReporter().report(metric),
  getMetrics: () => getWebVitalsReporter().getMetrics(),
  getSummary: () => getWebVitalsReporter().getSummary(),
};
