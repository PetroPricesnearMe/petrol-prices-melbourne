'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { cn, patterns } from '@/styles/system/css-in-js';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div
      className={
        patterns.flex.center + ' min-h-screen bg-gray-50 px-4 dark:bg-gray-900'
      }
    >
      <div className="card w-full max-w-2xl p-8 text-center">
        <div className="mb-6 text-6xl">⚠️</div>
        <h1 className={cn(patterns.text.h1, 'mb-4')}>Something went wrong!</h1>
        <p className={cn(patterns.text.body, 'mb-8')}>
          We apologize for the inconvenience. Please try again.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => reset()} className="btn-primary btn">
            Try again
          </button>
          <Link href="/" className="btn-outline btn">
            Go home
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300">
              Error Details (Development)
            </summary>
            <pre className="mt-4 overflow-auto rounded bg-gray-100 p-4 text-xs dark:bg-gray-800">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
