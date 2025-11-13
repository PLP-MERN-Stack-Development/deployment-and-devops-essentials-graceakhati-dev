// app.js - Express application setup

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bugRoutes = require('./routes/bugRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const asyncHandler = require('./middleware/asyncHandler');

const app = express();

// Security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow cross-origin resources
}));

// CORS middleware - Allow requests from React frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, only allow specific frontend URL
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      // Explicit Vercel frontend domain
      'https://bug-tracker-frontend-hazel-three.vercel.app',
      // Vercel deployment URLs (wildcard pattern for other Vercel deployments)
      /^https:\/\/.*\.vercel\.app$/,
      // Fallback for localhost in case FRONTEND_URL is not set
      'http://localhost:3000',
      'http://localhost:3001'
    ].filter(Boolean); // Remove undefined values
    
    // Check if origin matches any allowed origin (including regex patterns)
    const isAllowed = allowedOrigins.length === 0 || 
      allowedOrigins.some(allowed => {
        if (typeof allowed === 'string') {
          return allowed === origin;
        }
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return false;
      });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log('=== DEBUG: Incoming Request ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Path:', req.path);
    console.log('Original URL:', req.originalUrl);
    console.log('Params:', req.params);
    console.log('Query:', req.query);
    console.log('==============================');
    next();
  });
  
  // DEBUG: Log route mounting
  console.log('=== DEBUG: App Route Mounting ===');
  console.log('Mounting bugRoutes at /api/bugs');
  console.log('=================================');
}

// Routes
app.use('/api/bugs', bugRoutes);

// DEBUG: Log all registered routes (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log('=== DEBUG: All Registered Routes ===');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      console.log('Router mounted at:', middleware.regexp);
    }
  });
  console.log('===================================');
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// API health check route (for monitoring and load balancers)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    }
  });
});

// Test route for unhandled promise rejection (development only)
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/test/unhandled-rejection', asyncHandler(async (req, res) => {
    // This will be caught by asyncHandler
    throw new Error('Test unhandled rejection (caught by asyncHandler)');
  }));

  app.get('/api/test/unhandled-rejection-raw', (req, res) => {
    // This will cause unhandled promise rejection
    Promise.reject(new Error('Test unhandled promise rejection'));
    res.json({ message: 'This will cause an unhandled rejection' });
  });
}

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;

