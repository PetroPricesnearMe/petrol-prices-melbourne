/**
 * Station Directory Page
 * Complete listing of all petrol stations with advanced filtering
 * Uses ISR (Incremental Static Regeneration) for optimal SEO
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';

import { LoadingCard } from '@/components/ui/LoadingSpinner';

import { StationDirectoryClient } from './StationDirectoryClient';
import stationsData from '@/data/stations.json';
import metadataJson from '@/data/stations-metadata.json';

export const metadata: Metadata = {
  title: `Melbourne Petrol Stations Directory - ${metadataJson.totalStations}+ Stations | Find Cheapest Fuel`,
  description:
    `Browse our complete directory of ${metadataJson.totalStations}+ petrol stations across ${metadataJson.suburbs.length}+ Melbourne suburbs. Compare live fuel prices from BP, Shell, Caltex, 7-Eleven, and more. Find the cheapest petrol near you.`,
  keywords: [
    'petrol station directory',
    'melbourne petrol stations',
    'fuel price directory',
    'station listing',
    'petrol finder',
    'fuel comparison',
    'BP stations',
    'Shell stations',
    'Caltex fuel prices',
    '7-Eleven petrol',
  ],
  openGraph: {
    title: `Melbourne Petrol Station Directory | ${metadataJson.totalStations}+ Stations`,
    description:
      `Complete directory of ${metadataJson.totalStations}+ petrol stations across Melbourne with real-time fuel prices. Find the cheapest fuel near you.`,
    type: 'website',
  },
};

// Enable ISR - Revalidate every hour for fresh data while maintaining performance
export const revalidate = 3600;

export default function DirectoryPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={<DirectoryLoading />}>
        <StationDirectoryClient
          initialStations={stationsData}
          metadata={metadataJson}
        />
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
