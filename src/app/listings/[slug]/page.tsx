/**
 * Listing Detail Page with ISR
 * Dynamic route: /listings/[slug]
 * 
 * Uses slug-based routing for better SEO
 * Supports both ID-based and slug-based lookups
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import DirectoryLayout from '@/components/layouts/DirectoryLayout.server';
import { StructuredData } from '@/components/StructuredData';
import { getStationBySlug, getAllStationSlugs } from '@/lib/data/stations-slugs';
import { generateListingCanonicalUrl } from '@/lib/seo/canonical';
import { generateStationPageSchemas } from '@/lib/schema';
import { generateStationSlugFromData } from '@/lib/utils/slugs';

interface ListingPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for ISR
export async function generateStaticParams() {
  const slugs = await getAllStationSlugs();

  // Generate params for the first 200 listings at build time
  // Others will be generated on-demand
  return slugs.slice(0, 200).map((slug) => ({
    slug,
  }));
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const station = await getStationBySlug(params.slug);

  if (!station) {
    return {
      title: 'Listing Not Found',
    };
  }

  const title = `${station.name} - Fuel Prices & Information`;
  const description = `Find real-time fuel prices and information for ${station.name} in ${station.suburb || 'Melbourne'}. ${station.address ? `Located at ${station.address}` : 'Compare prices and save on your next fill-up.'}`;
  const canonicalUrl = generateListingCanonicalUrl(params.slug);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_AU',
      url: canonicalUrl,
      siteName: 'Petrol Price Near Me',
      images: [
        {
          url: `/api/og/station/${station.id}`,
          width: 1200,
          height: 630,
          alt: `${station.name} - Petrol Station`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      `${station.name} fuel prices`,
      `${station.suburb} petrol station`,
      station.brand || '',
      'fuel prices near me',
      'petrol prices Melbourne',
    ].filter(Boolean),
  };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const station = await getStationBySlug(params.slug);

  if (!station) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Directory', href: '/directory' },
    { label: station.suburb || 'Melbourne', href: `/directory/${station.suburb?.toLowerCase().replace(/\s+/g, '-') || 'melbourne'}` },
    { label: station.name, href: `/listings/${params.slug}` },
  ];

  // Generate structured data schemas
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';
  const structuredDataSchemas = generateStationPageSchemas(station, baseUrl);

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={structuredDataSchemas} />

      <DirectoryLayout
        title={station.name}
        description={`${station.address || ''} ${station.suburb ? `• ${station.suburb}` : ''}`}
        breadcrumbs={breadcrumbs}
        showSidebar={false}
        canonicalUrl={generateListingCanonicalUrl(params.slug)}
      >
        <div className="space-y-8">
          {/* Station Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Station Information
            </h2>
            <div className="space-y-4">
              {station.brand && (
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Brand:</span>
                  <span className="ml-2 font-medium">{station.brand}</span>
                </div>
              )}
              {station.address && (
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Address:</span>
                  <span className="ml-2 font-medium">{station.address}</span>
                </div>
              )}
              {station.suburb && (
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Suburb:</span>
                  <span className="ml-2 font-medium">{station.suburb}</span>
                </div>
              )}
            </div>
          </div>

          {/* Fuel Prices */}
          {station.fuelPrices && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Fuel Prices
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(station.fuelPrices).map(([type, price]) => (
                  price !== null && (
                    <div key={type} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </div>
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {price.toFixed(1)}¢/L
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </DirectoryLayout>
    </>
  );
}

