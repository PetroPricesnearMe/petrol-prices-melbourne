/**
 * Region-Specific Station Listing Page
 * Dynamic route for regional station listings
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RegionStationsClient } from './RegionStationsClient';

const regions = {
  'north-melbourne': {
    name: 'North Melbourne',
    description: 'Find the cheapest petrol stations in North Melbourne and surrounding suburbs.',
    color: '#3B82F6',
  },
  'south-melbourne': {
    name: 'South Melbourne',
    description: 'Compare fuel prices across South Melbourne petrol stations.',
    color: '#10B981',
  },
  'east-melbourne': {
    name: 'East Melbourne',
    description: 'Discover affordable fuel in East Melbourne suburbs.',
    color: '#F59E0B',
  },
  'west-melbourne': {
    name: 'West Melbourne',
    description: 'Browse petrol stations in West Melbourne for the best prices.',
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
    title: `${region.name} Petrol Stations | Live Fuel Prices`,
    description: region.description,
    keywords: [
      `${region.name} petrol prices`,
      `fuel prices ${region.name}`,
      `${region.name} stations`,
      'melbourne fuel',
    ],
    openGraph: {
      title: `${region.name} Petrol Stations`,
      description: region.description,
    },
  };
}

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

  return <RegionStationsClient region={region} regionSlug={params.region} />;
}
