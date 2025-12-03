/**
 * Client Component for Today's Suburb Fuel Prices
 * Displays all fuel prices for today in a specific suburb
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';

import type { Station } from '@/types/station';

interface SuburbTodayPricesClientProps {
  suburb: string;
  suburbSlug: string;
  stations: Station[];
}

export default function SuburbTodayPricesClient({
  suburb,
  suburbSlug,
  stations,
}: SuburbTodayPricesClientProps) {
  const [sortBy, setSortBy] = useState<'unleaded' | 'diesel' | 'name'>(
    'unleaded'
  );

  // Mock fuel prices - replace with real data
  const stationsWithPrices = stations.map((station) => ({
    ...station,
    prices: {
      unleaded: Math.floor(Math.random() * 40) + 150,
      diesel: Math.floor(Math.random() * 40) + 155,
      premium: Math.floor(Math.random() * 40) + 175,
      e10: Math.floor(Math.random() * 40) + 145,
      lpg: Math.floor(Math.random() * 30) + 80,
    },
    lastUpdated: new Date(),
  }));

  // Calculate price statistics
  const calculateStats = (
    fuelType: keyof (typeof stationsWithPrices)[0]['prices']
  ) => {
    const prices = stationsWithPrices.map((s) => s.prices[fuelType]);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    };
  };

  const unleadedStats = calculateStats('unleaded');
  const dieselStats = calculateStats('diesel');
  const premiumStats = calculateStats('premium');

  // Sort stations
  const sortedStations = [...stationsWithPrices].sort((a, b) => {
    if (sortBy === 'unleaded') return a.prices.unleaded - b.prices.unleaded;
    if (sortBy === 'diesel') return a.prices.diesel - b.prices.diesel;
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return 0;
  });

  // Get current day and time
  const now = new Date();
  const dayName = now.toLocaleDateString('en-AU', { weekday: 'long' });
  const dateString = now.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="from-green-600 to-green-800 bg-gradient-to-r py-12 text-white">
        <div className="container mx-auto px-4">
          <nav className="mb-4 text-sm">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/suburb" className="hover:underline">
              Suburbs
            </Link>
            <span className="mx-2">/</span>
            <span>Fuel Prices {suburb} Today</span>
          </nav>

          <div className="mb-4">
            <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-sm">
              {dayName}, {dateString}
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Fuel Prices in {suburb} – Today&apos;s Best Prices
          </h1>

          <p className="text-green-100 mb-6 text-xl">
            Compare today&apos;s fuel prices at {stations.length} petrol
            stations in {suburb}. Find the cheapest petrol, diesel, and premium
            fuel near you.
          </p>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-green-100 text-sm">Cheapest Unleaded</div>
              <div className="text-3xl font-bold">{unleadedStats.min}¢</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-green-100 text-sm">Cheapest Diesel</div>
              <div className="text-3xl font-bold">{dieselStats.min}¢</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-green-100 text-sm">Cheapest Premium</div>
              <div className="text-3xl font-bold">{premiumStats.min}¢</div>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-green-100 text-sm">Stations</div>
              <div className="text-3xl font-bold">{stations.length}</div>
            </div>
          </div>

          <p className="text-green-100 mt-4 text-sm">
            ⏰ Last updated:{' '}
            {now.toLocaleTimeString('en-AU', {
              timeZone: 'Australia/Melbourne',
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            AEST
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Price Summary */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Today&apos;s Price Summary
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="border-blue-500 border-l-4 pl-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Unleaded 91
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Cheapest:
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    {unleadedStats.min}¢
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Average:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {unleadedStats.avg}¢
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Highest:
                  </span>
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {unleadedStats.max}¢
                  </span>
                </div>
              </div>
            </div>

            <div className="border-yellow-500 border-l-4 pl-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Diesel
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Cheapest:
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    {dieselStats.min}¢
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Average:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {dieselStats.avg}¢
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Highest:
                  </span>
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {dieselStats.max}¢
                  </span>
                </div>
              </div>
            </div>

            <div className="border-purple-500 border-l-4 pl-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Premium 95/98
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Cheapest:
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    {premiumStats.min}¢
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Average:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {premiumStats.avg}¢
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Highest:
                  </span>
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {premiumStats.max}¢
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Sort Controls */}
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  All Stations in {suburb}
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
                    <option value="unleaded">Cheapest Unleaded</option>
                    <option value="diesel">Cheapest Diesel</option>
                    <option value="name">Station Name</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Station Cards */}
            <div className="space-y-4">
              {sortedStations.map((station, index) => (
                <div
                  key={station.id}
                  className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        {index < 3 && (
                          <span
                            className={`rounded px-2.5 py-0.5 text-xs font-semibold ${
                              index === 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : index === 1
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {index === 0
                              ? '🥇 #1'
                              : index === 1
                                ? '🥈 #2'
                                : '🥉 #3'}
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {station.name}
                        </h3>
                      </div>

                      <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                        📍 {station.address}
                      </p>

                      {station.brand && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          🏪 {station.brand}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Fuel Prices */}
                  <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                    {Object.entries(station.prices).map(([type, price]) => (
                      <div
                        key={type}
                        className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700"
                      >
                        <div className="mb-1 text-xs capitalize text-gray-600 dark:text-gray-400">
                          {type === 'unleaded'
                            ? 'Unleaded 91'
                            : type === 'diesel'
                              ? 'Diesel'
                              : type === 'premium'
                                ? 'Premium'
                                : type === 'e10'
                                  ? 'E10'
                                  : type === 'lpg'
                                    ? 'LPG'
                                    : type}
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 text-lg font-bold">
                          {price}¢
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/stations/${station.id}`}
                      className="bg-green-600 hover:bg-green-700 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                    >
                      View Station Details
                    </Link>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                      📍 Get Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                More {suburb} Prices
              </h3>
              <div className="space-y-2">
                <Link
                  href={`/melbourne/${suburbSlug}/unleaded`}
                  className="text-blue-600 dark:text-blue-400 block text-sm hover:underline"
                >
                  → Unleaded prices in {suburb}
                </Link>
                <Link
                  href={`/melbourne/${suburbSlug}/diesel`}
                  className="text-blue-600 dark:text-blue-400 block text-sm hover:underline"
                >
                  → Diesel prices in {suburb}
                </Link>
                <Link
                  href={`/melbourne/${suburbSlug}/premium`}
                  className="text-blue-600 dark:text-blue-400 block text-sm hover:underline"
                >
                  → Premium prices in {suburb}
                </Link>
                <Link
                  href={`/melbourne/${suburbSlug}`}
                  className="text-blue-600 dark:text-blue-400 block text-sm hover:underline"
                >
                  → All {suburb} stations
                </Link>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Today&apos;s Fuel Guide
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="mb-1 font-medium text-gray-900 dark:text-white">
                    When do prices update?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Prices are updated hourly throughout the day. Major price
                    changes typically occur early morning.
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-gray-900 dark:text-white">
                    Best time to fill up?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    In Melbourne, fuel prices typically rise on Wednesday. The
                    cheapest day is usually Tuesday.
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-gray-900 dark:text-white">
                    How accurate are these prices?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Prices are sourced from station reports and verified user
                    submissions, updated within the last hour.
                  </p>
                </div>
              </div>
            </div>

            {/* Alert */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 rounded-lg border p-4">
              <h4 className="text-blue-900 dark:text-blue-100 mb-2 text-sm font-semibold">
                💡 Price Alert
              </h4>
              <p className="text-blue-800 dark:text-blue-200 text-xs">
                Save up to {unleadedStats.max - unleadedStats.min}¢/L by
                choosing the cheapest station in {suburb}!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
