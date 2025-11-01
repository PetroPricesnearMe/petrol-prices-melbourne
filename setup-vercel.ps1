# ==========================================================
# VERCEL CLI SETUP & DEPLOYMENT SCRIPT
# Installs Vercel CLI, connects to your project, and deploys
# ==========================================================

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              VERCEL CLI SETUP & DEPLOY                ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Set-Location "C:\Users\zenbo\Desktop\PPNM"

# Step 1: Check if Vercel CLI is installed
Write-Host "[1/5] Checking Vercel CLI installation..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor DarkGray

$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if ($vercelInstalled) {
    $vercelVersion = vercel --version
    Write-Host "✓ Vercel CLI is already installed: v$vercelVersion" -ForegroundColor Green
} else {
    Write-Host "Installing Vercel CLI globally..." -ForegroundColor Yellow
    npm install -g vercel

    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install Vercel CLI!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Try running PowerShell as Administrator, or install manually:" -ForegroundColor Yellow
        Write-Host "  npm install -g vercel" -ForegroundColor White
        exit 1
    }

    Write-Host "✓ Vercel CLI installed successfully!" -ForegroundColor Green
}

Write-Host ""

# Step 2: Login to Vercel
Write-Host "[2/5] Logging into Vercel..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""
Write-Host "A browser window will open for authentication." -ForegroundColor Cyan
Write-Host "Please login with your Vercel account." -ForegroundColor Cyan
Write-Host ""

vercel login

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Vercel login failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ Successfully logged in to Vercel!" -ForegroundColor Green
Write-Host ""

# Step 3: Check current Vercel link status
Write-Host "[3/5] Checking project link status..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor DarkGray

$linkStatus = vercel inspect 2>&1

if ($linkStatus -match "not linked") {
    Write-Host "Project is not linked to Vercel yet." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Linking project to Vercel..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Follow the prompts:" -ForegroundColor Cyan
    Write-Host "  • Set up and deploy: Y" -ForegroundColor White
    Write-Host "  • Which scope: Select your account/team" -ForegroundColor White
    Write-Host "  • Link to existing project: Y (if it exists) or N (to create new)" -ForegroundColor White
    Write-Host "  • Project name: petrol-prices-melbourne (or your preferred name)" -ForegroundColor White
    Write-Host "  • Directory: ./ (just press Enter)" -ForegroundColor White
    Write-Host "  • Override settings: N (unless you need to)" -ForegroundColor White
    Write-Host ""

    vercel link

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "✗ Failed to link project!" -ForegroundColor Red
        exit 1
    }

    Write-Host ""
    Write-Host "✓ Project linked successfully!" -ForegroundColor Green
} else {
    Write-Host "✓ Project is already linked to Vercel!" -ForegroundColor Green
}

Write-Host ""

# Step 4: Show project info
Write-Host "[4/5] Project Information..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor DarkGray

vercel inspect

Write-Host ""

# Step 5: Deploy options
Write-Host "[5/5] Deployment Options..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Choose deployment type:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Preview Deployment (for testing)" -ForegroundColor White
Write-Host "     • Creates a unique preview URL" -ForegroundColor DarkGray
Write-Host "     • Safe for testing changes" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  2. Production Deployment" -ForegroundColor White
Write-Host "     • Deploys to your production domain" -ForegroundColor DarkGray
Write-Host "     • Goes live immediately" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  3. Skip deployment (just setup)" -ForegroundColor White
Write-Host ""
Write-Host "Enter choice (1, 2, or 3): " -ForegroundColor Yellow -NoNewline
$choice = Read-Host

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Deploying preview version..." -ForegroundColor Yellow
        Write-Host ""
        vercel

        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Green
            Write-Host "║        ✅ PREVIEW DEPLOYED SUCCESSFULLY! ✅           ║" -ForegroundColor Green
            Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Green
            Write-Host ""
            Write-Host "Your preview URL is shown above! 👆" -ForegroundColor Cyan
        }
    }
    "2" {
        Write-Host ""
        Write-Host "⚠️  WARNING: This will deploy to PRODUCTION!" -ForegroundColor Yellow
        Write-Host "Are you sure? (Y/N): " -ForegroundColor Yellow -NoNewline
        $confirm = Read-Host

        if ($confirm -eq 'Y' -or $confirm -eq 'y') {
            Write-Host ""
            Write-Host "Deploying to production..." -ForegroundColor Yellow
            Write-Host ""
            vercel --prod

            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Green
                Write-Host "║     ✅ PRODUCTION DEPLOYED SUCCESSFULLY! ✅           ║" -ForegroundColor Green
                Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Green
                Write-Host ""
                Write-Host "🎉 Your site is LIVE at: https://petrolpricenearme.com.au" -ForegroundColor Green
            }
        } else {
            Write-Host "Production deployment cancelled." -ForegroundColor Yellow
        }
    }
    "3" {
        Write-Host ""
        Write-Host "Skipping deployment." -ForegroundColor Yellow
    }
    default {
        Write-Host ""
        Write-Host "Invalid choice. Skipping deployment." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              VERCEL SETUP COMPLETE! ✅                ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  • View deployments: vercel ls" -ForegroundColor White
Write-Host "  • Deploy preview: vercel" -ForegroundColor White
Write-Host "  • Deploy production: vercel --prod" -ForegroundColor White
Write-Host "  • View logs: vercel logs [deployment-url]" -ForegroundColor White
Write-Host "  • Open dashboard: vercel dashboard" -ForegroundColor White
Write-Host ""
Write-Host "Environment variables:" -ForegroundColor Yellow
Write-Host "  • Add via Vercel Dashboard → Settings → Environment Variables" -ForegroundColor White
Write-Host "  • Or use: vercel env add [name]" -ForegroundColor White
Write-Host ""
Write-Host "Done! 🚀" -ForegroundColor Green
Write-Host ""
