/**
 * AnimatedGrid Component - Grid container with stagger animations
 *
 * A container component that animates its children with a stagger effect.
 * Perfect for card grids and lists.
 *
 * @example
 * ```tsx
 * <AnimatedGrid>
 *   {items.map((item, i) => (
 *     <StationCard key={item.id} {...item} />
 *   ))}
 * </AnimatedGrid>
 * ```
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

import {
  staggerContainer,
  staggerContainerFast,
  staggerContainerSlow,
  staggerItem,
  DEFAULT_VIEWPORT,
  getReducedMotionVariants,
} from '@/utils/animations';

export interface AnimatedGridProps {
  /** Grid items */
  children: ReactNode;
  /** Custom className for grid container */
  className?: string;
  /** Stagger speed */
  stagger?: 'fast' | 'normal' | 'slow';
  /** Custom stagger delay in seconds */
  staggerDelay?: number;
  /** Delay before starting animations */
  initialDelay?: number;
  /** Test ID for testing */
  testId?: string;
}

/**
 * AnimatedGrid - Grid container with staggered child animations
 *
 * Features:
 * - Automatic stagger animations for children
 * - GPU-optimized
 * - Respects prefers-reduced-motion
 * - Configurable stagger speed
 * - Animates once on scroll
 */
export function AnimatedGrid({
  children,
  className = '',
  stagger = 'normal',
  staggerDelay,
  initialDelay,
  testId,
}: AnimatedGridProps) {
  const shouldReduceMotion = useReducedMotion();

  // Get container variants based on stagger speed
  let containerVariants = {
    fast: staggerContainerFast,
    normal: staggerContainer,
    slow: staggerContainerSlow,
  }[stagger];

  // Apply custom delays if provided
  if (staggerDelay || initialDelay) {
    const currentTransition =
      typeof containerVariants.visible === 'object' &&
      containerVariants.visible.transition
        ? containerVariants.visible.transition
        : {};

    containerVariants = {
      ...containerVariants,
      visible: {
        ...containerVariants.visible,
        transition: {
          ...currentTransition,
          ...(staggerDelay && { staggerChildren: staggerDelay }),
          ...(initialDelay && { delayChildren: initialDelay }),
        },
      },
    };
  }

  // Use reduced motion variants if needed
  const finalContainerVariants = shouldReduceMotion
    ? getReducedMotionVariants(containerVariants)
    : containerVariants;

  const finalItemVariants = shouldReduceMotion
    ? getReducedMotionVariants(staggerItem)
    : staggerItem;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={DEFAULT_VIEWPORT}
      variants={finalContainerVariants}
      className={className}
      data-testid={testId}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedGridItem - Individual grid item (use inside AnimatedGrid)
 *
 * @example
 * ```tsx
 * <AnimatedGrid>
 *   <AnimatedGridItem>
 *     <Card>Content</Card>
 *   </AnimatedGridItem>
 * </AnimatedGrid>
 * ```
 */
export function AnimatedGridItem({
  children,
  className = '',
  testId,
}: {
  children: ReactNode;
  className?: string;
  testId?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion
    ? getReducedMotionVariants(staggerItem)
    : staggerItem;

  return (
    <motion.div
      variants={variants}
      className={className}
      style={{
        willChange: shouldReduceMotion ? undefined : 'transform, opacity',
      }}
      data-testid={testId}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedGrid;
