/**
 * AnimatedSection Component - Scroll-triggered animation wrapper
 *
 * A reusable component that wraps any content with scroll-triggered animations.
 * GPU-optimized for smooth 60fps performance.
 *
 * @example
 * ```tsx
 * <AnimatedSection animation="fadeInUp">
 *   <YourContent />
 * </AnimatedSection>
 * ```
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import {
  AnimationPreset,
  getAnimationVariants,
  DEFAULT_VIEWPORT,
  VIEWPORT_IMMEDIATE,
  VIEWPORT_HALF,
  VIEWPORT_FULL,
  getReducedMotionVariants,
} from '@/utils/animations';

export interface AnimatedSectionProps {
  /** Content to animate */
  children: ReactNode;
  /** Animation preset */
  animation?: AnimationPreset;
  /** Custom className */
  className?: string;
  /** Viewport trigger configuration */
  viewport?: 'default' | 'immediate' | 'half' | 'full';
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds (overrides preset) */
  duration?: number;
  /** HTML element type */
  as?: keyof JSX.IntrinsicElements;
  /** Test ID for testing */
  testId?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * AnimatedSection - Scroll-triggered animation wrapper
 *
 * Features:
 * - GPU-optimized animations (transform, opacity)
 * - Respects prefers-reduced-motion
 * - Animates only once when entering viewport
 * - Multiple animation presets
 * - Configurable viewport triggers
 */
export function AnimatedSection({
  children,
  animation = 'fadeInUp',
  className = '',
  viewport = 'default',
  delay = 0,
  duration,
  as = 'div',
  testId,
  style,
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Get viewport configuration
  const viewportConfig = {
    default: DEFAULT_VIEWPORT,
    immediate: VIEWPORT_IMMEDIATE,
    half: VIEWPORT_HALF,
    full: VIEWPORT_FULL,
  }[viewport];

  // Get animation variants
  let variants = getAnimationVariants(animation);

  // Apply custom duration if provided
  if (duration && variants.visible && typeof variants.visible === 'object') {
    variants = {
      ...variants,
      visible: {
        ...variants.visible,
        transition: {
          ...(typeof variants.visible.transition === 'object' ? variants.visible.transition : {}),
          duration,
          delay,
        },
      },
    };
  }

  // Apply delay if provided and duration wasn't
  if (delay && !duration && variants.visible && typeof variants.visible === 'object') {
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

  // Use reduced motion variants if user prefers
  const finalVariants = shouldReduceMotion ? getReducedMotionVariants(variants) : variants;

  const MotionComponent = motion[as] as any;

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={finalVariants}
      className={className}
      style={{
        willChange: shouldReduceMotion ? undefined : 'transform, opacity',
        ...style,
      }}
      data-testid={testId}
    >
      {children}
    </MotionComponent>
  );
}

export default AnimatedSection;
