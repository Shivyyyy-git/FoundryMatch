#!/bin/bash

echo "=========================================="
echo "Step-by-Step Project API Testing"
echo "=========================================="
echo ""

# Step 1: Check server
echo "Step 1: Checking if server is running..."
if curl -s http://localhost:5001/api/auth/csrf > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running. Please run: npm run dev"
    exit 1
fi
echo ""

# Step 2: Get CSRF token
echo "Step 2: Getting CSRF token..."
CSRF_RESPONSE=$(curl -s -c /tmp/cookies.txt http://localhost:5001/api/auth/csrf)
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)
if [ -z "$CSRF_TOKEN" ]; then
    echo "❌ Failed to get CSRF token"
    exit 1
fi
echo "✅ CSRF Token: ${CSRF_TOKEN:0:20}..."
echo ""

# Step 3: Login
echo "Step 3: Logging in..."
echo "Enter your email:"
read EMAIL
echo "Enter your password:"
read -s PASSWORD

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -b /tmp/cookies.txt \
  -c /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

if echo "$LOGIN_RESPONSE" | grep -q "successful\|message"; then
    echo "✅ Login response: $LOGIN_RESPONSE"
else
    echo "❌ Login failed: $LOGIN_RESPONSE"
    echo "Note: If you see 'Please verify your email', verify it in the database:"
    echo "psql -d foundrymatch -c \"UPDATE users SET email_verified = true WHERE email = '$EMAIL';\""
    exit 1
fi
echo ""

# Step 4: Refresh CSRF token
echo "Step 4: Refreshing CSRF token..."
CSRF_RESPONSE=$(curl -s -c /tmp/cookies.txt http://localhost:5001/api/auth/csrf)
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)
echo "✅ New CSRF Token: ${CSRF_TOKEN:0:20}..."
echo ""

# Step 5: Create project
echo "Step 5: Creating a project..."
PROJECT_RESPONSE=$(curl -s -X POST http://localhost:5001/api/projects \
  -b /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{"title": "Build a React App", "description": "Looking for a frontend developer to build a modern React application.", "category": "software", "compensationType": "paid", "requiredSkills": ["React", "TypeScript"], "applicationDeadline": "2024-12-31T23:59:59Z"}')

if echo "$PROJECT_RESPONSE" | grep -q "project\|id"; then
    echo "✅ Project created successfully!"
    echo "$PROJECT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$PROJECT_RESPONSE"
    
    # Extract project ID
    PROJECT_ID=$(echo "$PROJECT_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    if [ ! -z "$PROJECT_ID" ]; then
        echo ""
        echo "Project ID: $PROJECT_ID"
    fi
else
    echo "❌ Failed to create project: $PROJECT_RESPONSE"
    exit 1
fi
echo ""

# Step 6: List projects
echo "Step 6: Listing all projects..."
LIST_RESPONSE=$(curl -s http://localhost:5001/api/projects)
echo "$LIST_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LIST_RESPONSE"
echo ""

# Step 7: Get my projects
echo "Step 7: Getting my projects..."
MY_PROJECTS=$(curl -s http://localhost:5001/api/projects/mine -b /tmp/cookies.txt)
echo "$MY_PROJECTS" | python3 -m json.tool 2>/dev/null || echo "$MY_PROJECTS"
echo ""

echo "=========================================="
echo "✅ Testing complete!"
echo "=========================================="
