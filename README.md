# 🐛 Bug Tracker - Full Stack Application

## 📋 Project Overview
A full-stack bug tracking application demonstrating modern DevOps practices, CI/CD pipelines, and cloud deployment. Built with React, Node.js, Express, and MongoDB.

## 🚀 Live Deployment

### ✅ Application is Successfully Deployed!

- **Frontend**: [https://bug-tracker-frontend-hazel-three.vercel.app](https://bug-tracker-frontend-hazel-three.vercel.app)
- **Backend API**: [https://bug-tracker-backend-na6z.onrender.com](https://bug-tracker-backend-na6z.onrender.com)
- **API Health Check**: [https://bug-tracker-backend-na6z.onrender.com/api/health](https://bug-tracker-backend-na6z.onrender.com/api/health)

### 🧪 Test the Live Application

1. **Visit the Frontend**: Open [https://bug-tracker-frontend-hazel-three.vercel.app](https://bug-tracker-frontend-hazel-three.vercel.app) in your browser
2. **Test API Endpoints**: Use the backend URL to test API calls directly
3. **Health Check**: Verify backend is running: `curl https://bug-tracker-backend-na6z.onrender.com/api/health`

## 🛠️ Technology Stack

### Frontend
- React.js 18 with Functional Components & Hooks
- Context API for State Management
- Vite for Build Tooling
- CSS3 with Responsive Design
- Testing: Jest & React Testing Library

### Backend
- Node.js & Express.js
- MongoDB Atlas (Cloud Database)
- Mongoose ODM
- CORS & Helmet for Security
- Environment-based Configuration

### DevOps & Deployment
- **Version Control**: Git & GitHub
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Database**: MongoDB Atlas
- **Environment Management**: .env files with .gitignore protection

## 📁 Project Structure
```
deployment-and-devops-essentials-graceakhati-dev/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/          # State management
│   │   ├── services/         # API services
│   │   ├── config/           # API configuration
│   │   └── tests/            # Test files
│   ├── package.json
│   ├── vite.config.js
│   ├── .env                  # Development environment variables
│   ├── .env.production       # Production environment variables
│   └── vercel.json           # Vercel configuration
├── server/                   # Express Backend
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── models/           # MongoDB models
│   │   ├── middleware/       # Express middleware
│   │   └── app.js            # Express app configuration
│   ├── package.json
│   └── .env                  # Backend environment variables
├── .gitignore
└── README.md
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git
- npm or yarn

### Local Development

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd deployment-and-devops-essentials-graceakhati-dev
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env  # Create .env file
   # Update .env with your MongoDB Atlas credentials
   npm run dev           # Starts server on http://localhost:5000
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   # Create .env file (see Environment Variables section)
   npm run dev           # Starts dev server on http://localhost:5173
   ```

## 🔒 Environment Variables

### Backend Environment Variables (.env)

Create a `.env` file in the `server/` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bugtracker
FRONTEND_URL=http://localhost:5173
```

**For Production (Render):**
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bugtracker
FRONTEND_URL=https://bug-tracker-frontend-hazel-three.vercel.app
```

### Frontend Environment Variables

**Development (.env in `client/` directory):**
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_NODE_ENV=development
```

**Production (.env.production in `client/` directory):**
```env
VITE_API_BASE_URL=https://bug-tracker-backend-na6z.onrender.com
VITE_NODE_ENV=production
```

**Vercel Configuration (vercel.json):**
The production environment variables are automatically set in `vercel.json`:
```json
{
  "env": {
    "VITE_API_BASE_URL": "https://bug-tracker-backend-na6z.onrender.com",
    "VITE_NODE_ENV": "production"
  }
}
```

## 🌐 API Base URL

### Production
- **Base URL**: `https://bug-tracker-backend-na6z.onrender.com`
- **API Endpoint**: `https://bug-tracker-backend-na6z.onrender.com/api`

### Development
- **Base URL**: `http://localhost:5000`
- **API Endpoint**: `http://localhost:5000/api`

### Available Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/bugs` - Get all bugs
- `GET /api/bugs/:id` - Get bug by ID
- `POST /api/bugs` - Create new bug
- `PUT /api/bugs/:id` - Update bug
- `DELETE /api/bugs/:id` - Delete bug

## 🔐 CORS Configuration

The backend CORS is configured to allow requests from:

```javascript
const corsOptions = {
  origin: [
    'https://bug-tracker-frontend-hazel-three.vercel.app',  // Production frontend
    'http://localhost:3000',                                // Development (if using port 3000)
    'http://localhost:5173'                                  // Development (Vite default port)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length'],
  optionsSuccessStatus: 200
};
```

**To add a new frontend URL:**
1. Update `server/src/app.js`
2. Add the new URL to the `origin` array in `corsOptions`
3. Redeploy the backend to Render

## 🚀 Deployment Process

### Backend Deployment (Render)

1. **Environment Preparation**
   - Created production-ready `package.json` with proper scripts
   - Configured CORS for frontend communication
   - Added security headers with Helmet
   - Implemented health check endpoint (`/api/health`)

2. **MongoDB Atlas Configuration**
   - Created free-tier MongoDB Atlas cluster
   - Configured database user with read/write permissions
   - Set up IP whitelisting (0.0.0.0/0 for Render)
   - Tested connection locally

3. **Render Deployment**
   - Connected GitHub repository to Render
   - Set root directory to `server`
   - Configured environment variables:
     - `NODE_ENV=production`
     - `PORT=10000`
     - `MONGODB_URI=<your-mongodb-uri>`
     - `FRONTEND_URL=https://bug-tracker-frontend-hazel-three.vercel.app`
   - Automated deployments from main branch
   - **Live URL**: [https://bug-tracker-backend-na6z.onrender.com](https://bug-tracker-backend-na6z.onrender.com)

### Frontend Deployment (Vercel)

1. **Build Optimization**
   - Verified build scripts in `package.json`
   - Configured environment variables for production API URL
   - Set up Vite configuration for production builds

2. **Vercel Configuration**
   - Connected GitHub repository
   - Set root directory to `client`
   - Configured `vercel.json` with:
     - Build command: `cd client && npm ci && npm run build`
     - Output directory: `client/dist`
     - Environment variables (see `vercel.json`)
   - Automated deployments on push to main
   - **Live URL**: [https://bug-tracker-frontend-hazel-three.vercel.app](https://bug-tracker-frontend-hazel-three.vercel.app)

## ✅ Testing

### Test the Deployed Application

1. **Frontend Testing**
   - Visit: [https://bug-tracker-frontend-hazel-three.vercel.app](https://bug-tracker-frontend-hazel-three.vercel.app)
   - Test creating, reading, updating, and deleting bugs
   - Verify API calls are working correctly

2. **Backend API Testing**
   ```bash
   # Health check
   curl https://bug-tracker-backend-na6z.onrender.com/api/health
   
   # Get all bugs
   curl https://bug-tracker-backend-na6z.onrender.com/api/bugs
   
   # Create a bug
   curl -X POST https://bug-tracker-backend-na6z.onrender.com/api/bugs \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Bug","description":"Test Description","status":"open","priority":"medium"}'
   ```

### Local Testing

```bash
# Backend Tests
cd server
npm test

# Frontend Tests
cd client
npm test
```

## 🔄 CI/CD Pipeline

- **Automated Testing**: Runs on both frontend and backend
- **Automated Deployment**: 
  - Vercel automatically deploys frontend on git push to main
  - Render automatically deploys backend on git push to main
- **Environment Separation**: Development vs Production configurations
- **Health Monitoring**: API health checks implemented at `/api/health`

## 📈 Monitoring & Logs

- **Backend**: Render provides built-in logging and monitoring
- **Database**: MongoDB Atlas performance metrics
- **Frontend**: Vercel analytics and performance monitoring
- **API Health**: Monitor backend health at `/api/health` endpoint

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Verify Atlas IP whitelist includes `0.0.0.0/0` for Render
   - Check database user credentials in environment variables
   - Confirm cluster is running in MongoDB Atlas dashboard

2. **CORS Errors**
   - Verify `FRONTEND_URL` in backend environment variables matches your frontend URL
   - Check CORS configuration in `server/src/app.js`
   - Ensure frontend URL is added to the `origin` array

3. **Environment Variables Not Working**
   - **Frontend**: Ensure `VITE_` prefix is used (e.g., `VITE_API_BASE_URL`)
   - **Backend**: Verify all required variables are set in Render dashboard
   - Ensure `.env` files are not committed to git (check `.gitignore`)
   - For Vercel: Check `vercel.json` for environment variable configuration

4. **Frontend Not Connecting to Backend**
   - Verify `VITE_API_BASE_URL` is set correctly in production
   - Check browser console for API errors
   - Verify backend is running and accessible
   - Test backend health endpoint directly

5. **Build Failures**
   - Check Vercel build logs for errors
   - Verify all dependencies are listed in `package.json`
   - Ensure Node.js version matches `engines` field in `package.json`

## 📝 API Documentation

### Base URL
- **Production**: `https://bug-tracker-backend-na6z.onrender.com/api`
- **Development**: `http://localhost:5000/api`

### Endpoints

#### Health Check
```
GET /api/health
```
Returns server health status and uptime information.

#### Get All Bugs
```
GET /api/bugs
```
Returns a list of all bugs. Supports query parameters:
- `status`: Filter by status (open, in-progress, resolved)
- `priority`: Filter by priority (low, medium, high)
- `sort`: Sort order (createdAt, updatedAt)

#### Get Bug by ID
```
GET /api/bugs/:id
```
Returns a single bug by its ID.

#### Create Bug
```
POST /api/bugs
Content-Type: application/json

{
  "title": "Bug Title",
  "description": "Bug Description",
  "status": "open",
  "priority": "medium",
  "reporter": "Reporter Name"
}
```

#### Update Bug
```
PUT /api/bugs/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "in-progress"
}
```

#### Delete Bug
```
DELETE /api/bugs/:id
```

## 👤 Author

**Grace Akhati**  
PLP JULY 2025 COHORT

---

## 📄 License

This project is part of a learning exercise for DevOps and deployment practices.

---

**🎉 Application is live and ready to use!**

Visit the frontend: [https://bug-tracker-frontend-hazel-three.vercel.app](https://bug-tracker-frontend-hazel-three.vercel.app)
