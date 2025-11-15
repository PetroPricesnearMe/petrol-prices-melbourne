/**
 * Core Web Vitals Tracking and Monitoring
 *
 * Comprehensive tracking of Core Web Vitals metrics:
 * - LCP (Largest Contentful Paint)
 * - CLS (Cumulative Layout Shift)
 * - FID (First Input Delay) / INP (Interaction to Next Paint)
 * - TTFB (Time to First Byte)
 * - FCP (First Contentful Paint)
 *
 * @module lib/performance/core-web-vitals
 */

/**
 * Core Web Vitals Metric Types
 */
export interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
  delta?: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  navigationType?: string;
}

/**
 * Core Web Vitals Thresholds (Google's recommended values)
 */
export const WEB_VITALS_THRESHOLDS = {
  LCP: {
    good: 2500, // 2.5 seconds
    needsImprovement: 4000, // 4 seconds
  },
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  FID: {
    good: 100, // 100 milliseconds
    needsImprovement: 300, // 300 milliseconds
  },
  INP: {
    good: 200, // 200 milliseconds
    needsImprovement: 500, // 500 milliseconds
  },
  TTFB: {
    good: 600, // 600 milliseconds
    needsImprovement: 800, // 800 milliseconds
  },
  FCP: {
    good: 1800, // 1.8 seconds
    needsImprovement: 3000, // 3 seconds
  },
} as const;

/**
 * Get rating for a Web Vital metric
 */
export function getMetricRating(
  name: string,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds =
    WEB_VITALS_THRESHOLDS[name as keyof typeof WEB_VITALS_THRESHOLDS];

  if (!thresholds) {
    return 'good';
  }

  if (value <= thresholds.good) {
    return 'good';
  }

  if (value <= thresholds.needsImprovement) {
    return 'needs-improvement';
  }

  return 'poor';
}

/**
 * Track Web Vital metric
 */
export function trackWebVital(metric: WebVitalMetric): void {
  if (typeof window === 'undefined') {
    return;
  }

  const rating = getMetricRating(metric.name, metric.value);

  // Send to Google Analytics (if available)
  if (typeof (window as any).gtag !== 'undefined') {
    (window as any).gtag('event', metric.name, {
      value: Math.round(
        metric.name === 'CLS' ? metric.value * 1000 : metric.value
      ),
      event_label: metric.id,
      event_category: 'Web Vitals',
      event_value: Math.round(metric.value),
      non_interaction: true,
      metric_rating: rating,
      metric_delta: metric.delta,
    });
  }

  // Send to Vercel Analytics (automatic with @vercel/analytics)
  // The Analytics component handles this automatically

  // Store in localStorage for debugging
  try {
    if (typeof localStorage !== 'undefined') {
      const metrics = JSON.parse(localStorage.getItem('web-vitals') || '{}');
      metrics[metric.name] = {
        value: metric.value,
        id: metric.id,
        rating,
        timestamp: Date.now(),
        delta: metric.delta,
      };
      localStorage.setItem('web-vitals', JSON.stringify(metrics));
    }
  } catch (error) {
    // Ignore localStorage errors
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to store Web Vital metric:', error);
    }
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    const displayValue =
      metric.name === 'CLS'
        ? (metric.value * 1000).toFixed(2) + ' (scaled)'
        : Math.round(metric.value) + 'ms';

    console.log(`[Web Vitals] ${metric.name}: ${displayValue} (${rating})`);
  }
}

/**
 * Initialize Web Vitals tracking
 */
export function initWebVitalsTracking(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Dynamically import web-vitals to reduce initial bundle size
  import('web-vitals')
    .then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      // Track all Core Web Vitals
      onCLS((metric) => {
        trackWebVital({
          name: 'CLS',
          value: metric.value,
          id: metric.id,
          delta: metric.delta,
          rating: metric.rating,
        });
      });

      onFID((metric) => {
        trackWebVital({
          name: 'FID',
          value: metric.value,
          id: metric.id,
          delta: metric.delta,
          rating: metric.rating,
        });
      });

      onFCP((metric) => {
        trackWebVital({
          name: 'FCP',
          value: metric.value,
          id: metric.id,
          delta: metric.delta,
          rating: metric.rating,
        });
      });

      onLCP((metric) => {
        trackWebVital({
          name: 'LCP',
          value: metric.value,
          id: metric.id,
          delta: metric.delta,
          rating: metric.rating,
        });
      });

      onTTFB((metric) => {
        trackWebVital({
          name: 'TTFB',
          value: metric.value,
          id: metric.id,
          delta: metric.delta,
          rating: metric.rating,
        });
      });

      onINP((metric) => {
        trackWebVital({
          name: 'INP',
          value: metric.value,
          id: metric.id,
          delta: metric.delta,
          rating: metric.rating,
        });
      });
    })
    .catch((error) => {
      // Web Vitals not available, fail silently
      if (process.env.NODE_ENV === 'development') {
        console.warn('Web Vitals tracking not available:', error);
      }
    });
}

/**
 * Get stored Web Vitals metrics
 */
export function getStoredWebVitals(): Record<string, any> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    return JSON.parse(localStorage.getItem('web-vitals') || '{}');
  } catch (error) {
    return {};
  }
}

/**
 * Clear stored Web Vitals metrics
 */
export function clearStoredWebVitals(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem('web-vitals');
  } catch (error) {
    // Ignore errors
  }
}
