# Component Library Documentation

## 🎨 Design System

Our component library follows **Atomic Design** principles with shadcn/ui inspiration and Lucide React icons.

### Hierarchy

```
Atoms (Primitives)
├── Button
├── Input
├── Badge
├── Spinner
└── Skeleton

Molecules (Compounds)
├── Card
├── Select
├── Alert
└── Tabs

Organisms (Complex)
├── Navbar
├── Modal
├── SearchBar
└── FilterPanel
```

---

## 📦 Installation

```bash
npm install lucide-react clsx tailwind-merge
```

---

## 🔘 Button

### Import

```tsx
import { Button } from '@/components/ui/primitives';
```

### Variants

- `primary` - Primary CTA (default)
- `secondary` - Secondary actions
- `outlined` - Outlined style
- `ghost` - Transparent background
- `destructive` - Dangerous actions
- `link` - Link-styled button

### Sizes

- `sm` - Small (36px min height)
- `md` - Medium (44px min height) - **default**
- `lg` - Large (48px min height)
- `xl` - Extra large (56px min height)
- `icon` - Icon only (44x44px)

### Examples

**Basic Usage**

```tsx
<Button>Click me</Button>
```

**With Variant**

```tsx
<Button variant="outlined">Cancel</Button>
<Button variant="destructive">Delete</Button>
```

**With Icons**

```tsx
import { Search, ChevronRight } from 'lucide-react';

<Button leftIcon={<Search />}>Search</Button>
<Button rightIcon={<ChevronRight />}>Next</Button>
```

**Loading State**

```tsx
<Button loading>Processing...</Button>
```

**Full Width**

```tsx
<Button fullWidth>Submit Form</Button>
```

**Disabled**

```tsx
<Button disabled>Can't click</Button>
```

### Props Reference

| Prop        | Type      | Default     | Description      |
| ----------- | --------- | ----------- | ---------------- |
| `variant`   | enum      | `'primary'` | Visual variant   |
| `size`      | enum      | `'md'`      | Size variant     |
| `loading`   | boolean   | `false`     | Shows spinner    |
| `fullWidth` | boolean   | `false`     | 100% width       |
| `leftIcon`  | ReactNode | -           | Icon before text |
| `rightIcon` | ReactNode | -           | Icon after text  |
| `disabled`  | boolean   | `false`     | Disabled state   |

### Accessibility Features

- ✅ Minimum 44px touch target
- ✅ Focus ring with 4px offset
- ✅ `aria-disabled` when disabled
- ✅ `aria-busy` when loading
- ✅ Keyboard accessible

---

## 📄 Card

### Import

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/primitives';
```

### Variants

- `default` - White with shadow
- `bordered` - Border instead of shadow
- `elevated` - Larger shadow
- `outlined` - Transparent with border
- `ghost` - Subtle gray background

### Examples

**Basic Card**

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content area</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Hoverable Card**

```tsx
<Card hoverable>
  <CardContent>Hover me!</CardContent>
</Card>
```

**Clickable Card**

```tsx
<Card clickable onClick={() => alert('Clicked!')}>
  <CardContent>Click me!</CardContent>
</Card>
```

**Station Card Example**

```tsx
<Card hoverable variant="bordered">
  <CardHeader>
    <CardTitle>Shell Carlton</CardTitle>
    <CardDescription>123 Main Street, Carlton VIC</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-primary-600">189.9¢</div>
    <p className="text-sm text-gray-500">Unleaded</p>
  </CardContent>
  <CardFooter>
    <Button fullWidth>View Details</Button>
  </CardFooter>
</Card>
```

### Props Reference

| Component         | Props                                         | Description     |
| ----------------- | --------------------------------------------- | --------------- |
| `Card`            | `variant`, `hoverable`, `clickable`, `active` | Main container  |
| `CardHeader`      | -                                             | Header section  |
| `CardTitle`       | -                                             | Card title (h3) |
| `CardDescription` | -                                             | Subtitle text   |
| `CardContent`     | -                                             | Main content    |
| `CardFooter`      | -                                             | Footer actions  |

### Accessibility Features

- ✅ `role="button"` when clickable
- ✅ `tabIndex={0}` for keyboard navigation
- ✅ Enter/Space key activation
- ✅ Focus ring
- ✅ Semantic HTML structure

---

## 📝 Input

### Import

```tsx
import { Input } from '@/components/ui/primitives';
```

### Examples

**Basic Input**

```tsx
<Input
  label="Email Address"
  type="email"
  placeholder="john@example.com"
  required
/>
```

**With Helper Text**

```tsx
<Input
  label="Password"
  type="password"
  helperText="Must be at least 8 characters"
  required
/>
```

**With Error**

```tsx
<Input label="Username" error="Username is already taken" />
```

**With Success**

```tsx
<Input label="Email" type="email" success />
```

**With Icons**

```tsx
import { Search, Mail } from 'lucide-react';

<Input
  leftIcon={<Search />}
  placeholder="Search..."
/>

<Input
  leftIcon={<Mail />}
  label="Email"
  type="email"
/>
```

**Full Example**

```tsx
<Input
  label="Search Stations"
  type="search"
  placeholder="Enter suburb or postcode..."
  leftIcon={<Search />}
  helperText="Try Carlton, Richmond, or 3000"
  fullWidth
/>
```

### Props Reference

| Prop         | Type      | Default | Description    |
| ------------ | --------- | ------- | -------------- |
| `label`      | string    | -       | Label text     |
| `helperText` | string    | -       | Helper message |
| `error`      | string    | -       | Error message  |
| `success`    | boolean   | `false` | Success state  |
| `leftIcon`   | ReactNode | -       | Icon on left   |
| `rightIcon`  | ReactNode | -       | Icon on right  |
| `fullWidth`  | boolean   | `true`  | 100% width     |

### Accessibility Features

- ✅ Connected label with htmlFor
- ✅ `aria-invalid` for errors
- ✅ `aria-describedby` for helper text
- ✅ `aria-required` for required fields
- ✅ 44px minimum height
- ✅ Error messages use `role="alert"`

---

## 🎯 Usage Guidelines

### Color Contrast (WCAG 2.1 AA)

All components meet WCAG 2.1 AA standards:

- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum
- **Interactive elements**: Clear focus states

### Touch Targets

All interactive elements have **minimum 44x44px** touch targets:

- Buttons: `min-h-[44px]`
- Inputs: `min-h-[44px]`
- Clickable cards: `min-h-[44px]`

### Keyboard Navigation

All components support keyboard navigation:

- **Tab**: Navigate between elements
- **Enter/Space**: Activate buttons/cards
- **Escape**: Close modals/dropdowns
- **Arrow keys**: Navigate lists/tabs

### Focus Management

Clear focus indicators with 4px offset:

```tsx
focus-visible:outline-none
focus-visible:ring-4
focus-visible:ring-primary-300
```

---

## 🎨 Theming

### Color Palette

```tsx
// Primary (Blue)
primary-50 to primary-900

// Secondary (Gray)
secondary-50 to secondary-900

// Success (Green)
green-50 to green-900

// Danger (Red)
red-50 to red-900

// Warning (Yellow)
yellow-50 to yellow-900
```

### Dark Mode

All components support dark mode:

```tsx
dark: bg - gray - 800;
dark: text - white;
dark: border - gray - 700;
```

---

## 📦 Component Checklist

When creating new components, ensure:

- [ ] TypeScript props with JSDoc comments
- [ ] Accessible (ARIA labels, keyboard nav)
- [ ] 44px minimum touch targets
- [ ] Focus states with 4px ring
- [ ] Dark mode support
- [ ] Responsive (mobile-first)
- [ ] Loading states
- [ ] Error states
- [ ] Disabled states
- [ ] Usage examples in docs
- [ ] Storybook stories (optional)

---

## 🔗 Resources

- [Lucide React Icons](https://lucide.dev/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Last Updated**: 2025-11-11  
**Version**: 1.0.0
