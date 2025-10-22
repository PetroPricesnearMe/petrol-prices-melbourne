/**
 * CardMedia Component
 * Media sub-component for NorthernTradieCard
 */

import React, { memo, useState } from 'react';
import { CardMediaProps } from './types';
import { mediaStyles } from './styles';
import { cn } from './utils';

export const CardMedia = memo<CardMediaProps>(({
  src,
  alt = '',
  aspectRatio = '16/9',
  children,
  className,
  objectFit = 'cover',
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  if (children) {
    return (
      <div
        className={cn(
          mediaStyles.base,
          mediaStyles.aspectRatio[aspectRatio],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (!src || imageError) {
    return (
      <div
        className={cn(
          mediaStyles.base,
          mediaStyles.aspectRatio[aspectRatio],
          'bg-gray-200 flex items-center justify-center',
          className
        )}
        {...props}
      >
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={cn(
        mediaStyles.base,
        mediaStyles.aspectRatio[aspectRatio],
        className
      )}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full',
          mediaStyles.objectFit[objectFit]
        )}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  );
});

CardMedia.displayName = 'CardMedia';

