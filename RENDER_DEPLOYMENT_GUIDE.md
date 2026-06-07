# 🚀 Render Deployment Guide

Deploy your Notes Management System to Render using this step-by-step guide.

## 📋 Prerequisites

Before you start, you'll need:

1. **Render Account** - Sign up at [render.com](https://render.com)
2. **GitHub Repository** - Your code must be pushed to GitHub
3. **MongoDB Atlas Account** - Sign up at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) (FREE tier available)
4. **Google OAuth Credentials** - From [Google Cloud Console](https://console.cloud.google.com)

---

## 🗄️ Step 1: Set Up MongoDB Atlas

MongoDB Atlas is a cloud-hosted MongoDB service. Render doesn't provide built-in databases, so we'll use this.

### 1a. Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click **"Start Free"**
3. Create an account with email/password or Google
4. Verify your email address

### 1b. Create a Cluster

1. After login, click **"Create a Deployment"**
2. Select **"M0 Free"** tier
3. Choose your cloud provider (AWS, Google Cloud, or Azure)
4. Select a region closest to you
5. Click **"Create Deployment"**
6. Wait 5-10 minutes for the cluster to initialize

### 1c. Create Database User

1. In the MongoDB Atlas dashboard, click **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Enter:
   - **Username**: `notesadmin` (or your choice)
   - **Password**: Generate a strong password (copy it somewhere safe!)
4. Click **"Add User"**

### 1d. Allow Network Access

1. Click **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (for development; restrict in production)
4. Click **"Confirm"**

### 1e. Get Connection String

1. Go to **"Databases"** section
2. Click **"Connect"** on your cluster
3. Select **"Drivers"**
4. Choose **"Node.js"** and version **4.1 or later**
5. Copy the connection string (looks like: `mongodb+srv://notesadmin:password@cluster.mongodb.net/database`)
6. Replace `<password>` with your database user password
7. Replace `myFirstDatabase` with `notes-management`

**Final connection string example:**
```
mongodb+srv://notesadmin:your_password@cluster0.xyz123.mongodb.net/notes-management?retryWrites=true&w=majority
```

---

## 🔐 Step 2: Prepare Environment Variables

Collect all required environment variables for both backend and frontend:

### Backend Variables (`.env`)

```
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://notesadmin:password@cluster0.xyz123.mongodb.net/notes-management?retryWrites=true&w=majority

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# CORS
CORS_ORIGIN=https://your-frontend-url.onrender.com

# Email (optional)
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Frontend Variables (`.env`)

```
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

---

## 🖼️ Step 3: Deploy Frontend to Render

### 3a. Push Code to GitHub

If not already done:

```bash
cd d:\studystack1\notes-management-system
git init
git add .
git commit -m "Initial commit for Render deployment"
git remote add origin https://github.com/your-username/notes-management-system.git
git push -u origin main
```

### 3b. Create Frontend Service on Render

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Select **"Deploy an existing repository"**
4. Search and connect your GitHub repository
5. Fill in the form:

   **Service Name**: `notes-frontend` (or your choice)
   
   **Branch**: `main`
   
   **Root Directory**: `frontend`
   
   **Runtime**: `Node`
   
   **Build Command**: 
   ```bash
   npm install && npm run build
   ```
   
   **Start Command**: 
   ```bash
   npm start
   ```
   
   **Environment Variables**: Add these:
   - `REACT_APP_API_URL` = (leave blank for now, will update after backend deployed)
   - `REACT_APP_GOOGLE_CLIENT_ID` = your Google Client ID

6. Click **"Create Web Service"**
7. Wait 5-10 minutes for deployment to complete

### 3c. Get Frontend URL

Once deployed, you'll see a URL like: `https://notes-frontend-xxx.onrender.com`

---

## 🔧 Step 4: Deploy Backend to Render

### 4a. Create Backend Service on Render

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Select your GitHub repository again
3. Fill in the form:

   **Service Name**: `notes-backend` (or your choice)
   
   **Branch**: `main`
   
   **Root Directory**: `backend`
   
   **Runtime**: `Node`
   
   **Build Command**: 
   ```bash
   npm install
   ```
   
   **Start Command**: 
   ```bash
   npm start
   ```
   
   **Environment Variables**: Add ALL variables from "Step 2" Backend section:
   - `PORT` = 5000
   - `NODE_ENV` = production
   - `MONGODB_URI` = (your MongoDB Atlas connection string)
   - `GOOGLE_CLIENT_ID` = your Client ID
   - `GOOGLE_CLIENT_SECRET` = your Client Secret
   - `JWT_SECRET` = your JWT secret
   - `CORS_ORIGIN` = (leave blank, will update after frontend URL is known)

4. Click **"Create Web Service"**
5. Wait 5-10 minutes for deployment to complete

### 4b. Get Backend URL

Once deployed, you'll see a URL like: `https://notes-backend-xxx.onrender.com`

---

## 🔄 Step 5: Update Environment Variables

Now that both services are deployed, update their environment variables:

### 5a. Update Backend CORS

1. Go to backend service on Render
2. Click **"Environment"**
3. Update `CORS_ORIGIN` to: `https://notes-frontend-xxx.onrender.com`
4. Click **"Save"** (service will redeploy automatically)

### 5b. Update Frontend API URL

1. Go to frontend service on Render
2. Click **"Environment"**
3. Update `REACT_APP_API_URL` to: `https://notes-backend-xxx.onrender.com`
4. Click **"Save"** (service will redeploy automatically)

---

## 🧪 Step 6: Test Your Deployment

### 6a. Test Backend Health

```bash
curl https://your-backend-url.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 1234.56
}
```

### 6b. Test Frontend

1. Open browser to: `https://your-frontend-url.onrender.com`
2. You should see the login page
3. Try logging in with Google OAuth

### 6c. Check Logs

If something fails:

**Backend logs:**
1. Go to backend service on Render
2. Click **"Logs"** tab
3. Look for error messages

**Frontend logs:**
1. Go to frontend service on Render
2. Click **"Logs"** tab
3. Look for build or runtime errors

---

## 📝 Environment Variables Reference

### Backend (.env) - Complete List

| Variable | Example | Required | Notes |
|----------|---------|----------|-------|
| `PORT` | 5000 | Yes | Render sets this automatically |
| `NODE_ENV` | production | Yes | Environment mode |
| `MONGODB_URI` | `mongodb+srv://...` | Yes | MongoDB Atlas connection string |
| `GOOGLE_CLIENT_ID` | xxx.apps.googleusercontent.com | Yes | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | xxx | Yes | From Google Cloud Console |
| `JWT_SECRET` | random_string_32chars+ | Yes | Generate random string |
| `CORS_ORIGIN` | https://frontend-url.onrender.com | No | Frontend URL for CORS |

### Frontend (.env) - Complete List

| Variable | Example | Required | Notes |
|----------|---------|----------|-------|
| `REACT_APP_API_URL` | https://backend-url.onrender.com | Yes | Backend API URL |
| `REACT_APP_GOOGLE_CLIENT_ID` | xxx.apps.googleusercontent.com | Yes | Same as backend |

---

## 🆘 Troubleshooting

### "MongoDB connection error"

**Problem**: Backend can't connect to MongoDB
- Check `MONGODB_URI` is correct in Render environment
- Verify username/password in connection string
- Ensure IP address is whitelisted in MongoDB Atlas Network Access

### "CORS error in browser console"

**Problem**: Frontend can't talk to backend
- Check `CORS_ORIGIN` matches frontend URL exactly
- Ensure backend `CORS_ORIGIN` is set correctly
- Wait 5 minutes after updating environment variables for changes to take effect

### "Google OAuth failing"

**Problem**: Login button doesn't work
- Check `GOOGLE_CLIENT_ID` is correct in both frontend and backend
- Verify Google Cloud Console has authorized URIs:
  - `https://your-frontend-url.onrender.com`
  - `https://your-backend-url.onrender.com`

### Services keep restarting

**Problem**: Backend or frontend crashes immediately
- Check logs for error messages
- Verify all required environment variables are set
- Ensure MongoDB connection is working

### Frontend shows blank page

**Problem**: React app doesn't load
- Check browser console (F12 → Console tab) for errors
- Verify `REACT_APP_API_URL` is set
- Check Render frontend logs for build errors

---

## 🔒 Security Checklist

Before going to production:

- [ ] Change MongoDB password
- [ ] Set strong `JWT_SECRET` (32+ characters)
- [ ] Generate new Google OAuth credentials
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS URLs only
- [ ] Restrict MongoDB IP whitelist (if possible)
- [ ] Set up Render alerts
- [ ] Enable backup strategy for data

---

## 💰 Cost Estimation

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| Render - Backend | Free | $0 (free tier) | Sleeps after 15 min inactivity |
| Render - Frontend | Free | $0 (free tier) | Sleeps after 15 min inactivity |
| MongoDB Atlas | M0 Free | $0 | 512MB storage, shared cluster |
| **Total** | | **$0/month** | ✅ Great for learning/testing |

**Upgrade when needed:**
- Render paid tier: $7-115/month (prevents auto-sleep)
- MongoDB paid tier: $57+/month (dedicated cluster)

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com)
- [Express.js Deployment](https://expressjs.com/en/advanced/best-practice-deployment.html)
- [React Deployment](https://create-react-app.dev/deployment/)

---

## ✅ Next Steps

After successful deployment:

1. Monitor logs for errors
2. Set up automatic deployments (GitHub push triggers Render redeploy)
3. Configure custom domain (Render → Settings)
4. Set up monitoring and alerts
5. Plan database migration strategy
6. Implement backup solutions

Happy deploying! 🎉
