import type { Metadata } from 'next';
import Link from 'next/link';

import {
  getFuelTypesFromFairFuel,
  isFairFuelConfigured,
} from '@/lib/fairfuel/service';

export const metadata: Metadata = {
  title:
    'All Fuel Types Explained | Unleaded, Diesel, Premium & More | Melbourne',
  description:
    'Complete guide to all fuel types available in Melbourne: Unleaded 91, Premium 95/98, Diesel, E10, E85, LPG, and alternative fuels. Learn about each fuel type and find the best prices.',
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
  ],
  openGraph: {
    title: 'All Fuel Types Explained | Complete Guide to Melbourne Fuel Types',
    description:
      'Complete guide to all fuel types available in Melbourne with price comparisons.',
    type: 'website',
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

  return (
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
            <ul className="list-inside list-disc space-y-2 text-primary-50">
              <li>Complete list of all 11 supported fuel types</li>
              <li>Official fuel type codes and names</li>
              <li>Price comparisons across all fuel types</li>
              <li>Information about alternative and eco-friendly fuels</li>
            </ul>
          </div>

          {/* Fuel Types Grid */}
          {hasData && (
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {fuelTypes.map((fuelType) => (
                <div
                  key={fuelType.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {fuelType.name}
                    </h3>
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
                    className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
                  >
                    Find Prices →
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
              Melbourne stations.
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
