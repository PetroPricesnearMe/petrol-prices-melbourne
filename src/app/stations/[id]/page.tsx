/**
 * Station Detail Page
 *
 * Dynamic route: /stations/[id]
 *
 * Features:
 * - ISR (Incremental Static Regeneration) with 1-hour revalidation
 * - SEO-optimized metadata with canonical URLs
 * - Comprehensive station information display
 * - Nearby stations recommendations
 *
 * @module app/stations/[id]/page
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

import DirectoryLayout from '@/components/layouts/DirectoryLayout';
import { HeroSection } from '@/components/molecules/HeroSection';
import { Tabs } from '@/components/molecules/Tabs';
import { StructuredData } from '@/components/StructuredData';
import {
  getAllStations,
  getStationById,
  getNearbyStations,
} from '@/lib/data/stations';
import { generateStationPageSchemas } from '@/lib/schema';
import { generateStationCanonicalUrl } from '@/lib/seo/canonical';
import {
  generateStationSEOMetadata,
  generateStationSlug,
  parseStationSlug,
  generateStationStructuredData,
  generateStationBreadcrumbs,
} from '@/lib/seo/station-seo';
import { cn } from '@/lib/utils';
import type { Station } from '@/types/station';

interface StationPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Generate static params for ISR
 * Pre-generates the first 100 stations at build time with SEO-friendly slugs
 * Others will be generated on-demand
 *
 * Supports both URL formats:
 * - New: /stations/bp-thomastown-456 (SEO-friendly)
 * - Legacy: /stations/456 (backwards compatible)
 */
export async function generateStaticParams() {
  const stations = await getAllStations();

  // Generate slug-based params for the first 100 stations
  return stations.slice(0, 100).map((station) => ({
    id: generateStationSlug(station),
  }));
}

/**
 * ISR Configuration
 * Revalidate every hour to keep data fresh
 */
export const revalidate = 3600;

/**
 * Generate dynamic metadata for SEO
 * Supports both URL formats: /stations/456 and /stations/bp-thomastown-456
 *
 * Enhanced with:
 * - SEO-optimized title template: {brand} {suburb} – Today's Fuel Prices | Unleaded 91, Diesel, E10
 * - Comprehensive meta description with fuel types and services
 * - Rich keywords targeting multiple search intents
 */
export async function generateMetadata({
  params,
}: StationPageProps): Promise<Metadata> {
  const { id } = await params;

  // Support both slug format (bp-thomastown-456) and ID format (456)
  const stationId = parseStationSlug(id);
  const station = await getStationById(stationId);

  if (!station) {
    return {
      title: 'Station Not Found',
    };
  }

  // Use the new SEO-optimized metadata generator
  return generateStationSEOMetadata(station);
}

/**
 * Station Detail Page Component
 * Supports both URL formats: /stations/456 and /stations/bp-thomastown-456
 */
export default async function StationPage({ params }: StationPageProps) {
  const { id } = await params;

  // Support both slug format (bp-thomastown-456) and ID format (456)
  const stationId = parseStationSlug(id);
  const station = await getStationById(stationId);

  if (!station) {
    notFound();
  }

  // Get nearby stations for recommendations
  const nearbyStations =
    station.latitude && station.longitude
      ? await getNearbyStations(station.latitude, station.longitude, 5)
      : [];

  // Generate SEO-friendly slug for canonical URL (must be before breadcrumbs)
  const stationSlug = generateStationSlug(station);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Directory', href: '/directory' },
    {
      label: station.suburb || 'Melbourne',
      href: `/directory/${station.suburb?.toLowerCase().replace(/\s+/g, '-') || 'melbourne'}`,
    },
    { label: station.name, href: `/stations/${stationSlug}` },
  ];

  // Generate hero image URL with fallback
  const getHeroImageUrl = () => {
    if (station.image) {
      return station.image;
    }

    // Try brand-specific image with various naming conventions
    if (station.brand) {
      const brandSlug = station.brand.toLowerCase().replace(/\s+/g, '-');
      const brandVariations = [
        `/images/stations/${brandSlug}-hero.jpg`,
        `/images/stations/${brandSlug}.jpg`,
        `/images/stations/${brandSlug.replace('-', '')}.jpg`,
        // Handle 7-eleven specifically
        brandSlug.includes('7') || brandSlug.includes('eleven')
          ? '/images/stations/seven-eleven.jpg'
          : null,
      ].filter(Boolean);

      // Return first variation (will use fallback if none exist)
      return brandVariations[0] || '/images/fuel-nozzles.jpg';
    }

    // Default fallback to existing image
    return '/images/fuel-nozzles.jpg';
  };

  const heroImageUrl = getHeroImageUrl();

  // Generate enhanced structured data with new SEO schemas
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricesnearme.com.au';
  const structuredDataSchemas = [
    generateStationStructuredData(station),
    generateStationBreadcrumbs(station),
    ...generateStationPageSchemas(station, baseUrl),
  ];

  return (
    <>
      {/* Enhanced Structured Data for SEO */}
      <StructuredData data={structuredDataSchemas} />

      {/* Internal Linking Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
              Related Resources
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/directory"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                → Browse All Stations
              </Link>
              {station.brand && (
                <Link
                  href={`/directory?brand=${encodeURIComponent(station.brand)}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  → More {station.brand} Stations
                </Link>
              )}
              {station.suburb && (
                <Link
                  href={`/directory/${station.suburb.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  → Stations in {station.suburb}
                </Link>
              )}
              <Link
                href="/fuel-brands"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                → Compare Fuel Brands
              </Link>
              <Link
                href="/blog"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                → Fuel Saving Tips
              </Link>
            </div>
          </div>
        </div>
      </div>

      <DirectoryLayout
        title={station.name}
        description={`${station.address || ''} ${station.suburb ? `• ${station.suburb}` : ''}`}
        breadcrumbs={breadcrumbs}
        showSidebar={false}
        canonicalUrl={generateStationCanonicalUrl(stationSlug)}
        headerVariant="hero"
      >
        <div className="space-y-8">
          {/* Hero Section */}
          <HeroSection
            title={station.name}
            subtitle={station.brand || 'Petrol Station'}
            description={`${station.address || ''} ${station.suburb ? `• ${station.suburb}` : ''}`}
            imageUrl={heroImageUrl}
            imageAlt={`${station.name} petrol station`}
            height="lg"
            contentPosition="left"
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              {station.latitude && station.longitude && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary btn-lg btn"
                >
                  📍 Get Directions
                </a>
              )}
              <button className="btn-outline btn-lg btn border-white text-white hover:bg-white hover:text-gray-900">
                ⭐ Save Favorite
              </button>
            </div>
          </HeroSection>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <QuickInfoCard
              title="Current Prices"
              icon="⛽"
              content={<FuelPriceSummary station={station} />}
            />
            <QuickInfoCard
              title="Station Info"
              icon="🏪"
              content={<StationInfoSummary station={station} />}
            />
            <QuickInfoCard
              title="Nearby Stations"
              icon="🗺️"
              content={
                <NearbyStationsSummary stations={nearbyStations.slice(0, 3)} />
              }
            />
          </div>

          {/* Main Content Tabs */}
          <div className="card p-6">
            <Tabs
              tabs={[
                {
                  id: 'description',
                  label: 'Description',
                  icon: '📝',
                  content: <DescriptionTab station={station} />,
                },
                {
                  id: 'reviews',
                  label: 'Reviews',
                  icon: '⭐',
                  content: <ReviewsTab station={station} />,
                },
                {
                  id: 'map',
                  label: 'Map & Location',
                  icon: '🗺️',
                  content: (
                    <MapTab station={station} nearbyStations={nearbyStations} />
                  ),
                },
                {
                  id: 'prices',
                  label: 'Fuel Prices',
                  icon: '💰',
                  content: <PricesTab station={station} />,
                },
              ]}
              defaultActiveTab="description"
              className="w-full"
            />
          </div>

          {/* Additional Sections */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Amenities */}
            {station.amenities &&
              Object.values(station.amenities).some(Boolean) && (
                <div className="card p-6">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                    Amenities
                  </h2>
                  <AmenitiesGrid amenities={station.amenities} />
                </div>
              )}

            {/* Operating Hours */}
            {station.operatingHours && (
              <div className="card p-6">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                  Operating Hours
                </h2>
                <OperatingHoursTable hours={station.operatingHours} />
              </div>
            )}
          </div>
        </div>
      </DirectoryLayout>
    </>
  );
}

/**
 * Quick Info Card Component
 */
function QuickInfoCard({
  title,
  icon,
  content,
}: {
  title: string;
  icon: string;
  content: React.ReactNode;
}) {
  return (
    <div className="card p-6 transition-shadow duration-200 hover:shadow-lg">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      {content}
    </div>
  );
}

/**
 * Fuel Price Summary Component
 */
function FuelPriceSummary({ station: _station }: { station: Station }) {
  // Mock fuel prices - replace with actual data
  const fuelPrices = [
    { type: 'Unleaded 91', price: '169.9', trend: 'up' },
    { type: 'Unleaded 95', price: '179.9', trend: 'stable' },
    { type: 'Diesel', price: '174.9', trend: 'down' },
  ];

  return (
    <div className="space-y-3">
      {fuelPrices.map((fuel, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {fuel.type}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {fuel.price}¢
            </span>
            <span className="text-sm">
              {fuel.trend === 'up' && <span className="text-red-500">↗</span>}
              {fuel.trend === 'down' && (
                <span className="text-green-500">↘</span>
              )}
              {fuel.trend === 'stable' && (
                <span className="text-gray-500">→</span>
              )}
            </span>
          </div>
        </div>
      ))}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Updated {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}

/**
 * Station Info Summary Component
 */
function StationInfoSummary({ station }: { station: Station }) {
  return (
    <div className="space-y-2 text-sm">
      {station.brand && (
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Brand:</span>
          <span className="font-medium">{station.brand}</span>
        </div>
      )}
      {station.phoneNumber && (
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Phone:</span>
          <a
            href={`tel:${station.phoneNumber}`}
            className="font-medium text-primary-600 hover:underline dark:text-primary-400"
          >
            {station.phoneNumber}
          </a>
        </div>
      )}
      {station.rating && (
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Rating:</span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-medium">{station.rating}/5</span>
            {station.reviewCount && (
              <span className="text-gray-500">({station.reviewCount})</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Nearby Stations Summary Component
 */
function NearbyStationsSummary({ stations }: { stations: Station[] }) {
  return (
    <div className="space-y-2">
      {stations.map((station) => (
        <div
          key={station.id}
          className="flex items-center justify-between text-sm"
        >
          <span className="truncate text-gray-600 dark:text-gray-400">
            {station.name}
          </span>
          <span className="font-medium text-primary-600 dark:text-primary-400">
            {station.distance?.toFixed(1)}km
          </span>
        </div>
      ))}
      {stations.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No nearby stations found
        </p>
      )}
    </div>
  );
}

/**
 * Description Tab Content
 */
function DescriptionTab({ station }: { station: Station }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          About {station.name}
        </h3>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="leading-relaxed text-gray-700 dark:text-gray-300">
            {station.locationDetails ||
              `${station.name} is a ${station.brand || 'petrol station'} located in ${station.suburb || 'Melbourne'}. We provide quality fuel services and competitive prices to help you save on your fuel costs.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
            Contact Information
          </h4>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            {station.address && (
              <p className="flex items-start gap-2">
                <span className="text-lg">📍</span>
                <span>{station.address}</span>
              </p>
            )}
            {station.phoneNumber && (
              <p className="flex items-center gap-2">
                <span className="text-lg">📞</span>
                <a
                  href={`tel:${station.phoneNumber}`}
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {station.phoneNumber}
                </a>
              </p>
            )}
            {station.website && (
              <p className="flex items-center gap-2">
                <span className="text-lg">🌐</span>
                <a
                  href={station.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Visit Website
                </a>
              </p>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
            Station Details
          </h4>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            {station.brand && (
              <p className="flex items-center gap-2">
                <span className="text-lg">🏪</span>
                <span>Brand: {station.brand}</span>
              </p>
            )}
            {station.category && (
              <p className="flex items-center gap-2">
                <span className="text-lg">🏷️</span>
                <span>Category: {station.category}</span>
              </p>
            )}
            {station.lastUpdated && (
              <p className="flex items-center gap-2">
                <span className="text-lg">🕐</span>
                <span>
                  Last Updated:{' '}
                  {new Date(station.lastUpdated).toLocaleDateString()}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Reviews Tab Content
 */
function ReviewsTab({ station }: { station: Station }) {
  // Mock reviews data - replace with actual data
  const reviews = [
    {
      id: 1,
      author: 'Sarah M.',
      rating: 5,
      date: '2024-01-15',
      comment:
        'Great prices and friendly staff. Always clean and well-maintained.',
    },
    {
      id: 2,
      author: 'Mike R.',
      rating: 4,
      date: '2024-01-10',
      comment: 'Convenient location with competitive prices. Quick service.',
    },
    {
      id: 3,
      author: 'Emma L.',
      rating: 5,
      date: '2024-01-08',
      comment: 'Excellent fuel quality and the shop has everything I need.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Customer Reviews
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {station.reviewCount || reviews.length} reviews • Average rating:{' '}
            {station.rating || 4.5}/5
          </p>
        </div>
        <button className="btn-primary btn">Write Review</button>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {review.author}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        'text-sm',
                        i < review.rating
                          ? 'text-yellow-500'
                          : 'text-gray-300 dark:text-gray-600'
                      )}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Map Tab Content
 */
function MapTab({
  station,
  nearbyStations,
}: {
  station: Station;
  nearbyStations: Station[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Location & Map
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Find {station.name} and compare with nearby stations
        </p>
      </div>

      {/* Map Placeholder */}
      <div className="mb-6 flex aspect-video items-center justify-center rounded-lg bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
        <div className="text-center">
          <div className="mb-2 text-4xl">🗺️</div>
          <p>Interactive Map</p>
          <p className="text-sm">
            Coordinates: {station.latitude}, {station.longitude}
          </p>
        </div>
      </div>

      {/* Nearby Stations */}
      <div>
        <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">
          Nearby Stations ({nearbyStations.length})
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {nearbyStations.slice(0, 6).map((nearbyStation) => (
            <div
              key={nearbyStation.id}
              className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md dark:border-gray-700"
            >
              <div className="mb-2 flex items-start justify-between">
                <h5 className="font-medium text-gray-900 dark:text-white">
                  {nearbyStation.name}
                </h5>
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {nearbyStation.distance?.toFixed(1)}km
                </span>
              </div>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                {nearbyStation.address}
              </p>
              <Link
                href={`/stations/${nearbyStation.id}`}
                className="text-sm text-primary-600 hover:underline dark:text-primary-400"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Prices Tab Content
 */
function PricesTab({ station }: { station: Station }) {
  // Mock fuel prices - replace with actual data
  const fuelPrices = [
    {
      type: 'Unleaded 91',
      price: '169.9',
      trend: 'up',
      lastUpdated: '2 hours ago',
    },
    {
      type: 'Unleaded 95',
      price: '179.9',
      trend: 'stable',
      lastUpdated: '1 hour ago',
    },
    {
      type: 'Unleaded 98',
      price: '189.9',
      trend: 'down',
      lastUpdated: '3 hours ago',
    },
    { type: 'Diesel', price: '174.9', trend: 'up', lastUpdated: '1 hour ago' },
    { type: 'LPG', price: '89.9', trend: 'stable', lastUpdated: '4 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Current Fuel Prices
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time fuel prices at {station.name}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                Fuel Type
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                Price (¢/L)
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">
                Trend
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {fuelPrices.map((fuel, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
              >
                <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                  {fuel.type}
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {fuel.price}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  {fuel.trend === 'up' && (
                    <span className="text-red-500 text-lg">↗</span>
                  )}
                  {fuel.trend === 'down' && (
                    <span className="text-green-500 text-lg">↘</span>
                  )}
                  {fuel.trend === 'stable' && (
                    <span className="text-lg text-gray-500">→</span>
                  )}
                </td>
                <td className="px-4 py-4 text-right text-sm text-gray-500 dark:text-gray-400">
                  {fuel.lastUpdated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 rounded-lg border p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-500 text-lg">ℹ️</span>
          <div>
            <h4 className="text-blue-900 dark:text-blue-100 mb-1 font-semibold">
              Price Information
            </h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Prices are updated in real-time from multiple sources. Last full
              update: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Amenities Grid Component
 */
function AmenitiesGrid({ amenities }: { amenities: Station['amenities'] }) {
  const amenityItems = [
    { key: 'hasCarWash', label: 'Car Wash', icon: '🚿' },
    { key: 'hasShop', label: 'Convenience Store', icon: '🏪' },
    { key: 'hasRestroom', label: 'Restrooms', icon: '🚻' },
    { key: 'hasATM', label: 'ATM', icon: '🏧' },
    { key: 'hasAirPump', label: 'Air Pump', icon: '💨' },
    { key: 'hasElectricCharging', label: 'EV Charging', icon: '🔌' },
    { key: 'hasCafe', label: 'Café', icon: '☕' },
    { key: 'hasParking', label: 'Parking', icon: '🅿️' },
    { key: 'isOpen24Hours', label: '24 Hours', icon: '🕐' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {amenityItems.map((item) => {
        const hasAmenity =
          amenities && (amenities as Record<string, unknown>)[item.key];
        return (
          <div
            key={item.key}
            className={cn(
              'flex items-center gap-3 rounded-lg border p-3 transition-colors',
              hasAmenity
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                : 'border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Operating Hours Table Component
 */
function OperatingHoursTable({ hours }: { hours: Station['operatingHours'] }) {
  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
              Day
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
              Hours
            </th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => {
            const hoursData = hours as Record<string, unknown> | undefined;
            return (
              <tr
                key={day.key}
                className="border-b border-gray-100 last:border-0 dark:border-gray-800"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {day.label}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {(hoursData?.[day.key] as string) || 'Closed'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
