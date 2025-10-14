# Brand Logo Quick Reference

## 🚀 Quick Start

```jsx
import { getBrandLogo } from '../utils/brandLogo';

<img 
  src={getBrandLogo(station.brand)} 
  alt={`${station.brand} logo`} 
  height={36} 
  style={{objectFit: 'contain'}} 
  loading="lazy" 
/>
```

## 📦 Import Options

```javascript
// Named imports
import { 
  getBrandLogo,        // Get logo path
  useBrandLogo,        // React hook
  getBrandClass,       // Get CSS class
  clearLogoCache,      // Clear cache
  getLogoPaths         // Debug helper
} from '../utils/brandLogo';

// Default import
import getBrandLogo from '../utils/brandLogo';
```

## 🎯 Common Usage Patterns

### Basic Image
```jsx
<img src={getBrandLogo("Shell")} alt="Shell logo" />
```

### With React Hook
```jsx
const { src, onError } = useBrandLogo(station.brand);
<img src={src} onError={onError} alt={`${station.brand} logo`} />
```

### With Brand Styling
```jsx
const brandClass = getBrandClass(station.brand);
<div className={`card-header ${brandClass}`}>
  <img src={getBrandLogo(station.brand)} alt={`${station.brand} logo`} />
</div>
```

### Complete Example
```jsx
<img 
  src={getBrandLogo(station.brand)} 
  alt={`${station.brand} logo`}
  className="brand-logo-img"
  height={36}
  width={120}
  style={{objectFit: 'contain'}}
  loading="lazy"
  onError={(e) => e.target.src = '/images/brands/default-logo.svg'}
/>
```

## 🎨 Standard Sizes

| Context | Height | Width | Class |
|---------|--------|-------|-------|
| **Card Headers** | 36px | auto | `.brand-logo` |
| **Directory List** | 32px | auto | `.brand-logo-img` |
| **Map Popups** | 28px | auto | `.map-popup .brand-logo-img` |
| **Mobile** | 28px | auto | - |

## 🎭 Supported Brands

| Brand | Filename | Alt Text Example |
|-------|----------|------------------|
| Shell | `Shell.svg` | "Shell logo" |
| BP | `BP.svg` | "BP logo" |
| 7-Eleven | `711.svg` | "7-Eleven logo" |
| Ampol | `Ampol.svg` | "Ampol logo" |
| Caltex | `Caltex.svg` | "Caltex logo" |
| Liberty | `Liberty.svg` | "Liberty logo" |
| United | `United.svg` | "United logo" |

## 🔧 CSS Classes

```css
/* Standard logo styling */
.brand-logo-img {
  height: 36px;
  max-height: 36px;
  width: auto;
  max-width: 120px;
  min-width: 36px;
  object-fit: contain;
  object-position: center;
}

/* Brand-specific colors */
.card-header.shell { background: /* Shell colors */ }
.card-header.bp { background: /* BP colors */ }
.card-header.ampol { background: /* Ampol colors */ }
```

## ⚡ Performance Best Practices

1. **Use lazy loading** below the fold
   ```jsx
   loading="lazy"
   ```

2. **Set explicit dimensions** to prevent layout shift
   ```jsx
   width={120} height={36}
   ```

3. **Always provide fallback**
   ```jsx
   onError={(e) => e.target.src = '/images/brands/default-logo.svg'}
   ```

4. **Enable caching** (default behavior)
   ```javascript
   getBrandLogo(brand) // Cache enabled by default
   ```

## ♿ Accessibility Checklist

- ✅ Always include descriptive `alt` text
- ✅ Use semantic HTML (`<img>` not background images)
- ✅ Ensure sufficient color contrast around logos
- ✅ Don't use `alt=""` unless purely decorative

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Logo not showing | Check file exists in `public/images/brands/` |
| Wrong logo | Verify brand name mapping in `brandLogo.js` |
| Blurry logo | Use SVG format, not PNG/JPG |
| Layout shift | Set explicit width/height attributes |
| Slow loading | Enable lazy loading with `loading="lazy"` |

## 🧪 Testing

```javascript
// Test imports
import { getBrandLogo, clearLogoCache } from '../utils/brandLogo';

// Test basic functionality
console.log(getBrandLogo("Shell"));    // "/images/brands/Shell.svg"
console.log(getBrandLogo("Unknown"));  // "/images/brands/default-logo.svg"

// Clear cache if needed
clearLogoCache();
```

## 📁 File Locations

```
public/images/brands/          ← Logo files go here
src/utils/brandLogo.js         ← Main utility file
docs/BRAND_LOGO_GUIDE.md       ← Full documentation
docs/examples/BrandLogoExamples.jsx  ← Usage examples
```

## 💡 Pro Tips

1. **SVG is preferred** - Scales perfectly at any size
2. **Use the hook** - `useBrandLogo()` handles errors automatically
3. **Cache is your friend** - Don't disable unless necessary
4. **Consistent sizing** - Stick to 28px, 32px, or 36px heights
5. **Brand classes** - Use `getBrandClass()` for themed styling

## 🔗 Related Resources

- [Full Documentation](./BRAND_LOGO_GUIDE.md)
- [Usage Examples](./examples/BrandLogoExamples.jsx)
- [Source Code](../src/utils/brandLogo.js)

---

**Need help?** Check the [full guide](./BRAND_LOGO_GUIDE.md) or review [examples](./examples/BrandLogoExamples.jsx).

