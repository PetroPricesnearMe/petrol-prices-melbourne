/**
 * SEO Head Component
 *
 * Comprehensive SEO head component with:
 * - Meta tags
 * - Open Graph
 * - Twitter Cards
 * - Canonical URLs
 * - Structured Data
 * - Resource hints
 *
 * @module components/seo/SEOHead
 */

'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

import { SITE_CONFIG } from '@/lib/seo/advanced-metadata';

// ============================================================================
// Types
// ============================================================================

export interface SEOHeadProps {
  /**
   * Page title
   */
  title?: string;

  /**
   * Page description
   */
  description?: string;

  /**
   * Keywords
   */
  keywords?: string[];

  /**
   * Canonical URL (relative or absolute)
   */
  canonical?: string;

  /**
   * Open Graph image
   */
  ogImage?: string;

  /**
   * Open Graph type
   */
  ogType?: 'website' | 'article' | 'profile';

  /**
   * Twitter card type
   */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';

  /**
   * Disable indexing
   */
  noIndex?: boolean;

  /**
   * Disable following
   */
  noFollow?: boolean;

  /**
   * Structured data (JSON-LD)
   */
  structuredData?: object | object[];

  /**
   * Article metadata
   */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };

  /**
   * Additional meta tags
   */
  additionalMeta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;

  /**
   * Additional link tags
   */
  additionalLinks?: Array<{
    rel: string;
    href: string;
    [key: string]: string;
  }>;
}

// ============================================================================
// Component
// ============================================================================

/**
 * SEO Head Component
 *
 * Usage:
 * ```tsx
 * <SEOHead
 *   title="Page Title"
 *   description="Page description"
 *   canonical="/page"
 *   ogImage="/images/og-image.jpg"
 *   structuredData={schema}
 * />
 * ```
 */
export function SEOHead({
  title,
  description = SITE_CONFIG.description,
  keywords = [],
  canonical,
  ogImage = SITE_CONFIG.images.ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false,
  noFollow = false,
  structuredData,
  article,
  additionalMeta = [],
  additionalLinks = [],
}: SEOHeadProps) {
  const pathname = usePathname();

  // Generate full title
  const fullTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.title;

  // Generate canonical URL
  const canonicalUrl = canonical
    ? canonical.startsWith('http')
      ? canonical
      : `${SITE_CONFIG.url}${canonical}`
    : `${SITE_CONFIG.url}${pathname || ''}`;

  // Generate OG image URL
  const ogImageUrl = ogImage.startsWith('http')
    ? ogImage
    : `${SITE_CONFIG.url}${ogImage}`;

  // Combine keywords
  const allKeywords = [...new Set([...SITE_CONFIG.keywords, ...keywords])];

  // Generate robots content
  const robotsContent = noIndex || noFollow
    ? [noIndex && 'noindex', noFollow && 'nofollow'].filter(Boolean).join(', ')
    : 'index, follow';

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords.join(', ')} />
      <meta name="author" content={SITE_CONFIG.appInfo.author} />

      {/* Robots */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || SITE_CONFIG.name} />
      <meta property="og:locale" content={SITE_CONFIG.locale} />

      {/* Article Meta (if applicable) */}
      {article && ogType === 'article' && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={SITE_CONFIG.social.twitter} />
      <meta name="twitter:creator" content={SITE_CONFIG.social.twitter} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content={title || SITE_CONFIG.name} />

      {/* Mobile Meta */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content={SITE_CONFIG.themeColor} />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={SITE_CONFIG.shortName} />

      {/* Additional Meta Tags */}
      {additionalMeta.map((meta, index) => (
        <meta
          key={index}
          {...(meta.name && { name: meta.name })}
          {...(meta.property && { property: meta.property })}
          content={meta.content}
        />
      ))}

      {/* Additional Link Tags */}
      {additionalLinks.map((link, index) => (
        <link key={index} {...link} />
      ))}

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              Array.isArray(structuredData)
                ? { '@context': 'https://schema.org', '@graph': structuredData }
                : structuredData
            ),
          }}
        />
      )}
    </Head>
  );
}

// ============================================================================
// Specialized SEO Components
// ============================================================================

/**
 * Article SEO Head Component
 */
export function ArticleSEOHead({
  title,
  description,
  author,
  publishedDate,
  modifiedDate,
  image,
  tags,
  category,
  ...props
}: Omit<SEOHeadProps, 'ogType' | 'article'> & {
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  image?: string;
  tags?: string[];
  category?: string;
}) {
  return (
    <SEOHead
      {...props}
      title={title}
      description={description}
      ogType="article"
      ogImage={image}
      article={{
        publishedTime: publishedDate,
        modifiedTime: modifiedDate,
        author,
        section: category,
        tags,
      }}
    />
  );
}

/**
 * Product SEO Head Component
 */
export function ProductSEOHead({
  productName,
  price,
  currency = 'AUD',
  availability = 'InStock',
  ...props
}: Omit<SEOHeadProps, 'structuredData'> & {
  productName: string;
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}) {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': productName,
    'offers': {
      '@type': 'Offer',
      'price': price,
      'priceCurrency': currency,
      'availability': `https://schema.org/${availability}`,
    },
  };

  return (
    <SEOHead
      {...props}
      structuredData={productSchema}
    />
  );
}

/**
 * Local Business SEO Head Component
 */
export function LocalBusinessSEOHead({
  businessName,
  address,
  phone,
  ...props
}: Omit<SEOHeadProps, 'structuredData'> & {
  businessName: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone: string;
}) {
  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': businessName,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': address.street,
      'addressLocality': address.city,
      'addressRegion': address.state,
      'postalCode': address.postalCode,
      'addressCountry': address.country,
    },
    'telephone': phone,
  };

  return (
    <SEOHead
      {...props}
      structuredData={businessSchema}
    />
  );
}
