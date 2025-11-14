/**
 * Category Chips Component
 *
 * Dynamic, filterable category chips with multi-select capabilities
 * Features:
 * - Multi-select with visual indicators
 * - Keyboard navigation
 * - Clear all functionality
 * - Badge counts
 * - Mobile responsive
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';

import { cn } from '@/lib/utils';

export interface Category {
  id: string;
  label: string;
  icon?: string;
  count?: number;
  color?: string;
}

export interface CategoryChipsProps {
  /** Available categories */
  categories: Category[];
  /** Selected category IDs */
  selectedCategories?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Maximum number of selections allowed */
  maxSelections?: number;
  /** Show category counts */
  showCounts?: boolean;
  /** Allow multiple selections */
  multiSelect?: boolean;
  /** Custom className */
  className?: string;
  /** Variant style */
  variant?: 'default' | 'compact' | 'pill';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategories = [],
  onSelectionChange,
  maxSelections,
  showCounts = true,
  multiSelect = true,
  className,
  variant = 'default',
  size = 'md',
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedCategories);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(categories);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedIds(selectedCategories);
  }, [selectedCategories]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredCategories(categories);
      return;
    }

    const filtered = categories.filter((cat) =>
      cat.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const handleToggle = useCallback(
    (categoryId: string) => {
      if (!multiSelect) {
        const newSelection = selectedIds.includes(categoryId) ? [] : [categoryId];
        setSelectedIds(newSelection);
        onSelectionChange?.(newSelection);
        return;
      }

      setSelectedIds((prev) => {
        let newSelection: string[];

        if (prev.includes(categoryId)) {
          // Remove selection
          newSelection = prev.filter((id) => id !== categoryId);
        } else {
          // Add selection
          if (maxSelections && prev.length >= maxSelections) {
            // Don't exceed max selections
            return prev;
          }
          newSelection = [...prev, categoryId];
        }

        onSelectionChange?.(newSelection);
        return newSelection;
      });
    },
    [multiSelect, maxSelections, onSelectionChange]
  );

  const handleClearAll = useCallback(() => {
    setSelectedIds([]);
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  const selectedCount = selectedIds.length;
  const hasSelection = selectedCount > 0;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={cn('category-chips', className)} role="group" aria-label="Category filters">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Categories</h3>
          {hasSelection && (
            <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full">
              {selectedCount}
            </span>
          )}
        </div>
        {hasSelection && (
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Clear all selections"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search Filter */}
      {categories.length > 8 && (
        <div className="mb-3">
          <input
            type="search"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg',
              'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500'
            )}
            aria-label="Search categories"
          />
        </div>
      )}

      {/* Chips Container */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {filteredCategories.map((category) => {
            const isSelected = selectedIds.includes(category.id);
            const disabled = !isSelected && maxSelections && selectedIds.length >= maxSelections;

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleToggle(category.id)}
                disabled={disabled}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg font-medium transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  sizeClasses[size],
                  {
                    // Selected state
                    'bg-primary-600 text-white shadow-md hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600':
                      isSelected,
                    // Unselected state
                    'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400':
                      !isSelected,
                    // Disabled state
                    'border-gray-200 dark:border-gray-700': disabled,
                  }
                )}
                aria-pressed={isSelected}
                aria-label={`Toggle ${category.label} filter`}
                type="button"
              >
                {category.icon && (
                  <span className={cn('flex-shrink-0', iconSizeClasses[size])} aria-hidden="true">
                    {category.icon}
                  </span>
                )}
                <span>{category.label}</span>
                {showCounts && category.count !== undefined && (
                  <span className="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-black/10 dark:bg-white/10">
                    {category.count}
                  </span>
                )}
                {isSelected && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </motion.svg>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* No results */}
      {searchQuery && filteredCategories.length === 0 && (
        <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          No categories found matching &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
};

export default CategoryChips;
