# Fluid Layout Examples

This directory contains demonstration components showcasing the fluid layout and typography system.

## Components

### FluidLayoutExamples.tsx

Main demo component featuring six comprehensive examples:

1. **ProductGrid** - Auto-fit card grid with fluid spacing
2. **FluidHeroSection** - Display typography with responsive layout
3. **FeatureGrid** - Icon cards with auto-fit grid
4. **BlogArticle** - Optimal reading experience with proper line length
5. **PricingCards** - Responsive pricing grid with highlighted card
6. **TestimonialGrid** - Customer testimonials with auto-fit layout

## Usage

### In a Page Component

```tsx
import FluidLayoutExamples from '@/components/examples/FluidLayoutExamples';

export default function DemoPage() {
  return <FluidLayoutExamples />;
}
```

### Individual Components

```tsx
import {
  ProductGrid,
  FluidHeroSection,
} from '@/components/examples/FluidLayoutExamples';

export default function MyPage() {
  return (
    <>
      <FluidHeroSection />
      <ProductGrid />
    </>
  );
}
```

## Demo Page

Visit `/fluid-layout-demo` to see all examples in action.

## Documentation

- [Full Guide](../../../FLUID_LAYOUT_GUIDE.md)
- [Quick Reference](../../../FLUID_LAYOUT_QUICK_REFERENCE.md)
- [Implementation Summary](../../../FLUID_LAYOUT_IMPLEMENTATION_SUMMARY.md)
