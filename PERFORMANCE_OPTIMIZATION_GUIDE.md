# Performance Optimization Guide

## 🎯 Performance Goals

- **LCP (Largest Contentful Paint)**: < 1.0s (Excellent)
- **FID (First Input Delay)**: < 100ms (Excellent)
- **CLS (Cumulative Layout Shift)**: < 0.1 (Excellent)
- **TTFB (Time to First Byte)**: < 800ms (Excellent)
- **FCP (First Contentful Paint)**: < 1.8s (Good)
- **Total Blocking Time**: < 300ms (Good)

## ✅ Implemented Optimizations

### 1. Image Optimization

#### Next.js Image Component
- **Automatic format detection**: AVIF, WebP fallback
- **Responsive images**: Multiple sizes for different viewports
- **Lazy loading**: Images load only when visible
- **Priority loading**: Critical images marked with `priority` prop

```tsx
// Optimized image usage
<Image
  src="/hero-image.jpg"
  alt="Hero"
  width={1200}
  height={630}
  priority // Load immediately for LCP
  sizes="100vw"
  quality={85} // Optimal quality/size balance
/>
```

#### Responsive Sizes
```tsx
sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1280px"
```

### 2. Code Splitting & Dynamic Imports

#### React.lazy for Components
```tsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

#### Dynamic Imports
```tsx
// Load libraries only when needed
const loadChart = async () => {
  const { Chart } = await import('chart.js');
  return Chart;
};
```

### 3. Script Optimization

#### Next.js Script Component
```tsx
// After interactive - best for analytics
<Script src="/analytics.js" strategy="afterInteractive" />

// Lazy on load - for non-critical
<Script src="/widget.js" strategy="lazyOnload" />
```

#### Strategy Comparison
- `beforeInteractive`: Critical, blocks hydration
- `afterInteractive` (default): Loads after page becomes interactive
- `lazyOnload`: Loads during browser idle time

### 4. Caching Strategy

#### Static Assets (1 year)
```http
Cache-Control: public, max-age=31536000, immutable
```
- Images, fonts, JS/CSS files

#### Static Pages (ISR)
```tsx
export const revalidate = 3600; // Revalidate every hour
export const dynamic = 'force-static';
```

#### Dynamic Content (1 hour)
```http
Cache-Control: public, max-age=3600, must-revalidate
```

### 5. Bundle Optimization

#### Automatic Code Splitting
- Route-based splitting (automatic)
- Dynamic imports
- Vendor chunks separation
- Framer Motion isolation
- Lucide icons tree-shaking

#### Bundle Size Monitoring
```tsx
import { warnLargeImport } from '@/utils/performance';

// Warn about large imports in development
warnLargeImport('chart.js', 150); // 150KB
```

### 6. Font Optimization

#### Next.js Font Optimization
```tsx
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Prevents FOIT
  variable: '--font-inter',
  preload: true,
});
```

**Benefits**:
- Self-hosted fonts (no external requests)
- Automatic font-display: swap
- CSS variable generation
- Subset optimization

### 7. Web Vitals Tracking

#### Automatic Tracking
```tsx
// Automatic tracking in production
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

onCLS(trackWebVitals);
onFID(trackWebVitals);
// ... etc
```

#### Performance Dashboard
```tsx
import { generatePerformanceReport } from '@/utils/performance';

const report = generatePerformanceReport();
console.log('Performance Score:', report.score);
console.log('Recommendations:', report.recommendations);
```

### 8. Resource Preloading

#### Preconnect to External Domains
```tsx
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
```

#### Prefetch Critical Resources
```tsx
<link rel="prefetch" href="/critical-resource.js" />
```

#### Preload Critical Images
```tsx
import { preloadImage } from '@/utils/performance';

useEffect(() => {
  preloadImage('/hero-image.webp');
}, []);
```

### 9. Compression

#### Gzip/Brotli Compression
- Automatic compression in production
- Optimized compression level

#### Image Compression
- WebP format (70% smaller than JPEG)
- AVIF format (50% smaller than WebP)
- Quality level: 85 (optimal balance)

### 10. Lazy Loading

#### Images Below the Fold
```tsx
<Image 
  src="/image.jpg"
  loading="lazy" // Default, but explicit
/>
```

#### Intersection Observer
```tsx
const { ref, inView } = useInView({
  triggerOnce: true,
  threshold: 0.1,
});
```

## 📊 Performance Monitoring

### Web Vitals Dashboard

Access performance metrics at runtime:

```tsx
import { getStoredMetrics, analyzeResourceTiming } from '@/utils/performance';

// Get Web Vitals
const metrics = getStoredMetrics();
console.log('LCP:', metrics.LCP);
console.log('FID:', metrics.FID);
console.log('CLS:', metrics.CLS);

// Analyze resources
const resources = analyzeResourceTiming();
const slowResources = resources.filter(r => r.duration > 1000);
```

### Generate Performance Report

```tsx
import { generatePerformanceReport } from '@/utils/performance';

const report = generatePerformanceReport();
console.log(`
  Score: ${report.score}/100
  Metrics:`, report.metrics);
console.log('Recommendations:', report.recommendations);
```

## 🚀 Performance Best Practices

### 1. Image Optimization Checklist

- [ ] Use Next.js Image component
- [ ] Set appropriate `sizes` attribute
- [ ] Use `priority` for above-fold images
- [ ] Optimize image dimensions (not larger than needed)
- [ ] Use WebP/AVIF formats
- [ ] Lazy load below-fold images
- [ ] Provide proper alt text

### 2. Code Splitting Checklist

- [ ] Use dynamic imports for large components
- [ ] Split vendor chunks
- [ ] Lazy load routes
- [ ] Avoid importing entire libraries
- [ ] Use tree-shaking friendly imports

### 3. Caching Checklist

- [ ] Set proper Cache-Control headers
- [ ] Use ISR for semi-static content
- [ ] Implement stale-while-revalidate
- [ ] Cache API responses appropriately
- [ ] Use CDN for static assets

### 4. Bundle Size Checklist

- [ ] Monitor bundle size regularly
- [ ] Remove unused dependencies
- [ ] Use tree-shaking
- [ ] Analyze bundle with webpack-bundle-analyzer
- [ ] Optimize third-party libraries

## 📈 Performance Metrics

### Current Performance (Target)

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| LCP | < 1.0s | < 2.5s | ✅ Excellent |
| FID | < 100ms | < 100ms | ✅ Excellent |
| CLS | < 0.1 | < 0.1 | ✅ Excellent |
| TTFB | < 800ms | < 800ms | ✅ Excellent |
| FCP | < 1.8s | < 1.8s | ✅ Excellent |

### Testing Tools

1. **Lighthouse** (Chrome DevTools)
   ```bash
   npm run lighthouse
   ```

2. **WebPageTest**
   - Test from multiple locations
   - Filmstrip view
   - Detailed metrics

3. **Chrome DevTools Performance**
   - Record performance profile
   - Identify bottlenecks
   - Analyze bundle size

4. **Bundle Analyzer**
   ```bash
   npm run analyze
   ```

## 🔧 Quick Performance Fixes

### 1. Reduce JavaScript Execution Time
- Code split large components
- Use dynamic imports
- Remove unused code

### 2. Optimize Images
- Compress images
- Use modern formats (WebP/AVIF)
- Proper sizing

### 3. Minify and Compress
- Enable compression
- Minify CSS/JS
- Remove comments

### 4. Use CDN
- Serve static assets from CDN
- Edge caching
- Reduce latency

### 5. Optimize Fonts
- Use next/font
- Self-host fonts
- Subset fonts
- Use font-display: swap

## 📝 Additional Recommendations

### 1. Service Worker (PWA)
- Cache static assets
- Offline support
- Background sync

### 2. HTTP/2 Server Push
- Push critical resources
- Reduce RTT

### 3. Critical CSS
- Inline critical CSS
- Defer non-critical CSS

### 4. Resource Hints
- Preconnect to external domains
- Prefetch next page
- Preload critical resources

### 5. Database Optimization
- Index frequently queried fields
- Pagination for large datasets
- Query optimization

## 🎯 Continuous Monitoring

### Automated Performance Testing

```bash
# Run Lighthouse CI
npm run lighthouse:ci

# Performance budget monitoring
npm run performance-budget

# Bundle size monitoring
npm run bundle-size
```

### Performance Budget

```javascript
// performance-budget.json
{
  "budget": [
    {
      "path": "/",
      "timings": [
        { "metric": "interactive", "budget": 3000 },
        { "metric": "first-meaningful-paint", "budget": 1000 },
        { "metric": "largest-contentful-paint", "budget": 2000 }
      ],
      "resourceSizes": [
        { "resourceType": "total", "budget": 250 }
      ]
    }
  ]
}
```

## 📞 Support

For performance issues or questions:
- Check [Next.js Performance Docs](https://nextjs.org/docs/advanced-features/measuring-performance)
- Review [Web Vitals Guide](https://web.dev/vitals/)
- Use [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

**Last Updated**: 2025-01-27
**Version**: 1.0.0
**Status**: Production Ready ✅
