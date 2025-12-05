# Station SEO Quick Reference Guide

## Quick Start - Using SEO-Friendly Station URLs

### 1. Import the Helper Function
```typescript
import { getStationUrl } from '@/lib/seo/station-seo';
```

### 2. Use in Your Components
```typescript
// ❌ Old way (don't use)
<Link href={`/stations/${station.id}`}>View Details</Link>

// ✅ New way (use this)
<Link href={getStationUrl(station)}>View Details</Link>
```

### 3. Generated URL Format
```typescript
// Input: station with id=456, brand="BP", suburb="Thomastown"
getStationUrl(station)
// Output: "/stations/bp-thomastown-456"
```

## API Reference

### Core Functions

#### `getStationUrl(station: Station): string`
Returns the complete SEO-friendly URL for a station.

**Usage:**
```typescript
const url = getStationUrl(station);
// "/stations/bp-thomastown-456"
```

#### `generateStationSlug(station: Station): string`
Creates the SEO-friendly slug (without `/stations/` prefix).

**Usage:**
```typescript
const slug = generateStationSlug(station);
// "bp-thomastown-456"
```

#### `parseStationSlug(slug: string): string`
Extracts the station ID from both old and new URL formats.

**Usage:**
```typescript
parseStationSlug("456")                    // "456"
parseStationSlug("bp-thomastown-456")     // "456"
```

#### `generateStationSEOMetadata(station: Station): Metadata`
Generates complete Next.js metadata with SEO-optimized title and description.

**Usage:**
```typescript
export async function generateMetadata({ params }) {
  const station = await getStationById(params.id);
  return generateStationSEOMetadata(station);
}
```

#### `generateStationStructuredData(station: Station)`
Creates Schema.org structured data for rich snippets.

**Usage:**
```typescript
const schema = generateStationStructuredData(station);
<StructuredData data={schema} />
```

## Examples

### Example 1: Station Card Component
```typescript
import Link from 'next/link';
import { getStationUrl } from '@/lib/seo/station-seo';
import type { Station } from '@/types/station';

function StationCard({ station }: { station: Station }) {
  return (
    <div className="station-card">
      <h3>{station.name}</h3>
      <p>{station.address}</p>
      <Link href={getStationUrl(station)}>
        View Details →
      </Link>
    </div>
  );
}
```

### Example 2: Map Popup
```typescript
import { getStationUrl } from '@/lib/seo/station-seo';

function MapPopup({ station }) {
  return (
    <div className="popup">
      <h4>{station.name}</h4>
      <a href={getStationUrl(station)}>
        View Details
      </a>
    </div>
  );
}
```

### Example 3: Dynamic Station Page
```typescript
import { generateStationSEOMetadata, parseStationSlug } from '@/lib/seo/station-seo';
import { getStationById } from '@/lib/data/stations';

export async function generateMetadata({ params }) {
  const stationId = parseStationSlug(params.id);
  const station = await getStationById(stationId);
  
  if (!station) {
    return { title: 'Station Not Found' };
  }
  
  return generateStationSEOMetadata(station);
}

export default async function StationPage({ params }) {
  const stationId = parseStationSlug(params.id);
  const station = await getStationById(stationId);
  
  return (
    <div>
      <h1>{station.name}</h1>
      {/* ... */}
    </div>
  );
}
```

### Example 4: HTML String Interpolation (for MapLibre)
```typescript
import { generateStationSlug } from '@/lib/seo/station-seo';

const popupHTML = `
  <div>
    <h4>${station.name}</h4>
    <a href="/stations/${generateStationSlug(station)}">
      View Details
    </a>
  </div>
`;
```

## SEO Title & Description Templates

### Title Template
```
{brand} {suburb} – Today's Fuel Prices | Unleaded 91, Diesel, E10 | PetrolPricesNearMe
```

**Example:**
```
BP Thomastown – Today's Fuel Prices | Unleaded 91, Diesel, E10 | PetrolPricesNearMe
```

### Description Template
```
{brand} service station in {suburb}, {state}. Check today's real-time fuel prices for U91, U95, U98, Diesel, and LPG. Open hours, address, map location, available services, and nearby stations. Updated daily.
```

**Example:**
```
BP service station in Thomastown, VIC. Check today's real-time fuel prices for U91, U95, U98, Diesel, and LPG. Open hours, address, map location, available services, and nearby stations. Updated daily.
```

## URL Format

### Old Format (Still Supported)
```
/stations/456
/stations/789
```

### New SEO Format
```
/stations/bp-thomastown-456
/stations/shell-richmond-789
/stations/7-eleven-footscray-123
/stations/coles-express-melbourne-cbd-555
```

### Slug Generation Rules
- Format: `{brand}-{suburb}-{id}`
- Lowercase only
- Spaces → hyphens
- Special characters removed
- Multiple hyphens collapsed to single hyphen

## Migration Checklist

When updating a component to use SEO URLs:

- [ ] Import `getStationUrl` from `@/lib/seo/station-seo`
- [ ] Replace all `/stations/${station.id}` with `getStationUrl(station)`
- [ ] For HTML strings, use `generateStationSlug(station)` 
- [ ] Test both old and new URL formats work
- [ ] Verify links render correctly
- [ ] Check linter passes

## Testing

### Test Old URL Format
```
Navigate to: /stations/456
Should work: ✅ Displays station page
```

### Test New URL Format
```
Navigate to: /stations/bp-thomastown-456
Should work: ✅ Displays station page
```

### Test Link Generation
```typescript
const station = {
  id: 456,
  brand: "BP",
  suburb: "Thomastown"
};

getStationUrl(station)
// Expected: "/stations/bp-thomastown-456"
```

## Common Issues

### Issue: TypeScript Error - Can't find module
**Solution:** Ensure proper import path
```typescript
// ✅ Correct
import { getStationUrl } from '@/lib/seo/station-seo';

// ❌ Wrong
import { getStationUrl } from '@/lib/seo/station';
```

### Issue: URL shows `undefined` in slug
**Solution:** Ensure station object has required properties
```typescript
// Check station has id, brand, and suburb
console.log(station.id, station.brand, station.suburb);
```

### Issue: Old URLs not working
**Solution:** Use `parseStationSlug` to extract ID
```typescript
const stationId = parseStationSlug(params.id);
const station = await getStationById(stationId);
```

## Performance Notes

- Slug generation is O(1) - no database queries
- URLs are generated at build time for static pages
- ISR pages cache SEO metadata for 1 hour
- No performance impact on page load

## Browser Compatibility

- ✅ All modern browsers
- ✅ Mobile browsers (iOS Safari, Chrome)
- ✅ Crawlers (Googlebot, Bingbot)
- ✅ Social media crawlers (Facebook, Twitter)

## Need Help?

See the full documentation: `STATION_SEO_IMPROVEMENTS.md`

