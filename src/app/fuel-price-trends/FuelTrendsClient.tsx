/**
 * Fuel Price Trends Client Component
 * Interactive fuel price trend analysis
 */

'use client';

import { useState, useEffect } from 'react';

import { cn, patterns } from '@/styles/system/css-in-js';

const fuelTypes = [
  { key: 'unleaded', label: 'Unleaded 91', icon: '⛽' },
  { key: 'premium95', label: 'Premium 95', icon: '🔋' },
  { key: 'premium98', label: 'Premium 98', icon: '⚡' },
  { key: 'diesel', label: 'Diesel', icon: '🚛' },
  { key: 'lpg', label: 'LPG', icon: '🔥' },
];

const timeframes = [
  { key: '24h', label: '24 Hours' },
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: '90d', label: '90 Days' },
];

interface TrendData {
  current: number;
  average: number;
  min: number;
  max: number;
  trend: string;
  change: number;
}

export function FuelTrendsClient() {
  const [selectedFuel, setSelectedFuel] = useState('unleaded');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState<TrendData | null>(null);

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    const timer = setTimeout(() => {
      setTrendData({
        current: 185.9,
        average: 183.5,
        min: 179.9,
        max: 189.9,
        trend: 'increasing',
        change: 2.5,
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedFuel, selectedTimeframe]);

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return '📈';
    if (trend === 'decreasing') return '📉';
    return '➡️';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'increasing') return 'text-error-600';
    if (trend === 'decreasing') return 'text-success-600';
    return 'text-gray-600';
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-12">
        <div className={patterns.container()}>
          <div className={patterns.flex.colCenter + ' mb-8'}>
            <h1 className={cn(patterns.text.h1, 'text-gradient-primary text-center mb-4')}>
              Fuel Price Trends
            </h1>
            <p className={cn(patterns.text.body, 'text-center max-w-2xl')}>
              Track fuel price movements across Melbourne to find the best times to fill up
            </p>
          </div>

          {/* Controls */}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Fuel Type Selection */}
            <div>
              <div className="block text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Fuel Type
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {fuelTypes.map((fuel) => (
                  <button
                    key={fuel.key}
                    onClick={() => setSelectedFuel(fuel.key)}
                    className={cn(
                      'btn',
                      selectedFuel === fuel.key ? 'btn-primary' : 'btn-outline'
                    )}
                  >
                    <span>{fuel.icon}</span>
                    <span>{fuel.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Timeframe Selection */}
            <div>
              <div className="block text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Time Period
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe.key}
                    onClick={() => setSelectedTimeframe(timeframe.key)}
                    className={cn(
                      'btn btn-sm',
                      selectedTimeframe === timeframe.key ? 'btn-primary' : 'btn-ghost'
                    )}
                  >
                    {timeframe.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className={patterns.container() + ' py-12'}>
        {loading ? (
          <div className={patterns.flex.center + ' py-20'}>
            <div className="text-center">
              <div className="mb-4 inline-block">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">Loading trend data...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className={patterns.flex.between + ' mb-4'}>
                  <h3 className="font-semibold">Current Trend</h3>
                  <span className="text-2xl">{getTrendIcon(trendData.trend)}</span>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    {trendData.current}¢
                  </div>
                  <div className={cn('font-medium', getTrendColor(trendData.trend))}>
                    {trendData.trend.charAt(0).toUpperCase() + trendData.trend.slice(1)}
                    {trendData.change > 0 && ` by ${trendData.change.toFixed(1)}¢`}
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className={patterns.flex.between + ' mb-4'}>
                  <h3 className="font-semibold">Average Price</h3>
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {trendData.average}¢
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Over {selectedTimeframe.replace('d', ' days').replace('h', ' hours')}
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className={patterns.flex.between + ' mb-4'}>
                  <h3 className="font-semibold">Price Range</h3>
                  <span className="text-2xl">📏</span>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {trendData.min}¢ - {trendData.max}¢
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Lowest to highest
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="card p-8">
              <h3 className={patterns.text.h3 + ' mb-6 text-center'}>Price Trend Chart</h3>
              <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="text-center max-w-md">
                  <div className="text-6xl mb-4">📈</div>
                  <h4 className="text-xl font-bold mb-2">Interactive Chart Coming Soon</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    We&apos;re working on an interactive chart to visualize fuel price trends over time.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>• Historical data</div>
                    <div>• Price predictions</div>
                    <div>• Station comparisons</div>
                    <div>• Export functionality</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="card p-8">
              <h3 className={patterns.text.h3 + ' mb-6'}>Price Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-4xl mb-3">⏰</div>
                  <h4 className="font-semibold mb-2">Best Time to Fill Up</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tuesday and Wednesday mornings typically offer the lowest prices.
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-4xl mb-3">📅</div>
                  <h4 className="font-semibold mb-2">Weekly Patterns</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Prices usually peak on Fridays and weekends when demand is highest.
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-4xl mb-3">🏪</div>
                  <h4 className="font-semibold mb-2">Station Competition</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Areas with multiple stations tend to have more competitive pricing.
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-4xl mb-3">🛣️</div>
                  <h4 className="font-semibold mb-2">Location Matters</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Highway stations often charge more due to convenience premiums.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
