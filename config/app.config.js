/**
 * Application Configuration
 * Centralized configuration for the entire application
 * @version 2.0.0
 */

module.exports = {
  // Application Metadata
  app: {
    name: process.env.REACT_APP_NAME || 'Petrol Prices Near Me',
    shortName: 'PPNM',
    description: process.env.REACT_APP_DESCRIPTION || 'Find the best petrol prices in Melbourne',
    version: '2.0.0',
    url: process.env.REACT_APP_URL || 'https://petrolpricesnearme.com.au',
    locale: 'en-AU',
    timezone: 'Australia/Melbourne',
  },

  // SEO Configuration
  seo: {
    defaultTitle: 'Petrol Prices Near Me | Melbourne Fuel Stations Directory',
    titleTemplate: '%s | Petrol Prices Near Me',
    defaultDescription: 'Find the cheapest petrol prices in Melbourne. Compare fuel costs across Shell, BP, Caltex, 7-Eleven and more. Real-time price updates and station locations.',
    defaultKeywords: [
      'petrol prices',
      'fuel prices',
      'Melbourne',
      'petrol stations',
      'cheap fuel',
      'fuel comparison',
      'gas prices',
      'Shell',
      'BP',
      'Caltex',
      '7-Eleven',
    ],
    ogImage: '/images/og-image.jpg',
    twitterCard: 'summary_large_image',
    twitterHandle: '@petrolpricesnearme',
  },

  // Analytics Configuration
  analytics: {
    googleAnalytics: {
      measurementId: process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
      enabled: process.env.REACT_APP_GA_ENABLED !== 'false',
    },
    // Add other analytics platforms here
    mixpanel: {
      token: process.env.REACT_APP_MIXPANEL_TOKEN || '',
      enabled: false,
    },
  },

  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL ||
      (typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:3001'
        : '/api'),
    timeout: 15000,
    retries: 3,
  },

  // Baserow Database Configuration
  database: {
    baserow: {
      apiUrl: process.env.REACT_APP_BASEROW_API_URL || 'https://api.baserow.io/api',
      publicToken: process.env.REACT_APP_BASEROW_PUBLIC_TOKEN || '',
      token: process.env.REACT_APP_BASEROW_TOKEN || '',
      databaseId: 265358,
      tables: {
        petrolStations: {
          id: 623329,
          name: 'Petrol Stations',
        },
        fuelPrices: {
          id: 623330,
          name: 'Fuel Prices',
        },
      },
    },
  },

  // Feature Flags
  features: {
    realTimeUpdates: process.env.REACT_APP_FEATURE_REALTIME === 'true',
    advancedFilters: true,
    mapView: true,
    priceAlerts: false, // Coming soon
    userReviews: false, // Coming soon
    offlineMode: true,
  },

  // Performance Configuration
  performance: {
    enableServiceWorker: process.env.NODE_ENV === 'production',
    lazyLoadImages: true,
    prefetchRoutes: true,
    cacheStrategy: 'cache-first', // 'cache-first' | 'network-first'
  },

  // Map Configuration
  map: {
    provider: 'mapbox',
    mapboxToken: process.env.REACT_APP_MAPBOX_TOKEN || '',
    defaultCenter: { lat: -37.8136, lng: 144.9631 }, // Melbourne CBD
    defaultZoom: 12,
    maxZoom: 18,
    minZoom: 8,
  },

  // Regional Configuration
  regions: {
    default: 'melbourne',
    available: [
      { id: 'melbourne', name: 'Melbourne', enabled: true },
      // Add more regions here as the app expands
    ],
  },

  // Cache Configuration
  cache: {
    stationDataTTL: 3600000, // 1 hour
    priceDataTTL: 900000, // 15 minutes
    imageCacheTTL: 86400000, // 24 hours
  },

  // UI Configuration
  ui: {
    defaultPageSize: 20,
    maxSearchResults: 100,
    debounceDelay: 300,
    animationDuration: 300,
  },
};

