/**
 * Listing Detail Page (Slug-based)
 * 
 * Dynamic route: /listings/[slug]
 * 
 * Features:
 * - ISR (Incremental Static Regeneration) with 1-hour revalidation
 * - SEO-optimized metadata with canonical URLs
 * - Slug-based routing for better SEO
 * - Supports both ID-based and slug-based lookups
 * 
 * @module app/listings/[slug]/page
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import DirectoryLayout from '@/components/layouts/DirectoryLayout';
import { StructuredData } from '@/components/StructuredData';
import { getAllStationSlugs, getStationBySlug } from '@/lib/data/stations-slugs';
import { generateStationPageSchemas } from '@/lib/schema';
import { generateListingCanonicalUrl } from '@/lib/seo/canonical';
import { generateBaseMetadata } from '@/lib/seo/metadata';

interface ListingPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate static params for ISR
 * Pre-generates the first 200 listings at build time
 * Others will be generated on-demand
 */
export async function generateStaticParams() {
  const slugs = await getAllStationSlugs();
  return slugs.slice(0, 200).map((slug) => ({
    slug,
  }));
}

/**
 * ISR Configuration
 * Revalidate every hour to keep data fresh
 */
export const revalidate = 3600;

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const station = await getStationBySlug(slug);

  if (!station) {
    return {
      title: 'Listing Not Found',
    };
  }

  const title = `${station.name} - Fuel Prices & Information`;
  const description = `Find real-time fuel prices and information for ${station.name} in ${station.suburb || 'Melbourne'}. ${station.address ? `Located at ${station.address}` : 'Compare prices and save on your next fill-up.'}`;
  
  const keywords = [
    `${station.name} fuel prices`,
    `${station.suburb} petrol station`,
    station.brand || '',
    'fuel prices near me',
    'petrol prices Melbourne',
    station.address || '',
  ].filter(Boolean);

  const imageUrl = station.image 
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au'}${station.image}`
    : `${process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au'}/api/og/station/${station.id}`;

  return generateBaseMetadata({
    title,
    description,
    path: `listings/${slug}`,
    image: imageUrl,
    keywords,
  });
}

/**
 * Listing Detail Page Component
 */
export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const station = await getStationBySlug(slug);

  if (!station) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Directory', href: '/directory' },
    {
      label: station.suburb || 'Melbourne',
      href: `/directory/${station.suburb?.toLowerCase().replace(/\s+/g, '-') || 'melbourne'}`,
    },
    { label: station.name, href: `/listings/${slug}` },
  ];

  // Generate structured data
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';
  const structuredDataSchemas = generateStationPageSchemas(station, baseUrl);

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={structuredDataSchemas} />

      <DirectoryLayout
        title={station.name}
        description={`${station.address || ''} ${station.suburb ? `• ${station.suburb}` : ''}`}
        breadcrumbs={breadcrumbs}
        showSidebar={false}
        canonicalUrl={generateListingCanonicalUrl(slug)}
        headerVariant="hero"
      >
        <div className="space-y-8">
          {/* Station Information Card */}
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
              {station.phoneNumber && (
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
                  <a
                    href={`tel:${station.phoneNumber}`}
                    className="ml-2 font-medium text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {station.phoneNumber}
                  </a>
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
                {Array.isArray(station.fuelPrices) ? (
                  station.fuelPrices.map((price) => (
                    <div
                      key={price.id}
                      className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {price.fuelType}
                      </div>
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {price.pricePerLiter?.toFixed(1)}¢/L
                      </div>
                    </div>
                  ))
                ) : (
                  Object.entries(station.fuelPrices).map(([type, price]) =>
                    price !== null && (
                      <div
                        key={type}
                        className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {price.toFixed(1)}¢/L
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {station.amenities && Object.values(station.amenities).some(Boolean) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(station.amenities).map(([key, value]) =>
                  value && (
                    <div
                      key={key}
                      className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <span className="text-lg">✓</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </DirectoryLayout>
    </>
  );
}
