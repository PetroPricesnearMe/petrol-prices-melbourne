# Pagination & Responsive Grid Implementation Guide

## Overview

This guide documents the implementation of a fully accessible, animated pagination system with a responsive fluid grid layout for the Petrol Price Near Me application.

## 📋 Table of Contents

- [Features](#features)
- [Components](#components)
- [Implementation Details](#implementation-details)
- [Usage Examples](#usage-examples)
- [Accessibility Features](#accessibility-features)
- [Customization](#customization)
- [Best Practices](#best-practices)

## ✨ Features

### Pagination Component

- ✅ **ARIA Accessibility**: Full WCAG 2.1 AA compliance
- ✅ **Keyboard Navigation**: Arrow keys, Home, End support
- ✅ **Smooth Animations**: Fade and slide transitions
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Customizable**: Size variants and appearance options
- ✅ **Smart Page Range**: Intelligent ellipsis for many pages
- ✅ **First/Last Navigation**: Optional quick navigation buttons
- ✅ **Items Info Display**: Shows current range of items
- ✅ **Auto Scroll**: Optional scroll to top on page change

### Responsive Grid

- ✅ **Fluid Columns**: 1/2/3/4 column responsive breakpoints
- ✅ **Consistent Gap Spacing**: Tailwind gap utilities
- ✅ **Uniform Card Heights**: `auto-rows-fr` for equal heights
- ✅ **Vertical Rhythm**: Proper spacing throughout
- ✅ **Animated Transitions**: Smooth page changes
- ✅ **Loading States**: Built-in loading indicators
- ✅ **Empty States**: Customizable empty state display

## 🧩 Components

### 1. Pagination Component

**Location**: `src/components/common/Pagination.tsx`

A reusable, fully-featured pagination component supporting both client-side and server-side pagination.

#### Props

```typescript
interface PaginationProps {
  currentPage: number;           // Current active page (1-indexed)
  totalPages: number;            // Total number of pages
  onPageChange: (page: number) => void;  // Page change callback
  siblingCount?: number;         // Page buttons on each side (default: 1)
  showFirstLast?: boolean;       // Show first/last buttons (default: true)
  showPrevNext?: boolean;        // Show prev/next buttons (default: true)
  disabled?: boolean;            // Disable pagination (default: false)
  className?: string;            // Custom class name
  size?: 'sm' | 'md' | 'lg';    // Size variant (default: 'md')
  animationType?: 'fade' | 'slide' | 'none';  // Animation type
  totalItems?: number;           // Total items count (for display)
  itemsPerPage?: number;         // Items per page (for display)
  showItemsInfo?: boolean;       // Show items info (default: true)
  scrollToTop?: boolean;         // Scroll to top on change (default: true)
  scrollBehavior?: ScrollBehavior;  // Scroll behavior (default: 'smooth')
}
```

#### Basic Usage

```tsx
import Pagination from '@/components/common/Pagination';

function MyComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  );
}
```

#### Advanced Usage

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  totalItems={filteredItems.length}
  itemsPerPage={12}
  showItemsInfo={true}
  scrollToTop={true}
  size="lg"
  animationType="slide"
  siblingCount={2}
  showFirstLast={true}
  showPrevNext={true}
/>
```

### 2. PaginatedGrid Component

**Location**: `src/components/common/PaginatedGrid.tsx`

A responsive grid component with built-in pagination and animations.

#### Props

```typescript
interface PaginatedGridProps<T = any> {
  items: T[];                    // Array of items to display
  renderItem: (item: T, index: number) => ReactNode;  // Render function
  itemsPerPage?: number;         // Items per page (default: 12)
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  columns?: {                    // Responsive column configuration
    base?: 1 | 2 | 3 | 4;
    sm?: 1 | 2 | 3 | 4;
    md?: 1 | 2 | 3 | 4;
    lg?: 1 | 2 | 3 | 4;
    xl?: 1 | 2 | 3 | 4;
    '2xl'?: 1 | 2 | 3 | 4;
  };
  gridClassName?: string;        // Custom grid class
  containerClassName?: string;   // Container class
  loading?: boolean;             // Loading state
  emptyState?: ReactNode;        // Empty state component
  loadingState?: ReactNode;      // Loading state component
  paginationPosition?: 'top' | 'bottom' | 'both';
  animationType?: 'fade' | 'slide' | 'scale' | 'none';
  staggerChildren?: boolean;     // Stagger animations (default: true)
  keyboardNav?: boolean;         // Keyboard navigation (default: true)
  scrollToTop?: boolean;         // Scroll to top (default: true)
  showItemsInfo?: boolean;       // Show items info (default: true)
  paginationSize?: 'sm' | 'md' | 'lg';
}
```

#### Basic Usage

```tsx
import { PaginatedGrid } from '@/components/common/PaginatedGrid';

function StationList({ stations }) {
  return (
    <PaginatedGrid
      items={stations}
      renderItem={(station) => (
        <StationCard station={station} />
      )}
    />
  );
}
```

#### Advanced Usage

```tsx
<PaginatedGrid
  items={filteredStations}
  renderItem={(station, index) => (
    <StationCard
      key={station.id}
      station={station}
      onClick={() => handleStationClick(station)}
    />
  )}
  itemsPerPage={16}
  gap="lg"
  columns={{
    base: 1,
    sm: 2,
    lg: 3,
    xl: 4,
    '2xl': 5
  }}
  loading={isLoading}
  emptyState={<NoStationsFound />}
  paginationPosition="both"
  animationType="slide"
  staggerChildren={true}
  showItemsInfo={true}
  paginationSize="md"
/>
```

## 🎨 Implementation Details

### Responsive Grid System

The grid system uses Tailwind CSS responsive utilities to create a fluid layout:

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
  {/* Cards with h-full for uniform heights */}
  <div className="h-full flex flex-col">
    {/* Card content */}
  </div>
</div>
```

#### Breakpoints

| Breakpoint | Columns | Screen Size |
|------------|---------|-------------|
| base       | 1       | < 640px     |
| sm         | 2       | ≥ 640px     |
| lg         | 3       | ≥ 1024px    |
| xl         | 4       | ≥ 1280px    |

#### Gap Spacing

Consistent gap spacing using Tailwind's gap utilities:

- `gap-2`: 0.5rem (8px) - Extra small
- `gap-4`: 1rem (16px) - Small
- `gap-6`: 1.5rem (24px) - Medium (recommended)
- `gap-8`: 2rem (32px) - Large
- `gap-10`: 2.5rem (40px) - Extra large
- `gap-12`: 3rem (48px) - 2X large

### Uniform Card Heights

To ensure all cards have the same height:

1. **Grid container**: Uses `auto-rows-fr` to create equal-height rows
2. **Card wrapper**: Uses `h-full` to fill the grid cell height
3. **Card content**: Uses `flex flex-col` with `flex-1` for proper spacing

```jsx
<div className="station-card h-full flex flex-col">
  <div className="station-image-header">
    {/* Image */}
  </div>
  <div className="station-content flex-1 flex flex-col">
    <div className="flex-1">
      {/* Main content */}
    </div>
    <div className="mt-4">
      {/* Footer content */}
    </div>
  </div>
</div>
```

### Animation System

The pagination system supports multiple animation types:

#### Fade Animation

```typescript
const fadeAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};
```

#### Slide Animation

```typescript
const slideAnimation = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 }
};
```

#### Scale Animation

```typescript
const scaleAnimation = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.3 }
};
```

### Page Range Algorithm

The pagination component uses an intelligent algorithm to display page numbers with ellipsis:

```typescript
const generatePageRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | 'ellipsis')[] => {
  // Always show: first page, last page, current page, and siblings
  // Use ellipsis for gaps

  // Example with siblingCount=1:
  // [1] ... [5] [6] [7] ... [20]
  //          ^siblings  ^current
};
```

## ♿ Accessibility Features

### ARIA Labels

All interactive elements have proper ARIA labels:

```tsx
<button
  aria-label="Go to page 5"
  aria-current={isActive ? 'page' : undefined}
  aria-disabled={disabled}
>
  5
</button>
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `←` (Left Arrow) | Previous page |
| `→` (Right Arrow) | Next page |
| `Home` | First page |
| `End` | Last page |
| `Tab` | Navigate between buttons |
| `Enter/Space` | Activate button |

### Screen Reader Support

- Live regions for page changes: `aria-live="polite"`
- Atomic updates: `aria-atomic="true"`
- Navigation role: `role="navigation"`
- Status updates: `role="status"`

```tsx
<div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
  Page {currentPage} of {totalPages}
</div>
```

### Focus Management

- Visible focus indicators: `focus:ring-2 focus:ring-primary-500`
- Focus offset: `focus:ring-offset-2`
- Skip to content links
- Keyboard trap prevention

## 🎨 Customization

### Size Variants

```tsx
// Small
<Pagination size="sm" {...props} />

// Medium (default)
<Pagination size="md" {...props} />

// Large
<Pagination size="lg" {...props} />
```

### Custom Styling

```tsx
<Pagination
  className="my-custom-pagination"
  {...props}
/>
```

### Disable Features

```tsx
<Pagination
  showFirstLast={false}
  showPrevNext={false}
  showItemsInfo={false}
  scrollToTop={false}
  {...props}
/>
```

### Custom Gap Spacing

```tsx
<PaginatedGrid
  gap="xl"  // or 'none', 'xs', 'sm', 'md', 'lg', '2xl'
  {...props}
/>
```

### Custom Column Configuration

```tsx
<PaginatedGrid
  columns={{
    base: 1,    // Mobile: 1 column
    sm: 2,      // Tablet: 2 columns
    md: 3,      // Small desktop: 3 columns
    lg: 4,      // Desktop: 4 columns
    xl: 5,      // Large desktop: 5 columns
    '2xl': 6    // Extra large: 6 columns
  }}
  {...props}
/>
```

## 📚 Usage Examples

### Example 1: Basic Pagination

```tsx
import React, { useState } from 'react';
import Pagination from '@/components/common/Pagination';

function ProductList({ products }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={products.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
```

### Example 2: Server-Side Pagination

```tsx
import React, { useState, useEffect } from 'react';
import Pagination from '@/components/common/Pagination';

function ServerPaginatedList() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch(`/api/items?page=${currentPage}`);
      const result = await response.json();
      setData(result.items);
      setTotalPages(result.totalPages);
      setLoading(false);
    };

    fetchData();
  }, [currentPage]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            scrollToTop={true}
            animationType="slide"
          />
        </>
      )}
    </div>
  );
}
```

### Example 3: PaginatedGrid Component

```tsx
import { PaginatedGrid } from '@/components/common/PaginatedGrid';

function StationDirectory({ stations }) {
  return (
    <PaginatedGrid
      items={stations}
      renderItem={(station) => (
        <StationCard
          station={station}
          onViewDetails={() => console.log('View', station.id)}
          onGetDirections={() => console.log('Directions', station.id)}
        />
      )}
      itemsPerPage={12}
      gap="md"
      columns={{
        base: 1,
        sm: 2,
        lg: 3,
        xl: 4
      }}
      emptyState={
        <div className="text-center py-12">
          <p>No stations found</p>
        </div>
      }
      paginationPosition="bottom"
      animationType="fade"
      showItemsInfo={true}
    />
  );
}
```

### Example 4: Custom Animation

```tsx
function AnimatedList({ items }) {
  return (
    <PaginatedGrid
      items={items}
      renderItem={(item) => <CustomCard item={item} />}
      animationType="scale"
      staggerChildren={true}
      itemsPerPage={16}
    />
  );
}
```

## 🎯 Best Practices

### 1. Choose Appropriate Items Per Page

```tsx
// Mobile-optimized: smaller number
const itemsPerPage = isMobile ? 8 : 12;

// Data-heavy: larger number
const itemsPerPage = 24;

// Image gallery: moderate number
const itemsPerPage = 16;
```

### 2. Provide Loading States

```tsx
<PaginatedGrid
  items={items}
  loading={isLoading}
  loadingState={<CustomLoadingSpinner />}
  {...props}
/>
```

### 3. Handle Empty States

```tsx
<PaginatedGrid
  items={items}
  emptyState={
    <div className="text-center py-12">
      <h3>No results found</h3>
      <button onClick={resetFilters}>Clear Filters</button>
    </div>
  }
  {...props}
/>
```

### 4. Optimize Performance

```tsx
// Memoize render function
const renderItem = useCallback((item) => (
  <ItemCard key={item.id} item={item} />
), []);

<PaginatedGrid
  items={items}
  renderItem={renderItem}
  {...props}
/>
```

### 5. Responsive Gap Spacing

Use appropriate gap sizes for different screen sizes:

- Mobile: `gap-4` (1rem)
- Tablet: `gap-6` (1.5rem)
- Desktop: `gap-8` (2rem)

### 6. Accessibility First

Always include:
- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support

### 7. Progressive Enhancement

Start with basic functionality and enhance:

```tsx
// Basic
<Pagination currentPage={page} totalPages={total} onPageChange={setPage} />

// Enhanced
<Pagination
  currentPage={page}
  totalPages={total}
  onPageChange={setPage}
  animationType="slide"
  showItemsInfo={true}
  scrollToTop={true}
/>
```

## 🧪 Testing

### Unit Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '@/components/common/Pagination';

describe('Pagination', () => {
  it('calls onPageChange when page button is clicked', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    fireEvent.click(screen.getByLabelText('Go to page 2'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />
    );

    expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
  });
});
```

### Accessibility Tests

```tsx
import { axe } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(
    <Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Troubleshooting

### Issue: Pagination not showing

**Solution**: Ensure `totalPages > 1`

```tsx
const totalPages = Math.ceil(items.length / itemsPerPage);
// totalPages should be at least 2 for pagination to render
```

### Issue: Cards have different heights

**Solution**: Ensure proper flexbox setup

```tsx
<div className="h-full flex flex-col">
  <div className="flex-1">
    {/* Content */}
  </div>
</div>
```

### Issue: Animation not working

**Solution**: Check Framer Motion is installed

```bash
npm install framer-motion
```

### Issue: Keyboard navigation not working

**Solution**: Ensure pagination is focused

```tsx
// Click on pagination or tab to it
// Then use arrow keys
```

## 📈 Performance Considerations

1. **Virtualization**: For very large lists (1000+ items), consider virtual scrolling
2. **Lazy Loading**: Load images lazily with `loading="lazy"`
3. **Memoization**: Use `React.memo` for card components
4. **Debouncing**: Debounce search/filter operations
5. **Code Splitting**: Lazy load pagination component if needed

## 🚀 Future Enhancements

- [ ] Virtual scrolling support
- [ ] Infinite scroll mode
- [ ] URL parameter sync
- [ ] Custom page input
- [ ] Bulk page navigation
- [ ] Pagination presets
- [ ] Analytics integration

## 📞 Support

For issues or questions, please refer to:
- Project documentation
- Component source code
- GitHub issues

---

**Last Updated**: October 23, 2025
**Version**: 1.0.0
**Author**: Petrol Price Near Me Development Team
