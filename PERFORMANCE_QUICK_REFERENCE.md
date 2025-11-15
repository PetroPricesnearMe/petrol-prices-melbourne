# Performance Optimization - Quick Reference

Quick reference for React performance optimization techniques.

## 🚀 Quick Imports

```tsx
// Hooks
import {
  useDebounce,
  useRenderTime,
  useIntersectionObserver,
} from '@/hooks/usePerformance';
import { useVirtualization } from '@/hooks/useVirtualization';

// Components
import {
  ErrorBoundary,
  VirtualList,
  LazyLoad,
  LazyImage,
} from '@/components/common';

// Optimized Components
import { StationCardOptimized } from '@/components/organisms/StationCard/StationCard.optimized';
import { StationListVirtualized } from '@/components/organisms/StationList';

// Context
import {
  createOptimizedContext,
  shallowEqual,
} from '@/context/PerformanceContext';

// Utilities
import {
  measurePerformance,
  FPSMonitor,
  reportWebVitals,
} from '@/utils/performance';
```

## 🎯 Common Patterns

### 1. Optimize Re-renders with React.memo

```tsx
import { memo } from 'react';

const MyComponent = memo(({ data }) => {
  return <div>{data.name}</div>;
});

// With custom comparison
const MyComponent = memo(
  ({ data }) => <div>{data.name}</div>,
  (prev, next) => prev.data.id === next.data.id
);
```

### 2. Memoize Expensive Calculations

```tsx
import { useMemo } from 'react';

const filteredData = useMemo(() => {
  return data.filter((item) => item.active);
}, [data]);
```

### 3. Memoize Event Handlers

```tsx
import { useCallback } from 'react';

const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### 4. Debounce Input

```tsx
import { useDebounce } from '@/hooks/usePerformance';

const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 300);

useEffect(() => {
  search(debouncedQuery);
}, [debouncedQuery]);
```

### 5. Virtualize Large Lists

```tsx
import { VirtualList } from '@/components/common';

<VirtualList
  items={largeArray}
  itemHeight={100}
  height={600}
  renderItem={(item) => <ItemCard item={item} />}
  getItemKey={(item) => item.id}
/>;
```

### 6. Lazy Load Components

```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Spinner />}>
  <HeavyComponent />
</Suspense>;
```

### 7. Lazy Load Images

```tsx
import { LazyImage } from '@/components/common';

<LazyImage
  src="/large-image.jpg"
  alt="Description"
  placeholderSrc="/placeholder.jpg"
/>;
```

### 8. Add Error Boundaries

```tsx
import { ErrorBoundary } from '@/components/common';

<ErrorBoundary fallback={<ErrorPage />}>
  <YourComponent />
</ErrorBoundary>;
```

### 9. Optimize Context

```tsx
import { createOptimizedContext } from '@/context/PerformanceContext';

const MyContext = createOptimizedContext<MyState>();

// Provider
<MyContext.Provider initialState={initialState}>{children}</MyContext.Provider>;

// Consumer
const value = MyContext.useSelector((state) => state.value);
```

### 10. Monitor Performance

```tsx
import { useRenderTime } from '@/hooks/usePerformance';

function MyComponent() {
  useRenderTime('MyComponent'); // Warns if >16ms
  return <div>Content</div>;
}
```

## 📋 Checklist

Quick checklist for optimizing components:

- [ ] Wrap expensive components with `React.memo`
- [ ] Use `useMemo` for expensive calculations
- [ ] Use `useCallback` for memoized event handlers
- [ ] Use `VirtualList` for lists >100 items
- [ ] Lazy load routes and heavy components
- [ ] Add `ErrorBoundary` wrappers
- [ ] Debounce search inputs
- [ ] Use proper key props (not index)
- [ ] Split large contexts into smaller ones
- [ ] Monitor with `useRenderTime`

## ⚡ Performance Targets

- **FPS**: 60fps (16.67ms per frame)
- **TTI**: <3 seconds
- **LCP**: <2.5 seconds
- **FID**: <100ms
- **CLS**: <0.1

## 🔧 Debugging

### Find Slow Renders

```tsx
import { useWhyDidYouUpdate } from '@/hooks/usePerformance';

function MyComponent(props) {
  useWhyDidYouUpdate('MyComponent', props);
  return <div>...</div>;
}
```

### Monitor FPS

```tsx
import { FPSMonitor } from '@/utils/performance';

const monitor = new FPSMonitor((fps) => {
  if (fps < 30) console.warn('Low FPS!');
});
monitor.start();
```

### Track Web Vitals

```tsx
import { reportWebVitals } from '@/utils/performance';

reportWebVitals((vitals) => {
  console.log('Vitals:', vitals);
});
```

## 🚫 Common Mistakes

### ❌ Don't Do This

```tsx
// Using index as key
{items.map((item, i) => <Item key={i} />)}

// Creating objects in render
<Component style={{ margin: 10 }} />

// Inline callbacks without useCallback
<Button onClick={() => doSomething()} />

// Everything in one context
<AppContext.Provider value={{ user, theme, data, settings }}>
```

### ✅ Do This Instead

```tsx
// Use stable IDs as keys
{items.map(item => <Item key={item.id} />)}

// Define styles outside or use CSS
const buttonStyle = { margin: 10 };
<Component style={buttonStyle} />

// Memoize callbacks
const handleClick = useCallback(() => doSomething(), []);
<Button onClick={handleClick} />

// Split contexts
<UserContext.Provider>
  <ThemeContext.Provider>
    <DataContext.Provider>
```

## 📚 Resources

- Full Guide: `PERFORMANCE_OPTIMIZATION_GUIDE.md`
- Implementation: `PERFORMANCE_IMPLEMENTATION_SUMMARY.md`
- Component Architecture: `COMPONENT_ARCHITECTURE.md`

## 🎓 Learn More

- [React Performance Docs](https://react.dev/reference/react/memo)
- [Web Vitals](https://web.dev/vitals/)
- [React DevTools Profiler](https://react.dev/reference/react/Profiler)

---

**Remember**: Profile first, optimize second! 🎯
