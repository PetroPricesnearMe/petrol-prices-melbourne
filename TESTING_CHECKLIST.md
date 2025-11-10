# 🧪 Testing Checklist - Verify All Fixes

## Quick Start

```bash
# 1. Install dependencies (if needed)
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

---

## ✅ Test 1: Hydration Errors (CRITICAL)

### Steps
1. Open browser to `http://localhost:3000`
2. Open DevTools (F12) → Console tab
3. Look for hydration warnings

### Expected Result
```
✅ NO warnings like:
   - "Text content did not match"
   - "Hydration failed"
   - "There was an error while hydrating"
```

### If You See Errors
Check `DEBUGGING_TROUBLESHOOTING_GUIDE.md` section 1

---

## ✅ Test 2: Missing Image (404 Check)

### Steps
1. Open DevTools → Network tab
2. Filter by "Img"
3. Reload page (Ctrl+R / Cmd+R)
4. Check for red/failed requests

### Expected Result
```
✅ NO 404 errors for:
   /images/hero-petrol-station.jpg

✅ Instead see:
   Beautiful gradient placeholder on hero section
```

### Visual Check
Hero section should show:
- Blue to green gradient background
- Subtle floating white circles with blur
- Smooth pulse animation

---

## ✅ Test 3: Font Loading Performance

### Steps
1. Open DevTools → Network tab
2. Clear cache (Ctrl+Shift+Del)
3. Reload page
4. Look for font requests

### Expected Result
```
✅ NO external requests to:
   - fonts.googleapis.com
   - fonts.gstatic.com

✅ Fonts load from:
   - /_next/static/... (bundled with app)
```

---

## ✅ Test 4: Core Web Vitals

### Steps - Lighthouse Audit

1. Open DevTools → Lighthouse tab
2. Select:
   - ✅ Performance
   - ✅ Accessibility  
   - ✅ Best Practices
   - ✅ SEO
3. Device: Desktop
4. Click "Analyze page load"

### Expected Results

#### Performance: 90+ (Green)
- **FCP:** < 1.8s ✅
- **LCP:** < 2.5s ✅
- **TBT:** < 300ms ✅
- **CLS:** < 0.1 ✅
- **Speed Index:** < 3.4s ✅

#### Accessibility: 95+ (Green)
- Color contrast passing
- ARIA labels present
- Keyboard navigation working

---

## ✅ Test 5: Mobile Responsiveness

### Steps
1. Open DevTools → Toggle device toolbar (Ctrl+Shift+M)
2. Test these viewports:
   - Mobile: 375x667 (iPhone SE)
   - Tablet: 768x1024 (iPad)
   - Desktop: 1920x1080

### Expected Result
```
✅ All breakpoints:
   - No horizontal scroll
   - Text readable without zoom
   - Images scale properly
   - Navigation accessible
   - Touch targets ≥ 44px
```

### Visual Checks

**Mobile (< 640px)**
- Single column layout
- Stack navigation
- Full-width hero

**Tablet (640-1024px)**
- 2-3 column grid
- Readable typography
- Proper spacing

**Desktop (> 1024px)**
- Multi-column layout
- Hero section with content + visual
- Footer grid layout

---

## ✅ Test 6: Dark Mode

### Steps
1. Look for theme toggle (usually top-right)
2. Click to toggle dark mode
3. Check all sections

### Expected Result
```
✅ Dark mode works:
   - Background: Dark gray/black
   - Text: Light colors (high contrast)
   - Cards: Dark with borders
   - No flashing/flickering
   - Colors remain accessible
```

---

## ✅ Test 7: Console Errors

### Steps
1. DevTools → Console
2. Clear console
3. Navigate through pages:
   - Home `/`
   - Directory `/directory`
   - Map `/map`
   - About `/about`

### Expected Result
```
✅ NO errors (red messages)
✅ NO warnings about:
   - PropTypes
   - Keys in lists
   - Memory leaks
   - Failed requests
```

---

## ✅ Test 8: Production Build

### Steps
```bash
# Build for production
npm run build

# Check build output
# Should see:
# ✓ Generating static pages
# ✓ Finalizing page optimization

# Run production server
npm run start
```

### Expected Result
```
✅ Build succeeds without errors
✅ All pages generated
✅ No TypeScript errors
✅ No ESLint errors
✅ Bundle size reasonable
```

### Check Bundle Size
Look for in build output:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    X KB     XXX KB
├ ○ /about                               X KB     XXX KB
└ ○ /directory                           X KB     XXX KB

○  (Static)  prerendered as static content

✅ Target: First Load JS < 200 KB per page
```

---

## ✅ Test 9: Accessibility

### Keyboard Navigation
1. Press Tab to navigate
2. Check:
   - Visible focus indicators
   - Skip to content link
   - All interactive elements reachable
   - Modal traps focus correctly

### Screen Reader
1. Enable screen reader:
   - Windows: NVDA (free)
   - Mac: VoiceOver (Cmd+F5)
2. Check:
   - Headings hierarchy (H1 → H2 → H3)
   - Alt text on images
   - Form labels
   - Button descriptions

### Expected Result
```
✅ Focus visible on all elements
✅ Logical tab order
✅ All content accessible
✅ ARIA labels present
```

---

## ✅ Test 10: SEO & Metadata

### Steps
1. View page source (Ctrl+U)
2. Check `<head>` section

### Expected Result
```html
✅ Title present and unique
<title>Find Cheapest Petrol Prices Near Me | Save Up to 20c/L</title>

✅ Meta description
<meta name="description" content="Compare live petrol prices..." />

✅ Open Graph tags
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />

✅ Canonical URL
<link rel="canonical" href="https://petrolpricenearme.com.au" />

✅ Structured data (JSON-LD)
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  ...
}
</script>
```

---

## 🚨 Common Issues & Fixes

### Issue: Hydration Error Still Appears

**Solution:**
```bash
# Clear .next cache
rm -rf .next
npm run dev
```

### Issue: Styles Not Updating

**Solution:**
```bash
# Clear Tailwind cache
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

### Issue: Module Not Found

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
rm package-lock.json
npm install
```

### Issue: TypeScript Errors

**Solution:**
```bash
# Check types
npm run type-check

# If useMounted not found:
# Ensure src/hooks/useMounted.ts exists
```

---

## 📊 Performance Benchmarks

### Target Metrics (Desktop)

| Metric | Target | Good | Needs Improvement |
|--------|--------|------|-------------------|
| **FCP** | < 1.2s | < 1.8s | 1.8s - 3s |
| **LCP** | < 1.8s | < 2.5s | 2.5s - 4s |
| **TBT** | < 200ms | < 300ms | 300ms - 600ms |
| **CLS** | < 0.05 | < 0.1 | 0.1 - 0.25 |
| **Speed Index** | < 2.0s | < 3.4s | 3.4s - 5.8s |

### Target Metrics (Mobile)

| Metric | Target | Good | Needs Improvement |
|--------|--------|------|-------------------|
| **FCP** | < 1.8s | < 3s | 3s - 5s |
| **LCP** | < 2.5s | < 4s | 4s - 6s |
| **TBT** | < 300ms | < 600ms | 600ms - 900ms |
| **CLS** | < 0.1 | < 0.25 | 0.25 - 0.5 |
| **Speed Index** | < 3.4s | < 5.8s | 5.8s - 8s |

---

## ✅ Final Checklist

- [ ] ✅ No hydration errors in console
- [ ] ✅ No 404 errors for images
- [ ] ✅ Fonts load from /_next/static/
- [ ] ✅ Lighthouse Performance > 90
- [ ] ✅ Lighthouse Accessibility > 95
- [ ] ✅ Mobile responsive (test 3 breakpoints)
- [ ] ✅ Dark mode works without flicker
- [ ] ✅ No console errors or warnings
- [ ] ✅ Production build succeeds
- [ ] ✅ Keyboard navigation works
- [ ] ✅ Screen reader accessible
- [ ] ✅ SEO metadata present
- [ ] ✅ First Load JS < 200KB per page
- [ ] ✅ All Core Web Vitals in "Good" range

---

## 📞 Need Help?

### Documentation
- `DEBUGGING_TROUBLESHOOTING_GUIDE.md` - Comprehensive solutions
- `DEBUGGING_FIXES_APPLIED.md` - Summary of changes
- `VERIFICATION_TESTING_GUIDE.md` - Testing strategies

### Check Specific Issues
1. **Hydration:** See guide section 1
2. **Images:** See guide section 2
3. **Fonts/Preload:** See guide section 3
4. **Tailwind:** See guide section 4
5. **Console Errors:** See guide section 5

---

## 🎉 Success Criteria

Your application is production-ready when:

1. ✅ All 10 tests pass
2. ✅ Lighthouse scores > 90 (Performance, Accessibility)
3. ✅ Zero console errors
4. ✅ Core Web Vitals in "Good" range
5. ✅ Mobile responsive on all devices
6. ✅ Dark mode functional
7. ✅ Production build succeeds
8. ✅ SEO metadata complete

---

**Last Updated:** November 10, 2025  
**Status:** Ready for Testing ✅

