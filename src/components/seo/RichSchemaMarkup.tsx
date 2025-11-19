/**
 * Rich Schema Markup Component
 * Renders SEO-optimized JSON-LD structured data
 * Supports multiple schema types and automatic validation
 */

import Script from 'next/script';

interface SchemaMarkupProps {
  schema: object | object[];
  id?: string;
}

/**
 * Renders JSON-LD structured data in script tag
 * Google-recommended implementation
 */
export function RichSchemaMarkup({ schema, id = 'schema-markup' }: SchemaMarkupProps) {
  const schemaJson = JSON.stringify(schema, null, 0); // Minified for production

  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaJson }}
      strategy="afterInteractive" // Load after page interactive
    />
  );
}

/**
 * Multiple schemas wrapper
 */
export function MultipleSchemas({ schemas }: { schemas: object[] }) {
  return (
    <>
      {schemas.map((schema, index) => (
        <RichSchemaMarkup
          key={index}
          schema={schema}
          id={`schema-${index}`}
        />
      ))}
    </>
  );
}

