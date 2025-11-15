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
  const isNetworkError =
    errorMessage.toLowerCase().includes('network') ||
    errorMessage.toLowerCase().includes('fetch') ||
    errorMessage.toLowerCase().includes('connection');

  const isServerError =
    errorMessage.toLowerCase().includes('server') ||
    errorMessage.toLowerCase().includes('500');

  return (
    <div
      className={`
        station-list-error
        flex min-h-[400px] flex-col items-center
        justify-center
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
          bg-red-100 dark:bg-red-900/30
          mb-4
          flex h-16
          w-16 items-center justify-center
          rounded-full
        "
        aria-hidden="true"
      >
        <svg
          className="text-red-600 dark:text-red-400 h-8 w-8"
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
          mb-2 text-xl
          font-semibold text-gray-900
          dark:text-white
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
          mb-6 max-w-md
          text-gray-600
          dark:text-gray-300
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
            min-h-[44px] min-w-[120px]
            rounded-lg bg-primary-600
            px-6
            py-3
            font-medium
            text-white transition-colors
            duration-200
            hover:bg-primary-700 focus:outline-none focus:ring-2
            focus:ring-primary-500 focus:ring-offset-2
          "
          aria-label="Retry loading stations"
        >
          Try Again
        </button>
      )}

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && error instanceof Error && (
        <details className="mt-6 max-w-md text-left">
          <summary
            className="
              cursor-pointer
              text-sm text-gray-500 hover:text-gray-700
              dark:text-gray-400 dark:hover:text-gray-300
            "
          >
            Technical Details
          </summary>
          <pre
            className="
              mt-2 max-h-48
              overflow-auto rounded
              bg-gray-100
              p-4
              text-xs
              dark:bg-gray-800
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
