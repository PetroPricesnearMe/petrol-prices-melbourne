/**
 * Rating Slider Component
 *
 * Customizable rating filter with star display
 * Features:
 * - Single or multi-select ratings
 * - Visual star indicators
 * - Keyboard accessible
 * - Smooth animations
 */

'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';

import { cn } from '@/lib/utils';

export interface RatingSliderProps {
  /** Current selected rating (0 = all, 1-5 = specific rating) */
  minRating?: number;
  /** Callback when rating changes */
  onChange?: (rating: number) => void;
  /** Maximum rating (default: 5) */
  maxRating?: number;
  /** Show value label */
  showLabel?: boolean;
  /** Custom className */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Show half-star ratings */
  allowHalf?: boolean;
}

export const RatingSlider: React.FC<RatingSliderProps> = ({
  minRating = 0,
  onChange,
  maxRating = 5,
  showLabel = true,
  className,
  size = 'md',
  disabled = false,
  allowHalf = false,
}) => {
  const [currentRating, setCurrentRating] = useState(minRating);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    setCurrentRating(minRating);
  }, [minRating]);

  const handleRatingChange = useCallback(
    (newRating: number) => {
      if (disabled) return;

      // Toggle behavior: clicking the same rating toggles it off
      const finalRating = newRating === currentRating ? 0 : newRating;
      setCurrentRating(finalRating);
      onChange?.(finalRating);
    },
    [disabled, currentRating, onChange]
  );

  const handleMouseEnter = useCallback(
    (rating: number) => {
      if (!disabled) {
        setHoveredRating(rating);
      }
    },
    [disabled]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredRating(0);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, rating: number) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleRatingChange(rating);
          break;

        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault();
          if (rating < maxRating) {
            handleRatingChange(rating + 1);
          }
          break;

        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault();
          if (rating > 0) {
            handleRatingChange(rating - 1);
          }
          break;

        case 'Home':
          e.preventDefault();
          handleRatingChange(0);
          break;

        case 'End':
          e.preventDefault();
          handleRatingChange(maxRating);
          break;
      }
    },
    [disabled, maxRating, handleRatingChange]
  );

  // Size configurations
  const sizeClasses = {
    sm: {
      star: 'w-4 h-4',
      container: 'gap-1',
      text: 'text-xs',
    },
    md: {
      star: 'w-5 h-5',
      container: 'gap-1.5',
      text: 'text-sm',
    },
    lg: {
      star: 'w-6 h-6',
      container: 'gap-2',
      text: 'text-base',
    },
  };

  const config = sizeClasses[size];

  return (
    <div className={cn('rating-slider', className)} role="group" aria-label="Rating filter">
      {showLabel && (
        <div className="flex items-center justify-between mb-3">
          <label className={cn('font-semibold text-gray-900 dark:text-gray-100', config.text)}>
            Minimum Rating
          </label>
          {currentRating > 0 && (
            <div className="flex items-center gap-1">
              <span className={cn('font-medium text-primary-600 dark:text-primary-400', config.text)}>
                {currentRating}
              </span>
              <span className={cn('text-gray-500 dark:text-gray-400', config.text)}>/ {maxRating}</span>
            </div>
          )}
        </div>
      )}

      <div
        className={cn('flex items-center', config.container)}
        role="radiogroup"
        aria-label="Select minimum rating"
      >
        {Array.from({ length: maxRating }, (_, index) => {
          const rating = index + 1;
          const isActive = rating <= currentRating;
          const isHovered = rating <= hoveredRating;

          return (
            <motion.button
              key={`star-${rating}`}
              type="button"
              onClick={() => handleRatingChange(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
              onMouseLeave={handleMouseLeave}
              onKeyDown={(e) => handleKeyDown(e, rating)}
              disabled={disabled}
              className={cn(
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                config.star
              )}
              aria-pressed={isActive}
              aria-label={`${isActive ? 'Remove' : 'Set'} minimum rating of ${rating}`}
              whileHover={{ scale: disabled ? 1 : 1.1 }}
              whileTap={{ scale: disabled ? 1 : 0.95 }}
            >
              <svg
                className={cn(
                  'transition-colors duration-200',
                  isActive ? 'text-yellow-400 dark:text-yellow-500' : 'text-gray-300 dark:text-gray-600',
                  isHovered && !isActive && 'text-yellow-300 dark:text-yellow-600'
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          );
        })}

        {currentRating === 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            type="button"
            onClick={() => handleRatingChange(0)}
            className={cn(
              'ml-2 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
              'transition-colors rounded',
              'disabled:opacity-50'
            )}
            disabled={disabled}
            aria-label="Clear rating filter"
          >
            Clear
          </motion.button>
        )}
      </div>

      {/* Legend */}
      {currentRating > 0 && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Showing stations rated {currentRating}+ stars
        </div>
      )}
    </div>
  );
};

export default RatingSlider;
