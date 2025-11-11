/**
 * Station Directory Page - REFACTORED VERSION
 * Demonstrates responsive layout patterns with new layout system
 * 
 * This is an example showing how to refactor directory/page.tsx
 * using the new ResponsiveGrid components
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';

import { InfiniteScrollDirectory } from '@/components/directory/InfiniteScrollDirectory';
import { DirectoryLayout } from '@/components/layout/PageLayouts';
import { LoadingCard } from '@/components/ui/LoadingSpinner';
import { ResponsiveGrid, GridItem } from '@/components/layout/ResponsiveGrid';
import { StructuredData } from '@/components/StructuredData';
import metadataJson from '@/data/stations-metadata.json';
import { generateWebSiteSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: `Melbourne Petrol Stations Directory - ${metadataJson.totalStations}+ Stations | Find Cheapest Fuel`,
  description:
    `Browse our complete directory of ${metadataJson.totalStations}+ petrol stations across ${metadataJson.suburbs.length}+ Melbourne suburbs. Compare live fuel prices from BP, Shell, Caltex, 7-Eleven, and more. Find the cheapest petrol near you.`,
};

export const revalidate = 86400; // 24 hours

export default function DirectoryPageRefactored() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';
  const structuredDataSchemas = generateWebSiteSchema(baseUrl);

  // Stats data
  const stats = [
    { label: 'Total Stations', value: metadataJson.totalStations },
    { label: 'Suburbs', value: `${metadataJson.suburbs.length}+` },
    { label: 'Avg Price', value: `${metadataJson.priceRange.unleaded.average}¢/L` },
  ];

  // Filter panel (placeholder - would be implemented separately)
  const filters = (
    <div className="card p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-4">Filters</h3>
        
        {/* Fuel Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Fuel Type</label>
          <select className="input w-full">
            <option>All Types</option>
            <option>Unleaded (ULP)</option>
            <option>Premium 95</option>
            <option>Premium 98</option>
            <option>Diesel</option>
            <option>E10</option>
          </select>
        </div>

        {/* Brand */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Brand</label>
          <div className="space-y-2">
            {['All Brands', 'Shell', 'BP', 'Caltex', '7-Eleven', 'United'].map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Max Price</label>
          <input type="range" min="150" max="250" className="w-full" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>150¢</span>
            <span>250¢</span>
          </div>
        </div>

        {/* Distance */}
        <div>
          <label className="block text-sm font-medium mb-2">Distance</label>
          <select className="input w-full">
            <option>Any Distance</option>
            <option>Within 5km</option>
            <option>Within 10km</option>
            <option>Within 20km</option>
          </select>
        </div>
      </div>

      <button className="btn btn-primary w-full">Apply Filters</button>
      <button className="btn btn-outlined w-full">Reset</button>
    </div>
  );

  return (
    <>
      <StructuredData data={structuredDataSchemas} />

      <DirectoryLayout
        title="Melbourne Petrol Stations Directory"
        description={`Browse ${metadataJson.totalStations}+ stations across ${metadataJson.suburbs.length}+ suburbs with live fuel prices`}
        stats={stats}
        filters={filters}
        actions={
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="btn btn-primary">
              📍 Near Me
            </button>
            <button className="btn btn-outlined">
              🗺️ Map View
            </button>
            <button className="btn btn-outlined">
              ⭐ Favorites
            </button>
          </div>
        }
      >
        <Suspense fallback={<DirectoryLoading />}>
          <InfiniteScrollDirectory />
        </Suspense>
      </DirectoryLayout>
    </>
  );
}

// Loading State with Responsive Grid
function DirectoryLoading() {
  return (
    <div className="space-y-6">
      {/* Loading Header */}
      <div className="animate-pulse space-y-3">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>

      {/* Loading Cards Grid */}
      <ResponsiveGrid
        cols={{
          default: 1,
          sm: 2,
          xl: 3,
        }}
        gap="lg"
      >
        {[...Array(9)].map((_, i) => (
          <GridItem key={i}>
            <LoadingCard />
          </GridItem>
        ))}
      </ResponsiveGrid>
    </div>
  );
}

