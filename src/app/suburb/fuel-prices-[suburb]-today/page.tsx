/**
 * Dynamic "Today's Prices" Suburb Pages
 *
 * Routes: /suburb/fuel-prices-[suburb]-today
 * Examples:
 * - /suburb/fuel-prices-heathmont-today
 * - /suburb/fuel-prices-coburg-today
 * - /suburb/fuel-prices-epping-today
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import SuburbTodayPricesClient from './SuburbTodayPricesClient';

import { getAllSuburbs, getStationsBySuburb } from '@/lib/data/stations';
import { generateSuburbTodayMetadata } from '@/lib/seo/suburb-today-metadata';
import { generateSuburbTodaySchema } from '@/lib/schema/suburb-today-schema';

interface PageProps {
  params: Promise<{
    suburb: string;
  }>;
}

// Generate static paths for ISR
export async function generateStaticParams() {
  const suburbs = await getAllSuburbs();

  // Limit to top 150 suburbs
  return suburbs.slice(0, 150).map((suburb) => ({
    suburb: suburb.toLowerCase().replace(/\s+/g, '-'),
  }));
}

// ISR - revalidate every hour
export const revalidate = 3600;

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { suburb } = await params;

  if (!suburb) {
    return { title: 'Fuel Prices Today' };
  }

  const suburbName = suburb
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return generateSuburbTodayMetadata(suburbName);
}

export default async function SuburbTodayPricesPage({ params }: PageProps) {
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

  // Generate structured data
  const schema = generateSuburbTodaySchema(suburbName, stations);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Client Component */}
      <SuburbTodayPricesClient
        suburb={suburbName}
        suburbSlug={suburb}
        stations={stations}
      />
    </>
  );
}
