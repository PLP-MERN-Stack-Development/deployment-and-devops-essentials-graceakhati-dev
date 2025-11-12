# Environment Files Setup Instructions

Since `.env` files are gitignored, you need to create them manually. Follow these instructions:

## Create `client/.env.production`

**Location:** `client/.env.production`

**Content:**
```env
# Production Environment Variables
# Used when building for production deployment (Vercel)

# Backend API Base URL (Render deployment)
# Note: Include /api suffix as the service expects it
REACT_APP_API_BASE_URL=https://bug-tracker-backend-na6z.onrender.com/api

# For Vite compatibility (if migrating to Vite in future)
VITE_API_BASE_URL=https://bug-tracker-backend-na6z.onrender.com/api
```

**How to create:**

**Windows PowerShell:**
```powershell
cd client
@"
# Production Environment Variables
# Used when building for production deployment (Vercel)

# Backend API Base URL (Render deployment)
# Note: Include /api suffix as the service expects it
REACT_APP_API_BASE_URL=https://bug-tracker-backend-na6z.onrender.com/api

# For Vite compatibility (if migrating to Vite in future)
VITE_API_BASE_URL=https://bug-tracker-backend-na6z.onrender.com/api
"@ | Out-File -FilePath .env.production -Encoding utf8
```

**Windows CMD:**
```cmd
cd client
echo REACT_APP_API_BASE_URL=https://bug-tracker-backend-na6z.onrender.com/api > .env.production
echo VITE_API_BASE_URL=https://bug-tracker-backend-na6z.onrender.com/api >> .env.production
```

**Linux/Mac:**
```bash
cd client
cat > .env.production << 'EOF'
# Production Environment Variables
# Used when building for production deployment (Vercel)

# Backend API Base URL (Render deployment)
# Note: Include /api suffix as the service expects it
REACT_APP_API_BASE_URL=https://bug-tracker-backend-na6z.onrender.com/api

# For Vite compatibility (if migrating to Vite in future)
VITE_API_BASE_URL=https://bug-tracker-backend-na6z.onrender.com/api
EOF
```

## Create `client/.env` (Development)

**Location:** `client/.env`

**Content:**
```env
# Development Environment Variables
# Used for local development

# Backend API Base URL (local development server)
# Note: Include /api suffix as the service expects it
REACT_APP_API_BASE_URL=http://localhost:5000/api

# For Vite compatibility (if migrating to Vite in future)
VITE_API_BASE_URL=http://localhost:5000/api
```

**How to create:**

**Windows PowerShell:**
```powershell
cd client
@"
# Development Environment Variables
# Used for local development

# Backend API Base URL (local development server)
# Note: Include /api suffix as the service expects it
REACT_APP_API_BASE_URL=http://localhost:5000/api

# For Vite compatibility (if migrating to Vite in future)
VITE_API_BASE_URL=http://localhost:5000/api
"@ | Out-File -FilePath .env -Encoding utf8
```

**Windows CMD:**
```cmd
cd client
echo REACT_APP_API_BASE_URL=http://localhost:5000/api > .env
echo VITE_API_BASE_URL=http://localhost:5000/api >> .env
```

**Linux/Mac:**
```bash
cd client
cat > .env << 'EOF'
# Development Environment Variables
# Used for local development

# Backend API Base URL (local development server)
# Note: Include /api suffix as the service expects it
REACT_APP_API_BASE_URL=http://localhost:5000/api

# For Vite compatibility (if migrating to Vite in future)
VITE_API_BASE_URL=http://localhost:5000/api
EOF
```

## Verify Files Created

After creating the files, verify they exist:

**Windows:**
```powershell
cd client
Get-ChildItem .env*
```

**Linux/Mac:**
```bash
cd client
ls -la .env*
```

You should see:
- `.env` (development)
- `.env.production` (production)

## Important Notes

1. **File Location:** Both files must be in the `client/` directory
2. **No Quotes:** Don't wrap values in quotes unless they contain spaces
3. **No Trailing Slash:** Don't add trailing slashes to URLs
4. **Include /api:** The API base URL should include `/api` suffix
5. **Git Ignored:** These files are gitignored and won't be committed (this is intentional for security)

## Testing

After creating the files, test locally:

```bash
cd client
npm start
```

Check the browser console - you should see API calls going to `http://localhost:5000/api` in development.

For production build:
```bash
cd client
npm run build
```

The build will use `.env.production` automatically.

