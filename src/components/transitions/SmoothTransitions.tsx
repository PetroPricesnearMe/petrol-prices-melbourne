/**
 * Smooth Transition Components
 *
 * Provides smooth animations and transitions for infinite scroll content
 *
 * @module components/transitions/SmoothTransitions
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

import { cn } from '@/utils/cn';

// ============================================================================
// TYPES
// ============================================================================

interface SmoothTransitionProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  className?: string;
}

interface StaggeredTransitionProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

interface FadeInTransitionProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const slideVariants = {
  up: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
  },
  down: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  },
  left: {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  },
  right: {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 },
  },
};

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const scaleVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
};

// ============================================================================
// SMOOTH TRANSITION COMPONENT
// ============================================================================

/**
 * Smooth transition component with customizable direction and timing
 */
export function SmoothTransition({
  children,
  direction = 'up',
  duration = 0.3,
  delay = 0,
  className,
}: SmoothTransitionProps) {
  const variants = slideVariants[direction];

  return (
    <motion.div
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1], // Custom easing
      }}
      className={cn('w-full', className)}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// STAGGERED TRANSITION COMPONENT
// ============================================================================

/**
 * Staggered transition for multiple items
 */
export function StaggeredTransition({
  children,
  staggerDelay = 0.1,
  direction = 'up',
  className,
}: StaggeredTransitionProps) {
  const variants = slideVariants[direction];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className={cn('w-full', className)}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={variants}
          transition={{
            duration: 0.3,
            delay: index * staggerDelay,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============================================================================
// FADE IN TRANSITION COMPONENT
// ============================================================================

/**
 * Simple fade in transition
 */
export function FadeInTransition({
  children,
  delay = 0,
  duration = 0.3,
  className,
}: FadeInTransitionProps) {
  return (
    <motion.div
      initial={fadeVariants.initial}
      animate={fadeVariants.animate}
      exit={fadeVariants.exit}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn('w-full', className)}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// SCALE TRANSITION COMPONENT
// ============================================================================

/**
 * Scale transition for cards and interactive elements
 */
export function ScaleTransition({
  children,
  delay = 0,
  duration = 0.2,
  className,
}: FadeInTransitionProps) {
  return (
    <motion.div
      initial={scaleVariants.initial}
      animate={scaleVariants.animate}
      exit={scaleVariants.exit}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn('w-full', className)}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// INFINITE SCROLL TRANSITION WRAPPER
// ============================================================================

interface InfiniteScrollTransitionProps {
  children: React.ReactNode;
  isTransitioning: boolean;
  transitionDirection: 'up' | 'down';
  className?: string;
}

/**
 * Specialized transition wrapper for infinite scroll content
 */
export function InfiniteScrollTransition({
  children,
  isTransitioning,
  transitionDirection,
  className,
}: InfiniteScrollTransitionProps) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isTransitioning) {
      setKey((prev) => prev + 1);
    }
  }, [isTransitioning]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={
          transitionDirection === 'down'
            ? { y: 20, opacity: 0 }
            : { y: -20, opacity: 0 }
        }
        animate={{ y: 0, opacity: 1 }}
        exit={
          transitionDirection === 'down'
            ? { y: -20, opacity: 0 }
            : { y: 20, opacity: 0 }
        }
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
        className={cn('w-full', className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================================
// LOADING SKELETON COMPONENTS
// ============================================================================

interface SkeletonCardProps {
  className?: string;
}

/**
 * Skeleton card for loading states
 */
export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm',
        'animate-pulse',
        className
      )}
    >
      {/* Brand header skeleton */}
      <div className="h-20 bg-gray-200" />

      {/* Content skeleton */}
      <div className="space-y-4 p-6">
        <div className="h-6 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
        <div className="h-8 w-full rounded bg-gray-200" />
      </div>
    </motion.div>
  );
}

interface SkeletonGridProps {
  count?: number;
  className?: string;
}

/**
 * Skeleton grid for loading multiple cards
 */
export function SkeletonGrid({ count = 6, className }: SkeletonGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

// ============================================================================
// PROGRESS INDICATOR COMPONENT
// ============================================================================

interface ProgressIndicatorProps {
  progress: number;
  className?: string;
}

/**
 * Progress indicator for loading states
 */
export function ProgressIndicator({
  progress,
  className,
}: ProgressIndicatorProps) {
  return (
    <div className={cn('h-2 w-full rounded-full bg-gray-200', className)}>
      <motion.div
        className="h-2 rounded-full bg-primary-600"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}

// ============================================================================
// LOADING SPINNER COMPONENT
// ============================================================================

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Animated loading spinner
 */
export function LoadingSpinner({
  size = 'md',
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <motion.div
      className={cn(
        'rounded-full border-2 border-gray-300 border-t-primary-600',
        sizeClasses[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

// ============================================================================
// EXPORTS
// ============================================================================
