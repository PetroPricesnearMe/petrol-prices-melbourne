# Pagination & Responsive Grid System

## 📚 Overview

A comprehensive, accessible pagination system with responsive grid layouts for the Petrol Price Near Me application.

## ✨ Key Features

### ✅ Pagination Component

- Full ARIA accessibility (WCAG 2.1 AA compliant)
- Complete keyboard navigation (Arrow keys, Home, End)
- Smooth fade and slide animations
- Responsive design (mobile-first)
- Smart page range with ellipsis
- Optional First/Last/Prev/Next buttons
- Items count display
- Auto-scroll to top
- Customizable sizing and styling

### ✅ Responsive Grid System

- Fluid responsive columns: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Consistent gap spacing using Tailwind's gap utilities
- Uniform card heights with `auto-rows-fr` and `h-full`
- Perfect vertical rhythm and equal negative space
- Smooth page transition animations
- Staggered child animations

### ✅ PaginatedGrid Component (All-in-One)

- Built-in pagination
- Flexible rendering
- Loading states
- Empty states
- Multiple animation types
- Fully customizable

## 📁 Files Created

- `src/components/common/Pagination.tsx` - Main pagination component
- `src/components/common/PaginatedGrid.tsx` - Grid with pagination
- `src/components/common/Pagination.css` - Pagination styles
- `PAGINATION_IMPLEMENTATION_GUIDE.md` - Comprehensive guide
- `PAGINATION_QUICK_REFERENCE.md` - Quick reference
- `README_PAGINATION.md` - This file

## 🚀 Quick Start

### Basic Implementation

```tsx
import Pagination from '@/components/common/Pagination';

function MyPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / 12);

  return (
    <>
      <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentItems.map((item) => (
          <div key={item.id} className="h-full">
            <Card {...item} />
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
```

### Using PaginatedGrid

```tsx
import { PaginatedGrid } from '@/components/common/PaginatedGrid';

function MyPage({ items }) {
  return (
    <PaginatedGrid
      items={items}
      renderItem={(item) => <Card {...item} />}
      itemsPerPage={12}
      gap="md"
    />
  );
}
```

## 🎯 Grid Implementation

### Responsive Breakpoints

```css
grid-cols-1          /* Mobile: 1 column (< 640px) */
sm:grid-cols-2       /* Tablet: 2 columns (≥ 640px) */
lg:grid-cols-3       /* Desktop: 3 columns (≥ 1024px) */
xl:grid-cols-4       /* Large: 4 columns (≥ 1280px) */
```

### Gap Spacing

```css
gap-6                /* 1.5rem (24px) - Recommended */
```

### Uniform Heights

```tsx
<div className="... grid auto-rows-fr">
  {' '}
  {/* Equal row heights */}
  <div className="flex h-full flex-col">
    {' '}
    {/* Fill cell height */}
    <div className="flex-1">
      {' '}
      {/* Flexible content */}
      {/* Card content */}
    </div>
  </div>
</div>
```

## ⌨️ Keyboard Navigation

| Key                | Action           |
| ------------------ | ---------------- |
| `←`                | Previous page    |
| `→`                | Next page        |
| `Home`             | First page       |
| `End`              | Last page        |
| `Tab`              | Navigate buttons |
| `Enter` or `Space` | Activate button  |

## ♿ Accessibility

- ✅ ARIA labels on all interactive elements
- ✅ `aria-current="page"` for active page
- ✅ `role="navigation"` for pagination
- ✅ `aria-live="polite"` for status updates
- ✅ Screen reader announcements
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Disabled state communication

## 🎨 Customization

### Size Variants

```tsx
<Pagination size="sm" />  {/* Small */}
<Pagination size="md" />  {/* Medium (default) */}
<Pagination size="lg" />  {/* Large */}
```

### Animation Types

```tsx
<Pagination animationType="fade" />   {/* Fade in/out */}
<Pagination animationType="slide" />  {/* Slide transition */}
<Pagination animationType="none" />   {/* No animation */}
```

### Gap Sizes

```tsx
<PaginatedGrid gap="sm" />   {/* 1rem */}
<PaginatedGrid gap="md" />   {/* 1.5rem (default) */}
<PaginatedGrid gap="lg" />   {/* 2rem */}
```

### Custom Columns

```tsx
<PaginatedGrid
  columns={{
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  }}
/>
```

## 📖 Documentation

For detailed documentation, see:

1. **[PAGINATION_IMPLEMENTATION_GUIDE.md](./PAGINATION_IMPLEMENTATION_GUIDE.md)** - Complete guide with:
   - Detailed API reference
   - Implementation patterns
   - Accessibility guidelines
   - Code examples
   - Best practices
   - Testing strategies
   - Troubleshooting

2. **[PAGINATION_QUICK_REFERENCE.md](./PAGINATION_QUICK_REFERENCE.md)** - Quick reference with:
   - Common props
   - Keyboard shortcuts
   - Grid breakpoints
   - Code snippets
   - Checklists
   - Common issues

## 🧪 Usage in DirectoryPageNew

The pagination system has been integrated into `DirectoryPageNew.js`:

```tsx
{
  /* Responsive Grid with Fluid Columns */
}
<div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {currentStations.map((station, index) => (
    <MotionDiv
      key={station.id}
      className="station-card flex h-full flex-col"
      // ... animations and content
    >
      {/* Station card content */}
    </MotionDiv>
  ))}
</div>;

{
  /* Modern Pagination with Accessibility */
}
{
  totalPages > 1 && (
    <div className="mt-8">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        totalItems={filteredStations.length}
        itemsPerPage={ITEMS_PER_PAGE}
        showItemsInfo={true}
        scrollToTop={true}
        size="md"
        animationType="fade"
        siblingCount={1}
        showFirstLast={true}
        showPrevNext={true}
      />
    </div>
  );
}
```

## ✅ Implementation Checklist

- [x] Created Pagination component with TypeScript
- [x] Created PaginatedGrid component
- [x] Added ARIA accessibility labels
- [x] Implemented keyboard navigation
- [x] Added smooth animations (fade/slide/scale)
- [x] Updated grid to use responsive Tailwind classes
- [x] Ensured uniform card heights with `h-full` and `auto-rows-fr`
- [x] Implemented consistent gap spacing
- [x] Integrated into DirectoryPageNew component
- [x] Created comprehensive documentation
- [x] Created quick reference guide
- [x] Added CSS styles with dark mode support
- [x] Fixed all linter errors
- [x] Tested keyboard navigation
- [x] Verified accessibility features

## 🎯 Benefits

1. **Better UX**: Smooth animations and intuitive navigation
2. **Accessibility**: Full keyboard and screen reader support
3. **Performance**: Efficient rendering with pagination
4. **Responsive**: Works perfectly on all device sizes
5. **Maintainable**: Clean, well-documented code
6. **Reusable**: Can be used throughout the application
7. **Consistent**: Uniform spacing and heights
8. **Professional**: Modern, polished appearance

## 🚀 Next Steps

The pagination system is ready to use! You can:

1. Use it in other pages (e.g., BlogPage, FAQPage)
2. Customize appearance for different contexts
3. Add more animation variants if needed
4. Integrate with URL parameters for shareable links
5. Add infinite scroll as an alternative option

## 📞 Support

For questions or issues:

- Review the implementation guide
- Check the quick reference
- Examine the component source code
- Test in the browser DevTools

---

**Version**: 1.0.0
**Last Updated**: October 23, 2025
**Status**: ✅ Production Ready
