/**
 * Performance Optimization Configuration
 * Settings for bundle optimization, code-splitting, and performance monitoring
 * @version 2.0.0
 */

module.exports = {
  // Bundle Size Budgets (in KB)
  budgets: {
    // Maximum bundle sizes
    maxInitialBundle: 250, // 250KB for initial JS bundle
    maxTotalBundle: 500,   // 500KB for total JS
    maxCSS: 50,            // 50KB for CSS
    maxImage: 200,         // 200KB per image

    // Performance targets
    firstContentfulPaint: 1.5,  // 1.5 seconds
    timeToInteractive: 3.5,     // 3.5 seconds
    speedIndex: 2.0,            // 2.0 seconds
  },

  // Code Splitting Strategy
  codeSplitting: {
    // Vendor chunk configuration
    vendors: {
      react: ['react', 'react-dom', 'react-router-dom'],
      maps: ['mapbox-gl', 'react-map-gl'],
      ui: ['framer-motion', 'styled-components'],
      utils: ['axios'],
    },

    // Route-based splitting
    routes: {
      home: true,
      directory: true,
      about: true,
      trends: true,
      amenities: true,
      blog: true,
      faq: true,
    },

    // Component-based splitting
    components: {
      map: true,
      charts: true,
      modal: true,
    },
  },

  // Image Optimization
  images: {
    // Lazy loading configuration
    lazyLoad: {
      enabled: true,
      threshold: '200px',
      placeholderQuality: 10,
    },

    // Format preferences
    formats: {
      preferred: 'webp',
      fallback: 'jpg',
      svg: ['logos', 'icons'],
    },

    // Compression settings
    compression: {
      quality: 85,
      progressive: true,
      optimizationLevel: 7,
    },

    // Responsive images
    responsive: {
      breakpoints: [320, 640, 768, 1024, 1280, 1920],
      sizes: {
        thumbnail: 150,
        small: 400,
        medium: 800,
        large: 1200,
      },
    },
  },

  // Caching Strategy
  caching: {
    // Service Worker cache
    serviceWorker: {
      enabled: true,
      strategy: 'cache-first', // or 'network-first'
      cacheName: 'ppnm-v2',
      maxAge: 86400, // 24 hours
    },

    // Static asset caching
    staticAssets: {
      images: {
        maxAge: 2592000, // 30 days
        immutable: true,
      },
      fonts: {
        maxAge: 31536000, // 1 year
        immutable: true,
      },
      scripts: {
        maxAge: 31536000, // 1 year with hash versioning
        immutable: true,
      },
      styles: {
        maxAge: 31536000, // 1 year with hash versioning
        immutable: true,
      },
    },

    // API response caching
    api: {
      stations: {
        ttl: 3600, // 1 hour
        staleWhileRevalidate: true,
      },
      prices: {
        ttl: 900, // 15 minutes
        staleWhileRevalidate: true,
      },
    },
  },

  // Prefetch/Preload Strategy
  resourceHints: {
    // DNS prefetch
    dnsPrefetch: [
      'https://api.baserow.io',
      'https://www.google-analytics.com',
      'https://fonts.googleapis.com',
    ],

    // Preconnect
    preconnect: [
      'https://api.baserow.io',
      'https://fonts.gstatic.com',
    ],

    // Prefetch
    prefetch: [
      '/images/brands/',
      '/data/stations.geojson',
    ],

    // Preload critical assets
    preload: [
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: true },
    ],
  },

  // Monitoring & Analytics
  monitoring: {
    // Performance monitoring
    performanceObserver: {
      enabled: true,
      metrics: [
        'first-contentful-paint',
        'largest-contentful-paint',
        'first-input-delay',
        'cumulative-layout-shift',
        'time-to-first-byte',
      ],
    },

    // Error tracking
    errorTracking: {
      enabled: true,
      sampleRate: 1.0, // 100% in production
    },

    // User timing
    userTiming: {
      enabled: true,
      marks: [
        'app-init',
        'data-loaded',
        'map-rendered',
        'filters-applied',
      ],
    },
  },

  // Compression
  compression: {
    // Gzip
    gzip: {
      enabled: true,
      level: 9,
      threshold: 1024, // Only compress files > 1KB
    },

    // Brotli
    brotli: {
      enabled: true,
      quality: 11,
      threshold: 1024,
    },
  },

  // Build Optimization
  build: {
    // Minification
    minify: {
      terser: {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        format: {
          comments: false,
        },
      },
    },

    // Source maps
    sourceMaps: {
      production: false, // Disable in production for security
      development: true,
    },

    // Tree shaking
    treeShaking: {
      enabled: true,
      sideEffects: false,
    },
  },

  // Runtime Optimization
  runtime: {
    // React optimization
    react: {
      profiling: false, // Enable only when debugging
      strictMode: true,
    },

    // Debounce/Throttle settings
    interactions: {
      searchDebounce: 300,
      scrollThrottle: 100,
      resizeThrottle: 200,
    },

    // Virtual scrolling
    virtualScrolling: {
      enabled: true,
      overscan: 3, // Number of items to render outside viewport
      itemHeight: 120,
    },
  },
};

