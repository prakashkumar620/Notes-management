# 📚 How Prakash Study Stack Works

## 🎯 System Overview

This is a **full-stack web application** that allows students and teachers to manage and share notes. Here's how everything connects:

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERACTION FLOW                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Browser (http://localhost:3000)                               │
│       ↓                                                          │
│  React Frontend (React.js + Google OAuth)                      │
│       ↓                                                          │
│  HTTP Requests (Axios)                                          │
│       ↓                                                          │
│  Express Backend API (Node.js)                                 │
│       ↓                                                          │
│  Database (MongoDB)                                             │
│       ↓                                                          │
│  File Storage (/uploads folder)                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ Frontend (React.js) - What Users See

### Location
```
D:\studystack1\prakash-study-stack\frontend\
```

### What It Does
- **Login Page**: Users see a beautiful login interface with Google login button
- **Dashboard**: After login, users see a notes management interface
- **Upload Form** (Teachers only): File upload section
- **Notes List**: Display all accessible notes
- **Download/Delete**: Manage notes

### How It Works

**Step 1: User Opens Browser**
```
http://localhost:3000
```

**Step 2: Google Login**
- User clicks "Login with Google"
- Redirected to Google OAuth
- Google asks for permission
- Returns token to React app
- React stores token in localStorage

**Step 3: API Calls**
React sends HTTP requests to backend:
```
POST /api/auth/google-login      (with Google token)
GET /api/notes                   (get all notes)
POST /api/notes/upload           (upload new file)
GET /api/notes/:id/download      (download file)
DELETE /api/notes/:id            (delete note)
```

### Technologies Used
- **React 18**: UI framework
- **React Router**: Navigation between pages
- **Axios**: HTTP client to talk to backend
- **Google OAuth**: Secure login
- **Styled Components**: Beautiful styling
- **Context API**: Global state management

---

## 2️⃣ Backend (Node.js + Express) - The Brain

### Location
```
D:\studystack1\prakash-study-stack\backend\src\
```

### What It Does
- **Authenticates users** (Google OAuth)
- **Issues JWT tokens** (session tokens)
- **Manages files** (upload, download, delete)
- **Controls access** (who can see what)
- **Stores data** (sends to MongoDB)

### How It Works

**When User Logs In:**
```
1. Frontend sends Google token to backend
2. Backend verifies token with Google
3. Backend creates/updates user in MongoDB
4. Backend creates JWT token
5. Backend returns token to frontend
6. Frontend uses token for all future requests
```

**When User Uploads a File:**
```
1. Frontend sends file + metadata
2. Backend validates file type and size
3. Backend saves file to /uploads folder
4. Backend creates entry in MongoDB
5. Backend returns success response
6. Frontend shows note in list
```

**When User Views Notes:**
```
1. Frontend sends request with JWT token
2. Backend verifies JWT token
3. Backend checks user's role (Student/Teacher/Admin)
4. Backend filters notes based on permissions
5. Backend returns allowed notes
6. Frontend displays notes to user
```

**Role-Based Access Control (RBAC):**
```
Students:
  - Can view notes marked as "all"
  - Can view their own notes
  - Cannot upload notes
  - Cannot delete notes

Teachers:
  - Can upload notes
  - Can delete their own notes
  - Can see all notes
  - Can mark notes as public/private

Admin:
  - Can see everything
  - Can delete any note
  - Can manage users
```

### API Endpoints

| Method | Endpoint | Purpose | Who Can Use |
|--------|----------|---------|------------|
| POST | /api/auth/google-login | Login with Google | Everyone |
| GET | /api/auth/me | Get current user info | Logged-in users |
| POST | /api/auth/logout | Logout | Logged-in users |
| GET | /api/notes | Get all notes (filtered) | Logged-in users |
| POST | /api/notes/upload | Upload new note | Teachers + Admins |
| GET | /api/notes/:id | Get single note details | Authorized users |
| GET | /api/notes/:id/download | Download note file | Authorized users |
| DELETE | /api/notes/:id | Delete note | Owner + Admin |
| GET | /api/notes/stats/all | Get statistics | Admins only |

### Technologies Used
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: Database interface
- **JWT**: Secure tokens
- **Multer**: File upload handler
- **Google Auth Library**: OAuth verification

---

## 3️⃣ Database (MongoDB) - The Storage

### Location
```
MongoDB Container (port 27017)
```

### What It Stores

**Users Collection:**
```json
{
  "_id": ObjectId,
  "email": "user@gmail.com",
  "googleId": "google_id_123",
  "name": "John Doe",
  "avatar": "url_to_profile_pic",
  "role": "student",  // or "teacher", "admin"
  "isActive": true,
  "lastLogin": "2026-05-15",
  "createdAt": "2026-05-01"
}
```

**Notes Collection:**
```json
{
  "_id": ObjectId,
  "title": "Math Chapter 5",
  "description": "Complete guide to calculus",
  "uploadedBy": ObjectId (User reference),
  "fileName": "math_chapter5.pdf",
  "filePath": "/uploads/math_chapter5.pdf",
  "fileSize": 2048000,
  "mimeType": "application/pdf",
  "accessibleTo": "all",  // or "students", "specific"
  "downloads": 15,
  "views": 45,
  "createdAt": "2026-05-10"
}
```

---

## 4️⃣ File Storage - The Files

### Location
```
D:\studystack1\prakash-study-stack\backend\uploads\
```

### What Happens
1. User uploads file through frontend
2. Backend receives file
3. Backend validates: type, size, format
4. Backend saves file with unique name
5. Path stored in MongoDB
6. When user downloads, file sent from this folder

### File Restrictions
- **Allowed Types**: PDF, JPG, PNG, PPT
- **Max Size**: 50MB
- **Storage Limit**: Device disk space

---

## 🔐 Security Flow

### Authentication (Proving You Are Who You Claim)
```
1. User clicks "Login with Google"
2. Google verifies identity
3. Backend confirms with Google
4. Backend creates JWT token
5. Token sent to frontend
```

### Authorization (What You're Allowed to Do)
```
1. Frontend includes JWT token in every request
2. Backend checks token validity
3. Backend checks user role
4. Backend checks if user owns the resource
5. Backend allows/denies request
```

### JWT Token Structure
```
Header.Payload.Signature

Payload contains:
- userId
- email
- role
- name
- Expiry (7 days)
```

---

## 🚀 Complete User Journey

### Scenario: Teacher Uploads Notes

**Step 1: Browser Opening**
```
User opens: http://localhost:3000
Frontend loads from Nginx
React app starts
```

**Step 2: Authentication**
```
User clicks "Login with Google"
↓
Redirected to Google
↓
Google asks for permission
↓
User grants permission
↓
Google redirects back with token
↓
Frontend sends token to: POST /api/auth/google-login
↓
Backend verifies with Google
↓
Backend creates user in MongoDB (if new)
↓
Backend creates JWT token
↓
Frontend stores token in localStorage
↓
User sees Dashboard
```

**Step 3: Upload Notes**
```
User fills form:
- Title: "Physics Chapter 3"
- Description: "Quantum Mechanics"
- File: physics.pdf (5MB)
↓
User clicks "Upload"
↓
Frontend sends to: POST /api/notes/upload
- Headers: Authorization: Bearer JWT_TOKEN
- Body: formData with file + title + description
↓
Backend receives request
↓
Backend checks JWT token (valid?)
↓
Backend checks role (teacher? ✅)
↓
Backend checks file size (5MB < 50MB? ✅)
↓
Backend checks file type (.pdf? ✅)
↓
Backend saves file to: /uploads/physics_1234567890.pdf
↓
Backend creates MongoDB entry
↓
Backend returns success
↓
Frontend adds note to list
↓
User sees note in dashboard
```

**Step 4: Student Views Notes**
```
Student opens: http://localhost:3000
Student logs in
↓
Frontend requests: GET /api/notes
- Headers: Authorization: Bearer JWT_TOKEN
↓
Backend checks token
↓
Backend checks role: "student"
↓
Backend queries MongoDB:
  Find notes where:
  - accessibleTo = "all" OR
  - uploadedBy = student's ID OR
  - specificUsers includes student's ID
↓
Backend returns filtered list
↓
Frontend displays notes
↓
Student sees:
  - "Physics Chapter 3" (by Teacher)
  - "My Notes" (uploaded by student)
```

**Step 5: Student Downloads Note**
```
Student clicks "Download"
↓
Frontend requests: GET /api/notes/:id/download
↓
Backend checks authorization
↓
Backend increments download counter
↓
Backend sends file from /uploads folder
↓
Browser saves file
↓
File downloaded successfully
```

---

## 📊 How Data Flows

### Request Flow (Frontend → Backend → Database)
```
React Component
    ↓
Axios HTTP Request
    ↓
Express Middleware (validate JWT)
    ↓
Route Handler
    ↓
Mongoose Model
    ↓
MongoDB
    ↓
Response sent back
    ↓
React updates UI
```

### Example: Get All Notes
```javascript
// Frontend (React)
const response = await axios.get('/api/notes', {
  headers: { Authorization: `Bearer ${token}` }
});

↓ (HTTP POST to http://localhost:5000/api/notes)

// Backend (Express)
router.get('/notes', authMiddleware, (req, res) => {
  // Get user from JWT
  const userId = req.user.id;
  
  // Query database
  const notes = await Note.find({
    $or: [
      { accessibleTo: 'all' },
      { uploadedBy: userId }
    ]
  });
  
  // Return response
  res.json({ notes });
});

↓ (Response sent back with data)

// Frontend updates
setNotes(response.data.notes);
```

---

## 🐳 How Docker Works

### What is Docker?
Docker packages everything needed to run the app:
- Node.js runtime
- All dependencies
- Configurations
- Environment variables

### Three Services

**MongoDB Container**
```
Image: mongo:latest
Port: 27017
Username: admin
Password: password
Storage: mongodb_data volume
```

**Backend Container**
```
Image: Built from Dockerfile.backend
Port: 5000
Depends on: MongoDB (healthy)
Volumes: /app/uploads (persistent file storage)
Environment: All .env variables
```

**Frontend Container**
```
Image: Built from Dockerfile.frontend
Port: 3000 (mapped to 80 inside container)
Depends on: Backend service
Runs: Nginx to serve React app
```

### How They Connect
```
Frontend Container (port 3000)
    ↓ (HTTP)
Backend Container (port 5000)
    ↓ (HTTP)
MongoDB Container (port 27017)
```

All containers on same network = can communicate by service name

---

## 🔄 Complete System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                    (http://localhost:3000)                       │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                    HTTP/HTTPS
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│                    NGINX (Port 3000)                             │
│            (Reverse Proxy + Static File Server)                 │
│                                                                  │
│  Serves: React app (index.html, bundle.js, etc.)               │
│  Routes: /api/... → Backend:5000                               │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                    HTTP REST
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│              EXPRESS SERVER (Port 5000)                          │
│           - Routes & Controllers                                │
│           - Middleware (JWT, CORS)                             │
│           - File Upload Handler                                │
│           - OAuth Verification                                 │
│           - Business Logic                                      │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                    MongoDB Protocol
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│            MONGODB (Port 27017)                                 │
│        - Users Collection                                       │
│        - Notes Collection                                       │
│        - Persistent Data Storage                               │
└──────────────────────────────────────────────────────────────────┘

         ┌─────────────────────────────────┐
         │     FILE STORAGE                │
         │  (/uploads folder)              │
         │  - Stores actual files          │
         │  - Persists across restarts     │
         └─────────────────────────────────┘

         ┌─────────────────────────────────┐
         │     GOOGLE OAUTH                │
         │  (External Service)             │
         │  - Authenticates users          │
         │  - Provides identity info       │
         └─────────────────────────────────┘
```

---

## 🎯 Key Concepts Explained

### JWT Token
```
Token = credentials that prove user is logged in
Expires = 7 days
Stored = browser's localStorage
Used = every API request in Authorization header

Like a ticket:
- Get ticket from Google (prove identity)
- Exchange ticket for JWT at backend
- Use JWT to access resources
```

### RBAC (Role-Based Access Control)
```
Student role:
  ✓ View public notes
  ✓ Download notes
  ✗ Upload notes
  ✗ Delete notes

Teacher role:
  ✓ Upload notes
  ✓ Delete own notes
  ✓ View all notes
  ✓ Share notes with specific users

Admin role:
  ✓ Everything
  ✓ Manage users
  ✓ Force delete any note
```

### Middleware
```
Every request goes through:
1. CORS check (allowed origin?)
2. JWT verification (valid token?)
3. Route handler (do the action)
4. Response (send back data)
```

### File Upload Process
```
1. User selects file (frontend)
2. Multer validates file (size, type)
3. File saved with unique name
4. Path stored in MongoDB
5. Metadata indexed for fast search
6. File accessible via download link
```

---

## 📈 Example: Complete User Story

### User: Priya (Teacher)

**Day 1: Upload Notes**
```
1. Priya opens http://localhost:3000
2. Sees Google login button
3. Clicks login → Google authenticates
4. Returns to dashboard
5. Sees "Upload Notes" form (because role=teacher)
6. Fills form:
   - Title: "Advanced Algebra"
   - Description: "Polynomial equations"
   - File: algebra.pdf
   - Access: "All Students"
7. Clicks upload
8. File saved to MongoDB + /uploads folder
9. Notification: "Upload successful!"
```

**Day 2: Student Views Note**
```
1. Student Raj opens http://localhost:3000
2. Logs in with Google
3. Dashboard shows notes he can access
4. Sees "Advanced Algebra" by Priya
5. Clicks download
6. Browser saves algebra.pdf
7. Backend increments download counter
```

**Day 3: Admin Checks Stats**
```
1. Admin logs in
2. Goes to admin section
3. Sees statistics:
   - Total notes: 47
   - Total downloads: 234
   - Active users: 23
```

---

## 🚀 Summary

This system works like a **shared library**:
- **Students** = readers who can borrow books
- **Teachers** = librarians who add books
- **Admin** = head librarian who manages everything
- **MongoDB** = catalog of all books
- **/uploads** = physical storage
- **Backend** = rules & access control
- **Frontend** = beautiful user interface
- **JWT** = library card

When you run `docker-compose up -d --build`, all three services start together and communicate with each other to create a complete, working application!

