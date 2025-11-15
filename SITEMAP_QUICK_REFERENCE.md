# 🚀 Sitemap Submission - Quick Reference Card

## ⚡ **Fastest Way to Get Started (5 Minutes)**

### 1️⃣ **Verify Your Site**

```
🌐 Go to: https://search.google.com/search-console
📧 Sign in with your Google account
➕ Add property: petrolpricesnearme.com.au
✅ Choose DNS verification (recommended)
```

### 2️⃣ **Add DNS Record**

```
Type: TXT
Name: @ (or blank)
Value: [Google will provide]
⏱️ Wait: 10 minutes
```

### 3️⃣ **Submit Sitemap**

```
📍 Go to: Indexing → Sitemaps
🔗 Enter: https://petrolpricesnearme.com.au/sitemap.xml
🚀 Click: Submit
```

### 4️⃣ **Request Indexing (Top 5 Pages)**

```
🔍 URL Inspection → Enter URL → Request Indexing

Priority URLs:
✓ https://petrolpricesnearme.com.au/
✓ https://petrolpricesnearme.com.au/map
✓ https://petrolpricesnearme.com.au/directory
✓ https://petrolpricesnearme.com.au/faq
✓ https://petrolpricesnearme.com.au/fuel-price-trends
```

---

## 📊 **Your Sitemap URLs**

| Sitemap      | URL                     | What It Contains           |
| ------------ | ----------------------- | -------------------------- |
| **Main**     | `/sitemap.xml`          | All pages, regions, brands |
| **Stations** | `/sitemap-stations.xml` | 600+ individual stations   |
| **Index**    | `/sitemap-index.xml`    | Links to all sitemaps      |

**Submit:** `https://petrolpricesnearme.com.au/sitemap.xml`

---

## 🎯 **What to Do Next (First Week)**

### Day 1 (Today)

- [x] Submit sitemap to Google Search Console
- [ ] Request indexing for top 5 pages
- [ ] Submit to Bing Webmaster Tools

### Day 2-3

- [ ] Check coverage report for errors
- [ ] Monitor mobile usability
- [ ] Set up email notifications

### Day 7

- [ ] Review performance metrics
- [ ] Check indexed pages count
- [ ] Fix any crawl errors

---

## 🛠️ **Useful Commands**

### Generate Fresh Sitemap

```bash
npm run sitemap:generate
```

### Check Sitemap Validity

```bash
# Visit in browser
https://petrolpricesnearme.com.au/sitemap.xml

# Should see XML content, not an error
```

### Test Robots.txt

```bash
https://petrolpricesnearme.com.au/robots.txt

# Should include:
# Sitemap: https://petrolpricesnearme.com.au/sitemap.xml
```

---

## 🚨 **Common Issues & Quick Fixes**

| Issue                  | Quick Fix                            |
| ---------------------- | ------------------------------------ |
| ❌ Sitemap not found   | Clear cache, redeploy, check URL     |
| ❌ Couldn't fetch      | Check if site is live, verify SSL    |
| ⚠️ 0 pages indexed     | Wait 48 hours, then request indexing |
| ⚠️ Some pages excluded | Check robots.txt, meta tags          |

---

## 📞 **Support URLs**

```
Google Search Console: https://search.google.com/search-console
Bing Webmaster: https://www.bing.com/webmasters
Sitemap Validator: https://www.xml-sitemaps.com/validate-xml-sitemap.html
Rich Results Test: https://search.google.com/test/rich-results
PageSpeed Insights: https://pagespeed.web.dev
```

---

## ✅ **Done Checklist**

Quick checklist for today:

- [ ] Verified site in Google Search Console
- [ ] Submitted sitemap.xml
- [ ] Requested indexing for homepage
- [ ] Checked mobile usability report
- [ ] Set up email notifications
- [ ] Submitted to Bing Webmaster Tools

---

## 📈 **Expected Results**

| Timeframe      | What to Expect         |
| -------------- | ---------------------- |
| **24 hours**   | First crawl begins     |
| **3-7 days**   | Pages appear in Google |
| **2 weeks**    | Most pages indexed     |
| **1 month**    | Full site indexed      |
| **2-3 months** | Ranking improvements   |

---

## 🎓 **Pro Tips**

💡 **Tip 1:** Update sitemap weekly after adding new stations
💡 **Tip 2:** Request indexing manually for time-sensitive content
💡 **Tip 3:** Check Performance report weekly for trending queries
💡 **Tip 4:** Fix mobile usability issues immediately
💡 **Tip 5:** Monitor Core Web Vitals for SEO ranking factor

---

**Need detailed instructions?** → See `GOOGLE_SEARCH_CONSOLE_SETUP.md`

**Questions?** → Contact your development team
