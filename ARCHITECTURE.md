# Architecture & Design Patterns

## System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                          Client Layer                                 │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Web Browser (React SPA)                                      │   │
│  │  - Google OAuth Login                                          │   │
│  │  - JWT Token Management                                        │   │
│  │  - File Upload Interface                                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────┬───────────────────────────────────────────────────────┘
               │ HTTPS/WSS
┌──────────────▼──────────────────────────────────────────────────────┐
│                    Reverse Proxy / Load Balancer                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Nginx                                                        │   │
│  │  - SSL Termination                                            │   │
│  │  - Static File Serving                                        │   │
│  │  - API Routing to Backend                                     │   │
│  │  - Compression (gzip)                                         │   │
│  │  - Rate Limiting                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────┬───────────────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────────────┐
│                    API Gateway / Service Layer                        │
│  ┌────────────────────┐ ┌────────────────────┐                      │
│  │  Backend Instance 1│ │  Backend Instance 2│ (Load Balanced)      │
│  │  - Auth Service    │ │  - Auth Service    │                      │
│  │  - Notes API       │ │  - Notes API       │                      │
│  │  - File Handler    │ │  - File Handler    │                      │
│  │  - Health Check    │ │  - Health Check    │                      │
│  └────────────────────┘ └────────────────────┘                      │
│  (Node.js + Express, Auto-scaling 2-5 replicas)                    │
└──────────────┬────────────────────────────────────────────────────┬──┘
               │                                                    │
        ┌──────▼───────┐                                    ┌────────▼──────┐
        │  File Storage │                                    │ Cache Layer   │
        │  (PVC: 10GB)  │                                    │ (Redis)       │
        │  /uploads/*   │                                    │ (Optional)    │
        └──────────────┘                                    └───────────────┘
               │
        ┌──────▼──────────────────────────────────────────────────────┐
        │                  Data Persistence Layer                     │
        │  ┌──────────────────────────────────────────────────────┐  │
        │  │  MongoDB Replica Set (3 nodes)                        │  │
        │  │  - Primary Node: Write Operations                     │  │
        │  │  - Secondary 1: Read Operations                       │  │
        │  │  - Secondary 2: Backup & Failover                     │  │
        │  │  - Collections: Users, Notes, Metadata                │  │
        │  │  - Replication Lag: <100ms                            │  │
        │  │  - Storage: 20GB with daily backups                   │  │
        │  └──────────────────────────────────────────────────────┘  │
        └──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                    Observability & Monitoring                        │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐│
│  │ Prometheus     │  │ Grafana        │  │ AlertManager          ││
│  │ - Metrics      │  │ - Dashboards   │  │ - Alert Routing       ││
│  │ - Scraping     │  │ - Visualization│  │ - Notifications       ││
│  └────────────────┘  └────────────────┘  └────────────────────────┘│
│  Monitoring Stack (Docker Compose)                                   │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                  Continuous Integration & Deployment                 │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Jenkins CI/CD Pipeline                                        │ │
│  │  - GitHub Webhooks → Trigger Builds                            │ │
│  │  - Unit Tests, Linting, Build                                  │ │
│  │  - SonarQube Code Quality Analysis                             │ │
│  │  - Docker Image Build & Push (Nexus)                           │ │
│  │  - Deploy to K8s or Docker Compose                             │ │
│  │  - Health Verification                                          │ │
│  └────────────────────────────────────────────────────────────────┘ │
│  Build Status: Public Dashboard & GitHub Checks                     │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                  Infrastructure Management                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │ Terraform        │  │ Ansible          │  │ Kubernetes       │   │
│  │ - IaC            │  │ - Configuration  │  │ - Orchestration  │   │
│  │ - Docker Infra   │  │ - Setup & Config │  │ - Auto-scaling   │   │
│  │ - State Mgmt     │  │ - Playbooks      │  │ - Service Mesh   │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

## Design Patterns Used

### 1. **MVC (Model-View-Controller)**
```
Backend:
- Model: MongoDB schemas (User, Note)
- View: JSON responses
- Controller: Business logic in controllers/

Frontend:
- Model: State management (Context API)
- View: React components
- Controller: Page components
```

### 2. **JWT Authentication Pattern**
```
Request → Middleware → Verify Token → Decode Payload → Grant Access
Refresh → New Token → Updated Expiry
Logout → Token Discarded (Client-side)
```

### 3. **Role-Based Access Control (RBAC)**
```
User.role ∈ {student, teacher, admin}
Middleware checks role before allowing action
Different endpoints for different roles
Database queries filtered by permission level
```

### 4. **Microservices Architecture**
```
Frontend Service (React)
├── Authentication Service (Google OAuth + JWT)
├── Notes Service (CRUD operations)
└── File Service (Upload/Download)

Each service is independently deployable
```

### 5. **Repository Pattern**
```javascript
// Data abstraction layer
class NoteRepository {
  async findById(id) { ... }
  async create(data) { ... }
  async update(id, data) { ... }
  async delete(id) { ... }
}

// Controllers use repositories
notesController.getNotes() → noteRepository.find()
```

### 6. **Dependency Injection**
```javascript
// Loose coupling through constructor injection
class NotesController {
  constructor(noteRepository, fileService) {
    this.noteRepository = noteRepository;
    this.fileService = fileService;
  }
}
```

### 7. **Middleware Chain Pattern**
```
Request → Auth Middleware → RBAC Middleware → File Validation → Controller → Response
```

## Data Flow Diagrams

### Authentication Flow
```
1. User clicks "Login with Google"
   ↓
2. Google OAuth Library initiates flow
   ↓
3. User authenticates with Google account
   ↓
4. Google returns ID Token
   ↓
5. Frontend POST /api/auth/google-login with idToken
   ↓
6. Backend verifies token with Google
   ↓
7. Backend creates/updates user in MongoDB
   ↓
8. Backend generates JWT token
   ↓
9. Backend returns JWT + User Info to Frontend
   ↓
10. Frontend stores JWT in localStorage
    ↓
11. Frontend sets Authorization header for subsequent requests
```

### File Upload Flow
```
1. User selects file in React component
   ↓
2. Frontend validates:
   - File type (PDF, PPT, Image)
   - File size (<50MB)
   ↓
3. Frontend creates FormData with file + metadata
   ↓
4. POST /api/notes/upload with file
   ↓
5. Backend Multer middleware:
   - Validates file again
   - Saves to /uploads/
   ↓
6. Backend processes metadata:
   - Extracts filename, size, MIME type
   - Creates MongoDB document
   ↓
7. Backend returns success with file reference
   ↓
8. Frontend updates UI with new note
   ↓
9. Note appears in all users' feeds (based on permissions)
```

### Data Query Flow
```
Frontend Button Click
   ↓
onClick Handler
   ↓
axios.get('/api/notes') with JWT
   ↓
Backend receives request
   ↓
Auth Middleware verifies JWT
   ↓
RBAC Middleware checks user role
   ↓
NotesController.getAllNotes()
   ↓
MongoDB Query:
   - Students: filter by accessibility + ownership
   - Teachers: return all
   - Admins: return all
   ↓
.populate('uploadedBy') - Join with User collection
   ↓
.sort({ createdAt: -1 })
   ↓
Return JSON array
   ↓
Frontend renders in Dashboard
```

## Database Schema Design

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  googleId: String,
  name: String,
  avatar: String (URL),
  role: "student" | "teacher" | "admin",
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- { email: 1 }
- { googleId: 1 }
```

### Notes Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  uploadedBy: ObjectId (ref: User),
  fileName: String,
  filePath: String,
  fileSize: Number,
  mimeType: String,
  accessibleTo: "all" | "students" | "specific",
  specificUsers: [ObjectId], // ref: User
  downloads: Number,
  views: Number,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- { uploadedBy: 1, createdAt: -1 }
- { accessibleTo: 1 }
- { createdAt: -1 }
```

## Error Handling Strategy

```javascript
// Custom Error Class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Try-Catch Pattern
try {
  const note = await Note.findById(id);
  if (!note) {
    throw new AppError('Note not found', 404);
  }
  // Process note
} catch (error) {
  // Log error
  logger.error(error);
  // Send appropriate response
  res.status(error.statusCode || 500).json({
    message: error.message
  });
}
```

## Performance Optimization Strategies

### Backend Optimization
```javascript
// Connection Pooling
const mongooseOptions = {
  maxPoolSize: 10,
  minPoolSize: 5
};

// Query Optimization
- Use .select() for field filtering
- Use .limit() for pagination
- Create indexes on frequently queried fields
- Use aggregation pipeline for complex queries

// Caching
const cachedNotes = await redis.get('notes:all');
if (!cachedNotes) {
  const notes = await Note.find();
  await redis.setex('notes:all', 3600, JSON.stringify(notes));
}

// Compression
app.use(compression());
```

### Frontend Optimization
```javascript
// Code Splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// Memoization
const NoteItem = React.memo(({ note }) => { ... });

// Lazy Loading
useEffect(() => {
  if (inView) {
    fetchMoreNotes();
  }
}, [inView]);
```

### Database Optimization
```sql
-- Create indexes
db.notes.createIndex({ uploadedBy: 1, createdAt: -1 })

-- Query optimization
db.notes.find(
  { uploadedBy: ObjectId(...) },
  { title: 1, fileName: 1, createdAt: 1 }
).limit(10)

-- Aggregation pipeline for complex queries
db.notes.aggregate([
  { $match: { uploadedBy: ObjectId(...) } },
  { $group: { _id: "$accessibleTo", count: { $sum: 1 } } }
])
```

---

**Document Version**: 1.0
**Last Updated**: 2024
