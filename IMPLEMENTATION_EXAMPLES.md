# 📘 SEO & Performance Implementation Examples

Real-world examples showing how to implement SEO and performance optimizations in different page types.

---

## 📋 Table of Contents

1. [Landing Page](#landing-page)
2. [Station Detail Page](#station-detail-page)
3. [Directory Listing Page](#directory-listing-page)
4. [Blog Post Page](#blog-post-page)
5. [FAQ Page](#faq-page)
6. [Search Results Page](#search-results-page)

---

## 🏠 Landing Page

Complete implementation of an SEO-optimized landing page with hero image, structured data, and Core Web Vitals optimization.

```typescript
// app/page.tsx
import type { Metadata } from 'next';
import { HeroImage, SEOImage } from '@/components/seo/SEOImage';
import { StructuredData } from '@/components/StructuredData';
import { generatePageMetadata } from '@/lib/seo/advanced-metadata';
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/seo/comprehensive-schemas';

// SEO Metadata
export const metadata: Metadata = generatePageMetadata({
  title: 'Find Cheapest Petrol Prices Near Me | Save Up to 20c/L',
  description: 'Compare live petrol prices from 250+ stations in Melbourne. Save up to 20c/L with real-time fuel price updates. Free to use, no registration required.',
  keywords: ['petrol prices near me', 'cheap fuel melbourne', 'petrol station finder'],
  canonical: '/',
  type: 'website',
});

export default function HomePage() {
  // Generate structured data
  const schemas = [
    getOrganizationSchema(),
    getWebSiteSchema(),
  ];

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={schemas} />

      <main>
        {/* Hero Section - LCP Optimized */}
        <section className="relative h-screen">
          <HeroImage
            src="/hero.jpg"
            alt="Melbourne map showing 250+ petrol stations with live fuel prices"
            fill
            quality={90}
          />

          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-4">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Find Cheapest Petrol Prices Near You
              </h1>

              <p className="text-xl md:text-2xl mb-8">
                Save up to 20c/L with real-time price comparison
              </p>

              <button className="btn btn-primary btn-lg">
                Search Now
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">
              Why Choose Us
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card p-6 text-center">
                <SEOImage
                  src="/images/features/realtime.svg"
                  alt="Real-time icon"
                  width={64}
                  height={64}
                  className="mx-auto mb-4"
                />
                <h3 className="text-2xl font-semibold mb-3">
                  Real-Time Prices
                </h3>
                <p className="text-gray-600">
                  Updated every 5 minutes from multiple sources
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card p-6 text-center">
                <SEOImage
                  src="/images/features/coverage.svg"
                  alt="Coverage icon"
                  width={64}
                  height={64}
                  className="mx-auto mb-4"
                />
                <h3 className="text-2xl font-semibold mb-3">
                  250+ Stations
                </h3>
                <p className="text-gray-600">
                  Complete coverage across Melbourne
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card p-6 text-center">
                <SEOImage
                  src="/images/features/free.svg"
                  alt="Free icon"
                  width={64}
                  height={64}
                  className="mx-auto mb-4"
                />
                <h3 className="text-2xl font-semibold mb-3">
                  100% Free
                </h3>
                <p className="text-gray-600">
                  No registration or payment required
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
```

---

## ⛽ Station Detail Page

Complete station page with dynamic metadata, multiple schemas, and optimized images.

```typescript
// app/stations/[id]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SEOImage, HeroImage } from '@/components/seo/SEOImage';
import { StructuredData } from '@/components/StructuredData';
import { generateStationMetadata } from '@/lib/seo/advanced-metadata';
import { generateStationPageSchemas } from '@/lib/seo/comprehensive-schemas';
import { getStationById } from '@/lib/data/stations';

// Dynamic Metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const station = await getStationById(params.id);
  if (!station) return { title: 'Station Not Found' };
  return generateStationMetadata(station);
}

// Static Params for ISR
export async function generateStaticParams() {
  const stationIds = await getAllStationIds();
  return stationIds.slice(0, 100).map(id => ({ id: id.toString() }));
}

// Enable ISR
export const revalidate = 3600;

export default async function StationPage({ params }) {
  const station = await getStationById(params.id);

  if (!station) {
    notFound();
  }

  // Generate structured data
  const schemas = generateStationPageSchemas(station);

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={schemas} />

      <article className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li><a href="/">Home</a></li>
            <li>&gt;</li>
            <li><a href="/directory">Directory</a></li>
            <li>&gt;</li>
            <li><a href={`/directory/${station.suburb?.toLowerCase()}`}>{station.suburb}</a></li>
            <li>&gt;</li>
            <li className="font-semibold">{station.name}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{station.name}</h1>
          <p className="text-xl text-gray-600">
            {station.address}, {station.suburb} {station.postcode}
          </p>
        </header>

        {/* Hero Image */}
        <HeroImage
          src={`/images/stations/${station.brand?.toLowerCase()}.jpg`}
          alt={`${station.name} petrol station in ${station.suburb}`}
          width={1200}
          height={630}
          className="rounded-lg mb-8"
        />

        {/* Quick Info Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Current Prices */}
          <section className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">Current Prices</h2>
            <div className="space-y-3">
              {station.fuelPrices && Object.entries(station.fuelPrices).map(([type, price]) => (
                <div key={type} className="flex justify-between">
                  <span>{type}</span>
                  <span className="font-bold text-primary-600">
                    {price}¢/L
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Operating Hours */}
          <section className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">Hours</h2>
            {station.amenities?.isOpen24Hours ? (
              <p className="text-lg font-medium text-green-600">Open 24/7</p>
            ) : (
              <div className="space-y-2 text-sm">
                {/* Operating hours list */}
              </div>
            )}
          </section>

          {/* Amenities */}
          <section className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <ul className="space-y-2">
              {station.amenities?.hasCarWash && <li>✓ Car Wash</li>}
              {station.amenities?.hasShop && <li>✓ Convenience Store</li>}
              {station.amenities?.hasRestroom && <li>✓ Restrooms</li>}
              {station.amenities?.hasATM && <li>✓ ATM</li>}
            </ul>
          </section>
        </div>

        {/* Description */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">About {station.name}</h2>
          <div className="prose prose-lg max-w-none">
            <p>
              {station.locationDetails || `${station.name} is a ${station.brand} petrol station located in ${station.suburb}, Melbourne. We offer competitive fuel prices and quality service.`}
            </p>
          </div>
        </section>

        {/* Map Section - Lazy Loaded */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Location & Map</h2>
          <div className="aspect-video bg-gray-200 rounded-lg">
            {/* Lazy-loaded map component */}
          </div>
        </section>
      </article>
    </>
  );
}
```

---

## 📋 Directory Listing Page

Listing page with ItemList schema and lazy-loaded images.

```typescript
// app/directory/[suburb]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { SEOImage } from '@/components/seo/SEOImage';
import { StructuredData } from '@/components/StructuredData';
import { generateDirectoryMetadata } from '@/lib/seo/advanced-metadata';
import { generateDirectoryPageSchemas } from '@/lib/seo/comprehensive-schemas';
import { getStationsBySuburb } from '@/lib/data/stations';

// Dynamic Metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const stations = await getStationsBySuburb(params.suburb);
  return generateDirectoryMetadata(params.suburb, stations.length);
}

export default async function DirectoryPage({ params }) {
  const stations = await getStationsBySuburb(params.suburb);
  const schemas = generateDirectoryPageSchemas(stations, params.suburb);

  return (
    <>
      <StructuredData data={schemas} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Petrol Stations in {params.suburb}
          </h1>
          <p className="text-xl text-gray-600">
            Compare prices from {stations.length} stations
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station, index) => (
            <article key={station.id} className="card p-6 hover:shadow-lg transition-shadow">
              {/* Station Image - Lazy loaded after first 6 */}
              <SEOImage
                src={`/images/brands/${station.brand?.toLowerCase()}.jpg`}
                alt={`${station.brand} logo`}
                width={300}
                height={200}
                className="rounded-lg mb-4"
                isAboveFold={index < 6}
              />

              <h2 className="text-2xl font-semibold mb-2">
                <Link href={`/stations/${station.id}`} className="hover:text-primary-600">
                  {station.name}
                </Link>
              </h2>

              <p className="text-gray-600 mb-4">
                {station.address}
              </p>

              {/* Lowest Price */}
              {station.cheapestPrice && (
                <p className="text-xl font-bold text-primary-600 mb-4">
                  From {station.cheapestPrice}¢/L
                </p>
              )}

              <Link
                href={`/stations/${station.id}`}
                className="btn btn-outline w-full"
              >
                View Details
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
```

---

## 📝 Blog Post Page

Article page with Article schema and proper semantic structure.

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import { SEOImage } from '@/components/seo/SEOImage';
import { StructuredData } from '@/components/StructuredData';
import { generateArticleMetadata } from '@/lib/seo/advanced-metadata';
import { generateBlogPostSchemas } from '@/lib/seo/comprehensive-schemas';

export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  return generateArticleMetadata(article);
}

export default async function BlogPostPage({ params }) {
  const article = await getArticleBySlug(params.slug);
  const schemas = generateBlogPostSchemas(article);

  return (
    <>
      <StructuredData data={schemas} />

      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-8">
          {/* Hero Image */}
          <SEOImage
            src={article.image}
            alt={article.imageAlt}
            width={1200}
            height={630}
            isHero
            className="rounded-lg mb-6"
          />

          <h1 className="text-5xl font-bold mb-4">{article.title}</h1>

          <div className="flex items-center space-x-4 text-gray-600">
            <span>By {article.author}</span>
            <span>•</span>
            <time dateTime={article.publishedDate}>
              {new Date(article.publishedDate).toLocaleDateString()}
            </time>
            <span>•</span>
            <span>{article.readingTime} min read</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {article.tags.map(tag => (
              <span key={tag} className="badge badge-primary">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {/* Markdown or HTML content */}
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Author Bio */}
        <footer className="mt-12 pt-8 border-t">
          <div className="flex items-start space-x-4">
            <SEOImage
              src={article.authorAvatar}
              alt={`${article.author} avatar`}
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <h3 className="text-xl font-semibold">{article.author}</h3>
              <p className="text-gray-600 mt-2">{article.authorBio}</p>
            </div>
          </div>
        </footer>
      </article>
    </>
  );
}
```

---

## ❓ FAQ Page

FAQ page with FAQPage schema for rich search results.

```typescript
// app/faq/page.tsx
import type { Metadata } from 'next';
import { StructuredData } from '@/components/StructuredData';
import { generateFAQMetadata } from '@/lib/seo/advanced-metadata';
import { generateFAQPageSchemas } from '@/lib/seo/comprehensive-schemas';

const faqs = [
  {
    question: 'How often are fuel prices updated?',
    answer: 'Fuel prices are updated every 5 minutes from multiple sources including direct station feeds and crowdsourced data.',
  },
  // ... more FAQs
];

export const metadata: Metadata = generateFAQMetadata();

export default function FAQPage() {
  const schemas = generateFAQPageSchemas(faqs);

  return (
    <>
      <StructuredData data={schemas} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our service
          </p>
        </header>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="card p-6 group"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <summary
                className="text-2xl font-semibold cursor-pointer list-none flex items-center justify-between"
                itemProp="name"
              >
                <span>{faq.question}</span>
                <span className="text-2xl group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>

              <div
                className="mt-4 prose prose-lg"
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <div itemProp="text">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </main>
    </>
  );
}
```

---

## 🔍 Search Results Page

Search page with dynamic results and proper metadata.

```typescript
// app/search/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SEOImage } from '@/components/seo/SEOImage';
import { generatePageMetadata } from '@/lib/seo/advanced-metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Search Results - Petrol Stations',
  description: 'Search results for petrol stations and fuel prices',
  noIndex: true, // Don't index search results
});

export default function SearchPage({ searchParams }) {
  const query = searchParams.q || '';

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Search Results
        </h1>
        {query && (
          <p className="text-xl text-gray-600">
            Results for "{query}"
          </p>
        )}
      </header>

      <Suspense fallback={<LoadingResults />}>
        <SearchResults query={query} />
      </Suspense>
    </main>
  );
}
```

---

## ✅ Quick Checklist

For each page, ensure:

- [ ] Unique, descriptive `<h1>` tag
- [ ] Proper metadata with `generatePageMetadata()`
- [ ] Structured data with `<StructuredData />`
- [ ] Hero image with `<HeroImage />` or `priority`
- [ ] Lazy-loaded below-fold images
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Descriptive alt text for all images
- [ ] Semantic HTML (`<article>`, `<section>`, `<header>`)
- [ ] Mobile-responsive design
- [ ] Fast loading (< 2.5s LCP)

---

**See also:** `SEO_PERFORMANCE_OPTIMIZATION_GUIDE.md` for detailed explanations
