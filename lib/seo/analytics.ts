/**
 * Analytics Integration
 * Google Analytics 4 and Search Console utilities
 */

// gtag type declaration - compatible with GoogleAnalytics.tsx
// Using same signature to avoid type conflicts
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'consent' | 'js' | string,
      targetId?: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Initialize Google Analytics
 */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

export function initGA() {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    return;
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args) {
    window.dataLayer!.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    send_page_view: true,
  });
}

/**
 * Track page views
 */
export function trackPageView(url: string, title?: string) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title,
  });
}

/**
 * Track custom events
 */
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export function trackEvent({ action, category, label, value }: GAEvent) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

/**
 * Track search queries
 */
export function trackSearch(searchTerm: string, results: number) {
  trackEvent({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
    value: results,
  });
}

/**
 * Track station selection
 */
export function trackStationView(stationName: string, region: string) {
  trackEvent({
    action: 'view_station',
    category: 'stations',
    label: `${stationName} - ${region}`,
  });
}

/**
 * Track fuel price comparison
 */
export function trackFuelComparison(fuelType: string, stations: number) {
  trackEvent({
    action: 'compare_prices',
    category: 'fuel',
    label: fuelType,
    value: stations,
  });
}

/**
 * Track user engagement
 */
export function trackEngagement(action: string, label?: string) {
  trackEvent({
    action,
    category: 'engagement',
    label,
  });
}

/**
 * Track conversions
 */
export function trackConversion(conversionId: string, value?: number) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    return;
  }

  window.gtag('event', 'conversion', {
    send_to: conversionId,
    value: value,
    currency: 'AUD',
  });
}

/**
 * Track outbound links
 */
export function trackOutboundLink(url: string, label: string) {
  trackEvent({
    action: 'click',
    category: 'outbound',
    label: `${label} - ${url}`,
  });
}

/**
 * Track file downloads
 */
export function trackDownload(fileName: string, fileType: string) {
  trackEvent({
    action: 'download',
    category: 'files',
    label: `${fileType} - ${fileName}`,
  });
}

/**
 * Track errors
 */
export function trackError(error: string, fatal: boolean = false) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    return;
  }

  window.gtag('event', 'exception', {
    description: error,
    fatal: fatal,
  });
}

/**
 * Track user timing
 */
export function trackTiming(
  category: string,
  variable: string,
  value: number,
  label?: string
) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    return;
  }

  window.gtag('event', 'timing_complete', {
    name: variable,
    value: value,
    event_category: category,
    event_label: label,
  });
}

/**
 * Enable Google Analytics User ID tracking
 */
export function setUserId(userId: string) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    user_id: userId,
  });
}

/**
 * Set custom dimensions
 */
export function setCustomDimension(name: string, value: string) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    return;
  }

  window.gtag('set', 'user_properties', {
    [name]: value,
  });
}

export default {
  initGA,
  trackPageView,
  trackEvent,
  trackSearch,
  trackStationView,
  trackFuelComparison,
  trackEngagement,
  trackConversion,
  trackOutboundLink,
  trackDownload,
  trackError,
  trackTiming,
  setUserId,
  setCustomDimension,
};
