import Link from 'next/link';

import { cn, patterns } from '@/styles/system/css-in-js';

export default function NotFound() {
  return (
    <div className={patterns.flex.center + ' min-h-screen px-4 bg-gray-50 dark:bg-gray-900'}>
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400 mb-4">
          404
        </h1>
        <h2 className={cn(patterns.text.h2, 'mb-4')}>
          Page not found
        </h2>
        <p className={cn(patterns.text.body, 'mb-8 max-w-md')}>
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/" className="btn btn-primary">
            Go back home
          </Link>
          <Link href="/directory" className="btn btn-outline">
            Browse Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
