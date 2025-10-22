/**
 * CardFooter Component
 * Footer sub-component for NorthernTradieCard
 */

import React, { memo } from 'react';
import { CardFooterProps } from './types';
import { footerStyles } from './styles';
import { cn } from './utils';

export const CardFooter = memo<CardFooterProps>(({
  children,
  className,
  align = 'between',
  ...props
}) => {
  return (
    <div
      className={cn(
        footerStyles.base,
        footerStyles.align[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

