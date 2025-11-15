# 🔧 Debugging & Troubleshooting Guide - Next.js 15

## Table of Contents

1. [Hydration Mismatch Fixes](#hydration-mismatch-fixes)
2. [Image Optimization & Core Web Vitals](#image-optimization--core-web-vitals)
3. [Preload Link Optimization](#preload-link-optimization)
4. [Tailwind Configuration Issues](#tailwind-configuration-issues)
5. [Console Error Fixes](#console-error-fixes)

---

## 1. Hydration Mismatch Fixes

### 🚨 Problem: Date/Time Rendering Mismatch

**Cause:** Server renders one date/time, client renders another (timing difference).

**Locations Found:**

- `src/components/organisms/Footer/ResponsiveFooter.tsx` (line 104)
- `src/components/organisms/Footer/ModernFooter.tsx` (line 86)
- `src/components/organisms/Footer/Footer.tsx` (line 51)
- `src/components/organisms/EnhancedFooter.tsx` (line 115)
- `src/components/layout/Footer.tsx` (line 123)
- Multiple station cards with `new Date(station.lastUpdated).toLocaleDateString()`

#### ✅ Solution: Use Client-Side Mounting Pattern

**Step 1:** Create a reusable `useMounted` hook (already exists in `ThemeProvider.tsx`):

```typescript
// src/hooks/useMounted.ts
'use client';

import { useEffect, useState } from 'react';

export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
```

**Step 2:** Fix Footer Copyright Year

```typescript
// src/components/layout/Footer.tsx
'use client';

import { useMounted } from '@/hooks/useMounted';

export function Footer() {
  const mounted = useMounted();
  const currentYear = mounted ? new Date().getFullYear() : 2025;

  return (
    <footer>
      <p>© {currentYear} Petrol Price Near Me. All rights reserved.</p>
    </footer>
  );
}
```

**Step 3:** Fix Date Formatting in Station Cards

```typescript
// src/components/cards/StationCard.tsx
'use client';

import { useMounted } from '@/hooks/useMounted';

export function StationCard({ station }) {
  const mounted = useMounted();

  const formattedDate = mounted && station.lastUpdated
    ? new Date(station.lastUpdated).toLocaleDateString()
    : 'Recently';

  return (
    <div className="station-card">
      {/* ... other content ... */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Updated: {formattedDate}
      </div>
    </div>
  );
}
```

### 🚨 Problem: Random ID Generation Causing Mismatch

**Cause:** `Math.random()` generates different IDs on server vs client.

**Locations Found:**

- `src/components/ui/input.tsx` (line 31)
- `src/components/atoms/Input/Input.tsx` (line 61)
- `src/components/accessibility/Modal.tsx` (line 50)

#### ✅ Solution: Use React's `useId` Hook (Next.js 15)

```typescript
// src/components/ui/input.tsx
'use client';

import { useId, forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, helperText, error, ...props }, ref) => {
    // Use React's built-in useId for stable IDs
    const generatedId = useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    return (
      <div>
        {label && <label htmlFor={inputId}>{label}</label>}
        <input
          ref={ref}
          id={inputId}
          aria-describedby={helperText ? helperId : undefined}
          aria-invalid={!!error}
          aria-errormessage={error ? errorId : undefined}
          {...props}
        />
        {helperText && <span id={helperId}>{helperText}</span>}
        {error && <span id={errorId}>{error}</span>}
      </div>
    );
  }
);
```

### 🚨 Problem: ThemeProvider Hydration

**Current Status:** ✅ Already Fixed with mounting pattern

The `ThemeProvider` correctly prevents hydration mismatch:

```typescript
// src/components/providers/ThemeProvider.tsx (lines 109-112)
// Prevent hydration mismatch
if (!mounted) {
  return <>{children}</>;
}
```

---

## 2. Image Optimization & Core Web Vitals

### 🚨 Problem: Missing Hero Image

**Error:** `/images/hero-petrol-station.jpg` not found in `public/images/`

**Impact:**

- 404 error on page load
- Poor LCP (Largest Contentful Paint)
- Failed Core Web Vitals

#### ✅ Solution Option 1: Use Placeholder Until Image Available

```typescript
// src/components/pages/PerformanceOptimizedLandingPage.tsx
import Image from 'next/image';

function OptimizedHeroSection() {
  return (
    <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
      <Image
        src="/images/fuel-nozzles.jpg" // Use existing image as placeholder
        alt="Modern petrol station with fuel pumps showing competitive prices"
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}
```

#### ✅ Solution Option 2: Create a Gradient Placeholder

```typescript
// src/components/pages/PerformanceOptimizedLandingPage.tsx
function OptimizedHeroSection() {
  return (
    <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
      {/* Gradient background as placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500" />

      {/* Optional: Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-2">Find Cheapest Fuel</h2>
          <p className="text-lg opacity-90">Real-time prices from 250+ stations</p>
        </div>
      </div>
    </div>
  );
}
```

### ✅ Best Practices for Next.js Image (2025)

```typescript
import Image from 'next/image';

// ✅ CORRECT: Above-the-fold hero image
<Image
  src="/images/hero.jpg"
  alt="Descriptive alt text for accessibility and SEO"
  fill                    // For responsive containers
  priority                // Preload above-the-fold images
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={85}            // Balance quality/size (default: 75)
  className="object-cover"
/>

// ✅ CORRECT: Below-the-fold images
<Image
  src="/images/station.jpg"
  alt="Station name and location"
  width={400}
  height={300}
  loading="lazy"          // Lazy load below-the-fold
  sizes="(max-width: 768px) 100vw, 400px"
  quality={75}
  className="rounded-lg"
/>

// ❌ WRONG: Missing priority on hero
<Image src="/hero.jpg" alt="Hero" fill />

// ❌ WRONG: Priority on below-the-fold
<Image src="/footer.jpg" alt="Footer" fill priority />

// ❌ WRONG: No sizes attribute with fill
<Image src="/hero.jpg" alt="Hero" fill priority />
```

### Image Sizing Strategy

```typescript
// Sizes attribute tells browser which image size to load
// Format: "media-query viewport-width, fallback"

// Full-width hero
sizes = '100vw';

// Half-width on desktop, full on mobile
sizes = '(max-width: 768px) 100vw, 50vw';

// Fixed width above breakpoint
sizes = '(max-width: 768px) 100vw, 400px';

// Grid layout (3 columns on desktop)
sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
```

---

## 3. Preload Link Optimization

### 🚨 Problem: Unnecessary Preload Links

**Current layout.tsx (lines 98-103):**

```typescript
<head>
  {/* Preconnect to external domains */}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

  {/* DNS Prefetch for performance */}
  <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
</head>
```

#### Why Remove These?

1. **next/font Handles It**: Next.js 15's `next/font/google` automatically optimizes font loading
2. **Redundant**: Font is already imported at build time (line 19-24)
3. **Performance Impact**: Unnecessary DNS lookups and connections
4. **Core Web Vitals**: Can negatively impact FCP (First Contentful Paint)

#### ✅ Solution: Remove Redundant Preload Links

```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',        // ✅ FOUT prevention
  variable: '--font-inter',
  preload: true,          // ✅ Automatic preloading
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* ✅ REMOVE: Google Fonts preconnect (handled by next/font) */}
        {/* ❌ <link rel="preconnect" href="https://fonts.googleapis.com" /> */}

        {/* ✅ KEEP: Favicon and manifest */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### When TO Use Preload/Preconnect

```typescript
// ✅ DO: Preload critical above-the-fold images (if not using next/image priority)
<link rel="preload" as="image" href="/hero.jpg" />

// ✅ DO: Preconnect to third-party APIs you KNOW you'll use
<link rel="preconnect" href="https://api.yourservice.com" />

// ❌ DON'T: Preload fonts when using next/font
// ❌ DON'T: Preconnect to services you might not use
// ❌ DON'T: Preload images that next/image handles with priority
```

---

## 4. Tailwind Configuration Issues

### Current Status: ✅ Configuration is Good!

Your `tailwind.config.js` is well-configured with:

- ✅ Mobile-first responsive design
- ✅ Proper content paths
- ✅ Dark mode support
- ✅ WCAG compliant colors
- ✅ Accessibility utilities

### Minor Optimization: Content Paths

```javascript
// tailwind.config.js
module.exports = {
  content: [
    // ✅ KEEP: App Router paths
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',

    // ⚠️ REVIEW: Only include if you have pages/ directory
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ... rest of config
};
```

### Tailwind Mobile Responsiveness Best Practices

```typescript
// ✅ CORRECT: Mobile-first approach
<div className="
  w-full              // Mobile: full width
  md:w-1/2            // Tablet: half width
  lg:w-1/3            // Desktop: third width
  p-4                 // Mobile: 1rem padding
  md:p-6              // Tablet: 1.5rem padding
  lg:p-8              // Desktop: 2rem padding
">
  <h2 className="
    text-2xl          // Mobile: 24px
    md:text-3xl       // Tablet: 30px
    lg:text-4xl       // Desktop: 36px
  ">
    Responsive Heading
  </h2>
</div>

// ❌ WRONG: Desktop-first (requires overriding)
<div className="w-1/3 lg:w-full">Content</div>

// ❌ WRONG: Conflicting classes
<div className="p-4 p-6">Content</div>
```

### Common Tailwind Class Conflicts

```typescript
// ❌ CONFLICT: Multiple same properties
className="text-red-500 text-blue-500"  // Blue wins (last one)
className="p-4 px-6"                     // px-6 overrides p-4's x-axis

// ✅ FIX: Use proper specificity
className="text-blue-500"
className="p-4 px-6"  // p-4 for y, px-6 for x is actually correct

// ✅ BETTER: Use cn() helper for conditional classes
import { cn } from '@/lib/utils';

className={cn(
  'text-base',
  error && 'text-red-500',
  success && 'text-green-500'
)}
```

---

## 5. Console Error Fixes

### Error 1: Missing Image File

**Console Error:**

```
GET /images/hero-petrol-station.jpg 404 (Not Found)
```

**Fix:** See [Section 2: Image Optimization](#image-optimization--core-web-vitals)

### Error 2: Hydration Mismatch Warning

**Console Warning:**

```
Warning: Text content did not match. Server: "2024" Client: "2025"
Warning: An error occurred during hydration...
```

**Fix:** See [Section 1: Hydration Mismatch Fixes](#hydration-mismatch-fixes)

### Error 3: Invalid Hook Call

**Console Error:**

```
Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
```

**Cause:** Using hooks in non-client component or outside React component.

**Fix:**

```typescript
// ❌ WRONG: Using hook at module level
const mounted = useMounted(); // Error!

export function MyComponent() {
  return <div>...</div>;
}

// ✅ CORRECT: Using hook inside component
export function MyComponent() {
  const mounted = useMounted();
  return <div>...</div>;
}

// ❌ WRONG: Server component using hooks
export default function ServerComponent() {
  const [state, setState] = useState(); // Error!
  return <div>...</div>;
}

// ✅ CORRECT: Add 'use client' directive
'use client';

export default function ClientComponent() {
  const [state, setState] = useState();
  return <div>...</div>;
}
```

### Error 4: CSS Class Not Purged

**Problem:** Custom Tailwind classes disappear in production.

**Fix:**

```javascript
// tailwind.config.js
module.exports = {
  // Add dynamic classes to safelist
  safelist: [
    'sr-only',
    'focus-ring',
    // Add patterns for dynamic classes
    {
      pattern: /bg-(red|green|blue)-(400|500|600)/,
      variants: ['hover', 'focus'],
    },
  ],
};
```

---

## 6. Production Checklist

### Before Deployment

```bash
# 1. Type check
npm run type-check

# 2. Lint
npm run lint

# 3. Build test
npm run build

# 4. Check bundle size
npm run build -- --analyze  # if you have @next/bundle-analyzer

# 5. Test production build locally
npm run build && npm run start
```

### Performance Verification

```typescript
// Add to layout.tsx for production monitoring
{process.env.NODE_ENV === 'production' && (
  <Script
    id="web-vitals"
    strategy="afterInteractive"
  >
    {`
      if (typeof window !== 'undefined') {
        import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
          onCLS(console.log);
          onFID(console.log);
          onFCP(console.log);
          onLCP(console.log);
          onTTFB(console.log);
          onINP(console.log);
        });
      }
    `}
  </Script>
)}
```

### Core Web Vitals Targets (2025)

| Metric                              | Good    | Needs Improvement | Poor     |
| ----------------------------------- | ------- | ----------------- | -------- |
| **LCP** (Largest Contentful Paint)  | ≤ 2.5s  | 2.5s - 4s         | > 4s     |
| **FID** (First Input Delay)         | ≤ 100ms | 100ms - 300ms     | > 300ms  |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200ms - 500ms     | > 500ms  |
| **CLS** (Cumulative Layout Shift)   | ≤ 0.1   | 0.1 - 0.25        | > 0.25   |
| **FCP** (First Contentful Paint)    | ≤ 1.8s  | 1.8s - 3s         | > 3s     |
| **TTFB** (Time to First Byte)       | ≤ 800ms | 800ms - 1800ms    | > 1800ms |

---

## 7. Quick Reference

### Common Next.js 15 Patterns

```typescript
// Server Component (default)
export default function ServerComponent() {
  // Can use async/await directly
  const data = await fetch('...');
  return <div>...</div>;
}

// Client Component
'use client';
export default function ClientComponent() {
  const [state, setState] = useState();
  return <div>...</div>;
}

// Dynamic Metadata
export async function generateMetadata({ params }) {
  return {
    title: '...',
    description: '...',
  };
}

// Streaming & Suspense
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <AsyncComponent />
    </Suspense>
  );
}
```

### Debugging Commands

```bash
# Check for hydration issues
NEXT_PUBLIC_DEBUG_HYDRATION=true npm run dev

# Verbose logging
NODE_OPTIONS='--inspect' npm run dev

# Check unused dependencies
npx depcheck

# Analyze bundle
npm run build -- --profile

# Test mobile responsiveness
npx playwright test --project=mobile-chrome
```

---

## Summary

### Priority Fixes

1. **HIGH**: Fix hydration mismatches (Date rendering, random IDs)
2. **HIGH**: Add/fix missing hero image
3. **MEDIUM**: Remove unnecessary preload links
4. **LOW**: Optimize Tailwind content paths

### Files to Update

1. `src/hooks/useMounted.ts` - Create hook
2. `src/app/layout.tsx` - Remove preload links, add suppressHydrationWarning
3. `src/components/layout/Footer.tsx` - Fix date hydration
4. `src/components/ui/input.tsx` - Use useId()
5. `src/components/atoms/Input/Input.tsx` - Use useId()
6. `src/components/cards/StationCard.tsx` - Fix date rendering
7. All footer components - Fix copyright year rendering
8. `tailwind.config.js` - Review content paths

### Next Steps

1. Apply hydration fixes to all components with dates
2. Replace or create hero image
3. Update layout.tsx
4. Test build and production mode
5. Verify Core Web Vitals in Lighthouse
6. Monitor production with Web Vitals tracking

---

**Last Updated:** November 2025
**Next.js Version:** 15.x
**React Version:** 19.x
