/**
 * Location-Based SEO Pages
 *
 * Routes: /locations/[suburb]
 * Examples:
 * - /locations/sunbury
 * - /locations/melbourne
 *
 * Each page automatically:
 * - loads fuel prices
 * - displays "live prices"
 * - includes formatted title + meta with keyword strategy
 * - includes JSON-LD schema (WebSite + LocalBusiness)
 * - displays "Last Updated Today" text
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { LastUpdated } from '@/components/seo/LastUpdated';
import {
  generateLocationMetadata,
  generateLocationSchema,
  generateH1Heading,
  generateH2Heading,
  formatLocationName,
} from '@/lib/seo/keyword-strategy';
import { getAllSuburbs, getStationsBySuburb } from '@/lib/data/stations';
import type { Station } from '@/types/station';

interface PageProps {
  params: Promise<{
    suburb: string;
  }>;
}

// Type guard for fuel prices record
type FuelPricesRecord = Record<string, number | null>;
const isFuelPricesRecord = (
  fp: Station['fuelPrices']
): fp is FuelPricesRecord => {
  return fp !== undefined && !Array.isArray(fp);
};

// Generate static paths for ISR
export async function generateStaticParams() {
  const suburbs = await getAllSuburbs();

  // Limit to top 200 suburbs for static generation
  return suburbs.slice(0, 200).map((suburb) => ({
    suburb: suburb.toLowerCase().replace(/\s+/g, '-'),
  }));
}

// ISR - revalidate every hour
export const revalidate = 3600;

// Generate metadata for SEO with keyword strategy
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { suburb } = await params;

  if (!suburb) {
    return { title: 'Petrol Prices Today' };
  }

  const suburbName = suburb
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Get stations to calculate stats
  const stations = await getStationsBySuburb(suburb);

  if (!stations || stations.length === 0) {
    return {
      title: `${suburbName} Petrol Prices`,
    };
  }

  // Calculate average price
  const stationsWithPrices = stations.filter((s) => {
    if (!s.fuelPrices) return false;
    return isFuelPricesRecord(s.fuelPrices) && s.fuelPrices.unleaded !== null;
  });
  const averagePrice =
    stationsWithPrices.length > 0
      ? stationsWithPrices.reduce((sum, s) => {
          const prices = s.fuelPrices as FuelPricesRecord;
          return sum + (prices.unleaded || 0);
        }, 0) / stationsWithPrices.length
      : undefined;

  return generateLocationMetadata({
    location: suburbName,
    path: `/locations/${suburb}`,
    stationCount: stations.length,
    averagePrice,
  });
}

export default async function LocationPage({ params }: PageProps) {
  const { suburb } = await params;

  if (!suburb) {
    notFound();
  }

  // Normalize suburb name
  const suburbName = suburb
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Get stations in this suburb
  const stations = await getStationsBySuburb(suburb);

  if (!stations || stations.length === 0) {
    notFound();
  }

  // Calculate statistics
  const stationsWithPrices = stations.filter((s) => {
    if (!s.fuelPrices) return false;
    return isFuelPricesRecord(s.fuelPrices) && s.fuelPrices.unleaded !== null;
  });
  const averagePrice =
    stationsWithPrices.length > 0
      ? stationsWithPrices.reduce((sum, s) => {
          const prices = s.fuelPrices as FuelPricesRecord;
          return sum + (prices.unleaded || 0);
        }, 0) / stationsWithPrices.length
      : undefined;

  const lowestPrice =
    stationsWithPrices.length > 0
      ? Math.min(
          ...stationsWithPrices.map((s) => {
            const prices = s.fuelPrices as FuelPricesRecord;
            return prices.unleaded || 0;
          })
        )
      : undefined;

  // Generate structured data schemas
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://petrolpricesnearme.com.au';

  const locationSchema = generateLocationSchema({
    location: suburbName,
    baseUrl,
    stationCount: stations.length,
    averagePrice,
    stations: stations.map((s) => ({
      name: s.name || '',
      latitude: s.latitude,
      longitude: s.longitude,
    })),
  });

  const formattedLocation = formatLocationName(suburbName);
  const h1Heading = generateH1Heading(suburbName);
  const h2Heading = generateH2Heading('prices', suburbName);

  // Get last updated time (use current time or station data)
  const lastUpdated = new Date().toISOString();

  return (
    <>
      {/* JSON-LD Schema Markup - WebSite + LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section with SEO-optimized H1 */}
        <header className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-12 text-white">
          <div className="container mx-auto px-4">
            {/* Breadcrumb Navigation */}
            <nav className="mb-4 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/locations" className="hover:underline">
                Locations
              </Link>
              <span className="mx-2">/</span>
              <span aria-current="page">{formattedLocation}</span>
            </nav>

            {/* SEO-optimized H1 Heading */}
            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
              {h1Heading}
            </h1>

            {/* Description */}
            <p className="mb-6 max-w-3xl text-lg text-white/90 md:text-xl">
              Compare live petrol prices from {stations.length} stations in{' '}
              {formattedLocation}. Find the cheapest fuel prices today and save
              money on unleaded, diesel, and premium fuel.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                <strong>{stations.length}</strong> Station
                {stations.length !== 1 ? 's' : ''}
              </div>
              {averagePrice && (
                <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                  Average: <strong>{averagePrice.toFixed(1)}¢/L</strong>
                </div>
              )}
              {lowestPrice && (
                <div className="rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
                  Lowest: <strong>{lowestPrice.toFixed(1)}¢/L</strong>
                </div>
              )}
            </div>

            {/* Last Updated */}
            <div className="mt-6">
              <LastUpdated lastUpdated={lastUpdated} variant="muted" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* SEO-optimized H2 Heading */}
            <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              {h2Heading}
            </h2>

            {/* Stations Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stations
                .sort((a, b) => {
                  const priceA = isFuelPricesRecord(a.fuelPrices)
                    ? (a.fuelPrices.unleaded ?? Infinity)
                    : Infinity;
                  const priceB = isFuelPricesRecord(b.fuelPrices)
                    ? (b.fuelPrices.unleaded ?? Infinity)
                    : Infinity;
                  return priceA - priceB;
                })
                .map((station) => {
                  const fuelPrices = isFuelPricesRecord(station.fuelPrices)
                    ? station.fuelPrices
                    : null;
                  const unleadedPrice = fuelPrices?.unleaded ?? null;
                  const dieselPrice = fuelPrices?.diesel ?? null;
                  const premiumPrice = fuelPrices?.premium95 ?? null;

                  return (
                    <article
                      key={station.id}
                      className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800"
                      itemScope
                      itemType="https://schema.org/GasStation"
                    >
                      {/* Station Name */}
                      <h3
                        className="mb-2 text-xl font-bold text-gray-900 dark:text-white"
                        itemProp="name"
                      >
                        {station.name || 'Unknown Station'}
                      </h3>

                      {/* Brand */}
                      {station.brand && (
                        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                          <span itemProp="brand">{station.brand}</span>
                        </p>
                      )}

                      {/* Address */}
                      <div
                        className="mb-4 text-sm text-gray-600 dark:text-gray-400"
                        itemProp="address"
                        itemScope
                        itemType="https://schema.org/PostalAddress"
                      >
                        <p>
                          <span itemProp="streetAddress">
                            {station.address || 'Address not available'}
                          </span>
                        </p>
                        <p>
                          <span itemProp="addressLocality">
                            {station.suburb || ''}
                          </span>{' '}
                          <span itemProp="postalCode">
                            {station.postcode || ''}
                          </span>
                        </p>
                      </div>

                      {/* Fuel Prices */}
                      <div className="mb-4 space-y-2">
                        {unleadedPrice && (
                          <div className="flex justify-between rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-900/50">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Unleaded
                            </span>
                            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                              {unleadedPrice.toFixed(1)}¢/L
                            </span>
                          </div>
                        )}
                        {dieselPrice && (
                          <div className="flex justify-between rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-900/50">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Diesel
                            </span>
                            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                              {dieselPrice.toFixed(1)}¢/L
                            </span>
                          </div>
                        )}
                        {premiumPrice && (
                          <div className="flex justify-between rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-900/50">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Premium
                            </span>
                            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                              {premiumPrice.toFixed(1)}¢/L
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Last Updated under prices */}
                      <div className="mb-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                        <LastUpdated
                          lastUpdated={lastUpdated}
                          variant="muted"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {station.latitude && station.longitude && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 rounded-md bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary-700"
                          >
                            Get Directions
                          </a>
                        )}
                        <Link
                          href={`/stations/${station.id}`}
                          className="flex-1 rounded-md border border-primary-600 px-4 py-2 text-center text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20"
                        >
                          View Details
                        </Link>
                      </div>
                    </article>
                  );
                })}
            </div>

            {/* SEO Content Section */}
            <div className="prose dark:prose-invert mt-16 max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Petrol Prices in {formattedLocation} Today
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Find the cheapest petrol prices in {formattedLocation} today.
                Compare live fuel prices from {stations.length} petrol stations
                across {formattedLocation}. Our platform provides real-time
                updates on unleaded, diesel, and premium fuel prices to help you
                save money on every fill-up.
              </p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Why Compare Fuel Prices in {formattedLocation}?
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                With {stations.length} petrol stations in {formattedLocation},
                prices can vary significantly. By comparing prices before you
                fill up, you can save up to 20 cents per liter. Our platform
                updates prices daily to ensure you always have access to the
                latest fuel prices in {formattedLocation}.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
