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
import { useState } from 'react';

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
  const containerVariants = {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
  };

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
      variants={containerVariants}
      animate={view}
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
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
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
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: 'easeOut',
              }}
              layout
            >
              {renderItem(item, index)}
            </motion.div>
          ))}
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
export function StationCardGrid({ station, onCardClick }: { station: Station; onCardClick?: (station: Station) => void }) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 h-full"
      onClick={() => onCardClick?.(station)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Brand Header */}
      <div className="h-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
          {station.brand?.charAt(0) || 'S'}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {station.name}
          </h3>
          <span className="badge badge-primary text-sm">
            {station.brand}
          </span>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>📍 {station.address}</p>
          <p className="mt-1">{station.suburb} {station.postcode}</p>
        </div>

        {/* Fuel Prices */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Current Prices
          </h4>
          <div className="space-y-1">
            {station.fuelPrices && Object.entries(station.fuelPrices).slice(0, 3).map(([type, price]) => {
              if (price === null) return null;
              const priceColor = price < 200 ? 'text-success-600' : price <= 210 ? 'text-warning-600' : 'text-error-600';
              return (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 capitalize text-sm">
                    {type === 'premium95' ? 'Premium 95' : type === 'premium98' ? 'Premium 98' : type}
                  </span>
                  <span className={cn('text-sm font-bold', priceColor)}>
                    {price.toFixed(1)}¢
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <button className="btn btn-primary w-full btn-sm">
          View Details →
        </button>
      </div>
    </motion.div>
  );
}

/**
 * List variant of station card
 */
export function StationCardList({ station, onCardClick }: { station: Station; onCardClick?: (station: Station) => void }) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg cursor-pointer transition-all duration-300"
      onClick={() => onCardClick?.(station)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      layout
    >
      <div className="flex">
        {/* Brand Section */}
        <div className="w-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-gray-600 dark:text-gray-300">
            {station.brand?.charAt(0) || 'S'}
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
          <button className="btn btn-primary btn-sm">
            View
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { ViewToggleProps, DirectoryViewProps };
