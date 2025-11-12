/**
 * Sentry Error Tracking Configuration
 * 
 * Install Sentry SDK:
 *   npm install @sentry/react @sentry/node
 * 
 * Backend: Add to server/src/server.js
 * Frontend: Add to client/src/index.js
 */

// Backend Sentry Configuration (server/src/server.js)
const backendSentryConfig = `
// Add at the top of server/src/server.js
const Sentry = require("@sentry/node");
const { ProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  integrations: [
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
`;

// Frontend Sentry Configuration (client/src/index.js)
const frontendSentryConfig = `
// Add at the top of client/src/index.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN || process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
`;

module.exports = {
  backend: backendSentryConfig,
  frontend: frontendSentryConfig,
  setupInstructions: `
# Sentry Setup Instructions

## 1. Create Sentry Account
- Go to https://sentry.io
- Create a new project
- Select "Node.js" for backend
- Select "React" for frontend

## 2. Install Dependencies

### Backend
cd server
npm install @sentry/node @sentry/profiling-node

### Frontend
cd client
npm install @sentry/react

## 3. Add Environment Variables

### Backend (.env)
SENTRY_DSN=your-backend-sentry-dsn

### Frontend (.env)
REACT_APP_SENTRY_DSN=your-frontend-sentry-dsn
# OR for Vite:
VITE_SENTRY_DSN=your-frontend-sentry-dsn

## 4. Integrate Sentry

Copy the configuration code from this file to your application entry points.

## 5. Test Error Tracking

Add a test error endpoint or trigger an error to verify Sentry is working.
`
};

