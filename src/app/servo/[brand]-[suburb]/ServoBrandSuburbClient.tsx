/**
 * Client Component for Brand + Suburb Pages
 * Displays all stations of a specific brand in a suburb
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';

import type { Station } from '@/types/station';

interface ServoBrandSuburbClientProps {
  brand: string;
  brandSlug: string;
  suburb: string;
  suburbSlug: string;
  stations: Station[];
}

export default function ServoBrandSuburbClient({
  brand,
  brandSlug,
  suburb,
  suburbSlug,
  stations,
}: ServoBrandSuburbClientProps) {
  const [selectedFuelType, setSelectedFuelType] = useState<string>('all');

  // Mock fuel prices - replace with real data
  const stationsWithPrices = stations.map((station) => ({
    ...station,
    prices: {
      unleaded: Math.floor(Math.random() * 40) + 150,
      diesel: Math.floor(Math.random() * 40) + 155,
      premium: Math.floor(Math.random() * 40) + 175,
      e10: Math.floor(Math.random() * 40) + 145,
    },
    isOpen24Hours: Math.random() > 0.5,
    lastUpdated: new Date(),
  }));

  const getCheapestPrice = (fuelType: string) => {
    if (fuelType === 'all') return null;
    return Math.min(
      ...stationsWithPrices.map(
        (s) => s.prices[fuelType as keyof typeof s.prices]
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="from-purple-600 to-purple-800 bg-gradient-to-r py-12 text-white">
        <div className="container mx-auto px-4">
          <nav className="mb-4 text-sm">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/servo" className="hover:underline">
              Servos
            </Link>
            <span className="mx-2">/</span>
            <span>
              {brand} {suburb}
            </span>
          </nav>

          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            {brand} Petrol Stations in {suburb}
          </h1>

          <p className="text-purple-100 mb-6 text-xl">
            Find the best {brand} fuel prices in {suburb}. Compare prices across{' '}
            {stations.length} {brand}{' '}
            {stations.length === 1 ? 'station' : 'stations'}.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="rounded-lg bg-white/10 px-6 py-4 backdrop-blur-sm">
              <div className="text-purple-100 text-sm">Stations Found</div>
              <div className="text-3xl font-bold">{stations.length}</div>
            </div>
            <div className="rounded-lg bg-white/10 px-6 py-4 backdrop-blur-sm">
              <div className="text-purple-100 text-sm">Brand</div>
              <div className="text-2xl font-bold">{brand}</div>
            </div>
            <div className="rounded-lg bg-white/10 px-6 py-4 backdrop-blur-sm">
              <div className="text-purple-100 text-sm">Location</div>
              <div className="text-2xl font-bold">{suburb}</div>
            </div>
          </div>

          <p className="text-purple-100 mt-4 text-sm">
            Last updated:{' '}
            {new Date().toLocaleString('en-AU', {
              timeZone: 'Australia/Melbourne',
              dateStyle: 'full',
              timeStyle: 'short',
            })}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Navigation */}
        <div className="bg-blue-50 dark:bg-blue-900/20 mb-8 rounded-lg p-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            Other {brand} Locations
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/fuel-brands/${brandSlug}`}
              className="hover:bg-blue-100 rounded-lg bg-white px-4 py-2 text-gray-700 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              All {brand} Stations
            </Link>
            <Link
              href={`/melbourne/${suburbSlug}`}
              className="hover:bg-blue-100 rounded-lg bg-white px-4 py-2 text-gray-700 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              All {suburb} Stations
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Fuel Type Filter */}
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Select Fuel Type
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All Fuels' },
                    { value: 'unleaded', label: 'Unleaded 91' },
                    { value: 'diesel', label: 'Diesel' },
                    { value: 'premium', label: 'Premium' },
                    { value: 'e10', label: 'E10' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedFuelType(value)}
                      className={`rounded-lg px-4 py-2 transition-colors ${
                        selectedFuelType === value
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedFuelType !== 'all' && (
                <div className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 mt-4 rounded-lg border p-4">
                  <div className="text-green-800 dark:text-green-200 text-sm">
                    Cheapest {selectedFuelType} price:{' '}
                    <span className="text-2xl font-bold">
                      {getCheapestPrice(selectedFuelType)}¢
                    </span>
                    /L
                  </div>
                </div>
              )}
            </div>

            {/* Station List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {brand} Stations in {suburb}
              </h2>

              {stationsWithPrices.map((station) => (
                <div
                  key={station.id}
                  className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {station.name}
                        </h3>
                        {station.isOpen24Hours && (
                          <span className="bg-green-100 text-green-800 rounded px-2.5 py-0.5 text-xs font-semibold">
                            24/7
                          </span>
                        )}
                      </div>

                      <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                        📍 {station.address}
                      </p>

                      {station.phoneNumber && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          📞{' '}
                          <a
                            href={`tel:${station.phoneNumber}`}
                            className="hover:underline"
                          >
                            {station.phoneNumber}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Fuel Prices Grid */}
                  <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                      <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                        Unleaded 91
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 text-xl font-bold">
                        {station.prices.unleaded}¢
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                      <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                        Diesel
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 text-xl font-bold">
                        {station.prices.diesel}¢
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                      <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                        Premium
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 text-xl font-bold">
                        {station.prices.premium}¢
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                      <div className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                        E10
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 text-xl font-bold">
                        {station.prices.e10}¢
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/stations/${station.id}`}
                      className="bg-purple-600 hover:bg-purple-700 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                    >
                      View Details
                    </Link>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* About Brand */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                About {brand}
              </h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {brand} operates {stations.length}{' '}
                {stations.length === 1 ? 'station' : 'stations'} in {suburb},
                offering competitive fuel prices and quality service to local
                motorists.
              </p>
              <Link
                href={`/fuel-brands/${brandSlug}`}
                className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline"
              >
                View all {brand} locations →
              </Link>
            </div>

            {/* Opening Hours */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Opening Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Monday - Friday
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    24 Hours
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Saturday - Sunday
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    24 Hours
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                * Hours may vary by location. Check individual station details.
              </p>
            </div>

            {/* FAQ */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Common Questions
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="mb-1 font-medium text-gray-900 dark:text-white">
                    Does {brand} offer rewards programs?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Many {brand} stations offer loyalty programs and fuel
                    discounts. Check with your local station for details.
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-gray-900 dark:text-white">
                    What payment methods are accepted?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Most {brand} stations accept cash, credit cards, and digital
                    wallets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


