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

import { MapViewClient } from './MapViewClient';

import { StructuredData } from '@/components/StructuredData';
import metadataJson from '@/data/stations-metadata.json';
import stationsData from '@/data/stations.json';
import { generateWebsiteSchema } from '@/lib/seo/schema-generator';

export const metadata: Metadata = {
  title: `Live Petrol Prices Near Me – Melbourne Fuel Price Map | Cheapest Fuel Today`,
  description: `Find the cheapest petrol prices near you in Melbourne today. Compare ${metadataJson.totalStations}+ stations across ${metadataJson.suburbs.length}+ suburbs. Real-time fuel price map for Unleaded 91, Premium 95/98, Diesel, and LPG. Search by location or suburb.`,
  keywords: [
    'petrol prices near me',
    'fuel prices Melbourne',
    'cheapest fuel near me',
    'Melbourne fuel price map',
    'petrol stations near me Victoria',
    'diesel prices Melbourne',
    'unleaded 91 prices Melbourne',
    'unleaded 95 prices Melbourne',
    'unleaded 98 prices Melbourne',
    'premium fuel prices Melbourne',
    'cheapest petrol Melbourne',
    'fuel price comparison Melbourne',
    'petrol station map',
    'melbourne fuel map',
    'interactive petrol map',
    'station locations',
    'fuel price map',
    'gas station finder',
    'melbourne petrol stations',
    'LPG prices Melbourne',
    'cheapest diesel near me',
  ],
  openGraph: {
    title: `Live Petrol Prices Near Me – Melbourne Fuel Price Map | ${metadataJson.totalStations}+ Stations`,
    description: `Find the cheapest fuel prices in Melbourne today. Interactive map with ${metadataJson.totalStations}+ petrol stations across ${metadataJson.suburbs.length}+ suburbs. Compare Unleaded 91, Premium 95/98, Diesel prices.`,
    type: 'website',
    url: 'https://petrolpricesnearme.com.au/map',
    siteName: 'Petrol Prices Near Me',
    images: [
      {
        url: 'https://petrolpricesnearme.com.au/images/og-map.jpg',
        width: 1200,
        height: 630,
        alt: 'Melbourne Fuel Price Map',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Live Petrol Prices Near Me – Melbourne Fuel Price Map`,
    description: `Find the cheapest fuel prices in Melbourne today. ${metadataJson.totalStations}+ stations, ${metadataJson.suburbs.length}+ suburbs.`,
  },
  alternates: {
    canonical: 'https://petrolpricesnearme.com.au/map',
  },
};

// Enable ISR - Revalidate every 24 hours
export const revalidate = 86400;

export default function MapPage() {
  // Generate structured data schemas
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';
  const structuredDataSchemas = generateWebsiteSchema(baseUrl);

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
