#!/bin/bash
# CI/CD Workflow Fix Script
# Automatically backs up old workflows and activates fixed versions

set -e

echo "🔧 CI/CD Workflow Fix Script"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root"
    exit 1
fi

# Create backup directory
echo "📁 Creating backup directory..."
mkdir -p .github/workflows/backup

# Backup old workflows
echo "💾 Backing up old workflows..."
for file in ci.yml performance.yml quality-checks.yml deploy.yml; do
    if [ -f ".github/workflows/$file" ]; then
        mv ".github/workflows/$file" ".github/workflows/backup/$file"
        echo "   ✓ Backed up $file"
    fi
done

# Activate fixed workflows
echo ""
echo "✨ Activating fixed workflows..."
for file in ci-fixed.yml performance-fixed.yml quality-checks-fixed.yml deploy-fixed.yml; do
    if [ -f ".github/workflows/$file" ]; then
        new_name="${file/-fixed/}"
        mv ".github/workflows/$file" ".github/workflows/$new_name"
        echo "   ✓ Activated $new_name"
    fi
done

# Check if Lighthouse config exists
if [ ! -f ".lighthouserc.json" ]; then
    echo ""
    echo "⚠️  Warning: .lighthouserc.json not found"
    echo "   Please ensure Lighthouse config is created"
fi

echo ""
echo "✅ Workflow fix complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Test build locally: npm run build"
echo "   2. Review changes: git diff .github/workflows/"
echo "   3. Commit changes: git add . && git commit -m 'fix: optimize CI/CD workflows'"
echo "   4. Push to GitHub: git push origin main"
echo ""
echo "📖 For detailed information, see: CI_WORKFLOW_FIX_GUIDE.md"
