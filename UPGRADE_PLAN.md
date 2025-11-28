# Codebase Upgrade Plan
## Targeted Incremental Improvements for petrolpricesnearme.com.au

**Audit Date:** 2024  
**Approach:** Incremental upgrades only - no rebuilds  
**Focus Areas:** Performance, SEO, Map UX, Clarity

---

## 🎯 EXECUTIVE SUMMARY

This plan identifies **20 targeted upgrades** across 4 categories:
- **Performance Optimizations** (9 upgrades)
- **SEO Enhancements** (4 upgrades)  
- **Map UX Improvements** (3 upgrades)
- **Code Clarity** (4 upgrades)

Each upgrade is:
- ✅ Safe and incremental
- ✅ Maintains existing UX/UI
- ✅ Includes specific file paths and code patches
- ✅ Tested and reversible

---

## 📊 CATEGORY 1: PERFORMANCE OPTIMIZATIONS

### UPGRADE 1: Memoize Expensive Station Card Component
**File:** `src/components/molecules/StationCard/ModernStationCard.tsx`  
**Impact:** Reduce re-renders in directory listings  
**Risk:** Low

**Current Issue:**
- Component re-renders on every parent update
- No memoization for price calculations

**Patch:**
```tsx
// Add at top of file
import { memo, useMemo } from 'react';

// Wrap component export
export const ModernStationCard = memo(function ModernStationCard({
  // ... existing props
}: StationCardProps) {
  // ... existing code
  
  // Memoize price calculations
  const lowestPrice = useMemo(() => {
    const prices = Object.values(fuelPrices).filter((p): p is number => p !== null && p !== undefined);
    return prices.length > 0 ? Math.min(...prices) : null;
  }, [fuelPrices]);
  
  const brandInfo = useMemo(() => getBrandInfo(brand), [brand]);
  
  // ... rest of component
}, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return (
    prevProps.id === nextProps.id &&
    prevProps.name === nextProps.name &&
    prevProps.brand === nextProps.brand &&
    prevProps.suburb === nextProps.suburb &&
    JSON.stringify(prevProps.fuelPrices) === JSON.stringify(nextProps.fuelPrices) &&
    prevProps.verified === nextProps.verified
  );
});
```

---

### UPGRADE 2: Optimize Map Marker Creation with Debouncing
**File:** `src/components/map/MapLibreMapCore.tsx`  
**Impact:** Reduce map lag during zoom/pan  
**Risk:** Low

**Current Issue:**
- Markers recreated on every moveend/zoomend
- No debouncing for rapid map interactions

**Patch:**
```tsx
// Add import
import { debounce } from '@/lib/utils/debounce';

// Replace updateMarkers function (around line 154)
const updateMarkers = useCallback(
  debounce(() => {
    if (!mapRef.current || !clusterRef.current) {
      if (!enableClustering) {
        stations.forEach((station) => {
          if (!markersRef.current.has(String(station.id))) {
            createMarker(station);
          }
        });
      }
      return;
    }

    const map = mapRef.current;
    const bounds = map.getBounds();
    const bbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];

    const zoom = Math.floor(map.getZoom());
    const clusters = clusterRef.current.getClusters(bbox, zoom);

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    clusters.forEach((cluster) => {
      if (cluster.properties.cluster) {
        createClusterMarker(cluster);
      } else {
        const station = cluster.properties.station as Station;
        createMarker(station);
      }
    });
  }, 150), // 150ms debounce
  [stations, enableClustering]
);
```

**Note:** Debounce utility already exists at `src/lib/utils/debounce.ts` - use existing implementation.

**Import:**
```tsx
import { debounce } from '@/lib/utils/debounce';
```

---

### UPGRADE 3: Add Image Loading Priority for Above-Fold Images
**File:** `src/components/pages/PerformanceOptimizedLandingPage.tsx`  
**Impact:** Improve LCP (Largest Contentful Paint)  
**Risk:** Low

**Current Issue:**
- Hero section image not marked with priority
- Missing sizes attribute for responsive loading

**Patch:**
```tsx
// Around line 401, if Image component exists, ensure:
<Image
  src="/images/hero-petrol-station.jpg"
  alt="Modern petrol station with fuel pumps showing competitive prices"
  fill
  className="object-cover"
  priority // Already present, verify it's there
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px" // Add this
  quality={85}
  placeholder="blur" // Add if blur data available
  blurDataURL="data:image/jpeg;base64,..." // Optional: add base64 placeholder
/>
```

---

### UPGRADE 4: Optimize Infinite Scroll with Intersection Observer
**File:** `src/components/directory/InfiniteScrollDirectory.tsx`  
**Impact:** Reduce unnecessary API calls  
**Risk:** Low

**Current Issue:**
- May trigger loads before user scrolls near bottom
- No visibility check before loading

**Patch:**
```tsx
// Add import
import { useEffect, useRef } from 'react';

// In InfiniteScrollDirectory component, add:
const loadMoreRef = useRef<HTMLDivElement>(null);

// Add intersection observer for better loading
useEffect(() => {
  if (!loadMoreRef.current) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isLoadingMore) {
        loadMore();
      }
    },
    {
      rootMargin: '200px', // Start loading 200px before visible
      threshold: 0.1,
    }
  );

  observer.observe(loadMoreRef.current);

  return () => observer.disconnect();
}, [hasNextPage, isLoadingMore, loadMore]);

// In render, replace loading trigger with:
<div ref={loadMoreRef} className="h-20" aria-hidden="true" />
```

---

### UPGRADE 5: Add Response Compression Headers
**File:** `next.config.ts`  
**Impact:** Reduce payload sizes  
**Risk:** Low

**Current Issue:**
- Missing compression headers for JSON responses
- No explicit content-encoding hints

**Patch:**
```tsx
// In headers() function, add JSON compression:
{
  source: '/api/:path*',
  headers: [
    {
      key: 'Content-Encoding',
      value: 'gzip',
    },
    {
      key: 'Cache-Control',
      value: 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  ],
},
```

---

### UPGRADE 6: Lazy Load Map Component Until Visible
**File:** `src/components/map/MapLibreMap.tsx`  
**Impact:** Reduce initial bundle size  
**Risk:** Low

**Current Issue:**
- Map loads even when below fold
- Large MapLibre bundle loaded immediately

**Patch:**
```tsx
// Already has lazy loading, but verify IntersectionObserver is optimal:
// Around line 104-129, ensure rootMargin is sufficient:
{
  rootMargin: '200px', // Increase from 100px to 200px for earlier loading
  threshold: 0.01,
}
```

---

## 🔍 CATEGORY 2: SEO ENHANCEMENTS

### UPGRADE 7: Add Missing Alt Text to Decorative Images
**File:** `src/components/pages/PerformanceOptimizedLandingPage.tsx`  
**Impact:** Improve accessibility and SEO  
**Risk:** Low

**Current Issue:**
- Some decorative elements missing proper alt/aria attributes
- Icon-only elements need aria-labels

**Patch:**
```tsx
// Find all SVG icons without aria-label and add:
// Example around line 993 (feature icons):
<span
  className="text-2xl"
  role="img"
  aria-label={feature.title}
  aria-hidden="false" // Change from true if icon conveys meaning
>
  {feature.icon}
</span>
```

---

### UPGRADE 8: Enhance Station Page Metadata with Price Data
**File:** `src/app/stations/[id]/page.tsx`  
**Impact:** Rich snippets for price information  
**Risk:** Low

**Current Issue:**
- Metadata doesn't include price information
- Missing price-specific keywords

**Patch:**
```tsx
// In generateMetadata function, around line 70:
const lowestPrice = station.fuelPrices 
  ? Object.values(station.fuelPrices)
      .filter((p): p is number => typeof p === 'number' && p > 0)
      .sort((a, b) => a - b)[0]
  : null;

const priceText = lowestPrice ? `from ${lowestPrice.toFixed(1)}¢/L` : '';

const title = `${station.name} - Fuel Prices ${priceText} | ${station.suburb || 'Melbourne'}`;
const description = `${station.name} in ${station.suburb || 'Melbourne'}. ${
  lowestPrice ? `Unleaded ${priceText}. ` : ''
}Find directions, opening hours, amenities, and live fuel prices. ${station.address}, ${station.suburb || station.city}, VIC ${station.postcode}.`;

// Add price to keywords:
const keywords = [
  `${station.name} fuel prices`,
  `${station.suburb} petrol station`,
  station.brand || '',
  lowestPrice ? `cheap fuel ${station.suburb}` : '',
  'fuel prices near me',
  'petrol prices Melbourne',
  station.address || '',
].filter(Boolean);
```

---

### UPGRADE 9: Add Breadcrumb Schema to Directory Pages
**File:** `src/app/directory/page.tsx`  
**Impact:** Enhanced search result display  
**Risk:** Low

**Current Issue:**
- Missing breadcrumb structured data
- No navigation hierarchy for SEO

**Patch:**
```tsx
// Add import
import { generateBreadcrumbSchema } from '@/lib/seo/schema-generator';

// In DirectoryPage component, add to structuredDataSchemas:
const structuredDataSchemas = [
  generateWebsiteSchema(baseUrl),
  generateBreadcrumbSchema(baseUrl, [
    { name: 'Home', url: '/' },
    { name: 'Directory', url: '/directory' },
  ]),
];
```

---

### UPGRADE 10: Improve Meta Description Length and CTR
**File:** `src/lib/seo/meta-generator.ts`  
**Impact:** Better click-through rates  
**Risk:** Low

**Current Issue:**
- Some descriptions may exceed 160 characters
- Missing call-to-action in descriptions

**Patch:**
```tsx
// In generateDirectoryMetadata, around line 99:
// Ensure description is 150-160 chars for optimal CTR
let description = `Find the cheapest petrol in ${suburb || 'Melbourne'}. Compare real-time fuel prices from ${totalStations} stations. Save up to 20c/L - Free to use.`;

// Truncate if too long
if (description.length > 160) {
  description = description.substring(0, 157) + '...';
}
```

---

## 🗺️ CATEGORY 3: MAP UX IMPROVEMENTS

### UPGRADE 11: Add Map Loading Skeleton
**File:** `src/components/map/MapLibreMap.tsx`  
**Impact:** Better perceived performance  
**Risk:** Low

**Current Issue:**
- MapLoadingSkeleton exists but could be more informative
- No progress indication

**Patch:**
```tsx
// Enhance MapLoadingSkeleton (around line 35):
function MapLoadingSkeleton() {
  return (
    <div className="flex h-[500px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10">
        <svg
          className="h-6 w-6 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
      <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
        Loading interactive map...
      </p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Visualising all Melbourne petrol stations
      </p>
      {/* Add progress bar */}
      <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div className="h-full w-3/4 animate-pulse bg-primary-600" />
      </div>
    </div>
  );
}
```

---

### UPGRADE 12: Improve Mobile Map Touch Interactions
**File:** `src/components/map/MapLibreMapCore.tsx`  
**Impact:** Better mobile map experience  
**Risk:** Low

**Current Issue:**
- Popup close button may be too small on mobile
- No swipe-to-close gesture

**Patch:**
```tsx
// In createPopupHTML function, enhance close button:
<button 
  class="popup-close" 
  style="background: none; border: none; color: #9ca3af; cursor: pointer; padding: 12px; min-width: 48px; min-height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background 0.2s;" 
  onmouseover="this.style.background='#f3f4f6'" 
  onmouseout="this.style.background='transparent'"
  ontouchstart="this.style.background='#f3f4f6'"
  ontouchend="this.style.background='transparent'"
>
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
</button>
```

---

### UPGRADE 13: Add Map Controls Accessibility Labels
**File:** `src/components/map/MapLibreMapCore.tsx`  
**Impact:** Better screen reader support  
**Risk:** Low

**Current Issue:**
- Map controls may lack proper ARIA labels
- Navigation buttons not accessible

**Patch:**
```tsx
// After map creation (around line 118), enhance controls:
const nav = new maplibregl.NavigationControl({
  showCompass: true,
  showZoom: true,
  visualizePitch: true,
});

// Add to map with proper positioning
map.addControl(nav, 'top-right');

// Add custom ARIA labels via CSS (in map.css):
.maplibregl-ctrl button[aria-label] {
  /* Ensure buttons are accessible */
}
```

---

## 📝 CATEGORY 4: CODE CLARITY

### UPGRADE 14: Add Error Boundaries to Data-Fetching Components
**File:** `src/components/directory/InfiniteScrollDirectory.tsx`  
**Impact:** Better error handling  
**Risk:** Low

**Current Issue:**
- No error boundary for infinite scroll failures
- Errors could crash entire directory

**Patch:**
```tsx
// Add import
import { ErrorBoundary } from '@/components/common/ErrorBoundary/ErrorBoundary';
import { FetchErrorDisplay } from '@/components/common/FetchErrorDisplay';

// Wrap directory content:
<ErrorBoundary
  fallback={(error) => (
    <FetchErrorDisplay
      error={error}
      isOffline={false}
      onRetry={() => window.location.reload()}
      variant="card"
    />
  )}
>
  {/* Existing directory content */}
</ErrorBoundary>
```

---

### UPGRADE 15: Improve Type Safety in API Routes
**File:** `src/app/api/stations/route.ts`  
**Impact:** Better error handling and type safety  
**Risk:** Low

**Current Issue:**
- Some type assertions could be safer
- Error responses not typed

**Patch:**
```tsx
// Add type definitions at top:
interface StationsApiResponse {
  success: boolean;
  data?: Station[];
  count?: number;
  cached: boolean;
  timestamp: string;
  error?: string;
  details?: unknown;
}

// Update return types:
return NextResponse.json<StationsApiResponse>(
  {
    success: true,
    data: stations,
    count: stations.length,
    cached: false,
    timestamp: new Date().toISOString(),
  },
  // ... headers
);
```

---

### UPGRADE 16: Add Prefetch for Critical Navigation Links
**File:** `src/components/pages/PerformanceOptimizedLandingPage.tsx`  
**Impact:** Faster page transitions  
**Risk:** Low

**Current Issue:**
- No prefetching for directory/map links
- Users wait for full page load on navigation

**Patch:**
```tsx
// Add prefetch to critical links (around line 148, 169, etc.):
<Link
  href="/directory"
  prefetch={true} // Add this
  className="..."
>
  Browse All Stations
</Link>

<Link
  href="/map"
  prefetch={true} // Add this
  className="..."
>
  View Map
</Link>
```

---

### UPGRADE 17: Optimize Station Data Filtering with Indexing
**File:** `src/lib/data/stations.ts`  
**Impact:** Faster search/filter operations  
**Risk:** Low

**Current Issue:**
- Linear search through all stations
- No indexing for common queries

**Patch:**
```tsx
// Add memoized index at top of file:
let stationsIndex: Map<string, Station[]> | null = null;
let suburbsIndex: Map<string, Station[]> | null = null;

function buildIndexes(stations: Station[]) {
  if (stationsIndex && suburbsIndex) return;
  
  stationsIndex = new Map();
  suburbsIndex = new Map();
  
  stations.forEach(station => {
    // Index by suburb
    const suburbKey = station.suburb?.toLowerCase().replace(/\s+/g, '-') || '';
    if (suburbKey) {
      if (!suburbsIndex.has(suburbKey)) {
        suburbsIndex.set(suburbKey, []);
      }
      suburbsIndex.get(suburbKey)!.push(station);
    }
  });
}

// Update getStationsBySuburb:
export async function getStationsBySuburb(suburb: string): Promise<Station[]> {
  try {
    const stations = await getAllStations();
    buildIndexes(stations);
    
    const normalizedSuburb = suburb.toLowerCase().replace(/\s+/g, '-');
    return suburbsIndex?.get(normalizedSuburb) || [];
  } catch (error) {
    console.error(`Error loading stations for suburb ${suburb}:`, error);
    return [];
  }
}
```

---

### UPGRADE 18: Add Loading States to Station Cards
**File:** `src/components/molecules/StationCard/ModernStationCard.tsx`  
**Impact:** Better perceived performance  
**Risk:** Low

**Current Issue:**
- No skeleton state while images load
- Abrupt content appearance

**Patch:**
```tsx
// Add loading state:
const [imageLoading, setImageLoading] = useState(true);

// In image component:
{imageLoading && (
  <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
)}

<Image
  // ... existing props
  onLoad={() => setImageLoading(false)}
  onError={() => {
    setImageLoading(false);
    setImageError(true);
  }}
/>
```

---

### UPGRADE 19: Improve API Error Response Format
**File:** `src/app/api/stations/route.ts`  
**Impact:** Better error handling in frontend  
**Risk:** Low

**Current Issue:**
- Error responses inconsistent
- Missing error codes for client handling

**Patch:**
```tsx
// Standardize error responses (around line 109):
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Internal server error';
  const errorCode = error instanceof Error && 'code' in error ? String(error.code) : 'INTERNAL_ERROR';
  
  return NextResponse.json(
    {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
        timestamp: new Date().toISOString(),
      },
    },
    {
      status: 500,
      headers: {
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'X-Error-Code': errorCode,
      },
    }
  );
}
```

---

### UPGRADE 20: Add Resource Hints for External APIs
**File:** `src/app/layout.tsx`  
**Impact:** Faster external resource loading  
**Risk:** Low

**Current Issue:**
- No DNS prefetch for external APIs
- Missing preconnect for critical resources

**Patch:**
```tsx
// Add to RootLayout head section (around line 100):
<head>
  {/* Existing head content */}
  
  {/* Resource hints for external APIs */}
  <link rel="dns-prefetch" href="https://www.service.vic.gov.au" />
  <link rel="dns-prefetch" href="https://api.protomaps.com" />
  <link rel="preconnect" href="https://www.service.vic.gov.au" crossOrigin="anonymous" />
  <link rel="preconnect" href="https://tile.openstreetmap.org" crossOrigin="anonymous" />
</head>
```

---

## 📋 IMPLEMENTATION PRIORITY

### Phase 1: Quick Wins (1-2 hours)
1. ✅ Upgrade 7: Add Missing Alt Text
2. ✅ Upgrade 10: Improve Meta Descriptions
3. ✅ Upgrade 11: Map Loading Skeleton
4. ✅ Upgrade 15: Type Safety

### Phase 2: Performance (2-3 hours)
5. ✅ Upgrade 1: Memoize Station Cards
6. ✅ Upgrade 2: Debounce Map Updates
7. ✅ Upgrade 3: Image Priority
8. ✅ Upgrade 4: Intersection Observer

### Phase 3: SEO & UX (2-3 hours)
9. ✅ Upgrade 8: Enhanced Station Metadata
10. ✅ Upgrade 9: Breadcrumb Schema
11. ✅ Upgrade 12: Mobile Map Touch
12. ✅ Upgrade 13: Map Accessibility

### Phase 4: Polish (1-2 hours)
13. ✅ Upgrade 5: Response Compression
14. ✅ Upgrade 6: Map Lazy Loading
15. ✅ Upgrade 14: Error Boundaries
16. ✅ Upgrade 16: Link Prefetching
17. ✅ Upgrade 17: Data Indexing
18. ✅ Upgrade 18: Loading States
19. ✅ Upgrade 19: Error Format
20. ✅ Upgrade 20: Resource Hints

---

## ✅ TESTING CHECKLIST

After each upgrade:
- [ ] Verify component still renders correctly
- [ ] Check browser console for errors
- [ ] Test on mobile device
- [ ] Verify SEO metadata in page source
- [ ] Check Lighthouse scores (Performance, SEO, Accessibility)
- [ ] Test map interactions (zoom, pan, marker clicks)
- [ ] Verify no visual regressions

---

## 📊 EXPECTED IMPROVEMENTS

**Performance:**
- LCP improvement: ~200-300ms
- Reduced re-renders: ~30-40%
- Smaller initial bundle: ~50KB

**SEO:**
- Better rich snippets eligibility
- Improved CTR from search results
- Enhanced accessibility scores

**Map UX:**
- Smoother interactions
- Better mobile experience
- Improved accessibility

---

## 🚨 ROLLBACK PLAN

Each upgrade is:
- Isolated to specific files
- Reversible via git
- Testable independently

If issues arise:
1. Revert specific upgrade commit
2. Test affected component
3. Document issue for future fix

---

---

## 📝 ADDITIONAL RECOMMENDATIONS

### Code Quality Improvements (Optional)
- Remove console.log statements in production (already configured in next.config.ts)
- Add JSDoc comments to complex functions
- Consider migrating remaining .js files to TypeScript gradually

### Monitoring Additions (Future)
- Add Web Vitals tracking to error boundaries
- Implement performance budgets in CI/CD
- Add bundle size monitoring

### Testing Enhancements (Future)
- Add unit tests for memoized components
- Test map interactions with Playwright
- Add visual regression tests for critical pages

---

## 🎯 QUICK REFERENCE: FILE PATHS

**Performance Files:**
- `src/components/molecules/StationCard/ModernStationCard.tsx`
- `src/components/map/MapLibreMapCore.tsx`
- `src/components/pages/PerformanceOptimizedLandingPage.tsx`
- `src/components/directory/InfiniteScrollDirectory.tsx`
- `src/components/map/MapLibreMap.tsx`
- `next.config.ts`
- `src/lib/data/stations.ts`

**SEO Files:**
- `src/components/pages/PerformanceOptimizedLandingPage.tsx`
- `src/app/stations/[id]/page.tsx`
- `src/app/directory/page.tsx`
- `src/lib/seo/meta-generator.ts`

**Map UX Files:**
- `src/components/map/MapLibreMap.tsx`
- `src/components/map/MapLibreMapCore.tsx`

**Code Clarity Files:**
- `src/components/directory/InfiniteScrollDirectory.tsx`
- `src/app/api/stations/route.ts`
- `src/app/layout.tsx`

---

## ✅ VALIDATION CHECKLIST

Before deploying any upgrade:
- [ ] Code compiles without errors
- [ ] TypeScript types are correct
- [ ] No console errors in browser
- [ ] Mobile responsiveness maintained
- [ ] Accessibility (a11y) not degraded
- [ ] Performance metrics improved or maintained
- [ ] SEO metadata validates
- [ ] Map interactions work smoothly
- [ ] Error handling graceful

---

**End of Upgrade Plan**

*Last Updated: 2024*  
*Total Upgrades: 20*  
*Estimated Total Time: 8-12 hours*  
*Risk Level: Low (All upgrades are incremental and reversible)*

