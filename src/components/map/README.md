# MapLibre Map Component

High-performance map component using MapLibre GL JS with Protomaps/OpenStreetMap tiles.

## Features

- ✅ **Lightweight**: Uses MapLibre GL JS (smaller than Mapbox GL)
- ✅ **Free Tiles**: OpenStreetMap raster tiles (no API key needed)
- ✅ **Clustering**: Efficient marker clustering for ~720 stations using Supercluster
- ✅ **Custom Markers**: Station logos or brand-colored markers
- ✅ **Lazy Loading**: Only loads map when visible (Intersection Observer)
- ✅ **Smooth Interactions**: Zoom, pan, and marker interactions
- ✅ **Responsive**: Tailwind-styled, mobile-friendly
- ✅ **Accessible**: ARIA labels and keyboard navigation

## Usage

```tsx
import { MapLibreMap } from '@/components/map';

function MyPage() {
  const stations = [
    {
      id: 1,
      name: 'BP Station',
      brand: 'BP',
      latitude: -37.8136,
      longitude: 144.9631,
      logoUrl: '/logos/bp.png',
      // ... other station properties
    },
    // ... more stations
  ];

  return (
    <MapLibreMap
      stations={stations}
      defaultZoom={10}
      defaultCenter={{ latitude: -37.8136, longitude: 144.9631 }}
      enableClustering={true}
      enableLazyLoad={true}
      onStationSelect={(station) => {
        console.log('Selected:', station);
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `stations` | `Station[]` | required | Array of station objects with lat/lng |
| `selectedStation` | `Station \| null` | `null` | Currently selected station |
| `onStationSelect` | `(station: Station) => void` | - | Callback when station is clicked |
| `userLocation` | `Coordinates \| null` | `null` | User's current location |
| `className` | `string` | `''` | Additional CSS classes |
| `height` | `string` | `'500px'` | Map container height |
| `defaultZoom` | `number` | `10` | Initial zoom level |
| `defaultCenter` | `Coordinates` | Melbourne | Initial map center |
| `enableClustering` | `boolean` | `true` | Enable marker clustering |
| `enableLazyLoad` | `boolean` | `true` | Lazy load map when visible |

## Station Object Format

```typescript
interface Station {
  id: string | number;
  name: string;
  brand?: string;
  latitude: number;
  longitude: number;
  logoUrl?: string;
  image?: string;
  address?: string;
  suburb?: string;
  postcode?: string;
  fuelPrices?: Record<string, number | null>;
  // ... other properties
}
```

## Performance

- **Bundle Size**: ~150KB (MapLibre GL JS)
- **Initial Load**: Map only loads when visible (lazy loading)
- **Clustering**: Efficiently handles 720+ markers
- **Rendering**: Uses WebGL for smooth 60fps interactions

## Customization

### Custom Marker Icons

Stations with `logoUrl` or `image` will display their logo. Otherwise, a colored circle with the brand initial is shown.

### Brand Colors

Brand colors are defined in `src/lib/map/marker-utils.ts`:

```typescript
const brandColors = {
  BP: '#00A651',
  Shell: '#FFD700',
  // ... add more brands
};
```

### Map Style

To use Protomaps vector tiles or custom styles, modify `MapLibreMapCore.tsx`:

```typescript
// For Protomaps PMTiles (requires PMTiles library)
import { PMTiles } from 'pmtiles';

const pmtiles = new PMTiles('https://example.com/tiles.pmtiles');
// ... configure map style
```

## Future Enhancements

- [ ] Protomaps PMTiles integration for vector tiles
- [ ] Custom map themes (dark mode, satellite)
- [ ] Route planning between stations
- [ ] Price heatmap overlay
- [ ] Station filters on map
- [ ] Draw radius for search area

## Dependencies

- `maplibre-gl`: Map rendering library
- `supercluster`: Marker clustering algorithm
- `pmtiles`: (Optional) For Protomaps PMTiles format

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (WebGL required)
- Mobile: ✅ Full support

