/**
 * Melbourne Fuel Station Listing Page
 * 
 * Fully responsive, SEO-optimized fuel station listing page for Melbourne, Victoria
 * Displays nearest petrol stations, current fuel prices, station services, and all
 * information relevant to helping users quickly compare prices and navigate to stations.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { MelbourneListingClient } from './MelbourneListingClient';
import { generateMelbourneListingMetadata } from '@/lib/seo/melbourne-listing';
import { getMelbourneStations } from '@/lib/data/melbourne-stations';
import { generateMelbourneSchema } from '@/lib/schema/melbourne-listing';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return generateMelbourneListingMetadata();
}

export default async function MelbourneListingPage() {
  // Fetch Melbourne stations
  const stations = await getMelbourneStations();

  if (!stations || stations.length === 0) {
    notFound();
  }

  // Generate Schema.org JSON-LD
  const schema = generateMelbourneSchema(stations);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Main Client Component */}
      <MelbourneListingClient stations={stations} />
    </>
  );
}


