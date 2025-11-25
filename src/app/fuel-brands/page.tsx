import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';

import { StructuredData } from '@/components/StructuredData';
import {
  getFuelBrandsFromFairFuel,
  isFairFuelConfigured,
} from '@/lib/fairfuel/service';
import {
  generateOrganizationSchema,
  generatePlatformLocalBusinessSchema,
  generateWebsiteSchema,
} from '@/lib/seo/schema-generator';

// Force dynamic rendering since we're fetching from API
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title:
    'All Fuel Brands in Melbourne | Compare Prices by Brand | Petrol Price Near Me',
  description:
    'Compare fuel prices across all major and independent brands in Melbourne. Find the best prices for BP, Shell, Caltex, Ampol, 7-Eleven, United, Liberty, Metro, Costco and more. Save money by comparing prices across different fuel brands.',
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
    'cheapest fuel brand melbourne',
    'fuel brand comparison',
    'best fuel brand prices',
    'melbourne fuel stations by brand',
  ],
  openGraph: {
    title: 'All Fuel Brands in Melbourne | Compare Prices by Brand',
    description:
      'Compare fuel prices across all major and independent brands in Melbourne. Find the cheapest fuel by brand and save money on every fill-up.',
    type: 'website',
    images: [
      {
        url: '/images/fuel-brands-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Melbourne Fuel Brands Comparison',
      },
    ],
  },
  alternates: {
    canonical: '/fuel-brands',
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

  // Generate structured data
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';
  const schemas = [
    generateOrganizationSchema(baseUrl),
    generateWebsiteSchema(baseUrl),
    generatePlatformLocalBusinessSchema(baseUrl),
  ];

  return (
    <Fragment>
      <StructuredData data={schemas} />
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

            {/* Internal Linking - Related Resources */}
            <div className="mb-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                Related Resources
              </h2>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/fuel-types"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  → Fuel Types Guide
                </Link>
                <Link
                  href="/blog"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  → Fuel Saving Tips
                </Link>
                <Link
                  href="/directory"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  → Browse All Stations
                </Link>
                <Link
                  href="/how-pricing-works"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  → How Fuel Pricing Works
                </Link>
              </div>
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
            <ul className="mb-6 list-inside list-disc space-y-2 text-primary-50">
              <li>Complete coverage of all major and independent brands</li>
              <li>Official government data updated daily</li>
              <li>Accurate brand classifications and information</li>
              <li>Transparent pricing across all brands</li>
            </ul>
            {/* Required Attribution Notice */}
            <div className="mt-4 border-t border-white/20 pt-4">
              <p className="text-sm text-primary-50">
                © State of Victoria accessed via the{' '}
                <a
                  href="https://www.service.vic.gov.au/find-services/business/fuel-retailers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white"
                  aria-label="Service Victoria Platform (opens in new tab)"
                >
                  Victorian Government Service Victoria Platform
                </a>
              </p>
            </div>
          </div>

          {/* Brand Insights Section */}
          <section className="mb-12 rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                  Melbourne Brand Insights
                </h2>
                <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">
                  Use this quick reference to understand how major and independent brands perform
                  across pricing, loyalty rewards, and premium amenities. Each insight links to a
                  deeper resource so you can move from research to action in a single session.
                </p>
                <ul className="list-disc space-y-2 pl-5 text-gray-600 dark:text-gray-400">
                  <li>
                    Track brand-specific loyalty wins with the{' '}
                    <Link
                      href="/blog/maximize-fuel-rewards-programs"
                      className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
                    >
                      rewards stacking guide
                    </Link>
                    .
                  </li>
                  <li>
                    Compare supply hotspots in the{' '}
                    <Link
                      href="/blog/regional-fuel-price-strategy"
                      className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
                    >
                      regional pricing playbook
                    </Link>
                    .
                  </li>
                  <li>
                    Filter for restrooms, EV chargers, or 24 hour service inside the{' '}
                    <Link
                      href="/station-amenities"
                      className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
                    >
                      amenity finder
                    </Link>
                    .
                  </li>
                </ul>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: 'Price Leaders',
                    description:
                      'Spot brands that undercut the market in West and North corridors for weekday fills.',
                    href: '/blog/regional-fuel-price-strategy',
                    cta: 'View regional map →',
                  },
                  {
                    title: 'Rewards Boosters',
                    description:
                      'Layer Flybuys, Everyday Rewards, and 7-Eleven lock-ins to shave up to 12¢ per litre.',
                    href: '/blog/maximize-fuel-rewards-programs',
                    cta: 'Build rewards stack →',
                  },
                  {
                    title: 'Premium Amenities',
                    description:
                      'Locate stations with EV chargers, air pumps, or full convenience hubs before long trips.',
                    href: '/station-amenities',
                    cta: 'Filter amenities →',
                  },
                  {
                    title: 'Fuel Mix Diversity',
                    description:
                      'Check which brands consistently stock P98, premium diesel, and E85 in your suburb.',
                    href: '/fuel-types',
                    cta: 'Review fuel mix →',
                  },
                ].map((insight) => (
                  <div
                    key={insight.title}
                    className="rounded-xl border border-gray-200 p-5 text-gray-900 shadow-sm transition hover:border-primary-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <h3 className="mb-2 text-xl font-semibold">{insight.title}</h3>
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                      {insight.description}
                    </p>
                    <Link
                      href={insight.href}
                      className="text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
                    >
                      {insight.cta}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

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
                    className="group rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:border-primary-500 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                          <Image
                            src={`/images/brands/${brand.name.toLowerCase().replace(/\s+/g, '-')}.png`}
                            alt={`${brand.name} logo`}
                            fill
                            className="object-contain p-2"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {brand.name}
                        </h3>
                      </div>
                      <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                        Major
                      </span>
                    </div>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                      Compare prices at all{' '}
                      <strong className="text-gray-900 dark:text-white">
                        {brand.name}
                      </strong>{' '}
                      stations across Melbourne. Find the cheapest{' '}
                      <Link
                        href="/fuel-types"
                        className="text-primary-600 hover:underline dark:text-primary-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        fuel types
                      </Link>{' '}
                      at {brand.name} locations.
                    </p>
                    <div className="text-sm text-primary-600 group-hover:underline dark:text-primary-400">
                      View {brand.name} Stations →
                    </div>
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
                    className="group rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:border-secondary-500 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                          <Image
                            src={`/images/brands/${brand.name.toLowerCase().replace(/\s+/g, '-')}.png`}
                            alt={`${brand.name} logo`}
                            fill
                            className="object-contain p-2"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {brand.name}
                        </h3>
                      </div>
                      <span className="rounded-full bg-secondary-100 px-3 py-1 text-sm font-semibold text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300">
                        Independent
                      </span>
                    </div>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                      Find competitive prices at{' '}
                      <strong className="text-gray-900 dark:text-white">
                        {brand.name}
                      </strong>{' '}
                      stations. Independent brands often offer{' '}
                      <Link
                        href="/blog"
                        className="text-primary-600 hover:underline dark:text-primary-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        better value
                      </Link>{' '}
                      compared to major chains.
                    </p>
                    <div className="text-sm text-secondary-600 group-hover:underline dark:text-secondary-400">
                      View {brand.name} Stations →
                    </div>
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
              fill-up. Use our{' '}
              <Link
                href="/directory"
                className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
              >
                station directory
              </Link>{' '}
              to find the cheapest fuel near you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/directory"
                className="inline-block rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:from-primary-700 hover:to-secondary-700 hover:shadow-xl"
              >
                Compare Prices Now
              </Link>
              <Link
                href="/blog"
                className="inline-block rounded-lg border-2 border-primary-600 px-8 py-4 font-semibold text-primary-600 transition-all duration-300 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20"
              >
                Read Fuel Saving Tips
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Fragment>
  );
}
