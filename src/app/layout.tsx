/**
 * Root Layout - Production-Ready Architecture with Performance Optimization
 *
 * This is the root layout component that wraps all pages in the application.
 * It handles global configuration including:
 *
 * - Font optimization with next/font
 * - Global metadata and SEO
 * - Theme configuration
 * - Analytics and performance monitoring (Vercel Analytics + GA4)
 * - Global providers (theme, query client, etc.)
 * - Resource hints for optimal loading
 *
 * Performance Optimizations:
 * - Vercel Analytics for Core Web Vitals tracking
 * - Vercel Speed Insights for performance monitoring
 * - Optimized font loading with next/font
 * - Resource hints for critical resources
 * - Web Vitals tracking with analytics integration
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts}
 */

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

import { defaultMetadata, siteConfig } from '@/config/metadata';

import { Providers } from './providers';
import '@/styles/globals.css';

/**
 * Font Configuration - Optimized for Performance
 *
 * Inter is loaded with optimal settings:
 * - Subset: Latin characters only (reduces font size)
 * - Display: swap (prevents invisible text during load)
 * - Variable: CSS variable for easy access
 * - Preload: Load font ASAP for faster rendering
 * - Fallback: System fonts for instant text rendering
 *
 * Performance Impact:
 * - Prevents FOIT (Flash of Invisible Text)
 * - Reduces CLS (Cumulative Layout Shift)
 * - Improves LCP (Largest Contentful Paint)
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Arial',
    'sans-serif',
  ],
  adjustFontFallback: true,
});

/**
 * Viewport Configuration
 *
 * Defines how the page should be rendered on mobile devices.
 * Includes responsive theme colors for light/dark mode.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
};

/**
 * Metadata Configuration
 *
 * Comprehensive SEO and social media metadata.
 * Centralized in @/config/metadata for easy maintenance.
 */
export const metadata: Metadata = defaultMetadata;

/**
 * Root Layout Props
 */
interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root Layout Component
 *
 * The main layout wrapper for the entire application.
 * Provides global context, styles, and scripts.
 *
 * Performance Features:
 * - Vercel Analytics for real-time Core Web Vitals
 * - Vercel Speed Insights for performance monitoring
 * - Web Vitals tracking with GA4 integration
 * - Resource hints for optimal loading
 * - Optimized font loading
 */
export default function RootLayout({ children }: RootLayoutProps) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* 
          Resource Hints for Performance Optimization
          These hints help browsers prioritize and prefetch critical resources
        */}

        {/* DNS Prefetch for external services */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Preconnect for critical third-party origins */}
        {gaMeasurementId && (
          <>
            <link
              rel="preconnect"
              href="https://www.google-analytics.com"
              crossOrigin="anonymous"
            />
            <link
              rel="preconnect"
              href="https://www.googletagmanager.com"
              crossOrigin="anonymous"
            />
          </>
        )}
<<<<<<< Current (Your changes)
<<<<<<< Current (Your changes)
<<<<<<< Current (Your changes)

<<<<<<< Current (Your changes)
        {/* Note: Inter font is loaded via next/font (see Inter config above). */}
        {/* We intentionally avoid preloading a local /fonts/inter-var.woff2 file */}
        {/* because no such asset exists in /public/fonts, which caused 404s. */}
=======
        {/* Preload critical resources */}
        {/*
          NOTE: We intentionally avoid preloading a specific Inter font
          file like `/fonts/inter-var.woff2` here.
          
          The `next/font/google` integration already handles optimal
          font loading and generates hashed font assets under
          `/_next/static/`. Referencing a hard-coded file path can lead
          to 404s (e.g. `inter-var.woff2` missing) and noisy console
          warnings, without improving performance.
        */}
>>>>>>> Incoming (Background Agent changes)
=======
>>>>>>> Incoming (Background Agent changes)
=======
>>>>>>> Incoming (Background Agent changes)
=======
>>>>>>> Incoming (Background Agent changes)
      </head>

      <body
        className={`antialiased ${inter.className}`}
        suppressHydrationWarning
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Skip to main content"
        >
          Skip to main content
        </a>

        {/* Global Providers (Theme, Query Client, etc.) */}
        <Providers>
          {/* Main content wrapper */}
          <main id="main-content" role="main">
            {children}
          </main>
        </Providers>

        {/* Vercel Analytics - Core Web Vitals Tracking */}
        <Analytics />

        {/* Vercel Speed Insights - Performance Monitoring */}
        <SpeedInsights />

        {/* Google Analytics 4 - Only if measurement ID is provided */}
        {gaMeasurementId && (
          <>
            {/* Google Analytics Script */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', {
                  page_path: window.location.pathname,
                  send_page_view: true,
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=None;Secure',
                });
              `}
            </Script>
          </>
        )}

        {/* Web Vitals Tracking - Enhanced Performance Monitoring */}
        {process.env.NODE_ENV === 'production' && (
          <Script id="web-vitals" strategy="afterInteractive">
            {`
              (function() {
                if (typeof window === 'undefined') return;

                // Track Web Vitals
                if (typeof window !== 'undefined' && window.addEventListener) {
                  window.addEventListener('load', function() {
                    // Dynamically import web-vitals to reduce initial bundle size
                    import('web-vitals').then(function(webVitals) {
                      // Track all Core Web Vitals
                      webVitals.onCLS(function(metric) {
                        trackMetric('CLS', metric.value, metric.id);
                      });
                      webVitals.onFID(function(metric) {
                        trackMetric('FID', metric.value, metric.id);
                      });
                      webVitals.onFCP(function(metric) {
                        trackMetric('FCP', metric.value, metric.id);
                      });
                      webVitals.onLCP(function(metric) {
                        trackMetric('LCP', metric.value, metric.id);
                      });
                      webVitals.onTTFB(function(metric) {
                        trackMetric('TTFB', metric.value, metric.id);
                      });
                      webVitals.onINP(function(metric) {
                        trackMetric('INP', metric.value, metric.id);
                      });
                    }).catch(function(error) {
                      // Web Vitals not available, fail silently
                      if (process.env.NODE_ENV === 'development') {
                        console.warn('Web Vitals not available:', error);
                      }
                    });
                  });
                }

                function trackMetric(name, value, id) {
                  // Send to Google Analytics if available
                  if (typeof gtag !== 'undefined') {
                    gtag('event', name, {
                      value: Math.round(name === 'CLS' ? value * 1000 : value),
                      event_label: id,
                      non_interaction: true,
                      metric_value: value,
                      metric_id: id,
                    });
                  }

                  // Send to Vercel Analytics (automatic with @vercel/analytics)
                  
                  // Store in localStorage for debugging
                  try {
                    var metrics = JSON.parse(localStorage.getItem('web-vitals') || '{}');
                    metrics[name] = {
                      value: value,
                      id: id,
                      timestamp: Date.now()
                    };
                    localStorage.setItem('web-vitals', JSON.stringify(metrics));
                  } catch(e) {
                    // Ignore localStorage errors
                  }

                  // Log in development
                  if (process.env.NODE_ENV === 'development') {
                    console.log('[Web Vitals]', name + ':', Math.round(name === 'CLS' ? value * 1000 : value) + (name === 'CLS' ? ' (scaled)' : 'ms'));
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
