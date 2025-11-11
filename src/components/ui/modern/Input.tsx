/**
 * Modern Input Component
 * 
 * Features:
 * - Floating labels
 * - Icon support (left/right)
 * - Error and success states
 * - Character counter
 * - Dark mode support
 * - Smooth focus animations
 * - Full accessibility
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  maxLength?: number;
  showCounter?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  inputSize?: 'sm' | 'md' | 'lg';
}

// ============================================================================
// MAIN INPUT COMPONENT
// ============================================================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      maxLength,
      showCounter = false,
      variant = 'default',
      inputSize = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState('');

    const hasError = Boolean(error);
    const hasSuccess = Boolean(success);

    // Size variants
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg',
    };

    // Variant styles
    const variantClasses = {
      default: cn(
        'bg-white dark:bg-gray-900',
        'border-2',
        hasError
          ? 'border-red-500 focus:border-red-600'
          : hasSuccess
          ? 'border-green-500 focus:border-green-600'
          : 'border-gray-200 dark:border-gray-700 focus:border-primary-500'
      ),
      filled: cn(
        'bg-gray-100 dark:bg-gray-800',
        'border-2 border-transparent',
        hasError
          ? 'focus:border-red-500'
          : hasSuccess
          ? 'focus:border-green-500'
          : 'focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900'
      ),
      outlined: cn(
        'bg-transparent',
        'border-2',
        hasError
          ? 'border-red-500 focus:border-red-600'
          : hasSuccess
          ? 'border-green-500 focus:border-green-600'
          : 'border-gray-300 dark:border-gray-600 focus:border-primary-500'
      ),
    };

    return (
      <div className={cn('space-y-2', className)}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <motion.input
            ref={ref}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              props.onChange?.(e);
            }}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            maxLength={maxLength}
            animate={{
              scale: isFocused ? 1.01 : 1,
            }}
            transition={{ duration: 0.2 }}
            className={cn(
              'w-full rounded-xl',
              'text-gray-900 dark:text-white',
              'placeholder:text-gray-500 dark:placeholder:text-gray-400',
              'transition-all duration-200',
              'outline-none',
              sizeClasses[inputSize],
              variantClasses[variant],
              leftIcon && 'pl-12',
              rightIcon && 'pr-12',
              props.disabled && 'opacity-50 cursor-not-allowed'
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {rightIcon}
            </div>
          )}

          {/* Focus Ring Animation */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  'absolute inset-0 rounded-xl -z-10',
                  hasError
                    ? 'ring-4 ring-red-500/20'
                    : hasSuccess
                    ? 'ring-4 ring-green-500/20'
                    : 'ring-4 ring-primary-500/20'
                )}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Character Counter */}
        {showCounter && maxLength && (
          <div className="flex justify-end">
            <span
              className={cn(
                'text-xs',
                value.length > maxLength * 0.9
                  ? 'text-red-500'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {value.length} / {maxLength}
            </span>
          </div>
        )}

        {/* Helper Text / Error / Success */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}

          {success && !error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </motion.div>
          )}

          {helperText && !error && !success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              {helperText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

// ============================================================================
// SEARCH INPUT PRESET
// ============================================================================

export function SearchInput({
  placeholder = 'Search...',
  onSearch,
  className,
}: {
  placeholder?: string;
  onSearch: (value: string) => void;
  className?: string;
}) {
  return (
    <Input
      type="search"
      placeholder={placeholder}
      variant="filled"
      inputSize="lg"
      leftIcon={
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      onChange={(e) => onSearch(e.target.value)}
      className={className}
    />
  );
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/**
 * Usage:
 * 
 * <Input
 *   label="Email Address"
 *   type="email"
 *   placeholder="you@example.com"
 *   leftIcon={<MailIcon />}
 *   helperText="We'll never share your email"
 *   required
 * />
 * 
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 8 characters"
 *   rightIcon={<EyeIcon />}
 * />
 * 
 * <Input
 *   label="Bio"
 *   variant="filled"
 *   maxLength={200}
 *   showCounter
 * />
 * 
 * <SearchInput
 *   placeholder="Search stations..."
 *   onSearch={(value) => console.log(value)}
 * />
 */

