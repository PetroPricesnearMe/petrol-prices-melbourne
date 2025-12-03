/**
 * Client Component for Suburb Fuel Type Pages
 * Displays fuel prices for a specific fuel type in a suburb
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';

import type { Station } from '@/types/station';

interface SuburbFuelTypeClientProps {
  suburb: string;
  suburbSlug: string;
  fuelType: string;
  stations: Station[];
}

export default function SuburbFuelTypeClient({
  suburb,
  suburbSlug,
  fuelType,
  stations,
}: SuburbFuelTypeClientProps) {
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'name'>('price');

  // Normalize fuel type display
  const fuelTypeDisplay =
    fuelType === 'unleaded'
      ? 'Unleaded 91'
      : fuelType === 'diesel'
        ? 'Diesel'
        : fuelType === 'premium'
          ? 'Premium 95/98'
          : fuelType === 'e10'
            ? 'E10 Ethanol'
            : fuelType === 'e85'
              ? 'E85 Flex Fuel'
              : fuelType === 'lpg'
                ? 'LPG'
                : fuelType.toUpperCase();

  // Mock price data - replace with real data from API
  const stationsWithPrices = stations.map((station) => ({
    ...station,
    price: Math.floor(Math.random() * 40) + 150, // 150-190 cents
    lastUpdated: new Date(),
  }));

  // Sort stations
  const sortedStations = [...stationsWithPrices].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return 0;
  });

  const cheapestPrice = Math.min(...stationsWithPrices.map((s) => s.price));
  const averagePrice = Math.round(
    stationsWithPrices.reduce((sum, s) => sum + s.price, 0) /
      stationsWithPrices.length
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="from-blue-600 to-blue-800 bg-gradient-to-r py-12 text-white">
        <div className="container mx-auto px-4">
          <nav className="mb-4 text-sm">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/melbourne" className="hover:underline">
              Melbourne
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/melbourne/${suburbSlug}`} className="hover:underline">
              {suburb}
            </Link>
            <span className="mx-2">/</span>
            <span>{fuelTypeDisplay} Prices</span>
          </nav>

          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Cheapest {fuelTypeDisplay} Prices in {suburb} – Updated Today
          </h1>

          <p className="text-blue-100 mb-6 text-xl">
            Compare real-time {fuelTypeDisplay.toLowerCase()} prices at{' '}
            {stations.length} petrol stations in {suburb}
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="rounded-lg bg-white/10 px-6 py-4 backdrop-blur-sm">
              <div className="text-blue-100 text-sm">Cheapest Price</div>
              <div className="text-3xl font-bold">{cheapestPrice}¢</div>
            </div>
            <div className="rounded-lg bg-white/10 px-6 py-4 backdrop-blur-sm">
              <div className="text-blue-100 text-sm">Average Price</div>
              <div className="text-3xl font-bold">{averagePrice}¢</div>
            </div>
            <div className="rounded-lg bg-white/10 px-6 py-4 backdrop-blur-sm">
              <div className="text-blue-100 text-sm">Stations Found</div>
              <div className="text-3xl font-bold">{stations.length}</div>
            </div>
          </div>

          <p className="text-blue-100 mt-4 text-sm">
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
        {/* Quick Links */}
        <div className="bg-blue-50 dark:bg-blue-900/20 mb-8 rounded-lg p-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            More {suburb} Fuel Prices
          </h2>
          <div className="flex flex-wrap gap-3">
            {['unleaded', 'diesel', 'premium', 'e10'].map((type) => (
              <Link
                key={type}
                href={`/melbourne/${suburbSlug}/${type}`}
                className={`rounded-lg px-4 py-2 transition-colors ${
                  type === fuelType
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-blue-100 bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {type === 'unleaded'
                  ? 'Unleaded 91'
                  : type === 'diesel'
                    ? 'Diesel'
                    : type === 'premium'
                      ? 'Premium 95/98'
                      : type === 'e10'
                        ? 'E10'
                        : type.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Sort Controls */}
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {fuelTypeDisplay} Prices
                </h2>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Sort by:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="price">Cheapest Price</option>
                    <option value="name">Station Name</option>
                    <option value="distance">Distance</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Price List */}
            <div className="space-y-4">
              {sortedStations.map((station, index) => (
                <div
                  key={station.id}
                  className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        {index === 0 && (
                          <span className="bg-green-100 text-green-800 rounded px-2.5 py-0.5 text-xs font-semibold">
                            CHEAPEST
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {station.name}
                        </h3>
                      </div>

                      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                        📍 {station.address}
                      </p>

                      {station.brand && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          🏪 {station.brand}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-blue-600 dark:text-blue-400 text-3xl font-bold">
                        {station.price}¢
                      </div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        per litre
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/stations/${station.id}`}
                      className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
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
            {/* Map Placeholder */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Station Map
              </h3>
              <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="mb-2 text-4xl">🗺️</div>
                  <p className="text-sm">Interactive map</p>
                  <p className="text-xs">showing all stations</p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="mb-1 font-medium text-gray-900 dark:text-white">
                    What&apos;s the cheapest {fuelTypeDisplay.toLowerCase()} in{' '}
                    {suburb}?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Currently {cheapestPrice}¢ per litre at{' '}
                    {sortedStations[0]?.name}.
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-gray-900 dark:text-white">
                    How often are prices updated?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Prices are updated hourly from multiple sources including
                    station reports and user submissions.
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-gray-900 dark:text-white">
                    How many stations sell {fuelTypeDisplay.toLowerCase()} in{' '}
                    {suburb}?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    We track {stations.length} stations in {suburb} that sell{' '}
                    {fuelTypeDisplay.toLowerCase()}.
                  </p>
                </div>
              </div>
            </div>

            {/* Opening Hours Note */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 rounded-lg border p-4">
              <h4 className="text-yellow-900 dark:text-yellow-100 mb-2 text-sm font-semibold">
                💡 Pro Tip
              </h4>
              <p className="text-yellow-800 dark:text-yellow-200 text-xs">
                Fuel prices typically change on Wednesdays in Melbourne. Fill up
                on Tuesday for the best prices!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
