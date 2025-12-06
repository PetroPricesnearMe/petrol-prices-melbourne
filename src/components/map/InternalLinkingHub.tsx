/**
 * Internal Linking Hub Component
 * 
 * SEO-friendly internal links to key pages for link equity distribution
 */

'use client';

import Link from 'next/link';

import { cn, patterns } from '@/styles/system/css-in-js';

interface LinkGroup {
  title: string;
  links: {
    href: string;
    label: string;
    description?: string;
  }[];
}

const linkGroups: LinkGroup[] = [
  {
    title: 'Explore Stations',
    links: [
      {
        href: '/directory',
        label: 'All Petrol Stations',
        description: 'Browse 660+ stations across Melbourne',
      },
      {
        href: '/fuel-brands',
        label: 'Fuel Brands',
        description: 'Compare BP, Shell, Caltex & more',
      },
      {
        href: '/station-amenities',
        label: 'Station Amenities',
        description: 'Find stations with car wash, EV charging',
      },
    ],
  },
  {
    title: 'Suburb Guides',
    links: [
      {
        href: '/melbourne',
        label: 'Melbourne Fuel Prices',
        description: 'Complete Melbourne fuel price guide',
      },
      {
        href: '/suburb',
        label: 'Suburb Price Pages',
        description: 'Today&apos;s prices by suburb',
      },
      {
        href: '/regions',
        label: 'Regional Victoria',
        description: 'Fuel prices in regional areas',
      },
    ],
  },
  {
    title: 'Fuel Types',
    links: [
      {
        href: '/fuel-types',
        label: 'Fuel Type Guide',
        description: 'Unleaded, Premium, Diesel, LPG',
      },
      {
        href: '/fuel-price-trends',
        label: 'Price Trends',
        description: 'Track fuel price changes over time',
      },
    ],
  },
  {
    title: 'Resources',
    links: [
      {
        href: '/how-pricing-works',
        label: 'How Pricing Works',
        description: 'Understand fuel price cycles',
      },
      {
        href: '/faq',
        label: 'FAQs',
        description: 'Common questions answered',
      },
      {
        href: '/blog',
        label: 'Fuel Price Blog',
        description: 'Tips, guides & updates',
      },
    ],
  },
];

export function InternalLinkingHub() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className={patterns.container()}>
        <div className="mb-8 text-center">
          <h2 className={cn(patterns.text.h2, 'mb-3')}>
            Explore More Fuel Price Resources
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover comprehensive guides, station listings, and tools to help you find the cheapest fuel in Melbourne.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {linkGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="group block p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-md transition-all duration-200"
                    >
                      <div className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1">
                        {link.label}
                      </div>
                      {link.description && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {link.description}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="btn btn-outline"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}

