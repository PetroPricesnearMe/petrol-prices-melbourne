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

export default SEO;

