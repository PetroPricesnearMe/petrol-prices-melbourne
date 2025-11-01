/**
 * Responsive Grid Utilities
 *
 * Provides type-safe utilities for building responsive grid layouts
 * with proper Tailwind class purging support.
 *
 * @module utils/responsive-grid
 */

import type { ClassValue } from 'clsx';

import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export type GapSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ResponsiveColumns {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
}

// ============================================================================
// Gap Configuration
// ============================================================================

const GAP_CLASSES: Record<GapSize, string> = {
  sm: 'gap-4 sm:gap-5',
  md: 'gap-5 sm:gap-6 lg:gap-8',
  lg: 'gap-6 sm:gap-8 lg:gap-10',
  xl: 'gap-8 sm:gap-10 lg:gap-12',
} as const;

// ============================================================================
// Grid Column Classes (Static for Tailwind Purge)
// ============================================================================

const GRID_COL_CLASSES: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
} as const;

const BREAKPOINT_COL_CLASSES: Record<number, Record<string, string>> = {
  sm: {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
    5: 'sm:grid-cols-5',
    6: 'sm:grid-cols-6',
  },
  md: {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
  },
  lg: {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  },
  xl: {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
    5: 'xl:grid-cols-5',
    6: 'xl:grid-cols-6',
  },
  '2xl': {
    1: '2xl:grid-cols-1',
    2: '2xl:grid-cols-2',
    3: '2xl:grid-cols-3',
    4: '2xl:grid-cols-4',
    5: '2xl:grid-cols-5',
    6: '2xl:grid-cols-6',
  },
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get gap classes for the specified gap size
 */
export function getGapClasses(gap: GapSize): string {
  return GAP_CLASSES[gap];
}

/**
 * Build responsive grid column classes
 * Uses static class lookups to ensure proper Tailwind purging
 */
export function buildGridColumnClasses(columns: ResponsiveColumns = {}): string {
  const classes: ClassValue[] = [];

  // Base columns
  if (columns.base !== undefined) {
    classes.push(GRID_COL_CLASSES[columns.base] || 'grid-cols-1');
  } else {
    classes.push('grid-cols-1');
  }

  // Responsive breakpoints
  if (columns.sm !== undefined && columns.sm <= 6) {
    classes.push(BREAKPOINT_COL_CLASSES.sm[columns.sm]);
  }

  if (columns.md !== undefined && columns.md <= 6) {
    classes.push(BREAKPOINT_COL_CLASSES.md[columns.md]);
  }

  if (columns.lg !== undefined && columns.lg <= 6) {
    classes.push(BREAKPOINT_COL_CLASSES.lg[columns.lg]);
  }

  if (columns.xl !== undefined && columns.xl <= 6) {
    classes.push(BREAKPOINT_COL_CLASSES.xl[columns.xl]);
  }

  if (columns['2xl'] !== undefined && columns['2xl'] <= 6) {
    classes.push(BREAKPOINT_COL_CLASSES['2xl'][columns['2xl']]);
  }

  return cn(classes);
}

/**
 * Build complete grid container classes
 */
export function buildGridClasses(options: {
  columns?: ResponsiveColumns;
  gap?: GapSize;
  uniformHeights?: boolean;
  className?: ClassValue;
}): string {
  const { columns, gap = 'md', uniformHeights = true, className } = options;

  return cn(
    'grid',
    buildGridColumnClasses(columns),
    getGapClasses(gap),
    uniformHeights && 'auto-rows-fr',
    className
  );
}

/**
 * Default responsive columns configuration
 * 1 column on mobile → 2 on tablet → 3 on desktop → 4 on large screens
 */
export const DEFAULT_COLUMNS: ResponsiveColumns = {
  base: 1,
  sm: 2,
  lg: 3,
  xl: 4,
} as const;

/**
 * Re-export all types for convenience
 */
export type { ResponsiveColumns, GapSize };
