/**
 * DirectoryLayout Client Component
 *
 * Client-side interactive parts of DirectoryLayout
 * Used by DirectoryLayout.server.tsx
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { patterns } from '@/styles/system/css-in-js';

export interface Breadcrumb {
  label: string;
  href: string;
}

export interface DirectoryLayoutClientProps {
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
  headerVariant?: 'default' | 'minimal' | 'hero';
  showBreadcrumbs?: boolean;
}

export default function DirectoryLayoutClient({
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
  headerVariant = 'default',
  showBreadcrumbs = true,
}: DirectoryLayoutClientProps) {
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
      {showBreadcrumbs && generatedBreadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <div className={containerClass}>
            <ol className="flex items-center space-x-2 py-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
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
                      className="text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
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
        <header
          className={cn(
            'border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
            headerVariant === 'hero' &&
              'bg-gradient-to-r from-primary-600 to-primary-800 text-white',
            headerVariant === 'minimal' && 'border-b-0'
          )}
        >
          <div className={containerClass}>
            <div
              className={cn(
                headerVariant === 'minimal' ? 'py-4' : 'py-8',
                headerVariant === 'hero' && 'text-white'
              )}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  {title && (
                    <h1
                      className={cn(
                        'mb-2 font-bold',
                        headerVariant === 'minimal'
                          ? 'text-2xl text-gray-900 dark:text-white md:text-3xl'
                          : 'text-3xl md:text-4xl',
                        headerVariant === 'hero' && 'text-white'
                      )}
                    >
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p
                      className={cn(
                        'max-w-3xl',
                        headerVariant === 'hero'
                          ? 'text-lg text-white/90'
                          : 'text-lg text-gray-600 dark:text-gray-400'
                      )}
                    >
                      {description}
                    </p>
                  )}
                </div>
                {actions && (
                  <div className="flex items-center gap-3">{actions}</div>
                )}
              </div>

              {/* Filters Section */}
              {filters && (
                <div
                  className={cn(
                    'mt-6 border-t pt-6',
                    headerVariant === 'hero'
                      ? 'border-white/20'
                      : 'border-gray-200 dark:border-gray-700'
                  )}
                >
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
            <div className="flex flex-col gap-8 lg:flex-row">
              {/* Sidebar */}
              <aside className="flex-shrink-0 lg:w-64 xl:w-80">
                <div className="sticky top-4 space-y-6">{sidebar}</div>
              </aside>

              {/* Main Content */}
              <div className="min-w-0 flex-1">{children}</div>
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
        'rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800',
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
        'rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800',
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
