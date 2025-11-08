# Testing Authentication - Step by Step Guide

## Prerequisites
1. **Server must be running** in one terminal window:
   ```bash
   cd /Users/shivamsharma/Downloads/FoundryMatch
   npm run dev
   ```
   You should see: `serving on port 5001`

2. **Open a NEW terminal window** (keep the server running in the first one)

## Step-by-Step Testing

### Step 1: Get CSRF Token
In the NEW terminal window, run:
```bash
cd /Users/shivamsharma/Downloads/FoundryMatch
curl -c /tmp/cookies.txt http://localhost:5001/api/auth/csrf
```

**Expected output:**
```json
{"csrfToken":"some_long_token_here"}
```

### Step 2: Extract the Token
```bash
CSRF_TOKEN=$(curl -s -b /tmp/cookies.txt http://localhost:5001/api/auth/csrf | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)
echo "CSRF Token: $CSRF_TOKEN"
```

### Step 3: Register a New User
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -b /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "name": "Test User",
    "userType": "student"
  }'
```

**Expected output:**
```json
{"message":"Account created. Please check your email to verify your account."}
```

### Step 4: Check Server Console for Verification Token
Look at the terminal where `npm run dev` is running. You should see something like:
```
Email transport not configured. Email content:
{
  "sender": "MatchMeUp Foundry <no-reply@matchmeupfoundry.com>",
  "to": "test@example.com",
  "subject": "Verify your Match Me Up Foundry account",
  ...
}
```

The verification URL will be in the email content. Copy the token from the URL.

### Step 5: Verify Email
```bash
# Replace YOUR_TOKEN_HERE with the token from server console
curl "http://localhost:5001/api/auth/verify-email?token=YOUR_TOKEN_HERE"
```

**Expected output:**
```json
{
  "id": "...",
  "email": "test@example.com",
  "userType": "student",
  ...
}
```

### Step 6: Login
```bash
# Get fresh CSRF token
curl -c /tmp/cookies.txt http://localhost:5001/api/auth/csrf > /dev/null
CSRF_TOKEN=$(curl -s -b /tmp/cookies.txt http://localhost:5001/api/auth/csrf | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)

curl -X POST http://localhost:5001/api/auth/login \
  -b /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

**Expected output:**
```json
{
  "id": "...",
  "email": "test@example.com",
  "userType": "student",
  "profile": {...}
}
```

### Step 7: Get Current User (Protected Route)
```bash
curl http://localhost:5001/api/auth/user -b /tmp/cookies.txt
```

**Expected output:**
```json
{
  "id": "...",
  "email": "test@example.com",
  ...
}
```

## Troubleshooting

**If you get "CSRF token mismatch":**
- Make sure you're using the same cookie file (`-b /tmp/cookies.txt`)
- Make sure the CSRF token matches what's in the cookie

**If you get "Internal Server Error":**
- Check the server console (where `npm run dev` is running) for error details
- Make sure the database is running: `psql -h localhost -d foundrymatch -c "SELECT 1;"`

**If you get "address already in use":**
- Kill the process: `lsof -ti:5001 | xargs kill -9`
- Or use a different port: `PORT=5002 npm run dev`

