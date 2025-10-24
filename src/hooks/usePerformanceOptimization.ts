/**
 * Performance Optimization Hook
 * 
 * Provides memory management and performance optimizations for infinite scroll
 * 
 * @module hooks/usePerformanceOptimization
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface PerformanceOptimizationOptions {
  maxItems?: number;
  cleanupThreshold?: number;
  enableVirtualization?: boolean;
  enableMemoryManagement?: boolean;
}

interface PerformanceMetrics {
  memoryUsage: number;
  renderTime: number;
  itemCount: number;
  isOptimized: boolean;
}

// ============================================================================
// PERFORMANCE OPTIMIZATION HOOK
// ============================================================================

/**
 * Hook for optimizing performance with memory management
 */
export function usePerformanceOptimization(
  options: PerformanceOptimizationOptions = {}
) {
  const {
    maxItems = 1000,
    cleanupThreshold = 500,
    enableVirtualization = true,
    enableMemoryManagement = true,
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    renderTime: 0,
    itemCount: 0,
    isOptimized: false,
  });

  const renderStartTime = useRef<number>(0);
  const memoryCleanupTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * Start performance measurement
   */
  const startMeasurement = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  /**
   * End performance measurement
   */
  const endMeasurement = useCallback((itemCount: number) => {
    const renderTime = performance.now() - renderStartTime.current;
    
    setMetrics(prev => ({
      ...prev,
      renderTime,
      itemCount,
      isOptimized: itemCount > cleanupThreshold,
    }));
  }, [cleanupThreshold]);

  /**
   * Monitor memory usage
   */
  const monitorMemoryUsage = useCallback(() => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory ? memory.usedJSHeapSize / memory.jsHeapSizeLimit : 0;
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memoryUsage * 100, // Convert to percentage
      }));
    }
  }, []);

  /**
   * Cleanup memory when threshold is reached
   */
  const cleanupMemory = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Force garbage collection if available
      if ('gc' in window) {
        (window as any).gc();
      }
      
      // Clear any cached data
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('stations') || name.includes('infinite')) {
              caches.delete(name);
            }
          });
        });
      }
    }
  }, []);

  /**
   * Optimize data for rendering
   */
  const optimizeData = useCallback(<T>(data: T[]): T[] => {
    if (!enableMemoryManagement || data.length <= maxItems) {
      return data;
    }

    // Keep only the most recent items
    return data.slice(-maxItems);
  }, [enableMemoryManagement, maxItems]);

  /**
   * Virtualize items for large datasets
   */
  const virtualizeItems = useCallback(
    <T>(items: T[], startIndex: number, endIndex: number): T[] => {
      if (!enableVirtualization) {
        return items;
      }

      return items.slice(startIndex, endIndex);
    },
    [enableVirtualization]
  );

  // Monitor memory usage periodically
  useEffect(() => {
    if (!enableMemoryManagement) return;

    const interval = setInterval(monitorMemoryUsage, 5000);
    return () => clearInterval(interval);
  }, [monitorMemoryUsage, enableMemoryManagement]);

  // Cleanup memory when threshold is reached
  useEffect(() => {
    if (metrics.itemCount > cleanupThreshold && enableMemoryManagement) {
      memoryCleanupTimer.current = setTimeout(() => {
        cleanupMemory();
      }, 1000);

      return () => {
        if (memoryCleanupTimer.current) {
          clearTimeout(memoryCleanupTimer.current);
        }
      };
    }
  }, [metrics.itemCount, cleanupThreshold, cleanupMemory, enableMemoryManagement]);

  return {
    metrics,
    startMeasurement,
    endMeasurement,
    optimizeData,
    virtualizeItems,
    cleanupMemory,
  };
}

// ============================================================================
// INTERSECTION OBSERVER OPTIMIZATION
// ============================================================================

/**
 * Optimized intersection observer for better performance
 */
export function useOptimizedIntersectionObserver(
  callback: () => void,
  options: {
    threshold?: number;
    rootMargin?: string;
    enabled?: boolean;
  } = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    enabled = true,
  } = options;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && enabled) {
        // Use requestIdleCallback for better performance
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => callbackRef.current());
        } else {
          setTimeout(() => callbackRef.current(), 0);
        }
      }
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin, enabled]);

  return elementRef;
}

// ============================================================================
// DEBOUNCED SCROLL HOOK
// ============================================================================

/**
 * Debounced scroll handler for better performance
 */
export function useDebouncedScroll(
  callback: (scrollTop: number) => void,
  delay: number = 100
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTop = useRef<number>(0);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = e.currentTarget.scrollTop;
      
      // Only trigger if scroll position changed significantly
      if (Math.abs(scrollTop - lastScrollTop.current) < 10) {
        return;
      }

      lastScrollTop.current = scrollTop;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(scrollTop);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return handleScroll;
}

// ============================================================================
// MEMORY LEAK PREVENTION
// ============================================================================

/**
 * Hook to prevent memory leaks in infinite scroll
 */
export function useMemoryLeakPrevention() {
  const cleanupFunctions = useRef<Array<() => void>>([]);

  const addCleanup = useCallback((cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup);
  }, []);

  const cleanup = useCallback(() => {
    cleanupFunctions.current.forEach(fn => fn());
    cleanupFunctions.current = [];
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { addCleanup, cleanup };
}

// ============================================================================
// RENDER OPTIMIZATION
// ============================================================================

/**
 * Hook for optimizing render performance
 */
export function useRenderOptimization() {
  const [isRendering, setIsRendering] = useState(false);
  const renderQueue = useRef<Array<() => void>>([]);
  const isProcessingQueue = useRef(false);

  const queueRender = useCallback((renderFn: () => void) => {
    renderQueue.current.push(renderFn);
    
    if (!isProcessingQueue.current) {
      processRenderQueue();
    }
  }, []);

  const processRenderQueue = useCallback(() => {
    if (isProcessingQueue.current || renderQueue.current.length === 0) {
      return;
    }

    isProcessingQueue.current = true;
    setIsRendering(true);

    const processNext = () => {
      if (renderQueue.current.length === 0) {
        isProcessingQueue.current = false;
        setIsRendering(false);
        return;
      }

      const renderFn = renderQueue.current.shift();
      if (renderFn) {
        renderFn();
      }

      // Use requestAnimationFrame for smooth rendering
      requestAnimationFrame(processNext);
    };

    requestAnimationFrame(processNext);
  }, []);

  return {
    isRendering,
    queueRender,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  usePerformanceOptimization,
  useOptimizedIntersectionObserver,
  useDebouncedScroll,
  useMemoryLeakPrevention,
  useRenderOptimization,
};
