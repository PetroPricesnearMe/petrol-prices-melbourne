/**
 * SEO Metadata Generator for Melbourne Listing Page
 */

import type { Metadata } from 'next';

export function generateMelbourneListingMetadata(): Metadata {
  const title = 'Melbourne Petrol Prices - Find Cheapest Fuel Stations Near You | PetrolPricesNearMe.com.au';
  const description = 'Compare real-time petrol prices in Melbourne, Victoria. Find the cheapest fuel stations near you with U91, E10, U95, U98, and Diesel prices. Get directions, station services, opening hours, and reviews.';
  const url = 'https://petrolpricenearme.com.au/melbourne';
  const keywords = [
    'petrol price Melbourne',
    'fuel near me Melbourne',
    'cheapest petrol Melbourne',
    'Melbourne fuel prices',
    'petrol stations Melbourne',
    'fuel prices Victoria',
    'unleaded price Melbourne',
    'diesel price Melbourne',
    'premium fuel Melbourne',
    'petrol station finder Melbourne',
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Petrol Prices Near Me',
      locale: 'en_AU',
      type: 'website',
      images: [
        {
          url: '/images/og/melbourne-petrol-prices.jpg',
          width: 1200,
          height: 630,
          alt: 'Melbourne Petrol Prices - Find Cheapest Fuel Stations',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/og/melbourne-petrol-prices.jpg'],
    },
    alternates: {
      canonical: url,
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
}


