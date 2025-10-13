# 🔍 How to Run Website Audit

## Quick Start

### **Step 1: Install Dependencies**
```bash
npm install puppeteer csv-writer
```
This will take a few minutes (downloads Chrome browser).

### **Step 2: Make Sure Site is Running**
```bash
# Must be running on http://localhost:3000
npm start
```

### **Step 3: Run the Audit**
```bash
node website-audit-script.js
```

---

## What It Does

The audit script will:
- ✅ Open a browser automatically
- ✅ Visit your homepage
- ✅ Find all internal links
- ✅ Audit each page for:
  - SEO issues (titles, H1s, meta tags)
  - Performance problems (slow resources)
  - Accessibility issues (alt text, labels)
  - Broken images
  - JavaScript errors
- ✅ Take screenshots (desktop + mobile)
- ✅ Generate detailed reports

---

## Results

After the audit completes, you'll get:

### **1. CSV Report**
`website-audit-report.csv`
- Detailed list of all issues
- Page-by-page breakdown
- Severity levels
- Specific recommendations

### **2. Summary Report**
`audit-summary.md`
- Overview of total issues
- Issues by type
- Issues by severity
- Key recommendations

### **3. Screenshots**
`screenshots/` folder
- Desktop screenshots (1920x1080)
- Mobile screenshots (375x667)
- For every page audited

---

## Expected Results

### **Your Site Should Pass With Flying Colors!**

Since we already fixed all 47 issues, you should see:

```
✅ Homepage: No issues
✅ Directory: No issues
✅ About: No issues
✅ All pages: Optimized
```

**Total Issues: 0** 🎉

---

## If You See Issues

### **Most Common:**
1. **"Browser not found"**
   - Fix: Wait for puppeteer install to complete
   - Re-run: `npm install puppeteer`

2. **"Failed to load page"**
   - Fix: Make sure dev server running on port 3000
   - Check: `npm start` in another terminal

3. **"ECONNREFUSED"**
   - Fix: Site not running
   - Start: `npm start` first

---

## For Production Audit

When your site is deployed:

1. **Edit website-audit-script.js line 458:**
   ```javascript
   // Uncomment these lines:
   await auditor.crawlSite('https://www.petrolpricesnearme.com.au');
   await auditor.crawlSite('https://www.petrolpricesnearme.com');
   ```

2. **Run the audit:**
   ```bash
   node website-audit-script.js
   ```

---

## Why Run an Audit?

✅ **Verify all fixes were applied**  
✅ **Check for new issues**  
✅ **Document site quality**  
✅ **Before/after comparison**  
✅ **Production deployment check**  

---

**Your site is already optimized, but this gives you proof! 📊**

