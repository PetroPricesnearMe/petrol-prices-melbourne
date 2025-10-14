# Brand Logo Implementation Guide

## Overview

The brand logo system provides a consistent, performant way to display petrol station brand logos across the application. It supports multiple image formats (PNG, SVG, JPG), handles fallbacks gracefully, and ensures optimal performance with lazy loading and layout shift prevention.

## Quick Start

### Basic Usage

```jsx
import { getBrandLogo } from '../utils/brandLogo';

function StationCard({ station }) {
  return (
    <img 
      src={getBrandLogo(station.brand)} 
      alt={`${station.brand} logo`} 
      height={36} 
      style={{objectFit: 'contain'}} 
      loading="lazy" 
    />
  );
}
```

### Using the React Hook

```jsx
import { useBrandLogo } from '../utils/brandLogo';

function StationCard({ station }) {
  const { src, onError } = useBrandLogo(station.brand);
  
  return (
    <img 
      src={src} 
      onError={onError}
      alt={`${station.brand} logo`} 
      className="brand-logo-img"
      loading="lazy" 
    />
  );
}
```

## API Reference

### `getBrandLogo(brandName, options)`

Returns the optimal path to a brand's logo image.

**Parameters:**
- `brandName` (string): The brand name (e.g., "Shell", "BP", "7-Eleven")
- `options` (object, optional):
  - `useCache` (boolean, default: true): Whether to use cached logo paths

**Returns:** 
- (string): Path to the brand logo image

**Examples:**
```javascript
getBrandLogo("Shell");        // => "/images/brands/Shell.svg"
getBrandLogo("BP");           // => "/images/brands/BP.svg"
getBrandLogo("7-Eleven");     // => "/images/brands/711.svg"
getBrandLogo("Unknown");      // => "/images/brands/default-logo.svg"
getBrandLogo("BP", { useCache: false }); // Fresh lookup without cache
```

### `useBrandLogo(brandName)`

React hook that provides logo source and error handler.

**Parameters:**
- `brandName` (string): The brand name

**Returns:**
- (object): Object with `src` and `onError` properties

**Example:**
```jsx
const { src, onError } = useBrandLogo(station.brand);
```

### `getBrandClass(brandName)`

Returns a CSS class name for brand-specific styling.

**Parameters:**
- `brandName` (string): The brand name

**Returns:**
- (string): CSS class name (e.g., "shell", "bp", "seven-eleven")

**Example:**
```jsx
const brandClass = getBrandClass(station.brand);
<div className={`card-header ${brandClass}`}>...</div>
```

### `clearLogoCache()`

Clears the internal logo path cache. Useful for testing or when logo files are updated.

**Example:**
```javascript
clearLogoCache(); // Clear all cached logo paths
```

### `getLogoPaths(brandName)`

Returns all possible logo paths for a given brand (useful for debugging).

**Parameters:**
- `brandName` (string): The brand name

**Returns:**
- (string[]): Array of possible logo paths

**Example:**
```javascript
const paths = getLogoPaths("Shell");
// => ["/images/brands/Shell.svg", "/images/brands/Shell.png", ...]
```

## Supported Brands

The system includes built-in support for these major Australian petrol brands:

- **Shell** → `Shell.svg`
- **BP** → `BP.svg`
- **7-Eleven** → `711.svg`
- **Ampol** → `Ampol.svg`
- **Caltex** → `Caltex.svg`
- **Liberty** → `Liberty.svg`
- **United** → `United.svg`
- **Mobil** → `Mobil.svg` (if available)
- **Coles Express** → `Coles.svg` (if available)
- **Metro** → `Metro.svg` (if available)

### Adding New Brands

To add a new brand logo:

1. Add the logo file to `public/images/brands/` (SVG preferred)
2. Update the `BRAND_NAME_MAP` in `src/utils/brandLogo.js`:

```javascript
const BRAND_NAME_MAP = {
  // ... existing brands
  'newbrand': 'NewBrand',  // lowercase key, PascalCase filename
};
```

## Image Formats

Supported formats in order of preference:
1. **SVG** (Scalable Vector Graphics) - Recommended
2. **PNG** (Portable Network Graphics)
3. **JPG/JPEG** (Joint Photographic Experts Group)

The system automatically checks for available formats in this order.

## CSS Styling

### Predefined CSS Classes

#### `.brand-logo`
For logos in station cards:
```css
.brand-logo {
  height: 36px;
  max-width: 120px;
  object-fit: contain;
}
```

#### `.brand-logo-img`
General-purpose logo styling:
```css
.brand-logo-img {
  height: 36px;
  max-height: 36px;
  width: auto;
  min-width: 36px;
  object-fit: contain;
  loading: lazy;
}
```

### Custom Styling

You can override the default styles:

```jsx
<img 
  src={getBrandLogo(station.brand)} 
  alt={`${station.brand} logo`}
  style={{
    height: '48px',
    maxWidth: '150px',
    objectFit: 'contain'
  }}
/>
```

## Performance Optimization

### Lazy Loading

Always use `loading="lazy"` for logos that appear below the fold:

```jsx
<img 
  src={getBrandLogo(station.brand)} 
  loading="lazy"
  alt={`${station.brand} logo`}
/>
```

### Layout Shift Prevention

Use explicit dimensions to prevent Cumulative Layout Shift (CLS):

```jsx
<img 
  src={getBrandLogo(station.brand)} 
  width={120}
  height={36}
  style={{objectFit: 'contain'}}
  alt={`${station.brand} logo`}
/>
```

### Caching

The system automatically caches logo path resolutions. To disable caching:

```javascript
getBrandLogo(brandName, { useCache: false });
```

## Real-World Examples

### Station Card Component

```jsx
import React from 'react';
import { getBrandLogo, getBrandClass } from '../utils/brandLogo';

function StationCard({ station }) {
  return (
    <div className="station-card">
      <div className={`card-header ${getBrandClass(station.brand)}`}>
        <img
          src={getBrandLogo(station.brand)}
          alt={`${station.brand} logo`}
          className="brand-logo"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/brands/default-logo.svg';
          }}
        />
        <div className="brand-badge">{station.brand}</div>
      </div>
      <div className="card-content">
        <h3>{station.name}</h3>
        {/* ... rest of card content ... */}
      </div>
    </div>
  );
}
```

### Directory Listing

```jsx
import React from 'react';
import { useBrandLogo } from '../utils/brandLogo';

function DirectoryListing({ stations }) {
  return (
    <div className="directory-list">
      {stations.map(station => {
        const { src, onError } = useBrandLogo(station.brand);
        
        return (
          <div key={station.id} className="directory-list-item">
            <div className="brand-logo-container">
              <img 
                src={src}
                onError={onError}
                alt={`${station.brand} logo`}
                className="brand-logo-img"
                loading="lazy"
                width={36}
                height={36}
              />
              <span className="station-name">{station.name}</span>
            </div>
            {/* ... rest of listing item ... */}
          </div>
        );
      })}
    </div>
  );
}
```

### Map Popup

```jsx
import React from 'react';
import { getBrandLogo } from '../utils/brandLogo';

function MapPopup({ station }) {
  return (
    <div className="map-popup">
      <div className="popup-header">
        <img 
          src={getBrandLogo(station.brand)}
          alt={`${station.brand} logo`}
          className="brand-logo-img"
          height={28}
          style={{objectFit: 'contain'}}
        />
        <h4>{station.name}</h4>
      </div>
      {/* ... popup content ... */}
    </div>
  );
}
```

## Accessibility

Always include descriptive alt text:

```jsx
<img 
  src={getBrandLogo(station.brand)} 
  alt={`${station.brand} logo`}  // Good: Descriptive
  // NOT: alt="logo"               // Bad: Too generic
  // NOT: alt=""                   // Bad: Only for decorative images
/>
```

## Troubleshooting

### Logo Not Displaying

1. **Check the file exists**: Verify the logo file is in `public/images/brands/`
2. **Check the filename**: Ensure it matches the format in `BRAND_NAME_MAP`
3. **Check browser console**: Look for 404 errors
4. **Clear cache**: Call `clearLogoCache()` if recently updated

### Wrong Logo Showing

1. **Check brand name mapping**: Verify `BRAND_NAME_MAP` has the correct entry
2. **Check case sensitivity**: Brand names are normalized but check for typos
3. **Debug with `getLogoPaths`**: See all attempted paths

```javascript
console.log(getLogoPaths("My Brand"));
```

### Performance Issues

1. **Use lazy loading**: Add `loading="lazy"` to images below the fold
2. **Optimize SVGs**: Minify SVG files to reduce file size
3. **Use caching**: Don't disable cache unless necessary
4. **Preload critical logos**: For above-the-fold logos:

```html
<link rel="preload" as="image" href="/images/brands/Shell.svg">
```

## Best Practices

1. **Prefer SVG format** - Scales perfectly at any size
2. **Always provide alt text** - Essential for accessibility
3. **Use lazy loading** - Improves initial page load performance
4. **Prevent layout shift** - Specify width/height attributes
5. **Handle errors gracefully** - Always include onError fallback
6. **Use consistent sizing** - Stick to standard heights (28px, 32px, 36px)
7. **Cache logo paths** - Enable caching for better performance

## File Structure

```
public/
└── images/
    └── brands/
        ├── Shell.svg
        ├── BP.svg
        ├── 711.svg
        ├── Ampol.svg
        ├── Caltex.svg
        ├── Liberty.svg
        ├── United.svg
        ├── default-logo.svg
        └── default-logo.css

src/
└── utils/
    └── brandLogo.js
```

## Testing

```javascript
// Test basic functionality
import { getBrandLogo, clearLogoCache } from '../utils/brandLogo';

// Test known brand
expect(getBrandLogo("Shell")).toBe("/images/brands/Shell.svg");

// Test unknown brand
expect(getBrandLogo("Unknown")).toBe("/images/brands/default-logo.svg");

// Test case insensitivity
expect(getBrandLogo("shell")).toBe("/images/brands/Shell.svg");
expect(getBrandLogo("SHELL")).toBe("/images/brands/Shell.svg");

// Test cache clearing
clearLogoCache();
```

## Migration Guide

### From Old System

If you were using a hardcoded logo mapping:

**Before:**
```javascript
const brandLogos = {
  'Shell': '/images/brands/shell-logo.png',
  'BP': '/images/brands/bp-logo.png',
};

const logo = brandLogos[station.brand] || '/default.png';
```

**After:**
```javascript
import { getBrandLogo } from '../utils/brandLogo';

const logo = getBrandLogo(station.brand);
```

## Support

For issues or questions:
1. Check this guide
2. Review the code in `src/utils/brandLogo.js`
3. Check browser console for errors
4. Open an issue on the project repository

---

**Last Updated:** October 2025  
**Version:** 1.0.0

