/**
 * Legacy Type Definitions
 *
 * Temporary compatibility layer for existing code
 * TODO: Migrate code to use new types from common.ts and station.ts
 * @module types/legacy
 */

import type { Variant, ColorScheme } from './component';
import type { Station, FuelPrice } from './station';

// Legacy station types
export interface PetrolStation extends Station {
  fuelPrices?: FuelPrice[];
}

// Legacy search types
export interface SearchFilters {
  fuelType?: string;
  brand?: string;
  maxDistance?: number;
  maxPrice?: number;
  minPrice?: number;
  sortBy?: string;
}

export type SortOption = 'distance' | 'price-asc' | 'price-desc' | 'name';

// Legacy location types
export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
}

// Legacy component prop types
export type ColorVariant = ColorScheme | Variant;

export interface InteractiveProps {
  onClick?: (...args: any[]) => void;
  disabled?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}
