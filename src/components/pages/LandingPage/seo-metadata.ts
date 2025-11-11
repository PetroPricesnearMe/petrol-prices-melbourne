/**
 * SEO Metadata Configuration for Landing Page
 * Optimized for Google ranking with E-E-A-T principles
 */

import type { Metadata } from 'next';

// ============================================================================
// PRIMARY SEO METADATA
// ============================================================================

export const LANDING_PAGE_METADATA: Metadata = {
  // Title optimized for CTR and keyword ranking
  title: {
    default: 'Find Cheapest Petrol Prices Near Me in Melbourne | Save Up to 20c/L | Free Fuel Finder',
    template: '%s | Petrol Price Near Me - Melbourne Fuel Finder',
  },

  // Description optimized for search intent, benefits, and CTR
  description:
    'Compare real-time petrol prices from 250+ stations across Greater Melbourne. Find the cheapest unleaded 91, premium 95/98, diesel & LPG near you. Save up to $10 per tank with our free fuel price comparison tool. No registration required. Updated every 5 minutes with prices from BP, Shell, Caltex, 7-Eleven & more.',

  // Comprehensive keyword strategy
  keywords: [
    // Primary keywords (high search volume)
    'petrol prices near me',
    'cheapest petrol melbourne',
    'fuel prices melbourne',
    'petrol station finder',
    
    // Long-tail keywords (high intent)
    'find cheapest petrol prices melbourne',
    'compare fuel prices melbourne',
    'real-time petrol prices victoria',
    'save money on petrol melbourne',
    
    // Local SEO keywords
    'melbourne petrol stations',
    'melbourne fuel comparison',
    'victoria fuel prices',
    'melbourne cbd petrol prices',
    
    // Fuel type keywords
    'unleaded 91 prices melbourne',
    'premium 95 fuel prices',
    'premium 98 petrol melbourne',
    'diesel prices melbourne',
    'lpg prices melbourne',
    
    // Brand keywords
    'bp petrol prices melbourne',
    'shell fuel prices',
    'caltex petrol melbourne',
    '7-eleven fuel prices',
    'coles express prices',
    
    // Action keywords (transactional intent)
    'petrol price comparison australia',
    'fuel price finder',
    'petrol price tracker',
    'fuel savings calculator',
    'cheap fuel finder melbourne',
    
    // Question keywords (voice search)
    'where is cheapest petrol near me',
    'how to find cheap fuel melbourne',
    'when to buy petrol melbourne',
    
    // Semantic keywords
    'fuel price trends',
    'petrol price alerts',
    'gas station prices',
    'fuel cost comparison',
    'petrol station map',
  ],

  // Author & Publisher (E-E-A-T signals)
  authors: [
    {
      name: 'Petrol Price Near Me Team',
      url: 'https://petrolpricenearme.com.au/about',
    },
  ],
  creator: 'Petrol Price Near Me',
  publisher: 'Petrol Price Near Me - Melbourne Fuel Finder',

  // Geographic targeting
  category: 'Business & Finance',
  
  // Open Graph for social sharing (improves CTR from social)
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://petrolpricenearme.com.au',
    siteName: 'Petrol Price Near Me',
    title: 'Find Cheapest Petrol Prices in Melbourne | Save Up to 20c/L',
    description:
      'Compare real-time fuel prices from 250+ Melbourne stations. Save up to $10 per tank on unleaded, diesel & premium. Free petrol price comparison - no registration required!',
    images: [
      {
        url: '/images/og-landing-seo-optimized.jpg',
        width: 1200,
        height: 630,
        alt: 'Find the Cheapest Petrol Prices Near You in Melbourne - Save Money on Fuel',
        type: 'image/jpeg',
      },
      {
        url: '/images/og-landing-mobile.jpg',
        width: 800,
        height: 600,
        alt: 'Mobile Petrol Price Finder for Melbourne',
        type: 'image/jpeg',
      },
    ],
  },

  // Twitter Cards for better social sharing
  twitter: {
    card: 'summary_large_image',
    site: '@PetrolPriceAU',
    creator: '@PetrolPriceAU',
    title: 'Find Cheapest Petrol Prices Melbourne | Save Up to 20c/L',
    description:
      'Compare real-time fuel prices from 250+ stations. Find the cheapest unleaded, diesel & premium near you. Free to use!',
    images: ['/images/twitter-landing-seo.jpg'],
  },

  // Canonical URL to prevent duplicate content
  alternates: {
    canonical: 'https://petrolpricenearme.com.au',
    languages: {
      'en-AU': 'https://petrolpricenearme.com.au',
      'en': 'https://petrolpricenearme.com.au',
    },
  },

  // Robots configuration
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification for search consoles
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },

  // Additional metadata
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Petrol Price Finder',
    'application-name': 'Petrol Price Near Me',
    'msapplication-TileColor': '#2563eb',
    'theme-color': '#2563eb',
  },
};

// ============================================================================
// JSON-LD STRUCTURED DATA (For Rich Snippets)
// ============================================================================

export const SEO_JSON_LD = {
  // Website Schema
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://petrolpricenearme.com.au/#website',
    url: 'https://petrolpricenearme.com.au',
    name: 'Petrol Price Near Me',
    alternateName: 'PPNM Fuel Finder',
    description: 'Melbourne's most trusted petrol price comparison service. Find cheapest fuel prices from 250+ stations.',
    publisher: {
      '@type': 'Organization',
      '@id': 'https://petrolpricenearme.com.au/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://petrolpricenearme.com.au/directory?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-AU',
  },

  // Organization Schema (E-E-A-T)
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://petrolpricenearme.com.au/#organization',
    name: 'Petrol Price Near Me',
    url: 'https://petrolpricenearme.com.au',
    logo: {
      '@type': 'ImageObject',
      url: 'https://petrolpricenearme.com.au/images/logo-512.png',
      width: 512,
      height: 512,
    },
    description: 'Leading fuel price comparison service helping Melbourne drivers save money on petrol.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Melbourne',
      addressRegion: 'VIC',
      addressCountry: 'AU',
    },
    areaServed: {
      '@type': 'City',
      name: 'Melbourne',
    },
    sameAs: [
      'https://www.facebook.com/PetrolPriceNearMe',
      'https://twitter.com/PetrolPriceAU',
      'https://www.linkedin.com/company/petrol-price-near-me',
    ],
  },

  // WebApplication Schema
  application: {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Petrol Price Near Me',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AUD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'Real-time petrol price comparison across 250+ Melbourne stations',
      'Interactive fuel station map with price clustering',
      'Price drop alerts and notifications',
      'Historical price trends and cycle tracking',
      'Mobile-optimized responsive design',
      'Free with no registration required',
    ],
  },

  // Service Schema
  service: {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Fuel Price Comparison Service',
    provider: {
      '@type': 'Organization',
      name: 'Petrol Price Near Me',
    },
    areaServed: {
      '@type': 'City',
      name: 'Melbourne',
      '@id': 'https://en.wikipedia.org/wiki/Melbourne',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Fuel Price Comparison',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Unleaded 91 Price Comparison',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Premium 95 Price Comparison',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Diesel Price Comparison',
          },
        },
      ],
    },
  },

  // FAQPage Schema (For Featured Snippets)
  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I find the cheapest petrol prices near me in Melbourne?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use our free petrol price comparison tool to instantly compare real-time fuel prices from 250+ stations across Melbourne. Simply enter your suburb or enable location services to see the cheapest unleaded, diesel, and premium fuel prices near you. Our platform updates prices every 5 minutes.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much can I save using a petrol price comparison tool?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Melbourne drivers typically save between $5-20 per tank by comparing petrol prices. With price differences of up to 20 cents per liter, a 50-liter tank can save you $10 or more. Regular users save $200-500 annually on fuel costs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is this petrol price comparison service free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Petrol Price Near Me is 100% free with no registration required. No subscription fees, hidden costs, or credit card details needed. We help Melbourne drivers save money on fuel through transparent, real-time petrol price comparisons.',
        },
      },
    ],
  },

  // BreadcrumbList Schema
  breadcrumb: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://petrolpricenearme.com.au',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Petrol Stations',
        item: 'https://petrolpricenearme.com.au/directory',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Fuel Price Trends',
        item: 'https://petrolpricenearme.com.au/fuel-price-trends',
      },
    ],
  },
};

// ============================================================================
// ADDITIONAL SEO TAGS
// ============================================================================

export const ADDITIONAL_SEO_TAGS = `
  <!-- Geographic Targeting -->
  <meta name="geo.region" content="AU-VIC" />
  <meta name="geo.placename" content="Melbourne" />
  <meta name="geo.position" content="-37.8136;144.9631" />
  <meta name="ICBM" content="-37.8136, 144.9631" />

  <!-- Mobile Optimization -->
  <meta name="HandheldFriendly" content="true" />
  <meta name="MobileOptimized" content="width" />

  <!-- Content Language -->
  <meta http-equiv="content-language" content="en-AU" />

  <!-- Rating -->
  <meta name="rating" content="general" />

  <!-- Referrer Policy -->
  <meta name="referrer" content="no-referrer-when-downgrade" />
`;

// ============================================================================
// EXPORT ALL SEO DATA
// ============================================================================

export {
  LANDING_PAGE_METADATA as default,
  SEO_JSON_LD,
  ADDITIONAL_SEO_TAGS,
};

