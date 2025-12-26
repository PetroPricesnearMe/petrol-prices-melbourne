/**
 * Performance-Optimized Root Layout
 *
 * Features:
 * - Optimized script loading strategy
 * - Web Vitals tracking
 * - Proper meta tags for SEO and performance
 * - Performance monitoring
 * - Resource hints
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Suspense } from 'react';

import { Providers } from './providers';

import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { StructuredData } from '@/components/StructuredData';
import { AsyncCSSLoader } from '@/components/AsyncCSSLoader';
import {
  generateOrganizationSchema,
  generatePlatformLocalBusinessSchema,
  generateWebsiteSchema,
} from '@/lib/seo/schema-generator';

// Critical CSS - Inlined to prevent render blocking
const criticalCSS = `
/* Critical CSS - Above the fold styles only */
:root {
  --font-inter: 'Inter', system-ui, -apple-system, sans-serif;
  --font-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --color-primary-50: 239 246 255;
  --color-primary-100: 219 234 254;
  --color-primary-500: 59 130 246;
  --color-primary-600: 37 99 235;
  --color-primary-700: 29 78 216;
  --color-bg-primary: 255 255 255;
  --color-bg-secondary: 249 250 251;
  --color-text-primary: 17 24 39;
  --color-text-secondary: 75 85 99;
  --color-border: 229 231 235;
}
.dark {
  --color-bg-primary: 10 10 10;
  --color-bg-secondary: 23 23 23;
  --color-text-primary: 250 250 250;
  --color-text-secondary: 163 163 163;
  --color-border: 38 38 38;
}
* {
  border-color: rgb(var(--color-border));
}
html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
  max-width: 100%;
}
body {
  font-family: var(--font-inter), var(--font-system);
  background-color: rgb(var(--color-bg-primary));
  color: rgb(var(--color-text-primary));
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
  max-width: 100%;
  margin: 0;
  padding: 0;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-display: swap;
}
`;

// Defer non-critical CSS loading - Next.js will handle optimization
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevents invisible text during font load
  variable: '--font-inter',
  preload: true, // Preloads font for faster rendering
  adjustFontFallback: true, // Prevents layout shift during font load
  fallback: ['system-ui', '-apple-system', 'sans-serif'], // System font fallback
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
};

// SEO: Updated root layout metadata with "near me" keywords prioritized
export const metadata: Metadata = {
  title: {
    default: 'Live Petrol Prices Near Me Today | Cheap Fuel Melbourne',
    template: '%s | PetrolPricesNearMe',
  },
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
  authors: [{ name: 'Fuel Finder Team' }],
  creator: 'Fuel Finder',
  publisher: 'Fuel Finder',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://petrolpricesnearme.com.au'
  ),
  alternates: {
    canonical: 'https://petrolpricesnearme.com.au/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU', // og:locale
    url: 'https://petrolpricesnearme.com.au/', // og:url
    siteName: 'PetrolPricesNearMe',
    title: 'Live Petrol Prices Near Me Today | Cheap Fuel Melbourne', // og:title
    description:
      'Live petrol prices near me updated daily. Compare cheap fuel in Melbourne including E10, Unleaded 91, Premium and Diesel.', // og:description
    images: [
      {
        url: 'https://petrolpricesnearme.com.au/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fuel Finder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Petrol Prices Near Me Today | Cheap Fuel Melbourne',
    description:
      'Live petrol prices near me updated daily. Compare cheap fuel in Melbourne including E10, Unleaded 91, Premium and Diesel.',
    images: ['https://petrolpricesnearme.com.au/images/twitter-image.jpg'],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate Organization and WebSite schemas for all pages
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://petrolpricesnearme.com.au';
  const schemas = [
    generateOrganizationSchema(baseUrl),
    generateWebsiteSchema(baseUrl),
    generatePlatformLocalBusinessSchema(baseUrl),
  ];

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* 
          NOTE: Google Fonts preconnect removed - next/font handles optimization automatically.
          Removing unnecessary preconnect improves Core Web Vitals (FCP, LCP).
        */}

        {/* Critical CSS - Inlined to prevent render blocking (640ms savings) */}
        <style
          dangerouslySetInnerHTML={{
            __html: criticalCSS,
          }}
        />

        {/* Note: CSS optimization handled by AsyncCSSLoader component to avoid MIME type conflicts */}

        {/* Resource hints for external domains - non-blocking */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link
          rel="preconnect"
          href="https://pagead2.googlesyndication.com"
          crossOrigin="anonymous"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`antialiased ${inter.className}`}
        suppressHydrationWarning
      >
        {/* Structured Data - Organization and WebSite schemas */}
        <StructuredData data={schemas} />

        {/* Load non-critical CSS asynchronously to prevent render blocking */}
        <AsyncCSSLoader />

        {/* Main content */}
        <Providers>{children}</Providers>

        {/* Google Analytics - Non-blocking, privacy-focused, loads after page is interactive */}
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>

        {/* Google AdSense - Load after page is interactive to avoid blocking render */}
        {/* Using afterInteractive strategy to avoid data-nscript attribute in head */}
        <Script
          id="adsbygoogle"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7058906610673320"
          crossOrigin="anonymous"
        />

        {/* Performance Monitoring - After Interactive */}
        {process.env.NODE_ENV === 'production' && (
          <Script id="web-vitals" strategy="afterInteractive">
            {`
              (function() {
                if (typeof window === 'undefined') return;

                // Track Web Vitals
                if (typeof window !== 'undefined' && window.addEventListener) {
                  window.addEventListener('load', function() {
                    import('web-vitals').then(function(webVitals) {
                      webVitals.onCLS(trackMetric);
                      webVitals.onFID(trackMetric);
                      webVitals.onFCP(trackMetric);
                      webVitals.onLCP(trackMetric);
                      webVitals.onTTFB(trackMetric);
                      webVitals.onINP(trackMetric);
                    }).catch(function() {
                      // Web Vitals not available
                    });
                  });
                }

                function trackMetric(metric) {
                  // Send to analytics
                  if (typeof gtag !== 'undefined') {
                    gtag('event', metric.name, {
                      value: Math.round(metric.value),
                      event_label: metric.id,
                      non_interaction: true,
                    });
                  }

                  // Store in localStorage for dashboard
                  try {
                    var metrics = JSON.parse(localStorage.getItem('web-vitals') || '{}');
                    metrics[metric.name] = {
                      value: metric.value,
                      timestamp: Date.now()
                    };
                    localStorage.setItem('web-vitals', JSON.stringify(metrics));
                  } catch(e) {
                    // Ignore localStorage errors
                  }
                }
              })();
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
