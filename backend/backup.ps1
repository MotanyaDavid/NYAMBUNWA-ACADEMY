Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Nyambunwa Academy - Database Backup" -ForegroundColor Yellow
Write-Host "  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "C:\NYAMBUNWA ACADEMY\backend"
python backup.py

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan