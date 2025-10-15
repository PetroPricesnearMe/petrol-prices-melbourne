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
    this.isInBackForwardCache = false;
    this.eventListeners = new Map(); // Track event listeners for cleanup

    // Load existing analytics data from localStorage
    this.loadFromStorage();

    // Initialize back/forward cache compatible event handling
    this.initializeEventHandlers();
  }

  /**
   * Initialize event handlers for back/forward cache compatibility
   */
  initializeEventHandlers() {
    try {
      // Handle visibility changes (tab switching, minimizing)
      const handleVisibilityChange = () => {
        try {
          if (document.visibilityState === 'hidden' && !this.isInBackForwardCache) {
            this.trackEvent(ANALYTICS_EVENTS.SESSION_END, {
              duration: Date.now() - this.sessionStartTime,
              reason: 'visibility_hidden'
            });
          }
        } catch (error) {
          console.warn('[Analytics] Error in visibilitychange handler:', error);
        }
      };

      // Handle page hide (including back/forward cache)
      const handlePageHide = (event) => {
        try {
          this.trackEvent(ANALYTICS_EVENTS.SESSION_END, {
            duration: Date.now() - this.sessionStartTime,
            reason: event.persisted ? 'bfcache_hide' : 'page_hide',
            persisted: event.persisted
          });

          if (event.persisted) {
            this.isInBackForwardCache = true;
            this.cleanupResources();
          }
        } catch (error) {
          console.warn('[Analytics] Error in pagehide handler:', error);
        }
      };

      // Handle page show (including restoration from back/forward cache)
      const handlePageShow = (event) => {
        try {
          if (event.persisted) {
            // Page restored from back/forward cache
            this.isInBackForwardCache = false;
            this.sessionStartTime = Date.now(); // Reset session time
            this.trackEvent(ANALYTICS_EVENTS.SESSION_START, {
              reason: 'bfcache_restore',
              persisted: event.persisted
            });
          }
        } catch (error) {
          console.warn('[Analytics] Error in pageshow handler:', error);
        }
      };

      // Handle freeze event (modern browsers, page going to back/forward cache)
      const handleFreeze = () => {
        try {
          this.trackEvent(ANALYTICS_EVENTS.SESSION_END, {
            duration: Date.now() - this.sessionStartTime,
            reason: 'freeze'
          });
          this.cleanupResources();
        } catch (error) {
          console.warn('[Analytics] Error in freeze handler:', error);
        }
      };

      // Handle resume event (modern browsers, page resuming from back/forward cache)
      const handleResume = () => {
        try {
          this.sessionStartTime = Date.now();
          this.trackEvent(ANALYTICS_EVENTS.SESSION_START, {
            reason: 'resume'
          });
        } catch (error) {
          console.warn('[Analytics] Error in resume handler:', error);
        }
      };

      // Add event listeners with passive option for better performance
      this.addEventListenerSafe('visibilitychange', handleVisibilityChange, { passive: true });
      this.addEventListenerSafe('pagehide', handlePageHide, { passive: true });
      this.addEventListenerSafe('pageshow', handlePageShow, { passive: true });

      // Modern back/forward cache events (if supported)
      if ('onfreeze' in document) {
        this.addEventListenerSafe('freeze', handleFreeze, { passive: true });
      }
      if ('onresume' in document) {
        this.addEventListenerSafe('resume', handleResume, { passive: true });
      }

      // Handle unhandled promise rejections to prevent extension conflicts
      const handleUnhandledRejection = (event) => {
        console.warn('[Analytics] Unhandled promise rejection:', event.reason);
        // Prevent the event from causing issues with extensions
        event.preventDefault();
      };

      this.addEventListenerSafe('unhandledrejection', handleUnhandledRejection, { passive: true });

    } catch (error) {
      console.warn('[Analytics] Failed to initialize event handlers:', error);
    }
  }

  /**
   * Safely add event listener with error handling and cleanup tracking
   */
  addEventListenerSafe(eventType, handler, options = {}) {
    try {
      const target = eventType === 'visibilitychange' ? document : window;
      target.addEventListener(eventType, handler, options);

      // Store for cleanup
      if (!this.eventListeners.has(eventType)) {
        this.eventListeners.set(eventType, []);
      }
      this.eventListeners.get(eventType).push({ target, handler, options });
    } catch (error) {
      console.warn(`[Analytics] Failed to add ${eventType} listener:`, error);
    }
  }

  /**
   * Clean up resources when entering back/forward cache
   */
  cleanupResources() {
    try {
      // Save current state to localStorage before cleanup
      this.saveToStorage();

      // Clear any pending timeouts or intervals
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = null;
      }

      // Close any open connections (if any)
      // Note: Don't remove event listeners here as they're needed for restoration
    } catch (error) {
      console.warn('[Analytics] Error during resource cleanup:', error);
    }
  }

  /**
   * Remove all event listeners (call on component unmount)
   */
  destroy() {
    try {
      this.eventListeners.forEach((listeners, eventType) => {
        listeners.forEach(({ target, handler }) => {
          target.removeEventListener(eventType, handler);
        });
      });
      this.eventListeners.clear();
    } catch (error) {
      console.warn('[Analytics] Error removing event listeners:', error);
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
  }

  /**
   * Send event to external analytics platforms (Google Analytics, etc.)
   */
  sendToExternalAnalytics(event) {
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

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('trackCustom', event.type, event.data);
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
    localStorage.removeItem('ppnm_analytics');
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
  analyticsStore.trackEvent(eventType, data);
};

/**
 * Track page view
 * @param {string} pageName - Name of the page
 */
export const trackPageView = (pageName) => {
  trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, { pageName });
};

/**
 * Track search
 * @param {string} query - Search query
 * @param {number} resultsCount - Number of results
 */
export const trackSearch = (query, resultsCount = 0) => {
  trackEvent(ANALYTICS_EVENTS.SEARCH_PERFORMED, { query, resultsCount });
};

/**
 * Track filter application
 * @param {string} filterType - Type of filter
 * @param {any} filterValue - Filter value
 */
export const trackFilter = (filterType, filterValue) => {
  trackEvent(ANALYTICS_EVENTS.FILTER_APPLIED, { filterType, filterValue });
};

/**
 * Track station interaction
 * @param {string} stationId - Station ID
 * @param {string} action - Action type (view, click, directions, etc.)
 */
export const trackStationInteraction = (stationId, action, metadata = {}) => {
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

