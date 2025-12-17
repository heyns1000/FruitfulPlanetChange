# Vercel Deployment Guide for FruitfulPlanet

## Important Notes

**⚠️ Architecture Consideration**

This application is a full-stack Express.js + React application with:

- Express server with file system operations
- Database migrations
- File downloads/uploads
- Background processing

**Vercel is optimized for:**

- Static sites
- Serverless functions
- Edge functions

**Recommended Deployment Platforms:**

1. **Railway** - Better for full-stack apps with persistent storage
2. **Render** - Supports Express + PostgreSQL easily
3. **Fly.io** - Great for full-stack Node.js apps
4. **Heroku** - Traditional platform for Express apps
5. **DigitalOcean App Platform** - Good for monolithic apps

## If Deploying to Vercel Anyway

### Prerequisites

1. **Environment Variables Required:**

   ```
   DATABASE_URL=postgresql://...
   NODE_ENV=production
   ```

2. **Database Setup:**
   - Must use external PostgreSQL (Neon, Supabase, Railway)
   - Run migrations manually or via CI/CD

3. **File Storage:**
   - `/tmp` is ephemeral on Vercel
   - Use S3, Cloudinary, or similar for package storage
   - Or generate packages on-demand (no caching)

### Deployment Steps

#### 1. Configure Vercel Project

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Set environment variables
vercel env add DATABASE_URL production
```

#### 2. Set Environment Variables in Vercel Dashboard

Go to: Project Settings → Environment Variables

Add:

- `DATABASE_URL`: Your PostgreSQL connection string
- `NODE_ENV`: production
- `PORT`: 5000 (optional)

#### 3. Configure Build Settings

In Vercel dashboard:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

#### 4. Deploy

```bash
vercel --prod
```

### Known Limitations on Vercel

1. **File System Access**
   - `/tmp` is ephemeral and limited to 512MB
   - Files don't persist between function invocations
   - Package downloads work but can't cache ZIP files

2. **Function Timeout**
   - 10 seconds on Hobby plan
   - 60 seconds on Pro plan
   - Bulk package generation won't work (use separate script)

3. **Cold Starts**
   - Serverless functions can have cold starts
   - Database connections need connection pooling

### Workarounds

#### 1. Generate Packages On-Demand

Instead of pre-generating all packages, generate them when requested:

- User clicks download
- Server generates package in memory
- Stream directly to user
- No file system storage needed

#### 2. Use External Storage

Store generated packages in:

- AWS S3
- Cloudinary
- Vercel Blob Storage
- Firebase Storage

#### 3. Background Jobs

For bulk operations, use:

- Vercel Cron Jobs (limited)
- External job queue (Bull, RabbitMQ)
- Separate worker service

### Alternative: Hybrid Deployment

Deploy frontend and backend separately:

**Frontend (Vercel):**

- React app only
- Static assets
- Fast global CDN

**Backend (Railway/Render):**

- Express API
- Database
- File operations
- Background jobs

Update API calls to point to backend URL.

## Recommended: Deploy to Railway

### Why Railway?

✅ Full Express.js support
✅ Persistent file system
✅ Integrated PostgreSQL
✅ Automatic deployments
✅ Better for full-stack apps
✅ Environment variables
✅ Database migrations
✅ Background workers

### Railway Deployment

1. **Install Railway CLI**

   ```bash
   npm i -g @railway/cli
   ```

2. **Login and Initialize**

   ```bash
   railway login
   railway init
   ```

3. **Add PostgreSQL**

   ```bash
   railway add postgresql
   ```

4. **Deploy**

   ```bash
   railway up
   ```

5. **Run Migrations**
   ```bash
   railway run npm run db:migrate
   ```

Railway will:

- Detect Node.js app automatically
- Set up PostgreSQL
- Configure environment variables
- Deploy with zero configuration

## Current Deployment Issues

### Vercel Deployment Failures

**Possible Causes:**

1. **TypeScript Errors**
   - Solution: Build doesn't run `tsc`, so this shouldn't block
   - Vercel.json configured to skip type check

2. **Missing Dependencies**
   - Solution: All dependencies in package.json
   - Lock file committed

3. **Build Timeout**
   - Solution: Build is fast (~20 seconds locally)
   - Increase timeout in Vercel settings if needed

4. **Environment Variables**
   - Solution: Add DATABASE_URL in Vercel dashboard
   - Can use demo/mock mode without real DB

5. **File System Operations**
   - Solution: Routes work, but package generation needs modification
   - Generate on-demand instead of pre-caching

### Quick Fix for Vercel

To make it work on Vercel immediately:

1. **Disable file-based features temporarily**
   - Comment out bulk generation script
   - Generate packages in memory
   - Stream directly without saving

2. **Use environment check**

   ```typescript
   const isVercel = process.env.VERCEL === '1';
   if (isVercel) {
     // In-memory generation only
   } else {
     // Full file system features
   }
   ```

3. **Add serverless function timeout**
   Update vercel.json:
   ```json
   {
     "functions": {
       "api/**/*.ts": {
         "maxDuration": 60
       }
     }
   }
   ```

## Debugging Vercel Deployment

### Check Build Logs

```bash
vercel logs
```

### Common Error Messages

1. **"Build exceeded maximum duration"**
   - Solution: Optimize build or upgrade plan

2. **"Cannot find module"**
   - Solution: Check package.json dependencies

3. **"ENOENT: no such file or directory"**
   - Solution: File system access issue, use S3 or in-memory

4. **"Connection timeout"**
   - Solution: Database connection issue, check DATABASE_URL

### Test Locally

```bash
# Build
npm run build

# Run production build
NODE_ENV=production node dist/index.js
```

## Conclusion

While Vercel can host this app, **Railway, Render, or Fly.io are better suited** for this full-stack architecture with:

- Express server
- File operations
- Database migrations
- Background processing

If you must use Vercel, implement on-demand package generation and use external storage.

---

_For immediate deployment success, we recommend Railway or Render._
