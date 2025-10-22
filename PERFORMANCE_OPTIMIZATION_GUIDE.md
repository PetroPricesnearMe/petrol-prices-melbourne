# React Performance Optimization Guide

## Overview

This guide covers advanced performance optimization techniques implemented in the component architecture to maintain 60fps and minimize Time to Interactive (TTI).

## Table of Contents

1. [React.memo and Memoization](#reactmemo-and-memoization)
2. [useMemo and useCallback](#usememo-and-usecallback)
3. [Virtualization](#virtualization)
4. [Lazy Loading](#lazy-loading)
5. [Context Optimization](#context-optimization)
6. [Error Boundaries](#error-boundaries)
7. [Performance Monitoring](#performance-monitoring)
8. [Best Practices](#best-practices)

---

## React.memo and Memoization

### What is React.memo?

`React.memo` is a higher-order component that memoizes a component, preventing unnecessary re-renders when props haven't changed.

### Basic Usage

```tsx
import { memo } from 'react';

const MyComponent = memo(({ data }) => {
  return <div>{data}</div>;
});
```

### Custom Comparison Function

```tsx
const StationCard = memo(
  ({ station }) => {
    return <Card>{station.name}</Card>;
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return (
      prevProps.station.id === nextProps.station.id &&
      prevProps.station.name === nextProps.station.name
    );
  }
);
```

### Example: Optimized StationCard

```tsx
// src/components/organisms/StationCard/StationCard.optimized.tsx
import { memo, useMemo, useCallback } from 'react';

const StationCardOptimized = memo(
  ({ station, onClick }) => {
    // Memoize formatted address
    const formattedAddress = useMemo(
      () => `${station.address}, ${station.city}`,
      [station.address, station.city]
    );

    // Memoize click handler
    const handleClick = useCallback(() => {
      onClick?.(station.id);
    }, [onClick, station.id]);

    return (
      <Card onClick={handleClick}>
        <h3>{station.name}</h3>
        <p>{formattedAddress}</p>
      </Card>
    );
  },
  // Custom comparison
  (prev, next) => prev.station.id === next.station.id
);
```

---

## useMemo and useCallback

### useMemo - Memoize Expensive Calculations

```tsx
import { useMemo } from 'react';

function StationList({ stations, filters }) {
  // Expensive filtering operation
  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      if (filters.fuelType && station.fuelType !== filters.fuelType) {
        return false;
      }
      if (filters.maxDistance && station.distance > filters.maxDistance) {
        return false;
      }
      return true;
    });
  }, [stations, filters]);

  return (
    <div>
      {filteredStations.map(station => (
        <StationCard key={station.id} station={station} />
      ))}
    </div>
  );
}
```

### useCallback - Memoize Functions

```tsx
import { useCallback } from 'react';

function StationSearch({ onSearch }) {
  const [query, setQuery] = useState('');

  // Memoize handler to prevent child re-renders
  const handleSearch = useCallback(() => {
    onSearch(query);
  }, [query, onSearch]);

  return (
    <SearchBar value={query} onChange={setQuery} onSubmit={handleSearch} />
  );
}
```

### When to Use

**Use useMemo for:**
- Expensive calculations
- Filtered/sorted arrays
- Complex object transformations
- Derived state

**Use useCallback for:**
- Event handlers passed to memoized components
- Functions passed to dependency arrays
- Functions used in useEffect

**Don't overuse:**
- Simple calculations (premature optimization)
- Primitives (strings, numbers, booleans)
- Every single function

---

## Virtualization

### Why Virtualization?

Rendering thousands of DOM elements hurts performance. Virtualization only renders visible items + buffer.

### Basic Virtual List

```tsx
import { useVirtualization } from '@/hooks/useVirtualization';

function StationList({ stations }) {
  const { virtualItems, totalHeight, containerRef } = useVirtualization({
    itemCount: stations.length,
    itemHeight: 200,
    containerHeight: 600,
    overscan: 3, // Render 3 items outside viewport
  });

  return (
    <div ref={containerRef} style={{ height: 600, overflow: 'auto' }}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        {virtualItems.map(virtualItem => {
          const station = stations[virtualItem.index];
          return (
            <div
              key={station.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: virtualItem.size,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <StationCard station={station} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Using VirtualList Component

```tsx
import { VirtualList } from '@/components/common/VirtualList';

function StationListVirtualized({ stations }) {
  return (
    <VirtualList
      items={stations}
      itemHeight={200}
      height={600}
      renderItem={(station) => <StationCard station={station} />}
      getItemKey={(station) => station.id}
    />
  );
}
```

### Performance Benefits

- **Before**: 10,000 stations = 10,000 DOM elements = 🐌 slow
- **After**: 10,000 stations = ~20 visible elements = ⚡ fast

---

## Lazy Loading

### Component Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const StationMap = lazy(() => import('./StationMap'));
const StationDetails = lazy(() => import('./StationDetails'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <StationMap />
      <StationDetails />
    </Suspense>
  );
}
```

### Route-Based Code Splitting

```tsx
import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage'));
const StationsPage = lazy(() => import('./pages/StationsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stations" element={<StationsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Intersection Observer Lazy Loading

```tsx
import { LazyLoad } from '@/components/common/LazyLoad';

function StationGrid({ stations }) {
  return (
    <div>
      {stations.map(station => (
        <LazyLoad key={station.id} rootMargin="100px" height={200}>
          <StationCard station={station} />
        </LazyLoad>
      ))}
    </div>
  );
}
```

### Lazy Image Loading

```tsx
import { LazyImage } from '@/components/common/LazyLoad';

function StationImage({ src, alt }) {
  return (
    <LazyImage
      src={src}
      alt={alt}
      placeholderSrc="/placeholder.jpg"
      rootMargin="50px"
    />
  );
}
```

---

## Context Optimization

### Problem: Context Re-renders

```tsx
// BAD: All consumers re-render when any value changes
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [stations, setStations] = useState([]);

  const value = { user, setUser, theme, setTheme, stations, setStations };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

### Solution 1: Split Contexts

```tsx
// GOOD: Separate concerns
const UserContext = createContext();
const ThemeContext = createContext();
const StationContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [stations, setStations] = useState([]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <StationContext.Provider value={{ stations, setStations }}>
          {children}
        </StationContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}
```

### Solution 2: Selector Pattern

```tsx
import { createOptimizedContext } from '@/context/PerformanceContext';

// Create optimized context
const StationContext = createOptimizedContext<StationState>();

// Provider
function StationProvider({ children }) {
  return (
    <StationContext.Provider
      initialState={{
        stations: [],
        selectedId: null,
        loading: false,
      }}
    >
      {children}
    </StationContext.Provider>
  );
}

// Consumers - only re-render when selected data changes
function StationList() {
  const stations = StationContext.useSelector(state => state.stations);
  // Only re-renders when stations array changes
}

function SelectedStation() {
  const selectedId = StationContext.useSelector(state => state.selectedId);
  // Only re-renders when selectedId changes
}
```

### Solution 3: useMemo for Context Value

```tsx
function AppProvider({ children }) {
  const [state, setState] = useState(initialState);

  // Memoize context value
  const value = useMemo(
    () => ({
      state,
      setState,
    }),
    [state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
```

---

## Error Boundaries

### Basic Error Boundary

```tsx
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

### Custom Fallback

```tsx
<ErrorBoundary
  fallback={(error, errorInfo) => (
    <div>
      <h1>Oops! Something went wrong</h1>
      <details>
        <summary>Error details</summary>
        <pre>{error.toString()}</pre>
      </details>
    </div>
  )}
  onError={(error, errorInfo) => {
    // Log to error tracking service
    console.error('Error:', error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### HOC Pattern

```tsx
import { withErrorBoundary } from '@/components/common/ErrorBoundary';

const SafeComponent = withErrorBoundary(MyComponent, {
  fallback: <div>Error loading component</div>,
  onError: (error) => console.error(error),
});
```

### Multiple Error Boundaries

```tsx
function App() {
  return (
    <ErrorBoundary fallback={<PageError />}>
      <Layout>
        <ErrorBoundary fallback={<SidebarError />}>
          <Sidebar />
        </ErrorBoundary>

        <ErrorBoundary fallback={<ContentError />}>
          <Content />
        </ErrorBoundary>
      </Layout>
    </ErrorBoundary>
  );
}
```

---

## Performance Monitoring

### Render Time Monitoring

```tsx
import { useRenderTime } from '@/hooks/usePerformance';

function StationCard({ station }) {
  useRenderTime('StationCard');

  return <Card>{station.name}</Card>;
}
```

### Why Did You Update

```tsx
import { useWhyDidYouUpdate } from '@/hooks/usePerformance';

function StationCard(props) {
  useWhyDidYouUpdate('StationCard', props);

  return <Card>{props.station.name}</Card>;
}
```

### FPS Monitoring

```tsx
import { FPSMonitor } from '@/utils/performance';

// In your app initialization
const fpsMonitor = new FPSMonitor((fps) => {
  console.log(`Current FPS: ${fps}`);

  if (fps < 30) {
    console.warn('Low FPS detected!');
  }
});

fpsMonitor.start();

// Clean up
// fpsMonitor.stop();
```

### Web Vitals

```tsx
import { reportWebVitals } from '@/utils/performance';

reportWebVitals((vitals) => {
  console.log('Web Vitals:', vitals);

  // Report to analytics
  if (vitals.LCP > 2500) {
    console.warn('Poor LCP:', vitals.LCP);
  }
});
```

### React DevTools Profiler

```tsx
import { Profiler } from 'react';

function onRenderCallback(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <YourApp />
    </Profiler>
  );
}
```

---

## Best Practices

### 1. Proper Key Props

```tsx
// BAD: Using index as key
{items.map((item, index) => (
  <Item key={index} data={item} />
))}

// GOOD: Using stable unique ID
{items.map(item => (
  <Item key={item.id} data={item} />
))}
```

### 2. Optimize State Structure

```tsx
// BAD: Nested state causes full re-renders
const [state, setState] = useState({
  user: { name: '', email: '' },
  stations: [],
  filters: { fuelType: '', maxDistance: 0 },
});

// GOOD: Split into logical pieces
const [user, setUser] = useState({ name: '', email: '' });
const [stations, setStations] = useState([]);
const [filters, setFilters] = useState({ fuelType: '', maxDistance: 0 });
```

### 3. Debounce Expensive Operations

```tsx
import { useDebounce } from '@/hooks/usePerformance';

function SearchBar() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    // Only runs after 300ms of no typing
    searchStations(debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### 4. Batch State Updates

```tsx
// BAD: Multiple renders
function updateMultiple() {
  setUser(newUser);
  setStations(newStations);
  setFilters(newFilters);
}

// GOOD: Single render (React 18 automatic batching)
function updateMultiple() {
  startTransition(() => {
    setUser(newUser);
    setStations(newStations);
    setFilters(newFilters);
  });
}
```

### 5. Use React.lazy for Route Splitting

```tsx
const routes = [
  {
    path: '/',
    component: lazy(() => import('./pages/Home')),
  },
  {
    path: '/stations',
    component: lazy(() => import('./pages/Stations')),
  },
];
```

### 6. Measure Performance

```tsx
import { measurePerformance } from '@/utils/performance';

const expensiveFunction = measurePerformance(
  (data) => {
    // Expensive operation
    return processData(data);
  },
  'processData'
);
```

### 7. Use Web Workers for Heavy Computations

```tsx
// worker.ts
self.onmessage = (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
};

// Component
function Component() {
  useEffect(() => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url));

    worker.postMessage(data);

    worker.onmessage = (e) => {
      setResult(e.data);
    };

    return () => worker.terminate();
  }, [data]);
}
```

---

## Performance Checklist

- [ ] Use React.memo for expensive components
- [ ] Implement useMemo for expensive calculations
- [ ] Use useCallback for memoized event handlers
- [ ] Implement virtualization for long lists (>100 items)
- [ ] Lazy load routes and heavy components
- [ ] Split context to prevent unnecessary re-renders
- [ ] Add error boundaries at appropriate levels
- [ ] Use proper key props (not index)
- [ ] Debounce/throttle expensive operations
- [ ] Monitor performance with React DevTools Profiler
- [ ] Track Web Vitals
- [ ] Optimize images (lazy loading, proper formats)
- [ ] Code split at route level
- [ ] Avoid inline object/array creation in render
- [ ] Use CSS for animations (not JS when possible)

---

## Performance Targets

- **FPS**: Maintain 60fps (16.67ms per frame)
- **TTI**: < 3.8s on 3G mobile
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Bundle Size**: < 200KB (gzipped)
- **Initial Load**: < 1s

---

## Resources

- [React Performance Docs](https://react.dev/reference/react/memo)
- [Web Vitals](https://web.dev/vitals/)
- [React DevTools Profiler](https://react.dev/reference/react/Profiler)
- [Performance Hooks](/src/hooks/usePerformance.ts)
- [Virtualization Hook](/src/hooks/useVirtualization.ts)

---

**Remember**: Profile first, optimize second. Don't optimize prematurely!
