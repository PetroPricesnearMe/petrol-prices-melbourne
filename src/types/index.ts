/**
 * Core application types and interfaces
 */

// Fuel Types
export enum FuelType {
  UNLEADED = 'unleaded',
  PREMIUM_UNLEADED = 'premium_unleaded',
  DIESEL = 'diesel',
  LPG = 'lpg',
  UNLEADED_95 = 'unleaded_95',
}

export enum PriceTrend {
  INCREASING = 'increasing',
  STABLE = 'stable',
  DECREASING = 'decreasing',
}

// Station Types
export interface PetrolStation {
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
  locationDetails?: string;
  fuelPrices?: FuelPrice[];
  distance?: number; // In kilometers
}

export interface FuelPrice {
  id: number;
  fuelType: FuelType;
  pricePerLiter: number;
  lastUpdated: string;
  priceSource?: string;
  priceTrend?: PriceTrend;
  locations?: string;
  petrolStationId?: number;
}

// Geolocation Types
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeolocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
}

export interface BoundsCoordinates {
  northEast: Coordinates;
  southWest: Coordinates;
}

// Search and Filter Types
export interface SearchFilters {
  fuelType?: FuelType;
  maxDistance?: number;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  sortBy?: SortOption;
}

export enum SortOption {
  DISTANCE = 'distance',
  PRICE_LOW_TO_HIGH = 'price_low_high',
  PRICE_HIGH_TO_LOW = 'price_high_low',
  NAME = 'name',
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// UI Component Types
export interface SelectOption {
  value: string;
  label: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// User and Auth Types (for future use)
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Analytics Types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
}

export interface PageViewEvent extends AnalyticsEvent {
  name: 'page_view';
  properties: {
    path: string;
    title: string;
  };
}

export interface StationClickEvent extends AnalyticsEvent {
  name: 'station_click';
  properties: {
    stationId: number;
    stationName: string;
  };
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// Make all properties optional
export type PartialDeep<T> = {
  [P in keyof T]?: T[P] extends object ? PartialDeep<T[P]> : T[P];
};

// Make all properties required
export type RequiredDeep<T> = {
  [P in keyof T]-?: T[P] extends object ? RequiredDeep<T[P]> : T[P];
};
