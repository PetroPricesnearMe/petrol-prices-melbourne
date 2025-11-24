/**
 * Station Listing Header Component
 * Sticky header with view toggle and station count
 */

'use client';

import { List, Map as MapIcon } from 'lucide-react';

import { cn } from '@/utils/cn';

interface StationListingHeaderProps {
  totalStations: number;
  viewMode: 'list' | 'map';
  onToggleView: () => void;
}

export function StationListingHeader({
  totalStations,
  viewMode,
  onToggleView,
}: StationListingHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              Melbourne Petrol Stations
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {totalStations} station{totalStations !== 1 ? 's' : ''} found
            </p>
          </div>

          <button
            onClick={onToggleView}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors',
              'bg-primary-600 text-white hover:bg-primary-700',
              'dark:bg-primary-500 dark:hover:bg-primary-600',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
            )}
            aria-label={`Switch to ${viewMode === 'list' ? 'map' : 'list'} view`}
          >
            {viewMode === 'list' ? (
              <>
                <MapIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Map View</span>
              </>
            ) : (
              <>
                <List className="h-5 w-5" />
                <span className="hidden sm:inline">List View</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
