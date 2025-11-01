/**
 * Performance Utilities
 *
 * Comprehensive performance optimization utilities including:
 * - Web Vitals tracking
 * - Resource timing analysis
 * - Image optimization helpers
 * - Bundle size monitoring
 * - Performance reporting
 */

import type { Metric } from 'web-vitals';

// ============================================================================
// Web Vitals Tracking
// ============================================================================

export interface PerformanceMetrics {
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
  FCP?: number; // First Contentful Paint
  INP?: number; // Interaction to Next Paint
}

/**
 * Track Web Vitals performance metrics
 */
export function trackWebVitals(metric: Metric) {
  const { name, value, id, delta } = metric;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${name}:`, {
      value: Math.round(value * 100) / 100,
      delta: Math.round(delta * 100) / 100,
      id,
    });
  }

  // Send to analytics (e.g., Google Analytics, Vercel Analytics)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', name, {
      value: Math.round(value),
      event_label: id,
      non_interaction: true,
    });
  }

  // Store in localStorage for performance dashboard
  try {
    const metrics = JSON.parse(localStorage.getItem('web-vitals') || '{}');
    metrics[name] = {
      value,
      timestamp: Date.now(),
    };
    localStorage.setItem('web-vitals', JSON.stringify(metrics));
  } catch (e) {
    // Ignore localStorage errors
  }
}

/**
 * Get stored Web Vitals metrics
 */
export function getStoredMetrics(): Partial<PerformanceMetrics> {
  try {
    const metrics = JSON.parse(localStorage.getItem('web-vitals') || '{}');
    return Object.keys(metrics).reduce((acc, key) => {
      acc[key as keyof PerformanceMetrics] = metrics[key].value;
      return acc;
    }, {} as Partial<PerformanceMetrics>);
  } catch {
    return {};
  }
}

// ============================================================================
// Resource Timing Analysis
// ============================================================================

export interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: string;
}

/**
 * Analyze resource timing for optimization insights
 */
export function analyzeResourceTiming(): ResourceTiming[] {
  if (typeof window === 'undefined' || !window.performance) {
    return [];
  }

  const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];

  return resources
    .map((resource) => ({
      name: resource.name,
      duration: resource.duration,
      size: (resource as any).transferSize || 0,
      type: (resource as any).initiatorType || 'unknown',
    }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10); // Top 10 slowest resources
}

/**
 * Get largest resources for optimization
 */
export function getLargestResources(count: number = 5): ResourceTiming[] {
  const resources = analyzeResourceTiming();
  return resources
    .sort((a, b) => b.size - a.size)
    .slice(0, count);
}

// ============================================================================
// Image Optimization
// ============================================================================

/**
 * Generate optimized Next.js Image src with proper sizing
 */
export function generateImageSrc(
  src: string,
  width: number = 1200,
  quality: number = 85
): string {
  // If already absolute URL, return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Return optimized Next.js image path
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

/**
 * Get responsive image sizes for different viewports
 */
export function getResponsiveSizes(breakpoints: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
  large?: number;
} = {}): string {
  const { mobile = 640, tablet = 768, desktop = 1024, large = 1280 } = breakpoints;

  return `(max-width: ${mobile}px) ${mobile}px, (max-width: ${tablet}px) ${tablet}px, (max-width: ${desktop}px) ${desktop}px, ${large}px`;
}

/**
 * Preload critical images for LCP optimization
 */
export function preloadImage(href: string, as: 'image' = 'image') {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = href;
    document.head.appendChild(link);
  }
}

// ============================================================================
// Code Splitting & Lazy Loading
// ============================================================================

/**
 * Dynamic import with loading state
 */
export async function dynamicImport<T>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): Promise<{ default: T }> {
  try {
    return await importFn();
  } catch (error) {
    console.error('Dynamic import failed:', error);
    if (fallback) {
      return { default: fallback as unknown as T };
    }
    throw error;
  }
}

/**
 * Check if component should be preloaded
 */
export function shouldPreload(preloadProbability: number = 0.5): boolean {
  // Preload based on connection speed
  if (typeof navigator !== 'undefined' && (navigator as any).connection) {
    const connection = (navigator as any).connection;

    // Don't preload on slow connections
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return false;
    }

    // Always preload on fast connections
    if (connection.effectiveType === '4g') {
      return true;
    }
  }

  return Math.random() < preloadProbability;
}

// ============================================================================
// Bundle Size Analysis
// ============================================================================

/**
 * Estimate bundle size impact
 */
export function estimateBundleSize(kb: number): 'small' | 'medium' | 'large' {
  if (kb < 50) return 'small';
  if (kb < 100) return 'medium';
  return 'large';
}

/**
 * Warn about large imports
 */
export function warnLargeImport(packageName: string, size: number) {
  if (process.env.NODE_ENV === 'development' && size > 100) {
    console.warn(
      `[Performance] Large import detected: ${packageName} (${size}KB). Consider lazy loading.`
    );
  }
}

// ============================================================================
// Performance Monitoring
// ============================================================================

/**
 * Measure function execution time
 */
export function measurePerformance<T>(
  fn: () => T,
  label: string
): T {
  if (typeof window !== 'undefined' && window.performance) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    const duration = end - start;

    if (duration > 100) {
      console.warn(`[Performance] Slow operation "${label}": ${duration.toFixed(2)}ms`);
    }

    return result;
  }

  return fn();
}

/**
 * Async performance measurement
 */
export async function measureAsyncPerformance<T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> {
  if (typeof window !== 'undefined' && window.performance) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();

    const duration = end - start;

    if (duration > 1000) {
      console.warn(`[Performance] Slow async operation "${label}": ${duration.toFixed(2)}ms`);
    }

    return result;
  }

  return fn();
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================================================
// Caching Utilities
// ============================================================================

/**
 * Simple in-memory cache with TTL
 */
export class MemoryCache<T> {
  private cache = new Map<string, { value: T; expiry: number }>();

  set(key: string, value: T, ttlMs: number) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlMs,
    });
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);

    if (!item) return undefined;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}

/**
 * Get cache control headers for static assets
 */
export function getCacheHeaders(assetType: 'static' | 'dynamic' | 'api') {
  const headers: Record<string, string> = {};

  switch (assetType) {
    case 'static':
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
      break;
    case 'dynamic':
      headers['Cache-Control'] = 'public, max-age=3600, must-revalidate';
      break;
    case 'api':
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      break;
  }

  return headers;
}

// ============================================================================
// Performance Report Generation
// ============================================================================

export interface PerformanceReport {
  metrics: Partial<PerformanceMetrics>;
  resources: ResourceTiming[];
  recommendations: string[];
  score: number;
}

/**
 * Generate comprehensive performance report
 */
export function generatePerformanceReport(): PerformanceReport {
  const metrics = getStoredMetrics();
  const resources = analyzeResourceTiming();
  const recommendations: string[] = [];

  // Calculate performance score (0-100)
  let score = 100;

  // Check LCP (target: < 2.5s)
  if (metrics.LCP && metrics.LCP > 2500) {
    score -= 20;
    recommendations.push('LCP is slow. Optimize images and reduce render-blocking resources.');
  }

  // Check FID (target: < 100ms)
  if (metrics.FID && metrics.FID > 100) {
    score -= 15;
    recommendations.push('FID is high. Reduce JavaScript execution time and code splitting.');
  }

  // Check CLS (target: < 0.1)
  if (metrics.CLS && metrics.CLS > 0.1) {
    score -= 15;
    recommendations.push('CLS is high. Reserve space for images and avoid shifting content.');
  }

  // Check TTFB (target: < 800ms)
  if (metrics.TTFB && metrics.TTFB > 800) {
    score -= 10;
    recommendations.push('TTFB is slow. Consider using a CDN or edge caching.');
  }

  // Check for large resources
  const largeResources = resources.filter(r => r.size > 500 * 1024); // > 500KB
  if (largeResources.length > 0) {
    score -= 5 * largeResources.length;
    recommendations.push(`Found ${largeResources.length} large resources (>500KB). Optimize images and enable compression.`);
  }

  // Check for slow resources
  const slowResources = resources.filter(r => r.duration > 1000); // > 1s
  if (slowResources.length > 0) {
    score -= 5 * slowResources.length;
    recommendations.push(`Found ${slowResources.length} slow-loading resources (>1s). Use CDN and optimize.`);
  }

  return {
    metrics,
    resources,
    recommendations,
    score: Math.max(0, score),
  };
}

// Export all utilities
export const performanceUtils = {
  trackWebVitals,
  getStoredMetrics,
  analyzeResourceTiming,
  getLargestResources,
  generateImageSrc,
  getResponsiveSizes,
  preloadImage,
  dynamicImport,
  shouldPreload,
  estimateBundleSize,
  warnLargeImport,
  measurePerformance,
  measureAsyncPerformance,
  debounce,
  throttle,
  generatePerformanceReport,
  getCacheHeaders,
};
