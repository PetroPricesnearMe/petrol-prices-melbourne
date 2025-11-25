/**
 * Blog Page
 * Articles and guides about fuel prices
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { StructuredData } from '@/components/StructuredData';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/seo/schema-generator';
import { cn, patterns } from '@/styles/system/css-in-js';

export const metadata: Metadata = {
  title: 'Blog | Fuel Price Guides and Tips | Petrol Price Near Me',
  description:
    'Learn how to find the cheapest petrol prices in Melbourne with our comprehensive guides. Discover price cycles, best fill-up times, fuel-saving tips, and fuel type guides.',
  keywords: [
    'melbourne petrol prices',
    'fuel savings guide',
    'petrol price tips',
    'fuel price cycle',
    'cheap petrol melbourne',
    'fuel types guide',
    'fuel saving tips',
    'melbourne fuel blog',
  ],
  openGraph: {
    title: 'Fuel Price Guides | Petrol Price Near Me Blog',
    description: 'Expert guides on finding the cheapest fuel in Melbourne',
    type: 'website',
    images: [
      {
        url: '/images/blog/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Petrol Price Near Me Blog',
      },
    ],
  },
  alternates: {
    canonical: '/blog',
  },
};

const blogPosts = [
  {
    slug: 'complete-guide-to-fuel-types',
    title: 'Complete Guide to Fuel Types: Which One Should You Use?',
    description:
      'Learn about all fuel types available in Melbourne including Unleaded 91, Premium 95/98, Diesel, E10, E85, and LPG. Discover which fuel is right for your vehicle.',
    image: '/images/blog/fuel-types-guide.jpg',
    category: 'Guides',
    readTime: '8 min read',
    publishDate: '2024-01-15',
  },
  {
    slug: 'fuel-price-cycles',
    title: 'Understanding Melbourne Fuel Price Cycles: When to Fill Up',
    description:
      'Learn about Melbourne fuel price cycles and discover the best days and times to fill up your tank. Save up to 20 cents per litre.',
    image: '/images/blog/price-cycles.jpg',
    category: 'Tips',
    readTime: '6 min read',
    publishDate: '2024-02-10',
  },
  {
    slug: 'fuel-saving-tips',
    title: '10 Proven Fuel Saving Tips That Actually Work',
    description:
      'Discover 10 proven fuel saving tips that can help you reduce your fuel consumption and save money. From driving techniques to vehicle maintenance.',
    image: '/images/blog/fuel-saving-tips.jpg',
    category: 'Tips',
    readTime: '10 min read',
    publishDate: '2024-03-05',
  },
  {
    slug: 'maximize-fuel-rewards-programs',
    title: 'How to Maximize Fuel Rewards Programs in Melbourne',
    description:
      'Compare loyalty programs from major fuel brands, learn how to stack supermarket offers, and discover practical tactics that cut 15¢+ per litre from every fill-up.',
    image: '/images/blog/fuel-rewards.jpg',
    category: 'Guides',
    readTime: '9 min read',
    publishDate: '2024-04-18',
  },
  {
    slug: 'regional-fuel-price-strategy',
    title: 'Regional Fuel Price Strategy: Save Across Melbourne Suburbs',
    description:
      'See how petrol prices shift between north, south, east, west, and CBD regions. Build a suburb-by-suburb playbook that keeps your fuel budget predictable.',
    image: '/images/blog/regional-fuel-price-strategy.jpg',
    category: 'Strategy',
    readTime: '7 min read',
    publishDate: '2024-05-02',
  },
];

export default function BlogPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';
  const schemas = [
    generateOrganizationSchema(baseUrl),
    generateWebSiteSchema(baseUrl),
  ];

  return (
    <>
      <StructuredData data={schemas} />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero */}
        <header className="bg-gradient-primary text-white py-20">
          <div className={patterns.container()}>
            <div className={patterns.flex.colCenter}>
              <h1 className={cn(patterns.text.h1, 'text-white mb-4 text-center')}>
                Fuel Price Guides & Tips
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl text-center">
                Learn how to find the cheapest petrol prices in Melbourne with our comprehensive guides and expert tips.
              </p>
              <div className="flex gap-4 text-sm text-white/80">
                <span>📚 {blogPosts.length} Articles</span>
                <span>💡 Expert Tips</span>
                <span>📊 Price Guides</span>
              </div>
            </div>
          </div>
        </header>

        {/* Blog Posts Grid */}
        <section className={patterns.container() + ' py-16'}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Latest Articles
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Discover expert guides and tips to help you save money on fuel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-lg transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-primary-600 px-3 py-1 text-sm font-semibold text-white">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{post.readTime}</span>
                      <span>•</span>
                      <span>{new Date(post.publishDate).toLocaleDateString('en-AU')}</span>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                      {post.description}
                    </p>
                    <div className="mt-4 text-primary-600 font-semibold group-hover:underline dark:text-primary-400">
                      Read More →
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Related Resources */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-8 mb-12">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Explore More Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/fuel-types"
                  className="rounded-lg bg-white p-4 shadow transition-all hover:shadow-lg dark:bg-gray-800"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Fuel Types Guide
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Learn about all fuel types
                  </p>
                </Link>
                <Link
                  href="/fuel-brands"
                  className="rounded-lg bg-white p-4 shadow transition-all hover:shadow-lg dark:bg-gray-800"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Compare Brands
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Compare prices by brand
                  </p>
                </Link>
                <Link
                  href="/directory"
                  className="rounded-lg bg-white p-4 shadow transition-all hover:shadow-lg dark:bg-gray-800"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Station Directory
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Find cheapest stations
                  </p>
                </Link>
                <Link
                  href="/how-pricing-works"
                  className="rounded-lg bg-white p-4 shadow transition-all hover:shadow-lg dark:bg-gray-800"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    How Pricing Works
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Understand fuel pricing
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <article className={patterns.container() + ' py-16'}>
          <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-4'}>
              Why Melbourne Petrol Prices Vary So Much
            </h2>
            <p className={patterns.text.body + ' mb-4'}>
              Melbourne petrol prices can fluctuate dramatically throughout the week, sometimes by
              as much as 20-30 cents per litre. Understanding these variations is crucial for
              finding the cheapest petrol prices in Melbourne and saving money on every fill-up.
            </p>
            <p className={patterns.text.body + ' mb-4'}>
              The main factors affecting fuel prices near me include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Weekly Price Cycles:</strong> Most Melbourne petrol stations follow a predictable weekly pattern</li>
              <li><strong>Brand Competition:</strong> Major brands like Shell, BP, and Caltex compete aggressively</li>
              <li><strong>Location Premium:</strong> CBD and high-traffic areas often have higher prices</li>
              <li><strong>Fuel Type Differences:</strong> Diesel, 91, 95, and 98 octane prices vary significantly</li>
            </ul>
          </section>

          {/* Fuel Types */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-6'}>
              Understanding Different Fuel Types
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Unleaded 91', icon: '⛽', range: '$1.75 - $1.95/L', desc: 'Standard fuel for most vehicles' },
                { name: 'Premium 95', icon: '🔥', range: '$1.85 - $2.05/L', desc: 'Higher octane for performance' },
                { name: 'Premium 98', icon: '🏁', range: '$1.95 - $2.15/L', desc: 'Highest octane for sports cars' },
                { name: 'Diesel', icon: '🚛', range: '$1.70 - $1.90/L', desc: 'For diesel vehicles' },
              ].map((fuel) => (
                <div key={fuel.name} className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-5xl mb-3">{fuel.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{fuel.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{fuel.desc}</p>
                  <span className="badge badge-primary px-4 py-2 text-base">{fuel.range}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Best Times */}
          <section className="card p-8 bg-primary-50 dark:bg-gray-800">
            <h2 className={patterns.text.h2 + ' mb-6'}>Best Times to Buy Petrol</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">📅 Weekly Price Cycle:</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className={patterns.flex.start + ' gap-3'}>
                    <span className="text-success-600 font-bold">✓</span>
                    <span><strong>Tuesday-Wednesday:</strong> Usually the cheapest days</span>
                  </li>
                  <li className={patterns.flex.start + ' gap-3'}>
                    <span className="text-error-600 font-bold">✗</span>
                    <span><strong>Thursday-Sunday:</strong> Prices typically increase</span>
                  </li>
                  <li className={patterns.flex.start + ' gap-3'}>
                    <span className="text-warning-600 font-bold">~</span>
                    <span><strong>Monday:</strong> Variable, often mid-range prices</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">⏰ Daily Timing:</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>Early Morning (6-8 AM):</strong> Often lower prices</li>
                  <li><strong>Lunch Time (12-2 PM):</strong> Peak pricing</li>
                  <li><strong>Evening (6-8 PM):</strong> Competitive pricing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="card p-8 bg-gradient-primary text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Start Saving on Fuel Today</h2>
            <p className="text-white/90 text-lg mb-8">
              Use our live fuel prices tool to find the cheapest stations near you. Compare prices across{' '}
              <Link href="/fuel-brands" className="underline font-semibold">
                all brands
              </Link>{' '}
              and{' '}
              <Link href="/fuel-types" className="underline font-semibold">
                fuel types
              </Link>
              .
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/directory" className="btn bg-white text-primary-600 hover:bg-gray-50 btn-lg">
                📋 Browse Directory
              </Link>
              <Link href="/fuel-brands" className="btn border-2 border-white text-white hover:bg-white/10 btn-lg">
                Compare Brands
              </Link>
            </div>
          </section>
        </div>
      </article>
    </main>
    </>
  );
}
