'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { cn, patterns } from '@/styles/system/css-in-js';

interface RegionErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RegionError({ error, reset }: RegionErrorProps) {
  useEffect(() => {
    // Log the error for monitoring without breaking the UI
    // eslint-disable-next-line no-console
    console.error('Region page error:', error);
  }, [error]);

  return (
    <div
      className={
        patterns.flex.center + ' min-h-screen bg-gray-50 px-4 dark:bg-gray-900'
      }
    >
      <div className="card w-full max-w-2xl p-8 text-center">
        <div className="mb-6 text-6xl">⚠️</div>
        <h1 className={cn(patterns.text.h1, 'mb-4')}>
          Unable to load regional stations
        </h1>
        <p className={cn(patterns.text.body, 'mb-8')}>
          Something went wrong while loading this region. You can try again or
          return to the main directory.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => reset()} className="btn-primary btn">
            Try again
          </button>
          <Link href="/directory" className="btn-outline btn">
            Go to directory
          </Link>
        </div>
      </div>
    </div>
  );
}


