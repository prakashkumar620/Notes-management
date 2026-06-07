#!/bin/bash

# ============================================================
# CI/CD Audit Logger
# Tracks CI/CD changes with name, timestamp, and details
# Usage: ./audit-logger.sh "component" "change_type" "description" "author"
# ============================================================

set -e

# Configuration
AUDIT_LOG_DIR="./audit-logs"
AUDIT_LOG_FILE="${AUDIT_LOG_DIR}/ci-cd-audit.log"
DEPLOYMENT_LOG="${AUDIT_LOG_DIR}/deployments.log"
CHANGE_LOG="${AUDIT_LOG_DIR}/changes.log"

# Ensure audit log directory exists
mkdir -p "${AUDIT_LOG_DIR}"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================
# Function to log changes
# ============================================================
log_change() {
    local component=$1
    local change_type=$2
    local description=$3
    local author=$4
    local timestamp=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
    local log_entry="${timestamp} | ${component} | ${change_type} | ${author} | ${description}"
    
    # Log to main audit file
    echo "${log_entry}" >> "${AUDIT_LOG_FILE}"
    
    # Log to changes file with more detail
    echo "" >> "${CHANGE_LOG}"
    echo "========================================" >> "${CHANGE_LOG}"
    echo "Timestamp: ${timestamp}" >> "${CHANGE_LOG}"
    echo "Author: ${author}" >> "${CHANGE_LOG}"
    echo "Component: ${component}" >> "${CHANGE_LOG}"
    echo "Type: ${change_type}" >> "${CHANGE_LOG}"
    echo "Description: ${description}" >> "${CHANGE_LOG}"
    echo "Hostname: $(hostname)" >> "${CHANGE_LOG}"
    echo "User: $(whoami)" >> "${CHANGE_LOG}"
    echo "========================================" >> "${CHANGE_LOG}"
    
    # Display to console
    printf "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} "
    printf "${GREEN}✓${NC} "
    echo "Audit logged: ${component} - ${change_type}"
}

# ============================================================
# Function to log deployment
# ============================================================
log_deployment() {
    local app_name=$1
    local version=$2
    local environment=$3
    local author=$4
    local status=$5
    local build_number=${6:-"N/A"}
    
    local timestamp=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
    local deployment_entry="${timestamp} | ${app_name} | ${version} | ${environment} | ${author} | ${status} | Build#${build_number}"
    
    echo "${deployment_entry}" >> "${DEPLOYMENT_LOG}"
    
    printf "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} "
    printf "${GREEN}✓${NC} "
    echo "Deployment logged: ${app_name}:${version} to ${environment}"
}

# ============================================================
# Function to generate audit report
# ============================================================
generate_audit_report() {
    local output_file="${AUDIT_LOG_DIR}/audit-report-$(date +%Y%m%d-%H%M%S).txt"
    
    echo "CI/CD Audit Report" > "${output_file}"
    echo "==================" >> "${output_file}"
    echo "Generated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")" >> "${output_file}"
    echo "" >> "${output_file}"
    
    echo "Recent Changes (Last 20):" >> "${output_file}"
    tail -20 "${AUDIT_LOG_FILE}" >> "${output_file}"
    
    echo "" >> "${output_file}"
    echo "Recent Deployments (Last 20):" >> "${output_file}"
    tail -20 "${DEPLOYMENT_LOG}" >> "${output_file}"
    
    printf "${GREEN}✓${NC} Audit report generated: ${output_file}\n"
    return 0
}

# ============================================================
# Function to get change statistics
# ============================================================
get_statistics() {
    echo ""
    echo "CI/CD Audit Statistics"
    echo "====================="
    echo ""
    
    if [ -f "${AUDIT_LOG_FILE}" ]; then
        echo "Total changes logged: $(wc -l < ${AUDIT_LOG_FILE})"
        echo ""
        echo "Changes by component:"
        cut -d'|' -f2 "${AUDIT_LOG_FILE}" | sort | uniq -c
        echo ""
        echo "Changes by type:"
        cut -d'|' -f3 "${AUDIT_LOG_FILE}" | sort | uniq -c
        echo ""
        echo "Changes by author:"
        cut -d'|' -f4 "${AUDIT_LOG_FILE}" | sort | uniq -c
    else
        echo "No audit logs found yet."
    fi
}

# ============================================================
# Function to display help
# ============================================================
show_help() {
    cat << EOF
CI/CD Audit Logger

USAGE:
    ./audit-logger.sh [COMMAND] [OPTIONS]

COMMANDS:
    log-change <component> <type> <description> <author>
        Log a CI/CD change
        Example: ./audit-logger.sh log-change Jenkins Configuration "Updated pipeline" "john.doe"
    
    log-deployment <app> <version> <environment> <author> <status> [build#]
        Log a deployment
        Example: ./audit-logger.sh log-deployment backend v1.2.3 production john.doe success 42
    
    report
        Generate audit report
        Example: ./audit-logger.sh report
    
    stats
        Display audit statistics
        Example: ./audit-logger.sh stats
    
    view
        View recent audit logs
        Example: ./audit-logger.sh view
    
    help
        Show this help message

VALID CHANGE TYPES:
    - Configuration
    - Deployment
    - Fix
    - Enhancement
    - Security
    - Infrastructure
    - Rollback

LOG FILES:
    ${AUDIT_LOG_FILE}     - Main audit log
    ${DEPLOYMENT_LOG}  - Deployment-specific log
    ${CHANGE_LOG}     - Detailed change log
EOF
}

# ============================================================
# Main Script Logic
# ============================================================
case "${1}" in
    log-change)
        if [ $# -lt 5 ]; then
            echo "Error: Missing arguments"
            show_help
            exit 1
        fi
        log_change "$2" "$3" "$4" "$5"
        ;;
    log-deployment)
        if [ $# -lt 6 ]; then
            echo "Error: Missing arguments"
            show_help
            exit 1
        fi
        log_deployment "$2" "$3" "$4" "$5" "$6" "${7:-N/A}"
        ;;
    report)
        generate_audit_report
        ;;
    stats)
        get_statistics
        ;;
    view)
        echo "Recent Audit Logs:"
        echo "=================="
        if [ -f "${AUDIT_LOG_FILE}" ]; then
            tail -20 "${AUDIT_LOG_FILE}"
        else
            echo "No audit logs found."
        fi
        ;;
    help|-h|--help)
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac

exit 0
