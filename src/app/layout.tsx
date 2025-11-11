/**
 * Root Layout - Production-Ready Architecture
 *
 * This is the root layout component that wraps all pages in the application.
 * It handles global configuration including:
 * 
 * - Font optimization with next/font
 * - Global metadata and SEO
 * - Theme configuration
 * - Analytics and performance monitoring
 * - Global providers (theme, query client, etc.)
 * 
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts}
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

import { Providers } from './providers';
import { defaultMetadata, siteConfig } from '@/config/metadata';
import '@/styles/globals.css';

/**
 * Font Configuration
 * 
 * Inter is loaded with optimal settings:
 * - Subset: Latin characters only
 * - Display: swap (prevent invisible text during load)
 * - Variable: CSS variable for easy access
 * - Preload: Load font ASAP for faster rendering
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
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
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      className={inter.variable} 
      suppressHydrationWarning
    >
      <head>
        {/* 
          Resource Hints
          Note: next/font handles font optimization automatically.
          Only add preconnect for external domains we fetch from.
        */}
        
        {/* DNS Prefetch for external services (if needed) */}
        {/* <link rel="dns-prefetch" href="https://api.example.com" /> */}
        
        {/* Preconnect for critical third-party origins */}
        {/* <link rel="preconnect" href="https://api.example.com" crossOrigin="anonymous" /> */}
      </head>
      
      <body 
        className={`antialiased ${inter.className}`} 
        suppressHydrationWarning
      >
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>

        {/* Global Providers (Theme, Query Client, etc.) */}
        <Providers>
          {/* Main content wrapper */}
          <div id="main-content">
            {children}
          </div>
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
