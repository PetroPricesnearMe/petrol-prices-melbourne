# NorthernTradieCard Component

A highly reusable, accessible, and performant card component built with TypeScript, React, and Tailwind CSS.

## Features

- ✨ **Multiple Variants**: `default`, `elevated`, `outlined`, `filled`, `interactive`, `featured`
- 📐 **Flexible Sizes**: `xs`, `sm`, `md`, `lg`, `xl`
- ♿ **Fully Accessible**: ARIA attributes, keyboard navigation, screen reader support
- 🎨 **Tailwind CSS**: Responsive design with customizable styling
- 🧩 **Compound Pattern**: Compose cards using sub-components
- 🔄 **State Management**: Loading, error, success states built-in
- ✨ **Smooth Animations**: Framer Motion powered micro-interactions
- ⚡ **Optimized**: Memoization and performance best practices
- 📝 **TypeScript**: Full type safety with comprehensive interfaces
- 🧪 **Well Tested**: Comprehensive unit test coverage

## Installation

```bash
npm install framer-motion clsx tailwind-merge
```

## Basic Usage

```tsx
import { NorthernTradieCard } from '@/components/NorthernTradieCard';

function MyComponent() {
  return (
    <NorthernTradieCard>
      <NorthernTradieCard.Header title="Card Title" subtitle="Subtitle" />
      <NorthernTradieCard.Content>
        Your content here
      </NorthernTradieCard.Content>
      <NorthernTradieCard.Footer>
        <button>Action</button>
      </NorthernTradieCard.Footer>
    </NorthernTradieCard>
  );
}
```

## Variants

### Default
Standard card with border and white background.

```tsx
<NorthernTradieCard variant="default">
  <NorthernTradieCard.Content>Default card</NorthernTradieCard.Content>
</NorthernTradieCard>
```

### Elevated
Card with shadow for depth.

```tsx
<NorthernTradieCard variant="elevated">
  <NorthernTradieCard.Content>Elevated card</NorthernTradieCard.Content>
</NorthernTradieCard>
```

### Outlined
Prominent border with transparent background.

```tsx
<NorthernTradieCard variant="outlined">
  <NorthernTradieCard.Content>Outlined card</NorthernTradieCard.Content>
</NorthernTradieCard>
```

### Filled
Subtle filled background.

```tsx
<NorthernTradieCard variant="filled">
  <NorthernTradieCard.Content>Filled card</NorthernTradieCard.Content>
</NorthernTradieCard>
```

### Interactive
Clickable with hover effects and scale animation.

```tsx
<NorthernTradieCard 
  variant="interactive"
  clickable
  onClick={() => console.log('Clicked!')}
>
  <NorthernTradieCard.Content>Interactive card</NorthernTradieCard.Content>
</NorthernTradieCard>
```

### Featured
Premium gradient styling for highlighted content.

```tsx
<NorthernTradieCard variant="featured">
  <NorthernTradieCard.Content>Featured card</NorthernTradieCard.Content>
</NorthernTradieCard>
```

## Sizes

```tsx
// Extra Small
<NorthernTradieCard size="xs">Content</NorthernTradieCard>

// Small
<NorthernTradieCard size="sm">Content</NorthernTradieCard>

// Medium (default)
<NorthernTradieCard size="md">Content</NorthernTradieCard>

// Large
<NorthernTradieCard size="lg">Content</NorthernTradieCard>

// Extra Large
<NorthernTradieCard size="xl">Content</NorthernTradieCard>
```

## States

### Loading State

```tsx
<NorthernTradieCard 
  state="loading" 
  loadingMessage="Loading data..."
>
  <NorthernTradieCard.Content>Content</NorthernTradieCard.Content>
</NorthernTradieCard>
```

### Error State

```tsx
<NorthernTradieCard 
  state="error" 
  errorMessage="Failed to load data"
>
  <NorthernTradieCard.Content>Content</NorthernTradieCard.Content>
</NorthernTradieCard>
```

### Success State

```tsx
<NorthernTradieCard state="success">
  <NorthernTradieCard.Content>Data loaded successfully!</NorthernTradieCard.Content>
</NorthernTradieCard>
```

## With Media

```tsx
<NorthernTradieCard>
  <NorthernTradieCard.Media
    src="https://example.com/image.jpg"
    alt="Description"
    aspectRatio="16/9"
    objectFit="cover"
  />
  <NorthernTradieCard.Header title="Card with Image" />
  <NorthernTradieCard.Content>Content below image</NorthernTradieCard.Content>
</NorthernTradieCard>
```

### Custom Media Content

```tsx
<NorthernTradieCard>
  <NorthernTradieCard.Media>
    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600">
      <p className="text-white p-4">Custom content</p>
    </div>
  </NorthernTradieCard.Media>
  <NorthernTradieCard.Content>Content</NorthernTradieCard.Content>
</NorthernTradieCard>
```

## Complex Example

```tsx
<NorthernTradieCard
  variant="elevated"
  size="lg"
  hoverable
  shadow="xl"
  animated
  animationDelay={100}
>
  <NorthernTradieCard.Media
    src="https://example.com/image.jpg"
    alt="Product image"
    aspectRatio="16/9"
  />
  
  <NorthernTradieCard.Header
    title="Product Title"
    subtitle="Category: Electronics"
    icon={
      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    }
    action={
      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
        In Stock
      </span>
    }
  />
  
  <NorthernTradieCard.Content>
    <p className="text-gray-700 mb-4">
      High-quality product with excellent features and great reviews.
    </p>
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold">$299</span>
      <span className="text-sm text-gray-500 line-through">$399</span>
      <span className="text-sm text-green-600 font-semibold">25% OFF</span>
    </div>
  </NorthernTradieCard.Content>
  
  <NorthernTradieCard.Footer align="between">
    <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
      Add to Wishlist
    </button>
    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
      Add to Cart
    </button>
  </NorthernTradieCard.Footer>
</NorthernTradieCard>
```

## Accessibility

The component is fully accessible with:

### ARIA Attributes
- `aria-label` for descriptive labels
- `aria-disabled` for disabled state
- `aria-busy` for loading state
- `aria-live` for dynamic content updates

### Keyboard Navigation
- Clickable cards are keyboard accessible with `Tab`
- Press `Enter` or `Space` to activate clickable cards
- Focus indicators for keyboard navigation

### Screen Reader Support
- Semantic HTML with proper roles
- Loading and error states announced
- Alternative text for images

Example:

```tsx
<NorthernTradieCard
  clickable
  onClick={handleClick}
  ariaLabel="Product card for Blue Widget"
  role="button"
  tabIndex={0}
>
  <NorthernTradieCard.Content>Content</NorthernTradieCard.Content>
</NorthernTradieCard>
```

## Animation

### Enable Animation

```tsx
<NorthernTradieCard animated>
  <NorthernTradieCard.Content>Animated entrance</NorthernTradieCard.Content>
</NorthernTradieCard>
```

### Staggered Animation

```tsx
{items.map((item, index) => (
  <NorthernTradieCard
    key={item.id}
    animated
    animationDelay={index * 100}
  >
    <NorthernTradieCard.Content>{item.content}</NorthernTradieCard.Content>
  </NorthernTradieCard>
))}
```

### Disable Animation

```tsx
<NorthernTradieCard animated={false}>
  <NorthernTradieCard.Content>No animation</NorthernTradieCard.Content>
</NorthernTradieCard>
```

## Interactive Cards

### Clickable

```tsx
<NorthernTradieCard
  clickable
  onClick={() => navigate('/details')}
  hoverable
>
  <NorthernTradieCard.Content>Click to view details</NorthernTradieCard.Content>
</NorthernTradieCard>
```

### With Keyboard Support

```tsx
<NorthernTradieCard
  clickable
  onClick={handleClick}
  onKeyPress={(e) => {
    if (e.key === 'Enter') {
      console.log('Custom keyboard handler');
    }
  }}
>
  <NorthernTradieCard.Content>Keyboard accessible</NorthernTradieCard.Content>
</NorthernTradieCard>
```

## Disabled State

```tsx
<NorthernTradieCard disabled clickable onClick={handleClick}>
  <NorthernTradieCard.Content>This card is disabled</NorthernTradieCard.Content>
</NorthernTradieCard>
```

## Styling

### Custom Styling

```tsx
<NorthernTradieCard className="custom-class">
  <NorthernTradieCard.Content>Custom styled</NorthernTradieCard.Content>
</NorthernTradieCard>
```

### Border Control

```tsx
// With border (default)
<NorthernTradieCard bordered>Content</NorthernTradieCard>

// Without border
<NorthernTradieCard bordered={false}>Content</NorthernTradieCard>
```

### Shadow Control

```tsx
// No shadow (default for most variants)
<NorthernTradieCard>Content</NorthernTradieCard>

// With shadow
<NorthernTradieCard shadow>Content</NorthernTradieCard>

// Specific shadow sizes
<NorthernTradieCard shadow="sm">Small shadow</NorthernTradieCard>
<NorthernTradieCard shadow="md">Medium shadow</NorthernTradieCard>
<NorthernTradieCard shadow="lg">Large shadow</NorthernTradieCard>
<NorthernTradieCard shadow="xl">Extra large shadow</NorthernTradieCard>
```

## Performance Optimization

The component uses several optimization techniques:

1. **React.memo**: Prevents unnecessary re-renders
2. **useMemo**: Memoizes class names and animation variants
3. **useCallback**: Memoizes event handlers
4. **Lazy Loading**: Images use lazy loading by default

## TypeScript

Full TypeScript support with comprehensive interfaces:

```tsx
import type { 
  NorthernTradieCardProps,
  CardVariant,
  CardSize,
  CardState 
} from '@/components/NorthernTradieCard';

const MyCard: React.FC<NorthernTradieCardProps> = (props) => {
  const variant: CardVariant = 'elevated';
  const size: CardSize = 'lg';
  const state: CardState = 'idle';
  
  return (
    <NorthernTradieCard variant={variant} size={size} state={state}>
      {props.children}
    </NorthernTradieCard>
  );
};
```

## Testing

Run tests:

```bash
# Run all tests
npm test

# Run with coverage
npm test:coverage

# Watch mode
npm test:watch
```

Example test:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { NorthernTradieCard } from './NorthernTradieCard';

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(
    <NorthernTradieCard clickable onClick={handleClick}>
      Content
    </NorthernTradieCard>
  );
  
  const card = screen.getByText('Content').closest('div');
  fireEvent.click(card);
  expect(handleClick).toHaveBeenCalled();
});
```

## API Reference

### NorthernTradieCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `CardVariant` | `'default'` | Visual variant of the card |
| `size` | `CardSize` | `'md'` | Size of the card |
| `state` | `CardState` | `'idle'` | Current state (idle, loading, error, success) |
| `errorMessage` | `string` | `undefined` | Error message shown in error state |
| `loadingMessage` | `string` | `'Loading...'` | Message shown in loading state |
| `children` | `ReactNode` | - | Card content |
| `className` | `string` | `''` | Custom CSS classes |
| `hoverable` | `boolean` | `false` | Enable hover effects |
| `clickable` | `boolean` | `false` | Make card clickable |
| `onClick` | `() => void` | `undefined` | Click handler |
| `disabled` | `boolean` | `false` | Disable card |
| `animated` | `boolean` | `true` | Enable entrance animation |
| `animationDelay` | `number` | `0` | Animation delay in ms |
| `testId` | `string` | `undefined` | Test ID for testing |
| `ariaLabel` | `string` | `undefined` | ARIA label |
| `role` | `string` | `undefined` | ARIA role |
| `tabIndex` | `number` | `undefined` | Tab index for keyboard navigation |
| `onKeyPress` | `function` | `undefined` | Keyboard event handler |
| `onFocus` | `() => void` | `undefined` | Focus event handler |
| `onBlur` | `() => void` | `undefined` | Blur event handler |
| `bordered` | `boolean` | `true` | Show border |
| `shadow` | `boolean \| string` | `false` | Shadow size |
| `bgColor` | `string` | `undefined` | Background color override |

### CardHeader Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | `undefined` | Header title |
| `subtitle` | `ReactNode` | `undefined` | Header subtitle |
| `icon` | `ReactNode` | `undefined` | Icon element |
| `action` | `ReactNode` | `undefined` | Action buttons or elements |
| `className` | `string` | `''` | Custom CSS classes |

### CardContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content children |
| `className` | `string` | `''` | Custom CSS classes |
| `padded` | `boolean` | `true` | Enable padding |

### CardFooter Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Footer children |
| `className` | `string` | `''` | Custom CSS classes |
| `align` | `'left' \| 'center' \| 'right' \| 'between'` | `'between'` | Content alignment |

### CardMedia Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | `undefined` | Image source URL |
| `alt` | `string` | `''` | Image alt text |
| `aspectRatio` | `'1/1' \| '4/3' \| '16/9' \| '21/9'` | `'16/9'` | Aspect ratio |
| `children` | `ReactNode` | `undefined` | Custom content instead of image |
| `className` | `string` | `''` | Custom CSS classes |
| `objectFit` | `'contain' \| 'cover' \| 'fill' \| 'none'` | `'cover'` | Object fit style |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please read the contributing guidelines first.

## Support

For issues and questions, please open a GitHub issue.

