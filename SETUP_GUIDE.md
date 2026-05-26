# Role-Based Notes Management System - Complete Setup Guide

## Project Overview

A production-level Notes Management System with complete DevOps lifecycle including:
- **Frontend**: React with Google OAuth login
- **Backend**: Node.js + Express + MongoDB
- **DevOps**: Docker, Kubernetes, Jenkins, SonarQube, Nexus, Terraform, Ansible
- **Monitoring**: Prometheus + Grafana

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Client Browser                      │
│  (React App with Google OAuth Authentication)      │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────────────┐
│          Nginx (Frontend Server)                     │
│  Port: 3000 | API proxy to backend                │
└──────────────────┬──────────────────────────────────┘
                   │
         ┌─────────▼─────────┐
         │                   │
    ┌────▼────┐         ┌────▼────┐
    │ Backend  │         │ Backend  │ (Replicas)
    │Instance1 │         │Instance2 │
    └────┬────┘         └────┬────┘
         │                   │
         └─────────┬─────────┘
                   │ TCP
        ┌──────────▼──────────┐
        │   MongoDB Cluster    │
        │  (Replica Set)       │
        └──────────────────────┘
```

## Prerequisites

### Windows Requirements
- Docker Desktop (with WSL2)
- Git for Windows
- Node.js 18+ (for local development)
- PowerShell or Command Prompt
- Minikube (for Kubernetes)

### Linux/Mac Requirements
- Docker
- Docker Compose
- Git
- Node.js 18+
- npm or yarn
- Kubernetes CLI (kubectl)
- Minikube
- Terraform (for IaC)
- Ansible (for configuration management)

## Quick Start - Local Development

### 1. Clone and Setup

```bash
# Navigate to project directory
cd notes-management-system

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit backend/.env with Google OAuth credentials
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 3. Start Local Development Stack

```bash
# Option 1: Using Docker Compose (Recommended)
cd devops/docker
docker-compose up -d

# Option 2: Run services locally
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start

# Terminal 3: Start MongoDB (if not using Docker)
mongod
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (OAuth consent screen)
5. Create OAuth client (Web application)
6. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - `http://localhost:3000`
7. Copy Client ID and Client Secret to `.env` files

### 5. Access Application

```
Frontend: http://localhost:3000
Backend API: http://localhost:5000
MongoDB: localhost:27017
```

## Deployment with Docker Compose

### Start Services

```bash
cd devops/docker

# Set Google credentials (Windows PowerShell)
$env:GOOGLE_CLIENT_ID="your_client_id"
$env:GOOGLE_CLIENT_SECRET="your_client_secret"

# (Or Linux/Mac)
export GOOGLE_CLIENT_ID="your_client_id"
export GOOGLE_CLIENT_SECRET="your_client_secret"

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Useful Commands

```bash
# Check container status
docker-compose ps

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Restart a service
docker-compose restart backend

# Remove all containers and volumes
docker-compose down -v
```

## Kubernetes Deployment

### Prerequisites
- Minikube installed
- kubectl installed
- Docker images built

### Start Minikube

```bash
minikube start --vm-driver=docker --cpus=4 --memory=8192

# For Mac/Linux with VirtualBox
minikube start --cpus=4 --memory=8192
```

### Build Docker Images

```bash
# Set Docker context to Minikube
eval $(minikube docker-env)

# Build images
docker build -f devops/docker/Dockerfile.backend -t notes-backend:latest backend/
docker build -f devops/docker/Dockerfile.frontend -t notes-frontend:latest frontend/
```

### Deploy to Kubernetes

```bash
# Create namespace and deploy all services
bash devops/kubernetes/deploy.sh

# Or manually
kubectl apply -f devops/kubernetes/backend-deployment.yaml
kubectl apply -f devops/kubernetes/frontend-deployment.yaml
kubectl apply -f devops/kubernetes/mongodb-deployment.yaml

# Check status
kubectl get pods -n notes-management
kubectl get svc -n notes-management
```

### Port Forwarding

```bash
# Frontend
kubectl port-forward -n notes-management svc/frontend 3000:80

# Backend
kubectl port-forward -n notes-management svc/backend 5000:5000

# MongoDB
kubectl port-forward -n notes-management svc/mongodb 27017:27017
```

### Scale Services

```bash
# Scale backend to 5 replicas
kubectl scale deployment backend -n notes-management --replicas=5

# Check HPA status
kubectl get hpa -n notes-management
```

## CI/CD Pipeline with Jenkins

### 1. Install Jenkins

```bash
bash devops/jenkins/jenkins-setup.sh
```

### 2. Access Jenkins

```
URL: http://localhost:8080
Username: admin
Password: (get from `docker logs jenkins | grep password`)
```

### 3. Configure Jenkins Pipeline

1. Create new job: "Notes-Management-System"
2. Select "Pipeline" job type
3. In pipeline section, choose "Pipeline script from SCM"
4. Configure Git repository
5. Specify branch: `*/main`
6. Script path: `devops/jenkins/Jenkinsfile`
7. Save and run

### 4. Jenkins Pipeline Stages

1. **Checkout**: Pull code from repository
2. **Build Backend**: Install dependencies
3. **Build Frontend**: Install and build React app
4. **SonarQube**: Code quality analysis
5. **Build Docker Images**: Create backend and frontend images
6. **Push to Registry**: Push to Nexus repository
7. **Deploy**: Start services with Docker Compose
8. **Health Checks**: Verify service availability

## Code Quality with SonarQube

### 1. Install SonarQube

```bash
bash devops/jenkins/sonarqube-setup.sh
```

### 2. Access SonarQube

```
URL: http://localhost:9000
Username: admin
Password: admin
```

### 3. Create Project and Token

1. Login to SonarQube
2. Create new project "notes-management"
3. Generate authentication token
4. Update Jenkins credentials

### 4. Analyze Code

```bash
# Install sonar-scanner (or use Docker)
# Linux
wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-4.7.0.2747-linux.zip
unzip sonar-scanner-4.7.0.2747-linux.zip
export PATH=$PATH:$(pwd)/sonar-scanner-4.7.0.2747-linux/bin

# Run analysis
sonar-scanner \
  -Dsonar.projectKey=notes-management \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=YOUR_TOKEN
```

## Artifact Repository with Nexus

### 1. Install Nexus

```bash
bash devops/jenkins/nexus-setup.sh
```

### 2. Access Nexus

```
URL: http://localhost:8081
Username: admin
Password: admin123
```

### 3. Configure NPM Registry

```bash
# In Nexus:
# 1. Create hosted npm repository
# 2. Create npm-group repository

# Configure npm client
npm config set registry http://localhost:8081/repository/npm-internal/
npm config set _auth $(echo -n 'admin:admin123' | base64)
```

### 4. Publish Packages

```bash
cd backend
npm publish --registry http://localhost:8081/repository/npm-internal/
```

## Infrastructure as Code with Terraform

### 1. Initialize Terraform

```bash
cd devops/terraform

# Install Terraform (if not already installed)
# Windows: Download from https://www.terraform.io/downloads
# Linux/Mac:
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform

# Initialize
terraform init
```

### 2. Plan and Apply

```bash
# View plan
terraform plan -out=tfplan

# Apply changes
terraform apply tfplan

# View outputs
terraform output

# Destroy (if needed)
terraform destroy
```

### 3. Terraform Files

- **main.tf**: Main infrastructure code
- **variables.tf**: Input variables
- **outputs.tf**: Output values
- **terraform.tfstate**: State file (don't commit)

## Configuration Management with Ansible

### 1. Install Ansible

```bash
bash devops/ansible/setup.sh
```

### 2. Configure Inventory

Edit `devops/ansible/inventory.ini` with your hosts

### 3. Run Playbooks

```bash
cd devops/ansible

# Run main playbook
ansible-playbook -i inventory.ini site.yml

# Run with verbose output
ansible-playbook -i inventory.ini site.yml -v

# Run specific tasks
ansible-playbook -i inventory.ini site.yml --tags="docker"
```

## Monitoring with Prometheus & Grafana

### 1. Start Monitoring Stack

```bash
bash devops/monitoring/setup-monitoring.sh
```

### 2. Access Monitoring Dashboards

```
Prometheus: http://localhost:9090
Grafana: http://localhost:3001
AlertManager: http://localhost:9093
```

### 3. Configure Prometheus Data Source in Grafana

1. Login to Grafana (admin/admin123)
2. Add data source
3. URL: `http://prometheus:9090`
4. Save & Test

### 4. Create Custom Dashboards

```bash
# Import default dashboards or create custom ones
# Popular dashboard IDs for Grafana:
# - 3662: Prometheus 2.0
# - 1860: Node Exporter
# - 6417: MongoDB
```

### 5. Alert Rules

Alerts are configured in `devops/monitoring/alert_rules.yml`:
- Backend API down
- High error rate
- Database connection issues
- High CPU/Memory usage
- Disk space running low

## API Endpoints

### Authentication

```
POST /api/auth/google-login
Body: { idToken: "google_id_token" }
Response: { token: "jwt_token", user: {...} }

GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: { user: {...} }

POST /api/auth/logout
```

### Notes Management

```
GET /api/notes
Headers: Authorization: Bearer {token}
Response: { count: number, notes: [...] }

POST /api/notes/upload
Headers: Authorization: Bearer {token}
Body: FormData with file, title, description, accessibleTo
Response: { message: "...", note: {...} }

GET /api/notes/{noteId}
GET /api/notes/{noteId}/download

DELETE /api/notes/{noteId}
```

### Admin Operations

```
GET /api/auth/users (admin only)
PUT /api/auth/users/{userId}/role (admin only)
GET /api/notes/stats/all (admin only)
```

## Common Issues and Troubleshooting

### Docker Issues

```bash
# Port already in use
# Solution: Kill process using the port
# Windows: netstat -ano | findstr :5000
# Linux: lsof -i :5000 | grep LISTEN

# Docker daemon not running
# Solution: Start Docker Desktop (Windows/Mac) or: sudo service docker start (Linux)

# Out of disk space
docker system prune -a --volumes

# Container fails to start
docker logs <container_id>
```

### MongoDB Connection Issues

```bash
# Test connection
mongosh --authenticationDatabase admin -u admin -p password

# Check if MongoDB is running
docker ps | grep mongodb

# Reset MongoDB data
docker volume rm mongodb_data
docker-compose down -v && docker-compose up -d
```

### Frontend Build Issues

```bash
# Clear node_modules and rebuild
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build

# Port 3000 already in use
# Windows: netstat -ano | findstr :3000
# Linux: sudo lsof -i :3000
```

### Kubernetes Issues

```bash
# Pods not starting
kubectl describe pod <pod_name> -n notes-management

# Check resource availability
kubectl top nodes
kubectl top pods -n notes-management

# View pod logs
kubectl logs <pod_name> -n notes-management

# Get into a running pod
kubectl exec -it <pod_name> -n notes-management -- /bin/bash
```

### Jenkins Pipeline Failures

```bash
# Check Jenkins logs
docker logs jenkins

# Rebuild with verbose output
# In Jenkins UI: Build with Parameters -> Debug mode

# Check Docker connectivity
# Ensure Docker socket is mounted to Jenkins container
```

## Environment Variables

### Backend (.env)

```
MONGODB_URI=mongodb://admin:password@localhost:27017/notes-management?authSource=admin
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=5000
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_API_BASE_URL=http://localhost:5000
```

## Security Considerations

1. **Never commit .env files** - Use .env.example
2. **Rotate JWT secrets** regularly
3. **Use HTTPS in production** - Configure Nginx SSL
4. **Database authentication** - Always use strong passwords
5. **API rate limiting** - Implement in production
6. **CORS configuration** - Restrict to trusted origins
7. **Input validation** - Validate all user inputs
8. **File upload security** - Validate file types and sizes

## Performance Tuning

### Backend Optimization

```js
// Connection pooling
const mongooseOptions = {
  maxPoolSize: 10,
  minPoolSize: 5
};

// Caching with Redis (optional)
const redis = require('redis');
const client = redis.createClient();
```

### Database Optimization

```
// Create indexes
db.notes.createIndex({ uploadedBy: 1, createdAt: -1 })
db.users.createIndex({ email: 1 })

// Enable compression
--compress wiredTiger
```

### Kubernetes Scaling

```yaml
# Horizontal Pod Autoscaling
minReplicas: 2
maxReplicas: 10
targetCPUUtilizationPercentage: 70
```

## Next Steps

1. ✅ Clone repository
2. ✅ Setup Google OAuth credentials
3. ✅ Configure environment variables
4. ✅ Start with Docker Compose
5. ✅ Test API endpoints
6. ✅ Deploy to Kubernetes
7. ✅ Setup Jenkins CI/CD
8. ✅ Configure monitoring
9. ✅ Deploy to production

## Support and Documentation

- Backend API Docs: `backend/README.md`
- Frontend Docs: `frontend/README.md`
- DevOps Setup: `devops/README.md`
- Architecture: `docs/ARCHITECTURE.md`

## License

MIT

---

**Version**: 1.0.0 | **Last Updated**: 2024
