/**
 * Fetch Error Display Component
 * 
 * Displays friendly error messages with retry functionality
 * 
 * @module components/common/FetchErrorDisplay
 */

'use client';

import { useCallback } from 'react';

import { getFriendlyError } from '@/hooks/useFetchWithRetry';

export interface FetchErrorDisplayProps {
  error: Error | null;
  isOffline: boolean;
  retryCount?: number;
  onRetry?: () => void | Promise<void>;
  onDismiss?: () => void;
  className?: string;
  variant?: 'inline' | 'banner' | 'card';
  showRetry?: boolean;
  retryLabel?: string;
}

/**
 * Fetch Error Display Component
 */
export function FetchErrorDisplay({
  error,
  isOffline,
  retryCount = 0,
  onRetry,
  onDismiss,
  className = '',
  variant = 'card',
  showRetry = true,
  retryLabel = 'Try Again',
}: FetchErrorDisplayProps) {
  const friendlyMessage = getFriendlyError(error, isOffline);

  const handleRetry = useCallback(async () => {
    if (onRetry) {
      await onRetry();
    }
  }, [onRetry]);

  if (!error) return null;

  const baseClasses = 'rounded-lg border p-4';
  const variantClasses = {
    inline: 'bg-transparent border-transparent p-0',
    banner: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    card: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  };

  const iconClasses = {
    inline: 'text-red-600 dark:text-red-400',
    banner: 'text-yellow-600 dark:text-yellow-400',
    card: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${iconClasses[variant]}`}>
          {isOffline ? (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${
            variant === 'banner' 
              ? 'text-yellow-800 dark:text-yellow-200' 
              : 'text-red-800 dark:text-red-200'
          }`}>
            {isOffline ? 'You&apos;re Offline' : 'Something Went Wrong'}
          </h3>
          <p className={`mt-1 text-sm ${
            variant === 'banner'
              ? 'text-yellow-700 dark:text-yellow-300'
              : 'text-red-700 dark:text-red-300'
          }`}>
            {friendlyMessage}
          </p>

          {retryCount > 0 && (
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Attempt {retryCount} of 3
            </p>
          )}

          {/* Actions */}
          {(showRetry || onDismiss) && (
            <div className="mt-3 flex gap-2">
              {showRetry && onRetry && (
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-600"
                  aria-label="Retry request"
                >
                  <svg
                    className="mr-1.5 h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {retryLabel}
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  aria-label="Dismiss error"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>

        {/* Close button for banner/card variants */}
        {onDismiss && variant !== 'inline' && (
          <button
            onClick={onDismiss}
            className={`flex-shrink-0 rounded p-1 transition-colors ${
              variant === 'banner'
                ? 'text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900/30'
                : 'text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30'
            }`}
            aria-label="Close error message"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

