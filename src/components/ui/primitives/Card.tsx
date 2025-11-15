/**
 * Card Component (Molecule)
 * Flexible card container with composable parts
 * Enhanced with Framer Motion animations, skeleton loading, and hover effects
 *
 * @example
 * ```tsx
 * <Card hoverable>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Content goes here
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */

'use client';

import { motion } from 'framer-motion';
import type { HTMLAttributes } from 'react';
import React from 'react';

import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

// Exclude animation and drag-related props from HTMLAttributes to avoid conflicts with Framer Motion
type CardHTMLAttributes = Omit<
  HTMLAttributes<HTMLDivElement>,
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
  | 'onDrag'
  | 'onDragEnd'
  | 'onDragStart'
>;

export interface CardProps extends CardHTMLAttributes {
  /** Visual variant */
  variant?: 'default' | 'bordered' | 'elevated' | 'outlined' | 'ghost';
  /** Hover effect */
  hoverable?: boolean;
  /** Clickable card */
  clickable?: boolean;
  /** Interactive state */
  active?: boolean;
}

// ============================================================================
// STYLES
// ============================================================================

const baseStyles = 'rounded-2xl transition-all duration-300';

const variants = {
  default: 'bg-white dark:bg-gray-800 shadow-sm',
  bordered:
    'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700',
  elevated: 'bg-white dark:bg-gray-800 shadow-lg',
  outlined: 'bg-transparent border border-gray-300 dark:border-gray-600',
  ghost: 'bg-gray-50 dark:bg-gray-800/50',
};

// ============================================================================
// CARD COMPONENT
// ============================================================================

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      hoverable = false,
      clickable = false,
      active = false,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const MotionCard = motion.div;

    return (
      <MotionCard
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          hoverable && 'hover:shadow-xl',
          clickable && [
            'cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300',
          ],
          active && 'ring-2 ring-primary-600',
          className
        )}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(e) => {
          if (clickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            // Create a synthetic mouse event for onClick handler
            const syntheticEvent = {
              ...e,
              currentTarget: e.currentTarget,
              target: e.target,
            } as unknown as React.MouseEvent<HTMLDivElement>;
            onClick(syntheticEvent);
          }
        }}
        whileHover={hoverable ? { y: -4, scale: 1.02 } : undefined}
        whileTap={clickable ? { scale: 0.98 } : undefined}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        {...props}
      >
        {children}
      </MotionCard>
    );
  }
);

Card.displayName = 'Card';

// ============================================================================
// CARD SUB-COMPONENTS
// ============================================================================

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600 dark:text-gray-400', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

export default Card;
