/**
 * CardHeader Component
 * Header sub-component for NorthernTradieCard
 */

import React, { memo } from 'react';
import { CardHeaderProps } from './types';
import { headerStyles } from './styles';
import { cn } from './utils';

export const CardHeader = memo<CardHeaderProps>(({
  title,
  subtitle,
  icon,
  action,
  className,
  ...props
}) => {
  if (!title && !subtitle && !icon && !action) {
    return null;
  }

  return (
    <div
      className={cn(headerStyles.base, className)}
      {...props}
    >
      <div className="flex-1 min-w-0">
        {(title || icon) && (
          <div className={headerStyles.title}>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {title && <span className="truncate">{title}</span>}
          </div>
        )}
        {subtitle && (
          <div className={headerStyles.subtitle}>
            {subtitle}
          </div>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

