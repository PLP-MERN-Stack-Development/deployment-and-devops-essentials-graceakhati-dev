# ✅ Complete Deployment Checklist

## 🎯 Pre-Deployment Setup

### Backend (Render) Prerequisites
- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created and running
- [ ] MongoDB connection string obtained
- [ ] Render account created
- [ ] GitHub repository pushed

### Frontend (Vercel) Prerequisites
- [ ] Vercel account created
- [ ] GitHub repository pushed
- [ ] Node.js 18+ installed locally (for testing)

---

## 🔧 BACKEND DEPLOYMENT (Render)

### Configuration Files ✅

- [x] `server/package.json` - Start script configured
- [x] `server/src/server.js` - Render-compatible (0.0.0.0)
- [x] `server/src/app.js` - CORS configured for Vercel
- [x] `server/src/config/database.js` - MongoDB connection ready
- [x] `deployment/render.yaml` - Blueprint file exists

### Render Dashboard Setup

- [ ] **Create Web Service:**
  - Name: `bug-tracker-backend`
  - Environment: `Node`
  - Region: Your preferred region
  - Branch: `main` (or your main branch)

- [ ] **Build Settings:**
  - Build Command: `cd server && npm install`
  - Start Command: `cd server && npm start`
  - Root Directory: (leave empty)

- [ ] **Environment Variables:**
  - `NODE_ENV` = `production`
  - `MONGODB_URI` = Your MongoDB Atlas connection string
  - `FRONTEND_URL` = Your Vercel URL (optional - wildcard covers it)

- [ ] **Advanced Settings:**
  - Health Check Path: `/api/health`
  - Auto-Deploy: Enabled

- [ ] **Deploy:**
  - Click "Create Web Service"
  - Wait for deployment (5-10 minutes)
  - Note the service URL

### Backend Verification

- [ ] **Health Check:**
  ```bash
  curl https://bug-tracker-backend-na6z.onrender.com/api/health
  ```
  Expected: `{"success":true,"status":"ok",...}`

- [ ] **API Test:**
  ```bash
  curl https://bug-tracker-backend-na6z.onrender.com/api/bugs
  ```
  Expected: `[]` or array of bugs

- [ ] **Database Connection:**
  - Check Render logs for "MongoDB Connected"
  - Verify no connection errors

---

## 🎨 FRONTEND DEPLOYMENT (Vercel)

### Configuration Files ✅

- [x] `vercel.json` - Complete configuration in project root
- [x] `client/package.json` - Build scripts configured
- [x] `client/vite.config.js` - Output directory set to `dist`
- [x] `client/index.html` - Entry point exists
- [x] `client/src/services/bugService.js` - API configuration ready

### Local Testing (REQUIRED BEFORE DEPLOYMENT)

- [ ] **Install Dependencies:**
  ```bash
  cd client
  npm install
  ```
  Verify: `node_modules/vite` exists

- [ ] **Test Build:**
  ```bash
  cd client
  npm run build
  ```
  Expected:
  - ✅ Build completes successfully
  - ✅ `client/dist` folder created
  - ✅ `dist/index.html` exists
  - ✅ `dist/assets/` contains files

- [ ] **Preview Build:**
  ```bash
  cd client
  npm run preview
  ```
  Expected: App loads at `http://localhost:3000`

### Vercel Dashboard Setup

- [ ] **Create Project:**
  - Import GitHub repository
  - Framework: Vite (or Other)

- [ ] **Build Settings:**
  - Root Directory: (leave empty - uses repo root)
  - Build Command: `cd client && npm run build` (or auto-detected)
  - Output Directory: `client/dist`
  - Install Command: `cd client && npm install` (or auto-detected)

- [ ] **Environment Variables:**
  - `VITE_API_BASE_URL` = `https://bug-tracker-backend-na6z.onrender.com`
  - `VITE_NODE_ENV` = `production`

- [ ] **Deploy:**
  - Click "Deploy"
  - Monitor build logs
  - Wait for deployment

### Frontend Verification

- [ ] **Build Logs Check:**
  - ✅ Dependencies install successfully
  - ✅ Build completes: `✓ built in X.XXs`
  - ✅ Output detected: `dist/index.html`
  - ✅ No build errors

- [ ] **Deployment Check:**
  - ✅ App loads at Vercel URL
  - ✅ No console errors
  - ✅ API calls visible in Network tab
  - ✅ API calls go to Render backend (not localhost)

---

## 🔗 INTEGRATION VERIFICATION

### Connection Test

- [ ] **Run Verification Script:**
  ```bash
  export VITE_API_BASE_URL=https://bug-tracker-backend-na6z.onrender.com
  export FRONTEND_URL=https://your-app.vercel.app
  node deployment/verify-deployment.js
  ```
  Expected: All tests pass ✅

### Manual Testing

- [ ] **Frontend → Backend:**
  - Open deployed frontend
  - Open browser console
  - Check Network tab
  - Verify API calls go to Render backend

- [ ] **CORS Check:**
  - No CORS errors in console
  - API requests succeed
  - Response headers include CORS headers

- [ ] **CRUD Operations:**
  - ✅ Create bug works
  - ✅ Read bugs works
  - ✅ Update bug works
  - ✅ Delete bug works

---

## 🐛 TROUBLESHOOTING CHECKLIST

### Backend Issues

- [ ] **Backend won't start:**
  - Check MongoDB connection string
  - Check environment variables in Render
  - Check build logs for errors
  - Verify Node.js version (18+)

- [ ] **CORS errors:**
  - Verify `FRONTEND_URL` matches Vercel URL
  - Check CORS middleware configuration
  - Verify wildcard pattern `*.vercel.app` works

- [ ] **Database connection fails:**
  - Check MongoDB Atlas IP whitelist (`0.0.0.0/0`)
  - Verify connection string format
  - Check database user permissions

### Frontend Issues

- [ ] **"No Output Directory named 'dist' found":**
  - Verify dependencies installed (`npm install`)
  - Check build completes successfully
  - Verify `vite.config.js` has `outDir: 'dist'`
  - Check build logs for actual errors

- [ ] **API calls fail:**
  - Check `VITE_API_BASE_URL` environment variable
  - Verify backend is running
  - Check CORS configuration
  - Review browser console errors

- [ ] **Routes return 404:**
  - Verify `vercel.json` routes configuration
  - Check SPA routing (`dest: "/index.html"`)
  - Verify filesystem handler is first

---

## 📊 FINAL VERIFICATION

### Backend Status
- [ ] Health endpoint: `200 OK`
- [ ] API endpoints: Working
- [ ] Database: Connected
- [ ] CORS: Configured
- [ ] Environment: Production

### Frontend Status
- [ ] Build: Successful
- [ ] Deployment: Live
- [ ] App: Loads correctly
- [ ] API: Connects to backend
- [ ] CORS: No errors
- [ ] Environment: Production

### Integration Status
- [ ] Frontend ↔ Backend: Connected
- [ ] CRUD Operations: Working
- [ ] Data Persistence: Working
- [ ] Error Handling: Working

---

## 🎉 DEPLOYMENT COMPLETE

When all items are checked:

✅ **Backend:** `https://bug-tracker-backend-na6z.onrender.com`  
✅ **Frontend:** `https://your-app.vercel.app`  
✅ **Status:** Fully Deployed and Operational

---

## 📝 POST-DEPLOYMENT

### Monitoring

- [ ] Set up Render monitoring (if available)
- [ ] Set up Vercel analytics
- [ ] Monitor error logs
- [ ] Check performance metrics

### Maintenance

- [ ] Document deployment process
- [ ] Set up CI/CD (if needed)
- [ ] Create backup procedures
- [ ] Plan for updates

---

## 🆘 SUPPORT RESOURCES

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Vite Docs:** https://vitejs.dev
- **MongoDB Atlas:** https://docs.atlas.mongodb.com

---

**Last Updated:** $(date)  
**Status:** Ready for Deployment  
**Next Step:** Follow checklist items in order
