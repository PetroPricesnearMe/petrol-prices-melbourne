import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';

import '../styles/globals.css';
import '../styles/accessibility/focus-visible.css';
import '../styles/brand-styles.css';
import '../styles/brand-colors.css';
import { SkipToContent } from '@/components/accessibility';
import { CookieConsent } from '@/components/analytics/CookieConsent';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { PerformanceMonitor } from '@/components/common/PerformanceMonitor';

import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Petrol Price Near Me | Find Cheapest Fuel in Melbourne | Live Price Comparison',
    template: '%s | Petrol Price Near Me',
  },
  description: 'Compare live petrol prices from 250+ stations in Melbourne. Save up to 20c/L with real-time fuel price updates. Find the cheapest unleaded, diesel & premium near you today!',
  keywords: [
    'melbourne petrol prices',
    'cheapest fuel melbourne',
    'petrol prices near me',
    'fuel price comparison melbourne',
    'live petrol prices',
    'melbourne fuel prices today',
    'petrol stations melbourne',
    'diesel prices melbourne',
    'unleaded prices melbourne',
    'e10 prices melbourne',
    '91 octane melbourne',
    '95 octane melbourne',
    '98 octane melbourne',
    'fuel prices victoria',
    'petrol price finder',
    'gas station prices',
    'fuel comparison tool',
    'cheap petrol melbourne',
    'real-time fuel prices',
    'petrol price tracker'
  ],
  authors: [{ name: 'Petrol Price Near Me Team' }],
  creator: 'Petrol Price Near Me',
  publisher: 'Petrol Price Near Me',
  category: 'Automotive',
  classification: 'Fuel Price Comparison Service',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au'),
  alternates: {
    canonical: '/',
    languages: {
      'en-AU': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: '/',
    siteName: 'Petrol Price Near Me',
    title: 'Find Cheapest Fuel in Melbourne | Live Price Comparison',
    description: 'Compare live petrol prices from 250+ stations in Melbourne. Save up to 20c/L with real-time fuel price updates. Find the cheapest unleaded, diesel & premium near you today!',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Petrol Price Near Me - Find Cheapest Fuel in Melbourne',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@PetrolPricesNearMe',
    creator: '@PetrolPricesNearMe',
    title: 'Find Cheapest Fuel in Melbourne | Live Price Comparison',
    description: 'Compare live petrol prices from 250+ stations in Melbourne. Save up to 20c/L with real-time fuel price updates.',
    images: ['/images/twitter-card.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  other: {
    'msapplication-TileColor': '#667eea',
    'theme-color': '#667eea',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Petrol Price Near Me',
    'application-name': 'Petrol Price Near Me',
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#667eea' },
    { media: '(prefers-color-scheme: dark)', color: '#1e3a8a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {/* Skip Navigation */}
          <SkipToContent
            links={[
              { href: '#main-content', label: 'Skip to main content' },
              { href: '#navigation', label: 'Skip to navigation' },
              { href: '#footer', label: 'Skip to footer' },
            ]}
          />

          {/* Screen Reader Announcements */}
          <div
            id="sr-announcements"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          />

          {/* Navigation */}
          <nav id="navigation" aria-label="Main navigation">
            {/* Navigation content will be injected by child pages */}
          </nav>

          {/* Main Content */}
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>

          {/* Footer */}
          <footer id="footer" aria-label="Site footer">
            {/* Footer content will be injected by child pages */}
          </footer>

          {/* Analytics - Privacy-focused, bot-excluding, consent-based */}
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>
          <CookieConsent />
          <Analytics />
          <SpeedInsights />

          {/* Performance Monitoring */}
          <PerformanceMonitor />
        </Providers>
      </body>
    </html>
  );
}
