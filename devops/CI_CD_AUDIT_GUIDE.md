# CI/CD Change Tracking & Audit Guide

## Overview

This guide explains how to track all CI/CD changes with name, timestamp, and detailed metadata for compliance, debugging, and audit purposes.

## Components

### 1. **CI/CD Changelog** (`CI_CD_CHANGELOG.md`)
- High-level tracking of all CI/CD modifications
- Contains change history, deployment records, and infrastructure changes
- Manual entries for significant changes

### 2. **Audit Logger Script** (`jenkins/audit-logger.sh`)
- Automated change logging with timestamp and author
- Supports multiple change types: Configuration, Deployment, Fix, Enhancement, Security, Infrastructure, Rollback
- Generates audit reports and statistics

### 3. **Enhanced Jenkinsfile** (`jenkins/Jenkinsfile-with-audit`)
- Automatic logging of every pipeline stage
- Captures build timestamp, author (from git commit), and build number
- Creates detailed build reports with audit trail
- Logs deployment information

### 4. **Audit Logs Directory** (`jenkins/audit-logs/`)
- `ci-cd-audit.log` - Main audit log (all changes timestamped)
- `deployments.log` - Deployment-specific records
- `changes.log` - Detailed change descriptions
- `audit-report-[timestamp].txt` - Generated audit reports

## Quick Start

### Setup Audit Logging

```bash
# Navigate to Jenkins directory
cd devops/jenkins

# Make audit logger executable
chmod +x audit-logger.sh

# Log a manual change
./audit-logger.sh log-change Jenkins Enhancement "Updated pipeline configuration" "john.doe"

# Log a deployment
./audit-logger.sh log-deployment backend v1.2.3 production john.doe success 42

# Generate audit report
./audit-logger.sh report

# View statistics
./audit-logger.sh stats
```

### Replace Current Jenkinsfile

```bash
# Backup current Jenkinsfile
cp devops/jenkins/Jenkinsfile devops/jenkins/Jenkinsfile.backup

# Use new version with audit logging
cp devops/jenkins/Jenkinsfile-with-audit devops/jenkins/Jenkinsfile
```

## Change Tracking Workflow

### When Making Configuration Changes

```bash
# 1. Make your change in Jenkins UI or configuration file
# 2. Export/backup the configuration
# 3. Log the change
./audit-logger.sh log-change Jenkins Configuration "Added new build parameter: ENVIRONMENT" "john.doe"

# 4. Update CI_CD_CHANGELOG.md with details
```

### When Deploying

```bash
# The Jenkinsfile automatically logs:
# - Pipeline start with author
# - Each stage execution
# - Deployment completion with timestamp
# - Build artifacts and reports

# For manual deployments, use:
./audit-logger.sh log-deployment backend v1.2.3 production john.doe success 42
```

### When Modifying Infrastructure

```bash
# Log infrastructure changes
./audit-logger.sh log-change Terraform Enhancement "Added monitoring alerts for CPU usage" "jane.smith"

# Log Kubernetes changes  
./audit-logger.sh log-change Kubernetes Configuration "Updated resource limits" "jane.smith"

# Log Docker changes
./audit-logger.sh log-change Docker Security "Updated base image to latest patch" "jane.smith"
```

## Audit Log Format

### Main Audit Log Entry
```
2026-05-29 14:30:00 UTC | Jenkins | Configuration | john.doe | Updated pipeline configuration
```

### Deployment Log Entry
```
2026-05-29 14:30:00 UTC | backend | v1.2.3 | production | john.doe | success | Build#42
```

### Detailed Change Log
```
========================================
Timestamp: 2026-05-29 14:30:00 UTC
Author: john.doe
Component: Jenkins
Type: Configuration
Description: Updated pipeline configuration
Hostname: jenkins-server-01
User: jenkins
========================================
```

## Viewing & Accessing Logs

### View Recent Changes
```bash
./audit-logger.sh view
```

### View Statistics
```bash
./audit-logger.sh stats
```

### Generate Report
```bash
./audit-logger.sh report
# Creates: audit-report-[timestamp].txt
```

### Jenkins Build Reports
- Located in: `devops/jenkins/reports/`
- Format: `build-[BUILD_NUMBER]-[TIMESTAMP].log`
- Contains: Build metadata, author, timestamp, Docker images

## Change Tracking Examples

### Example 1: Jenkins Pipeline Update
```
Date: 2026-05-29 14:30:00 UTC
Author: john.doe
Component: Jenkins
Type: Enhancement
Change: Added SonarQube integration to pipeline
Impact: All future builds will run code quality analysis
Status: Completed

Audit Entry:
./audit-logger.sh log-change Jenkins Enhancement "Added SonarQube integration to pipeline" "john.doe"
```

### Example 2: Deployment to Production
```
Date: 2026-05-29 15:45:00 UTC
Author: jane.smith
Component: Docker Compose
Type: Deployment
Change: Deployed backend v1.2.3 to production
Impact: Users now see new features
Status: Completed

Audit Entry (automatic from Jenkinsfile):
Pipeline logs automatically with:
BUILD_TIMESTAMP: 2026-05-29 15:45:00 UTC
BUILD_AUTHOR: jane.smith
BUILD_NUMBER: 42
```

### Example 3: Infrastructure Change
```
Date: 2026-05-29 16:20:00 UTC
Author: DevOps Team
Component: Terraform
Type: Configuration
Change: Updated EC2 instance type from t2.micro to t2.small
Impact: Improved performance, increased cost
Status: Completed

Audit Entry:
./audit-logger.sh log-change Terraform Configuration "Updated EC2 instance type from t2.micro to t2.small" "devops-team"
```

## Integration with Jenkinsfile

The enhanced Jenkinsfile automatically logs:

1. **Pipeline Start**
   - Timestamp and build author
   - Build number
   
2. **Each Stage Execution**
   - Stage name
   - Timestamp
   - Build number
   
3. **Build Success/Failure**
   - Final status with timestamp
   - Author information
   - Build number

4. **Reports Generation**
   - Audit logs copied to `reports/` directory
   - Build reports with full metadata
   - Timestamped filenames

## Audit Trail Example

```
2026-05-29 14:30:00 UTC | Pipeline Start | BUILD#42 | Author: john.doe
2026-05-29 14:30:15 UTC | Code Checkout | Commit: a1b2c3d
2026-05-29 14:30:45 UTC | Backend Build Start | BUILD#42
2026-05-29 14:32:10 UTC | Backend Build Success | BUILD#42
2026-05-29 14:32:20 UTC | Frontend Build Start | BUILD#42
2026-05-29 14:34:50 UTC | Frontend Build Success | BUILD#42
2026-05-29 14:35:10 UTC | SonarQube Analysis | BUILD#42
2026-05-29 14:36:00 UTC | Docker Build Start | BUILD#42 | Author: john.doe
2026-05-29 14:37:30 UTC | Docker Build Success | BUILD#42
2026-05-29 14:37:40 UTC | Registry Push Start | BUILD#42
2026-05-29 14:38:00 UTC | Registry Push Success | BUILD#42
2026-05-29 14:38:10 UTC | Deployment Start | BUILD#42 | Environment: Docker Compose | Author: john.doe
2026-05-29 14:38:50 UTC | Deployment Success | BUILD#42
2026-05-29 14:39:00 UTC | Health Checks Completed | BUILD#42
2026-05-29 14:39:20 UTC | Reports Generated | BUILD#42
2026-05-29 14:39:25 UTC | Pipeline Success | BUILD#42 | Author: john.doe
2026-05-29 14:39:30 UTC | Cleanup Completed | BUILD#42
============================================
```

## Compliance & Audit Requirements

### Log Retention
- **Duration**: 1 year minimum
- **Location**: `devops/archives/ci-cd-logs/`
- **Backup**: Weekly automated backups
- **Format**: Gzip compressed with timestamp

### Required Information Per Change
- ✅ Timestamp (ISO 8601 UTC)
- ✅ Author/Person making change
- ✅ Component affected
- ✅ Type of change
- ✅ Description of change
- ✅ Impact assessment
- ✅ Status (Completed/In Progress/Rolled Back)

### Audit Report Generation
```bash
# Monthly audit report
./audit-logger.sh report > audit-reports/monthly-$(date +%Y-%m).txt

# Compliance check
grep -E "Rollback|Failure|Security" devops/jenkins/audit-logs/ci-cd-audit.log
```

## Best Practices

1. **Always Log Changes**
   - Use the audit logger for all changes
   - Include clear descriptions
   - Reference ticket numbers when applicable

2. **Update Changelog Regularly**
   - Monthly summaries in `CI_CD_CHANGELOG.md`
   - Include impact assessments
   - Document rollback procedures

3. **Review Audit Logs**
   - Weekly review of deployments
   - Monthly compliance check
   - Quarterly trend analysis

4. **Backup Audit Logs**
   - Daily backup of audit logs
   - Archive old logs monthly
   - Store backups in secure location

5. **Name Consistency**
   - Use full name or username consistently
   - Document team member abbreviations
   - Keep mapping up-to-date

## Troubleshooting

### Logs Not Being Generated
```bash
# Check directory permissions
ls -la devops/jenkins/audit-logs/

# Create directory if missing
mkdir -p devops/jenkins/audit-logs

# Check audit-logger.sh permissions
chmod +x devops/jenkins/audit-logger.sh
```

### Build Author Not Captured
```bash
# Ensure git is configured
git config user.name "Your Name"
git config user.email "your.email@company.com"

# Test git log command
git log -1 --format=%an
```

### Permission Denied When Logging
```bash
# Make sure audit logger is executable
chmod +x devops/jenkins/audit-logger.sh

# Check Jenkins user permissions on log directory
sudo chown -R jenkins:jenkins devops/jenkins/audit-logs/
```

## Support & References

- **Audit Logger**: `devops/jenkins/audit-logger.sh`
- **Enhanced Jenkinsfile**: `devops/jenkins/Jenkinsfile-with-audit`
- **Changelog Template**: `CI_CD_CHANGELOG.md`
- **Audit Logs**: `devops/jenkins/audit-logs/`

---

**Version**: 1.0  
**Last Updated**: 2026-05-29  
**Status**: Active
