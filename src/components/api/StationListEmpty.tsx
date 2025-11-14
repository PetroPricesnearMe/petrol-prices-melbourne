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
        flex flex-col items-center justify-center
        min-h-[400px]
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
          w-16 h-16
          rounded-full
          bg-gray-100 dark:bg-gray-800
          flex items-center justify-center
          mb-4
        "
        aria-hidden="true"
      >
        <svg
          className="w-8 h-8 text-gray-400 dark:text-gray-500"
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
          text-xl font-semibold
          text-gray-900 dark:text-white
          mb-2
        "
      >
        {message}
      </h2>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">Try:</p>
          <ul className="list-disc list-inside space-y-1 text-left max-w-md">
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

