# Step-by-Step Testing Guide

## Step 1: Verify Server is Running

```bash
curl http://localhost:5001/api/auth/csrf
```

**Expected:** You should see JSON like `{"csrfToken":"..."}`

If you get an error, start the server:
```bash
cd /Users/shivamsharma/Downloads/FoundryMatch
npm run dev
```

---

## Step 2: Get CSRF Token

```bash
CSRF_RESPONSE=$(curl -s -c /tmp/cookies.txt http://localhost:5001/api/auth/csrf)
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)
echo "CSRF Token: $CSRF_TOKEN"
```

**Expected:** You should see "CSRF Token: [some long string]"

---

## Step 3: Login (or Register First)

### Option A: If you already have an account

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -b /tmp/cookies.txt \
  -c /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{"email": "shivamsharma2023@gmail.com", "password": "YOUR_PASSWORD"}'
```

**Expected:** `{"message":"Login successful"}` or similar

### Option B: Register a new account first

```bash
# Get fresh CSRF token
CSRF_RESPONSE=$(curl -s -c /tmp/cookies.txt http://localhost:5001/api/auth/csrf)
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)

# Register
curl -X POST http://localhost:5001/api/auth/register \
  -b /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{"email": "test@example.com", "password": "Test1234", "name": "Test User", "userType": "student"}'
```

**Expected:** `{"message":"Account created. Please check your email..."}`

Then verify email in database:
```bash
psql -d foundrymatch -c "UPDATE users SET email_verified = true WHERE email = 'test@example.com';"
```

---

## Step 4: Refresh CSRF Token After Login

```bash
CSRF_RESPONSE=$(curl -s -c /tmp/cookies.txt http://localhost:5001/api/auth/csrf)
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)
echo "New CSRF Token: $CSRF_TOKEN"
```

---

## Step 5: Create a Project

```bash
curl -X POST http://localhost:5001/api/projects \
  -b /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{"title": "Build a React App", "description": "Looking for a frontend developer to build a modern React application.", "category": "software", "compensationType": "paid", "requiredSkills": ["React", "TypeScript"], "applicationDeadline": "2024-12-31T23:59:59Z"}'
```

**Expected:** JSON response with project data including `"status": "pending_approval"`

---

## Step 6: List All Projects (Public)

```bash
curl http://localhost:5001/api/projects
```

**Expected:** `{"projects":[]}` (empty if none approved yet, or list of approved projects)

---

## Step 7: Get Your Projects

```bash
curl http://localhost:5001/api/projects/mine -b /tmp/cookies.txt
```

**Expected:** JSON with your projects (including pending ones)

---

## Step 8: Get Single Project (if you have project ID)

Replace `PROJECT_ID` with actual ID from Step 5:

```bash
curl http://localhost:5001/api/projects/PROJECT_ID
```

---

## Troubleshooting

### If you get "Authentication required":
- Make sure you logged in (Step 3)
- Check cookies are saved: `cat /tmp/cookies.txt`

### If you get "CSRF token mismatch":
- Make sure you refreshed CSRF token after login (Step 4)
- Check token is set: `echo $CSRF_TOKEN`

### If you get HTML instead of JSON:
- Server might need restart: Stop with Ctrl+C, then `npm run dev`

### If login says "Please verify your email":
- Verify email in database:
```bash
psql -d foundrymatch -c "UPDATE users SET email_verified = true WHERE email = 'YOUR_EMAIL';"
```

