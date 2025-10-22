/**
 * Alert Component (Molecule)
 * 
 * Feedback message with icon and optional actions
 */

import React from 'react';
import type { BaseProps, WithChildren, ColorVariant } from '@/types/index';
import { Text } from '../../atoms/Text';
import { Button } from '../../atoms/Button';
import { cn } from '@/design-system/utils/styled';
import './Alert.css';

export interface AlertProps extends BaseProps, WithChildren {
  /** Alert variant */
  variant?: Extract<ColorVariant, 'success' | 'warning' | 'error' | 'info'>;
  /** Alert title */
  title?: string;
  /** Show icon */
  showIcon?: boolean;
  /** Closable alert */
  onClose?: () => void;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

const icons = {
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M16.667 5L7.5 14.167L3.333 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 6.667V10M10 13.333h.008M18.333 10a8.333 8.333 0 11-16.666 0 8.333 8.333 0 0116.666 0z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 6.667V10M10 13.333h.008M18.333 10a8.333 8.333 0 11-16.666 0 8.333 8.333 0 0116.666 0z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 13.333v-3.333M10 6.667h.008M18.333 10a8.333 8.333 0 11-16.666 0 8.333 8.333 0 0116.666 0z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  showIcon = true,
  onClose,
  action,
  className,
  style,
  testId,
  ariaLabel,
}) => {
  const classNames = cn('alert', `alert--${variant}`, className);

  return (
    <div
      className={classNames}
      style={style}
      role="alert"
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {showIcon && (
        <div className="alert__icon" aria-hidden="true">
          {icons[variant]}
        </div>
      )}

      <div className="alert__content">
        {title && (
          <Text as="div" variant="label" weight="semibold" className="alert__title">
            {title}
          </Text>
        )}
        <div className="alert__message">{children}</div>
      </div>

      {(action || onClose) && (
        <div className="alert__actions">
          {action && (
            <Button
              variant="ghost"
              size="sm"
              onClick={action.onClick}
              className="alert__action-button"
            >
              {action.label}
            </Button>
          )}
          {onClose && (
            <button
              type="button"
              className="alert__close"
              onClick={onClose}
              aria-label="Close alert"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

