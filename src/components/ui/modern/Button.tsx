/**
 * Modern Button Component
 *
 * Features:
 * - Multiple variants and sizes
 * - Gradient effects
 * - Icon support
 * - Loading states
 * - Ripple effect on click
 * - Dark mode support
 * - Full accessibility
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { forwardRef, useState } from 'react';

import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'gradient'
  | 'danger';

type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  ariaLabel?: string;
}

// ============================================================================
// VARIANT STYLES
// ============================================================================

const variants = {
  primary: cn(
    'bg-primary-600 hover:bg-primary-700',
    'text-white',
    'shadow-lg shadow-primary-500/30',
    'hover:shadow-xl hover:shadow-primary-500/40'
  ),
  secondary: cn(
    'bg-gray-200 hover:bg-gray-300',
    'dark:bg-gray-700 dark:hover:bg-gray-600',
    'text-gray-900 dark:text-white',
    'shadow-md hover:shadow-lg'
  ),
  outline: cn(
    'bg-transparent',
    'border-2 border-gray-300 dark:border-gray-600',
    'hover:border-primary-500 dark:hover:border-primary-500',
    'text-gray-900 dark:text-white',
    'hover:bg-primary-50 dark:hover:bg-primary-900/20'
  ),
  ghost: cn(
    'bg-transparent',
    'text-gray-900 dark:text-white',
    'hover:bg-gray-100 dark:hover:bg-gray-800'
  ),
  gradient: cn(
    'bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600',
    'bg-[length:200%_auto]',
    'hover:bg-right',
    'text-white',
    'shadow-lg shadow-primary-500/30',
    'hover:shadow-2xl hover:shadow-primary-500/50'
  ),
  danger: cn(
    'bg-red-600 hover:bg-red-700',
    'text-white',
    'shadow-lg shadow-red-500/30',
    'hover:shadow-xl hover:shadow-red-500/40'
  ),
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
};

// ============================================================================
// RIPPLE EFFECT
// ============================================================================

function Ripple({ x, y }: { x: number; y: number }) {
  return (
    <motion.span
      className="pointer-events-none absolute rounded-full bg-white/30"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ width: 0, height: 0, opacity: 1 }}
      animate={{ width: 500, height: 500, opacity: 0 }}
      transition={{ duration: 0.6 }}
    />
  );
}

// ============================================================================
// MAIN BUTTON COMPONENT
// ============================================================================

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      href,
      onClick,
      disabled = false,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      ariaLabel,
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<
      Array<{ x: number; y: number; key: number }>
    >([]);

    const handleClick = (
      e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
    ) => {
      // Create ripple effect
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setRipples((prev) => [...prev, { x, y, key: Date.now() }]);
      setTimeout(() => setRipples((prev) => prev.slice(1)), 600);

      // Call onClick if provided
      if (onClick && !disabled && !loading) {
        onClick();
      }
    };

    const baseClasses = cn(
      'relative inline-flex items-center justify-center',
      'font-semibold rounded-xl',
      'transition-all duration-200',
      'focus:outline-none focus:ring-4 focus:ring-primary-500/50',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'overflow-hidden',
      variants[variant],
      sizes[size],
      fullWidth && 'w-full',
      className
    );

    const content = (
      <>
        {/* Ripple Container */}
        <span className="absolute inset-0 overflow-hidden rounded-xl">
          {ripples.map((ripple) => (
            <Ripple key={ripple.key} x={ripple.x} y={ripple.y} />
          ))}
        </span>

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center space-x-2">
          {loading ? (
            <motion.svg
              className="h-5 w-5"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                strokeWidth="4"
              />
            </motion.svg>
          ) : (
            leftIcon
          )}
          <span>{children}</span>
          {!loading && rightIcon}
        </span>
      </>
    );

    // Render as Link if href provided
    if (href && !disabled && !loading) {
      return (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href={href}
            className={baseClasses}
            aria-label={ariaLabel}
            onClick={handleClick}
          >
            {content}
          </Link>
        </motion.div>
      );
    }

    // Render as button
    return (
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading}
        className={baseClasses}
        aria-label={ariaLabel}
        ref={ref as React.Ref<HTMLButtonElement>}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// ============================================================================
// BUTTON GROUP COMPONENT
// ============================================================================

export function ButtonGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>{children}</div>
  );
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/**
 * Usage:
 *
 * <Button variant="primary" size="lg" leftIcon={<SearchIcon />}>
 *   Search Stations
 * </Button>
 *
 * <Button variant="gradient" href="/directory">
 *   Browse All
 * </Button>
 *
 * <Button variant="outline" size="sm" loading>
 *   Loading...
 * </Button>
 *
 * <ButtonGroup>
 *   <Button variant="primary">Save</Button>
 *   <Button variant="secondary">Cancel</Button>
 * </ButtonGroup>
 */
