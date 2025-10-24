/**
 * Detailed Listing Page Demo
 * Showcases the enhanced station detail page with hero image, tabs, and responsive sections
 */
'use client';

import React, { useState } from 'react';

import { HeroSection } from '@/components/molecules/HeroSection';
import { Tabs } from '@/components/molecules/Tabs';
import { cn } from '@/utils/cn';

// Mock station data for demo
const mockStation = {
  id: 'demo-station-1',
  name: 'Shell Service Station',
  brand: 'Shell',
  address: '123 Collins Street',
  suburb: 'Melbourne',
  postcode: '3000',
  latitude: -37.8136,
  longitude: 144.9631,
  phoneNumber: '(03) 9650 1234',
  website: 'https://www.shell.com.au',
  rating: 4.5,
  reviewCount: 127,
  amenities: {
    hasCarWash: true,
    hasShop: true,
    hasRestroom: true,
    hasATM: true,
    hasAirPump: true,
    hasElectricCharging: false,
    hasCafe: true,
    hasParking: true,
    isOpen24Hours: true,
  },
  operatingHours: {
    monday: '6:00 AM - 10:00 PM',
    tuesday: '6:00 AM - 10:00 PM',
    wednesday: '6:00 AM - 10:00 PM',
    thursday: '6:00 AM - 10:00 PM',
    friday: '6:00 AM - 11:00 PM',
    saturday: '7:00 AM - 11:00 PM',
    sunday: '8:00 AM - 10:00 PM',
  },
  lastUpdated: new Date().toISOString(),
};

const mockNearbyStations = [
  {
    id: 'nearby-1',
    name: 'BP Express',
    address: '456 Bourke Street',
    distance: 0.8,
  },
  {
    id: 'nearby-2',
    name: '7-Eleven',
    address: '789 Swanston Street',
    distance: 1.2,
  },
  {
    id: 'nearby-3',
    name: 'Caltex Star',
    address: '321 Flinders Street',
    distance: 1.5,
  },
];

export default function DetailedListingDemo() {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection
        title={mockStation.name}
        subtitle={mockStation.brand}
        description={`${mockStation.address} • ${mockStation.suburb}`}
        imageUrl="/images/stations/shell-hero.jpg"
        imageAlt={`${mockStation.name} petrol station`}
        height="lg"
        contentPosition="left"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="btn btn-primary btn-lg">
            📍 Get Directions
          </button>
          <button className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-gray-900">
            ⭐ Save Favorite
          </button>
        </div>
      </HeroSection>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickInfoCard
              title="Current Prices"
              icon="⛽"
              content={<FuelPriceSummary />}
            />
            <QuickInfoCard
              title="Station Info"
              icon="🏪"
              content={<StationInfoSummary station={mockStation} />}
            />
            <QuickInfoCard
              title="Nearby Stations"
              icon="🗺️"
              content={<NearbyStationsSummary stations={mockNearbyStations} />}
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
                  content: <DescriptionTab station={mockStation} />,
                },
                {
                  id: 'reviews',
                  label: 'Reviews',
                  icon: '⭐',
                  content: <ReviewsTab station={mockStation} />,
                },
                {
                  id: 'map',
                  label: 'Map & Location',
                  icon: '🗺️',
                  content: <MapTab station={mockStation} nearbyStations={mockNearbyStations} />,
                },
                {
                  id: 'prices',
                  label: 'Fuel Prices',
                  icon: '💰',
                  content: <PricesTab station={mockStation} />,
                },
              ]}
              defaultActiveTab="description"
              className="w-full"
              onTabChange={setActiveTab}
            />
          </div>

          {/* Additional Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Amenities */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Amenities
              </h2>
              <AmenitiesGrid amenities={mockStation.amenities} />
            </div>

            {/* Operating Hours */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Operating Hours
              </h2>
              <OperatingHoursTable hours={mockStation.operatingHours} />
            </div>
          </div>

          {/* Features Showcase */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Design Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon="🖼️"
                title="Hero Image Section"
                description="Responsive hero with overlay content and call-to-action buttons"
              />
              <FeatureCard
                icon="📑"
                title="Tabbed Interface"
                description="Accessible tabs with keyboard navigation and smooth transitions"
              />
              <FeatureCard
                icon="📱"
                title="Responsive Design"
                description="Mobile-first approach with fluid layouts and breakpoint optimization"
              />
              <FeatureCard
                icon="♿"
                title="Accessibility"
                description="WCAG 2.1 AA compliant with proper ARIA labels and keyboard support"
              />
              <FeatureCard
                icon="🎨"
                title="Modern UI"
                description="Clean design with Tailwind CSS and dark mode support"
              />
              <FeatureCard
                icon="⚡"
                title="Performance"
                description="Optimized with Next.js Image component and lazy loading"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
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
function FuelPriceSummary() {
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
function StationInfoSummary({ station }: { station: typeof mockStation }) {
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
function NearbyStationsSummary({ stations }: { stations: typeof mockNearbyStations }) {
  return (
    <div className="space-y-2">
      {stations.map((station, index) => (
        <div key={station.id} className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400 truncate">
            {station.name}
          </span>
          <span className="font-medium text-primary-600 dark:text-primary-400">
            {station.distance.toFixed(1)}km
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Description Tab Content
 */
function DescriptionTab({ station }: { station: typeof mockStation }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          About {station.name}
        </h3>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {station.name} is a {station.brand} service station located in the heart of {station.suburb}.
            We provide quality fuel services, competitive prices, and a range of amenities to make your visit convenient and comfortable.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Contact Information
          </h4>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p className="flex items-start gap-2">
              <span className="text-lg">📍</span>
              <span>{station.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-lg">📞</span>
              <a
                href={`tel:${station.phoneNumber}`}
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                {station.phoneNumber}
              </a>
            </p>
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
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Station Details
          </h4>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p className="flex items-center gap-2">
              <span className="text-lg">🏪</span>
              <span>Brand: {station.brand}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <span>Rating: {station.rating}/5 ({station.reviewCount} reviews)</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-lg">🕐</span>
              <span>Last Updated: {new Date(station.lastUpdated).toLocaleDateString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Reviews Tab Content
 */
function ReviewsTab({ station }: { station: typeof mockStation }) {
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
            {station.reviewCount} reviews • Average rating: {station.rating}/5
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
  station: typeof mockStation;
  nearbyStations: typeof mockNearbyStations;
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
          {nearbyStations.map((nearbyStation) => (
            <div key={nearbyStation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-gray-900 dark:text-white">
                  {nearbyStation.name}
                </h5>
                <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  {nearbyStation.distance.toFixed(1)}km
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {nearbyStation.address}
              </p>
              <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                View Details →
              </button>
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
function PricesTab({ station }: { station: typeof mockStation }) {
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
function AmenitiesGrid({ amenities }: { amenities: typeof mockStation.amenities }) {
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
            amenities[item.key as keyof typeof amenities]
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
function OperatingHoursTable({ hours }: { hours: typeof mockStation.operatingHours }) {
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
                {hours[day.key as keyof typeof hours] || 'Closed'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Feature Card Component
 */
function FeatureCard({
  icon,
  title,
  description
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-4">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
