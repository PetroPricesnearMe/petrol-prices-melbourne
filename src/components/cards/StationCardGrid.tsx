/**
 * Station Card Grid Component
 *
 * Symmetric grid layout system for directory cards with responsive design
 *
 * @module components/cards/StationCardGrid
 */

'use client';

import { memo, useMemo } from 'react';
import type { Station } from '@/types/station';
import { cn } from '@/utils/cn';
import { OptimizedStationCard } from './OptimizedStationCard';

// ============================================================================
// TYPES
// ============================================================================

export interface StationCardGridProps {
  stations: Station[];
  showTransitions?: boolean;
  className?: string;
  onCardClick?: (station: Station) => void;
  gridColumns?: 1 | 2 | 3 | 4 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  maxBadges?: number;
  getVerified?: (station: Station) => boolean;
  getCheapestInArea?: (station: Station) => boolean;
  getViewCount?: (station: Station) => number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const GAP_CLASSES = {
  sm: 'gap-3',
  md: 'gap-4 md:gap-6',
  lg: 'gap-6 md:gap-8',
  xl: 'gap-8 md:gap-10',
};

const GRID_COLUMN_CLASSES = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Symmetric Grid Layout for Station Cards
 *
 * Features:
 * - Responsive grid with configurable columns
 * - Symmetric card sizing
 * - Optimal spacing and alignment
 * - Performance-optimized rendering
 */
export const StationCardGrid = memo<StationCardGridProps>(({
  stations,
  showTransitions = true,
  className,
  onCardClick,
  gridColumns = 3,
  gap = 'md',
  maxBadges = 3,
  getVerified,
  getCheapestInArea,
  getViewCount,
}) => {
  // Memoize grid classes
  const gridClasses = useMemo(() => {
    return cn(
      'grid',
      GRID_COLUMN_CLASSES[gridColumns],
      GAP_CLASSES[gap],
      'w-full',
      'auto-rows-fr', // Equal height rows
      className
    );
  }, [gridColumns, gap, className]);

  // Memoize station rendering
  const renderedStations = useMemo(() => {
    return stations.map((station, index) => (
      <OptimizedStationCard
        key={station.id}
        station={station}
        index={index}
        showTransition={showTransitions}
        transitionDelay={index * 0.05}
        onCardClick={onCardClick}
        maxBadges={maxBadges}
        verified={getVerified ? getVerified(station) : false}
        cheapestInArea={getCheapestInArea ? getCheapestInArea(station) : false}
        viewCount={getViewCount ? getViewCount(station) : 0}
      />
    ));
  }, [stations, showTransitions, onCardClick, maxBadges, getVerified, getCheapestInArea, getViewCount]);

  if (stations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No stations found</p>
      </div>
    );
  }

  return (
    <div className={gridClasses} role="list" aria-label="Station directory">
      {renderedStations}
    </div>
  );
});

StationCardGrid.displayName = 'StationCardGrid';

// ============================================================================
// ADDITIONAL GRID LAYOUTS
// ============================================================================

/**
 * Featured Grid - Large cards for featured stations
 */
export const FeaturedStationGrid = memo<Omit<StationCardGridProps, 'gridColumns'>>(
  (props) => (
    <StationCardGrid
      {...props}
      gridColumns={2}
      gap="xl"
      className={cn('max-w-5xl mx-auto', props.className)}
    />
  )
);

FeaturedStationGrid.displayName = 'FeaturedStationGrid';

/**
 * Compact Grid - More cards per row
 */
export const CompactStationGrid = memo<Omit<StationCardGridProps, 'gridColumns'>>(
  (props) => (
    <StationCardGrid
      {...props}
      gridColumns={4}
      gap="sm"
      className={props.className}
    />
  )
);

CompactStationGrid.displayName = 'CompactStationGrid';

/**
 * Mobile Grid - Optimized for mobile view
 */
export const MobileStationGrid = memo<Omit<StationCardGridProps, 'gridColumns'>>(
  (props) => (
    <StationCardGrid
      {...props}
      gridColumns={1}
      gap="md"
      className={cn('md:hidden', props.className)}
    />
  )
);

MobileStationGrid.displayName = 'MobileStationGrid';

// ============================================================================
// GRID UTILITIES
// ============================================================================

/**
 * Calculate optimal number of columns based on screen width
 */
export function getOptimalColumns(screenWidth: number): 1 | 2 | 3 | 4 {
  if (screenWidth < 640) return 1;
  if (screenWidth < 1024) return 2;
  if (screenWidth < 1280) return 3;
  return 4;
}

/**
 * Calculate grid item width
 */
export function getGridItemWidth(
  containerWidth: number,
  columns: number,
  gap: number
): number {
  const totalGap = gap * (columns - 1);
  return (containerWidth - totalGap) / columns;
}

// ============================================================================
// EXPORT
// ============================================================================

export default StationCardGrid;

