/**
 * Enhanced SEO Component
 * Comprehensive meta tags, Open Graph, Twitter Cards, and JSON-LD schema
 * @version 2.0.0
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOEnhanced = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  schema,
  article,
  noindex = false,
  nofollow = false,
  canonical,
  alternates = [],
}) => {
  // Site defaults
  const siteUrl = 'https://petrolpricesnearme.com.au';
  const siteName = 'Petrol Prices Near Me';
  const defaultImage = `${siteUrl}/images/og-image.jpg`;
  const twitterHandle = '@petrolpricesnearme';

  // Computed values
  const metaTitle = title || 'Petrol Prices Near Me | Melbourne Fuel Stations Directory';
  const metaDescription = description || 'Find the cheapest petrol prices in Melbourne. Compare fuel costs across Shell, BP, Caltex, 7-Eleven and more.';
  const metaImage = image || defaultImage;
  const metaUrl = url || (typeof window !== 'undefined' ? window.location.href : siteUrl);
  const canonicalUrl = canonical || metaUrl;

  // Robots meta
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(', ');

  // Default organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    sameAs: [
      'https://twitter.com/petrolpricesnearme',
      'https://facebook.com/petrolpricesnearme',
    ],
  };

  // Default website schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/directory?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  // Breadcrumb schema (if provided)
  const breadcrumbSchema = schema?.breadcrumb ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: schema.breadcrumb.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  } : null;

  // Article schema (for blog posts)
  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: metaImage,
    author: {
      '@type': article.author?.type || 'Person',
      name: article.author?.name || 'Petrol Prices Team',
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
      },
    },
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
  } : null;

  // Local Business schema (for station pages)
  const localBusinessSchema = schema?.localBusiness ? {
    '@context': 'https://schema.org',
    '@type': 'GasStation',
    name: schema.localBusiness.name,
    image: schema.localBusiness.image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: schema.localBusiness.address?.street,
      addressLocality: schema.localBusiness.address?.city,
      addressRegion: schema.localBusiness.address?.region,
      postalCode: schema.localBusiness.address?.postalCode,
      addressCountry: 'AU',
    },
    geo: schema.localBusiness.coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: schema.localBusiness.coordinates.lat,
      longitude: schema.localBusiness.coordinates.lng,
    } : undefined,
    telephone: schema.localBusiness.phone,
    priceRange: schema.localBusiness.priceRange,
    openingHours: schema.localBusiness.openingHours,
  } : null;

  // Combine all schemas
  const allSchemas = [
    organizationSchema,
    websiteSchema,
    breadcrumbSchema,
    articleSchema,
    localBusinessSchema,
    schema?.custom,
  ].filter(Boolean);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Alternate Links */}
      {alternates.map((alt, index) => (
        <link
          key={index}
          rel="alternate"
          hrefLang={alt.lang}
          href={alt.url}
        />
      ))}

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_AU" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Article-specific Open Graph tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedDate} />
          {article.modifiedDate && (
            <meta property="article:modified_time" content={article.modifiedDate} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author.name} />
          )}
          {article.tags && article.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Mobile App Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={siteName} />

      {/* Theme Color */}
      <meta name="theme-color" content="#2563EB" />
      <meta name="msapplication-TileColor" content="#2563EB" />

      {/* Geo Tags */}
      <meta name="geo.region" content="AU-VIC" />
      <meta name="geo.placename" content="Melbourne" />
      <meta name="geo.position" content="-37.8136;144.9631" />
      <meta name="ICBM" content="-37.8136, 144.9631" />

      {/* JSON-LD Structured Data */}
      {allSchemas.map((schemaObj, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObj) }}
        />
      ))}
    </Helmet>
  );
};

export default SEOEnhanced;

/**
 * Generate breadcrumb schema data
 * @param {Array} breadcrumbs - Array of breadcrumb items
 * @returns {Array} Breadcrumb schema array
 */
export const generateBreadcrumbSchema = (breadcrumbs) => {
  return breadcrumbs.map((item) => ({
    name: item.name || item.label,
    url: item.url || item.path,
  }));
};

/**
 * Generate FAQ schema
 * @param {Array} faqs - Array of FAQ items
 * @returns {Object} FAQ schema object
 */
export const generateFAQSchema = (faqs) => {
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
};

/**
 * Generate product schema (for fuel prices)
 * @param {Object} product - Product data
 * @returns {Object} Product schema object
 */
export const generateProductSchema = (product) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'AUD',
      availability: 'https://schema.org/InStock',
      priceValidUntil: product.priceValidUntil,
      url: product.url,
    },
  };
};

