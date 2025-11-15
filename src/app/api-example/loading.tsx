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
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl animate-pulse space-y-4">
            <div className="h-10 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-6 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-10 w-48 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </header>

      {/* Content skeleton */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-pulse rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 h-7 w-64 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-5 rounded bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        <StationListLoading count={6} />
      </main>
    </div>
  );
}
