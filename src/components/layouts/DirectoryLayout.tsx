/**
 * DirectoryLayout - Reusable Layout Component
 * 
 * A comprehensive, reusable layout component for all listing and detail pages.
 * Supports breadcrumbs, SEO metadata, sidebar, filters, and actions.
 * 
 * Features:
 * - Server and client component support
 * - Automatic breadcrumb generation
 * - SEO-optimized with canonical URLs
 * - Responsive design with sidebar support
 * - Flexible container variants
 * 
 * @module components/layouts/DirectoryLayout
 */

import type { ReactNode } from 'react';

import DirectoryLayoutClient, { type Breadcrumb } from './DirectoryLayout.client';

export type { Breadcrumb };

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
  // SEO props
  canonicalUrl?: string;
  // Layout variants
  headerVariant?: 'default' | 'minimal' | 'hero';
  showBreadcrumbs?: boolean;
}

/**
 * Server Component DirectoryLayout
 * 
 * This is the main export - use this in your pages for optimal SEO
 * 
 * @example
 * ```tsx
 * <DirectoryLayout
 *   title="Station Directory"
 *   description="Browse all stations"
 *   canonicalUrl="/directory"
 *   breadcrumbs={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Directory', href: '/directory' }
 *   ]}
 * >
 *   <StationList stations={stations} />
 * </DirectoryLayout>
 * ```
 */
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
  canonicalUrl,
  headerVariant = 'default',
  showBreadcrumbs = true,
}: DirectoryLayoutProps) {
  return (
    <>
      {/* Inject canonical URL in head if provided */}
      {canonicalUrl && (
        <link rel="canonical" href={canonicalUrl} />
      )}
      
      <DirectoryLayoutClient
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        sidebar={sidebar}
        filters={filters}
        actions={actions}
        showSidebar={showSidebar}
        className={className}
        containerVariant={containerVariant}
        headerVariant={headerVariant}
        showBreadcrumbs={showBreadcrumbs}
      >
        {children}
      </DirectoryLayoutClient>
    </>
  );
}

/**
 * Export client component for direct use when needed
 */
export { DirectoryLayoutClient };
