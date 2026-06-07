# Render Deployment - Troubleshooting Guide

Having issues with your Render deployment? Use this guide to diagnose and fix common problems.

---

## 🔍 How to Check Logs

### Frontend Logs
1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click on your frontend service (`notes-frontend-xxx`)
3. Click **"Logs"** tab at the top
4. Look for red/error messages or last deployment output

### Backend Logs
1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click on your backend service (`notes-backend-xxx`)
3. Click **"Logs"** tab at the top
4. Look for red/error messages or MongoDB connection logs

---

## 🔴 Database Connection Issues

### Problem: "Cannot connect to MongoDB" / "MongoDB connection timeout"

**Where you see it:**
- Backend logs show: `✗ MongoDB connection error: connect ECONNREFUSED`
- Or: `Error: MongooseError: can't connect to MongoDB...`

**Causes & Fixes:**

1. **Wrong Connection String**
   ```
   ❌ Incorrect format: mongodb://localhost:27017/notes-management
   ✅ Correct format: mongodb+srv://username:password@cluster.mongodb.net/database
   ```
   - Go to backend service → Settings → Environment
   - Copy connection string from MongoDB Atlas again
   - Make sure password is correct (no special chars should be encoded)

2. **Wrong Password**
   - Log into MongoDB Atlas
   - Go to Database Access
   - Check your user password
   - If unsure, edit user and set new password
   - Update MONGODB_URI in Render

3. **IP Not Whitelisted**
   - Render uses dynamic IPs, so use "0.0.0.0/0" for now
   - Go to MongoDB Atlas → Network Access
   - Look for "0.0.0.0/0" in the list
   - If missing, add it: Click "Add IP" → "Allow access from anywhere"

4. **Cluster Not Ready**
   - MongoDB Atlas clusters take 5-10 minutes to initialize
   - Check cluster status in MongoDB Atlas dashboard
   - If status is "Provisioning", wait until "Available"

**Test Fix:**
```bash
# After fixing, check backend health endpoint
curl https://your-backend-url.onrender.com/health

# Should return healthy status
```

---

## 🌐 CORS (Cross-Origin) Issues

### Problem: "CORS error" in browser console

**Where you see it:**
```
Access to XMLHttpRequest at 'https://backend-url...' 
from origin 'https://frontend-url...' has been blocked by CORS policy
```

**In browser:** Check DevTools (F12) → Console tab

**Causes & Fixes:**

1. **CORS_ORIGIN Not Set**
   - Go to backend service → Settings → Environment
   - Check if `CORS_ORIGIN` is set
   - Should be exactly: `https://notes-frontend-xxx.onrender.com` (no trailing slash)
   - If empty or wrong, update it and save

2. **CORS_ORIGIN Doesn't Match Frontend URL**
   ```
   ❌ Wrong: https://notes-frontend-abc123.onrender.com/ (has trailing slash)
   ✅ Correct: https://notes-frontend-abc123.onrender.com
   ```
   - Check frontend URL from browser address bar
   - Copy exact URL to CORS_ORIGIN
   - Save and wait 2 minutes for restart

3. **Typo in Environment Variable Name**
   ```
   ❌ Wrong: CORS_Origin, Cors_Origin, cors_origin
   ✅ Correct: CORS_ORIGIN (all caps with underscore)
   ```

**Test Fix:**
```javascript
// In browser DevTools console, try:
fetch('https://your-backend-url.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

Should show healthy status without CORS error.

---

## 🔐 Google OAuth Login Issues

### Problem: "Google login button doesn't work" or shows error

**Where you see it:**
- Click Google login button → nothing happens or error appears
- Console error about redirect_uri_mismatch

**Causes & Fixes:**

1. **Frontend Google Client ID Wrong**
   - Go to frontend service → Settings → Environment
   - Check `REACT_APP_GOOGLE_CLIENT_ID`
   - Must match the one in backend
   - Copy from Google Cloud Console and update

2. **Google OAuth URLs Not Configured**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Find your project
   - Go to APIs & Services → Credentials
   - Find your OAuth 2.0 Client ID
   - Click it to edit
   - Add these URLs if missing:
     - **JavaScript origins:**
       - `https://notes-frontend-xxx.onrender.com`
     - **Authorized redirect URIs:**
       - `https://notes-backend-xxx.onrender.com/api/auth/callback`

3. **Client ID/Secret Wrong in Backend**
   - Go to backend service → Settings → Environment
   - Verify `GOOGLE_CLIENT_ID` matches Client ID in Google Console
   - Verify `GOOGLE_CLIENT_SECRET` matches Client Secret
   - If wrong, get correct values from Google Console

4. **Frontend API URL Not Pointing to Backend**
   - Go to frontend service → Settings → Environment
   - Check `REACT_APP_API_URL` is set
   - Must be exactly: `https://notes-backend-xxx.onrender.com`
   - Frontend calls backend to process OAuth

**Test Fix:**
```
1. Open https://your-frontend-url.onrender.com
2. Click Google login button
3. Should open Google login popup
4. If redirects to error page, check Google Console authorized URLs
```

---

## 📄 Frontend Blank Page or Build Errors

### Problem: "Frontend shows blank page" or "Frontend won't deploy"

**Where you see it:**
- Open frontend URL → shows nothing
- Render deployment log shows build failed

**Causes & Fixes:**

1. **Build Command Failed**
   - Go to frontend service → Logs
   - Look for: `FAILED` or `error` keyword
   - Common issues:
     - Missing dependencies: `npm install && npm run build`
     - Wrong root directory: Set to `frontend`
     - Node version issue: Set to Node 18+

2. **Missing Environment Variables**
   - Frontend needs `REACT_APP_*` variables
   - Go to frontend service → Environment
   - Add required variables:
     - `REACT_APP_GOOGLE_CLIENT_ID`
     - `REACT_APP_API_URL`
   - After adding, click Save (triggers rebuild)

3. **JavaScript Errors in Browser**
   - Open frontend URL
   - Press F12 → Console tab
   - Look for red error messages
   - Common causes:
     - `REACT_APP_API_URL` not set
     - Syntax error in code
     - Missing dependency

4. **API_URL Broken (Frontend Can't Talk to Backend)**
   - Go to frontend service → Environment
   - Check `REACT_APP_API_URL` value
   - Test it manually:
     ```bash
     curl https://your-backend-url.onrender.com/health
     ```
   - If request fails, backend isn't running

**Test Fix:**
```
1. Go to frontend service → Logs
2. Look for "Deployed successfully" message
3. Open frontend URL
4. Press F12 → Console should be clean (no red errors)
```

---

## 🔴 Service Keep Restarting / Crashing

### Problem: "Service keeps restarting" or "Critical failure: Service exited with code 1"

**Where you see it:**
- Service shows "Redeploying" status constantly
- Logs show crash immediately after startup

**Causes & Fixes:**

1. **Missing Required Environment Variables**
   - Backend needs: `MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - Go to service → Environment
   - Verify all required vars are set (not empty)
   - Variables might be referenced in code (typo in name)

2. **Database Connection Fails**
   - Backend can't start if it can't connect to MongoDB
   - See "Database Connection Issues" section above
   - Check `MONGODB_URI` is correct and accessible

3. **Port Already in Use**
   - Render assigns ports automatically
   - Don't hardcode PORT in code
   - Use: `const PORT = process.env.PORT || 5000`

4. **Out of Memory**
   - Free tier Render has limited RAM
   - Look for "ENOMEM" in logs
   - Restart service manually or upgrade

**Test Fix:**
```
1. Go to service → Logs
2. Look for "✓ Server running" or "✓ MongoDB connected"
3. If not there, error is preventing startup
4. Check error messages above logs
```

---

## 🌍 Service Is Running But Not Accessible

### Problem: "Backend/Frontend returns 404 or Connection Refused"

**Where you see it:**
- `curl https://your-url.onrender.com` returns 404
- Browser shows "Cannot GET /"

**Causes & Fixes:**

1. **Service Not Finished Deploying**
   - Render takes 5-10 minutes to deploy
   - Go to service dashboard
   - Look for "Deployed successfully" message
   - If still "Deploying", wait longer

2. **Wrong Root Directory**
   - Check service settings
   - Backend should have Root: `backend`
   - Frontend should have Root: `frontend`
   - If wrong, update and redeploy

3. **Wrong Start Command**
   - Backend: `npm start`
   - Frontend: `npm start`
   - Go to service → Settings
   - Verify Start Command matches above

4. **Service Sleeping (Free Tier)**
   - Free Render services sleep after 15 minutes of inactivity
   - First request wakes it up (takes 30 seconds)
   - This is normal - upgrade to paid if need 24/7

**Test Fix:**
```bash
# Test from terminal
curl -I https://your-backend-url.onrender.com/health

# Should show 200 OK
```

---

## 🔄 Changes Not Reflected After Deploy

### Problem: "I updated code/env vars but changes didn't apply"

**Where you see it:**
- Updated `.env` variables but app uses old values
- Pushed code to GitHub but Render still shows old version

**Causes & Fixes:**

1. **Environment Variables Not Saved**
   - Go to service → Settings → Environment
   - Make changes to variables
   - **CLICK SAVE** (don't just close the tab)
   - Service auto-redeploys after save

2. **Didn't Commit Code to GitHub**
   - Render pulls from GitHub automatically
   - Make sure code is committed:
     ```bash
     git add .
     git commit -m "Updated for Render"
     git push origin main
     ```

3. **Wrong Branch**
   - Render might be set to wrong branch
   - Go to service → Settings
   - Check "Branch" is set to `main` (or your branch)

4. **Manual Deploy Needed**
   - Go to service dashboard
   - Click "Manual Deploy" → "Deploy latest commit"
   - This forces Render to rebuild

5. **Clear Browser Cache**
   - Frontend is cached in browser
   - Press Ctrl+Shift+Del (or Cmd+Shift+Del on Mac)
   - Clear all cache
   - Reload page

**Test Fix:**
```bash
# For environment variables
curl https://your-backend-url.onrender.com/health

# For code changes
# Check browser console (F12) for version or unique identifier
```

---

## 🚨 General Debugging Workflow

When something isn't working:

1. **Check Service Status**
   - Go to dashboard
   - Is service "Running" or "Deploying" or "Failed"?

2. **Check Logs**
   - Click Logs tab
   - Look for error messages (red text)
   - Check last 50 lines for clues

3. **Check Environment Variables**
   - Go to Settings → Environment
   - Verify all required vars are set
   - Look for typos in variable names

4. **Test Health Endpoint**
   ```bash
   # For backend
   curl https://your-backend-url.onrender.com/health
   ```

5. **Test Frontend**
   - Open in browser
   - Press F12 → Console
   - Look for JavaScript errors

6. **Restart Service**
   - Click the menu (three dots)
   - Select "Restart"
   - This often fixes temporary issues

7. **Check GitHub**
   - Verify code is on the branch Render is watching
   - Recent commits should be there

---

## 📞 When All Else Fails

1. **Ask Render Support**
   - Go to render.com/support
   - Provide service name, error message, and logs

2. **Ask Community**
   - Render Discord: [discord.gg/render](https://discord.gg/render)
   - Stack Overflow tag: `render-platform`

3. **Hard Reset**
   - Delete service on Render
   - Create fresh service with correct settings
   - Takes 5 minutes

---

## ✅ Quick Health Check

Run this periodically to ensure everything is working:

```bash
# Check backend health
curl https://your-backend-url.onrender.com/health

# Should return:
# {"status":"healthy","timestamp":"2024-01-15T...","uptime":123}

# Check frontend loads
curl -I https://your-frontend-url.onrender.com

# Should return:
# HTTP/1.1 200 OK
```

---

**Last Updated**: January 2024
