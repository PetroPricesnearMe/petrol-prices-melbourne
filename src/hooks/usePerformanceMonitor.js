import { useEffect, useRef } from 'react';

import logger from '../utils/logger';

/**
 * Custom hook for monitoring component performance and Core Web Vitals
 */
export const usePerformanceMonitor = (componentName) => {
  const mountTime = useRef(Date.now());
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      const now = Date.now();
      const mountDuration = now - mountTime.current;

      logger.info(`📊 Performance [${componentName}]:`, {
        mountTime: `${mountDuration}ms`,
        renderCount: renderCount.current,
        timestamp: new Date().toISOString()
      });
    }

    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // Observe LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            logger.info(`🎯 LCP [${componentName}]:`, entry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Observe FID (First Input Delay) - using 'first-input' instead of deprecated 'first-input-delay'
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fid = entry.processingStart - entry.startTime;
            logger.info(`⚡ FID [${componentName}]:`, fid);
          }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });

        // Observe CLS (Cumulative Layout Shift)
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              logger.info(`📐 CLS [${componentName}]:`, entry.value);
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        return () => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        };
      } catch (e) {
        // Silently fail if not supported
        logger.debug('Performance monitoring not fully supported:', e);
      }
    }
  }, [componentName]);

  return {
    renderCount: renderCount.current,
    mountDuration: Date.now() - mountTime.current
  };
};

/**
 * Hook for monitoring and optimizing expensive operations
 */
export const useExpensiveOperation = (operation, dependencies = [], componentName = 'Unknown') => {
  const lastExecution = useRef(0);
  const executionCount = useRef(0);

  useEffect(() => {
    const startTime = performance.now();
    executionCount.current += 1;

    const result = operation();

    const endTime = performance.now();
    const duration = endTime - startTime;
    lastExecution.current = duration;

    // Warn about slow operations in development
    if (process.env.NODE_ENV === 'development' && duration > 16) {
      logger.warn(`⚠️ Slow operation in ${componentName}:`, {
        duration: `${duration.toFixed(2)}ms`,
        executionCount: executionCount.current,
        threshold: '16ms (60fps)',
        suggestion: 'Consider memoization, debouncing, or moving to a web worker'
      });
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    lastExecutionTime: lastExecution.current,
    executionCount: executionCount.current
  };
};

/**
 * Hook for memory usage monitoring
 */
export const useMemoryMonitor = (componentName, interval = 10000) => {
  useEffect(() => {
    if (!performance.memory) return;

    const logMemory = () => {
      const memory = performance.memory;
      const used = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const total = Math.round(memory.totalJSHeapSize / 1024 / 1024);
      const limit = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);

      logger.info(`🧠 Memory [${componentName}]:`, {
        used: `${used}MB`,
        total: `${total}MB`,
        limit: `${limit}MB`,
        percentage: `${Math.round((used / limit) * 100)}%`
      });

      // Warn if memory usage is high
      if (used / limit > 0.8) {
        logger.warn(`⚠️ High memory usage in ${componentName}: ${Math.round((used / limit) * 100)}%`);
      }
    };

    logMemory(); // Initial log
    const intervalId = setInterval(logMemory, interval);

    return () => clearInterval(intervalId);
  }, [componentName, interval]);
};
