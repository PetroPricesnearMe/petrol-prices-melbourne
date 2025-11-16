/**
 * Station and Fuel Price TypeScript Types
 *
 * Domain-specific type definitions for petrol stations
 * @module types/station
 */

import type { Coordinates, Location, ID } from './common';

// ============================================================================
// Fuel Types
// ============================================================================

/** Available fuel types */
export enum FuelType {
  UNLEADED = 'Unleaded',
  PREMIUM_UNLEADED = 'Premium Unleaded',
  DIESEL = 'Diesel',
  LPG = 'LPG',
  UNLEADED_95 = 'Unleaded95',
  E10 = 'E10',
  E85 = 'E85',
}

/** Fuel type keys */
export type FuelTypeKey = keyof typeof FuelType;

/** Fuel type union */
export type FuelTypeValue = `${FuelType}`;

// ============================================================================
// Station Types
// ============================================================================

/** Station brand/operator */
export type StationBrand =
  | '7-Eleven'
  | 'BP'
  | 'Caltex'
  | 'Shell'
  | 'Coles Express'
  | 'United'
  | 'Liberty'
  | 'Metro'
  | 'Puma'
  | 'Independent'
  | string;

/** Station category */
export enum StationCategory {
  PETROL_STATION = 'petrol-stations',
  TRUCK_STOP = 'truck-stop',
  SERVICE_STATION = 'service-station',
}

/** Station amenities */
export interface StationAmenities {
  hasCarWash?: boolean;
  hasShop?: boolean;
  hasRestroom?: boolean;
  hasATM?: boolean;
  hasAirPump?: boolean;
  hasElectricCharging?: boolean;
  hasCafe?: boolean;
  hasParking?: boolean;
  isOpen24Hours?: boolean;
}

/** Operating hours */
export interface OperatingHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

/** Base station interface */
export interface BaseStation {
  id: ID;
  name: string;
  brand?: StationBrand;
  category?: StationCategory;
}

/** Station with location */
export interface StationWithLocation extends BaseStation, Location {
  distance?: number; // Distance from user in km
}

/** Full station details */
export interface Station extends StationWithLocation {
  stationName: string;
  locationDetails?: string;
  region?: string;
  suburb?: string;
  postcode?: string;
  amenities?: StationAmenities;
  operatingHours?: OperatingHours;
  phoneNumber?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  lastUpdated?: string | Date;
}

// ============================================================================
// Fuel Price Types
// ============================================================================

/** Price trend indicator */
export enum PriceTrend {
  INCREASING = 'Increasing',
  STABLE = 'Stable',
  DECREASING = 'Decreasing',
}

/** Fuel price information */
export interface FuelPrice {
  id: ID;
  fuelType: FuelTypeValue;
  pricePerLiter: number;
  currency?: string;
  lastUpdated: string | Date;
  priceTrend?: PriceTrend;
  priceSource?: string;
}

/** Station with fuel prices */
export interface StationWithPrices extends Station {
  fuelPrices: FuelPrice[];
  cheapestPrice?: number;
  mostExpensivePrice?: number;
}

// ============================================================================
// Search and Filter Types
// ============================================================================

/** Station search filters */
export interface StationFilters {
  fuelType?: FuelTypeValue;
  brand?: StationBrand;
  maxDistance?: number;
  maxPrice?: number;
  minPrice?: number;
  hasAmenities?: Partial<StationAmenities>;
  isOpen24Hours?: boolean;
  region?: string;
  city?: string;
}

/** Station sort options */
export enum StationSortBy {
  DISTANCE = 'distance',
  PRICE_LOW_TO_HIGH = 'price_asc',
  PRICE_HIGH_TO_LOW = 'price_desc',
  NAME = 'name',
  RATING = 'rating',
  LAST_UPDATED = 'lastUpdated',
}

/** Station search params */
export interface StationSearchParams {
  location?: Coordinates;
  radius?: number; // in km
  filters?: StationFilters;
  sortBy?: StationSortBy;
  page?: number;
  limit?: number;
}

/** Station search result */
export interface StationSearchResult {
  stations: StationWithPrices[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  searchLocation?: Coordinates;
}

// ============================================================================
// Map Types
// ============================================================================

/** Map marker for station */
export interface StationMarker {
  id: ID;
  position: Coordinates;
  station: Station;
  price?: number;
  fuelType?: FuelTypeValue;
}

/** Map viewport */
export interface MapViewport {
  center: Coordinates;
  zoom: number;
}

/** Map bounds */
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// ============================================================================
// Analytics Types
// ============================================================================

/** Station view event */
export interface StationViewEvent {
  stationId: ID;
  stationName: string;
  timestamp: number;
  userLocation?: Coordinates;
}

/** Price comparison event */
export interface PriceComparisonEvent {
  stationIds: ID[];
  fuelType: FuelTypeValue;
  timestamp: number;
}

// ============================================================================
// API Response Types
// ============================================================================

/** Baserow station response */
export interface BaserowStationResponse {
  id: number;
  'Station Name': string;
  Address?: string;
  City?: string;
  Region?: string;
  'Postal Code'?: string;
  Country?: string;
  Latitude?: string;
  Longitude?: string;
  Category?: number;
  brand?: unknown[];
  'Location Details'?: string;
  'Fuel Prices'?: number[];
}

/** Baserow fuel price response */
export interface BaserowFuelPriceResponse {
  id: number;
  'Fuel Type': number;
  'Price Per Liter': string;
  'Last Updated': string;
  'Price Trend'?: number;
  'Price Source'?: string;
  Locations?: string;
  'Petrol Station': number[];
}

// ============================================================================
// Type Guards
// ============================================================================

/** Check if value is a valid fuel type */
export const isFuelType = (value: unknown): value is FuelTypeValue => {
  return (
    typeof value === 'string' &&
    Object.values(FuelType).includes(value as FuelType)
  );
};

/** Check if value is a station */
export const isStation = (value: unknown): value is Station => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'latitude' in value &&
    'longitude' in value
  );
};

/** Check if station has prices */
export const isStationWithPrices = (
  value: unknown
): value is StationWithPrices => {
  return (
    isStation(value) &&
    'fuelPrices' in value &&
    Array.isArray((value as StationWithPrices).fuelPrices)
  );
};

// ============================================================================
// Utility Functions
// ============================================================================

/** Get fuel type display name */
export const getFuelTypeDisplayName = (fuelType: FuelTypeValue): string => {
  return fuelType;
};

/** Format price */
export const formatPrice = (price: number, currency = 'AUD'): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(price);
};

/** Calculate distance between coordinates */
export const calculateDistance = (
  from: Coordinates,
  to: Coordinates
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
  const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.latitude * Math.PI) / 180) *
      Math.cos((to.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
