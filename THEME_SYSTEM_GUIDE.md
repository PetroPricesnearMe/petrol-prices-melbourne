# Theme System Guide

Complete guide to the PPNM design system with brand colors, dark mode, and theming best practices.

## Table of Contents

- [Overview](#overview)
- [Color Palette](#color-palette)
- [Dark Mode Implementation](#dark-mode-implementation)
- [Design Tokens](#design-tokens)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)

---

## Overview

The PPNM theme system provides a comprehensive design foundation with:

- **Brand Color Palette**: Primary, Secondary, Accent, and Neutral colors
- **Dark Mode Support**: System detection and manual toggle
- **Semantic Tokens**: Context-aware colors that adapt to light/dark modes
- **Fluid Typography**: Responsive text sizing with clamp()
- **Consistent Spacing**: Extended spacing scale with fluid options
- **Rounded Corners**: Comprehensive border radius scale

---

## Color Palette

### Brand Colors

#### Primary (Blue)
Main brand color used for primary actions, links, and focus states.

```css
primary-50:  #eff6ff  /* Lightest */
primary-100: #dbeafe
primary-200: #bfdbfe
primary-300: #93c5fd
primary-400: #60a5fa
primary-500: #3b82f6  /* Main - Use for buttons, links */
primary-600: #2563eb
primary-700: #1d4ed8
primary-800: #1e40af
primary-900: #1e3a8a
primary-950: #172554  /* Darkest */
```

**Usage:**
```tsx
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  Primary Button
</button>
```

#### Secondary (Purple)
Accent brand color for secondary actions and visual variety.

```css
secondary-50:  #faf5ff
secondary-100: #f3e8ff
secondary-200: #e9d5ff
secondary-300: #d8b4fe
secondary-400: #c084fc
secondary-500: #a855f7  /* Main */
secondary-600: #9333ea
secondary-700: #7e22ce
secondary-800: #6b21a8
secondary-900: #581c87
secondary-950: #3b0764
```

**Usage:**
```tsx
<div className="bg-gradient-to-r from-primary-500 to-secondary-500">
  Gradient Background
</div>
```

#### Accent (Cyan/Teal)
Highlight color for CTAs, badges, and special elements.

```css
accent-50:  #ecfeff
accent-100: #cffafe
accent-200: #a5f3fc
accent-300: #67e8f9
accent-400: #22d3ee
accent-500: #06b6d4  /* Main */
accent-600: #0891b2
accent-700: #0e7490
accent-800: #155e75
accent-900: #164e63
accent-950: #083344
```

**Usage:**
```tsx
<span className="bg-accent-100 text-accent-800 px-2 py-1 rounded">
  Badge
</span>
```

#### Neutral (Gray)
Foundation colors for text, borders, and backgrounds.

```css
neutral-50:  #fafafa
neutral-100: #f5f5f5
neutral-200: #e5e5e5
neutral-300: #d4d4d4
neutral-400: #a3a3a3
neutral-500: #737373
neutral-600: #525252
neutral-700: #404040
neutral-800: #262626
neutral-900: #171717
neutral-950: #0a0a0a
```

---

## Dark Mode Implementation

### System Detection

The theme system automatically detects and respects the user's system preferences:

```typescript
// In src/styles/system/theme.ts
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';
```

### Manual Toggle

Users can override system preferences with manual theme selection:

```tsx
import { useTheme } from '@/components/providers/ThemeProvider';

function ThemeSwitcher() {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      {/* Simple toggle */}
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>

      {/* Specific theme selection */}
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  );
}
```

### Theme Toggle Component

Pre-built toggle component with multiple variants:

```tsx
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// Icon variant (default)
<ThemeToggle />

// With label
<ThemeToggle showLabel />

// Full variant (all three options)
<ThemeToggle variant="full" />

// Dropdown variant
<ThemeToggle variant="dropdown" />
```

---

## Design Tokens

### Semantic Colors

Use semantic tokens instead of hardcoded colors for automatic dark mode adaptation:

#### Background Colors

```tsx
/* Light Mode → Dark Mode */
bg-primary     /* white → #0a0a0a (main background) */
bg-secondary   /* #f9fafb → #171717 (sections) */
bg-tertiary    /* #f3f4f6 → #262626 (subtle backgrounds) */
bg-inverse     /* #111827 → white (inverse elements) */
```

**Usage:**
```tsx
<div className="bg-primary">
  Main content area
</div>

<div className="bg-secondary">
  Section background
</div>
```

#### Surface Colors (Cards & Panels)

```tsx
surface           /* Card backgrounds */
surface-secondary /* Nested cards */
surface-elevated  /* Modal/dialog backgrounds */
surface-overlay   /* Overlay backgrounds */
```

**Usage:**
```tsx
<div className="bg-surface rounded-lg shadow-md p-6">
  Card content
</div>
```

#### Text Colors

```tsx
text-primary   /* Main text */
text-secondary /* Muted text */
text-tertiary  /* Subtle text */
text-inverse   /* Contrast text */
```

**Usage:**
```tsx
<h1 className="text-text-primary">Heading</h1>
<p className="text-text-secondary">Description</p>
<span className="text-text-tertiary">Subtle note</span>
```

#### Border Colors

```tsx
border-default   /* Standard borders */
border-secondary /* Lighter borders */
border-strong    /* Emphasized borders */
```

**Usage:**
```tsx
<div className="border border-default rounded-lg">
  Bordered element
</div>
```

### State Colors

Consistent colors for different states:

```tsx
/* Success - Green */
bg-success-50 text-success-700  /* Light mode */
bg-success-900 text-success-100 /* Dark mode */

/* Warning - Amber/Orange */
bg-warning-50 text-warning-700
bg-warning-900 text-warning-100

/* Error - Red */
bg-error-50 text-error-700
bg-error-900 text-error-100

/* Info - Blue */
bg-info-50 text-info-700
bg-info-900 text-info-100
```

**Usage:**
```tsx
{/* Success Message */}
<div className="bg-success-50 dark:bg-success-900 text-success-700 dark:text-success-100 p-4 rounded">
  Success! Your changes have been saved.
</div>

{/* Error Message */}
<div className="bg-error-50 dark:bg-error-900 text-error-700 dark:text-error-100 p-4 rounded">
  Error: Something went wrong.
</div>
```

---

## Typography Scale

### Fluid Typography

Text sizes that scale smoothly across breakpoints:

```tsx
/* Fixed sizes - Body text */
text-xs    /* 12px */
text-sm    /* 14px */
text-base  /* 16px - Default body text */
text-lg    /* 18px */
text-xl    /* 20px */

/* Fluid sizes - Headings (automatically responsive) */
text-2xl   /* 20px → 24px */
text-3xl   /* 24px → 30px */
text-4xl   /* 30px → 36px */
text-5xl   /* 36px → 48px */
text-6xl   /* 40px → 60px */
text-7xl   /* 48px → 72px */
text-8xl   /* 60px → 96px */
text-9xl   /* 72px → 128px */

/* Display sizes - Hero sections */
text-display-sm  /* 40px → 56px */
text-display-md  /* 56px → 80px */
text-display-lg  /* 72px → 104px */
text-display-xl  /* 96px → 144px */
```

**Usage:**
```tsx
<h1 className="text-5xl font-bold text-text-primary">
  Main Heading
</h1>

<h2 className="text-3xl font-semibold text-text-primary">
  Subheading
</h2>

<p className="text-base text-text-secondary">
  Body text with optimal readability
</p>
```

### Font Weights

```tsx
font-thin       /* 100 */
font-extralight /* 200 */
font-light      /* 300 */
font-normal     /* 400 - Body text default */
font-medium     /* 500 - Buttons, labels */
font-semibold   /* 600 - Subheadings */
font-bold       /* 700 - Headings */
font-extrabold  /* 800 - Important headings */
font-black      /* 900 - Display text */
```

---

## Spacing Scale

### Standard Spacing

Extended spacing scale from Tailwind defaults:

```tsx
/* Micro spacing */
space-0.5  /* 2px */
space-1    /* 4px */
space-1.5  /* 6px */
space-2    /* 8px */
space-2.5  /* 10px */
space-3    /* 12px */
space-4    /* 16px */
space-5    /* 20px */
space-6    /* 24px */
space-8    /* 32px */
space-10   /* 40px */
space-12   /* 48px */
space-16   /* 64px */
space-20   /* 80px */
space-24   /* 96px */
space-32   /* 128px */

/* Extended spacing */
space-40   /* 160px */
space-48   /* 192px */
space-56   /* 224px */
space-64   /* 256px */
```

### Fluid Spacing

Responsive spacing that scales with viewport:

```tsx
space-fluid-xs  /* 16px → 24px */
space-fluid-sm  /* 24px → 32px */
space-fluid-md  /* 32px → 48px */
space-fluid-lg  /* 48px → 64px */
space-fluid-xl  /* 64px → 96px */
space-fluid-2xl /* 96px → 128px */
space-fluid-3xl /* 128px → 192px */
```

**Usage:**
```tsx
{/* Section with fluid padding */}
<section className="py-fluid-lg px-4">
  Content
</section>

{/* Stack with fluid gap */}
<div className="flex flex-col gap-fluid-md">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

## Border Radius Scale

Comprehensive rounded corner options:

```tsx
rounded-none   /* 0 */
rounded-sm     /* 4px */
rounded        /* 6px - Default */
rounded-md     /* 8px */
rounded-lg     /* 12px - Cards */
rounded-xl     /* 16px - Large cards */
rounded-2xl    /* 20px */
rounded-3xl    /* 24px */
rounded-4xl    /* 32px */
rounded-5xl    /* 40px */
rounded-full   /* 9999px - Circles */
```

**Usage:**
```tsx
<div className="bg-surface rounded-lg">Card</div>
<button className="rounded-md">Button</button>
<img className="rounded-full" src="..." alt="Avatar" />
```

---

## Usage Examples

### Complete Card Component

```tsx
function Card({ title, description, children }) {
  return (
    <div className="
      bg-surface
      border border-default
      rounded-lg
      shadow-md
      hover:shadow-lg
      transition-shadow
      duration-200
      p-6
    ">
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-text-secondary mb-4">
        {description}
      </p>
      {children}
    </div>
  );
}
```

### Themed Button

```tsx
function Button({ variant = 'primary', children, ...props }) {
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950',
  };

  return (
    <button
      className={`
        ${variants[variant]}
        px-4 py-2
        rounded-lg
        font-medium
        transition-colors
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-primary-500
        focus:ring-offset-2
      `}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Alert Component

```tsx
function Alert({ type = 'info', children }) {
  const styles = {
    success: 'bg-success-50 dark:bg-success-900 text-success-700 dark:text-success-100 border-success-200 dark:border-success-700',
    warning: 'bg-warning-50 dark:bg-warning-900 text-warning-700 dark:text-warning-100 border-warning-200 dark:border-warning-700',
    error: 'bg-error-50 dark:bg-error-900 text-error-700 dark:text-error-100 border-error-200 dark:border-error-700',
    info: 'bg-info-50 dark:bg-info-900 text-info-700 dark:text-info-100 border-info-200 dark:border-info-700',
  };

  return (
    <div className={`
      ${styles[type]}
      p-4
      rounded-lg
      border
      flex items-start gap-3
    `}>
      {children}
    </div>
  );
}
```

### Page Layout

```tsx
function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-primary dark:bg-neutral-950">
      <nav className="bg-surface border-b border-default">
        {/* Navigation content */}
      </nav>

      <main className="container mx-auto px-4 py-fluid-lg">
        {children}
      </main>

      <footer className="bg-secondary border-t border-default">
        {/* Footer content */}
      </footer>
    </div>
  );
}
```

---

## Best Practices

### 1. Use Semantic Tokens

✅ **DO:**
```tsx
<div className="bg-surface text-text-primary border-default">
  Content
</div>
```

❌ **DON'T:**
```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
  Content
</div>
```

### 2. Prefer Fluid Scales for Responsive Design

✅ **DO:**
```tsx
<h1 className="text-5xl font-bold">Hero Title</h1>
<section className="py-fluid-lg">Content</section>
```

❌ **DON'T:**
```tsx
<h1 className="text-2xl md:text-4xl lg:text-6xl font-bold">Hero Title</h1>
<section className="py-8 md:py-12 lg:py-16">Content</section>
```

### 3. Use Brand Colors Consistently

- **Primary**: Main actions, CTAs, links, focus states
- **Secondary**: Accents, visual variety, secondary actions
- **Accent**: Highlights, badges, special elements
- **Neutral**: Text, borders, backgrounds

### 4. Maintain Proper Contrast

Always ensure text meets WCAG AA contrast standards:

```tsx
{/* Good contrast */}
<p className="text-text-primary bg-primary">High contrast text</p>

{/* Test contrast for custom combinations */}
<p className="text-primary-700 dark:text-primary-300">Accessible text</p>
```

### 5. Leverage CSS Custom Properties

For complex themes or dynamic values:

```css
.custom-component {
  background-color: rgb(var(--color-surface-primary));
  color: rgb(var(--color-text-primary));
  border-color: rgb(var(--color-border));
}
```

---

## Testing Dark Mode

### 1. Manual Testing

Use the theme toggle component to test both modes:

```tsx
<ThemeToggle variant="full" />
```

### 2. System Preference Testing

Change your OS theme preference and set theme to "system":

```tsx
const { setTheme } = useTheme();
setTheme('system');
```

### 3. Browser DevTools

Chrome/Firefox: DevTools → Rendering → Emulate CSS media feature `prefers-color-scheme`

---

## Advanced Customization

### Custom Theme Colors

To add custom colors to your theme:

```typescript
// tailwind.config.ts
colors: {
  brand: {
    light: '#your-color',
    DEFAULT: '#your-color',
    dark: '#your-color',
  }
}
```

### Custom CSS Variables

Add to `src/styles/theme-vars.css`:

```css
:root {
  --custom-color: 255 0 0;
}

.dark {
  --custom-color: 0 255 0;
}
```

Use in components:

```tsx
<div style={{ color: 'rgb(var(--custom-color))' }}>
  Custom colored text
</div>
```

---

## Quick Reference

### Color Classes

| Purpose | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Main background | `bg-primary` | `bg-neutral-950` |
| Card background | `bg-surface` | `bg-neutral-900` |
| Primary text | `text-text-primary` | `text-neutral-50` |
| Secondary text | `text-text-secondary` | `text-neutral-400` |
| Border | `border-default` | `border-neutral-800` |
| Primary button | `bg-primary-500` | `bg-primary-600` |

### Typography Classes

| Element | Class |
|---------|-------|
| Display heading | `text-display-lg font-black` |
| Page heading | `text-5xl font-bold` |
| Section heading | `text-3xl font-semibold` |
| Subsection | `text-2xl font-semibold` |
| Body text | `text-base` |
| Small text | `text-sm text-text-secondary` |

### Component Patterns

**Card:**
```tsx
className="bg-surface border border-default rounded-lg shadow-md p-6"
```

**Button:**
```tsx
className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg"
```

**Input:**
```tsx
className="bg-primary border border-default rounded-md px-3 py-2 text-text-primary"
```

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PPNM Component Library](./COMPONENT_ARCHITECTURE.md)
- [Accessibility Guide](./ACCESSIBILITY_GUIDE.md)
- [Design System Guide](./DESIGN_SYSTEM_GUIDE.md)

---

**Last Updated:** October 2024
**Version:** 1.0.0
