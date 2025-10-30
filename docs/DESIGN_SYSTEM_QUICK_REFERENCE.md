# Design System Quick Reference

A condensed reference for developers using our design system.

## 🎨 Colors

### Text
```jsx
text-gray-900 dark:text-gray-100   // Primary
text-gray-600 dark:text-gray-400   // Secondary
text-gray-500 dark:text-gray-500   // Tertiary
```

### Backgrounds
```jsx
bg-white dark:bg-gray-900         // Primary
bg-gray-50 dark:bg-gray-800       // Secondary
bg-gray-100 dark:bg-gray-700      // Tertiary
```

### Brand Colors
```jsx
bg-primary-600    // Blue
bg-secondary-500  // Green
bg-accent-500     // Orange
```

### Semantic
```jsx
text-success-600  // Green - 4.52:1 contrast
text-warning-600  // Orange - 5.13:1 contrast
text-error-600    // Red - 5.51:1 contrast
text-info-600     // Blue - 5.14:1 contrast
```

## 📝 Typography

### Sizes
```jsx
text-xs    // 12px - Labels
text-sm    // 14px - Captions
text-base  // 16px - Body (default)
text-lg    // 18px - Emphasized
text-xl    // 20px - Small headings
text-2xl   // 24px - Headings
text-3xl   // 30px - Page titles
text-4xl   // 36px - Large titles
text-5xl   // 48px - Hero headings
```

### Weights
```jsx
font-normal      // 400
font-medium      // 500
font-semibold    // 600
font-bold        // 700
font-extrabold   // 800
```

### Line Heights
```jsx
leading-tight    // 1.25
leading-normal   // 1.5 (default)
leading-relaxed  // 1.625
leading-loose    // 2
```

## 📏 Spacing (8px Grid)

```jsx
p-1   // 4px    m-1   // 4px
p-2   // 8px    m-2   // 8px
p-4   // 16px   m-4   // 16px
p-6   // 24px   m-6   // 24px
p-8   // 32px   m-8   // 32px
p-12  // 48px   m-12  // 48px
p-16  // 64px   m-16  // 64px
```

### Directional
```jsx
px-4  // Horizontal    mx-4  // Horizontal
py-4  // Vertical      my-4  // Vertical
pt-4  // Top           mt-4  // Top
pr-4  // Right         mr-4  // Right
pb-4  // Bottom        mb-4  // Bottom
pl-4  // Left          ml-4  // Left
```

## 🔘 Buttons

```jsx
// Primary
<button className="btn btn-primary">Submit</button>

// Secondary
<button className="btn btn-secondary">Cancel</button>

// Accent
<button className="btn btn-accent">Featured</button>

// Ghost
<button className="btn btn-ghost">Subtle</button>

// Sizes
<button className="btn btn-primary btn-sm">Small</button>
<button className="btn btn-primary">Default</button>
<button className="btn btn-primary btn-lg">Large</button>

// Disabled
<button className="btn btn-primary" disabled>Disabled</button>
```

## 📦 Cards

```jsx
<div className="card">
  <div className="card-header">
    <h3>Title</h3>
  </div>
  <div className="card-body">
    Content
  </div>
  <div className="card-footer">
    Actions
  </div>
</div>
```

## 🏷️ Badges

```jsx
<span className="badge badge-primary">New</span>
<span className="badge badge-success">Active</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-error">Error</span>
```

## 🚨 Alerts

```jsx
<div className="alert alert-info">Info message</div>
<div className="alert alert-success">Success message</div>
<div className="alert alert-warning">Warning message</div>
<div className="alert alert-error">Error message</div>
```

## 📐 Layout

### Container
```jsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
```

### Flexbox
```jsx
<div className="flex items-center justify-between gap-4">
<div className="flex flex-col md:flex-row">
```

### Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Responsive
```jsx
hidden sm:block          // Hide mobile, show tablet+
block md:hidden          // Show mobile, hide tablet+
text-sm md:text-base    // Responsive text size
p-4 md:p-6 lg:p-8      // Responsive padding
```

## 🌓 Dark Mode

```jsx
// Background & Text
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">

// Borders
<div className="border border-gray-200 dark:border-gray-700">

// Hover
<button className="hover:bg-gray-100 dark:hover:bg-gray-800">

// Theme Toggle
import ThemeToggle from '@/components/ThemeToggle';
<ThemeToggle variant="button" />
```

## ♿ Accessibility

### Focus Rings
```jsx
<button className="focus-ring">Default focus</button>
<button className="bg-primary-600 focus-ring-white">White focus</button>
```

### Screen Readers
```jsx
<span className="sr-only">Screen reader only</span>
<button aria-label="Close">×</button>
```

### Touch Targets (44x44px minimum)
```jsx
<button className="min-w-touch min-h-touch">
```

## 🎭 Animations

```jsx
// Transitions
transition-fast    // 150ms
transition-base    // 300ms
transition-slow    // 500ms

// Hover Effects
hover:-translate-y-1 hover:shadow-xl

// Animations
animate-fade-in
animate-bounce-in
animate-shimmer
```

## 🎨 Common Patterns

### Hero Section
```jsx
<section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-500">
  <div className="container mx-auto px-4">
    <h1 className="text-5xl font-extrabold text-white mb-4">
      Hero Title
    </h1>
  </div>
</section>
```

### Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="card hover:shadow-xl transition-all">
    <div className="card-body">
      <h3 className="text-xl font-semibold mb-2">Card Title</h3>
      <p className="text-gray-600 dark:text-gray-400">Description</p>
    </div>
  </div>
</div>
```

### Form
```jsx
<form className="space-y-4">
  <div className="input-group">
    <label htmlFor="email">Email</label>
    <input
      id="email"
      type="email"
      className="focus-ring"
      placeholder="you@example.com"
    />
  </div>
  <button type="submit" className="btn btn-primary w-full">
    Submit
  </button>
</form>
```

### Modal/Dialog
```jsx
<div className="fixed inset-0 z-modal-backdrop bg-black/50 flex items-center justify-center">
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4">
    <h2 className="text-2xl font-bold mb-4">Dialog Title</h2>
    <p className="text-gray-600 dark:text-gray-400 mb-6">Content</p>
    <div className="flex justify-end gap-3">
      <button className="btn btn-ghost">Cancel</button>
      <button className="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Navigation
```jsx
<nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      <div className="flex items-center gap-8">
        <a href="/" className="text-xl font-bold">Logo</a>
        <div className="hidden md:flex gap-6">
          <a href="/about" className="hover:text-primary-600">About</a>
          <a href="/contact" className="hover:text-primary-600">Contact</a>
        </div>
      </div>
      <ThemeToggle />
    </div>
  </div>
</nav>
```

## 🔧 Utilities

### Text Gradient
```jsx
<h1 className="text-gradient">Gradient Text</h1>
```

### Backdrop Blur
```jsx
<div className="backdrop-blur-glass">Frosted glass effect</div>
```

### Truncate
```jsx
<p className="line-clamp-2">Text truncated to 2 lines...</p>
<p className="line-clamp-3">Text truncated to 3 lines...</p>
```

### Scrollbar Hide
```jsx
<div className="scrollbar-hide overflow-x-auto">
```

## 📱 Responsive Breakpoints

```jsx
xs:   // 475px  - Extra small devices
sm:   // 640px  - Small tablets
md:   // 768px  - Tablets
lg:   // 1024px - Laptops
xl:   // 1280px - Desktops
2xl:  // 1536px - Large screens
```

## 🎯 Z-Index Layers

```jsx
z-dropdown        // 1000
z-sticky          // 1020
z-fixed           // 1030
z-modal-backdrop  // 1040
z-modal           // 1050
z-popover         // 1060
z-tooltip         // 1070
z-toast           // 1080
```

## 📊 Shadow Scale

```jsx
shadow-xs    // Subtle
shadow-sm    // Small
shadow-md    // Medium (default)
shadow-lg    // Large
shadow-xl    // Extra large
shadow-2xl   // 2X large
shadow-glow  // Glow effect
```

## 🔄 Border Radius

```jsx
rounded-none  // 0
rounded-sm    // 4px
rounded-md    // 6px
rounded-lg    // 8px
rounded-xl    // 12px
rounded-2xl   // 16px
rounded-3xl   // 24px
rounded-full  // 9999px (pill shape)
```

---

## 💡 Pro Tips

1. **Always use dark mode variants** for proper theme support
2. **Start mobile-first** with responsive design
3. **Use semantic HTML** with ARIA labels
4. **Ensure 44x44px minimum** for touch targets
5. **Test with keyboard navigation** and screen readers
6. **Use focus-ring utilities** for accessibility
7. **Prefer Tailwind utilities** over custom CSS
8. **Follow 8px grid** for consistent spacing

---

**Need more details?** Check the full [Design System Documentation](./DESIGN_SYSTEM.md)

