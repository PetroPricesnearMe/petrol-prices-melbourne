import type { Metadata } from 'next';

import { PerformanceOptimizedLandingPage } from '@/components/pages/PerformanceOptimizedLandingPage';
import { StructuredData } from '@/components/StructuredData';
import {
  generateWebsiteSchema,
  generatePlatformLocalBusinessSchema,
  generateOrganizationSchema,
} from '@/lib/seo/schema-generator';

// SEO: Updated metadata with keyword strategy - includes all required keywords
export const metadata: Metadata = {
  title: 'Petrol prices today | Cheapest fuel near me | PetrolPricesNearMe',
  description:
    'Find live petrol prices near you today. Compare cheapest fuel prices from 250+ stations across Australia. Petrol prices today, fuel prices today, live petrol prices Melbourne. Save money on unleaded, diesel, and premium fuel. Updated daily.',
  keywords: [
    // General keywords
    'petrol prices Melbourne',
    'fuel prices Melbourne',
    'petrol prices near me',
    'fuel prices near me',
    'petrol price comparison',
    // Live/Today keywords
    'petrol prices today',
    'fuel prices today',
    'live petrol prices Melbourne',
    'cheap fuel prices today',
    // Fuel type keywords
    'unleaded price near me',
    'diesel price near me',
    'premium petrol price near me',
    'E10 prices near me',
    // Additional keywords
    'cheapest petrol Melbourne',
    'real-time fuel prices',
    'petrol price tracker',
    'melbourne petrol stations',
    'fuel savings calculator',
    'cheap fuel finder',
  ],
  openGraph: {
    title: 'Petrol prices today | Cheapest fuel near me | PetrolPricesNearMe',
    description:
      'Find live petrol prices near you today. Compare cheapest fuel prices from 250+ stations across Australia. Updated daily.',
    type: 'website',
    locale: 'en_AU', // og:locale
    url: 'https://petrolpricesnearme.com.au', // og:url
    siteName: 'PetrolPricesNearMe',
    images: [
      {
        url: 'https://petrolpricesnearme.com.au/images/og-landing-page.jpg',
        width: 1200,
        height: 630,
        alt: 'Petrol Prices Today - Find Cheapest Fuel Near Me',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Petrol prices today | Cheapest fuel near me | PetrolPricesNearMe',
    description:
      'Find live petrol prices near you today. Compare cheapest fuel prices from 250+ stations across Australia.',
    images: [
      'https://petrolpricesnearme.com.au/images/twitter-landing-page.jpg',
    ],
  },
  alternates: {
    canonical: 'https://petrolpricesnearme.com.au/',
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
};

export default function HomePage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricesnearme.com.au';
  const structuredDataSchemas = [
    generateOrganizationSchema(baseUrl),
    generateWebsiteSchema(baseUrl),
    generatePlatformLocalBusinessSchema(baseUrl),
  ];

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={structuredDataSchemas} />

      {/* Performance-Optimized Landing Page */}
      <PerformanceOptimizedLandingPage />
    </>
  );
}
