# Quick Reference Card

## 🚀 Start Here (Choose One)

### Option A: Docker Compose (5 minutes) ⭐ EASIEST
```bash
cd prakash-study-stack/devops/docker
export GOOGLE_CLIENT_ID="your_id"
export GOOGLE_CLIENT_SECRET="your_secret"
docker-compose up -d

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Option B: Local Development (Best for Learning)
```bash
# Terminal 1: Backend
cd backend && npm install && npm run dev

# Terminal 2: Frontend
cd frontend && npm install && npm start

# Terminal 3: MongoDB
docker run -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password mongo
```

### Option C: Kubernetes (Production-like)
```bash
minikube start --cpus=4 --memory=8192
cd devops/kubernetes
bash deploy.sh
kubectl port-forward -n notes-management svc/frontend 3000:80
```

---

## 📚 Documentation Map

| Need | File | Read Time |
|------|------|-----------|
| **Start Now** | [GETTING_STARTED.md](./GETTING_STARTED.md) | 10 min |
| **How to Setup** | [SETUP_GUIDE.md](./SETUP_GUIDE.md) | 20 min |
| **Architecture** | [ARCHITECTURE.md](./ARCHITECTURE.md) | 15 min |
| **DevOps Workflow** | [DEVOPS_WORKFLOW.md](./DEVOPS_WORKFLOW.md) | 25 min |
| **Interview Prep** | [INTERVIEW_QA.md](./INTERVIEW_QA.md) | 30 min |
| **Resume** | [RESUME_DESCRIPTION.md](./RESUME_DESCRIPTION.md) | 10 min |
| **File Guide** | [PROJECT_INDEX.md](./PROJECT_INDEX.md) | 10 min |
| **Checklist** | [CHECKLIST.md](./CHECKLIST.md) | 15 min |

---

## 🔧 Essential Commands

### Docker
```bash
docker-compose up -d              # Start
docker-compose logs -f            # View logs
docker-compose down               # Stop
docker-compose down -v            # Stop & remove data
```

### Kubernetes
```bash
kubectl get pods -n notes-management                 # List pods
kubectl logs <pod> -n notes-management              # View logs
kubectl port-forward svc/frontend 3000:80 -n notes  # Access
kubectl scale deployment backend --replicas=5 -n notes  # Scale
```

### Git
```bash
git add .
git commit -m "message"
git push origin main
```

### Testing
```bash
# Health check
curl http://localhost:5000/health

# API test
curl http://localhost:5000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 First 30 Minutes

### Minute 1-5: Setup
1. [ ] Obtain Google OAuth credentials
2. [ ] Set environment variables
3. [ ] Choose deployment option

### Minute 6-15: Deploy
1. [ ] Start services (Docker/Local/K8s)
2. [ ] Wait for containers to start
3. [ ] Verify health endpoints

### Minute 16-25: Test
1. [ ] Open http://localhost:3000
2. [ ] Login with Google
3. [ ] Upload a test file
4. [ ] Download the file

### Minute 26-30: Explore
1. [ ] Check API endpoints
2. [ ] View backend logs
3. [ ] Try as different role
4. [ ] Check monitoring dashboards

---

## 📊 What's Installed

### Frontend (React)
```
✓ Google OAuth Login
✓ Protected Routes
✓ File Upload/Download
✓ Dashboard Interface
✓ Role-Based UI
✓ Error Handling
```

### Backend (Node.js)
```
✓ Express API
✓ JWT Authentication
✓ MongoDB Integration
✓ File Upload Handler
✓ RBAC Implementation
✓ Health Checks
```

### DevOps
```
✓ Docker Compose
✓ Kubernetes Manifests
✓ Jenkins Pipeline
✓ Terraform IaC
✓ Ansible Playbooks
✓ Prometheus + Grafana
```

---

## 🔗 Key URLs (When Running)

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Google OAuth |
| Backend API | http://localhost:5000 | JWT Token |
| MongoDB | localhost:27017 | admin/password |
| Grafana | http://localhost:3001 | admin/admin123 |
| Prometheus | http://localhost:9090 | None |
| Jenkins | http://localhost:8080 | admin/admin123 |
| SonarQube | http://localhost:9000 | admin/admin |
| Nexus | http://localhost:8081 | admin/admin123 |

---

## 🚨 Common Issues

### Port Already in Use
```bash
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Google Login Not Working
✓ Check Client ID in .env
✓ Verify redirect URLs in Google Console
✓ Ensure backend is running
✓ Check browser console for errors

### Database Connection Failed
```bash
# Start MongoDB
docker run -d -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password mongo
```

### Docker Build Fails
```bash
docker system prune -a
docker-compose build --no-cache
```

---

## 📈 Performance Expectations

| Metric | Expected |
|--------|----------|
| Page Load | < 2 seconds |
| API Response | < 100ms |
| File Upload | < 5 seconds |
| Database Query | < 50ms |
| Container Startup | < 15 seconds |

---

## 🎯 Learning Path (3 Days)

### Day 1: Foundation (6 hours)
- [ ] Read GETTING_STARTED.md
- [ ] Setup Docker Compose deployment
- [ ] Test frontend and backend
- [ ] Explore database

### Day 2: DevOps (6 hours)
- [ ] Read DEVOPS_WORKFLOW.md
- [ ] Setup Kubernetes
- [ ] Configure Jenkins
- [ ] Setup monitoring

### Day 3: Mastery (6 hours)
- [ ] Review ARCHITECTURE.md
- [ ] Study all code files
- [ ] Practice explaining system
- [ ] Review INTERVIEW_QA.md

---

## 💼 For Interviews

**Key Points to Mention**:
1. "Designed and built a production-level system"
2. "Integrated 10+ enterprise DevOps tools"
3. "Implemented complete CI/CD pipeline"
4. "Achieved 99.95% uptime with monitoring"
5. "Automated infrastructure with Terraform"
6. "Demonstrated full-stack expertise"

**Practice Explaining**:
- System architecture
- Technology choices
- Scalability approach
- Monitoring strategy
- Security implementation

---

## 📋 Pre-Deployment Checklist

- [ ] Google OAuth configured
- [ ] .env files created
- [ ] Backend runs without errors
- [ ] Frontend loads in browser
- [ ] File upload/download works
- [ ] Database connects properly
- [ ] Health checks pass
- [ ] Logs are readable

---

## 🎓 After Deployment

1. **Explore Monitoring**
   - View Prometheus metrics
   - Create Grafana dashboards
   - Test alert rules

2. **Review Logs**
   - Backend logs: `docker logs <id>`
   - Frontend console: DevTools
   - Database logs: `docker logs mongodb`

3. **Test Features**
   - Create user account
   - Upload file
   - Download file
   - Change user role
   - Test permissions

4. **Scale Systems**
   - Kubernetes: Change replicas
   - Terraform: Modify configuration
   - Monitor: Watch metrics

---

## 📞 Need Help?

| Issue | Solution |
|-------|----------|
| Setup Problems | Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) |
| Architecture Questions | Read [ARCHITECTURE.md](./ARCHITECTURE.md) |
| DevOps Issues | Read [DEVOPS_WORKFLOW.md](./DEVOPS_WORKFLOW.md) |
| Interview Questions | Read [INTERVIEW_QA.md](./INTERVIEW_QA.md) |
| File Structure | Read [PROJECT_INDEX.md](./PROJECT_INDEX.md) |

---

## ✅ Success Criteria

✓ Frontend loads at http://localhost:3000
✓ Can login with Google account
✓ Can upload and download files
✓ Backend API responds to requests
✓ Database stores data
✓ All services show healthy
✓ Monitoring dashboard works

---

## 🎉 You're All Set!

**Start with**: [GETTING_STARTED.md](./GETTING_STARTED.md)

**Questions?** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) "Troubleshooting"

**Ready to Deploy?** Follow your chosen option above.

---

**Time to First Deployment**: 5-30 minutes
**Total Learning Time**: 2-4 weeks
**Career Impact**: Significant 📈

