import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component
 * Manages meta tags, structured data, and SEO optimization
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - Meta keywords
 * @param {string} props.canonical - Canonical URL
 * @param {string} props.ogType - Open Graph type
 * @param {string} props.ogImage - Open Graph image URL
 * @param {Object} props.structuredData - JSON-LD structured data
 * @param {boolean} props.noindex - Whether to prevent indexing
 */
const SEO = ({
  title = 'Petrol Prices Near Me - Find Cheapest Fuel in Melbourne',
  description = 'Find the cheapest petrol prices in Melbourne with real-time fuel price updates. Compare prices from 250+ stations across Melbourne regions. Save money on every fill-up.',
  keywords = 'petrol prices melbourne, fuel prices melbourne, cheapest petrol melbourne, petrol stations melbourne, fuel price comparison, live petrol prices',
  canonical,
  ogType = 'website',
  ogImage = '/images/fuel-nozzles.svg',
  structuredData,
  noindex = false,
}) => {
  const siteUrl = 'https://www.petrolpricesnearme.com.au';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : `${siteUrl}${window.location.pathname}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  // Default structured data for the organization
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Petrol Prices Near Me",
    "url": siteUrl,
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/directory?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Organization structured data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Petrol Prices Near Me",
    "url": siteUrl,
    "logo": `${siteUrl}/images/fuel-icon-192.svg`,
    "description": "Melbourne's leading fuel price comparison platform",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Melbourne",
      "addressRegion": "VIC",
      "addressCountry": "AU"
    },
    "areaServed": {
      "@type": "City",
      "name": "Melbourne"
    }
  };

  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      }
    ]
  };

  // Combine structured data
  const combinedStructuredData = structuredData || [
    defaultStructuredData,
    organizationData,
    breadcrumbData
  ];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="Petrol Prices Near Me" />
      <meta property="og:locale" content="en_AU" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="AU-VIC" />
      <meta name="geo.placename" content="Melbourne" />
      <meta name="geo.position" content="-37.8136;144.9631" />
      <meta name="ICBM" content="-37.8136, 144.9631" />

      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Petrol Prices" />

      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(combinedStructuredData)}
      </script>

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://api.mapbox.com" />
      <link rel="dns-prefetch" href="https://maps.googleapis.com" />
    </Helmet>
  );
};

/**
 * Generate structured data for a gas station
 */
export const generateStationStructuredData = (station) => {
  return {
    "@context": "https://schema.org",
    "@type": "GasStation",
    "name": station.name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": station.address,
      "addressLocality": station.city,
      "addressRegion": "VIC",
      "postalCode": station.postalCode,
      "addressCountry": "AU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": station.latitude,
      "longitude": station.longitude
    },
    "telephone": station.phone,
    "openingHoursSpecification": station.hours ? {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    } : undefined,
    "priceRange": station.fuelPrices ? `$${Math.min(...station.fuelPrices.map(fp => parseFloat(fp.price || 0)))} - $${Math.max(...station.fuelPrices.map(fp => parseFloat(fp.price || 0)))}` : undefined,
  };
};

/**
 * Generate structured data for fuel price listings
 */
export const generateFuelPriceListingData = (stations) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Melbourne Petrol Station Prices",
    "description": "Real-time fuel prices from petrol stations across Melbourne",
    "numberOfItems": stations.length,
    "itemListElement": stations.slice(0, 10).map((station, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": generateStationStructuredData(station)
    }))
  };
};

/**
 * Generate Article schema for blog/guide pages
 */
export const generateArticleSchema = ({
  title,
  description,
  author = "Petrol Prices Near Me Team",
  datePublished,
  dateModified,
  image,
  keywords = []
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Organization",
      "name": author,
      "url": "https://www.petrolpricesnearme.com.au"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Petrol Prices Near Me",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.petrolpricesnearme.com.au/images/fuel-icon-192.svg"
      }
    },
    "datePublished": datePublished || new Date().toISOString(),
    "dateModified": dateModified || new Date().toISOString(),
    "image": image || "https://www.petrolpricesnearme.com.au/images/fuel-nozzles.svg",
    "keywords": keywords.join(', '),
    "articleSection": "Fuel Price Guides",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.petrolpricesnearme.com.au"
    }
  };
};

/**
 * Generate HowTo schema for guide pages
 */
export const generateHowToSchema = ({
  name,
  description,
  image,
  totalTime,
  steps = []
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "image": image || "https://www.petrolpricesnearme.com.au/images/fuel-nozzles.svg",
    "totalTime": totalTime || "PT5M",
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Petrol Prices Near Me Platform"
      },
      {
        "@type": "HowToTool",
        "name": "Mobile Device or Computer"
      }
    ],
    "supply": [],
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "url": `https://www.petrolpricesnearme.com.au#step${index + 1}`,
      "image": step.image || "https://www.petrolpricesnearme.com.au/images/fuel-nozzles.svg"
    }))
  };
};

/**
 * Generate LocalBusiness schema for location-specific pages
 */
export const generateLocalBusinessSchema = ({
  name = "Petrol Prices Near Me",
  description,
  address,
  region = "Melbourne"
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "description": description || "Real-time fuel price comparison service for Melbourne",
    "image": "https://www.petrolpricesnearme.com.au/images/fuel-nozzles.svg",
    "address": address || {
      "@type": "PostalAddress",
      "addressLocality": region,
      "addressRegion": "VIC",
      "addressCountry": "AU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -37.8136,
      "longitude": 144.9631
    },
    "url": "https://www.petrolpricesnearme.com.au",
    "telephone": "+61-1300-PETROL",
    "priceRange": "Free",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  };
};

/**
 * Generate Product schema for service offerings
 */
export const generateProductSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Petrol Price Comparison Service",
    "description": "Free real-time petrol price comparison service for Melbourne with live updates from 250+ stations",
    "brand": {
      "@type": "Brand",
      "name": "Petrol Prices Near Me"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "AUD",
      "availability": "https://schema.org/InStock",
      "url": "https://www.petrolpricesnearme.com.au"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "ratingCount": "1250"
    }
  };
};

export default SEO;

