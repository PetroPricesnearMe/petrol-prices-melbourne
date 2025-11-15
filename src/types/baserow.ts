/**
 * Baserow-specific types and interfaces
 */

// Baserow API Response Types
export interface BaserowListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface BaserowCreateResponse<T> {
  id: number;
  order: string;
  [key: string]: T[keyof T] | number | string;
}

// Baserow Field Types
export interface BaserowField {
  id: number;
  table_id: number;
  name: string;
  order: number;
  type: string;
  primary: boolean;
}

// Baserow Table Structures
export interface BaserowPetrolStation {
  id: number;
  'Station Name': string;
  Address: string;
  City: string;
  Region: string;
  'Postal Code': string;
  Country: string;
  Latitude: number;
  Longitude: number;
  brand?: string[];
  Category?: number;
  'Location Details'?: string;
  'Fuel Prices'?: number[];
}

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

// Baserow Option IDs
export const FUEL_TYPE_OPTIONS = {
  UNLEADED: 3812408,
  PREMIUM_UNLEADED: 3812409,
  DIESEL: 3812410,
  LPG: 3812411,
  UNLEADED_95: 3812412,
} as const;

export const PRICE_TREND_OPTIONS = {
  INCREASING: 3812413,
  STABLE: 3812414,
  DECREASING: 3812415,
} as const;

export const CATEGORY_OPTIONS = {
  PETROL_STATIONS: 3812405,
  FEATURE_TYPE: 3812406,
  PETROL_STATION: 3812407,
} as const;

// Type guards
export function isBaserowPetrolStation(
  obj: unknown
): obj is BaserowPetrolStation {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'Station Name' in obj &&
    'Latitude' in obj &&
    'Longitude' in obj
  );
}

export function isBaserowFuelPrice(obj: unknown): obj is BaserowFuelPrice {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'Fuel Type' in obj &&
    'Price Per Liter' in obj
  );
}
