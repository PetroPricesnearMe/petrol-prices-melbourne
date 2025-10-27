# Filter Bar Components Usage Guide

## Overview

The Filter Bar components provide a comprehensive filtering system with:
- Dynamic category chips with multi-select
- Dual-handle price range slider
- Rating filter with star display
- Responsive filter bar
- Filter sidebar panels

## Components

### 1. CategoryChips

Multi-select category filter with visual indicators.

```tsx
import { CategoryChips } from '@/components/organisms';

const categories = [
  { id: 'all', label: 'All Categories', count: 150 },
  { id: 'restaurants', label: 'Restaurants', count: 45 },
  { id: 'hotels', label: 'Hotels', count: 32 },
];

<CategoryChips
  categories={categories}
  selectedCategories={selectedCategories}
  onSelectionChange={(selected) => setSelected(selected)}
  multiSelect={true}
  showCounts={true}
  size="md"
/>
```

**Props:**
- `categories: Category[]` - Available categories
- `selectedCategories?: string[]` - Selected category IDs
- `onSelectionChange?: (selectedIds: string[]) => void` - Selection change callback
- `maxSelections?: number` - Maximum selections allowed
- `showCounts?: boolean` - Show category counts
- `multiSelect?: boolean` - Allow multiple selections
- `size?: 'sm' | 'md' | 'lg'` - Size variant

### 2. PriceRangeSlider

Dual-handle range slider for price filtering.

```tsx
import { PriceRangeSlider } from '@/components/organisms';

<PriceRangeSlider
  absoluteMin={0}
  absoluteMax={300}
  minValue={priceRange.min}
  maxValue={priceRange.max}
  onChange={(range) => setPriceRange(range)}
  currency="$"
  step={1}
  showLabels={true}
/>
```

**Props:**
- `absoluteMin?: number` - Minimum possible value
- `absoluteMax?: number` - Maximum possible value
- `minValue?: number` - Initial/current min value
- `maxValue?: number` - Initial/current max value
- `onChange?: (range: PriceRange) => void` - Value change callback
- `currency?: string` - Currency symbol
- `step?: number` - Step increment
- `showLabels?: boolean` - Show value labels

### 3. RatingSlider

Star-based rating filter.

```tsx
import { RatingSlider } from '@/components/organisms';

<RatingSlider
  minRating={minRating}
  onChange={(rating) => setMinRating(rating)}
  maxRating={5}
  size="md"
  allowHalf={false}
/>
```

**Props:**
- `minRating?: number` - Current selected rating (0 = all, 1-5 = specific)
- `onChange?: (rating: number) => void` - Rating change callback
- `maxRating?: number` - Maximum rating (default: 5)
- `showLabel?: boolean` - Show value label
- `size?: 'sm' | 'md' | 'lg'` - Size variant
- `allowHalf?: boolean` - Show half-star ratings

### 4. FilterBar

Horizontal filter bar with collapsible sections.

```tsx
import { FilterBar } from '@/components/organisms';

<FilterBar
  categories={categories}
  selectedCategories={selectedCategories}
  priceRange={priceRange}
  minPrice={0}
  maxPrice={300}
  minRating={minRating}
  onCategoriesChange={(selected) => setSelected(selected)}
  onPriceRangeChange={(range) => setPriceRange(range)}
  onRatingChange={(rating) => setMinRating(rating)}
  onClearAll={handleClearAll}
  showRating={true}
  showPrice={true}
/>
```

**Props:**
- `categories: Category[]` - Available categories
- `selectedCategories?: string[]` - Selected category IDs
- `priceRange?: PriceRange` - Current price range
- `minPrice?: number` - Minimum price absolute value
- `maxPrice?: number` - Maximum price absolute value
- `minRating?: number` - Current minimum rating
- `onCategoriesChange?: (selected: string[]) => void` - Categories change callback
- `onPriceRangeChange?: (range: PriceRange) => void` - Price range change callback
- `onRatingChange?: (rating: number) => void` - Rating change callback
- `onClearAll?: () => void` - Clear all filters callback
- `showRating?: boolean` - Show rating filter
- `showPrice?: boolean` - Show price filter

### 5. FilterSidebar

Vertical sidebar with comprehensive filter options.

```tsx
import { FilterSidebar } from '@/components/organisms';

<FilterSidebar
  categories={categories}
  selectedCategories={selectedCategories}
  priceRange={priceRange}
  minPrice={0}
  maxPrice={300}
  minRating={minRating}
  onCategoriesChange={(selected) => setSelected(selected)}
  onPriceRangeChange={(range) => setPriceRange(range)}
  onRatingChange={(rating) => setMinRating(rating)}
  onClearAll={handleClearAll}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  width="md"
  sticky={true}
/>
```

**Props:**
- `categories: Category[]` - Available categories
- `selectedCategories?: string[]` - Selected category IDs
- `priceRange?: PriceRange` - Current price range
- `minPrice?: number` - Minimum price absolute value
- `maxPrice?: number` - Maximum price absolute value
- `minRating?: number` - Current minimum rating
- `onCategoriesChange?: (selected: string[]) => void` - Categories change callback
- `onPriceRangeChange?: (range: PriceRange) => void` - Price range change callback
- `onRatingChange?: (rating: number) => void` - Rating change callback
- `onClearAll?: () => void` - Clear all filters callback
- `isOpen?: boolean` - Sidebar visibility
- `onClose?: () => void` - Close callback
- `width?: 'sm' | 'md' | 'lg'` - Sidebar width
- `sticky?: boolean` - Sticky positioning

## Complete Example

```tsx
'use client';

import { useState } from 'react';
import { FilterBar, FilterSidebar, Category, PriceRange } from '@/components/organisms';

export default function FilterExample() {
  // State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 300 });
  const [minRating, setMinRating] = useState(0);

  // Sample data
  const categories: Category[] = [
    { id: 'petrol', label: 'Petrol', count: 150 },
    { id: 'diesel', label: 'Diesel', count: 120 },
    { id: 'lpg', label: 'LPG', count: 45 },
    { id: 'premium', label: 'Premium', count: 32 },
  ];

  // Handlers
  const handleCategoriesChange = (selected: string[]) => {
    setSelectedCategories(selected);
  };

  const handlePriceRangeChange = (range: PriceRange) => {
    setPriceRange(range);
  };

  const handleRatingChange = (rating: number) => {
    setMinRating(rating);
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 300 });
    setMinRating(0);
  };

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <FilterSidebar
        categories={categories}
        selectedCategories={selectedCategories}
        priceRange={priceRange}
        minPrice={0}
        maxPrice={300}
        minRating={minRating}
        onCategoriesChange={handleCategoriesChange}
        onPriceRangeChange={handlePriceRangeChange}
        onRatingChange={handleRatingChange}
        onClearAll={handleClearAll}
        isOpen={true}
        width="md"
        sticky={true}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Filter Bar */}
        <FilterBar
          categories={categories}
          selectedCategories={selectedCategories}
          priceRange={priceRange}
          minPrice={0}
          maxPrice={300}
          minRating={minRating}
          onCategoriesChange={handleCategoriesChange}
          onPriceRangeChange={handlePriceRangeChange}
          onRatingChange={handleRatingChange}
          onClearAll={handleClearAll}
          showRating={true}
          showPrice={true}
        />

        {/* Results */}
        <div className="p-6">
          {/* Your content here */}
        </div>
      </div>
    </div>
  );
}
```

## Features

### Accessibility
- Full keyboard navigation
- ARIA labels and roles
- Screen reader support
- Focus management

### Responsive Design
- Mobile-friendly layout
- Touch-optimized controls
- Adaptive sidebar behavior
- Flexible grid layouts

### Dark Mode Support
- Automatic theme adaptation
- Consistent color schemes
- High contrast ratios

### Animations
- Smooth transitions
- Gesture support
- Reduced motion support
- Loading states

## Best Practices

1. **State Management**: Use React hooks or state management library to manage filter state
2. **Performance**: Debounce rapid filter changes to avoid excessive re-renders
3. **Accessibility**: Always provide meaningful labels and feedback
4. **Mobile UX**: Ensure touch targets are at least 44x44px
5. **Loading States**: Show loading indicators during filter updates
6. **Error Handling**: Provide error messages for invalid filter values

## Styling

All components use Tailwind CSS and support:
- Custom color schemes
- Dark mode
- Responsive breakpoints
- Custom animations

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile
