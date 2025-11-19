/**
 * Station Directory Page
 * Complete listing of all petrol stations with advanced filtering
 * Uses ISR (Incremental Static Regeneration) for optimal SEO
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';

import { InfiniteScrollDirectory } from '@/components/directory/InfiniteScrollDirectory';
import DirectoryLayout from '@/components/layouts/DirectoryLayout.server';
import { StructuredData } from '@/components/StructuredData';
import { LoadingCard } from '@/components/ui/LoadingSpinner';
import metadataJson from '@/data/stations-metadata.json';
import { generateWebSiteSchema } from '@/lib/schema';
import { generateDirectoryCanonicalUrl } from '@/lib/seo/canonical';


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
    url: generateDirectoryCanonicalUrl(),
  },
  alternates: {
    canonical: generateDirectoryCanonicalUrl(),
  },
};

// Enable ISR - Revalidate every 24 hours for fresh data while maintaining performance
// 86400 seconds = 24 hours
export const revalidate = 86400;

export default function DirectoryPage() {
  // Generate structured data schemas
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';
  const structuredDataSchemas = generateWebSiteSchema(baseUrl);

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={structuredDataSchemas} />

      <DirectoryLayout
        title="Melbourne Petrol Stations Directory"
        description={`Browse ${metadataJson.totalStations}+ stations across ${metadataJson.suburbs.length}+ suburbs with live fuel prices`}
        canonicalUrl={generateDirectoryCanonicalUrl()}
        actions={
          <div className="flex gap-4 flex-wrap text-sm">
            <div className="bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-lg">
              <strong>{metadataJson.totalStations}</strong> Total Stations
            </div>
            <div className="bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-lg">
              <strong>{metadataJson.suburbs.length}+</strong> Suburbs
            </div>
            <div className="bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-lg">
              Average Price: <strong>{metadataJson.priceRange.unleaded.average}¢/L</strong>
            </div>
          </div>
        }
      >
        {/* Infinite Scroll Directory */}
        <Suspense fallback={<DirectoryLoading />}>
          <InfiniteScrollDirectory />
        </Suspense>
      </DirectoryLayout>
    </>
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
