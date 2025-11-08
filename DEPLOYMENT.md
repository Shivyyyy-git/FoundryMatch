# 🚀 Deployment Guide - Deploy to Production

## Recommended Hosting Options (<$50/month)

### Option 1: Railway (Recommended - Easiest)
**Cost:** ~$5-20/month
- ✅ One-click deployment
- ✅ Built-in PostgreSQL database
- ✅ Automatic HTTPS
- ✅ Environment variables management
- ✅ Free tier available

### Option 2: Render
**Cost:** ~$7-25/month
- ✅ Free tier available
- ✅ PostgreSQL included
- ✅ Automatic SSL
- ✅ Simple deployment

### Option 3: Fly.io
**Cost:** ~$5-15/month
- ✅ Great for Node.js apps
- ✅ Global edge deployment
- ✅ PostgreSQL available

### Option 4: Vercel (Frontend) + Railway (Backend)
**Cost:** ~$0-20/month
- ✅ Vercel: Free for frontend
- ✅ Railway: Backend + Database
- ✅ Best performance separation

---

## 🎯 Recommended: Railway (All-in-One)

Railway is the easiest option - it handles everything in one place.

### Step 1: Prepare Your Code

1. **Create a `.railwayignore` file** (optional, to exclude unnecessary files):
```
node_modules
.env
.local
dist
*.log
.git
```

2. **Update environment variables for production** (see Step 3)

### Step 2: Deploy to Railway

1. **Sign up:** Go to [railway.app](https://railway.app) and sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select your `FoundryMatch` repository

3. **Add PostgreSQL Database:**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically create a `DATABASE_URL` environment variable

4. **Configure Environment Variables:**
   - Go to your service → "Variables"
   - Add all variables from `.env` (see Step 3 below)

5. **Set Build Command:**
   - Go to "Settings" → "Build"
   - Build Command: `npm run build`
   - Start Command: `npm start`

6. **Deploy:**
   - Railway will automatically deploy when you push to GitHub
   - Or click "Deploy" to deploy manually

### Step 3: Production Environment Variables

Create these in Railway's environment variables:

```env
# Required
NODE_ENV=production
PORT=5000
DATABASE_URL=<auto-set-by-railway-postgres>

# JWT Secrets (generate new ones for production!)
JWT_ACCESS_SECRET=<generate-with-openssl-rand-base64-32>
JWT_REFRESH_SECRET=<generate-with-openssl-rand-base64-32>

# Your production domain (Railway will give you one)
CLIENT_ORIGIN=https://your-app-name.up.railway.app
APP_BASE_URL=https://your-app-name.up.railway.app

# Google OAuth (update redirect URLs)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-app-name.up.railway.app/api/auth/google/callback

# Email (use production email service)
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=your_email@gmail.com
EMAIL_SMTP_PASS=your_app_password
EMAIL_FROM=Match Me Up Foundry <your_email@gmail.com>
```

### Step 4: Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add authorized redirect URI:
   ```
   https://your-app-name.up.railway.app/api/auth/google/callback
   ```
4. Add authorized JavaScript origins:
   ```
   https://your-app-name.up.railway.app
   ```

### Step 5: Run Database Migrations

After deployment, run migrations:

```bash
# Option 1: Via Railway CLI
railway run npm run db:push

# Option 2: Via Railway Dashboard
# Go to your database → "Connect" → Use the connection string
psql <connection-string> -f migrations/0000_lyrical_lady_ursula.sql
```

### Step 6: Set Up Custom Domain (Optional)

1. In Railway, go to your service → "Settings" → "Networking"
2. Click "Generate Domain" or add your custom domain
3. Railway will automatically provision SSL certificate

---

## 🔄 Alternative: Render Deployment

### Step 1: Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub

### Step 2: Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repo
3. Configure:
   - **Name:** foundrymatch
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free or Starter ($7/month)

### Step 3: Add PostgreSQL Database
1. Click "New" → "PostgreSQL"
2. Copy the `DATABASE_URL` connection string
3. Add it to your Web Service environment variables

### Step 4: Set Environment Variables
Same as Railway (see Step 3 above)

---

## 🔄 Alternative: Fly.io Deployment

### Step 1: Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Login
```bash
fly auth login
```

### Step 3: Initialize Fly App
```bash
cd /Users/shivamsharma/Downloads/FoundryMatch
fly launch
```

### Step 4: Create fly.toml
```toml
app = "foundrymatch"
primary_region = "iad"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "5000"
  NODE_ENV = "production"

[[services]]
  internal_port = 5000
  protocol = "tcp"
  [services.concurrency]
    hard_limit = 25
    soft_limit = 20

  [[services.ports]]
    handlers = ["http"]
    port = 80
    force_https = true

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.http_checks]]
    interval = "10s"
    timeout = "2s"
    grace_period = "5s"
    method = "GET"
    path = "/api/auth/csrf"
```

### Step 5: Deploy
```bash
fly deploy
```

### Step 6: Set Secrets
```bash
fly secrets set JWT_ACCESS_SECRET=<your-secret>
fly secrets set JWT_REFRESH_SECRET=<your-secret>
fly secrets set DATABASE_URL=<your-db-url>
# ... etc
```

---

## 📋 Pre-Deployment Checklist

- [ ] Generate new JWT secrets for production
- [ ] Update Google OAuth redirect URLs
- [ ] Set up production email (or use console logging)
- [ ] Update `CLIENT_ORIGIN` to production domain
- [ ] Test build locally: `npm run build && npm start`
- [ ] Run database migrations
- [ ] Set admin user in production database
- [ ] Test authentication flows
- [ ] Test project creation
- [ ] Set up monitoring (optional)

---

## 🔐 Security Checklist for Production

1. **Strong JWT Secrets:**
   ```bash
   openssl rand -base64 32  # Run twice for access and refresh secrets
   ```

2. **Secure Cookies:**
   - Already configured (`secure: true` in production)
   - `httpOnly: true` ✅
   - `sameSite: "lax"` ✅

3. **CORS:**
   - Update `CLIENT_ORIGIN` to your production domain
   - Remove `localhost` from allowed origins

4. **Environment Variables:**
   - Never commit `.env` to Git ✅
   - Use hosting platform's secret management

5. **Database:**
   - Use connection pooling
   - Enable SSL connections
   - Regular backups

---

## 🧪 Testing Production Deployment

After deployment, test:

1. **Health Check:**
   ```bash
   curl https://your-domain.com/api/auth/csrf
   ```

2. **Authentication:**
   - Register new account
   - Login
   - Google OAuth (if configured)

3. **Project Creation:**
   - Create a project
   - Verify it's pending approval

4. **Admin Functions:**
   - Login as admin
   - Approve a project
   - Verify it appears in public listing

---

## 🆘 Troubleshooting

### Build Fails
- Check build logs in Railway/Render dashboard
- Ensure all dependencies are in `package.json`
- Verify `npm run build` works locally

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check database is running
- Ensure migrations are run

### Authentication Not Working
- Verify `CLIENT_ORIGIN` matches your domain
- Check Google OAuth redirect URLs
- Verify JWT secrets are set

### Static Files Not Loading
- Check `dist/public` folder exists after build
- Verify `serveStatic` is configured correctly

---

## 📊 Monitoring (Optional)

Consider adding:
- **Sentry** for error tracking (free tier)
- **Logtail** for log aggregation (free tier)
- **Uptime Robot** for uptime monitoring (free)

---

## 💰 Cost Estimate

**Railway (Recommended):**
- Web Service: $5/month (or free tier)
- PostgreSQL: $5/month (or free tier)
- **Total: ~$10/month** (or free for small scale)

**Render:**
- Web Service: $7/month (free tier available)
- PostgreSQL: Free tier available
- **Total: ~$7/month** (or free)

**Fly.io:**
- Compute: ~$2-5/month
- PostgreSQL: ~$3-5/month
- **Total: ~$5-10/month**

All options fit well under your $50/month budget! 🎉

