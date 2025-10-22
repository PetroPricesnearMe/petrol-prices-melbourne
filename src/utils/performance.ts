/**
 * Performance Utilities
 * 
 * Tools for measuring and optimizing performance
 */

/**
 * Measure execution time of a function
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  label?: string
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();

    const time = end - start;
    const name = label || fn.name || 'anonymous';

    if (time > 16) {
      console.warn(`[Performance] ${name} took ${time.toFixed(2)}ms`);
    }

    return result;
  }) as T;
}

/**
 * Async function performance measurement
 */
export function measureAsyncPerformance<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  label?: string
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();

    const time = end - start;
    const name = label || fn.name || 'anonymous';

    if (time > 100) {
      console.warn(`[Performance] Async ${name} took ${time.toFixed(2)}ms`);
    }

    return result;
  }) as T;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Request Idle Callback wrapper with fallback
 */
export function requestIdleCallback(
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
): number {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }

  // Fallback to setTimeout
  return window.setTimeout(() => {
    const start = Date.now();
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
    });
  }, 1) as any;
}

/**
 * Cancel Idle Callback wrapper with fallback
 */
export function cancelIdleCallback(id: number): void {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Batch updates for better performance
 */
export class BatchUpdater<T> {
  private queue: T[] = [];
  private processing = false;
  private batchSize: number;
  private processor: (batch: T[]) => void;

  constructor(processor: (batch: T[]) => void, batchSize = 10) {
    this.processor = processor;
    this.batchSize = batchSize;
  }

  add(item: T): void {
    this.queue.push(item);

    if (!this.processing) {
      this.scheduleProcess();
    }
  }

  private scheduleProcess(): void {
    this.processing = true;

    requestIdleCallback(() => {
      const batch = this.queue.splice(0, this.batchSize);

      if (batch.length > 0) {
        this.processor(batch);
      }

      if (this.queue.length > 0) {
        this.scheduleProcess();
      } else {
        this.processing = false;
      }
    });
  }

  clear(): void {
    this.queue = [];
    this.processing = false;
  }
}

/**
 * FPS Monitor
 */
export class FPSMonitor {
  private lastTime = performance.now();
  private frames = 0;
  private fps = 60;
  private rafId: number | null = null;
  private callback: (fps: number) => void;

  constructor(callback: (fps: number) => void) {
    this.callback = callback;
  }

  start(): void {
    const measure = () => {
      this.frames++;
      const currentTime = performance.now();

      if (currentTime >= this.lastTime + 1000) {
        this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
        this.frames = 0;
        this.lastTime = currentTime;
        this.callback(this.fps);
      }

      this.rafId = requestAnimationFrame(measure);
    };

    measure();
  }

  stop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  getFPS(): number {
    return this.fps;
  }
}

/**
 * Memory usage monitor
 */
export function getMemoryUsage(): {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
} | null {
  if ('memory' in performance && (performance as any).memory) {
    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
  }

  return null;
}

/**
 * Long task detection
 */
export function detectLongTasks(threshold = 50): void {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > threshold) {
            console.warn(
              `[Performance] Long task detected: ${entry.duration.toFixed(2)}ms`,
              entry
            );
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // PerformanceObserver not supported
    }
  }
}

/**
 * Report Web Vitals
 */
export interface WebVitals {
  CLS: number; // Cumulative Layout Shift
  FID: number; // First Input Delay
  FCP: number; // First Contentful Paint
  LCP: number; // Largest Contentful Paint
  TTFB: number; // Time to First Byte
}

export function reportWebVitals(callback: (vitals: Partial<WebVitals>) => void): void {
  if (typeof window === 'undefined') return;

  const vitals: Partial<WebVitals> = {};

  // Observe performance entries
  if ('PerformanceObserver' in window) {
    try {
      // LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        vitals.LCP = lastEntry.renderTime || lastEntry.loadTime;
        callback(vitals);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          vitals.FID = entry.processingStart - entry.startTime;
          callback(vitals);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            vitals.CLS = clsValue;
            callback(vitals);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // PerformanceObserver not fully supported
    }
  }

  // Navigation timing
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as any;
    if (navigation) {
      vitals.TTFB = navigation.responseStart - navigation.requestStart;
      vitals.FCP = navigation.responseEnd - navigation.fetchStart;
      callback(vitals);
    }
  });
}

