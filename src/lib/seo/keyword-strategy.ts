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
 * Prioritizes "near me" patterns first as per SEO strategy
 */
export function generateLocationKeywords(location?: string): string[] {
  const baseKeywords = [
    // PRIMARY KEYWORDS - "near me" patterns (prioritized)
    'petrol near me',
    'cheap fuel near me',
    'cheap petrol near me',
    'petrol near me price',
    'petrol prices near me',
    'fuel prices near me',
    'fuel price near me',
    // SECONDARY KEYWORDS
    'petrol prices',
    'fuel melbourne prices',
    'cheap petrol',
    // Additional keywords
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
 * Optimized to 50-60 characters with "near me" keywords prioritized
 * Format: "Live Petrol Prices Near Me Today | Cheap Fuel Prices Melbourne"
 */
export function generateLocationTitle(location?: string): string {
  if (location) {
    const formattedLocation = formatLocationName(location);
    // Use "near me" pattern: "{location} Petrol Prices Near Me | Cheap Fuel"
    const baseTitle = ' Petrol Prices Near Me | Cheap Fuel';
    const baseLength = baseTitle.length; // 35 chars
    
    let locationTitle = formattedLocation;
    const maxLocationLength = 60 - baseLength; // 25 chars max for location
    
    // If location is too long, use shorter format
    if (locationTitle.length > maxLocationLength) {
      // Use shorter format: "{location} Petrol Near Me | Cheap Fuel"
      const shortBase = ' Petrol Near Me | Cheap Fuel';
      const shortBaseLength = shortBase.length; // 30 chars
      const shortMaxLocation = 60 - shortBaseLength; // 30 chars max
      
      if (locationTitle.length > shortMaxLocation) {
        locationTitle = locationTitle.substring(0, shortMaxLocation - 3) + '...';
      }
      return `${locationTitle}${shortBase}`;
    }
    
    return `${locationTitle}${baseTitle}`;
  }
  // Homepage title with "near me" keywords: 58 characters (optimal range: 50-60)
  return 'Live Petrol Prices Near Me Today | Cheap Fuel Melbourne';
}

/**
 * Generate meta description for location-based pages
 * Prioritizes "near me" keywords in description
 */
export function generateLocationDescription(
  location?: string,
  _stationCount?: number,
  _averagePrice?: number
): string {
  if (location) {
    const formattedLocation = formatLocationName(location);
    return `Live petrol prices near me updated daily for ${formattedLocation}, Melbourne. Compare cheap fuel near me including E10, Unleaded 91, Premium and Diesel.`;
  }
  // Homepage meta description with "near me" keywords
  return 'Live petrol prices near me updated daily. Compare cheap fuel in Melbourne including E10, Unleaded 91, Premium and Diesel. Find cheap petrol near me today.';
}

/**
 * Generate keyword-rich H1 heading
 * Prioritizes "near me" patterns: "Live Petrol Prices Near Me (Updated Today)"
 */
export function generateH1Heading(location?: string): string {
  if (location) {
    const formattedLocation = formatLocationName(location);
    return `Live Petrol Prices Near Me in ${formattedLocation} (Updated Today)`;
  }
  return 'Live Petrol Prices Near Me (Updated Today)';
}

/**
 * Generate keyword-rich H2 heading variations
 * Prioritizes "near me" patterns in all headings
 */
export function generateH2Heading(
  type: 'prices' | 'stations' | 'comparison' | 'nearby',
  location?: string
): string {
  const formattedLocation = location ? formatLocationName(location) : '';

  switch (type) {
    case 'prices':
      return location
        ? `Cheap Petrol Near Me in ${formattedLocation} Today`
        : 'Cheap Petrol Near Me Today';
    case 'stations':
      return location
        ? `Petrol Stations Near Me in ${formattedLocation}`
        : 'Petrol Stations Near Me';
    case 'comparison':
      return location
        ? `Compare Petrol Prices Near Me in ${formattedLocation}`
        : 'Compare Petrol Prices Near Me';
    case 'nearby':
      return location
        ? `Petrol Near Me in ${formattedLocation}`
        : 'Petrol Near Me';
    default:
      return 'Petrol Prices Near Me';
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
