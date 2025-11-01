import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb Component
 * Provides clear navigation hierarchy and user orientation
 * Follows WCAG 2.1 AA guidelines for accessibility
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-sm', className)}
    >
      <ol className="flex items-center space-x-2" role="list">
        {/* Home link */}
        <li>
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Home"
          >
            <HomeIcon className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
            {item.current ? (
              <span
                className="font-medium text-gray-900 dark:text-white"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href || '#'}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
