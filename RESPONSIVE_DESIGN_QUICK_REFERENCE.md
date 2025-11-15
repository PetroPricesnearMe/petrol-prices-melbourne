# Responsive Design Quick Reference

## 🎯 Breakpoints

```
xs  (default)   < 640px   Mobile
sm              ≥ 640px   Small Tablet
md              ≥ 768px   Tablet
lg              ≥ 1024px  Laptop
xl              ≥ 1280px  Desktop
2xl             ≥ 1536px  Large Desktop
```

## 📏 Common Patterns

### Responsive Grid

```jsx
// Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Responsive Text

```jsx
// Small to large
<h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">

// Body text
<p className="text-sm sm:text-base lg:text-lg">
```

### Responsive Spacing

```jsx
// Padding
<div className="p-4 sm:p-6 lg:p-8">

// Gap
<div className="gap-2 sm:gap-4 lg:gap-6">

// Margin
<div className="mb-4 sm:mb-6 lg:mb-8">
```

### Hide/Show Elements

```jsx
// Hide on mobile, show on desktop
<div className="hidden lg:block">

// Show on mobile, hide on desktop
<div className="block lg:hidden">

// Show only on tablet
<div className="hidden sm:block lg:hidden">
```

### Responsive Flexbox

```jsx
// Stack on mobile, row on desktop
<div className="flex flex-col lg:flex-row">

// Center on mobile, left-align on desktop
<div className="justify-center lg:justify-start">

// Full width on mobile, auto on desktop
<div className="w-full lg:w-auto">
```

## 👆 Touch-Friendly

```jsx
// Minimum 44px touch target
<button className="min-h-[44px] touch-manipulation">

// Active state feedback
<button className="active:scale-95 transition-transform">

// Larger tap areas on mobile
<a className="px-4 py-3 sm:px-3 sm:py-2">
```

## 🖼️ Responsive Images

```jsx
// Basic responsive image
<img
  src="/image.jpg"
  alt="Description"
  className="w-full h-auto"
  loading="lazy"
/>

// Picture element with sources
<picture>
  <source media="(min-width: 1024px)" srcSet="/desktop.jpg" />
  <source media="(min-width: 640px)" srcSet="/tablet.jpg" />
  <img src="/mobile.jpg" alt="Description" />
</picture>
```

## 🎨 Container Widths

```jsx
// Standard container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Narrow container (reading width)
<div className="max-w-4xl mx-auto px-4">

// Full width on mobile, contained on desktop
<div className="w-full lg:max-w-6xl lg:mx-auto">
```

## 📱 Common Layouts

### Mobile Menu

```jsx
// Desktop navigation
<nav className="hidden lg:flex space-x-6">
  {links.map(link => <Link to={link.path}>{link.label}</Link>)}
</nav>

// Mobile hamburger
<button className="lg:hidden">
  <MenuIcon />
</button>
```

### Card Grid

```jsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
  {items.map((item) => (
    <Card key={item.id} {...item} />
  ))}
</div>
```

### Hero Section

```jsx
<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
  <div className="order-2 lg:order-1">{/* Content */}</div>
  <div className="order-1 lg:order-2">{/* Image */}</div>
</div>
```

## 🪝 useResponsive Hook

```jsx
import { useResponsive } from '@/hooks/useResponsive';

function Component() {
  const { isMobile, isTablet, isDesktop, breakpoint } = useResponsive();

  return (
    <div>
      {isMobile && <MobileView />}
      {isDesktop && <DesktopView />}
      <p>Current: {breakpoint}</p>
    </div>
  );
}
```

## ⚡ Performance

```jsx
// Lazy load images
<img loading="lazy" decoding="async" />;

// Lazy load components
const Component = lazy(() => import('./Component'));

// Preload critical resources
<link rel="preload" as="image" href="/hero.jpg" />;
```

## ♿ Accessibility

```jsx
// Focus visible
<button className="focus:ring-4 focus:ring-primary-100 focus:outline-none">

// Screen reader only
<span className="sr-only">Descriptive text</span>

// ARIA attributes
<button aria-label="Close menu" aria-expanded={isOpen}>
```

## 🎭 Hover Effects

```jsx
// Desktop only hover
<div className="lg:hover:shadow-xl transition-shadow">

// Scale on hover
<button className="hover:scale-105 transition-transform">

// Color change
<a className="text-gray-600 hover:text-primary-600 transition-colors">
```

## 📐 Aspect Ratios

```jsx
// 16:9 aspect ratio
<div className="aspect-video">

// 1:1 square
<div className="aspect-square">

// Custom aspect ratio
<div className="aspect-[4/3]">
```

## 🔤 Typography Scale

```
text-xs     0.75rem   12px
text-sm     0.875rem  14px
text-base   1rem      16px
text-lg     1.125rem  18px
text-xl     1.25rem   20px
text-2xl    1.5rem    24px
text-3xl    1.875rem  30px
text-4xl    2.25rem   36px
text-5xl    3rem      48px
```

## 📏 Spacing Scale

```
space-0  0px
space-1  0.25rem  4px
space-2  0.5rem   8px
space-3  0.75rem  12px
space-4  1rem     16px
space-5  1.25rem  20px
space-6  1.5rem   24px
space-8  2rem     32px
space-10 2.5rem   40px
space-12 3rem     48px
```

## 🎨 Common Classes

```jsx
// Card
className =
  'bg-white rounded-2xl shadow-soft p-6 hover:shadow-strong transition-shadow';

// Button
className =
  'px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors min-h-[44px]';

// Input
className =
  'w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 min-h-[44px]';

// Badge
className =
  'inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium';
```

## 🧪 Testing Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run Lighthouse audit
npm run analyze

# Test on real devices
# Use Chrome DevTools Device Mode
# Or BrowserStack for real device testing
```

## 📱 Test Devices

```
iPhone SE      375 x 667
iPhone 12/13   390 x 844
Galaxy S21     360 x 800
iPad           768 x 1024
iPad Pro       1024 x 1366
Laptop         1366 x 768
Desktop        1920 x 1080
```

## 🚀 Quick Wins

1. **Add `touch-manipulation`** to all interactive elements
2. **Use `min-h-[44px]`** for touch targets
3. **Add `active:scale-95`** for tap feedback
4. **Use `loading="lazy"`** for images below fold
5. **Test on real mobile device** before deploying
6. **Use fluid typography** with responsive classes
7. **Implement `backdrop-blur`** for modern effects
8. **Add smooth transitions** with `transition-all duration-300`

## 🔗 Quick Links

- [Tailwind CSS Docs](https://tailwindcss.com)
- [Full Responsive Guide](./RESPONSIVE_DESIGN_GUIDE.md)
- [Component Examples](./src/components/)
- [Responsive Hooks](./src/hooks/useResponsive.js)
