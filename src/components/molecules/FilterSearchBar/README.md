# FilterSearchBar Component

A fully functional filter and search bar component with debounced search, filter dropdowns, URL synchronization, sticky positioning, glassmorphism styling, and full accessibility support.

## Features

- ✅ **Debounced Search Input**: Text input with debounced search logic for optimal performance
- ✅ **Filter Dropdowns**: Three dropdown menus for Fuel Type, Distance, and Rating
- ✅ **Reset Button**: Clears all filters and search input
- ✅ **URL Query Parameters**: Automatic synchronization with URL for deep linking and bookmarking
- ✅ **Sticky Positioning**: Remains fixed at the top of the viewport on scroll
- ✅ **Glassmorphism Styling**: Modern glassmorphism effect using Tailwind CSS
- ✅ **Fully Responsive**: Adapts to all screen sizes and orientations
- ✅ **Accessibility**: ARIA attributes, keyboard navigation, and screen reader support

## Installation

The component is already included in the project. Import it as follows:

```tsx
import { FilterSearchBar } from '@/components/molecules/FilterSearchBar';
```

## Basic Usage

```tsx
'use client';

import { FilterSearchBar } from '@/components/molecules/FilterSearchBar';

export default function MyPage() {
  const handleFiltersChange = (filters) => {
    console.log('Filters changed:', filters);
    // Update your data fetching logic here
  };

  const handleSearchChange = (search) => {
    console.log('Search changed:', search);
    // Handle debounced search
  };

  return (
    <div>
      <FilterSearchBar
        onFiltersChange={handleFiltersChange}
        onSearchChange={handleSearchChange}
        syncWithUrl={true}
      />
      {/* Your content here */}
    </div>
  );
}
```

## Props

### FilterSearchBarProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialSearch` | `string` | `''` | Initial search value |
| `initialFuelType` | `FuelType` | `'all'` | Initial fuel type filter |
| `initialDistance` | `DistanceOption` | `'all'` | Initial distance filter |
| `initialRating` | `RatingOption` | `'all'` | Initial rating filter |
| `onFiltersChange` | `(filters: FilterSearchBarState) => void` | - | Callback when any filter changes |
| `onSearchChange` | `(search: string) => void` | - | Callback when search value changes (debounced) |
| `searchPlaceholder` | `string` | `'Search stations, locations...'` | Placeholder text for search input |
| `debounceDelay` | `number` | `300` | Debounce delay in milliseconds |
| `syncWithUrl` | `boolean` | `true` | Sync filters with URL query parameters |
| `className` | `string` | - | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disable all filters |
| `showResetButton` | `boolean` | `true` | Show reset button |
| `fuelTypeOptions` | `Array<{value, label, icon?}>` | Default options | Custom fuel type options |
| `distanceOptions` | `Array<{value, label}>` | Default options | Custom distance options |
| `ratingOptions` | `Array<{value, label, icon?}>` | Default options | Custom rating options |

## Filter State

The component manages the following filter state:

```tsx
interface FilterSearchBarState {
  search: string;           // Search query
  fuelType: FuelType;       // Selected fuel type
  distance: DistanceOption; // Selected distance range
  rating: RatingOption;     // Selected minimum rating
}
```

## URL Query Parameters

When `syncWithUrl={true}`, the component automatically syncs with URL query parameters:

- `?search=query` - Search query
- `?fuelType=unleaded` - Fuel type filter
- `?distance=10` - Distance filter (in miles)
- `?rating=4` - Minimum rating filter

Example URL: `/stations?search=shell&fuelType=diesel&distance=10&rating=4`

## Customization

### Custom Filter Options

```tsx
const customFuelOptions = [
  { value: 'all', label: 'All Types', icon: '⛽' },
  { value: 'unleaded', label: 'Unleaded', icon: '🛢️' },
  // ... more options
];

<FilterSearchBar
  fuelTypeOptions={customFuelOptions}
  // ... other props
/>
```

### Styling

The component uses Tailwind CSS with glassmorphism effects. You can override styles using the `className` prop:

```tsx
<FilterSearchBar
  className="custom-class"
  // ... other props
/>
```

## Accessibility

The component includes:

- ✅ ARIA labels and roles
- ✅ Keyboard navigation (Arrow keys, Enter, Escape)
- ✅ Focus management
- ✅ Screen reader support
- ✅ Touch-friendly targets (min 44px height)

### Keyboard Navigation

- **Tab**: Navigate between controls
- **Enter/Space**: Open/close dropdowns
- **Arrow Up/Down**: Navigate dropdown options
- **Escape**: Close dropdowns
- **Click outside**: Close dropdowns

## Performance

- **Debounced Search**: Reduces API calls and re-renders
- **Optimized Re-renders**: Uses React hooks for efficient updates
- **URL Sync**: Updates URL without page reload using Next.js router

## Examples

### With URL Synchronization

```tsx
<FilterSearchBar
  syncWithUrl={true}
  onFiltersChange={(filters) => {
    // Filters are automatically synced with URL
    fetchData(filters);
  }}
/>
```

### Without URL Synchronization

```tsx
<FilterSearchBar
  syncWithUrl={false}
  initialSearch="Shell"
  initialFuelType="diesel"
  onFiltersChange={(filters) => {
    // Handle filters manually
  }}
/>
```

### Custom Debounce Delay

```tsx
<FilterSearchBar
  debounceDelay={500} // 500ms delay
  onSearchChange={(search) => {
    // Called after 500ms of no typing
  }}
/>
```

## Integration with Data Fetching

```tsx
'use client';

import { useState, useEffect } from 'react';
import { FilterSearchBar } from '@/components/molecules/FilterSearchBar';
import type { FilterSearchBarState } from '@/components/molecules/FilterSearchBar';

export default function StationsPage() {
  const [filters, setFilters] = useState<FilterSearchBarState>({
    search: '',
    fuelType: 'all',
    distance: 'all',
    rating: 'all',
  });
  const [stations, setStations] = useState([]);

  useEffect(() => {
    // Fetch stations based on filters
    fetchStations(filters).then(setStations);
  }, [filters]);

  return (
    <>
      <FilterSearchBar
        onFiltersChange={setFilters}
        syncWithUrl={true}
      />
      <div>
        {stations.map(station => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>
    </>
  );
}
```

## Component Structure

```
FilterSearchBar/
├── FilterSearchBar.tsx      # Main component
├── FilterDropdown.tsx        # Reusable dropdown component
├── FilterSearchBar.types.ts  # TypeScript types
├── index.ts                  # Exports
└── README.md                 # This file
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- `next/navigation` - For URL synchronization
- `framer-motion` - For animations
- `@/hooks/usePerformance` - For debounce hook
- `@/utils/cn` - For className merging

## License

Part of the PPNM project.

