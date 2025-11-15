# Fluid Layout & Typography System Guide

Complete guide for implementing responsive, fluid layouts and typography using Tailwind CSS utilities.

---

## Table of Contents

1. [Overview](#overview)
2. [Grid & Flex Layout System](#grid--flex-layout-system)
3. [Fluid Typography](#fluid-typography)
4. [Fluid Spacing Scale](#fluid-spacing-scale)
5. [Best Practices](#best-practices)
6. [Examples](#examples)

---

## Overview

This system provides:

- **Responsive Grid Layouts** with `auto-fit` and `minmax()` for dynamic column adjustment
- **Fluid Typography** using `clamp()` for smooth text scaling across breakpoints
- **Consistent Spacing** with fluid padding and gaps that prevent overflow
- **Balanced Vertical Rhythm** for improved readability

### Key Principles

1. **Mobile-First**: Start with mobile layout, enhance for larger screens
2. **No Overflow**: Use `min()` function to prevent content from breaking on small screens
3. **Visual Rhythm**: Maintain consistent spacing ratios across breakpoints
4. **Readability**: Optimal line length (65ch) and line height for long-form content

---

## Grid & Flex Layout System

### Auto-Fit Grid Layouts

These grids automatically adjust the number of columns based on available space:

#### Tailwind Config Classes

```tsx
// Direct Tailwind utilities
<div className="grid-cols-auto-fit-md grid gap-6">
  {/* Cards will automatically flow into columns */}
</div>
```

Available sizes:

- `grid-cols-auto-fit-xs` - 8rem (128px) minimum
- `grid-cols-auto-fit-sm` - 12rem (192px) minimum
- `grid-cols-auto-fit-md` - 16rem (256px) minimum
- `grid-cols-auto-fit-lg` - 20rem (320px) minimum
- `grid-cols-auto-fit-xl` - 24rem (384px) minimum
- `grid-cols-auto-fit-2xl` - 28rem (448px) minimum

#### Component Classes

Pre-configured grid layouts with responsive gaps:

```tsx
// Responsive grid with consistent gaps
<div className="grid-auto-fit-md">
  <Card />
  <Card />
  <Card />
</div>
```

Available classes:

- `.grid-auto-fit-xs` - Smallest cards with 4-6px gaps
- `.grid-auto-fit-sm` - Small cards with 4-6px gaps
- `.grid-auto-fit-md` - Medium cards with 4-8px gaps
- `.grid-auto-fit-lg` - Large cards with 4-8px gaps
- `.grid-auto-fit-xl` - Extra large cards with 6-8px gaps

### Auto-Fill vs Auto-Fit

**Auto-Fit**: Expands columns to fill available space

```tsx
<div className="grid-cols-auto-fit-md grid">
  {/* Columns stretch to fill container */}
</div>
```

**Auto-Fill**: Creates as many columns as possible, even empty ones

```tsx
<div className="grid-cols-auto-fill-md grid">
  {/* Maintains column width, may leave gaps */}
</div>
```

### Fluid Gap Spacing

Gaps that scale smoothly with viewport:

```tsx
// Tailwind utilities with clamp()
<div className="gap-fluid-md grid grid-cols-3">{/* Gap: 16px → 24px */}</div>
```

Available gaps:

- `gap-fluid-xs` - 8px → 12px
- `gap-fluid-sm` - 12px → 16px
- `gap-fluid-md` - 16px → 24px
- `gap-fluid-lg` - 24px → 32px
- `gap-fluid-xl` - 32px → 48px

### Flex Layout Utilities

#### Component Classes

```tsx
// Responsive flex with automatic wrapping
<div className="flex-responsive">
  <Card />
  <Card />
</div>

// Centered with responsive gaps
<div className="flex-responsive-center">
  <Button />
  <Button />
</div>

// Space between with wrapping
<div className="flex-responsive-between">
  <div>Left content</div>
  <div>Right content</div>
</div>
```

### Stack Layouts

Vertical stacking with consistent spacing:

```tsx
// Standard stack
<div className="stack">
  <h2>Heading</h2>
  <p>Content</p>
</div>

// Small gaps
<div className="stack-sm">
  <label>Label</label>
  <input />
</div>

// Large gaps
<div className="stack-lg">
  <Section />
  <Section />
</div>

// Extra large gaps
<div className="stack-xl">
  <Hero />
  <Features />
  <Testimonials />
</div>
```

### Card Grid

Pre-configured card grid that prevents overflow:

```tsx
<div className="card-grid">
  <Card />
  <Card />
  <Card />
  {/* Automatically adjusts columns, minimum 18rem (288px) */}
</div>
```

### Container Utilities

```tsx
// Standard container (max-width: 1280px)
<div className="container">
  <Content />
</div>

// Fluid container (max-width: 1440px with breathing room)
<div className="container-fluid">
  <Content />
</div>

// Content container (max-width: 1040px, optimal for reading)
<div className="content-container">
  <Article />
</div>
```

---

## Fluid Typography

### Heading Sizes with clamp()

All heading sizes scale smoothly from mobile to desktop:

```tsx
// Fluid headings - automatically scale
<h1 className="text-6xl">Display Heading</h1>
<h2 className="text-5xl">Section Title</h2>
<h3 className="text-4xl">Subsection</h3>
<h4 className="text-3xl">Card Title</h4>
<h5 className="text-2xl">Small Heading</h5>
```

**Scaling Ranges:**

- `text-2xl` - 20px → 24px
- `text-3xl` - 24px → 30px
- `text-4xl` - 30px → 36px
- `text-5xl` - 36px → 48px
- `text-6xl` - 40px → 60px
- `text-7xl` - 48px → 72px
- `text-8xl` - 60px → 96px
- `text-9xl` - 72px → 128px

### Display Sizes (Hero Sections)

Extra large, highly fluid sizes for hero sections:

```tsx
<h1 className="text-display-lg">Huge Hero Title</h1>
```

**Display Scales:**

- `text-display-sm` - 40px → 56px
- `text-display-md` - 56px → 80px
- `text-display-lg` - 72px → 104px
- `text-display-xl` - 96px → 144px

### Body Text Sizes

Fixed sizes for consistent body text:

```tsx
<p className="text-base">Standard paragraph</p>
<p className="text-lg">Larger body text</p>
<small className="text-sm">Fine print</small>
```

**Fixed Sizes:**

- `text-xs` - 12px (fixed)
- `text-sm` - 14px (fixed)
- `text-base` - 16px (fixed)
- `text-lg` - 18px (fixed)
- `text-xl` - 20px (fixed)

### Fluid Body Text (Optional)

For body text that needs to scale:

```tsx
<p className="text-fluid-base">This paragraph scales smoothly: 16px → 18px</p>
```

**Fluid Body Scales:**

- `.text-fluid-xs` - 12px → 14px
- `.text-fluid-sm` - 14px → 16px
- `.text-fluid-base` - 16px → 18px
- `.text-fluid-lg` - 18px → 20px
- `.text-fluid-xl` - 20px → 24px

### Optimal Line Length

Maintain readability with optimal character count per line:

```tsx
// Standard measure (65 characters)
<p className="text-measure">
  Long-form content with optimal readability
</p>

// Narrow measure (50 characters)
<aside className="text-measure-sm">
  Sidebar content
</aside>

// Wide measure (80 characters)
<article className="text-measure-lg">
  Wide article content
</article>
```

### Text Balance

Prevent orphaned words in headings:

```tsx
<h1 className="text-balance text-6xl">Beautiful Heading That Wraps Nicely</h1>
```

---

## Fluid Spacing Scale

### Fixed Spacing

Standard Tailwind spacing scale (4px increments):

```tsx
<div className="p-4">Padding: 16px</div>
<div className="p-8">Padding: 32px</div>
<div className="p-12">Padding: 48px</div>
```

### Fluid Spacing

Spacing that scales with viewport using `clamp()`:

```tsx
// Fluid padding (individual utilities)
<div className="p-fluid">Padding scales 16px → 24px</div>
<div className="px-fluid">Horizontal padding scales</div>
<div className="py-fluid">Vertical padding scales</div>

// Fluid margin
<div className="m-fluid">Margin scales 16px → 24px</div>
<div className="mx-fluid">Horizontal margin scales</div>
<div className="my-fluid">Vertical margin scales</div>
```

### Tailwind Fluid Spacing Scale

Use in Tailwind classes:

```tsx
<div className="p-fluid-md">
  Padding: 32px → 48px
</div>

<div className="mt-fluid-lg mb-fluid-xl">
  Different top and bottom spacing
</div>
```

**Available Scales:**

- `fluid-xs` - 16px → 24px
- `fluid-sm` - 24px → 32px
- `fluid-md` - 32px → 48px
- `fluid-lg` - 48px → 64px
- `fluid-xl` - 64px → 96px
- `fluid-2xl` - 96px → 128px
- `fluid-3xl` - 128px → 192px

### Section Spacing

Pre-configured spacing for page sections:

```tsx
// Standard section spacing
<section className="section-spacing">
  <Content />
</section>

// Small section spacing
<section className="section-spacing-sm">
  <Content />
</section>

// Large section spacing
<section className="section-spacing-lg">
  <Content />
</section>
```

**Spacing Scales:**

- `.section-spacing-sm` - 32px → 48px (top/bottom)
- `.section-spacing` - 48px → 96px (top/bottom)
- `.section-spacing-lg` - 64px → 128px (top/bottom)

### Content Spacing (Vertical Rhythm)

Automatic spacing between child elements:

```tsx
// Standard rhythm
<div className="content-spacing">
  <h2>Heading</h2>
  <p>Paragraph</p>
  <p>Another paragraph</p>
  {/* Each element has 1.5rem top margin */}
</div>

// Small rhythm
<div className="content-spacing-sm">
  {/* 1rem between elements */}
</div>

// Large rhythm
<div className="content-spacing-lg">
  {/* 2rem between elements */}
</div>
```

---

## Best Practices

### 1. Mobile-First Approach

Always design for mobile first, then enhance:

```tsx
// ✅ Good: Mobile-first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <Card />
</div>

// ❌ Bad: Desktop-first
<div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
  <Card />
</div>
```

### 2. Prevent Overflow

Use `min()` or responsive grid classes:

```tsx
// ✅ Good: Prevents overflow
<div className="grid-auto-fit-md">
  <Card />
</div>

// ✅ Good: Manual with min()
<div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(16rem, 100%), 1fr))' }}>
  <Card />
</div>

// ❌ Bad: Can overflow on mobile
<div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))' }}>
  <Card />
</div>
```

### 3. Consistent Spacing

Maintain spacing ratios across breakpoints:

```tsx
// ✅ Good: Proportional scaling
<div className="grid gap-4 sm:gap-6 lg:gap-8">
  {/* Gaps scale proportionally */}
</div>

// ❌ Bad: Inconsistent scaling
<div className="grid gap-2 sm:gap-8 lg:gap-4">
  {/* Gaps jump erratically */}
</div>
```

### 4. Readable Typography

Ensure proper line length and height:

```tsx
// ✅ Good: Optimal readability
<article className="text-base text-measure leading-relaxed">
  <p>Long-form content...</p>
</article>

// ❌ Bad: Too wide
<article className="text-base w-full">
  <p>Content spans entire screen...</p>
</article>
```

### 5. Balanced Headings

Prevent orphaned words:

```tsx
// ✅ Good: Balanced text wrapping
<h1 className="text-6xl text-balance">
  A Beautiful Multi-Line Heading
</h1>

// ❌ Bad: Can create orphans
<h1 className="text-6xl">
  A Beautiful Multi-Line Heading
</h1>
```

### 6. Appropriate Scales

Use the right scale for the context:

```tsx
// ✅ Good: Display for hero
<h1 className="text-display-lg">Hero Title</h1>

// ✅ Good: Standard for sections
<h2 className="text-4xl">Section Title</h2>

// ❌ Bad: Too large for body
<p className="text-display-md">Regular paragraph</p>
```

---

## Examples

### Example 1: Responsive Card Grid

```tsx
function ProductGrid({ products }) {
  return (
    <section className="section-spacing">
      <div className="container">
        <h2 className="mb-8 text-balance text-5xl">Featured Products</h2>

        <div className="grid-auto-fit-lg">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Features:**

- Fluid section spacing
- Balanced heading
- Auto-fit grid with 320px minimum cards
- Consistent gaps that scale

### Example 2: Hero Section with Fluid Typography

```tsx
function Hero() {
  return (
    <section className="section-spacing-lg bg-gradient-to-br from-primary-600 to-secondary-600">
      <div className="container">
        <div className="stack-xl text-center text-white">
          <h1 className="text-display-xl text-balance">
            Scale Your Business Today
          </h1>

          <p className="text-fluid-xl text-measure mx-auto">
            Join thousands of companies using our platform
          </p>

          <div className="flex-responsive-center">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Features:**

- Extra large display text (96px → 144px)
- Fluid paragraph that scales
- Optimal line length
- Responsive button layout

### Example 3: Blog Article with Optimal Readability

```tsx
function BlogPost({ post }) {
  return (
    <article className="section-spacing">
      <div className="content-container">
        <header className="stack-lg mb-fluid-lg">
          <h1 className="text-balance text-6xl">{post.title}</h1>

          <div className="flex-responsive-between text-gray-600">
            <span>{post.author}</span>
            <time>{post.date}</time>
          </div>
        </header>

        <div className="content-spacing text-measure text-lg leading-relaxed">
          <p>{post.excerpt}</p>
          {/* More content */}
        </div>
      </div>
    </article>
  );
}
```

**Features:**

- Content container (1040px max)
- Optimal line length (65ch)
- Balanced heading
- Proper vertical rhythm
- Fluid spacing

### Example 4: Feature Grid with Icons

```tsx
function Features() {
  return (
    <section className="section-spacing bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="stack-xl">
          <header className="stack text-center">
            <h2 className="text-balance text-6xl">Why Choose Us</h2>
            <p className="text-measure mx-auto text-xl text-gray-600 dark:text-gray-400">
              Everything you need to succeed
            </p>
          </header>

          <div className="grid-auto-fit-md">
            {features.map((feature) => (
              <div key={feature.id} className="card p-fluid-md stack">
                <div className="text-5xl">{feature.icon}</div>
                <h3 className="text-2xl">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Features:**

- Fluid section spacing
- Auto-fit grid (256px minimum)
- Fluid card padding
- Consistent stack spacing

### Example 5: Responsive Navigation

```tsx
function Navigation() {
  return (
    <nav className="py-fluid-sm px-fluid">
      <div className="container">
        <div className="flex-responsive-between">
          <Logo />

          <div className="inline-flex-responsive">
            <NavLink href="/about">About</NavLink>
            <NavLink href="/services">Services</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>

          <Button>Get Started</Button>
        </div>
      </div>
    </nav>
  );
}
```

**Features:**

- Fluid vertical padding
- Responsive flex layout
- Consistent gaps that wrap gracefully

---

## Quick Reference

### Grid Classes

| Class              | Description       | Min Width | Gaps  |
| ------------------ | ----------------- | --------- | ----- |
| `grid-auto-fit-xs` | Extra small cards | 8rem      | 4-6px |
| `grid-auto-fit-sm` | Small cards       | 12rem     | 4-6px |
| `grid-auto-fit-md` | Medium cards      | 16rem     | 4-8px |
| `grid-auto-fit-lg` | Large cards       | 20rem     | 4-8px |
| `grid-auto-fit-xl` | Extra large cards | 24rem     | 6-8px |
| `card-grid`        | Optimized cards   | 18rem     | 4-8px |

### Typography Classes

| Class             | Size Range   | Use Case       |
| ----------------- | ------------ | -------------- |
| `text-2xl`        | 20px → 24px  | Small headings |
| `text-4xl`        | 30px → 36px  | Section titles |
| `text-6xl`        | 40px → 60px  | Page titles    |
| `text-display-lg` | 72px → 104px | Hero headings  |
| `text-measure`    | 65ch         | Body text      |
| `text-balance`    | —            | Headings       |

### Spacing Classes

| Class             | Size Range  | Use Case         |
| ----------------- | ----------- | ---------------- |
| `fluid-xs`        | 16px → 24px | Compact spacing  |
| `fluid-md`        | 32px → 48px | Standard spacing |
| `fluid-xl`        | 64px → 96px | Large spacing    |
| `section-spacing` | 48px → 96px | Page sections    |
| `p-fluid`         | 16px → 24px | Card padding     |

### Layout Classes

| Class               | Description                 |
| ------------------- | --------------------------- |
| `container`         | Max 1280px with padding     |
| `container-fluid`   | Max 1440px with padding     |
| `content-container` | Max 1040px, optimal reading |
| `stack`             | Vertical spacing (1rem)     |
| `stack-lg`          | Large vertical spacing      |
| `flex-responsive`   | Wrapping flex with gaps     |

---

## Browser Support

All features are supported in modern browsers:

- Chrome/Edge 79+
- Firefox 75+
- Safari 13.1+
- Opera 66+

For older browsers, graceful degradation occurs with fallback to base sizes.

---

## Related Documentation

- [Tailwind CSS Configuration](./tailwind.config.ts)
- [Global Styles](./src/styles/globals.css)
- [Responsive Design Guide](./RESPONSIVE_DESIGN_GUIDE.md)
- [Component Architecture](./COMPONENT_ARCHITECTURE.md)

---

**Last Updated:** October 2025
