#!/bin/bash

###############################################################################
# Code Quality Check Script
# Comprehensive linting, type checking, and code analysis
###############################################################################

set -e

echo "🔍 Starting Code Quality Checks..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0

# Function to run a check
run_check() {
    local name=$1
    local command=$2
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Running: ${name}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    if eval "$command"; then
        echo -e "${GREEN}✓ ${name} passed${NC}"
        echo ""
    else
        echo -e "${RED}✗ ${name} failed${NC}"
        echo ""
        ((ERRORS++))
    fi
}

# 1. TypeScript Type Check
run_check "TypeScript Type Check" "npm run type-check"

# 2. ESLint
run_check "ESLint" "npm run lint"

# 3. Prettier Format Check
run_check "Prettier Format Check" "npm run format:check"

# 4. Unused Dependencies Check
if command -v depcheck &> /dev/null; then
    run_check "Unused Dependencies Check" "depcheck --ignores='@types/*,eslint-*,prettier'"
else
    echo -e "${YELLOW}⚠️  depcheck not installed. Skipping unused dependencies check.${NC}"
    echo -e "Install with: npm install -g depcheck"
    echo ""
fi

# 5. Security Audit
run_check "Security Audit" "npm audit --production --audit-level=moderate"

# 6. Code Complexity Check
if [ -f ".eslintrc.advanced.json" ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Code Complexity Analysis${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    # Count cognitive complexity warnings
    COMPLEXITY_WARNINGS=$(npx eslint --config .eslintrc.advanced.json 'src/**/*.{ts,tsx}' 'pages/**/*.{ts,tsx}' 2>/dev/null | grep -c "cognitive-complexity" || true)
    
    if [ "$COMPLEXITY_WARNINGS" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Found ${COMPLEXITY_WARNINGS} cognitive complexity warning(s)${NC}"
        echo -e "   Consider refactoring complex functions"
        echo ""
    else
        echo -e "${GREEN}✓ No high-complexity code detected${NC}"
        echo ""
    fi
fi

# 7. Duplicate Code Detection
if command -v jscpd &> /dev/null; then
    run_check "Duplicate Code Detection" "jscpd src/ pages/ --min-lines 5 --min-tokens 50 --format 'javascript,typescript' --reporters 'console'"
else
    echo -e "${YELLOW}⚠️  jscpd not installed. Skipping duplicate code detection.${NC}"
    echo -e "Install with: npm install -g jscpd"
    echo ""
fi

# 8. Import Cycle Detection
if [ -f "package.json" ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Import Cycle Detection${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    CYCLES=$(npx eslint --config .eslintrc.advanced.json 'src/**/*.{ts,tsx}' 'pages/**/*.{ts,tsx}' 2>/dev/null | grep -c "import/no-cycle" || true)
    
    if [ "$CYCLES" -gt 0 ]; then
        echo -e "${RED}✗ Found ${CYCLES} import cycle(s)${NC}"
        echo -e "   Run 'npm run lint' to see details"
        echo ""
        ((ERRORS++))
    else
        echo -e "${GREEN}✓ No import cycles detected${NC}"
        echo ""
    fi
fi

# 9. Accessibility Check
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Accessibility Check${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

A11Y_ERRORS=$(npx eslint --config .eslintrc.advanced.json 'src/**/*.{ts,tsx}' 'pages/**/*.{ts,tsx}' 2>/dev/null | grep -c "jsx-a11y/" || true)

if [ "$A11Y_ERRORS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found ${A11Y_ERRORS} accessibility issue(s)${NC}"
    echo -e "   Run 'npm run lint' to see details"
    echo ""
else
    echo -e "${GREEN}✓ No accessibility issues detected${NC}"
    echo ""
fi

# 10. Test Coverage
if [ -d "coverage" ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Test Coverage${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Last coverage report available in: coverage/"
    echo ""
fi

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✨ All checks passed! Code quality is excellent.${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}❌ ${ERRORS} check(s) failed. Please fix the issues above.${NC}"
    echo ""
    exit 1
fi

