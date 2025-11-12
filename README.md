## 📋 Project Overview
A full-stack bug tracking application demonstrating modern DevOps practices, CI/CD pipelines, and cloud deployment.

## 🚀 Live Deployment
- **Frontend**: [Vercel Deployment Link] (To be added after frontend deployment)
- **Backend API**: [Render Deployment Link] (To be added after backend deployment)
- **API Health Check**: `/api/health` endpoint available

## 🛠️ Technology Stack
### Frontend
- React.js 18 with Functional Components & Hooks
- Context API for State Management
- Axios for HTTP Requests
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
deployment-and-devops-essentials-graceakhati-dev/
├── client/ # React Frontend
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── context/ # State management
│ │ ├── services/ # API services
│ │ └── tests/ # Test files
│ ├── package.json
│ └── vercel.json # Vercel configuration
├── server/ # Express Backend
│ ├── routes/ # API routes
│ ├── models/ # MongoDB models
│ ├── package.json
│ └── server.js
├── .gitignore
└── README.md

text

## 🔧 Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### Local Development
1. **Clone Repository**
   \`\`\`bash
   git clone <repository-url>
   cd deployment-and-devops-essentials-graceakhati-dev
   \`\`\`

2. **Backend Setup**
   \`\`\`bash
   cd server
   npm install
   cp .env.example .env
   # Update .env with your MongoDB Atlas credentials
   npm run dev
   \`\`\`

3. **Frontend Setup**
   \`\`\`bash
   cd client
   npm install
   npm start
   \`\`\`

## 🚀 Deployment Process

### Backend Deployment (Render)
1. **Environment Preparation**
   - Created production-ready \`package.json\` with proper scripts
   - Configured CORS for frontend communication
   - Added security headers with Helmet
   - Implemented rate limiting
   - Created health check endpoint (\`/api/health\`)

2. **MongoDB Atlas Configuration**
   - Created free-tier MongoDB Atlas cluster
   - Configured database user with read/write permissions
   - Set up IP whitelisting (0.0.0.0/0 for Render)
   - Tested connection locally

3. **Render Deployment**
   - Connected GitHub repository to Render
   - Set root directory to \`server\`
   - Configured environment variables
   - Automated deployments from main branch

### Frontend Deployment (Vercel)
1. **Build Optimization**
   - Verified build scripts in \`package.json\`
   - Configured environment variables for production API URL

2. **Vercel Configuration**
   - Connected GitHub repository
   - Set root directory to \`client\`
   - Automated deployments on push to main

## 🔒 Environment Variables

### Backend (.env)
\`\`\`env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bugtracker
JWT_SECRET=your_secure_secret
FRONTEND_URL=https://your-frontend.vercel.app
\`\`\`

### Frontend
- \`REACT_APP_API_URL\`: Backend API endpoint

## ✅ Testing
\`\`\`bash
# Backend Tests
cd server
npm test

# Frontend Tests
cd client
npm test
\`\`\`

## 🔄 CI/CD Pipeline
- **Automated Testing**: Runs on both frontend and backend
- **Automated Deployment**: Vercel & Render deploy on git push
- **Environment Separation**: Development vs Production configurations
- **Health Monitoring**: API health checks implemented

## 📈 Monitoring & Logs
- **Backend**: Render provides built-in logging and monitoring
- **Database**: MongoDB Atlas performance metrics
- **Frontend**: Vercel analytics and performance monitoring

## 🐛 Troubleshooting

### Common Issues
1. **MongoDB Connection Failed**
   - Verify Atlas IP whitelist includes 0.0.0.0/0
   - Check database user credentials
   - Confirm cluster is running

2. **CORS Errors**
   - Verify FRONTEND_URL in backend environment variables
   - Check CORS configuration in server.js

3. **Environment Variables**
   - Ensure all required variables are set in deployment platforms
   - Verify .env files are not committed to git

## 👤 Author
**Grace Akhati**  
-PLP JULY 2025 COHORT

