/**
 * StationListCMS - Dynamic Station List from CMS
 *
 * Features:
 * - Fetches data from Baserow CMS
 * - WCAG 2.1 AA accessible
 * - Keyboard navigation
 * - Proper ARIA labels and roles
 * - Loading and error states
 * - Responsive design
 * - Focus management
 */

'use client';

import { motion } from 'framer-motion';
import { MapPin, DollarSign, Navigation } from 'lucide-react';
import React, { type ReactNode, useState, useEffect, useRef } from 'react';

import { EnhancedCardGrid, GridItem } from '../organisms/EnhancedCardGrid';

interface Station {
  id: number;
  Station_Name: string;
  Address: string;
  City: string;
  Region: string;
  Latitude: number;
  Longitude: number;
  Fuel_Prices?: Array<{
    Price_Per_Liter: string;
    Fuel_Type: string;
  }>;
}

interface StationListCMSProps {
  stations: Station[];
  isLoading?: boolean;
  error?: string | null;
  onStationClick?: (station: Station) => void;
  className?: string;
}

/**
 * Accessible Station List with CMS Integration
 */
export function StationListCMS({
  stations,
  isLoading = false,
  error = null,
  onStationClick,
  className = '',
}: StationListCMSProps) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const stationRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stations.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < stations.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : stations.length - 1
          );
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setFocusedIndex(stations.length - 1);
          break;
        case 'Enter':
        case ' ':
          if (focusedIndex >= 0 && onStationClick) {
            e.preventDefault();
            onStationClick(stations[focusedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stations, focusedIndex, onStationClick]);

  // Focus management
  useEffect(() => {
    if (focusedIndex >= 0 && stationRefs.current[focusedIndex]) {
      stationRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
  }

  // Empty state
  if (stations.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={`station-list ${className}`} ref={listRef}>
      {/* Screen reader announcement */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Showing {stations.length} petrol station{stations.length !== 1 ? 's' : ''}
      </div>

      {/* Instructions for keyboard users */}
      <div className="sr-only" role="region" aria-label="Keyboard instructions">
        Use arrow keys to navigate between stations. Press Enter or Space to select a station.
      </div>

      <EnhancedCardGrid
        gap="md"
        animate={true}
        columns={{
          base: 1,
          sm: 2,
          lg: 3,
          xl: 4,
        }}
        testId="station-list"
      >
        {stations.map((station, index) => (
          <GridItem key={station.id} index={index}>
            <StationCard
              station={station}
              index={index}
              isFocused={focusedIndex === index}
              onClick={() => onStationClick?.(station)}
              ref={(el) => (stationRefs.current[index] = el)}
              onFocus={() => setFocusedIndex(index)}
            />
          </GridItem>
        ))}
      </EnhancedCardGrid>
    </div>
  );
}

/**
 * Individual Station Card Component (Fully Accessible)
 */
interface StationCardProps {
  station: Station;
  index: number;
  isFocused: boolean;
  onClick: () => void;
  onFocus: () => void;
}

const StationCard = React.forwardRef<HTMLButtonElement, StationCardProps>(
  ({ station, index, isFocused, onClick, onFocus }, ref) => {
    const [isPressed, setIsPressed] = useState(false);

    const cheapestPrice = station.Fuel_Prices
      ? station.Fuel_Prices.reduce((min, price) => {
          const priceNum = parseFloat(price.Price_Per_Liter);
          return priceNum < min.priceNum
            ? { priceNum, text: price.Price_Per_Liter }
            : min;
        }, { priceNum: Infinity, text: 'N/A' }).text
      : 'N/A';

    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        onFocus={onFocus}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsPressed(true);
          }
        }}
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsPressed(false);
          }
        }}
        className={`
          w-full text-left
          bg-white dark:bg-gray-800
          rounded-2xl
          border-2 border-gray-200 dark:border-gray-700
          shadow-md hover:shadow-xl
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-4
          focus-visible:ring-blue-500 focus-visible:ring-offset-2
          ${
            isFocused
              ? 'border-blue-500 dark:border-blue-400 ring-4 ring-blue-200 dark:ring-blue-900'
              : ''
          }
          ${isPressed ? 'scale-95' : ''}
        `}
        whileHover={{
          y: -4,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.98 }}
        aria-label={`${station.Station_Name}, ${station.City}. ${cheapestPrice ? `Cheapest price: $${cheapestPrice}` : ''}. Press Enter to view details.`}
        role="button"
        tabIndex={0}
      >
        <div className="p-6">
          {/* Station Name */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {station.Station_Name}
          </h3>

          {/* Location */}
          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p>{station.Address}</p>
              <p>{station.City}, {station.Region}</p>
            </div>
          </div>

          {/* Price */}
          {cheapestPrice !== 'N/A' && (
            <div className="flex items-center gap-2 text-base font-semibold text-green-600 dark:text-green-400 mb-4">
              <DollarSign className="w-5 h-5" aria-hidden="true" />
              <span>${cheapestPrice}/L</span>
            </div>
          )}

          {/* Call to action */}
          <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
            <span>View Details</span>
            <Navigation className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>
      </motion.button>
    );
  }
);

StationCard.displayName = 'StationCard';

/**
 * Loading State
 */
function LoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center py-20"
    >
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Loading stations...
        </p>
        <span className="sr-only">Loading petrol stations</span>
      </div>
    </div>
  );
}

/**
 * Error State
 */
interface ErrorStateProps {
  error: string;
}

function ErrorState({ error }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-8"
    >
      <h2 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
        Error Loading Stations
      </h2>
      <p className="text-red-700 dark:text-red-300">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500 focus-visible:ring-offset-2"
      >
        Retry
      </button>
    </div>
  );
}

/**
 * Empty State
 */
function EmptyState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="text-center py-20"
    >
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
        No stations found
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-500">
        Try adjusting your filters
      </p>
    </div>
  );
}

export default StationListCMS;
