# PowerShell version of pre-commit hook
Write-Host "🔍 Running pre-commit checks..."

# Run lint-staged
npx lint-staged
if ($LASTEXITCODE -ne 0) {
    exit 1
}

# Check for console.logs
$files = git diff --cached --name-only --diff-filter=ACM | Where-Object { $_ -match '\.(ts|tsx|js|jsx)$' }
$foundLogs = $false

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    if ($content -match 'console\.log') {
        Write-Host "❌ Found console.log in: $file"
        $foundLogs = $true
    }
}

if ($foundLogs) {
    Write-Host "❌ Please remove console.log statements"
    exit 1
}

Write-Host "✅ Pre-commit checks passed!"
exit 0
