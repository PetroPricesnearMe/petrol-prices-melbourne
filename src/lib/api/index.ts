/**
 * API Utilities - Re-export all API utilities
 * 
 * This index file provides a clean import path for all API utilities.
 * 
 * @example
 * import { enhancedFetch, stationsCache } from '@/lib/api';
 */

// Cache utilities
export {
  stationsCache,
  pricesCache,
  searchCache,
  generateCacheKey,
  MemoryCache,
} from './cache';

// Enhanced fetcher
export {
  enhancedFetch,
  debouncedFetch,
  cachedFetch,
  rateLimitedFetch,
  cancelRequest,
  clearAllPendingRequests,
  getRateLimitStatus,
} from './enhanced-fetcher';

// Note: FetchOptions and RateLimitInfo are interfaces, not exported types
// Import them directly from './enhanced-fetcher' if needed

// API client
export { api } from './client';

// Error handling
export {
  RateLimitError,
  APIError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  handleAPIError,
  successResponse,
  generateRequestId,
  withErrorHandler,
} from './error-handler';

// Server actions
export {
  getStations,
  getStationById,
  searchStations,
} from './server-actions';

// Server action utilities
export {
  createServerAction,
  validateServerAction,
} from './server-action-utils';

// Validation
export {
  validateStationId,
  validateSearchQuery,
  validateCoordinates,
  validatePagination,
  validateFuelPriceUpdate,
} from './validation';

