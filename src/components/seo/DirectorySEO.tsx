/**
 * Directory Listing SEO Component
 *
 * Comprehensive SEO management for directory listings using next-seo
 * Features:
 * - Dynamic meta tags
 * - OG images generation
 * - Structured schema markup
 * - Twitter cards
 * - Open Graph tags
 * - Breadcrumb navigation schema
 *
 * @module components/seo/DirectorySEO
 */

'use client';

import React from 'react';
import { NextSeo, DefaultSeo } from 'next-seo';

export interface DirectorySEOProps {
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Canonical URL */
  canonical?: string;
  /** Open Graph image URL */
  ogImage?: string;
  /** Additional keywords */
  keywords?: string[];
  /** No index flag */
  noindex?: boolean;
  /** No follow flag */
  nofollow?: boolean;
  /** Station data for structured data */
  station?: {
    id: string;
    name: string;
    address: string;
    suburb: string;
    brand?: string;
    latitude?: number;
    longitude?: number;
    phoneNumber?: string;
    price?: number;
  };
  /** Breadcrumb items */
  breadcrumbs?: Array<{ name: string; url: string }>;
  /** Additional structured data */
  additionalStructuredData?: object[];
}

/**
 * Directory Listing SEO Component
 * Manages all SEO-related meta tags and structured data
 */
export const DirectorySEO: React.FC<DirectorySEOProps> = ({
  title = 'Find Petrol Stations Near You - Melbourne Fuel Prices',
  description = 'Compare fuel prices from 250+ petrol stations across Melbourne. Find the cheapest unleaded, diesel, and premium fuel with real-time price updates.',
  canonical,
  ogImage,
  keywords = [
    'petrol prices melbourne',
    'fuel prices',
    'petrol stations',
    'cheap fuel',
    'unleaded prices',
    'diesel prices',
  ],
  noindex = false,
  nofollow = false,
  station,
  breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Directory', url: '/directory' },
  ],
  additionalStructuredData = [],
}) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.petrolpricenearme.com.au';
  const fullCanonical = canonical || '/directory';
  const fullOgImage = ogImage || `${siteUrl}/images/og-directory.png`;

  // Generate page title
  const pageTitle = title.includes('Petrol') ? title : `${title} | Petrol Prices Near Me`;

  // Generate keywords array
  const keywordsString = keywords.join(', ');

  // Generate structured data
  const structuredData = [
    // Organization schema
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Petrol Prices Near Me',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/fuel-icon-192.svg`,
      },
      description: 'Melbourne\'s leading fuel price comparison platform',
      areaServed: {
        '@type': 'City',
        name: 'Melbourne',
      },
    },
    // Breadcrumb schema
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${siteUrl}${crumb.url}`,
      })),
    },
    // LocalBusiness schema (if station data provided)
    station && {
      '@context': 'https://schema.org',
      '@type': 'GasStation',
      '@id': `${siteUrl}/stations/${station.id}`,
      name: station.name,
      description: `${station.brand || ''} petrol station at ${station.address}, ${station.suburb}`,
      url: `${siteUrl}/stations/${station.id}`,
      ...(station.brand && {
        brand: {
          '@type': 'Brand',
          name: station.brand,
        },
      }),
      address: {
        '@type': 'PostalAddress',
        streetAddress: station.address,
        addressLocality: station.suburb,
        addressRegion: 'VIC',
        addressCountry: 'AU',
      },
      ...(station.latitude && station.longitude && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: station.latitude,
          longitude: station.longitude,
        },
      }),
      ...(station.phoneNumber && {
        telephone: station.phoneNumber,
      }),
      ...(station.price && {
        priceRange: `$${station.price}`,
      }),
      paymentAccepted: 'Cash, Credit Card, Debit Card',
      currenciesAccepted: 'AUD',
    },
    ...additionalStructuredData,
  ].filter(Boolean);

  return (
    <>
      <NextSeo
        title={pageTitle}
        description={description}
        canonical={canonical ? `${siteUrl}${canonical}` : undefined}
        openGraph={{
          type: station ? 'website' : 'website',
          url: `${siteUrl}${fullCanonical}`,
          title: pageTitle,
          description: description,
          images: [
            {
              url: fullOgImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
          siteName: 'Petrol Prices Near Me',
          locale: 'en_AU',
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: '@petrolpricesnearme',
          creator: '@petrolpricesnearme',
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: keywordsString,
          },
          {
            name: 'geo.region',
            content: 'AU-VIC',
          },
          {
            name: 'geo.placename',
            content: 'Melbourne',
          },
          {
            name: 'geo.position',
            content: '-37.8136;144.9631',
          },
          {
            name: 'ICBM',
            content: '-37.8136, 144.9631',
          },
          {
            name: 'mobile-web-app-capable',
            content: 'yes',
          },
          {
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            name: 'apple-mobile-web-app-title',
            content: 'Petrol Prices',
          },
        ]}
        noindex={noindex}
        nofollow={nofollow}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
          {
            rel: 'apple-touch-icon',
            href: '/images/apple-touch-icon.png',
            sizes: '180x180',
          },
          {
            rel: 'manifest',
            href: '/manifest.json',
          },
        ]}
      />

      {/* Structured Data */}
      {structuredData.map((data, index) => (
        <script
          key={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
};

/**
 * Default SEO Configuration
 * Use this in _app.tsx for site-wide default SEO
 */
export const DefaultDirectorySEO: React.FC = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.petrolpricenearme.com.au';

  return (
    <DefaultSeo
      titleTemplate="%s | Petrol Prices Near Me"
      defaultTitle="Petrol Prices Near Me - Find Cheapest Fuel in Melbourne"
      description="Compare fuel prices from 250+ petrol stations across Melbourne. Find the cheapest unleaded, diesel, and premium fuel with real-time price updates."
      canonical={siteUrl}
      openGraph={{
        type: 'website',
        locale: 'en_AU',
        url: siteUrl,
        siteName: 'Petrol Prices Near Me',
        images: [
          {
            url: `${siteUrl}/images/og-default.png`,
            width: 1200,
            height: 630,
            alt: 'Petrol Prices Near Me',
          },
        ],
      }}
      twitter={{
        cardType: 'summary_large_image',
        site: '@petrolpricesnearme',
      }}
      additionalMetaTags={[
        {
          name: 'keywords',
          content:
            'petrol prices melbourne, fuel prices, petrol stations, cheap fuel, unleaded prices, diesel prices',
        },
        {
          name: 'geo.region',
          content: 'AU-VIC',
        },
        {
          name: 'geo.placename',
          content: 'Melbourne',
        },
      ]}
    />
  );
};

export default DirectorySEO;
