#!/bin/bash

# Nexus Repository Manager Setup Script

echo "================================================"
echo "Nexus Repository Manager Setup"
echo "================================================"

NEXUS_PORT=8081
NETWORK=jenkins-network

# Create network if not exists
docker network create ${NETWORK} 2>/dev/null || echo "Network already exists"

echo "Starting Nexus Repository Manager..."

docker run --name nexus3 \
    -d \
    -p ${NEXUS_PORT}:8081 \
    -v nexus_data:/nexus-data \
    --network ${NETWORK} \
    sonatype/nexus3:latest

echo "✓ Nexus started on port ${NEXUS_PORT}"
echo ""
echo "Access Nexus at: http://localhost:${NEXUS_PORT}"
echo "Default credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo "⏳ Note: Nexus takes 2-3 minutes to start fully"
echo ""
echo "Configuration:"
echo "  1. Login to Nexus"
echo "  2. Create npm repository (npm-internal)"
echo "  3. Create Docker repositories for images"
echo "  4. Configure authentication in npm: npm config set registry http://localhost:8081/repository/npm-internal/"
