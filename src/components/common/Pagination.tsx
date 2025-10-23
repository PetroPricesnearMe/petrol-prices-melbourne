/**
 * Pagination Component
 * 
 * A fully accessible, keyboard-navigable pagination component with smooth animations.
 * Supports both client-side and server-side pagination.
 * 
 * Features:
 * - ARIA accessibility labels
 * - Full keyboard navigation (Arrow keys, Home, End)
 * - Smooth fade/slide animations
 * - Responsive design
 * - Customizable appearance
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PaginationProps {
  /** Current active page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Number of page buttons to show on each side of current page */
  siblingCount?: number;
  /** Show first/last page buttons */
  showFirstLast?: boolean;
  /** Show previous/next buttons */
  showPrevNext?: boolean;
  /** Disable pagination */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Animation type */
  animationType?: 'fade' | 'slide' | 'none';
  /** Total items count (for display) */
  totalItems?: number;
  /** Items per page (for display) */
  itemsPerPage?: number;
  /** Show items info */
  showItemsInfo?: boolean;
  /** Scroll to top on page change */
  scrollToTop?: boolean;
  /** Scroll behavior */
  scrollBehavior?: ScrollBehavior;
}

/**
 * Generate range of page numbers to display
 */
const generatePageRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | 'ellipsis')[] => {
  const totalPageNumbers = siblingCount * 2 + 5; // siblings + current + first + last + 2 ellipsis

  // If total pages is less than total page numbers to show, return all pages
  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  // No left ellipsis, show right ellipsis
  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, 'ellipsis', totalPages];
  }

  // No right ellipsis, show left ellipsis
  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [firstPageIndex, 'ellipsis', ...rightRange];
  }

  // Both ellipses
  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [firstPageIndex, 'ellipsis', ...middleRange, 'ellipsis', lastPageIndex];
};

/**
 * Pagination animations
 */
const fadeAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

const slideAnimation = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 }
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  disabled = false,
  className = '',
  size = 'md',
  animationType = 'fade',
  totalItems,
  itemsPerPage,
  showItemsInfo = true,
  scrollToTop = true,
  scrollBehavior = 'smooth',
}) => {
  const paginationRef = useRef<HTMLDivElement>(null);

  // Generate page numbers to display
  const pages = generatePageRange(currentPage, totalPages, siblingCount);

  // Size classes
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const buttonSizeClasses = {
    sm: 'px-2 py-1 min-w-[32px]',
    md: 'px-3 py-2 min-w-[40px]',
    lg: 'px-4 py-3 min-w-[48px]',
  };

  // Get animation config
  const getAnimation = () => {
    switch (animationType) {
      case 'fade':
        return fadeAnimation;
      case 'slide':
        return slideAnimation;
      case 'none':
      default:
        return {};
    }
  };

  const animation = getAnimation();

  /**
   * Handle page change with animations
   */
  const handlePageChange = useCallback(
    (page: number) => {
      if (disabled || page === currentPage || page < 1 || page > totalPages) {
        return;
      }

      onPageChange(page);

      // Scroll to top if enabled
      if (scrollToTop) {
        window.scrollTo({ top: 0, behavior: scrollBehavior });
      }
    },
    [currentPage, totalPages, onPageChange, disabled, scrollToTop, scrollBehavior]
  );

  /**
   * Keyboard navigation
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!paginationRef.current?.contains(document.activeElement)) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePageChange(currentPage - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handlePageChange(currentPage + 1);
          break;
        case 'Home':
          e.preventDefault();
          handlePageChange(1);
          break;
        case 'End':
          e.preventDefault();
          handlePageChange(totalPages);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, handlePageChange]);

  /**
   * Calculate items info
   */
  const getItemsInfo = () => {
    if (!totalItems || !itemsPerPage) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return { startItem, endItem };
  };

  const itemsInfo = getItemsInfo();

  // Don't render if only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      ref={paginationRef}
      className={`pagination-container ${className}`}
      role="navigation"
      aria-label="Pagination Navigation"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          className={`flex flex-col items-center gap-4 ${sizeClasses[size]}`}
          {...animation}
        >
          {/* Items info */}
          {showItemsInfo && itemsInfo && (
            <div
              className="text-gray-600 dark:text-gray-400 text-sm"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              Showing <span className="font-semibold">{itemsInfo.startItem}</span> to{' '}
              <span className="font-semibold">{itemsInfo.endItem}</span> of{' '}
              <span className="font-semibold">{totalItems}</span> items
            </div>
          )}

          {/* Pagination controls */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* First page button */}
            {showFirstLast && (
              <button
                onClick={() => handlePageChange(1)}
                disabled={disabled || currentPage === 1}
                className={`
                  ${buttonSizeClasses[size]}
                  rounded-lg border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-800
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-50 dark:hover:bg-gray-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  touch-manipulation
                `}
                aria-label="Go to first page"
              >
                <span aria-hidden="true">⟨⟨</span>
              </button>
            )}

            {/* Previous button */}
            {showPrevNext && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={disabled || currentPage === 1}
                className={`
                  ${buttonSizeClasses[size]}
                  rounded-lg border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-800
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-50 dark:hover:bg-gray-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  touch-manipulation
                  font-medium
                `}
                aria-label="Go to previous page"
                aria-disabled={disabled || currentPage === 1}
              >
                <span className="flex items-center gap-1">
                  <span aria-hidden="true">←</span>
                  <span className="hidden sm:inline">Previous</span>
                </span>
              </button>
            )}

            {/* Page number buttons */}
            <div className="flex items-center gap-1" role="list">
              {pages.map((page, index) => {
                if (page === 'ellipsis') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-gray-400 dark:text-gray-600"
                      aria-hidden="true"
                      role="presentation"
                    >
                      ···
                    </span>
                  );
                }

                const isActive = page === currentPage;

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    disabled={disabled}
                    className={`
                      ${buttonSizeClasses[size]}
                      rounded-lg border
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      touch-manipulation
                      font-medium
                      ${
                        isActive
                          ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    aria-label={`Go to page ${page}`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-disabled={disabled}
                    role="listitem"
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            {showPrevNext && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={disabled || currentPage === totalPages}
                className={`
                  ${buttonSizeClasses[size]}
                  rounded-lg border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-800
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-50 dark:hover:bg-gray-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  touch-manipulation
                  font-medium
                `}
                aria-label="Go to next page"
                aria-disabled={disabled || currentPage === totalPages}
              >
                <span className="flex items-center gap-1">
                  <span className="hidden sm:inline">Next</span>
                  <span aria-hidden="true">→</span>
                </span>
              </button>
            )}

            {/* Last page button */}
            {showFirstLast && (
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={disabled || currentPage === totalPages}
                className={`
                  ${buttonSizeClasses[size]}
                  rounded-lg border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-800
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-50 dark:hover:bg-gray-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  touch-manipulation
                `}
                aria-label="Go to last page"
                aria-disabled={disabled || currentPage === totalPages}
              >
                <span aria-hidden="true">⟩⟩</span>
              </button>
            )}
          </div>

          {/* Page info (for screen readers) */}
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            Page {currentPage} of {totalPages}
          </div>
        </motion.div>
      </AnimatePresence>
    </nav>
  );
};

export default Pagination;

