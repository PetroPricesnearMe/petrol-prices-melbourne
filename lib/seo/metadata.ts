/**
 * SEO Metadata Utilities
 * Next.js Metadata API implementation with best practices
 */

import type { Metadata } from 'next';

// Base metadata configuration
export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.petrolpricesnearme.com.au';
export const SITE_NAME = 'Petrol Prices Near Me';
export const SITE_DESCRIPTION =
  'Find the cheapest petrol prices in Melbourne with real-time fuel price updates from 700+ stations. Compare prices, save money on every fill-up.';

// Default metadata
export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${SITE_NAME} - Find Cheapest Fuel in Melbourne`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'petrol prices melbourne',
    'fuel prices melbourne',
    'cheapest petrol',
    'petrol stations near me',
    'fuel comparison',
    'petrol price comparison',
    'melbourne fuel prices',
    'real-time fuel prices',
    'cheapest fuel melbourne',
    'petrol station finder',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: BASE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Find Cheapest Fuel in Melbourne`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${BASE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Find Cheapest Fuel in Melbourne`,
    description: SITE_DESCRIPTION,
    images: [`${BASE_URL}/images/twitter-card.jpg`],
    creator: '@petrolpricesau',
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

/**
 * Generate page-specific metadata
 */
interface PageMetadataOptions {
  title: string;
  description?: string;
  keywords?: string[];
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

export function generateMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description = SITE_DESCRIPTION,
    keywords = [],
    path = '',
    image,
    type = 'website',
    publishedTime,
    modifiedTime,
    noindex = false,
  } = options;

  const url = `${BASE_URL}${path}`;
  const ogImage = image || `${BASE_URL}/images/og-image.jpg`;

  return {
    title,
    description,
    keywords: [...defaultMetadata.keywords!, ...keywords],
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [SITE_NAME],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : defaultMetadata.robots,
  };
}

/**
 * Generate metadata for region pages
 */
export function generateRegionMetadata(region: string, stationCount: number): Metadata {
  const title = `${region} Petrol Prices - ${stationCount} Stations`;
  const description = `Find the cheapest petrol prices in ${region}, Melbourne. Compare fuel prices from ${stationCount} petrol stations and save money on every fill-up.`;

  return generateMetadata({
    title,
    description,
    keywords: [
      `${region.toLowerCase()} petrol prices`,
      `${region.toLowerCase()} fuel prices`,
      `petrol stations ${region.toLowerCase()}`,
      `cheapest fuel ${region.toLowerCase()}`,
    ],
    path: `/directory?region=${region.toLowerCase()}`,
  });
}

/**
 * Generate metadata for blog posts
 */
export function generateBlogMetadata(post: {
  title: string;
  excerpt: string;
  slug: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
}): Metadata {
  return generateMetadata({
    title: post.title,
    description: post.excerpt,
    keywords: post.tags || [],
    path: `/blog/${post.slug}`,
    image: post.image,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  });
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate LocalBusiness structured data
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': BASE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    image: `${BASE_URL}/images/og-image.jpg`,
    telephone: '+61-3-XXXX-XXXX',
    priceRange: '$$',
    areaServed: {
      '@type': 'City',
      name: 'Melbourne',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Melbourne',
        addressRegion: 'VIC',
        addressCountry: 'AU',
      },
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -37.8136,
      longitude: 144.9631,
    },
    sameAs: [
      'https://www.facebook.com/petrolpricesnearme',
      'https://twitter.com/petrolpricesau',
      'https://www.instagram.com/petrolpricesnearme',
    ],
  };
}

/**
 * Generate WebSite structured data
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: SITE_NAME,
    url: BASE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/directory?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: SITE_NAME,
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/images/logo.png`,
      width: 512,
      height: 512,
    },
    description: SITE_DESCRIPTION,
    sameAs: [
      'https://www.facebook.com/petrolpricesnearme',
      'https://twitter.com/petrolpricesau',
      'https://www.instagram.com/petrolpricesnearme',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      areaServed: 'AU',
      availableLanguage: 'en',
    },
  };
}

/**
 * Generate Article structured data
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${article.slug}`,
    },
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
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
 * Generate Product structured data (for fuel prices)
 */
export function generateProductSchema(fuel: {
  type: string;
  price: number;
  currency?: string;
  availability?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: fuel.type,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: fuel.currency || 'AUD',
      lowPrice: fuel.price,
      availability: fuel.availability || 'https://schema.org/InStock',
    },
  };
}

export default {
  defaultMetadata,
  generateMetadata,
  generateRegionMetadata,
  generateBlogMetadata,
  generateBreadcrumbSchema,
  generateLocalBusinessSchema,
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateArticleSchema,
  generateFAQSchema,
  generateProductSchema,
};
