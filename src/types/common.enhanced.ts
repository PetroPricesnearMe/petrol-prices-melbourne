/**
 * Common Types - Enhanced
 * 
 * Shared types used across the application.
 * Includes utility types for better type safety.
 * 
 * @module types/common
 */

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * Optional type helper
 */
export type Optional<T> = T | undefined;

/**
 * Maybe type helper (nullable or undefined)
 */
export type Maybe<T> = T | null | undefined;

/**
 * Make specific properties required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific properties optional
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Deep readonly type
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Prettify type (for better IDE hints)
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Value of object type
 */
export type ValueOf<T> = T[keyof T];

/**
 * Extract keys of specific type
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Async return type helper
 */
export type AsyncReturnType<T extends (...args: any) => Promise<any>> = 
  T extends (...args: any) => Promise<infer R> ? R : never;

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
  timestamp: string;
}

/**
 * API Error response
 */
export interface ApiError {
  error: string;
  message: string;
  status: number;
  timestamp: string;
  path?: string;
  details?: Record<string, any>;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Sort order
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Sort configuration
 */
export interface SortConfig<T = string> {
  field: T;
  order: SortOrder;
}

/**
 * Filter operator
 */
export type FilterOperator = 
  | 'eq'    // equals
  | 'ne'    // not equals
  | 'gt'    // greater than
  | 'gte'   // greater than or equals
  | 'lt'    // less than
  | 'lte'   // less than or equals
  | 'in'    // in array
  | 'nin'   // not in array
  | 'contains'
  | 'startsWith'
  | 'endsWith';

/**
 * Filter configuration
 */
export interface FilterConfig<T = string> {
  field: T;
  operator: FilterOperator;
  value: any;
}

/**
 * Query parameters
 */
export interface QueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: SortOrder;
  search?: string;
  filters?: FilterConfig[];
  [key: string]: any;
}

/**
 * Geolocation coordinates
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Address information
 */
export interface Address {
  street?: string;
  suburb: string;
  city?: string;
  state: string;
  postcode: string;
  country: string;
}

/**
 * Contact information
 */
export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
}

/**
 * Operating hours for a single day
 */
export interface DayHours {
  open: string;  // HH:mm format
  close: string; // HH:mm format
  isOpen: boolean;
}

/**
 * Weekly operating hours
 */
export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

/**
 * Loading state
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Status type
 */
export type Status = 'active' | 'inactive' | 'pending' | 'archived';

/**
 * ID types
 */
export type ID = string | number;
export type UUID = string;

/**
 * Timestamp types
 */
export type Timestamp = string | Date;
export type ISODateString = string;

/**
 * File upload type
 */
export interface FileUpload {
  file: File;
  preview?: string;
  progress?: number;
  status?: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}

/**
 * Select option type
 */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

/**
 * Toast notification type
 */
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Modal props base
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Form field error
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Form state
 */
export interface FormState<T = any> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * Async state
 */
export interface AsyncState<T = any, E = Error> {
  data: T | null;
  error: E | null;
  loading: boolean;
}

/**
 * Component base props
 */
export interface ComponentBaseProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  'data-testid'?: string;
}

/**
 * Component with children
 */
export interface ComponentWithChildren extends ComponentBaseProps {
  children: React.ReactNode;
}

/**
 * Theme type
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Breakpoint type
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Action result
 */
export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Event handler type
 */
export type EventHandler<T = void> = (event: React.SyntheticEvent) => T;

/**
 * Change handler type
 */
export type ChangeHandler<T = any> = (value: T) => void;

/**
 * Click handler type
 */
export type ClickHandler = (event: React.MouseEvent) => void;

/**
 * Submit handler type
 */
export type SubmitHandler<T = any> = (values: T) => void | Promise<void>;

