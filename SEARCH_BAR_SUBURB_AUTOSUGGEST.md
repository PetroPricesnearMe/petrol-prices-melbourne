# Search Bar Suburb Auto-Suggest Enhancement

## Overview
Enhanced search bars with suburb auto-suggest functionality using the existing dataset. The enhancement provides intelligent suburb suggestions as users type, improving search UX without replacing existing search functionality.

## Features Added

### 1. ✅ Suburb Auto-Suggest Hook
**File:** `src/hooks/useSuburbSuggestions.ts`

**Features:**
- Uses existing `stations-metadata.json` dataset
- Debounced search (200ms default)
- Relevance scoring (exact match > starts with > contains)
- Station count boosting (more stations = higher relevance)
- Popular suburbs when query is empty
- Configurable min chars, max results, debounce delay

**Usage:**
```typescript
const { suggestions, loading, popularSuburbs } = useSuburbSuggestions(query, {
  minChars: 2,
  maxResults: 8,
  debounceMs: 200,
});
```

### 2. ✅ Suburb Auto-Suggest Component
**File:** `src/components/molecules/SuburbAutoSuggest/SuburbAutoSuggest.tsx`

**Features:**
- Dropdown suggestions list
- Keyboard navigation (Arrow keys, Enter, Escape)
- Click outside to close
- Loading state with spinner
- Popular suburbs when query is empty
- Station count display
- Direct links to suburb pages
- Accessible (ARIA labels, roles)
- Dark mode support

**Props:**
- `query` - Search query string
- `onSelect` - Callback when suburb is selected
- `onClose` - Callback when dropdown closes
- `maxResults` - Maximum suggestions (default: 8)
- `minChars` - Minimum characters to show suggestions (default: 2)
- `showPopular` - Show popular suburbs when empty (default: true)

### 3. ✅ Enhanced FilterSearchBar
**File:** `src/components/molecules/FilterSearchBar/FilterSearchBar.tsx`

**Enhancements:**
- Integrated `SuburbAutoSuggest` component
- Shows suggestions on focus
- Auto-fills search on suburb selection
- Maintains all existing functionality
- Keyboard navigation support

### 4. ✅ Enhanced InfiniteScrollDirectory
**File:** `src/components/directory/InfiniteScrollDirectory.tsx`

**Enhancements:**
- Added suburb auto-suggest to search input
- Integrated with existing filter system
- Maintains backward compatibility

## Implementation Details

### Search Algorithm
1. **Exact Match** (score: 1000) - Highest priority
2. **Starts With** (score: 500) - High priority
3. **Word Boundary** (score: 200) - Medium priority
4. **Contains** (score: 100) - Lower priority
5. **Station Count Boost** (+0.1 per station) - Relevance boost

### Debouncing
- Uses `debouncedFetch` from enhanced-fetcher
- 200ms delay to reduce API calls
- Cached results for better performance

### Keyboard Navigation
- **Arrow Down** - Next suggestion
- **Arrow Up** - Previous suggestion
- **Enter** - Select current suggestion
- **Escape** - Close dropdown

### Popular Suburbs
- Shows top 5 suburbs by station count
- Displayed when search query is empty
- Helps users discover popular areas

## Components Created

1. **`src/hooks/useSuburbSuggestions.ts`**
   - React hook for suburb suggestions
   - Debounced search
   - Relevance scoring

2. **`src/components/molecules/SuburbAutoSuggest/SuburbAutoSuggest.tsx`**
   - Dropdown component
   - Keyboard navigation
   - Accessibility support

3. **`src/components/molecules/SuburbAutoSuggest/index.ts`**
   - Export file for easy imports

## Components Enhanced

1. **`src/components/molecules/FilterSearchBar/FilterSearchBar.tsx`**
   - Added suburb auto-suggest integration
   - Enhanced search input with suggestions

2. **`src/components/directory/InfiniteScrollDirectory.tsx`**
   - Added suburb auto-suggest to search
   - Integrated with filter system

## Usage Examples

### Basic Integration
```typescript
import { SuburbAutoSuggest } from '@/components/molecules/SuburbAutoSuggest';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && (
        <SuburbAutoSuggest
          query={query}
          onSelect={(suburb) => {
            setQuery(suburb);
            setShowSuggestions(false);
          }}
        />
      )}
    </div>
  );
}
```

### With Hook
```typescript
import { useSuburbSuggestions } from '@/hooks/useSuburbSuggestions';

function CustomSearch() {
  const [query, setQuery] = useState('');
  const { suggestions, loading, popularSuburbs } = useSuburbSuggestions(query);

  // Render suggestions manually
}
```

## Data Source

- Uses `src/data/stations-metadata.json`
- Accesses `suburbs` array
- Uses `stats.bySuburb` for station counts
- Only shows suburbs with stations (filters out empty suburbs)

## Performance Optimizations

1. **Debouncing** - Reduces search calls
2. **Memoization** - Caches suburb list
3. **Relevance Scoring** - Fast filtering and sorting
4. **Caching** - Uses enhanced-fetcher cache
5. **Lazy Rendering** - Only renders when needed

## Accessibility

- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management
- Semantic HTML

## Styling

- Consistent with existing design
- Dark mode support
- Responsive design
- Touch-friendly (44px+ touch targets)
- Smooth animations

## Testing Recommendations

1. Test with various query lengths
2. Test keyboard navigation
3. Test click outside behavior
4. Test with empty query (popular suburbs)
5. Test with invalid queries
6. Test accessibility with screen readers
7. Test on mobile devices

## Files Created

- ✅ `src/hooks/useSuburbSuggestions.ts`
- ✅ `src/components/molecules/SuburbAutoSuggest/SuburbAutoSuggest.tsx`
- ✅ `src/components/molecules/SuburbAutoSuggest/index.ts`

## Files Modified

- ✅ `src/components/molecules/FilterSearchBar/FilterSearchBar.tsx`
- ✅ `src/components/directory/InfiniteScrollDirectory.tsx`

## Backward Compatibility

All changes maintain:
- ✅ Existing search functionality
- ✅ Existing filter system
- ✅ Existing API interfaces
- ✅ No breaking changes

## Future Enhancements (Optional)

1. Add recent searches
2. Add search history
3. Add analytics tracking
4. Add voice search support
5. Add geolocation-based suggestions

