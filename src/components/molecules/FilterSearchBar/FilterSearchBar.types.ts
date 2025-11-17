/**
 * Type definitions for FilterSearchBar component
 */

export type FuelType = 'all' | 'unleaded' | 'diesel' | 'premium95' | 'premium98' | 'lpg' | 'e10' | 'e85';

export type DistanceOption = 'all' | '5' | '10' | '25' | '50' | '100';

export type RatingOption = 'all' | '1' | '2' | '3' | '4' | '5';

export interface FilterSearchBarState {
  search: string;
  fuelType: FuelType;
  distance: DistanceOption;
  rating: RatingOption;
}

export interface FilterSearchBarProps {
  /** Initial search value */
  initialSearch?: string;
  /** Initial fuel type filter */
  initialFuelType?: FuelType;
  /** Initial distance filter */
  initialDistance?: DistanceOption;
  /** Initial rating filter */
  initialRating?: RatingOption;
  /** Callback when filters change */
  onFiltersChange?: (filters: FilterSearchBarState) => void;
  /** Callback when search value changes (debounced) */
  onSearchChange?: (search: string) => void;
  /** Placeholder text for search input */
  searchPlaceholder?: string;
  /** Debounce delay in milliseconds */
  debounceDelay?: number;
  /** Sync filters with URL query parameters */
  syncWithUrl?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Disable all filters */
  disabled?: boolean;
  /** Show reset button */
  showResetButton?: boolean;
  /** Custom fuel type options */
  fuelTypeOptions?: Array<{ value: FuelType; label: string; icon?: string }>;
  /** Custom distance options */
  distanceOptions?: Array<{ value: DistanceOption; label: string }>;
  /** Custom rating options */
  ratingOptions?: Array<{ value: RatingOption; label: string; icon?: string }>;
}

export interface FilterDropdownOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

