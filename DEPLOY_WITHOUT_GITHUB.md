# Deploy Without GitHub

You have two options:

## Option 1: Push to GitHub First (Recommended - 5 minutes)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `FoundryMatch`
3. **Don't** initialize with README, .gitignore, or license
4. Copy the repository URL (e.g., `https://github.com/yourusername/FoundryMatch.git`)

### Step 2: Push Your Code

```bash
cd /Users/shivamsharma/Downloads/FoundryMatch

# Initialize git (if not already)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Ready for deployment"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/FoundryMatch.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy from GitHub

Now follow the Railway deployment guide - it will connect to your GitHub repo!

---

## Option 2: Deploy Directly (No GitHub Needed)

Some platforms let you deploy directly from your computer:

### Railway CLI (Direct Upload)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize Railway project
cd /Users/shivamsharma/Downloads/FoundryMatch
railway init

# Link to new project
railway link

# Add PostgreSQL database
railway add postgresql

# Set environment variables (see below)
railway variables set NODE_ENV=production
railway variables set PORT=5000
# ... (set all other variables)

# Deploy!
railway up
```

### Render (Direct Upload)

1. Go to https://render.com
2. Sign up/login
3. Click "New" → "Web Service"
4. Choose "Deploy without Git" or "Public Git Repository"
5. Upload your code directly

### Fly.io (Direct Upload)

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
cd /Users/shivamsharma/Downloads/FoundryMatch
fly launch

# Follow prompts to deploy
```

---

## Quick GitHub Setup Script

Run this to quickly set up GitHub:

```bash
#!/bin/bash
cd /Users/shivamsharma/Downloads/FoundryMatch

# Check if git is initialized
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
fi

# Add all files
git add .

# Create commit
git commit -m "Initial commit - Ready for deployment" || echo "Already committed"

# Ask for GitHub repo URL
echo ""
echo "Enter your GitHub repository URL (e.g., https://github.com/username/FoundryMatch.git):"
read REPO_URL

# Add remote and push
git remote remove origin 2>/dev/null
git remote add origin $REPO_URL
git branch -M main
git push -u origin main

echo "✅ Code pushed to GitHub!"
echo "Now you can deploy via Railway dashboard!"
```

Save as `setup-github.sh`, make executable, and run:
```bash
chmod +x setup-github.sh
./setup-github.sh
```

---

## Recommended: GitHub + Railway

**Why GitHub?**
- ✅ Easy updates (just push to GitHub)
- ✅ Version control
- ✅ Automatic deployments on push
- ✅ Free and easy

**Time:** ~5 minutes to set up, then deployments are automatic!

---

## Alternative: Railway CLI (No GitHub)

If you really don't want GitHub, use Railway CLI:

```bash
npm install -g @railway/cli
railway login
cd /Users/shivamsharma/Downloads/FoundryMatch
railway init
railway add postgresql
railway up
```

This uploads directly from your computer!

