/**
 * Dynamic Meta Tag Generator
 * Generates SEO-optimized meta tags for all page types
 * Supports Open Graph, Twitter Cards, and custom meta tags
 */

import type { Metadata } from 'next';

import type { Station } from '@/types/station';

const DEFAULT_SITE_NAME = 'Petrol Price Near Me';
const DEFAULT_IMAGE = '/images/og-image.jpg';

// ============================================================================
// PAGE META GENERATORS
// ============================================================================

/**
 * Homepage metadata
 */
export function generateHomeMetadata(baseUrl: string): Metadata {
  return {
    title: 'Find Cheapest Petrol Prices Near Me | Save Up to 20c/L | Melbourne Fuel Finder',
    description: 'Compare live petrol prices from 250+ stations in Melbourne. Save up to 20c/L with real-time fuel price updates. Find the cheapest unleaded, diesel & premium near you today! Free to use, no registration required.',
    keywords: [
      'petrol prices near me',
      'cheap fuel melbourne',
      'petrol station finder',
      'fuel price comparison',
      'live petrol prices',
      'melbourne fuel prices',
      'save money on fuel',
      'cheapest petrol melbourne',
      'real-time fuel prices',
      'petrol price tracker',
    ],
    openGraph: {
      type: 'website',
      locale: 'en_AU',
      url: baseUrl,
      siteName: DEFAULT_SITE_NAME,
      title: 'Find Cheapest Petrol Prices Near Me | Save Up to 20c/L',
      description: 'Compare live petrol prices from 250+ stations in Melbourne. Save money on every fill-up!',
      images: [
        {
          url: `${baseUrl}${DEFAULT_IMAGE}`,
          width: 1200,
          height: 630,
          alt: 'Petrol Price Comparison - Melbourne',
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Find Cheapest Petrol Prices Near Me | Save Up to 20c/L',
      description: 'Compare live petrol prices from 250+ stations in Melbourne.',
      images: [`${baseUrl}/images/twitter-card.jpg`],
      creator: '@ppnmelbourne',
      site: '@ppnmelbourne',
    },
    alternates: {
      canonical: baseUrl,
      types: {
        'application/rss+xml': `${baseUrl}/feed.xml`,
      },
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
    },
  };
}

/**
 * Directory page metadata
 */
export function generateDirectoryMetadata(
  baseUrl: string,
  options: {
    suburb?: string;
    brand?: string;
    totalStations?: number;
  } = {}
): Metadata {
  const { suburb, brand, totalStations = 250 } = options;
  
  let title = 'Petrol Station Directory';
  let description = `Browse ${totalStations} petrol stations in Melbourne`;
  let canonical = `${baseUrl}/directory`;

  if (suburb) {
    title = `Petrol Stations in ${suburb} | Compare Fuel Prices`;
    description = `Find the cheapest petrol in ${suburb}. Compare real-time fuel prices from all stations in ${suburb}, Melbourne.`;
    canonical = `${baseUrl}/directory/${suburb.toLowerCase()}`;
  } else if (brand) {
    title = `${brand} Petrol Stations Melbourne | Fuel Prices`;
    description = `Find all ${brand} petrol stations in Melbourne with live fuel prices. Compare ${brand} prices across locations.`;
    canonical = `${baseUrl}/directory?brand=${brand.toLowerCase()}`;
  }

  return {
    title,
    description,
    keywords: [
      'petrol station directory',
      'fuel stations melbourne',
      suburb ? `${suburb} petrol stations` : '',
      brand ? `${brand} fuel prices` : '',
      'petrol station list',
      'all petrol stations',
    ].filter(Boolean),
    openGraph: {
      type: 'website',
      locale: 'en_AU',
      url: canonical,
      siteName: DEFAULT_SITE_NAME,
      title,
      description,
      images: [
        {
          url: `${baseUrl}/images/og-directory.jpg`,
          width: 1200,
          height: 630,
          alt: suburb ? `Petrol Stations in ${suburb}` : 'Petrol Station Directory',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/images/twitter-directory.jpg`],
    },
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Individual station page metadata
 */
export function generateStationMetadata(
  baseUrl: string,
  station: Station
): Metadata {
  const lowestPrice = getLowestFuelPrice(station.fuelPrices || []);
  const priceText = lowestPrice ? `from ${lowestPrice.toFixed(1)}¢/L` : '';
  
  const title = `${station.name} - Fuel Prices ${priceText} | ${station.suburb || station.city}`;
  const description = `${station.name} in ${station.suburb || station.city}. ${
    lowestPrice ? `Unleaded ${priceText}. ` : ''
  }Find directions, opening hours, amenities, and live fuel prices. ${station.address}, ${station.suburb || station.city}, VIC ${station.postcode}.`;

  return {
    title,
    description,
    keywords: [
      `${station.name}`,
      `${station.brand} ${station.suburb || station.city}`,
      `petrol station ${station.suburb || station.city}`,
      `fuel prices ${station.suburb || station.city}`,
      `${station.address}`,
      'petrol near me',
    ],
    openGraph: {
      type: 'place',
      locale: 'en_AU',
      url: `${baseUrl}/stations/${station.id}`,
      siteName: DEFAULT_SITE_NAME,
      title,
      description,
      images: [
        {
          url: station.image || `${baseUrl}/images/stations/${station.brand?.toLowerCase()}-og.jpg`,
          width: 1200,
          height: 630,
          alt: `${station.name} - ${station.suburb || station.city}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [station.image || `${baseUrl}/images/default-station.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/stations/${station.id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      'geo.position': `${station.latitude};${station.longitude}`,
      'geo.placename': station.suburb || station.city,
      'geo.region': 'AU-VIC',
      'ICBM': `${station.latitude}, ${station.longitude}`,
    },
  };
}

/**
 * Suburb directory page metadata
 */
export function generateSuburbMetadata(
  baseUrl: string,
  suburb: string,
  stationCount: number = 0
): Metadata {
  const title = `${stationCount} Petrol Stations in ${suburb} | Live Fuel Prices`;
  const description = `Find the cheapest petrol in ${suburb}, Melbourne. Compare real-time fuel prices from ${stationCount} petrol stations. Save money on unleaded, diesel, and premium fuel.`;

  return {
    title,
    description,
    keywords: [
      `petrol stations ${suburb}`,
      `fuel prices ${suburb}`,
      `cheap petrol ${suburb}`,
      `${suburb} fuel finder`,
      `${suburb} melbourne petrol`,
    ],
    openGraph: {
      type: 'website',
      locale: 'en_AU',
      url: `${baseUrl}/directory/${suburb.toLowerCase()}`,
      siteName: DEFAULT_SITE_NAME,
      title,
      description,
      images: [
        {
          url: `${baseUrl}/images/og-suburb.jpg`,
          width: 1200,
          height: 630,
          alt: `Petrol Stations in ${suburb}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/directory/${suburb.toLowerCase()}`,
    },
  };
}

/**
 * Map page metadata
 */
export function generateMapMetadata(baseUrl: string): Metadata {
  return {
    title: 'Interactive Petrol Station Map | Find Fuel Near You',
    description: 'Explore 250+ petrol stations on an interactive map. Find the nearest and cheapest fuel with live prices, directions, and filters.',
    keywords: [
      'petrol station map',
      'fuel station map melbourne',
      'interactive fuel map',
      'nearest petrol station',
      'fuel near me map',
    ],
    openGraph: {
      type: 'website',
      locale: 'en_AU',
      url: `${baseUrl}/map`,
      siteName: DEFAULT_SITE_NAME,
      title: 'Interactive Petrol Station Map',
      description: 'Find the nearest petrol stations with live fuel prices on an interactive map.',
      images: [
        {
          url: `${baseUrl}/images/og-map.jpg`,
          width: 1200,
          height: 630,
          alt: 'Interactive Petrol Station Map',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Interactive Petrol Station Map',
      description: 'Find the nearest petrol stations with live fuel prices.',
    },
    alternates: {
      canonical: `${baseUrl}/map`,
    },
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getLowestFuelPrice(prices: FuelPrice[]): number | null {
  if (!prices || prices.length === 0) return null;
  const validPrices = prices.filter(p => p.price > 0).map(p => p.price);
  return validPrices.length > 0 ? Math.min(...validPrices) : null;
}

/**
 * Generate meta tags for any custom page
 */
export function generateCustomMetadata(
  baseUrl: string,
  options: {
    title: string;
    description: string;
    path: string;
    keywords?: string[];
    image?: string;
    noIndex?: boolean;
  }
): Metadata {
  return {
    title: `${options.title} | ${DEFAULT_SITE_NAME}`,
    description: options.description,
    keywords: options.keywords,
    openGraph: {
      type: 'website',
      locale: 'en_AU',
      url: `${baseUrl}${options.path}`,
      siteName: DEFAULT_SITE_NAME,
      title: options.title,
      description: options.description,
      images: [
        {
          url: options.image || `${baseUrl}${DEFAULT_IMAGE}`,
          width: 1200,
          height: 630,
          alt: options.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description: options.description,
      images: [options.image || `${baseUrl}${DEFAULT_IMAGE}`],
    },
    alternates: {
      canonical: `${baseUrl}${options.path}`,
    },
    robots: options.noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
    },
  };
}

