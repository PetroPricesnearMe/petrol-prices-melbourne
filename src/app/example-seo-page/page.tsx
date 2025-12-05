/**
 * Example SEO-Optimized Page
 *
 * This is a complete example showing how to implement
 * all SEO and performance best practices in a Next.js 14+ page.
 *
 * Use this as a template for creating new pages.
 */

import type { Metadata } from 'next';
import Link from 'next/link';

// SEO Components
import { SEOImage, HeroImage, GalleryImage } from '@/components/seo/SEOImage';
import { StructuredData } from '@/components/StructuredData';

// SEO Utilities
import { generatePageMetadata } from '@/lib/seo/advanced-metadata';
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getBreadcrumbListSchema,
  getFAQPageSchema,
} from '@/lib/seo/comprehensive-schemas';

// ============================================================================
// Metadata Configuration (SEO)
// ============================================================================

export const metadata: Metadata = generatePageMetadata({
  title: 'Example SEO-Optimized Page - Best Practices Demo',
  description: 'A complete example of SEO and performance optimization in Next.js 14+. Includes metadata, structured data, optimized images, and Core Web Vitals optimization.',
  keywords: [
    'seo optimization',
    'next.js seo',
    'core web vitals',
    'performance optimization',
    'structured data',
    'json-ld schema',
  ],
  canonical: '/example-seo-page',
  type: 'website',
});

// Enable Incremental Static Regeneration (ISR)
export const revalidate = 3600; // Revalidate every hour

// ============================================================================
// Structured Data (JSON-LD)
// ============================================================================

function generatePageSchemas() {
  // Breadcrumb navigation
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Examples', href: '/examples' },
    { label: 'SEO Page', href: '/example-seo-page' },
  ];

  // FAQ data
  const faqs = [
    {
      question: 'How do I optimize my page for SEO?',
      answer: 'Follow best practices including proper metadata, structured data, semantic HTML, optimized images, and fast loading times. Use the Next.js Metadata API and implement JSON-LD schemas.',
    },
    {
      question: 'What are Core Web Vitals?',
      answer: 'Core Web Vitals are a set of metrics that measure real-world user experience: LCP (loading), FID/INP (interactivity), and CLS (visual stability). Aim for LCP < 2.5s, FID < 100ms, and CLS < 0.1.',
    },
    {
      question: 'How do I optimize images for performance?',
      answer: 'Use Next.js Image component with proper dimensions, enable lazy loading for below-the-fold images, use priority loading for hero images, specify responsive sizes, and use appropriate quality settings.',
    },
  ];

  return [
    getOrganizationSchema(),
    getWebSiteSchema(),
    getBreadcrumbListSchema(breadcrumbs),
    getFAQPageSchema(faqs),
  ];
}

// ============================================================================
// Page Component
// ============================================================================

export default function ExampleSEOPage() {
  const schemas = generatePageSchemas();

  return (
    <>
      {/* Structured Data (JSON-LD) */}
      <StructuredData data={schemas} />

      {/* Main Content with Semantic HTML */}
      <main className="min-h-screen">
        {/* Hero Section - LCP Optimization */}
        <section className="relative h-[60vh] min-h-[400px] max-h-[600px]">
          {/* Hero Image with Priority Loading for LCP */}
          <HeroImage
            src="/images/seo-hero.jpg"
            alt="SEO optimization guide showing page speed metrics and search rankings"
            fill
            className="object-cover"
            priority
            quality={90}
          />

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center text-white">
              {/* H1 - One per page, descriptive and keyword-rich */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Complete SEO &amp; Performance Optimization Guide
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                Best practices for Next.js 14+ with metadata, structured data, and Core Web Vitals optimization
              </p>

              {/* Call-to-Action Button (min 44x44px touch target) */}
              <Link
                href="#content"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors min-h-[44px] min-w-[44px]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-primary-600">
                  Home
                </Link>
              </li>
              <li>&gt;</li>
              <li>
                <Link href="/examples" className="hover:text-primary-600">
                  Examples
                </Link>
              </li>
              <li>&gt;</li>
              <li className="font-medium text-gray-900 dark:text-white">
                SEO Page
              </li>
            </ol>
          </nav>

          {/* Section 1: Introduction */}
          <section id="content" className="mb-12">
            {/* H2 - Section headings */}
            <h2 className="text-3xl font-bold mb-4">
              Why SEO &amp; Performance Matter
            </h2>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                Search Engine Optimization (SEO) and performance optimization are crucial for:
              </p>

              <ul>
                <li><strong>Better Rankings:</strong> Google uses Core Web Vitals as ranking signals</li>
                <li><strong>User Experience:</strong> Fast, accessible sites keep users engaged</li>
                <li><strong>Conversions:</strong> Every 100ms delay can reduce conversions by 1%</li>
                <li><strong>Visibility:</strong> Rich snippets increase click-through rates</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Key Features */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              Key Features Implemented
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Feature Card 1 */}
              <div className="card p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <SEOImage
                      src="/images/icons/metadata.svg"
                      alt="Metadata icon"
                      width={48}
                      height={48}
                      className="w-12 h-12"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Advanced Metadata
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Complete metadata configuration using Next.js 14+ API with title templates, descriptions, and Open Graph tags.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="card p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <SEOImage
                      src="/images/icons/schema.svg"
                      alt="Schema.org icon"
                      width={48}
                      height={48}
                      className="w-12 h-12"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Structured Data
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      JSON-LD schemas for Organization, LocalBusiness, FAQ, Article, and more for rich search results.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Card 3 */}
              <div className="card p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <SEOImage
                      src="/images/icons/performance.svg"
                      alt="Performance icon"
                      width={48}
                      height={48}
                      className="w-12 h-12"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Core Web Vitals
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Optimized for LCP, FID, and CLS with priority loading, lazy loading, and CLS prevention.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Card 4 */}
              <div className="card p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <SEOImage
                      src="/images/icons/mobile.svg"
                      alt="Mobile icon"
                      width={48}
                      height={48}
                      className="w-12 h-12"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Mobile-First
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Responsive design, touch optimization, and mobile-specific performance enhancements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Image Gallery (Lazy Loading Demo) */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              Optimized Image Gallery
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Below-the-fold images are lazy-loaded automatically. First few images get priority for faster perceived performance.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <GalleryImage
                  key={index}
                  index={index - 1}
                  src={`/images/gallery/image-${index}.jpg`}
                  alt={`Gallery image ${index} showing optimized loading`}
                  width={400}
                  height={300}
                  className="rounded-lg"
                  caption={`Image ${index}`}
                />
              ))}
            </div>
          </section>

          {/* Section 4: FAQ (with Schema) */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <details className="card p-6 group">
                <summary className="text-xl font-semibold cursor-pointer list-none flex items-center justify-between">
                  <span>How do I optimize my page for SEO?</span>
                  <span className="text-2xl group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Follow best practices including proper metadata, structured data, semantic HTML, optimized images, and fast loading times. Use the Next.js Metadata API and implement JSON-LD schemas.
                </p>
              </details>

              {/* FAQ Item 2 */}
              <details className="card p-6 group">
                <summary className="text-xl font-semibold cursor-pointer list-none flex items-center justify-between">
                  <span>What are Core Web Vitals?</span>
                  <span className="text-2xl group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Core Web Vitals are a set of metrics that measure real-world user experience: LCP (loading), FID/INP (interactivity), and CLS (visual stability). Aim for LCP &lt; 2.5s, FID &lt; 100ms, and CLS &lt; 0.1.
                </p>
              </details>

              {/* FAQ Item 3 */}
              <details className="card p-6 group">
                <summary className="text-xl font-semibold cursor-pointer list-none flex items-center justify-between">
                  <span>How do I optimize images for performance?</span>
                  <span className="text-2xl group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  Use Next.js Image component with proper dimensions, enable lazy loading for below-the-fold images, use priority loading for hero images, specify responsive sizes, and use appropriate quality settings.
                </p>
              </details>
            </div>
          </section>

          {/* Section 5: Call-to-Action */}
          <section className="card p-8 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Optimize Your Site?
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Use this template as a starting point for creating SEO-optimized pages in your Next.js application.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/documentation"
                className="btn btn-primary min-h-[44px]"
              >
                Read Full Documentation
              </Link>

              <Link
                href="/examples"
                className="btn btn-outline min-h-[44px]"
              >
                View More Examples
              </Link>
            </div>
          </section>
        </article>

        {/* Related Content Section */}
        <aside className="bg-gray-50 dark:bg-gray-900 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">
              Related Resources
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Related Link 1 */}
              <Link
                href="/guides/seo"
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">
                  SEO Guide
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete guide to SEO optimization in Next.js
                </p>
              </Link>

              {/* Related Link 2 */}
              <Link
                href="/guides/performance"
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Performance Guide
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Optimize Core Web Vitals and page speed
                </p>
              </Link>

              {/* Related Link 3 */}
              <Link
                href="/guides/accessibility"
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Accessibility Guide
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Build accessible, WCAG-compliant sites
                </p>
              </Link>
            </div>
          </div>
        </aside>
      </main>
    </>
  );
}
