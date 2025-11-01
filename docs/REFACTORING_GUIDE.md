# Component Refactoring Guide

Step-by-step guide to refactor existing components to use the new styling architecture.

## Table of Contents

1. [Overview](#overview)
2. [Refactoring Checklist](#refactoring-checklist)
3. [Step-by-Step Process](#step-by-step-process)
4. [Common Patterns](#common-patterns)
5. [Before & After Examples](#before--after-examples)
6. [Testing Refactored Components](#testing-refactored-components)

## Overview

### Benefits of Refactoring

- ✅ Eliminate separate CSS files
- ✅ Type-safe styling with autocomplete
- ✅ Automatic dark mode support
- ✅ Built-in accessibility features
- ✅ Print-ready styles
- ✅ Performance optimizations
- ✅ Reduced bundle size
- ✅ Consistent design system

### What Gets Refactored

- Component-specific CSS files → Tailwind utilities
- Inline styles → Utility classes or pattern functions
- Custom animations → Animation system
- Media queries → Responsive utilities
- Theme variables → Dark mode classes

## Refactoring Checklist

### Pre-Refactoring

- [ ] Review component functionality
- [ ] Identify all styling dependencies
- [ ] Note any custom animations
- [ ] Check for theme-specific styles
- [ ] Document current behavior
- [ ] Ensure tests exist

### During Refactoring

- [ ] Replace CSS imports with utility imports
- [ ] Convert class names to utility classes
- [ ] Add dark mode variants
- [ ] Include accessibility utilities
- [ ] Add print styles if applicable
- [ ] Use pattern utilities for common patterns
- [ ] Apply animations with reduced motion support

### Post-Refactoring

- [ ] Test visual appearance
- [ ] Test dark mode
- [ ] Test responsive breakpoints
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Test print layout
- [ ] Update component documentation
- [ ] Delete old CSS file

## Step-by-Step Process

### Step 1: Analyze Current Component

```tsx
// BEFORE: components/StationCards.js
import './StationCards.css';

export function StationCard({ station }) {
  return (
    <div className="station-card">
      <div className="card-header">
        <h3>{station.name}</h3>
        <span className="distance-badge">{station.distance} km</span>
      </div>
      <div className="card-body">
        <p>{station.address}</p>
      </div>
    </div>
  );
}
```

```css
/* StationCards.css */
.station-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.station-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.distance-badge {
  background: #3b82f6;
  color: white;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 14px;
}
```

### Step 2: Plan Replacement Strategy

| Old CSS Property | New Utility/Pattern |
|-----------------|---------------------|
| `background: white` | `bg-white dark:bg-gray-800` |
| `border-radius: 12px` | `rounded-xl` |
| `padding: 20px` | `p-6` |
| `box-shadow` | `shadow-sm hover:shadow-xl` |
| `display: flex; justify-content: space-between` | `flex-between` |
| Custom badge | `badge badge-primary` |

### Step 3: Implement Refactored Component

```tsx
// AFTER: components/StationCard.tsx
import { cn, patterns, animations } from '@/styles/system/css-in-js';

interface StationCardProps {
  station: {
    name: string;
    address: string;
    distance: number;
  };
}

export function StationCard({ station }: StationCardProps) {
  return (
    <div className={cn(
      'card-hover',  // Includes all base card styles + hover effect
      'print-avoid-break'  // Bonus: print optimization
    )}>
      {/* Header */}
      <div className={cn(
        patterns.flex.between,
        'p-6 border-b border-gray-200 dark:border-gray-700'
      )}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {station.name}
        </h3>
        <span className="badge badge-primary">
          {station.distance} km
        </span>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-400">
          {station.address}
        </p>
      </div>
    </div>
  );
}
```

### Step 4: Add Enhancements

```tsx
// Enhanced version with animations, loading states, etc.
export function StationCard({ station, isLoading }: StationCardProps & { isLoading?: boolean }) {
  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className={cn(
      'card-hover',
      animations.safe('animate-fade-in'),
      'print-avoid-break'
    )}>
      {/* ... rest of component */}
    </div>
  );
}
```

### Step 5: Delete Old Files

```bash
# Remove old CSS file
rm components/StationCards.css

# Update imports in other files if needed
```

## Common Patterns

### Pattern 1: Basic Layout Component

```tsx
// BEFORE
<div className="container">
  <div className="flex-row">
    <div className="col">Content</div>
  </div>
</div>

// AFTER
<div className={patterns.container()}>
  <div className={patterns.flex.between}>
    <div>Content</div>
  </div>
</div>
```

### Pattern 2: Interactive Button

```tsx
// BEFORE
<button className="primary-button large">
  Click Me
</button>

// AFTER
<button className="btn btn-primary btn-lg">
  Click Me
</button>

// OR using pattern utility
<button className={patterns.button('primary', 'lg')}>
  Click Me
</button>
```

### Pattern 3: Conditional Styling

```tsx
// BEFORE
<div className={`card ${isActive ? 'active' : ''} ${error ? 'error' : ''}`}>

// AFTER
<div className={cn(
  'card',
  isActive && 'ring-2 ring-primary-500',
  error && 'border-error-500'
)}>
```

### Pattern 4: Responsive Design

```tsx
// BEFORE
@media (min-width: 768px) {
  .my-component {
    font-size: 18px;
  }
}

// AFTER
<div className="text-base md:text-lg">
```

### Pattern 5: Dark Mode

```tsx
// BEFORE (with CSS variables)
background-color: var(--bg-primary);

// AFTER
<div className="bg-white dark:bg-gray-900">
```

## Before & After Examples

### Example 1: Navbar

<details>
<summary>View Code</summary>

```tsx
// BEFORE
import './Navbar.css';

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="/" className="logo">Logo</a>
        <div className="nav-links">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </nav>
  );
}
```

```css
/* Navbar.css */
.navbar {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #3b82f6;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #4b5563;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #3b82f6;
}
```

```tsx
// AFTER
import { patterns } from '@/styles/system/css-in-js';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-sticky bg-white dark:bg-gray-900 shadow-sm print-hidden">
      <div className={patterns.container()}>
        <div className={patterns.flex.between + ' py-4'}>
          <a
            href="/"
            className="text-2xl font-bold text-primary-600 dark:text-primary-400 focus-primary"
          >
            Logo
          </a>
          <div className="flex gap-8">
            <a
              href="/about"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus-primary"
            >
              About
            </a>
            <a
              href="/contact"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus-primary"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
```
</details>

### Example 2: Hero Section

<details>
<summary>View Code</summary>

```tsx
// BEFORE
import './Hero.css';

export function Hero() {
  return (
    <div className="hero">
      <h1 className="hero-title">Welcome</h1>
      <p className="hero-subtitle">Find the best prices</p>
      <button className="cta-button">Get Started</button>
    </div>
  );
}
```

```css
/* Hero.css */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
}

.hero-title {
  font-size: 48px;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
}

.cta-button {
  background: white;
  color: #3b82f6;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}
```

```tsx
// AFTER
import { patterns, animations } from '@/styles/system/css-in-js';

export function Hero() {
  return (
    <div className={patterns.flex.colCenter + ' min-h-screen px-4 py-20 bg-gradient-primary'}>
      <h1 className={cn(
        patterns.text.h1,
        'text-white text-center text-balance mb-4',
        animations.safe('animate-fade-in')
      )}>
        Welcome
      </h1>
      <p className={cn(
        patterns.text.body,
        'text-white/90 text-center mb-8',
        animations.safe('animate-fade-in [animation-delay:200ms]')
      )}>
        Find the best prices
      </p>
      <button className={cn(
        'btn bg-white text-primary-600 hover:bg-gray-50 btn-lg',
        animations.safe('animate-scale-in [animation-delay:400ms]')
      )}>
        Get Started
      </button>
    </div>
  );
}
```
</details>

### Example 3: Form Input

<details>
<summary>View Code</summary>

```tsx
// BEFORE
import './Input.css';

export function Input({ label, error, ...props }) {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input className={`input ${error ? 'input-error' : ''}`} {...props} />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
```

```css
/* Input.css */
.input-group {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-error {
  border-color: #ef4444;
}

.error-message {
  display: block;
  margin-top: 0.5rem;
  font-size: 14px;
  color: #ef4444;
}
```

```tsx
// AFTER
import { cn } from '@/styles/system/css-in-js';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        className={cn(
          'input',
          error && 'input-error',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${props.id}-error`}
          className="text-sm text-error-600 dark:text-error-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}
```
</details>

## Testing Refactored Components

### Visual Testing Checklist

```tsx
// Test component in multiple states
<Component />                           // Default
<Component variant="primary" />         // Variants
<Component className="dark" />          // Dark mode
<Component isLoading />                 // Loading
<Component error="Error message" />     // Error state
```

### Responsive Testing

```tsx
// Test at all breakpoints
- Mobile (320px - 640px)
- Tablet (640px - 1024px)
- Desktop (1024px+)
```

### Accessibility Testing

```bash
# Run accessibility tests
npm run test:a11y

# Manual checks:
- Keyboard navigation (Tab, Shift+Tab, Enter, Space)
- Screen reader testing
- Color contrast (WCAG AA)
- Focus indicators
```

### Print Testing

```tsx
// Add print preview class for development
<div className="print-preview">
  <Component />
</div>

// Or use browser print preview (Ctrl+P)
```

## Automated Refactoring Script

Create a helper script for batch refactoring:

```bash
# scripts/refactor-component.sh
#!/bin/bash

COMPONENT_NAME=$1
COMPONENT_PATH="src/components/${COMPONENT_NAME}"

echo "Refactoring ${COMPONENT_NAME}..."

# Backup old file
cp "${COMPONENT_PATH}.js" "${COMPONENT_PATH}.js.backup"

# Remove CSS import
sed -i '/import.*\.css/d' "${COMPONENT_PATH}.js"

# Add styling imports
sed -i '1i import { cn, patterns } from "@/styles/system/css-in-js";' "${COMPONENT_PATH}.js"

echo "Manual refactoring required for class names"
echo "Backup created at ${COMPONENT_PATH}.js.backup"
```

## Migration Timeline

### Phase 1: New Components (Week 1)
- All new components use new styling system
- Update component templates

### Phase 2: High-Priority Components (Week 2-3)
- Refactor main navigation
- Refactor station cards
- Refactor search components

### Phase 3: Remaining Components (Week 4-6)
- Batch refactor similar components
- Update documentation
- Remove old CSS files

### Phase 4: Cleanup (Week 7)
- Remove unused CSS
- Optimize bundle
- Performance audit

## Need Help?

- Check [Styling Architecture Guide](./STYLING_ARCHITECTURE_GUIDE.md)
- Review [Examples](./STYLING_EXAMPLES.md)
- Use [Quick Reference](./STYLING_QUICK_REFERENCE.md)

---

**Happy Refactoring!** 🎨
