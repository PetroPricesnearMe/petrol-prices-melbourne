import type { Metadata } from 'next';

import { LandingPage } from '@/components/pages/LandingPage';
import { StructuredData } from '@/components/StructuredData';
import { generateWebSiteSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Find Cheapest Petrol Prices Near Me | Melbourne Fuel Price Comparison',
  description:
    'Find the cheapest petrol stations near you in Melbourne. Compare fuel prices from 250+ stations with real-time updates. Save money on every fill-up with live unleaded, diesel, and premium prices.',
  keywords: [
    'petrol prices near me',
    'cheap fuel melbourne',
    'petrol station finder',
    'fuel price comparison',
    'live petrol prices',
    'melbourne fuel prices',
  ],
};

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';
  const structuredDataSchemas = generateWebSiteSchema(baseUrl);

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={structuredDataSchemas} />
      
      {/* Landing Page */}
      <LandingPage />
    </>
  );
}