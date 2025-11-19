/**
 * DirectoryLayout Server Component
 * 
 * Server-side version of DirectoryLayout for optimal SEO and performance
 * Use this for pages that don't need client-side interactivity in the layout
 */

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import DirectoryLayoutClient, { type Breadcrumb } from './DirectoryLayout.client';
import { generateCanonicalUrl } from '@/lib/seo/canonical';

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
  metadata?: Partial<Metadata>;
}

/**
 * Server Component DirectoryLayout
 * 
 * This is the main export - use this in your pages
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
  metadata,
}: DirectoryLayoutProps) {
  // Generate canonical URL from current path if not provided
  const finalCanonicalUrl = canonicalUrl || (title ? generateCanonicalUrl(title.toLowerCase().replace(/\s+/g, '-')) : undefined);

  return (
    <>
      {/* Inject canonical URL in head if provided */}
      {finalCanonicalUrl && (
        <link rel="canonical" href={finalCanonicalUrl} />
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

