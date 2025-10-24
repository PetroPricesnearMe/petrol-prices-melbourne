/**
 * Structured Data Schema Markup Utilities
 *
 * Provides utilities for generating JSON-LD structured data markup
 * for LocalBusiness, Place, and Product schemas
 *
 * @module lib/schema
 */

import type { Station } from '@/types/station';

// ============================================================================
// Schema Types
// ============================================================================

export interface LocalBusinessSchema {
  '@context': 'https://schema.org';
  '@type': 'LocalBusiness';
  name: string;
  description?: string;
  url?: string;
  telephone?: string;
  email?: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
  paymentAccepted?: string[];
  currenciesAccepted?: string;
  areaServed?: {
    '@type': 'City';
    name: string;
  };
  hasOfferCatalog?: {
    '@type': 'OfferCatalog';
    name: string;
    itemListElement: Array<{
      '@type': 'Offer';
      itemOffered: {
        '@type': 'Product';
        name: string;
        description?: string;
        category?: string;
      };
      price?: string;
      priceCurrency?: string;
      availability?: string;
    }>;
  };
}

export interface PlaceSchema {
  '@context': 'https://schema.org';
  '@type': 'Place';
  name: string;
  description?: string;
  url?: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  openingHours?: string[];
  amenityFeature?: Array<{
    '@type': 'LocationFeatureSpecification';
    name: string;
    value: boolean;
  }>;
}

export interface ProductSchema {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description?: string;
  category?: string;
  brand?: {
    '@type': 'Brand';
    name: string;
  };
  offers?: {
    '@type': 'Offer';
    price?: string;
    priceCurrency?: string;
    availability?: string;
    seller?: {
      '@type': 'LocalBusiness';
      name: string;
    };
    validFrom?: string;
    validThrough?: string;
  };
  additionalProperty?: Array<{
    '@type': 'PropertyValue';
    name: string;
    value: string | number;
  }>;
}

export interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export interface BreadcrumbListSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate LocalBusiness schema for a petrol station
 */
export function generateLocalBusinessSchema(station: Station, baseUrl: string): LocalBusinessSchema {
  const schema: LocalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: station.name,
    description: `${station.name} - ${station.brand || 'Petrol Station'} in ${station.suburb || 'Melbourne'}, Victoria`,
    url: `${baseUrl}/stations/${station.id}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: station.address,
      addressLocality: station.suburb,
      addressRegion: 'Victoria',
      postalCode: station.postcode,
      addressCountry: 'AU',
    },
    areaServed: {
      '@type': 'City',
      name: station.suburb || 'Melbourne',
    },
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card'],
    currenciesAccepted: 'AUD',
  };

  // Add geo coordinates if available
  if (station.latitude && station.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: station.latitude,
      longitude: station.longitude,
    };
  }

  // Add phone number if available
  if (station.phoneNumber) {
    schema.telephone = station.phoneNumber;
  }

  // Add opening hours if available
  if (station.operatingHours) {
    schema.openingHours = Object.entries(station.operatingHours)
      .filter(([_, hours]) => hours && hours !== 'Closed')
      .map(([day, hours]) => `${day.charAt(0).toUpperCase() + day.slice(1)} ${hours}`);
  }

  // Add fuel offers if available
  if (station.fuelPrices && Object.keys(station.fuelPrices).length > 0) {
    const fuelOffers = Object.entries(station.fuelPrices)
      .filter(([_, price]) => price !== null && price !== undefined)
      .map(([fuelType, price]) => ({
        '@type': 'Offer' as const,
        itemOffered: {
          '@type': 'Product' as const,
          name: getFuelDisplayName(fuelType),
          description: `${getFuelDisplayName(fuelType)} fuel`,
          category: 'Automotive Fuel',
        },
        price: `${price}`,
        priceCurrency: 'AUD',
        availability: 'https://schema.org/InStock',
      }));

    if (fuelOffers.length > 0) {
      schema.hasOfferCatalog = {
        '@type': 'OfferCatalog',
        name: 'Fuel Products',
        itemListElement: fuelOffers,
      };
    }
  }

  return schema;
}

/**
 * Generate Place schema for a petrol station
 */
export function generatePlaceSchema(station: Station, baseUrl: string): PlaceSchema {
  const schema: PlaceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: station.name,
    description: `${station.name} petrol station in ${station.suburb || 'Melbourne'}, Victoria`,
    url: `${baseUrl}/stations/${station.id}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: station.address,
      addressLocality: station.suburb,
      addressRegion: 'Victoria',
      postalCode: station.postcode,
      addressCountry: 'AU',
    },
  };

  // Add geo coordinates if available
  if (station.latitude && station.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: station.latitude,
      longitude: station.longitude,
    };
  }

  // Add phone number if available
  if (station.phoneNumber) {
    schema.telephone = station.phoneNumber;
  }

  // Add opening hours if available
  if (station.operatingHours) {
    schema.openingHours = Object.entries(station.operatingHours)
      .filter(([_, hours]) => hours && hours !== 'Closed')
      .map(([day, hours]) => `${day.charAt(0).toUpperCase() + day.slice(1)} ${hours}`);
  }

  // Add amenities if available
  if (station.amenities) {
    schema.amenityFeature = Object.entries(station.amenities)
      .filter(([_, available]) => available)
      .map(([amenity, _]) => ({
        '@type': 'LocationFeatureSpecification',
        name: getAmenityDisplayName(amenity),
        value: true,
      }));
  }

  return schema;
}

/**
 * Generate Product schema for fuel products
 */
export function generateFuelProductSchema(
  fuelType: string,
  price: number,
  station: Station,
  baseUrl: string
): ProductSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: getFuelDisplayName(fuelType),
    description: `${getFuelDisplayName(fuelType)} fuel available at ${station.name}`,
    category: 'Automotive Fuel',
    brand: station.brand ? {
      '@type': 'Brand',
      name: station.brand,
    } : undefined,
    offers: {
      '@type': 'Offer',
      price: `${price}`,
      priceCurrency: 'AUD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'LocalBusiness',
        name: station.name,
      },
      validFrom: new Date().toISOString(),
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Fuel Type',
        value: fuelType,
      },
      {
        '@type': 'PropertyValue',
        name: 'Price Per Liter',
        value: price,
      },
      {
        '@type': 'PropertyValue',
        name: 'Location',
        value: `${station.suburb}, Victoria`,
      },
    ],
  };
}

/**
 * Generate WebSite schema for the main site
 */
export function generateWebSiteSchema(baseUrl: string): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Petrol Price Near Me',
    url: baseUrl,
    description: 'Find the cheapest petrol stations near you in Melbourne with real-time fuel prices',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/directory?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ label: string; href: string }>, baseUrl: string): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `${baseUrl}${crumb.href}`,
    })),
  };
}

/**
 * Generate LocalBusiness schema for directory pages
 */
export function generateDirectoryLocalBusinessSchema(
  suburb: string,
  stationCount: number,
  baseUrl: string
): LocalBusinessSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${suburb} Petrol Stations`,
    description: `Directory of ${stationCount} petrol stations in ${suburb}, Victoria with real-time fuel prices`,
    url: `${baseUrl}/directory/${suburb.toLowerCase().replace(/\s+/g, '-')}`,
    areaServed: {
      '@type': 'City',
      name: suburb,
    },
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card'],
    currenciesAccepted: 'AUD',
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get display name for fuel type
 */
function getFuelDisplayName(fuelType: string): string {
  const fuelTypeMap: Record<string, string> = {
    unleaded: 'Unleaded 91',
    premium95: 'Premium Unleaded 95',
    premium98: 'Premium Unleaded 98',
    diesel: 'Diesel',
    lpg: 'LPG',
    e10: 'E10',
    e85: 'E85',
  };

  return fuelTypeMap[fuelType] || fuelType.charAt(0).toUpperCase() + fuelType.slice(1);
}

/**
 * Get display name for amenity
 */
function getAmenityDisplayName(amenity: string): string {
  const amenityMap: Record<string, string> = {
    carWash: 'Car Wash',
    cafe: 'Café',
    atm: 'ATM',
    airPump: 'Air Pump',
    toilets: 'Restrooms',
    disabled: 'Disabled Access',
    open24Hours: '24 Hour Service',
    hasShop: 'Convenience Store',
    hasRestroom: 'Restrooms',
    hasATM: 'ATM',
    hasAirPump: 'Air Pump',
    hasElectricCharging: 'EV Charging',
    hasParking: 'Parking',
    isOpen24Hours: '24 Hour Service',
  };

  return amenityMap[amenity] || amenity.charAt(0).toUpperCase() + amenity.slice(1);
}

/**
 * Generate all schemas for a station page
 */
export function generateStationPageSchemas(station: Station, baseUrl: string) {
  const schemas = [
    generateLocalBusinessSchema(station, baseUrl),
    generatePlaceSchema(station, baseUrl),
  ];

  // Add fuel product schemas for each available fuel type
  if (station.fuelPrices) {
    Object.entries(station.fuelPrices).forEach(([fuelType, price]) => {
      if (price !== null && price !== undefined) {
        schemas.push(generateFuelProductSchema(fuelType, price, station, baseUrl));
      }
    });
  }

  return schemas;
}

/**
 * Generate all schemas for a directory page
 */
export function generateDirectoryPageSchemas(
  suburb: string,
  stationCount: number,
  baseUrl: string
) {
  return [
    generateWebSiteSchema(baseUrl),
    generateDirectoryLocalBusinessSchema(suburb, stationCount, baseUrl),
  ];
}
