# Google Search Console Setup Guide

## Complete Instructions for Submitting Your Sitemap

---

## 📋 **What I've Created for You**

✅ **Professional XML Sitemap** (`public/sitemap.xml`)

- 50+ important pages indexed
- Proper priorities and update frequencies
- Image sitemap integration
- Regional and brand pages
- Popular suburb pages

✅ **Dynamic Sitemap Generator** (`scripts/generate-sitemap.js`)

- Automatically generates sitemaps from your station data
- Creates separate sitemap for 600+ stations
- Sitemap index for better organization

✅ **Updated Robots.txt** (already in place)

- Proper sitemap references
- Search engine friendly

---

## 🚀 **Step-by-Step: Submit to Google Search Console**

### **Step 1: Access Google Search Console**

1. Go to: [https://search.google.com/search-console](https://search.google.com/search-console)
2. Sign in with your Google account (use the one that should manage the site)

---

### **Step 2: Add Your Property (If Not Already Added)**

#### Option A: Domain Property (Recommended)

```
Domain: petrolpricesnearme.com.au
```

- Covers all subdomains and protocols (http/https)
- Requires DNS verification

#### Option B: URL Prefix

```
URL: https://petrolpricesnearme.com.au
```

- Easier to verify
- Only covers exact URL format

**Choose Option A (Domain Property) for comprehensive coverage.**

---

### **Step 3: Verify Your Website**

You'll need to verify ownership. Choose one method:

#### **Method 1: DNS Verification (Recommended for Domain Property)**

1. Google will give you a TXT record like: `google-site-verification=abc123xyz`
2. Add this to your domain's DNS settings:
   - **Type:** TXT
   - **Name:** @ (or leave blank)
   - **Value:** `google-site-verification=abc123xyz`
3. Wait 5-10 minutes for DNS propagation
4. Click "Verify" in Google Search Console

#### **Method 2: HTML File Upload**

1. Download the verification file from Google
2. Upload to: `public/google[verification-code].html`
3. Make sure it's accessible at: `https://petrolpricesnearme.com.au/google[verification-code].html`
4. Click "Verify"

#### **Method 3: HTML Meta Tag**

1. Google gives you a meta tag like: `<meta name="google-site-verification" content="abc123" />`
2. Add to the `<head>` section of your `public/index.html`
3. Deploy the changes
4. Click "Verify"

#### **Method 4: Google Analytics** (if already using)

1. Use existing GA tracking code
2. Make sure you have admin access to the GA property

---

### **Step 4: Submit Your Sitemap**

1. **In Google Search Console left sidebar, click:**

   ```
   Indexing → Sitemaps
   ```

2. **Add your sitemap URL:**

   ```
   https://petrolpricesnearme.com.au/sitemap.xml
   ```

3. **Click "Submit"**

4. **Optionally, also submit the sitemap index** (for better organization):

   ```
   https://petrolpricesnearme.com.au/sitemap-index.xml
   ```

5. **Wait 24-48 hours** for Google to process your sitemap

---

### **Step 5: Monitor Your Sitemap Status**

After submission, you'll see:

- ✅ **Success:** Green checkmark - sitemap is being processed
- ⚠️ **Discovered:** Google found it but hasn't crawled yet
- ❌ **Errors:** Check for issues

**Normal processing time:** 2-7 days for initial indexing

---

## 🔧 **Additional Google Search Console Tasks**

### **1. Request Indexing for Important Pages**

For immediate indexing of critical pages:

1. Go to: **URL Inspection** (top search bar)
2. Enter URL: `https://petrolpricesnearme.com.au/`
3. Click: **Request Indexing**

**Do this for your top 5 pages:**

- Homepage: `https://petrolpricesnearme.com.au/`
- Map: `https://petrolpricesnearme.com.au/map`
- Directory: `https://petrolpricesnearme.com.au/directory`
- FAQ: `https://petrolpricesnearme.com.au/faq`
- Blog: `https://petrolpricesnearme.com.au/blog`

**Limit:** 10-12 requests per day per property

---

### **2. Submit to Other Search Engines**

#### **Bing Webmaster Tools**

1. Go to: [https://www.bing.com/webmasters](https://www.bing.com/webmasters)
2. Add your site
3. Import from Google Search Console (easiest)
4. Submit sitemap: `https://petrolpricesnearme.com.au/sitemap.xml`

#### **Yandex Webmaster** (if targeting Russian audience)

1. Go to: [https://webmaster.yandex.com](https://webmaster.yandex.com)
2. Add site and verify
3. Submit sitemap

---

### **3. Set Up Email Notifications**

1. In Google Search Console, click: **Settings** (bottom left)
2. Click: **Users and permissions**
3. Add your email
4. Enable notifications for:
   - ✅ Critical issues
   - ✅ Manual actions
   - ✅ Security issues
   - ✅ New message from Google

---

### **4. Check Mobile Usability**

1. Go to: **Experience → Mobile Usability**
2. Fix any mobile issues reported
3. Request validation after fixes

---

### **5. Check Core Web Vitals**

1. Go to: **Experience → Core Web Vitals**
2. Monitor performance metrics:
   - **LCP** (Largest Contentful Paint) - should be < 2.5s
   - **FID** (First Input Delay) - should be < 100ms
   - **CLS** (Cumulative Layout Shift) - should be < 0.1

---

## 📊 **What to Monitor Weekly**

### **Performance Report**

```
Search Console → Performance
```

- Total clicks
- Total impressions
- Average CTR
- Average position

### **Coverage Report**

```
Indexing → Pages
```

- Pages indexed
- Pages with errors
- Pages excluded

### **Sitemaps Report**

```
Indexing → Sitemaps
```

- URLs submitted
- URLs indexed
- Last read date

---

## 🔄 **Automatic Sitemap Updates**

### **Option 1: Manual Generation**

Run this command after adding new stations:

```bash
npm run sitemap:generate
```

### **Option 2: Automate in Build Process**

Add to your deployment workflow (`.github/workflows/deploy.yml`):

```yaml
- name: Generate Sitemap
  run: npm run sitemap:generate

- name: Deploy to Vercel
  run: vercel deploy --prod
```

### **Option 3: Scheduled Updates**

Create a GitHub Action to regenerate weekly:

```yaml
name: Update Sitemap
on:
  schedule:
    - cron: '0 0 * * 0' # Every Sunday at midnight
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Generate Sitemap
        run: npm run sitemap:generate
      - name: Commit Changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add public/sitemap*.xml
          git commit -m "chore: update sitemap" || exit 0
          git push
```

---

## 🎯 **SEO Best Practices for Your Site**

### **1. Structured Data**

Add JSON-LD structured data to station pages:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "GasStation",
    "name": "BP Box Hill",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "786 Whitehorse Road",
      "addressLocality": "Box Hill",
      "addressRegion": "VIC",
      "postalCode": "3127"
    }
  }
</script>
```

### **2. Update Meta Tags**

Ensure each page has:

- Unique `<title>` tags
- Unique `<meta name="description">` tags
- Open Graph tags for social sharing
- Canonical URLs

### **3. Create XML Sitemap for Images**

Already included in your main sitemap!

### **4. Monitor Backlinks**

Use Google Search Console → Links to see who links to you

---

## ❓ **Troubleshooting**

### **Problem: Sitemap Not Showing Up**

✅ **Check:**

1. Sitemap is accessible: Visit `https://petrolpricesnearme.com.au/sitemap.xml`
2. No robots.txt blocking: Check `https://petrolpricesnearme.com.au/robots.txt`
3. Valid XML: Use [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
4. Correct URL: Make sure you're using the production URL, not localhost

### **Problem: "Couldn't Fetch" Error**

✅ **Solutions:**

1. Check if site is accessible (not behind authentication)
2. Verify SSL certificate is valid
3. Check server response time (should be < 5 seconds)
4. Try submitting sitemap URL without `www` or with `www`

### **Problem: Pages Not Indexing**

✅ **Check:**

1. Pages are not blocked in robots.txt
2. Pages have `noindex` meta tag removed
3. Pages return 200 status code (not 404 or 301)
4. Content is substantial (not thin content)
5. Page loads within 3 seconds

---

## 📈 **Expected Timeline**

| Action                | Timeline   |
| --------------------- | ---------- |
| Sitemap submission    | Immediate  |
| First crawl           | 1-3 days   |
| Pages appear in index | 3-7 days   |
| Full site indexed     | 2-4 weeks  |
| Ranking improvements  | 1-3 months |

---

## 🎓 **Resources**

- **Google Search Central:** [https://developers.google.com/search](https://developers.google.com/search)
- **Sitemap Protocol:** [https://www.sitemaps.org](https://www.sitemaps.org)
- **Rich Results Test:** [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
- **PageSpeed Insights:** [https://pagespeed.web.dev](https://pagespeed.web.dev)

---

## ✅ **Quick Checklist**

Before submitting to Google:

- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] Robots.txt includes sitemap reference
- [ ] Site is verified in Google Search Console
- [ ] Sitemap is submitted
- [ ] Top 5 pages requested for indexing
- [ ] Mobile usability checked
- [ ] Core Web Vitals monitored
- [ ] Email notifications enabled
- [ ] Bing Webmaster Tools configured

---

## 🆘 **Need Help?**

If you encounter issues:

1. **Check Google Search Console Help:**
   [https://support.google.com/webmasters](https://support.google.com/webmasters)

2. **Google Search Central Community:**
   [https://support.google.com/webmasters/community](https://support.google.com/webmasters/community)

3. **Contact me if you need assistance with implementation**

---

**Last Updated:** October 22, 2024
**Version:** 1.0
