# SEO Components Cleanup Summary

This document summarizes the changes made to clean up unused declarations and replace `any` types with more precise types in the SEO components.

## Files Modified

1. `./src/components/seo/LocalBusinessSchema.tsx`
2. `./src/components/seo/RichSchemaMarkup.tsx`

## Summary of Changes

### 1. LocalBusinessSchema.tsx

#### Fix 1: Removed Unused Type Imports

**Issue**: The file imported `Station` and `FuelPrice` types from `@/types/station` but never used them. The component uses `Record<string, unknown>` instead.

**Before**:
```typescript
import type { Station, FuelPrice } from '@/types/station';

interface LocalBusinessSchemaProps {
  station: Record<string, unknown>; // Using simplified station type
  fuelPrices?: Record<string, unknown>;
}
```

**After**:
```typescript
interface LocalBusinessSchemaProps {
  station: Record<string, unknown>; // Using simplified station type
  fuelPrices?: Record<string, unknown>;
}
```

**Reason**: The imported types `Station` and `FuelPrice` were declared but never referenced in the file. Removing them eliminates unused imports and complies with the `@typescript-eslint/no-unused-vars` rule.

---

#### Fix 2: Replaced `any` Type with `unknown` and Added Type Guard

**Issue**: In the `FuelPriceSchema` function, the `price` parameter was typed as `any`, which bypasses TypeScript's type checking.

**Before**:
```typescript
const offers = Object.entries(fuelPrices)
  .filter(([_, price]) => price !== null)
  .map(([type, price]: [string, any]) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Product',
      name: type.charAt(0).toUpperCase() + type.slice(1),
      category: 'Fuel',
    },
    price: price,
    priceCurrency: 'AUD',
    priceSpecification: {
      '@type': 'PriceSpecification',
      price: price / 100, // Convert cents to dollars
      priceCurrency: 'AUD',
      unitText: 'Liter',
    },
    seller: {
      '@type': 'Organization',
      name: station.name,
    },
    availability: 'https://schema.org/InStock',
    validFrom: station.lastUpdated || new Date().toISOString(),
  }));
```

**After**:
```typescript
const offers = Object.entries(fuelPrices)
  .filter(([_, price]) => price !== null)
  .map(([type, price]: [string, unknown]) => {
    const priceValue = typeof price === 'number' ? price : Number(price);
    return {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: type.charAt(0).toUpperCase() + type.slice(1),
        category: 'Fuel',
      },
      price: priceValue,
      priceCurrency: 'AUD',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: priceValue / 100, // Convert cents to dollars
        priceCurrency: 'AUD',
        unitText: 'Liter',
      },
      seller: {
        '@type': 'Organization',
        name: station.name,
      },
      availability: 'https://schema.org/InStock',
      validFrom: station.lastUpdated || new Date().toISOString(),
    };
  });
```

**Changes Made**:
1. Changed `[string, any]` to `[string, unknown]` - using `unknown` is safer than `any` as it requires type checking before use
2. Added explicit type guard: `const priceValue = typeof price === 'number' ? price : Number(price);`
3. Used `priceValue` instead of `price` throughout the object
4. Converted from arrow function shorthand to explicit return statement for better readability

**Reason**: 
- `unknown` is the type-safe top type that forces type checking before use
- The type guard ensures we handle both number and string/number-coercible values safely
- This provides better type safety and catches potential runtime errors at compile time

---

### 2. RichSchemaMarkup.tsx

#### Fix 3: Removed Unused `validateSchema` Function

**Issue**: The `validateSchema` function was declared but never called anywhere in the file or exported for use elsewhere.

**Before**:
```typescript
/**
 * Validate schema before rendering (development only)
 */
function validateSchema(schema: object): boolean {
  if (process.env.NODE_ENV !== 'development') {
    return true;
  }

  // Basic validation
  const schemaObj = schema as any;
  if (!schemaObj['@context']) {
    console.warn('Schema missing @context');
    return false;
  }

  if (!schemaObj['@type']) {
    console.warn('Schema missing @type');
    return false;
  }

  return true;
}
```

**After**:
*Function completely removed*

**Reason**: 
- The function was never called or exported
- It violated the `@typescript-eslint/no-unused-vars` rule
- It also contained an `any` type usage (`schema as any`), which we wanted to eliminate
- Since it was not being used, removal is the appropriate action rather than prefixing with underscore

---

## Type Safety Improvements

### Summary of Type Replacements

| Location | Before | After | Benefit |
|----------|--------|-------|---------|
| `LocalBusinessSchema.tsx:182` | `[string, any]` | `[string, unknown]` | Forces type checking before use |
| `RichSchemaMarkup.tsx:56` | `schema as any` | *(removed with function)* | Eliminates unsafe type assertion |

## Unused Declarations Removed

| File | Declaration | Action | Reason |
|------|-------------|--------|--------|
| `LocalBusinessSchema.tsx` | `Station` type import | Removed | Never used in file |
| `LocalBusinessSchema.tsx` | `FuelPrice` type import | Removed | Never used in file |
| `RichSchemaMarkup.tsx` | `validateSchema` function | Removed | Never called or exported |

## Verification

- ✅ All linting errors resolved
- ✅ No unused variables, functions, or types remain
- ✅ All `any` types replaced with more precise types
- ✅ Type safety improved throughout both files
- ✅ All exported functions remain functional and accessible

## Impact

These changes improve:
1. **Code Quality**: Removes dead code and unused imports
2. **Type Safety**: Eliminates `any` types, preventing potential runtime errors
3. **Maintainability**: Cleaner codebase with only used declarations
4. **Linting Compliance**: Files now comply with `@typescript-eslint/no-unused-vars` rule

All changes are backward compatible - no breaking changes to the public API of these components.

