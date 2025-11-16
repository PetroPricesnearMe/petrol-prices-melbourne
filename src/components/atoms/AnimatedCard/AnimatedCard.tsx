/**
 * Animated Card (Atomic Design - Atom)
 * Reusable card with optimized animations
 * Strict TypeScript typing
 */

'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

import { useScrollAnimation } from '@/components/motion/hooks/useScrollAnimation';
import { cardEnter } from '@/components/motion/variants';
import { cn } from '@/lib/utils';

export interface AnimatedCardProps {
  /**
   * Card content
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Enable hover animation
   * @default true
   */
  enableHover?: boolean;

  /**
   * Enable scroll animation
   * @default true
   */
  enableScrollAnimation?: boolean;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Padding size
   * @default 'md'
   */
  padding?: 'sm' | 'md' | 'lg';

  /**
   * Card variant
   * @default 'default'
   */
  variant?: 'default' | 'elevated' | 'bordered' | 'ghost';

  /**
   * Stagger delay for list items
   */
  delay?: number;
}

/**
 * Optimized animated card component
 *
 * @example
 * <AnimatedCard padding="lg" variant="elevated">
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </AnimatedCard>
 */
export function AnimatedCard({
  children,
  className,
  enableHover = true,
  enableScrollAnimation = true,
  onClick,
  padding = 'md',
  variant = 'default',
  delay = 0,
}: AnimatedCardProps) {
  const { ref, isInView } = useScrollAnimation({
    triggerOnce: true,
    threshold: 0.2,
  });

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 shadow-md',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg',
    bordered:
      'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700',
    ghost: 'bg-transparent',
  };

  const baseClasses = cn(
    'rounded-xl transition-colors duration-200',
    paddingClasses[padding],
    variantClasses[variant],
    onClick && 'cursor-pointer',
    className
  );

  // Simple div if animations disabled
  if (!enableScrollAnimation && !enableHover) {
    return (
      <div
        className={baseClasses}
        onClick={onClick}
        {...(onClick && {
          role: 'button',
          tabIndex: 0,
          onKeyDown: (event: React.KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onClick();
            }
          },
        })}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={baseClasses}
      variants={cardEnter}
      initial={enableScrollAnimation ? 'initial' : false}
      animate={enableScrollAnimation && isInView ? 'animate' : false}
      whileHover={enableHover ? { scale: 1.02, y: -5 } : undefined}
      whileTap={enableHover && onClick ? { scale: 0.98 } : undefined}
      transition={{ delay }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
