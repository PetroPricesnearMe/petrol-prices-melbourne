# ==========================================================
# Quick Fix for Next.js Config
# Enables proper error checking for production
# ==========================================================

Write-Host "Fixing next.config.ts for production..." -ForegroundColor Yellow

$configPath = "C:\Users\zenbo\Desktop\PPNM\next.config.ts"
$content = Get-Content $configPath -Raw

# Replace ignoreBuildErrors: true with false
$content = $content -replace 'ignoreBuildErrors: true', 'ignoreBuildErrors: false'

# Replace ignoreDuringBuilds: true with false
$content = $content -replace 'ignoreDuringBuilds: true', 'ignoreDuringBuilds: false'

Set-Content $configPath $content

Write-Host "✓ Config fixed!" -ForegroundColor Green
Write-Host "  - TypeScript errors will now be checked during build" -ForegroundColor White
Write-Host "  - ESLint errors will now be checked during build" -ForegroundColor White
