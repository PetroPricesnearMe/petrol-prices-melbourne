import type { Metadata } from 'next';
import Link from 'next/link';

import {
  getFuelBrandsFromFairFuel,
  isFairFuelConfigured,
} from '@/lib/fairfuel/service';

export const metadata: Metadata = {
  title:
    'All Fuel Brands in Melbourne | Compare Prices by Brand | Petrol Price Near Me',
  description:
    'Compare fuel prices across all major and independent brands in Melbourne. Find the best prices for BP, Shell, Caltex, Ampol, 7-Eleven, United, Liberty, Metro, Costco and more.',
  keywords: [
    'fuel brands melbourne',
    'BP petrol prices',
    'Shell fuel prices',
    'Caltex prices',
    'Ampol prices',
    '7-Eleven fuel',
    'independent fuel stations',
    'major fuel brands',
    'compare fuel brands',
  ],
  openGraph: {
    title: 'All Fuel Brands in Melbourne | Compare Prices by Brand',
    description:
      'Compare fuel prices across all major and independent brands in Melbourne.',
    type: 'website',
  },
};

export default async function FuelBrandsPage() {
  let brands: Array<{
    id: string;
    name: string;
    type: 'major' | 'independent';
  }> = [];
  let hasData = false;

  if (await isFairFuelConfigured()) {
    try {
      brands = await getFuelBrandsFromFairFuel();
      hasData = brands.length > 0;
    } catch (error) {
      console.error('Failed to fetch fuel brands:', error);
    }
  }

  const majorBrands = brands.filter((b) => b.type === 'major');
  const independentBrands = brands.filter((b) => b.type === 'independent');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
              All Fuel Brands in Melbourne
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
              Compare fuel prices across all major and independent fuel brands.
              Find the best deals from your preferred brand or discover new
              options.
            </p>
          </div>

          {/* API Benefits Section */}
          <div className="mb-12 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 p-8 text-white">
            <h2 className="mb-4 text-2xl font-bold">
              Powered by Official Service Victoria Data
            </h2>
            <p className="mb-4 text-lg">
              Our fuel brand data comes directly from the Fair Fuel Open Data
              API, providing you with comprehensive, accurate information about
              all registered fuel stations in Victoria.
            </p>
            <ul className="list-inside list-disc space-y-2 text-primary-50">
              <li>Complete coverage of all major and independent brands</li>
              <li>Official government data updated daily</li>
              <li>Accurate brand classifications and information</li>
              <li>Transparent pricing across all brands</li>
            </ul>
          </div>

          {/* Major Brands */}
          {hasData && majorBrands.length > 0 && (
            <section className="mb-12">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                Major Fuel Brands
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {majorBrands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/directory?brand=${encodeURIComponent(brand.name)}`}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:border-primary-500 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {brand.name}
                      </h3>
                      <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                        Major
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Compare prices at all {brand.name} stations across
                      Melbourne
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Independent Brands */}
          {hasData && independentBrands.length > 0 && (
            <section>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                Independent Fuel Brands
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {independentBrands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/directory?brand=${encodeURIComponent(brand.name)}`}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:border-secondary-500 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {brand.name}
                      </h3>
                      <span className="rounded-full bg-secondary-100 px-3 py-1 text-sm font-semibold text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300">
                        Independent
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Find competitive prices at {brand.name} stations
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Fallback if no data */}
          {!hasData && (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Brand information is being loaded. Please check back soon.
              </p>
              <Link
                href="/directory"
                className="mt-6 inline-block rounded-lg bg-primary-600 px-6 py-3 text-white transition-colors hover:bg-primary-700"
              >
                Browse All Stations
              </Link>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12 rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Ready to Find the Best Prices?
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Start comparing prices across all brands and save money on every
              fill-up.
            </p>
            <Link
              href="/directory"
              className="inline-block rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:from-primary-700 hover:to-secondary-700 hover:shadow-xl"
            >
              Compare Prices Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
