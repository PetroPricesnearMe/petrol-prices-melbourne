# Advanced Styling Architecture Guide

## Table of Contents

1. [Overview](#overview)
2. [Architecture Components](#architecture-components)
3. [Custom Utility Classes](#custom-utility-classes)
4. [Component Variant System](#component-variant-system)
5. [CSS-in-JS Hybrid Approach](#css-in-js-hybrid-approach)
6. [Theme System](#theme-system)
7. [Animation System](#animation-system)
8. [Responsive Design](#responsive-design)
9. [Print Styles](#print-styles)
10. [Best Practices](#best-practices)

## Overview

This project implements an advanced, maintainable, and scalable styling architecture that combines:

- **Tailwind CSS** - Utility-first CSS framework
- **Custom Plugins** - Extended utilities and component variants
- **CSS-in-JS** - Type-safe dynamic styling with `tailwind-merge`
- **Theme System** - Dark mode with performance optimization
- **Animation System** - Accessible, performant animations
- **Responsive Patterns** - Mobile-first with advanced media queries
- **Print Optimization** - Professional print styles

## Architecture Components

### File Structure

```
src/styles/
├── plugins/
│   ├── custom-utilities.plugin.ts       # Custom utility classes
│   ├── component-variants.plugin.ts     # Component variant system
│   └── responsive-variants.plugin.ts    # Responsive design patterns
├── system/
│   ├── css-in-js.ts                     # Type-safe styling utilities
│   ├── theme.ts                         # Theme management
│   └── animations.ts                    # Animation system
├── print.css                             # Print styles
├── media-queries.css                     # Advanced media queries
└── globals.css                           # Global styles

tailwind.config.advanced.ts               # Complete Tailwind configuration
```

## Custom Utility Classes

### Text Utilities

```tsx
// Text balance and wrapping
<h1 className="text-balance">Long headline that balances nicely</h1>
<p className="text-pretty">Paragraph with improved text wrapping</p>

// Multi-line truncation
<p className="truncate-2">Text truncated to 2 lines...</p>
<p className="truncate-3">Text truncated to 3 lines...</p>
<p className="truncate-4">Text truncated to 4 lines...</p>

// Gradient text
<h1 className="text-gradient-primary">Gradient Heading</h1>
```

### Layout Utilities

```tsx
// Flex patterns
<div className="flex-center">Centered content</div>
<div className="flex-between">Space between items</div>
<div className="flex-evenly">Evenly spaced items</div>

// Auto-fit grid
<div className="grid-auto-fill">
  {/* Cards auto-adjust to available space */}
</div>
```

### Effect Utilities

```tsx
// Glass morphism
<div className="glass">Glass effect light</div>
<div className="glass-dark">Glass effect dark</div>

// Glow effects
<button className="glow-primary">Glowing button</button>
<div className="glow-secondary">Glowing card</div>

// Shimmer loading effect
<div className="shimmer">Loading...</div>

// Custom scrollbar
<div className="scrollbar-custom overflow-auto">
  {/* Content with styled scrollbar */}
</div>

// Hide scrollbar
<div className="scrollbar-hide overflow-auto">
  {/* Content with hidden scrollbar */}
</div>
```

### Accessibility Utilities

```tsx
// Focus styles
<button className="focus-primary">Accessible button</button>
<a className="focus-secondary">Accessible link</a>

// Screen reader only (focusable)
<span className="sr-only-focusable">
  Additional info for screen readers
</span>

// Touch targets (WCAG compliant)
<button className="touch-target">Minimum 44x44px</button>
```

## Component Variant System

### Button Variants

```tsx
import { cn } from '@/styles/system/css-in-js';

// Using Tailwind classes
<button className="btn btn-primary">Primary Button</button>
<button className="btn btn-secondary btn-lg">Large Secondary</button>
<button className="btn btn-outline btn-sm">Small Outline</button>
<button className="btn btn-ghost">Ghost Button</button>
<button className="btn btn-gradient">Gradient Button</button>

// Using pattern utilities
import { patterns } from '@/styles/system/css-in-js';

<button className={patterns.button('primary', 'lg')}>
  Dynamic Button
</button>
```

### Card Variants

```tsx
// Static variants
<div className="card">Default card</div>
<div className="card-hover">Hoverable card</div>
<div className="card-elevated">Elevated card</div>
<div className="card-bordered">Bordered card</div>
<div className="card-glass">Glass morphism card</div>

// Using patterns
<div className={patterns.card('hover')}>
  Dynamic card with hover effect
</div>
```

### Input Variants

```tsx
<input className="input" placeholder="Default input" />
<input className="input input-sm" placeholder="Small input" />
<input className="input input-lg" placeholder="Large input" />
<input className="input input-error" placeholder="Error state" />
<input className="input input-success" placeholder="Success state" />
```

### Badge Variants

```tsx
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-error">Error</span>
<span className="badge badge-outline">Outline</span>
```

## CSS-in-JS Hybrid Approach

### Basic Usage

```tsx
import { cn } from '@/styles/system/css-in-js';

// Merge classes with proper precedence
const className = cn(
  'text-base',
  'text-lg', // This takes precedence
  isActive && 'bg-primary-500',
  isDisabled && 'opacity-50 cursor-not-allowed'
);
```

### Creating Variants

```tsx
import { createVariants } from '@/styles/system/css-in-js';

const buttonVariants = createVariants({
  base: 'inline-flex items-center justify-center rounded-lg font-semibold transition-all',
  variants: {
    variant: {
      primary: 'bg-primary-600 text-white hover:bg-primary-700',
      secondary: 'bg-secondary-600 text-white hover:bg-secondary-700',
      outline:
        'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    },
    size: {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    },
  },
  compoundVariants: [
    {
      conditions: { variant: 'primary', size: 'lg' },
      className: 'shadow-lg shadow-primary-500/50',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

// Usage
function Button({ variant, size, ...props }) {
  return <button className={buttonVariants({ variant, size })} {...props} />;
}
```

### Pattern Utilities

```tsx
import { patterns } from '@/styles/system/css-in-js';

// Pre-built patterns
<div className={patterns.container()}>
  <h1 className={patterns.text.h1}>Heading</h1>
  <p className={patterns.text.body}>Body text</p>

  <div className={patterns.grid(3, 'lg')}>{/* 3-column responsive grid */}</div>

  <div className={patterns.flex.between}>{/* Flex with space-between */}</div>
</div>;
```

### Style Utilities

```tsx
import { styleUtils } from '@/styles/system/css-in-js';

// Responsive utilities
const responsiveClass = styleUtils.responsive(
  'text-base', // base
  'text-lg', // sm
  'text-xl', // md
  'text-2xl', // lg
  'text-3xl' // xl
);

// Interactive states
const interactiveClass = styleUtils.interactive(
  'bg-white',
  'bg-gray-100', // hover
  'ring-2 ring-primary-500' // focus
);

// Dark mode
const darkModeClass = styleUtils.darkMode(
  'bg-white text-gray-900',
  'bg-gray-900 text-white'
);

// Conditional
const conditionalClass = styleUtils.conditional(
  isActive,
  'bg-primary-500',
  'bg-gray-200'
);
```

## Theme System

### Setup

```tsx
// app/layout.tsx
import { ThemeScript } from '@/styles/system/theme';

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Using the Theme Hook

```tsx
'use client';

import { useTheme } from '@/styles/system/theme';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>

      <button onClick={toggleTheme}>
        Toggle {resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode
      </button>

      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}
```

### Theme-aware Styling

```tsx
// Tailwind classes
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  Content adapts to theme
</div>;

// CSS-in-JS utility
import { styleUtils } from '@/styles/system/css-in-js';

<div
  className={styleUtils.darkMode(
    'bg-white text-gray-900',
    'bg-gray-900 text-white'
  )}
>
  Theme-aware content
</div>;
```

## Animation System

### Using Animations

```tsx
import { animations, animationStyles } from '@/styles/system/animations';

// Tailwind classes (with reduced motion support)
<div className="animate-fade-in motion-reduce:animate-none">
  Fades in
</div>

// Safe animations (auto reduced motion)
<div className={animations.safe('animate-slide-in')}>
  Slides in safely
</div>

// Inline styles
<div style={animationStyles.fadeIn(300, 100)}>
  Fades in with delay
</div>
```

### Animation Presets

```tsx
import { animations } from '@/styles/system/animations';

<div className={animations.fadeIn}>Fade In</div>
<div className={animations.slideIn}>Slide In</div>
<div className={animations.scaleIn}>Scale In</div>
<div className={animations.bounceIn}>Bounce In</div>
<div className={animations.shimmer}>Shimmer Effect</div>
<div className={animations.pulseSlow}>Slow Pulse</div>
```

### Custom Animations

```tsx
import {
  createAnimation,
  durations,
  easings,
} from '@/styles/system/animations';

const customAnimation = createAnimation({
  name: 'customFade',
  duration: durations.slow,
  easing: easings.bounce,
  delay: 100,
  iterations: 'infinite',
});

<div style={{ animation: customAnimation }}>Custom animated element</div>;
```

### Staggered Animations

```tsx
import { createStagger } from '@/styles/system/animations';

const staggerClasses = createStagger(5, 100, 'animate-fade-in');

{
  items.map((item, i) => (
    <div key={item.id} className={staggerClasses[i]}>
      {item.content}
    </div>
  ));
}
```

## Responsive Design

### Breakpoint System

- `xs`: 475px (Extra small devices)
- `sm`: 640px (Small tablets)
- `md`: 768px (Tablets)
- `lg`: 1024px (Laptops)
- `xl`: 1280px (Desktops)
- `2xl`: 1536px (Large screens)

### Responsive Utilities

```tsx
// Standard breakpoints
<div className="text-sm md:text-base lg:text-lg xl:text-xl">
  Responsive text
</div>

// Responsive grid
<div className="grid-responsive">
  {/* Auto-adjusts columns based on screen size */}
</div>

// Visibility
<div className="mobile-only">Mobile only</div>
<div className="tablet-only">Tablet only</div>
<div className="desktop-only">Desktop only</div>
```

### Container Queries

```tsx
// Enable container queries
<div className="container-query">
  <div className="container-content">
    {/* Content adjusts based on container size, not viewport */}
  </div>
</div>
```

### Device-specific Styles

```tsx
// Hover-capable devices only
<button className="hover-hover:hover:scale-105">
  Hover effect on desktop
</button>

// Touch devices
<button className="touch:min-h-[44px]">
  Larger on touch devices
</button>

// Orientation
<div className="portrait:flex-col landscape:flex-row">
  Adapts to orientation
</div>
```

## Print Styles

### Print Utilities

```tsx
// Hide from print
<nav className="print-hidden">Navigation</nav>

// Show only in print
<div className="print-only">
  Printed on: {new Date().toLocaleDateString()}
</div>

// Page breaks
<div className="print-break-before">New page</div>
<div className="print-avoid-break">Keep together</div>
```

### Print-optimized Components

```tsx
// Station card print styles are automatically applied
<StationCard {...props} />

// Custom print styling
<div className="
  bg-gradient-primary
  print:bg-white
  print:border-2
  print:border-black
">
  Prints differently
</div>
```

## Best Practices

### 1. Performance

```tsx
// ✅ Use GPU-accelerated properties
<div className="transform transition-transform hover:scale-105">

// ❌ Avoid animating expensive properties
<div className="transition-all hover:shadow-xl"> {/* Bad */}

// ✅ Use will-change sparingly
<div className="gpu-accelerate"> {/* Only for animations */}
```

### 2. Accessibility

```tsx
// ✅ Always include focus states
<button className="focus-primary">Accessible</button>

// ✅ Respect reduced motion
<div className={animations.safe('animate-fade-in')}>

// ✅ Provide sufficient touch targets
<button className="touch-target">Mobile friendly</button>

// ✅ Use semantic HTML
<button>Button</button> {/* Not <div onClick> */}
```

### 3. Maintainability

```tsx
// ✅ Extract repeated patterns
const cardClass = patterns.card('hover');

// ✅ Use variants for consistency
const buttonClass = buttonVariants({ variant, size });

// ✅ Compose utilities
const className = cn(
  patterns.flex.between,
  'p-4',
  isActive && 'bg-primary-500'
);
```

### 4. Dark Mode

```tsx
// ✅ Always define dark mode styles
<div className="bg-white dark:bg-gray-900">

// ✅ Test contrast in both modes
<p className="text-gray-900 dark:text-gray-100">

// ✅ Use semantic colors
<div className="bg-primary-500"> {/* Adapts automatically */}
```

### 5. Responsive Design

```tsx
// ✅ Mobile-first approach
<div className="text-sm md:text-base lg:text-lg">

// ✅ Test at all breakpoints
// ✅ Use relative units
<div className="p-4 md:p-6 lg:p-8">

// ❌ Avoid fixed widths
<div className="w-[500px]"> {/* Bad */}
```

## Migration Guide

### From Old System

```tsx
// Old
<div style={{ backgroundColor: 'blue', padding: '16px' }}>

// New
<div className="bg-primary-500 p-4">

// Old custom CSS
.my-button {
  background: blue;
  padding: 12px 24px;
  border-radius: 8px;
}

// New pattern utility
<button className={patterns.button('primary', 'md')}>
```

### Refactoring Steps

1. **Identify patterns** - Find repeated styling patterns
2. **Use utilities** - Replace with Tailwind classes
3. **Extract variants** - Create reusable component variants
4. **Apply theme** - Ensure dark mode support
5. **Test responsive** - Verify on all screen sizes
6. **Check accessibility** - Validate focus states and contrast

## Examples

See `docs/STYLING_EXAMPLES.md` for comprehensive component examples.

## Support

For questions or issues:

- Check the [Tailwind CSS documentation](https://tailwindcss.com/docs)
- Review component examples in `src/components/`
- Consult the team's style guide

---

**Last Updated:** 2025
**Version:** 2.0.0
