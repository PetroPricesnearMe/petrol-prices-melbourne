/**
 * CMS Example Page - Server Component with ISR
 *
 * Demonstrates:
 * - Server-side data fetching
 * - Incremental Static Regeneration (ISR)
 * - Error handling with fallbacks
 * - Production-ready patterns
 */

import { Metadata } from 'next';
import { getCMS } from '@/lib/cms';
import { withFallback } from '@/lib/cms/error-handler';
import { CMSErrorBoundary } from '@/components/cms/CMSErrorBoundary';
import { CMSContent } from '@/components/cms/CMSContent';

// Enable ISR - revalidate every hour
export const revalidate = 3600;

// Runtime configuration
export const runtime = 'nodejs';

// Dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'CMS Content | Dynamic Content Example',
    description: 'Example page demonstrating dynamic CMS content with ISR',
    openGraph: {
      title: 'CMS Content',
      description: 'Dynamic content from CMS',
      type: 'website',
    },
  };
}

/**
 * Station type (example)
 */
interface Station {
  id: string;
  name: string;
  address: string;
  price?: number;
  brand?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Fetch data server-side with error handling
 */
async function fetchStations() {
  const cms = getCMS();

  return withFallback(
    () => cms.fetchAll<Station>('stations', { pageSize: 20 }),
    {
      getFallback: () => ({
        data: [],
        total: 0,
        page: 1,
        pageSize: 20,
        hasMore: false,
      }),
      onError: (error) => {
        console.error('Failed to fetch stations:', error);
      },
    }
  );
}

/**
 * Server Component - Automatically uses ISR
 */
export default async function CMSExamplePage() {
  // Fetch data server-side
  const stations = await fetchStations();

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dynamic CMS Content
          </h1>
          <p className="mt-2 text-gray-600">
            This page demonstrates server-side rendering with ISR (revalidates
            every hour)
          </p>
          <div className="bg-blue-50 mt-4 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="text-blue-600 h-5 w-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-blue-700 text-sm">
                <strong>ISR Enabled:</strong> This page is statically generated
                and revalidated every hour. Data is cached at the edge for
                optimal performance.
              </div>
            </div>
          </div>
        </div>

        {/* Content with Error Boundary */}
        <CMSErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
          <CMSContent
            data={stations.data}
            isLoading={false}
            emptyMessage="No stations available"
            renderItem={(station, index) => (
              <StationCard key={station.id} station={station} />
            )}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            aria-label="List of stations"
          />
        </CMSErrorBoundary>

        {/* Pagination Info */}
        {stations.total > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            Showing {stations.data.length} of {stations.total} stations
          </div>
        )}
      </div>
    </main>
  );
}

/**
 * Station Card Component
 */
function StationCard({ station }: { station: Station }) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <h2 className="text-lg font-semibold text-gray-900">{station.name}</h2>

      {station.brand && (
        <div className="mt-2">
          <span className="bg-blue-100 text-blue-800 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
            {station.brand}
          </span>
        </div>
      )}

      <p className="mt-3 text-sm text-gray-600">{station.address}</p>

      {station.price && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm text-gray-500">Current Price:</span>
          <span className="text-green-600 text-xl font-bold">
            ${station.price.toFixed(2)}/L
          </span>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-400">
        Updated: {new Date(station.updatedAt).toLocaleDateString()}
      </div>
    </article>
  );
}
