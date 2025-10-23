# Animation Guide 🎬

> GPU-optimized scroll animations with Framer Motion for smooth 60fps performance

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Components](#components)
- [Animation Presets](#animation-presets)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Overview

This project includes a comprehensive animation system built with Framer Motion that provides:

- ✅ **GPU-optimized animations** - Uses `transform` and `opacity` for hardware acceleration
- ✅ **Scroll-triggered animations** - Elements animate when entering viewport
- ✅ **One-time animations** - Animations play once to avoid distraction
- ✅ **60fps smooth performance** - Optimized for consistent frame rates
- ✅ **Accessibility support** - Respects `prefers-reduced-motion`
- ✅ **TypeScript support** - Fully typed API
- ✅ **Reusable components** - Drop-in animation wrappers

## Quick Start

### Basic Usage

```tsx
import { AnimatedSection } from '@/components/common';

function MyComponent() {
  return (
    <AnimatedSection animation="fadeInUp">
      <h1>This heading animates on scroll</h1>
    </AnimatedSection>
  );
}
```

### Grid/List Animation

```tsx
import { AnimatedCard } from '@/components/common';

function StationList({ stations }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {stations.map((station, index) => (
        <AnimatedCard key={station.id} index={index}>
          <StationCard {...station} />
        </AnimatedCard>
      ))}
    </div>
  );
}
```

## Components

### AnimatedSection

A versatile wrapper component for animating any content on scroll.

```tsx
<AnimatedSection
  animation="fadeInUp"        // Animation preset
  viewport="default"          // Trigger point: 'default' | 'immediate' | 'half' | 'full'
  delay={0.2}                // Delay in seconds
  duration={0.5}             // Duration override
  className="my-section"     // Custom classes
  as="section"               // HTML element type
>
  <YourContent />
</AnimatedSection>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animation` | `AnimationPreset` | `'fadeInUp'` | Animation style to use |
| `viewport` | `'default' \| 'immediate' \| 'half' \| 'full'` | `'default'` | When to trigger animation |
| `delay` | `number` | `0` | Delay before animation starts (seconds) |
| `duration` | `number` | - | Override preset duration |
| `className` | `string` | `''` | CSS classes |
| `as` | HTML element | `'div'` | Element type to render |

### AnimatedCard

Specialized component for cards in grids with automatic stagger delays.

```tsx
<AnimatedCard
  index={0}                  // Position in list (for stagger)
  baseDelay={0}              // Base delay before stagger
  staggerDelay={0.05}        // Delay per index
  className="card"
  onClick={handleClick}
>
  <Card />
</AnimatedCard>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | `0` | Item position for stagger calculation |
| `baseDelay` | `number` | `0` | Base delay before animation |
| `staggerDelay` | `number` | `0.05` | Additional delay per index |
| `className` | `string` | `''` | CSS classes |
| `onClick` | `function` | - | Click handler |

### AnimatedGrid

Container component that animates children with stagger effect.

```tsx
<AnimatedGrid
  stagger="normal"           // 'fast' | 'normal' | 'slow'
  staggerDelay={0.1}         // Custom stagger delay
  initialDelay={0.2}         // Delay before first item
  className="grid"
>
  {items.map(item => (
    <AnimatedGridItem key={item.id}>
      <Card {...item} />
    </AnimatedGridItem>
  ))}
</AnimatedGrid>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `stagger` | `'fast' \| 'normal' \| 'slow'` | `'normal'` | Stagger speed preset |
| `staggerDelay` | `number` | - | Custom stagger delay (overrides preset) |
| `initialDelay` | `number` | - | Delay before first animation |
| `className` | `string` | `''` | CSS classes |

## Animation Presets

### Fade Animations

- **`fadeIn`** - Simple fade in
- **`fadeInUp`** - Fade in from bottom (40px)
- **`fadeInDown`** - Fade in from top (40px)
- **`fadeInLeft`** - Fade in from left (40px)
- **`fadeInRight`** - Fade in from right (40px)

### Slide Animations

- **`slideUp`** - Slide up from bottom (60px)
- **`slideDown`** - Slide down from top (60px)
- **`slideLeft`** - Slide left from right (60px)
- **`slideRight`** - Slide right from left (60px)

### Scale Animations

- **`scaleIn`** - Scale from 80% to 100%
- **`zoomIn`** - Quick scale from 90% to 100%

### Combined Animations

- **`fadeSlideUp`** - Fade + slide up (50px) - **Recommended for cards**
- **`fadeSlideScale`** - Fade + slide + scale
- **`blurFadeIn`** - Blur to clear fade (for images)

## Performance

### GPU Acceleration

All animations use GPU-accelerated properties:
- `transform` (translate, scale, rotate)
- `opacity`
- `filter`

### Will-Change Optimization

The components automatically apply `will-change: transform, opacity` for performance hints.

### Reduced Motion

Animations automatically respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  /* Animations become instant transitions */
}
```

### Performance Tips

1. **Use GPU properties only** - Avoid animating `width`, `height`, `top`, `left`
2. **Animate once** - All animations play once to reduce computational load
3. **Limit simultaneous animations** - Stagger delays prevent too many animations at once
4. **Use appropriate viewport triggers** - Don't animate elements far off-screen

## Accessibility

### Reduced Motion Support

Users who prefer reduced motion get instant transitions:

```tsx
// Automatically handled by components
const shouldReduceMotion = useReducedMotion();
```

### Keyboard Navigation

All animated elements remain fully keyboard accessible:

```tsx
<AnimatedCard onClick={handleClick}>
  <button>Clickable content</button>
</AnimatedCard>
```

### Screen Readers

Animations don't interfere with screen reader functionality:
- Content is accessible during and after animation
- Focus management is preserved
- ARIA attributes work normally

## Examples

### Hero Section

```tsx
<AnimatedSection animation="fadeInUp" viewport="immediate">
  <h1 className="text-6xl font-bold">
    Find Cheap Petrol Near You
  </h1>
</AnimatedSection>
```

### Feature Cards

```tsx
<AnimatedGrid stagger="normal" className="grid grid-cols-3 gap-6">
  {features.map((feature, i) => (
    <AnimatedGridItem key={feature.id}>
      <FeatureCard {...feature} />
    </AnimatedGridItem>
  ))}
</AnimatedGrid>
```

### Station Cards

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {stations.map((station, index) => (
    <AnimatedCard
      key={station.id}
      index={index}
      staggerDelay={0.08}
    >
      <StationCard {...station} />
    </AnimatedCard>
  ))}
</div>
```

### Section with Delay

```tsx
<AnimatedSection
  animation="fadeInLeft"
  delay={0.3}
  duration={0.8}
>
  <AboutSection />
</AnimatedSection>
```

### Custom Viewport Trigger

```tsx
<AnimatedSection
  animation="scaleIn"
  viewport="half"  // Triggers when 50% visible
>
  <PricingTable />
</AnimatedSection>
```

## Best Practices

### ✅ Do

- Use `AnimatedCard` for grid/list items
- Use `AnimatedSection` for page sections
- Stick to provided animation presets
- Use stagger for related items
- Test with reduced motion enabled
- Keep animations subtle and quick (0.3-0.6s)
- Use `viewport="default"` for most cases

### ❌ Don't

- Animate layout properties (`width`, `height`, `top`, `left`)
- Create animations longer than 1 second
- Animate too many elements simultaneously
- Nest multiple animated components unnecessarily
- Override GPU-optimized properties
- Disable reduced motion support

### Recommended Animations by Use Case

| Use Case | Animation | Duration |
|----------|-----------|----------|
| Hero sections | `fadeInUp` | 0.6s |
| Cards in grids | `fadeSlideUp` | 0.5s |
| Feature sections | `fadeInLeft`/`Right` | 0.5s |
| Images | `blurFadeIn` | 0.8s |
| Small elements | `fadeIn` | 0.3s |
| Call-to-action | `scaleIn` | 0.4s |

## Viewport Trigger Options

| Option | Visibility | Use Case |
|--------|-----------|----------|
| `immediate` | 0% | Above-fold content |
| `default` | 20% | General content (recommended) |
| `half` | 50% | Important content |
| `full` | 90% | Content that should fully reveal |

## Advanced Usage

### Custom Animation Variants

```tsx
import { motion } from 'framer-motion';
import { DEFAULT_VIEWPORT } from '@/utils/animations';

const customVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={DEFAULT_VIEWPORT}
  variants={customVariants}
>
  <Content />
</motion.div>
```

### Stagger with Different Animations

```tsx
import { AnimatedGrid } from '@/components/common';
import { staggerContainer, fadeInLeft } from '@/utils/animations';

<motion.div variants={staggerContainer}>
  {items.map((item, i) => (
    <motion.div key={item.id} variants={fadeInLeft}>
      <Card {...item} />
    </motion.div>
  ))}
</motion.div>
```

## Troubleshooting

### Animations Not Playing

1. Check if element is visible in viewport
2. Verify `initial="hidden"` and `whileInView="visible"` are set
3. Ensure viewport threshold is appropriate
4. Check if user has reduced motion enabled

### Performance Issues

1. Reduce number of simultaneous animations
2. Increase stagger delays
3. Use simpler animation presets
4. Check for non-GPU properties in animations

### Animations Playing Multiple Times

1. Verify `viewport.once: true` is set
2. Check component isn't remounting
3. Ensure proper keys on list items

## Migration from Other Libraries

### From AOS (Animate On Scroll)

```tsx
// Before (AOS)
<div data-aos="fade-up" data-aos-delay="200">

// After (Our system)
<AnimatedSection animation="fadeInUp" delay={0.2}>
```

### From GSAP ScrollTrigger

```tsx
// Before (GSAP)
gsap.from(".card", {
  scrollTrigger: ".card",
  y: 50,
  opacity: 0
});

// After (Our system)
<AnimatedCard>
  <div className="card">
</AnimatedCard>
```

## Further Reading

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Web Animations Performance](https://web.dev/animations/)
- [Reduced Motion Guide](https://web.dev/prefers-reduced-motion/)

---

**Built with ❤️ for smooth, accessible animations**
