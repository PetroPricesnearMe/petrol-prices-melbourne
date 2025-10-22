/**
 * Bundle Optimization Utilities
 * Helper functions for optimizing bundle size
 */

/**
 * Lazy load library only when needed
 * Example: const moment = await importMoment();
 */
export const lazyImports = {
  // Framer Motion - only load when animations are needed
  framerMotion: async () => {
    const { motion, AnimatePresence } = await import('framer-motion');
    return { motion, AnimatePresence };
  },

  // Leaflet - only load on map pages
  leaflet: async () => {
    const L = await import('leaflet');
    return L.default;
  },

  // React Leaflet - only load on map pages
  reactLeaflet: async () => {
    const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');
    return { MapContainer, TileLayer, Marker, Popup };
  },

  // Chart libraries - only load when displaying charts
  recharts: async () => {
    const charts = await import('recharts');
    return charts;
  },
};

/**
 * Optimize third-party library imports
 * Tree-shakeable imports for common libraries
 */

// Date utilities - use date-fns instead of moment
export const dateUtils = {
  format: async (date: Date, formatStr: string) => {
    const { format } = await import('date-fns');
    return format(date, formatStr);
  },
  parseISO: async (dateString: string) => {
    const { parseISO } = await import('date-fns');
    return parseISO(dateString);
  },
  addDays: async (date: Date, amount: number) => {
    const { addDays } = await import('date-fns');
    return addDays(date, amount);
  },
};

// Lodash - import only needed functions
export const lodashUtils = {
  debounce: async <T extends (...args: any[]) => any>(func: T, wait: number) => {
    const { debounce } = await import('lodash-es/debounce');
    return debounce(func, wait);
  },
  throttle: async <T extends (...args: any[]) => any>(func: T, wait: number) => {
    const { default: throttle } = await import('lodash-es/throttle');
    return throttle(func, wait);
  },
  groupBy: async <T>(collection: T[], iteratee: (item: T) => any) => {
    const { default: groupBy } = await import('lodash-es/groupBy');
    return groupBy(collection, iteratee);
  },
};

/**
 * Code splitting for routes
 * Dynamic imports with prefetching support
 */
export const routeSplitting = {
  // Prefetch a route's code
  prefetch: (route: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  },

  // Preload critical route
  preload: (route: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = route;
    document.head.appendChild(link);
  },
};

/**
 * Image optimization utilities
 */
export const imageUtils = {
  // Generate responsive image srcset
  generateSrcSet: (src: string, sizes: number[]) => {
    return sizes.map(size => `${src}?w=${size} ${size}w`).join(', ');
  },

  // Lazy load images with Intersection Observer
  lazyLoadImage: (img: HTMLImageElement, options?: IntersectionObserverInit) => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          if (image.dataset.src) {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
            obs.unobserve(image);
          }
        }
      });
    }, options);

    observer.observe(img);
    return observer;
  },
};

/**
 * CSS optimization utilities
 */
export const cssUtils = {
  // Load CSS dynamically
  loadCSS: (href: string) => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  },

  // Remove unused CSS
  removeUnusedCSS: () => {
    // This would typically be done at build time with PurgeCSS
    // but can also be done at runtime for dynamic content
    console.log('CSS optimization should be done at build time');
  },
};

/**
 * Service Worker for caching
 */
export const cacheUtils = {
  // Register service worker
  registerSW: async () => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  },

  // Clear old caches
  clearOldCaches: async (currentCacheName: string) => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      return Promise.all(
        cacheNames
          .filter(name => name !== currentCacheName)
          .map(name => caches.delete(name))
      );
    }
  },
};

/**
 * Webpack chunk naming for better caching
 */
export const chunkNaming = {
  // Generate hash for chunk
  generateChunkHash: (content: string) => {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  },
};

/**
 * Resource hints
 */
export const resourceHints = {
  // Preconnect to external domain
  preconnect: (href: string) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    document.head.appendChild(link);
  },

  // DNS prefetch
  dnsPrefetch: (href: string) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = href;
    document.head.appendChild(link);
  },

  // Prefetch resource
  prefetch: (href: string, as: string = 'fetch') => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  },
};

/**
 * Monitor bundle size in development
 */
export const bundleMonitor = {
  // Log bundle size warnings
  warnLargeBundle: (size: number, threshold: number = 250000) => {
    if (size > threshold && process.env.NODE_ENV === 'development') {
      console.warn(
        `⚠️ Large bundle detected: ${(size / 1024).toFixed(2)}KB\n` +
        `Consider:\n` +
        `- Using dynamic imports\n` +
        `- Splitting the code into smaller chunks\n` +
        `- Removing unused dependencies`
      );
    }
  },
};

/**
 * Compression utilities
 */
export const compressionUtils = {
  // Check if compression is supported
  supportsCompression: (type: 'gzip' | 'br') => {
    if (typeof window === 'undefined') return false;
    const accept = navigator.userAgent;
    return type === 'br' 
      ? accept.includes('Chrome') || accept.includes('Firefox')
      : true;
  },

  // Request compressed assets
  requestCompressed: async (url: string) => {
    const response = await fetch(url, {
      headers: {
        'Accept-Encoding': 'br, gzip, deflate',
      },
    });
    return response;
  },
};

// Export all utilities
export default {
  lazyImports,
  dateUtils,
  lodashUtils,
  routeSplitting,
  imageUtils,
  cssUtils,
  cacheUtils,
  chunkNaming,
  resourceHints,
  bundleMonitor,
  compressionUtils,
};

