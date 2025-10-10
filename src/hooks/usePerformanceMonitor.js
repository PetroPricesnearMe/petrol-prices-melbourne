import { useEffect, useRef } from 'react';

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
      
      console.log(`📊 Performance [${componentName}]:`, {
        mountTime: `${mountDuration}ms`,
        renderCount: renderCount.current,
        timestamp: new Date().toISOString()
      });
    }
    
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log(`🎯 LCP [${componentName}]:`, entry.startTime);
          }
          if (entry.entryType === 'first-input-delay') {
            console.log(`⚡ FID [${componentName}]:`, entry.processingStart - entry.startTime);
          }
          if (entry.entryType === 'layout-shift') {
            console.log(`📐 CLS [${componentName}]:`, entry.value);
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input-delay', 'layout-shift'] });
      } catch (e) {
        // Silently fail if not supported
      }
      
      return () => observer.disconnect();
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
      console.warn(`⚠️ Slow operation in ${componentName}:`, {
        duration: `${duration.toFixed(2)}ms`,
        executionCount: executionCount.current,
        threshold: '16ms (60fps)',
        suggestion: 'Consider memoization, debouncing, or moving to a web worker'
      });
    }
    
    return result;
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
      
      console.log(`🧠 Memory [${componentName}]:`, {
        used: `${used}MB`,
        total: `${total}MB`,
        limit: `${limit}MB`,
        percentage: `${Math.round((used / limit) * 100)}%`
      });
      
      // Warn if memory usage is high
      if (used / limit > 0.8) {
        console.warn(`⚠️ High memory usage in ${componentName}: ${Math.round((used / limit) * 100)}%`);
      }
    };
    
    logMemory(); // Initial log
    const intervalId = setInterval(logMemory, interval);
    
    return () => clearInterval(intervalId);
  }, [componentName, interval]);
};
