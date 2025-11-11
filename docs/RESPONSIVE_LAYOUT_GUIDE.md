# Responsive Layout & Grid Strategy Guide

## 🎯 Overview

This guide provides a comprehensive responsive layout system using Tailwind's 12-column grid with fluid breakpoints for optimal visual hierarchy and balance across all devices.

---

## 📐 Breakpoint System

### Tailwind Breakpoints

| Breakpoint | Min Width | Device | Use Case |
|------------|-----------|--------|----------|
| `default` | 0px | Mobile portrait | Stacked layouts, single column |
| `sm` | 640px | Mobile landscape, small tablets | 2-column grids |
| `md` | 768px | Tablets | 2-3 column layouts |
| `lg` | 1024px | Laptops, small desktops | 3-4 column grids |
| `xl` | 1280px | Desktops | 4+ column grids |
| `2xl` | 1536px | Large screens | Maximum width layouts |

### Mobile-First Approach

Always design for mobile first, then enhance for larger screens:

```tsx
// ✅ Good: Mobile-first
<div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

// ❌ Bad: Desktop-first
<div className="grid-cols-4 lg:grid-cols-2 sm:grid-cols-1">
```

---

## 🏗️ 12-Column Grid System

### Grid Fundamentals

The 12-column system provides maximum flexibility:

```tsx
// Full width
<GridItem colSpan={{ default: 12 }}>

// Half width
<GridItem colSpan={{ default: 6 }}>

// Third width
<GridItem colSpan={{ default: 4 }}>

// Quarter width
<GridItem colSpan={{ default: 3 }}>
```

### Responsive Column Spans

```tsx
<ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3, xl: 4 }}>
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3-4 columns */}
</ResponsiveGrid>
```

---

## 🎨 Layout Patterns

### 1. Card Grid (Most Common)

**Use Case**: Station cards, product listings, search results

```tsx
<ResponsiveGrid
  cols={{
    default: 1,      // Mobile: single column
    sm: 2,           // Small screens: 2 per row
    lg: 3,           // Desktop: 3 per row
    xl: 4,           // Large: 4 per row
  }}
  gap="lg"
  className="mb-12"
>
  {stations.map((station) => (
    <GridItem key={station.id}>
      <StationCard station={station} />
    </GridItem>
  ))}
</ResponsiveGrid>
```

**Visual Hierarchy**:
- ✅ Consistent card heights
- ✅ Adequate spacing (gap-6 to gap-8)
- ✅ Clear visual grouping
- ✅ Touch-friendly on mobile (min 44x44px)

---

### 2. Hero with Sidebar

**Use Case**: Landing pages, content + CTA

```tsx
<ResponsiveGrid
  cols={{
    default: 1,      // Mobile: stacked
    lg: 12,          // Desktop: 12-column grid
  }}
  gap="xl"
>
  {/* Main Content - 8 columns */}
  <GridItem colSpan={{ default: 1, lg: 8 }}>
    <Hero />
  </GridItem>

  {/* Sidebar - 4 columns */}
  <GridItem colSpan={{ default: 1, lg: 4 }}>
    <Sidebar />
  </GridItem>
</ResponsiveGrid>
```

**Ratio**: 2:1 (8:4) provides natural visual balance

---

### 3. Featured + Grid

**Use Case**: Highlighting one item with others

```tsx
<ResponsiveGrid cols={{ default: 1, sm: 2, lg: 4 }} gap="lg">
  {/* Featured - Spans 2 columns + 2 rows */}
  <GridItem
    colSpan={{ default: 1, sm: 2, lg: 2 }}
    rowSpan={2}
  >
    <FeaturedCard />
  </GridItem>

  {/* Regular items */}
  {items.map((item) => (
    <GridItem key={item.id}>
      <Card />
    </GridItem>
  ))}
</ResponsiveGrid>
```

---

### 4. Dashboard Layout

**Use Case**: Admin panels, user dashboards

```tsx
<ResponsiveGrid cols={{ default: 1, md: 12 }} gap="lg">
  {/* Header - Full width */}
  <GridItem colSpan={{ default: 1, md: 12 }}>
    <DashboardHeader />
  </GridItem>

  {/* Main Content */}
  <GridItem colSpan={{ default: 1, md: 8 }}>
    <Charts />
    <RecentActivity />
  </GridItem>

  {/* Sidebar */}
  <GridItem colSpan={{ default: 1, md: 4 }}>
    <QuickActions />
    <Stats />
  </GridItem>
</ResponsiveGrid>
```

---

### 5. Bento Grid (Pinterest-style)

**Use Case**: Visual interest, varied content

```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
  <div className="col-span-2 row-span-2">Large</div>
  <div>Small</div>
  <div className="col-span-1 row-span-2">Tall</div>
  <div className="col-span-2">Wide</div>
</div>
```

---

## 📏 Spacing Strategy

### Gap Sizes

```tsx
const gapGuide = {
  none: 'gap-0',      // No space - rare
  xs: 'gap-2 sm:gap-3',    // 8-12px - tight lists
  sm: 'gap-3 sm:gap-4',    // 12-16px - compact cards
  md: 'gap-4 sm:gap-6',    // 16-24px - standard cards
  lg: 'gap-6 sm:gap-8',    // 24-32px - spacious layout
  xl: 'gap-8 sm:gap-10',   // 32-40px - feature sections
  '2xl': 'gap-10 sm:gap-12 lg:gap-16', // 40-64px - hero sections
};
```

### Section Spacing

```tsx
const sectionSpacing = {
  sm: 'py-8 sm:py-12',         // 32-48px
  md: 'py-12 sm:py-16 lg:py-20',  // 48-80px (default)
  lg: 'py-16 sm:py-20 lg:py-24',  // 64-96px
  xl: 'py-20 sm:py-24 lg:py-32',  // 80-128px (hero)
};
```

### Container Padding

```tsx
// Standard container padding
className="px-4 sm:px-6 lg:px-8"

// Tight padding
className="px-3 sm:px-4"

// Generous padding  
className="px-6 sm:px-8 lg:px-12"
```

---

## 🎭 Visual Balance Principles

### 1. Whitespace Ratios

**60-30-10 Rule**:
- 60% content
- 30% whitespace
- 10% accents/CTAs

```tsx
// Good balance
<div className="p-6">              {/* Generous padding */}
  <h2 className="mb-4">Title</h2>   {/* Space after heading */}
  <p className="mb-6">Text</p>      {/* Space after paragraph */}
  <button>CTA</button>              {/* Accent element */}
</div>
```

### 2. Avoid Visual Congestion

**Before** (Congested):
```tsx
<div className="grid grid-cols-4 gap-2 p-2">
  {/* Too tight, feels cramped */}
</div>
```

**After** (Balanced):
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
  {/* Breathing room, clear hierarchy */}
</div>
```

### 3. Optical Alignment

```tsx
// Align text content
<div className="text-left">        // Not center for readability

// Center short content
<div className="text-center">      // OK for headings, CTAs

// Max-width for readability
<p className="max-w-prose">        // ~65 characters per line
```

---

## 📱 Responsive Patterns

### Pattern 1: Stack to Row

**Mobile**: Stacked vertically  
**Desktop**: Horizontal layout

```tsx
<Flex
  responsive={{
    direction: { default: 'col', lg: 'row' }
  }}
  gap="lg"
  justify="between"
>
  <div className="flex-1">Content 1</div>
  <div className="flex-1">Content 2</div>
</Flex>
```

### Pattern 2: Reorder on Mobile

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* Image first on mobile, second on desktop */}
  <div className="order-2 lg:order-1">
    <img src="..." alt="..." />
  </div>
  
  {/* Text first on desktop, second on mobile */}
  <div className="order-1 lg:order-2">
    <h2>Title</h2>
    <p>Description</p>
  </div>
</div>
```

### Pattern 3: Hide/Show by Breakpoint

```tsx
{/* Show only on mobile */}
<div className="block lg:hidden">
  <MobileMenu />
</div>

{/* Show only on desktop */}
<div className="hidden lg:block">
  <DesktopNav />
</div>
```

### Pattern 4: Sticky Sidebar

```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
  <div className="lg:col-span-8">
    {/* Main scrolling content */}
  </div>
  
  <div className="lg:col-span-4">
    <div className="lg:sticky lg:top-4">
      {/* Sidebar stays in view */}
    </div>
  </div>
</div>
```

---

## 🎨 Real-World Examples

### Example 1: Station Directory Page

```tsx
export function StationDirectoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Section spacing="lg" background="white">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Find Petrol Stations
          </h1>
          <SearchBar />
        </div>
      </Section>

      {/* Filters + Results */}
      <Section spacing="xl">
        <ResponsiveGrid
          cols={{ default: 1, lg: 12 }}
          gap="xl"
        >
          {/* Filters - Sidebar */}
          <GridItem colSpan={{ default: 1, lg: 3 }}>
            <div className="card p-6 lg:sticky lg:top-4">
              <h2 className="text-xl font-bold mb-4">Filters</h2>
              <FilterOptions />
            </div>
          </GridItem>

          {/* Results Grid */}
          <GridItem colSpan={{ default: 1, lg: 9 }}>
            <ResponsiveGrid
              cols={{ default: 1, sm: 2, xl: 3 }}
              gap="lg"
            >
              {stations.map((station) => (
                <GridItem key={station.id}>
                  <StationCard station={station} />
                </GridItem>
              ))}
            </ResponsiveGrid>
          </GridItem>
        </ResponsiveGrid>
      </Section>
    </div>
  );
}
```

### Example 2: Pricing Page

```tsx
export function PricingPage() {
  return (
    <Section spacing="xl" background="gray">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
        <p className="text-xl text-gray-600">Choose the plan that fits</p>
      </div>

      {/* Pricing Cards - Centered */}
      <div className="max-w-6xl mx-auto">
        <ResponsiveGrid
          cols={{
            default: 1,
            md: 3,
          }}
          gap="lg"
          className="items-stretch" // Equal height cards
        >
          <GridItem>
            <PricingCard tier="Free" />
          </GridItem>
          <GridItem>
            <PricingCard tier="Pro" featured />
          </GridItem>
          <GridItem>
            <PricingCard tier="Enterprise" />
          </GridItem>
        </ResponsiveGrid>
      </div>
    </Section>
  );
}
```

---

## ✅ Best Practices Checklist

### Layout
- [ ] Use mobile-first approach (default, then sm, md, lg)
- [ ] Maintain consistent column counts across sections
- [ ] Ensure grid items have equal heights where appropriate
- [ ] Use 12-column system for complex layouts
- [ ] Stack on mobile, expand on desktop

### Spacing
- [ ] Use consistent gap sizes (lg for most grids)
- [ ] Add section padding (py-12 to py-24)
- [ ] Include container padding (px-4 sm:px-6 lg:px-8)
- [ ] Balance content vs whitespace (60-30-10)
- [ ] Avoid cramped layouts (minimum gap-4)

### Visual Hierarchy
- [ ] Feature important content with larger spans
- [ ] Use asymmetry for visual interest
- [ ] Align elements consistently
- [ ] Group related content
- [ ] Clear focal points

### Responsiveness
- [ ] Test at all breakpoints (mobile, tablet, desktop)
- [ ] Touch targets 44x44px minimum on mobile
- [ ] Readable line lengths (max-w-prose)
- [ ] Proper image scaling
- [ ] Sticky elements on desktop only

### Accessibility
- [ ] Semantic HTML (section, article, aside)
- [ ] Logical reading order
- [ ] Keyboard navigation works at all sizes
- [ ] Focus states visible
- [ ] ARIA landmarks for screen readers

---

## 🛠️ Component Library

### Quick Reference

```tsx
import {
  ResponsiveGrid,  // Main grid container
  GridItem,        // Grid item with span control
  Container,       // Max-width container
  Flex,           // Flexible layout
  Section,        // Section wrapper with spacing
} from '@/components/layout/ResponsiveGrid';
```

### Usage Examples

```tsx
// Simple card grid
<ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }} gap="lg">
  <GridItem>Card 1</GridItem>
  <GridItem>Card 2</GridItem>
</ResponsiveGrid>

// Hero layout
<Section spacing="xl">
  <Container size="lg">
    <h1>Hero Title</h1>
  </Container>
</Section>

// Flex layout
<Flex 
  responsive={{ direction: { default: 'col', lg: 'row' } }}
  justify="between"
  gap="lg"
>
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>
```

---

## 📊 Performance Tips

### 1. Avoid Layout Shifts

```tsx
// Reserve space for images
<img 
  className="w-full h-auto aspect-video object-cover"
  src={src}
  alt={alt}
/>

// Use skeleton loaders
{loading && <Skeleton className="h-48" />}
```

### 2. Optimize Grid Rendering

```tsx
// Use CSS Grid for static layouts
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

// Use Flexbox for dynamic content
<div className="flex flex-wrap gap-4">
```

### 3. Reduce Reflows

```tsx
// Set explicit dimensions
<div className="h-64 w-full">

// Use transform for animations (not width/height)
<div className="transition-transform hover:scale-105">
```

---

## 🎯 Common Mistakes to Avoid

### ❌ Don't
```tsx
// Too many columns on mobile
<div className="grid-cols-3">

// No responsive breakpoints
<div className="grid-cols-4">

// Fixed widths
<div className="w-[800px]">

// Inconsistent spacing
<div className="gap-2 p-8">
```

### ✅ Do
```tsx
// Mobile-first with breakpoints
<div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

// Relative sizing
<div className="w-full max-w-7xl">

// Consistent spacing scale
<div className="gap-6 p-6">
```

---

## 📚 Resources

- [Tailwind Grid Documentation](https://tailwindcss.com/docs/grid-template-columns)
- [Tailwind Flex Documentation](https://tailwindcss.com/docs/flex)
- [Responsive Design Principles](https://web.dev/responsive-web-design-basics/)
- [CSS Grid Garden](https://cssgridgarden.com/) - Interactive tutorial

---

**Last Updated**: 2025-11-11  
**Tested With**: Tailwind CSS 3.4+, React 19, Next.js 15

