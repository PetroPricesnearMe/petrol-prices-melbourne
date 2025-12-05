import type { Metadata } from 'next';

import { PerformanceOptimizedLandingPage } from '@/components/pages/PerformanceOptimizedLandingPage';
import { StructuredData } from '@/components/StructuredData';
import {
  generateWebsiteSchema,
  generatePlatformLocalBusinessSchema,
  generateOrganizationSchema,
} from '@/lib/seo/schema-generator';

export const metadata: Metadata = {
  title: 'Petrol Prices Near Me Melbourne | Live Fuel Prices 2024',
  description:
    'Find cheapest petrol prices in Melbourne. Compare live fuel prices from 250+ stations across 50+ suburbs. Save up to 20c/L. Free, no registration.',
  keywords: [
    'petrol prices near me',
    'cheap fuel melbourne',
    'petrol station finder',
    'fuel price comparison',
    'live petrol prices',
    'melbourne fuel prices',
    'save money on fuel',
    'cheapest petrol melbourne',
    'real-time fuel prices',
    'petrol price tracker',
    'fuel savings calculator',
    'melbourne petrol stations',
    'unleaded prices melbourne',
    'diesel prices melbourne',
    'premium fuel prices',
    'e10 prices melbourne',
    'fuel price alerts',
    'petrol price trends',
    'cheap fuel finder',
    'melbourne fuel app',
  ],
  openGraph: {
    title: 'Petrol Prices Near Me Melbourne | Live Fuel Prices 2024',
    description:
      'Find cheapest petrol prices in Melbourne. Compare live fuel prices from 250+ stations across 50+ suburbs. Save up to 20c/L. Free, no registration.',
    type: 'website',
    locale: 'en_AU',
    url: 'https://petrolpricesnearme.com.au',
    siteName: 'Petrol Price Near Me',
    images: [
      {
        url: 'https://petrolpricesnearme.com.au/images/og-landing-page.jpg',
        width: 1200,
        height: 630,
        alt: 'Find Cheapest Petrol Prices in Melbourne - Save Money on Fuel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Petrol Prices Near Me Melbourne | Live Fuel Prices 2024',
    description:
      'Find cheapest petrol prices in Melbourne. Compare live fuel prices from 250+ stations across 50+ suburbs. Save up to 20c/L.',
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
