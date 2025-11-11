/**
 * Input Component (Atom)
 * Accessible form input with variants
 * 
 * @example
 * ```tsx
 * <Input 
 *   label="Email"
 *   type="email"
 *   required
 *   helperText="We'll never share your email"
 * />
 * ```
 */

import type { InputHTMLAttributes } from 'react';
import React from 'react';

import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Success state */
  success?: boolean;
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Right icon */
  rightIcon?: React.ReactNode;
  /** Full width */
  fullWidth?: boolean;
}

// ============================================================================
// STYLES
// ============================================================================

const baseInputStyles = cn(
  'flex h-11 w-full rounded-lg border px-3 py-2',
  'bg-white dark:bg-gray-800',
  'text-gray-900 dark:text-white',
  'transition-colors duration-200',
  'focus-visible:outline-none focus-visible:ring-4',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'placeholder:text-gray-400 dark:placeholder:text-gray-500',
  'min-h-[44px]' // Touch target
);

const stateStyles = {
  default: cn(
    'border-gray-300 dark:border-gray-600',
    'focus-visible:border-primary-500 focus-visible:ring-primary-300'
  ),
  error: cn(
    'border-red-500 dark:border-red-400',
    'focus-visible:border-red-500 focus-visible:ring-red-300'
  ),
  success: cn(
    'border-green-500 dark:border-green-400',
    'focus-visible:border-green-500 focus-visible:ring-green-300'
  ),
};

// ============================================================================
// COMPONENT
// ============================================================================

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${React.useId()}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const hasError = Boolean(error);
    const hasSuccess = Boolean(success);

    return (
      <div className={cn('flex flex-col gap-2', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            aria-describedby={
              cn(
                helperText && helperId,
                error && errorId
              ).trim() || undefined
            }
            aria-required={required}
            className={cn(
              baseInputStyles,
              hasError
                ? stateStyles.error
                : hasSuccess
                ? stateStyles.success
                : stateStyles.default,
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper Text */}
        {helperText && !error && (
          <p
            id={helperId}
            className="text-xs text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p
            id={errorId}
            className="text-xs text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Success Message */}
        {success && !error && (
          <p className="text-xs text-green-600 dark:text-green-400">
            ✓ Valid
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

