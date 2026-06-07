# ============================================================
# CI/CD Audit Logger - PowerShell Version for Windows
# Tracks CI/CD changes with name, timestamp, and details
# ============================================================

param(
    [Parameter(Position=0)]
    [string]$Command = "",
    [Parameter(Position=1)]
    [string]$Param1 = "",
    [Parameter(Position=2)]
    [string]$Param2 = "",
    [Parameter(Position=3)]
    [string]$Param3 = "",
    [Parameter(Position=4)]
    [string]$Param4 = "",
    [Parameter(Position=5)]
    [string]$Param5 = "",
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Remaining
)

# Configuration
$AUDIT_LOG_DIR = "$(Get-Location)\audit-logs"
$AUDIT_LOG_FILE = "$AUDIT_LOG_DIR\ci-cd-audit.log"
$DEPLOYMENT_LOG = "$AUDIT_LOG_DIR\deployments.log"
$CHANGE_LOG = "$AUDIT_LOG_DIR\changes.log"

# Ensure audit log directory exists
if (-not (Test-Path $AUDIT_LOG_DIR)) {
    New-Item -ItemType Directory -Path $AUDIT_LOG_DIR -Force | Out-Null
}

# ============================================================
# Logging Functions
# ============================================================

function Log-Change {
    param([string]$Component, [string]$ChangeType, [string]$Description, [string]$Author)
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss UTC"
    $logEntry = "$timestamp`|$Component`|$ChangeType`|$Author`|$Description"
    
    Add-Content -Path $AUDIT_LOG_FILE -Value $logEntry -Encoding UTF8
    
    $detailedEntry = @"
========================================
Timestamp: $timestamp
Author: $Author
Component: $Component
Type: $ChangeType
Description: $Description
Hostname: $env:COMPUTERNAME
User: $env:USERNAME
========================================
"@
    Add-Content -Path $CHANGE_LOG -Value $detailedEntry -Encoding UTF8
    
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] [OK] Audit logged: $Component - $ChangeType" -ForegroundColor Green
}

function Log-Deployment {
    param([string]$AppName, [string]$Version, [string]$Environment, [string]$Author, [string]$Status, [string]$BuildNumber)
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss UTC"
    $deploymentEntry = "$timestamp`|$AppName`|$Version`|$Environment`|$Author`|$Status`|Build#$BuildNumber"
    
    Add-Content -Path $DEPLOYMENT_LOG -Value $deploymentEntry -Encoding UTF8
    
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] [OK] Deployment logged: ${AppName}:${Version} to $Environment" -ForegroundColor Green
}

function Generate-AuditReport {
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $outputFile = "$AUDIT_LOG_DIR\audit-report-$timestamp.txt"
    
    $report = @"
CI/CD Audit Report
==================
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss UTC')

Recent Changes (Last 20):
"@
    
    Add-Content -Path $outputFile -Value $report -Encoding UTF8
    
    if (Test-Path $AUDIT_LOG_FILE) {
        $content = Get-Content $AUDIT_LOG_FILE | Select-Object -Last 20
        Add-Content -Path $outputFile -Value $content -Encoding UTF8
    }
    
    Add-Content -Path $outputFile -Value "`nRecent Deployments (Last 20):" -Encoding UTF8
    
    if (Test-Path $DEPLOYMENT_LOG) {
        $deployments = Get-Content $DEPLOYMENT_LOG | Select-Object -Last 20
        Add-Content -Path $outputFile -Value $deployments -Encoding UTF8
    }
    
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] [OK] Audit report generated: $outputFile" -ForegroundColor Green
}

function Get-AuditStats {
    Write-Host "`nCI/CD Audit Statistics" -ForegroundColor Yellow -BackgroundColor DarkGray
    
    if (-not (Test-Path $AUDIT_LOG_FILE)) {
        Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] [INFO] No audit logs found yet." -ForegroundColor Cyan
        return
    }
    
    $content = @(Get-Content $AUDIT_LOG_FILE)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] [INFO] Total changes logged: $($content.Count)" -ForegroundColor Cyan
    
    Write-Host "`nChanges by component:" -ForegroundColor Yellow
    $content | ForEach-Object { $_.Split('|')[1].Trim() } | Group-Object | ForEach-Object { Write-Host "  $($_.Count) $($_.Name)" }
    
    Write-Host "`nChanges by type:" -ForegroundColor Yellow
    $content | ForEach-Object { $_.Split('|')[2].Trim() } | Group-Object | ForEach-Object { Write-Host "  $($_.Count) $($_.Name)" }
    
    Write-Host "`nChanges by author:" -ForegroundColor Yellow
    $content | ForEach-Object { $_.Split('|')[3].Trim() } | Group-Object | ForEach-Object { Write-Host "  $($_.Count) $($_.Name)" }
}

function Show-Help {
    Write-Host "CI/CD Audit Logger - PowerShell Version"
    Write-Host ""
    Write-Host "USAGE:"
    Write-Host "    audit-logger.ps1 [COMMAND] [OPTIONS]"
    Write-Host ""
    Write-Host "COMMANDS:"
    Write-Host "    log-change [component] [type] [description] [author]"
    Write-Host "        Log a CI/CD change"
    Write-Host "        Example: audit-logger.ps1 log-change Jenkins Configuration ""Updated pipeline"" ""john.doe"""
    Write-Host ""
    Write-Host "    log-deployment [app] [version] [environment] [author] [status] [build#]"
    Write-Host "        Log a deployment"
    Write-Host "        Example: audit-logger.ps1 log-deployment backend v1.2.3 production john.doe success 42"
    Write-Host ""
    Write-Host "    report        Generate audit report"
    Write-Host "    stats         Display audit statistics"
    Write-Host "    view          View recent audit logs"
    Write-Host "    help          Show this help message"
    Write-Host ""
    Write-Host "VALID CHANGE TYPES:"
    Write-Host "    Configuration, Deployment, Fix, Enhancement, Security, Infrastructure, Rollback"
    Write-Host ""
    Write-Host "LOG FILES:"
    Write-Host "    $AUDIT_LOG_FILE"
    Write-Host "    $DEPLOYMENT_LOG"
    Write-Host "    $CHANGE_LOG"
}

# ============================================================
# Main Script Logic
# ============================================================

switch ($Command.ToLower()) {
    "log-change" {
        # Parameters: component, type, description, author
        if ([string]::IsNullOrWhiteSpace($Param1) -or [string]::IsNullOrWhiteSpace($Param2) -or 
            [string]::IsNullOrWhiteSpace($Param3) -or [string]::IsNullOrWhiteSpace($Param4)) {
            Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] X Missing arguments for log-change" -ForegroundColor Red
            Show-Help
            exit 1
        }
        Log-Change -Component $Param1 -ChangeType $Param2 -Description $Param3 -Author $Param4
    }
    
    "log-deployment" {
        # Parameters: app, version, environment, author, status, [build#]
        if ([string]::IsNullOrWhiteSpace($Param1) -or [string]::IsNullOrWhiteSpace($Param2) -or 
            [string]::IsNullOrWhiteSpace($Param3) -or [string]::IsNullOrWhiteSpace($Param4) -or 
            [string]::IsNullOrWhiteSpace($Param5)) {
            Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] X Missing arguments for log-deployment" -ForegroundColor Red
            Show-Help
            exit 1
        }
        $buildNum = if ($Remaining.Count -ge 1) { $Remaining[0] } else { "N/A" }
        Log-Deployment -AppName $Param1 -Version $Param2 -Environment $Param3 -Author $Param4 -Status $Param5 -BuildNumber $buildNum
    }
    
    "report" {
        Generate-AuditReport
    }
    
    "stats" {
        Get-AuditStats
    }
    
    "view" {
        Write-Host "`nRecent Audit Logs" -ForegroundColor Yellow -BackgroundColor DarkGray
        if (Test-Path $AUDIT_LOG_FILE) {
            Get-Content $AUDIT_LOG_FILE | Select-Object -Last 20
        } else {
            Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] [INFO] No audit logs found." -ForegroundColor Cyan
        }
    }
    
    "help" {
        Show-Help
    }
    
    default {
        if ([string]::IsNullOrWhiteSpace($Command)) {
            Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] [INFO] No command specified" -ForegroundColor Cyan
        } else {
            Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] [ERROR] Unknown command: $Command" -ForegroundColor Red
        }
        Show-Help
        exit 1
    }
}

exit 0
