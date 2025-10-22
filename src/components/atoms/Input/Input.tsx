/**
 * Input Component (Atom)
 * 
 * Accessible form input with validation states
 */

import React, { forwardRef, useState } from 'react';

import { cn } from '@/design-system/utils/styled';
import type { BaseProps } from '@/types/index';
import './Input.css';

export interface InputProps extends BaseProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Success state */
  success?: boolean;
  /** Helper text */
  helperText?: string;
  /** Label text */
  label?: string;
  /** Required field indicator */
  required?: boolean;
  /** Icon before input */
  startIcon?: React.ReactNode;
  /** Icon after input */
  endIcon?: React.ReactNode;
  /** Full width */
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      error = false,
      errorMessage,
      success = false,
      helperText,
      label,
      required = false,
      startIcon,
      endIcon,
      fullWidth = false,
      disabled = false,
      className,
      style,
      testId,
      ariaLabel,
      ariaDescribedBy,
      id,
      ...restProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const containerClasses = cn(
      'input-container',
      fullWidth && 'input-container--full-width',
      className
    );

    const wrapperClasses = cn(
      'input-wrapper',
      `input-wrapper--${size}`,
      error && 'input-wrapper--error',
      success && 'input-wrapper--success',
      disabled && 'input-wrapper--disabled',
      isFocused && 'input-wrapper--focused',
      startIcon && 'input-wrapper--with-start-icon',
      endIcon && 'input-wrapper--with-end-icon'
    );

    const describedBy = [
      ariaDescribedBy,
      errorMessage ? errorId : null,
      helperText ? helperId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={containerClasses} style={style}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
            {required && <span className="input-label__required" aria-label="required">*</span>}
          </label>
        )}
        
        <div className={wrapperClasses}>
          {startIcon && (
            <span className="input-icon input-icon--start" aria-hidden="true">
              {startIcon}
            </span>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className="input"
            disabled={disabled}
            aria-label={ariaLabel}
            aria-describedby={describedBy}
            aria-invalid={error}
            aria-required={required}
            data-testid={testId}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...restProps}
          />
          
          {endIcon && (
            <span className="input-icon input-icon--end" aria-hidden="true">
              {endIcon}
            </span>
          )}
        </div>

        {errorMessage && (
          <p id={errorId} className="input-message input-message--error" role="alert">
            {errorMessage}
          </p>
        )}
        
        {!errorMessage && helperText && (
          <p id={helperId} className="input-message input-message--helper">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
