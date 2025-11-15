/**
 * Price Range Slider Component
 *
 * Dual-handle range slider for price filtering
 * Features:
 * - Dual thumbs for min/max selection
 * - Real-time value display
 * - Keyboard accessible
 * - Customizable min/max values
 * - Format currency display
 */

'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import React, { useState, useCallback, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

export interface PriceRange {
  min: number;
  max: number;
}

export interface PriceRangeSliderProps {
  /** Minimum possible value */
  absoluteMin?: number;
  /** Maximum possible value */
  absoluteMax?: number;
  /** Initial/current min value */
  minValue?: number;
  /** Initial/current max value */
  maxValue?: number;
  /** Callback when values change */
  onChange?: (range: PriceRange) => void;
  /** Currency symbol */
  currency?: string;
  /** Step increment */
  step?: number;
  /** Show value labels */
  showLabels?: boolean;
  /** Custom className */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  absoluteMin = 0,
  absoluteMax = 300,
  minValue = 0,
  maxValue = 300,
  onChange,
  currency = '$',
  step = 1,
  showLabels = true,
  className,
  disabled = false,
}) => {
  const [minVal, setMinVal] = useState(minValue);
  const [maxVal, setMaxVal] = useState(maxValue);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const minPosition = useMotionValue(0);
  const maxPosition = useMotionValue(100);

  const range = absoluteMax - absoluteMin;

  // Calculate percentage positions
  const minPercent = ((minVal - absoluteMin) / range) * 100;
  const maxPercent = ((maxVal - absoluteMin) / range) * 100;

  useEffect(() => {
    minPosition.set(minPercent);
    maxPosition.set(maxPercent);
  }, [minPercent, maxPercent, minPosition, maxPosition]);

  // Get value from position
  const getValueFromPosition = useCallback(
    (position: number) => {
      const value = Math.round(
        (position / range) * (absoluteMax - absoluteMin) + absoluteMin
      );
      return Math.min(Math.max(value, absoluteMin), absoluteMax);
    },
    [range, absoluteMin, absoluteMax]
  );

  // Handle min thumb drag
  const handleMinDrag = useCallback(
    (latest: number) => {
      const newValue = getValueFromPosition(latest);
      setMinVal(Math.min(newValue, maxVal - step));
    },
    [getValueFromPosition, maxVal, step]
  );

  // Handle max thumb drag
  const handleMaxDrag = useCallback(
    (latest: number) => {
      const newValue = getValueFromPosition(latest);
      setMaxVal(Math.max(newValue, minVal + step));
    },
    [getValueFromPosition, minVal, step]
  );

  // Update parent on value change
  useEffect(() => {
    onChange?.({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  // Keyboard handlers
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, thumb: 'min' | 'max') => {
      if (disabled) return;

      const increment = e.shiftKey ? step * 10 : step;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault();
          if (thumb === 'min') {
            setMinVal(Math.min(minVal + increment, maxVal - step));
          } else {
            setMaxVal(Math.min(maxVal + increment, absoluteMax));
          }
          break;

        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault();
          if (thumb === 'min') {
            setMinVal(Math.max(minVal - increment, absoluteMin));
          } else {
            setMaxVal(Math.max(maxVal - increment, minVal + step));
          }
          break;

        case 'Home':
          e.preventDefault();
          if (thumb === 'min') setMinVal(absoluteMin);
          break;

        case 'End':
          e.preventDefault();
          if (thumb === 'max') setMaxVal(absoluteMax);
          break;
      }
    },
    [minVal, maxVal, step, absoluteMin, absoluteMax, disabled]
  );

  const formatCurrency = (value: number) => `${currency}${value.toFixed(2)}`;

  return (
    <div
      className={cn('price-range-slider', className)}
      role="group"
      aria-label="Price range filter"
    >
      {showLabels && (
        <div className="mb-2 flex justify-between">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {formatCurrency(minVal)} - {formatCurrency(maxVal)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatCurrency(absoluteMin)} - {formatCurrency(absoluteMax)}
          </div>
        </div>
      )}

      <div
        ref={trackRef}
        className="relative h-6 w-full rounded-full bg-gray-200 dark:bg-gray-700"
        role="slider"
        aria-label="Price range"
        aria-valuemin={absoluteMin.toString()}
        aria-valuemax={absoluteMax.toString()}
        aria-valuenow={minVal.toString()}
      >
        {/* Active range track */}
        <div
          className="absolute h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
          aria-hidden="true"
        />

        {/* Min thumb */}
        <motion.div
          drag="x"
          dragConstraints={trackRef}
          dragElastic={0}
          onDrag={(_, info) => handleMinDrag(info.point.x)}
          onDragStart={() => setIsDragging('min')}
          onDragEnd={() => setIsDragging(null)}
          animate={{ x: `${minPercent}%` }}
          transition={{ type: 'spring', stiffness: 500, damping: 50 }}
          className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className={cn(
              'h-6 w-6 cursor-grab rounded-full border-2 border-white shadow-lg active:cursor-grabbing',
              'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label="Minimum price"
            aria-valuemin={absoluteMin.toString()}
            aria-valuemax={absoluteMax.toString()}
            aria-valuenow={minVal.toString()}
            aria-valuetext={formatCurrency(minVal)}
            onKeyDown={(e) => handleKeyDown(e, 'min')}
            style={{ touchAction: 'none' }}
          />
        </motion.div>

        {/* Max thumb */}
        <motion.div
          drag="x"
          dragConstraints={trackRef}
          dragElastic={0}
          onDrag={(_, info) => handleMaxDrag(info.point.x)}
          onDragStart={() => setIsDragging('max')}
          onDragEnd={() => setIsDragging(null)}
          animate={{ x: `${maxPercent}%` }}
          transition={{ type: 'spring', stiffness: 500, damping: 50 }}
          className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className={cn(
              'h-6 w-6 cursor-grab rounded-full border-2 border-white shadow-lg active:cursor-grabbing',
              'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label="Maximum price"
            aria-valuemin={absoluteMin.toString()}
            aria-valuemax={absoluteMax.toString()}
            aria-valuenow={maxVal.toString()}
            aria-valuetext={formatCurrency(maxVal)}
            onKeyDown={(e) => handleKeyDown(e, 'max')}
            style={{ touchAction: 'none' }}
          />
        </motion.div>
      </div>

      {/* Min/Max labels on track */}
      <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span className="font-medium">Min</span>
        <span className="font-medium">Max</span>
      </div>

      {/* Value display on drag */}
      {isDragging && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="pointer-events-none absolute left-1/2 mt-2 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-1 text-sm text-white shadow-lg dark:bg-gray-800"
        >
          {formatCurrency(isDragging === 'min' ? minVal : maxVal)}
        </motion.div>
      )}
    </div>
  );
};

export default PriceRangeSlider;
