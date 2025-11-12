# Render Deployment Guide for Backend

This guide will help you deploy your Express backend to Render.

## Prerequisites

1. **MongoDB Atlas Account**
   - Create a free cluster at https://www.mongodb.com/cloud/atlas
   - Get your connection string
   - Whitelist Render's IP addresses (or use 0.0.0.0/0 for development)

2. **Render Account**
   - Sign up at https://render.com
   - Connect your GitHub account

3. **Frontend URL**
   - Deploy your frontend first (Vercel/Netlify)
   - Get your frontend URL

## Deployment Steps

### Option 1: Using Render Blueprint (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Create New Blueprint Instance**
   - Go to Render Dashboard
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml` automatically
   - Click "Apply"

3. **Configure Environment Variables**
   In the Render dashboard, set these environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
   - `JWT_SECRET`: Generate with `openssl rand -base64 32`
   - `NODE_ENV`: Already set to `production` in render.yaml

4. **Deploy**
   - Render will automatically build and deploy
   - Wait for deployment to complete
   - Your backend will be available at `https://your-app.onrender.com`

### Option 2: Manual Setup

1. **Create New Web Service**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `bug-tracker-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or `server` if deploying from root)
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`

3. **Set Environment Variables**
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `FRONTEND_URL`: Your Vercel frontend URL
   - `JWT_SECRET`: Generate with `openssl rand -base64 32`
   - `PORT`: Leave empty (Render sets this automatically)

4. **Configure Health Check**
   - Health Check Path: `/api/health`
   - Render will use this to monitor your service

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

## Post-Deployment

### 1. Test Your Backend

```bash
# Health check
curl https://your-app.onrender.com/api/health

# Test API endpoint
curl https://your-app.onrender.com/api/bugs
```

### 2. Update Frontend Environment Variables

Update your frontend `.env` file:
```env
REACT_APP_API_URL=https://your-app.onrender.com/api
VITE_API_BASE_URL=https://your-app.onrender.com/api
```

### 3. Update CORS in Backend

Make sure `FRONTEND_URL` in Render matches your frontend URL exactly.

### 4. Monitor Your Service

- Check Render dashboard for logs
- Monitor `/api/health` endpoint
- Set up uptime monitoring (see `monitoring/README.md`)

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node version (should be >= 18.0.0)
   - Verify `package.json` has correct scripts
   - Check build logs in Render dashboard

2. **Database Connection Fails**
   - Verify MongoDB Atlas IP whitelist includes Render IPs
   - Check `MONGODB_URI` is correct
   - Ensure MongoDB Atlas cluster is running

3. **CORS Errors**
   - Verify `FRONTEND_URL` matches exactly (including https://)
   - Check browser console for CORS error details
   - Verify CORS configuration in `server/src/app.js`

4. **Service Crashes**
   - Check Render logs for errors
   - Verify all environment variables are set
   - Check MongoDB connection

5. **Port Issues**
   - Render sets PORT automatically - don't override it
   - Server listens on `0.0.0.0` (configured in `server.js`)

### Useful Commands

```bash
# Generate JWT secret
openssl rand -base64 32

# Test health endpoint locally
curl http://localhost:5000/api/health

# Check environment variables in Render
# Go to Environment tab in Render dashboard
```

## Render Free Tier Limitations

- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid plan for production

## Next Steps

1. Set up monitoring (see `monitoring/README.md`)
2. Configure custom domain (optional)
3. Set up CI/CD with GitHub Actions (see `.github/workflows/backend-cd.yml`)
4. Add error tracking (Sentry - see `monitoring/sentry-config.js`)

## Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Setup](MONGODB_ATLAS_SETUP.md)
- [Monitoring Setup](../monitoring/README.md)

