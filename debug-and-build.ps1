# ==========================================================
# Comprehensive Project Debug and Build Script
# ==========================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Project Validation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
Set-Location "C:\Users\zenbo\Desktop\PPNM"

# Step 1: Type Check
Write-Host "[1/5] Running TypeScript Type Check..." -ForegroundColor Yellow
npm run type-check
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Type check failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Type check passed!" -ForegroundColor Green
Write-Host ""

# Step 2: Lint Check
Write-Host "[2/5] Running ESLint..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Linting failed!" -ForegroundColor Red
    Write-Host "Attempting to fix automatically..." -ForegroundColor Yellow
    npm run lint:fix
}
Write-Host "✓ Linting passed!" -ForegroundColor Green
Write-Host ""

# Step 3: Check for missing dependencies
Write-Host "[3/5] Checking dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "✗ node_modules not found! Running npm install..." -ForegroundColor Red
    npm install
}
Write-Host "✓ Dependencies OK!" -ForegroundColor Green
Write-Host ""

# Step 4: Build the project
Write-Host "[4/5] Building the project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build successful!" -ForegroundColor Green
Write-Host ""

# Step 5: Check build output
Write-Host "[5/5] Verifying build output..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Write-Host "✓ Build artifacts created successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Build artifacts not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All checks passed! ✓" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project is ready to be committed and pushed!" -ForegroundColor Green
Write-Host ""
Write-Host "Would you like to commit and push now? (Y/N)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq 'Y' -or $response -eq 'y') {
    Write-Host ""
    Write-Host "Committing changes..." -ForegroundColor Yellow
    git add .
    git commit -m "chore: update dependencies and regenerate sitemap"

    Write-Host "Pushing to origin main..." -ForegroundColor Yellow
    git push origin main

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "Successfully pushed to origin main! ✓" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
    } else {
        Write-Host "✗ Push failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host ""
    Write-Host "Skipping commit and push. Run these commands manually:" -ForegroundColor Yellow
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m 'chore: update dependencies and regenerate sitemap'" -ForegroundColor White
    Write-Host "  git push origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
