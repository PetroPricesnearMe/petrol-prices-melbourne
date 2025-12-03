# Location Pages Testing Guide

## ✅ Verification Checklist

### 1. Build Test

```bash
npm run build
```

**Expected:** Build completes successfully (ignore pre-existing TS errors in other files)

### 2. Start Dev Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 🧪 Test Routes

### Type 1: Suburb + Fuel Type Pages

**Test URLs:**

```
http://localhost:3000/melbourne/coburg/unleaded
http://localhost:3000/melbourne/epping/diesel
http://localhost:3000/melbourne/preston/premium
http://localhost:3000/melbourne/box-hill/e10
```

**What to Check:**

- ✅ Page loads without errors
- ✅ H1: "Cheapest {FuelType} Prices in {Suburb} – Updated Today"
- ✅ Breadcrumbs work (Home > Melbourne > {Suburb} > {FuelType})
- ✅ Station list displays with prices
- ✅ Sort dropdown functions
- ✅ Quick links to other fuel types
- ✅ Statistics show (Cheapest/Average prices)
- ✅ Last updated timestamp displays
- ✅ "View Details" and "Get Directions" buttons work

**404 Test:**

```
http://localhost:3000/melbourne/invalidsuburb/unleaded
```

Should show 404 page

---

### Type 2: Brand + Suburb Pages

**Test URLs:**

```
http://localhost:3000/servo/bp-coburg
http://localhost:3000/servo/caltex-epping
http://localhost:3000/servo/7-eleven-preston
```

**What to Check:**

- ✅ Page loads without errors
- ✅ H1: "{Brand} Petrol Stations in {Suburb}"
- ✅ All fuel types display for each station
- ✅ Fuel type filter buttons work
- ✅ Price comparison grid displays
- ✅ Brand information in sidebar
- ✅ Opening hours section
- ✅ FAQ section

**Invalid Brand Test:**

```
http://localhost:3000/servo/invalidbrand-coburg
```

Should show 404 page

---

### Type 3: Today's Prices Pages

**Test URLs:**

```
http://localhost:3000/suburb/fuel-prices-coburg-today
http://localhost:3000/suburb/fuel-prices-epping-today
http://localhost:3000/suburb/fuel-prices-preston-today
```

**What to Check:**

- ✅ Page loads without errors
- ✅ H1 includes "Today" and current date
- ✅ Price summary cards (Unleaded/Diesel/Premium stats)
- ✅ All 5 fuel types displayed per station
- ✅ Ranking indicators (🥇🥈🥉) for top 3
- ✅ Sort functionality works
- ✅ Current date/time in AEST
- ✅ FAQ section with relevant questions
- ✅ Pro tip alert box

---

## 🔍 SEO Testing

### View Page Source

Right-click → "View Page Source" on any test page

**Check for:**

1. **Title Tag:**

```html
<title>Cheapest Unleaded Prices in Coburg – Updated Today</title>
```

2. **Meta Description:**

```html
<meta name="description" content="Find the best unleaded prices in Coburg..." />
```

3. **Canonical URL:**

```html
<link
  rel="canonical"
  href="https://petrolpricenearme.com.au/melbourne/coburg/unleaded"
/>
```

4. **Open Graph Tags:**

```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:url" content="..." />
```

5. **JSON-LD Schema:**

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [...]
  }
</script>
```

---

## 🌐 Rich Snippet Testing

### Google Rich Results Test

1. Visit: https://search.google.com/test/rich-results
2. Enter one of your page URLs
3. Click "Test URL"

**Expected Schemas:**

- ✅ WebPage
- ✅ BreadcrumbList
- ✅ ItemList
- ✅ AggregateOffer (for price pages)
- ✅ FAQPage (for pages with FAQs)

**No Errors Expected**

---

## 📱 Mobile Testing

### Test on Mobile Devices

**Chrome DevTools:**

1. Open page
2. Press F12
3. Click device toolbar icon (or Ctrl+Shift+M)
4. Test on:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - iPad Pro (1024px)

**What to Check:**

- ✅ Hero section responsive
- ✅ Price cards stack properly
- ✅ Navigation accessible
- ✅ Buttons easy to tap
- ✅ No horizontal scroll
- ✅ Text readable
- ✅ Images scale correctly

---

## 🎨 Dark Mode Testing

### Toggle Dark Mode

If your site supports dark mode:

1. Toggle dark mode on
2. Visit each page type
3. Check:
   - ✅ Colors contrast properly
   - ✅ Text readable
   - ✅ Cards visible
   - ✅ Buttons styled correctly

---

## 🗺️ Sitemap Testing

### Verify Sitemap

```bash
npm run postbuild
```

Then visit:

```
http://localhost:3000/sitemap.xml
```

**Search for your new routes:**

- `/melbourne/{suburb}/{fuelType}` (should see ~200 entries)
- `/servo/{brand}-{suburb}` (should see ~100 entries)
- `/suburb/fuel-prices-{suburb}-today` (should see ~75 entries)

**Verify:**

- ✅ URLs are absolute (no localhost)
- ✅ lastModified dates present
- ✅ changeFrequency set correctly
- ✅ Priority values appropriate

---

## ⚡ Performance Testing

### Lighthouse Audit

1. Open page in Chrome
2. F12 → Lighthouse tab
3. Select "Mobile" + all categories
4. Click "Analyze page load"

**Target Scores:**

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: 100

**Key Metrics:**

- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Total Blocking Time: < 200ms
- Cumulative Layout Shift: < 0.1

---

## 🔗 Internal Linking Test

### Follow Links

On each page type, click:

**Breadcrumbs:**

- ✅ Home link works
- ✅ Melbourne link works
- ✅ Suburb link works

**Quick Links:**

- ✅ Other fuel types links work
- ✅ "All stations" links work
- ✅ Brand links work

**Station Cards:**

- ✅ "View Details" opens station page
- ✅ "Get Directions" opens Google Maps

---

## 🐛 Error Handling

### Test Invalid Routes

**Should Return 404:**

```
/melbourne/nonexistentsuburb/unleaded
/servo/invalidbrand-suburb
/suburb/fuel-prices-invalid-today
/melbourne/coburg/invalidfueltype
```

**Should Handle Gracefully:**

- Empty station data
- Missing prices
- Invalid coordinates

---

## 📊 Browser Console Check

### Check for Errors

1. Open any test page
2. F12 → Console tab

**Should see:**

- ✅ No red errors
- ✅ No warning messages (or only minor ones)
- ✅ No failed network requests

**Common Issues to Fix:**

- Image 404s
- Missing favicon
- CORS errors

---

## ✨ Functionality Testing

### Interactive Elements

**Test on each page:**

1. **Sort Dropdown** (where available)
   - Change sort order
   - Verify list reorders correctly

2. **Fuel Type Filter** (brand-suburb pages)
   - Click each fuel type button
   - Verify active state changes
   - Check cheapest price updates

3. **Buttons**
   - Hover states work
   - Click actions execute
   - External links open in new tabs

4. **Responsive Layout**
   - Resize browser window
   - Verify layout adapts
   - Check sidebar moves on mobile

---

## 🎯 User Experience Testing

### Complete User Journey

**Scenario 1: Finding Cheapest Unleaded in Coburg**

1. Visit `/melbourne/coburg/unleaded`
2. See cheapest price immediately
3. Click "View Details" on cheapest station
4. See full station information
5. Click "Get Directions"
6. Google Maps opens with directions

**Scenario 2: Finding BP in Epping**

1. Visit `/servo/bp-epping`
2. See all BP stations in Epping
3. Compare prices across fuel types
4. Select "Diesel" filter
5. See diesel-specific prices highlighted
6. Choose station and get directions

**Scenario 3: Today's Prices in Preston**

1. Visit `/suburb/fuel-prices-preston-today`
2. See today's date in header
3. View price statistics (min/avg/max)
4. Sort by cheapest unleaded
5. Click on #1 ranked station
6. View full details

---

## 📈 Analytics Testing (Optional)

If you have Google Analytics:

1. Visit test pages
2. Check Real-Time reports
3. Verify:
   - ✅ Pageviews tracked
   - ✅ Events fire correctly
   - ✅ User flow recorded

---

## 🚀 Production Deployment Checklist

Before deploying to production:

- [ ] All test URLs work locally
- [ ] Sitemap includes new pages
- [ ] JSON-LD validates
- [ ] Mobile responsive
- [ ] Dark mode works (if applicable)
- [ ] No console errors
- [ ] Lighthouse scores acceptable
- [ ] Internal links functional
- [ ] 404 pages work
- [ ] Performance acceptable
- [ ] Images optimized
- [ ] Meta tags correct
- [ ] Canonical URLs set
- [ ] robots.txt allows crawling

---

## 🆘 Troubleshooting

### Common Issues

**Issue: Pages show 404**

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
npm run dev
```

**Issue: Sitemap doesn't update**

```bash
npm run postbuild
```

**Issue: Metadata not showing**

- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Check browser DevTools Network tab

**Issue: TypeScript errors**

- Check if errors are in new files or pre-existing
- Run `npm run type-check` to see all errors
- Fix only errors in your new code

**Issue: Styles not loading**

- Check Tailwind classes are correct
- Verify dark mode classes
- Clear .next folder and rebuild

---

## 📝 Test Results Template

```markdown
## Test Results - [Date]

### Build Test

- [ ] Build completed successfully

### Route Tests

- [ ] Suburb + Fuel Type pages work
- [ ] Brand + Suburb pages work
- [ ] Today's Prices pages work

### SEO Tests

- [ ] Metadata present
- [ ] JSON-LD valid
- [ ] Rich snippets validate
- [ ] Sitemap includes new URLs

### Performance

- Lighthouse Score: \_\_/100
- FCP: \_\_s
- LCP: \_\_s

### Issues Found

1.
2.
3.

### Status

[ ] Ready for Production
[ ] Needs Fixes
```

---

## ✅ Success Criteria

Your location pages are ready when:

1. ✅ All 3 page types load correctly
2. ✅ SEO metadata is complete
3. ✅ JSON-LD validates without errors
4. ✅ Sitemap includes all new pages
5. ✅ Mobile responsive
6. ✅ No console errors
7. ✅ Internal links work
8. ✅ Lighthouse score > 90
9. ✅ User journeys complete successfully
10. ✅ 404 pages work for invalid routes

---

**Ready to test? Start with the Build Test and work through each section! 🚀**
