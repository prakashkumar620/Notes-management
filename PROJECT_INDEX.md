# Project Index & File Guide

## 📑 Complete File Directory with Descriptions

### 📚 Documentation Files (Start Here!)

| File | Purpose | Read Time |
|------|---------|-----------|
| [GETTING_STARTED.md](./GETTING_STARTED.md) | **START HERE** - Quick start guide and overview | 10 min |
| [README.md](./README.md) | Project overview, features, and quick reference | 5 min |
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Comprehensive setup instructions for all options | 20 min |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, patterns, and diagrams | 15 min |
| [DEVOPS_WORKFLOW.md](./DEVOPS_WORKFLOW.md) | Step-by-step DevOps workflow guide | 25 min |
| [INTERVIEW_QA.md](./INTERVIEW_QA.md) | 23 interview Q&A with detailed answers | 30 min |
| [RESUME_DESCRIPTION.md](./RESUME_DESCRIPTION.md) | Resume bullet points and project description | 10 min |

---

## 🎨 Frontend Application (`frontend/`)

### Configuration Files
```
frontend/
├── package.json          - NPM dependencies and scripts
├── .env                  - Environment variables (Google Client ID)
├── .env.example          - Template for environment variables
├── .gitignore            - Git exclusion rules
└── public/
    └── index.html        - HTML entry point with Google script
```

### React Components
```
frontend/src/
├── App.js                - Main app component with routing
├── index.js              - React DOM entry point
├── context/
│   └── AuthContext.js    - Global authentication state management
├── pages/
│   ├── Login.js          - Google OAuth login page
│   └── Dashboard.js      - Main application dashboard
└── components/
    └── ProtectedRoute.js - Route guard for authenticated users
```

**Key Features**:
- Google OAuth authentication
- Protected routes
- Note upload/download interface
- Real-time file list display
- Role-based UI rendering

---

## 🔧 Backend API (`backend/`)

### Configuration Files
```
backend/
├── package.json          - NPM dependencies (Express, Mongoose, etc.)
├── .env.example          - Environment template
├── .env                  - Actual environment variables
├── .gitignore            - Git exclusion rules
└── uploads/              - File storage directory
```

### Source Code
```
backend/src/
├── index.js              - Express app initialization
├── config/
│   └── database.js       - MongoDB connection setup
├── middleware/
│   ├── auth.js           - JWT verification and RBAC
│   └── upload.js         - Multer file upload configuration
├── models/
│   ├── User.js           - MongoDB User schema
│   └── Note.js           - MongoDB Note schema
├── controllers/
│   ├── authController.js - Google OAuth and JWT logic
│   └── notesController.js - CRUD operations for notes
└── routes/
    ├── authRoutes.js     - Authentication endpoints
    └── notesRoutes.js    - Notes management endpoints
```

### API Endpoints Provided
- `POST /api/auth/google-login` - Login with Google OAuth
- `GET /api/auth/me` - Get current user info
- `GET /api/notes` - List notes (with RBAC filtering)
- `POST /api/notes/upload` - Upload new note
- `GET /api/notes/:id` - Get single note
- `GET /api/notes/:id/download` - Download note
- `DELETE /api/notes/:id` - Delete note

---

## 🐳 DevOps Infrastructure (`devops/`)

### Docker Setup (`docker/`)
```
devops/docker/
├── Dockerfile.backend    - Multi-stage backend image (550MB → 150MB)
├── Dockerfile.frontend   - React build + Nginx serving
├── docker-compose.yml    - Complete stack orchestration
├── nginx.conf            - Nginx reverse proxy configuration
├── .dockerignore          - Files to exclude from Docker builds
└── scripts/
    └── init-mongo.js     - MongoDB initialization script
```

**Features**:
- Multi-stage builds for optimization
- Health checks for container monitoring
- Volume persistence for uploads
- Network isolation

### Kubernetes Setup (`kubernetes/`)
```
devops/kubernetes/
├── backend-deployment.yaml    - Backend deployment (2-5 replicas, HPA)
├── frontend-deployment.yaml   - Frontend deployment (2-4 replicas)
├── mongodb-deployment.yaml    - MongoDB with replica set
├── ingress.yaml               - Kubernetes ingress controller
└── deploy.sh                  - Automated deployment script
```

**Features**:
- Horizontal Pod Autoscaling
- Persistent volumes for data
- Health checks (liveness & readiness)
- Resource limits and requests
- Rolling updates

### Jenkins CI/CD (`jenkins/`)
```
devops/jenkins/
├── Jenkinsfile              - Complete CI/CD pipeline (10+ stages)
├── jenkins-setup.sh         - Jenkins installation script
├── sonarqube-setup.sh       - SonarQube Community Edition setup
└── nexus-setup.sh           - Nexus Repository Manager setup
```

**Pipeline Stages**:
1. Checkout → Code from GitHub
2. Build → npm install and build
3. SonarQube → Code quality analysis
4. Docker Build → Create images
5. Push → Push to Nexus
6. Deploy → Docker Compose or K8s
7. Health Checks → Verify services

### Terraform IaC (`terraform/`)
```
devops/terraform/
├── main.tf                 - Docker infrastructure definition
├── variables.tf            - Input variables and defaults
└── setup.sh                - Terraform initialization script
```

**Manages**:
- Docker networks
- Container deployments
- Volume creation
- Service configuration

### Ansible Configuration (`ansible/`)
```
devops/ansible/
├── site.yml                - Main playbook (Docker, Node.js, services)
├── inventory.ini           - Host inventory
└── setup.sh                - Ansible execution script
```

**Configuration Tasks**:
- Docker installation
- Node.js and npm setup
- Service initialization
- Health verification

### Monitoring Stack (`monitoring/`)
```
devops/monitoring/
├── prometheus.yml          - Prometheus scrape configuration
├── alert_rules.yml         - Alert condition definitions
├── alertmanager.yml        - Alert routing rules
├── grafana-datasources.yml - Grafana data source config
├── docker-compose.yml      - Monitoring stack deployment
├── monitoring-k8s.yaml     - Kubernetes manifests
└── setup-monitoring.sh     - Monitoring stack startup script
```

**Components**:
- Prometheus: Metrics collection (port 9090)
- Grafana: Visualization and dashboards (port 3001)
- AlertManager: Alert routing and notification (port 9093)
- Node Exporter: System metrics (port 9100)

**Alert Rules**:
- Backend API downtime
- High error rates
- Database connection issues
- Resource exhaustion
- Disk space warnings

---

## 📊 Architecture and Design

### Database Schema
```
MongoDB Collections:

Users:
- _id: ObjectId
- email: String (unique)
- googleId: String
- name: String
- avatar: String (URL)
- role: "student" | "teacher" | "admin"
- isActive: Boolean
- lastLogin: Date
- createdAt: Date
- updatedAt: Date

Notes:
- _id: ObjectId
- title: String
- description: String
- uploadedBy: ObjectId (ref: User)
- fileName: String
- filePath: String
- fileSize: Number
- mimeType: String
- accessibleTo: "all" | "students" | "specific"
- downloads: Number
- views: Number
- createdAt: Date
- updatedAt: Date
```

### Environment Variables

**Backend (.env)**:
```
MONGODB_URI=mongodb://localhost:27017/notes-management
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
PORT=5000
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env)**:
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_id
REACT_APP_API_BASE_URL=http://localhost:5000
```

---

## 🚀 Quick Command Reference

### Local Development
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend  
cd frontend && npm install && npm start

# MongoDB (Docker)
docker run -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password mongo
```

### Docker Compose
```bash
cd devops/docker
docker-compose up -d              # Start
docker-compose logs -f            # View logs
docker-compose down               # Stop
docker-compose down -v            # Stop and remove volumes
```

### Kubernetes
```bash
minikube start --cpus=4 --memory=8192
bash devops/kubernetes/deploy.sh
kubectl get pods -n notes-management
kubectl port-forward svc/frontend 3000:80
```

### Jenkins
```bash
bash devops/jenkins/jenkins-setup.sh
# Access: http://localhost:8080
```

### Monitoring
```bash
bash devops/monitoring/setup-monitoring.sh
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001
```

---

## 📋 File Navigation by Use Case

### 🎓 For Learning Full-Stack Development
1. Start: [GETTING_STARTED.md](./GETTING_STARTED.md)
2. Read: [README.md](./README.md)
3. Code: `frontend/src/` and `backend/src/`
4. Study: [ARCHITECTURE.md](./ARCHITECTURE.md)

### 🛠️ For DevOps & Infrastructure
1. Start: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Learn: [DEVOPS_WORKFLOW.md](./DEVOPS_WORKFLOW.md)
3. Study: `devops/docker/`, `devops/kubernetes/`
4. Configure: `devops/jenkins/`, `devops/terraform/`, `devops/ansible/`

### 💼 For Interview Preparation
1. Read: [INTERVIEW_QA.md](./INTERVIEW_QA.md)
2. Review: [RESUME_DESCRIPTION.md](./RESUME_DESCRIPTION.md)
3. Study: [ARCHITECTURE.md](./ARCHITECTURE.md)
4. Practice: Explain each Q&A point

### 🏢 For Production Deployment
1. Follow: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Deploy: Using Kubernetes manifests
3. Monitor: Setup Prometheus/Grafana
4. Optimize: Review [DEVOPS_WORKFLOW.md](./DEVOPS_WORKFLOW.md)

---

## 📦 Key Dependencies

### Frontend
```json
{
  "react": "18.2.0",
  "react-router-dom": "6.8.0",
  "axios": "1.3.0",
  "@react-oauth/google": "0.12.0",
  "styled-components": "5.3.6",
  "react-toastify": "9.1.2"
}
```

### Backend
```json
{
  "express": "4.18.2",
  "mongoose": "7.0.0",
  "jsonwebtoken": "9.0.0",
  "multer": "1.4.5-lts.1",
  "google-auth-library": "8.8.0",
  "bcryptjs": "2.4.3",
  "dotenv": "16.0.3"
}
```

### DevOps Tools
- Docker: 20.10+
- Kubernetes: 1.20+
- Jenkins: 2.300+
- Terraform: 1.0+
- Ansible: 2.10+

---

## 🔍 File Statistics

```
Backend:
  - Lines of Code: ~1,500
  - Files: 13
  - API Endpoints: 12
  - Database Models: 2

Frontend:
  - Lines of Code: ~1,200
  - Files: 10
  - Components: 4
  - Pages: 2

DevOps:
  - Configuration Files: 25+
  - Lines of Configuration: ~3,000
  - Tools Integrated: 10
  - Kubernetes Resources: 15+

Documentation:
  - Files: 6
  - Total Words: ~8,000
  - Code Examples: 50+

Total Project:
  - Files: 50+
  - Lines of Code: ~7,700
  - Total Words: ~10,000
```

---

## 🎯 Deployment Paths

### Development Path
```
Local Dev → Docker Compose → Test → Commit to Git
```

### Staging Path
```
Git Push → Jenkins Build → SonarQube → Docker Image → Nexus → K8s Deploy
```

### Production Path
```
Git Tag → Jenkins Release Build → Registry Push → K8s Deploy → Monitoring
```

---

## ✅ Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Google OAuth credentials obtained
- [ ] Database initialized
- [ ] Backend API tested (`curl http://localhost:5000/health`)
- [ ] Frontend loads (`http://localhost:3000`)
- [ ] File upload/download works
- [ ] Kubernetes deployment successful
- [ ] Monitoring dashboards active
- [ ] Jenkins pipeline completes
- [ ] Code quality gates passed

---

## 🆘 Getting Help

1. **Quick Issue**: Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) "Troubleshooting" section
2. **Architecture Question**: Read [ARCHITECTURE.md](./ARCHITECTURE.md)
3. **DevOps Question**: Check [DEVOPS_WORKFLOW.md](./DEVOPS_WORKFLOW.md)
4. **Interview Prep**: Review [INTERVIEW_QA.md](./INTERVIEW_QA.md)
5. **Code Issue**: Check backend or frontend README files

---

## 🎓 Learning Path (Recommended)

### Week 1: Understand the System
- Day 1-2: Read all documentation
- Day 3-4: Run local development setup
- Day 5: Test all features manually
- Day 6-7: Study code structure

### Week 2: DevOps Fundamentals
- Day 8-9: Docker and containerization
- Day 10-11: Kubernetes basics
- Day 12-13: CI/CD pipeline
- Day 14: Monitoring and logging

### Week 3: Production Ready
- Day 15-16: Security and hardening
- Day 17-18: Performance optimization
- Day 19-20: Disaster recovery
- Day 21: Final review and polishing

---

**Navigation Tip**: Use this file to find what you need quickly. Each section links to the relevant detailed documentation.

