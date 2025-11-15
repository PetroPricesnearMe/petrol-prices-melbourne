import type { Metadata } from 'next';

import { PerformanceOptimizedLandingPage } from '@/components/pages/PerformanceOptimizedLandingPage';
import { StructuredData } from '@/components/StructuredData';
import { generateWebSiteSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title:
    'Find Cheapest Petrol Prices Near Me | Save Up to 20c/L | Melbourne Fuel Finder',
  description:
    'Compare live petrol prices from 250+ stations in Melbourne. Save up to 20c/L with real-time fuel price updates. Find the cheapest unleaded, diesel & premium near you today! Free to use, no registration required.',
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
    title: 'Find Cheapest Petrol Prices Near Me | Save Up to 20c/L',
    description:
      'Compare live petrol prices from 250+ stations in Melbourne. Save up to 20c/L with real-time fuel price updates. Free to use!',
    type: 'website',
    locale: 'en_AU',
    url: 'https://petrolpricenearme.com.au',
    siteName: 'Petrol Price Near Me',
    images: [
      {
        url: '/images/og-landing-page.jpg',
        width: 1200,
        height: 630,
        alt: 'Find Cheapest Petrol Prices in Melbourne - Save Money on Fuel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Cheapest Petrol Prices Near Me | Save Up to 20c/L',
    description:
      'Compare live petrol prices from 250+ stations in Melbourne. Save up to 20c/L with real-time fuel price updates. Free to use!',
    images: ['/images/twitter-landing-page.jpg'],
  },
  alternates: {
    canonical: 'https://petrolpricenearme.com.au',
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
    process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';
  const structuredDataSchemas = generateWebSiteSchema(baseUrl);

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={structuredDataSchemas} />

      {/* Performance-Optimized Landing Page */}
      <PerformanceOptimizedLandingPage />
    </>
  );
}
