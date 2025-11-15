/**
 * Advanced Schema.org JSON-LD Generator
 * Generates SEO-rich structured data for all page types
 * Follows Google's structured data guidelines
 */

import type { Station, FuelPrice } from '@/types/station';

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Organization schema - Site-wide
 */
export function generateOrganizationSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Petrol Price Near Me',
    alternateName: 'PPNM',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/images/logo.png`,
      width: 512,
      height: 512,
    },
    description:
      'Find the cheapest petrol prices near you in Melbourne. Compare real-time fuel prices from 250+ stations.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AU',
      addressRegion: 'VIC',
      addressLocality: 'Melbourne',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@petrolpricenearme.com.au',
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://www.facebook.com/petrolpricenearme',
      'https://twitter.com/ppnmelbourne',
      'https://www.instagram.com/petrolpricenearme',
    ],
  };
}

/**
 * Website schema - Homepage
 */
export function generateWebsiteSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Petrol Price Near Me',
    description:
      'Compare live petrol prices from 250+ stations across Melbourne',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/directory?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-AU',
  };
}

/**
 * BreadcrumbList schema - For navigation
 */
export function generateBreadcrumbSchema(
  baseUrl: string,
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.url}`,
    })),
  };
}

// ============================================================================
// STATION SCHEMAS
// ============================================================================

/**
 * GasStation schema - Individual station page
 */
export function generateStationSchema(
  baseUrl: string,
  station: Station
): object {
  const lowestPrice = getLowestFuelPrice(station.fuelPrices || []);

  return {
    '@context': 'https://schema.org',
    '@type': 'GasStation',
    '@id': `${baseUrl}/stations/${station.id}`,
    name: station.name,
    brand: station.brand,
    telephone: station.phone || undefined,
    url: `${baseUrl}/stations/${station.id}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: station.address,
      addressLocality: station.suburb || station.city,
      addressRegion: 'VIC',
      postalCode: station.postcode,
      addressCountry: 'AU',
    },
    geo:
      station.latitude && station.longitude
        ? {
            '@type': 'GeoCoordinates',
            latitude: station.latitude,
            longitude: station.longitude,
          }
        : undefined,
    image: station.image || `${baseUrl}/images/default-station.jpg`,
    priceRange: lowestPrice ? `$${lowestPrice.toFixed(2)}` : undefined,
    openingHours: station.operatingHours
      ? formatOpeningHours(station.operatingHours)
      : undefined,
    amenityFeature: station.amenities
      ? Object.keys(station.amenities)
          .filter((key) => station.amenities[key])
          .map((amenity) => ({
            '@type': 'LocationFeatureSpecification',
            name: amenity,
            value: true,
          }))
      : undefined,
    aggregateRating: station.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: station.rating,
          reviewCount: station.reviewCount || 0,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    hasMap: `https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`,
  };
}

/**
 * LocalBusiness schema - Alternative for better local SEO
 */
export function generateLocalBusinessSchema(
  baseUrl: string,
  station: Station
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/stations/${station.id}#business`,
    name: station.name,
    description: `${station.brand} petrol station in ${station.suburb || station.city}. Find the latest fuel prices and station information.`,
    url: `${baseUrl}/stations/${station.id}`,
    telephone: station.phone,
    image:
      station.image ||
      `${baseUrl}/images/stations/${station.brand?.toLowerCase()}.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: station.address,
      addressLocality: station.suburb || station.city,
      addressRegion: 'Victoria',
      postalCode: station.postcode,
      addressCountry: 'Australia',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: station.latitude,
      longitude: station.longitude,
    },
    openingHoursSpecification: station.operatingHours
      ? generateOpeningHoursSpec(station.operatingHours)
      : undefined,
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card'],
    currenciesAccepted: 'AUD',
  };
}

/**
 * Offer schema - For fuel prices
 */
export function generateFuelPriceSchema(
  baseUrl: string,
  station: Station,
  fuelPrice: FuelPrice
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    '@id': `${baseUrl}/stations/${station.id}#offer-${fuelPrice.id}`,
    itemOffered: {
      '@type': 'Product',
      name: fuelPrice.fuelType,
      category: 'Automotive Fuel',
    },
    price: fuelPrice.price.toFixed(2),
    priceCurrency: 'AUD',
    priceValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    seller: {
      '@type': 'GasStation',
      name: station.name,
    },
    availability: 'https://schema.org/InStock',
    url: `${baseUrl}/stations/${station.id}`,
  };
}

/**
 * ItemList schema - Directory/listing pages
 */
export function generateDirectoryListSchema(
  baseUrl: string,
  stations: Station[],
  pageName: string = 'Melbourne Petrol Stations'
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageName,
    description: `Complete directory of ${stations.length} petrol stations in Melbourne`,
    numberOfItems: stations.length,
    itemListElement: stations.slice(0, 50).map((station, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'GasStation',
        '@id': `${baseUrl}/stations/${station.id}`,
        name: station.name,
        url: `${baseUrl}/stations/${station.id}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: station.suburb || station.city,
          addressRegion: 'VIC',
          addressCountry: 'AU',
        },
      },
    })),
  };
}

/**
 * FAQPage schema - For FAQ page
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Article schema - For blog posts
 */
export function generateArticleSchema(
  baseUrl: string,
  article: {
    title: string;
    description: string;
    author: string;
    publishDate: string;
    modifiedDate?: string;
    image?: string;
    slug: string;
  }
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${baseUrl}/blog/${article.slug}`,
    headline: article.title,
    description: article.description,
    image: article.image || `${baseUrl}/images/og-image.jpg`,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    datePublished: article.publishDate,
    dateModified: article.modifiedDate || article.publishDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${article.slug}`,
    },
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getLowestFuelPrice(prices: FuelPrice[]): number | null {
  if (!prices || prices.length === 0) return null;
  return Math.min(...prices.map((p) => p.price));
}

function formatOpeningHours(hours: any): string[] | undefined {
  if (!hours) return undefined;

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  return days.map((day) => {
    const dayHours = hours[day.toLowerCase()];
    if (!dayHours || dayHours.closed) return `${day} Closed`;
    return `${day} ${dayHours.open}-${dayHours.close}`;
  });
}

function generateOpeningHoursSpec(hours: any) {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return days
    .map((day) => {
      const dayHours = hours[day.toLowerCase()];
      if (!dayHours || dayHours.closed) return null;

      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: day,
        opens: dayHours.open,
        closes: dayHours.close,
      };
    })
    .filter(Boolean);
}

/**
 * Combine multiple schemas into graph
 */
export function combineSchemas(...schemas: object[]): object {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}

/**
 * Generate complete page schema
 */
export function generatePageSchema(
  baseUrl: string,
  page: {
    title: string;
    description: string;
    path: string;
    breadcrumbs?: Array<{ name: string; url: string }>;
  }
): object {
  const schemas = [
    generateOrganizationSchema(baseUrl),
    generateWebsiteSchema(baseUrl),
  ];

  if (page.breadcrumbs) {
    schemas.push(generateBreadcrumbSchema(baseUrl, page.breadcrumbs));
  }

  return combineSchemas(...schemas);
}
