# Automated Git Sync Script
# Runs git add, commit, and push every 4 minutes until 7:30 PM

$endTime = Get-Date -Hour 19 -Minute 30 -Second 0
$commitCounter = 0
$baseMessage = "hffhfh"

Write-Host "Starting automated git sync..." -ForegroundColor Green
Write-Host "Will run until: $endTime" -ForegroundColor Yellow
Write-Host "Commit interval: 4 minutes" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop manually`n" -ForegroundColor Gray

while ((Get-Date) -lt $endTime) {
    $currentTime = Get-Date -Format "HH:mm:ss"
    $commitCounter++

    # Build commit message with incremental characters
    $extraChars = "x" * $commitCounter
    $commitMessage = "$baseMessage$extraChars"

    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "[$currentTime] Sync #$commitCounter" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan

    try {
        # Git add
        Write-Host "`nAdding files..." -ForegroundColor Blue
        git add . 2>&1 | Out-Null

        # Check if there are changes to commit
        $status = git status --porcelain

        if ($status) {
            Write-Host "Files staged successfully" -ForegroundColor Green

            # Git commit
            Write-Host "Committing: $commitMessage" -ForegroundColor Blue
            git commit -m $commitMessage 2>&1 | Out-Null
            Write-Host "Commit successful" -ForegroundColor Green

            # Git push
            Write-Host "Pushing to origin main..." -ForegroundColor Blue
            git push origin main 2>&1 | Out-Null
            Write-Host "Push successful" -ForegroundColor Green
        } else {
            Write-Host "No changes to commit" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "Error occurred: $_" -ForegroundColor Red
        Write-Host "Continuing anyway..." -ForegroundColor Yellow
    }

    # Calculate time until next run
    $nextRun = (Get-Date).AddMinutes(4)
    if ($nextRun -gt $endTime) {
        Write-Host "`nNext run would be after 7:30 PM. Stopping." -ForegroundColor Green
        break
    }

    Write-Host "`nNext sync at: $($nextRun.ToString('HH:mm:ss'))" -ForegroundColor Gray
    Write-Host "Waiting 4 minutes..." -ForegroundColor Gray

    # Sleep for 4 minutes (240 seconds)
    Start-Sleep -Seconds 240
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Automated git sync completed!" -ForegroundColor Green
Write-Host "Total syncs: $commitCounter" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
