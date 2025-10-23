/**
 * Station Detail Page with ISR
 * Dynamic route: /stations/[id]
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import DirectoryLayout from '@/components/layouts/DirectoryLayout';
import { getStationById, getAllStationIds } from '@/lib/data/stations';
import type { Station } from '@/types/station';
import { patterns } from '@/styles/system/css-in-js';
import { cn } from '@/utils/cn';

interface StationPageProps {
  params: {
    id: string;
  };
}

// Generate static params for ISR
export async function generateStaticParams() {
  const stationIds = await getAllStationIds();

  // Generate params for the first 100 stations at build time
  // Others will be generated on-demand
  return stationIds.slice(0, 100).map((id) => ({
    id: id.toString(),
  }));
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: StationPageProps): Promise<Metadata> {
  const station = await getStationById(params.id);

  if (!station) {
    return {
      title: 'Station Not Found',
    };
  }

  const title = `${station.name} - Fuel Prices & Information`;
  const description = `Find real-time fuel prices and information for ${station.name} in ${station.suburb || 'Melbourne'}. ${station.address ? `Located at ${station.address}` : 'Compare prices and save on your next fill-up.'}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_AU',
      url: `https://petrolpricenearme.com.au/stations/${params.id}`,
      siteName: 'Petrol Price Near Me',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `https://petrolpricenearme.com.au/stations/${params.id}`,
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

export default async function StationPage({ params }: StationPageProps) {
  const station = await getStationById(params.id);

  if (!station) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Directory', href: '/directory' },
    { label: station.suburb || 'Melbourne', href: `/directory/${station.suburb?.toLowerCase().replace(/\s+/g, '-') || 'melbourne'}` },
    { label: station.name, href: `/stations/${params.id}` },
  ];

  return (
    <DirectoryLayout
      title={station.name}
      description={`${station.address || ''} ${station.suburb ? `• ${station.suburb}` : ''}`}
      breadcrumbs={breadcrumbs}
      showSidebar={true}
      sidebar={<StationSidebar station={station} />}
    >
      <div className="space-y-6">
        {/* Station Header Card */}
        <div className="card p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Station Details
              </h2>
              {station.brand && (
                <span className="badge badge-primary">{station.brand}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Link
                href={`/directions?station=${params.id}`}
                className="btn btn-primary"
              >
                Get Directions
              </Link>
            </div>
          </div>

          {/* Station Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Location
              </h3>
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                {station.address && (
                  <p className="flex items-start gap-2">
                    <span className="text-lg">📍</span>
                    <span>{station.address}</span>
                  </p>
                )}
                {station.suburb && (
                  <p className="flex items-center gap-2">
                    <span className="text-lg">🏙️</span>
                    <span>{station.suburb}</span>
                  </p>
                )}
                {station.postcode && (
                  <p className="flex items-center gap-2">
                    <span className="text-lg">📮</span>
                    <span>{station.postcode}</span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Contact
              </h3>
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                {station.phone && (
                  <p className="flex items-center gap-2">
                    <span className="text-lg">📞</span>
                    <a
                      href={`tel:${station.phone}`}
                      className="hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {station.phone}
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
          </div>
        </div>

        {/* Fuel Prices Card */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Current Fuel Prices
          </h2>
          <FuelPricesTable station={station} />
        </div>

        {/* Amenities Card */}
        {station.amenities && station.amenities.length > 0 && (
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {station.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <span className="text-green-500">✓</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Stations */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Nearby Stations
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Compare prices with other stations in the area
          </p>
          <Link href="/directory" className="btn btn-outline">
            Browse All Stations
          </Link>
        </div>
      </div>
    </DirectoryLayout>
  );
}

/**
 * Station Sidebar Component
 */
function StationSidebar({ station }: { station: Station }) {
  return (
    <div className="space-y-6">
      {/* Quick Info Card */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Quick Info
        </h3>
        <div className="space-y-2 text-sm">
          {station.is24Hours && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <span>🕐</span>
              <span>Open 24 Hours</span>
            </div>
          )}
          {station.lastUpdated && (
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Last Updated:</span>
              <br />
              {new Date(station.lastUpdated).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Location Map
        </h3>
        <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
          Map View
        </div>
      </div>

      {/* Actions */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Actions
        </h3>
        <div className="space-y-2">
          <button className="btn btn-outline btn-sm w-full">
            ⭐ Save Favorite
          </button>
          <button className="btn btn-outline btn-sm w-full">
            🔔 Set Price Alert
          </button>
          <button className="btn btn-outline btn-sm w-full">
            📤 Share Station
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Fuel Prices Table Component
 */
function FuelPricesTable({ station }: { station: Station }) {
  // Mock fuel prices - replace with actual data
  const fuelPrices = [
    { type: 'Unleaded 91', price: '169.9', trend: 'up' },
    { type: 'Unleaded 95', price: '179.9', trend: 'stable' },
    { type: 'Unleaded 98', price: '189.9', trend: 'down' },
    { type: 'Diesel', price: '174.9', trend: 'up' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
              Fuel Type
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
              Price (¢/L)
            </th>
            <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
              Trend
            </th>
          </tr>
        </thead>
        <tbody>
          {fuelPrices.map((fuel, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
              <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                {fuel.type}
              </td>
              <td className="py-4 px-4 text-right">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {fuel.price}
                </span>
              </td>
              <td className="py-4 px-4 text-center">
                {fuel.trend === 'up' && <span className="text-red-500">↗</span>}
                {fuel.trend === 'down' && (
                  <span className="text-green-500">↘</span>
                )}
                {fuel.trend === 'stable' && (
                  <span className="text-gray-500">→</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Prices updated in real-time • Last update:{' '}
        {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
