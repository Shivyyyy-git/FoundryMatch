#!/bin/bash

cd /Users/shivamsharma/Downloads/FoundryMatch

echo "🚀 Setting up GitHub repository..."
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add all files
echo "📝 Adding files..."
git add .

# Create commit
echo "💾 Creating commit..."
git commit -m "Initial commit - Ready for deployment" 2>/dev/null || echo "⚠️  Already committed or no changes"

# Ask for GitHub repo URL
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 GitHub Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to https://github.com/new"
echo "2. Create a new repository named 'FoundryMatch'"
echo "3. Don't initialize with README, .gitignore, or license"
echo "4. Copy the repository URL"
echo ""
echo "Enter your GitHub repository URL:"
echo "(e.g., https://github.com/yourusername/FoundryMatch.git)"
read REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

# Remove existing remote if any
git remote remove origin 2>/dev/null

# Add remote
echo "🔗 Adding remote repository..."
git remote add origin "$REPO_URL"

# Set main branch
git branch -M main

# Push
echo "⬆️  Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Code pushed to GitHub!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎯 Next Steps:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Go to https://railway.app"
    echo "2. Sign up with GitHub"
    echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
    echo "4. Select your FoundryMatch repository"
    echo "5. Follow the deployment guide!"
    echo ""
else
    echo ""
    echo "❌ Push failed. Check your repository URL and try again."
    echo "Make sure you've created the repository on GitHub first!"
fi
