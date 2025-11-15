# Styling Quick Reference

Fast lookup guide for common styling patterns and utilities.

## Import Statements

```tsx
import {
  cn,
  patterns,
  styleUtils,
  animations,
  a11y,
} from '@/styles/system/css-in-js';
import { useTheme } from '@/styles/system/theme';
import {
  animationStyles,
  durations,
  easings,
} from '@/styles/system/animations';
```

## Common Patterns

### Buttons

```tsx
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary btn-lg">Large</button>
<button className="btn btn-outline btn-sm">Small</button>
<button className="btn btn-ghost">Ghost</button>
<button className="btn btn-gradient">Gradient</button>
```

### Cards

```tsx
<div className="card">Default</div>
<div className="card-hover">Hover Effect</div>
<div className="card-elevated">Elevated</div>
<div className="card-bordered">Bordered</div>
<div className="card-glass">Glass Morphism</div>
```

### Inputs

```tsx
<input className="input" />
<input className="input input-sm" />
<input className="input input-lg" />
<input className="input input-error" />
<input className="input input-success" />
```

### Badges

```tsx
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-error">Error</span>
```

## Layout Utilities

```tsx
// Flex
<div className="flex-center">Centered</div>
<div className="flex-between">Space Between</div>
<div className="flex-around">Space Around</div>

// Grid
<div className="grid-responsive">Auto Grid</div>
<div className="grid-auto-fill">Auto Fill</div>
<div className="grid-auto-fit">Auto Fit</div>

// Container
<div className={patterns.container()}>Container</div>
<div className={patterns.container(true)}>Fluid</div>
```

## Text Utilities

```tsx
// Truncation
<p className="truncate-2">2 lines...</p>
<p className="truncate-3">3 lines...</p>

// Gradient
<h1 className="text-gradient-primary">Gradient</h1>

// Wrapping
<p className="text-balance">Balanced</p>
<p className="text-pretty">Pretty</p>

// Patterns
<h1 className={patterns.text.h1}>Heading 1</h1>
<p className={patterns.text.body}>Body</p>
```

## Effects

```tsx
// Glass Morphism
<div className="glass">Glass Light</div>
<div className="glass-dark">Glass Dark</div>

// Glow
<div className="glow-primary">Primary Glow</div>
<div className="glow-secondary">Secondary Glow</div>

// Shimmer
<div className="shimmer">Loading...</div>

// Scrollbar
<div className="scrollbar-custom">Custom</div>
<div className="scrollbar-hide">Hidden</div>
```

## Animations

```tsx
// Basic
<div className="animate-fade-in">Fade In</div>
<div className="animate-slide-in">Slide In</div>
<div className="animate-scale-in">Scale In</div>

// With Safety
<div className={animations.safe('animate-fade-in')}>Safe</div>

// Inline Styles
<div style={animationStyles.fadeIn(300)}>Fade</div>
```

## Responsive

```tsx
// Breakpoints
<div className="text-sm md:text-base lg:text-lg">
// Visibility
<div className="mobile-only">Mobile</div>
<div className="tablet-only">Tablet</div>
<div className="desktop-only">Desktop</div>

// Utilities
<div className="grid-responsive">Grid</div>
<div className="container-fluid">Fluid</div>
```

## Theme

```tsx
// Hook
const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

// Classes
<div className="dark:bg-gray-900">Dark Mode</div>

// Utility
<div className={styleUtils.darkMode('bg-white', 'bg-gray-900')}>
```

## Accessibility

```tsx
// Focus
<button className="focus-primary">Focusable</button>

// Screen Reader
<span className="sr-only">Hidden</span>
<span className="sr-only-focusable">Focusable SR</span>

// Touch Target
<button className="touch-target">Touch</button>

// Pattern
<button className={a11y.focusRing('primary')}>
```

## Print

```tsx
<div className="print-hidden">No Print</div>
<div className="print-only">Print Only</div>
<div className="print-break-before">New Page</div>
<div className="print-avoid-break">Keep Together</div>
```

## Color Classes

```tsx
// Primary
bg-primary-500 text-primary-600 border-primary-700

// Secondary
bg-secondary-500 text-secondary-600 border-secondary-700

// Semantic
bg-success-500 bg-warning-500 bg-error-500 bg-info-500

// Gray
bg-gray-100 bg-gray-900 text-gray-700
```

## Spacing Scale

```tsx
p - 4; // 16px
p - 6; // 24px
p - 8; // 32px
m - 4; // 16px
gap - 4; // 16px
space - y - 4; // 16px vertical
```

## Shadow Scale

```tsx
shadow-sm     // Small
shadow        // Default
shadow-md     // Medium
shadow-lg     // Large
shadow-xl     // Extra Large
shadow-2xl    // 2X Large
shadow-soft   // Soft (custom)
shadow-strong // Strong (custom)
shadow-glow   // Glow effect
```

## Border Radius

```tsx
rounded-sm    // 4px
rounded       // 6px
rounded-md    // 6px
rounded-lg    // 8px
rounded-xl    // 12px
rounded-2xl   // 16px
rounded-3xl   // 24px
rounded-full  // 9999px
```

## Z-Index

```tsx
z - dropdown; // 1000
z - sticky; // 1020
z - fixed; // 1030
z - modal - backdrop; // 1040
z - modal; // 1050
z - popover; // 1060
z - tooltip; // 1070
z - toast; // 1080
```

## Pattern Utilities

```tsx
// Button
patterns.button('primary', 'lg');

// Card
patterns.card('hover');

// Input
patterns.input(false, true); // error, success

// Badge
patterns.badge('success');

// Container
patterns.container();

// Grid
patterns.grid(3, 'lg'); // 3 cols, large gap

// Flex
patterns.flex.center;
patterns.flex.between;
patterns.flex.col;

// Text
patterns.text.h1;
patterns.text.body;
patterns.text.small;
```

## Style Utils

```tsx
// Responsive
styleUtils.responsive('text-sm', 'text-base', 'text-lg');

// Interactive
styleUtils.interactive('bg-white', 'bg-gray-100', 'ring-2');

// Dark Mode
styleUtils.darkMode('bg-white', 'bg-gray-900');

// Conditional
styleUtils.conditional(isActive, 'bg-blue-500', 'bg-gray-500');

// Animation
styleUtils.animation('animate-fade-in');
```

## Common Combinations

```tsx
// Hero Section
<div className="flex-center min-h-screen py-20">
  <h1 className="text-gradient-primary text-5xl font-bold text-center">
  <p className="text-gray-600 text-lg max-w-2xl text-center">
</div>

// Feature Card
<div className="card-hover p-6 space-y-4">
  <div className="flex-center w-12 h-12 rounded-lg bg-primary-100">
  <h3 className="text-xl font-semibold">
  <p className="text-gray-600">
</div>

// Form Group
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
  <input className="input" />
  <p className="text-sm text-gray-500">
</div>

// Loading State
<div className="card animate-pulse">
  <div className="h-6 bg-gray-200 rounded shimmer" />
  <div className="h-4 bg-gray-200 rounded w-3/4 shimmer" />
</div>
```

## Debugging

```tsx
// Debug borders
<div className="ring-2 ring-red-500">Debug</div>

// Debug backgrounds
<div className="bg-red-100">Debug BG</div>

// Debug with opacity
<div className="bg-red-500/10">Subtle Debug</div>
```

---

**Tip**: Use your IDE's autocomplete to discover more utilities!
