/**
 * Performance Monitoring Utilities
 * Track Core Web Vitals and custom metrics
 */

/**
 * Initialize Web Vitals monitoring
 */
export const initWebVitals = () => {
  if (!('PerformanceObserver' in window)) {
    console.warn('PerformanceObserver not supported');
    return;
  }

  // Largest Contentful Paint (LCP)
  observeLCP();

  // First Input Delay (FID)
  observeFID();

  // Cumulative Layout Shift (CLS)
  observeCLS();

  // Time to First Byte (TTFB)
  observeTTFB();
};

/**
 * Observe Largest Contentful Paint
 * Target: < 2.5s (good), < 4s (needs improvement)
 */
const observeLCP = () => {
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      const lcp = lastEntry.renderTime || lastEntry.loadTime;

      console.log('[Performance] LCP:', lcp.toFixed(2), 'ms');

      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'LCP',
          value: Math.round(lcp),
          metric_id: 'lcp',
          metric_value: lcp,
          metric_delta: lcp
        });
      }

      // Visual indicator for development
      if (process.env.NODE_ENV === 'development') {
        const rating = lcp < 2500 ? 'good' : lcp < 4000 ? 'needs-improvement' : 'poor';
        console.log(`[Performance] LCP Rating: ${rating}`);
      }
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (error) {
    console.warn('[Performance] LCP observation failed:', error);
  }
};

/**
 * Observe First Input Delay
 * Target: < 100ms (good), < 300ms (needs improvement)
 */
const observeFID = () => {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = entry.processingStart - entry.startTime;

        console.log('[Performance] FID:', fid.toFixed(2), 'ms');

        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'FID',
            value: Math.round(fid),
            metric_id: 'fid',
            metric_value: fid,
            metric_delta: fid
          });
        }

        const rating = fid < 100 ? 'good' : fid < 300 ? 'needs-improvement' : 'poor';
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Performance] FID Rating: ${rating}`);
        }
      }
    });

    observer.observe({ type: 'first-input', buffered: true });
  } catch (error) {
    console.warn('[Performance] FID observation failed:', error);
  }
};

/**
 * Observe Cumulative Layout Shift
 * Target: < 0.1 (good), < 0.25 (needs improvement)
 */
const observeCLS = () => {
  try {
    let clsValue = 0;
    let clsEntries = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      }

      console.log('[Performance] CLS:', clsValue.toFixed(4));

      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'CLS',
          value: Math.round(clsValue * 1000),
          metric_id: 'cls',
          metric_value: clsValue,
          metric_delta: clsValue
        });
      }

      const rating = clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor';
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] CLS Rating: ${rating}`);
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    console.warn('[Performance] CLS observation failed:', error);
  }
};

/**
 * Observe Time to First Byte
 * Target: < 600ms (good), < 1000ms (needs improvement)
 */
const observeTTFB = () => {
  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0];

    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;

      console.log('[Performance] TTFB:', ttfb.toFixed(2), 'ms');

      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'TTFB',
          value: Math.round(ttfb),
          metric_id: 'ttfb',
          metric_value: ttfb
        });
      }

      const rating = ttfb < 600 ? 'good' : ttfb < 1000 ? 'needs-improvement' : 'poor';
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] TTFB Rating: ${rating}`);
      }
    }
  } catch (error) {
    console.warn('[Performance] TTFB measurement failed:', error);
  }
};

/**
 * Track custom timing metrics
 */
export const markPerformance = (markName) => {
  if ('performance' in window && 'mark' in window.performance) {
    performance.mark(markName);
  }
};

export const measurePerformance = (measureName, startMark, endMark) => {
  if ('performance' in window && 'measure' in window.performance) {
    try {
      performance.measure(measureName, startMark, endMark);
      const measure = performance.getEntriesByName(measureName)[0];

      console.log(`[Performance] ${measureName}:`, measure.duration.toFixed(2), 'ms');

      return measure.duration;
    } catch (error) {
      console.warn('[Performance] Measurement failed:', error);
    }
  }

  return null;
};

/**
 * Monitor bundle size impact
 */
export const trackBundleSize = () => {
  if ('performance' in window) {
    const resources = performance.getEntriesByType('resource');

    const bundles = {
      js: 0,
      css: 0,
      images: 0,
      fonts: 0,
      total: 0
    };

    resources.forEach(resource => {
      const size = resource.transferSize || 0;
      bundles.total += size;

      if (resource.name.endsWith('.js')) {
        bundles.js += size;
      } else if (resource.name.endsWith('.css')) {
        bundles.css += size;
      } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
        bundles.images += size;
      } else if (resource.name.match(/\.(woff|woff2|ttf|otf)$/)) {
        bundles.fonts += size;
      }
    });

    // Convert to KB
    Object.keys(bundles).forEach(key => {
      bundles[key] = (bundles[key] / 1024).toFixed(2);
    });

    console.table(bundles);

    return bundles;
  }
};

/**
 * Monitor memory usage
 */
export const trackMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = performance.memory;

    const usage = {
      used: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      total: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
      limit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
      percentage: ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2) + '%'
    };

    console.log('[Performance] Memory Usage:', usage);

    return usage;
  }

  return null;
};

/**
 * Detect slow network conditions
 */
export const isSlowNetwork = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (connection) {
      // 2G or slow-2g
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        return true;
      }

      // Save-Data mode enabled
      if (connection.saveData) {
        return true;
      }

      // Low bandwidth
      if (connection.downlink < 1) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Prefetch critical resources
 */
export const prefetchResources = (urls = []) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      urls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.as = 'fetch';
        document.head.appendChild(link);
      });
    });
  }
};

/**
 * Preload critical images
 */
export const preloadImages = (urls = []) => {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'image';
    document.head.appendChild(link);
  });
};

/**
 * Lazy load images with Intersection Observer
 */
export const lazyLoadImages = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;

          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }

          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }

          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px' // Start loading 200px before entering viewport
    });

    const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
    lazyImages.forEach(img => imageObserver.observe(img));
  }
};

/**
 * Report performance to analytics
 */
export const reportPerformance = () => {
  if ('performance' in window) {
    const perfData = {
      navigation: performance.getEntriesByType('navigation')[0],
      paint: performance.getEntriesByType('paint'),
      resources: performance.getEntriesByType('resource')
    };

    // Calculate key metrics
    const metrics = {
      domContentLoaded: perfData.navigation?.domContentLoadedEventEnd - perfData.navigation?.fetchStart,
      loadComplete: perfData.navigation?.loadEventEnd - perfData.navigation?.fetchStart,
      firstPaint: perfData.paint?.find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: perfData.paint?.find(p => p.name === 'first-contentful-paint')?.startTime
    };

    console.log('[Performance] Metrics:', metrics);

    return metrics;
  }
};

/**
 * Debounce function for performance
 */
export const debounce = (func, wait = 300) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance
 */
export const throttle = (func, limit = 100) => {
  let inThrottle;

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Request Idle Callback polyfill
 */
export const requestIdleCallback = window.requestIdleCallback || function (cb) {
  const start = Date.now();
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
    });
  }, 1);
};

export const cancelIdleCallback = window.cancelIdleCallback || function (id) {
  clearTimeout(id);
};

const performanceMonitoring = {
  initWebVitals,
  markPerformance,
  measurePerformance,
  trackBundleSize,
  trackMemoryUsage,
  isSlowNetwork,
  prefetchResources,
  preloadImages,
  lazyLoadImages,
  reportPerformance,
  debounce,
  throttle,
  requestIdleCallback,
  cancelIdleCallback
};

export default performanceMonitoring;

