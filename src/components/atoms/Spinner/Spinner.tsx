/**
 * Spinner Component (Atom)
 * 
 * Loading spinner with various sizes and colors
 */

import React from 'react';
import type { BaseProps, Size, ColorVariant } from '@/types';
import { cn } from '@/design-system/utils/styled';
import './Spinner.css';

export interface SpinnerProps extends BaseProps {
  /** Size of the spinner */
  size?: Size;
  /** Color variant */
  color?: ColorVariant;
  /** Loading message for screen readers */
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  label = 'Loading...',
  className,
  style,
  testId,
}) => {
  const classNames = cn(
    'spinner',
    `spinner--${size}`,
    `spinner--${color}`,
    className
  );

  return (
    <div
      className={classNames}
      style={style}
      role="status"
      aria-live="polite"
      aria-label={label}
      data-testid={testId}
    >
      <svg className="spinner__svg" viewBox="0 0 50 50">
        <circle
          className="spinner__circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
        />
      </svg>
      <span className="spinner__label">{label}</span>
    </div>
  );
};

