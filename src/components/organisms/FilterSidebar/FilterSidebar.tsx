/**
 * Filter Sidebar Component
 *
 * Vertical sidebar with comprehensive filter options
 * Features:
 * - Collapsible filter sections
 * - Sticky positioning
 * - Active filter tracking
 * - Mobile responsive drawer
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';

import type { Category } from '../FilterBar/CategoryChips';
import { CategoryChips } from '../FilterBar/CategoryChips';
import type { PriceRange } from '../FilterBar/PriceRangeSlider';
import { PriceRangeSlider } from '../FilterBar/PriceRangeSlider';
import { RatingSlider } from '../FilterBar/RatingSlider';

import { cn } from '@/lib/utils';

export interface FilterSidebarProps {
  /** Available categories */
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
  /** Sidebar visibility */
  isOpen?: boolean;
  /** Callback when sidebar should close */
  onClose?: () => void;
  /** Width of the sidebar */
  width?: 'sm' | 'md' | 'lg';
  /** Sticky positioning */
  sticky?: boolean;
  /** Custom className */
  className?: string;
}

interface FilterSection {
  id: string;
  title: string;
  icon?: string;
  isExpanded: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
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
  isOpen = true,
  onClose,
  width = 'md',
  sticky = true,
  className,
}) => {
  const [sections, setSections] = useState<FilterSection[]>([
    { id: 'categories', title: 'Categories', icon: '🏷️', isExpanded: true },
    { id: 'price', title: 'Price Range', icon: '💰', isExpanded: true },
    { id: 'rating', title: 'Rating', icon: '⭐', isExpanded: true },
  ]);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Close mobile sidebar when clicking outside on mobile
    const handleClickOutside = (e: MouseEvent) => {
      if (window.innerWidth < 1024 && isMobileOpen) {
        const target = e.target as HTMLElement;
        if (
          !target.closest('.filter-sidebar') &&
          !target.closest('.filter-sidebar-toggle')
        ) {
          setIsMobileOpen(false);
          onClose?.();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen, onClose]);

  const toggleSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  const handleClearAll = () => {
    onClearAll?.();
  };

  const activeFilterCount =
    selectedCategories.length + (priceRange ? 1 : 0) + (minRating > 0 ? 1 : 0);

  const widthClasses = {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
  };

  const content = (
    <div
      className={cn(
        'flex h-full flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Filters
        </h2>
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
              {activeFilterCount}
            </span>
            <button
              onClick={handleClearAll}
              className="text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Clear all filters"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Filter Content - Scrollable */}
      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
        {/* Categories Section */}
        <div className="filter-section">
          <button
            onClick={() => toggleSection('categories')}
            className="flex w-full items-center justify-between rounded-lg py-2 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-expanded={
              sections.find((s) => s.id === 'categories')?.isExpanded
                ? 'true'
                : 'false'
            }
          >
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">
                {sections.find((s) => s.id === 'categories')?.icon}
              </span>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Categories
              </h3>
            </div>
            <motion.svg
              animate={{
                rotate: sections.find((s) => s.id === 'categories')?.isExpanded
                  ? 180
                  : 0,
              }}
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </button>
          <AnimatePresence initial={false}>
            {sections.find((s) => s.id === 'categories')?.isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 overflow-hidden"
              >
                <CategoryChips
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onSelectionChange={onCategoriesChange}
                  multiSelect={true}
                  showCounts={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Section */}
        <div className="filter-section">
          <button
            onClick={() => toggleSection('price')}
            className="flex w-full items-center justify-between rounded-lg py-2 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-expanded={
              sections.find((s) => s.id === 'price')?.isExpanded
                ? 'true'
                : 'false'
            }
          >
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">
                {sections.find((s) => s.id === 'price')?.icon}
              </span>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Price Range
              </h3>
              {priceRange && priceRange.min > minPrice && (
                <span
                  className="h-2 w-2 rounded-full bg-primary-500"
                  aria-hidden="true"
                />
              )}
            </div>
            <motion.svg
              animate={{
                rotate: sections.find((s) => s.id === 'price')?.isExpanded
                  ? 180
                  : 0,
              }}
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </button>
          <AnimatePresence initial={false}>
            {sections.find((s) => s.id === 'price')?.isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 overflow-hidden"
              >
                <PriceRangeSlider
                  absoluteMin={minPrice}
                  absoluteMax={maxPrice}
                  minValue={priceRange?.min}
                  maxValue={priceRange?.max}
                  onChange={onPriceRangeChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rating Section */}
        <div className="filter-section">
          <button
            onClick={() => toggleSection('rating')}
            className="flex w-full items-center justify-between rounded-lg py-2 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-expanded={
              sections.find((s) => s.id === 'rating')?.isExpanded
                ? 'true'
                : 'false'
            }
          >
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">
                {sections.find((s) => s.id === 'rating')?.icon}
              </span>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Rating
              </h3>
              {minRating > 0 && (
                <span
                  className="h-2 w-2 rounded-full bg-primary-500"
                  aria-hidden="true"
                />
              )}
            </div>
            <motion.svg
              animate={{
                rotate: sections.find((s) => s.id === 'rating')?.isExpanded
                  ? 180
                  : 0,
              }}
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </button>
          <AnimatePresence initial={false}>
            {sections.find((s) => s.id === 'rating')?.isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 overflow-hidden"
              >
                <RatingSlider minRating={minRating} onChange={onRatingChange} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  // Desktop sidebar
  if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
    return (
      <aside
        className={cn(
          'hidden flex-col lg:flex',
          sticky ? 'lg:sticky lg:top-16 lg:self-start' : '',
          widthClasses[width],
          'filter-sidebar'
        )}
        aria-label="Filter sidebar"
      >
        {isOpen && content}
      </aside>
    );
  }

  // Mobile drawer
  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsMobileOpen(false);
                onClose?.();
              }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={cn(
                'fixed bottom-0 left-0 top-0 z-50',
                widthClasses[width],
                'filter-sidebar'
              )}
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterSidebar;
