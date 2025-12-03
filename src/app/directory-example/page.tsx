/**
 * Example Directory Page - Temporarily Disabled
 *
 * @module app/directory-example
 */

'use client';

import Link from 'next/link';

export default function DirectoryExamplePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Directory Example
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          This example page is temporarily disabled during development.
          <br />
          Visit the main directory page instead.
        </p>
        <Link 
          href="/directory"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Directory
        </Link>
      </div>
    </main>
  );
}
