# 🚀 SEO & Performance Optimization Guide

Complete guide for implementing SEO best practices and Core Web Vitals optimization in this Next.js 14+ project.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Metadata Configuration](#metadata-configuration)
3. [Structured Data (JSON-LD)](#structured-data-json-ld)
4. [Image Optimization](#image-optimization)
5. [Core Web Vitals](#core-web-vitals)
6. [Mobile Optimization](#mobile-optimization)
7. [Performance Best Practices](#performance-best-practices)
8. [Usage Examples](#usage-examples)

---

## 🎯 Overview

This project includes comprehensive SEO and performance optimization utilities:

- ✅ **Next.js 14+ Metadata API** - Full metadata configuration
- ✅ **JSON-LD Structured Data** - Rich snippets for search engines
- ✅ **Core Web Vitals** - Optimized for LCP, FID, CLS
- ✅ **Image Optimization** - Automatic WebP/AVIF, lazy loading, priority tags
- ✅ **Mobile-First** - Responsive design and mobile SEO
- ✅ **Semantic HTML** - Proper heading hierarchy (h1-h6)
- ✅ **Canonical URLs** - Prevent duplicate content
- ✅ **Open Graph** - Social media sharing optimization
- ✅ **Twitter Cards** - Rich Twitter previews

---

## 📝 Metadata Configuration

### Basic Page Metadata

```typescript
// app/page.tsx
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/advanced-metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Find Cheapest Petrol Prices Near Me',
  description: 'Compare live petrol prices from 250+ stations...',
  keywords: ['petrol prices', 'fuel finder', 'cheap fuel'],
  canonical: '/',
  type: 'website',
});

export default function HomePage() {
  return <div>...</div>;
}
```

### Station Detail Page Metadata

```typescript
// app/stations/[id]/page.tsx
import { Metadata } from 'next';
import { generateStationMetadata } from '@/lib/seo/advanced-metadata';
import { getStationById } from '@/lib/data/stations';

export async function generateMetadata({ params }): Promise<Metadata> {
  const station = await getStationById(params.id);
  return generateStationMetadata(station);
}

export default function StationPage({ params }) {
  return <div>...</div>;
}
```

### Directory/Listing Page Metadata

```typescript
// app/directory/[suburb]/page.tsx
import { Metadata } from 'next';
import { generateDirectoryMetadata } from '@/lib/seo/advanced-metadata';

export async function generateMetadata({ params }): Promise<Metadata> {
  const stations = await getStationsBySuburb(params.suburb);
  return generateDirectoryMetadata(params.suburb, stations.length);
}
```

### Article/Blog Post Metadata

```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { generateArticleMetadata } from '@/lib/seo/advanced-metadata';

export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  return generateArticleMetadata({
    title: article.title,
    description: article.description,
    slug: params.slug,
    author: article.author,
    publishedDate: article.publishedDate,
    modifiedDate: article.modifiedDate,
    image: article.image,
    tags: article.tags,
    category: article.category,
  });
}
```

---

## 🔍 Structured Data (JSON-LD)

### Organization Schema (Site-wide)

```typescript
// app/layout.tsx
import { StructuredData } from '@/components/StructuredData';
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/seo/comprehensive-schemas';

export default function RootLayout({ children }) {
  const schemas = [
    getOrganizationSchema(),
    getWebSiteSchema(),
  ];

  return (
    <html>
      <body>
        <StructuredData data={schemas} />
        {children}
      </body>
    </html>
  );
}
```

### Gas Station Schema (Station Pages)

```typescript
// app/stations/[id]/page.tsx
import { StructuredData } from '@/components/StructuredData';
import { generateStationPageSchemas } from '@/lib/seo/comprehensive-schemas';

export default async function StationPage({ params }) {
  const station = await getStationById(params.id);
  const schemas = generateStationPageSchemas(station);

  return (
    <>
      <StructuredData data={schemas} />
      <main>
        <h1>{station.name}</h1>
        {/* Station content */}
      </main>
    </>
  );
}
```

### FAQ Schema (FAQ Pages)

```typescript
// app/faq/page.tsx
import { StructuredData } from '@/components/StructuredData';
import { generateFAQPageSchemas } from '@/lib/seo/comprehensive-schemas';

const faqs = [
  {
    question: 'How often are fuel prices updated?',
    answer: 'Fuel prices are updated every 5 minutes from multiple sources...',
  },
  // ... more FAQs
];

export default function FAQPage() {
  const schemas = generateFAQPageSchemas(faqs);

  return (
    <>
      <StructuredData data={schemas} />
      <main>
        <h1>Frequently Asked Questions</h1>
        {/* FAQ content */}
      </main>
    </>
  );
}
```

### Article Schema (Blog Posts)

```typescript
// app/blog/[slug]/page.tsx
import { StructuredData } from '@/components/StructuredData';
import { generateBlogPostSchemas } from '@/lib/seo/comprehensive-schemas';

export default async function BlogPost({ params }) {
  const article = await getArticleBySlug(params.slug);
  const schemas = generateBlogPostSchemas(article);

  return (
    <>
      <StructuredData data={schemas} />
      <article>
        <h1>{article.title}</h1>
        {/* Article content */}
      </article>
    </>
  );
}
```

### Breadcrumb Schema

```typescript
import { StructuredData } from '@/components/StructuredData';
import { getBreadcrumbListSchema } from '@/lib/seo/comprehensive-schemas';

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Directory', href: '/directory' },
  { label: 'Melbourne', href: '/directory/melbourne' },
];

function PageWithBreadcrumbs() {
  const schema = getBreadcrumbListSchema(breadcrumbs);

  return (
    <>
      <StructuredData data={schema} />
      {/* Page content */}
    </>
  );
}
```

---

## 🖼️ Image Optimization

### Hero Image (LCP Optimization)

```typescript
import { SEOImage, HeroImage } from '@/components/seo/SEOImage';

// Option 1: Using SEOImage with isHero prop
<SEOImage
  src="/hero.jpg"
  alt="Melbourne petrol stations map showing live prices"
  width={1920}
  height={1080}
  isHero
  priority
  quality={90}
  sizes="100vw"
/>

// Option 2: Using HeroImage component
<HeroImage
  src="/hero.jpg"
  alt="Melbourne petrol stations map showing live prices"
  width={1920}
  height={1080}
/>
```

### Regular Images (Lazy Loading)

```typescript
import { SEOImage } from '@/components/seo/SEOImage';

// Below-the-fold image with lazy loading
<SEOImage
  src="/station.jpg"
  alt="Shell petrol station in Melbourne CBD"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={85}
/>
```

### Logo Images

```typescript
import { LogoImage } from '@/components/seo/SEOImage';

<LogoImage
  src="/logo.png"
  alt="Petrol Price Near Me - Find Cheapest Fuel"
  width={200}
  height={50}
  quality={100}
/>
```

### Gallery Images

```typescript
import { GalleryImage } from '@/components/seo/SEOImage';

{images.map((image, index) => (
  <GalleryImage
    key={image.id}
    src={image.url}
    alt={image.alt}
    width={400}
    height={300}
    index={index} // First 4 images get priority
    caption={image.caption}
    credit={image.credit}
  />
))}
```

### Image with Schema

```typescript
<SEOImage
  src="/featured-station.jpg"
  alt="Best rated petrol station in Melbourne"
  width={1200}
  height={630}
  generateSchema // Adds ImageObject schema
  caption="Award-winning service station in Melbourne CBD"
  credit="Photo by John Doe"
/>
```

### Responsive Image Sizes

```typescript
import { generateResponsiveSizes } from '@/components/seo/SEOImage';

const sizes = generateResponsiveSizes({
  mobile: '100vw',
  tablet: '50vw',
  desktop: '33vw',
  default: '25vw',
});

<SEOImage
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  sizes={sizes}
/>
```

---

## ⚡ Core Web Vitals

### LCP (Largest Contentful Paint) - Target: < 2.5s

#### 1. Prioritize Hero Images

```typescript
// Preload critical images
import { preloadLCPImage } from '@/lib/performance/core-web-vitals';

useEffect(() => {
  preloadLCPImage('/hero.jpg', {
    as: 'image',
    type: 'image/jpeg',
    fetchPriority: 'high',
  });
}, []);
```

#### 2. Use Priority Loading

```typescript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  priority // ⚡ Load immediately, no lazy loading
  quality={90}
  fetchPriority="high"
/>
```

#### 3. Preconnect to External Domains

```typescript
// app/layout.tsx
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link rel="dns-prefetch" href="https://www.google-analytics.com" />
</head>
```

### FID/INP (First Input Delay / Interaction to Next Paint) - Target: < 100ms / < 200ms

#### 1. Defer Non-Critical JavaScript

```typescript
import { deferExecution } from '@/lib/performance/core-web-vitals';

// Defer analytics initialization
const initAnalytics = deferExecution(() => {
  // Initialize analytics
}, 1000);

useEffect(() => {
  initAnalytics();
}, []);
```

#### 2. Debounce Input Handlers

```typescript
import { debounce } from '@/lib/performance/core-web-vitals';

const handleSearch = debounce((value: string) => {
  // Perform search
}, 300);

<input onChange={(e) => handleSearch(e.target.value)} />
```

#### 3. Throttle Scroll Handlers

```typescript
import { throttle } from '@/lib/performance/core-web-vitals';

const handleScroll = throttle(() => {
  // Handle scroll
}, 100);

useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### CLS (Cumulative Layout Shift) - Target: < 0.1

#### 1. Always Specify Image Dimensions

```typescript
// ✅ Good - Prevents layout shift
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
/>

// ❌ Bad - Causes layout shift
<img src="/image.jpg" alt="Description" />
```

#### 2. Reserve Space for Dynamic Content

```typescript
import { reserveSpace } from '@/lib/performance/core-web-vitals';

<div style={reserveSpace(400)}>
  {/* Dynamic content that loads asynchronously */}
  {isLoading ? <Skeleton /> : <Content />}
</div>
```

#### 3. Use Aspect Ratio

```typescript
<div className="aspect-w-16 aspect-h-9">
  <Image src="/video-thumbnail.jpg" alt="Video" fill />
</div>
```

### Web Vitals Monitoring

```typescript
// app/layout.tsx
'use client';

import { useEffect } from 'react';
import { initWebVitalsReporter } from '@/lib/performance/core-web-vitals';
import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

export function WebVitalsReporter() {
  useEffect(() => {
    const reporter = initWebVitalsReporter({
      enableReporting: true,
      sampleRate: 1,
      debug: process.env.NODE_ENV === 'development',
      endpoint: '/api/vitals',
    });

    onCLS(reporter.report);
    onFID(reporter.report);
    onFCP(reporter.report);
    onLCP(reporter.report);
    onTTFB(reporter.report);
    onINP(reporter.report);
  }, []);

  return null;
}
```

---

## 📱 Mobile Optimization

### Mobile Viewport Configuration

```typescript
// app/layout.tsx
import { mobileViewport } from '@/lib/seo/mobile-optimization';

export const viewport = mobileViewport;
```

### Responsive Images

```typescript
import { generateResponsiveSizes } from '@/lib/seo/mobile-optimization';

const sizes = generateResponsiveSizes({
  sm: '100vw',
  md: '50vw',
  lg: '33vw',
  default: '25vw',
});

<SEOImage
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  sizes={sizes}
/>
```

### Mobile Detection

```typescript
import { isMobileDevice, isIOSDevice, isAndroidDevice } from '@/lib/seo/mobile-optimization';

function MobileOptimizedComponent() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  return isMobile ? <MobileView /> : <DesktopView />;
}
```

### Touch Target Optimization

```typescript
// Ensure buttons meet minimum touch target size (44x44px)
<button className="min-h-[44px] min-w-[44px] p-3">
  Tap Me
</button>
```

### Safe Area Insets

```typescript
import { SAFE_AREA_INSETS } from '@/lib/seo/mobile-optimization';

<div
  style={{
    paddingTop: SAFE_AREA_INSETS.paddingTop,
    paddingBottom: SAFE_AREA_INSETS.paddingBottom,
  }}
>
  Content
</div>
```

---

## 🎯 Performance Best Practices

### 1. Semantic HTML Hierarchy

```typescript
// ✅ Good - Proper heading hierarchy
<main>
  <h1>Main Page Title</h1>
  <section>
    <h2>Section Title</h2>
    <h3>Subsection Title</h3>
  </section>
  <section>
    <h2>Another Section</h2>
  </section>
</main>

// ❌ Bad - Skipping heading levels
<h1>Title</h1>
<h3>Subtitle</h3> {/* Don't skip h2 */}
```

### 2. Lazy Loading Components

```typescript
import dynamic from 'next/dynamic';

// Lazy load non-critical components
const MapView = dynamic(() => import('@/components/MapView'), {
  loading: () => <Skeleton />,
  ssr: false, // Don't render on server
});

export default function Page() {
  return (
    <div>
      <h1>Station Finder</h1>
      <MapView /> {/* Only loaded when visible */}
    </div>
  );
}
```

### 3. Resource Hints

```typescript
// app/layout.tsx
<head>
  {/* Preconnect to external domains */}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  
  {/* DNS prefetch */}
  <link rel="dns-prefetch" href="https://www.google-analytics.com" />
  <link rel="dns-prefetch" href="https://maps.googleapis.com" />
  
  {/* Preload critical fonts */}
  <link
    rel="preload"
    href="/fonts/inter.woff2"
    as="font"
    type="font/woff2"
    crossOrigin="anonymous"
  />
</head>
```

### 4. Code Splitting

```typescript
// Split large components
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});

// Split by route
const AdminDashboard = dynamic(() => import('@/components/admin/Dashboard'), {
  ssr: false,
});
```

### 5. Image Optimization Checklist

- ✅ Use Next.js `<Image>` component
- ✅ Always specify width and height
- ✅ Use `priority` for above-the-fold images
- ✅ Use responsive `sizes` attribute
- ✅ Enable lazy loading for below-the-fold images
- ✅ Use appropriate image quality (85 for regular, 90 for hero)
- ✅ Provide blur placeholders
- ✅ Use WebP/AVIF formats (automatic with Next.js)

---

## 💡 Usage Examples

### Complete Station Page Example

```typescript
// app/stations/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SEOImage } from '@/components/seo/SEOImage';
import { StructuredData } from '@/components/StructuredData';
import { generateStationMetadata } from '@/lib/seo/advanced-metadata';
import { generateStationPageSchemas } from '@/lib/seo/comprehensive-schemas';
import { getStationById } from '@/lib/data/stations';

// Generate metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const station = await getStationById(params.id);
  if (!station) return { title: 'Station Not Found' };
  return generateStationMetadata(station);
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
      <StructuredData data={schemas} />
      
      <article className="max-w-7xl mx-auto px-4 py-8">
        {/* Proper heading hierarchy */}
        <header>
          <h1 className="text-4xl font-bold mb-2">{station.name}</h1>
          <p className="text-gray-600">{station.address}</p>
        </header>

        {/* Hero image with priority loading */}
        <SEOImage
          src={`/images/stations/${station.id}.jpg`}
          alt={`${station.name} petrol station in ${station.suburb}`}
          width={1200}
          height={630}
          isHero
          priority
          className="rounded-lg my-6"
        />

        <section>
          <h2 className="text-2xl font-semibold mb-4">Current Prices</h2>
          {/* Price content */}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Location & Hours</h2>
          {/* Location content */}
        </section>

        {/* Lazy-loaded map */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Map</h2>
          <dynamic(() => import('@/components/StationMap'), {
            loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded" />,
            ssr: false,
          })} station={station} />
        </section>
      </article>
    </>
  );
}
```

### Complete Landing Page Example

```typescript
// app/page.tsx
import { Metadata } from 'next';
import { HeroImage } from '@/components/seo/SEOImage';
import { StructuredData } from '@/components/StructuredData';
import { generatePageMetadata } from '@/lib/seo/advanced-metadata';
import { generateHomePageSchemas } from '@/lib/seo/comprehensive-schemas';

export const metadata: Metadata = generatePageMetadata({
  title: 'Find Cheapest Petrol Prices Near Me | Save Up to 20c/L',
  description: 'Compare live petrol prices from 250+ stations in Melbourne. Save up to 20c/L with real-time fuel price updates. Free to use, no registration required.',
  keywords: ['petrol prices near me', 'cheap fuel melbourne', 'petrol station finder'],
  canonical: '/',
  type: 'website',
});

export default function HomePage() {
  const schemas = generateHomePageSchemas();

  return (
    <>
      <StructuredData data={schemas} />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-screen">
          <HeroImage
            src="/hero.jpg"
            alt="Melbourne map showing petrol stations with real-time prices"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold mb-4">
                Find Cheapest Petrol Prices Near You
              </h1>
              <p className="text-xl mb-8">
                Save up to 20c/L with real-time price comparison
              </p>
              <button className="btn btn-primary btn-lg">
                Search Now
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Us
            </h2>
            {/* Features grid */}
          </div>
        </section>

        {/* Station List Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">
              Popular Stations
            </h2>
            {/* Station cards with lazy-loaded images */}
          </div>
        </section>
      </main>
    </>
  );
}
```

---

## 📊 Performance Monitoring

### View Web Vitals Dashboard

```bash
# In development
npm run dev

# Open browser console to see Web Vitals metrics
# Or check localStorage for stored metrics
localStorage.getItem('web-vitals-LCP')
localStorage.getItem('web-vitals-FID')
localStorage.getItem('web-vitals-CLS')
```

### Run Lighthouse Audit

```bash
npm run lighthouse
```

### Analyze Bundle Size

```bash
npm run analyze
```

---

## 🎓 Best Practices Summary

### SEO Checklist

- ✅ Unique, descriptive page titles (< 60 characters)
- ✅ Compelling meta descriptions (< 160 characters)
- ✅ Proper heading hierarchy (h1 → h2 → h3)
- ✅ Descriptive alt text for all images
- ✅ Canonical URLs for all pages
- ✅ Open Graph and Twitter Card meta tags
- ✅ JSON-LD structured data
- ✅ Mobile-friendly viewport
- ✅ Fast loading times (< 2.5s LCP)
- ✅ HTTPS enabled
- ✅ XML sitemap
- ✅ robots.txt file

### Performance Checklist

- ✅ Optimize images (WebP/AVIF, lazy loading, responsive)
- ✅ Minimize JavaScript bundles (< 350KB)
- ✅ Use code splitting and dynamic imports
- ✅ Enable compression (gzip/brotli)
- ✅ Leverage browser caching
- ✅ Use CDN for static assets
- ✅ Optimize Core Web Vitals (LCP, FID, CLS)
- ✅ Implement resource hints (preconnect, prefetch)
- ✅ Minimize render-blocking resources
- ✅ Use service workers for offline support

---

## 🔗 Additional Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Core Web Vitals](https://web.dev/vitals/)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

Made with ❤️ for optimal SEO and performance

