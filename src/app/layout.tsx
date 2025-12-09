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

import { Providers } from './providers';

import { StructuredData } from '@/components/StructuredData';
import {
  generateOrganizationSchema,
  generatePlatformLocalBusinessSchema,
  generateWebsiteSchema,
} from '@/lib/seo/schema-generator';

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

// SEO: Updated root layout metadata with keyword strategy
export const metadata: Metadata = {
  title: {
    default: 'Petrol prices today | Cheapest fuel near me | PetrolPricesNearMe',
    template: '%s | PetrolPricesNearMe',
  },
  description:
    'Find live petrol prices near you today. Compare cheapest fuel prices from 250+ stations across Australia. Petrol prices today, fuel prices today, live petrol prices Melbourne. Updated daily.',
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
    title: 'Petrol prices today | Cheapest fuel near me | PetrolPricesNearMe', // og:title
    description:
      'Find live petrol prices near you today. Compare cheapest fuel prices from 250+ stations across Australia. Updated daily.', // og:description
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
    title: 'Petrol prices today | Cheapest fuel near me | PetrolPricesNearMe',
    description:
      'Find live petrol prices near you today. Compare cheapest fuel prices from 250+ stations across Australia.',
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

        {/* Critical CSS loaded inline above the fold */}

        {/* Main content */}
        <Providers>{children}</Providers>

        {/* Google AdSense - Load after page is interactive to avoid blocking render */}
        <Script
          id="adsbygoogle"
          strategy="lazyOnload"
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
