/**
 * Optimized _app.tsx
 * Performance-optimized application wrapper
 */

import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Critical CSS only
import '../src/index.css';
import '../src/styles/normalize.css';

// Web Vitals tracking
import { initWebVitals, reportWebVitals } from '../lib/performance/webVitals';

// Lazy load non-critical components
const NetworkStatus = dynamic(() => import('../src/components/NetworkStatus'), {
  ssr: false,
});

const ErrorBoundary = dynamic(() => import('../src/components/ErrorBoundary'), {
  ssr: true,
});

// Lazy load layout components
const NavbarNext = dynamic(() => import('../components/layout/NavbarNext'), {
  ssr: true,
  loading: () => <div className="h-16 bg-gray-100 animate-pulse" />,
});

// Analytics
const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(mod => mod.Analytics),
  { ssr: false }
);

const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then(mod => mod.SpeedInsights),
  { ssr: false }
);

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Initialize performance monitoring
  useEffect(() => {
    initWebVitals();

    // Track route changes
    const handleRouteChange = (url: string) => {
      // Track with analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
          page_path: url,
        });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Preload critical resources
  useEffect(() => {
    // Preconnect to external domains
    const preconnectDomains = [
      'https://api.baserow.io',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });
  }, []);

  return (
    <>
      <Head>
        {/* Essential meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta charSet="utf-8" />
        
        {/* Performance hints */}
        <link rel="preconnect" href="https://api.baserow.io" />
        <link rel="dns-prefetch" href="https://api.baserow.io" />
      </Head>

      <ErrorBoundary>
        <div className="App">
          {/* Skip to main content for accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          {/* Network status - only on client side */}
          <NetworkStatus />

          {/* Header with navigation */}
          <header role="banner">
            <NavbarNext />
          </header>

          {/* Main content area */}
          <main id="main-content" role="main" tabIndex={-1}>
            <Component {...pageProps} />
          </main>

          {/* Analytics - only in production */}
          {process.env.NODE_ENV === 'production' && (
            <>
              <Analytics />
              <SpeedInsights />
            </>
          )}
        </div>
      </ErrorBoundary>
    </>
  );
}

// Report Web Vitals
export function reportWebVitalsHandler(metric: any) {
  reportWebVitals(metric);
}

export default MyApp;

