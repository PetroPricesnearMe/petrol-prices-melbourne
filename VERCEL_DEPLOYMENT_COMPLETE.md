# Vercel Deployment & Optimization Guide

Complete guide for deploying PPNM to Vercel with ISR, Edge caching, and analytics.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [ISR Configuration](#isr-configuration)
- [Edge Caching](#edge-caching)
- [Analytics Setup](#analytics-setup)
- [Deployment Checklist](#deployment-checklist)
- [Performance Verification](#performance-verification)

---

## 🚀 Quick Start

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Link Project

```bash
vercel link
```

### 4. Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

---

## 🔐 Environment Variables

### Create .env.local File

Create a `.env.local` file in your project root with the following variables:

```bash
# ============================================================
# Application Configuration
# ============================================================
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_VERSION=2.0.0

# ============================================================
# Baserow Database Configuration
# ============================================================
BASEROW_API_TOKEN=your_baserow_api_token_here
BASEROW_DATABASE_ID=your_database_id_here
NEXT_PUBLIC_BASEROW_URL=https://api.baserow.io

# Baserow Table IDs
BASEROW_STATIONS_TABLE_ID=623329
BASEROW_FUEL_PRICES_TABLE_ID=623330

# ============================================================
# Google Analytics 4
# ============================================================
# Get your Measurement ID from Google Analytics
# Format: G-XXXXXXXXXX
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# ============================================================
# Vercel Analytics
# ============================================================
# Automatically enabled on Vercel - no configuration needed

# ============================================================
# Map Configuration
# ============================================================
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

# ============================================================
# API Rate Limiting
# ============================================================
API_RATE_LIMIT_MAX_REQUESTS=100
API_RATE_LIMIT_WINDOW_MS=900000

# ============================================================
# Feature Flags
# ============================================================
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_MAP_VIEW=true
NEXT_PUBLIC_ENABLE_PRICE_ALERTS=false

# ============================================================
# Development/Debug
# ============================================================
NEXT_PUBLIC_DEBUG_MODE=false
```

### Add Environment Variables to Vercel

#### Via Vercel Dashboard:

1. Go to your project on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable from above
4. Set appropriate environments (Production, Preview, Development)

#### Via Vercel CLI:

```bash
# Add a secret
vercel env add BASEROW_API_TOKEN

# Pull environment variables locally
vercel env pull .env.local
```

#### Important Notes:

- ✅ Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- 🔒 Keep API keys and tokens secret (no `NEXT_PUBLIC_` prefix)
- ⚠️ **Never commit `.env.local` to Git** (already in .gitignore)

---

## 📦 ISR Configuration

### What is ISR?

Incremental Static Regeneration (ISR) allows pages to be regenerated on-demand while serving cached versions for better performance.

### Current ISR Setup

#### Directory Page (`/directory`)

- **Revalidation**: 24 hours (86400 seconds)
- **Location**: `src/app/directory/page.tsx`
- **Strategy**: Static generation with periodic updates

```typescript
export const revalidate = 86400; // 24 hours
```

#### Region Pages (`/regions/[region]`)

- **Revalidation**: 24 hours (86400 seconds)
- **Location**: `src/app/regions/[region]/page.tsx`
- **Strategy**: Static paths with ISR

```typescript
export const revalidate = 86400; // 24 hours
export async function generateStaticParams() { ... }
```

### Benefits

✅ **Fast Initial Load**: Pre-rendered HTML served instantly
✅ **Fresh Data**: Automatic background regeneration
✅ **SEO Optimized**: Search engines get static HTML
✅ **Cost Effective**: Reduces API calls and build times

### Manual Revalidation

Trigger revalidation on-demand:

```typescript
// In an API route
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  // Revalidate specific path
  revalidatePath('/directory');
  revalidatePath('/regions/north-melbourne');

  return Response.json({ revalidated: true });
}
```

---

## ⚡ Edge Caching

### Current Cache Configuration

The `vercel.json` file configures aggressive caching for static assets:

```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Cache Strategy

| Resource Type               | Cache Duration | Strategy               |
| --------------------------- | -------------- | ---------------------- |
| Static assets (`/static/*`) | 1 year         | Immutable              |
| Next.js build files         | 1 year         | Immutable              |
| Images                      | 1 year         | Immutable              |
| Fonts                       | 1 year         | Immutable              |
| HTML pages (ISR)            | 24 hours       | Stale-while-revalidate |
| API routes                  | No cache       | Dynamic                |

### Edge Runtime

For maximum performance, consider Edge runtime for API routes:

```typescript
// src/app/api/stations/route.ts
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
```

---

## 📊 Analytics Setup

### Google Analytics 4

#### 1. Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)
4. Add to environment variables

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### 2. Privacy Features

Our implementation includes:

✅ **Bot Detection**: Automatically excludes crawlers
✅ **IP Anonymization**: User privacy protected
✅ **Consent Management**: GDPR-compliant cookie banner
✅ **No Ad Tracking**: `ad_storage` set to denied
✅ **Consent Storage**: User preferences saved in localStorage

#### 3. Usage Example

```typescript
import { analytics } from '@/components/analytics';

// Track custom events
analytics.viewStation('123', 'BP Melbourne');
analytics.comparePrices('unleaded', 'Brunswick');
analytics.search('cheap fuel', 25);
```

### Vercel Analytics

Vercel Analytics is automatically enabled on Vercel:

✅ **Web Vitals**: Core Web Vitals tracking
✅ **Real User Monitoring**: Actual user performance
✅ **Edge Network**: Global performance insights

**No configuration needed** - already imported in `layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
```

---

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured in Vercel
- [ ] Google Analytics measurement ID added
- [ ] Build succeeds locally (`npm run build`)
- [ ] TypeScript errors resolved (or ignored via config)
- [ ] ESLint warnings reviewed
- [ ] Test all critical pages

### Security

- [ ] API keys not exposed in client-side code
- [ ] `.env.local` in `.gitignore`
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] CORS properly configured for APIs
- [ ] Rate limiting implemented

### Performance

- [ ] Images optimized (WebP, AVIF)
- [ ] Bundle size acceptable (<500KB gzipped)
- [ ] Lighthouse score > 90
- [ ] ISR configured for dynamic pages
- [ ] Edge caching headers set

### SEO

- [ ] Metadata configured for all pages
- [ ] Sitemap generated (`/sitemap.xml`)
- [ ] Robots.txt configured
- [ ] Open Graph images set
- [ ] Structured data (JSON-LD) added

### Analytics

- [ ] Google Analytics tracking verified
- [ ] Vercel Analytics enabled
- [ ] Cookie consent banner functional
- [ ] Custom events tracking properly
- [ ] Bot exclusion working

### Post-Deployment

- [ ] Verify production URL loads
- [ ] Test ISR revalidation
- [ ] Check analytics tracking
- [ ] Monitor error rates
- [ ] Review Web Vitals in Vercel Dashboard

---

## 🔍 Performance Verification

### 1. Verify ISR

Check page headers to confirm ISR:

```bash
curl -I https://your-domain.com/directory
```

Look for:

```
x-vercel-cache: HIT  # Served from cache
# or
x-vercel-cache: STALE # Revalidating in background
```

### 2. Check Lighthouse Score

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-domain.com --view
```

Target scores:

- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 95

### 3. Verify Zero Blocking Scripts

Open Chrome DevTools:

1. Go to **Performance** tab
2. Record page load
3. Look for "Blocking Time"
4. Should be < 300ms

### 4. Check Analytics

#### Google Analytics:

1. Open GA4 Real-Time view
2. Visit your site
3. Confirm events appear
4. Check bot exclusion working

#### Vercel Analytics:

1. Go to Vercel Dashboard
2. Navigate to **Analytics** tab
3. Review Web Vitals
4. Check traffic data

---

## 🎯 Optimization Tips

### Bundle Size Optimization

```bash
# Analyze bundle
npm run build

# Check bundle details
npm run analyze
```

**Targets:**

- First Load JS: < 200KB
- Total page weight: < 1MB

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
  priority={false} // Only true for above-fold images
  loading="lazy"
  quality={85} // Balance quality/size
/>
```

### Font Optimization

Already using `next/font` for automatic optimization:

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});
```

### API Route Optimization

```typescript
// Use Edge runtime for faster response
export const runtime = 'edge';

// Add appropriate caching
export const revalidate = 3600; // 1 hour

// Return minimal data
export async function GET() {
  return Response.json(
    { data: minimalData },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    }
  );
}
```

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Environment Variables Not Working

```bash
# Pull latest env vars
vercel env pull .env.local

# Verify in Vercel dashboard
vercel env ls
```

### ISR Not Updating

```bash
# Manually trigger revalidation
curl -X POST https://your-domain.com/api/revalidate
```

### Analytics Not Tracking

1. Check browser console for errors
2. Verify measurement ID in source
3. Check cookie consent accepted
4. Disable ad blockers for testing
5. Check Network tab for gtag requests

---

## 📚 Additional Resources

- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Vercel Edge Network](https://vercel.com/docs/edge-network/overview)
- [Google Analytics 4 Setup](https://support.google.com/analytics/answer/9304153)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Web Vitals](https://web.dev/vitals/)

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ **Lighthouse Score**: All categories > 90
✅ **ISR Working**: Cache headers present
✅ **Analytics Tracking**: Events appearing in GA4
✅ **Zero Blocking Scripts**: TBT < 300ms
✅ **Fast Load Times**: FCP < 1.8s, LCP < 2.5s
✅ **SEO Optimized**: Meta tags, sitemap, structured data
✅ **Privacy Compliant**: Cookie consent, bot exclusion

---

**Last Updated:** October 2024
**Next.js Version:** 15+
**Vercel Platform:** Latest
