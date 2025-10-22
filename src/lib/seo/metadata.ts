/**
 * SEO Metadata Configuration
 *
 * Centralized metadata management for Next.js App Router
 * @module lib/seo/metadata
 */

import type { Metadata } from 'next';

// ============================================================================
// Constants
// ============================================================================

export const SITE_CONFIG = {
  name: 'Petrol Price Near Me',
  title: 'Find Cheapest Fuel Prices in Australia',
  description: 'Compare real-time petrol prices from 250+ stations across Australia. Find the cheapest unleaded, diesel, premium, and LPG prices near you. Save money on fuel today!',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au',
  ogImage: '/images/og-image.jpg',
  twitterImage: '/images/twitter-image.jpg',
  keywords: [
    'petrol prices australia',
    'fuel prices near me',
    'cheapest petrol',
    'petrol station finder',
    'fuel price comparison',
    'unleaded prices',
    'diesel prices',
    'premium unleaded',
    'lpg prices',
    'melbourne petrol prices',
    'sydney fuel prices',
    'brisbane petrol stations',
    'real-time fuel prices',
    'save money on fuel',
  ],
  author: 'Petrol Price Near Me Team',
  locale: 'en_AU',
  type: 'website',
} as const;

// ============================================================================
// Base Metadata
// ============================================================================

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),

  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.title}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },

  description: SITE_CONFIG.description,

  keywords: SITE_CONFIG.keywords,

  authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.name,

  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  manifest: '/manifest.json',

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  },

  alternates: {
    canonical: '/',
    languages: {
      'en-AU': '/',
    },
  },

  category: 'business',
};

// ============================================================================
// Open Graph Metadata
// ============================================================================

export const openGraphMetadata: Metadata['openGraph'] = {
  type: 'website',
  locale: SITE_CONFIG.locale,
  url: SITE_CONFIG.url,
  siteName: SITE_CONFIG.name,
  title: `${SITE_CONFIG.name} | ${SITE_CONFIG.title}`,
  description: SITE_CONFIG.description,
  images: [
    {
      url: SITE_CONFIG.ogImage,
      width: 1200,
      height: 630,
      alt: SITE_CONFIG.name,
      type: 'image/jpeg',
    },
  ],
};

// ============================================================================
// Twitter Metadata
// ============================================================================

export const twitterMetadata: Metadata['twitter'] = {
  card: 'summary_large_image',
  site: '@PetrolPriceAU',
  creator: '@PetrolPriceAU',
  title: `${SITE_CONFIG.name} | ${SITE_CONFIG.title}`,
  description: SITE_CONFIG.description,
  images: {
    url: SITE_CONFIG.twitterImage,
    alt: SITE_CONFIG.name,
  },
};

// ============================================================================
// Page Metadata Generators
// ============================================================================

interface PageMetadataOptions {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  canonical?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  type?: 'website' | 'article';
}

/**
 * Generate metadata for a page
 */
export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description = SITE_CONFIG.description,
    keywords = [],
    image = SITE_CONFIG.ogImage,
    noIndex = false,
    canonical,
    publishedTime,
    modifiedTime,
    authors,
    type = 'website',
  } = options;

  const fullTitle = `${title} | ${SITE_CONFIG.name}`;
  const allKeywords = [...SITE_CONFIG.keywords, ...keywords];

  return {
    title,
    description,
    keywords: allKeywords,
    authors: authors?.map(name => ({ name })),

    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
        }
      : baseMetadata.robots,

    alternates: {
      canonical: canonical || undefined,
    },

    openGraph: {
      type,
      locale: SITE_CONFIG.locale,
      url: canonical || SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime,
      modifiedTime,
    },

    twitter: {
      card: 'summary_large_image',
      site: '@PetrolPriceAU',
      creator: '@PetrolPriceAU',
      title: fullTitle,
      description,
      images: {
        url: image,
        alt: title,
      },
    },
  };
}

/**
 * Generate metadata for a station detail page
 */
export function generateStationMetadata(station: {
  name: string;
  address?: string;
  city?: string;
  cheapestPrice?: number;
}): Metadata {
  const title = `${station.name} - Fuel Prices`;
  const description = station.cheapestPrice
    ? `Current fuel prices at ${station.name} in ${station.city || 'your area'}. Cheapest price from $${station.cheapestPrice.toFixed(2)}/L. View all fuel types and real-time price updates.`
    : `View current fuel prices at ${station.name} ${station.address || ''}. Compare prices and save on petrol, diesel, and premium unleaded.`;

  return generatePageMetadata({
    title,
    description,
    keywords: [
      station.name,
      `${station.name} fuel prices`,
      station.city ? `${station.city} petrol prices` : '',
      'petrol station',
    ].filter(Boolean),
  });
}

/**
 * Generate metadata for blog/article pages
 */
export function generateArticleMetadata(article: {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  return generatePageMetadata({
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    image: article.image,
    publishedTime: article.publishedDate,
    modifiedTime: article.modifiedDate,
    authors: [article.author],
    type: 'article',
  });
}

// ============================================================================
// Default Export
// ============================================================================

export const defaultMetadata: Metadata = {
  ...baseMetadata,
  openGraph: openGraphMetadata,
  twitter: twitterMetadata,
};
