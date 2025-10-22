/**
 * Card Component (Molecule)
 * 
 * Container component with elevation and content sections
 */

import React from 'react';
import type { BaseProps, WithChildren } from '@/types';
import { cn } from '@/design-system/utils/styled';
import './Card.css';

export interface CardProps extends BaseProps, WithChildren {
  /** Elevation level (shadow depth) */
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Clickable card */
  onClick?: () => void;
  /** Hoverable effect */
  hoverable?: boolean;
  /** Border variant */
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 'sm',
  padding = 'md',
  onClick,
  hoverable = false,
  bordered = false,
  className,
  style,
  testId,
  ariaLabel,
}) => {
  const classNames = cn(
    'card',
    `card--elevation-${elevation}`,
    `card--padding-${padding}`,
    (onClick || hoverable) && 'card--hoverable',
    bordered && 'card--bordered',
    className
  );

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={classNames}
      style={style}
      onClick={onClick}
      data-testid={testId}
      aria-label={ariaLabel}
      {...(onClick && { type: 'button' })}
    >
      {children}
    </Component>
  );
};

// Compound components for Card sections
export const CardHeader: React.FC<BaseProps & WithChildren> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('card__header', className)} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<BaseProps & WithChildren> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('card__body', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<BaseProps & WithChildren> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('card__footer', className)} {...props}>
    {children}
  </div>
);

export const CardMedia: React.FC<
  BaseProps & {
    src: string;
    alt: string;
    aspectRatio?: '16/9' | '4/3' | '1/1' | '21/9';
  }
> = ({ src, alt, aspectRatio = '16/9', className, ...props }) => (
  <div className={cn('card__media', className)} {...props}>
    <img
      src={src}
      alt={alt}
      className="card__media-image"
      style={{ aspectRatio }}
      loading="lazy"
    />
  </div>
);

// Combine all exports
Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';
CardMedia.displayName = 'CardMedia';

