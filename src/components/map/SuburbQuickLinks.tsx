/**
 * Suburb Quick Links Component
 *
 * Generates a grid of 30-50 suburb category links for internal linking and SEO
 * Routes to existing listing pages or map filters
 */

'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { cn, patterns } from '@/styles/system/css-in-js';

interface Props {
  suburbs: string[];
  maxLinks?: number;
}

export function SuburbQuickLinks({ suburbs, maxLinks = 50 }: Props) {
  const popularSuburbs = useMemo(() => {
    // Prioritize popular Melbourne suburbs for SEO
    const prioritySuburbs = [
      'MELBOURNE',
      'CARLTON',
      'BRUNSWICK',
      'PRESTON',
      'EPPING',
      'COBURG',
      'RICHMOND',
      'FITZROY',
      'ST KILDA',
      'SOUTH YARRA',
      'FOOTSCRAY',
      'DANDENONG',
      'FRANKSTON',
      'GEELONG',
      'BALLARAT',
      'BENDIGO',
      'WERRIBEE',
      'SUNSHINE',
      'BROADMEADOWS',
      'CLAYTON',
      'CAULFIELD',
      'BOX HILL',
      'RINGWOOD',
      'CROYDON',
      'BORONIA',
      'CRANBOURNE',
      'BERWICK',
      'DONCASTER',
      'BALWYN',
      'CAMBERWELL',
      'CHADSTONE',
      'GLEN WAVERLEY',
      'MOUNT WAVERLEY',
      'BURWOOD',
      'ASHWOOD',
      'ASHBURTON',
      'BENTLEIGH',
      'BRIGHTON',
      'ELSTERNWICK',
      'HUNTINGDALE',
      'OAKLEIGH',
      'MULGRAVE',
      'SPRINGVALE',
      'NOBLE PARK',
      'KEYSBOROUGH',
      'DANDENONG SOUTH',
      'HALLAM',
      'NARRE WARREN',
      'ENDEAVOUR HILLS',
    ];

    // Combine priority suburbs with remaining suburbs
    const prioritySet = new Set(prioritySuburbs.map((s) => s.toUpperCase()));
    const priority = suburbs
      .filter((s) => prioritySet.has(s.toUpperCase()))
      .sort((a, b) => {
        const aIndex = prioritySuburbs.findIndex(
          (p) => p.toUpperCase() === a.toUpperCase()
        );
        const bIndex = prioritySuburbs.findIndex(
          (p) => p.toUpperCase() === b.toUpperCase()
        );
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
      });

    const remaining = suburbs
      .filter((s) => !prioritySet.has(s.toUpperCase()))
      .sort()
      .slice(0, maxLinks - priority.length);

    return [...priority, ...remaining].slice(0, maxLinks);
  }, [suburbs, maxLinks]);

  const getSuburbSlug = (suburb: string) => {
    return suburb.toLowerCase().replace(/\s+/g, '-');
  };

  const getSuburbDisplayName = (suburb: string) => {
    // Handle special cases
    if (suburb === 'MELBOURNE') return 'Melbourne CBD';
    return suburb.charAt(0) + suburb.slice(1).toLowerCase();
  };

  return (
    <section className="bg-gray-50 py-12 dark:bg-gray-800">
      <div className={patterns.container()}>
        <div className="mb-8 text-center">
          <h2 className={cn(patterns.text.h2, 'mb-3')}>
            Cheapest Petrol Near Me by Suburb – Melbourne & Victoria
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Find the cheapest petrol near me in your suburb. Click any suburb
            below to view today&apos;s cheapest prices and station locations.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {popularSuburbs.map((suburb) => {
            const slug = getSuburbSlug(suburb);
            const displayName = getSuburbDisplayName(suburb);

            return (
              <Link
                key={suburb}
                href={`/suburb/fuel-prices-${slug}-today`}
                className="group block rounded-lg border border-gray-200 bg-white p-3 text-center transition-all duration-200 hover:border-primary-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-primary-400"
              >
                <div className="text-sm font-medium text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                  {displayName}
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  View Prices →
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Can&apos;t find your suburb? Search all {suburbs.length}+ locations
            on our map.
          </p>
          <Link href="/directory" className="btn-outline btn">
            View All Suburbs →
          </Link>
        </div>
      </div>
    </section>
  );
}
