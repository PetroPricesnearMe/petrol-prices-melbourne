/**
 * SEO Metadata Generator for Suburb + Fuel Type Pages
 * Generates rich metadata for dynamic suburb fuel type pages
 */

import type { Metadata } from 'next';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';

export function generateSuburbFuelTypeMetadata(
  suburb: string,
  fuelType: string,
  fuelTypeDisplay: string
): Metadata {
  const title = `Cheapest ${fuelTypeDisplay} Prices in ${suburb} – Updated Today`;
  const description = `Find the best ${fuelTypeDisplay.toLowerCase()} prices in ${suburb}. Compare real-time fuel prices at petrol stations near you. Updated hourly with accurate ${fuelTypeDisplay.toLowerCase()} prices in ${suburb}, Victoria.`;

  const keywords = [
    `${fuelType} prices ${suburb}`,
    `cheapest ${fuelType} ${suburb}`,
    `${suburb} fuel prices`,
    `${suburb} petrol prices`,
    `${fuelType} near me ${suburb}`,
    `${suburb} ${fuelType} today`,
    `best ${fuelType} price ${suburb}`,
    `compare ${fuelType} prices ${suburb}`,
    `${fuelType} ${suburb} Victoria`,
  ];

  const suburbSlug = suburb.toLowerCase().replace(/\s+/g, '-');
  const canonicalUrl = `${BASE_URL}/melbourne/${suburbSlug}/${fuelType}`;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Petrol Price Near Me',
      type: 'website',
      locale: 'en_AU',
      images: [
        {
          url: `${BASE_URL}/images/og-fuel-prices.jpg`,
          width: 1200,
          height: 630,
          alt: `${fuelTypeDisplay} prices in ${suburb}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/images/og-fuel-prices.jpg`],
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
    other: {
      'geo.region': 'AU-VIC',
      'geo.placename': suburb,
      'application-name': 'Petrol Price Near Me',
    },
  };
}

export function generateBrandSuburbMetadata(
  brand: string,
  suburb: string
): Metadata {
  const title = `${brand} Petrol Stations in ${suburb} – Fuel Prices & Locations`;
  const description = `Find ${brand} petrol stations in ${suburb}. Compare fuel prices, check opening hours, and get directions to the nearest ${brand} servo in ${suburb}, Victoria.`;

  const keywords = [
    `${brand} ${suburb}`,
    `${brand} petrol station ${suburb}`,
    `${brand} fuel prices ${suburb}`,
    `${brand} servo ${suburb}`,
    `${brand} ${suburb} Victoria`,
    `nearest ${brand} ${suburb}`,
  ];

  const brandSlug = brand.toLowerCase().replace(/\s+/g, '-');
  const suburbSlug = suburb.toLowerCase().replace(/\s+/g, '-');
  const canonicalUrl = `${BASE_URL}/servo/${brandSlug}-${suburbSlug}`;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Petrol Price Near Me',
      type: 'website',
      locale: 'en_AU',
      images: [
        {
          url: `${BASE_URL}/images/brands/${brandSlug}.jpg`,
          width: 1200,
          height: 630,
          alt: `${brand} in ${suburb}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/images/brands/${brandSlug}.jpg`],
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
    other: {
      'geo.region': 'AU-VIC',
      'geo.placename': suburb,
      'application-name': 'Petrol Price Near Me',
    },
  };
}

export function generateSuburbTodayMetadata(suburb: string): Metadata {
  const today = new Date().toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const title = `Fuel Prices in ${suburb} Today – ${today} | Best Petrol Prices`;
  const description = `Today's cheapest fuel prices in ${suburb}. Compare unleaded, diesel, and premium prices at all petrol stations in ${suburb}. Updated hourly for ${today}.`;

  const keywords = [
    `fuel prices ${suburb} today`,
    `${suburb} petrol prices today`,
    `cheapest fuel ${suburb}`,
    `${suburb} fuel prices ${today}`,
    `petrol prices near me ${suburb}`,
    `${suburb} fuel today`,
  ];

  const suburbSlug = suburb.toLowerCase().replace(/\s+/g, '-');
  const canonicalUrl = `${BASE_URL}/suburb/fuel-prices-${suburbSlug}-today`;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Petrol Price Near Me',
      type: 'website',
      locale: 'en_AU',
      images: [
        {
          url: `${BASE_URL}/images/og-today-prices.jpg`,
          width: 1200,
          height: 630,
          alt: `Today's fuel prices in ${suburb}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/images/og-today-prices.jpg`],
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
    other: {
      'geo.region': 'AU-VIC',
      'geo.placename': suburb,
      date: new Date().toISOString(),
      'application-name': 'Petrol Price Near Me',
    },
  };
}
