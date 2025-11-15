# Type System Guide 📘

> Comprehensive TypeScript type definitions for consistent data handling

## Overview

This project uses a centralized type system to ensure type safety and consistency across hooks, components, and pages. All shared types are defined in `/src/types` and exported through a central index.

## Type Modules

### 1. Listing Types (`listing.ts`)

Types for petrol station listings and fuel prices.

```typescript
import { Listing, FuelPrices, ListingMetadata } from '@/types';
```

**Key Types:**

- **`Listing`** - Complete petrol station data structure
- **`FuelPrices`** - Fuel prices for all fuel types
- **`ListingMetadata`** - Collection metadata (totals, ranges, etc.)
- **`PaginatedListings`** - Paginated listing response
- **`StationAmenities`** - Available amenities at station

**Example:**

```typescript
import { Listing, getCheapestPrice, formatListingPrice } from '@/types';

function StationCard({ station }: { station: Listing }) {
  const cheapestPrice = getCheapestPrice(station);
  return <div>{formatListingPrice(cheapestPrice)}</div>;
}
```

### 2. Filter Types (`filter.ts`)

Types for filtering, sorting, and search functionality.

```typescript
import { FilterState, SortOption, FilterOption } from '@/types';
```

**Key Types:**

- **`FilterState`** - Complete filter state
- **`SortOption`** - Available sort options
- **`FilterOption<T>`** - Generic filter option for dropdowns
- **`QueryParams`** - URL/API query parameters
- **`FilterPreset`** - Predefined filter configurations

**Example:**

```typescript
import { FilterState, DEFAULT_FILTER_STATE, hasActiveFilters } from '@/types';

function FilterPanel() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const hasFilters = hasActiveFilters(filters);

  return <div>Active filters: {hasFilters ? 'Yes' : 'No'}</div>;
}
```

### 3. API Types (`api.ts`)

Types for API requests, responses, and error handling.

```typescript
import { APIResponse, PaginatedAPIResponse, APIError } from '@/types';
```

**Key Types:**

- **`APIResponse<T>`** - Standard API response wrapper
- **`PaginatedAPIResponse<T>`** - Paginated API response
- **`APIError`** - Standardized error structure
- **`AsyncState<T>`** - Async operation state
- **`BaserowPetrolStation`** - Baserow API response types

**Example:**

```typescript
import { GetListingsResponse, isAPIError, getErrorMessage } from '@/types';

async function fetchStations(): Promise<GetListingsResponse> {
  try {
    const response = await api.get('/stations');
    return response.data;
  } catch (error) {
    if (isAPIError(error)) {
      console.error(getErrorMessage(error));
    }
    throw error;
  }
}
```

### 4. Common Types (`common.ts`)

Shared utility types used across the application.

```typescript
import { Coordinates, Location, AsyncState } from '@/types';
```

**Key Types:**

- **`ID`** - Entity identifier type
- **`Coordinates`** - Geographic coordinates
- **`Location`** - Location with address
- **`AsyncState<T>`** - Async operation state
- **`PaginatedResponse<T>`** - Generic pagination wrapper

## Usage Examples

### Component with Types

```typescript
import { Listing, FilterState, SortOption } from '@/types';

interface StationListProps {
  stations: Listing[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function StationList({
  stations,
  filters,
  onFilterChange,
}: StationListProps) {
  // Implementation
}
```

### Custom Hook with Types

```typescript
import { Listing, AsyncState, APIError } from '@/types';

export function useStations(): AsyncState<Listing[], APIError> {
  const [state, setState] = useState<AsyncState<Listing[], APIError>>({
    data: null,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    isIdle: true,
  });

  // Implementation

  return state;
}
```

### API Service with Types

```typescript
import { GetListingsRequest, GetListingsResponse, APIError } from '@/types';

export async function getListings(
  request: GetListingsRequest
): Promise<GetListingsResponse> {
  // Implementation
}
```

### Filter Form with Types

```typescript
import {
  FilterState,
  SortOption,
  FuelTypeKey,
  SORT_OPTIONS,
  DEFAULT_FILTER_STATE
} from '@/types';

export function FilterForm() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);

  const handleSortChange = (sortBy: SortOption) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  return (
    <select onChange={(e) => handleSortChange(e.target.value as SortOption)}>
      {Object.entries(SORT_OPTIONS).map(([value, config]) => (
        <option key={value} value={value}>
          {config.label}
        </option>
      ))}
    </select>
  );
}
```

## Type Utilities

### Type Guards

Check types at runtime:

```typescript
import { isListing, hasValidCoordinates, isAPIError } from '@/types';

if (isListing(data)) {
  // data is Listing
  if (hasValidCoordinates(data)) {
    // data has valid lat/lng
  }
}

if (isAPIError(error)) {
  // error is APIError
  console.error(error.message);
}
```

### Helper Functions

```typescript
import {
  getCheapestPrice,
  formatListingPrice,
  formatDistance,
  getBrandColor,
  sortListings,
  getSortLabel,
} from '@/types';

const listing: Listing = {
  /* ... */
};
const cheapest = getCheapestPrice(listing);
const formatted = formatListingPrice(cheapest);
const color = getBrandColor(listing.brand);

const sorted = sortListings(listings, 'price-low');
```

### Filter Utilities

```typescript
import {
  filtersToQueryParams,
  queryParamsToFilters,
  hasActiveFilters,
  resetFilters,
  mergeFilters,
} from '@/types';

// Convert filters to URL params
const params = filtersToQueryParams(filters);

// Parse URL params to filters
const parsedFilters = queryParamsToFilters(urlParams);

// Check if filters are active
if (hasActiveFilters(filters)) {
  // Show clear button
}

// Reset to defaults
const defaultFilters = resetFilters();

// Merge filter updates
const updated = mergeFilters(currentFilters, { suburb: 'Melbourne' });
```

### API Utilities

```typescript
import {
  createAsyncState,
  createSuccessResponse,
  createErrorResponse,
  isSuccessResponse,
  isRetryableError,
} from '@/types';

// Create initial state
const initialState = createAsyncState<Listing[]>();

// Create responses
const success = createSuccessResponse(data, 'Success!');
const error = createErrorResponse('NOT_FOUND', 'Station not found', 404);

// Check response type
if (isSuccessResponse(response)) {
  // Handle success
}

// Check if error should be retried
if (isRetryableError(error)) {
  // Retry request
}
```

## Constants

### Filter Defaults

```typescript
import { DEFAULT_FILTER_STATE, DEFAULT_PAGE_SIZE, DEFAULT_PAGE } from '@/types';

const filters = DEFAULT_FILTER_STATE;
// {
//   search: '',
//   fuelType: 'unleaded',
//   brand: 'all',
//   suburb: 'all',
//   sortBy: 'price-low',
//   priceMax: '',
//   open24Hours: false,
//   verifiedOnly: false,
// }
```

### Sort Options

```typescript
import { SORT_OPTIONS } from '@/types';

Object.entries(SORT_OPTIONS).forEach(([key, config]) => {
  console.log(`${config.label}: ${config.field} ${config.direction}`);
});
```

### Fuel Type Labels

```typescript
import { FUEL_TYPE_LABELS } from '@/types';

const label = FUEL_TYPE_LABELS['unleaded']; // "Unleaded"
```

### Filter Presets

```typescript
import { FILTER_PRESETS } from '@/types';

const cheapestUnleaded = FILTER_PRESETS.find(
  (p) => p.id === 'cheapest-unleaded'
);
// Apply preset
setFilters({ ...DEFAULT_FILTER_STATE, ...cheapestUnleaded.filters });
```

## Best Practices

### ✅ Do

- Import types from `@/types` index
- Use type guards for runtime checks
- Use helper functions for formatting
- Define component props with types
- Use `AsyncState<T>` for async operations
- Use `FilterState` for filter state
- Use provided constants (e.g., `DEFAULT_FILTER_STATE`)

### ❌ Don't

- Define duplicate types in components
- Use `any` type
- Manually construct filter states
- Skip type checks on API responses
- Ignore TypeScript errors
- Use magic strings for sort/filter values

## Migration Guide

### Updating Existing Code

**Before:**

```typescript
// Inconsistent types
interface Station {
  id: number;
  name: string;
  prices: any;
}

interface Filters {
  search: string;
  sort: string;
}
```

**After:**

```typescript
// Use shared types
import { Listing, FilterState } from '@/types';

function MyComponent({ stations }: { stations: Listing[] }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  // ...
}
```

## Type Reference

### Quick Import Guide

```typescript
// Listing types
import {
  Listing,
  FuelPrices,
  ListingMetadata,
  PaginatedListings,
} from '@/types';

// Filter types
import { FilterState, SortOption, FilterOption, QueryParams } from '@/types';

// API types
import {
  APIResponse,
  PaginatedAPIResponse,
  APIError,
  AsyncState,
} from '@/types';

// Utilities
import {
  getCheapestPrice,
  formatListingPrice,
  sortListings,
  isListing,
  hasActiveFilters,
  createAsyncState,
} from '@/types';
```

---

**For full type definitions, see `/src/types/` directory**
