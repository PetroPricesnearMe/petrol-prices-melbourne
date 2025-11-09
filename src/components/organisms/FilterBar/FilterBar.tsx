/**
 * Filter Bar Component
 *
 * Horizontal filter bar with collapsible sections
 * Features:
 * - Quick filter chips
 * - Expandable filter panels
 * - Active filter indicators
 * - Clear all functionality
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

import type { Category } from './CategoryChips';
import { CategoryChips } from './CategoryChips';
import type { PriceRange } from './PriceRangeSlider';
import { PriceRangeSlider } from './PriceRangeSlider';
import { RatingSlider } from './RatingSlider';

export interface FilterBarProps {
  /** Available categories for filtering */
  categories: Category[];
  /** Selected category IDs */
  selectedCategories?: string[];
  /** Current price range */
  priceRange?: PriceRange;
  /** Minimum price absolute value */
  minPrice?: number;
  /** Maximum price absolute value */
  maxPrice?: number;
  /** Current minimum rating */
  minRating?: number;
  /** Callback when categories change */
  onCategoriesChange?: (selected: string[]) => void;
  /** Callback when price range changes */
  onPriceRangeChange?: (range: PriceRange) => void;
  /** Callback when rating changes */
  onRatingChange?: (rating: number) => void;
  /** Callback to clear all filters */
  onClearAll?: () => void;
  /** Show rating filter */
  showRating?: boolean;
  /** Show price filter */
  showPrice?: boolean;
  /** Custom className */
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategories = [],
  priceRange,
  minPrice = 0,
  maxPrice = 300,
  minRating = 0,
  onCategoriesChange,
  onPriceRangeChange,
  onRatingChange,
  onClearAll,
  showRating = true,
  showPrice = true,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePanel, setActivePanel] = useState<'categories' | 'price' | 'rating' | null>(null);

  const activeFilterCount =
    selectedCategories.length + (priceRange ? 1 : 0) + (minRating > 0 ? 1 : 0);

  const handlePanelToggle = (panel: 'categories' | 'price' | 'rating') => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  const handleClearAll = () => {
    setActivePanel(null);
    onClearAll?.();
  };

  return (
    <div
      className={cn(
        'filter-bar bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700',
        'sticky top-16 z-40 shadow-sm',
        className
      )}
      role="region"
      aria-label="Filter controls"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact View */}
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Left: Categories */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              <CategoryChips
                categories={categories}
                selectedCategories={selectedCategories}
                onSelectionChange={onCategoriesChange}
                size="sm"
                showCounts={true}
              />
            </div>
          </div>

          {/* Right: Filter Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {(showPrice || showRating) && (
              <div className="flex items-center gap-2">
                {showPrice && (
                  <button
                    onClick={() => handlePanelToggle('price')}
                    className={cn(
                      'px-3 py-1.5 text-sm font-medium rounded-lg border transition-all',
                      activePanel === 'price'
                        ? 'bg-primary-100 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-300'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600'
                    )}
                    aria-pressed={activePanel === 'price' ? 'true' : 'false'}
                    aria-label="Toggle price filter"
                  >
                    💰 Price
                    {priceRange && priceRange.min > minPrice && (
                      <span className="ml-1 text-xs">●</span>
                    )}
                  </button>
                )}

                {showRating && (
                  <button
                    onClick={() => handlePanelToggle('rating')}
                    className={cn(
                      'px-3 py-1.5 text-sm font-medium rounded-lg border transition-all',
                      activePanel === 'rating'
                        ? 'bg-primary-100 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-300'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600'
                    )}
                    aria-pressed={activePanel === 'rating' ? 'true' : 'false'}
                    aria-label="Toggle rating filter"
                  >
                    ⭐ Rating
                    {minRating > 0 && <span className="ml-1 text-xs">●</span>}
                  </button>
                )}
              </div>
            )}

            {/* Active Filter Count */}
            {activeFilterCount > 0 && (
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                onClick={handleClearAll}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all"
                aria-label={`Clear ${activeFilterCount} active filters`}
              >
                Clear All ({activeFilterCount})
              </motion.button>
            )}
          </div>
        </div>

        {/* Expanded Panels */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
            >
              {activePanel === 'price' && (
                <div className="py-4">
                  <PriceRangeSlider
                    absoluteMin={minPrice}
                    absoluteMax={maxPrice}
                    minValue={priceRange?.min}
                    maxValue={priceRange?.max}
                    onChange={onPriceRangeChange}
                  />
                </div>
              )}

              {activePanel === 'rating' && (
                <div className="py-4">
                  <RatingSlider minRating={minRating} onChange={onRatingChange} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default FilterBar;
