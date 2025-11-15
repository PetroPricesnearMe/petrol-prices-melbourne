/**
 * Common TypeScript Types and Interfaces
 *
 * Central type definitions for improved type safety and reusability
 * @module types/common
 */

// ============================================================================
// Base Types
// ============================================================================

/** Base ID type for entities */
export type ID = string | number;

/** Generic status types */
export type Status = 'idle' | 'loading' | 'success' | 'error';

/** Common HTTP methods */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// ============================================================================
// Utility Types
// ============================================================================

/** Make specific properties optional */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Make specific properties required */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Deep partial type */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Extract array element type */
export type ArrayElement<T> = T extends (infer E)[] ? E : never;

/** Non-nullable type */
export type NonNullable<T> = Exclude<T, null | undefined>;

/** Async function type */
export type AsyncFunction<T = void> = (...args: unknown[]) => Promise<T>;

// ============================================================================
// Component Types
// ============================================================================

/** Base component props with children */
export interface BaseProps {
  children?: React.ReactNode;
  className?: string;
  testId?: string;
}

/**
 * Component base props with common properties
 * Alias for BaseProps for backward compatibility
 */
export interface ComponentBaseProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  'data-testid'?: string;
}

/** Component with loading state */
export interface WithLoadingState {
  isLoading?: boolean;
  loadingText?: string;
}

/** Component with error state */
export interface WithErrorState {
  error?: Error | null;
  onRetry?: () => void;
}

/** Component with disabled state */
export interface WithDisabledState {
  disabled?: boolean;
  disabledReason?: string;
}

/** Fully featured component props */
export interface ComponentProps
  extends BaseProps,
    WithLoadingState,
    WithErrorState,
    WithDisabledState {}

// ============================================================================
// API Types
// ============================================================================

/** Generic API response wrapper */
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
  timestamp?: string;
}

/** Generic API error */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

/** Paginated API response */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/** API query parameters */
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}

// ============================================================================
// Location Types
// ============================================================================

/** Geographic coordinates */
export interface Coordinates {
  latitude: number;
  longitude: number;
  // Legacy aliases for backward compatibility
  lat?: number;
  lng?: number;
}

/** Location with address information */
export interface Location extends Coordinates {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

/** Bounding box for map areas */
export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

// ============================================================================
// Form Types
// ============================================================================

/** Form field error */
export interface FieldError {
  field: string;
  message: string;
  type?: string;
}

/** Form validation result */
export interface ValidationResult {
  isValid: boolean;
  errors: FieldError[];
}

/** Form submit handler */
export type FormSubmitHandler<T = Record<string, unknown>> = (
  data: T,
  event?: React.FormEvent
) => void | Promise<void>;

// ============================================================================
// Event Types
// ============================================================================

/** Custom event with typed data */
export interface CustomEvent<T = unknown> {
  type: string;
  data: T;
  timestamp: number;
}

/** Event handler type */
export type EventHandler<T = unknown> = (event: CustomEvent<T>) => void;

// ============================================================================
// Async State Types
// ============================================================================

/** Async operation state */
export interface AsyncState<T, E = Error> {
  data: T | null;
  error: E | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isIdle: boolean;
}

/** Create initial async state */
export const createAsyncState = <T, E = Error>(): AsyncState<T, E> => ({
  data: null,
  error: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  isIdle: true,
});

// ============================================================================
// Performance Types
// ============================================================================

/** Performance metric */
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count';
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/** Component render info */
export interface RenderInfo {
  componentName: string;
  renderTime: number;
  renderCount: number;
  props: Record<string, unknown>;
}

// ============================================================================
// Configuration Types
// ============================================================================

/** Environment configuration */
export interface EnvironmentConfig {
  apiUrl: string;
  apiTimeout: number;
  enableAnalytics: boolean;
  enableDebugMode: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/** Feature flags */
export interface FeatureFlags {
  [key: string]: boolean;
}

// ============================================================================
// Error Types
// ============================================================================

/** Custom application error */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/** Network error */
export class NetworkError extends AppError {
  constructor(message: string, statusCode?: number) {
    super(message, 'NETWORK_ERROR', statusCode);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/** Validation error */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public errors: FieldError[]
  ) {
    super(message, 'VALIDATION_ERROR', 400, { errors });
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// ============================================================================
// Type Guards
// ============================================================================

/** Check if value is defined */
export const isDefined = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/** Check if value is a string */
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

/** Check if value is a number */
export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

/** Check if value is an object */
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

/** Check if value is an array */
export const isArray = <T>(value: unknown): value is T[] => {
  return Array.isArray(value);
};

/** Check if error is AppError */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

/** Check if error is NetworkError */
export const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof NetworkError;
};

/** Check if error is ValidationError */
export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError;
};

// ============================================================================
// Exports
// ============================================================================

export type {
  // Re-export commonly used React types
  ComponentProps as ReactComponentProps,
  FC as FunctionComponent,
  PropsWithChildren,
  ReactNode,
  ReactElement,
} from 'react';
