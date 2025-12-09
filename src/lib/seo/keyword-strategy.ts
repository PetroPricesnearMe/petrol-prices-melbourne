/**
 * SEO Keyword Strategy Utilities
 *
 * Generates location-based SEO keywords, titles, meta descriptions,
 * and keyword-rich headings based on the keyword strategy.
 *
 * @module lib/seo/keyword-strategy
 */

import type { Metadata } from 'next';

import { generateCanonicalUrl, getBaseUrl } from './canonical';

const SITE_NAME = 'PetrolPricesNearMe';

/**
 * Format location name for display (capitalize properly)
 */
export function formatLocationName(location: string): string {
  return location
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Generate location slug from name
 */
export function generateLocationSlug(location: string): string {
  return location.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Generate comprehensive keyword list for a location
 * Includes all required keywords from the strategy
 */
export function generateLocationKeywords(location?: string): string[] {
  const baseKeywords = [
    // General keywords
    'petrol prices Melbourne',
    'fuel prices Melbourne',
    'petrol prices near me',
    'fuel prices near me',
    'petrol price comparison',
    // Live/Today keywords
    'petrol prices today',
    'fuel prices today',
    'live petrol prices Melbourne',
    'cheap fuel prices today',
    // Fuel type keywords
    'unleaded price near me',
    'diesel price near me',
    'premium petrol price near me',
    'E10 prices near me',
  ];

  if (!location) {
    return baseKeywords;
  }

  const formattedLocation = formatLocationName(location);

  return [
    ...baseKeywords,
    // Location-specific keywords
    `petrol prices ${formattedLocation}`,
    `fuel prices ${formattedLocation}`,
    `cheapest petrol ${formattedLocation}`,
    `cheap petrol ${formattedLocation}`,
    // Additional location variations
    `${formattedLocation} petrol prices today`,
    `${formattedLocation} fuel prices today`,
    `petrol prices ${formattedLocation} today`,
    `fuel prices ${formattedLocation} today`,
    `cheapest fuel ${formattedLocation}`,
    `best petrol prices ${formattedLocation}`,
    `live fuel prices ${formattedLocation}`,
  ];
}

/**
 * Generate SEO title for location-based pages
 * Format: "{location} petrol prices today | Cheapest fuel near me | PetrolPricesNearMe"
 */
export function generateLocationTitle(location?: string): string {
  if (location) {
    const formattedLocation = formatLocationName(location);
    return `${formattedLocation} petrol prices today | Cheapest fuel near me | ${SITE_NAME}`;
  }
  return `Petrol prices today | Cheapest fuel near me | ${SITE_NAME}`;
}

/**
 * Generate meta description for location-based pages
 * Based on "live petrol prices" and suburb names
 */
export function generateLocationDescription(
  location?: string,
  stationCount?: number,
  averagePrice?: number
): string {
  if (location) {
    const formattedLocation = formatLocationName(location);
    const stationText = stationCount
      ? `${stationCount} stations`
      : 'multiple stations';
    const priceText = averagePrice
      ? ` Average price: ${averagePrice.toFixed(1)}¢/L.`
      : '';
    return `Find live petrol prices in ${formattedLocation} today. Compare cheapest fuel prices from ${stationText}.${priceText} Save money on unleaded, diesel, and premium fuel. Updated daily.`;
  }
  return 'Find live petrol prices near you today. Compare cheapest fuel prices from stations across Australia. Save money on unleaded, diesel, and premium fuel. Updated daily.';
}

/**
 * Generate keyword-rich H1 heading
 * Examples: "Live Petrol Prices in Sunbury Today" or "Cheap Fuel Prices Near Me Today"
 */
export function generateH1Heading(location?: string): string {
  if (location) {
    const formattedLocation = formatLocationName(location);
    return `Live Petrol Prices in ${formattedLocation} Today`;
  }
  return 'Cheap Fuel Prices Near Me Today';
}

/**
 * Generate keyword-rich H2 heading variations
 */
export function generateH2Heading(
  type: 'prices' | 'stations' | 'comparison' | 'nearby',
  location?: string
): string {
  const formattedLocation = location ? formatLocationName(location) : '';

  switch (type) {
    case 'prices':
      return location
        ? `Cheapest Petrol Prices in ${formattedLocation} Today`
        : 'Cheap Fuel Prices Near Me Today';
    case 'stations':
      return location
        ? `Petrol Stations in ${formattedLocation}`
        : 'Petrol Stations Near Me';
    case 'comparison':
      return location
        ? `Compare Fuel Prices in ${formattedLocation}`
        : 'Compare Fuel Prices Near Me';
    case 'nearby':
      return location
        ? `Nearby Petrol Stations to ${formattedLocation}`
        : 'Nearby Petrol Stations';
    default:
      return 'Fuel Prices';
  }
}

/**
 * Generate comprehensive metadata for location-based pages
 * Includes dynamic OpenGraph tags with og:title, og:description, og:locale, og:url
 */
export function generateLocationMetadata({
  location,
  path,
  stationCount,
  averagePrice,
  lowestPrice: _lowestPrice,
  image,
}: {
  location?: string;
  path: string;
  stationCount?: number;
  averagePrice?: number;
  lowestPrice?: number;
  image?: string;
}): Metadata {
  const formattedLocation = location ? formatLocationName(location) : '';
  const title = generateLocationTitle(location);
  const description = generateLocationDescription(
    location,
    stationCount,
    averagePrice
  );
  const keywords = generateLocationKeywords(location);

  const canonicalUrl = generateCanonicalUrl(path);
  const baseUrl = getBaseUrl();
  const imageUrl =
    image ||
    (location
      ? `${baseUrl}/images/og/location-${generateLocationSlug(location)}.jpg`
      : `${baseUrl}/images/og-default.jpg`);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_AU', // og:locale
      url: canonicalUrl, // og:url
      siteName: SITE_NAME,
      title, // og:title
      description, // og:description
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: location
            ? `Petrol Prices in ${formattedLocation} Today`
            : 'Petrol Prices Near Me',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
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
    other: location
      ? {
          'geo.region': 'AU-VIC',
          'geo.placename': formattedLocation,
        }
      : undefined,
  };
}

/**
 * Generate JSON-LD schema for location-based pages
 * Includes WebSite + LocalBusiness schema types
 */
export function generateLocationSchema({
  location,
  baseUrl,
  stationCount,
  averagePrice,
  stations,
}: {
  location?: string;
  baseUrl: string;
  stationCount?: number;
  averagePrice?: number;
  stations?: Array<{ name: string; latitude?: number; longitude?: number }>;
}): object {
  const formattedLocation = location
    ? formatLocationName(location)
    : 'Melbourne';
  const locationSlug = location ? generateLocationSlug(location) : 'melbourne';

  // Calculate average coordinates if stations provided
  let geoCoordinates;
  if (stations && stations.length > 0) {
    const validCoords = stations.filter(
      (s) => s.latitude && s.longitude
    ) as Array<{ latitude: number; longitude: number }>;
    if (validCoords.length > 0) {
      const avgLat =
        validCoords.reduce((sum, s) => sum + s.latitude, 0) /
        validCoords.length;
      const avgLng =
        validCoords.reduce((sum, s) => sum + s.longitude, 0) /
        validCoords.length;
      geoCoordinates = {
        '@type': 'GeoCoordinates',
        latitude: avgLat,
        longitude: avgLng,
      };
    }
  }

  // WebSite schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/locations/${locationSlug}#website`,
    name: `${formattedLocation} Petrol Prices - ${SITE_NAME}`,
    url: `${baseUrl}/locations/${locationSlug}`,
    description: `Live petrol prices in ${formattedLocation}. Compare fuel prices from ${stationCount || 'multiple'} stations.`,
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    inLanguage: 'en-AU',
    ...(geoCoordinates && { geo: geoCoordinates }),
    areaServed: {
      '@type': 'City',
      name: formattedLocation,
      addressRegion: 'VIC',
      addressCountry: 'AU',
    },
  };

  // LocalBusiness schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/locations/${locationSlug}#localbusiness`,
    name: `Petrol Stations in ${formattedLocation}`,
    description: `Find the cheapest petrol prices in ${formattedLocation}. Compare live fuel prices from ${stationCount || 'multiple'} stations.`,
    url: `${baseUrl}/locations/${locationSlug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: formattedLocation,
      addressRegion: 'VIC',
      addressCountry: 'AU',
    },
    areaServed: {
      '@type': 'City',
      name: formattedLocation,
    },
    ...(geoCoordinates && { geo: geoCoordinates }),
    ...(averagePrice && {
      priceRange: `$${averagePrice.toFixed(2)}`,
    }),
  };

  // Return combined schema graph
  return {
    '@context': 'https://schema.org',
    '@graph': [websiteSchema, localBusinessSchema],
  };
}
