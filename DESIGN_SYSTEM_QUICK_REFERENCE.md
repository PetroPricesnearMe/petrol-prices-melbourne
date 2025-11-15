# Design System Quick Reference 🎨

## Colors

### Primary (Blue)

```tsx
bg-primary-500    text-primary-600    border-primary-500
```

### Secondary (Purple)

```tsx
bg-secondary-500  text-secondary-600  border-secondary-500
```

### Accent (Cyan)

```tsx
bg-accent-500     text-accent-600     border-accent-500
```

### States

```tsx
bg - success - 500; // Green
bg - warning - 500; // Amber
bg - error - 500; // Red
bg - info - 500; // Blue
```

---

## Spacing

```tsx
p - 2; // 8px
p - 4; // 16px
p - 6; // 24px
p - 8; // 32px

m - 2; // 8px
m - 4; // 16px
m - 6; // 24px
m - 8; // 32px

space - y - 4; // 16px vertical gap
gap - 6; // 24px flex/grid gap
```

---

## Typography

```tsx
// Sizes
text-xs    // 12px
text-sm    // 14px
text-base  // 16px
text-lg    // 18px
text-xl    // 20px
text-2xl   // 24px
text-3xl   // 30px
text-4xl   // 36px

// Weights
font-normal    // 400
font-medium    // 500
font-semibold  // 600
font-bold      // 700
```

---

## Border Radius

```tsx
rounded-sm    // 4px
rounded       // 6px
rounded-lg    // 12px
rounded-xl    // 16px
rounded-2xl   // 20px
rounded-full  // Fully rounded
```

---

## Shadows

```tsx
shadow - sm; // Subtle
shadow - md; // Medium
shadow - lg; // Large
shadow - xl; // Extra large
shadow - soft; // Custom soft
```

---

## Dark Mode

```tsx
// Always include dark mode variants
<div className="dark:bg-neutral-950 bg-white">
  <p className="text-gray-900 dark:text-white">Text</p>
</div>
```

---

## Common Patterns

### Button

```tsx
<button className="btn rounded-lg bg-primary-600 px-6 py-2 text-white shadow-sm hover:bg-primary-700">
  Click Me
</button>
```

### Card

```tsx
<div className="dark:bg-neutral-900 rounded-xl bg-white p-6 shadow-md">
  Card Content
</div>
```

### Badge

```tsx
<span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200">
  Badge
</span>
```

### Input

```tsx
<input className="dark:border-neutral-700 dark:bg-neutral-900 w-full rounded-lg border border-gray-300 bg-white px-4 py-2" />
```

---

## Theme Toggle

```tsx
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// Simple icon toggle
<ThemeToggle />

// Full switcher
<ThemeToggle variant="full" />
```

---

## Using Theme Hook

```tsx
import { useTheme } from '@/components/providers/ThemeProvider';

const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
```

---

## Z-Index Layers

```tsx
z - dropdown; // 1000
z - sticky; // 1020
z - fixed; // 1030
z - modal; // 1050
z - tooltip; // 1070
```
