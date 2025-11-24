'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import type { Station } from '@/types/station';

type FuelFilter = 'all' | 'unleaded' | 'diesel' | 'premium95' | 'premium98';
type SortOption = 'nearest' | 'price-low' | 'price-high' | 'name';

export interface ListingFiltersState {
  search: string;
  fuelType: FuelFilter;
  brand: string;
  suburb: string;
  sortBy: SortOption;
}

interface StationFiltersProps {
  filters: ListingFiltersState;
  onFiltersChange: Dispatch<SetStateAction<ListingFiltersState>>;
  stations: Station[];
}

const fuelOptions: Array<{ value: FuelFilter; label: string }> = [
  { value: 'all', label: 'All fuel types' },
  { value: 'unleaded', label: 'Unleaded' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'premium95', label: 'Premium 95' },
  { value: 'premium98', label: 'Premium 98' },
];

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'nearest', label: 'Nearest first' },
  { value: 'price-low', label: 'Lowest price' },
  { value: 'price-high', label: 'Highest price' },
  { value: 'name', label: 'Name A–Z' },
];

export function StationFilters({
  filters,
  onFiltersChange,
  stations,
}: StationFiltersProps) {
  const { brands, suburbs } = useMemo(() => {
    const uniqueBrands = new Set<string>();
    const uniqueSuburbs = new Set<string>();

    stations.forEach((station) => {
      if (station.brand) {
        uniqueBrands.add(station.brand);
      }
      if (station.suburb) {
        uniqueSuburbs.add(station.suburb);
      }
    });

    return {
      brands: Array.from(uniqueBrands).sort(),
      suburbs: Array.from(uniqueSuburbs).sort(),
    };
  }, [stations]);

  const updateFilters = (changes: Partial<ListingFiltersState>) => {
    onFiltersChange((prev) => ({ ...prev, ...changes }));
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-gray-800 dark:bg-gray-900/70">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Search
          </span>
          <div className="relative flex items-center">
            <Search
              className="pointer-events-none absolute left-3 h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              name="station-search"
              value={filters.search}
              onChange={(event) =>
                updateFilters({ search: event.target.value })
              }
              placeholder="Search by name, suburb, or brand"
              className="w-full rounded-2xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-primary-400 dark:focus:ring-primary-900"
            />
          </div>
        </label>

        {/* Fuel type */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Fuel type
          </span>
          <select
            className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-900"
            value={filters.fuelType}
            onChange={(event) =>
              updateFilters({ fuelType: event.target.value as FuelFilter })
            }
          >
            {fuelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {/* Brand */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Brand
          </span>
          <select
            className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-900"
            value={filters.brand}
            onChange={(event) => updateFilters({ brand: event.target.value })}
          >
            <option value="all">All brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>

        {/* Suburb */}
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Suburb
          </span>
          <select
            className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-900"
            value={filters.suburb}
            onChange={(event) => updateFilters({ suburb: event.target.value })}
          >
            <option value="all">All suburbs</option>
            {suburbs.map((suburb) => (
              <option key={suburb} value={suburb}>
                {suburb}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          <span>
            Showing {stations.length} station{stations.length === 1 ? '' : 's'}{' '}
            across {suburbs.length} suburbs
          </span>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Sort by
          <select
            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-900"
            value={filters.sortBy}
            onChange={(event) =>
              updateFilters({ sortBy: event.target.value as SortOption })
            }
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export default StationFilters;
