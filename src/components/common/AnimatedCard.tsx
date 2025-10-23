/**
 * AnimatedCard Component - Card wrapper with scroll animations
 * 
 * A specialized component for animating card elements in grids/lists.
 * Optimized for station cards and similar content.
 * 
 * @example
 * ```tsx
 * <AnimatedCard index={0}>
 *   <StationCard {...props} />
 * </AnimatedCard>
 * ```
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import {
  fadeSlideUp,
  DEFAULT_VIEWPORT,
  getReducedMotionVariants,
} from '@/utils/animations';

export interface AnimatedCardProps {
  /** Card content */
  children: ReactNode;
  /** Index in list (for stagger delay) */
  index?: number;
  /** Custom className */
  className?: string;
  /** Base delay before animation starts */
  baseDelay?: number;
  /** Delay multiplier per index */
  staggerDelay?: number;
  /** Test ID for testing */
  testId?: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * AnimatedCard - Animated card wrapper for grid/list items
 * 
 * Features:
 * - Automatic stagger delay based on index
 * - GPU-optimized animations
 * - Respects prefers-reduced-motion
 * - Animates once on scroll
 * - Hover interactions
 */
export function AnimatedCard({
  children,
  index = 0,
  className = '',
  baseDelay = 0,
  staggerDelay = 0.05,
  testId,
  onClick,
}: AnimatedCardProps) {
  const shouldReduceMotion = useReducedMotion();
  
  // Calculate stagger delay based on index
  const delay = baseDelay + (index * staggerDelay);
  
  // Use fade and slide up animation
  let variants = { ...fadeSlideUp };
  
  // Apply stagger delay
  if (variants.visible && typeof variants.visible === 'object') {
    variants = {
      ...variants,
      visible: {
        ...variants.visible,
        transition: {
          ...(typeof variants.visible.transition === 'object' ? variants.visible.transition : {}),
          delay,
        },
      },
    };
  }
  
  // Use reduced motion variants if needed
  const finalVariants = shouldReduceMotion ? getReducedMotionVariants(variants) : variants;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={DEFAULT_VIEWPORT}
      variants={finalVariants}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -4,
              transition: { duration: 0.2 },
            }
      }
      className={className}
      style={{
        willChange: shouldReduceMotion ? undefined : 'transform, opacity',
      }}
      onClick={onClick}
      data-testid={testId}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedCard;

