# Design System & Theme Configuration Complete 🎨

## Overview
Comprehensive design system implemented with thematic color palette, consistent spacing, and full dark mode support.

---

## 📚 Table of Contents
1. [Color Palette](#color-palette)
2. [Spacing Scale](#spacing-scale)
3. [Typography](#typography)
4. [Border Radius](#border-radius)
5. [Shadows & Effects](#shadows--effects)
6. [Dark Mode](#dark-mode)
7. [Usage Examples](#usage-examples)
8. [Best Practices](#best-practices)

---

## 🎨 Color Palette

### Primary Colors (Blue)
Main brand color for primary actions, links, and highlights.

```tsx
// Tailwind classes
bg-primary-500    // Main: #3b82f6
bg-primary-600    // Hover: #2563eb
text-primary-600  // Text
```

**Scale:** 50, 100, 200, 300, 400, 500 (main), 600, 700, 800, 900, 950

**Usage:**
- Primary buttons
- Links and navigation
- Progress indicators
- Focus states

### Secondary Colors (Purple/Indigo)
Complementary color for secondary actions and accents.

```tsx
// Tailwind classes
bg-secondary-500    // Main: #a855f7
bg-secondary-600    // Hover: #9333ea
text-secondary-600  // Text
```

**Usage:**
- Secondary buttons
- Badges and labels
- Alternative CTAs
- Visual variety

### Accent Colors (Cyan/Teal)
Eye-catching accent for highlights and special features.

```tsx
// Tailwind classes
bg-accent-500    // Main: #06b6d4
bg-accent-600    // Hover: #0891b2
text-accent-600  // Text
```

**Usage:**
- Call-to-action elements
- Promotional content
- Special offers
- Highlights

### Neutral/Grays
Base colors for backgrounds, borders, and text.

```tsx
// Light Mode
bg-white          // Backgrounds
bg-gray-50        // Secondary backgrounds
text-gray-900     // Body text
text-gray-600     // Secondary text

// Dark Mode
bg-neutral-950    // Backgrounds
bg-neutral-900    // Secondary backgrounds
text-neutral-50   // Body text
text-neutral-400  // Secondary text
```

**Scale:** 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

### State Colors

#### Success (Green)
```tsx
bg-success-500    // #22c55e
text-success-600  // Text
border-success-500 // Borders
```
**Usage:** Success messages, confirmations, positive stats

#### Warning (Amber)
```tsx
bg-warning-500    // #f59e0b
text-warning-600  // Text
border-warning-500 // Borders
```
**Usage:** Warnings, cautions, pending states

#### Error (Red)
```tsx
bg-error-500      // #ef4444
text-error-600    // Text
border-error-500  // Borders
```
**Usage:** Errors, destructive actions, critical alerts

#### Info (Blue)
```tsx
bg-info-500       // #3b82f6
text-info-600     // Text
border-info-500   // Borders
```
**Usage:** Information messages, tips, general notifications

---

## 📏 Spacing Scale

Consistent spacing for margins, padding, and gaps.

### Base Scale
```css
0.5  → 0.125rem  (2px)
1    → 0.25rem   (4px)
1.5  → 0.375rem  (6px)
2    → 0.5rem    (8px)
2.5  → 0.625rem  (10px)
3    → 0.75rem   (12px)
4    → 1rem      (16px)
5    → 1.25rem   (20px)
6    → 1.5rem    (24px)
8    → 2rem      (32px)
10   → 2.5rem    (40px)
12   → 3rem      (48px)
16   → 4rem      (64px)
20   → 5rem      (80px)
24   → 6rem      (96px)
```

### Extended Scale
```css
30   → 7.5rem    (120px)
40   → 10rem     (160px)
50   → 12.5rem   (200px)
60   → 15rem     (240px)
72   → 18rem     (288px)
80   → 20rem     (320px)
96   → 24rem     (384px)
128  → 32rem     (512px)
144  → 36rem     (576px)
192  → 48rem     (768px)
```

### Usage Examples
```tsx
// Component spacing
<div className="p-6">          {/* 24px padding */}
<div className="mt-4 mb-8">    {/* 16px top, 32px bottom */}
<div className="space-y-4">    {/* 16px vertical gap */}
<div className="gap-6">        {/* 24px gap in flex/grid */}
```

---

## 🔤 Typography

### Font Sizes

```tsx
// Text sizes
text-xs      // 12px - Small labels, captions
text-sm      // 14px - Secondary text
text-base    // 16px - Body text (default)
text-lg      // 18px - Emphasized text
text-xl      // 20px - Large text

// Heading sizes
text-2xl     // 24px - h6
text-3xl     // 30px - h5
text-4xl     // 36px - h4
text-5xl     // 48px - h3
text-6xl     // 60px - h2
text-7xl     // 72px - h1
text-8xl     // 96px - Hero
text-9xl     // 128px - Display
```

### Font Weights
```tsx
font-thin        // 100
font-extralight  // 200
font-light       // 300
font-normal      // 400 (default)
font-medium      // 500
font-semibold    // 600
font-bold        // 700
font-extrabold   // 800
font-black       // 900
```

### Font Families
```tsx
font-sans        // Inter (default)
font-mono        // Monospace
font-display     // Display font
```

### Typography Examples
```tsx
// Headings
<h1 className="text-4xl font-bold text-gray-900 dark:text-white">
  Heading 1
</h1>

// Body text
<p className="text-base text-gray-700 dark:text-gray-300">
  Body paragraph text
</p>

// Secondary text
<span className="text-sm text-gray-600 dark:text-gray-400">
  Secondary information
</span>

// Labels
<label className="text-xs font-medium text-gray-700 dark:text-gray-300">
  Form Label
</label>
```

---

## 🔲 Border Radius

Consistent rounded corners for all UI elements.

```tsx
rounded-none   // 0px - Sharp corners
rounded-sm     // 4px - Subtle rounding
rounded        // 6px - Default (inputs, buttons)
rounded-md     // 8px - Medium (cards)
rounded-lg     // 12px - Large (prominent cards)
rounded-xl     // 16px - Extra large
rounded-2xl    // 20px - 2X large
rounded-3xl    // 24px - 3X large
rounded-4xl    // 32px - 4X large
rounded-5xl    // 40px - 5X large
rounded-full   // 9999px - Pills, circles
```

### Usage Examples
```tsx
// Buttons
<button className="rounded-lg">  {/* 12px */}

// Cards
<div className="rounded-xl">    {/* 16px */}

// Pills/Badges
<span className="rounded-full">  {/* Fully rounded */}

// Images
<img className="rounded-2xl">   {/* 20px */}
```

---

## 🌑 Shadows & Effects

### Box Shadows
```tsx
shadow-xs       // Subtle
shadow-sm       // Small
shadow          // Default
shadow-md       // Medium
shadow-lg       // Large
shadow-xl       // Extra large
shadow-2xl      // 2X large

// Custom
shadow-soft     // Soft shadow
shadow-medium   // Medium custom
shadow-strong   // Strong shadow
shadow-glow     // Glow effect (primary color)
```

### Usage Examples
```tsx
// Cards
<div className="shadow-md hover:shadow-lg">

// Floating elements
<div className="shadow-xl">

// Buttons
<button className="shadow-sm hover:shadow-md">

// Glowing elements
<div className="shadow-glow">
```

### Animations
```tsx
// Fade
animate-fade-in
animate-fade-out

// Slide
animate-slide-up
animate-slide-down
animate-slide-left
animate-slide-right

// Scale
animate-scale-in
animate-scale-out

// Bounce
animate-bounce-in

// Spin
animate-spin-slow
animate-spin-slower

// Pulse
animate-pulse-slow

// Custom
animate-wiggle
animate-float
animate-shimmer
```

---

## 🌓 Dark Mode

### System Detection & Manual Toggle

The theme system automatically detects system preferences and allows manual toggling.

### Theme Provider Setup

Already configured in `src/app/providers.tsx`:

```tsx
<ThemeProvider defaultTheme="system" storageKey="ppnm-theme">
  {children}
</ThemeProvider>
```

### Using Theme in Components

```tsx
'use client';

import { useTheme } from '@/components/providers/ThemeProvider';

export function MyComponent() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Theme Toggle Component

```tsx
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// Icon only
<ThemeToggle />

// With label
<ThemeToggle showLabel />

// Full switcher (Light/Dark/System)
<ThemeToggle variant="full" />

// Dropdown
<ThemeToggle variant="dropdown" />
```

### Dark Mode Classes

Use Tailwind's `dark:` prefix for dark mode styles:

```tsx
<div className="bg-white dark:bg-neutral-950">
  <h1 className="text-gray-900 dark:text-white">
    Title
  </h1>
  <p className="text-gray-700 dark:text-gray-300">
    Paragraph text
  </p>
</div>
```

### CSS Variables

Use CSS variables for dynamic theming:

```tsx
<div className="bg-themed text-themed">
  <p className="text-secondary-themed">
    Using CSS variables
  </p>
</div>
```

### Dark Mode Best Practices

1. **Always provide dark mode styles** for custom components
2. **Test both themes** during development
3. **Use semantic colors** (not absolute colors)
4. **Avoid pure white** (#ffffff) in dark mode
5. **Adjust shadows** in dark mode (darker/softer)
6. **Test color contrast** (WCAG AA minimum)

---

## 💡 Usage Examples

### Button Variants
```tsx
// Primary
<button className="btn bg-primary-600 hover:bg-primary-700 text-white">
  Primary Action
</button>

// Secondary
<button className="btn bg-secondary-600 hover:bg-secondary-700 text-white">
  Secondary Action
</button>

// Outline
<button className="btn border-2 border-primary-600 text-primary-600 hover:bg-primary-50">
  Outline
</button>

// Ghost
<button className="btn text-primary-600 hover:bg-primary-50">
  Ghost
</button>
```

### Card Variants
```tsx
// Basic card
<div className="card bg-white dark:bg-neutral-900 rounded-xl shadow-md p-6">
  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Card Title</h3>
  <p className="text-gray-600 dark:text-gray-400">Card content</p>
</div>

// Hover card
<div className="card bg-white dark:bg-neutral-900 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
  Interactive Card
</div>

// Bordered card
<div className="card bg-white dark:bg-neutral-900 rounded-xl border-2 border-gray-200 dark:border-neutral-800 p-6">
  Bordered Card
</div>
```

### Form Elements
```tsx
// Input
<input
  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg
             bg-white dark:bg-neutral-900 text-gray-900 dark:text-white
             focus:ring-2 focus:ring-primary-500 focus:border-transparent"
/>

// Select
<select className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg
                   bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

// Checkbox
<input
  type="checkbox"
  className="w-4 h-4 text-primary-600 border-gray-300 rounded
             focus:ring-primary-500 dark:border-neutral-700 dark:bg-neutral-900"
/>
```

### Badges
```tsx
// Primary badge
<span className="px-3 py-1 text-sm font-medium rounded-full
                 bg-primary-100 text-primary-800
                 dark:bg-primary-900 dark:text-primary-200">
  Primary
</span>

// Success badge
<span className="px-3 py-1 text-sm font-medium rounded-full
                 bg-success-100 text-success-800
                 dark:bg-success-900 dark:text-success-200">
  Success
</span>

// Warning badge
<span className="px-3 py-1 text-sm font-medium rounded-full
                 bg-warning-100 text-warning-800
                 dark:bg-warning-900 dark:text-warning-200">
  Warning
</span>
```

### Alerts
```tsx
// Info alert
<div className="p-4 rounded-lg bg-info-50 border border-info-200
                dark:bg-info-900/20 dark:border-info-800">
  <p className="text-sm text-info-800 dark:text-info-200">
    Information message
  </p>
</div>

// Success alert
<div className="p-4 rounded-lg bg-success-50 border border-success-200
                dark:bg-success-900/20 dark:border-success-800">
  <p className="text-sm text-success-800 dark:text-success-200">
    Success message
  </p>
</div>
```

---

## 🎯 Best Practices

### 1. Use Semantic Colors
```tsx
// ✅ Good - Semantic
<button className="bg-primary-600">Primary Action</button>
<div className="bg-success-500">Success State</div>

// ❌ Bad - Arbitrary
<button className="bg-blue-600">Action</button>
<div className="bg-green-500">State</div>
```

### 2. Consistent Spacing
```tsx
// ✅ Good - Consistent scale
<div className="p-4 space-y-4">  {/* 16px */}
<div className="p-6 space-y-6">  {/* 24px */}

// ❌ Bad - Arbitrary values
<div className="p-[17px]">
```

### 3. Dark Mode Support
```tsx
// ✅ Good - Dark mode classes
<div className="bg-white dark:bg-neutral-950">
  <p className="text-gray-900 dark:text-white">Text</p>
</div>

// ❌ Bad - No dark mode
<div className="bg-white">
  <p className="text-gray-900">Text</p>
</div>
```

### 4. Typography Hierarchy
```tsx
// ✅ Good - Clear hierarchy
<h1 className="text-4xl font-bold">Main Title</h1>
<h2 className="text-3xl font-semibold">Subtitle</h2>
<p className="text-base">Body text</p>

// ❌ Bad - Unclear hierarchy
<h1 className="text-xl">Main Title</h1>
<h2 className="text-2xl font-bold">Subtitle</h2>
```

### 5. Hover & Focus States
```tsx
// ✅ Good - Interactive states
<button className="btn bg-primary-600 hover:bg-primary-700
                   focus:ring-2 focus:ring-primary-500">
  Button
</button>

// ❌ Bad - No feedback
<button className="btn bg-primary-600">
  Button
</button>
```

---

## 📦 Component Library

### Pre-built Components

All components use the design system:

- `ThemeToggle` - Theme switcher
- `Button` - Styled buttons
- `Card` - Content cards
- `Badge` - Labels and tags
- `Alert` - Notification messages
- `Input` - Form inputs
- `Select` - Dropdown selects
- `Checkbox` - Checkboxes
- `Radio` - Radio buttons

### Creating New Components

Follow these guidelines:

1. Use design system tokens (colors, spacing, etc.)
2. Support dark mode with `dark:` classes
3. Include hover/focus states
4. Use semantic HTML
5. Add proper ARIA labels
6. Test in both light and dark modes

---

## 🔧 Configuration Files

### Main Config: `tailwind.config.ts`
- Complete color palette
- Spacing scale
- Typography settings
- Border radius scale
- Shadows and animations
- Dark mode configuration

### CSS Variables: `src/styles/theme-vars.css`
- Dynamic color tokens
- Light/dark theme values
- Utility classes

### Global Styles: `src/styles/globals.css`
- Base styles
- Component classes
- Utility classes

### Theme Provider: `src/components/providers/ThemeProvider.tsx`
- System detection
- Manual toggle
- Persistence

---

## 🚀 Quick Start

### 1. Using in Components
```tsx
import { cn } from '@/styles/system/css-in-js';

export function MyComponent() {
  return (
    <div className={cn(
      'bg-white dark:bg-neutral-950',
      'rounded-xl shadow-md',
      'p-6 space-y-4'
    )}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Title
      </h2>
      <p className="text-gray-700 dark:text-gray-300">
        Content
      </p>
    </div>
  );
}
```

### 2. Adding Theme Toggle
```tsx
import { ThemeToggle } from '@/components/ui/ThemeToggle';

<ThemeToggle variant="full" />
```

### 3. Using Theme Hook
```tsx
import { useTheme } from '@/components/providers/ThemeProvider';

const { theme, resolvedTheme } = useTheme();
```

---

## ✅ Checklist

- [x] Color palette defined (primary, secondary, accent, neutral)
- [x] Consistent spacing scale
- [x] Typography system
- [x] Border radius scale
- [x] Shadows and effects
- [x] Dark mode with system detection
- [x] CSS custom properties
- [x] Theme provider component
- [x] Theme toggle component
- [x] Documentation complete

---

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Dark Mode Best Practices](https://web.dev/prefers-color-scheme/)
- [WCAG Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

---

**🎉 Design System Complete!**

Your application now has a comprehensive, production-ready design system with full dark mode support and consistent theming throughout.
