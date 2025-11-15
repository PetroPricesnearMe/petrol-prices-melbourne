/**
 * Blog Page
 * Articles and guides about fuel prices
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { cn, patterns } from '@/styles/system/css-in-js';

export const metadata: Metadata = {
  title: 'Blog | Fuel Price Guides and Tips',
  description:
    'Learn how to find the cheapest petrol prices in Melbourne with our comprehensive guides. Discover price cycles, best fill-up times, and fuel-saving tips.',
  keywords: [
    'melbourne petrol prices',
    'fuel savings guide',
    'petrol price tips',
    'fuel price cycle',
    'cheap petrol melbourne',
  ],
  openGraph: {
    title: 'Fuel Price Guides | Petrol Price Near Me Blog',
    description: 'Expert guides on finding the cheapest fuel in Melbourne',
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <header className="bg-gradient-primary py-20 text-white">
        <div className={patterns.container()}>
          <div className={patterns.flex.colCenter}>
            <h1 className={cn(patterns.text.h1, 'mb-4 text-center text-white')}>
              Complete Guide to Finding the Cheapest Petrol Prices in Melbourne
            </h1>
            <div className="flex gap-4 text-sm text-white/80">
              <span>📅 Updated: October 2025</span>
              <span>⏱️ 8 min read</span>
              <span>📊 Fuel Price Guide</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className={patterns.container() + ' py-16'}>
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Introduction */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-4'}>
              Why Melbourne Petrol Prices Vary So Much
            </h2>
            <p className={patterns.text.body + ' mb-4'}>
              Melbourne petrol prices can fluctuate dramatically throughout the
              week, sometimes by as much as 20-30 cents per litre. Understanding
              these variations is crucial for finding the cheapest petrol prices
              in Melbourne and saving money on every fill-up.
            </p>
            <p className={patterns.text.body + ' mb-4'}>
              The main factors affecting fuel prices near me include:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Weekly Price Cycles:</strong> Most Melbourne petrol
                stations follow a predictable weekly pattern
              </li>
              <li>
                <strong>Brand Competition:</strong> Major brands like Shell, BP,
                and Caltex compete aggressively
              </li>
              <li>
                <strong>Location Premium:</strong> CBD and high-traffic areas
                often have higher prices
              </li>
              <li>
                <strong>Fuel Type Differences:</strong> Diesel, 91, 95, and 98
                octane prices vary significantly
              </li>
            </ul>
          </section>

          {/* Fuel Types */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-6'}>
              Understanding Different Fuel Types
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                {
                  name: 'Unleaded 91',
                  icon: '⛽',
                  range: '$1.75 - $1.95/L',
                  desc: 'Standard fuel for most vehicles',
                },
                {
                  name: 'Premium 95',
                  icon: '🔥',
                  range: '$1.85 - $2.05/L',
                  desc: 'Higher octane for performance',
                },
                {
                  name: 'Premium 98',
                  icon: '🏁',
                  range: '$1.95 - $2.15/L',
                  desc: 'Highest octane for sports cars',
                },
                {
                  name: 'Diesel',
                  icon: '🚛',
                  range: '$1.70 - $1.90/L',
                  desc: 'For diesel vehicles',
                },
              ].map((fuel) => (
                <div
                  key={fuel.name}
                  className="rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-800"
                >
                  <div className="mb-3 text-5xl">{fuel.icon}</div>
                  <h3 className="mb-2 text-xl font-bold">{fuel.name}</h3>
                  <p className="mb-3 text-gray-600 dark:text-gray-400">
                    {fuel.desc}
                  </p>
                  <span className="badge badge-primary px-4 py-2 text-base">
                    {fuel.range}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Best Times */}
          <section className="card bg-primary-50 p-8 dark:bg-gray-800">
            <h2 className={patterns.text.h2 + ' mb-6'}>
              Best Times to Buy Petrol
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-xl font-semibold">
                  📅 Weekly Price Cycle:
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className={patterns.flex.start + ' gap-3'}>
                    <span className="font-bold text-success-600">✓</span>
                    <span>
                      <strong>Tuesday-Wednesday:</strong> Usually the cheapest
                      days
                    </span>
                  </li>
                  <li className={patterns.flex.start + ' gap-3'}>
                    <span className="font-bold text-error-600">✗</span>
                    <span>
                      <strong>Thursday-Sunday:</strong> Prices typically
                      increase
                    </span>
                  </li>
                  <li className={patterns.flex.start + ' gap-3'}>
                    <span className="font-bold text-warning-600">~</span>
                    <span>
                      <strong>Monday:</strong> Variable, often mid-range prices
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-semibold">⏰ Daily Timing:</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>
                    <strong>Early Morning (6-8 AM):</strong> Often lower prices
                  </li>
                  <li>
                    <strong>Lunch Time (12-2 PM):</strong> Peak pricing
                  </li>
                  <li>
                    <strong>Evening (6-8 PM):</strong> Competitive pricing
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="card bg-gradient-primary p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Start Saving on Fuel Today
            </h2>
            <p className="mb-8 text-lg text-white/90">
              Use our live fuel prices tool to find the cheapest stations near
              you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/directory"
                className="btn-lg btn bg-white text-primary-600 hover:bg-gray-50"
              >
                📋 Browse Directory
              </Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
