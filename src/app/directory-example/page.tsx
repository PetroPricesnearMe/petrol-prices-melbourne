/**
 * Example Directory Page - Optimized Station Cards
 *
 * Demonstrates how to use the optimized station cards with all features
 *
 * @module app/directory-example
 */

'use client';

import { useState } from 'react';
import {
  StationCardGrid,
  FeaturedStationGrid,
  CompactStationGrid,
} from '@/components/cards/StationCardGrid';
import type { Station } from '@/types/station';

// Example station data
const EXAMPLE_STATIONS: Station[] = [
  {
    id: '1',
    name: 'Shell Carlton North',
    stationName: 'Shell Carlton North',
    brand: 'Shell',
    address: '123 Lygon Street',
    suburb: 'Carlton North',
    postcode: '3054',
    region: 'Melbourne',
    latitude: -37.7833,
    longitude: 144.9667,
    logoUrl: '/images/brands/shell.svg',
    rating: 4.8,
    reviewCount: 245,
    fuelPrices: {
      unleaded: 189.9,
      premium95: 209.9,
      premium98: 219.9,
      diesel: 185.9,
    },
    amenities: {
      hasCarWash: true,
      hasShop: true,
      hasRestroom: true,
      hasATM: true,
      hasElectricCharging: true,
      hasCafe: true,
      isOpen24Hours: true,
    },
    lastUpdated: '2024-12-03T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'BP Thornbury',
    stationName: 'BP Thornbury',
    brand: 'BP',
    address: '456 High Street',
    suburb: 'Thornbury',
    postcode: '3071',
    region: 'Melbourne',
    latitude: -37.7622,
    longitude: 144.9999,
    logoUrl: '/images/brands/bp.svg',
    rating: 4.5,
    reviewCount: 187,
    fuelPrices: {
      unleaded: 191.9,
      premium95: 211.9,
      diesel: 187.9,
    },
    amenities: {
      hasCarWash: true,
      hasShop: true,
      hasRestroom: true,
      hasATM: false,
      isOpen24Hours: false,
    },
    lastUpdated: '2024-12-03T00:00:00.000Z',
  },
  {
    id: '3',
    name: '7-Eleven Fitzroy',
    stationName: '7-Eleven Fitzroy',
    brand: '7-Eleven',
    address: '789 Brunswick Street',
    suburb: 'Fitzroy',
    postcode: '3065',
    region: 'Melbourne',
    latitude: -37.8011,
    longitude: 144.9783,
    logoUrl: '/images/brands/7-eleven.svg',
    rating: 4.2,
    reviewCount: 156,
    fuelPrices: {
      unleaded: 187.9,
      premium95: 207.9,
      diesel: 183.9,
    },
    amenities: {
      hasShop: true,
      hasRestroom: true,
      isOpen24Hours: true,
    },
    lastUpdated: '2024-12-03T00:00:00.000Z',
  },
  {
    id: '4',
    name: 'Coles Express Preston',
    stationName: 'Coles Express Preston',
    brand: 'Coles Express',
    address: '321 Murray Road',
    suburb: 'Preston',
    postcode: '3072',
    region: 'Melbourne',
    latitude: -37.7422,
    longitude: 145.0011,
    logoUrl: '/images/brands/coles-express.svg',
    rating: 4.6,
    reviewCount: 203,
    fuelPrices: {
      unleaded: 188.9,
      premium95: 208.9,
      diesel: 184.9,
    },
    amenities: {
      hasCarWash: true,
      hasShop: true,
      hasRestroom: true,
      hasATM: true,
    },
    lastUpdated: '2024-12-03T00:00:00.000Z',
  },
];

/**
 * Example Directory Page
 */
export default function DirectoryExamplePage() {
  const [viewMode, setViewMode] = useState<'standard' | 'featured' | 'compact'>(
    'standard'
  );
  const [showTransitions, setShowTransitions] = useState(true);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Optimized Station Directory
          </h1>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
            Featuring SEO-optimized cards with badges, certifications, and
            performance enhancements
          </p>

          {/* View Mode Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('standard')}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  viewMode === 'standard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                Standard Grid
              </button>
              <button
                onClick={() => setViewMode('featured')}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  viewMode === 'featured'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                Featured Grid
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  viewMode === 'compact'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                Compact Grid
              </button>
            </div>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={showTransitions}
                onChange={(e) => setShowTransitions(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Show Animations
              </span>
            </label>
          </div>
        </header>

        {/* Features List */}
        <section className="mb-8 rounded-xl bg-white p-6 dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            ✨ Card Features
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🖼️</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Optimized Images
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  300x300px uniform sizing, WebP format, lazy loading
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏅</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Smart Badges
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  14 badge types, priority-based display
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  SEO Optimized
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Schema.org markup, semantic HTML, rich snippets
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  High Performance
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  GPU acceleration, content visibility, layout containment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Fully Responsive
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  1-4 columns based on screen size, mobile-optimized
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">♿</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Accessible
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  WCAG AA compliant, keyboard navigation, ARIA labels
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Station Cards Grid */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Petrol Stations Directory
          </h2>

          {viewMode === 'standard' && (
            <StationCardGrid
              stations={EXAMPLE_STATIONS}
              gridColumns={3}
              gap="lg"
              showTransitions={showTransitions}
              maxBadges={3}
              getVerified={(station) =>
                station.id === '1' || station.id === '4'
              }
              getCheapestInArea={(station) => station.id === '3'}
              getViewCount={(station) => {
                const counts: Record<string, number> = {
                  '1': 2800,
                  '2': 1200,
                  '3': 1800,
                  '4': 950,
                };
                return counts[station.id] || 0;
              }}
              onCardClick={(station) => {
                alert(`You clicked: ${station.name}`);
              }}
            />
          )}

          {viewMode === 'featured' && (
            <FeaturedStationGrid
              stations={EXAMPLE_STATIONS.slice(0, 2)}
              showTransitions={showTransitions}
              maxBadges={4}
              getVerified={() => true}
              getCheapestInArea={(station) => station.id === '1'}
              onCardClick={(station) => {
                alert(`Featured Station: ${station.name}`);
              }}
            />
          )}

          {viewMode === 'compact' && (
            <CompactStationGrid
              stations={EXAMPLE_STATIONS}
              showTransitions={showTransitions}
              maxBadges={2}
              getVerified={(station) => station.id === '1'}
              onCardClick={(station) => {
                alert(`Station: ${station.name}`);
              }}
            />
          )}
        </section>

        {/* Footer Info */}
        <footer className="mt-12 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            This example demonstrates all features of the optimized station card
            system.
          </p>
          <p className="mt-2">
            See{' '}
            <a
              href="/OPTIMIZED_DIRECTORY_CARDS_GUIDE.md"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              OPTIMIZED_DIRECTORY_CARDS_GUIDE.md
            </a>{' '}
            for complete documentation.
          </p>
        </footer>
      </div>
    </main>
  );
}
