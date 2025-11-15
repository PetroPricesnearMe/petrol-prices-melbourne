/**
 * Error UI for API Example Page
 *
 * Next.js automatically shows this when the page encounters an error
 */

'use client';

import React from 'react';

import { StationListError } from '@/components/api/StationListError';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            API Integration Example
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <StationListError error={error} onRetry={reset} />
      </main>
    </div>
  );
}
