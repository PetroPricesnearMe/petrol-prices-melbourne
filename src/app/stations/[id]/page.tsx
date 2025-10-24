/**
 * Enhanced Station Detail Page with Hero Image, Tabs, and Responsive Sections
 * Dynamic route: /stations/[id]
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import DirectoryLayout from '@/components/layouts/DirectoryLayout';
import { HeroSection } from '@/components/molecules/HeroSection';
import { Tabs } from '@/components/molecules/Tabs';
import { getStationById, getAllStationIds, getNearbyStations } from '@/lib/data/stations';
import type { Station } from '@/types/station';
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
      images: [
        {
          url: `/api/og/station/${params.id}`,
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

  // Get nearby stations for the map and recommendations
  const nearbyStations = station.latitude && station.longitude
    ? await getNearbyStations(station.latitude, station.longitude, 5)
    : [];

  const breadcrumbs = [
    { label: 'Directory', href: '/directory' },
    { label: station.suburb || 'Melbourne', href: `/directory/${station.suburb?.toLowerCase().replace(/\s+/g, '-') || 'melbourne'}` },
    { label: station.name, href: `/stations/${params.id}` },
  ];

  // Generate hero image URL (placeholder for now)
  const heroImageUrl = station.brand
    ? `/images/stations/${station.brand.toLowerCase().replace(/\s+/g, '-')}-hero.jpg`
    : '/images/stations/default-hero.jpg';

  return (
    <DirectoryLayout
      title={station.name}
      description={`${station.address || ''} ${station.suburb ? `• ${station.suburb}` : ''}`}
      breadcrumbs={breadcrumbs}
      showSidebar={false}
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
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/directions?station=${params.id}`}
              className="btn btn-primary btn-lg"
            >
              📍 Get Directions
            </Link>
            <button className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-gray-900">
              ⭐ Save Favorite
            </button>
          </div>
        </HeroSection>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            content={<NearbyStationsSummary stations={nearbyStations.slice(0, 3)} />}
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
                content: <MapTab station={station} nearbyStations={nearbyStations} />,
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Amenities */}
          {station.amenities && Object.values(station.amenities).some(Boolean) && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Amenities
              </h2>
              <AmenitiesGrid amenities={station.amenities} />
            </div>
          )}

          {/* Operating Hours */}
          {station.operatingHours && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Operating Hours
              </h2>
              <OperatingHoursTable hours={station.operatingHours} />
            </div>
          )}
        </div>
      </div>
    </DirectoryLayout>
  );
}

/**
 * Quick Info Card Component
 */
function QuickInfoCard({
  title,
  icon,
  content
}: {
  title: string;
  icon: string;
  content: React.ReactNode;
}) {
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-4">
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
function FuelPriceSummary({ station }: { station: Station }) {
  // Mock fuel prices - replace with actual data
  const fuelPrices = [
    { type: 'Unleaded 91', price: '169.9', trend: 'up' },
    { type: 'Unleaded 95', price: '179.9', trend: 'stable' },
    { type: 'Diesel', price: '174.9', trend: 'down' },
  ];

  return (
    <div className="space-y-3">
      {fuelPrices.map((fuel, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {fuel.type}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {fuel.price}¢
            </span>
            <span className="text-sm">
              {fuel.trend === 'up' && <span className="text-red-500">↗</span>}
              {fuel.trend === 'down' && <span className="text-green-500">↘</span>}
              {fuel.trend === 'stable' && <span className="text-gray-500">→</span>}
            </span>
          </div>
        </div>
      ))}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
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
            className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
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
      {stations.map((station, index) => (
        <div key={station.id} className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400 truncate">
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
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          About {station.name}
        </h3>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {station.locationDetails ||
              `${station.name} is a ${station.brand || 'petrol station'} located in ${station.suburb || 'Melbourne'}.
              We provide quality fuel services and competitive prices to help you save on your fuel costs.`
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
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
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
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
                <span>Last Updated: {new Date(station.lastUpdated).toLocaleDateString()}</span>
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
      comment: 'Great prices and friendly staff. Always clean and well-maintained.',
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
            {station.reviewCount || reviews.length} reviews • Average rating: {station.rating || 4.5}/5
          </p>
        </div>
        <button className="btn btn-primary">
          Write Review
        </button>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
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
                        i < review.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'
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
            <p className="text-gray-700 dark:text-gray-300">
              {review.comment}
            </p>
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
  nearbyStations
}: {
  station: Station;
  nearbyStations: Station[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Location & Map
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Find {station.name} and compare with nearby stations
        </p>
      </div>

      {/* Map Placeholder */}
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 mb-6">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <p>Interactive Map</p>
          <p className="text-sm">Coordinates: {station.latitude}, {station.longitude}</p>
        </div>
      </div>

      {/* Nearby Stations */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
          Nearby Stations ({nearbyStations.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nearbyStations.slice(0, 6).map((nearbyStation) => (
            <div key={nearbyStation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-gray-900 dark:text-white">
                  {nearbyStation.name}
                </h5>
                <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  {nearbyStation.distance?.toFixed(1)}km
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {nearbyStation.address}
              </p>
              <Link
                href={`/stations/${nearbyStation.id}`}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
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
    { type: 'Unleaded 91', price: '169.9', trend: 'up', lastUpdated: '2 hours ago' },
    { type: 'Unleaded 95', price: '179.9', trend: 'stable', lastUpdated: '1 hour ago' },
    { type: 'Unleaded 98', price: '189.9', trend: 'down', lastUpdated: '3 hours ago' },
    { type: 'Diesel', price: '174.9', trend: 'up', lastUpdated: '1 hour ago' },
    { type: 'LPG', price: '89.9', trend: 'stable', lastUpdated: '4 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Fuel Type
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Price (¢/L)
              </th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Trend
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {fuelPrices.map((fuel, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
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
                  {fuel.trend === 'up' && <span className="text-red-500 text-lg">↗</span>}
                  {fuel.trend === 'down' && <span className="text-green-500 text-lg">↘</span>}
                  {fuel.trend === 'stable' && <span className="text-gray-500 text-lg">→</span>}
                </td>
                <td className="py-4 px-4 text-right text-sm text-gray-500 dark:text-gray-400">
                  {fuel.lastUpdated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-500 text-lg">ℹ️</span>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Price Information
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Prices are updated in real-time from multiple sources.
              Last full update: {new Date().toLocaleString()}
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
function AmenitiesGrid({ amenities }: { amenities: any }) {
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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {amenityItems.map((item) => (
        <div
          key={item.key}
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg border transition-colors',
            amenities[item.key]
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
          )}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="text-sm font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Operating Hours Table Component
 */
function OperatingHoursTable({ hours }: { hours: any }) {
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
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
              Day
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
              Hours
            </th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr
              key={day.key}
              className="border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
              <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                {day.label}
              </td>
              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                {hours[day.key] || 'Closed'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
