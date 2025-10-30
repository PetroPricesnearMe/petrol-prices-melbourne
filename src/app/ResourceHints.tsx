/**
 * Resource Hints Component
 * Provides preconnect, prefetch, and DNS hints for external resources
 * Improves loading performance by establishing connections early
 */

export function ResourceHints() {
  return (
    <>
      {/* Preconnect to critical external domains */}
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://vercel.live"
        crossOrigin="anonymous"
      />

      {/* DNS prefetch for less critical resources */}
      <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
      <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />

      {/* Preload critical CSS (if any external) */}
      {/* <link rel="preload" href="/path/to/critical.css" as="style" /> */}
    </>
  );
}
