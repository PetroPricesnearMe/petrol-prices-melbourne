# ==========================================================
# SIMPLE PUSH TO GITHUB SCRIPT
# ==========================================================

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║               PUSH TO GITHUB - MAIN                   ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Set-Location "C:\Users\zenbo\Desktop\PPNM"

# Show current status
Write-Host "Current Git Status:" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor DarkGray
git status --short
Write-Host ""

# Confirm push
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Ready to push all staged changes to GitHub main?" -ForegroundColor Yellow
Write-Host ""
Write-Host "This will:" -ForegroundColor Cyan
Write-Host "  ✓ Push all staged commits to origin/main" -ForegroundColor White
Write-Host "  ✓ Trigger GitHub Actions CI/CD workflows" -ForegroundColor White
Write-Host "  ✓ Deploy to Vercel (if configured)" -ForegroundColor White
Write-Host ""
Write-Host "Continue? (Y/N): " -ForegroundColor Yellow -NoNewline
$response = Read-Host

if ($response -ne 'Y' -and $response -ne 'y') {
    Write-Host ""
    Write-Host "Push cancelled." -ForegroundColor Yellow
    exit 0
}

# Push to GitHub
Write-Host ""
Write-Host "Pushing to GitHub main..." -ForegroundColor Yellow
Write-Host ""

git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║          ✅ SUCCESSFULLY PUSHED TO GITHUB! ✅        ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Your changes are now on GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Check GitHub Actions:"-ForegroundColor White
    Write-Host "     https://github.com/YOUR_USERNAME/YOUR_REPO/actions" -ForegroundColor Blue
    Write-Host ""
    Write-Host "  2. Monitor the build and deployment" -ForegroundColor White
    Write-Host ""
    Write-Host "  3. Verify your site updates successfully" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Push failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  • Need to pull first: git pull origin main" -ForegroundColor White
    Write-Host "  • Check GitHub credentials" -ForegroundColor White
    Write-Host "  • Verify repository permissions" -ForegroundColor White
    Write-Host ""

    Write-Host "Try pulling first? (Y/N): " -ForegroundColor Yellow -NoNewline
    $pullResponse = Read-Host

    if ($pullResponse -eq 'Y' -or $pullResponse -eq 'y') {
        Write-Host ""
        Write-Host "Pulling latest changes..." -ForegroundColor Yellow
        git pull origin main

        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Pull successful! Try pushing again:" -ForegroundColor Green
            Write-Host "  git push origin main" -ForegroundColor White
        }
    }

    exit 1
}

Write-Host ""
Write-Host "Done! 🚀" -ForegroundColor Green
Write-Host ""
