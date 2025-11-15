/**
 * API Response Types - Shared TypeScript types for API interactions
 *
 * This module provides comprehensive type definitions for all API responses,
 * requests, and error handling used across the application
 *
 * @module types/api
 */

import type { QueryParams } from './filter';
import type { Listing, ListingMetadata, PaginatedListings } from './listing';

// ============================================================================
// Generic API Response Types
// ============================================================================

/** Standard API response wrapper */
export interface APIResponse<T = unknown> {
  /** Response data */
  data: T;
  /** HTTP status code */
  status: number;
  /** Success indicator */
  success: boolean;
  /** Optional message */
  message?: string;
  /** Response timestamp */
  timestamp: string;
  /** Request ID for tracking */
  requestId?: string;
}

/** Paginated API response */
export interface PaginatedAPIResponse<T = unknown> {
  /** Response data array */
  data: T[];
  /** Pagination metadata */
  pagination: PaginationMetadata;
  /** HTTP status code */
  status: number;
  /** Success indicator */
  success: boolean;
  /** Optional message */
  message?: string;
  /** Response timestamp */
  timestamp: string;
}

/** Pagination metadata */
export interface PaginationMetadata {
  /** Current page (1-indexed) */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Total items across all pages */
  totalItems: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNext: boolean;
  /** Whether there is a previous page */
  hasPrevious: boolean;
  /** Link to next page */
  nextPage?: string | null;
  /** Link to previous page */
  previousPage?: string | null;
}

// ============================================================================
// API Error Types
// ============================================================================

/** Standard API error response */
export interface APIError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** HTTP status code */
  statusCode: number;
  /** Detailed error information */
  details?: Record<string, unknown>;
  /** Error stack trace (dev only) */
  stack?: string;
  /** Timestamp when error occurred */
  timestamp: string;
  /** Request ID for tracking */
  requestId?: string;
  /** Path that caused the error */
  path?: string;
}

/** Validation error details */
export interface ValidationError {
  /** Field that failed validation */
  field: string;
  /** Validation error message */
  message: string;
  /** Validation rule that failed */
  rule?: string;
  /** Actual value that failed */
  value?: unknown;
}

/** API error with validation details */
export interface ValidationAPIError extends APIError {
  /** Validation errors */
  validationErrors: ValidationError[];
}

/** Common error codes */
export enum APIErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_EXCEEDED',
  SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'REQUEST_TIMEOUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

// ============================================================================
// Request Types
// ============================================================================

/** API request configuration */
export interface APIRequestConfig {
  /** Request method */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Request URL */
  url: string;
  /** Request headers */
  headers?: Record<string, string>;
  /** Query parameters */
  params?: Record<string, unknown>;
  /** Request body */
  data?: unknown;
  /** Request timeout (ms) */
  timeout?: number;
  /** Whether to include credentials */
  withCredentials?: boolean;
  /** Response type */
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  /** Abort signal for cancellation */
  signal?: AbortSignal;
}

/** API request options */
export interface APIRequestOptions {
  /** Custom headers */
  headers?: Record<string, string>;
  /** Query parameters */
  params?: QueryParams;
  /** Request timeout */
  timeout?: number;
  /** Retry configuration */
  retry?: RetryConfig;
  /** Cache configuration */
  cache?: CacheConfig;
}

/** Retry configuration */
export interface RetryConfig {
  /** Maximum number of retries */
  maxRetries: number;
  /** Delay between retries (ms) */
  retryDelay: number;
  /** Retry backoff strategy */
  backoff?: 'linear' | 'exponential';
  /** Status codes that should trigger retry */
  retryableStatusCodes?: number[];
}

/** Cache configuration */
export interface CacheConfig {
  /** Whether to use cache */
  enabled: boolean;
  /** Cache TTL (ms) */
  ttl: number;
  /** Cache key */
  key?: string;
  /** Whether to serve stale data while revalidating */
  staleWhileRevalidate?: boolean;
}

// ============================================================================
// Listing API Types
// ============================================================================

/** Get listings request */
export interface GetListingsRequest {
  /** Query parameters */
  params?: QueryParams;
  /** User location for distance calculation */
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

/** Get listings response */
export interface GetListingsResponse extends PaginatedAPIResponse<Listing> {
  /** Collection metadata */
  metadata?: ListingMetadata;
}

/** Get single listing request */
export interface GetListingRequest {
  /** Listing ID */
  id: string | number;
}

/** Get single listing response */
export interface GetListingResponse extends APIResponse<Listing> {}

/** Search listings request */
export interface SearchListingsRequest {
  /** Search query */
  query: string;
  /** Search fields */
  fields?: string[];
  /** Additional filters */
  filters?: Record<string, unknown>;
  /** Page number */
  page?: number;
  /** Page size */
  pageSize?: number;
}

/** Search listings response */
export interface SearchListingsResponse extends PaginatedAPIResponse<Listing> {
  /** Search metadata */
  searchMetadata?: {
    /** Search query */
    query: string;
    /** Number of results */
    resultCount: number;
    /** Search execution time (ms) */
    executionTime?: number;
  };
}

// ============================================================================
// Baserow API Types (External Data Source)
// ============================================================================

/** Baserow list response */
export interface BaserowListResponse<T> {
  /** Total count */
  count: number;
  /** Next page URL */
  next: string | null;
  /** Previous page URL */
  previous: string | null;
  /** Results array */
  results: T[];
}

/** Baserow error response */
export interface BaserowErrorResponse {
  /** Error type */
  error: string;
  /** Error detail */
  detail: string;
}

/** Baserow petrol station row */
export interface BaserowPetrolStation {
  id: number;
  'Station Name': string;
  Address?: string;
  City?: string;
  Region?: string;
  'Postal Code'?: string;
  Country?: string;
  Latitude?: string | number | null;
  Longitude?: string | number | null;
  Category?: number;
  brand?: unknown[];
  'Location Details'?: string;
  'Fuel Prices'?: number[];
}

/** Baserow fuel price row */
export interface BaserowFuelPrice {
  id: number;
  'Fuel Type': number;
  'Price Per Liter': string;
  'Last Updated': string;
  'Price Source'?: string;
  'Price Trend'?: number;
  Locations?: string;
  'Petrol Station'?: number[];
}

// ============================================================================
// WebSocket API Types (Real-time Updates)
// ============================================================================

/** WebSocket message */
export interface WebSocketMessage<T = unknown> {
  /** Message type */
  type: string;
  /** Message payload */
  payload: T;
  /** Message timestamp */
  timestamp: string;
  /** Message ID */
  messageId?: string;
}

/** Price update message */
export interface PriceUpdateMessage {
  /** Station ID */
  stationId: number;
  /** Updated fuel prices */
  fuelPrices: Record<string, number>;
  /** Update timestamp */
  timestamp: string;
}

/** Station update message */
export interface StationUpdateMessage {
  /** Station ID */
  stationId: number;
  /** Updated fields */
  updates: Partial<Listing>;
  /** Update type */
  updateType: 'price' | 'amenity' | 'status' | 'metadata';
  /** Update timestamp */
  timestamp: string;
}

// ============================================================================
// Async State Types
// ============================================================================

/** Async operation state */
export interface AsyncState<T, E = APIError> {
  /** Data (null when loading or error) */
  data: T | null;
  /** Error (null when idle, loading, or success) */
  error: E | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  isError: boolean;
  /** Success state */
  isSuccess: boolean;
  /** Idle state */
  isIdle: boolean;
  /** Timestamp of last successful fetch */
  lastFetchedAt?: number;
}

/** Mutation state */
export interface MutationState<T, E = APIError> {
  /** Mutation data */
  data: T | null;
  /** Mutation error */
  error: E | null;
  /** Whether mutation is in progress */
  isLoading: boolean;
  /** Whether mutation succeeded */
  isSuccess: boolean;
  /** Whether mutation failed */
  isError: boolean;
}

// ============================================================================
// Type Guards
// ============================================================================

/** Check if response is an error */
export function isAPIError(response: unknown): response is APIError {
  return (
    typeof response === 'object' &&
    response !== null &&
    'code' in response &&
    'message' in response &&
    'statusCode' in response
  );
}

/** Check if error is a validation error */
export function isValidationAPIError(
  error: unknown
): error is ValidationAPIError {
  return (
    isAPIError(error) &&
    'validationErrors' in error &&
    Array.isArray((error as ValidationAPIError).validationErrors)
  );
}

/** Check if response is paginated */
export function isPaginatedResponse<T>(
  response: unknown
): response is PaginatedAPIResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    'pagination' in response &&
    Array.isArray((response as PaginatedAPIResponse<T>).data)
  );
}

/** Check if response is successful */
export function isSuccessResponse<T>(
  response: APIResponse<T> | APIError
): response is APIResponse<T> {
  return 'success' in response && response.success === true;
}

// ============================================================================
// Utility Functions
// ============================================================================

/** Create initial async state */
export function createAsyncState<T, E = APIError>(): AsyncState<T, E> {
  return {
    data: null,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    isIdle: true,
  };
}

/** Create success response */
export function createSuccessResponse<T>(
  data: T,
  message?: string
): APIResponse<T> {
  return {
    data,
    status: 200,
    success: true,
    message,
    timestamp: new Date().toISOString(),
  };
}

/** Create error response */
export function createErrorResponse(
  code: string,
  message: string,
  statusCode: number = 500,
  details?: Record<string, unknown>
): APIError {
  return {
    code,
    message,
    statusCode,
    details,
    timestamp: new Date().toISOString(),
  };
}

/** Get error message from API error */
export function getErrorMessage(error: unknown): string {
  if (isAPIError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

/** Check if error is retryable */
export function isRetryableError(error: APIError): boolean {
  const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
  return retryableStatusCodes.includes(error.statusCode);
}

/** Format API timestamp */
export function formatAPITimestamp(timestamp: string): string {
  try {
    return new Date(timestamp).toLocaleString();
  } catch {
    return timestamp;
  }
}
