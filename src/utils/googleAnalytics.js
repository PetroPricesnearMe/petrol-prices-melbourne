/**
 * Google Analytics 4 Integration
 * 
 * Handles initialization and configuration of Google Analytics 4
 * with proper environment variable support and enhanced tracking
 */

/**
 * Initialize Google Analytics 4
 * Loads the gtag.js script and configures GA4 with environment variables
 */
export const initializeGA = () => {
  const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;

  // Don't initialize if no measurement ID is provided
  if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
    console.log('📊 Google Analytics: Measurement ID not configured, skipping initialization');
    return;
  }

  // Prevent double initialization
  if (window.gtag) {
    console.log('📊 Google Analytics: Already initialized');
    return;
  }

  console.log('📊 Initializing Google Analytics 4:', measurementId);

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  // Configure GA4
  gtag('js', new Date());
  gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
    send_page_view: true,
    // Custom dimensions for fuel price tracking
    custom_map: {
      dimension1: 'fuel_type',
      dimension2: 'station_brand',
      dimension3: 'region',
      dimension4: 'price_range'
    },
    // Enhanced measurement features
    enhanced_measurement: {
      scrolls: true,
      outbound_clicks: true,
      site_search: true,
      video_engagement: false,
      file_downloads: true
    }
  });

  console.log('✅ Google Analytics 4 initialized successfully');
};

/**
 * Track page view in Google Analytics
 * @param {string} path - Page path
 * @param {string} title - Page title
 */
export const trackPageView = (path, title) => {
  if (!window.gtag) return;

  window.gtag('event', 'page_view', {
    page_title: title,
    page_location: window.location.href,
    page_path: path,
    send_to: process.env.REACT_APP_GA_MEASUREMENT_ID
  });
};

/**
 * Track custom event in Google Analytics
 * @param {string} eventName - Event name
 * @param {Object} eventParams - Event parameters
 */
export const trackGAEvent = (eventName, eventParams = {}) => {
  if (!window.gtag) return;

  window.gtag('event', eventName, {
    ...eventParams,
    send_to: process.env.REACT_APP_GA_MEASUREMENT_ID
  });
};

/**
 * Track fuel price search
 * @param {string} fuelType - Type of fuel searched
 * @param {string} location - Location searched
 */
export const trackFuelSearch = (fuelType, location) => {
  trackGAEvent('fuel_search', {
    fuel_type: fuelType,
    search_location: location,
    event_category: 'Search',
    event_label: `${fuelType} in ${location}`
  });
};

/**
 * Track station interaction
 * @param {string} stationName - Station name
 * @param {string} action - Action type (view, directions, etc.)
 */
export const trackStationInteraction = (stationName, action) => {
  trackGAEvent('station_interaction', {
    station_name: stationName,
    interaction_type: action,
    event_category: 'Engagement',
    event_label: stationName
  });
};

/**
 * Track price comparison
 * @param {string} fuelType - Type of fuel compared
 * @param {number} stationCount - Number of stations compared
 */
export const trackPriceComparison = (fuelType, stationCount) => {
  trackGAEvent('price_comparison', {
    fuel_type: fuelType,
    station_count: stationCount,
    event_category: 'Comparison',
    value: stationCount
  });
};

/**
 * Track filter usage
 * @param {string} filterType - Type of filter applied
 * @param {string} filterValue - Filter value
 */
export const trackFilterUsage = (filterType, filterValue) => {
  trackGAEvent('filter_applied', {
    filter_type: filterType,
    filter_value: filterValue,
    event_category: 'Filter'
  });
};

/**
 * Track user conversion (directions, phone call, etc.)
 * @param {string} conversionType - Type of conversion
 * @param {string} stationName - Station name
 */
export const trackConversion = (conversionType, stationName) => {
  trackGAEvent('conversion', {
    conversion_type: conversionType,
    station_name: stationName,
    event_category: 'Conversion',
    value: 1
  });
};

/**
 * Set user properties in Google Analytics
 * @param {Object} properties - User properties
 */
export const setUserProperties = (properties) => {
  if (!window.gtag) return;

  window.gtag('set', 'user_properties', properties);
};

export default {
  initializeGA,
  trackPageView,
  trackGAEvent,
  trackFuelSearch,
  trackStationInteraction,
  trackPriceComparison,
  trackFilterUsage,
  trackConversion,
  setUserProperties
};

