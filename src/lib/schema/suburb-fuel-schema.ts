/**
 * JSON-LD Schema Generator for Suburb + Fuel Type Pages
 * Generates rich structured data for search engines
 */

import type { Station } from '@/types/station';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';

export function generateSuburbFuelTypeSchema(
  suburb: string,
  fuelType: string,
  stations: Station[]
) {
  const fuelTypeDisplay =
    fuelType === 'unleaded'
      ? 'Unleaded 91'
      : fuelType === 'diesel'
        ? 'Diesel'
        : fuelType === 'premium'
          ? 'Premium 95/98'
          : fuelType === 'e10'
            ? 'E10 Ethanol'
            : fuelType === 'e85'
              ? 'E85 Flex Fuel'
              : fuelType === 'lpg'
                ? 'LPG'
                : fuelType.toUpperCase();

  // Calculate mock prices - replace with real data
  const prices = stations.map(() => Math.floor(Math.random() * 40) + 150);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(
    prices.reduce((a, b) => a + b, 0) / prices.length
  );

  return {
    '@context': 'https://schema.org',
    '@graph': [
      // WebPage schema
      {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/melbourne/${suburb.toLowerCase().replace(/\s+/g, '-')}/${fuelType}`,
        url: `${BASE_URL}/melbourne/${suburb.toLowerCase().replace(/\s+/g, '-')}/${fuelType}`,
        name: `Cheapest ${fuelTypeDisplay} Prices in ${suburb} – Updated Today`,
        description: `Compare ${fuelTypeDisplay.toLowerCase()} prices at ${stations.length} petrol stations in ${suburb}`,
        inLanguage: 'en-AU',
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          name: 'Petrol Price Near Me',
          url: BASE_URL,
        },
      },
      // BreadcrumbList schema
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': BASE_URL,
              name: 'Home',
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@id': `${BASE_URL}/melbourne`,
              name: 'Melbourne',
            },
          },
          {
            '@type': 'ListItem',
            position: 3,
            item: {
              '@id': `${BASE_URL}/melbourne/${suburb.toLowerCase().replace(/\s+/g, '-')}`,
              name: suburb,
            },
          },
          {
            '@type': 'ListItem',
            position: 4,
            item: {
              '@id': `${BASE_URL}/melbourne/${suburb.toLowerCase().replace(/\s+/g, '-')}/${fuelType}`,
              name: `${fuelTypeDisplay} Prices`,
            },
          },
        ],
      },
      // ItemList schema for price comparison
      {
        '@type': 'ItemList',
        name: `${fuelTypeDisplay} Prices in ${suburb}`,
        description: `List of ${fuelTypeDisplay.toLowerCase()} prices at petrol stations in ${suburb}`,
        numberOfItems: stations.length,
        itemListElement: stations.slice(0, 10).map((station, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'GasStation',
            '@id': `${BASE_URL}/stations/${station.id}`,
            name: station.name,
            address: {
              '@type': 'PostalAddress',
              streetAddress: station.address,
              addressLocality: suburb,
              addressRegion: 'VIC',
              postalCode: station.postalCode || '',
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
            url: `${BASE_URL}/stations/${station.id}`,
          },
        })),
      },
      // AggregateOffer schema for price range
      {
        '@type': 'AggregateOffer',
        name: `${fuelTypeDisplay} in ${suburb}`,
        priceCurrency: 'AUD',
        lowPrice: (minPrice / 100).toFixed(2), // Convert cents to dollars
        highPrice: (maxPrice / 100).toFixed(2),
        offerCount: stations.length,
        offers: stations.slice(0, 5).map((station, index) => ({
          '@type': 'Offer',
          name: `${fuelTypeDisplay} at ${station.name}`,
          price: ((prices[index] || 0) / 100).toFixed(2),
          priceCurrency: 'AUD',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'GasStation',
            name: station.name,
          },
        })),
      },
      // FAQPage schema
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `What is the cheapest ${fuelTypeDisplay.toLowerCase()} price in ${suburb}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The cheapest ${fuelTypeDisplay.toLowerCase()} price in ${suburb} is currently ${minPrice}¢ per litre. Prices are updated hourly from verified sources.`,
            },
          },
          {
            '@type': 'Question',
            name: `How many petrol stations sell ${fuelTypeDisplay.toLowerCase()} in ${suburb}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `There are ${stations.length} petrol stations in ${suburb} that sell ${fuelTypeDisplay.toLowerCase()}. We track prices at all major brands including BP, Caltex, 7-Eleven, and independent stations.`,
            },
          },
          {
            '@type': 'Question',
            name: `How often are ${fuelTypeDisplay.toLowerCase()} prices updated for ${suburb}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${fuelTypeDisplay} prices in ${suburb} are updated every hour from multiple sources including station reports and user submissions. Our data is among the most current available.`,
            },
          },
          {
            '@type': 'Question',
            name: `What is the average ${fuelTypeDisplay.toLowerCase()} price in ${suburb}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The average ${fuelTypeDisplay.toLowerCase()} price in ${suburb} is currently ${avgPrice}¢ per litre, with prices ranging from ${minPrice}¢ to ${maxPrice}¢.`,
            },
          },
        ],
      },
    ],
  };
}

export function generateBrandSuburbSchema(
  brand: string,
  suburb: string,
  stations: Station[]
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      // WebPage schema
      {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/servo/${brand.toLowerCase().replace(/\s+/g, '-')}-${suburb.toLowerCase().replace(/\s+/g, '-')}`,
        url: `${BASE_URL}/servo/${brand.toLowerCase().replace(/\s+/g, '-')}-${suburb.toLowerCase().replace(/\s+/g, '-')}`,
        name: `${brand} Petrol Stations in ${suburb} – Fuel Prices & Locations`,
        description: `Find ${brand} petrol stations in ${suburb}. Compare fuel prices and get directions.`,
        inLanguage: 'en-AU',
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          name: 'Petrol Price Near Me',
          url: BASE_URL,
        },
      },
      // BreadcrumbList schema
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': BASE_URL,
              name: 'Home',
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@id': `${BASE_URL}/servo`,
              name: 'Servos',
            },
          },
          {
            '@type': 'ListItem',
            position: 3,
            item: {
              '@id': `${BASE_URL}/servo/${brand.toLowerCase().replace(/\s+/g, '-')}-${suburb.toLowerCase().replace(/\s+/g, '-')}`,
              name: `${brand} ${suburb}`,
            },
          },
        ],
      },
      // ItemList schema
      {
        '@type': 'ItemList',
        name: `${brand} Stations in ${suburb}`,
        numberOfItems: stations.length,
        itemListElement: stations.map((station, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'GasStation',
            '@id': `${BASE_URL}/stations/${station.id}`,
            name: station.name,
            brand: brand,
            address: {
              '@type': 'PostalAddress',
              streetAddress: station.address,
              addressLocality: suburb,
              addressRegion: 'VIC',
              postalCode: station.postalCode || '',
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
            telephone: station.phoneNumber,
            url: `${BASE_URL}/stations/${station.id}`,
          },
        })),
      },
    ],
  };
}

export function generateSuburbTodaySchema(suburb: string, stations: Station[]) {
  const today = new Date().toISOString().split('T')[0];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      // WebPage schema
      {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/suburb/fuel-prices-${suburb.toLowerCase().replace(/\s+/g, '-')}-today`,
        url: `${BASE_URL}/suburb/fuel-prices-${suburb.toLowerCase().replace(/\s+/g, '-')}-today`,
        name: `Fuel Prices in ${suburb} Today – Best Petrol Prices`,
        description: `Today's cheapest fuel prices in ${suburb}. Updated hourly.`,
        inLanguage: 'en-AU',
        datePublished: today,
        dateModified: new Date().toISOString(),
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          name: 'Petrol Price Near Me',
          url: BASE_URL,
        },
      },
      // BreadcrumbList schema
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': BASE_URL,
              name: 'Home',
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@id': `${BASE_URL}/suburb`,
              name: 'Suburbs',
            },
          },
          {
            '@type': 'ListItem',
            position: 3,
            item: {
              '@id': `${BASE_URL}/suburb/fuel-prices-${suburb.toLowerCase().replace(/\s+/g, '-')}-today`,
              name: `${suburb} Today`,
            },
          },
        ],
      },
      // ItemList schema
      {
        '@type': 'ItemList',
        name: `Today's Fuel Prices in ${suburb}`,
        description: `Current fuel prices at petrol stations in ${suburb} for ${today}`,
        numberOfItems: stations.length,
        itemListElement: stations.slice(0, 10).map((station, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'GasStation',
            '@id': `${BASE_URL}/stations/${station.id}`,
            name: station.name,
            address: {
              '@type': 'PostalAddress',
              streetAddress: station.address,
              addressLocality: suburb,
              addressRegion: 'VIC',
              postalCode: station.postalCode || '',
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
            url: `${BASE_URL}/stations/${station.id}`,
          },
        })),
      },
    ],
  };
}


