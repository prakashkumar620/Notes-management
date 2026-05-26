# 🚀 How to Run the Project

## ✅ Prerequisites (Before You Start)

Make sure you have these installed:
- ✅ **Docker Desktop** (Windows/Mac) or Docker Engine (Linux)
- ✅ **Git** (to clone/manage code)
- ✅ **.env files configured** (with Google OAuth credentials and JWT secret)

---

## 📋 Step-by-Step Startup Guide

### Step 1: Start Docker Desktop (Windows/Mac)

**If you haven't started Docker yet:**

1. **Open Start Menu** → Search "Docker Desktop"
2. **Click Docker Desktop** to launch it
3. **Wait 1-2 minutes** for it to fully start
4. **Look for Docker icon** in system tray (bottom-right)
5. **Verify it's running:**
   ```powershell
   docker --version
   # Should show: Docker version 29.2.1 or similar
   ```

**If Docker is already running, skip to Step 2.**

---

### Step 2: Open Terminal/PowerShell

```powershell
# On Windows: Open PowerShell
# Navigate to the docker folder
cd D:\studystack1\notes-management-system\devops\docker
```

**Verify you're in the right location:**
```powershell
# You should see these files:
ls
# Output should include:
# - docker-compose.yml
# - .env
# - Dockerfile.backend
# - Dockerfile.frontend
```

---

### Step 3: Start All Services

**Run this single command:**
```powershell
docker-compose up -d --build
```

**What this does:**
- `-d` = run in background (detached mode)
- `--build` = rebuild Docker images (use latest code)

**This will:**
1. ✅ Build the backend image
2. ✅ Build the frontend image
3. ✅ Start MongoDB container
4. ✅ Start Backend container
5. ✅ Start Frontend container
6. ✅ Connect all services together

**Expected output:**
```
Creating network "docker_notes-network" with driver "bridge"
Creating volume "docker_mongodb_data" with local driver
Building backend
...
Building frontend
...
Creating notes-mongodb ... done
Creating notes-backend ... done
Creating notes-frontend ... done
```

---

### Step 4: Wait for Services to Start

**Services need time to initialize:**
- MongoDB: ~10 seconds
- Backend: ~20 seconds
- Frontend: ~30 seconds

**Total startup time: ~45-60 seconds**

---

### Step 5: Verify All Services Are Running

**Check if containers are running:**
```powershell
docker ps
```

**Expected output:**
```
CONTAINER ID   IMAGE                    PORTS                    NAMES
abc123         docker_notes-backend     0.0.0.0:5000->5000/tcp   notes-backend
def456         docker_notes-frontend    0.0.0.0:3000->80/tcp     notes-frontend
ghi789         mongo:latest             0.0.0.0:27017->27017/tcp notes-mongodb
```

**All 3 containers should show status: UP**

---

### Step 6: Check Service Health

**Check MongoDB health:**
```powershell
docker logs notes-mongodb | tail -20
```
Look for: `waiting for connections on port 27017`

**Check Backend health:**
```powershell
docker logs notes-backend | tail -20
```
Look for: `Server running on port 5000`

**Check Frontend health:**
```powershell
docker logs notes-frontend | tail -20
```
Look for: `nginx: master process`

---

### Step 7: Test Backend API

**Check if backend is responding:**
```powershell
curl http://localhost:5000/health
```

**Expected response:**
```json
{
  "status": "up",
  "uptime": 123.456,
  "timestamp": "2026-05-15T..."
}
```

Or simply visit in browser:
```
http://localhost:5000/health
```

---

### Step 8: Open the Application

**Open your browser and visit:**
```
http://localhost:3000
```

**You should see:**
- 📚 "Study Stack" title
- 🔐 "Login with Google" button
- Beautiful purple gradient background

---

## 🔐 Step 9: Login with Google

**Click "Login with Google" button:**

1. Browser redirects to Google login
2. Enter your Google email and password
3. Google asks for permission (click "Allow")
4. Redirects back to http://localhost:3000
5. **You're now logged in!**

**You should see:**
- Your profile picture
- Your name
- Your email
- "Logout" button
- Dashboard with notes (if any exist)

---

## 📝 Step 10: Test the Features

### Test 1: Upload a Note (If you have Teacher role)

1. Click "Upload Notes" button
2. Fill in:
   - **Title**: "Test Note"
   - **Description**: "This is a test"
   - **Select File**: Any PDF or image
   - **Access Level**: "All"
3. Click "Upload"
4. See success notification
5. Note appears in the list

### Test 2: View Notes

1. Look at "Recent Notes" section
2. Click on any note to see details
3. See uploader name, size, views

### Test 3: Download a Note

1. Find any note in the list
2. Click "Download" button
3. File downloads to your computer

### Test 4: View as Different Role

1. Logout (click Logout)
2. Login with different Google account
3. See different permissions/options

---

## 🛑 Stopping the Project

**Stop all services:**
```powershell
cd D:\studystack1\notes-management-system\devops\docker
docker-compose down
```

**Stop and remove all data (⚠️ destructive):**
```powershell
docker-compose down -v
```

**Just pause (containers still exist):**
```powershell
docker-compose stop
```

---

## 🔍 Monitoring & Logs

### View Real-Time Logs

**All containers:**
```powershell
docker-compose logs -f
```

**Just backend:**
```powershell
docker-compose logs -f backend
```

**Just frontend:**
```powershell
docker-compose logs -f frontend
```

**Just MongoDB:**
```powershell
docker-compose logs -f mongodb
```

**Exit logs:** Press `Ctrl + C`

---

## 🐛 Troubleshooting

### Issue: "Docker daemon is not running"
```
❌ Error: unable to get image docker-backend
Solution: Start Docker Desktop (see Step 1)
```

### Issue: "Port 3000 already in use"
```
❌ Error: bind: address already in use
Solution: 
docker ps | findstr 3000
docker kill <container_id>
# OR change port in docker-compose.yml
```

### Issue: "Port 5000 already in use"
```
❌ Error: bind: address already in use
Solution:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: "Connection refused" when accessing http://localhost:3000
```
❌ Error: refused to connect
Solution:
1. Wait 30-60 seconds (services still starting)
2. Check: docker ps (all 3 containers UP?)
3. Check logs: docker-compose logs frontend
4. Restart: docker-compose restart
```

### Issue: "Cannot login with Google"
```
❌ Error: OAuth not configured
Solution:
1. Check Google credentials in .env file
2. Verify credentials are correct (no typos)
3. Check Google Console redirect URIs
4. Clear browser cookies and try again
```

### Issue: "Notes not uploading"
```
❌ Error: Upload fails
Solution:
1. Check file size (max 50MB)
2. Check file type (PDF, JPT, PNG, PPT only)
3. Check backend logs: docker logs notes-backend
4. Check file permissions in uploads folder
```

### Issue: "Cannot download files"
```
❌ Error: Download fails
Solution:
1. Check file exists: docker exec notes-backend ls -la /app/uploads
2. Check permissions
3. Check backend logs
```

### Issue: "MongoDB not connecting"
```
❌ Error: MongoDB connection failed
Solution:
1. Check MongoDB is running: docker ps | findstr mongodb
2. Wait for MongoDB to start (takes 10-15 seconds)
3. Check credentials in .env
4. Check logs: docker logs notes-mongodb
```

---

## 📊 Quick Reference Commands

```powershell
# Start everything
docker-compose up -d --build

# View running containers
docker ps

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Remove everything (data too)
docker-compose down -v

# Restart a service
docker-compose restart backend

# Rebuild images
docker-compose build --no-cache

# Check network
docker network ls

# Inspect a service
docker inspect notes-backend

# Execute command in container
docker exec -it notes-backend sh

# View container stats
docker stats
```

---

## ✅ Success Checklist

After running the project, verify:

- [ ] Docker Desktop is running
- [ ] All 3 containers visible in `docker ps`
- [ ] Backend responds: `http://localhost:5000/health`
- [ ] Frontend loads: `http://localhost:3000`
- [ ] Can login with Google
- [ ] Dashboard displays correctly
- [ ] Can see/upload/download notes
- [ ] No errors in logs

---

## 🎯 Accessing Different Services

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | User interface |
| Backend API | http://localhost:5000 | REST API |
| MongoDB | localhost:27017 | Database |
| Health Check | http://localhost:5000/health | API status |

---

## 📈 Performance Tips

**If system is slow:**

1. **Increase Docker resources:**
   - Docker Desktop → Settings → Resources
   - CPU: at least 4 cores
   - Memory: at least 4GB

2. **Clear Docker cache:**
   ```powershell
   docker system prune -a
   ```

3. **Rebuild without cache:**
   ```powershell
   docker-compose build --no-cache
   ```

---

## 🚀 Quick Start Summary

```powershell
# 1. Start Docker Desktop (wait for system tray icon)

# 2. Navigate to docker folder
cd D:\studystack1\notes-management-system\devops\docker

# 3. Start services
docker-compose up -d --build

# 4. Wait 45-60 seconds for startup

# 5. Open browser
http://localhost:3000

# 6. Login with Google

# 7. Done! Start using the app
```

---

## 💡 Next Steps After Running

1. **Explore the Dashboard**: Click around, get familiar with UI
2. **Upload a Test Note**: Test file upload functionality
3. **Test Download**: Download the note you uploaded
4. **Check Backend Logs**: See what's happening: `docker logs notes-backend`
5. **Review Code**: Look at source files in `frontend/src/` and `backend/src/`
6. **Modify and Rebuild**: Change code and restart services

---

## 📞 Need Help?

| Issue | File to Check |
|-------|---------------|
| Services won't start | `docker-compose logs` |
| Backend errors | `backend/.env`, `docker logs notes-backend` |
| Frontend errors | `frontend/.env`, browser console |
| Database issues | `docker logs notes-mongodb` |
| Configuration errors | `devops/docker/.env` |

---

## 🎉 You're Ready!

Everything is configured. Just run:
```powershell
docker-compose up -d --build
```

And visit **http://localhost:3000** 🚀

