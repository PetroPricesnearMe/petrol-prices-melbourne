/**
 * CMS Content Component
 * 
 * Reusable component for rendering dynamic CMS content
 * with loading states, error handling, and empty states
 */

'use client';

import React, { ReactNode } from 'react';
import { CMSContent as CMSContentType } from '@/lib/cms/types';

interface CMSContentProps<T extends CMSContentType> {
  data: T[] | null;
  isLoading?: boolean;
  error?: Error | string | null;
  emptyMessage?: string;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function CMSContent<T extends CMSContentType>({
  data,
  isLoading = false,
  error = null,
  emptyMessage = 'No content available',
  loadingComponent,
  errorComponent,
  renderItem,
  className = '',
  'aria-label': ariaLabel = 'Content list',
}: CMSContentProps<T>) {
  // Loading state
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="mt-4 text-sm text-gray-600">Loading content...</p>
          <span className="sr-only">Loading</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }

    const errorMessage = typeof error === 'string' ? error : error.message;

    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6" role="alert">
        <div className="flex items-start gap-3">
          <svg
            className="h-6 w-6 flex-shrink-0 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-red-800">Error Loading Content</h3>
            <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="mt-4 text-sm text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  // Render content
  return (
    <div className={className} aria-label={ariaLabel}>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Showing {data.length} item{data.length !== 1 ? 's' : ''}
      </div>
      {data.map((item, index) => (
        <React.Fragment key={item.id}>{renderItem(item, index)}</React.Fragment>
      ))}
    </div>
  );
}

/**
 * Loading Skeleton Component
 */
export function CMSLoadingSkeleton({ count = 3, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={className} role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg border border-gray-200 bg-white p-6">
          <div className="space-y-3">
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

