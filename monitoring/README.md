# Monitoring Setup

This directory contains monitoring configuration and scripts for the MERN Bug Tracker application.

## Files

- **`health-check.js`** - Health check script for monitoring backend availability
- **`sentry-config.js`** - Sentry error tracking configuration
- **`README.md`** - This file

## Health Check

The health check script monitors your backend API health endpoint.

### Usage

```bash
# Check local backend
node monitoring/health-check.js

# Check deployed backend
node monitoring/health-check.js https://your-backend.railway.app

# Using environment variable
BACKEND_URL=https://your-backend.railway.app node monitoring/health-check.js
```

### Integration with Monitoring Services

#### UptimeRobot
1. Create account at https://uptimerobot.com
2. Add a new monitor
3. Type: HTTP(s)
4. URL: `https://your-backend.com/api/health`
5. Interval: 5 minutes

#### Pingdom
1. Create account at https://www.pingdom.com
2. Add a new check
3. URL: `https://your-backend.com/api/health`
4. Check interval: 1 minute

#### GitHub Actions Scheduled Check
Add to `.github/workflows/health-check.yml`:

```yaml
name: Health Check
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: node monitoring/health-check.js ${{ secrets.BACKEND_URL }}
```

## Error Tracking with Sentry

### Setup Steps

1. **Create Sentry Account**
   - Go to https://sentry.io
   - Create a new organization and project
   - Select "Node.js" for backend
   - Select "React" for frontend

2. **Install Dependencies**
   ```bash
   # Backend
   cd server
   npm install @sentry/node @sentry/profiling-node
   
   # Frontend
   cd client
   npm install @sentry/react
   ```

3. **Add Environment Variables**
   - Backend: `SENTRY_DSN` in `server/.env`
   - Frontend: `REACT_APP_SENTRY_DSN` or `VITE_SENTRY_DSN` in `client/.env`

4. **Integrate Sentry**
   - See `sentry-config.js` for configuration code
   - Add to `server/src/server.js` (backend)
   - Add to `client/src/index.js` (frontend)

5. **Test Error Tracking**
   - Trigger a test error to verify Sentry is capturing errors

## Performance Monitoring

### Backend Performance
- Use Sentry Performance Monitoring
- Monitor API response times
- Track slow database queries

### Frontend Performance
- Use Sentry Replay for user session recording
- Monitor Core Web Vitals
- Track JavaScript errors

## Logging

### Backend Logging
The application already includes error logging in `server/src/utils/errorLogger.js`.

### Production Logging
- Use platform-specific logging (Render, Railway, Heroku logs)
- Integrate with log aggregation services (Logtail, Papertrail)
- Set up log rotation and retention policies

## Monitoring Checklist

- [ ] Health check endpoint configured (`/api/health`)
- [ ] Uptime monitoring service configured
- [ ] Error tracking (Sentry) set up
- [ ] Performance monitoring enabled
- [ ] Log aggregation configured
- [ ] Alerts configured for critical errors
- [ ] Database monitoring set up (MongoDB Atlas)

