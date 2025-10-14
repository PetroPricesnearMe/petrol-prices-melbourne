/**
 * Analytics Manager
 * Centralized analytics tracking with support for multiple providers
 * @version 2.0.0
 */

import { initializeGA, trackGAEvent, trackPageView as gaPageView } from '../googleAnalytics';

class AnalyticsManager {
  constructor() {
    this.initialized = false;
    this.providers = [];
    this.queue = [];
    this.userData = {};
  }

  /**
   * Initialize all analytics providers
   */
  initialize() {
    if (this.initialized) return;

    // Initialize Google Analytics
    const gaEnabled = process.env.REACT_APP_GA_ENABLED !== 'false';
    if (gaEnabled) {
      initializeGA();
      this.providers.push('google-analytics');
    }

    // Process queued events
    this.processQueue();

    this.initialized = true;
    console.log('📊 Analytics Manager initialized with providers:', this.providers);
  }

  /**
   * Process queued events
   */
  processQueue() {
    while (this.queue.length > 0) {
      const event = this.queue.shift();
      this.trackEvent(event.name, event.params);
    }
  }

  /**
   * Track page view
   * @param {string} path - Page path
   * @param {string} title - Page title
   */
  trackPageView(path, title) {
    if (!this.initialized) {
      this.queue.push({ name: 'page_view', params: { path, title } });
      return;
    }

    gaPageView(path, title);

    // Track page view timing
    this.trackTiming('page_load', 'navigation', performance.now());
  }

  /**
   * Track custom event
   * @param {string} eventName - Event name
   * @param {Object} eventParams - Event parameters
   */
  trackEvent(eventName, eventParams = {}) {
    if (!this.initialized) {
      this.queue.push({ name: eventName, params: eventParams });
      return;
    }

    trackGAEvent(eventName, eventParams);
  }

  /**
   * Track user interaction
   * @param {string} element - Element interacted with
   * @param {string} action - Action performed
   * @param {Object} metadata - Additional metadata
   */
  trackInteraction(element, action, metadata = {}) {
    this.trackEvent('user_interaction', {
      element,
      action,
      ...metadata,
      timestamp: Date.now(),
    });
  }

  /**
   * Track search query
   * @param {string} query - Search query
   * @param {Object} filters - Applied filters
   * @param {number} resultCount - Number of results
   */
  trackSearch(query, filters = {}, resultCount = 0) {
    this.trackEvent('search', {
      search_term: query,
      ...filters,
      result_count: resultCount,
      event_category: 'Search',
    });
  }

  /**
   * Track fuel price search
   * @param {string} fuelType - Fuel type
   * @param {string} region - Region searched
   * @param {number} resultCount - Number of results
   */
  trackFuelSearch(fuelType, region, resultCount) {
    this.trackEvent('fuel_search', {
      fuel_type: fuelType,
      region,
      result_count: resultCount,
      event_category: 'Search',
      event_label: `${fuelType} in ${region}`,
    });
  }

  /**
   * Track station interaction
   * @param {string} stationName - Station name
   * @param {string} action - Action type (view, directions, call, etc.)
   * @param {Object} metadata - Additional metadata
   */
  trackStationInteraction(stationName, action, metadata = {}) {
    this.trackEvent('station_interaction', {
      station_name: stationName,
      interaction_type: action,
      ...metadata,
      event_category: 'Engagement',
      event_label: stationName,
    });
  }

  /**
   * Track filter usage
   * @param {string} filterType - Type of filter
   * @param {string|Array} filterValue - Filter value(s)
   */
  trackFilter(filterType, filterValue) {
    this.trackEvent('filter_applied', {
      filter_type: filterType,
      filter_value: Array.isArray(filterValue) ? filterValue.join(',') : filterValue,
      event_category: 'Filter',
    });
  }

  /**
   * Track price comparison
   * @param {string} fuelType - Fuel type compared
   * @param {number} stationCount - Number of stations compared
   * @param {Object} priceRange - Min and max prices
   */
  trackPriceComparison(fuelType, stationCount, priceRange = {}) {
    this.trackEvent('price_comparison', {
      fuel_type: fuelType,
      station_count: stationCount,
      price_min: priceRange.min,
      price_max: priceRange.max,
      price_diff: priceRange.max - priceRange.min,
      event_category: 'Comparison',
      value: stationCount,
    });
  }

  /**
   * Track conversion (directions, phone call, website visit)
   * @param {string} conversionType - Type of conversion
   * @param {string} stationName - Station name
   * @param {Object} metadata - Additional metadata
   */
  trackConversion(conversionType, stationName, metadata = {}) {
    this.trackEvent('conversion', {
      conversion_type: conversionType,
      station_name: stationName,
      ...metadata,
      event_category: 'Conversion',
      value: 1,
    });
  }

  /**
   * Track error
   * @param {string} errorType - Type of error
   * @param {string} errorMessage - Error message
   * @param {Object} context - Error context
   */
  trackError(errorType, errorMessage, context = {}) {
    this.trackEvent('error', {
      error_type: errorType,
      error_message: errorMessage,
      ...context,
      event_category: 'Error',
      non_interaction: true,
    });
  }

  /**
   * Track performance metric
   * @param {string} metricName - Metric name
   * @param {number} value - Metric value
   * @param {Object} metadata - Additional metadata
   */
  trackPerformance(metricName, value, metadata = {}) {
    this.trackEvent('performance_metric', {
      metric_name: metricName,
      metric_value: value,
      ...metadata,
      event_category: 'Performance',
      non_interaction: true,
    });
  }

  /**
   * Track timing
   * @param {string} category - Timing category
   * @param {string} variable - Timing variable
   * @param {number} value - Time in milliseconds
   */
  trackTiming(category, variable, value) {
    if (!window.gtag) return;

    window.gtag('event', 'timing_complete', {
      name: variable,
      value: Math.round(value),
      event_category: category,
    });
  }

  /**
   * Track social share
   * @param {string} platform - Social platform
   * @param {string} contentType - Type of content shared
   */
  trackSocialShare(platform, contentType) {
    this.trackEvent('social_share', {
      platform,
      content_type: contentType,
      event_category: 'Social',
    });
  }

  /**
   * Track map interaction
   * @param {string} action - Map action (zoom, pan, marker_click, etc.)
   * @param {Object} metadata - Additional metadata
   */
  trackMapInteraction(action, metadata = {}) {
    this.trackEvent('map_interaction', {
      action,
      ...metadata,
      event_category: 'Map',
    });
  }

  /**
   * Set user properties
   * @param {Object} properties - User properties
   */
  setUserProperties(properties) {
    this.userData = { ...this.userData, ...properties };

    if (window.gtag) {
      window.gtag('set', 'user_properties', properties);
    }
  }

  /**
   * Identify user
   * @param {string} userId - User ID
   * @param {Object} traits - User traits
   */
  identifyUser(userId, traits = {}) {
    if (window.gtag) {
      window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
        user_id: userId,
      });
    }

    this.setUserProperties(traits);
  }

  /**
   * Track web vitals
   * @param {Object} metric - Web vital metric
   */
  trackWebVital(metric) {
    this.trackPerformance(`web_vital_${metric.name}`, metric.value, {
      metric_id: metric.id,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
    });
  }
}

// Create singleton instance
const analyticsManager = new AnalyticsManager();

export default analyticsManager;

// Export individual methods for convenience
export const {
  initialize,
  trackPageView,
  trackEvent,
  trackInteraction,
  trackSearch,
  trackFuelSearch,
  trackStationInteraction,
  trackFilter,
  trackPriceComparison,
  trackConversion,
  trackError,
  trackPerformance,
  trackTiming,
  trackSocialShare,
  trackMapInteraction,
  setUserProperties,
  identifyUser,
  trackWebVital,
} = analyticsManager;

