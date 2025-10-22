'use client';

import { useEffect } from 'react';

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
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Something went wrong!
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          We apologize for the inconvenience. Please try again.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}
