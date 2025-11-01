/**
 * Filter & Sort Types - Shared TypeScript types for filtering and sorting
 *
 * This module provides comprehensive type definitions for all filter options,
 * sort options, and search parameters used across the application
 *
 * @module types/filter
 */

import type { FuelTypeKey } from './listing';

// ============================================================================
// Sort Types
// ============================================================================

/** Available sort options */
export type SortOption =
  | 'price-low'      // Price: Low to High
  | 'price-high'     // Price: High to Low
  | 'distance'       // Nearest first (requires location)
  | 'name'           // Alphabetical by name
  | 'suburb'         // Alphabetical by suburb
  | 'top-rated'      // Highest rated first
  | 'recently-updated'; // Most recently updated

/** Sort direction */
export type SortDirection = 'asc' | 'desc';

/** Sort configuration */
export interface SortConfig {
  /** Field to sort by */
  field: string;
  /** Sort direction */
  direction: SortDirection;
  /** Human-readable label */
  label: string;
}

/** Map of sort options to configurations */
export const SORT_OPTIONS: Record<SortOption, SortConfig> = {
  'price-low': {
    field: 'price',
    direction: 'asc',
    label: 'Price: Low to High',
  },
  'price-high': {
    field: 'price',
    direction: 'desc',
    label: 'Price: High to Low',
  },
  'distance': {
    field: 'distance',
    direction: 'asc',
    label: 'Nearest First',
  },
  'name': {
    field: 'name',
    direction: 'asc',
    label: 'Name (A-Z)',
  },
  'suburb': {
    field: 'suburb',
    direction: 'asc',
    label: 'Suburb (A-Z)',
  },
  'top-rated': {
    field: 'rating',
    direction: 'desc',
    label: 'Top Rated',
  },
  'recently-updated': {
    field: 'lastUpdated',
    direction: 'desc',
    label: 'Recently Updated',
  },
};

// ============================================================================
// Filter Option Types
// ============================================================================

/** Generic filter option for dropdowns */
export interface FilterOption<T = string> {
  /** Option value */
  value: T;
  /** Display label */
  label: string;
  /** Optional icon */
  icon?: string;
  /** Whether option is disabled */
  disabled?: boolean;
  /** Optional count/badge */
  count?: number;
  /** Optional description */
  description?: string;
}

/** Group of filter options */
export interface FilterOptionGroup<T = string> {
  /** Group label */
  label: string;
  /** Options in this group */
  options: FilterOption<T>[];
  /** Whether group is collapsible */
  collapsible?: boolean;
  /** Whether group starts collapsed */
  defaultCollapsed?: boolean;
}

/** Fuel type filter option */
export type FuelTypeFilterOption = FilterOption<FuelTypeKey | 'all'>;

/** Brand filter option */
export type BrandFilterOption = FilterOption<string>;

/** Suburb filter option */
export type SuburbFilterOption = FilterOption<string>;

/** Region filter option */
export type RegionFilterOption = FilterOption<string>;

/** Price range filter */
export interface PriceRangeFilter {
  /** Minimum price (cents per liter) */
  min: number | null;
  /** Maximum price (cents per liter) */
  max: number | null;
  /** Current range values */
  value: [number, number];
}

/** Distance range filter */
export interface DistanceRangeFilter {
  /** Maximum distance in km */
  max: number;
  /** Current distance value */
  value: number;
}

/** Amenity filter */
export interface AmenityFilter {
  /** Amenity key */
  key: string;
  /** Display label */
  label: string;
  /** Whether amenity is selected */
  selected: boolean;
  /** Optional icon */
  icon?: string;
}

// ============================================================================
// Filter State Types
// ============================================================================

/** Complete filter state */
export interface FilterState {
  /** Text search query */
  search: string;
  /** Selected fuel type */
  fuelType: FuelTypeKey | 'all';
  /** Selected brand */
  brand: string;
  /** Selected suburb */
  suburb: string;
  /** Selected region */
  region?: string;
  /** Sort option */
  sortBy: SortOption;
  /** Price range filter */
  priceRange?: PriceRangeFilter;
  /** Maximum price filter */
  priceMax: string | number;
  /** Distance filter (requires user location) */
  distance?: DistanceRangeFilter;
  /** Amenity filters */
  amenities?: Record<string, boolean>;
  /** Show only open 24/7 */
  open24Hours?: boolean;
  /** Show only verified stations */
  verifiedOnly?: boolean;
}

/** Partial filter state for updates */
export type PartialFilterState = Partial<FilterState>;

/** Filter change event */
export interface FilterChangeEvent {
  /** Filter key that changed */
  key: keyof FilterState;
  /** New value */
  value: unknown;
  /** Previous value */
  previousValue?: unknown;
}

// ============================================================================
// Search & Query Types
// ============================================================================

/** Search parameters */
export interface SearchParams {
  /** Search query */
  query: string;
  /** Fields to search in */
  fields?: string[];
  /** Fuzzy search threshold (0-1) */
  fuzzyThreshold?: number;
}

/** Query parameters for API/URL */
export interface QueryParams extends Partial<FilterState> {
  /** Page number (1-indexed) */
  page?: number;
  /** Items per page */
  limit?: number;
  /** Include metadata in response */
  includeMetadata?: boolean;
}

/** URL query string parameters */
export type URLQueryParams = Record<string, string | string[] | undefined>;

// ============================================================================
// Filter Presets
// ============================================================================

/** Predefined filter preset */
export interface FilterPreset {
  /** Preset ID */
  id: string;
  /** Preset name */
  name: string;
  /** Preset description */
  description?: string;
  /** Filter state */
  filters: PartialFilterState;
  /** Optional icon */
  icon?: string;
}

/** Common filter presets */
export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'cheapest-unleaded',
    name: 'Cheapest Unleaded',
    description: 'Lowest unleaded prices',
    filters: {
      fuelType: 'unleaded',
      sortBy: 'price-low',
    },
  },
  {
    id: 'cheapest-diesel',
    name: 'Cheapest Diesel',
    description: 'Lowest diesel prices',
    filters: {
      fuelType: 'diesel',
      sortBy: 'price-low',
    },
  },
  {
    id: 'nearest-premium',
    name: 'Nearest Premium',
    description: 'Closest stations with premium fuel',
    filters: {
      fuelType: 'premium95',
      sortBy: 'distance',
    },
  },
  {
    id: 'open-24-7',
    name: 'Open 24/7',
    description: 'Stations open 24 hours',
    filters: {
      open24Hours: true,
      sortBy: 'distance',
    },
  },
  {
    id: 'top-rated-nearby',
    name: 'Top Rated Nearby',
    description: 'Highest rated local stations',
    filters: {
      sortBy: 'top-rated',
    },
  },
];

// ============================================================================
// Default Values
// ============================================================================

/** Default filter state */
export const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  fuelType: 'unleaded',
  brand: 'all',
  suburb: 'all',
  sortBy: 'price-low',
  priceMax: '',
  open24Hours: false,
  verifiedOnly: false,
};

/** Default pagination */
export const DEFAULT_PAGE_SIZE = 24;
export const DEFAULT_PAGE = 1;

// ============================================================================
// Type Guards
// ============================================================================

/** Check if value is a valid SortOption */
export function isSortOption(value: unknown): value is SortOption {
  return typeof value === 'string' && value in SORT_OPTIONS;
}

/** Check if value is a valid FuelTypeKey */
export function isFuelTypeKey(value: unknown): value is FuelTypeKey {
  return (
    typeof value === 'string' &&
    ['unleaded', 'diesel', 'premium95', 'premium98', 'lpg', 'e10', 'e85'].includes(value)
  );
}

/** Check if filters are empty */
export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.search !== '' ||
    filters.fuelType !== 'unleaded' ||
    filters.brand !== 'all' ||
    filters.suburb !== 'all' ||
    filters.region !== undefined ||
    (filters.priceMax !== '' && filters.priceMax !== 0) ||
    filters.open24Hours === true ||
    filters.verifiedOnly === true ||
    (filters.amenities && Object.values(filters.amenities).some(v => v))
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

/** Get sort label for display */
export function getSortLabel(sortBy: SortOption): string {
  return SORT_OPTIONS[sortBy]?.label || sortBy;
}

/** Convert filters to URL query params */
export function filtersToQueryParams(filters: FilterState): URLQueryParams {
  const params: URLQueryParams = {};

  if (filters.search) params.q = filters.search;
  if (filters.fuelType !== 'all') params.fuel = filters.fuelType;
  if (filters.brand !== 'all') params.brand = filters.brand;
  if (filters.suburb !== 'all') params.suburb = filters.suburb;
  if (filters.region) params.region = filters.region;
  if (filters.sortBy !== 'price-low') params.sort = filters.sortBy;
  if (filters.priceMax) params.maxPrice = String(filters.priceMax);
  if (filters.open24Hours) params.open24h = 'true';
  if (filters.verifiedOnly) params.verified = 'true';

  return params;
}

/** Parse URL query params to filters */
export function queryParamsToFilters(params: URLQueryParams): PartialFilterState {
  const filters: PartialFilterState = {};

  if (params.q && typeof params.q === 'string') filters.search = params.q;
  if (params.fuel && typeof params.fuel === 'string' && isFuelTypeKey(params.fuel)) {
    filters.fuelType = params.fuel;
  }
  if (params.brand && typeof params.brand === 'string') filters.brand = params.brand;
  if (params.suburb && typeof params.suburb === 'string') filters.suburb = params.suburb;
  if (params.region && typeof params.region === 'string') filters.region = params.region;
  if (params.sort && typeof params.sort === 'string' && isSortOption(params.sort)) {
    filters.sortBy = params.sort;
  }
  if (params.maxPrice && typeof params.maxPrice === 'string') {
    filters.priceMax = params.maxPrice;
  }
  if (params.open24h === 'true') filters.open24Hours = true;
  if (params.verified === 'true') filters.verifiedOnly = true;

  return filters;
}

/** Reset filters to default */
export function resetFilters(): FilterState {
  return { ...DEFAULT_FILTER_STATE };
}

/** Merge filter updates */
export function mergeFilters(
  current: FilterState,
  updates: PartialFilterState
): FilterState {
  return { ...current, ...updates };
}
