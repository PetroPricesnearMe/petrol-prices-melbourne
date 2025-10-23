import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import '../styles/globals.css';
import '../styles/accessibility/focus-visible.css';
import '../styles/brand-styles.css';
import { SkipToContent } from '@/components/accessibility';

import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Petrol Price Near Me | Find Cheapest Fuel in Melbourne',
    template: '%s | Petrol Price Near Me',
  },
  description: 'Compare live petrol prices from 250+ stations in Melbourne. Save up to 20c/L with real-time fuel price updates.',
  keywords: ['petrol prices', 'fuel prices', 'melbourne', 'gas stations', 'fuel comparison'],
  authors: [{ name: 'Petrol Price Near Me' }],
  creator: 'Petrol Price Near Me',
  publisher: 'Petrol Price Near Me',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: '/',
    siteName: 'Petrol Price Near Me',
    title: 'Find Cheapest Fuel in Melbourne',
    description: 'Compare live petrol prices from 250+ stations',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Petrol Price Near Me',
    description: 'Find the cheapest fuel in Melbourne',
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
        </Providers>
      </body>
    </html>
  );
}
