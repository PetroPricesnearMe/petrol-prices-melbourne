# Manual Website Audit Checklist

## Pre-Audit Setup

### Tools Required
- [ ] Chrome DevTools
- [ ] Google Lighthouse
- [ ] GTmetrix account
- [ ] Screaming Frog SEO Spider (free version)
- [ ] Mobile device or browser dev tools mobile view

### Domains to Audit
- [ ] https://www.petrolpricesnearme.com.au
- [ ] https://www.petrolpricesnearme.com

## 1. HTTP Status & Redirects

### For each page:
- [ ] Check HTTP status code (200, 301, 302, 404, 500, etc.)
- [ ] Verify canonical tags are present and correct
- [ ] Check for redirect chains (multiple redirects)
- [ ] Test both www and non-www versions
- [ ] Test HTTP vs HTTPS redirects

### Common Issues to Flag:
- [ ] 404 errors on important pages
- [ ] 500 server errors
- [ ] Missing canonical tags
- [ ] Incorrect canonical URLs
- [ ] Redirect loops

## 2. SEO Elements Analysis

### Title Tags
- [ ] All pages have unique title tags
- [ ] Title length is 30-60 characters
- [ ] No duplicate titles across pages
- [ ] Titles are descriptive and keyword-rich
- [ ] No special characters breaking display

### H1 Tags
- [ ] Each page has exactly one H1 tag
- [ ] H1 is descriptive and unique
- [ ] H1 contains primary keyword
- [ ] No duplicate H1 tags across pages

### Meta Descriptions
- [ ] All pages have meta descriptions
- [ ] Length is 150-160 characters
- [ ] Descriptions are unique and compelling
- [ ] Include call-to-action where appropriate

### Header Structure
- [ ] Proper H1-H6 hierarchy
- [ ] No skipped heading levels
- [ ] Headers are descriptive and keyword-rich

## 3. Technical SEO

### URL Structure
- [ ] Clean, readable URLs
- [ ] No excessive parameters
- [ ] Consistent URL structure
- [ ] No duplicate content issues

### Internal Linking
- [ ] Logical internal link structure
- [ ] Important pages are well-linked
- [ ] Anchor text is descriptive
- [ ] No broken internal links

### External Links
- [ ] All external links work
- [ ] External links open in new tabs where appropriate
- [ ] No broken external links

## 4. Performance Analysis

### Page Speed
- [ ] Test with Google PageSpeed Insights
- [ ] Test with GTmetrix
- [ ] Check Core Web Vitals (LCP, FID, CLS)
- [ ] Test on both desktop and mobile

### Image Optimization
- [ ] All images have proper alt attributes
- [ ] Images are optimized for web
- [ ] No broken images
- [ ] Proper image formats (WebP, AVIF where supported)

### Resource Loading
- [ ] CSS and JS files are minified
- [ ] Unused CSS/JS is removed
- [ ] Resources are properly cached
- [ ] No render-blocking resources

## 5. Mobile Responsiveness

### Mobile Layout
- [ ] Test on actual mobile devices
- [ ] Check responsive design breakpoints
- [ ] Verify touch targets are large enough
- [ ] Test horizontal scrolling

### Mobile Performance
- [ ] Mobile page speed scores
- [ ] Mobile-specific optimizations
- [ ] Touch-friendly navigation
- [ ] Readable text without zooming

## 6. Accessibility (A11y)

### Basic Accessibility
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Proper heading hierarchy
- [ ] Sufficient color contrast
- [ ] Keyboard navigation works

### Advanced Accessibility
- [ ] ARIA labels where needed
- [ ] Focus indicators visible
- [ ] Screen reader compatibility
- [ ] Skip navigation links

## 7. JavaScript & Console Errors

### Console Errors
- [ ] Open browser console on each page
- [ ] Note all JavaScript errors
- [ ] Check for 404 errors on JS files
- [ ] Verify no CORS errors

### JavaScript Functionality
- [ ] All interactive elements work
- [ ] Forms submit properly
- [ ] No broken JavaScript features
- [ ] Graceful degradation for JS-disabled users

## 8. Content Quality

### Duplicate Content
- [ ] Check for duplicate content across pages
- [ ] Verify unique value proposition per page
- [ ] Check for thin content pages

### Content Structure
- [ ] Proper paragraph structure
- [ ] Bullet points and lists where appropriate
- [ ] Clear call-to-action buttons
- [ ] Contact information easily findable

## 9. Security & Privacy

### Security Headers
- [ ] HTTPS is properly implemented
- [ ] Security headers present
- [ ] No mixed content warnings
- [ ] SSL certificate is valid

### Privacy Compliance
- [ ] Privacy policy is present
- [ ] Cookie consent if needed
- [ ] GDPR compliance if applicable
- [ ] Terms of service accessible

## 10. Site Architecture

### Navigation
- [ ] Main navigation is clear and logical
- [ ] Breadcrumbs where appropriate
- [ ] Search functionality works
- [ ] Footer links are organized

### Site Structure
- [ ] Logical page hierarchy
- [ ] Important pages are easily accessible
- [ ] Sitemap is present and updated
- [ ] 404 page is helpful

## Reporting Template

### For Each Issue Found:
1. **URL**: Full URL of the page
2. **Issue Type**: SEO, Performance, Accessibility, etc.
3. **Severity**: High, Medium, Low
4. **Description**: What's wrong
5. **Suggestion**: How to fix it
6. **Screenshot**: Visual evidence if applicable

### Priority Matrix:
- **High Priority**: Security issues, 404s, broken functionality
- **Medium Priority**: SEO issues, performance problems
- **Low Priority**: Minor accessibility issues, content improvements

## Tools for Automated Testing

### Free Tools:
- Google Lighthouse (built into Chrome)
- GTmetrix (free tier)
- Screaming Frog SEO Spider (free version)
- WAVE Web Accessibility Evaluator
- Google PageSpeed Insights

### Paid Tools (if budget allows):
- Screaming Frog SEO Spider (full version)
- Ahrefs Site Audit
- SEMrush Site Audit
- Sitebulb
- DeepCrawl

## Post-Audit Actions

1. **Prioritize Issues**: Sort by severity and impact
2. **Create Fix Timeline**: Assign deadlines for each issue
3. **Implement Monitoring**: Set up ongoing quality checks
4. **Document Changes**: Keep track of what was fixed
5. **Re-audit**: Schedule follow-up audits to verify fixes
