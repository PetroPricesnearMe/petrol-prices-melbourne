/**
 * Advanced SEO Metadata Configuration
 *
 * Comprehensive metadata generation for Next.js 14+ with:
 * - Title templates and descriptions
 * - Open Graph and Twitter Cards
 * - Canonical URLs and alternates
 * - JSON-LD structured data
 * - Mobile optimization
 * - Core Web Vitals optimization
 *
 * @module lib/seo/advanced-metadata
 */

import type { Metadata, Viewport } from 'next';

import type { Station } from '@/types/station';

// ============================================================================
// Site Configuration
// ============================================================================

export const SITE_CONFIG = {
  name: 'Petrol Price Near Me',
  shortName: 'PPNM',
  title:
    'Find Cheapest Petrol Prices Near Me | Real-Time Fuel Prices Australia',
  description:
    'Compare live petrol prices from 250+ stations across Melbourne. Save up to 20c/L with real-time fuel price updates. Find the cheapest unleaded, diesel & premium near you today! Free to use, no registration required.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://petrolpricenearme.com.au',
  domain: 'petrolpricenearme.com.au',
  locale: 'en_AU',
  region: 'AU',
  language: 'en',
  themeColor: '#0ea5e9',
  backgroundColor: '#ffffff',

  // Contact & Business Info
  email: 'hello@petrolpricenearme.com.au',
  phone: '+61 1800 PETROL',
  address: {
    street: 'Melbourne VIC',
    city: 'Melbourne',
    state: 'Victoria',
    country: 'Australia',
    countryCode: 'AU',
    postalCode: '3000',
  },

  // Social Media
  social: {
    twitter: '@PetrolPriceAU',
    facebook: 'https://www.facebook.com/PetrolPriceNearMe',
    linkedin: 'https://www.linkedin.com/company/petrol-price-near-me',
    instagram: 'https://www.instagram.com/petrolpricenearme',
  },

  // SEO Keywords
  keywords: [
    // Primary keywords
    'petrol prices near me',
    'fuel prices australia',
    'cheapest petrol melbourne',
    'petrol station finder',

    // Secondary keywords
    'real-time fuel prices',
    'compare petrol prices',
    'fuel price comparison',
    'save money on fuel',

    // Long-tail keywords
    'live petrol prices melbourne',
    'cheapest diesel near me',
    'premium unleaded prices',
    'fuel price trends australia',
    'petrol price alerts',
    'melbourne petrol stations',

    // Location-based
    'petrol prices victoria',
    'fuel prices melbourne suburbs',
    'cheapest fuel near me',

    // Feature keywords
    'fuel savings calculator',
    'petrol price tracker',
    'gas station prices',
    'automotive fuel prices',
  ],

  // Images
  images: {
    logo: '/images/logo.png',
    icon: '/images/icon.svg',
    favicon: '/favicon.ico',
    appleTouchIcon: '/apple-touch-icon.png',
    ogImage: '/images/og-image.jpg',
    twitterImage: '/images/twitter-image.jpg',
  },

  // App Info
  appInfo: {
    version: '2.0.0',
    author: 'Petrol Price Near Me Team',
    copyright: `© ${new Date().getFullYear()} Petrol Price Near Me. All rights reserved.`,
    generator: 'Next.js 15',
  },
} as const;

// ============================================================================
// Viewport Configuration (Optimized for Mobile)
// ============================================================================

export const defaultViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
};

// ============================================================================
// Base Metadata Configuration
// ============================================================================

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),

  // Title Configuration
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },

  // Description & Keywords
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,

  // Author Information
  authors: [{ name: SITE_CONFIG.appInfo.author, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.appInfo.author,
  publisher: SITE_CONFIG.name,

  // Application Info
  applicationName: SITE_CONFIG.name,
  generator: SITE_CONFIG.appInfo.generator,
  referrer: 'origin-when-cross-origin',

  // Format Detection (Disable auto-detection for better control)
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Category
  category: 'business',

  // Icons
  icons: {
    icon: [
      { url: SITE_CONFIG.images.favicon, sizes: 'any' },
      { url: SITE_CONFIG.images.icon, type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: SITE_CONFIG.images.favicon,
    apple: [
      {
        url: SITE_CONFIG.images.appleTouchIcon,
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: SITE_CONFIG.themeColor,
      },
    ],
  },

  // Manifest
  manifest: '/manifest.json',

  // Verification
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  },

  // Canonical & Alternates
  alternates: {
    canonical: '/',
    languages: {
      'en-AU': '/',
    },
  },

  // Robots Configuration
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

  // Open Graph
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.images.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - Find Cheapest Petrol Prices`,
        type: 'image/jpeg',
      },
      {
        url: SITE_CONFIG.images.ogImage,
        width: 1200,
        height: 1200,
        alt: `${SITE_CONFIG.name} - Square`,
        type: 'image/jpeg',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: SITE_CONFIG.social.twitter,
    creator: SITE_CONFIG.social.twitter,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: {
      url: SITE_CONFIG.images.twitterImage,
      alt: SITE_CONFIG.name,
    },
  },

  // Additional Metadata
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': SITE_CONFIG.shortName,
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': SITE_CONFIG.themeColor,
    'msapplication-TileImage': '/mstile-144x144.png',
  },
};

// ============================================================================
// Advanced Metadata Generators
// ============================================================================

interface PageMetadataOptions {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  canonical?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  locale?: string;
}

/**
 * Generate comprehensive page metadata with SEO best practices
 */
export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description = SITE_CONFIG.description,
    keywords = [],
    image = SITE_CONFIG.images.ogImage,
    imageAlt = title,
    canonical,
    noIndex = false,
    noFollow = false,
    type = 'website',
    publishedTime,
    modifiedTime,
    author = SITE_CONFIG.appInfo.author,
    section,
    tags = [],
    locale = SITE_CONFIG.locale,
  } = options;

  const fullTitle = title.includes(SITE_CONFIG.name)
    ? title
    : `${title} | ${SITE_CONFIG.name}`;
  const allKeywords = [...new Set([...SITE_CONFIG.keywords, ...keywords])];
  const canonicalUrl = canonical ? `${SITE_CONFIG.url}${canonical}` : undefined;

  return {
    title,
    description,
    keywords: allKeywords,
    authors: [{ name: author }],

    alternates: {
      canonical: canonicalUrl,
      languages: {
        [locale]: canonicalUrl || SITE_CONFIG.url,
      },
    },

    robots:
      noIndex || noFollow
        ? {
            index: !noIndex,
            follow: !noFollow,
            nocache: noIndex,
            googleBot: {
              index: !noIndex,
              follow: !noFollow,
              noimageindex: noIndex,
              'max-video-preview': -1,
              'max-image-preview': noIndex ? 'none' : 'large',
              'max-snippet': -1,
            },
          }
        : undefined,

    openGraph: {
      type,
      locale,
      url: canonicalUrl || SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: 'image/jpeg',
        },
      ],
      publishedTime,
      modifiedTime,
      section,
      tags,
    },

    twitter: {
      card: 'summary_large_image',
      site: SITE_CONFIG.social.twitter,
      creator: SITE_CONFIG.social.twitter,
      title: fullTitle,
      description,
      images: {
        url: image,
        alt: imageAlt,
      },
    },
  };
}

/**
 * Generate metadata for station detail pages
 */
export function generateStationMetadata(station: Station): Metadata {
  const title = `${station.name} - Real-Time Fuel Prices & Information`;
  const description = `Current fuel prices at ${station.name} in ${station.suburb || 'Melbourne'}. ${station.address ? `Located at ${station.address}. ` : ''}Compare prices for unleaded, diesel, and premium fuel. Open ${station.operatingHours ? '24/7' : 'daily'}.`;

  const keywords = [
    `${station.name}`,
    `${station.name} fuel prices`,
    `${station.suburb} petrol station`,
    `${station.brand} ${station.suburb}`,
    'petrol prices near me',
    'fuel station prices',
    station.brand || '',
  ].filter(Boolean);

  return generatePageMetadata({
    title,
    description,
    keywords,
    canonical: `/stations/${station.id}`,
    image: station.brand
      ? `/images/stations/${station.brand.toLowerCase().replace(/\s+/g, '-')}-og.jpg`
      : undefined,
    type: 'website',
  });
}

/**
 * Generate metadata for directory/listing pages
 */
export function generateDirectoryMetadata(
  suburb: string,
  stationCount: number
): Metadata {
  const title = `${stationCount} Petrol Stations in ${suburb} - Compare Fuel Prices`;
  const description = `Find and compare fuel prices from ${stationCount} petrol stations in ${suburb}, Melbourne. Real-time prices for unleaded, diesel, premium, and LPG. Save up to 20c/L on your next fill-up!`;

  const keywords = [
    `petrol stations ${suburb}`,
    `fuel prices ${suburb}`,
    `cheapest petrol ${suburb}`,
    `${suburb} gas stations`,
    'fuel price comparison',
    'petrol station finder',
  ];

  return generatePageMetadata({
    title,
    description,
    keywords,
    canonical: `/directory/${suburb.toLowerCase().replace(/\s+/g, '-')}`,
    type: 'website',
  });
}

/**
 * Generate metadata for region pages
 */
export function generateRegionMetadata(
  region: string,
  stationCount: number
): Metadata {
  const title = `Petrol Stations in ${region} - Real-Time Fuel Prices`;
  const description = `Discover ${stationCount} petrol stations across ${region}. Compare real-time fuel prices, find the cheapest unleaded, diesel, and premium fuel near you. Updated every 5 minutes.`;

  const keywords = [
    `petrol stations ${region}`,
    `fuel prices ${region}`,
    `${region} petrol prices`,
    'real-time fuel prices',
    'compare petrol prices',
  ];

  return generatePageMetadata({
    title,
    description,
    keywords,
    canonical: `/regions/${region.toLowerCase().replace(/\s+/g, '-')}`,
    type: 'website',
  });
}

/**
 * Generate metadata for blog/article pages
 */
export function generateArticleMetadata(article: {
  title: string;
  description: string;
  slug: string;
  author?: string;
  publishedDate: string;
  modifiedDate?: string;
  image?: string;
  tags?: string[];
  category?: string;
}): Metadata {
  return generatePageMetadata({
    title: article.title,
    description: article.description,
    keywords: article.tags || [],
    canonical: `/blog/${article.slug}`,
    image: article.image,
    type: 'article',
    publishedTime: article.publishedDate,
    modifiedTime: article.modifiedDate,
    author: article.author,
    section: article.category,
    tags: article.tags,
  });
}

/**
 * Generate metadata for FAQ pages
 */
export function generateFAQMetadata(): Metadata {
  const title = 'Frequently Asked Questions - Fuel Prices & Petrol Stations';
  const description =
    'Find answers to common questions about fuel prices, petrol stations, price updates, and how to save money on fuel. Learn about our real-time price comparison service.';

  return generatePageMetadata({
    title,
    description,
    keywords: [
      'faq',
      'frequently asked questions',
      'help',
      'support',
      'fuel prices help',
    ],
    canonical: '/faq',
    type: 'website',
  });
}

/**
 * Generate metadata for map view pages
 */
export function generateMapMetadata(): Metadata {
  const title = 'Petrol Station Map - Find Cheapest Fuel Prices Near You';
  const description =
    'Interactive map showing 250+ petrol stations with real-time fuel prices. Search by location, compare prices, and find the cheapest fuel near you. Updated every 5 minutes.';

  return generatePageMetadata({
    title,
    description,
    keywords: [
      'petrol station map',
      'fuel price map',
      'station locator',
      'find petrol near me',
    ],
    canonical: '/map',
    type: 'website',
  });
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate JSON-LD breadcrumb list
 */
export function generateBreadcrumbJsonLd(
  breadcrumbs: Array<{ label: string; href: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `${SITE_CONFIG.url}${crumb.href}`,
    })),
  };
}

/**
 * Generate canonical URL for a path
 */
export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
}

/**
 * Generate alternate links for different locales
 */
export function generateAlternateLinks(
  path: string,
  locales: string[] = ['en-AU']
) {
  return locales.reduce(
    (acc, locale) => {
      acc[locale] = `${SITE_CONFIG.url}${path}`;
      return acc;
    },
    {} as Record<string, string>
  );
}
