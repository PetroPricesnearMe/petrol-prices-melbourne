/**
 * Performance Optimization Utilities
 * Tools for measuring and improving app performance
 */

/**
 * Dynamically load scripts without blocking
 */
export function loadScriptAsync(src: string, id?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id && document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    if (id) script.id = id;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    
    document.body.appendChild(script);
  });
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string, type?: string) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
}

/**
 * Prefetch resources for future navigation
 */
export function prefetchResource(href: string) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Preconnect to external domains
 */
export function preconnect(href: string, crossorigin: boolean = false) {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = href;
  if (crossorigin) link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

/**
 * DNS prefetch for external domains
 */
export function dnsPrefetch(href: string) {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Measure First Contentful Paint (FCP)
 */
export function measureFCP(callback: (value: number) => void) {
  if (typeof window === 'undefined') return;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        callback(entry.startTime);
        observer.disconnect();
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['paint'] });
  } catch (e) {
    console.warn('PerformanceObserver not supported');
  }
}

/**
 * Measure Largest Contentful Paint (LCP)
 */
export function measureLCP(callback: (value: number) => void) {
  if (typeof window === 'undefined') return;
  
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    callback(lastEntry.startTime);
  });

  try {
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    console.warn('PerformanceObserver not supported');
  }
}

/**
 * Measure First Input Delay (FID)
 */
export function measureFID(callback: (value: number) => void) {
  if (typeof window === 'undefined') return;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const firstInput = entry as PerformanceEventTiming;
      callback(firstInput.processingStart - firstInput.startTime);
      observer.disconnect();
    }
  });

  try {
    observer.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    console.warn('PerformanceObserver not supported');
  }
}

/**
 * Measure Cumulative Layout Shift (CLS)
 */
export function measureCLS(callback: (value: number) => void) {
  if (typeof window === 'undefined') return;
  
  let clsValue = 0;
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
        callback(clsValue);
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.warn('PerformanceObserver not supported');
  }
}

/**
 * Report all Web Vitals
 */
export function reportWebVitals(onReport: (metric: {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}) => void) {
  measureFCP((value) => {
    onReport({
      name: 'FCP',
      value,
      rating: value < 1800 ? 'good' : value < 3000 ? 'needs-improvement' : 'poor',
    });
  });

  measureLCP((value) => {
    onReport({
      name: 'LCP',
      value,
      rating: value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor',
    });
  });

  measureFID((value) => {
    onReport({
      name: 'FID',
      value,
      rating: value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor',
    });
  });

  measureCLS((value) => {
    onReport({
      name: 'CLS',
      value,
      rating: value < 0.1 ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor',
    });
  });
}

/**
 * Defer non-critical JavaScript
 */
export function deferNonCritical(fn: () => void) {
  if (typeof window === 'undefined') return;

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(fn);
  } else {
    setTimeout(fn, 1);
  }
}

/**
 * Check if connection is slow (useful for adaptive loading)
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined' || !(navigator as any).connection) {
    return false;
  }

  const connection = (navigator as any).connection;
  return (
    connection.saveData ||
    connection.effectiveType === 'slow-2g' ||
    connection.effectiveType === '2g'
  );
}

/**
 * Get device memory (for adaptive loading)
 */
export function getDeviceMemory(): number | undefined {
  if (typeof navigator === 'undefined') return undefined;
  return (navigator as any).deviceMemory;
}

/**
 * Check if device has low memory (< 4GB)
 */
export function hasLowMemory(): boolean {
  const memory = getDeviceMemory();
  return memory !== undefined && memory < 4;
}
