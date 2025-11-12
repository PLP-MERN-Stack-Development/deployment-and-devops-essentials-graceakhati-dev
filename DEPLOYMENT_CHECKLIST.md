# 🚀 Deployment Checklist

## Pre-Deployment Configuration

### ✅ 1. Environment Files Setup

#### Create `client/.env.production`
Create this file in the `client` directory with the following content:

```env
# Production Environment Variables
# Used when building for production deployment (Vercel)

# Backend API Base URL (Render deployment)
# Note: Include /api suffix as the service expects it
REACT_APP_API_BASE_URL=https://bug-tracker-backend-na6z.onrender.com/api

# For Vite compatibility (if migrating to Vite in future)
VITE_API_BASE_URL=https://bug-tracker-backend-na6z.onrender.com/api
```

#### Create `client/.env` (for local development)
Create this file in the `client` directory with the following content:

```env
# Development Environment Variables
# Used for local development

# Backend API Base URL (local development server)
# Note: Include /api suffix as the service expects it
REACT_APP_API_BASE_URL=http://localhost:5000/api

# For Vite compatibility (if migrating to Vite in future)
VITE_API_BASE_URL=http://localhost:5000/api
```

**Important:** These files are gitignored, so you'll need to create them manually or use:
```bash
# Windows PowerShell
New-Item -Path "client\.env.production" -ItemType File -Force
New-Item -Path "client\.env" -ItemType File -Force

# Linux/Mac
touch client/.env.production
touch client/.env
```

### ✅ 2. Backend CORS Configuration

The backend CORS has been updated to allow:
- ✅ Vercel deployment URLs (wildcard: `*.vercel.app`)
- ✅ Custom frontend URL from `FRONTEND_URL` environment variable
- ✅ Localhost for development

**Backend Environment Variable (Render):**
Set `FRONTEND_URL` in your Render backend service to your Vercel frontend URL (optional, as wildcard covers it).

### ✅ 3. Vercel Environment Variables

When deploying to Vercel, you can set environment variables in two ways:

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add the following:
   - `REACT_APP_API_BASE_URL` = `https://bug-tracker-backend-na6z.onrender.com/api`
   - `VITE_API_BASE_URL` = `https://bug-tracker-backend-na6z.onrender.com/api` (for future Vite migration)

#### Option B: Via `vercel.json` (Already configured)
The `deployment/vercel.json` file already includes the environment variables. However, Vercel CLI deployments may require setting them via dashboard or CLI.

**Using Vercel CLI:**
```bash
vercel env add REACT_APP_API_BASE_URL production
# Enter: https://bug-tracker-backend-na6z.onrender.com/api
```

### ✅ 4. Verify Backend is Running

Before deploying frontend, ensure backend is accessible:

```bash
# Test backend health
curl https://bug-tracker-backend-na6z.onrender.com/api/health

# Or use the test script
node test-api.js
```

Expected response:
```json
{
  "success": true,
  "status": "ok",
  "message": "API is healthy",
  ...
}
```

## Deployment Steps

### Step 1: Backend Deployment (Render)

1. ✅ **Verify Backend is Deployed**
   - URL: `https://bug-tracker-backend-na6z.onrender.com`
   - Health check: `https://bug-tracker-backend-na6z.onrender.com/api/health`

2. ✅ **Set Backend Environment Variables (Render Dashboard)**
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `https://your-app.vercel.app` (optional, wildcard covers it)
   - `MONGODB_URI` = Your MongoDB connection string
   - Any other required environment variables

3. ✅ **Verify CORS Configuration**
   - Backend should allow requests from `*.vercel.app` domains
   - Already configured in `server/src/app.js`

### Step 2: Frontend Deployment (Vercel)

#### Option A: Deploy via Vercel Dashboard

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project Settings**
   - **Root Directory:** `client`
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

3. **Set Environment Variables**
   - `REACT_APP_API_BASE_URL` = `https://bug-tracker-backend-na6z.onrender.com/api`
   - `VITE_API_BASE_URL` = `https://bug-tracker-backend-na6z.onrender.com/api`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Navigate to project root
cd deployment-and-devops-essentials-graceakhati-dev

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Set environment variables
vercel env add REACT_APP_API_BASE_URL production
# Enter: https://bug-tracker-backend-na6z.onrender.com/api

# Deploy to production
vercel --prod
```

#### Option C: Use `vercel.json` Configuration

The `deployment/vercel.json` file is already configured. Place it in the project root or configure Vercel to use it:

```bash
# Copy vercel.json to root (if deploying from root)
cp deployment/vercel.json vercel.json

# Or configure Vercel to use deployment/vercel.json
```

## Post-Deployment Verification

### ✅ 1. Test Frontend-Backend Connection

After deployment, test the connection:

1. **Open Browser Console** on your deployed frontend
2. **Run Connection Test:**
   ```javascript
   // In browser console
   import('./utils/connectionTest.js').then(module => {
     module.runConnectionTests().then(results => {
       module.logConnectionTestResults(results);
     });
   });
   ```

3. **Or use the test script:**
   ```bash
   # Update test-api.js with your frontend URL if needed
   node test-api.js
   ```

### ✅ 2. Verify API Calls

1. **Open Network Tab** in browser DevTools
2. **Interact with the app** (create bug, fetch bugs, etc.)
3. **Verify API calls** are going to:
   - ✅ `https://bug-tracker-backend-na6z.onrender.com/api/bugs`
   - ❌ NOT `http://localhost:5000/api/bugs`

### ✅ 3. Check CORS Errors

If you see CORS errors in console:
- ✅ Verify backend CORS allows `*.vercel.app` domains
- ✅ Check backend logs for CORS rejection messages
- ✅ Verify `FRONTEND_URL` environment variable is set correctly (optional)

### ✅ 4. Test All CRUD Operations

- ✅ **Create Bug:** Should POST to backend
- ✅ **Read Bugs:** Should GET from backend
- ✅ **Update Bug:** Should PUT to backend
- ✅ **Delete Bug:** Should DELETE from backend

## Troubleshooting

### Issue: Frontend shows "Unable to connect to backend"

**Solutions:**
1. Check browser console for CORS errors
2. Verify backend is running: `curl https://bug-tracker-backend-na6z.onrender.com/api/health`
3. Check environment variables in Vercel dashboard
4. Verify `REACT_APP_API_BASE_URL` is set correctly
5. Rebuild frontend after setting environment variables

### Issue: CORS errors in production

**Solutions:**
1. Verify backend CORS configuration allows `*.vercel.app`
2. Check backend logs for CORS rejection details
3. Set `FRONTEND_URL` environment variable in Render backend
4. Ensure backend is in production mode (`NODE_ENV=production`)

### Issue: Environment variables not working

**Solutions:**
1. Environment variables must be set **before** building
2. Rebuild/redeploy after setting environment variables
3. For Create React App, variables must start with `REACT_APP_`
4. Check Vercel build logs to verify variables are being used

### Issue: API calls still going to localhost

**Solutions:**
1. Clear browser cache
2. Verify `.env.production` file exists and is correct
3. Check Vercel environment variables are set
4. Rebuild and redeploy frontend

## File Changes Summary

### ✅ Files Updated:
1. ✅ `client/src/services/bugService.js` - Updated to use `REACT_APP_API_BASE_URL`
2. ✅ `server/src/app.js` - Updated CORS to allow Vercel domains
3. ✅ `deployment/vercel.json` - Added environment variables
4. ✅ `client/src/utils/connectionTest.js` - Created connection test utility

### 📝 Files to Create Manually:
1. 📝 `client/.env.production` - Production environment variables
2. 📝 `client/.env` - Development environment variables

### 📋 Files Already Configured:
1. ✅ `test-api.js` - API test script (uses Render URL)

## Quick Reference

### Backend URL
```
Production: https://bug-tracker-backend-na6z.onrender.com
Health Check: https://bug-tracker-backend-na6z.onrender.com/api/health
API Base: https://bug-tracker-backend-na6z.onrender.com/api
```

### Environment Variables

**Frontend (Vercel):**
- `REACT_APP_API_BASE_URL=https://bug-tracker-backend-na6z.onrender.com/api`

**Backend (Render):**
- `NODE_ENV=production`
- `FRONTEND_URL=https://your-app.vercel.app` (optional)
- `MONGODB_URI=your-mongodb-connection-string`

### Testing Commands

```bash
# Test backend API
node test-api.js

# Test local frontend
cd client
npm start

# Build for production
cd client
npm run build
```

## Success Criteria

✅ Frontend deployed to Vercel  
✅ Backend deployed to Render  
✅ Frontend can connect to backend  
✅ No CORS errors  
✅ All CRUD operations work  
✅ Environment variables properly configured  
✅ Production uses Render backend URL  
✅ Development uses localhost backend  

---

**Last Updated:** $(date)  
**Backend URL:** https://bug-tracker-backend-na6z.onrender.com  
**Frontend URL:** (To be added after Vercel deployment)

