/**
 * Analytics Tracking Utilities
 * Track user interactions, searches, and conversions for UX insights
 * Integrates with Google Analytics 4 and custom analytics endpoints
 * 
 * @module analytics
 */

import { trackGAEvent } from './googleAnalytics';

// Analytics event types
export const ANALYTICS_EVENTS = {
  // Search & Filter Events
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
  FILTER_CLEARED: 'filter_cleared',

  // Station Interaction Events
  STATION_VIEWED: 'station_viewed',
  STATION_CLICKED: 'station_clicked',
  DIRECTIONS_CLICKED: 'directions_clicked',
  PHONE_CLICKED: 'phone_clicked',

  // Price Events
  PRICE_COMPARED: 'price_compared',
  LOWEST_PRICE_CLICKED: 'lowest_price_clicked',

  // Navigation Events
  PAGE_VIEW: 'page_view',
  BREADCRUMB_CLICKED: 'breadcrumb_clicked',
  REGION_SELECTED: 'region_selected',

  // Conversion Events
  MAP_OPENED: 'map_opened',
  EXTERNAL_LINK_CLICKED: 'external_link_clicked',

  // User Journey Events
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  TIME_ON_PAGE: 'time_on_page',
};

/**
 * Analytics data store for generating reports
 */
class AnalyticsStore {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();

    // Only run browser-specific code on the client side
    if (typeof window !== 'undefined') {
      // Load existing analytics data from localStorage
      this.loadFromStorage();

      // Track session end using modern Page Visibility API and pagehide event
      // These are more reliable than the deprecated beforeunload/unload events

      // Use visibilitychange to track when user switches tabs or minimizes
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.trackEvent(ANALYTICS_EVENTS.SESSION_END, {
            duration: Date.now() - this.sessionStartTime,
            reason: 'visibility_hidden'
          });
        }
      });

      // Use pagehide as a more reliable alternative to beforeunload
      window.addEventListener('pagehide', () => {
        this.trackEvent(ANALYTICS_EVENTS.SESSION_END, {
          duration: Date.now() - this.sessionStartTime,
          reason: 'page_hide'
        });
      });
    }
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Load analytics data from localStorage
   */
  loadFromStorage() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('ppnm_analytics');
      if (stored) {
        const data = JSON.parse(stored);
        this.events = data.events || [];
      }
    } catch (error) {
      console.warn('Failed to load analytics from storage:', error);
    }
  }

  /**
   * Save analytics data to localStorage
   */
  saveToStorage() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    
    try {
      const data = {
        events: this.events.slice(-1000), // Keep last 1000 events
        lastUpdated: Date.now()
      };
      localStorage.setItem('ppnm_analytics', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save analytics to storage:', error);
    }
  }

  /**
   * Track an analytics event
   * @param {string} eventType - Type of event from ANALYTICS_EVENTS
   * @param {Object} eventData - Additional event data
   */
  trackEvent(eventType, eventData = {}) {
    if (typeof window === 'undefined') return;
    
    try {
      const event = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: eventType,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        data: eventData,
        page: window.location.pathname,
        userAgent: navigator.userAgent,
      };

      this.events.push(event);
      this.saveToStorage();

      // Send to external analytics if configured
      this.sendToExternalAnalytics(event);

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', event);
      }
    } catch (error) {
      // Analytics should never break functionality
      if (process.env.NODE_ENV === 'development') {
        console.warn('Analytics tracking error:', error);
      }
    }
  }

  /**
   * Send event to external analytics platforms (Google Analytics, etc.)
   */
  sendToExternalAnalytics(event) {
    if (typeof window === 'undefined') return;
    
    // Wrap all analytics in try-catch to ensure they never block user interactions
    try {
      // Google Analytics 4 - Enhanced Event Tracking
      // Use the dedicated GA helper function for better tracking
      trackGAEvent(event.type, {
        event_category: this.getCategoryFromEventType(event.type),
        event_label: event.data.query || event.data.stationId || event.data.filterType || 'unknown',
        value: event.data.value || 0,
        session_id: this.sessionId,
        page_path: window.location.pathname,
        ...event.data
      });
    } catch (error) {
      // Silently fail - analytics should never block functionality
      if (process.env.NODE_ENV === 'development') {
        console.warn('GA tracking error:', error);
      }
    }

    // Facebook Pixel
    try {
      if (window.fbq) {
        window.fbq('trackCustom', event.type, event.data);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Facebook Pixel error:', error);
      }
    }

    // Custom analytics endpoint (optional)
    if (process.env.REACT_APP_ANALYTICS_ENDPOINT) {
      fetch(process.env.REACT_APP_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).catch(error => console.warn('Analytics endpoint error:', error));
    }
  }

  /**
   * Get event category for external analytics
   */
  getCategoryFromEventType(eventType) {
    const categoryMap = {
      [ANALYTICS_EVENTS.SEARCH_PERFORMED]: 'Search',
      [ANALYTICS_EVENTS.FILTER_APPLIED]: 'Filter',
      [ANALYTICS_EVENTS.STATION_CLICKED]: 'Engagement',
      [ANALYTICS_EVENTS.DIRECTIONS_CLICKED]: 'Conversion',
      [ANALYTICS_EVENTS.PAGE_VIEW]: 'Navigation',
    };
    return categoryMap[eventType] || 'Other';
  }

  /**
   * Generate analytics report
   */
  generateReport(timeRange = '7days') {
    const now = Date.now();
    const ranges = {
      '24hours': 24 * 60 * 60 * 1000,
      '7days': 7 * 24 * 60 * 60 * 1000,
      '30days': 30 * 24 * 60 * 60 * 1000,
    };

    const cutoff = now - (ranges[timeRange] || ranges['7days']);
    const relevantEvents = this.events.filter(e => e.timestamp >= cutoff);

    return {
      timeRange,
      totalEvents: relevantEvents.length,
      uniqueSessions: new Set(relevantEvents.map(e => e.sessionId)).size,
      eventBreakdown: this.getEventBreakdown(relevantEvents),
      topSearches: this.getTopSearches(relevantEvents),
      topStations: this.getTopStations(relevantEvents),
      conversionRate: this.calculateConversionRate(relevantEvents),
      avgTimeOnPage: this.calculateAvgTimeOnPage(relevantEvents),
      popularFilters: this.getPopularFilters(relevantEvents),
    };
  }

  /**
   * Get event type breakdown
   */
  getEventBreakdown(events) {
    const breakdown = {};
    events.forEach(event => {
      breakdown[event.type] = (breakdown[event.type] || 0) + 1;
    });
    return breakdown;
  }

  /**
   * Get top search terms
   */
  getTopSearches(events) {
    const searches = events
      .filter(e => e.type === ANALYTICS_EVENTS.SEARCH_PERFORMED)
      .map(e => e.data.query)
      .filter(Boolean);

    const counts = {};
    searches.forEach(query => {
      counts[query] = (counts[query] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));
  }

  /**
   * Get most viewed stations
   */
  getTopStations(events) {
    const stations = events
      .filter(e => e.type === ANALYTICS_EVENTS.STATION_VIEWED)
      .map(e => e.data.stationId)
      .filter(Boolean);

    const counts = {};
    stations.forEach(id => {
      counts[id] = (counts[id] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([stationId, views]) => ({ stationId, views }));
  }

  /**
   * Calculate conversion rate
   */
  calculateConversionRate(events) {
    const views = events.filter(e => e.type === ANALYTICS_EVENTS.STATION_VIEWED).length;
    const conversions = events.filter(e =>
      e.type === ANALYTICS_EVENTS.DIRECTIONS_CLICKED ||
      e.type === ANALYTICS_EVENTS.PHONE_CLICKED
    ).length;

    return views > 0 ? ((conversions / views) * 100).toFixed(2) : 0;
  }

  /**
   * Calculate average time on page
   */
  calculateAvgTimeOnPage(events) {
    const timeEvents = events.filter(e => e.type === ANALYTICS_EVENTS.TIME_ON_PAGE);
    if (timeEvents.length === 0) return 0;

    const totalTime = timeEvents.reduce((sum, e) => sum + (e.data.duration || 0), 0);
    return Math.round(totalTime / timeEvents.length / 1000); // Convert to seconds
  }

  /**
   * Get popular filters
   */
  getPopularFilters(events) {
    const filters = events
      .filter(e => e.type === ANALYTICS_EVENTS.FILTER_APPLIED)
      .map(e => e.data.filterType)
      .filter(Boolean);

    const counts = {};
    filters.forEach(filter => {
      counts[filter] = (counts[filter] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([filter, count]) => ({ filter, count }));
  }

  /**
   * Export analytics data as CSV
   */
  exportToCSV() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    const headers = ['Timestamp', 'Event Type', 'Session ID', 'Page', 'Data'];
    const rows = this.events.map(e => [
      new Date(e.timestamp).toISOString(),
      e.type,
      e.sessionId,
      e.page,
      JSON.stringify(e.data),
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Clear all analytics data
   */
  clearData() {
    this.events = [];
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('ppnm_analytics');
    }
  }
}

// Create singleton instance
const analyticsStore = new AnalyticsStore();

/**
 * Track analytics event (convenience function)
 * @param {string} eventType - Event type from ANALYTICS_EVENTS
 * @param {Object} data - Event data
 */
export const trackEvent = (eventType, data = {}) => {
  try {
    analyticsStore.trackEvent(eventType, data);
  } catch (error) {
    // Fail silently - analytics should never break user functionality
    if (process.env.NODE_ENV === 'development') {
      console.warn('trackEvent error:', error);
    }
  }
};

/**
 * Track page view
 * @param {string} pageName - Name of the page
 */
export const trackPageView = (pageName) => {
  try {
    trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, { pageName });
  } catch (error) {
    // Fail silently
  }
};

/**
 * Track search
 * @param {string} query - Search query
 * @param {number} resultsCount - Number of results
 */
export const trackSearch = (query, resultsCount = 0) => {
  try {
    trackEvent(ANALYTICS_EVENTS.SEARCH_PERFORMED, { query, resultsCount });
  } catch (error) {
    // Fail silently
  }
};

/**
 * Track filter application
 * @param {string} filterType - Type of filter
 * @param {any} filterValue - Filter value
 */
export const trackFilter = (filterType, filterValue) => {
  try {
    trackEvent(ANALYTICS_EVENTS.FILTER_APPLIED, { filterType, filterValue });
  } catch (error) {
    // Fail silently
  }
};

/**
 * Track station interaction
 * @param {string} stationId - Station ID
 * @param {string} action - Action type (view, click, directions, etc.)
 */
export const trackStationInteraction = (stationId, action, metadata = {}) => {
  try {
    const eventMap = {
      view: ANALYTICS_EVENTS.STATION_VIEWED,
      click: ANALYTICS_EVENTS.STATION_CLICKED,
      directions: ANALYTICS_EVENTS.DIRECTIONS_CLICKED,
      phone: ANALYTICS_EVENTS.PHONE_CLICKED,
    };

    trackEvent(eventMap[action] || ANALYTICS_EVENTS.STATION_CLICKED, {
      stationId,
      ...metadata
    });
  } catch (error) {
    // Fail silently
  }
};

/**
 * Get analytics report
 * @param {string} timeRange - Time range (24hours, 7days, 30days)
 */
export const getAnalyticsReport = (timeRange = '7days') => {
  return analyticsStore.generateReport(timeRange);
};

/**
 * Export analytics data
 */
export const exportAnalytics = () => {
  analyticsStore.exportToCSV();
};

/**
 * Clear analytics data
 */
export const clearAnalytics = () => {
  analyticsStore.clearData();
};

export default analyticsStore;

