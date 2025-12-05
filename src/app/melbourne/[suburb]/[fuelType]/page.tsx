/**
 * Dynamic Suburb Fuel Type Pages
 *
 * Routes: /melbourne/[suburb]/[fuelType]-prices
 * Examples:
 * - /melbourne/coburg/unleaded-prices
 * - /melbourne/epping/diesel-prices
 * - /melbourne/heathmont/e10-prices
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import SuburbFuelTypeClient from './SuburbFuelTypeClient';

import { getAllSuburbs, getStationsBySuburb } from '@/lib/data/stations';
import { generateSuburbFuelTypeMetadata } from '@/lib/seo/suburb-fuel-metadata';
import { generateSuburbFuelTypeSchema } from '@/lib/schema/suburb-fuel-schema';

// Define valid fuel types
const FUEL_TYPES = [
  'unleaded',
  'diesel',
  'premium',
  'e10',
  'e85',
  'lpg',
] as const;
type FuelType = (typeof FUEL_TYPES)[number];

interface PageProps {
  params: Promise<{
    suburb: string;
    fuelType: string;
  }>;
}

// Generate static paths for ISR
export async function generateStaticParams() {
  const suburbs = await getAllSuburbs();
  const paths: Array<{ suburb: string; fuelType: string }> = [];

  // Generate paths for each suburb x fuel type combination
  // Limit to top 100 suburbs to avoid build timeout
  const topSuburbs = suburbs.slice(0, 100);

  for (const suburb of topSuburbs) {
    const suburbSlug = suburb.toLowerCase().replace(/\s+/g, '-');
    for (const fuelType of FUEL_TYPES) {
      paths.push({
        suburb: suburbSlug,
        fuelType: fuelType,
      });
    }
  }

  return paths;
}

// ISR - revalidate every hour
export const revalidate = 3600;

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { suburb, fuelType } = await params;

  // Normalize suburb name for display
  const suburbName = suburb
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Normalize fuel type for display
  const fuelTypeDisplay =
    fuelType === 'unleaded'
      ? 'Unleaded 91'
      : fuelType === 'diesel'
        ? 'Diesel'
        : fuelType === 'premium'
          ? 'Premium 95/98'
          : fuelType === 'e10'
            ? 'E10 Ethanol'
            : fuelType === 'e85'
              ? 'E85 Flex Fuel'
              : fuelType === 'lpg'
                ? 'LPG'
                : fuelType.toUpperCase();

  return generateSuburbFuelTypeMetadata(suburbName, fuelType, fuelTypeDisplay);
}

export default async function SuburbFuelTypePage({ params }: PageProps) {
  const { suburb, fuelType } = await params;

  // Validate fuel type
  if (!FUEL_TYPES.includes(fuelType as FuelType)) {
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

  // Filter stations that have this fuel type (mock for now - add real price data)
  const stationsWithFuel = stations;

  // Generate structured data
  const schema = generateSuburbFuelTypeSchema(
    suburbName,
    fuelType,
    stationsWithFuel
  );

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Client Component */}
      <SuburbFuelTypeClient
        suburb={suburbName}
        suburbSlug={suburb}
        fuelType={fuelType}
        stations={stationsWithFuel}
      />
    </>
  );
}


