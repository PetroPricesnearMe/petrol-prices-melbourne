# Pagination & Grid - Quick Reference

## 🚀 Quick Start

### Basic Pagination

```tsx
import Pagination from '@/components/common/Pagination';

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>;
```

### Basic Grid

```tsx
<div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map((item) => (
    <div key={item.id} className="h-full">
      <Card {...item} />
    </div>
  ))}
</div>
```

### PaginatedGrid (All-in-One)

```tsx
import { PaginatedGrid } from '@/components/common/PaginatedGrid';

<PaginatedGrid items={items} renderItem={(item) => <Card {...item} />} />;
```

## 📋 Common Props

### Pagination Props

| Prop            | Type                        | Default  | Description              |
| --------------- | --------------------------- | -------- | ------------------------ |
| `currentPage`   | number                      | required | Current page (1-indexed) |
| `totalPages`    | number                      | required | Total pages              |
| `onPageChange`  | function                    | required | Page change handler      |
| `size`          | 'sm' \| 'md' \| 'lg'        | 'md'     | Button size              |
| `animationType` | 'fade' \| 'slide' \| 'none' | 'fade'   | Animation type           |
| `showItemsInfo` | boolean                     | true     | Show "Showing X-Y of Z"  |
| `scrollToTop`   | boolean                     | true     | Auto scroll on change    |

### PaginatedGrid Props

| Prop            | Type     | Default  | Description      |
| --------------- | -------- | -------- | ---------------- |
| `items`         | array    | required | Items to display |
| `renderItem`    | function | required | Render function  |
| `itemsPerPage`  | number   | 12       | Items per page   |
| `gap`           | string   | 'md'     | Gap size         |
| `animationType` | string   | 'fade'   | Animation type   |

## ⌨️ Keyboard Shortcuts

| Key     | Action           |
| ------- | ---------------- |
| `←`     | Previous page    |
| `→`     | Next page        |
| `Home`  | First page       |
| `End`   | Last page        |
| `Tab`   | Navigate buttons |
| `Enter` | Activate button  |

## 🎨 Grid Breakpoints

| Breakpoint | Columns | Screen   |
| ---------- | ------- | -------- |
| base       | 1       | < 640px  |
| sm         | 2       | ≥ 640px  |
| lg         | 3       | ≥ 1024px |
| xl         | 4       | ≥ 1280px |

## 📏 Gap Sizes

```tsx
gap - 4; // 1rem (16px) - Small
gap - 6; // 1.5rem (24px) - Medium ⭐
gap - 8; // 2rem (32px) - Large
```

## ✅ Checklist

- [ ] Import Pagination component
- [ ] Set currentPage state
- [ ] Calculate totalPages
- [ ] Add onPageChange handler
- [ ] Use grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- [ ] Add gap-6 for spacing
- [ ] Add h-full to cards
- [ ] Add auto-rows-fr to grid
- [ ] Test keyboard navigation
- [ ] Verify ARIA labels

## 🐛 Common Issues

### Cards Different Heights

```tsx
// ❌ Wrong
<div className="station-card">

// ✅ Correct
<div className="station-card h-full flex flex-col">
```

### No Pagination Showing

```tsx
// ❌ Wrong
totalPages === 1; // Pagination hidden

// ✅ Correct
totalPages >= 2; // Pagination shows
```

### Animation Not Working

```bash
# Install Framer Motion
npm install framer-motion
```

## 📝 Code Snippets

### Calculate Pagination

```tsx
const itemsPerPage = 12;
const totalPages = Math.ceil(items.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const currentItems = items.slice(startIndex, startIndex + itemsPerPage);
```

### Uniform Card Heights

```tsx
<div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  <div className="flex h-full flex-col">
    <div className="flex-1">{/* Content */}</div>
  </div>
</div>
```

### Server-Side Pagination

```tsx
const [page, setPage] = useState(1);

useEffect(() => {
  fetch(`/api/items?page=${page}`)
    .then((res) => res.json())
    .then((data) => {
      setItems(data.items);
      setTotalPages(data.totalPages);
    });
}, [page]);
```

## 🎯 Best Practices

1. **Always** use `h-full` on grid items
2. **Always** use `auto-rows-fr` on grid container
3. **Always** provide ARIA labels
4. **Use** consistent gap spacing
5. **Test** keyboard navigation
6. **Optimize** with React.memo for cards
7. **Provide** empty and loading states

## 📞 Need Help?

- Check `PAGINATION_IMPLEMENTATION_GUIDE.md` for detailed docs
- Review component source code
- Test with browser DevTools

---

⭐ **Pro Tip**: Use `PaginatedGrid` for quick implementation with all features built-in!
