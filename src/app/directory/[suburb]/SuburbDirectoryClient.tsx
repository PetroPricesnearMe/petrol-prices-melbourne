/**
 * Suburb Directory Client Component
 * Handles interactive features like sorting and search params
 * Wrapped in Suspense to prevent prerender errors
 */

'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SortDropdown, type SortOption } from '@/components/molecules/SortDropdown';
import { cn, patterns } from '@/styles/system/css-in-js';
import type { Station } from '@/types/station';

interface Props {
  suburb: string;
  stations: Station[];
  suburbName: string;
}

interface SearchFilters {
  sortBy: SortOption;
}

export function SuburbDirectoryClient({ suburb, stations, suburbName }: Props) {
  // Sort by unleaded price (lowest first) by default
  const sortedStations = [...stations].sort((a, b) => {
    const priceA = a.fuelPrices.unleaded || Infinity;
    const priceB = b.fuelPrices.unleaded || Infinity;
    return priceA - priceB;
  });

  const avgPrice = stations
    .filter(s => s.fuelPrices.unleaded)
    .reduce((sum, s) => sum + (s.fuelPrices.unleaded || 0), 0) / stations.filter(s => s.fuelPrices.unleaded).length;

  const getPriceColor = (price: number | null): string => {
    if (price === null) return 'text-gray-400';
    if (price < 200) return 'text-success-600 dark:text-success-400';
    if (price <= 210) return 'text-warning-600 dark:text-warning-400';
    return 'text-error-600 dark:text-error-400';
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-primary text-white py-12">
        <div className={patterns.container()}>
          <Link
            href="/directory"
            className="text-white/80 hover:text-white mb-4 inline-flex items-center gap-2 transition-colors"
          >
            ← Back to All Stations
          </Link>
          <h1 className={cn(patterns.text.h1, 'text-white mb-4')}>
            Petrol Stations in {suburbName}
          </h1>
          <p className={cn(patterns.text.body, 'text-white/90 max-w-2xl mb-6')}>
            Compare fuel prices across {stations.length} petrol stations in {suburbName}, VIC
          </p>
          <div className="flex gap-4 flex-wrap text-sm">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <strong>{stations.length}</strong> Stations
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              Average Price: <strong>{avgPrice.toFixed(1)}¢/L</strong>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              Lowest: <strong>{sortedStations[0].fuelPrices.unleaded?.toFixed(1) || 'N/A'}¢/L</strong>
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Controls */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className={patterns.container()}>
          <div className="py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stations.length} station{stations.length !== 1 ? 's' : ''} in {suburbName}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                <Suspense fallback={<div className="w-48 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />}>
                  <SortDropdown
                    value="price-low"
                    onChange={() => {}} // No-op since we're showing static sorted data
                    syncWithUrl={false} // Disable URL sync for suburb pages
                    className="w-48"
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stations Grid */}
      <section className="py-12">
        <div className={patterns.container()}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedStations.map((station, index) => (
              <article
                key={station.id}
                className="card card-hover"
                itemScope
                itemType="https://schema.org/GasStation"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white" itemProp="name">
                      {station.name}
                    </h2>
                    {index === 0 && (
                      <span className="badge badge-success text-xs">Cheapest</span>
                    )}
                  </div>
                  <span className="badge badge-primary">{station.brand}</span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>📍 {station.address}</p>
                    <p className="mt-1">{station.suburb} {station.postcode}</p>
                  </div>

                  {/* Fuel Prices */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Current Prices
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(station.fuelPrices).map(([type, price]) => {
                        if (price === null) return null;
                        return (
                          <div key={type} className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400 capitalize text-sm">
                              {type === 'premium95' ? 'Premium 95' : type === 'premium98' ? 'Premium 98' : type}
                            </span>
                            <span className={cn('text-lg font-bold', getPriceColor(price))}>
                              {price.toFixed(1)}¢
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(station.address + ' ' + station.suburb)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full btn-sm"
                  >
                    🧭 Get Directions
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* SEO Content */}
          <div className="mt-16 prose dark:prose-invert max-w-none">
            <h2>Petrol Stations in {suburbName}, Victoria</h2>
            <p>
              Compare fuel prices across {stations.length} petrol stations in {suburbName}.
              Our directory includes stations from major brands like BP, Shell, Caltex, and 7-Eleven,
              as well as independent operators. Find the cheapest petrol prices and save money on every fill-up.
            </p>
            <h3>About {suburbName} Fuel Prices</h3>
            <p>
              The average petrol price in {suburbName} is currently {avgPrice.toFixed(1)}¢ per liter for unleaded fuel.
              Use our directory to compare prices and find the best deals in your area.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
