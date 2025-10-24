/**
 * DirectoryLayout Component
 * Reusable layout for all listing and detail pages with SEO optimization
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { patterns } from '@/styles/system/css-in-js';
import { cn } from '@/utils/cn';

interface Breadcrumb {
  label: string;
  href: string;
}

export interface DirectoryLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  sidebar?: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
  showSidebar?: boolean;
  className?: string;
  containerVariant?: 'default' | 'wide' | 'full';
}

export default function DirectoryLayout({
  children,
  title,
  description,
  breadcrumbs,
  sidebar,
  filters,
  actions,
  showSidebar = false,
  className,
  containerVariant = 'default',
}: DirectoryLayoutProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname if not provided
  const generatedBreadcrumbs = breadcrumbs || generateBreadcrumbs(pathname);

  const containerClass = {
    default: patterns.container(),
    wide: patterns.container('wide'),
    full: 'w-full px-4',
  }[containerVariant];

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      {/* Breadcrumbs Navigation */}
      {generatedBreadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
        >
          <div className={containerClass}>
            <ol className="flex items-center space-x-2 py-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              {generatedBreadcrumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  {index === generatedBreadcrumbs.length - 1 ? (
                    <span
                      className="font-medium text-gray-900 dark:text-white"
                      aria-current="page"
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </nav>
      )}

      {/* Page Header */}
      {(title || description || filters || actions) && (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className={containerClass}>
            <div className="py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  {title && (
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
                      {description}
                    </p>
                  )}
                </div>
                {actions && <div className="flex items-center gap-3">{actions}</div>}
              </div>

              {/* Filters Section */}
              {filters && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  {filters}
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={cn('py-8', showSidebar && 'lg:py-12')}>
        <div className={containerClass}>
          {showSidebar ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <aside className="lg:w-64 xl:w-80 flex-shrink-0">
                <div className="sticky top-4 space-y-6">{sidebar}</div>
              </aside>

              {/* Main Content */}
              <div className="flex-1 min-w-0">{children}</div>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}

/**
 * Generate breadcrumbs from pathname
 */
function generateBreadcrumbs(pathname: string): Breadcrumb[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = formatBreadcrumbLabel(segment);
    breadcrumbs.push({ label, href: currentPath });
  }

  return breadcrumbs;
}

/**
 * Format breadcrumb label from URL segment
 */
function formatBreadcrumbLabel(segment: string): string {
  // Handle dynamic route segments
  if (segment.match(/^\[.*\]$/)) {
    return segment.replace(/\[|\]/g, '');
  }

  // Convert kebab-case to Title Case
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Filter Panel Component for Directory Pages
 */
export function DirectoryFilterPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Stats Bar Component for Directory Pages
 */
export function DirectoryStatsBar({
  stats,
  className,
}: {
  stats: Array<{ label: string; value: string | number }>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4',
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-around gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
