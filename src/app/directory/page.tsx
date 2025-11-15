/**
 * Station Directory Page
 * Complete listing of all petrol stations with advanced filtering
 * Uses ISR (Incremental Static Regeneration) for optimal SEO
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';

import { InfiniteScrollDirectory } from '@/components/directory/InfiniteScrollDirectory';
import { StructuredData } from '@/components/StructuredData';
import { LoadingCard } from '@/components/ui/LoadingSpinner';
import metadataJson from '@/data/stations-metadata.json';
import { generateWebSiteSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: `Melbourne Petrol Stations Directory - ${metadataJson.totalStations}+ Stations | Find Cheapest Fuel`,
  description: `Browse our complete directory of ${metadataJson.totalStations}+ petrol stations across ${metadataJson.suburbs.length}+ Melbourne suburbs. Compare live fuel prices from BP, Shell, Caltex, 7-Eleven, and more. Find the cheapest petrol near you.`,
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
    description: `Complete directory of ${metadataJson.totalStations}+ petrol stations across Melbourne with real-time fuel prices. Find the cheapest fuel near you.`,
    type: 'website',
  },
};

// Enable ISR - Revalidate every 24 hours for fresh data while maintaining performance
// 86400 seconds = 24 hours
export const revalidate = 86400;

export default function DirectoryPage() {
  // Generate structured data schemas
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';
  const structuredDataSchemas = generateWebSiteSchema(baseUrl);

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={structuredDataSchemas} />

      {/* Header */}
      <header className="print-hidden bg-gradient-primary py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Melbourne Petrol Stations Directory
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-center text-lg text-white/90 md:text-xl">
              Browse {metadataJson.totalStations}+ stations across{' '}
              {metadataJson.suburbs.length}+ suburbs with live fuel prices
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                <strong>{metadataJson.totalStations}</strong> Total Stations
              </div>
              <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                <strong>{metadataJson.suburbs.length}+</strong> Suburbs
              </div>
              <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                Average Price:{' '}
                <strong>{metadataJson.priceRange.unleaded.average}¢/L</strong>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Infinite Scroll Directory */}
      <Suspense fallback={<DirectoryLoading />}>
        <InfiniteScrollDirectory />
      </Suspense>
    </>
  );
}

function DirectoryLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 animate-pulse">
        <div className="mb-4 h-12 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-6 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(9)].map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    </div>
  );
}
