/**
 * Region-Specific Station Listing Page
 * Dynamic route for regional station listings
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { RegionStationsClient } from './RegionStationsClient';

import { StructuredData } from '@/components/StructuredData';
import {
  generateDirectoryListSchema,
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/seo/schema-generator';


const regions = {
  'north-melbourne': {
    name: 'Northern Suburbs',
    description: 'Find the cheapest petrol stations in Northern Suburbs and surrounding areas.',
    color: '#3B82F6',
  },
  'south-melbourne': {
    name: 'South Eastern Suburbs',
    description: 'Compare fuel prices across South Eastern Suburbs petrol stations.',
    color: '#10B981',
  },
  'east-melbourne': {
    name: 'Inner East Melbourne',
    description: 'Discover affordable fuel in Inner East Melbourne suburbs.',
    color: '#F59E0B',
  },
  'west-melbourne': {
    name: 'Western Suburbs',
    description: 'Browse petrol stations in Western Suburbs for the best prices.',
    color: '#EF4444',
  },
  'cbd': {
    name: 'Melbourne CBD',
    description: 'Find petrol stations in Melbourne CBD with competitive prices.',
    color: '#8B5CF6',
  },
};

export async function generateMetadata({
  params,
}: {
  params: { region: string };
}): Promise<Metadata> {
  const region = regions[params.region as keyof typeof regions];

  if (!region) {
    return {
      title: 'Region Not Found',
    };
  }

  return {
    title: `${region.name} Petrol Stations | Live Fuel Prices | Petrol Price Near Me`,
    description: `${region.description} Compare real-time fuel prices across all stations in ${region.name}. Find the cheapest petrol near you.`,
    keywords: [
      `${region.name} petrol prices`,
      `fuel prices ${region.name}`,
      `${region.name} stations`,
      'melbourne fuel',
      `${region.name} fuel comparison`,
      `cheapest fuel ${region.name}`,
      `${region.name} petrol stations directory`,
    ],
    openGraph: {
      title: `${region.name} Petrol Stations | Live Fuel Prices`,
      description: `${region.description} Compare real-time fuel prices and find the cheapest stations.`,
      type: 'website',
      images: [
        {
          url: '/images/regions-og.jpg',
          width: 1200,
          height: 630,
          alt: `${region.name} Petrol Stations`,
        },
      ],
    },
    alternates: {
      canonical: `/regions/${params.region}`,
    },
  };
}

// Enable ISR - Revalidate every 24 hours
// 86400 seconds = 24 hours
export const revalidate = 86400;

export async function generateStaticParams() {
  return Object.keys(regions).map((region) => ({
    region,
  }));
}

export default function RegionPage({
  params,
}: {
  params: { region: string };
}) {
  const region = regions[params.region as keyof typeof regions];

  if (!region) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';
  // Note: In production, fetch actual stations count
  const stationCount = 0; // This would come from API
  const schemas = [
    generateOrganizationSchema(baseUrl),
    generateWebSiteSchema(baseUrl),
  ];

  // Add ItemList schema if we have stations
  // if (stationCount > 0) {
  //   schemas.push(generateDirectoryListSchema(baseUrl, [], `${region.name} Petrol Stations`));
  // }

  return (
    <>
      <StructuredData data={schemas} />
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
      <RegionStationsClient region={region} regionSlug={params.region} />
    </>
  );
}
