/**
 * Fluid Responsive Grid Component
 *
 * Implements a responsive grid with:
 * - Fluid columns: 1 → 2 → 3 → 4
 * - Consistent gutter spacing
 * - Uniform card heights with vertical rhythm
 * - Equal negative space using Tailwind gap utilities
 * - Mobile-first responsive design
 */

'use client';

import { motion } from 'framer-motion';
import React from 'react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface FluidGridProps {
  /** Grid items to render */
  children: ReactNode;
  /** Custom className for the grid container */
  className?: string;
  /** Gap size variants */
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  /** Enable animations on mount */
  animate?: boolean;
  /** Animation stagger delay in seconds */
  staggerDelay?: number;
  /** Custom column configuration */
  columns?: {
    base?: number;
    sm?: number;
    lg?: number;
    xl?: number;
  };
  /** Enable uniform card heights with auto-rows-fr */
  uniformHeights?: boolean;
  /** Enable gap fluid spacing (responsive gap sizes) */
  fluidGap?: boolean;
}

/**
 * Gap spacing configurations
 * Provides consistent vertical rhythm
 */
const gapConfig = {
  sm: 'gap-4 sm:gap-5',
  md: 'gap-5 sm:gap-6 lg:gap-7',
  lg: 'gap-6 sm:gap-8 lg:gap-10',
  xl: 'gap-8 sm:gap-10 lg:gap-12',
};

/**
 * Fluid gap configurations
 * Scales smoothly across breakpoints
 */
const fluidGapConfig = {
  sm: 'gap-[clamp(1rem,2vw,1.25rem)]',
  md: 'gap-[clamp(1.25rem,3vw,1.5rem)]',
  lg: 'gap-[clamp(1.5rem,4vw,2rem)]',
  xl: 'gap-[clamp(2rem,5vw,3rem)]',
};

export const FluidGrid: React.FC<FluidGridProps> = ({
  children,
  className,
  gap = 'md',
  animate = false,
  staggerDelay = 0.05,
  columns = {
    base: 1,
    sm: 2,
    lg: 3,
    xl: 4,
  },
  uniformHeights = true,
  fluidGap = false,
}) => {
  // Build grid columns classes
  const gridColsClasses = React.useMemo(() => {
    const classes: string[] = [];

    if (columns.base !== undefined) {
      classes.push(columns.base === 1 ? 'grid-cols-1' : `grid-cols-${columns.base}`);
    }
    if (columns.sm !== undefined) {
      classes.push(`sm:grid-cols-${columns.sm}`);
    }
    if (columns.lg !== undefined) {
      classes.push(`lg:grid-cols-${columns.lg}`);
    }
    if (columns.xl !== undefined) {
      classes.push(`xl:grid-cols-${columns.xl}`);
    }

    return classes.join(' ');
  }, [columns]);

  // Build gap classes
  const gapClasses = React.useMemo(() => {
    if (fluidGap) {
      return fluidGapConfig[gap];
    }
    return gapConfig[gap];
  }, [gap, fluidGap]);

  // Base grid classes
  const gridClasses = cn(
    'grid',
    gridColsClasses,
    gapClasses,
    uniformHeights && 'auto-rows-fr',
    className
  );

  // Without animation
  if (!animate) {
    return (
      <div className={gridClasses}>
        {children}
      </div>
    );
  }

  // With staggered animation
  return (
    <div className={gridClasses}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        return (
          <motion.div
            key={`grid-item-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * staggerDelay,
              ease: [0.16, 1, 0.3, 1], // easeOutCubic
            }}
            className="h-full"
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
};

/**
 * Default implementation with recommended settings
 */
export const DefaultFluidGrid: React.FC<Omit<FluidGridProps, 'columns'>> = (props) => {
  return (
    <FluidGrid
      {...props}
      columns={{
        base: 1,
        sm: 2,
        lg: 3,
        xl: 4,
      }}
    />
  );
};

/**
 * Grid item wrapper for consistent card heights
 * Use this to wrap individual grid items
 */
export const GridItem: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn('h-full flex flex-col', className)}>
      {children}
    </div>
  );
};

export default FluidGrid;
