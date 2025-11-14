/**
 * StationListError Component
 * 
 * Error state display with retry functionality
 * Accessible and user-friendly
 * 
 * @component
 */

'use client';

import React from 'react';

export interface StationListErrorProps {
  /** Error object or message */
  error: Error | string | null;
  /** Retry handler */
  onRetry?: () => void;
  /** Custom className */
  className?: string;
}

/**
 * StationListError - Error state display
 * 
 * Features:
 * - Clear error messaging
 * - Retry functionality
 * - Accessible announcements
 * - User-friendly UI
 */
export function StationListError({
  error,
  onRetry,
  className = '',
}: StationListErrorProps) {
  // Extract error message
  const errorMessage =
    error instanceof Error ? error.message : error || 'An error occurred';

  // Determine error type for better UX
  const isNetworkError = errorMessage.toLowerCase().includes('network') ||
                        errorMessage.toLowerCase().includes('fetch') ||
                        errorMessage.toLowerCase().includes('connection');

  const isServerError = errorMessage.toLowerCase().includes('server') ||
                       errorMessage.toLowerCase().includes('500');

  return (
    <div
      className={`
        station-list-error
        flex flex-col items-center justify-center
        min-h-[400px]
        p-8
        text-center
        ${className}
      `}
      role="alert"
      aria-live="assertive"
    >
      {/* Error icon */}
      <div
        className="
          w-16 h-16
          rounded-full
          bg-red-100 dark:bg-red-900/30
          flex items-center justify-center
          mb-4
        "
        aria-hidden="true"
      >
        <svg
          className="w-8 h-8 text-red-600 dark:text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Error heading */}
      <h2
        className="
          text-xl font-semibold
          text-gray-900 dark:text-white
          mb-2
        "
      >
        {isNetworkError
          ? 'Connection Error'
          : isServerError
          ? 'Server Error'
          : 'Unable to Load Stations'}
      </h2>

      {/* Error message */}
      <p
        className="
          text-gray-600 dark:text-gray-300
          mb-6
          max-w-md
        "
      >
        {isNetworkError
          ? 'Unable to connect to the server. Please check your internet connection and try again.'
          : isServerError
          ? 'The server is currently experiencing issues. Please try again later.'
          : errorMessage}
      </p>

      {/* Retry button */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="
            px-6 py-3
            bg-primary-600 hover:bg-primary-700
            text-white
            font-medium
            rounded-lg
            transition-colors duration-200
            focus:outline-none
            focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            min-h-[44px] min-w-[120px]
          "
          aria-label="Retry loading stations"
        >
          Try Again
        </button>
      )}

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && error instanceof Error && (
        <details className="mt-6 text-left max-w-md">
          <summary
            className="
              cursor-pointer
              text-sm text-gray-500 dark:text-gray-400
              hover:text-gray-700 dark:hover:text-gray-300
            "
          >
            Technical Details
          </summary>
          <pre
            className="
              mt-2 p-4
              bg-gray-100 dark:bg-gray-800
              rounded
              text-xs
              overflow-auto
              max-h-48
            "
          >
            {error.stack || error.toString()}
          </pre>
        </details>
      )}
    </div>
  );
}

StationListError.displayName = 'StationListError';

