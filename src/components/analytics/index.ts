/**
 * Analytics Module
 * Centralized exports for analytics components and utilities
 */

export { GoogleAnalytics, trackEvent, updateConsent } from './GoogleAnalytics';
export { CookieConsent } from './CookieConsent';

// Common analytics event helpers
export const analytics = {
  // Track station views
  viewStation: (stationId: string, stationName: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_station', {
        station_id: stationId,
        station_name: stationName,
      });
    }
  },

  // Track price comparisons
  comparePrices: (fuelType: string, suburb?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'compare_prices', {
        fuel_type: fuelType,
        suburb: suburb,
      });
    }
  },

  // Track search queries
  search: (query: string, resultCount: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: query,
        result_count: resultCount,
      });
    }
  },

  // Track map interactions
  viewMap: (region?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_map', {
        region: region,
      });
    }
  },

  // Track filter usage
  applyFilter: (filterType: string, filterValue: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'apply_filter', {
        filter_type: filterType,
        filter_value: filterValue,
      });
    }
  },

  // Track outbound links (e.g., directions to station)
  clickOutbound: (url: string, destination: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click_outbound', {
        url: url,
        destination: destination,
      });
    }
  },
};
