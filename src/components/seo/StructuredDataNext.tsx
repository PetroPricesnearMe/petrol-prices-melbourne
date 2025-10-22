/**
 * Structured Data Component
 *
 * Renders JSON-LD structured data for SEO
 * @module components/seo/StructuredDataNext
 */

import Script from 'next/script';
import React from 'react';

interface StructuredDataProps {
  data: object | object[];
}

/**
 * StructuredData Component
 *
 * Renders JSON-LD structured data in a script tag
 *
 * @example
 * <StructuredData data={getOrganizationSchema()} />
 */
export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  const jsonLd = JSON.stringify(data);

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
      strategy="afterInteractive"
    />
  );
};

/**
 * Multiple Structured Data Component
 *
 * Renders multiple JSON-LD schemas efficiently
 */
export const MultipleStructuredData: React.FC<{ schemas: object[] }> = ({ schemas }) => {
  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={`schema-${index}`}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          strategy="afterInteractive"
        />
      ))}
    </>
  );
};

export default StructuredData;
