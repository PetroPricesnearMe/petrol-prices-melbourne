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
    <div className={patterns.flex.center + ' min-h-screen px-4 bg-gray-50 dark:bg-gray-900'}>
      <div className="card max-w-2xl w-full p-8 text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className={cn(patterns.text.h1, 'mb-4')}>
          Something went wrong!
        </h1>
        <p className={cn(patterns.text.body, 'mb-8')}>
          We apologize for the inconvenience. Please try again.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button onClick={() => reset()} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn btn-outline">
            Go home
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer font-semibold text-sm text-gray-700 dark:text-gray-300">
              Error Details (Development)
            </summary>
            <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
