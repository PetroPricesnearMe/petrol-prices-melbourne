/**
 * Grid/List View Toggle Component
 *
 * Toggle component for switching between grid and list directory views
 * with seamless animated transitions using Framer Motion
 *
 * @module components/toggle/ViewToggle
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import { getStationUrl } from '@/lib/seo/station-seo';
import type { Station } from '@/types/station';
import { cn } from '@/utils/cn';

// ============================================================================
// TYPES
// ============================================================================

interface ViewToggleProps {
  currentView: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface DirectoryViewProps {
  view: 'grid' | 'list';
  items: unknown[];
  renderItem: (item: unknown, index: number) => React.ReactNode;
  className?: string;
}

// ============================================================================
// VIEW TOGGLE COMPONENT
// ============================================================================

/**
 * Toggle component for switching between grid and list views
 */
export function ViewToggle({
  currentView,
  onViewChange,
  className,
  showLabels = true,
  size = 'md',
}: ViewToggleProps) {
  const sizeClasses = {
    sm: 'h-8 w-16',
    md: 'h-10 w-20',
    lg: 'h-12 w-24',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {showLabels && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          View:
        </span>
      )}

      <div className="relative">
        {/* Background */}
        <div className={cn(
          'relative bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-200',
          sizeClasses[size]
        )}>
          {/* Active Background */}
          <motion.div
            className="absolute inset-0 bg-primary-600 rounded-full"
            initial={false}
            animate={{
              x: currentView === 'grid' ? 0 : '100%',
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
            style={{
              width: '50%',
            }}
          />

          {/* Grid Button */}
          <button
            onClick={() => onViewChange('grid')}
            className={cn(
              'absolute left-0 top-0 bottom-0 w-1/2 flex items-center justify-center',
              'rounded-full transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              currentView === 'grid' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
            )}
            aria-label="Grid view"
          >
            <svg
              className={iconSizes[size]}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>

          {/* List Button */}
          <button
            onClick={() => onViewChange('list')}
            className={cn(
              'absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center',
              'rounded-full transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              currentView === 'list' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
            )}
            aria-label="List view"
          >
            <svg
              className={iconSizes[size]}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DIRECTORY VIEW COMPONENT
// ============================================================================

/**
 * Component that renders items in either grid or list view with smooth transitions
 */
export function DirectoryView({
  view,
  items,
  renderItem,
  className,
}: DirectoryViewProps) {
  const itemVariants = {
    grid: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    list: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className={cn('w-full', className)}
      transition={{
        duration: 0.4,
        ease: 'easeInOut',
      }}
    >
      <AnimatePresence mode="wait">
          <motion.div
            key={view}
            className={cn(
              view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8'
                : 'flex flex-col space-y-4'
            )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
        >
          {items.map((item: unknown, index: number) => {
            const itemWithId = item as { id?: string | number };
            const itemKey = itemWithId.id || index;
            return (
            <motion.div
              key={itemKey}
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{
                duration: 0.4,
                delay: index * 0.03,
                ease: [0.4, 0, 0.2, 1],
              }}
              layout
            >
              {renderItem(item, index)}
            </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// STATION CARD VARIANTS
// ============================================================================

/**
 * Grid variant of station card
 */
export function StationCardGrid({ station, onCardClickAction }: { station: Station; onCardClickAction?: (station: Station) => void }) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the button
    if ((e.target as HTMLElement).closest('a')) {
      return;
    }
    if (onCardClickAction) {
      onCardClickAction(station);
    }
  };

  return (
    <Link href={getStationUrl(station)} className="block h-full group">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:shadow-primary-500/10 dark:hover:shadow-primary-500/20 hover:-translate-y-2 cursor-pointer transition-all duration-300 ease-out h-full flex flex-col"
        onClick={handleCardClick}
        whileHover={{ 
          scale: 1.02,
          y: -8,
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        }}
        layout
      >
      {/* Brand Header */}
      <div className="h-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center px-4 transition-colors duration-300 group-hover:from-primary-50 group-hover:to-primary-100 dark:group-hover:from-primary-900/30 dark:group-hover:to-primary-800/30">
        <span className="text-lg font-bold text-gray-700 dark:text-gray-200 text-center truncate w-full transition-colors duration-300 group-hover:text-primary-700 dark:group-hover:text-primary-300">
          {station.brand || 'Station'}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
            {station.name}
          </h3>
          <span className="inline-block badge badge-primary text-sm mb-3">
            {station.brand}
          </span>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p className="line-clamp-1">📍 {station.address}</p>
          <p className="text-gray-500 dark:text-gray-500">{station.suburb} {station.postcode}</p>
        </div>

        {/* Fuel Prices */}
        <div className="mt-auto">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Current Prices
          </h4>
          <div className="space-y-2">
            {station.fuelPrices && Object.entries(station.fuelPrices).slice(0, 3).map(([type, price]) => {
              if (price === null) return null;
              const priceColor = price < 200 
                ? 'text-success-600 dark:text-success-400' 
                : price <= 210 
                ? 'text-warning-600 dark:text-warning-400' 
                : 'text-error-600 dark:text-error-400';
              return (
                <div key={type} className="flex justify-between items-center py-1.5 px-2 rounded-md bg-gray-50 dark:bg-gray-900/50 transition-colors duration-200 group-hover:bg-gray-100 dark:group-hover:bg-gray-800">
                  <span className="text-gray-600 dark:text-gray-400 capitalize text-sm font-medium">
                    {type === 'premium95' ? 'Premium 95' : type === 'premium98' ? 'Premium 98' : type}
                  </span>
                  <span className={cn('text-sm font-bold transition-transform duration-200 group-hover:scale-105', priceColor)}>
                    {price.toFixed(1)}¢
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 transition-colors duration-300 group-hover:bg-primary-50/50 dark:group-hover:bg-primary-900/20">
        <div className="btn btn-primary w-full btn-sm pointer-events-none transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary-500/30">
          View Details →
        </div>
      </div>
    </motion.div>
    </Link>
  );
}

/**
 * List variant of station card
 */
export function StationCardList({ station, onCardClickAction }: { station: Station; onCardClickAction?: (station: Station) => void }) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the button
    if ((e.target as HTMLElement).closest('a')) {
      return;
    }
    if (onCardClickAction) {
      onCardClickAction(station);
    }
  };

  return (
    <Link href={getStationUrl(station)} className="block">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg cursor-pointer transition-all duration-300"
        onClick={handleCardClick}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        layout
      >
      <div className="flex">
        {/* Brand Section */}
        <div className="w-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center flex-shrink-0 px-2">
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300 text-center truncate w-full">
            {station.brand || 'Station'}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {station.name}
              </h3>
              <span className="badge badge-primary text-xs">
                {station.brand}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                📍 {station.suburb}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {station.address}
            </div>

            {/* Fuel Prices */}
            <div className="flex space-x-4">
              {station.fuelPrices && Object.entries(station.fuelPrices).slice(0, 3).map(([type, price]) => {
                if (price === null) return null;
                const priceColor = price < 200 ? 'text-success-600' : price <= 210 ? 'text-warning-600' : 'text-error-600';
                return (
                  <div key={type} className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {type === 'premium95' ? 'P95' : type === 'premium98' ? 'P98' : type.charAt(0).toUpperCase()}
                    </div>
                    <div className={cn('text-sm font-bold', priceColor)}>
                      {price.toFixed(1)}¢
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-24 flex items-center justify-center flex-shrink-0">
          <div className="btn btn-primary btn-sm pointer-events-none">
            View
          </div>
        </div>
      </div>
    </motion.div>
    </Link>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { ViewToggleProps, DirectoryViewProps };
