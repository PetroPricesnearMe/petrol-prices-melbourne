/**
 * Structured Data (JSON-LD) Schemas
 *
 * Schema.org markup for enhanced search engine visibility
 * @module lib/seo/structured-data
 */

import type { Station, FuelPrice } from '@/types/station';

import { SITE_CONFIG } from './metadata';

// ============================================================================
// Type Definitions
// ============================================================================

interface Organization {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
  contactPoint: {
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
    areaServed: string;
    availableLanguage: string[];
  };
}

interface WebSite {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

interface LocalBusiness {
  '@context': 'https://schema.org';
  '@type': 'GasStation' | 'LocalBusiness';
  '@id': string;
  name: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  priceRange?: string;
  openingHoursSpecification?: OpeningHours[];
  hasOfferCatalog?: {
    '@type': 'OfferCatalog';
    name: string;
    itemListElement: FuelOffer[];
  };
}

interface OpeningHours {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string | string[];
  opens?: string;
  closes?: string;
}

interface FuelOffer {
  '@type': 'Offer';
  itemOffered: {
    '@type': 'Product';
    name: string;
  };
  price: string;
  priceCurrency: string;
  availability: string;
  validFrom: string;
}

interface BreadcrumbList {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItem[];
}

interface BreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

interface FAQPage {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Question[];
}

interface Question {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
}

// ============================================================================
// Organization Schema
// ============================================================================

export function getOrganizationSchema(): Organization {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/images/logo.png`,
    sameAs: [
      'https://www.facebook.com/PetrolPriceNearMe',
      'https://twitter.com/PetrolPriceAU',
      'https://www.linkedin.com/company/petrol-price-near-me',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+61-1800-PETROL',
      contactType: 'Customer Service',
      areaServed: 'AU',
      availableLanguage: ['English'],
    },
  };
}

// ============================================================================
// Website Schema
// ============================================================================

export function getWebSiteSchema(): WebSite {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ============================================================================
// Local Business Schema (Gas Station)
// ============================================================================

export function getGasStationSchema(station: Station & { fuelPrices?: FuelPrice[] }): LocalBusiness {
  const schema: LocalBusiness = {
    '@context': 'https://schema.org',
    '@type': 'GasStation',
    '@id': `${SITE_CONFIG.url}/stations/${station.id}`,
    name: station.stationName || station.name,
  };

  // Add address if available
  if (station.address || station.city) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: station.address,
      addressLocality: station.city,
      addressRegion: station.region,
      postalCode: station.postalCode,
      addressCountry: 'AU',
    };
  }

  // Add geo coordinates
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

  // Add price range
  if (station.fuelPrices && station.fuelPrices.length > 0) {
    const prices = station.fuelPrices.map(fp => fp.pricePerLiter);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    schema.priceRange = `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;

    // Add fuel offers
    schema.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Fuel Prices',
      itemListElement: station.fuelPrices.map(fuelPrice => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: fuelPrice.fuelType,
        },
        price: fuelPrice.pricePerLiter.toFixed(2),
        priceCurrency: 'AUD',
        availability: 'https://schema.org/InStock',
        validFrom: typeof fuelPrice.lastUpdated === 'string'
          ? fuelPrice.lastUpdated
          : fuelPrice.lastUpdated.toISOString(),
      })),
    };
  }

  // Add operating hours if available
  if (station.amenities?.isOpen24Hours) {
    schema.openingHoursSpecification = [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ];
  }

  return schema;
}

// ============================================================================
// Breadcrumb Schema
// ============================================================================

export function getBreadcrumbSchema(items: Array<{ name: string; url?: string }>): BreadcrumbList {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${SITE_CONFIG.url}${item.url}` : undefined,
    })),
  };
}

// ============================================================================
// FAQ Schema
// ============================================================================

export function getFAQSchema(faqs: Array<{ question: string; answer: string }>): FAQPage {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ============================================================================
// ItemList Schema (for station listings)
// ============================================================================

export function getItemListSchema(stations: Station[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Petrol Stations',
    description: 'List of petrol stations with current fuel prices',
    numberOfItems: stations.length,
    itemListElement: stations.slice(0, 20).map((station, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'GasStation',
        '@id': `${SITE_CONFIG.url}/stations/${station.id}`,
        name: station.stationName || station.name,
        address: station.address
          ? {
              '@type': 'PostalAddress',
              streetAddress: station.address,
              addressLocality: station.city,
              addressCountry: 'AU',
            }
          : undefined,
      },
    })),
  };
}

// ============================================================================
// Article Schema (for blog posts)
// ============================================================================

export function getArticleSchema(article: {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  image?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || SITE_CONFIG.ogImage,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/images/logo.png`,
      },
    },
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    url: article.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert schema to JSON-LD script tag
 */
export function toJsonLd(schema: object): string {
  return JSON.stringify(schema, null, 2);
}

/**
 * Generate multiple schemas as an array
 */
export function combineSchemas(...schemas: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}
