/**
 * Badge Component (Atom)
 *
 * Small status indicators and labels
 */

import React from 'react';

import { cn } from '@/design-system/utils/styled';
import type { BaseProps, ColorVariant, Size } from '@/types/index';
import './Badge.css';

export interface BadgeProps extends BaseProps {
  /** Badge content */
  children: React.ReactNode;
  /** Color variant */
  variant?: ColorVariant;
  /** Size */
  size?: Exclude<Size, 'xl'>;
  /** Visual style */
  appearance?: 'solid' | 'outlined' | 'soft';
  /** Dot indicator before text */
  dot?: boolean;
  /** Icon before text */
  icon?: React.ReactNode;
  /** Removable badge */
  onRemove?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  appearance = 'soft',
  dot = false,
  icon,
  onRemove,
  className,
  style,
  testId,
  ariaLabel,
}) => {
  const classNames = cn(
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    `badge--${appearance}`,
    className
  );

  return (
    <span
      className={classNames}
      style={style}
      data-testid={testId}
      aria-label={ariaLabel}
    >
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {icon && (
        <span className="badge__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="badge__content">{children}</span>
      {onRemove && (
        <button
          type="button"
          className="badge__remove"
          onClick={onRemove}
          aria-label="Remove"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M9 3L3 9M3 3L9 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
};
