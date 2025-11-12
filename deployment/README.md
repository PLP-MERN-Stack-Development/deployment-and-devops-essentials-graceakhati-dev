# Deployment Configuration

This directory contains deployment configurations and scripts for the MERN Bug Tracker application.

## Files

### Backend Deployment

- **`render.yaml`** - Render.com deployment configuration
- **`railway.json`** - Railway.app deployment configuration  
- **`Procfile`** - Heroku deployment configuration

### Frontend Deployment

- **`vercel.json`** - Vercel deployment configuration
- **`netlify.toml`** - Netlify deployment configuration

### Scripts

- **`deploy.sh`** - Deployment script for local/manual deployments

## Platform Setup Instructions

### Backend Deployment

#### Render.com
1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Use the settings from `render.yaml`
4. Set environment variables in Render dashboard:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `FRONTEND_URL` - Your frontend URL
   - `NODE_ENV=production`
   - `PORT=5000`

#### Railway.app
1. Create a new project in Railway
2. Connect your GitHub repository
3. Railway will auto-detect `railway.json`
4. Set environment variables in Railway dashboard

#### Heroku
1. Install Heroku CLI
2. Create a new app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set MONGODB_URI=...`
4. Deploy: `git push heroku main`

### Frontend Deployment

#### Vercel
1. Import your GitHub repository in Vercel
2. Set root directory to `client`
3. Set build command: `npm run build`
4. Set output directory: `build`
5. Add environment variables:
   - `REACT_APP_API_URL` or `VITE_API_BASE_URL` - Your backend API URL

#### Netlify
1. Import your GitHub repository in Netlify
2. Netlify will auto-detect `netlify.toml`
3. Set environment variables in Netlify dashboard:
   - `REACT_APP_API_URL` or `VITE_API_BASE_URL` - Your backend API URL

## Environment Variables

### Backend Required Variables
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (production/development)
- `PORT` - Server port (usually set by platform)
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend Required Variables
- `REACT_APP_API_URL` - Backend API URL (for Create React App)
- `VITE_API_BASE_URL` - Backend API URL (for Vite)

## Manual Deployment

Use the `deploy.sh` script for manual deployments:

```bash
chmod +x deployment/deploy.sh
./deployment/deploy.sh all
```

