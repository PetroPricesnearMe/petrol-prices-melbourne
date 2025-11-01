# 🧪 Advanced Search Bar - Test Instructions

## 🚀 How to Access Test Page

1. **Start Dev Server** (if not running):
   ```bash
   npm run dev
   ```

2. **Open Test Page**:
   ```
   http://localhost:3000/search-test
   ```

---

## ✅ Testing Checklist

### 1. Autocomplete Suggestions

- [ ] **Type "Shell"** - Should show Shell stations in dropdown
- [ ] **Type "BP"** - Should show BP stations
- [ ] **Type "Carlton"** - Should show Carlton area stations
- [ ] **Type first 2 letters** - Suggestions appear immediately
- [ ] **Clear input** - Dropdown closes

**Expected:** Dropdown appears with up to 8 matching suggestions

---

### 2. Fuzzy Search

- [ ] **Type "Shel"** (typo) - Should still find "Shell"
- [ ] **Type "Carton"** (typo) - Should find "Carlton"
- [ ] **Type "Melborn"** (typo) - Should find "Melbourne"
- [ ] **Type "sevn"** (typo) - Should find "Seven" / "7-Eleven"

**Expected:** Fuzzy matching finds results despite typos

---

### 3. Category Filters

- [ ] **Click "All" category** - Searches all fields
- [ ] **Click "Brand" category** - Only searches brand names
- [ ] **Click "Suburb" category** - Only searches suburb names
- [ ] **Click "Name" category** - Only searches station names
- [ ] **Type in different categories** - Results change based on category

**Expected:** Category filter limits search scope

---

### 4. Keyboard Navigation

- [ ] **Type in search** - Dropdown appears
- [ ] **Press ↓ (Down Arrow)** - First suggestion highlights
- [ ] **Press ↓ again** - Next suggestion highlights
- [ ] **Press ↑ (Up Arrow)** - Previous suggestion highlights
- [ ] **Press Enter** - Selected suggestion fills input
- [ ] **Press ESC** - Dropdown closes
- [ ] **Tab through categories** - Can navigate with keyboard

**Expected:** Full keyboard control without mouse

---

### 5. Recent Searches

- [ ] **Perform a search** (e.g., "Shell")
- [ ] **Clear the input** (click X button)
- [ ] **Click in input field** - Recent searches appear
- [ ] **Click a recent search** - Repeats that search
- [ ] **Click "Clear" button** - Recent searches removed

**Expected:** Recent searches persist and can be reused

---

### 6. Visual Feedback

- [ ] **Focus input** - Blue border appears
- [ ] **Selected suggestion** - Blue highlight background
- [ ] **Hover suggestion** - Hover effect
- [ ] **Match quality score** - Green percentage badge shows
- [ ] **Highlighted text** - Search terms highlighted in yellow
- [ ] **Loading state** - Spinner appears if loading

**Expected:** Clear visual feedback for all interactions

---

### 7. Mobile Responsiveness

- [ ] **Resize to 375px width** (iPhone SE)
- [ ] **Resize to 768px width** (iPad)
- [ ] **Test touch interactions** - Can tap suggestions
- [ ] **Categories wrap properly** - No horizontal scroll
- [ ] **Dropdown fits screen** - Max height adapts

**Expected:** Works perfectly on mobile devices

---

### 8. Dark Mode

- [ ] **Enable dark mode** (OS setting or browser)
- [ ] **Check search input** - Dark background
- [ ] **Check dropdown** - Dark theme
- [ ] **Check highlights** - Readable in dark mode
- [ ] **Check contrast** - All text readable

**Expected:** Full dark mode support

---

### 9. Edge Cases

- [ ] **Search with no results** - "No results" message appears
- [ ] **Search empty string** - Shows all results
- [ ] **Very long station name** - Text truncates properly
- [ ] **Special characters** - Handles @ # $ % etc.
- [ ] **Numbers only** - Handles numeric search

**Expected:** Graceful handling of edge cases

---

### 10. Performance

- [ ] **Type quickly** - Debounce prevents excessive searches
- [ ] **Search 50+ stations** - No lag
- [ ] **Scroll dropdown** - Smooth scrolling
- [ ] **Multiple category switches** - Fast response

**Expected:** Smooth performance with 50+ items

---

## 🐛 Common Issues & Fixes

### Issue: Suggestions not appearing

**Check:**
- Dev server is running (`npm run dev`)
- No console errors (F12 > Console)
- Station data is loaded
- Search keys are configured correctly

**Fix:**
```typescript
// Check searchKeys prop
searchKeys={['name', 'brand', 'suburb', 'address']}
```

### Issue: Fuzzy search too strict

**Adjust threshold in AdvancedSearchBar.tsx:**
```typescript
threshold: 0.5, // Higher = more fuzzy (0.0 = exact, 1.0 = match anything)
```

### Issue: Keyboard navigation not working

**Check:**
- Event handlers in place
- No other components capturing keydown
- Suggestions have proper data-index

### Issue: Recent searches not saving

**Check:**
- localStorage is available
- No browser privacy mode
- enableRecentSearches={true}

---

## 📊 Expected Results

### Good Search Examples

| Query | Expected Results |
|-------|------------------|
| "Shell" | All Shell stations |
| "Carlton" | All Carlton area stations |
| "BP Richmond" | BP stations in Richmond |
| "Mobil" | All Mobil stations |
| "3000" | Stations in postcode 3000 |

### Fuzzy Search Examples

| Typo | Should Find |
|------|-------------|
| "Shel" | Shell |
| "sevn eleven" | 7-Eleven |
| "Carton" | Carlton |
| "Collingood" | Collingwood |

---

## ✅ Success Criteria

**All tests pass if:**
- ✅ Autocomplete shows relevant results
- ✅ Fuzzy search handles typos
- ✅ Category filters work correctly
- ✅ Keyboard navigation is smooth
- ✅ Recent searches persist
- ✅ Mobile responsive
- ✅ Dark mode works
- ✅ No console errors
- ✅ Performance is good

---

## 🎯 Quick Test Script

**Run this sequence:**

1. Type "Shell" → Should show Shell stations
2. Press ↓ → First suggestion highlights
3. Press Enter → Station name fills input
4. Press ESC → Dropdown closes
5. Clear input → Click in field → Recent searches appear
6. Click "Brand" category → Type "BP" → Only searches brands
7. Resize browser to 400px → Everything still works

**If all 7 steps work:** ✅ SUCCESS!

---

**Test Page:** http://localhost:3000/search-test
**Directory Page:** http://localhost:3000/directory

**Ready to test!** 🚀
