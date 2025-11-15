# Map View - Quick Reference

## 🚀 Quick Start

### Basic Map

```tsx
import InteractiveStationMap from '@/components/InteractiveStationMap';

<InteractiveStationMap stations={stations} onStationClick={handleClick} />;
```

### With View Toggle

```tsx
import ViewToggle from '@/components/ViewToggle';

const [view, setView] = useState('grid');

<ViewToggle currentView={view} onViewChange={setView} />;
{
  view === 'map' && <InteractiveStationMap stations={stations} />;
}
```

## 📋 Props Reference

### InteractiveStationMap

| Prop               | Type          | Default  | Description               |
| ------------------ | ------------- | -------- | ------------------------- |
| `stations`         | Array         | required | Station data with lat/lng |
| `onStationClick`   | Function      | -        | Marker click handler      |
| `selectedStation`  | Object        | null     | Current selection         |
| `height`           | Number/String | 600      | Map height                |
| `center`           | [lat, lng]    | auto     | Initial center            |
| `zoom`             | Number        | 11       | Initial zoom              |
| `fullScreen`       | Boolean       | false    | Full-screen mode          |
| `showUserLocation` | Boolean       | true     | Show user marker          |

### ViewToggle

| Prop           | Type     | Default  | Description           |
| -------------- | -------- | -------- | --------------------- |
| `currentView`  | String   | required | 'list', 'grid', 'map' |
| `onViewChange` | Function | required | View change handler   |
| `showGrid`     | Boolean  | true     | Show grid option      |
| `size`         | String   | 'md'     | 'sm', 'md', 'lg'      |

## 🎨 Color Coding

```tsx
< $1.80  → 🟢 Green (#10B981)
$1.80-$2.00 → 🟠 Orange (#F59E0B)
> $2.00  → 🔴 Red (#EF4444)
No data  → ⚫ Gray (#6B7280)
```

## ⌨️ Keyboard Shortcuts

| Key     | Action       |
| ------- | ------------ |
| `←` `→` | Switch views |
| `Enter` | Select view  |
| `Esc`   | Close popup  |
| `+` `-` | Zoom map     |

## 📱 Responsive Features

- **Mobile**: Single column, compact controls
- **Tablet**: 2 columns, medium controls
- **Desktop**: 4 columns, full controls
- **Full-screen**: Overlay mode, exit button

## 🔧 Common Patterns

### Full-Screen Toggle

```tsx
const [isFullScreen, setIsFullScreen] = useState(false);

<button onClick={() => setIsFullScreen(!isFullScreen)}>
  {isFullScreen ? 'Exit' : 'Fullscreen'}
</button>

<InteractiveStationMap
  fullScreen={isFullScreen}
  onFullScreenToggle={() => setIsFullScreen(!isFullScreen)}
/>
```

### Selected Station Tracking

```tsx
const [selected, setSelected] = useState(null);

<InteractiveStationMap
  stations={stations}
  selectedStation={selected}
  onStationClick={setSelected}
/>;
```

### Custom Map Center

```tsx
<InteractiveStationMap
  center={[-37.8136, 144.9631]} // Melbourne
  zoom={12}
/>
```

## 🎯 Station Data Format

```typescript
{
  id: 1,
  name: "Shell Station",
  address: "123 Main St",
  city: "Melbourne",
  latitude: -37.8136,
  longitude: 144.9631,
  brand: "Shell",
  fuelPrices: [
    { fuelType: "Unleaded", price: 1.85 },
    { fuelType: "Diesel", price: 1.90 }
  ]
}
```

## 🐛 Troubleshooting

### Markers not showing?

```tsx
// Fix Leaflet icons
import 'leaflet/dist/leaflet.css';
```

### Map not sizing?

```css
.map-container {
  height: 600px !important;
}
```

### Clustering not working?

```bash
npm install react-leaflet-cluster
```

## 📊 Performance Tips

1. **Limit markers**: Use clustering for 50+ stations
2. **Memoize data**: Use `useMemo` for station processing
3. **Lazy load**: Load map component on demand
4. **Optimize images**: Compress marker icons
5. **Debounce updates**: Throttle real-time updates

## ✅ Checklist

- [ ] Import components
- [ ] Add station data
- [ ] Handle marker clicks
- [ ] Test on mobile
- [ ] Verify clustering
- [ ] Check accessibility
- [ ] Test keyboard nav
- [ ] Verify full-screen

## 🔗 Resources

- [Full Guide](./MAP_VIEW_IMPLEMENTATION_GUIDE.md)
- [Leaflet Docs](https://leafletjs.com)
- [React Leaflet](https://react-leaflet.js.org)

---

⭐ **Pro Tip**: Use `ViewToggle` for best UX, allowing users to choose their preferred view mode!
