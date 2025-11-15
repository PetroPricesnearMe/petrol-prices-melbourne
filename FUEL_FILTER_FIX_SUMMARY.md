# Fuel Type Filter Fix Summary

## ✅ Issue Fixed

**Problem**: Fuel type dropdown was missing an "All Fuel Types" option, causing only ~323 stations to display instead of 700+ stations.

**Root Cause**: 
- Default `fuelType` was set to `'unleaded'` instead of `'all'`
- Dropdown only had specific fuel types (unleaded, diesel, premium95, premium98, lpg)
- Filtering logic was applying fuel type filter even when not needed

## 🔧 Fixes Applied

### 1. Added "All Fuel Types" Option
**Files Updated**:
- `src/app/directory/StationDirectoryClient.tsx`
- `src/app/directory/StationDirectoryWithMap.tsx`
- `src/app/map/MapViewClient.tsx`

**Changes**:
- Added `<option value="all">All Fuel Types</option>` as the first option in all fuel type dropdowns
- Updated TypeScript types to support `fuelType: keyof FuelPrices | 'all'`

### 2. Changed Default Filter Value
**Before**: `fuelType: 'unleaded'`  
**After**: `fuelType: 'all'`

**Impact**: All stations now show by default instead of only those with unleaded prices.

### 3. Updated Filtering Logic
**Enhanced filtering to handle 'all' option**:

```typescript
// Only filter by fuel type if not 'all' AND when price sorting/filtering is active
if (filters.fuelType !== 'all') {
  const isPriceSorting = filters.sortBy === 'price-low' || filters.sortBy === 'price-high';
  const hasPriceFilter = filters.priceMax !== '';

  if (isPriceSorting || hasPriceFilter) {
    result = result.filter((s) => s.fuelPrices[filters.fuelType] !== null);
  }
}
```

**Price filtering**:
- Only applies when `fuelType !== 'all'`
- Prevents filtering out stations when user wants to see all fuel types

### 4. Enhanced Price Sorting
**When `fuelType === 'all'`**:
- Uses minimum price across all fuel types for sorting
- Ensures accurate price-based sorting even when showing all fuel types

```typescript
if (filters.fuelType === 'all') {
  const pricesA = Object.values(a.fuelPrices).filter((p): p is number => p !== null);
  const pricesB = Object.values(b.fuelPrices).filter((p): p is number => p !== null);
  const minPriceA = pricesA.length > 0 ? Math.min(...pricesA) : Infinity;
  const minPriceB = pricesB.length > 0 ? Math.min(...pricesB) : Infinity;
  return minPriceA - minPriceB;
}
```

### 5. Updated Clear Filters Function
**Before**: Reset to `fuelType: 'unleaded'`  
**After**: Reset to `fuelType: 'all'`

### 6. Fixed Active Filter Count
Updated logic to properly exclude `fuelType: 'all'` from active filter count.

## 📊 Expected Results

- **Before**: ~323 stations displayed (only those with unleaded prices)
- **After**: 700+ stations displayed (all stations regardless of fuel type)

## 🧪 Testing Checklist

- [ ] Verify all stations show when "All Fuel Types" is selected
- [ ] Verify filtering by specific fuel type works correctly
- [ ] Verify price sorting works with "All Fuel Types" selected
- [ ] Verify price filtering works with specific fuel type selected
- [ ] Verify clear filters resets to "All Fuel Types"
- [ ] Test on all pages: `/directory`, `/map`, directory with map view

## 🔍 Files Modified

1. `src/app/directory/StationDirectoryClient.tsx`
2. `src/app/directory/StationDirectoryWithMap.tsx`
3. `src/app/map/MapViewClient.tsx`
4. `lib/seo/analytics.ts` (fixed gtag type conflict)

## 📝 TypeScript Type Updates

Updated `SearchFilters` interface in all three files:
```typescript
interface SearchFilters {
  search: string;
  fuelType: keyof FuelPrices | 'all';  // Added 'all' option
  brand: string;
  suburb: string;
  sortBy: SortOption;
  priceMax: string;
}
```

---

**Status**: ✅ Fixed and ready for testing
**Impact**: All 700+ stations now display correctly when "All Fuel Types" is selected

