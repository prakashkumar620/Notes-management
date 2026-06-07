docker ps | findstr jenkins# Jenkins Installation and Configuration Script

#!/bin/bash

echo "================================================"
echo "Jenkins Setup for Prakash Study Stack"
echo "================================================"

# Variables
JENKINS_PORT=8080
JENKINS_USER=admin
JENKINS_PASSWORD=admin123

# Check if Jenkins is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is required. Installing..."
    sudo apt-get update
    sudo apt-get install -y openjdk-11-jdk
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required. Installing..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
fi

echo "✓ Prerequisites checked"

# Create Jenkins network
docker network create jenkins-network 2>/dev/null || echo "Network already exists"

# Run Jenkins container
echo "Starting Jenkins..."
docker run --name jenkins \
    -d \
    -p ${JENKINS_PORT}:8080 \
    -p 50000:50000 \
    -v jenkins_home:/var/jenkins_home \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --network jenkins-network \
    jenkins/jenkins:lts-jdk11

echo "✓ Jenkins started on port ${JENKINS_PORT}"
echo ""
echo "Access Jenkins at: http://localhost:${JENKINS_PORT}"
echo ""
echo "To get the initial admin password:"
echo "  docker logs jenkins | grep -i password"
echo ""
echo "Configuration:"
echo "  1. Install recommended plugins"
echo "  2. Create admin user"
echo "  3. Configure GitHub credentials"
echo "  4. Create new pipeline job"
echo "  5. Connect to Jenkinsfile from repository"
