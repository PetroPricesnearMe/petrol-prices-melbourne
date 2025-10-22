/**
 * Station Directory Page
 * Complete listing of all petrol stations with advanced filtering
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';

import { LoadingCard } from '@/components/ui/LoadingSpinner';

import { StationDirectoryClient } from './StationDirectoryClient';

export const metadata: Metadata = {
  title: 'Station Directory | Find All Petrol Stations',
  description:
    'Browse our complete directory of 250+ petrol stations across Melbourne. Compare live fuel prices, filter by location, brand, and fuel type. Find the cheapest petrol near you.',
  keywords: [
    'petrol station directory',
    'melbourne petrol stations',
    'fuel price directory',
    'station listing',
    'petrol finder',
    'fuel comparison',
  ],
  openGraph: {
    title: 'Melbourne Petrol Station Directory | Live Fuel Prices',
    description:
      'Complete directory of 250+ petrol stations across Melbourne with real-time fuel prices.',
    type: 'website',
  },
};

export default function DirectoryPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={<DirectoryLoading />}>
        <StationDirectoryClient />
      </Suspense>
    </main>
  );
}

function DirectoryLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 animate-pulse">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    </div>
  );
}
