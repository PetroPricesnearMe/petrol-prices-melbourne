/**
 * StationListEmpty Component
 *
 * Empty state display when no stations are found
 * Provides helpful messaging and actions
 *
 * @component
 */

import React from 'react';

export interface StationListEmptyProps {
  /** Custom empty message */
  message?: string;
  /** Show search suggestions */
  showSuggestions?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * StationListEmpty - Empty state display
 *
 * Features:
 * - Clear messaging
 * - Helpful suggestions
 * - Accessible announcements
 */
export function StationListEmpty({
  message = 'No stations found',
  showSuggestions = true,
  className = '',
}: StationListEmptyProps) {
  return (
    <div
      className={`
        station-list-empty
        flex min-h-[400px] flex-col items-center
        justify-center
        p-8
        text-center
        ${className}
      `}
      role="status"
      aria-live="polite"
    >
      {/* Empty icon */}
      <div
        className="
          mb-4 flex
          h-16
          w-16 items-center
          justify-center rounded-full bg-gray-100
          dark:bg-gray-800
        "
        aria-hidden="true"
      >
        <svg
          className="h-8 w-8 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>

      {/* Empty message */}
      <h2
        className="
          mb-2 text-xl
          font-semibold text-gray-900
          dark:text-white
        "
      >
        {message}
      </h2>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">Try:</p>
          <ul className="max-w-md list-inside list-disc space-y-1 text-left">
            <li>Adjusting your search filters</li>
            <li>Clearing any active filters</li>
            <li>Expanding your search radius</li>
            <li>Checking back later for new stations</li>
          </ul>
        </div>
      )}
    </div>
  );
}

StationListEmpty.displayName = 'StationListEmpty';
