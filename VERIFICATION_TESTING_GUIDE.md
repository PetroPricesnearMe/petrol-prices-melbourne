# 🧪 Verification & Testing Guide - Next.js 15 Performance Optimization

## 📋 Project Context
- **Framework**: Next.js 15 with App Router
- **Hero Image**: `/images/hero-petrol-station.jpg`
- **Image Optimization**: All images using `next/image`
- **Font**: Inter with preload enabled

---

## ✅ 1. Verify Warnings Are Gone

### **A. Local Development (npm run dev)**

#### Step 1: Clear Cache & Start Fresh
```bash
# Clear all caches
rm -rf .next
rm -rf node_modules/.cache

# Start dev server
npm run dev
```

#### Step 2: Check Browser Console
1. Open `http://localhost:3000` in Chrome/Edge
2. Open DevTools (F12)
3. Go to **Console** tab
4. Look for these specific warnings (should NOT appear):

**Font-related warnings to verify are GONE:**
- ❌ "A preload for 'font-url' is found but is not used"
- ❌ "The resource was preloaded using link preload but not used"
- ❌ "Font resource not found"

**What you SHOULD see:**
- ✅ No font warnings
- ✅ Clean console (except dev HMR messages)

#### Step 3: Check Network Tab
1. Open DevTools → **Network** tab
2. Filter by **Font** (click the Font button)
3. Reload page (Ctrl+R)
4. Verify fonts are loaded with:
   - ✅ Status: 200
   - ✅ Priority: High or Highest
   - ✅ Initiator: Should show preload link

![Expected Network Tab](https://user-images.githubusercontent.com/example/network-fonts.png)

---

### **B. Production Build Testing**

#### Step 1: Build and Start Production Server
```bash
# Build for production
npm run build

# Start production server
npm start
```

**Expected build output:**
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5 kB        85 kB
├ ○ /directory                           ...         ...
└ ○ /stations/[id]                       ...         ...

○  (Static)  prerendered as static content
```

#### Step 2: Verify Production Console
1. Open `http://localhost:3000`
2. Open DevTools Console
3. **No warnings should appear** - production should be completely clean

#### Step 3: Check Production Network
1. Hard reload with cache disabled (Ctrl+Shift+R)
2. Network tab → Filter by Font
3. Verify:
   - ✅ Fonts loaded from `/_next/static/...`
   - ✅ Status: 200
   - ✅ Cache headers present
   - ✅ No 404s or failed requests

---

## 🔬 2. Lighthouse Testing

### **Method 1: Chrome DevTools Lighthouse**

#### Step 1: Open Lighthouse
```bash
# Make sure production build is running
npm run build && npm start
```

1. Open `http://localhost:3000`
2. DevTools (F12) → **Lighthouse** tab
3. Configure settings:
   - ✅ Mode: Navigation
   - ✅ Device: Mobile & Desktop (run both)
   - ✅ Categories: Performance, Accessibility, Best Practices, SEO
   - ✅ Clear storage: ✓ (checked)
   - ✅ Simulated throttling: ✓ (checked)

#### Step 2: Run Audit
Click **Analyze page load** → Wait for results

#### Step 3: Check Specific Metrics

**Performance Score Target: 90+**

**Core Web Vitals:**
```
✅ Largest Contentful Paint (LCP)    < 2.5s    [Target: < 1.5s]
✅ Total Blocking Time (TBT)         < 200ms   [Target: < 150ms]
✅ Cumulative Layout Shift (CLS)     < 0.1     [Target: < 0.05]
✅ Speed Index                       < 3.4s    [Target: < 2.0s]
✅ Time to Interactive (TTI)         < 3.8s    [Target: < 2.5s]
✅ First Contentful Paint (FCP)      < 1.8s    [Target: < 1.0s]
```

#### Step 4: Verify Preload Usage

In the Lighthouse report, scroll to **"Opportunities"** section:

**Should NOT see:**
- ❌ "Preload key requests"
- ❌ "Eliminate render-blocking resources" (for fonts)
- ❌ "Preload Largest Contentful Paint image"

**Should see (if present):**
- ✅ "Properly size images" - should have minimal issues
- ✅ "Serve images in next-gen formats" - should be marked as ✓
- ✅ "Efficiently encode images" - should be marked as ✓

#### Step 5: Check Diagnostics

Scroll to **"Diagnostics"** section:

**Font Display:**
```
✅ Ensure text remains visible during webload
   - Inter font should use font-display: swap
```

**Preload:**
```
✅ Preconnect to required origins
   - https://fonts.googleapis.com
   - https://fonts.gstatic.com
```

---

### **Method 2: Lighthouse CLI (More Detailed)**

#### Step 1: Install Lighthouse CLI
```bash
npm install -g lighthouse
```

#### Step 2: Run Comprehensive Audit
```bash
# Make sure production server is running on port 3000
npm run build && npm start

# In another terminal, run Lighthouse
lighthouse http://localhost:3000 \
  --output html \
  --output json \
  --output-path ./lighthouse-report \
  --view \
  --chrome-flags="--no-sandbox"
```

This generates:
- `lighthouse-report.report.html` - Visual report
- `lighthouse-report.report.json` - Detailed JSON data

#### Step 3: Run Mobile & Desktop Separately
```bash
# Mobile audit (default)
lighthouse http://localhost:3000 \
  --output html \
  --output-path ./lighthouse-mobile \
  --preset=mobile \
  --view

# Desktop audit
lighthouse http://localhost:3000 \
  --output html \
  --output-path ./lighthouse-desktop \
  --preset=desktop \
  --view
```

#### Step 4: Analyze JSON Report
```bash
# Extract specific metrics
cat lighthouse-report.report.json | jq '.audits | 
  with_entries(select(.key | 
  test("largest-contentful-paint|first-contentful-paint|cumulative-layout-shift|total-blocking-time")))'
```

**Expected Output:**
```json
{
  "largest-contentful-paint": {
    "score": 0.95,
    "displayValue": "1.2 s"
  },
  "first-contentful-paint": {
    "score": 0.98,
    "displayValue": "0.9 s"
  },
  "cumulative-layout-shift": {
    "score": 1.0,
    "displayValue": "0.02"
  }
}
```

---

## 🛠️ 3. Chrome DevTools - Deep Dive

### **A. Performance Panel**

#### Step 1: Record Page Load
1. Open DevTools → **Performance** tab
2. Click **Record** (or Ctrl+Shift+E)
3. Reload page (Ctrl+R)
4. Stop recording after page fully loads

#### Step 2: Analyze Timeline

**Check for LCP (Largest Contentful Paint):**
1. Look for the **LCP marker** (blue flag icon)
2. Click on it to see which element is LCP
3. **Expected**: Hero image (`hero-petrol-station.jpg`)
4. **Target timing**: < 2.5s (ideally < 1.5s)

**Verify Font Loading:**
1. In the timeline, find **Network** track
2. Look for font requests
3. They should appear **early** in the timeline
4. Check for "Preload" label in the initiator

**Check CLS (Cumulative Layout Shift):**
1. Look for red markers labeled "Layout Shift"
2. Click on each to see what caused it
3. **Target**: < 0.1 (ideally < 0.05)
4. **Common causes**: Images without dimensions, fonts loading

#### Step 3: Bottom-Up Analysis
1. Click **Bottom-Up** tab in Performance panel
2. Group by: **URL**
3. Look for:
   - Font loading time
   - Image loading time
   - JavaScript execution time

**Expected Results:**
```
Activity               Self Time    Total Time
-------------------------------------------------
Font Loading           < 100ms      < 200ms
Hero Image Load        < 300ms      < 500ms
JS Evaluation          < 150ms      < 300ms
Layout                 < 50ms       < 100ms
```

---

### **B. Coverage Panel**

#### Check for Unused Resources

1. Open DevTools → **More tools** → **Coverage**
2. Click **Record** (circle icon)
3. Reload page
4. Stop recording

**Analyze Coverage:**
```
Resource                Type    Total      Unused    Unused %
------------------------------------------------------------
/_next/static/...js     JS      250 KB     75 KB     30%    ✅ Good
/_next/static/...css    CSS     45 KB      5 KB      11%    ✅ Good
fonts/inter...woff2     Font    120 KB     0 KB      0%     ✅ Perfect
```

**Targets:**
- ✅ CSS unused < 20%
- ✅ JS unused < 40% (initial page load)
- ✅ Fonts unused = 0%

---

### **C. Network Panel - Resource Timing**

#### Verify Resource Hints Work

1. Network tab → **Disable cache** ✓
2. Reload page
3. Look at **Waterfall** view

**Expected Request Order:**
```
1. [Priority: Highest] index.html
2. [Priority: Highest] Inter font (PRELOADED)
3. [Priority: High]    hero-petrol-station.jpg (PRIORITY)
4. [Priority: High]    CSS
5. [Priority: Medium]  JS chunks
6. [Priority: Low]     Below-fold images (LAZY)
```

#### Check Resource Timing Details

Click on the font request → **Timing** tab:

```
Queueing                 < 5ms     ✅
DNS Lookup               0ms       ✅ (preconnected)
Initial Connection       0ms       ✅ (preconnected)
SSL                      0ms       ✅ (preconnected)
Request Sent             < 5ms     ✅
Waiting (TTFB)          < 100ms    ✅
Content Download        < 50ms     ✅
```

---

## 🌐 4. WebPageTest - Real-World Testing

### **Method 1: Online WebPageTest**

#### Step 1: Deploy to Production
```bash
# Deploy to Vercel/Netlify/your host
npm run build
# Deploy using your platform
```

#### Step 2: Run WebPageTest
1. Go to [https://www.webpagetest.org/](https://www.webpagetest.org/)
2. Enter your production URL
3. Configure test:
   - **Test Location**: Melbourne, Australia (closest to target users)
   - **Browser**: Chrome
   - **Connection**: 4G / Cable (test both)
   - **Number of Tests**: 3 (for median)
   - **Advanced Settings**:
     - ✅ Capture Video
     - ✅ First View and Repeat View
     - ✅ Lighthouse Report

#### Step 3: Analyze Results

**Core Web Vitals from Field Data:**
```
Metric                  First View    Repeat View   Target
------------------------------------------------------------
LCP                     1.2s          0.8s          < 2.5s  ✅
CLS                     0.03          0.01          < 0.1   ✅
FID                     45ms          20ms          < 100ms ✅
Time to Interactive     2.1s          1.5s          < 3.8s  ✅
Speed Index             1.8s          1.2s          < 3.4s  ✅
```

**Filmstrip View:**
- Check when hero image appears
- Verify no layout shifts
- Confirm smooth loading progression

#### Step 4: Check Request Details
1. Click **Waterfall View**
2. Filter by "font"
3. Verify:
   - ✅ Fonts loaded early in waterfall
   - ✅ Connection reused (preconnect working)
   - ✅ Proper caching headers

---

### **Method 2: WebPageTest Private Instance**

For more frequent testing:

```bash
# Install WebPageTest agent locally
docker run -d \
  -e "SERVER_URL=http://localhost:4000/work/" \
  -e "LOCATION=Local" \
  webpagetest/agent
```

---

## 📊 5. Real User Monitoring (RUM)

### **Verify Web Vitals in Production**

Your layout.tsx already has Web Vitals tracking. Here's how to verify it's working:

#### Method 1: Browser Console
1. Open production site
2. Open DevTools Console
3. Type:
```javascript
// Check if Web Vitals are being tracked
JSON.parse(localStorage.getItem('web-vitals') || '{}')
```

**Expected Output:**
```json
{
  "LCP": {
    "value": 1234,
    "timestamp": 1699600000000
  },
  "FID": {
    "value": 45,
    "timestamp": 1699600001000
  },
  "CLS": {
    "value": 0.02,
    "timestamp": 1699600002000
  }
}
```

#### Method 2: Network Tab (if sending to analytics)
1. Network tab → Filter: **gtag** or your analytics endpoint
2. Reload page and interact
3. Look for events with:
   - `event: LCP, FID, CLS, FCP, TTFB, INP`
   - `value: [metric value]`

---

## 🎯 6. Hero Image Optimization Check

### **Verify Hero Image Preload**

#### Step 1: Check HTML Source
```bash
curl http://localhost:3000 | grep -A 5 "hero-petrol-station"
```

**Should see** (for priority image):
```html
<link
  rel="preload"
  as="image"
  href="/_next/image?url=%2Fimages%2Fhero-petrol-station.jpg..."
  fetchpriority="high"
/>
```

#### Step 2: Verify in Browser
1. View page source (Ctrl+U)
2. Search for "hero-petrol-station"
3. Should find:
   - ✅ `<link rel="preload" as="image">`
   - ✅ `fetchpriority="high"`
   - ✅ Responsive srcset

#### Step 3: Check Network Priority
1. Network tab → Filter: **Img**
2. Find `hero-petrol-station.jpg`
3. Check **Priority** column: Should be **High** or **Highest**

---

## 📈 7. Core Web Vitals Dashboard

### **Create a Monitoring Dashboard**

Create a simple HTML file to view your metrics:

```bash
# Save this as web-vitals-dashboard.html
cat > public/web-vitals-dashboard.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>Web Vitals Dashboard</title>
  <style>
    body { font-family: system-ui; padding: 20px; background: #f5f5f5; }
    .metric { background: white; padding: 20px; margin: 10px; border-radius: 8px; }
    .metric h2 { margin: 0; }
    .value { font-size: 3em; font-weight: bold; }
    .good { color: #0cce6b; }
    .needs-improvement { color: #ffa400; }
    .poor { color: #ff4e42; }
  </style>
</head>
<body>
  <h1>Web Vitals Dashboard</h1>
  <div id="metrics"></div>
  
  <script>
    const data = JSON.parse(localStorage.getItem('web-vitals') || '{}');
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 600, poor: 1500 }
    };
    
    const metricsDiv = document.getElementById('metrics');
    
    Object.entries(data).forEach(([name, metric]) => {
      const threshold = thresholds[name];
      const rating = metric.value <= threshold.good ? 'good' 
        : metric.value <= threshold.poor ? 'needs-improvement' 
        : 'poor';
      
      metricsDiv.innerHTML += `
        <div class="metric">
          <h2>${name}</h2>
          <div class="value ${rating}">
            ${name === 'CLS' ? metric.value.toFixed(3) : Math.round(metric.value)}
            ${name.includes('FID') || name.includes('LCP') ? 'ms' : ''}
          </div>
          <div>Recorded: ${new Date(metric.timestamp).toLocaleString()}</div>
        </div>
      `;
    });
  </script>
</body>
</html>
EOF
```

Access at: `http://localhost:3000/web-vitals-dashboard.html`

---

## ✅ 8. Complete Verification Checklist

### **Pre-Deployment Checklist**

```bash
# Run all checks
npm run build              # ✓ Build succeeds
npm run lint              # ✓ No linting errors
npm run type-check        # ✓ No TypeScript errors
```

**Manual Checks:**
- [ ] No console warnings in dev
- [ ] No console warnings in production
- [ ] Fonts load with priority
- [ ] Hero image has priority attribute
- [ ] No layout shifts during load
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility = 100
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] All images use next/image
- [ ] Font preload working
- [ ] Preconnect tags present

---

## 🐛 Troubleshooting

### **Issue: Fonts Still Show Warning**

**Solution:**
```tsx
// src/app/layout.tsx
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,  // ← Ensure this is set
  weight: ['400', '500', '600', '700'], // Specify used weights
});
```

### **Issue: Hero Image Not Prioritized**

**Solution:**
```tsx
import Image from 'next/image';

<Image
  src="/images/hero-petrol-station.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority={true}  // ← Must be true
  quality={90}
  sizes="100vw"
/>
```

### **Issue: Poor LCP on Mobile**

**Solution:**
```tsx
<Image
  src="/images/hero-petrol-station.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority={true}
  quality={90}
  sizes="100vw"
  placeholder="blur"  // ← Add blur placeholder
  blurDataURL="data:image/svg+xml;base64,..." // ← Add placeholder
/>
```

### **Issue: High CLS**

**Solution:**
- Always specify width and height on images
- Use aspect-ratio CSS for responsive images
- Reserve space for dynamic content
- Avoid inserting content above existing content

---

## 📊 Expected Results Summary

### **Before Optimization**
```
Performance Score:        45
LCP:                     3.8s
FID:                    180ms
CLS:                    0.15
Total Bundle:           1.8MB
First Load JS:           780KB
```

### **After Optimization (Target)**
```
Performance Score:        95+  ✅
LCP:                     1.2s  ✅
FID:                     45ms  ✅
CLS:                    0.02   ✅
Total Bundle:           1.2MB  ✅
First Load JS:           450KB ✅
```

---

## 🚀 Quick Test Commands

```bash
# 1. Clean build test
rm -rf .next && npm run build && npm start

# 2. Lighthouse CLI test
lighthouse http://localhost:3000 --view

# 3. Check for warnings
npm run dev 2>&1 | grep -i "warning\|error"

# 4. Bundle analysis
npm run build -- --analyze

# 5. Type check
npx tsc --noEmit
```

---

## 📚 Additional Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse Scoring Guide](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)
- [WebPageTest Documentation](https://docs.webpagetest.org/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

---

## ✨ Success Indicators

You've successfully optimized when you see:

✅ **Zero warnings** in console (dev & prod)
✅ **Lighthouse Performance**: 95+
✅ **LCP**: < 1.5s
✅ **FID**: < 50ms  
✅ **CLS**: < 0.05
✅ **Fonts**: Load with high priority
✅ **Hero Image**: Loads immediately (priority)
✅ **Bundle Size**: Optimized and split
✅ **WebPageTest**: Grade A

---

**Ready to test?** Start with the Local Development section and work your way through each testing method! 🎯

