# 🚀 SEO & Performance Quick Reference

Quick reference guide for implementing SEO optimizations in this project.

---

## 📝 Metadata

### Page Metadata

```typescript
import { generatePageMetadata } from '@/lib/seo/advanced-metadata';

export const metadata = generatePageMetadata({
  title: 'Page Title',
  description: 'Page description (160 chars max)',
  keywords: ['keyword1', 'keyword2'],
  canonical: '/page-url',
});
```

### Station Page

```typescript
import { generateStationMetadata } from '@/lib/seo/advanced-metadata';

export async function generateMetadata({ params }) {
  const station = await getStationById(params.id);
  return generateStationMetadata(station);
}
```

### Directory Page

```typescript
import { generateDirectoryMetadata } from '@/lib/seo/advanced-metadata';

export const metadata = generateDirectoryMetadata('Melbourne', 50);
```

---

## 🔍 Structured Data

### All Page Schemas

```typescript
import { StructuredData } from '@/components/StructuredData';
import { generateStationPageSchemas } from '@/lib/seo/comprehensive-schemas';

const schemas = generateStationPageSchemas(station);

<StructuredData data={schemas} />
```

### FAQ Schema

```typescript
import { getFAQPageSchema } from '@/lib/seo/comprehensive-schemas';

const faqs = [
  { question: '...', answer: '...' },
];

<StructuredData data={getFAQPageSchema(faqs)} />
```

### Breadcrumb Schema

```typescript
import { getBreadcrumbListSchema } from '@/lib/seo/comprehensive-schemas';

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Page', href: '/page' },
];

<StructuredData data={getBreadcrumbListSchema(breadcrumbs)} />
```

---

## 🖼️ Images

### Hero Image (LCP)

```typescript
import { HeroImage } from '@/components/seo/SEOImage';

<HeroImage
  src="/hero.jpg"
  alt="Description"
  width={1920}
  height={1080}
/>
```

### Regular Image

```typescript
import { SEOImage } from '@/components/seo/SEOImage';

<SEOImage
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Logo

```typescript
import { LogoImage } from '@/components/seo/SEOImage';

<LogoImage
  src="/logo.png"
  alt="Company Logo"
  width={200}
  height={50}
/>
```

---

## ⚡ Core Web Vitals

### LCP Optimization

```typescript
// 1. Priority loading
<Image src="/hero.jpg" priority />

// 2. Preload critical images
import { preloadLCPImage } from '@/lib/performance/core-web-vitals';
preloadLCPImage('/hero.jpg', { fetchPriority: 'high' });

// 3. Preconnect to external domains
<link rel="preconnect" href="https://fonts.googleapis.com" />
```

### FID/INP Optimization

```typescript
import { debounce, throttle } from '@/lib/performance/core-web-vitals';

// Debounce input handlers
const handleInput = debounce((value) => { ... }, 300);

// Throttle scroll handlers
const handleScroll = throttle(() => { ... }, 100);
```

### CLS Optimization

```typescript
// Always specify image dimensions
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
/>

// Reserve space for dynamic content
import { reserveSpace } from '@/lib/performance/core-web-vitals';
<div style={reserveSpace(400)}>...</div>
```

---

## 📱 Mobile Optimization

### Viewport

```typescript
import { mobileViewport } from '@/lib/seo/mobile-optimization';

export const viewport = mobileViewport;
```

### Responsive Sizes

```typescript
import { generateResponsiveSizes } from '@/lib/seo/mobile-optimization';

const sizes = generateResponsiveSizes({
  sm: '100vw',
  md: '50vw',
  lg: '33vw',
  default: '25vw',
});

<SEOImage sizes={sizes} />
```

### Mobile Detection

```typescript
import { isMobileDevice } from '@/lib/seo/mobile-optimization';

if (isMobileDevice()) {
  // Mobile-specific logic
}
```

---

## 🎯 Semantic HTML

### Heading Hierarchy

```typescript
<main>
  <h1>Main Title</h1>              {/* One h1 per page */}
  <section>
    <h2>Section Title</h2>         {/* Section headings */}
    <h3>Subsection Title</h3>      {/* Subsection headings */}
  </section>
</main>
```

### Semantic Structure

```typescript
<article>                          {/* Self-contained content */}
  <header>
    <h1>Article Title</h1>
  </header>
  <main>
    <section>
      <h2>Section</h2>
      <p>Content</p>
    </section>
  </main>
  <footer>
    <p>Author info</p>
  </footer>
</article>
```

---

## 📊 Performance

### Lazy Loading

```typescript
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/MapView'), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

### Code Splitting

```typescript
const AdminDashboard = dynamic(() => import('@/components/admin/Dashboard'), {
  ssr: false,
});
```

### Resource Hints

```typescript
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="dns-prefetch" href="https://analytics.com" />
</head>
```

---

## 🔗 Canonical URLs

```typescript
import { generateCanonicalUrl } from '@/lib/seo/advanced-metadata';

const canonical = generateCanonicalUrl('/page');

export const metadata = {
  alternates: {
    canonical,
  },
};
```

---

## 📈 Monitoring

### Web Vitals Reporter

```typescript
import { initWebVitalsReporter } from '@/lib/performance/core-web-vitals';
import { onCLS, onFID, onLCP } from 'web-vitals';

const reporter = initWebVitalsReporter({
  enableReporting: true,
  debug: true,
});

onCLS(reporter.report);
onFID(reporter.report);
onLCP(reporter.report);
```

---

## ✅ Checklist

### Every Page Should Have:

- [ ] Unique `<title>` (< 60 chars)
- [ ] Meta description (< 160 chars)
- [ ] Canonical URL
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] One `<h1>` heading
- [ ] Proper heading hierarchy
- [ ] Structured data (JSON-LD)
- [ ] Alt text for all images
- [ ] Mobile viewport meta tag

### Images Should Have:

- [ ] Next.js `<Image>` component
- [ ] Width and height attributes
- [ ] Descriptive alt text
- [ ] `priority` for above-the-fold
- [ ] Responsive `sizes` attribute
- [ ] Appropriate quality setting

### Performance Should Have:

- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Lazy loading for below-fold
- [ ] Code splitting
- [ ] Resource hints
- [ ] Optimized images

---

## 🆘 Common Issues

### Issue: Poor LCP Score

**Solution:**

```typescript
// 1. Add priority to hero image
<Image src="/hero.jpg" priority />

// 2. Preload critical resources
<link rel="preload" href="/hero.jpg" as="image" fetchpriority="high" />

// 3. Optimize image size and format
<Image src="/hero.jpg" quality={90} priority />
```

### Issue: High CLS

**Solution:**

```typescript
// Always specify dimensions
<Image width={800} height={600} />

// Use aspect ratio
<div className="aspect-w-16 aspect-h-9">
  <Image fill />
</div>
```

### Issue: Missing Structured Data

**Solution:**

```typescript
import { StructuredData } from '@/components/StructuredData';
import { getGasStationSchema } from '@/lib/seo/comprehensive-schemas';

<StructuredData data={getGasStationSchema(station)} />
```

---

## 📚 File Locations

- **Metadata**: `src/lib/seo/advanced-metadata.ts`
- **Schemas**: `src/lib/seo/comprehensive-schemas.ts`
- **Core Web Vitals**: `src/lib/performance/core-web-vitals.ts`
- **SEO Images**: `src/components/seo/SEOImage.tsx`
- **Mobile**: `src/lib/seo/mobile-optimization.ts`

---

**Need more details?** See `SEO_PERFORMANCE_OPTIMIZATION_GUIDE.md`
