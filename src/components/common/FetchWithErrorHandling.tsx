/**
 * Fetch With Error Handling Component
 * 
 * Wrapper component that handles fetch errors gracefully
 * Can be used to wrap any component that needs error handling
 * 
 * @module components/common/FetchWithErrorHandling
 */

'use client';

import type { ReactNode } from 'react';

import { FetchErrorDisplay } from './FetchErrorDisplay';
import { useFetchWithRetry, type UseFetchWithRetryReturn } from '@/hooks/useFetchWithRetry';

export interface FetchWithErrorHandlingProps<T = unknown> {
  url: string | null;
  fetchOptions?: Parameters<typeof useFetchWithRetry<T>>[1];
  children: (state: UseFetchWithRetryReturn<T>) => ReactNode;
  errorDisplay?: {
    variant?: 'inline' | 'banner' | 'card';
    showRetry?: boolean;
    retryLabel?: string;
    onDismiss?: () => void;
  };
  fallback?: ReactNode;
  className?: string;
}

/**
 * Fetch With Error Handling Component
 * 
 * Wraps fetch logic with error handling, retry, and offline detection
 */
export function FetchWithErrorHandling<T = unknown>({
  url,
  fetchOptions,
  children,
  errorDisplay = {},
  fallback,
  className = '',
}: FetchWithErrorHandlingProps<T>) {
  const state = useFetchWithRetry<T>(url, fetchOptions);

  const {
    variant = 'card',
    showRetry = true,
    retryLabel = 'Try Again',
    onDismiss,
  } = errorDisplay;

  // Show error if present
  if (state.error) {
    return (
      <div className={className}>
        <FetchErrorDisplay
          error={state.error}
          isOffline={state.isOffline}
          retryCount={state.retryCount}
          onRetry={state.retry}
          onDismiss={onDismiss}
          variant={variant}
          showRetry={showRetry}
          retryLabel={retryLabel}
        />
        {fallback}
      </div>
    );
  }

  // Show loading state
  if (state.isLoading && !state.data) {
    return <>{fallback || <div className="text-center py-8">Loading...</div>}</>;
  }

  // Render children with state
  return <>{children(state)}</>;
}

