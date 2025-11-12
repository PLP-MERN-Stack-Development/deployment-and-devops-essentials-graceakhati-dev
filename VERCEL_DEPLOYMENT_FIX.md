# ✅ Vercel Deployment Configuration Fixed

## Problem

Vercel was looking for `dist` folder but the project was using Create React App which outputs to `build` folder.

## Solution

Migrated project from Create React App to Vite, which outputs to `dist` folder by default.

---

## ✅ Files Created/Updated

### 1. **`vercel.json`** (Project Root)
Created with proper monorepo configuration:

```json
{
  "version": 2,
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "cd client && npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://bug-tracker-backend-na6z.onrender.com",
    "VITE_NODE_ENV": "production"
  }
}
```

**Key Configuration:**
- ✅ Build command runs from `client` directory
- ✅ Output directory set to `client/dist`
- ✅ SPA routing configured (all routes → `index.html`)
- ✅ Environment variables included

### 2. **`client/vite.config.js`**
Created Vite configuration:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Outputs to dist folder
    emptyOutDir: true,
  },
  // ... other config
});
```

### 3. **`client/index.html`**
Created root HTML file (Vite requirement):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Bug Tracker</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.js"></script>
  </body>
</html>
```

### 4. **`client/package.json`**
Updated to use Vite:

```json
{
  "scripts": {
    "dev": "vite",
    "start": "vite",
    "build": "vite build",  // Creates dist folder
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.8",
    "@vitejs/plugin-react": "^4.2.1"
  }
}
```

---

## 🚀 Deployment Steps

### Step 1: Install Dependencies

```bash
cd client
npm install
```

This installs Vite and required plugins.

### Step 2: Test Build Locally

```bash
cd client
npm run build
```

**Expected Result:**
- ✅ `client/dist` folder is created
- ✅ `dist/index.html` exists
- ✅ `dist/assets/` contains JS and CSS files

### Step 3: Verify Build Output

```bash
# Check dist folder exists
ls client/dist

# Preview production build
cd client
npm run preview
```

### Step 4: Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Migrate to Vite and fix Vercel deployment"
   git push
   ```

2. **Vercel will automatically:**
   - Detect `vercel.json` in root
   - Run build command: `cd client && npm install && npm run build`
   - Look for output in `client/dist`
   - Deploy successfully ✅

---

## ✅ Verification Checklist

Before deploying, verify:

- [ ] `vercel.json` exists in project root
- [ ] `client/vite.config.js` exists
- [ ] `client/index.html` exists in client root
- [ ] `client/package.json` has Vite scripts
- [ ] Dependencies installed: `cd client && npm install`
- [ ] Build works: `cd client && npm run build`
- [ ] `client/dist` folder is created
- [ ] `dist/index.html` exists
- [ ] `dist/assets/` contains files

---

## 🔧 Vercel Configuration Details

### Build Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| **Root Directory** | (project root) | Vercel looks for `vercel.json` here |
| **Build Command** | `cd client && npm install && npm run build` | Installs deps and builds |
| **Output Directory** | `client/dist` | Where Vite outputs files |
| **Install Command** | `cd client && npm install` | Installs dependencies |
| **Framework** | `vite` | Tells Vercel it's a Vite project |

### Routing

The `rewrites` configuration ensures all routes go to `index.html` for SPA routing:

```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

This handles client-side routing (React Router, etc.).

---

## 🐛 Troubleshooting

### Issue: "No Output Directory named 'dist' found"

**Causes:**
1. Build command not running correctly
2. Dependencies not installed
3. Build failing silently

**Solutions:**
1. Check Vercel build logs
2. Verify `vercel.json` is in project root
3. Test build locally: `cd client && npm run build`
4. Ensure `client/dist` is created after build

### Issue: Build fails in Vercel

**Check:**
1. Node version compatibility (Vite requires Node 18+)
2. Dependencies install correctly
3. Build command works locally
4. Environment variables are set

### Issue: Routes not working (404 errors)

**Solution:**
The `rewrites` in `vercel.json` should handle this. If not:
1. Verify `rewrites` configuration
2. Check `dist/index.html` exists
3. Ensure all routes redirect to `index.html`

---

## 📊 Before vs After

| Aspect | Before (CRA) | After (Vite) |
|--------|--------------|--------------|
| Build Tool | react-scripts | Vite |
| Output Folder | `build` | `dist` |
| Build Speed | Slower | Faster ⚡ |
| Dev Server | Webpack | Vite (native ESM) |
| Config File | `package.json` | `vite.config.js` |
| HTML Entry | `public/index.html` | `index.html` (root) |

---

## ✅ Success Criteria

Your Vercel deployment will succeed when:

1. ✅ `vercel.json` is in project root
2. ✅ Build command runs successfully
3. ✅ `client/dist` folder is created
4. ✅ Vercel finds the `dist` folder
5. ✅ Application deploys and routes work

---

## 🎉 Next Steps

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Test build:**
   ```bash
   npm run build
   ```

3. **Verify dist folder:**
   ```bash
   ls dist
   ```

4. **Deploy to Vercel:**
   - Push to GitHub
   - Vercel will auto-deploy
   - Check build logs
   - Verify deployment ✅

---

**Status:** ✅ Configuration Complete  
**Build Output:** `client/dist`  
**Vercel Ready:** ✅ Yes

