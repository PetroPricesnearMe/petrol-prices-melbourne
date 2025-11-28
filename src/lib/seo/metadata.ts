/**
 * SEO Metadata Utilities
 *
 * Comprehensive utilities for generating SEO-optimized metadata
 * for all pages including listings, detail pages, and directory pages.
 *
 * @module lib/seo/metadata
 */

import type { Metadata } from 'next';

import { generateCanonicalUrl, getBaseUrl } from './canonical';

import type { Station } from '@/types/station';

const SITE_NAME = 'Petrol Price Near Me';
const DEFAULT_DESCRIPTION =
  'Find the cheapest petrol prices near you with real-time updates from 250+ stations across Melbourne.';

/**
 * Site configuration for SEO
 */
export const SITE_CONFIG = {
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au',
  locale: 'en_AU',
};

/**
 * Generate base metadata for any page
 */
export function generateBaseMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image,
  keywords = [],
  noindex = false,
}: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  keywords?: string[];
  noindex?: boolean;
}): Metadata {
  const canonicalUrl = generateCanonicalUrl(path);
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const imageUrl = image || `${getBaseUrl()}/images/og-default.jpg`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      locale: 'en_AU',
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate metadata for station detail page
 */
export function generateStationMetadata(
  station: Station,
  path: string
): Metadata {
  const title = `${station.name} - Fuel Prices & Information`;
  const description = `Find real-time fuel prices and information for ${station.name} in ${station.suburb || 'Melbourne'}. ${station.address ? `Located at ${station.address}` : 'Compare prices and save on your next fill-up.'}`;

  const keywords = [
    `${station.name} fuel prices`,
    `${station.suburb} petrol station`,
    station.brand || '',
    'fuel prices near me',
    'petrol prices Melbourne',
    station.address || '',
  ].filter(Boolean);

  const imageUrl = station.image
    ? `${getBaseUrl()}${station.image}`
    : `${getBaseUrl()}/api/og/station/${station.id}`;

  return generateBaseMetadata({
    title,
    description,
    path,
    image: imageUrl,
    keywords,
  });
}

/**
 * Generate metadata for listing detail page (slug-based)
 */
export function generateListingMetadata(
  station: Station,
  slug: string
): Metadata {
  return generateStationMetadata(station, `listings/${slug}`);
}

/**
 * Generate metadata for directory/listing page
 */
export function generateDirectoryMetadata({
  title,
  description,
  path,
  totalStations,
}: {
  title: string;
  description: string;
  path: string;
  totalStations?: number;
}): Metadata {
  const keywords = [
    'petrol station directory',
    'melbourne petrol stations',
    'fuel price directory',
    'station listing',
    'petrol finder',
    'fuel comparison',
  ];

  if (totalStations) {
    keywords.push(`${totalStations}+ stations`);
  }

  return generateBaseMetadata({
    title,
    description,
    path,
    keywords,
  });
}

/**
 * Generate metadata for region page
 */
export function generateRegionMetadata(
  region: string,
  stationCount: number
): Metadata {
  const title = `${region} Petrol Stations - Fuel Prices`;
  const description = `Find ${stationCount}+ petrol stations in ${region} with real-time fuel prices. Compare prices and find the cheapest fuel near you.`;

  return generateBaseMetadata({
    title,
    description,
    path: `regions/${region.toLowerCase().replace(/\s+/g, '-')}`,
    keywords: [
      `${region} petrol stations`,
      `${region} fuel prices`,
      'petrol stations',
      'fuel prices',
    ],
  });
}

/**
 * Generate metadata for suburb page
 * Enhanced SEO-optimized metadata for suburb fuel price landing pages
 */
export function generateSuburbMetadata(
  suburb: string,
  stationCount: number,
  averagePrice?: number,
  lowestPrice?: number
): Metadata {
  const suburbFormatted = suburb
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  const suburbSlug = suburb.toLowerCase().replace(/\s+/g, '-');
  const priceText = averagePrice
    ? `Average ${averagePrice.toFixed(1)}¢/L`
    : lowestPrice
    ? `From ${lowestPrice.toFixed(1)}¢/L`
    : 'Real-Time Prices';

  // SEO-optimized title with suburb name and key terms
  const title = `${suburbFormatted} Fuel Prices - Petrol Stations & Live Prices | Melbourne`;
  
  // Enhanced description with price information and value proposition
  const description = `Find the cheapest petrol prices in ${suburbFormatted}, Melbourne. Compare real-time fuel prices from ${stationCount} petrol stations. ${priceText}. Save up to 20c/L on unleaded, diesel, and premium fuel. Updated every 24 hours.`;

  // Comprehensive keyword targeting
  const keywords = [
    `${suburbFormatted} fuel prices`,
    `${suburbFormatted} petrol prices`,
    `petrol stations ${suburbFormatted}`,
    `cheap fuel ${suburbFormatted}`,
    `${suburbFormatted} melbourne petrol`,
    `fuel prices ${suburbFormatted} vic`,
    `unleaded prices ${suburbFormatted}`,
    `diesel prices ${suburbFormatted}`,
    `premium fuel ${suburbFormatted}`,
    `petrol near me ${suburbFormatted}`,
    `${suburbFormatted} fuel finder`,
    `best petrol prices ${suburbFormatted}`,
    `live fuel prices ${suburbFormatted}`,
    `fuel price comparison ${suburbFormatted}`,
    `${suburbFormatted} service station`,
  ];

  const path = `suburbs/${suburbSlug}`;
  const baseUrl = getBaseUrl();
  const canonicalUrl = generateCanonicalUrl(path);
  const imageUrl = `${baseUrl}/images/og/suburb-${suburbSlug}.jpg`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_AU',
      url: canonicalUrl,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Petrol Stations and Fuel Prices in ${suburbFormatted}, Melbourne`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@ppnmelbourne',
      site: '@ppnmelbourne',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'geo.region': 'AU-VIC',
      'geo.placename': suburbFormatted,
      'geo.position': 'latitude;longitude', // Should be populated with actual coordinates
    },
  };
}
