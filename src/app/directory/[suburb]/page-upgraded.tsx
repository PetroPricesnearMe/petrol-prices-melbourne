/**
 * Upgraded Suburb Fuel Prices Page
 * 
 * Example implementation of the upgraded suburb landing page template
 * This demonstrates how to use the SuburbFuelPricesPage template
 * 
 * To use this, replace the existing page.tsx with this implementation
 * or merge the features into the existing page.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SuburbFuelPricesPage, generateSuburbFuelPricesMetadata } from '@/components/templates/SuburbFuelPricesPage';
import stationsData from '@/data/stations.json';
import { calculateSuburbPriceStats, getNearbySuburbs } from '@/lib/utils/suburbs';

// Import station types from the JSON data structure
type StationData = typeof stationsData[number];

interface Props {
  params: Promise<{ suburb: string }>;
}

// Generate static pages for top suburbs
export async function generateStaticParams() {
  // Get top 200 suburbs by station count for static generation
  const metadataJson = await import('@/data/stations-metadata.json');
  const suburbCounts = Object.entries(metadataJson.default.stats.bySuburb)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 200);

  return suburbCounts.map(([suburb]) => ({
    suburb: suburb.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { suburb } = await params;
  const suburbName = suburb.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const stations = (stationsData as StationData[]).filter(
    (s) => s.suburb?.toLowerCase().replace(/\s+/g, '-') === suburb
  );

  if (stations.length === 0) {
    return {
      title: 'Suburb Not Found',
    };
  }

  const priceStats = calculateSuburbPriceStats(stations);

  return generateSuburbFuelPricesMetadata(
    suburbName,
    stations.length,
    priceStats.average
  );
}

export default async function UpgradedSuburbDirectoryPage({ params }: Props) {
  const { suburb } = await params;
  const suburbName = suburb.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  // Filter stations for this suburb
  const stations = (stationsData as StationData[] || []).filter(
    (s) => s?.suburb?.toLowerCase().replace(/\s+/g, '-') === suburb
  ).filter(Boolean);

  if (stations.length === 0) {
    notFound();
  }

  // Calculate price statistics
  const priceStats = calculateSuburbPriceStats(stations);

  // Get nearby suburbs
  const nearbySuburbs = getNearbySuburbs(suburbName, 6);

  // Convert stations to the format expected by the template
  const formattedStations = stations.map((station) => ({
    id: station.id,
    name: station.name || 'Unknown Station',
    address: station.address,
    suburb: station.suburb,
    postcode: station.postcode,
    brand: station.brand,
    latitude: station.latitude,
    longitude: station.longitude,
    fuelPrices: {
      unleaded: station.fuelPrices?.unleaded || null,
      diesel: station.fuelPrices?.diesel || null,
      premium95: station.fuelPrices?.premium95 || null,
      premium98: station.fuelPrices?.premium98 || null,
    },
  }));

  return (
    <SuburbFuelPricesPage
      suburb={suburbName}
      stations={formattedStations}
      nearbySuburbs={nearbySuburbs}
      averagePrice={priceStats.average}
      lowestPrice={priceStats.lowest}
      highestPrice={priceStats.highest}
    />
  );
}
