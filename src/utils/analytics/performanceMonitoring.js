/**
 * Performance Monitoring Utility
 * Tracks Core Web Vitals and other performance metrics
 * @version 2.0.0
 */

import analyticsManager from './analyticsManager';

/**
 * Report Web Vitals to analytics
 * @param {Function} onPerfEntry - Callback function
 */
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

/**
 * Initialize performance monitoring
 */
export const initializePerformanceMonitoring = () => {
  // Track Web Vitals
  reportWebVitals((metric) => {
    analyticsManager.trackWebVital(metric);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${metric.name}:`, metric.value, metric.rating);
    }
  });

  // Track Navigation Timing
  if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = window.performance.timing;
        const navigationStart = timing.navigationStart;

        // DNS Lookup
        const dnsTime = timing.domainLookupEnd - timing.domainLookupStart;
        analyticsManager.trackPerformance('dns_lookup', dnsTime);

        // TCP Connection
        const tcpTime = timing.connectEnd - timing.connectStart;
        analyticsManager.trackPerformance('tcp_connection', tcpTime);

        // Request Time
        const requestTime = timing.responseStart - timing.requestStart;
        analyticsManager.trackPerformance('request_time', requestTime);

        // Response Time
        const responseTime = timing.responseEnd - timing.responseStart;
        analyticsManager.trackPerformance('response_time', responseTime);

        // DOM Processing
        const domProcessing = timing.domComplete - timing.domLoading;
        analyticsManager.trackPerformance('dom_processing', domProcessing);

        // Page Load Time
        const loadTime = timing.loadEventEnd - navigationStart;
        analyticsManager.trackPerformance('page_load_time', loadTime);

        // DOM Content Loaded
        const domContentLoaded = timing.domContentLoadedEventEnd - navigationStart;
        analyticsManager.trackPerformance('dom_content_loaded', domContentLoaded);
      }, 0);
    });
  }

  // Track Resource Loading
  if (window.performance && window.performance.getEntriesByType) {
    window.addEventListener('load', () => {
      const resources = window.performance.getEntriesByType('resource');

      // Group resources by type
      const resourcesByType = resources.reduce((acc, resource) => {
        const type = getResourceType(resource.name);
        if (!acc[type]) acc[type] = [];
        acc[type].push(resource);
        return acc;
      }, {});

      // Track resource loading times
      Object.entries(resourcesByType).forEach(([type, items]) => {
        const totalSize = items.reduce((sum, item) => sum + (item.transferSize || 0), 0);
        const avgDuration = items.reduce((sum, item) => sum + item.duration, 0) / items.length;

        analyticsManager.trackPerformance(`resource_${type}_count`, items.length);
        analyticsManager.trackPerformance(`resource_${type}_size`, totalSize);
        analyticsManager.trackPerformance(`resource_${type}_duration`, avgDuration);
      });
    });
  }

  // Track Long Tasks
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          analyticsManager.trackPerformance('long_task', entry.duration, {
            task_name: entry.name,
            start_time: entry.startTime,
          });
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // Long task observation not supported
    }
  }

  // Track Memory Usage (if available)
  if (window.performance && window.performance.memory) {
    setInterval(() => {
      const memory = window.performance.memory;
      analyticsManager.trackPerformance('memory_used', memory.usedJSHeapSize, {
        total_heap: memory.totalJSHeapSize,
        heap_limit: memory.jsHeapSizeLimit,
      });
    }, 60000); // Track every minute
  }

  // Track Network Information
  if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    analyticsManager.setUserProperties({
      connection_type: connection.effectiveType,
      connection_downlink: connection.downlink,
      connection_rtt: connection.rtt,
      save_data: connection.saveData,
    });
  }

  console.log('📊 Performance monitoring initialized');
};

/**
 * Get resource type from URL
 * @param {string} url - Resource URL
 * @returns {string} Resource type
 */
function getResourceType(url) {
  if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) return 'image';
  if (url.match(/\.(woff|woff2|ttf|otf|eot)$/i)) return 'font';
  if (url.match(/\.(js)$/i)) return 'script';
  if (url.match(/\.(css)$/i)) return 'stylesheet';
  if (url.match(/\.(json|geojson)$/i)) return 'data';
  return 'other';
}

/**
 * Mark performance timing
 * @param {string} name - Mark name
 */
export const markPerformance = (name) => {
  if (window.performance && window.performance.mark) {
    window.performance.mark(name);
  }
};

/**
 * Measure performance between marks
 * @param {string} name - Measure name
 * @param {string} startMark - Start mark name
 * @param {string} endMark - End mark name (optional, defaults to now)
 */
export const measurePerformance = (name, startMark, endMark) => {
  if (window.performance && window.performance.measure) {
    try {
      window.performance.measure(name, startMark, endMark);
      const measures = window.performance.getEntriesByName(name);
      if (measures.length > 0) {
        const measure = measures[measures.length - 1];
        analyticsManager.trackPerformance(name, measure.duration);
      }
    } catch (e) {
      console.warn('Performance measurement failed:', e);
    }
  }
};

/**
 * Track component render time
 * @param {string} componentName - Component name
 * @returns {Function} Cleanup function
 */
export const trackComponentRender = (componentName) => {
  const startMark = `${componentName}-render-start`;
  const endMark = `${componentName}-render-end`;

  markPerformance(startMark);

  return () => {
    markPerformance(endMark);
    measurePerformance(`${componentName}-render`, startMark, endMark);
  };
};

/**
 * Track data fetch time
 * @param {string} fetchName - Fetch operation name
 * @returns {Object} Start and end functions
 */
export const trackDataFetch = (fetchName) => {
  const startMark = `${fetchName}-fetch-start`;
  const endMark = `${fetchName}-fetch-end`;

  return {
    start: () => markPerformance(startMark),
    end: () => {
      markPerformance(endMark);
      measurePerformance(`${fetchName}-fetch`, startMark, endMark);
    },
  };
};

const performanceMonitoring = {
  reportWebVitals,
  initializePerformanceMonitoring,
  markPerformance,
  measurePerformance,
  trackComponentRender,
  trackDataFetch,
};

export default performanceMonitoring;

