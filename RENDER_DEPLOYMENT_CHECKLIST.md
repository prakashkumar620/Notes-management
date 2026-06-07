# Render Deployment Checklist

Complete this checklist to ensure your project is ready for Render deployment.

## ✅ Pre-Deployment Setup

### GitHub Repository
- [ ] Code is pushed to GitHub
- [ ] Repository is public (or you have GitHub Pro for private repos)
- [ ] Main branch is up to date
- [ ] `.gitignore` excludes node_modules and .env files

### MongoDB Atlas
- [ ] MongoDB Atlas account created
- [ ] Free cluster (M0) created and initialized
- [ ] Database user created with username and password
- [ ] Network access allows connections from anywhere (0.0.0.0/0)
- [ ] Connection string copied: `mongodb+srv://username:password@cluster.mongodb.net/notes-management`

### Google OAuth
- [ ] Google Cloud Console project created
- [ ] OAuth 2.0 credentials generated (Client ID & Secret)
- [ ] Authorized JavaScript origins configured:
  - [ ] `http://localhost:3000` (local development)
  - [ ] `https://your-frontend-url.onrender.com` (Render frontend)
- [ ] Authorized redirect URIs configured:
  - [ ] `http://localhost:5000/api/auth/callback` (local)
  - [ ] `https://your-backend-url.onrender.com/api/auth/callback` (Render backend)

### Render Account
- [ ] Render account created
- [ ] GitHub account connected to Render
- [ ] Email verified

---

## 🚀 Deployment Steps

### Step 1: Frontend Deployment
- [ ] Go to Render dashboard
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set Root Directory to: `frontend`
- [ ] Set Build Command: `npm install && npm run build`
- [ ] Set Start Command: `npm start`
- [ ] Add Environment Variables:
  - [ ] `REACT_APP_GOOGLE_CLIENT_ID` = your_client_id
  - [ ] `REACT_APP_API_URL` = (leave empty, update later)
- [ ] Click Create Web Service
- [ ] Wait for deployment to complete (5-10 minutes)
- [ ] Copy frontend URL: `https://notes-frontend-xxx.onrender.com`

### Step 2: Backend Deployment
- [ ] Go to Render dashboard
- [ ] Create new Web Service
- [ ] Connect GitHub repository (same repo)
- [ ] Set Root Directory to: `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Add Environment Variables:
  - [ ] `PORT` = 5000
  - [ ] `NODE_ENV` = production
  - [ ] `MONGODB_URI` = your_mongodb_connection_string
  - [ ] `GOOGLE_CLIENT_ID` = your_client_id
  - [ ] `GOOGLE_CLIENT_SECRET` = your_client_secret
  - [ ] `JWT_SECRET` = your_random_32_char_string
  - [ ] `CORS_ORIGIN` = (leave empty, update later)
- [ ] Click Create Web Service
- [ ] Wait for deployment to complete (5-10 minutes)
- [ ] Copy backend URL: `https://notes-backend-xxx.onrender.com`

### Step 3: Update Environment Variables
- [ ] Go to backend service settings
- [ ] Update `CORS_ORIGIN` = frontend_url
- [ ] Save (service redeploys)
- [ ] Go to frontend service settings
- [ ] Update `REACT_APP_API_URL` = backend_url
- [ ] Save (service redeploys)

---

## 🧪 Testing & Validation

### Backend Tests
- [ ] Test health endpoint: `curl https://your-backend-url/health`
- [ ] Check backend logs for errors
- [ ] Verify MongoDB connection in logs

### Frontend Tests
- [ ] Open frontend URL in browser
- [ ] Verify page loads without errors
- [ ] Open browser DevTools (F12) → Console for JavaScript errors
- [ ] Test Google login button
- [ ] Test creating a note
- [ ] Test logging out

### Integration Tests
- [ ] Login works with Google OAuth
- [ ] Create note successfully
- [ ] View notes on dashboard
- [ ] Update/delete notes
- [ ] Logout and login again

---

## 🔐 Security Validation

- [ ] No hardcoded secrets in code
- [ ] `.env` files are in `.gitignore`
- [ ] `JWT_SECRET` is strong (32+ random characters)
- [ ] `MONGODB_URI` password is secure
- [ ] CORS is restricted to your frontend domain
- [ ] Google OAuth credentials are not exposed
- [ ] No sensitive data in browser console logs

---

## 📊 Post-Deployment Checklist

- [ ] Monitor backend logs for errors (first 24 hours)
- [ ] Monitor frontend logs for errors (first 24 hours)
- [ ] Set up Render alerts for service failures
- [ ] Test performance with multiple concurrent users
- [ ] Verify database backups are enabled (if using paid tier)
- [ ] Document any custom configurations
- [ ] Share deployment URLs with team
- [ ] Plan upgrade path when free tier has limitations

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't deploy | Check logs, verify all env vars are set |
| "Cannot connect to MongoDB" | Verify MONGODB_URI, check IP whitelist |
| "CORS error in browser" | Update CORS_ORIGIN to match frontend URL |
| "Google login fails" | Add Render URLs to Google OAuth authorized URIs |
| "Frontend shows blank page" | Check browser console logs, verify API_URL |
| "Service keeps crashing" | Check logs for errors, ensure all required env vars exist |

---

## 📝 Important URLs & Credentials

Save these somewhere safe (not in git):

| Item | Value | Status |
|------|-------|--------|
| Frontend URL | `https://notes-frontend-xxx.onrender.com` | [ ] |
| Backend URL | `https://notes-backend-xxx.onrender.com` | [ ] |
| MongoDB User | `notesadmin` | [ ] |
| MongoDB Password | `••••••••••` | [ ] |
| Google Client ID | `xxx.apps.googleusercontent.com` | [ ] |
| Google Client Secret | `••••••••••` | [ ] |
| JWT Secret | `••••••••••••••••` | [ ] |

---

## 💡 Tips for Success

✅ **Do:**
- Start with free tier to test
- Keep environment variables organized
- Monitor logs regularly
- Set up automatic GitHub → Render deployments
- Backup important data

❌ **Don't:**
- Commit `.env` files to GitHub
- Use weak passwords
- Share credentials in chat/email
- Ignore error logs
- Delete services without backup

---

Last Updated: January 2024
