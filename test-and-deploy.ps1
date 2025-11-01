# ==========================================================
# COMPREHENSIVE TEST & DEPLOY SCRIPT
# Tests everything locally before pushing to GitHub
# ==========================================================

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   PETROL PRICE NEAR ME - TEST & DEPLOY SCRIPT        ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
Set-Location "C:\Users\zenbo\Desktop\PPNM"

$totalSteps = 7
$currentStep = 0
$failedSteps = @()

# Function to display step
function Show-Step {
    param($title)
    $script:currentStep++
    Write-Host ""
    Write-Host "[$script:currentStep/$totalSteps] $title" -ForegroundColor Yellow
    Write-Host ("=" * 60) -ForegroundColor DarkGray
}

# Function to record failure
function Record-Failure {
    param($stepName)
    $script:failedSteps += $stepName
}

# Step 1: Check Node Version
Show-Step "Checking Node.js Version"
$nodeVersion = node --version
Write-Host "Node.js version: $nodeVersion" -ForegroundColor White
if ($nodeVersion -notmatch "v22") {
    Write-Host "⚠️  Warning: Node.js 22.x is required! You have $nodeVersion" -ForegroundColor Red
    Write-Host "   Install Node 22: https://nodejs.org/" -ForegroundColor Yellow
    Record-Failure "Node Version"
} else {
    Write-Host "✓ Node.js version correct" -ForegroundColor Green
}

# Step 2: Install Dependencies
Show-Step "Installing/Verifying Dependencies"
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor White
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ npm install failed!" -ForegroundColor Red
        Record-Failure "Dependencies"
    } else {
        Write-Host "✓ Dependencies installed" -ForegroundColor Green
    }
} else {
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
}

# Step 3: TypeScript Type Check
Show-Step "TypeScript Type Check"
npm run type-check
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Type check failed!" -ForegroundColor Red
    Record-Failure "TypeScript"
} else {
    Write-Host "✓ Type check passed!" -ForegroundColor Green
}

# Step 4: ESLint
Show-Step "ESLint Code Quality Check"
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Linting issues found, attempting auto-fix..." -ForegroundColor Yellow
    npm run lint:fix
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Linting failed even after auto-fix!" -ForegroundColor Red
        Record-Failure "ESLint"
    } else {
        Write-Host "✓ Linting passed after auto-fix!" -ForegroundColor Green
    }
} else {
    Write-Host "✓ Linting passed!" -ForegroundColor Green
}

# Step 5: Build Application
Show-Step "Building Application (Production)"
$env:NODE_ENV = "production"
$env:CI = "false"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build FAILED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Cannot proceed with deployment - build errors must be fixed first!" -ForegroundColor Red
    Record-Failure "Build"
    exit 1
} else {
    Write-Host "✓ Build successful!" -ForegroundColor Green
}

# Step 6: Verify Build Output
Show-Step "Verifying Build Output"
if (Test-Path ".next") {
    $buildSize = (Get-ChildItem -Path ".next" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "✓ Build artifacts created successfully!" -ForegroundColor Green
    Write-Host ("   Build size: {0:N2} MB" -f $buildSize) -ForegroundColor White
} else {
    Write-Host "✗ Build artifacts not found!" -ForegroundColor Red
    Record-Failure "Build Verification"
    exit 1
}

# Step 7: Git Status
Show-Step "Checking Git Status"
git status --short
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host ""
    Write-Host "📝 Changes detected:" -ForegroundColor Cyan
    Write-Host $gitStatus -ForegroundColor White
} else {
    Write-Host "✓ No changes to commit" -ForegroundColor Green
}

# Summary
Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                   TEST SUMMARY                        ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if ($failedSteps.Count -eq 0) {
    Write-Host "✅ ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your project is ready for deployment!" -ForegroundColor Green
    Write-Host ""

    # Ask to commit and push
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor DarkGray
    Write-Host "Would you like to commit and push these changes now?" -ForegroundColor Yellow
    Write-Host "This will:" -ForegroundColor White
    Write-Host "  • Add all changes" -ForegroundColor White
    Write-Host "  • Commit with message: 'fix: update Node version to 22 and fix CI/CD workflows'" -ForegroundColor White
    Write-Host "  • Push to origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "Continue? (Y/N): " -ForegroundColor Yellow -NoNewline
    $response = Read-Host

    if ($response -eq 'Y' -or $response -eq 'y') {
        Write-Host ""
        Write-Host "Committing changes..." -ForegroundColor Yellow
        git add .
        git commit -m "fix: update Node version to 22 and fix CI/CD workflows

- Updated all GitHub Actions workflows to use Node 22
- Fixed next.config.ts to enable proper error checking
- Updated dependencies (lighthouse 11.7.1 → 12.8.2)
- Regenerated sitemap with updated timestamps
- Added CI: false flag to prevent strict mode failures"

        if ($LASTEXITCODE -ne 0) {
            Write-Host "✗ Commit failed!" -ForegroundColor Red
            exit 1
        }

        Write-Host "Pushing to origin main..." -ForegroundColor Yellow
        git push origin main

        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Green
            Write-Host "║        ✅ SUCCESSFULLY DEPLOYED TO GITHUB! ✅         ║" -ForegroundColor Green
            Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Green
            Write-Host ""
            Write-Host "Check your GitHub Actions:" -ForegroundColor Cyan
            Write-Host "https://github.com/PetroPricesnearMe/petrol-prices-melbourne/actions" -ForegroundColor Blue
        } else {
            Write-Host "✗ Push failed!" -ForegroundColor Red
            Write-Host "You may need to pull changes first: git pull origin main" -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host ""
        Write-Host "Deployment cancelled. Run these commands manually when ready:" -ForegroundColor Yellow
        Write-Host "  git add ." -ForegroundColor White
        Write-Host "  git commit -m 'fix: update Node version to 22 and fix CI/CD workflows'" -ForegroundColor White
        Write-Host "  git push origin main" -ForegroundColor White
    }
} else {
    Write-Host "❌ SOME TESTS FAILED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Failed steps:" -ForegroundColor Red
    foreach ($step in $failedSteps) {
        Write-Host "  • $step" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Please fix the issues above before deploying." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
Write-Host ""
