/**
 * Reusable Button Component
 * Type-safe, accessible button with multiple variants
 */

import Link from 'next/link';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

import {
  BUTTON_BASE_CLASSES,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
} from '../constants';
import type { ButtonProps } from '../types';

/**
 * Button Component
 * Renders as Link if href is provided, otherwise as button
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" href="/about">
 *   Learn More
 * </Button>
 * ```
 */
export const Button = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  ButtonProps
>(
  (
    {
      children,
      href,
      onClick,
      variant = 'primary',
      size = 'lg',
      icon,
      iconPosition = 'left',
      ariaLabel,
      disabled = false,
      className,
    },
    ref
  ) => {
    const classes = cn(
      BUTTON_BASE_CLASSES,
      BUTTON_VARIANTS[variant],
      BUTTON_SIZES[size],
      disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
      className
    );

    const content = (
      <>
        {icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </>
    );

    // Render as Link if href is provided
    if (href && !disabled) {
      return (
        <Link href={href} className={classes} aria-label={ariaLabel}>
          {content}
        </Link>
      );
    }

    // Otherwise render as button
    return (
      <button
        type="button"
        onClick={onClick}
        className={classes}
        aria-label={ariaLabel}
        disabled={disabled}
        ref={ref as React.Ref<HTMLButtonElement>}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
