@echo off
REM Quick Website Audit Commands for Windows
REM Run these commands to perform a basic audit of the websites

echo 🚀 Starting Quick Website Audit
echo ================================

REM Create audit directory
if not exist audit-results mkdir audit-results
cd audit-results

REM Function to test a URL
:test_url
set url=%1
echo.
echo 🔍 Testing: %url%
echo ----------------------------------------

REM Test HTTP status
echo 📊 HTTP Status:
curl -I -s "%url%" | findstr /C:"HTTP"

REM Test response time
echo ⏱️  Response Time:
curl -w "Time: %%{time_total}s\n" -o nul -s "%url%"

REM Test for common issues
echo 🔍 Common Issues Check:

REM Check for redirects
curl -I -s -L "%url%" | findstr /I "location" > nul
if %errorlevel% equ 0 (
    echo ⚠️  Redirects detected
) else (
    echo ✅ No redirects
)

REM Check for security headers
curl -I -s "%url%" | findstr /I "x-frame-options x-content-type-options x-xss-protection strict-transport-security" > nul
if %errorlevel% equ 0 (
    echo ✅ Security headers present
) else (
    echo ⚠️  Missing security headers
)

REM Check for gzip compression
curl -H "Accept-Encoding: gzip" -I -s "%url%" | findstr /I "content-encoding" > nul
if %errorlevel% equ 0 (
    echo ✅ Gzip compression enabled
) else (
    echo ⚠️  No gzip compression detected
)

goto :eof

REM Test both domains
call :test_url "https://www.petrolpricesnearme.com.au"
call :test_url "https://www.petrolpricesnearme.com"

REM Test common pages
echo.
echo 🔍 Testing Common Pages
echo ======================

REM List of common pages to test
set pages=about contact privacy terms sitemap.xml robots.txt

for %%p in (%pages%) do (
    call :test_url "https://www.petrolpricesnearme.com.au/%%p"
    call :test_url "https://www.petrolpricesnearme.com/%%p"
)

REM Generate summary report
echo.
echo 📊 Generating Summary Report
echo ============================

(
echo Website Audit Summary
echo ====================
echo Date: %date% %time%
echo Auditor: Quick Audit Script
echo.
echo Domains Tested:
echo - https://www.petrolpricesnearme.com.au
echo - https://www.petrolpricesnearme.com
echo.
echo Common Pages Tested:
echo - /
echo - /about
echo - /contact
echo - /privacy
echo - /terms
echo - /sitemap.xml
echo - /robots.txt
echo.
echo Notes:
echo - Check the output above for specific issues
echo - Look for 404 errors, redirects, and missing security headers
echo - Test manually in browser for visual issues
echo - Use Google Lighthouse for detailed performance analysis
echo.
echo Next Steps:
echo 1. Run Google Lighthouse on both domains
echo 2. Check for broken links using Screaming Frog
echo 3. Test mobile responsiveness
echo 4. Verify SEO elements ^(titles, meta descriptions, etc.^)
) > audit-summary.txt

echo ✅ Quick audit completed!
echo 📄 Summary saved to: audit-results\audit-summary.txt
echo.
echo 🔧 For detailed analysis, run:
echo    - Google Lighthouse in Chrome DevTools
echo    - GTmetrix.com for performance analysis
echo    - Screaming Frog SEO Spider for comprehensive crawling

pause
