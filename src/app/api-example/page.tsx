/**
 * API Integration Example Page
 *
 * Demonstrates:
 * - Server Components with ISR
 * - Dynamic data fetching from multiple providers
 * - Loading, error, and empty states
 * - Client-side interactivity
 *
 * @page
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';

import { StationList } from '@/components/api/StationList';
import { StationListLoading } from '@/components/api/StationListLoading';
import { getStations, getActiveProviderName } from '@/lib/api/data-providers';

// ============================================================================
// Metadata
// ============================================================================

export const metadata: Metadata = {
  title: 'API Integration Example | Dynamic Stations',
  description:
    'Example page demonstrating API integration with ISR, multiple data providers, and dynamic React components',
  robots: {
    index: false, // Don't index example pages
    follow: false,
  },
};

// ============================================================================
// ISR Configuration
// ============================================================================

/**
 * Incremental Static Regeneration (ISR)
 *
 * - Revalidates every hour (3600 seconds)
 * - Pages are statically generated at build time
 * - After revalidation period, next request triggers regeneration in background
 * - Serves stale content while regenerating (stale-while-revalidate)
 */
export const revalidate = 3600; // 1 hour

// ============================================================================
// Server Component
// ============================================================================

/**
 * API Example Page
 *
 * This is a Server Component that:
 * - Fetches data at request time (with ISR caching)
 * - Supports multiple data providers (Baserow, Airtable, Supabase, REST)
 * - Automatically falls back if primary provider fails
 * - Passes data to client components for interactivity
 */
export default async function APIExamplePage() {
  // Fetch data using Server Component
  // This runs on the server, with ISR caching
  let stations = [];
  let error: Error | null = null;
  let providerName = 'none';

  try {
    providerName = getActiveProviderName();
    stations = await getStations({
      revalidate: 3600, // 1 hour cache
      tags: ['stations'], // Cache tag for targeted revalidation
      fallback: true, // Enable automatic fallback
    });
  } catch (err) {
    // Error will be handled by StationList component
    error = err instanceof Error ? err : new Error(String(err));
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              API Integration Example
            </h1>
            <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">
              This page demonstrates dynamic data fetching with ISR, multiple
              data providers, and comprehensive error handling.
            </p>

            {/* Provider info */}
            <div className="inline-flex items-center gap-2 rounded-lg bg-primary-50 px-4 py-2 dark:bg-primary-900/30">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Provider:
              </span>
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                {providerName}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Features list */}
        <section className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Features Demonstrated
          </h2>
          <ul className="grid grid-cols-1 gap-3 text-sm text-gray-600 dark:text-gray-300 md:grid-cols-2">
            <li className="flex items-start gap-2">
              <svg
                className="text-green-500 mt-0.5 h-5 w-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Server Components with ISR (1 hour revalidation)</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="text-green-500 mt-0.5 h-5 w-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Multiple data providers (Baserow, Airtable, Supabase, REST)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="text-green-500 mt-0.5 h-5 w-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Automatic fallback between providers</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="text-green-500 mt-0.5 h-5 w-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Loading, error, and empty states</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="text-green-500 mt-0.5 h-5 w-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>WCAG 2.1 AA accessible components</span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="text-green-500 mt-0.5 h-5 w-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Request deduplication with React cache</span>
            </li>
          </ul>
        </section>

        {/* Station list with Suspense boundary */}
        <Suspense fallback={<StationListLoading count={6} />}>
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              Stations ({stations.length})
            </h2>
            <StationList
              stations={stations}
              isLoading={false}
              error={error}
              onStationClick={(station) => {
                console.log('Station clicked:', station);
              }}
              columns={{
                mobile: 1,
                tablet: 2,
                desktop: 3,
              }}
            />
          </section>
        </Suspense>
      </main>
    </div>
  );
}
