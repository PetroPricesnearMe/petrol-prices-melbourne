# Quick Start: MapLibre Map

## Installation ✅

Dependencies are already installed:
- `maplibre-gl`
- `supercluster`
- `pmtiles`

## Basic Usage

```tsx
import { MapLibreMap } from '@/components/map';

<MapLibreMap
  stations={yourStationsArray}
  height="600px"
/>
```

## Station Data Requirements

Your stations need:
- `id`: string or number
- `name`: string
- `latitude`: number (required)
- `longitude`: number (required)
- `brand`: string (optional, for marker color)
- `logoUrl`: string (optional, for marker icon)
- `image`: string (optional, fallback for marker icon)

## Example

```tsx
const stations = [
  {
    id: 1,
    name: 'BP Melbourne',
    brand: 'BP',
    latitude: -37.8136,
    longitude: 144.9631,
    logoUrl: '/logos/bp.png',
  },
];

<MapLibreMap
  stations={stations}
  defaultZoom={11}
  defaultCenter={{ latitude: -37.8136, longitude: 144.9631 }}
  enableClustering={true}
  enableLazyLoad={true}
/>
```

## Features

- ✅ Clustering for 720+ stations
- ✅ Custom marker icons (station logos)
- ✅ Lazy loading (only loads when visible)
- ✅ Hover tooltips
- ✅ Click popups with station details
- ✅ Responsive design
- ✅ Dark mode support

## Files Created

- `src/components/map/MapLibreMap.tsx` - Main component
- `src/components/map/MapLibreMapCore.tsx` - Core implementation
- `src/lib/map/clustering.ts` - Clustering utilities
- `src/lib/map/marker-utils.ts` - Marker utilities

## Next Steps

1. Pass your station data to the component
2. Add station logos to `/public/logos/` (optional)
3. Customize brand colors in `src/lib/map/marker-utils.ts`
4. See `MAPLIBRE_IMPLEMENTATION_GUIDE.md` for advanced usage

