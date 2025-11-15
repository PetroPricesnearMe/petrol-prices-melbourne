/**
 * Button Component (Atom)
 * shadcn/ui inspired button with variants and Framer Motion animations
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="lg">Click me</Button>
 * <Button variant="outlined" leftIcon={<Icon />}>With Icon</Button>
 * <Button loading>Loading...</Button>
 * ```
 */

'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import React from 'react';

import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?:
    | 'primary'
    | 'secondary'
    | 'outlined'
    | 'ghost'
    | 'destructive'
    | 'link';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  /** Loading state */
  loading?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Icon before text */
  leftIcon?: ReactNode;
  /** Icon after text */
  rightIcon?: ReactNode;
  /** Children */
  children?: ReactNode;
}

// ============================================================================
// STYLES
// ============================================================================

const baseStyles = cn(
  // Base
  'inline-flex items-center justify-center gap-2',
  'font-medium transition-all duration-200',
  'focus-visible:outline-none focus-visible:ring-4',
  'disabled:pointer-events-none disabled:opacity-50',
  'rounded-lg',
  // Touch target
  'min-h-[44px] px-4'
);

const variants = {
  primary: cn(
    'bg-primary-600 text-white',
    'hover:bg-primary-700',
    'focus-visible:ring-primary-300',
    'active:bg-primary-800'
  ),
  secondary: cn(
    'bg-secondary-600 text-white',
    'hover:bg-secondary-700',
    'focus-visible:ring-secondary-300',
    'active:bg-secondary-800'
  ),
  outlined: cn(
    'border-2 border-gray-300 bg-white text-gray-900',
    'hover:bg-gray-50 hover:border-gray-400',
    'focus-visible:ring-gray-300',
    'dark:border-gray-600 dark:bg-gray-800 dark:text-white',
    'dark:hover:bg-gray-700 dark:hover:border-gray-500'
  ),
  ghost: cn(
    'text-gray-700 bg-transparent',
    'hover:bg-gray-100',
    'focus-visible:ring-gray-300',
    'dark:text-gray-300 dark:hover:bg-gray-800'
  ),
  destructive: cn(
    'bg-red-600 text-white',
    'hover:bg-red-700',
    'focus-visible:ring-red-300',
    'active:bg-red-800'
  ),
  link: cn(
    'text-primary-600 bg-transparent underline-offset-4',
    'hover:underline',
    'focus-visible:ring-primary-300',
    'dark:text-primary-400'
  ),
};

const sizes = {
  sm: 'h-9 px-3 text-sm min-h-[36px]',
  md: 'h-11 px-4 text-base min-h-[44px]',
  lg: 'h-12 px-6 text-lg min-h-[48px]',
  xl: 'h-14 px-8 text-xl min-h-[56px]',
  icon: 'h-11 w-11 p-0 min-h-[44px] min-w-[44px]',
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Button component with multiple variants and states
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const MotionButton = motion.button;

    return (
      <MotionButton
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        aria-disabled={isDisabled}
        aria-busy={loading}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}

        {!loading && leftIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {children && <span>{children}</span>}

        {!loading && rightIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </MotionButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
