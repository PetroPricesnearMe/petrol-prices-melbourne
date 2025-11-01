# ==========================================================
# QUICK VERCEL DEPLOYMENT SCRIPT
# For when Vercel is already setup
# ==========================================================

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              QUICK VERCEL DEPLOY                      ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Set-Location "C:\Users\zenbo\Desktop\PPNM"

Write-Host "Choose deployment type:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Preview Deployment (safe testing)" -ForegroundColor White
Write-Host "  2. Production Deployment (goes live)" -ForegroundColor White
Write-Host ""
Write-Host "Enter choice (1 or 2): " -ForegroundColor Yellow -NoNewline
$choice = Read-Host

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "Deploying preview..." -ForegroundColor Yellow
    vercel
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "⚠️  Deploying to PRODUCTION..." -ForegroundColor Yellow
    vercel --prod
} else {
    Write-Host "Invalid choice!" -ForegroundColor Red
    exit 1
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "✗ Deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""

