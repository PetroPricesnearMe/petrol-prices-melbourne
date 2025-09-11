#!/bin/bash

# Quick Website Audit Commands
# Run these commands to perform a basic audit of the websites

echo "🚀 Starting Quick Website Audit"
echo "================================"

# Create audit directory
mkdir -p audit-results
cd audit-results

# Function to test a URL
test_url() {
    local url=$1
    local domain=$(echo $url | sed 's|https\?://||' | sed 's|/.*||')
    
    echo "🔍 Testing: $url"
    echo "----------------------------------------"
    
    # Test HTTP status
    echo "📊 HTTP Status:"
    curl -I -s "$url" | head -1
    
    # Test response time
    echo "⏱️  Response Time:"
    curl -w "Time: %{time_total}s\n" -o /dev/null -s "$url"
    
    # Test SSL certificate
    echo "🔒 SSL Certificate:"
    echo | openssl s_client -servername "$domain" -connect "$domain":443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || echo "SSL check failed"
    
    # Test for common issues
    echo "🔍 Common Issues Check:"
    
    # Check for redirects
    redirect_url=$(curl -I -s -L "$url" | grep -i location | tail -1 | cut -d' ' -f2 | tr -d '\r\n')
    if [ ! -z "$redirect_url" ]; then
        echo "⚠️  Redirects to: $redirect_url"
    fi
    
    # Check for missing security headers
    security_headers=$(curl -I -s "$url" | grep -i "x-frame-options\|x-content-type-options\|x-xss-protection\|strict-transport-security")
    if [ -z "$security_headers" ]; then
        echo "⚠️  Missing security headers"
    else
        echo "✅ Security headers present"
    fi
    
    # Check for gzip compression
    compression=$(curl -H "Accept-Encoding: gzip" -I -s "$url" | grep -i "content-encoding")
    if [ -z "$compression" ]; then
        echo "⚠️  No gzip compression detected"
    else
        echo "✅ Gzip compression enabled"
    fi
    
    echo ""
}

# Test both domains
test_url "https://www.petrolpricesnearme.com.au"
test_url "https://www.petrolpricesnearme.com"

# Test common pages
echo "🔍 Testing Common Pages"
echo "======================"

# List of common pages to test
pages=(
    "/"
    "/about"
    "/contact"
    "/privacy"
    "/terms"
    "/sitemap.xml"
    "/robots.txt"
)

for page in "${pages[@]}"; do
    test_url "https://www.petrolpricesnearme.com.au$page"
    test_url "https://www.petrolpricesnearme.com$page"
done

# Generate summary report
echo "📊 Generating Summary Report"
echo "============================"

cat > audit-summary.txt << EOF
Website Audit Summary
====================
Date: $(date)
Auditor: Quick Audit Script

Domains Tested:
- https://www.petrolpricesnearme.com.au
- https://www.petrolpricesnearme.com

Common Pages Tested:
$(printf '%s\n' "${pages[@]}")

Notes:
- Check the output above for specific issues
- Look for 404 errors, redirects, and missing security headers
- Test manually in browser for visual issues
- Use Google Lighthouse for detailed performance analysis

Next Steps:
1. Run Google Lighthouse on both domains
2. Check for broken links using Screaming Frog
3. Test mobile responsiveness
4. Verify SEO elements (titles, meta descriptions, etc.)
EOF

echo "✅ Quick audit completed!"
echo "📄 Summary saved to: audit-results/audit-summary.txt"
echo ""
echo "🔧 For detailed analysis, run:"
echo "   - Google Lighthouse in Chrome DevTools"
echo "   - GTmetrix.com for performance analysis"
echo "   - Screaming Frog SEO Spider for comprehensive crawling"
