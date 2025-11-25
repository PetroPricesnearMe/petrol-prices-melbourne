# MapLibre Map Implementation Guide

## Overview

This guide explains how to use the new high-performance MapLibre map component for displaying ~720 petrol stations in Melbourne.

## Quick Start

### 1. Install Dependencies

The required dependencies are already installed:
- `maplibre-gl` - Lightweight map rendering library
- `supercluster` - Efficient marker clustering
- `pmtiles` - (Optional) For Protomaps PMTiles format

### 2. Basic Usage

```tsx
import { MapLibreMap } from '@/components/map';
import type { Station } from '@/types/station';

function MyPage() {
  const stations: Station[] = [
    // Your station data
  ];

  return (
    <MapLibreMap
      stations={stations}
      height="600px"
      defaultZoom={11}
      defaultCenter={{ latitude: -37.8136, longitude: 144.9631 }}
    />
  );
}
```

## Component Structure

```
src/components/map/
├── MapLibreMap.tsx          # Main component with lazy loading
├── MapLibreMapCore.tsx      # Core map implementation
├── StationPopup.tsx         # Station detail popup
├── map.css                  # Map-specific styles
├── index.ts                 # Exports
├── README.md                # Component documentation
└── MapLibreMap.example.tsx   # Usage examples
```

## Station Data Format

Your station objects should match the `Station` type:

```typescript
interface Station {
  id: string | number;
  name: string;
  brand?: string;              // Used for marker color
  latitude: number;            // Required
  longitude: number;           // Required
  logoUrl?: string;            // Optional: brand logo URL
  image?: string;              // Optional: station image
  address?: string;
  suburb?: string;
  postcode?: string;
  fuelPrices?: Record<string, number | null>;
  // ... other properties
}
```

## Features

### ✅ Marker Clustering

Automatically clusters nearby markers for better performance:

```tsx
<MapLibreMap
  stations={stations}
  enableClustering={true}  // Default: true
/>
```

- Clusters markers when zoomed out
- Expands clusters when zoomed in
- Click cluster to zoom in
- Handles 720+ stations efficiently

### ✅ Custom Marker Icons

Markers automatically use station logos if available:

```tsx
const station = {
  id: 1,
  name: 'BP Station',
  brand: 'BP',
  logoUrl: '/logos/bp.png',  // Will display logo
  latitude: -37.8136,
  longitude: 144.9631,
};
```

If no logo is available, a colored circle with the brand initial is shown.

### ✅ Lazy Loading

Map only loads when it becomes visible:

```tsx
<MapLibreMap
  stations={stations}
  enableLazyLoad={true}  // Default: true
/>
```

Uses Intersection Observer to detect visibility. Starts loading 100px before the map is visible.

### ✅ Station Selection

Handle station clicks:

```tsx
<MapLibreMap
  stations={stations}
  selectedStation={selectedStation}
  onStationSelect={(station) => {
    setSelectedStation(station);
    // Navigate to station page, show details, etc.
  }}
/>
```

### ✅ User Location

Show user location on map:

```tsx
<MapLibreMap
  stations={stations}
  userLocation={{ latitude: -37.8136, longitude: 144.9631 }}
/>
```

Adds a geolocate control to the map.

## Styling

### Custom Height

```tsx
<MapLibreMap
  stations={stations}
  height="800px"  // Custom height
/>
```

### Custom Classes

```tsx
<MapLibreMap
  stations={stations}
  className="rounded-2xl shadow-2xl"  // Additional Tailwind classes
/>
```

### Dark Mode

The map automatically adapts to dark mode using CSS media queries.

## Performance Optimization

### 1. Filter Stations Before Passing

Only pass stations with valid coordinates:

```tsx
const validStations = stations.filter(
  (station) =>
    station.latitude &&
    station.longitude &&
    !isNaN(station.latitude) &&
    !isNaN(station.longitude)
);

<MapLibreMap stations={validStations} />
```

### 2. Use Lazy Loading

Always enable lazy loading for maps below the fold:

```tsx
<MapLibreMap enableLazyLoad={true} />
```

### 3. Optimize Images

Use optimized images for station logos:

```tsx
// Use Next.js Image component for logos
import Image from 'next/image';

// Or use CDN with optimization
const logoUrl = `https://cdn.example.com/logos/${brand}.webp`;
```

### 4. Server-Side Clustering (Optional)

For very large datasets, pre-cluster on the server:

```typescript
// Server-side clustering example
import { createCluster, getClusters } from '@/lib/map/clustering';

const cluster = createCluster(stations);
const clusters = getClusters(cluster, bbox, zoom);
```

## Integration with Existing Code

### Replace Existing Map Component

If you're using the old `StationMap` component:

```tsx
// Old
import { StationMap } from '@/components/listings/StationMap';

// New
import { MapLibreMap } from '@/components/map';

// Replace
<StationMap stations={stations} />
// With
<MapLibreMap stations={stations} />
```

### Update Station Type (if needed)

If your stations don't have `logoUrl`, add it:

```typescript
// In src/types/station.ts
export interface Station extends StationWithLocation {
  // ... existing properties
  logoUrl?: string;  // Add this
  image?: string;    // Or use existing image property
}
```

## Advanced Usage

### Custom Map Style

To use Protomaps vector tiles or custom styles, modify `MapLibreMapCore.tsx`:

```typescript
// For Protomaps PMTiles
import { PMTiles } from 'pmtiles';

const pmtiles = new PMTiles('https://example.com/tiles.pmtiles');
// Configure map with PMTiles source
```

### Custom Marker Styling

Modify `src/lib/map/marker-utils.ts`:

```typescript
export function getBrandColor(brand?: string): string {
  const brandColors: Record<string, string> = {
    BP: '#00A651',
    Shell: '#FFD700',
    // Add your custom brands
    'Your Brand': '#FF0000',
  };
  return brandColors[brand || ''] || '#6B7280';
}
```

### Custom Popup Content

Modify `src/components/map/StationPopup.tsx` to customize popup content.

## Troubleshooting

### Map Not Loading

1. Check browser console for errors
2. Ensure MapLibre CSS is imported
3. Verify stations have valid coordinates
4. Check network tab for tile loading issues

### Markers Not Showing

1. Verify stations have `latitude` and `longitude`
2. Check that coordinates are numbers, not strings
3. Ensure clustering is working (zoom in/out)
4. Check browser console for errors

### Performance Issues

1. Enable clustering: `enableClustering={true}`
2. Filter stations before passing to map
3. Use lazy loading: `enableLazyLoad={true}`
4. Reduce number of visible stations (filter by region)

### Tile Loading Errors

If OpenStreetMap tiles fail to load:

1. Check network connectivity
2. Verify CORS settings
3. Consider using a different tile provider
4. Check browser console for specific errors

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest, requires WebGL)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Bundle Size

- MapLibre GL JS: ~150KB (gzipped)
- Supercluster: ~10KB (gzipped)
- Total: ~160KB (much smaller than Mapbox GL)

## Next Steps

1. **Add Station Logos**: Upload brand logos to `/public/logos/`
2. **Customize Colors**: Update brand colors in `marker-utils.ts`
3. **Add Filters**: Implement map-based filtering
4. **Route Planning**: Add directions between stations
5. **Price Heatmap**: Visualize price distribution

## Support

For issues or questions:
- Check `src/components/map/README.md` for component docs
- Review example usage in `MapLibreMap.example.tsx`
- Check utility functions in `src/lib/map/`

## Migration Checklist

- [ ] Install dependencies (`maplibre-gl`, `supercluster`)
- [ ] Import `MapLibreMap` component
- [ ] Verify station data has `latitude` and `longitude`
- [ ] Add `logoUrl` to stations (optional)
- [ ] Replace old map component with `MapLibreMap`
- [ ] Test clustering with full dataset
- [ ] Test lazy loading behavior
- [ ] Verify responsive design on mobile
- [ ] Test dark mode styling
- [ ] Optimize station logo images

