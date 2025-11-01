#!/bin/bash

###############################################################################
# Performance Audit Script
# Comprehensive performance testing and analysis
###############################################################################

set -e

echo "🚀 Starting Performance Audit..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if build exists
if [ ! -d ".next" ]; then
    echo -e "${YELLOW}No build found. Building application...${NC}"
    npm run build
fi

echo ""
echo "📊 1. Bundle Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Run bundle analyzer
node scripts/analyze-bundle.js

echo ""
echo "📦 2. Bundle Size Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check static chunks size
STATIC_DIR=".next/static/chunks"
if [ -d "$STATIC_DIR" ]; then
    echo "Main chunks:"
    ls -lh "$STATIC_DIR"/*.js | awk '{print "  " $9 ": " $5}'
    
    # Calculate total size
    TOTAL_SIZE=$(du -sh "$STATIC_DIR" | cut -f1)
    echo ""
    echo -e "${BLUE}Total chunks size: ${TOTAL_SIZE}${NC}"
fi

echo ""
echo "🖼️  3. Image Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check image sizes
if [ -d "public/images" ]; then
    echo "Image directory size:"
    du -sh public/images
    echo ""
    echo "Largest images:"
    find public/images -type f -exec du -h {} + | sort -rh | head -10
fi

echo ""
echo "📝 4. Dependencies Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for heavy dependencies
echo "Checking for heavy dependencies..."
if command -v npx &> /dev/null; then
    echo ""
    echo "Top 10 largest dependencies:"
    npx cost-of-modules --no-install | head -15
fi

echo ""
echo "🔍 5. Lighthouse Audit (if available)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v lighthouse &> /dev/null; then
    echo "Running Lighthouse audit..."
    lighthouse http://localhost:3000 \
        --only-categories=performance,accessibility,best-practices,seo \
        --output=json \
        --output-path=./lighthouse-report.json \
        --chrome-flags="--headless" \
        --quiet
    
    if [ -f "lighthouse-report.json" ]; then
        echo -e "${GREEN}Lighthouse report generated: lighthouse-report.json${NC}"
    fi
else
    echo -e "${YELLOW}Lighthouse CLI not installed. Skipping...${NC}"
    echo "Install with: npm install -g lighthouse"
fi

echo ""
echo "✅ 6. Performance Recommendations"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check bundle size thresholds
MAIN_BUNDLE_SIZE=$(find .next/static/chunks -name "main-*.js" -type f -exec du -k {} + | cut -f1)

if [ "$MAIN_BUNDLE_SIZE" -gt 500 ]; then
    echo -e "${RED}⚠️  Main bundle is too large (${MAIN_BUNDLE_SIZE}KB > 500KB)${NC}"
    echo "   Recommendation: Implement more code splitting"
else
    echo -e "${GREEN}✓ Main bundle size is optimal (${MAIN_BUNDLE_SIZE}KB)${NC}"
fi

# Check if dynamic imports are used
if grep -r "next/dynamic" pages/ --quiet; then
    echo -e "${GREEN}✓ Dynamic imports are being used${NC}"
else
    echo -e "${YELLOW}⚠️  Consider using dynamic imports for heavy components${NC}"
fi

# Check if images are optimized
if grep -r "next/image" pages/ --quiet; then
    echo -e "${GREEN}✓ Next.js Image component is being used${NC}"
else
    echo -e "${YELLOW}⚠️  Consider using next/image for automatic optimization${NC}"
fi

echo ""
echo "📊 7. Generating Performance Report"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create performance report
cat > performance-audit-report.txt << EOF
Performance Audit Report
Generated: $(date)

Bundle Size:
- Static Chunks: ${TOTAL_SIZE}
- Main Bundle: ${MAIN_BUNDLE_SIZE}KB

Recommendations:
$(grep -c "next/dynamic" pages/*.js || echo 0) pages using dynamic imports
$(grep -c "next/image" pages/*.js || echo 0) pages using optimized images

For detailed analysis, check:
- bundle-analysis-report.json
- lighthouse-report.json (if generated)

Next steps:
1. Review bundle-analysis-report.json for optimization opportunities
2. Check lighthouse-report.json for performance scores
3. Implement recommended optimizations
4. Run audit again to verify improvements
EOF

echo -e "${GREEN}Report generated: performance-audit-report.txt${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✨ Performance Audit Complete!${NC}"
echo ""
echo "Reports generated:"
echo "  • bundle-analysis-report.json"
echo "  • performance-audit-report.txt"
echo "  • lighthouse-report.json (if available)"
echo ""
echo "Next steps:"
echo "  1. Review the reports above"
echo "  2. Implement HIGH priority recommendations"
echo "  3. Run 'npm run analyze' for visual bundle analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

