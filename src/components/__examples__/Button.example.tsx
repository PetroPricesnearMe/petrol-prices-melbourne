/**
 * Button Component - Example Implementation
 *
 * This is a production-ready Button component following best practices:
 * - TypeScript with proper typing
 * - Accessible (ARIA attributes, keyboard navigation)
 * - Responsive and themeable
 * - Variants using cva (class-variance-authority pattern)
 * - Loading and disabled states
 * - Icon support
 * - Proper event handling
 *
 * @component
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/design-system/utils';
import type { ComponentBaseProps } from '@/types';

/**
 * Button variants using CVA
 * Defines all visual variants of the button
 */
const buttonVariants = cva(
  // Base styles (always applied)
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'font-semibold',
    'text-center',
    'transition-all',
    'duration-200',
    'rounded-xl',
    'border-2',
    'border-transparent',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-primary-500',
    'focus-visible:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-none',
  ],
  {
    variants: {
      // Visual variants
      variant: {
        primary: [
          'bg-primary-600',
          'text-white',
          'hover:bg-primary-700',
          'active:bg-primary-800',
          'shadow-sm',
          'hover:shadow-md',
        ],
        secondary: [
          'bg-gray-100',
          'text-gray-900',
          'hover:bg-gray-200',
          'active:bg-gray-300',
          'border-gray-300',
        ],
        outline: [
          'bg-transparent',
          'text-primary-600',
          'border-primary-600',
          'hover:bg-primary-50',
          'active:bg-primary-100',
        ],
        ghost: [
          'bg-transparent',
          'text-gray-700',
          'hover:bg-gray-100',
          'active:bg-gray-200',
        ],
        danger: [
          'bg-error-500',
          'text-white',
          'hover:bg-error-600',
          'active:bg-error-700',
          'shadow-sm',
          'hover:shadow-md',
        ],
        success: [
          'bg-success-500',
          'text-white',
          'hover:bg-success-600',
          'active:bg-success-700',
          'shadow-sm',
          'hover:shadow-md',
        ],
      },

      // Size variants
      size: {
        sm: ['text-sm', 'px-3', 'py-1.5', 'min-h-[36px]'],
        md: ['text-base', 'px-4', 'py-2', 'min-h-[44px]'],
        lg: ['text-lg', 'px-6', 'py-3', 'min-h-[52px]'],
        xl: ['text-xl', 'px-8', 'py-4', 'min-h-[60px]'],
      },

      // Width variants
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },

    // Default variants
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

/**
 * Button Props
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ComponentBaseProps,
    VariantProps<typeof buttonVariants> {
  /**
   * Loading state - shows spinner and disables button
   */
  isLoading?: boolean;

  /**
   * Icon to show before the button text
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to show after the button text
   */
  rightIcon?: React.ReactNode;

  /**
   * Children (button content)
   */
  children?: React.ReactNode;
}

/**
 * Button Component
 *
 * A versatile button component with multiple variants and states.
 * Follows accessibility best practices and provides excellent UX.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      disabled,
      leftIcon,
      rightIcon,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Compute if button should be disabled
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}

        {/* Left icon */}
        {!isLoading && leftIcon && (
          <span className="inline-flex" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Button content */}
        {children && <span>{children}</span>}

        {/* Right icon */}
        {!isLoading && rightIcon && (
          <span className="inline-flex" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * Export button variants for external use
 */
export { buttonVariants };
