/**
 * Station SEO Utilities
 * 
 * Advanced SEO optimization for individual station pages including:
 * - SEO-friendly slug generation
 * - Dynamic metadata templates
 * - Enhanced descriptions
 * 
 * @module lib/seo/station-seo
 */

import type { Metadata } from 'next';
import type { Station } from '@/types/station';
import { generateBaseMetadata } from './metadata';
import { getBaseUrl } from './canonical';

/**
 * Generate SEO-friendly slug for station URL
 * Format: brand-suburb-id
 * Example: bp-thomastown-456
 */
export function generateStationSlug(station: Station): string {
  const brand = station.brand?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'station';
  const suburb = station.suburb?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'melbourne';
  const id = station.id?.toString() || '';
  
  return `${brand}-${suburb}-${id}`.replace(/--+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Parse station slug to extract ID
 * Supports both formats: "456" and "bp-thomastown-456"
 */
export function parseStationSlug(slug: string): string {
  // If it's just a number, return it
  if (/^\d+$/.test(slug)) {
    return slug;
  }
  
  // Extract ID from slug (last segment after final dash)
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  
  // Check if last part is a number
  if (/^\d+$/.test(lastPart)) {
    return lastPart;
  }
  
  // If no ID found, return the slug as-is
  return slug;
}

/**
 * Generate SEO-optimized metadata for station detail page
 * Uses the enhanced templates specified in the requirements
 */
export function generateStationSEOMetadata(station: Station): Metadata {
  const brand = station.brand || 'Petrol Station';
  const suburb = station.suburb || 'Melbourne';
  const state = station.region?.includes('VIC') ? 'VIC' : 'Victoria';
  
  // SEO Title Template: {brand} {suburb} – Today's Fuel Prices | Unleaded 91, Diesel, E10 | PetrolPricesNearMe
  const title = `${brand} ${suburb} – Today's Fuel Prices | Unleaded 91, Diesel, E10 | PetrolPricesNearMe`;
  
  // Enhanced Meta Description Template
  const description = `${brand} service station in ${suburb}, ${state}. Check today's real-time fuel prices for U91, U95, U98, Diesel, and LPG. Open hours, address, map location, available services, and nearby stations. Updated daily.`;
  
  // Generate SEO-friendly slug for canonical URL
  const slug = generateStationSlug(station);
  const path = `stations/${slug}`;
  
  // Comprehensive keywords
  const keywords = [
    `${brand} ${suburb}`,
    `${brand} ${suburb} fuel prices`,
    `${suburb} petrol station`,
    `${brand} petrol station`,
    `fuel prices ${suburb}`,
    `petrol prices ${suburb}`,
    `${brand} opening hours`,
    `cheap fuel ${suburb}`,
    `unleaded 91 ${suburb}`,
    `diesel prices ${suburb}`,
    `E10 fuel ${suburb}`,
    `U95 prices ${suburb}`,
    `U98 premium ${suburb}`,
    `LPG prices ${suburb}`,
    `${suburb} service station`,
    `petrol near me ${suburb}`,
    `fuel station ${suburb} ${state}`,
    station.address || '',
  ].filter(Boolean);
  
  // Generate image URL
  const baseUrl = getBaseUrl();
  const imageUrl = station.image
    ? `${baseUrl}${station.image}`
    : `${baseUrl}/api/og/station/${station.id}`;
  
  return generateBaseMetadata({
    title,
    description,
    path,
    image: imageUrl,
    keywords,
  });
}

/**
 * Generate station page title (for use in page components)
 */
export function generateStationPageTitle(station: Station): string {
  const brand = station.brand || 'Petrol Station';
  const suburb = station.suburb || 'Melbourne';
  return `${brand} ${suburb} – Today's Fuel Prices | Unleaded 91, Diesel, E10 | PetrolPricesNearMe`;
}

/**
 * Generate station meta description (for use in page components)
 */
export function generateStationMetaDescription(station: Station): string {
  const brand = station.brand || 'Service station';
  const suburb = station.suburb || 'Melbourne';
  const state = station.region?.includes('VIC') ? 'VIC' : 'Victoria';
  
  return `${brand} service station in ${suburb}, ${state}. Check today's real-time fuel prices for U91, U95, U98, Diesel, and LPG. Open hours, address, map location, available services, and nearby stations. Updated daily.`;
}

/**
 * Generate station structured data for rich snippets
 */
export function generateStationStructuredData(station: Station) {
  const baseUrl = getBaseUrl();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'GasStation',
    '@id': `${baseUrl}/stations/${generateStationSlug(station)}`,
    name: station.name,
    brand: {
      '@type': 'Brand',
      name: station.brand || 'Independent',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: station.address || '',
      addressLocality: station.suburb || '',
      addressRegion: station.region || 'VIC',
      postalCode: station.postcode || '',
      addressCountry: 'AU',
    },
    geo: station.latitude && station.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: station.latitude,
      longitude: station.longitude,
    } : undefined,
    telephone: station.phoneNumber || undefined,
    url: station.website || undefined,
    image: station.image ? `${baseUrl}${station.image}` : undefined,
    priceRange: '$$',
    aggregateRating: station.rating ? {
      '@type': 'AggregateRating',
      ratingValue: station.rating,
      reviewCount: station.reviewCount || 1,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    openingHoursSpecification: station.amenities?.isOpen24Hours ? {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    } : undefined,
  };
}

/**
 * Get station URL with SEO-friendly slug
 */
export function getStationUrl(station: Station): string {
  return `/stations/${generateStationSlug(station)}`;
}

/**
 * Generate breadcrumb structured data for station page
 */
export function generateStationBreadcrumbs(station: Station) {
  const baseUrl = getBaseUrl();
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Directory',
      item: `${baseUrl}/directory`,
    },
  ];
  
  if (station.suburb) {
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: station.suburb,
      item: `${baseUrl}/directory/${station.suburb.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  
  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: station.name,
    item: `${baseUrl}${getStationUrl(station)}`,
  });
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

