/**
 * Application constants
 */

export const APP_NAME = 'Petrol Price Near Me';
export const APP_VERSION = '2.0.0';
export const APP_DESCRIPTION =
  'Find the cheapest petrol stations near you in Australia';

// Default coordinates (Melbourne, Australia)
export const DEFAULT_COORDINATES = {
  lat: -37.8136,
  lng: 144.9631,
};

export const DEFAULT_ZOOM = 12;
export const DEFAULT_SEARCH_RADIUS = 10; // kilometers

// API Configuration
export const API_TIMEOUT = 10000; // 10 seconds
export const API_RETRY_COUNT = 3;
export const API_RATE_LIMIT = 100; // requests per minute

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Cache times (in milliseconds)
export const CACHE_TIME = {
  SHORT: 1 * 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
  DAY: 24 * 60 * 60 * 1000, // 24 hours
};

// Feature flags
export const FEATURES = {
  ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  AUTH: process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true',
  CHAT: process.env.NEXT_PUBLIC_ENABLE_CHAT === 'true',
};

// Social media links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com',
  TWITTER: 'https://twitter.com',
  INSTAGRAM: 'https://instagram.com',
};

// Contact information
export const CONTACT = {
  EMAIL: 'contact@petrolpricenearme.com.au',
  PHONE: '1300 XXX XXX',
};

// Map configuration
export const MAP_CONFIG = {
  TILE_LAYER_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  TILE_LAYER_ATTRIBUTION:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  MAX_ZOOM: 18,
  MIN_ZOOM: 8,
};

