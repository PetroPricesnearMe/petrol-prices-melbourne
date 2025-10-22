/**
 * CardContent Component
 * Content sub-component for NorthernTradieCard
 */

import React, { memo } from 'react';
import { CardContentProps } from './types';
import { contentStyles } from './styles';
import { cn } from './utils';

export const CardContent = memo<CardContentProps>(({
  children,
  className,
  padded = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        contentStyles.base,
        padded && contentStyles.padded,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

