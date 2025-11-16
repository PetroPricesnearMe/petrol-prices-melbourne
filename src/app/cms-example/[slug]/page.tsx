/**
 * CMS Dynamic Page - Server Component with Dynamic Params
 *
 * Demonstrates:
 * - Dynamic route generation with generateStaticParams
 * - Server-side data fetching by slug
 * - ISR with on-demand revalidation
 * - 404 handling
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CMSErrorBoundary } from '@/components/cms/CMSErrorBoundary';
import { getCMS } from '@/lib/cms';
import { withFallback } from '@/lib/cms/error-handler';

// Enable ISR
export const revalidate = 3600;

interface Station {
  id: string;
  name: string;
  slug: string;
  address: string;
  description?: string;
  price?: number;
  brand?: string;
  amenities?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static params for pre-rendering
 */
export async function generateStaticParams() {
  try {
    const cms = getCMS();
    const stations = await cms.fetchAll<Station>('stations', { pageSize: 100 });

    return stations.data
      .filter((station) => station.slug)
      .map((station) => ({
        slug: station.slug,
      }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const cms = getCMS();
    const station = await cms.fetchBySlug<Station>('stations', slug);

    if (!station) {
      return {
        title: 'Station Not Found',
      };
    }

    return {
      title: `${station.name} | Station Details`,
      description: station.description || `Details for ${station.name}`,
      openGraph: {
        title: station.name,
        description: station.description || `Details for ${station.name}`,
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'Station Details',
    };
  }
}

/**
 * Fetch station data
 */
async function fetchStation(slug: string) {
  const cms = getCMS();

  return withFallback(() => cms.fetchBySlug<Station>('stations', slug), {
    getFallback: () => null,
    onError: (error) => {
      console.error('Failed to fetch station:', error);
    },
  });
}

/**
 * Server Component
 */
export default async function StationPage({ params }: PageProps) {
  const { slug } = await params;
  const station = await fetchStation(slug);

  // Handle 404
  if (!station) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <a
                href="/cms-example"
                className="text-blue-600 hover:text-blue-800"
              >
                Stations
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-600" aria-current="page">
              {station.name}
            </li>
          </ol>
        </nav>

        <CMSErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
          <article className="rounded-lg border border-gray-200 bg-white shadow-lg">
            {/* Header */}
            <div className="from-blue-50 to-indigo-50 border-b border-gray-200 bg-gradient-to-r p-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {station.name}
              </h1>

              {station.brand && (
                <div className="mt-3">
                  <span className="bg-blue-100 text-blue-800 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium">
                    {station.brand}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Price */}
              {station.price && (
                <div className="bg-green-50 mb-6 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-700">
                      Current Price
                    </span>
                    <span className="text-green-600 text-4xl font-bold">
                      ${station.price.toFixed(2)}
                      <span className="text-green-700 text-xl">/L</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Description */}
              {station.description && (
                <div className="mb-6">
                  <h2 className="mb-3 text-lg font-semibold text-gray-900">
                    Description
                  </h2>
                  <p className="text-gray-700">{station.description}</p>
                </div>
              )}

              {/* Address */}
              <div className="mb-6">
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  Location
                </h2>
                <p className="flex items-start gap-2 text-gray-700">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {station.address}
                </p>
              </div>

              {/* Amenities */}
              {station.amenities && station.amenities.length > 0 && (
                <div className="mb-6">
                  <h2 className="mb-3 text-lg font-semibold text-gray-900">
                    Amenities
                  </h2>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {station.amenities.map((amenity, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <svg
                          className="text-green-500 h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metadata */}
              <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>
                    Last updated: {new Date(station.updatedAt).toLocaleString()}
                  </span>
                  <span>ID: {station.id}</span>
                </div>
              </div>
            </div>
          </article>
        </CMSErrorBoundary>
      </div>
    </main>
  );
}
