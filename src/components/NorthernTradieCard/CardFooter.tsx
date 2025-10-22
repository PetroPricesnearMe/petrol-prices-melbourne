/**
 * CardFooter Component
 * Footer sub-component for NorthernTradieCard
 */

import React, { memo } from 'react';

import { footerStyles } from './styles';
import type { CardFooterProps } from './types';
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

