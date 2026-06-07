# CI/CD Audit Logger - Windows PowerShell Guide

## Quick Start (Windows)

Since you're on Windows, use the PowerShell version of the audit logger instead of the bash script.

### Basic Commands

```powershell
# Navigate to Jenkins directory
cd devops/jenkins

# Log a CI/CD change
powershell -ExecutionPolicy Bypass -File .\audit-logger.ps1 log-change Jenkins Configuration "Updated pipeline settings" "john.doe"

# Log a deployment
powershell -ExecutionPolicy Bypass -File .\audit-logger.ps1 log-deployment backend v1.0.0 production john.doe success 42

# View recent logs
powershell -ExecutionPolicy Bypass -File .\audit-logger.ps1 view

# Display statistics
powershell -ExecutionPolicy Bypass -File .\audit-logger.ps1 stats

# Generate audit report
powershell -ExecutionPolicy Bypass -File .\audit-logger.ps1 report

# Show help
powershell -ExecutionPolicy Bypass -File .\audit-logger.ps1 help
```

## Simplifying Commands

### Option 1: Create a Batch File Shortcut

Create `audit.bat` in the same directory:

```batch
@echo off
powershell -ExecutionPolicy Bypass -File .\audit-logger.ps1 %*
```

Then use:
```powershell
.\audit.bat log-change Jenkins Configuration "Updated pipeline" "john.doe"
.\audit.bat log-deployment backend v1.0.0 production john.doe success 42
```

### Option 2: Create a PowerShell Function

Add to your PowerShell profile (`$PROFILE`):

```powershell
function audit {
    $auditPath = "D:\studystack1\prakash-study-stack\devops\jenkins\audit-logger.ps1"
    powershell -ExecutionPolicy Bypass -File $auditPath @args
}
```

Then use:
```powershell
audit log-change Jenkins Configuration "Updated pipeline" "john.doe"
audit log-deployment backend v1.0.0 production john.doe success 42
audit stats
```

## Log Locations

All logs are stored in:
```
devops/jenkins/audit-logs/
├── ci-cd-audit.log          # Main audit log (quick format)
├── deployments.log           # Deployment-specific records
├── changes.log               # Detailed change descriptions
└── audit-report-*.txt        # Generated audit reports
```

## Log Entry Examples

### Audit Log Entry (ci-cd-audit.log)
```
2026-05-29 13:13:39 UTC|Docker|Security|devops-team|Updated base image to latest version
```

### Deployment Log Entry (deployments.log)
```
2026-05-29 13:13:51 UTC | frontend | v1.0.5 | staging | devops-team | success | Build#15
```

### Change Log Entry (changes.log)
```
========================================
Timestamp: 2026-05-29 13:13:39 UTC
Author: devops-team
Component: Docker
Type: Security
Description: Updated base image to latest version
Hostname: DEV-LAPTOP
User: devops
========================================
```

## Integration with Jenkins

To use the audit logger in your Jenkins pipeline, add PowerShell steps:

```groovy
stage('Audit: Pipeline Start') {
    steps {
        powershell '''
            $auditScript = "./devops/jenkins/audit-logger.ps1"
            & powershell -ExecutionPolicy Bypass -File $auditScript log-change Jenkins Pipeline "Pipeline started" "jenkins-user"
        '''
    }
}

stage('Deploy') {
    steps {
        // Your deployment commands here
        
        powershell '''
            $auditScript = "./devops/jenkins/audit-logger.ps1"
            & powershell -ExecutionPolicy Bypass -File $auditScript log-deployment backend v1.0.0 production jenkins success ${BUILD_NUMBER}
        '''
    }
}
```

## Accessing Logs

### View Recent Logs
```powershell
Get-Content .\audit-logs\ci-cd-audit.log | Select-Object -Last 20
```

### Filter by Component
```powershell
Get-Content .\audit-logs\ci-cd-audit.log | Where-Object { $_ -match "Docker" }
```

### Filter by Author
```powershell
Get-Content .\audit-logs\ci-cd-audit.log | Where-Object { $_ -match "john.doe" }
```

### Search in Deployment Log
```powershell
Get-Content .\audit-logs\deployments.log | Where-Object { $_ -match "production" }
```

## Windows Execution Policy

If you encounter execution policy errors, you can:

1. **Bypass (Temporary)**
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\audit-logger.ps1 view
   ```

2. **Set for Current User**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Set for Process Only**
   ```powershell
   $ExecutionContext.SessionState.LanguageMode = 'ConstrainedLanguage'
   ```

## Troubleshooting

### Issue: "File not found" error

**Solution**: Make sure you're in the correct directory
```powershell
cd D:\studystack1\prakash-study-stack\devops\jenkins
```

### Issue: Special characters not displaying correctly

**Solution**: The script uses ASCII characters ([OK], [ERROR], [INFO]) instead of Unicode for Windows compatibility. This is normal.

### Issue: Logs not being created

**Solution**: Check directory permissions
```powershell
Test-Path .\audit-logs
ls .\audit-logs
```

If directory doesn't exist, create it:
```powershell
New-Item -ItemType Directory -Path .\audit-logs -Force
```

## Files

- **PowerShell Script**: `devops/jenkins/audit-logger.ps1`
- **Bash Script** (Linux/Mac): `devops/jenkins/audit-logger.sh`
- **Changelog**: `CI_CD_CHANGELOG.md`
- **Guide**: `CI_CD_AUDIT_GUIDE.md`
- **Enhanced Jenkinsfile**: `devops/jenkins/Jenkinsfile-with-audit`

---

**Version**: 1.0 (Windows)  
**Last Updated**: 2026-05-29  
**Status**: Ready to Use
