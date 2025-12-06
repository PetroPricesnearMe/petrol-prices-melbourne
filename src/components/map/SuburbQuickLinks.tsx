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
    const prioritySet = new Set(prioritySuburbs.map(s => s.toUpperCase()));
    const priority = suburbs
      .filter(s => prioritySet.has(s.toUpperCase()))
      .sort((a, b) => {
        const aIndex = prioritySuburbs.findIndex(p => p.toUpperCase() === a.toUpperCase());
        const bIndex = prioritySuburbs.findIndex(p => p.toUpperCase() === b.toUpperCase());
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
      });
    
    const remaining = suburbs
      .filter(s => !prioritySet.has(s.toUpperCase()))
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
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className={patterns.container()}>
        <div className="mb-8 text-center">
          <h2 className={cn(patterns.text.h2, 'mb-3')}>
            Petrol Prices by Suburb – Melbourne & Victoria
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find the cheapest fuel prices in your suburb. Click any suburb below to view today&apos;s prices and station locations.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {popularSuburbs.map((suburb) => {
            const slug = getSuburbSlug(suburb);
            const displayName = getSuburbDisplayName(suburb);
            
            return (
              <Link
                key={suburb}
                href={`/suburb/fuel-prices-${slug}-today`}
                className="group block p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-md transition-all duration-200 text-center"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {displayName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  View Prices →
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Can&apos;t find your suburb? Search all {suburbs.length}+ locations on our map.
          </p>
          <Link
            href="/directory"
            className="btn btn-outline"
          >
            View All Suburbs →
          </Link>
        </div>
      </div>
    </section>
  );
}

