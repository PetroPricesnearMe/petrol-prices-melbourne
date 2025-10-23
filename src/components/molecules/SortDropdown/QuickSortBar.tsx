/**
 * QuickSortBar Component
 * Compact sort bar with result count
 * Perfect for placing above content lists
 */

'use client';

import { cn } from '@/utils/cn';
import { SortDropdown, type SortOption } from './SortDropdown';

interface QuickSortBarProps {
  sortValue: SortOption;
  onSortChange: (value: SortOption) => void;
  totalResults: number;
  currentPage?: number;
  totalPages?: number;
  syncWithUrl?: boolean;
  className?: string;
}

export function QuickSortBar({
  sortValue,
  onSortChange,
  totalResults,
  currentPage,
  totalPages,
  syncWithUrl = true,
  className,
}: QuickSortBarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 flex-wrap',
        'p-4 bg-white dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700',
        'rounded-lg shadow-sm',
        className
      )}
    >
      {/* Results Info */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          <strong className="font-semibold text-gray-900 dark:text-white">
            {totalResults.toLocaleString()}
          </strong>{' '}
          {totalResults === 1 ? 'result' : 'results'}
        </span>
        {currentPage && totalPages && (
          <>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
          </>
        )}
      </div>

      {/* Sort Dropdown */}
      <div className="w-full sm:w-auto min-w-[240px]">
        <SortDropdown
          value={sortValue}
          onChange={onSortChange}
          syncWithUrl={syncWithUrl}
        />
      </div>
    </div>
  );
}

export default QuickSortBar;

