# Fluid Grid Component

A responsive, fluid grid system with consistent gutter spacing, uniform card heights, and vertical rhythm using Tailwind CSS.

## Features

✅ **Responsive Grid Columns**: 1 → 2 → 3 → 4 columns
✅ **Consistent Gutter Spacing**: Equal negative space using Tailwind gap utilities
✅ **Uniform Card Heights**: All cards maintain equal height in each row
✅ **Vertical Rhythm**: Consistent spacing between rows
✅ **Staggered Animations**: Smooth entrance animations with customizable delay
✅ **Fluid Gap Spacing**: Optional responsive gap sizes that scale with viewport
✅ **Mobile-First**: Designed for smallest screens first, then enhanced

## Quick Start

```tsx
import { FluidGrid, GridItem } from '@/components/common';

function StationDirectory() {
  return (
    <FluidGrid gap="md" animate={true}>
      {stations.map((station) => (
        <GridItem key={station.id}>
          <StationCard station={station} />
        </GridItem>
      ))}
    </FluidGrid>
  );
}
```

## Props

### FluidGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Grid items to render |
| `className` | string | - | Additional CSS classes |
| `gap` | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Gap size between items |
| `animate` | boolean | false | Enable staggered entrance animations |
| `staggerDelay` | number | 0.05 | Delay between each item animation (seconds) |
| `columns` | object | See below | Column configuration |
| `uniformHeights` | boolean | true | Enable uniform card heights |
| `fluidGap` | boolean | false | Enable fluid gap spacing |

### Column Configuration

```tsx
columns={{
  base: 1,    // Mobile: < 640px
  sm: 2,      // ≥ 640px
  lg: 3,      // ≥ 1024px
  xl: 4,      // ≥ 1280px
}}
```

## Gap Sizes

### Standard Gaps

| Size | Classes | Description |
|------|---------|-------------|
| `sm` | `gap-4 sm:gap-5` | 16px → 20px |
| `md` | `gap-5 sm:gap-6 lg:gap-7` | 20px → 24px → 28px |
| `lg` | `gap-6 sm:gap-8 lg:gap-10` | 24px → 32px → 40px |
| `xl` | `gap-8 sm:gap-10 lg:gap-12` | 32px → 40px → 48px |

### Fluid Gaps

When `fluidGap={true}`, gaps scale smoothly across all viewport sizes:

```tsx
<FluidGrid fluidGap={true} gap="md">
  {/* Gaps scale from 1.25rem to 1.5rem based on viewport width */}
</FluidGrid>
```

## Usage Examples

### Basic Grid

```tsx
import { FluidGrid, GridItem } from '@/components/common';

function BasicGrid() {
  const items = [/* your data */];

  return (
    <FluidGrid>
      {items.map((item) => (
        <GridItem key={item.id}>
          <Card>{item.name}</Card>
        </GridItem>
      ))}
    </FluidGrid>
  );
}
```

### With Animations

```tsx
<FluidGrid
  animate={true}
  staggerDelay={0.05}
  gap="md"
>
  {stations.map((station) => (
    <GridItem key={station.id}>
      <StationCard station={station} />
    </GridItem>
  ))}
</FluidGrid>
```

### Custom Columns

```tsx
<FluidGrid
  columns={{
    base: 1,
    sm: 3,
    lg: 4,
    xl: 6,
  }}
  gap="lg"
>
  {/* Items */}
</FluidGrid>
```

### Using DefaultFluidGrid

```tsx
import { DefaultFluidGrid } from '@/components/common';

// Uses recommended column configuration (1 → 2 → 3 → 4)
<DefaultFluidGrid gap="md" animate={true}>
  {items.map((item) => (
    <GridItem key={item.id}>
      <Card>{item.name}</Card>
    </GridItem>
  ))}
</DefaultFluidGrid>
```

## Grid Structure

### HTML Output

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7 auto-rows-fr">
  <div class="h-full flex flex-col" role="gridcell">
    <!-- Card content -->
  </div>
</div>
```

### Key Classes

- `grid`: CSS Grid layout
- `grid-cols-*`: Responsive column count
- `gap-*`: Consistent spacing between items
- `auto-rows-fr`: Equal-height rows
- `h-full`: Cards fill their grid cell
- `flex flex-col`: Proper card layout

## Uniform Card Heights

The grid ensures all cards have equal height within each row:

1. **Grid Container**: Uses `auto-rows-fr` for equal row heights
2. **GridItem**: Uses `h-full flex flex-col` to fill available space
3. **Card Content**: Uses `mt-auto` to push footer to bottom

```tsx
<GridItem>
  <div className="h-full flex flex-col">
    <header>Card Header</header>
    <div className="flex-1">Card Body</div>
    <footer className="mt-auto">Card Footer</footer>
  </div>
</GridItem>
```

## Vertical Rhythm

Consistent vertical rhythm is achieved through:

- **Gap Utilities**: Equal spacing between all cards
- **Grid Gap**: Horizontal and vertical spacing are equal
- **Responsive Scaling**: Gaps increase proportionally across breakpoints

## Animations

### Staggered Entrance

Enable smooth, staggered animations when items mount:

```tsx
<FluidGrid
  animate={true}
  staggerDelay={0.05} // 50ms delay between each item
>
  {items.map((item, index) => (
    <GridItem key={item.id}>
      {/* Item animates in with delay */}
    </GridItem>
  ))}
</FluidGrid>
```

### Animation Properties

- **Duration**: 400ms
- **Easing**: cubic-bezier(0.16, 1, 0.3, 1)
- **Stagger Delay**: Configurable per item

## Responsive Breakpoints

| Breakpoint | Width | Columns (default) |
|------------|-------|-------------------|
| base       | < 640px | 1 column |
| sm         | ≥ 640px | 2 columns |
| lg         | ≥ 1024px | 3 columns |
| xl         | ≥ 1280px | 4 columns |

## Best Practices

### 1. Wrap Cards in GridItem

Always wrap individual cards in `GridItem` for proper height management:

```tsx
<FluidGrid>
  {stations.map((station) => (
    <GridItem key={station.id}>
      <StationCard station={station} />
    </GridItem>
  ))}
</FluidGrid>
```

### 2. Use Consistent Gap Sizes

Choose gap size based on content density:

- `gap="sm"`: Dense content
- `gap="md"`: Balanced (recommended)
- `gap="lg"`: Spacious content
- `gap="xl"`: Very spacious

### 3. Enable Uniform Heights

For cards of different content lengths:

```tsx
<FluidGrid uniformHeights={true}>
  {/* All cards in same row will have equal height */}
</FluidGrid>
```

### 4. Add Animations Sparingly

Use animations for initial load or when filtering:

```tsx
<FluidGrid animate={isInitialLoad} staggerDelay={0.05}>
  {/* Only animates on initial load */}
</FluidGrid>
```

## Accessibility

The grid includes proper ARIA attributes:

- `role="grid"` on container
- `role="gridcell"` on items
- Screen reader friendly structure

## Performance

### Optimization Tips

1. **Lazy Load Images**: Use `loading="lazy"` on images
2. **Code Splitting**: Split heavy components
3. **Virtual Scrolling**: For very long lists
4. **Debounce Animations**: For rapid filter changes

### Bundle Size

- **FluidGrid**: ~3KB (with Framer Motion)
- **GridItem**: < 1KB
- **Total**: ~4KB

## Troubleshooting

### Cards Not Equal Height

Ensure you're using `GridItem` and `uniformHeights={true}`:

```tsx
<FluidGrid uniformHeights={true}>
  <GridItem>
    <Card className="h-full">...</Card>
  </GridItem>
</FluidGrid>
```

### Gaps Too Large/Small

Adjust gap size:

```tsx
<FluidGrid gap="sm"> {/* Smaller gaps */}
<FluidGrid gap="lg"> {/* Larger gaps */}
```

### Animation Not Working

Check that `animate={true}` is set and children are valid React elements:

```tsx
<FluidGrid animate={true}>
  {/* Valid JSX elements */}
</FluidGrid>
```

## Migration Guide

### From Custom CSS

Replace custom grid styles:

**Before:**
```css
.station-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
}
```

**After:**
```tsx
<FluidGrid gap="md">
  {stations.map(station => (
    <GridItem key={station.id}>
      <StationCard station={station} />
    </GridItem>
  ))}
</FluidGrid>
```

### From Flexbox

Migrate flex containers:

**Before:**
```jsx
<div className="flex flex-wrap gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>
```

**After:**
```tsx
<FluidGrid gap="sm">
  {items.map(item => (
    <GridItem key={item.id}>
      <Card />
    </GridItem>
  ))}
</FluidGrid>
```

## Related Components

- **PaginatedGrid**: Grid with pagination
- **AnimatedGrid**: Grid with advanced animations
- **StationCard**: Station card component

## Support

For issues or questions, please refer to:
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- Project README
