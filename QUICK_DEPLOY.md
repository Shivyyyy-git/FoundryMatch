# Quick Railway Deployment Guide

## Fastest Way to Deploy

### 1. Push to GitHub (if not already)

```bash
cd /Users/shivamsharma/Downloads/FoundryMatch
git init  # if not already a git repo
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Railway

1. **Go to:** https://railway.app
2. **Sign up** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your FoundryMatch repo**

### 3. Add PostgreSQL Database

1. In Railway project, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway automatically creates `DATABASE_URL` environment variable ✅

### 4. Set Environment Variables

Click on your service → **"Variables"** tab → Add these:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=<auto-set-by-railway>

# Generate these with: openssl rand -base64 32
JWT_ACCESS_SECRET=<paste-generated-secret>
JWT_REFRESH_SECRET=<paste-generated-secret>

# Update after Railway gives you domain
CLIENT_ORIGIN=https://your-app.up.railway.app
GOOGLE_CALLBACK_URL=https://your-app.up.railway.app/api/auth/google/callback

# Your Google OAuth credentials
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Email (optional - can use console logging)
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=your_email@gmail.com
EMAIL_SMTP_PASS=your_app_password
EMAIL_FROM=Match Me Up Foundry <your_email@gmail.com>
```

### 5. Configure Build Settings

1. Go to **"Settings"** → **"Build"**
2. **Build Command:** `npm run build`
3. **Start Command:** `npm start`

### 6. Deploy!

Railway will automatically deploy. Wait for it to finish, then:

1. **Get your domain:** Railway gives you a URL like `https://foundrymatch-production.up.railway.app`
2. **Update Google OAuth:** Add this redirect URI in Google Console:
   ```
   https://foundrymatch-production.up.railway.app/api/auth/google/callback
   ```
3. **Update CLIENT_ORIGIN** in Railway variables to match your domain
4. **Redeploy** (Railway auto-redeploys when env vars change)

### 7. Run Database Migrations

After first deployment:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run npm run db:push
```

Or manually via Railway dashboard:
- Go to PostgreSQL → "Connect" → Use connection string
- Run migrations via psql

### 8. Make Yourself Admin

```bash
# Via Railway CLI
railway run psql -c "UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';"

# Or via Railway dashboard PostgreSQL connection
```

### 9. Test Your Live Site!

Visit your Railway domain and test:
- ✅ Registration
- ✅ Login
- ✅ Project creation
- ✅ Admin functions

---

## That's It! 🎉

Your app is now live at: `https://your-app.up.railway.app`

**Cost:** Free tier available, or ~$5-10/month for production use

**Next Steps:**
- Set up custom domain (optional)
- Configure monitoring
- Set up backups

See `DEPLOYMENT.md` for more detailed options and troubleshooting!

