# DevOps Complete Workflow Guide

## End-to-End Workflow

### Phase 1: Local Development Setup (Day 1)

**Time: 2-3 hours**

```bash
# 1. Clone and navigate to project
git clone <repo-url>
cd notes-management-system

# 2. Setup Google OAuth
# Get credentials from: https://console.cloud.google.com
# Configure Redirect URIs:
#   - http://localhost:5000/api/auth/google/callback
#   - http://localhost:3000

# 3. Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit .env files with actual credentials:
# backend/.env
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret

# frontend/.env
REACT_APP_GOOGLE_CLIENT_ID=your_id

# 4. Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 5. Start services
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm start

# Terminal 3: MongoDB (use Docker or local)
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo

# 6. Test application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017
```

### Phase 2: Docker Containerization (Day 1-2)

**Time: 3-4 hours**

```bash
# 1. Build Docker images
cd devops/docker

# Build backend
docker build -f Dockerfile.backend -t notes-backend:latest ../../backend

# Build frontend
docker build -f Dockerfile.frontend -t notes-frontend:latest ../../frontend

# 2. Test individual containers
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/notes-management \
  notes-backend:latest

docker run -p 3000:80 notes-frontend:latest

# 3. Setup Docker Compose
# Configure environment variables
export GOOGLE_CLIENT_ID="your_id"
export GOOGLE_CLIENT_SECRET="your_secret"

# Start complete stack
docker-compose up -d

# 4. Verify services
docker-compose ps
docker-compose logs -f

# 5. Test end-to-end
# Access: http://localhost:3000
# Verify login flow, file upload, download
```

### Phase 3: Kubernetes Setup (Day 2-3)

**Time: 4-5 hours**

```bash
# 1. Start Minikube
minikube start --cpus=4 --memory=8192

# 2. Configure Docker context
eval $(minikube docker-env)

# 3. Build images in Minikube context
docker build -f devops/docker/Dockerfile.backend -t notes-backend:latest backend/
docker build -f devops/docker/Dockerfile.frontend -t notes-frontend:latest frontend/

# 4. Deploy to Kubernetes
bash devops/kubernetes/deploy.sh

# OR manually
kubectl apply -f devops/kubernetes/mongodb-deployment.yaml
kubectl apply -f devops/kubernetes/backend-deployment.yaml
kubectl apply -f devops/kubernetes/frontend-deployment.yaml

# 5. Verify deployment
kubectl get pods -n notes-management
kubectl get svc -n notes-management

# 6. Port forward to test
kubectl port-forward -n notes-management svc/frontend 3000:80
kubectl port-forward -n notes-management svc/backend 5000:5000

# 7. Check scaling
kubectl get hpa -n notes-management
kubectl top pods -n notes-management
```

### Phase 4: CI/CD Pipeline Setup (Day 3-4)

**Time: 3-4 hours**

```bash
# 1. Start Jenkins
bash devops/jenkins/jenkins-setup.sh

# 2. Access Jenkins
# URL: http://localhost:8080
# Get password: docker logs jenkins | grep -i password
# Setup: Recommended plugins + GitHub credentials

# 3. Create pipeline job
# Job Type: Pipeline
# Pipeline from SCM: Git
# Repository: <your-repo-url>
# Branch: */main
# Script path: devops/jenkins/Jenkinsfile

# 4. Trigger first build
# Push code to main branch
git add .
git commit -m "Initial commit"
git push origin main

# Jenkins automatically triggers build

# 5. Monitor pipeline
# View stages, logs, artifacts in Jenkins UI
# Address any failures
```

### Phase 5: Code Quality Setup (Day 4)

**Time: 2-3 hours**

```bash
# 1. Start SonarQube
bash devops/jenkins/sonarqube-setup.sh

# 2. Access SonarQube
# URL: http://localhost:9000
# Login: admin / admin
# Create project: notes-management

# 3. Generate token
# Settings → Security → Users → Tokens
# Generate token for Jenkins

# 4. Add SonarQube to Jenkins
# Jenkins Settings → Configure System → SonarQube Servers
# Add server: http://localhost:9000
# Add token credentials

# 5. Verify in pipeline
# Run build, check SonarQube results
# Review code smells, bugs, vulnerabilities

# 6. Set up quality gates
# SonarQube: Quality Gates → Create gate
# Conditions: Coverage > 80%, Bugs = 0, Critical Issues = 0
```

### Phase 6: Artifact Repository Setup (Day 4)

**Time: 2 hours**

```bash
# 1. Start Nexus
bash devops/jenkins/nexus-setup.sh

# 2. Access Nexus
# URL: http://localhost:8081
# Login: admin / admin123

# 3. Create repositories
# npm-internal: Hosted npm packages
# docker-internal: Docker images
# npm-proxy: Proxy to npm registry

# 4. Configure npm in Jenkins
# Add npm registry to Jenkins credentials
# Configure .npmrc for authentication

# 5. Push artifacts
# Artifacts from build automatically pushed to Nexus
```

### Phase 7: Monitoring Setup (Day 5)

**Time: 2-3 hours**

```bash
# 1. Start monitoring stack
bash devops/monitoring/setup-monitoring.sh

# 2. Access dashboards
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001
# AlertManager: http://localhost:9093

# 3. Configure Grafana
# Add Prometheus as data source
# Import/create dashboards:
#   - API Performance Dashboard
#   - Database Metrics
#   - Container Resources
#   - Application Errors

# 4. Set up alerts
# Define alert rules in Prometheus
# Configure notification channels in AlertManager
# Test alerts with threshold violations

# 5. Create custom dashboards
# Metrics: http_request_duration, db_query_time, etc.
# Panels: Graph, Stat, Gauge, Table
```

### Phase 8: Infrastructure as Code (Day 5)

**Time: 2-3 hours**

```bash
# 1. Setup Terraform
cd devops/terraform

# Initialize Terraform
terraform init

# 2. Plan infrastructure
terraform plan -out=tfplan

# 3. Review plan output
# Check: Networks, Containers, Volumes created

# 4. Apply infrastructure
terraform apply tfplan

# 5. Verify outputs
terraform output

# 6. Test infrastructure
# Containers should be running
# Services should be accessible
```

### Phase 9: Configuration Management (Day 6)

**Time: 2 hours**

```bash
# 1. Setup Ansible
bash devops/ansible/setup.sh

# 2. Configure inventory
# Edit devops/ansible/inventory.ini
# Add target hosts/servers

# 3. Run playbooks
ansible-playbook -i devops/ansible/inventory.ini devops/ansible/site.yml -v

# 4. Verify setup
# Docker installed and running
# Services configured
# Health checks passing

# 5. Idempotent verification
# Re-run playbook - should produce no changes
```

## Workflow Commands Reference

### Daily Development Commands

```bash
# Start full stack locally
cd devops/docker && docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Clean up volumes
docker-compose down -v

# Rebuild images
docker-compose build --no-cache
```

### Kubernetes Commands

```bash
# Get all resources
kubectl get all -n notes-management

# Scale deployment
kubectl scale deployment backend -n notes-management --replicas=5

# View metrics
kubectl top pods -n notes-management
kubectl top nodes

# Port forward
kubectl port-forward -n notes-management svc/backend 5000:5000

# Get logs
kubectl logs <pod-name> -n notes-management

# Execute in pod
kubectl exec -it <pod-name> -n notes-management -- /bin/bash
```

### CI/CD Commands

```bash
# Trigger Jenkins build
git push origin main  # Webhook triggered

# View pipeline status
# Jenkins UI: http://localhost:8080/job/Notes-Management-System

# View artifacts
# Jenkins workspace or Nexus repository
```

### Monitoring Commands

```bash
# Query Prometheus
curl http://localhost:9090/api/v1/query?query=up

# View Grafana dashboards
# Access: http://localhost:3001

# Test AlertManager
# Trigger an alert by violating a condition
```

## Common Troubleshooting Workflow

```
Issue Identified
    ↓
Check Monitoring Dashboard
    (Prometheus/Grafana)
    ↓
View Service Logs
    (Docker/Kubernetes)
    ↓
Identify Root Cause
    ↓
Four Options:
├─ Code Fix → Rebuild → Deploy
├─ Config Change → Apply config
├─ Scaling → Increase replicas
└─ Restart → Restart service
    ↓
Verify Health
    (Health checks/Monitoring)
    ↓
Post-Incident Review
```

## Release Workflow

```
1. Development
   - Feature branches
   - Local testing
   - Code review

2. Staging
   - Docker build
   - K8s deploy
   - Integration tests
   - Performance tests

3. Production
   - Blue-green deployment
   - Canary release (10% → 50% → 100%)
   - Health checks
   - Rollback plan

4. Post-Deployment
   - Smoke tests
   - Monitoring
   - Alerting
   - Runbook execution
```

## Scaling Strategy

### Horizontal Scaling (Recommended)

```bash
# Automatic scaling (HPA)
kubectl get hpa -n notes-management

# Manual scaling
kubectl scale deployment backend -n notes-management --replicas=10

# Monitor scaling
kubectl get pods -n notes-management -w
```

### Vertical Scaling

```yaml
# In backend-deployment.yaml
resources:
  requests:
    cpu: 200m      # Increase from 100m
    memory: 512Mi   # Increase from 256Mi
  limits:
    cpu: 1000m     # Increase from 500m
    memory: 1Gi     # Increase from 512Mi
```

### Database Scaling

```javascript
// Connection pool tuning
const mongooseOptions = {
  maxPoolSize: 20,    // Increase from 10
  minPoolSize: 10     // Increase from 5
};
```

## Disaster Recovery Runbook

### Backup Strategy

```bash
# Database backup
docker exec notes-mongodb \
  mongodump --out /backup

# File storage backup
tar -czf files-backup.tar.gz backend/uploads/

# Configuration backup
git add -A && git commit -m "Config backup"
```

### Recovery Steps

```bash
# 1. If Service Down
kubectl restart deployment backend -n notes-management

# 2. If Database Corrupted
kubectl exec notes-mongodb -- mongorestore /backup

# 3. If Complete Failure
# Redeploy from IaC
terraform apply
kubectl apply -f devops/kubernetes/*.yaml

# 4. Verify Recovery
# Check health endpoints
# Validate data integrity
# Review monitoring graphs
```

## Performance Tuning Checklist

- [ ] Database indexes created
- [ ] Query optimization done
- [ ] Connection pooling configured
- [ ] Caching enabled (Redis)
- [ ] Load testing completed
- [ ] Resource limits set
- [ ] HPA configured
- [ ] Monitoring dashboards active
- [ ] Alerts configured
- [ ] Capacity planning done

## Security Checklist

- [ ] SSL/TLS certificates installed
- [ ] Secrets encrypted
- [ ] RBAC configured
- [ ] Network policies applied
- [ ] Pod security policies set
- [ ] Image scanning enabled
- [ ] Audit logging configured
- [ ] API rate limiting active
- [ ] CORS properly configured
- [ ] Security headers added

## Post-Deployment Verification

```bash
# 1. Health Checks
curl http://localhost:5000/health
curl http://localhost:3000

# 2. Functionality Tests
# Create user account
# Upload file
# Download file
# Verify RBAC

# 3. Performance Tests
# Load testing with wrk or k6
# Database query performance
# API response times

# 4. Security Tests
# SQL injection attempt
# XSS test
# CORS verification
# Rate limiting test

# 5. Monitoring Tests
# Generate metrics
# Check dashboards
# Verify alerts
```

---

**Remember**: Always test changes in staging before production deployment!

