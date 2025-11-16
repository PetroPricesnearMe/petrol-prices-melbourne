/**
 * EnhancedCardGrid Component
 *
 * A world-class card grid with:
 * - Fluid responsive layout (1/2/3/4 columns)
 * - Uniform card heights
 * - Smooth Framer Motion stagger animations
 * - WCAG 2.1 AA accessibility
 * - Dark mode support
 * - Subtle hover effects and elevations
 * - Modern border-radius (2xl) and shadows
 * - Perfect spacing and rhythm
 */

'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useMemo, type ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { staggerContainer } from '@/utils/animations';
import {
  buildGridClasses,
  type GapSize,
  type ResponsiveColumns,
} from '@/utils/responsive-grid';

export interface EnhancedCardGridProps {
  /** Grid items to render */
  children: ReactNode;
  /** Custom className for grid container */
  className?: string;
  /** Gap size between cards */
  gap?: GapSize;
  /** Enable entrance animations */
  animate?: boolean;
  /** Animation delay between items */
  staggerDelay?: number;
  /** Column configuration */
  columns?: ResponsiveColumns;
  /** Enable uniform card heights */
  uniformHeights?: boolean;
  /** Test ID for testing */
  testId?: string;
}

/**
 * EnhancedCardGrid - Responsive grid with animations
 */
export function EnhancedCardGrid({
  children,
  className = '',
  gap = 'md',
  animate = true,
  staggerDelay = 0.05,
  columns = {
    base: 1,
    sm: 2,
    lg: 3,
    xl: 4,
  },
  uniformHeights = true,
  testId,
}: EnhancedCardGridProps) {
  const shouldReduceMotion = useReducedMotion();

  // Build responsive grid classes using utility function
  const gridClasses = useMemo(
    () => buildGridClasses({ columns, gap, uniformHeights, className }),
    [columns, gap, uniformHeights, className]
  );

  // Build animation variants
  const containerVariants = useMemo<Variants | undefined>(() => {
    if (shouldReduceMotion || !animate) return undefined;

    return {
      ...staggerContainer,
      visible: {
        ...staggerContainer.visible,
        transition: {
          ...staggerContainer.visible.transition,
          staggerChildren: staggerDelay,
        },
      },
    };
  }, [shouldReduceMotion, animate, staggerDelay]);

  return (
    <motion.div
      className={gridClasses}
      variants={containerVariants}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
      data-testid={testId}
      role="list"
      aria-label="Card grid"
    >
      {children}
    </motion.div>
  );
}

/**
 * GridItem - Wrapper for individual cards to ensure proper layout
 */
export interface GridItemProps {
  /** Card content */
  children: ReactNode;
  /** Custom className */
  className?: string;
  /** Animation index for stagger */
  index?: number;
  /** Test ID */
  testId?: string;
  /** Enable hover animation */
  enableHover?: boolean;
}

export function GridItem({
  children,
  className = '',
  index = 0,
  testId,
  enableHover = true,
}: GridItemProps) {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants = useMemo<Variants>(
    () => ({
      hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: shouldReduceMotion ? 0 : 0.4,
          delay: shouldReduceMotion ? 0 : index * 0.05,
          ease: 'easeOut',
        },
      },
    }),
    [shouldReduceMotion, index]
  );

  const hoverProps = useMemo(() => {
    if (!enableHover || shouldReduceMotion) return undefined;
    return {
      y: -8,
      transition: { duration: 0.2 },
    };
  }, [enableHover, shouldReduceMotion]);

  return (
    <motion.div
      className={cn('flex h-full flex-col', className)}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverProps}
      data-testid={testId}
      role="listitem"
    >
      {children}
    </motion.div>
  );
}

// Re-export types for convenience
export type { GapSize, ResponsiveColumns } from '@/utils/responsive-grid';

export default EnhancedCardGrid;
