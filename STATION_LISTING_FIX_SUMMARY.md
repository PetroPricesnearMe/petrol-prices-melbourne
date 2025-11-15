# Station Listing Fix - Complete Summary

## Problem Identified

Only half of the stations were being displayed in the directory and map views. The issue was caused by aggressive fuel type filtering that was applied by default.

## Root Cause

The filtering logic was **always** filtering out stations that didn't have prices for the selected fuel type (defaulting to "Unleaded 91"). This meant:

1. Default `sortBy` was set to `'price-low'`
2. Default `fuelType` was set to `'unleaded'`
3. The filter logic **unconditionally** applied: `result = result.filter((s) => s.fuelPrices[filters.fuelType] !== null);`
4. Result: Stations without unleaded prices were completely hidden, even when users just wanted to browse all stations

## Solution Implemented

### 1. Changed Default Sort Order

Changed the default `sortBy` from `'price-low'` to `'name'` in three components:

- `src/app/directory/StationDirectoryClient.tsx`
- `src/app/map/MapViewClient.tsx`
- `src/app/directory/StationDirectoryWithMap.tsx`

This ensures stations are displayed alphabetically by default rather than forcing a price-based sort that requires fuel type filtering.

### 2. Conditional Fuel Type Filtering

Modified the filtering logic to **only** apply fuel type filtering when:

- User explicitly selects price-based sorting (`price-low` or `price-high`), OR
- User applies a maximum price filter

**New Filtering Logic:**

```typescript
// ONLY filter by fuel type when user is actively sorting by price or filtering by max price
// This ensures all stations show by default instead of just those with the selected fuel type
const isPriceSorting =
  filters.sortBy === 'price-low' || filters.sortBy === 'price-high';
const hasPriceFilter = filters.priceMax !== '';

if (isPriceSorting || hasPriceFilter) {
  // Only show stations with selected fuel type when price sorting/filtering is active
  result = result.filter((s) => s.fuelPrices[filters.fuelType] !== null);
}
```

### 3. Updated Clear Filters Function

Updated the `clearFilters` function in MapViewClient.tsx to reset to `'name'` sorting instead of `'price-low'`.

## Files Modified

1. **src/app/directory/StationDirectoryClient.tsx**
   - Changed default `sortBy` from `'price-low'` to `'name'`
   - Added conditional fuel type filtering logic

2. **src/app/map/MapViewClient.tsx**
   - Changed default `sortBy` from `'price-low'` to `'name'`
   - Added conditional fuel type filtering logic
   - Updated `clearFilters` to use `'name'` sorting
   - Updated `activeFilterCount` to exclude `'name'` instead of `'price-low'`

3. **src/app/directory/StationDirectoryWithMap.tsx**
   - Changed default `sortBy` from `'price-low'` to `'name'`
   - Added conditional fuel type filtering logic

## Expected Behavior After Fix

### Default View (No Filters Applied)

- ✅ **All stations** are displayed
- ✅ Sorted alphabetically by name
- ✅ No fuel type filtering applied

### When User Selects Price Sorting

- ✅ Stations are filtered to show only those with the selected fuel type
- ✅ Sorted by price (low to high or high to low)
- ✅ This makes sense because you can't sort by price for stations that don't have that fuel type

### When User Applies Price Filter

- ✅ Stations are filtered to show only those with the selected fuel type
- ✅ Only stations within the price range are shown
- ✅ Makes sense because price filtering requires a specific fuel type

### When User Selects Name/Suburb Sorting

- ✅ **All stations** are displayed (no fuel type filtering)
- ✅ Sorted by name or suburb
- ✅ Users can browse all stations regardless of fuel type

## Benefits

1. **Better UX**: Users see all available stations by default
2. **More Accurate**: Station count matches total available stations
3. **Logical Behavior**: Filtering by fuel type only happens when relevant (price operations)
4. **Flexibility**: Users can still filter by fuel type when sorting by price
5. **Intuitive**: Default alphabetical sorting is familiar and doesn't exclude data

## Testing Recommendations

1. **Load Directory Page**: Verify all ~250 stations appear (not just ~125)
2. **Load Map View**: Verify all stations show on the map
3. **Apply Price Sorting**: Verify fuel type filter activates and shows appropriate stations
4. **Clear Filters**: Verify all stations reappear with name sorting
5. **Apply Price Filter**: Verify fuel type filter activates appropriately
6. **Switch Between Sorts**: Test all sort options work correctly

## Notes

- The fuel type selector still works as expected when users choose price-based operations
- This fix maintains backward compatibility with existing functionality
- No API or data structure changes required
- All existing tests should continue to pass
