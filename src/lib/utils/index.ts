/**
 * Utility Functions - Central Export
 * 
 * All utility functions in one place for easy importing.
 * Consolidated from multiple files to eliminate duplication.
 * 
 * @example
 * ```typescript
 * import { formatPrice, debounce, isValidEmail, sanitizeString } from '@/lib/utils';
 * ```
 * 
 * @module lib/utils
 */

// Export all formatters
export * from './formatters';

// Export all validators
export * from './validators';

// Export all helpers
export * from './helpers';

// Export all sanitizers
export * from './sanitizers';

// Re-export commonly used utilities
export {
  formatDistance,
  formatPrice,
  formatRelativeTime,
  formatDate,
} from './formatters';

export {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isEmpty,
} from './validators';

export {
  debounce,
  throttle,
  deepClone,
  generateId,
  sleep,
  groupBy,
} from './helpers';

