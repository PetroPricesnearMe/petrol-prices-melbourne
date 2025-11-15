# Fluid Layout System - Quick Reference

One-page cheat sheet for the fluid layout and typography system.

---

## Grid Layouts

### Auto-Fit Grid Classes

```tsx
// Component classes with responsive gaps
<div className="grid-auto-fit-xs">   // 8rem min, 4-6px gaps
<div className="grid-auto-fit-sm">   // 12rem min, 4-6px gaps
<div className="grid-auto-fit-md">   // 16rem min, 4-8px gaps
<div className="grid-auto-fit-lg">   // 20rem min, 4-8px gaps
<div className="grid-auto-fit-xl">   // 24rem min, 6-8px gaps
<div className="card-grid">          // 18rem min, 4-8px gaps
```

### Tailwind Grid Utilities

```tsx
// Use directly in className
<div className="grid grid-cols-auto-fit-md gap-6">
<div className="grid grid-cols-auto-fill-lg gap-8">
```

---

## Flex Layouts

```tsx
<div className="flex-responsive">         // Flex wrap with 4-8px gaps
<div className="flex-responsive-center">  // Centered with gaps
<div className="flex-responsive-between"> // Space between
<div className="inline-flex-responsive">  // Inline flex with gaps
```

---

## Stack Layouts (Vertical)

```tsx
<div className="stack">      // 1rem gaps
<div className="stack-sm">   // 0.5-0.75rem gaps
<div className="stack-md">   // 1-1.5rem gaps
<div className="stack-lg">   // 1.5-2.5rem gaps
<div className="stack-xl">   // 2-4rem gaps
```

---

## Typography

### Fluid Headings (Auto-scaling)

```tsx
<h1 className="text-6xl">       // 40px → 60px
<h1 className="text-display-lg"> // 72px → 104px (hero)

text-2xl         // 20px → 24px
text-3xl         // 24px → 30px
text-4xl         // 30px → 36px
text-5xl         // 36px → 48px
text-6xl         // 40px → 60px
text-7xl         // 48px → 72px
text-8xl         // 60px → 96px
text-9xl         // 72px → 128px

text-display-sm  // 40px → 56px
text-display-md  // 56px → 80px
text-display-lg  // 72px → 104px
text-display-xl  // 96px → 144px
```

### Body Text (Fixed)

```tsx
text - xs; // 12px (fixed)
text - sm; // 14px (fixed)
text - base; // 16px (fixed)
text - lg; // 18px (fixed)
text - xl; // 20px (fixed)
```

### Fluid Body Text (Optional)

```tsx
.text-fluid-xs    // 12px → 14px
.text-fluid-sm    // 14px → 16px
.text-fluid-base  // 16px → 18px
.text-fluid-lg    // 18px → 20px
.text-fluid-xl    // 20px → 24px
```

### Typography Utilities

```tsx
<p className="text-measure">     // Max 65ch (optimal)
<p className="text-measure-sm">  // Max 50ch
<p className="text-measure-lg">  // Max 80ch
<h1 className="text-balance">    // Prevent orphans
```

---

## Spacing

### Fixed Spacing (4px increments)

```tsx
p - 4; // 16px
p - 8; // 32px
p - 12; // 48px
// Standard Tailwind scale
```

### Fluid Spacing (Tailwind Scale)

```tsx
p-fluid-xs   // 16px → 24px
p-fluid-sm   // 24px → 32px
p-fluid-md   // 32px → 48px
p-fluid-lg   // 48px → 64px
p-fluid-xl   // 64px → 96px
p-fluid-2xl  // 96px → 128px
p-fluid-3xl  // 128px → 192px
```

### Fluid Spacing (Utility Classes)

```tsx
.p-fluid   // 16px → 24px
.px-fluid  // Horizontal
.py-fluid  // Vertical
.m-fluid   // Margin
.mx-fluid  // Horizontal margin
.my-fluid  // Vertical margin
```

### Section Spacing

```tsx
<section className="section-spacing">     // 48px → 96px
<section className="section-spacing-sm">  // 32px → 48px
<section className="section-spacing-lg">  // 64px → 128px
```

### Content Spacing (Vertical Rhythm)

```tsx
<div className="content-spacing">     // 1.5rem between children
<div className="content-spacing-sm">  // 1rem
<div className="content-spacing-lg">  // 2rem
```

---

## Containers

```tsx
<div className="container">          // Max 1280px, responsive padding
<div className="container-fluid">    // Max 1440px, responsive padding
<div className="content-container">  // Max 1040px, optimal reading
```

---

## Gaps

### Fixed Gaps

```tsx
gap - 4; // 16px
gap - 6; // 24px
gap - 8; // 32px
```

### Fluid Gaps

```tsx
gap - fluid - xs; // 8px → 12px
gap - fluid - sm; // 12px → 16px
gap - fluid - md; // 16px → 24px
gap - fluid - lg; // 24px → 32px
gap - fluid - xl; // 32px → 48px
```

---

## Common Patterns

### Hero Section

```tsx
<section className="section-spacing-lg bg-gradient-to-br from-primary-600 to-secondary-600">
  <div className="container">
    <div className="stack-xl text-center text-white">
      <h1 className="text-display-lg text-balance">Hero Title</h1>
      <p className="text-fluid-xl text-measure mx-auto">Subtitle text</p>
      <div className="flex-responsive-center">
        <button>CTA</button>
      </div>
    </div>
  </div>
</section>
```

### Feature Grid

```tsx
<section className="section-spacing">
  <div className="container">
    <div className="stack-xl">
      <h2 className="text-balance text-center text-6xl">Features</h2>
      <div className="grid-auto-fit-md">
        {features.map((f) => (
          <div className="card p-fluid-md stack">
            <h3 className="text-2xl">{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

### Blog Article

```tsx
<article className="section-spacing">
  <div className="content-container">
    <header className="stack-lg">
      <h1 className="text-balance text-6xl">Article Title</h1>
      <div className="flex-responsive-between">
        <span>Author</span>
        <time>Date</time>
      </div>
    </header>
    <div className="content-spacing text-measure text-lg">
      <p>Content...</p>
    </div>
  </div>
</article>
```

### Card Grid

```tsx
<div className="card-grid">
  <div className="card p-fluid-md">Card 1</div>
  <div className="card p-fluid-md">Card 2</div>
  <div className="card p-fluid-md">Card 3</div>
</div>
```

---

## Best Practices

### ✅ DO

```tsx
// Use auto-fit for dynamic columns
<div className="grid-auto-fit-md">

// Prevent overflow with component classes
<div className="grid-auto-fit-lg">

// Balance headings
<h1 className="text-6xl text-balance">

// Optimal line length
<p className="text-measure">

// Consistent gaps
<div className="grid gap-4 sm:gap-6 lg:gap-8">
```

### ❌ DON'T

```tsx
// Don't use fixed columns on mobile
<div className="grid grid-cols-3">

// Don't forget to prevent overflow
<div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))' }}>

// Don't ignore line length
<p className="w-full">

// Don't use inconsistent gaps
<div className="grid gap-2 sm:gap-8 lg:gap-4">
```

---

## Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

---

## Browser Support

- Chrome/Edge 79+
- Firefox 75+
- Safari 13.1+
- Opera 66+

---

**For full documentation:** See [FLUID_LAYOUT_GUIDE.md](./FLUID_LAYOUT_GUIDE.md)
