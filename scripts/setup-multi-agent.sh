#!/bin/bash

# Multi-Agent Setup Script
# Sets up branches and provides instructions for spinning up agent sessions

set -e

echo "🚀 Setting up Multi-Agent Development Environment..."
echo "=================================================="

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Create feature branches for each agent domain
echo "📋 Creating feature branches for each agent..."

branches=(
    "feature/frontend-improvements"
    "feature/backend-optimization" 
    "feature/database-migration"
    "feature/testing-setup"
)

for branch in "${branches[@]}"; do
    if git show-ref --verify --quiet refs/heads/$branch; then
        echo "⚠️  Branch $branch already exists, skipping..."
    else
        git checkout -b $branch
        echo "✅ Created branch: $branch"
        git checkout main
    fi
done

echo ""
echo "🎯 Agent Branches Created Successfully!"
echo "======================================"

# Display the agent setup instructions
echo ""
echo "📖 Next Steps - Open 4 Cursor Sessions:"
echo "======================================="
echo ""

echo "🎨 FRONTEND AGENT SESSION:"
echo "-------------------------"
echo "1. Open new Cursor window"
echo "2. Switch to branch: feature/frontend-improvements"
echo "3. Use prompt: 'You are the Frontend Agent. Only modify src/components/**, src/pages/**, src/styles/**, src/hooks/**, src/utils/**, public/**, tests/unit/frontend/**'"
echo ""

echo "🔧 BACKEND AGENT SESSION:"
echo "------------------------"
echo "1. Open new Cursor window"  
echo "2. Switch to branch: feature/backend-optimization"
echo "3. Use prompt: 'You are the Backend Agent. Only modify backend/**, tests/unit/backend/**, tests/integration/**, scripts/backend/**'"
echo ""

echo "🗄️ DATABASE/CONFIG AGENT SESSION:"
echo "---------------------------------"
echo "1. Open new Cursor window"
echo "2. Switch to branch: feature/database-migration"
echo "3. Use prompt: 'You are the Database/Config Agent. Only modify config/**, data/**, env.example, .env.*, backend/src/config/**, backend/src/types/**'"
echo ""

echo "🧪 TESTING/CI-CD AGENT SESSION:"
echo "------------------------------"
echo "1. Open new Cursor window"
echo "2. Switch to branch: feature/testing-setup"  
echo "3. Use prompt: 'You are the Testing/CI-CD Agent. Only modify tests/**, .github/workflows/**, scripts/test/**, scripts/deploy/**, cypress/**, jest.config.js, cypress.config.js'"
echo ""

echo "📚 Documentation Available:"
echo "============================"
echo "- PROJECT_DOMAIN_ORGANIZATION.md - Complete domain structure plan"
echo "- AGENT_COLLABORATION_GUIDE.md - Detailed collaboration workflow"
echo "- MULTI_AGENT_QUICK_START.md - Quick reference guide"
echo "- .cursor/rules/ - Agent rule files for each domain"
echo ""

echo "🔄 Workflow Commands:"
echo "===================="
echo "# Check agent branch status:"
echo "git branch -a | grep feature/"
echo ""
echo "# Switch between agent contexts:"
echo "git checkout feature/frontend-improvements"
echo "git checkout feature/backend-optimization"
echo "git checkout feature/database-migration"
echo "git checkout feature/testing-setup"
echo ""
echo "# Integration testing:"
echo "npm run test:integration"
echo "npm run build"
echo ""

echo "✅ Multi-Agent Environment Setup Complete!"
echo "=========================================="
echo ""
echo "🎉 You're ready to start parallel development!"
echo "   Each agent can now work independently in their domain."
echo ""
echo "📖 See MULTI_AGENT_QUICK_START.md for detailed instructions."
