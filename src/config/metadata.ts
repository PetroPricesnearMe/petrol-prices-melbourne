/**
 * Metadata Configuration
 * 
 * Centralized metadata for SEO and social sharing.
 * Used in root layout and page-specific metadata.
 * 
 * @module config/metadata
 */

import type { Metadata } from 'next';

/**
 * Site configuration
 */
export const siteConfig = {
  name: 'Petrol Price Near Me',
  description: 'Find the cheapest petrol prices near you in Australia. Real-time fuel prices, station locations, and detailed information for all major fuel brands.',
  url: 'https://petrolpricenearme.com.au',
  ogImage: 'https://petrolpricenearme.com.au/og-image.jpg',
  keywords: [
    'petrol prices',
    'fuel prices',
    'cheap petrol',
    'petrol stations',
    'fuel near me',
    'australia',
    'real-time prices',
    'fuel comparison',
    'petrol finder',
  ],
  creator: 'Petrol Price Near Me Team',
  themeColor: '#2563EB',
  locale: 'en_AU',
} as const;

/**
 * Author information
 */
export const authors = [
  {
    name: 'Petrol Price Near Me',
    url: siteConfig.url,
  },
] as const;

/**
 * Default metadata for the site
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: authors,
  creator: siteConfig.creator,
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@petrolpricenearme',
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },

  // Manifest
  manifest: '/manifest.json',

  // Verification
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },

  // Robots
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

  // Alternates
  alternates: {
    canonical: siteConfig.url,
  },

  // Other
  category: 'Technology',
};

/**
 * Generate page metadata
 * 
 * @param title - Page title
 * @param description - Page description
 * @param path - Page path (e.g., '/about')
 * @returns Metadata object
 * 
 * @example
 * ```tsx
 * export const metadata = generateMetadata(
 *   'About Us',
 *   'Learn more about Petrol Price Near Me',
 *   '/about'
 * );
 * ```
 */
export function generateMetadata(
  title: string,
  description?: string,
  path?: string,
  image?: string
): Metadata {
  const pageUrl = path ? `${siteConfig.url}${path}` : siteConfig.url;
  const pageDescription = description || siteConfig.description;
  const pageImage = image || siteConfig.ogImage;

  return {
    title,
    description: pageDescription,
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url: pageUrl,
      title,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: pageDescription,
      images: [pageImage],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

/**
 * JSON-LD structured data for organization
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  description: siteConfig.description,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'AU',
  },
  sameAs: [
    // Add social media URLs here
  ],
} as const;

/**
 * JSON-LD structured data for website
 */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
} as const;

