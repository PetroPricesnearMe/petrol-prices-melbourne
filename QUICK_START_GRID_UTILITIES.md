# 🎨 Responsive Grid Utilities - Quick Start

## Overview

Easy-to-use utilities for building responsive grid layouts with proper Tailwind class management and TypeScript safety.

---

## 🚀 Basic Usage

### Simple Grid

```typescript
import { EnhancedCardGrid, GridItem } from '@/components/organisms/EnhancedCardGrid';

function MyPage() {
  return (
    <EnhancedCardGrid>
      <GridItem index={0}>
        <Card>Station 1</Card>
      </GridItem>
      <GridItem index={1}>
        <Card>Station 2</Card>
      </GridItem>
      <GridItem index={2}>
        <Card>Station 3</Card>
      </GridItem>
    </EnhancedCardGrid>
  );
}
```

### Custom Columns

```typescript
<EnhancedCardGrid
  columns={{
    base: 1,    // Mobile: 1 column
    sm: 2,      // Tablet: 2 columns
    lg: 3,      // Desktop: 3 columns
    xl: 4,      // Large screens: 4 columns
  }}
/>
```

### Different Gap Sizes

```typescript
<EnhancedCardGrid
  gap="sm"  // Small gaps
  // or
  gap="md"  // Medium gaps (default)
  // or
  gap="lg"  // Large gaps
  // or
  gap="xl"  // Extra large gaps
/>
```

### Disable Animations

```typescript
<EnhancedCardGrid
  animate={false}  // No entrance animations
/>
```

### Custom Grid Configuration

```typescript
<EnhancedCardGrid
  columns={{
    base: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 5,  // Extra extra large screens
  }}
  gap="lg"
  uniformHeights={true}  // All cards same height
  className="my-custom-class"
/>
```

---

## 🎯 Common Patterns

### Pattern 1: Station Cards (Default)

```typescript
<EnhancedCardGrid>
  {stations.map((station, index) => (
    <GridItem key={station.id} index={index}>
      <StationCard station={station} />
    </GridItem>
  ))}
</EnhancedCardGrid>
```

### Pattern 2: Compact Grid

```typescript
<EnhancedCardGrid
  columns={{ base: 2, sm: 3, lg: 5, xl: 6 }}
  gap="sm"
>
  {items.map((item, index) => (
    <GridItem key={item.id} index={index}>
      <CompactCard item={item} />
    </GridItem>
  ))}
</EnhancedCardGrid>
```

### Pattern 3: Wide Grid

```typescript
<EnhancedCardGrid
  columns={{ base: 1, lg: 4 }}
  gap="xl"
>
  {features.map((feature, index) => (
    <GridItem key={feature.id} index={index}>
      <FeatureCard feature={feature} />
    </GridItem>
  ))}
</EnhancedCardGrid>
```

### Pattern 4: No Uniform Heights

```typescript
<EnhancedCardGrid
  uniformHeights={false}  // Cards can vary in height
>
  {articles.map((article, index) => (
    <GridItem key={article.id} index={index}>
      <ArticleCard article={article} />
    </GridItem>
  ))}
</EnhancedCardGrid>
```

---

## 📱 Responsive Breakpoints

The utilities use Tailwind's default breakpoints:

| Screen Size   | Breakpoint | Width    |
| ------------- | ---------- | -------- |
| Mobile        | base       | < 640px  |
| Tablet        | sm         | ≥ 640px  |
| Desktop       | md         | ≥ 768px  |
| Large Desktop | lg         | ≥ 1024px |
| XL Desktop    | xl         | ≥ 1280px |
| 2XL Desktop   | 2xl        | ≥ 1536px |

### Visual Example

```
Mobile (base)    Tablet (sm)     Desktop (lg)    XL (xl)
┌──────────┐    ┌──────┬──────┐  ┌───┬───┬───┐  ┌──┬──┬──┬──┐
│ Card 1   │    │  C1  │  C2  │  │C1 │C2 │C3 │  │C1│C2│C3│C4│
├──────────┤    ├──────┼──────┤  ├───┼───┼───┤  ├──┼──┼──┼──┤
│ Card 2   │    │  C3  │  C4  │  │C4 │C5 │C6 │  │C5│C6│C7│C8│
├──────────┤    ├──────┼──────┤  ├───┼───┼───┤  ├──┼──┼──┼──┤
│ Card 3   │    │  C5  │  C6  │  │C7 │C8 │C9 │  │C9│C10│C11│C12│
└──────────┘    └──────┴──────┘  └───┴───┴───┘  └──┴──┴──┴──┘
   1 col           2 cols           3 cols         4 cols
```

---

## 🎨 Gap Sizes

| Gap  | Mobile         | Tablet         | Desktop       |
| ---- | -------------- | -------------- | ------------- |
| `sm` | 1rem (16px)    | 1.25rem (20px) | 1.25rem       |
| `md` | 1.25rem (20px) | 1.5rem (24px)  | 2rem (32px)   |
| `lg` | 1.5rem (24px)  | 2rem (32px)    | 2.5rem (40px) |
| `xl` | 2rem (32px)    | 2.5rem (40px)  | 3rem (48px)   |

---

## 🎭 Advanced Usage

### Using the Utility Functions Directly

```typescript
import { buildGridClasses, type ResponsiveColumns } from '@/utils/responsive-grid';

function CustomGrid() {
  const columns: ResponsiveColumns = {
    base: 1,
    sm: 2,
    lg: 3,
    xl: 4,
  };

  const gridClasses = buildGridClasses({
    columns,
    gap: 'md',
    uniformHeights: true,
    className: 'my-grid',
  });

  return <div className={gridClasses}>...</div>;
}
```

### Building Grid Classes

```typescript
import { buildGridColumnClasses } from '@/utils/responsive-grid';

const colClasses = buildGridColumnClasses({
  base: 1,
  sm: 2,
  lg: 3,
});
// Returns: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
```

### Getting Gap Classes

```typescript
import { getGapClasses } from '@/utils/responsive-grid';

const gaps = getGapClasses('md');
// Returns: "gap-5 sm:gap-6 lg:gap-8"
```

---

## 🔧 GridItem Props

```typescript
<GridItem
  index={0}              // Animation index (required for stagger)
  enableHover={true}     // Enable hover animation (default: true)
  className="my-class"    // Custom className
  testId="grid-item-1"   // Test ID
>
  {children}
</GridItem>
```

---

## 🎨 TypeScript Types

```typescript
import type {
  ResponsiveColumns,
  GapSize,
} from '@/components/organisms/EnhancedCardGrid';

const columns: ResponsiveColumns = {
  base: 1,
  sm: 2,
  lg: 3,
  xl: 4,
};

const gap: GapSize = 'md';
```

---

## 📊 Performance Benefits

### Static Class Generation

✅ **Before** (Dynamic - Broken):

```typescript
const classes = `grid-cols-${columns.base}`;
// Tailwind can't purge this ❌
```

✅ **After** (Static - Works):

```typescript
const classes = buildGridClasses({ columns: { base: 1 } });
// Returns: "grid-cols-1" (statically analyzable) ✅
```

**Result**: Smaller bundle size, all classes included

---

## 🎯 Best Practices

### 1. Always Wrap Items in GridItem

```typescript
// ✅ Good
<EnhancedCardGrid>
  {items.map((item, index) => (
    <GridItem key={item.id} index={index}>
      <Card data={item} />
    </GridItem>
  ))}
</EnhancedCardGrid>

// ❌ Bad - Missing GridItem wrapper
<EnhancedCardGrid>
  {items.map((item) => (
    <Card key={item.id} data={item} />
  ))}
</EnhancedCardGrid>
```

### 2. Provide Index for Animations

```typescript
// ✅ Good
<GridItem index={index}>

// ❌ Bad - No animation stagger
<GridItem>
```

### 3. Use Consistent Gap Patterns

```typescript
// ✅ Good - Consistent across project
gap = 'md';

// ❌ Bad - Inconsistent
gap = 'sm'; // Sometimes
gap = 'xl'; // Other times
```

---

## 🐛 Troubleshooting

### Cards Not Lining Up

**Problem**: Cards have different heights
**Solution**: Use `uniformHeights={true}` (default)

```typescript
<EnhancedCardGrid uniformHeights={true}>
  {/* Cards will have equal height */}
</EnhancedCardGrid>
```

### Animations Too Fast/Slow

```typescript
<EnhancedCardGrid
  staggerDelay={0.1}  // Adjust delay between items
>
```

### Grid Not Responsive

**Problem**: Only seeing 1 column on all screens
**Solution**: Check your column configuration

```typescript
// ❌ Bad
<EnhancedCardGrid columns={{ base: 1 }}>

// ✅ Good
<EnhancedCardGrid columns={{ base: 1, sm: 2, lg: 3 }}>
```

---

## 📚 Further Reading

- [Tailwind CSS Grid](https://tailwindcss.com/docs/grid-template-columns)
- [Framer Motion Stagger](https://www.framer.com/motion/animation/)
- [Responsive Design Guide](./ARCHITECTURE_GUIDE.md)

---

**Last Updated**: December 2024
