@echo off
echo 🚀 Setting up Agent Branches...
echo ===============================

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Not in a git repository
    exit /b 1
)

echo 📋 Creating agent branches...

REM Create agent branches
set branches=feat/frontend-agent feat/api-agent feat/database-agent feat/testing-agent

for %%b in (%branches%) do (
    git show-ref --verify --quiet refs/heads/%%b >nul 2>&1
    if errorlevel 1 (
        git checkout -b %%b
        echo ✅ Created branch: %%b
        git checkout main
    ) else (
        echo ⚠️  Branch %%b already exists, skipping...
    )
)

echo.
echo 🎯 Agent Branches Created Successfully!
echo ====================================
echo.

echo 📖 Next Steps:
echo ==============
echo 1. Open 4 Cursor sessions (windows/tabs)
echo 2. In each session, switch to the appropriate branch:
echo.
echo    🎨 Frontend Agent: git checkout feat/frontend-agent
echo    🔧 API Agent:      git checkout feat/api-agent
echo    🗄️  Database Agent: git checkout feat/database-agent
echo    🧪 Testing Agent:  git checkout feat/testing-agent
echo.
echo 3. Use the agent prompts from CURSOR_AGENT_SETUP_GUIDE.md
echo.
echo ✅ Setup Complete! Ready for parallel development.

pause
