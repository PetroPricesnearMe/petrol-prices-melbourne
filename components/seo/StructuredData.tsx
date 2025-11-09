/**
 * Structured Data Component
 * Renders JSON-LD structured data for SEO
 */

import Script from 'next/script';
import React from 'react';

interface StructuredDataProps {
  data: Record<string, any> | Record<string, any>[];
}

export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map((item, index) => (
        <Script
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item, null, process.env.NODE_ENV === 'development' ? 2 : 0),
          }}
        />
      ))}
    </>
  );
};

export default StructuredData;
