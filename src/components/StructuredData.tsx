/**
 * Structured Data Component
 *
 * Renders JSON-LD structured data markup for SEO
 *
 * @module components/StructuredData
 */

import Script from 'next/script';

interface StructuredDataProps {
  data: object | object[];
}

/**
 * StructuredData Component
 *
 * Renders JSON-LD structured data markup for search engines
 * Supports both single schema objects and arrays of schemas
 */
export function StructuredData({ data }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}

/**
 * Hook for generating structured data
 *
 * Provides a convenient way to generate and render structured data
 */
export function useStructuredData(data: object | object[]) {
  return <StructuredData data={data} />;
}
