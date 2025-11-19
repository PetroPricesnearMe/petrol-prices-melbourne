/**
 * Custom hook for managing filter state with URL synchronization
 * Provides instant sync with URL parameters for deep linking
 */

'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export interface FilterState {
  search: string;
  fuelType: string;
  brand: string;
  suburb: string;
  sortBy: string;
  priceMax: string;
  priceMin: string;
  amenities: string[];
  distance: string;
  rating: string;
  openNow: boolean;
  verified: boolean;
}

export interface FilterOptions {
  brands: string[];
  suburbs: string[];
  amenities: string[];
  fuelTypes: string[];
  sortOptions: Array<{ value: string; label: string; icon: string }>;
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  fuelType: 'unleaded',
  brand: 'all',
  suburb: 'all',
  sortBy: 'price-low',
  priceMax: '',
  priceMin: '',
  amenities: [],
  distance: '',
  rating: '',
  openNow: false,
  verified: false,
};

export function useFilterState(initialFilters?: Partial<FilterState>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse URL parameters into filter state
  const urlFilters = useMemo(() => {
    const filters = { ...DEFAULT_FILTERS, ...initialFilters };

    // Parse URL parameters
    filters.search = searchParams.get('search') || '';
    filters.fuelType = searchParams.get('fuelType') || 'unleaded';
    filters.brand = searchParams.get('brand') || 'all';
    filters.suburb = searchParams.get('suburb') || 'all';
    filters.sortBy = searchParams.get('sortBy') || 'price-low';
    filters.priceMax = searchParams.get('priceMax') || '';
    filters.priceMin = searchParams.get('priceMin') || '';
    filters.amenities = searchParams.get('amenities')?.split(',').filter(Boolean) || [];
    filters.distance = searchParams.get('distance') || '';
    filters.rating = searchParams.get('rating') || '';
    filters.openNow = searchParams.get('openNow') === 'true';
    filters.verified = searchParams.get('verified') === 'true';

    return filters;
  }, [searchParams, initialFilters]);

  // Update URL when filters change
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update URL parameters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === '' || value === false || value === 'all' || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else {
        params.set(key, String(value));
      }
    });

    // Update URL without causing a page reload
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    return Object.entries(urlFilters).filter(([key, value]) => {
      if (key === 'sortBy' || key === 'fuelType') return false; // Don't count default filters
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== false && value !== 'all';
    }).length;
  }, [urlFilters]);

  // Get filter summary for display
  const filterSummary = useMemo(() => {
    const summary: string[] = [];

    if (urlFilters.search) summary.push(`Search: "${urlFilters.search}"`);
    if (urlFilters.brand !== 'all') summary.push(`Brand: ${urlFilters.brand}`);
    if (urlFilters.suburb !== 'all') summary.push(`Suburb: ${urlFilters.suburb}`);
    if (urlFilters.priceMax) summary.push(`Max Price: ${urlFilters.priceMax}¢`);
    if (urlFilters.priceMin) summary.push(`Min Price: ${urlFilters.priceMin}¢`);
    if (urlFilters.amenities.length > 0) summary.push(`Amenities: ${urlFilters.amenities.join(', ')}`);
    if (urlFilters.distance) summary.push(`Distance: ${urlFilters.distance}km`);
    if (urlFilters.rating) summary.push(`Rating: ${urlFilters.rating}+`);
    if (urlFilters.openNow) summary.push('Open Now');
    if (urlFilters.verified) summary.push('Verified Only');

    return summary;
  }, [urlFilters]);

  return {
    filters: urlFilters,
    updateFilters,
    clearFilters,
    activeFilterCount,
    filterSummary,
  };
}
