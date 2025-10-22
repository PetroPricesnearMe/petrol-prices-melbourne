# Station Data Integration Guide

## Overview
Successfully integrated 660+ petrol stations from CSV data into the directory with optimal SEO and performance.

## Architecture Decision: Next.js SSG + ISR

**Chosen Approach:** Static Site Generation (SSG) with Incremental Static Regeneration (ISR)

### Why This Approach?

1. **Maximum SEO Benefits**
   - All station data is pre-rendered in HTML at build time
   - Search engines can crawl all 660+ stations without JavaScript
   - Individual suburb pages (100 generated) for targeted local SEO
   - Structured data (Schema.org) for rich snippets

2. **Optimal Performance**
   - Static HTML served from CDN edge locations
   - Instant page loads (no API calls needed)
   - Small bundle size: 102-123 kB first load JS
   - ISR revalidation every hour keeps data fresh

3. **Scalability**
   - 118 static pages generated at build time
   - On-demand generation for new suburbs
   - No database queries needed for reads

## Implementation Details

### Data Flow

```
stations.csv → convert-stations.js → stations.json → Next.js Build → Static HTML
```

### Files Created/Modified

#### 1. Data Conversion
- **`scripts/convert-stations.js`** - Converts CSV to optimized JSON
- **`src/data/stations.json`** - 660 station records (469KB)
- **`src/data/stations-metadata.json`** - Aggregated stats and metadata
- **`npm run update:data`** - Command to regenerate JSON from CSV

#### 2. Directory Pages
- **`src/app/directory/page.tsx`** - Main directory with 660+ stations
  - ISR revalidation: 1 hour
  - Dynamic metadata based on real station count
  - Passes data as props (no runtime fetching)
  
- **`src/app/directory/[suburb]/page.tsx`** - Suburb-specific pages
  - 100 top suburbs pre-generated at build time
  - On-demand generation for other suburbs
  - SEO-optimized metadata per suburb
  - Sorted by price (cheapest first)

#### 3. Client Components
- **`src/app/directory/StationDirectoryClient.tsx`** - Interactive filtering
  - Real-time search across 660+ stations
  - Multi-criteria filtering (brand, suburb, fuel type, price)
  - Smart pagination (24 items per page)
  - Price color coding (green < 200, orange 200-210, red > 210)

#### 4. Type Definitions
- **`src/types/station.d.ts`** - TypeScript interfaces for Station data

### Features Implemented

#### Filtering & Search
- ✅ Full-text search (name, address, suburb, brand)
- ✅ Filter by fuel type (Unleaded, Diesel, Premium 95/98, LPG)
- ✅ Filter by brand (BP, Shell, Caltex, 7-Eleven, Independent)
- ✅ Filter by suburb (381 unique suburbs)
- ✅ Maximum price filter
- ✅ Active filter count indicator

#### Sorting
- ✅ Price (Low to High) - Default
- ✅ Price (High to Low)
- ✅ Suburb (A-Z)
- ✅ Name (A-Z)

#### User Experience
- ✅ Responsive grid layout (1-4 columns)
- ✅ Pagination (24 stations per page)
- ✅ Price color coding for quick visual scanning
- ✅ Direct Google Maps links for directions
- ✅ "Cheapest" badge on suburb pages
- ✅ Verified station indicators
- ✅ Last updated timestamps

#### SEO Optimization
- ✅ Semantic HTML with `<article>`, `<section>`, `<h1>`-`<h3>`
- ✅ Schema.org microdata (itemScope, itemType)
- ✅ Dynamic metadata generation
- ✅ Keyword-rich descriptions
- ✅ Open Graph tags
- ✅ Internal linking to suburb pages from homepage
- ✅ SEO-friendly URLs (`/directory/brunswick`, not `/directory?suburb=brunswick`)

#### Performance
- ✅ Static generation eliminates API calls
- ✅ Efficient client-side filtering (useMemo)
- ✅ Smart pagination reduces DOM size
- ✅ Lazy-loaded filters (collapsed by default)
- ✅ Optimized bundle: ~113KB for directory page

## Data Statistics

```
Total Stations:    660
Unique Suburbs:    381
Unique Brands:     4 (+ Independent category)
Top Brands:
  - Independent:   337 stations
  - Caltex:        125 stations
  - BP:            105 stations
  - 7-Eleven:      93 stations
```

## SEO Strategy

### 1. Main Directory Page
- `/directory` - All 660 stations with filtering
- Target: "Melbourne petrol stations", "fuel price directory"
- Updated metadata with real station counts

### 2. Suburb Pages (100+ generated)
- `/directory/[suburb]` - Suburb-specific listings
- Examples: `/directory/brunswick`, `/directory/preston`, `/directory/frankston`
- Target: "petrol stations in [suburb]", "[suburb] fuel prices"
- Local SEO optimization

### 3. Homepage Internal Links
- Added "Popular Suburbs" section with 18 quick links
- Creates strong internal linking structure
- Helps search engines discover suburb pages

## Performance Metrics

### Build Performance
- **Build time:** ~13 seconds
- **Pages generated:** 118 static pages
- **Data size:** 469KB JSON (compressed to ~60KB in production)

### Runtime Performance (Expected)
- **Lighthouse Score:** 90+ in all categories
- **First Contentful Paint:** < 1s
- **Time to Interactive:** < 2s
- **Cumulative Layout Shift:** < 0.1

## Maintenance

### Updating Station Data

1. Update `public/data/stations.csv` with new data
2. Run: `npm run update:data`
3. Commit changes: `git add src/data/ && git commit -m "chore: update station data"`
4. Deploy (Vercel will rebuild automatically)

### Adding New Features

The architecture supports easy extension:
- Add new filter criteria in `StationDirectoryClient.tsx`
- Add new metadata fields in `convert-stations.js`
- Create brand-specific pages similar to suburb pages

## Deployment Checklist

- [x] CSV converted to JSON
- [x] TypeScript types defined
- [x] Directory pages updated with real data
- [x] ISR configured (1 hour revalidation)
- [x] Suburb pages with static generation
- [x] SEO metadata optimized
- [x] Build successfully completes
- [x] npm script for data updates
- [ ] Deploy to Vercel
- [ ] Verify search engine indexing

## Next Steps (Optional Enhancements)

1. **Brand Pages** - Create `/directory/brand/[brand]` for brand-specific SEO
2. **Price Alerts** - Allow users to set price alerts for suburbs
3. **Map Integration** - Add lightweight map view (avoid Leaflet overhead)
4. **API Integration** - Connect to live price APIs for real-time updates
5. **Fuel Price Trends** - Historical price tracking per suburb
6. **User Reviews** - Allow ratings and reviews for stations

## Technical Notes

### Why Not Leaflet?
- Adds 150KB+ to bundle size
- Not essential for directory view
- Google Maps links provide better UX
- Can be added later as optional feature

### Why ISR over Pure Static?
- Data can update without full rebuild
- Hourly revalidation keeps prices fresh
- Better than CSR for SEO
- Lower infrastructure costs than SSR

### Pagination Strategy
- 24 items per page balances performance and UX
- Smart page number display (max 7 visible)
- Maintains filter state across pages
- SEO-friendly (all content in initial HTML)

## Support

For questions or issues:
- Check build logs: `npm run build`
- Test locally: `npm run dev`
- Verify data: `cat src/data/stations-metadata.json`
- Rebuild data: `npm run update:data`

