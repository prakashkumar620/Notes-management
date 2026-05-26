# Interview Q&A - Notes Management System

## System Architecture Questions

### Q1: Explain the overall system architecture.

**A:**
The system uses a three-tier microservices architecture:

1. **Frontend Tier** (React)
   - SPA deployed on Nginx
   - Google OAuth authentication
   - Responsive UI with role-based rendering

2. **Backend Tier** (Node.js + Express)
   - RESTful API with JWT authentication
   - Multi-instance deployment for scalability
   - File upload handling with Multer

3. **Data Tier** (MongoDB)
   - Replica set for high availability
   - Collections: Users, Notes, Uploads
   - Indexed queries for performance

### Q2: How does authentication and authorization work?

**A:**
```
Login Flow:
1. User clicks Google Login
2. Google returns ID Token
3. Frontend sends token to backend
4. Backend verifies with Google
5. Backend creates JWT token
6. Frontend stores JWT in localStorage
7. Subsequent requests include JWT

Authorization:
- JWT contains: userId, email, role, expiry
- Role-based middleware checks permissions
- Teachers can upload; Students can only view
- Admins have full access
```

### Q3: Explain the file upload and storage mechanism.

**A:**
```
Upload Process:
1. Frontend receives file from user
2. Validates file type and size
3. Sends FormData with metadata to backend
4. Backend validates with Multer
5. Saves to disk: /uploads/{timestamp}-{random}-{filename}
6. Stores metadata in MongoDB
7. Returns file path reference

Storage Strategy:
- Local disk with Kubernetes PVC for persistence
- Files organized by timestamp
- File references in MongoDB for quick lookup
- Download increments counter for analytics
```

### Q4: How would you handle database scaling?

**A:**
```
Horizontal Scaling:
- MongoDB Replica Set (3 nodes minimum)
- Read replicas for distributed read operations
- Write operations to primary node

Vertical Scaling:
- Increase pod resource limits in Kubernetes
- Upgrade MongoDB instance size
- Add more backend replicas

Monitoring:
- Query performance analysis
- Connection pool monitoring
- Replication lag tracking
```

## DevOps Questions

### Q5: Explain the CI/CD pipeline stages.

**A:**
```
Jenkins Pipeline Stages:
1. Checkout → Pull code from GitHub
2. Build → npm install && npm run build
3. SonarQube → Code quality analysis
4. Docker Build → Create container images
5. Push → Push to Nexus registry
6. Deploy → docker-compose up or kubectl apply
7. Health Checks → Verify service availability

Failure Handling:
- Rollback on health check failure
- Notifications on failure
- Artifact preservation for debugging
```

### Q6: How do Docker containers help in this project?

**A:**
```
Benefits:
1. Consistency → Same environment dev to prod
2. Isolation → Services don't interfere
3. Scalability → Easily replicate containers
4. Resource efficiency → Container-level scaling
5. CI/CD Integration → Automated image builds

Structure:
- Multi-stage builds for optimization
- Alpine base images for small size
- Health checks for automatic restart
- Volume mounting for persistence
```

### Q7: Explain Kubernetes deployment strategy.

**A:**
```
K8s Objects:
- Namespace: Logical isolation
- Deployment: Manages pod replicas
- Service: Stable network endpoint
- PVC: Persistent storage
- HPA: Automatic scaling

Deployment Strategy:
- Rolling Update: Gradual rollout
- minReplicas: 2 (availability)
- maxReplicas: 5 (cost control)
- Resource limits: CPU 500m, Memory 512Mi

Health Checks:
- Liveness: Restart if unhealthy
- Readiness: Traffic only to ready pods
```

### Q8: How does monitoring work with Prometheus and Grafana?

**A:**
```
Prometheus:
- Scrapes metrics from endpoints
- 15s scrape interval
- Time-series database storage
- Alert rule evaluation

Grafana:
- Visualizes Prometheus metrics
- Custom dashboards per service
- Alert panel for critical issues
- Multi-user support

Alerts:
- Backend down (critical)
- High error rate (warning)
- Database issues (critical)
- Resource exhaustion (warning)
```

### Q9: Explain the Terraform infrastructure code.

**A:**
```
Terraform Benefits:
- Infrastructure as Code (IaC)
- Version control for infrastructure
- Reproducible deployments
- Easy rollback

Resources Managed:
- Docker networks
- MongoDB container
- Backend service containers
- Frontend containers
- Volumes and mounts

Execution:
terraform init → terraform plan → terraform apply
terraform state tracks actual infrastructure
```

### Q10: What does Ansible do in this project?

**A:**
```
Configuration Management:
- Install Docker on target machines
- Install Node.js and npm
- Clone repository
- Create necessary directories
- Start services

Advantages:
- Agentless (SSH-based)
- Idempotent (safe to re-run)
- YAML syntax (readable)
- Playbook-based automation

Execution:
ansible-playbook -i inventory.ini site.yml
```

## Technical Depth Questions

### Q11: How would you implement role-based access control?

**A:**
```javascript
// Middleware approach
const roleBasedAccess = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

// Usage
router.post('/upload',
  authMiddleware,
  roleBasedAccess('teacher', 'admin'),
  uploadController.uploadNote
);
```

### Q12: Design a caching strategy for frequently accessed notes.

**A:**
```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient();

async function getNotes(userId) {
  const cacheKey = `user:${userId}:notes`;
  
  // Check cache
  const cached = await client.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Query database
  const notes = await Note.find({ uploadedBy: userId });
  
  // Cache for 1 hour
  await client.setex(cacheKey, 3600, JSON.stringify(notes));
  
  return notes;
}
```

### Q13: How would you handle concurrent file uploads?

**A:**
```javascript
const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10 // Max 10 files
  }
});

// Queue-based processing with Bull
const uploadQueue = new Queue('file-upload');

uploadQueue.process(async (job) => {
  // Async file processing
  // Can process multiple files in parallel
});

// Rate limiting
const rateLimit = require('express-rate-limit');
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5 // 5 uploads per minute
});
```

### Q14: Explain error handling and logging strategy.

**A:**
```javascript
// Centralized error handler
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id
  });
  
  // Send response
  res.status(err.status || 500).json({
    message: err.message,
    requestId: req.id // For tracing
  });
});

// Logging levels
logger.info('Application started');
logger.warn('High memory usage');
logger.error('Database connection failed');
```

### Q15: How would you implement API rate limiting and throttling?

**A:**
```javascript
const rateLimit = require('express-rate-limit');

// Per-IP rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests'
});

// Per-user rate limiting
const userLimiter = rateLimit({
  keyGenerator: (req) => req.user.id,
  windowMs: 60 * 1000,
  max: 30
});

app.use('/api/', limiter);
app.post('/api/notes/upload', userLimiter, uploadController);
```

## DevOps Best Practices Questions

### Q16: What's your deployment strategy to minimize downtime?

**A:**
```
Blue-Green Deployment:
1. Deploy to "green" environment
2. Run smoke tests
3. Switch load balancer to green
4. Keep blue as rollback

Rolling Update (Kubernetes):
- maxSurge: 1 (one extra pod)
- maxUnavailable: 0 (no downtime)
- Gradually replace old pods

Health Check Strategy:
- Liveness: Detect dead processes
- Readiness: Detect startup issues
- Startup probe: Allow time to initialize
```

### Q17: How do you handle secrets and sensitive data?

**A:**
```
Secret Management:
1. Kubernetes Secrets for runtime
   - JWT secret in Secret objects
   - Not committed to Git

2. CI/CD Tool Secrets
   - Jenkins credentials plugin
   - GitHub secrets for CI

3. Vault (Enterprise)
   - Centralized secret management
   - Dynamic secrets
   - Audit logging

Environment Variable Strategy:
- Use different secrets per environment
- Rotate secrets periodically
- Implement least privilege access
```

### Q18: How would you backup and disaster recovery?

**A:**
```
Backup Strategy:
1. Database Backups
   - Daily automated backups
   - Incremental snapshots
   - Off-site replication

2. File Backups
   - PVC snapshots in Kubernetes
   - Versioned storage

3. Configuration Backups
   - Git for IaC
   - Terraform state backup
   - Ansible playbook versioning

Recovery Plan:
1. RTO (Recovery Time Objective): < 2 hours
2. RPO (Recovery Point Objective): < 1 hour
3. Regular restore drills
4. Documented runbooks
```

### Q19: Explain cost optimization strategies.

**A:**
```
Kubernetes Optimization:
1. Resource Requests/Limits
   - Accurate sizing prevents waste
   - HPA scales based on metrics

2. Pod Disruption Budgets
   - Maintain availability during scaling

3. Reserved Instances
   - For predictable workloads

Database Optimization:
1. Index optimization
2. Query monitoring
3. Connection pooling

Infrastructure:
1. Use managed services (reduce ops)
2. Auto-scaling groups
3. Spot instances for non-critical workloads
```

### Q20: How do you ensure security across the stack?

**A:**
```
Security Layers:

Frontend:
- XSS protection via React's auto-escaping
- CSRF tokens for state-changing operations
- HTTPS only

Backend:
- Input validation and sanitization
- SQL injection prevention (Mongoose)
- Rate limiting and throttling
- JWT validation on every request

Infrastructure:
- Network policies in Kubernetes
- Pod security policies
- Container scanning for vulnerabilities
- Secrets encryption at rest
- TLS for all communications

Monitoring:
- Security event logging
- Anomaly detection
- Regular penetration testing
```

## Scenario-Based Questions

### Q21: A service is failing in production. Walk through your debugging process.

**A:**
```
Incident Response:
1. Check Monitoring Dashboard
   - CPU, Memory, Error rates
   - Recent deployments

2. Check Logs
   kubectl logs pod-name -n notes-management
   docker logs container-id

3. Check Service Status
   kubectl describe pod pod-name
   docker inspect container-id

4. Network Connectivity
   kubectl exec -it pod -- ping db
   curl health endpoint

5. Resource Availability
   kubectl top pods
   kubectl top nodes

6. Recent Changes
   Git log for recent commits
   Deployment history

7. Rollback if Necessary
   kubectl rollout undo deployment/backend
   docker-compose down && git checkout previous-version
```

### Q22: Database is running slow. How would you optimize?

**A:**
```
Diagnosis:
1. Check slow query logs
2. Analyze query execution plans
3. Check indexes
4. Monitor connections

Optimization:
1. Add missing indexes
   db.notes.createIndex({ uploadedBy: 1, createdAt: -1 })

2. Query optimization
   - Use projection (select specific fields)
   - Implement pagination
   - Use aggregation pipeline

3. Caching
   - Add Redis for frequently accessed data
   - Cache user metadata

4. Replication
   - Read from secondaries
   - Distribute load

5. Sharding (if needed)
   - Partition data by user
```

### Q23: How would you handle a spike in traffic?

**A:**
```
Immediate Actions:
1. Check HPA status
   - Should scale automatically
   - Verify resource limits

2. Enable caching
   - Redis for quick responses
   - CDN for static assets

3. Rate limiting
   - Prevent abuse
   - Maintain service stability

Long-term Solutions:
1. Database optimization
2. Code profiling
3. Infrastructure scaling
4. Load testing
5. Capacity planning
```

## Summary of Key Concepts

**High Availability**: Multi-replica deployments, health checks, auto-recovery
**Scalability**: Horizontal scaling with Kubernetes, load balancing
**Security**: OAuth, JWT, secrets management, network policies
**Monitoring**: Prometheus metrics, Grafana dashboards, alerts
**CI/CD**: Automated testing, building, deployment
**Infrastructure**: IaC with Terraform, configuration with Ansible
**DevOps**: Container orchestration, service mesh (optional), observability

---

**Tip**: During interviews, explain your reasoning, ask clarifying questions, and discuss trade-offs.
