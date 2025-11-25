import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { StructuredData } from '@/components/StructuredData';
import {
  getFuelTypesFromFairFuel,
  isFairFuelConfigured,
} from '@/lib/fairfuel/service';
import {
  generateOrganizationSchema,
  generatePlatformLocalBusinessSchema,
  generateWebSiteSchema,
} from '@/lib/seo/schema-generator';

// Force dynamic rendering since we're fetching from API
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title:
    'All Fuel Types Explained | Unleaded, Diesel, Premium & More | Melbourne',
  description:
    'Complete guide to all fuel types available in Melbourne: Unleaded 91, Premium 95/98, Diesel, E10, E85, LPG, and alternative fuels. Learn about each fuel type, their benefits, and find the best prices across Melbourne stations.',
  keywords: [
    'fuel types melbourne',
    'unleaded 91',
    'premium 95',
    'premium 98',
    'diesel fuel',
    'E10 ethanol',
    'E85 fuel',
    'LPG gas',
    'alternative fuels',
    'fuel types explained',
    'which fuel type to use',
    'fuel octane rating',
    'melbourne fuel guide',
    'fuel type comparison',
  ],
  openGraph: {
    title: 'All Fuel Types Explained | Complete Guide to Melbourne Fuel Types',
    description:
      'Complete guide to all fuel types available in Melbourne with price comparisons. Learn which fuel is right for your vehicle.',
    type: 'website',
    images: [
      {
        url: '/images/fuel-types-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Melbourne Fuel Types Guide',
      },
    ],
  },
  alternates: {
    canonical: '/fuel-types',
  },
};

const fuelTypeDescriptions: Record<string, string> = {
  U91: 'Standard unleaded petrol suitable for most vehicles. The most common fuel type in Australia.',
  P95: 'Premium unleaded with higher octane rating. Better performance and efficiency for modern engines.',
  P98: 'Premium unleaded with highest octane rating. Best performance for high-compression engines.',
  DSL: 'Standard diesel fuel for diesel engines. More fuel-efficient than petrol for long distances.',
  PDSL: 'Premium diesel with additives for better engine performance and fuel economy.',
  E10: 'Ethanol blend (10% ethanol, 90% unleaded). Environmentally friendly and often cheaper.',
  E85: 'High ethanol blend (85% ethanol). For flex-fuel vehicles. Lower emissions.',
  B20: 'Biodiesel blend (20% biodiesel). Renewable fuel option for diesel vehicles.',
  LPG: 'Liquefied Petroleum Gas. Cleaner burning alternative fuel, often more economical.',
  LNG: 'Liquefied Natural Gas. Alternative fuel for commercial vehicles.',
  CNG: 'Compressed Natural Gas. Clean alternative fuel option.',
};

export default async function FuelTypesPage() {
  let fuelTypes: Array<{ id: string; name: string }> = [];
  let hasData = false;

  if (await isFairFuelConfigured()) {
    try {
      fuelTypes = await getFuelTypesFromFairFuel();
      hasData = fuelTypes.length > 0;
    } catch (error) {
      console.error('Failed to fetch fuel types:', error);
    }
  }

  // Generate structured data
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';
  const schemas = [
    generateOrganizationSchema(baseUrl),
    generateWebSiteSchema(baseUrl),
    generatePlatformLocalBusinessSchema(baseUrl),
  ];

  return (
    <>
      <StructuredData data={schemas} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
                Complete Guide to Fuel Types
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
                Learn about all fuel types available in Melbourne. Find the right
                fuel for your vehicle and compare prices across all types.
              </p>
            </div>

            {/* Internal Linking - Related Resources */}
            <div className="mb-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                Related Resources
              </h2>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/fuel-brands"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  → Compare Fuel Brands
                </Link>
                <Link
                  href="/blog"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  → Fuel Type Guide
                </Link>
                <Link
                  href="/directory"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  → Find Stations by Fuel Type
                </Link>
                <Link
                  href="/how-pricing-works"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  → Understanding Fuel Prices
                </Link>
              </div>
            </div>

          {/* API Benefits Section */}
          <div className="mb-12 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 p-8 text-white">
            <h2 className="mb-4 text-2xl font-bold">
              Comprehensive Fuel Type Data
            </h2>
            <p className="mb-4 text-lg">
              Our fuel type information comes from the official Fair Fuel Open
              Data API, ensuring you have access to accurate, up-to-date
              information about all available fuel types in Victoria.
            </p>
            <ul className="mb-6 list-inside list-disc space-y-2 text-primary-50">
              <li>Complete list of all 11 supported fuel types</li>
              <li>Official fuel type codes and names</li>
              <li>Price comparisons across all fuel types</li>
              <li>Information about alternative and eco-friendly fuels</li>
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

              {/* Fuel Planning Framework */}
              <div className="mb-12 rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
                <div className="grid gap-8 lg:grid-cols-2">
                  <div>
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                      Fuel Planning Framework
                    </h2>
                    <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">
                      Pair live Fair Fuel pricing with driving goals to keep every refill intentional.
                      Start with the right octane, layer in timing insight, then save your favorite
                      stations for quick reference on the go.
                    </p>
                    <ol className="list-decimal space-y-3 pl-6 text-gray-700 dark:text-gray-300">
                      <li>
                        Review the{' '}
                        <Link
                          href="/blog/complete-guide-to-fuel-types"
                          className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
                        >
                          complete fuel guide
                        </Link>{' '}
                        to match octane and additives with your vehicle.
                      </li>
                      <li>
                        Time fill-ups with the{' '}
                        <Link
                          href="/blog/fuel-price-cycles"
                          className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
                        >
                          weekly price cycle breakdown
                        </Link>{' '}
                        for predictable savings.
                      </li>
                      <li>
                        Save shortlists inside the{' '}
                        <Link
                          href="/directory"
                          className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
                        >
                          station directory
                        </Link>{' '}
                        so you always have a low-price backup nearby.
                      </li>
                    </ol>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      {
                        title: 'Commuter Mix',
                        description:
                          'Blend U91 for city driving with occasional P95 top ups before long freeway days.',
                        href: '/blog/fuel-saving-tips',
                      },
                      {
                        title: 'Family Travel',
                        description:
                          'Plan school holiday trips with stations that stock LPG plus premium unleaded.',
                        href: '/station-amenities',
                      },
                      {
                        title: 'Performance Build',
                        description:
                          'Track P98 and premium diesel trends so tuned vehicles never run low on supply.',
                        href: '/blog/complete-guide-to-fuel-types',
                      },
                      {
                        title: 'Sustainability Path',
                        description:
                          'Compare E10, E85, and biodiesel availability before committing to greener fuels.',
                        href: '/blog/fuel-saving-tips',
                      },
                    ].map((plan) => (
                      <div
                        key={plan.title}
                        className="rounded-xl border border-gray-200 p-5 shadow-sm transition hover:border-primary-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
                      >
                        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                          {plan.title}
                        </h3>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                          {plan.description}
                        </p>
                        <Link
                          href={plan.href}
                          className="text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
                        >
                          Learn more →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

          {/* Fuel Types Grid */}
          {hasData && (
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {fuelTypes.map((fuelType) => (
                <div
                  key={fuelType.id}
                  className="group rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                        <Image
                          src={`/images/fuel-types/${fuelType.id.toLowerCase()}.png`}
                          alt={`${fuelType.name} icon`}
                          fill
                          className="object-contain p-2"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {fuelType.name}
                      </h3>
                    </div>
                    <span className="rounded-full bg-primary-100 px-3 py-1 font-mono text-sm font-semibold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                      {fuelType.id}
                    </span>
                  </div>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {fuelTypeDescriptions[fuelType.id] ||
                      'Find prices for this fuel type across Melbourne stations.'}
                  </p>
                  <Link
                    href={`/directory?fuelType=${encodeURIComponent(fuelType.id)}`}
                    className="inline-flex items-center font-semibold text-primary-600 hover:underline dark:text-primary-400"
                  >
                    Find {fuelType.name} Prices →
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Fuel Categories */}
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Standard Fuels
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Unleaded 91 (U91) - Most common petrol</li>
                <li>• Premium 95 (P95) - Higher octane unleaded</li>
                <li>• Premium 98 (P98) - Highest octane unleaded</li>
                <li>• Diesel (DSL) - Standard diesel fuel</li>
                <li>• Premium Diesel (PDSL) - Enhanced diesel</li>
              </ul>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Alternative Fuels
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• E10 - 10% ethanol blend</li>
                <li>• E85 - 85% ethanol blend</li>
                <li>• B20 - 20% biodiesel blend</li>
                <li>• LPG - Liquefied Petroleum Gas</li>
                <li>• LNG/CNG - Natural gas options</li>
              </ul>
            </div>
          </div>

          {/* Fallback if no data */}
          {!hasData && (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Fuel type information is being loaded. Please check back soon.
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
          <div className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Compare Prices for Your Fuel Type
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Find the best prices for your preferred fuel type across all
              Melbourne stations. Use our{' '}
              <Link
                href="/directory"
                className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
              >
                station directory
              </Link>{' '}
              to filter by fuel type and{' '}
              <Link
                href="/fuel-brands"
                className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
              >
                brand
              </Link>
              .
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
                Learn More About Fuel Types
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
