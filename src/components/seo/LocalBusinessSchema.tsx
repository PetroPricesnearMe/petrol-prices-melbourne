/**
 * LocalBusiness Structured Data Component
 * Generates schema.org markup for petrol stations
 * Optimized for Google Rich Results
 */


interface LocalBusinessSchemaProps {
  station: Record<string, unknown>; // Using simplified station type
  fuelPrices?: Record<string, unknown>;
}

export function LocalBusinessSchema({
  station,
  fuelPrices,
}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'GasStation',
    '@id': `https://petrolpricenearme.com.au/stations/${station.id}`,
    name: station.name,
    description: `${station.brand || ''} petrol station located at ${station.address}, ${station.suburb}. Find current fuel prices and station details.`,
    url: `https://petrolpricenearme.com.au/stations/${station.id}`,

    // Brand information
    ...(station.brand && {
      brand: {
        '@type': 'Brand',
        name: station.brand,
      },
    }),

    // Address
    address: {
      '@type': 'PostalAddress',
      streetAddress: station.address,
      addressLocality: station.suburb,
      addressRegion: station.region || 'Victoria',
      postalCode: station.postcode,
      addressCountry: 'AU',
    },

    // Geo coordinates
    ...(station.latitude &&
      station.longitude && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: station.latitude,
          longitude: station.longitude,
        },
      }),

    // Contact info
    ...(station.phoneNumber && {
      telephone: station.phoneNumber,
    }),

    // Opening hours
    ...(station.amenities?.open24Hours && {
      openingHours: 'Mo-Su 00:00-24:00',
    }),

    // Amenities
    amenityFeature: [
      ...(station.amenities?.carWash
        ? [
            {
              '@type': 'LocationFeatureSpecification',
              name: 'Car Wash',
              value: true,
            },
          ]
        : []),
      ...(station.amenities?.cafe
        ? [
            {
              '@type': 'LocationFeatureSpecification',
              name: 'Cafe',
              value: true,
            },
          ]
        : []),
      ...(station.amenities?.toilets
        ? [
            {
              '@type': 'LocationFeatureSpecification',
              name: 'Restrooms',
              value: true,
            },
          ]
        : []),
      ...(station.amenities?.atm
        ? [
            {
              '@type': 'LocationFeatureSpecification',
              name: 'ATM',
              value: true,
            },
          ]
        : []),
    ].filter(Boolean),

    // Price range (if available)
    ...(fuelPrices && {
      priceRange: '$$',
    }),

    // Accepted payment methods
    paymentAccepted: 'Cash, Credit Card, Debit Card',

    // Image
    ...(station.brandLogo && {
      image: `https://petrolpricenearme.com.au${station.brandLogo}`,
    }),

    // Aggregate rating (mock - replace with real data)
    ...(station.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: station.rating,
        reviewCount: station.reviewCount || 0,
        bestRating: '5',
        worstRating: '1',
      },
    }),

    // Additional properties
    currenciesAccepted: 'AUD',
    areaServed: {
      '@type': 'City',
      name: station.suburb,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

/**
 * Breadcrumb List Schema
 */
export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

/**
 * Offer Schema for Fuel Prices
 */
export function FuelPriceSchema({
  station,
  fuelPrices,
}: LocalBusinessSchemaProps) {
  if (!fuelPrices || Object.keys(fuelPrices).length === 0) return null;

  const offers = Object.entries(fuelPrices)
    .filter(([_, price]) => price !== null)
    .map(([type, price]: [string, unknown]) => {
      const priceValue = typeof price === 'number' ? price : Number(price);
      return {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: type.charAt(0).toUpperCase() + type.slice(1),
        category: 'Fuel',
      },
      price: priceValue,
      priceCurrency: 'AUD',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: priceValue / 100, // Convert cents to dollars
        priceCurrency: 'AUD',
        unitText: 'Liter',
      },
      seller: {
        '@type': 'Organization',
        name: station.name,
      },
      availability: 'https://schema.org/InStock',
      validFrom: station.lastUpdated || new Date().toISOString(),
    };
    });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Fuel at ${station.name}`,
    offers: offers,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
