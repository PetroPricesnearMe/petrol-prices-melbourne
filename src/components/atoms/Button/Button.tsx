/**
 * Button Component (Atom)
 * 
 * A versatile, accessible button component with multiple variants and sizes
 */

import React, { forwardRef } from 'react';
import type { BaseProps, InteractiveProps, ColorVariant, Variant, Size } from '@/types';
import { cn } from '@/design-system/utils/styled';
import './Button.css';

export interface ButtonProps extends BaseProps, InteractiveProps {
  /** Button content */
  children: React.ReactNode;
  /** Visual variant */
  variant?: Variant;
  /** Color theme */
  color?: ColorVariant;
  /** Size of the button */
  size?: Size;
  /** Full width button */
  fullWidth?: boolean;
  /** Icon before text */
  startIcon?: React.ReactNode;
  /** Icon after text */
  endIcon?: React.ReactNode;
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
  /** Form attribute */
  form?: string;
  /** Link href (renders as anchor) */
  href?: string;
  /** Link target */
  target?: string;
  /** Link rel */
  rel?: string;
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      variant = 'solid',
      color = 'primary',
      size = 'md',
      fullWidth = false,
      startIcon,
      endIcon,
      loading = false,
      disabled = false,
      onClick,
      className,
      style,
      testId,
      ariaLabel,
      ariaDescribedBy,
      type = 'button',
      form,
      href,
      target,
      rel,
    },
    ref
  ) => {
    const classNames = cn(
      'button',
      `button--${variant}`,
      `button--${color}`,
      `button--${size}`,
      fullWidth && 'button--full-width',
      loading && 'button--loading',
      disabled && 'button--disabled',
      className
    );

    const content = (
      <>
        {loading && (
          <span className="button__spinner" aria-hidden="true">
            <span className="button__spinner-icon" />
          </span>
        )}
        {!loading && startIcon && (
          <span className="button__icon button__icon--start" aria-hidden="true">
            {startIcon}
          </span>
        )}
        <span className="button__text">{children}</span>
        {!loading && endIcon && (
          <span className="button__icon button__icon--end" aria-hidden="true">
            {endIcon}
          </span>
        )}
      </>
    );

    const commonProps = {
      className: classNames,
      style,
      'data-testid': testId,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-busy': loading,
      'aria-disabled': disabled || loading,
    };

    // Render as anchor if href is provided
    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={disabled || loading ? undefined : href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : rel}
          onClick={disabled || loading ? undefined : onClick}
          {...commonProps}
        >
          {content}
        </a>
      );
    }

    // Render as button
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        form={form}
        disabled={disabled || loading}
        onClick={onClick}
        {...commonProps}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
