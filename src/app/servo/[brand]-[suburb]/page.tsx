/**
 * Dynamic Brand + Suburb Pages
 *
 * Routes: /servo/[brand]-[suburb]
 * Examples:
 * - /servo/caltex-coburg
 * - /servo/7-eleven-epping
 * - /servo/bp-melbourne
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ServoBrandSuburbClient from './ServoBrandSuburbClient';

import { getAllStations } from '@/lib/data/stations';
import { generateBrandSuburbMetadata } from '@/lib/seo/brand-suburb-metadata';
import { generateBrandSuburbSchema } from '@/lib/schema/brand-suburb-schema';

interface PageProps {
  params: Promise<{
    'brand-suburb': string;
  }>;
}

// Generate static paths for top brand+suburb combinations
export async function generateStaticParams() {
  const stations = await getAllStations();
  const paths = new Set<string>();

  // Get unique brand-suburb combinations
  stations.forEach((station) => {
    if (station.brand && station.suburb) {
      const brandSlug = station.brand.toLowerCase().replace(/\s+/g, '-');
      const suburbSlug = station.suburb.toLowerCase().replace(/\s+/g, '-');
      paths.add(`${brandSlug}-${suburbSlug}`);
    }
  });

  // Limit to top 200 combinations
  return Array.from(paths)
    .slice(0, 200)
    .map((slug) => ({
      'brand-suburb': slug,
    }));
}

// ISR - revalidate every hour
export const revalidate = 3600;

// Helper to parse brand-suburb slug
function parseBrandSuburbSlug(
  slug: string
): { brand: string; suburb: string } | null {
  // Try to split by last hyphen (suburb is typically one word)
  const parts = slug.split('-');

  if (parts.length < 2) return null;

  // Try different combinations to find valid brand-suburb split
  for (let i = 1; i < parts.length; i++) {
    const brand = parts.slice(0, i).join('-');
    const suburb = parts.slice(i).join('-');

    if (brand && suburb) {
      return { brand, suburb };
    }
  }

  return null;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = (await params)['brand-suburb'];
  const parsed = parseBrandSuburbSlug(slug);

  if (!parsed) {
    return { title: 'Servo Not Found' };
  }

  const brandName = parsed.brand
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const suburbName = parsed.suburb
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return generateBrandSuburbMetadata(brandName, suburbName);
}

export default async function ServoBrandSuburbPage({ params }: PageProps) {
  const slug = (await params)['brand-suburb'];
  const parsed = parseBrandSuburbSlug(slug);

  if (!parsed) {
    notFound();
  }

  // Normalize names for display
  const brandName = parsed.brand
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const suburbName = parsed.suburb
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Get all stations and filter by brand and suburb
  const allStations = await getAllStations();
  const stations = allStations.filter((station) => {
    const stationBrand = station.brand?.toLowerCase().replace(/\s+/g, '-');
    const stationSuburb = station.suburb?.toLowerCase().replace(/\s+/g, '-');
    return stationBrand === parsed.brand && stationSuburb === parsed.suburb;
  });

  if (!stations || stations.length === 0) {
    notFound();
  }

  // Generate structured data
  const schema = generateBrandSuburbSchema(brandName, suburbName, stations);

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Client Component */}
      <ServoBrandSuburbClient
        brand={brandName}
        brandSlug={parsed.brand}
        suburb={suburbName}
        suburbSlug={parsed.suburb}
        stations={stations}
      />
    </>
  );
}
