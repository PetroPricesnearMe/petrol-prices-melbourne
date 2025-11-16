/**
 * Map Page
 * Interactive map view of all petrol stations with clustering and popovers
 * Features:
 * - Full-screen map with station markers
 * - Clustering for better performance
 * - Click popovers with station details
 * - Mobile responsive design
 * - Search and filter integration
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';

import { StructuredData } from '@/components/StructuredData';
import metadataJson from '@/data/stations-metadata.json';
import stationsData from '@/data/stations.json';
import { generateWebSiteSchema } from '@/lib/schema';

import { MapViewClient } from './MapViewClient';

export const metadata: Metadata = {
  title: `Melbourne Petrol Stations Map - ${metadataJson.totalStations}+ Locations | Interactive Map`,
  description: `Explore ${metadataJson.totalStations}+ petrol stations across Melbourne on our interactive map. Find the cheapest fuel prices near you with real-time data from BP, Shell, Caltex, and more.`,
  keywords: [
    'petrol station map',
    'melbourne fuel map',
    'interactive petrol map',
    'station locations',
    'fuel price map',
    'gas station finder',
    'melbourne petrol stations',
    'fuel price comparison',
  ],
  openGraph: {
    title: `Melbourne Petrol Stations Map | ${metadataJson.totalStations}+ Locations`,
    description: `Interactive map showing ${metadataJson.totalStations}+ petrol stations across Melbourne with real-time fuel prices. Find the cheapest fuel near you.`,
    type: 'website',
  },
};

// Enable ISR - Revalidate every 24 hours
export const revalidate = 86400;

export default function MapPage() {
  // Generate structured data schemas
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';
  const structuredDataSchemas = generateWebSiteSchema(baseUrl);

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={structuredDataSchemas} />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Suspense fallback={<MapLoading />}>
          <MapViewClient
            initialStations={stationsData}
            metadata={metadataJson}
          />
        </Suspense>
      </main>
    </>
  );
}

function MapLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="border-blue-600 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
        <p className="text-gray-600">Loading interactive map...</p>
      </div>
    </div>
  );
}
