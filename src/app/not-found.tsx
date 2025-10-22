import Link from 'next/link';

import { Button } from '@/components/atoms/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Page not found
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button>Go back home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

