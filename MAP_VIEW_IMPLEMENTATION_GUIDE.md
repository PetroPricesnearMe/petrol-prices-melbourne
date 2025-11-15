# Map View Implementation Guide

## 📋 Overview

Comprehensive guide for the interactive map view toggle system with Leaflet integration, marker clustering, and responsive full-screen support.

## ✨ Features Implemented

### 1. **Interactive Leaflet Map**

- ✅ Real-time station markers with custom icons
- ✅ Color-coded pins based on fuel prices
- ✅ Interactive popups with station details
- ✅ Smooth animations and transitions
- ✅ User location tracking
- ✅ OpenStreetMap tiles

### 2. **Marker Clustering**

- ✅ Automatic clustering when zoomed out
- ✅ Dynamic cluster sizing based on station count
- ✅ Smooth cluster expansion on click
- ✅ Spiderfy effect for overlapping markers
- ✅ Performance optimized for 1000+ stations

### 3. **View Toggle Component**

- ✅ Switch between List, Grid, and Map views
- ✅ Keyboard navigation (Arrow keys, Enter, Space)
- ✅ ARIA accessibility labels
- ✅ Smooth animations with Framer Motion
- ✅ Touch-friendly buttons
- ✅ Responsive design

### 4. **Responsive Full-Screen Mode**

- ✅ Full-screen map on mobile and desktop
- ✅ Exit full-screen button
- ✅ Responsive controls placement
- ✅ Mobile-optimized legend and badges
- ✅ Smooth enter/exit transitions

### 5. **Pin Interactivity**

- ✅ Click to view station details
- ✅ Popup with fuel prices
- ✅ Get directions button
- ✅ Selected station highlighting
- ✅ Hover effects
- ✅ Auto-zoom to selected station

## 📁 Files Created

```
src/
  components/
    ├── InteractiveStationMap.tsx       (400+ lines)
    ├── InteractiveStationMap.css       (500+ lines)
    ├── ViewToggle.tsx                  (180+ lines)
    └── ViewToggle.css                  (350+ lines)

docs/
  ├── MAP_VIEW_IMPLEMENTATION_GUIDE.md  (this file)
  ├── MAP_VIEW_QUICK_REFERENCE.md
  └── MAP_VIEW_EXAMPLES.md
```

## 🚀 Quick Start

### Basic Usage

```tsx
import InteractiveStationMap from '@/components/InteractiveStationMap';
import ViewToggle from '@/components/ViewToggle';

function StationDirectory() {
  const [viewMode, setViewMode] = useState('grid');
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div>
      <ViewToggle currentView={viewMode} onViewChange={setViewMode} />

      {viewMode === 'map' && (
        <InteractiveStationMap
          stations={stations}
          onStationClick={handleStationClick}
          fullScreen={isFullScreen}
          onFullScreenToggle={() => setIsFullScreen(!isFullScreen)}
        />
      )}
    </div>
  );
}
```

## 🗺️ InteractiveStationMap Component

### Props

```typescript
interface InteractiveStationMapProps {
  stations: Station[]; // Array of stations to display
  onStationClick?: (station) => void; // Callback when marker clicked
  selectedStation?: Station | null; // Currently selected station
  height?: number | string; // Map height (default: 600)
  center?: [number, number]; // Initial center coordinates
  zoom?: number; // Initial zoom level (default: 11)
  fullScreen?: boolean; // Enable full-screen mode
  onFullScreenToggle?: () => void; // Full-screen toggle callback
  showUserLocation?: boolean; // Show user location (default: true)
  className?: string; // Custom CSS class
}
```

### Station Data Structure

```typescript
interface Station {
  id: string | number;
  name: string;
  address: string;
  city?: string;
  latitude: number;
  longitude: number;
  brand?: string;
  fuelPrices?: Array<{
    fuelType: string;
    price: number;
  }>;
}
```

### Color Coding

Markers are automatically color-coded based on average fuel prices:

| Price Range   | Color     | Hex Code |
| ------------- | --------- | -------- |
| < $1.80       | 🟢 Green  | #10B981  |
| $1.80 - $2.00 | 🟠 Orange | #F59E0B  |
| > $2.00       | 🔴 Red    | #EF4444  |
| No data       | ⚫ Gray   | #6B7280  |

### Custom Icons

```tsx
// Fuel icon with color-coded pin
⛽ // Displayed in marker center

// Pin shape: Teardrop with rotation
border-radius: 50% 50% 50% 0;
transform: rotate(-45deg);
```

### Map Controls

- **📍 Recenter Button**: Returns view to user location
- **⛶ Fullscreen Button**: Toggles full-screen mode
- **Legend**: Shows price color coding
- **Station Count Badge**: Displays total stations

## 🎯 ViewToggle Component

### Props

```typescript
interface ViewToggleProps {
  currentView: 'list' | 'grid' | 'map';
  onViewChange: (view) => void;
  showGrid?: boolean; // Show grid option (default: true)
  className?: string;
  size?: 'sm' | 'md' | 'lg'; // Button size (default: 'md')
  orientation?: 'horizontal' | 'vertical'; // Layout direction
}
```

### View Modes

1. **List View** (☰)
   - Horizontal cards
   - Full station details
   - Optimal for detailed browsing

2. **Grid View** (⊞)
   - Responsive grid (1/2/3/4 columns)
   - Compact card layout
   - Best for comparing multiple stations

3. **Map View** (🗺️)
   - Interactive Leaflet map
   - Clustered markers
   - Visual location overview

### Keyboard Navigation

| Key                | Action                              |
| ------------------ | ----------------------------------- |
| `←` or `→`         | Navigate between views (horizontal) |
| `↑` or `↓`         | Navigate between views (vertical)   |
| `Enter` or `Space` | Select view                         |
| `Tab`              | Focus next element                  |

## 🔧 Configuration

### Map Tiles

Using OpenStreetMap tiles by default:

```tsx
<TileLayer
  attribution="&copy; OpenStreetMap contributors"
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  maxZoom={19}
/>
```

**Alternative tile providers:**

```tsx
// Mapbox (requires API key)
url =
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';

// CartoDB
url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

// Stamen
url = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg';
```

### Clustering Options

```tsx
<MarkerClusterGroup
  chunkedLoading // Load markers in chunks
  maxClusterRadius={50} // Max radius for clustering
  spiderfyOnMaxZoom={true} // Expand overlapping markers
  showCoverageOnHover={true} // Show cluster area on hover
  zoomToBoundsOnClick={true} // Zoom to cluster on click
/>
```

### Cluster Sizes

```typescript
// Small: 1-10 stations
size: 40px, color: #3B82F6 (Blue)

// Medium: 11-50 stations
size: 50px, color: #8B5CF6 (Purple)

// Large: 50+ stations
size: 60px, color: #EC4899 (Pink)
```

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile: < 640px */
- Single column layout
- Compact controls
- Smaller legend
- Hidden view labels
- Full-width toggle

/* Tablet: 640px - 1024px */
- Medium-sized controls
- Adjusted legend placement
- Visible view labels

/* Desktop: > 1024px */
- Full-sized controls
- Optimal legend placement
- All features visible
```

### Full-Screen Mode

```tsx
// Enter full-screen
<InteractiveStationMap fullScreen={true} />

// CSS applied
position: fixed;
top: 0; left: 0;
width: 100vw;
height: 100vh;
z-index: 9999;
```

### Mobile Optimizations

- Touch-friendly 44px minimum button size
- Swipe-friendly cluster interactions
- Larger tap targets for markers
- Optimized popup sizing
- Reduced motion support

## 🎨 Customization

### Custom Marker Icons

```tsx
const createCustomIcon = (station, isSelected) => {
  return L.divIcon({
    html: `
      <div style="background-color: ${getColor(station)}">
        <span>⛽</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};
```

### Custom Popup Content

```tsx
<Popup>
  <div className="station-popup">
    <h3>{station.name}</h3>
    <p>{station.address}</p>
    {/* Add custom content */}
    <button onClick={handleCustomAction}>Custom Action</button>
  </div>
</Popup>
```

### Custom Cluster Icons

```tsx
iconCreateFunction={(cluster) => {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div class="my-cluster">${count}</div>`,
    className: 'custom-cluster',
    iconSize: L.point(40, 40),
  });
}}
```

## ♿ Accessibility

### ARIA Labels

```tsx
// View toggle
<button
  role="radio"
  aria-checked={isActive}
  aria-label="Switch to map view"
>
  Map
</button>

// Map controls
<button
  aria-label="Recenter map to your location"
  title="Recenter to your location"
>
  📍
</button>
```

### Keyboard Support

- Full keyboard navigation
- Focus management
- Escape key to close popups
- Tab order optimization
- Skip links for efficiency

### Screen Readers

- Descriptive labels
- Live region updates
- Status announcements
- Error messaging
- Alternative content

## 🔍 Advanced Features

### User Location Tracking

```tsx
// Automatic geolocation
useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserLocation([position.coords.latitude, position.coords.longitude]);
    }
  );
}, []);

// Display user marker
<Marker position={userLocation} icon={userLocationIcon}>
  <Popup>Your Location</Popup>
</Marker>

// Show accuracy circle
<Circle
  center={userLocation}
  radius={1000}
  pathOptions={{ color: '#3B82F6', fillOpacity: 0.1 }}
/>
```

### Auto-Zoom to Selected Station

```tsx
const MapController = ({ selectedStation }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedStation) {
      map.flyTo(
        [selectedStation.latitude, selectedStation.longitude],
        15, // Zoom level
        { duration: 1.5 } // Animation duration
      );
    }
  }, [selectedStation]);

  return null;
};
```

### Custom Map Bounds

```tsx
// Fit map to show all stations
const bounds = L.latLngBounds(stations.map((s) => [s.latitude, s.longitude]));
map.fitBounds(bounds, { padding: [50, 50] });
```

## 🎭 Animations

### Marker Drop Animation

```css
@keyframes markerDrop {
  0% {
    transform: translateY(-100px);
    opacity: 0;
  }
  60% {
    transform: translateY(10px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
  }
}
```

### Selected Marker Bounce

```css
@keyframes markerBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
```

### View Toggle Transition

```tsx
<motion.div
  layoutId="viewToggleBg"
  transition={{
    type: 'spring',
    stiffness: 500,
    damping: 30,
  }}
/>
```

## 📊 Performance Optimization

### Chunked Loading

```tsx
<MarkerClusterGroup chunkedLoading>
  {/* Loads markers in batches for better performance */}
</MarkerClusterGroup>
```

### Lazy Popup Content

```tsx
<Popup>
  <Suspense fallback={<div>Loading...</div>}>
    <StationDetails station={station} />
  </Suspense>
</Popup>
```

### Memoized Markers

```tsx
const memoizedMarkers = useMemo(
  () =>
    stations.map((station) => (
      <Marker key={station.id} position={[station.lat, station.lng]} />
    )),
  [stations]
);
```

### Viewport Culling

```tsx
// Only render markers within viewport
const visibleStations = stations.filter((station) =>
  map.getBounds().contains([station.latitude, station.longitude])
);
```

## 🐛 Troubleshooting

### Issue: Markers not appearing

**Solution:**

```tsx
// Fix default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
```

### Issue: Map not sizing correctly

**Solution:**

```tsx
// Ensure container has explicit height
<div style={{ height: '600px' }}>
  <MapContainer />
</div>

// Or use CSS
.map-container {
  height: 600px;
  width: 100%;
}
```

### Issue: Clusters not working

**Solution:**

```bash
# Install clustering library
npm install react-leaflet-cluster

# Import in component
import MarkerClusterGroup from 'react-leaflet-cluster';
```

### Issue: Full-screen z-index conflicts

**Solution:**

```css
.interactive-station-map.fullscreen {
  position: fixed !important;
  z-index: 9999;
  /* Ensure higher than other elements */
}
```

## 📈 Best Practices

1. **Always provide station coordinates**
   - Validate latitude/longitude
   - Filter out invalid coordinates
   - Handle missing data gracefully

2. **Optimize marker count**
   - Use clustering for 50+ markers
   - Consider viewport culling
   - Implement virtual scrolling for lists

3. **Handle errors gracefully**
   - Geolocation permission denied
   - Map tile loading failures
   - Network connectivity issues

4. **Test on real devices**
   - Touch interactions
   - Performance on mobile
   - Battery impact

5. **Provide fallbacks**
   - Static map for no JavaScript
   - List view for accessibility
   - Text directions for screen readers

## 🧪 Testing

### Unit Tests

```tsx
describe('InteractiveStationMap', () => {
  it('renders markers for all stations', () => {
    const { container } = render(
      <InteractiveStationMap stations={mockStations} />
    );
    expect(container.querySelectorAll('.marker-pin')).toHaveLength(
      mockStations.length
    );
  });

  it('calls onStationClick when marker is clicked', () => {
    const handleClick = jest.fn();
    const { getByLabelText } = render(
      <InteractiveStationMap
        stations={mockStations}
        onStationClick={handleClick}
      />
    );
    fireEvent.click(getByLabelText(mockStations[0].name));
    expect(handleClick).toHaveBeenCalledWith(mockStations[0]);
  });
});
```

### Integration Tests

```tsx
describe('ViewToggle Integration', () => {
  it('switches between map and list views', () => {
    render(<DirectoryPageNew />);

    // Start in grid view
    expect(screen.getByRole('grid')).toBeInTheDocument();

    // Switch to map
    fireEvent.click(screen.getByLabelText('Switch to map view'));
    expect(screen.getByRole('application')).toBeInTheDocument(); // map

    // Switch to list
    fireEvent.click(screen.getByLabelText('Switch to list view'));
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});
```

## 📚 Additional Resources

- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [React Leaflet Documentation](https://react-leaflet.js.org/)
- [React Leaflet Cluster](https://github.com/YUzhva/react-leaflet-cluster)
- [OpenStreetMap Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/)

## 🎯 Summary

The map view implementation provides:

- ✅ **Interactive Experience**: Clickable markers, popups, clustering
- ✅ **Responsive Design**: Works on all devices, full-screen support
- ✅ **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- ✅ **Performance**: Chunked loading, memoization, optimized rendering
- ✅ **Customization**: Easy to theme, extend, and modify
- ✅ **Production Ready**: Tested, documented, and deployed

---

**Version**: 1.0.0
**Last Updated**: October 23, 2025
**Status**: ✅ Production Ready
