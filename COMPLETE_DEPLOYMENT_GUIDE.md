# 🚀 Complete Deployment Guide - Full-Stack Application

## Overview

This guide covers deploying both backend (Render) and frontend (Vercel) with complete configuration and troubleshooting.

---

## 📋 Pre-Deployment Checklist

### Backend (Render)
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string obtained
- [ ] Render account created
- [ ] GitHub repository connected

### Frontend (Vercel)
- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Environment variables prepared

---

## 🔧 BACKEND DEPLOYMENT (Render)

### Step 1: Prepare Backend Configuration

**File: `server/package.json`** ✅ Already configured
```json
{
  "scripts": {
    "start": "node src/server.js"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

**File: `server/src/server.js`** ✅ Already configured
- Listens on `0.0.0.0` (Render compatible)
- Uses `process.env.PORT` (Render provides this)
- Handles graceful shutdown

**File: `server/src/app.js`** ✅ CORS configured
- Allows `*.vercel.app` domains
- Allows `FRONTEND_URL` environment variable
- Development mode allows all origins

### Step 2: Create Render Web Service

1. **Go to Render Dashboard**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service:**
   - **Name:** `bug-tracker-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Root Directory:** (leave empty - uses repo root)

3. **Set Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-atlas-connection-string
   FRONTEND_URL=https://your-app.vercel.app (optional - wildcard covers it)
   PORT=10000 (Render sets this automatically)
   ```

4. **Advanced Settings:**
   - **Auto-Deploy:** Yes
   - **Branch:** `main` (or your main branch)
   - **Health Check Path:** `/api/health`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the service URL (e.g., `https://bug-tracker-backend-na6z.onrender.com`)

### Step 3: Verify Backend Deployment

**Test Health Endpoint:**
```bash
curl https://bug-tracker-backend-na6z.onrender.com/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "ok",
  "message": "API is healthy",
  "environment": "production"
}
```

**Test API Endpoint:**
```bash
curl https://bug-tracker-backend-na6z.onrender.com/api/bugs
```

Should return empty array `[]` or existing bugs.

---

## 🎨 FRONTEND DEPLOYMENT (Vercel)

### Step 1: Verify Frontend Configuration

**File: `client/package.json`** ✅ Already configured
```json
{
  "scripts": {
    "build": "vite build",
    "vercel-build": "vite build && echo 'Build completed - dist folder should exist'"
  }
}
```

**File: `client/vite.config.js`** ✅ Already configured
```javascript
build: {
  outDir: 'dist',  // Creates dist folder
}
```

**File: `client/index.html`** ✅ Exists in client root

### Step 2: Verify vercel.json

**File: `vercel.json`** (Project Root) ✅ Configured
```json
{
  "version": 2,
  "buildCommand": "cd client && CI=false npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "cd client && npm install",
  "framework": "vite",
  "env": {
    "VITE_API_BASE_URL": "https://bug-tracker-backend-na6z.onrender.com",
    "VITE_NODE_ENV": "production"
  },
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Step 3: Deploy to Vercel

**Option A: Via Vercel Dashboard (Recommended)**

1. **Go to Vercel Dashboard**
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure Project:**
   - **Framework Preset:** Vite (or Other)
   - **Root Directory:** (leave empty - uses repo root)
   - **Build Command:** `cd client && npm run build` (or leave default)
   - **Output Directory:** `client/dist`
   - **Install Command:** `cd client && npm install` (or leave default)

3. **Set Environment Variables:**
   - `VITE_API_BASE_URL` = `https://bug-tracker-backend-na6z.onrender.com`
   - `VITE_NODE_ENV` = `production`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Note the deployment URL

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Step 4: Verify Frontend Deployment

1. **Check Build Logs:**
   - Should show: `✓ built in X.XXs`
   - Should show: `dist/index.html`
   - Should show: `dist/assets/...`

2. **Visit Deployment URL:**
   - App should load
   - Check browser console for errors
   - Verify API calls go to Render backend

---

## 🔗 CONNECTING FRONTEND TO BACKEND

### Environment Variables

**Frontend (Vercel):**
- `VITE_API_BASE_URL` = `https://bug-tracker-backend-na6z.onrender.com`
- `VITE_NODE_ENV` = `production`

**Backend (Render):**
- `NODE_ENV` = `production`
- `MONGODB_URI` = Your MongoDB connection string
- `FRONTEND_URL` = Your Vercel URL (optional)

### API Configuration

**File: `client/src/services/bugService.js`** ✅ Already configured
- Uses `import.meta.env.VITE_API_BASE_URL`
- Appends `/api` suffix automatically
- Falls back to localhost in development

### CORS Configuration

**File: `server/src/app.js`** ✅ Already configured
- Allows `*.vercel.app` domains (wildcard)
- Allows `FRONTEND_URL` if set
- Allows localhost for development

---

## 🧪 TESTING DEPLOYMENT

### Test Backend

```bash
# Health check
curl https://bug-tracker-backend-na6z.onrender.com/api/health

# Get bugs
curl https://bug-tracker-backend-na6z.onrender.com/api/bugs

# Create bug
curl -X POST https://bug-tracker-backend-na6z.onrender.com/api/bugs \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Bug","description":"Test","priority":"medium","status":"open"}'
```

### Test Frontend

1. **Open deployed frontend URL**
2. **Open browser console**
3. **Check for:**
   - No CORS errors
   - API calls going to Render backend
   - App functionality working

### Run Verification Script

```bash
# Set environment variables
export VITE_API_BASE_URL=https://bug-tracker-backend-na6z.onrender.com
export FRONTEND_URL=https://your-app.vercel.app

# Run verification
node deployment/verify-deployment.js
```

---

## 🐛 TROUBLESHOOTING

### Backend Issues

**Issue: Backend won't start**
- **Check:** MongoDB connection string is correct
- **Check:** Environment variables are set in Render
- **Check:** Build logs for errors

**Issue: CORS errors**
- **Check:** Frontend URL matches allowed origins
- **Check:** `FRONTEND_URL` is set correctly
- **Check:** CORS middleware is configured

**Issue: Database connection fails**
- **Check:** MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- **Check:** Connection string is correct
- **Check:** Database user has proper permissions

### Frontend Issues

**Issue: "No Output Directory named 'dist' found"**
- **Check:** Dependencies are installed (`npm install`)
- **Check:** Build command runs successfully
- **Check:** `vite.config.js` has `outDir: 'dist'`
- **Check:** Build logs show dist folder creation

**Issue: API calls fail**
- **Check:** `VITE_API_BASE_URL` is set correctly
- **Check:** Backend is running and accessible
- **Check:** CORS is configured on backend
- **Check:** Browser console for errors

**Issue: Routes return 404**
- **Check:** `vercel.json` routes configuration
- **Check:** SPA routing is configured (`dest: "/index.html"`)

---

## 📊 DEPLOYMENT STATUS CHECKLIST

### Backend (Render)
- [ ] Service created and deployed
- [ ] Health check returns 200 OK
- [ ] API endpoints respond correctly
- [ ] MongoDB connected successfully
- [ ] CORS configured for frontend domain
- [ ] Environment variables set

### Frontend (Vercel)
- [ ] Project created and deployed
- [ ] Build completes successfully
- [ ] `dist` folder is created
- [ ] App loads without errors
- [ ] API calls go to Render backend
- [ ] No CORS errors in console
- [ ] Environment variables set

### Integration
- [ ] Frontend can fetch bugs from backend
- [ ] Frontend can create bugs
- [ ] Frontend can update bugs
- [ ] Frontend can delete bugs
- [ ] All CRUD operations work

---

## 🔄 UPDATE DEPLOYMENT

### Backend Updates

1. **Push changes to GitHub**
2. **Render auto-deploys** (if enabled)
3. **Or manually deploy** from Render dashboard

### Frontend Updates

1. **Push changes to GitHub**
2. **Vercel auto-deploys** (if enabled)
3. **Or manually deploy** from Vercel dashboard

---

## 📝 ENVIRONMENT VARIABLES REFERENCE

### Backend (Render)

| Variable | Value | Required |
|---------|-------|----------|
| `NODE_ENV` | `production` | ✅ Yes |
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ Yes |
| `FRONTEND_URL` | Your Vercel URL | ⚠️ Optional |
| `PORT` | Auto-set by Render | ❌ No |

### Frontend (Vercel)

| Variable | Value | Required |
|---------|-------|----------|
| `VITE_API_BASE_URL` | `https://bug-tracker-backend-na6z.onrender.com` | ✅ Yes |
| `VITE_NODE_ENV` | `production` | ✅ Yes |

---

## ✅ SUCCESS CRITERIA

Your deployment is successful when:

1. ✅ Backend health check returns 200 OK
2. ✅ Frontend builds and deploys successfully
3. ✅ Frontend loads without errors
4. ✅ API calls work from frontend to backend
5. ✅ No CORS errors
6. ✅ All CRUD operations work
7. ✅ Database persists data correctly

---

## 🎉 DEPLOYMENT COMPLETE

Once all checks pass:

1. ✅ Backend: `https://bug-tracker-backend-na6z.onrender.com`
2. ✅ Frontend: `https://your-app.vercel.app`
3. ✅ Integration: Frontend ↔ Backend working
4. ✅ Database: MongoDB connected
5. ✅ CORS: Configured correctly

**Your full-stack application is now live! 🚀**

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)

---

**Last Updated:** $(date)  
**Backend URL:** https://bug-tracker-backend-na6z.onrender.com  
**Status:** ✅ Ready for Deployment

