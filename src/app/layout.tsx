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
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
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

export const metadata: Metadata = {
  title: {
    default: 'Fuel Finder - Find the Cheapest Petrol Near You',
    template: '%s | Fuel Finder',
  },
  description: 'Find the cheapest petrol prices near you with real-time updates from 250+ stations across Melbourne.',
  keywords: ['petrol', 'fuel', 'prices', 'gas station', 'melbourne', 'australia'],
  authors: [{ name: 'Fuel Finder Team' }],
  creator: 'Fuel Finder',
  publisher: 'Fuel Finder',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://petrolpricenearme.com.au'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: '/',
    siteName: 'Fuel Finder',
    title: 'Fuel Finder - Find the Cheapest Petrol Near You',
    description: 'Find the cheapest petrol prices near you with real-time updates.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fuel Finder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fuel Finder - Find the Cheapest Petrol Near You',
    description: 'Find the cheapest petrol prices near you with real-time updates.',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`antialiased ${inter.className}`}>
        {/* Critical CSS loaded inline above the fold */}

        {/* Main content */}
        <Providers>
          {children}
        </Providers>

        {/* Performance Monitoring - After Interactive */}
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="web-vitals"
            strategy="afterInteractive"
          >
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
