# SEO Optimization Guide - Melbourne Petrol Prices

## 📋 Overview

This document outlines the comprehensive SEO optimizations implemented for maximum search engine visibility and ranking success.

## ✅ Completed Optimizations

### 1. **Meta Tags & Structured Data**

- ✅ Added SEO component to all pages (Blog, FAQ, Fuel Price Trends, Station Amenities, How Pricing Works)
- ✅ Implemented FAQPage schema markup on FAQ page
- ✅ Implemented BlogPosting/Article schema on Blog page
- ✅ Added Organization and LocalBusiness schema
- ✅ Comprehensive Open Graph and Twitter Card meta tags

### 2. **Sitemap Optimization**

- ✅ Updated sitemap with current dates (2025-10-13)
- ✅ Added Blog and FAQ pages (high priority for SEO)
- ✅ Added all regional directory pages for local SEO
- ✅ Proper priority and changefreq settings
- ✅ Image sitemap entries for visual content

### 3. **Breadcrumbs Navigation**

- ✅ Added breadcrumbs to:
  - BlogPage
  - FAQPage
  - FuelPriceTrendsPage
  - StationAmenitiesPage
  - HowPricingWorksPage
  - DirectoryPageNew
- ✅ Schema.org BreadcrumbList markup included

### 4. **Analytics & Tracking**

- ✅ Page view tracking on all pages
- ✅ Search tracking
- ✅ Filter usage tracking
- ✅ Station interaction tracking

## 🎯 Image Alt Text Best Practices

### **Guidelines for All Images:**

#### 1. **Hero Images**

```html
<!-- ✅ GOOD -->
<img
  src="fuel-nozzles.jpg"
  alt="Fuel nozzles at petrol station showing different fuel types - Diesel, 98 Octane, 95 Octane, Unleaded, and 91 Octane"
  loading="eager"
  fetchpriority="high"
/>

<!-- ❌ BAD -->
<img src="fuel-nozzles.jpg" alt="fuel nozzles" />
```

#### 2. **Station Images**

```html
<!-- ✅ GOOD -->
<img
  src="shell-station.jpg"
  alt="Shell petrol station in Melbourne CBD with convenience store and car wash facilities"
  loading="lazy"
/>

<!-- ❌ BAD -->
<img src="shell-station.jpg" alt="shell" />
```

#### 3. **Brand Logos**

```html
<!-- ✅ GOOD -->
<img
  src="bp-logo.svg"
  alt="BP Australia logo - British Petroleum fuel and convenience stores"
  loading="lazy"
/>

<!-- ❌ BAD -->
<img src="bp-logo.svg" alt="BP" />
```

#### 4. **Icon/Decorative Images**

- Use `aria-hidden="true"` for purely decorative images
- Provide empty alt="" for screen readers to skip

```html
<span aria-hidden="true">🏪</span>
<img src="decorative-pattern.png" alt="" aria-hidden="true" />
```

### **Image Optimization Checklist:**

- [ ] All images have descriptive alt text (60-125 characters)
- [ ] Alt text includes relevant keywords naturally
- [ ] Alt text describes what's in the image, not just keywords
- [ ] Hero images use `loading="eager"` and `fetchPriority="high"`
- [ ] Below-fold images use `loading="lazy"`
- [ ] Images are properly sized (WebP format preferred)
- [ ] No alt text stuffing with keywords
- [ ] Decorative images use `aria-hidden="true"`

## 🔍 Local SEO Enhancements

### **Implemented:**

1. ✅ Geo meta tags (Melbourne, Victoria, Australia)
2. ✅ LocalBusiness schema markup
3. ✅ Regional directory pages in sitemap
4. ✅ Area served specifications

### **Keywords Strategy:**

#### **Primary Keywords:**

- melbourne petrol prices
- fuel prices melbourne
- cheapest petrol melbourne
- petrol stations melbourne
- live fuel prices

#### **Long-tail Keywords:**

- cheapest petrol prices in melbourne today
- 24 hour petrol station melbourne cbd
- premium fuel prices melbourne eastern suburbs
- diesel prices melbourne western suburbs
- unleaded 91 prices melbourne north

#### **Location-Specific Keywords:**

- petrol prices [suburb] melbourne
- fuel prices [region] melbourne
- cheapest petrol near [landmark]

## 📊 Performance Metrics

### **Target Metrics:**

- **Lighthouse SEO Score:** 100/100
- **Core Web Vitals:**
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1
- **Mobile-Friendly:** ✅ Fully responsive
- **HTTPS:** ✅ Secure
- **Valid Structured Data:** ✅ All schemas valid

### **SEO Checklist:**

#### **On-Page SEO:**

- [x] Unique title tags on every page (50-60 characters)
- [x] Unique meta descriptions (150-160 characters)
- [x] H1 tags present and optimized
- [x] Proper heading hierarchy (H1 → H2 → H3)
- [x] Keyword-rich URLs
- [x] Internal linking strategy
- [x] Canonical URLs set
- [x] Mobile responsive design
- [x] Fast page load times
- [x] HTTPS enabled

#### **Technical SEO:**

- [x] XML sitemap submitted
- [x] Robots.txt optimized
- [x] Structured data markup
- [x] Schema.org implementation
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Breadcrumb navigation
- [x] Clean URL structure
- [x] 404 error handling
- [x] Redirect management

#### **Content SEO:**

- [x] High-quality, original content
- [x] Keyword optimization (natural)
- [x] FAQ page for voice search
- [x] Blog content for long-tail keywords
- [x] Local content (regional pages)
- [x] Regular content updates
- [x] User-focused content
- [x] E-A-T principles (Expertise, Authority, Trust)

## 🔗 Internal Linking Strategy

### **Hub and Spoke Model:**

**Homepage (Hub)** →

- Directory Page → Regional Pages
- Blog Page → Related Articles
- FAQ Page → How It Works
- Price Trends → Directory

### **Link Distribution:**

- Homepage: Link to all major pages
- Blog: Link to relevant service pages
- FAQ: Link to explanatory pages
- Directory: Link back to homepage and related features

### **Anchor Text Guidelines:**

- Use descriptive, keyword-rich anchor text
- Vary anchor text naturally
- Don't over-optimize (no keyword stuffing)
- Use contextual links within content

## 🎨 Social Sharing Optimization

### **Open Graph Tags:**

```html
<meta property="og:title" content="[Page Title]" />
<meta property="og:description" content="[Description]" />
<meta property="og:image" content="[High-quality image 1200x630px]" />
<meta property="og:url" content="[Canonical URL]" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Petrol Prices Near Me" />
<meta property="og:locale" content="en_AU" />
```

### **Twitter Cards:**

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[Page Title]" />
<meta name="twitter:description" content="[Description]" />
<meta name="twitter:image" content="[Image URL]" />
```

### **Image Requirements:**

- **Open Graph:** 1200x630px (1.91:1 ratio)
- **Twitter:** 1200x675px (16:9 ratio) or 1200x628px
- **Format:** JPG or PNG
- **Size:** < 8MB
- **Alt text:** Always included

## 📈 Ranking Strategies

### **Voice Search Optimization:**

1. FAQ page with natural language questions
2. Structured data for featured snippets
3. Long-tail keyword targeting
4. Conversational content style

### **Featured Snippet Opportunities:**

- "How does fuel pricing work in Australia?"
- "What is the cheapest day to buy petrol in Melbourne?"
- "How often do petrol prices change?"
- "What factors affect petrol prices?"

### **Local Pack Optimization:**

1. Google My Business listing
2. NAP consistency (Name, Address, Phone)
3. Local citations
4. Customer reviews
5. Local content

## 🛠️ Tools & Resources

### **SEO Tools:**

- Google Search Console
- Google Analytics
- Lighthouse (Chrome DevTools)
- Schema.org Validator
- Rich Results Test
- Mobile-Friendly Test
- PageSpeed Insights

### **Monitoring:**

- Track keyword rankings weekly
- Monitor Core Web Vitals monthly
- Analyze user behavior (bounce rate, time on page)
- Review backlink profile
- Check for broken links
- Monitor site speed

## 📝 Content Calendar

### **Blog Topics (SEO-Focused):**

1. "Best Times to Fill Up in Melbourne - Price Cycle Guide"
2. "Top 10 Cheapest Petrol Stations in [Suburb]"
3. "Diesel vs Unleaded: Which is Cheaper in Melbourne?"
4. "How to Save $500/Year on Fuel in Melbourne"
5. "Melbourne Petrol Price Forecast - Next 7 Days"

### **Update Frequency:**

- Homepage: Daily (prices)
- Blog: Weekly (new content)
- FAQ: Monthly (additions)
- Directory: Real-time (prices)
- Trends: Daily (analysis)

## 🎯 Success Metrics

### **KPIs to Track:**

1. **Organic Traffic:** Month-over-month growth
2. **Keyword Rankings:** Top 10 positions for target keywords
3. **Click-Through Rate (CTR):** > 3% from search results
4. **Bounce Rate:** < 40%
5. **Pages per Session:** > 2.5
6. **Average Session Duration:** > 2 minutes
7. **Conversion Rate:** Station clicks, directions

### **Monthly SEO Reports:**

- Ranking positions for target keywords
- Organic traffic trends
- Top performing pages
- User engagement metrics
- Technical issues found/fixed
- New optimization opportunities

---

**Last Updated:** October 13, 2025  
**Maintained By:** Development Team
