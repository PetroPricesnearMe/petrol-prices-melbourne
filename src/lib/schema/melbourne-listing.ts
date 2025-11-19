/**
 * Schema.org JSON-LD Generator for Melbourne Listing Page
 * Generates LocalBusiness + GasStation + Place combined schema
 */

import type { Station } from '@/types/station';

interface SchemaItemList {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    item: {
      '@type': string | string[];
      '@id': string;
      name: string;
      address: {
        '@type': string;
        streetAddress: string;
        addressLocality: string;
        addressRegion: string;
        postalCode: string;
        addressCountry: string;
      };
      geo?: {
        '@type': string;
        latitude: number;
        longitude: number;
      };
      priceRange?: string;
      openingHours?: string[];
      aggregateRating?: {
        '@type': string;
        ratingValue: number;
        reviewCount: number;
      };
    };
  }>;
}

type SchemaItem = SchemaItemList['itemListElement'][number]['item'];

export function generateMelbourneSchema(stations: Station[]): SchemaItemList {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Melbourne Petrol Stations - Fuel Prices',
    description: 'List of petrol stations in Melbourne, Victoria with real-time fuel prices, locations, and services',
    itemListElement: stations.slice(0, 50).map((station, index) => {
      const prices = [
        station.fuelPrices?.unleaded ?? null,
        station.fuelPrices?.diesel ?? null,
        station.fuelPrices?.premium95 ?? null,
        station.fuelPrices?.premium98 ?? null,
      ].filter((p): p is number => p !== null);

      const minPrice = prices.length > 0 ? Math.min(...prices) : null;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

      const priceRange = minPrice && maxPrice
        ? `$${(minPrice / 100).toFixed(2)}-$${(maxPrice / 100).toFixed(2)}`
        : undefined;

      const item: SchemaItem = {
        '@type': ['GasStation', 'LocalBusiness', 'Place'],
        '@id': `${baseUrl}/stations/${station.id}`,
        name: station.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: station.address,
          addressLocality: station.suburb,
          addressRegion: 'VIC',
          postalCode: station.postcode,
          addressCountry: 'AU',
        },
      };

      if (station.latitude && station.longitude) {
        item.geo = {
          '@type': 'GeoCoordinates',
          latitude: station.latitude,
          longitude: station.longitude,
        };
      }

      if (priceRange) {
        item.priceRange = priceRange;
      }

      // Add opening hours if available (would need to be added to Station type)
      // if (station.openingHours) {
      //   item.openingHours = formatOpeningHours(station.openingHours);
      // }

      // Add rating if available
      // if (station.rating && station.reviewCount) {
      //   item.aggregateRating = {
      //     '@type': 'AggregateRating',
      //     ratingValue: station.rating,
      //     reviewCount: station.reviewCount,
      //   };
      // }

      return {
        '@type': 'ListItem',
        position: index + 1,
        item,
      };
    }),
  };
}


