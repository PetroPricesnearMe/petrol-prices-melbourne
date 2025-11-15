# 🚀 Quick Performance Testing Reference

## 📋 Essential Commands

### 1️⃣ **Quick Verification** (2 minutes)

```bash
# Automated checks for font preload, hero image, and config
npm run verify:performance
```

**What it checks:**

- ✅ Font preload configuration
- ✅ Hero image priority
- ✅ Next.js config optimizations
- ✅ Build output
- ✅ Dependencies

---

### 2️⃣ **Console Warning Check** (1 minute)

```bash
# Start dev server and check console
npm run dev
```

Then:

1. Open http://localhost:3000
2. Open DevTools (F12) → Console tab
3. **Should see:** No font or preload warnings ✅

---

### 3️⃣ **Production Build Check** (3 minutes)

```bash
# Build and verify
npm run verify:build
```

This runs:

1. Production build
2. Automated verification checks
3. Shows any issues found

---

### 4️⃣ **Lighthouse Performance Test** (5 minutes)

```bash
# Full Lighthouse audit
npm run test:vitals
```

**Target Scores:**

- Performance: 90+ ✅
- LCP: < 2.5s ✅
- FID: < 100ms ✅
- CLS: < 0.1 ✅

---

### 5️⃣ **Complete Test Suite** (10 minutes)

```bash
# Run full performance test
npm run test:preload
```

This includes:

- Build
- Start server
- Lighthouse audit
- Performance verification
- All checks

---

## 🎯 Manual Browser Checks

### **A. Check Font Preload (30 seconds)**

1. Production server running: `npm run build && npm start`
2. Open http://localhost:3000
3. DevTools → **Network** tab
4. Filter: **Font**
5. Reload page
6. ✅ Font should show "High" priority

### **B. Check Hero Image Priority (30 seconds)**

1. Network tab → Filter: **Img**
2. Find `hero-petrol-station.jpg`
3. ✅ Should load early (within first 5 requests)
4. ✅ Priority column should show "High" or "Highest"

### **C. Check for Layout Shifts (1 minute)**

1. DevTools → **Performance** tab
2. Click Record → Reload page → Stop
3. Look for red "Layout Shift" markers
4. ✅ Should be minimal or none

---

## 📊 Expected Results

### **Before Optimization**

```
⚠️  Console warnings about preload
⚠️  Fonts loaded late (priority: Low)
⚠️  LCP: ~3.8s
⚠️  Performance Score: ~45
```

### **After Optimization** ✅

```
✅  No console warnings
✅  Fonts loaded early (priority: High)
✅  LCP: ~1.2s
✅  Performance Score: 95+
```

---

## 🔍 Specific Warning Checks

### **Font Preload Warning (GONE)**

```diff
- ⚠️ A preload for 'font-url' is found but is not used
+ ✅ No warnings (font preload working correctly)
```

**How to verify:**

```bash
npm run build && npm start
# Open http://localhost:3000
# Check Console → Should be clean ✅
```

---

## 🌐 WebPageTest (Production Only)

### **After Deployment**

1. Go to https://www.webpagetest.org/
2. Enter your production URL
3. Settings:
   - Location: Melbourne, Australia
   - Browser: Chrome
   - Connection: 4G
4. Run Test
5. Check:
   - ✅ LCP < 2.5s
   - ✅ CLS < 0.1
   - ✅ Speed Index < 3.4s

---

## 🎨 Chrome DevTools - Quick Checks

### **1. Performance Panel**

```bash
# With production server running
npm run build && npm start
```

1. DevTools → Performance
2. Record → Reload → Stop
3. Check LCP marker (blue flag)
4. ✅ Should be < 2.5s

### **2. Lighthouse**

1. DevTools → Lighthouse
2. Mode: Navigation
3. Device: Mobile
4. Click "Analyze page load"
5. ✅ Performance score: 90+

### **3. Coverage**

1. DevTools → More tools → Coverage
2. Record → Reload → Stop
3. Check unused CSS/JS
4. ✅ Unused CSS < 20%
5. ✅ Unused JS < 40%

---

## ✅ Daily Testing Checklist

Before committing code:

```bash
# 1. Run verification
npm run verify:performance

# 2. Build successfully
npm run build

# 3. No TypeScript errors
npm run type-check

# 4. No linting errors
npm run lint

# 5. Check dev console
npm run dev
# → Open localhost:3000 → Check console ✅
```

Before deploying:

```bash
# 1. Full verification
npm run verify:build

# 2. Lighthouse test
npm run test:vitals

# 3. Manual browser check
# → No warnings in console ✅
# → Fonts load with high priority ✅
# → Hero image loads immediately ✅
```

---

## 🆘 Quick Troubleshooting

### **Issue: Still seeing font warnings**

```typescript
// src/app/layout.tsx - Verify this:
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true, // ← Must be true
});
```

### **Issue: Hero image loads slowly**

```tsx
// Verify priority is set:
<Image
  src="/images/hero-petrol-station.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority={true} // ← Must be true
  quality={90}
/>
```

### **Issue: Poor Lighthouse score**

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
npm start

# Then run Lighthouse again
npm run lighthouse
```

---

## 📱 Mobile Testing

### **Quick Mobile Check**

1. DevTools → Toggle device toolbar (Ctrl+Shift+M)
2. Select: iPhone 12 Pro
3. Throttle: Fast 3G
4. Reload page
5. ✅ Should load smoothly

### **Real Device Testing**

1. Find your computer's IP:

   ```bash
   # Windows
   ipconfig | findstr IPv4

   # Mac/Linux
   ifconfig | grep inet
   ```

2. Access from phone: `http://YOUR_IP:3000`
3. Check performance in Chrome DevTools remote debugging

---

## 📈 Performance Monitoring

### **View Web Vitals in Browser**

```javascript
// Open console on your production site
JSON.parse(localStorage.getItem('web-vitals') || '{}');
```

**Expected:**

```json
{
  "LCP": { "value": 1234, "timestamp": 1699600000000 },
  "FID": { "value": 45, "timestamp": 1699600001000 },
  "CLS": { "value": 0.02, "timestamp": 1699600002000 }
}
```

---

## 🎯 Success Criteria

### **You're good to deploy when:**

- ✅ `npm run verify:performance` passes all checks
- ✅ No console warnings in production build
- ✅ Lighthouse Performance score ≥ 90
- ✅ LCP < 2.5s (ideally < 1.5s)
- ✅ CLS < 0.1 (ideally < 0.05)
- ✅ FID < 100ms (ideally < 50ms)
- ✅ All images use next/image
- ✅ Fonts load with high priority

---

## 📚 Full Documentation

For detailed testing instructions, see:

- **VERIFICATION_TESTING_GUIDE.md** - Complete testing guide
- **PERFORMANCE_OPTIMIZATION_COMPLETE.md** - Optimization details
- **SEO_PERFORMANCE_COMPLETE.md** - SEO and performance

---

## 🔗 Quick Links

- **Lighthouse DevTools**: F12 → Lighthouse tab
- **Network Panel**: F12 → Network tab
- **Performance Panel**: F12 → Performance tab
- **Console**: F12 → Console tab
- **WebPageTest**: https://www.webpagetest.org/
- **Google PageSpeed Insights**: https://pagespeed.web.dev/

---

**Last Updated**: 2024  
**Framework**: Next.js 15 with App Router  
**Project**: Petrol Price Near Me
