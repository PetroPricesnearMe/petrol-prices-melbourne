/**
 * Performance Monitoring Utilities
 *
 * Tools for tracking and optimizing application performance
 * @module utils/performance-monitor
 */

import React from 'react';

import type { PerformanceMetric } from '@/types/common';

// ============================================================================
// Performance Observer
// ============================================================================

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private observers: PerformanceObserver[] = [];
  private isEnabled: boolean = process.env.NODE_ENV === 'development';

  private constructor() {
    if (typeof window !== 'undefined' && this.isEnabled) {
      this.initializeObservers();
    }
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers(): void {
    // Observe long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric({
            name: 'long-task',
            value: entry.duration,
            unit: 'ms',
            timestamp: Date.now(),
            metadata: {
              entryType: entry.entryType,
              startTime: entry.startTime,
            },
          });
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      // Long task API not supported
    }

    // Observe layout shifts
    try {
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as PerformanceEntry & {
            value?: number;
            hadRecentInput?: boolean;
          };
          if (layoutShift.value !== undefined) {
            this.recordMetric({
              name: 'layout-shift',
              value: layoutShift.value,
              unit: 'count',
              timestamp: Date.now(),
              metadata: {
                hadRecentInput: layoutShift.hadRecentInput,
              },
            });
          }
        }
      });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(layoutShiftObserver);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      // Layout shift API not supported
    }
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: PerformanceMetric): void {
    if (!this.isEnabled) return;

    const metrics = this.metrics.get(metric.name) || [];
    metrics.push(metric);
    this.metrics.set(metric.name, metrics);

    // Keep only last 100 metrics per type
    if (metrics.length > 100) {
      metrics.shift();
    }

    // Log in development
    if (process.env.NODE_ENV === 'development' && metric.value > 100) {
      console.warn(
        `[Performance] ${metric.name}: ${metric.value}${metric.unit}`,
        metric.metadata
      );
    }
  }

  /**
   * Get metrics by name
   */
  getMetrics(name: string): PerformanceMetric[] {
    return this.metrics.get(name) || [];
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Map<string, PerformanceMetric[]> {
    return this.metrics;
  }

  /**
   * Calculate average metric value
   */
  getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Disconnect all observers
   */
  disconnect(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// ============================================================================
// Performance Measurement Helpers
// ============================================================================

/**
 * Measure function execution time
 */
export function measureExecutionTime<T>(fn: () => T, label: string): T {
  const monitor = PerformanceMonitor.getInstance();
  const start = performance.now();

  try {
    const result = fn();
    const duration = performance.now() - start;

    monitor.recordMetric({
      name: `execution-${label}`,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
    });

    return result;
  } catch (error) {
    const duration = performance.now() - start;
    monitor.recordMetric({
      name: `execution-${label}-error`,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
    });
    throw error;
  }
}

/**
 * Measure async function execution time
 */
export async function measureAsyncExecutionTime<T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> {
  const monitor = PerformanceMonitor.getInstance();
  const start = performance.now();

  try {
    const result = await fn();
    const duration = performance.now() - start;

    monitor.recordMetric({
      name: `async-execution-${label}`,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
    });

    return result;
  } catch (error) {
    const duration = performance.now() - start;
    monitor.recordMetric({
      name: `async-execution-${label}-error`,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
    });
    throw error;
  }
}

/**
 * Mark a performance point
 */
export function markPerformance(name: string): void {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Measure between two performance marks
 */
export function measurePerformance(
  name: string,
  startMark: string,
  endMark: string
): number {
  if (typeof performance !== 'undefined' && performance.measure) {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name)[0];

    if (measure) {
      const monitor = PerformanceMonitor.getInstance();
      monitor.recordMetric({
        name,
        value: measure.duration,
        unit: 'ms',
        timestamp: Date.now(),
      });

      return measure.duration;
    }
  }

  return 0;
}

// ============================================================================
// React Component Performance
// ============================================================================

/**
 * Track component render performance
 */
export function trackComponentRender(
  componentName: string,
  renderTime: number,
  props: Record<string, unknown>
): void {
  const monitor = PerformanceMonitor.getInstance();

  monitor.recordMetric({
    name: `component-render-${componentName}`,
    value: renderTime,
    unit: 'ms',
    timestamp: Date.now(),
    metadata: {
      props,
    },
  });

  // Warn about slow renders
  if (renderTime > 16.67 && process.env.NODE_ENV === 'development') {
    console.warn(
      `[Performance] Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`
    );
  }
}

/**
 * Hook for tracking component performance
 * Use this inside your component to track render performance
 *
 * @example
 * function MyComponent(props: MyProps) {
 *   usePerformanceTracking('MyComponent', props);
 *   return <div>...</div>;
 * }
 */
export function usePerformanceTracking(
  componentName: string,
  props?: Record<string, unknown>
): void {
  const renderStart = React.useRef(performance.now());

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const renderTime = performance.now() - renderStart.current;
    trackComponentRender(componentName, renderTime, props || {});
    renderStart.current = performance.now();
  });
}

// ============================================================================
// Web Vitals Integration
// ============================================================================

interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  rating?: string;
  delta?: number;
}

/**
 * Report web vitals to performance monitor
 */
export function reportWebVitals(metric: WebVitalsMetric): void {
  const monitor = PerformanceMonitor.getInstance();

  monitor.recordMetric({
    name: `web-vital-${metric.name}`,
    value: metric.value,
    unit: 'ms',
    timestamp: Date.now(),
    metadata: {
      id: metric.id,
      rating: metric.rating,
      delta: metric.delta,
    },
  });
}

// ============================================================================
// Resource Timing
// ============================================================================

/**
 * Get resource timing metrics
 */
export function getResourceTimings(): PerformanceResourceTiming[] {
  if (typeof performance === 'undefined' || !performance.getEntriesByType) {
    return [];
  }

  return performance.getEntriesByType(
    'resource'
  ) as PerformanceResourceTiming[];
}

/**
 * Analyze resource loading performance
 */
export function analyzeResourcePerformance(): {
  slowResources: PerformanceResourceTiming[];
  totalSize: number;
  totalDuration: number;
} {
  const resources = getResourceTimings();
  const slowThreshold = 1000; // 1 second

  const slowResources = resources.filter((r) => r.duration > slowThreshold);
  const totalSize = resources.reduce(
    (sum, r) => sum + (r.transferSize || 0),
    0
  );
  const totalDuration = resources.reduce((sum, r) => sum + r.duration, 0);

  return {
    slowResources,
    totalSize,
    totalDuration,
  };
}

// ============================================================================
// Memory Monitoring
// ============================================================================

/**
 * Get memory usage (if available)
 */
interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface PerformanceWithMemory extends Performance {
  memory?: PerformanceMemory;
}

export function getMemoryUsage(): {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
} | null {
  if (
    typeof performance === 'undefined' ||
    !(performance as PerformanceWithMemory).memory
  ) {
    return null;
  }

  const memory = (performance as PerformanceWithMemory).memory;
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
  };
}

/**
 * Track memory usage
 */
export function trackMemoryUsage(): void {
  const memory = getMemoryUsage();
  if (!memory) return;

  const monitor = PerformanceMonitor.getInstance();
  const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

  monitor.recordMetric({
    name: 'memory-usage',
    value: usagePercent,
    unit: 'count',
    timestamp: Date.now(),
    metadata: memory,
  });

  if (usagePercent > 90) {
    console.warn(
      '[Performance] High memory usage detected:',
      usagePercent.toFixed(2) + '%'
    );
  }
}

// ============================================================================
// Export
// ============================================================================

export default PerformanceMonitor;

export { PerformanceMonitor };
