import type { Metadata } from 'next';

import { PerformanceOptimizedLandingPage } from '@/components/pages/PerformanceOptimizedLandingPage';
import { StructuredData } from '@/components/StructuredData';
import {
  generateWebsiteSchema,
  generatePlatformLocalBusinessSchema,
  generateOrganizationSchema,
  generateWebPageSchema,
} from '@/lib/seo/schema-generator';

// SEO: Updated metadata with "near me" keywords prioritized
export const metadata: Metadata = {
  title: 'Live Petrol Prices Near Me Today | Cheap Fuel Melbourne',
  description:
    'Live petrol prices near me updated daily. Compare cheap fuel in Melbourne including E10, Unleaded 91, Premium and Diesel. Find cheap petrol near me today.',
  keywords: [
    // PRIMARY KEYWORDS - "near me" patterns (prioritized)
    'petrol near me',
    'cheap fuel near me',
    'cheap petrol near me',
    'petrol near me price',
    'petrol prices near me',
    'fuel prices near me',
    'fuel price near me',
    // SECONDARY KEYWORDS
    'petrol prices',
    'fuel melbourne prices',
    'cheap petrol',
    // Additional keywords
    'petrol prices today',
    'fuel prices today',
    'live petrol prices Melbourne',
    'unleaded price near me',
    'diesel price near me',
    'premium petrol price near me',
    'E10 prices near me',
  ],
  openGraph: {
    title: 'Live Petrol Prices Near Me Today | Cheap Fuel Melbourne', // og:title
    description:
      'Live petrol prices near me updated daily. Compare cheap fuel in Melbourne including E10, Unleaded 91, Premium and Diesel.', // og:description
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
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Petrol Prices Near Me Today | Cheap Fuel Melbourne',
    description:
      'Live petrol prices near me updated daily. Compare cheap fuel in Melbourne including E10, Unleaded 91, Premium and Diesel.',
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
    generateWebPageSchema(baseUrl, {
      title: 'Live Petrol Prices Near Me Today | Cheap Fuel Melbourne',
      description:
        'Live petrol prices near me updated daily. Compare cheap fuel in Melbourne including E10, Unleaded 91, Premium and Diesel. Find cheap petrol near me today.',
      path: '/',
      image: `${baseUrl}/images/og-landing-page.jpg`,
    }),
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
