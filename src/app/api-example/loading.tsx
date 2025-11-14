/**
 * Loading UI for API Example Page
 * 
 * Next.js automatically shows this while the page is loading
 */

import { StationListLoading } from '@/components/api/StationListLoading';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header skeleton */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl space-y-4 animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48" />
          </div>
        </div>
      </header>

      {/* Content skeleton */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse">
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-5 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6 animate-pulse" />
        </div>

        <StationListLoading count={6} />
      </main>
    </div>
  );
}

