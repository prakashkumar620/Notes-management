#!/bin/bash

# SonarQube Setup Script

echo "================================================"
echo "SonarQube Setup for Code Quality Analysis"
echo "================================================"

SONAR_PORT=9000
NETWORK=jenkins-network

# Create network if not exists
docker network create ${NETWORK} 2>/dev/null || echo "Network already exists"

echo "Starting SonarQube Community Edition..."

docker run --name sonarqube \
    -d \
    -p ${SONAR_PORT}:9000 \
    -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLED=true \
    -v sonarqube_data:/opt/sonardata \
    -v sonarqube_logs:/opt/sonarqubeext/logs \
    -v sonarqube_plugins:/opt/sonarqube/extensions/plugins \
    --network ${NETWORK} \
    sonarqube:community

echo "✓ SonarQube started on port ${SONAR_PORT}"
echo ""
echo "Access SonarQube at: http://localhost:${SONAR_PORT}"
echo "Default credentials:"
echo "  Username: admin"
echo "  Password: admin"
echo ""
echo "To analyze code:"
echo "  1. Create project in SonarQube"
echo "  2. Generate token"
echo "  3. Run: sonar-scanner \\
           -Dsonar.projectKey=notes-management \\
           -Dsonar.sources=src \\
           -Dsonar.host.url=http://localhost:9000 \\
           -Dsonar.login=TOKEN_HERE"
