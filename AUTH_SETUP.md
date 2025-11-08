# Authentication Setup & Testing Guide

## Quick Start

1. **Copy environment template:**
   ```bash
   cp env.example .env
   ```

2. **Generate secrets:**
   ```bash
   # Generate JWT secrets
   openssl rand -base64 32  # Use this for JWT_ACCESS_SECRET
   openssl rand -base64 32  # Use this for JWT_REFRESH_SECRET
   openssl rand -base64 32  # Use this for SESSION_SECRET
   ```

3. **Set up database:**
   - Update `DATABASE_URL` in `.env` with your PostgreSQL connection string
   - Run migrations: `npm run db:push`

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

## Google OAuth Setup (Optional)

If you want to enable Google Sign-In:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
6. Copy the Client ID and Client Secret to your `.env` file

**Note:** If Google OAuth is not configured, the app will still work with email/password authentication. Google login will simply be disabled.

## Email Configuration (Optional)

For email verification and password resets:

### Gmail Setup:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password (not your regular password) in `EMAIL_SMTP_PASS`

### Other SMTP Providers:
Update the SMTP settings in `.env` according to your provider's documentation.

**Note:** If email is not configured, verification emails and password reset emails will be logged to the console instead of being sent. This is fine for development/testing.

## Testing Authentication

### 1. Test Email/Password Registration

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "name": "Test User",
    "userType": "student"
  }'
```

**Expected Response:**
- Status: 201 Created
- Message: "Account created. Please check your email to verify your account."
- If email is not configured, check console logs for verification link

### 2. Test Email Verification

```bash
# Get verification token from console logs (if email not configured)
# Or check your email for the verification link
curl "http://localhost:5000/api/auth/verify-email?token=YOUR_TOKEN_HERE"
```

**Expected Response:**
- Sets httpOnly cookies (access_token, refresh_token)
- Returns user profile JSON

### 3. Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

**Expected Response:**
- Sets httpOnly cookies
- Returns user profile JSON

### 4. Test Protected Route

```bash
# Get CSRF token first
curl http://localhost:5000/api/auth/csrf -c cookies.txt

# Use the access token from cookies
curl http://localhost:5000/api/auth/user \
  -b cookies.txt \
  -H "X-CSRF-Token: YOUR_CSRF_TOKEN"
```

### 5. Test Google OAuth (if configured)

1. Navigate to: `http://localhost:5000/api/auth/google`
2. You'll be redirected to Google for authentication
3. After approval, you'll be redirected back with cookies set

### 6. Test Password Reset

```bash
# Request password reset
curl -X POST http://localhost:5000/api/auth/password-reset/request \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Check console logs or email for reset token, then:
curl -X POST http://localhost:5000/api/auth/password-reset/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_RESET_TOKEN",
    "password": "NewPassword123"
  }'
```

## Frontend Integration

The React client needs to be updated to use the new auth endpoints:

### Key Changes Needed:

1. **Update auth hooks** (`client/src/hooks/useAuth.ts`):
   - Use `/api/auth/login` instead of Replit auth
   - Handle JWT cookies (httpOnly, automatically sent)
   - Fetch CSRF token before POST requests
   - Handle Google OAuth redirect flow

2. **Update login/signup forms**:
   - Add email/password fields
   - Add Google OAuth button linking to `/api/auth/google`
   - Handle email verification flow

3. **Update protected routes**:
   - Use `requireAuth` middleware (already implemented)
   - Check `/api/auth/user` endpoint for current user

4. **Handle CSRF tokens**:
   - Fetch CSRF token on app load: `GET /api/auth/csrf`
   - Include in headers for POST/PUT/DELETE: `X-CSRF-Token`

## Common Issues

### "JWT secrets are not configured"
- Make sure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set in `.env`

### "DATABASE_URL must be set"
- Ensure your `.env` file has a valid PostgreSQL connection string

### Google OAuth not working
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Verify redirect URI matches exactly: `http://localhost:5000/api/auth/google/callback`
- Check browser console for OAuth errors

### Emails not sending
- If SMTP is not configured, emails are logged to console (this is expected)
- Check console logs for email content and verification links
- For production, configure real SMTP settings

### CORS errors
- Ensure `CLIENT_ORIGIN` matches your frontend URL exactly
- For multiple origins, use comma-separated list: `http://localhost:5173,http://localhost:3000`

## Next Steps

Once authentication is working:

1. **Project Posting System**
   - `POST /api/projects` - create project (pending approval)
   - `GET /api/projects` - list approved projects
   - `PUT /api/projects/:id` - update own project
   - `DELETE /api/projects/:id` - delete own project

2. **Admin Dashboard**
   - `GET /api/admin/pending` - approval queue
   - `POST /api/admin/approve/:type/:id` - approve content
   - `POST /api/admin/reject/:type/:id` - reject content

3. **Frontend Updates**
   - Update React components to use new auth endpoints
   - Add login/signup forms
   - Add Google OAuth button
   - Update protected route handling

