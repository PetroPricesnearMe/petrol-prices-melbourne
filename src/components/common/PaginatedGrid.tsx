/**
 * PaginatedGrid Component
 *
 * A responsive grid layout with built-in pagination and smooth animations.
 * Features:
 * - Fluid responsive grid (1/2/3/4 columns)
 * - Consistent gap spacing
 * - Uniform card heights
 * - Smooth page transitions
 * - ARIA accessibility
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';
import React, { useState, useCallback } from 'react';

import Pagination from './Pagination';

export interface PaginatedGridProps<T = any> {
  /** Array of items to display */
  items: T[];
  /** Render function for each item */
  renderItem: (item: T, index: number) => ReactNode;
  /** Items per page */
  itemsPerPage?: number;
  /** Gap size (Tailwind spacing) */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Grid columns configuration */
  columns?: {
    base?: 1 | 2 | 3 | 4;
    sm?: 1 | 2 | 3 | 4;
    md?: 1 | 2 | 3 | 4;
    lg?: 1 | 2 | 3 | 4;
    xl?: 1 | 2 | 3 | 4;
    '2xl'?: 1 | 2 | 3 | 4;
  };
  /** Custom grid class */
  gridClassName?: string;
  /** Container class */
  containerClassName?: string;
  /** Loading state */
  loading?: boolean;
  /** Empty state component */
  emptyState?: ReactNode;
  /** Loading state component */
  loadingState?: ReactNode;
  /** Pagination position */
  paginationPosition?: 'top' | 'bottom' | 'both';
  /** Animation type */
  animationType?: 'fade' | 'slide' | 'scale' | 'none';
  /** Stagger children animations */
  staggerChildren?: boolean;
  /** Enable keyboard navigation */
  keyboardNav?: boolean;
  /** Scroll to top on page change */
  scrollToTop?: boolean;
  /** Show items info */
  showItemsInfo?: boolean;
  /** Pagination size */
  paginationSize?: 'sm' | 'md' | 'lg';
}

/**
 * Gap size mappings
 */
const gapClasses = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-10',
  '2xl': 'gap-12',
};

/**
 * Build responsive grid classes
 */
const buildGridClasses = (columns?: PaginatedGridProps['columns']): string => {
  const defaultColumns = {
    base: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 4,
  };

  const finalColumns = { ...defaultColumns, ...columns };

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return [
    colClasses[finalColumns.base],
    finalColumns.sm && `sm:grid-cols-${finalColumns.sm}`,
    finalColumns.md && `md:grid-cols-${finalColumns.md}`,
    finalColumns.lg && `lg:grid-cols-${finalColumns.lg}`,
    finalColumns.xl && `xl:grid-cols-${finalColumns.xl}`,
    finalColumns['2xl'] && `2xl:grid-cols-${finalColumns['2xl']}`,
  ]
    .filter(Boolean)
    .join(' ');
};

/**
 * Grid item animations
 */
const itemVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
};

/**
 * Container animation with stagger
 */
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export function PaginatedGrid<T = any>({
  items,
  renderItem,
  itemsPerPage = 12,
  gap = 'md',
  columns,
  gridClassName = '',
  containerClassName = '',
  loading = false,
  emptyState,
  loadingState,
  paginationPosition = 'bottom',
  animationType = 'fade',
  staggerChildren = true,
  keyboardNav = true,
  scrollToTop = true,
  showItemsInfo = true,
  paginationSize = 'md',
}: PaginatedGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Build grid classes
  const gridClasses = `
    grid
    ${buildGridClasses(columns)}
    ${gapClasses[gap]}
    auto-rows-fr
    ${gridClassName}
  `.trim();

  // Get item animation variant
  const variant = itemVariants[animationType] || itemVariants.fade;

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={items.length}
        itemsPerPage={itemsPerPage}
        showItemsInfo={showItemsInfo}
        scrollToTop={scrollToTop}
        size={paginationSize}
        animationType={animationType}
      />
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className={containerClassName}>
        {loadingState || (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className={containerClassName}>
        {emptyState || (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No items found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or search criteria
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {/* Top pagination */}
      {(paginationPosition === 'top' || paginationPosition === 'both') && (
        <div className="mb-8">{renderPagination()}</div>
      )}

      {/* Grid with animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          className={gridClasses}
          variants={staggerChildren ? containerVariants : undefined}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {currentItems.map((item, index) => (
            <motion.div
              key={startIndex + index}
              variants={variant}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              className="h-full" // Ensure uniform heights
            >
              {renderItem(item, startIndex + index)}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Bottom pagination */}
      {(paginationPosition === 'bottom' || paginationPosition === 'both') && (
        <div className="mt-8">{renderPagination()}</div>
      )}
    </div>
  );
}

export default PaginatedGrid;
