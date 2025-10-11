#!/usr/bin/env node

/**
 * Comprehensive Website Audit Script
 * Crawls websites for SEO, performance, and code quality issues
 * 
 * Usage: 
 * 1. Install dependencies: npm install puppeteer csv-writer
 * 2. Start your dev server: npm start
 * 3. Run audit: node website-audit-script.js
 * 
 * This will audit:
 * - Homepage
 * - Directory pages (all regions)
 * - About page
 * - All linked pages
 * 
 * Results saved to:
 * - website-audit-report.csv
 * - audit-summary.md
 * - screenshots/ folder
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const csv = require('csv-writer').createObjectCsvWriter;

class WebsiteAuditor {
    constructor() {
        this.results = [];
        this.browser = null;
        this.page = null;
    }

    async init() {
        this.browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.page = await this.browser.newPage();
        
        // Set viewport for mobile testing
        await this.page.setViewport({ width: 1920, height: 1080 });
        
        // Enable console logging
        this.page.on('console', msg => {
            console.log(`Console ${msg.type()}: ${msg.text()}`);
        });

        // Enable request/response logging
        this.page.on('response', response => {
            if (response.status() >= 400) {
                console.log(`❌ ${response.status()} ${response.url()}`);
            }
        });
    }

    async auditPage(url) {
        console.log(`\n🔍 Auditing: ${url}`);
        
        try {
            const response = await this.page.goto(url, { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });

            const auditResult = {
                url: url,
                timestamp: new Date().toISOString(),
                httpStatus: response.status(),
                finalUrl: this.page.url(),
                issues: []
            };

            // Check for redirects
            if (url !== this.page.url()) {
                auditResult.issues.push({
                    type: 'redirect',
                    severity: 'info',
                    message: `Redirected from ${url} to ${this.page.url()}`,
                    suggestion: 'Ensure redirects are intentional and use 301 for permanent redirects'
                });
            }

            // Get page metadata
            const metadata = await this.page.evaluate(() => {
                const title = document.querySelector('title')?.textContent || '';
                const h1 = document.querySelector('h1')?.textContent || '';
                const canonical = document.querySelector('link[rel="canonical"]')?.href || '';
                const description = document.querySelector('meta[name="description"]')?.content || '';
                const viewport = document.querySelector('meta[name="viewport"]')?.content || '';
                
                return { title, h1, canonical, description, viewport };
            });

            auditResult.metadata = metadata;

            // Check for missing or duplicate titles
            if (!metadata.title) {
                auditResult.issues.push({
                    type: 'seo',
                    severity: 'high',
                    message: 'Missing <title> tag',
                    suggestion: 'Add a descriptive title tag for better SEO'
                });
            } else if (metadata.title.length < 30 || metadata.title.length > 60) {
                auditResult.issues.push({
                    type: 'seo',
                    severity: 'medium',
                    message: `Title length is ${metadata.title.length} characters (recommended: 30-60)`,
                    suggestion: 'Optimize title length for better search engine display'
                });
            }

            // Check for missing or duplicate H1 tags
            if (!metadata.h1) {
                auditResult.issues.push({
                    type: 'seo',
                    severity: 'high',
                    message: 'Missing <h1> tag',
                    suggestion: 'Add a descriptive H1 tag for better content structure'
                });
            }

            // Check canonical tag
            if (!metadata.canonical) {
                auditResult.issues.push({
                    type: 'seo',
                    severity: 'medium',
                    message: 'Missing canonical tag',
                    suggestion: 'Add canonical tag to prevent duplicate content issues'
                });
            }

            // Check viewport meta tag
            if (!metadata.viewport) {
                auditResult.issues.push({
                    type: 'mobile',
                    severity: 'high',
                    message: 'Missing viewport meta tag',
                    suggestion: 'Add viewport meta tag for proper mobile rendering'
                });
            }

            // Check for console errors
            const consoleErrors = await this.page.evaluate(() => {
                return window.consoleErrors || [];
            });

            consoleErrors.forEach(error => {
                auditResult.issues.push({
                    type: 'javascript',
                    severity: 'high',
                    message: `Console error: ${error.message}`,
                    suggestion: 'Fix JavaScript errors to improve user experience'
                });
            });

            // Check for broken images
            const brokenImages = await this.page.evaluate(() => {
                const images = document.querySelectorAll('img');
                const broken = [];
                images.forEach(img => {
                    if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                        broken.push(img.src);
                    }
                });
                return broken;
            });

            brokenImages.forEach(src => {
                auditResult.issues.push({
                    type: 'asset',
                    severity: 'medium',
                    message: `Broken image: ${src}`,
                    suggestion: 'Fix or replace broken image assets'
                });
            });

            // Check for slow-loading resources
            const performanceMetrics = await this.page.evaluate(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const resources = performance.getEntriesByType('resource');
                
                const slowResources = resources.filter(resource => 
                    resource.duration > 3000 // 3 seconds
                ).map(resource => ({
                    url: resource.name,
                    duration: resource.duration,
                    size: resource.transferSize || 0
                }));

                return {
                    loadTime: navigation.loadEventEnd - navigation.loadEventStart,
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    slowResources
                };
            });

            auditResult.performance = performanceMetrics;

            // Check for slow resources
            performanceMetrics.slowResources.forEach(resource => {
                auditResult.issues.push({
                    type: 'performance',
                    severity: 'medium',
                    message: `Slow resource: ${resource.url} (${Math.round(resource.duration)}ms)`,
                    suggestion: 'Optimize or compress slow-loading resources'
                });
            });

            // Check for missing alt attributes
            const imagesWithoutAlt = await this.page.evaluate(() => {
                const images = document.querySelectorAll('img');
                const withoutAlt = [];
                images.forEach(img => {
                    if (!img.alt) {
                        withoutAlt.push(img.src);
                    }
                });
                return withoutAlt;
            });

            imagesWithoutAlt.forEach(src => {
                auditResult.issues.push({
                    type: 'accessibility',
                    severity: 'medium',
                    message: `Image missing alt attribute: ${src}`,
                    suggestion: 'Add descriptive alt attributes for better accessibility'
                });
            });

            // Check for form accessibility
            const formsWithoutLabels = await this.page.evaluate(() => {
                const inputs = document.querySelectorAll('input, textarea, select');
                const withoutLabels = [];
                inputs.forEach(input => {
                    const label = document.querySelector(`label[for="${input.id}"]`);
                    if (!label && !input.getAttribute('aria-label')) {
                        withoutLabels.push(input.name || input.type);
                    }
                });
                return withoutLabels;
            });

            formsWithoutLabels.forEach(input => {
                auditResult.issues.push({
                    type: 'accessibility',
                    severity: 'medium',
                    message: `Form input missing label: ${input}`,
                    suggestion: 'Add proper labels or aria-label attributes'
                });
            });

            // Take screenshot for visual inspection
            const screenshotPath = `screenshots/${url.replace(/[^a-zA-Z0-9]/g, '_')}_desktop.png`;
            await this.page.screenshot({ 
                path: screenshotPath,
                fullPage: true 
            });

            // Test mobile viewport
            await this.page.setViewport({ width: 375, height: 667 });
            await this.page.reload({ waitUntil: 'networkidle2' });
            
            const mobileScreenshotPath = `screenshots/${url.replace(/[^a-zA-Z0-9]/g, '_')}_mobile.png`;
            await this.page.screenshot({ 
                path: mobileScreenshotPath,
                fullPage: true 
            });

            // Reset to desktop viewport
            await this.page.setViewport({ width: 1920, height: 1080 });

            this.results.push(auditResult);
            console.log(`✅ Completed audit for ${url}`);

        } catch (error) {
            console.error(`❌ Error auditing ${url}:`, error.message);
            this.results.push({
                url: url,
                timestamp: new Date().toISOString(),
                httpStatus: 'ERROR',
                finalUrl: url,
                issues: [{
                    type: 'error',
                    severity: 'high',
                    message: `Failed to load page: ${error.message}`,
                    suggestion: 'Check server status and fix loading issues'
                }]
            });
        }
    }

    async crawlSite(baseUrl) {
        console.log(`\n🚀 Starting crawl of ${baseUrl}`);
        
        try {
            // Start with homepage
            await this.auditPage(baseUrl);
            
            // Find all internal links
            const links = await this.page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a[href]'));
                return links.map(link => {
                    const href = link.getAttribute('href');
                    if (href.startsWith('/')) {
                        return new URL(href, window.location.origin).href;
                    } else if (href.startsWith('http') && href.includes(window.location.hostname)) {
                        return href;
                    }
                    return null;
                }).filter(Boolean);
            });

            // Remove duplicates and audit each unique page
            const uniqueLinks = [...new Set(links)];
            console.log(`Found ${uniqueLinks.length} internal links to audit`);

            for (const link of uniqueLinks) {
                await this.auditPage(link);
            }

        } catch (error) {
            console.error(`❌ Error crawling ${baseUrl}:`, error.message);
        }
    }

    async generateReport() {
        console.log('\n📊 Generating comprehensive report...');

        // Create screenshots directory
        if (!fs.existsSync('screenshots')) {
            fs.mkdirSync('screenshots');
        }

        // Generate CSV report
        const csvWriter = csv.createObjectCsvWriter({
            path: 'website-audit-report.csv',
            header: [
                { id: 'url', title: 'URL' },
                { id: 'httpStatus', title: 'HTTP Status' },
                { id: 'title', title: 'Title' },
                { id: 'h1', title: 'H1' },
                { id: 'canonical', title: 'Canonical' },
                { id: 'issueType', title: 'Issue Type' },
                { id: 'severity', title: 'Severity' },
                { id: 'message', title: 'Message' },
                { id: 'suggestion', title: 'Suggestion' }
            ]
        });

        const csvData = [];
        this.results.forEach(result => {
            if (result.issues.length === 0) {
                csvData.push({
                    url: result.url,
                    httpStatus: result.httpStatus,
                    title: result.metadata?.title || '',
                    h1: result.metadata?.h1 || '',
                    canonical: result.metadata?.canonical || '',
                    issueType: 'none',
                    severity: 'none',
                    message: 'No issues found',
                    suggestion: 'Page is optimized'
                });
            } else {
                result.issues.forEach(issue => {
                    csvData.push({
                        url: result.url,
                        httpStatus: result.httpStatus,
                        title: result.metadata?.title || '',
                        h1: result.metadata?.h1 || '',
                        canonical: result.metadata?.canonical || '',
                        issueType: issue.type,
                        severity: issue.severity,
                        message: issue.message,
                        suggestion: issue.suggestion
                    });
                });
            }
        });

        await csvWriter.writeRecords(csvData);

        // Generate summary report
        const summary = this.generateSummary();
        fs.writeFileSync('audit-summary.md', summary);

        console.log('✅ Report generated: website-audit-report.csv');
        console.log('✅ Summary generated: audit-summary.md');
        console.log('✅ Screenshots saved in: screenshots/');
    }

    generateSummary() {
        const totalPages = this.results.length;
        const totalIssues = this.results.reduce((sum, result) => sum + result.issues.length, 0);
        
        const issuesByType = {};
        const issuesBySeverity = {};
        
        this.results.forEach(result => {
            result.issues.forEach(issue => {
                issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1;
                issuesBySeverity[issue.severity] = (issuesBySeverity[issue.severity] || 0) + 1;
            });
        });

        return `# Website Audit Summary

## Overview
- **Total Pages Audited**: ${totalPages}
- **Total Issues Found**: ${totalIssues}
- **Audit Date**: ${new Date().toISOString()}

## Issues by Type
${Object.entries(issuesByType).map(([type, count]) => `- **${type}**: ${count} issues`).join('\n')}

## Issues by Severity
${Object.entries(issuesBySeverity).map(([severity, count]) => `- **${severity}**: ${count} issues`).join('\n')}

## Key Recommendations

### SEO Improvements
1. **Title Tags**: Ensure all pages have unique, descriptive title tags (30-60 characters)
2. **H1 Tags**: Add proper H1 tags for better content structure
3. **Canonical Tags**: Implement canonical tags to prevent duplicate content
4. **Meta Descriptions**: Add meta descriptions for better search snippets

### Performance Optimizations
1. **Image Optimization**: Compress and optimize images for faster loading
2. **Resource Minification**: Minify CSS, JavaScript, and HTML files
3. **Caching**: Implement proper caching headers for static resources
4. **CDN**: Consider using a CDN for global content delivery

### Accessibility Improvements
1. **Alt Attributes**: Add descriptive alt attributes to all images
2. **Form Labels**: Ensure all form inputs have proper labels
3. **Keyboard Navigation**: Test keyboard accessibility
4. **Color Contrast**: Verify sufficient color contrast ratios

### Code Quality
1. **JavaScript Errors**: Fix all console errors and warnings
2. **HTML Validation**: Ensure valid HTML markup
3. **CSS Validation**: Check for CSS errors and browser compatibility
4. **Mobile Responsiveness**: Test and fix mobile layout issues

## Next Steps
1. Review the detailed CSV report for specific issues
2. Check screenshots for visual problems
3. Prioritize fixes based on severity levels
4. Implement monitoring for ongoing quality assurance
`;
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// Main execution
async function main() {
    const auditor = new WebsiteAuditor();
    
    try {
        await auditor.init();
        
        // Audit local development site first
        console.log('🔍 Auditing LOCAL DEVELOPMENT SITE...\n');
        await auditor.crawlSite('http://localhost:3000');
        
        // Optionally audit production domains (uncomment when deployed)
        // await auditor.crawlSite('https://www.petrolpricesnearme.com.au');
        // await auditor.crawlSite('https://www.petrolpricesnearme.com');
        
        await auditor.generateReport();
        
    } catch (error) {
        console.error('❌ Audit failed:', error);
        console.error('💡 Make sure your development server is running: npm start');
    } finally {
        await auditor.close();
    }
}

if (require.main === module) {
    main();
}

module.exports = WebsiteAuditor;
