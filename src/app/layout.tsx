import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import '@/styles/globals.css';

import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'Petrol Price Near Me | Find Cheapest Fuel Prices',
    template: '%s | Petrol Price Near Me',
  },
  description:
    'Find the cheapest petrol stations near you in Australia. Compare fuel prices, unleaded, diesel, premium, and LPG prices in real-time.',
  keywords: [
    'petrol prices',
    'fuel prices',
    'cheap petrol',
    'petrol stations',
    'Australia fuel',
    'diesel prices',
    'unleaded prices',
  ],
  authors: [{ name: 'Petrol Price Near Me' }],
  creator: 'Petrol Price Near Me',
  publisher: 'Petrol Price Near Me',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: '/',
    siteName: 'Petrol Price Near Me',
    title: 'Petrol Price Near Me | Find Cheapest Fuel Prices',
    description:
      'Find the cheapest petrol stations near you in Australia. Compare fuel prices in real-time.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Petrol Price Near Me',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Petrol Price Near Me | Find Cheapest Fuel Prices',
    description:
      'Find the cheapest petrol stations near you in Australia. Compare fuel prices in real-time.',
    images: ['/images/twitter-image.jpg'],
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-gray-50 font-sans antialiased dark:bg-gray-900">
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}

