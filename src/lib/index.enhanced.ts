/**
 * Library Functions - Central Export
 *
 * All library functions and services in one place.
 * Organized by category for better maintainability.
 *
 * @example
 * ```typescript
 * import { stationsApi, formatPrice, cn } from '@/lib';
 * ```
 *
 * @module lib
 */

// ========================================
// UTILITIES
// ========================================

export * from './utils';
export {
  // Formatters
  formatDistance,
  formatPrice,
  formatRelativeTime,
  formatDate,
  formatPhoneNumber,
  formatNumber,

  // Validators
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isEmpty,
  isNumber,

  // Helpers
  debounce,
  throttle,
  deepClone,
  deepMerge,
  generateId,
  sleep,
  retry,
  groupBy,
  pick,
  omit,
  unique,
  chunk,
  shuffle,
  average,
  clamp,
} from './utils';

// ========================================
// API CLIENTS
// ========================================

// TODO: Create and export API clients
// export * from './api';
// export { stationsApi, geocodingApi } from './api';

// ========================================
// SERVICES
// ========================================

// TODO: Export services when they're organized
// export * from './services';

// ========================================
// CMS & DATA
// ========================================

export * from './cms';
export * from './baserow';
export * from './seo';

// ========================================
// REPOSITORIES
// ========================================

export * from './repositories';

// ========================================
// PERFORMANCE
// ========================================

export * from './performance';

// ========================================
// SWR CONFIGURATION
// ========================================

export * from './swr-config';

// ========================================
// SCHEMA & VALIDATION
// ========================================

export * from './schema';

/**
 * Common utility re-exports for convenience
 */
export { cn, cva } from '@/design-system/utils';
