/**
 * Station Amenities Page
 * Find stations by available amenities
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { StationAmenitiesClient } from './StationAmenitiesClient';

import { StructuredData } from '@/components/StructuredData';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/seo/schema-generator';


export const metadata: Metadata = {
  title: 'Station Amenities | Find Stations with Specific Services | Petrol Price Near Me',
  description:
    'Find petrol stations in Melbourne by amenities. Search for stations with car wash, shop, restrooms, ATM, air pump, electric charging, and more. Compare prices at stations with your preferred amenities.',
  keywords: [
    'petrol station amenities',
    'car wash near me',
    'petrol station services',
    '24 hour petrol station',
    'electric charging station',
    'petrol station with shop',
    'stations with restrooms',
    'ATM at petrol station',
    'air pump at station',
  ],
  openGraph: {
    title: 'Station Amenities | Find Stations with Specific Services',
    description:
      'Find petrol stations in Melbourne by amenities. Search for stations with car wash, shop, restrooms, ATM, air pump, electric charging, and more.',
    type: 'website',
    images: [
      {
        url: '/images/amenities-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Petrol Station Amenities',
      },
    ],
  },
  alternates: {
    canonical: '/station-amenities',
  },
};

export default function StationAmenitiesPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';
  const schemas = [
    generateOrganizationSchema(baseUrl),
    generateWebSiteSchema(baseUrl),
  ];

  return (
    <>
      <StructuredData data={schemas} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
                Find Stations by Amenities
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
                Search for petrol stations with specific amenities like car wash, shop, restrooms, ATM, air pump, and electric charging.
              </p>
            </div>

            {/* Internal Linking */}
            <div className="mb-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                Related Resources
              </h2>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/directory"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  → Browse All Stations
                </Link>
                <Link
                  href="/fuel-brands"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  → Compare Fuel Brands
                </Link>
                <Link
                  href="/fuel-types"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  → Fuel Types Guide
                </Link>
                <Link
                  href="/blog"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  → Fuel Saving Tips
                </Link>
              </div>
            </div>

            {/* Client Component */}
            <StationAmenitiesClient />

            {/* CTA Section */}
            <div className="mt-12 rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-gray-800">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Find Stations with Your Preferred Amenities
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Use the filters above to find stations with specific amenities. Compare prices at stations with{' '}
                <Link
                  href="/fuel-brands"
                  className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
                >
                  your preferred brands
                </Link>{' '}
                and{' '}
                <Link
                  href="/fuel-types"
                  className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
                >
                  fuel types
                </Link>
                .
              </p>
              <Link
                href="/directory"
                className="inline-block rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:from-primary-700 hover:to-secondary-700 hover:shadow-xl"
              >
                Browse All Stations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
