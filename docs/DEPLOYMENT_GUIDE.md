# Deployment Guide - Vercel Optimization

## 🚀 Complete Deployment Setup

This guide covers robots.txt, sitemap.xml, environment variables, and Vercel optimizations.

---

## 1. Robots.txt & Sitemap

### ✅ Already Configured

Your project uses **next-sitemap** which automatically generates:

- `robots.txt` - Crawling instructions
- `sitemap.xml` - Site structure for search engines

### Configuration Files

**`next-sitemap.config.js`** - Main configuration

- Generates robots.txt with proper policies
- Creates sitemap.xml with all routes
- Excludes API routes, admin pages, query parameters
- Includes popular suburbs and regions

**`src/app/robots.ts`** - Next.js robots route

- Fallback robots.txt generation
- References sitemap location

**`src/app/sitemap.ts`** - Next.js sitemap route

- Dynamic sitemap generation
- Includes static and dynamic routes
- Proper priorities and change frequencies

### Build Process

```bash
npm run build
# Automatically runs: next-sitemap (postbuild script)
```

This generates:

- `public/robots.txt`
- `public/sitemap.xml`
- `public/sitemap-*.xml` (if split into multiple files)

### Verification

After build, check:

- `https://yourdomain.com/robots.txt`
- `https://yourdomain.com/sitemap.xml`

---

## 2. Environment Variables

### Setup

1. **Copy example file**:

```bash
cp .env.local.example .env.local
```

2. **Fill in your values** in `.env.local`

3. **Set in Vercel Dashboard**:
   - Go to Project Settings > Environment Variables
   - Add all required variables
   - Set for Production, Preview, and Development

### Required Variables

#### Public (Browser-accessible)

```env
NEXT_PUBLIC_APP_URL=https://petrolpricenearme.com.au
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Optional
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...  # Optional
```

#### Server-Only

```env
BASEROW_API_TOKEN=your_token_here
NEXTAUTH_SECRET=your_secret_min_32_chars
DATABASE_URL=postgresql://...  # If using database
```

### Safe Access in Code

Use the `env` utility for type-safe access:

```tsx
import { env } from '@/lib/env';

// Public variables (available in browser)
const appUrl = env.appUrl;
const gaId = env.gaId;

// Server-only (undefined in browser)
const baserowToken = env.baserow?.apiToken; // Only on server
```

### Validation

The `env` utility validates required variables:

```tsx
import { validateEnv } from '@/lib/env';

// Call at app startup (server-side only)
if (typeof window === 'undefined') {
  validateEnv();
}
```

---

## 3. Vercel Deployment Optimizations

### Image Caching

**Already configured in `next.config.ts`**:

```typescript
images: {
  minimumCacheTTL: 31536000, // 1 year
  formats: ['image/avif', 'image/webp'],
}
```

**Vercel automatically**:

- Optimizes images on CDN
- Serves AVIF/WebP when supported
- Caches optimized images globally
- Handles responsive sizing

### Prefetching Navigation Links

**Next.js Link Component** (automatic):

```tsx
import Link from 'next/link';

// Automatically prefetches on hover
<Link href="/directory">Directory</Link>

// Force prefetch
<Link href="/directory" prefetch>Directory</Link>

// Disable prefetch
<Link href="/directory" prefetch={false}>Directory</Link>
```

**Custom PrefetchLink Component**:

```tsx
import { PrefetchLink } from '@/components/performance/PrefetchLink';

// Intelligent prefetching
<PrefetchLink
  href="/directory"
  prefetch="hover" // hover | visible | always | never
>
  Directory
</PrefetchLink>;
```

### Vercel.json Configuration

**Already configured** with:

- Image caching headers (1 year)
- Static asset caching
- Security headers
- DNS prefetching

### Performance Headers

**Automatic via Next.js**:

- `X-DNS-Prefetch-Control: on`
- `Cache-Control` for static assets
- Compression (gzip/brotli)

---

## 4. Deployment Checklist

### Pre-Deployment

- [ ] Set all environment variables in Vercel
- [ ] Test build locally: `npm run build`
- [ ] Verify robots.txt and sitemap.xml generated
- [ ] Check environment variable validation
- [ ] Test image optimization
- [ ] Verify prefetching works

### Vercel Dashboard Setup

1. **Connect Repository**
   - Import from GitHub
   - Select branch (main)

2. **Environment Variables**
   - Add all required variables
   - Set for Production, Preview, Development

3. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Verify deployment

### Post-Deployment

- [ ] Test robots.txt: `https://yourdomain.com/robots.txt`
- [ ] Test sitemap: `https://yourdomain.com/sitemap.xml`
- [ ] Verify images load and are optimized
- [ ] Test navigation prefetching
- [ ] Check Lighthouse scores
- [ ] Verify environment variables work
- [ ] Test contact form (if applicable)

---

## 5. Vercel-Specific Optimizations

### Edge Functions

Vercel automatically:

- Deploys API routes to Edge Network
- Caches responses at edge
- Optimizes cold starts

### Image Optimization

Vercel Image Optimization:

- Automatic format conversion (AVIF/WebP)
- Responsive sizing
- CDN caching
- Global distribution

### Analytics

Vercel Analytics (automatic):

- Web Vitals tracking
- Real User Monitoring
- Performance insights

Enable in Vercel Dashboard:

1. Go to Analytics tab
2. Enable Web Analytics
3. View metrics automatically

---

## 6. Monitoring & Debugging

### Environment Variables

Check if variables are set:

```tsx
// In browser console
console.log(process.env.NEXT_PUBLIC_APP_URL);

// Server-side
import { env } from '@/lib/env';
console.log(env.appUrl);
```

### Sitemap Verification

```bash
# Check sitemap after build
curl https://yourdomain.com/sitemap.xml

# Validate sitemap
# Use Google Search Console > Sitemaps
```

### Robots.txt Verification

```bash
# Check robots.txt
curl https://yourdomain.com/robots.txt

# Test with Google Search Console
# Go to Settings > robots.txt Tester
```

---

## 7. Performance Optimization

### Image Optimization

**Use Next.js Image component**:

```tsx
import Image from 'next/image';

<Image
  src="/station.jpg"
  alt="Petrol station"
  width={800}
  height={600}
  priority // For LCP images
  placeholder="blur" // For CLS prevention
/>;
```

**Vercel automatically**:

- Optimizes images
- Serves from CDN
- Caches for 1 year
- Converts to AVIF/WebP

### Prefetching Strategy

**Critical pages** (always prefetch):

```tsx
<Link href="/directory" prefetch>
  Directory
</Link>
```

**Secondary pages** (hover prefetch):

```tsx
<Link href="/about">About</Link> // Prefetches on hover
```

**Heavy pages** (disable prefetch):

```tsx
<Link href="/map" prefetch={false}>
  Map
</Link>
```

---

## 8. Troubleshooting

### Issue: Sitemap not generating

**Solution**:

```bash
# Check next-sitemap is installed
npm list next-sitemap

# Verify postbuild script
cat package.json | grep postbuild

# Manually generate
npx next-sitemap
```

### Issue: Environment variables not working

**Solution**:

1. Check Vercel Dashboard > Environment Variables
2. Redeploy after adding variables
3. Verify variable names match code
4. Check server vs client usage

### Issue: Images not optimizing

**Solution**:

1. Use Next.js Image component
2. Check image domains in next.config.ts
3. Verify Vercel Image Optimization is enabled
4. Check image format support

### Issue: Prefetching not working

**Solution**:

1. Check network tab for prefetch requests
2. Verify Link component from 'next/link'
3. Check if prefetch is disabled
4. Test in production (dev mode may differ)

---

## 9. SEO Best Practices

### Robots.txt

✅ **Allow**:

- All public pages
- Static assets
- Sitemap

❌ **Disallow**:

- API routes
- Admin pages
- Query parameters (filters, search)
- Internal pages

### Sitemap

✅ **Include**:

- All public pages
- Dynamic routes (stations, suburbs)
- Proper priorities
- Change frequencies

✅ **Priorities**:

- Homepage: 1.0
- Directory: 0.9
- Station pages: 0.8
- About/FAQ: 0.5-0.6

### Meta Tags

Already configured via:

- `src/app/layout.tsx` - Default metadata
- Page-level metadata exports
- Structured data schemas

---

## 10. Quick Reference

### Commands

```bash
# Build with sitemap generation
npm run build

# Check environment variables
node -e "console.log(process.env.NEXT_PUBLIC_APP_URL)"

# Validate sitemap
curl https://yourdomain.com/sitemap.xml | xmllint --format -

# Test robots.txt
curl https://yourdomain.com/robots.txt
```

### Files

```
next-sitemap.config.js    # Sitemap configuration
src/app/robots.ts         # Robots route
src/app/sitemap.ts        # Sitemap route
src/lib/env.ts            # Environment variables
.env.local.example        # Environment template
vercel.json               # Vercel configuration
next.config.ts            # Next.js config (images, headers)
```

---

## ✅ Deployment Checklist

### Before Deploy

- [ ] All environment variables set in Vercel
- [ ] `.env.local.example` updated
- [ ] `src/lib/env.ts` validates correctly
- [ ] Build succeeds locally
- [ ] Sitemap generates correctly
- [ ] Robots.txt is correct

### After Deploy

- [ ] Verify robots.txt accessible
- [ ] Verify sitemap.xml accessible
- [ ] Test image optimization
- [ ] Test navigation prefetching
- [ ] Check Lighthouse scores
- [ ] Verify environment variables
- [ ] Test all critical pages

---

**Status**: ✅ Complete and Production-Ready  
**Last Updated**: 2025-11-11
