# SortDropdown Component

An animated, accessible sorting dropdown component with URL query sync.

## Features

- 🎨 **Framer Motion Animations** - Smooth open/close transitions
- 🔗 **URL Query Sync** - Maintains sort state in URL parameters
- ⌨️ **Keyboard Accessible** - Full keyboard navigation support
- 🌓 **Dark Mode** - Built-in dark mode support
- 📱 **Responsive** - Works on all screen sizes
- 🎯 **Minimalistic Design** - Clean Tailwind styling with borders and shadows

## Usage

### Basic Usage

```tsx
import { SortDropdown } from '@/components/molecules/SortDropdown';

function MyComponent() {
  const [sortValue, setSortValue] = useState<SortOption>('price-low');

  return <SortDropdown value={sortValue} onChange={setSortValue} />;
}
```

### With URL Sync

```tsx
<SortDropdown value={sortValue} onChange={setSortValue} syncWithUrl={true} />
```

### Quick Sort Bar

For a complete sort bar with result count:

```tsx
import { QuickSortBar } from '@/components/molecules/SortDropdown';

function MyList() {
  return (
    <QuickSortBar
      sortValue={sortValue}
      onSortChange={setSortValue}
      totalResults={items.length}
      currentPage={1}
      totalPages={10}
    />
  );
}
```

## Props

### SortDropdown

| Prop          | Type                          | Default | Description                           |
| ------------- | ----------------------------- | ------- | ------------------------------------- |
| `value`       | `SortOption`                  | -       | Current sort value                    |
| `onChange`    | `(value: SortOption) => void` | -       | Callback when sort changes            |
| `syncWithUrl` | `boolean`                     | `true`  | Sync sort state with URL query params |
| `className`   | `string`                      | -       | Additional CSS classes                |
| `disabled`    | `boolean`                     | `false` | Disable the dropdown                  |

### QuickSortBar

| Prop           | Type                          | Default | Description                    |
| -------------- | ----------------------------- | ------- | ------------------------------ |
| `sortValue`    | `SortOption`                  | -       | Current sort value             |
| `onSortChange` | `(value: SortOption) => void` | -       | Callback when sort changes     |
| `totalResults` | `number`                      | -       | Total number of results        |
| `currentPage`  | `number`                      | -       | Current page number (optional) |
| `totalPages`   | `number`                      | -       | Total pages (optional)         |
| `syncWithUrl`  | `boolean`                     | `true`  | Sync sort state with URL       |
| `className`    | `string`                      | -       | Additional CSS classes         |

## Sort Options

- `nearest` - Sort by distance (closest first)
- `price-low` - Sort by price (low to high)
- `price-high` - Sort by price (high to low)
- `top-rated` - Sort by rating (highest first)
- `name` - Sort alphabetically by name
- `suburb` - Sort by suburb

## Animations

The component uses Framer Motion for smooth animations:

- **Dropdown open/close**: 200ms fade + scale + slide
- **Chevron rotation**: 200ms rotate on toggle
- **Option stagger**: 30ms delay between each option
- **Checkmark**: Scale animation on selection

## Accessibility

- Full keyboard navigation support
- ARIA labels and roles
- Focus management
- Screen reader friendly
- Escape key to close
- Click outside to close

## Styling

Uses minimalistic Tailwind classes:

- Subtle borders and shadows
- Smooth hover transitions
- Focus ring on keyboard navigation
- Responsive padding and spacing

## Examples

### In a Filter Panel

```tsx
<div className="grid grid-cols-4 gap-4">
  {/* Other filters */}
  <div>
    <label className="mb-2 block">Sort By</label>
    <SortDropdown
      value={filters.sortBy}
      onChange={(value) => handleFilterChange('sortBy', value)}
    />
  </div>
</div>
```

### As a Standalone Bar

```tsx
<div className="mb-6">
  <QuickSortBar
    sortValue={sortBy}
    onSortChange={setSortBy}
    totalResults={results.length}
    currentPage={page}
    totalPages={Math.ceil(results.length / pageSize)}
  />
</div>
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled

## Dependencies

- React 18+
- Framer Motion
- Next.js (for URL routing)
- Tailwind CSS

## License

MIT
