/**
 * API Types and Interfaces
 * Centralized type definitions for API requests and responses
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode: number;
}

export interface ApiMeta {
  timestamp: string;
  requestId: string;
  pagination?: PaginationMeta;
  rateLimit?: RateLimitMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface RateLimitMeta {
  limit: number;
  remaining: number;
  reset: string;
}

export interface ApiRequest<T = unknown> {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  data?: T;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

// Station API Types
export interface Station {
  id: number;
  stationName: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  brand?: string[];
  category?: string;
}

export interface FuelPrice {
  id: number;
  fuelType: string;
  pricePerLiter: number;
  lastUpdated: string;
  priceSource: string;
  priceTrend?: 'Increasing' | 'Stable' | 'Decreasing';
  petrolStation: number[];
}

export interface StationWithPrices extends Station {
  fuelPrices: FuelPrice[];
}

// API Query Parameters
export interface StationQueryParams {
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
  city?: string;
  region?: string;
  fuelType?: string;
  brand?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'distance' | 'price' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface PriceQueryParams {
  stationId?: number;
  fuelType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

// Error Codes
export enum ApiErrorCode {
  // Client Errors (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Server Errors (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMIT_EXCEEDED: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
