# Infinite Scroll Quick Reference

## 🚀 Quick Start

### Basic Usage

```typescript
import { InfiniteScrollDirectory } from '@/components/directory/InfiniteScrollDirectory';

export default function DirectoryPage() {
  return <InfiniteScrollDirectory />;
}
```

### Custom Filters

```typescript
<InfiniteScrollDirectory
  initialFilters={{
    brand: 'BP',
    fuelType: 'unleaded',
    sortBy: 'price-low',
    search: 'Melbourne',
  }}
/>
```

## 🎣 Hooks Reference

### `useInfiniteStations`

```typescript
const {
  data: stations, // Array of stations
  isLoading, // Initial loading state
  isError, // Error state
  error, // Error object
  hasNextPage, // More pages available
  isFetchingNextPage, // Loading more pages
  fetchNextPage, // Function to load next page
  refetch, // Function to refetch data
  totalCount, // Total number of stations
  loadedPages, // Number of loaded pages
} = useInfiniteStations(filters, options);
```

### `useAdvancedInfiniteStations`

```typescript
const {
  // All useInfiniteStations properties
  ...infiniteQuery,

  // Additional features
  isTransitioning, // Transition state
  transitionDirection, // 'up' | 'down'
  triggerRef, // Intersection observer ref
} = useAdvancedInfiniteStations(filters, options);
```

## 🎨 Components Reference

### `StationCard`

```typescript
<StationCard
  station={station}
  index={0}
  showTransition={true}
  transitionDelay={0.1}
  onCardClick={(station) => console.log(station)}
/>
```

### `StationGrid`

```typescript
<StationGrid
  stations={stations}
  showTransitions={true}
  onCardClick={handleClick}
/>
```

### `SmoothTransition`

```typescript
<SmoothTransition
  direction="up"
  duration={0.3}
  delay={0.1}
>
  <StationCard station={station} />
</SmoothTransition>
```

## ⚙️ Configuration Options

### Filters

```typescript
interface InfiniteStationsFilters {
  search?: string; // Search query
  fuelType?: 'unleaded' | 'diesel' | 'premium95' | 'premium98' | 'lpg';
  brand?: string; // Brand filter
  suburb?: string; // Suburb filter
  sortBy?: 'price-low' | 'price-high' | 'name' | 'suburb';
  priceMax?: number; // Maximum price filter
}
```

### Options

```typescript
interface InfiniteStationsOptions {
  pageSize?: number; // Items per page (default: 24)
  enabled?: boolean; // Enable/disable query
  staleTime?: number; // Stale time in ms (default: 5min)
  gcTime?: number; // Garbage collection time (default: 10min)
}
```

## 🎯 Performance Tips

### 1. Optimize Page Size

```typescript
// Good for mobile
const options = { pageSize: 12 };

// Good for desktop
const options = { pageSize: 24 };

// Good for large screens
const options = { pageSize: 48 };
```

### 2. Enable Memory Management

```typescript
const { optimizeData } = usePerformanceOptimization({
  enableMemoryManagement: true,
  maxItems: 1000,
  cleanupThreshold: 500,
});
```

### 3. Use Debounced Search

```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

const filters = {
  search: debouncedSearch,
  // ... other filters
};
```

## 🐛 Common Issues & Solutions

### Issue: Memory Leaks

**Solution**: Enable memory management

```typescript
const { cleanupMemory } = usePerformanceOptimization({
  enableMemoryManagement: true,
});
```

### Issue: Slow Rendering

**Solution**: Reduce page size

```typescript
const options = { pageSize: 12 };
```

### Issue: Infinite Loading

**Solution**: Check error handling

```typescript
if (isError) {
  return <ErrorComponent onRetry={refetch} />;
}
```

### Issue: Animation Issues

**Solution**: Check CSS imports

```typescript
import '../styles/brand-colors.css';
```

## 📊 Performance Metrics

### Target Values

- **Memory Usage**: < 50MB for 1000 items
- **Render Time**: < 16ms per frame
- **Page Load**: < 2.5s
- **Scroll Performance**: 60fps

### Monitoring

```typescript
const { metrics } = usePerformanceOptimization();

console.log({
  memoryUsage: metrics.memoryUsage,
  renderTime: metrics.renderTime,
  itemCount: metrics.itemCount,
  isOptimized: metrics.isOptimized,
});
```

## 🎨 Styling

### Brand Colors

Brand colors are automatically applied via CSS data attributes:

```css
[data-brand-color='#00A651'] {
  background: linear-gradient(
    135deg,
    rgba(0, 166, 81, 0.08) 0%,
    rgba(0, 166, 81, 0.03) 100%
  );
}
```

### Custom Transitions

```typescript
// Custom transition timing
<SmoothTransition duration={0.5} delay={0.2}>
  <StationCard station={station} />
</SmoothTransition>

// Staggered transitions
<StaggeredTransition staggerDelay={0.1}>
  {stations.map(station => (
    <StationCard key={station.id} station={station} />
  ))}
</StaggeredTransition>
```

## 🔧 Development Tools

### React Query DevTools

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function App() {
  return (
    <>
      <InfiniteScrollDirectory />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

### Performance Monitoring

```typescript
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

export function DevTools() {
  const { metrics } = usePerformanceOptimization();

  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs">
        <div>Memory: {metrics.memoryUsage.toFixed(1)}%</div>
        <div>Render: {metrics.renderTime.toFixed(1)}ms</div>
        <div>Items: {metrics.itemCount}</div>
      </div>
    );
  }

  return null;
}
```

## 📚 Additional Resources

- [Full Implementation Guide](./INFINITE_SCROLL_IMPLEMENTATION.md)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [Performance Best Practices](https://web.dev/performance/)

---

**Quick Reference Version**: 1.0.0  
**Last Updated**: December 2024
