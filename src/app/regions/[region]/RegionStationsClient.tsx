/**
 * Region Stations Client Component
 * Display stations for a specific region
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState, useMemo } from 'react';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cn, patterns, animations } from '@/styles/system/css-in-js';

interface RegionProps {
  region: {
    name: string;
    description: string;
    color: string;
  };
  regionSlug: string;
}

// Mock stations - replace with actual API call
const mockStations = [
  {
    id: 1,
    name: 'Shell Coles Express',
    brand: 'Shell',
    address: '123 Main St',
    suburb: 'Preston',
    fuelPrices: [
      { type: 'Unleaded', price: 1.85 },
      { type: 'Diesel', price: 1.75 },
    ],
  },
];

export function RegionStationsClient({ region, regionSlug }: RegionProps) {
  const [sortBy, setSortBy] = useState('price-low');

  const { data: stations = mockStations, isLoading } = useQuery({
    queryKey: ['stations', regionSlug],
    queryFn: async () => {
      // Replace with actual API call
      return mockStations;
    },
  });

  const sortedStations = useMemo(() => {
    const result = [...stations];
    result.sort((a, b) => {
      if (sortBy === 'price-low') {
        const avgA =
          a.fuelPrices.reduce((sum, p) => sum + p.price, 0) /
          a.fuelPrices.length;
        const avgB =
          b.fuelPrices.reduce((sum, p) => sum + p.price, 0) /
          b.fuelPrices.length;
        return avgA - avgB;
      }
      return a.name.localeCompare(b.name);
    });
    return result;
  }, [stations, sortBy]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header
        className="py-16 text-white"
        style={{
          background: `linear-gradient(135deg, ${region.color} 0%, ${region.color}CC 100%)`,
        }}
      >
        <div className={patterns.container()}>
          <div className={patterns.flex.colCenter}>
            <Link
              href="/directory"
              className="mb-4 inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
            >
              ← Back to All Regions
            </Link>
            <h1 className={cn(patterns.text.h1, 'mb-4 text-center text-white')}>
              {region.name}
            </h1>
            <p
              className={cn(
                patterns.text.body,
                'mb-6 max-w-2xl text-center text-white/90'
              )}
            >
              {region.description}
            </p>
            <div className="flex items-center gap-4">
              <span className="badge bg-white/20 px-6 py-2 text-base text-white">
                <strong>{stations.length}</strong> Stations
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <section className="print-hidden border-b border-gray-200 bg-white py-6 dark:border-gray-700 dark:bg-gray-800">
        <div className={patterns.container()}>
          <div className={patterns.flex.between}>
            <label
              htmlFor="sort-by-select"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Sort by:
            </label>
            <select
              id="sort-by-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input input-sm"
            >
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Station List */}
      <section className="py-12">
        <div className={patterns.container()}>
          {isLoading ? (
            <div className={patterns.flex.center + ' py-20'}>
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className={patterns.grid(3, 'lg')}>
              {sortedStations.map((station, index) => (
                <div
                  key={station.id}
                  className={cn(
                    'card-hover print-avoid-break',
                    animations.safe('animate-fade-in')
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                      {station.name}
                    </h3>
                    <span className="badge badge-primary">{station.brand}</span>
                  </div>

                  <div className="space-y-4 p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📍 {station.address}, {station.suburb}
                    </p>

                    {station.fuelPrices.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-semibold">
                          Current Prices:
                        </h4>
                        <div className="space-y-2">
                          {station.fuelPrices.map((price, i) => (
                            <div key={i} className={patterns.flex.between}>
                              <span className="text-gray-600 dark:text-gray-400">
                                {price.type}
                              </span>
                              <span className="text-lg font-bold text-primary-600">
                                ${price.price.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="print-hidden border-t border-gray-200 p-6 dark:border-gray-700">
                    <button className="btn-primary btn w-full">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
