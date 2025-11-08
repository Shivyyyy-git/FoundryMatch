# 🧪 Testing Project API Endpoints

## Prerequisites

Before testing project endpoints, you need to:
1. **Be logged in** (have valid JWT cookies)
2. **Get a CSRF token** (required for POST/PUT/DELETE)

## Quick Setup

```bash
# 1. Get CSRF token and save cookies
CSRF_RESPONSE=$(curl -s -c /tmp/cookies.txt http://localhost:5001/api/auth/csrf)
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)

# 2. Login (if not already logged in)
curl -X POST http://localhost:5001/api/auth/login \
  -b /tmp/cookies.txt \
  -c /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'

# 3. Refresh CSRF token after login
CSRF_RESPONSE=$(curl -s -c /tmp/cookies.txt http://localhost:5001/api/auth/csrf)
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)
```

## Project Endpoints

### 1. Create Project (POST /api/projects)

```bash
curl -X POST http://localhost:5001/api/projects \
  -b /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{
    "title": "Build a React App",
    "description": "Looking for a frontend developer to build a modern React application with TypeScript.",
    "category": "software",
    "compensationType": "paid",
    "requiredSkills": ["React", "TypeScript", "CSS"],
    "applicationDeadline": "2024-12-31T23:59:59Z"
  }'
```

**Expected Response:**
```json
{
  "project": {
    "id": "...",
    "creatorId": "...",
    "title": "Build a React App",
    "status": "pending_approval",
    ...
  }
}
```

### 2. List Projects (GET /api/projects)

**Public endpoint - no auth required:**

```bash
# Get all approved projects
curl http://localhost:5001/api/projects

# Filter by category
curl "http://localhost:5001/api/projects?category=software"

# Filter by compensation type
curl "http://localhost:5001/api/projects?compensationType=paid"

# Search by text
curl "http://localhost:5001/api/projects?search=react"

# Filter by skills
curl "http://localhost:5001/api/projects?skills=React&skills=TypeScript"

# Combine filters
curl "http://localhost:5001/api/projects?category=software&compensationType=paid&search=react&limit=10"
```

### 3. Get Single Project (GET /api/projects/:id)

```bash
# Replace PROJECT_ID with actual ID from create response
curl http://localhost:5001/api/projects/PROJECT_ID
```

### 4. Get My Projects (GET /api/projects/mine)

**Requires authentication:**

```bash
curl http://localhost:5001/api/projects/mine \
  -b /tmp/cookies.txt
```

**Expected Response:**
```json
{
  "projects": [
    {
      "id": "...",
      "title": "...",
      "status": "pending_approval",
      ...
    }
  ]
}
```

### 5. Update Project (PUT /api/projects/:id)

**Only works if project is pending_approval or rejected:**

```bash
# Refresh CSRF token
CSRF_RESPONSE=$(curl -s -c /tmp/cookies.txt http://localhost:5001/api/auth/csrf)
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)

curl -X PUT http://localhost:5001/api/projects/PROJECT_ID \
  -b /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{
    "title": "Updated Title",
    "description": "Updated description"
  }'
```

### 6. Delete Project (DELETE /api/projects/:id)

```bash
# Refresh CSRF token
CSRF_RESPONSE=$(curl -s -c /tmp/cookies.txt http://localhost:5001/api/auth/csrf)
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)

curl -X DELETE http://localhost:5001/api/projects/PROJECT_ID \
  -b /tmp/cookies.txt \
  -H "X-CSRF-Token: $CSRF_TOKEN"
```

**Expected Response:** `204 No Content`

## Admin Endpoints

### 7. Get Pending Projects (GET /api/projects/pending)

**Requires admin authentication:**

```bash
curl http://localhost:5001/api/projects/pending \
  -b /tmp/cookies.txt
```

### 8. Approve Project (PUT /api/projects/:id/approve)

**Admin only:**

```bash
# Refresh CSRF token
CSRF_RESPONSE=$(curl -s -c /tmp/cookies.txt http://localhost:5001/api/auth/csrf)
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)

curl -X PUT http://localhost:5001/api/projects/PROJECT_ID/approve \
  -b /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{
    "reason": "Looks good!"
  }'
```

### 9. Reject Project (PUT /api/projects/:id/reject)

**Admin only:**

```bash
# Refresh CSRF token
CSRF_RESPONSE=$(curl -s -c /tmp/cookies.txt http://localhost:5001/api/auth/csrf)
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)

curl -X PUT http://localhost:5001/api/projects/PROJECT_ID/reject \
  -b /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{
    "reason": "Does not meet our guidelines"
  }'
```

## Complete Test Script

Save this as `test-projects.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5001"
COOKIE_FILE="/tmp/cookies.txt"

# Get CSRF token
echo "🔑 Getting CSRF token..."
CSRF_RESPONSE=$(curl -s -c $COOKIE_FILE "$BASE_URL/api/auth/csrf")
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)
echo "CSRF Token: $CSRF_TOKEN"

# Login
echo "🔐 Logging in..."
curl -X POST "$BASE_URL/api/auth/login" \
  -b $COOKIE_FILE \
  -c $COOKIE_FILE \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'

# Refresh CSRF token
CSRF_RESPONSE=$(curl -s -c $COOKIE_FILE "$BASE_URL/api/auth/csrf")
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)

# Create project
echo "📝 Creating project..."
PROJECT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/projects" \
  -b $COOKIE_FILE \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{
    "title": "Build a React App",
    "description": "Looking for a frontend developer to build a modern React application.",
    "category": "software",
    "compensationType": "paid",
    "requiredSkills": ["React", "TypeScript"],
    "applicationDeadline": "2024-12-31T23:59:59Z"
  }')

echo "$PROJECT_RESPONSE" | jq '.'

# Extract project ID
PROJECT_ID=$(echo "$PROJECT_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "Project ID: $PROJECT_ID"

# List projects
echo "📋 Listing projects..."
curl -s "$BASE_URL/api/projects" | jq '.'

# Get my projects
echo "👤 Getting my projects..."
curl -s "$BASE_URL/api/projects/mine" -b $COOKIE_FILE | jq '.'
```

**Make it executable:**
```bash
chmod +x test-projects.sh
./test-projects.sh
```

## Common Issues

### "CSRF token mismatch"
- Make sure you're including the CSRF token in headers
- Refresh the CSRF token after login
- Use `-b /tmp/cookies.txt` to send cookies

### "Authentication required"
- Make sure you're logged in
- Check that cookies are being sent (`-b /tmp/cookies.txt`)
- Verify JWT tokens are set in cookies

### "You can only update your own projects"
- You're trying to update a project you didn't create
- Check the project's `creatorId` matches your user ID

### "You can only update projects that are pending approval or rejected"
- Project is already approved/active/closed
- Only pending or rejected projects can be edited

## Project Categories

Valid categories:
- `software`
- `research`
- `product`
- `design`
- `marketing`
- `hardware`
- `data_science`

## Compensation Types

Valid compensation types:
- `paid`
- `equity`
- `academic_credit`
- `volunteer`

## Project Statuses

- `pending_approval` - Waiting for admin approval
- `approved` - Approved and visible publicly
- `rejected` - Rejected by admin
- `active` - Currently active (future use)
- `closed` - Project closed (future use)

