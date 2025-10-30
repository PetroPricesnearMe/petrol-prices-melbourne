'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Default breadcrumb configurations for common pages
const DEFAULT_BREADCRUMBS = {
  '/': [{ label: 'Home', path: '/', icon: '🏠', isActive: true }],
  '/directory': [
    { label: 'Home', path: '/', icon: '🏠' },
    { label: 'Station Directory', path: '/directory', icon: '🗺️', isActive: true }
  ],
  '/blog': [
    { label: 'Home', path: '/', icon: '🏠' },
    { label: 'Blog', path: '/blog', icon: '📝', isActive: true }
  ],
  '/faq': [
    { label: 'Home', path: '/', icon: '🏠' },
    { label: 'FAQ', path: '/faq', icon: '❓', isActive: true }
  ],
  '/about': [
    { label: 'Home', path: '/', icon: '🏠' },
    { label: 'About', path: '/about', icon: 'ℹ️', isActive: true }
  ],
};

const BreadcrumbsNext = ({ customCrumbs }) => {
  const pathname = usePathname();
  
  // Use custom breadcrumbs if provided, otherwise use defaults
  const breadcrumbs = customCrumbs || DEFAULT_BREADCRUMBS[pathname] || [
    { label: 'Home', path: '/', icon: '🏠' }
  ];

  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.label,
      "item": `https://petrolpricesnearme.com.au${crumb.path}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb navigation">
        <div className="container">
          <ol className="breadcrumb-list">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className={`breadcrumb-item ${crumb.isActive ? 'active' : ''}`}>
                {crumb.isActive ? (
                  <span aria-current="page">
                    {crumb.icon && <span className="breadcrumb-icon" aria-hidden="true">{crumb.icon}</span>}
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.path}>
                    {crumb.icon && <span className="breadcrumb-icon" aria-hidden="true">{crumb.icon}</span>}
                    {crumb.label}
                  </Link>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="breadcrumb-separator" aria-hidden="true">›</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
};

export default BreadcrumbsNext;

