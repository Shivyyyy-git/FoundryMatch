# Authentication System - Quick Reference

## ✅ What's Implemented

### Backend Authentication
- ✅ Google OAuth (any Gmail account, no domain restrictions)
- ✅ Email/Password registration with email verification
- ✅ Password reset flow
- ✅ JWT-based session management with refresh token rotation
- ✅ CSRF protection
- ✅ Rate limiting on auth endpoints
- ✅ Secure httpOnly cookies
- ✅ Auth middleware (`requireAuth`, `requireAdmin`, `optionalAuth`)

### API Endpoints

**Authentication:**
- `GET /api/auth/csrf` - Get CSRF token
- `POST /api/auth/register` - Register with email/password
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout (revokes refresh token)
- `GET /api/auth/verify-email?token=...` - Verify email address
- `POST /api/auth/password-reset/request` - Request password reset
- `POST /api/auth/password-reset/confirm` - Confirm password reset
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

**User/Profile:**
- `GET /api/auth/user` - Get current authenticated user
- `GET /api/profile/me` - Get current user's profile
- `PUT /api/profile` - Update profile (requires CSRF)

## 🚀 Quick Start

1. **Copy environment template:**
   ```bash
   cp env.example .env
   ```

2. **Generate JWT secrets:**
   ```bash
   openssl rand -base64 32  # JWT_ACCESS_SECRET
   openssl rand -base64 32  # JWT_REFRESH_SECRET
   ```

3. **Set DATABASE_URL** in `.env`

4. **Run migrations:**
   ```bash
   npm run db:push
   ```

5. **Start server:**
   ```bash
   npm run dev
   ```

## 📝 Environment Variables

**Required:**
- `JWT_ACCESS_SECRET` - Secret for access tokens (min 32 chars)
- `JWT_REFRESH_SECRET` - Secret for refresh tokens (min 32 chars)
- `DATABASE_URL` - PostgreSQL connection string

**Optional (for Google OAuth):**
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `GOOGLE_CALLBACK_URL` - Defaults to `/api/auth/google/callback`

**Optional (for email):**
- `EMAIL_SMTP_HOST`, `EMAIL_SMTP_PORT`, `EMAIL_SMTP_USER`, `EMAIL_SMTP_PASS`
- If not set, emails are logged to console (fine for development)

**Client URLs:**
- `CLIENT_ORIGIN` - Frontend URL (defaults to `http://localhost:5173`)
- `APP_BASE_URL` - Base URL for email links
- `GOOGLE_SUCCESS_REDIRECT` - Where to redirect after Google OAuth success
- `GOOGLE_FAILURE_REDIRECT` - Where to redirect after Google OAuth failure

## 🧪 Testing

See `AUTH_SETUP.md` for detailed testing instructions.

**Quick test:**
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","name":"Test User"}'

# Check console for verification token, then verify
curl "http://localhost:5000/api/auth/verify-email?token=TOKEN_FROM_CONSOLE"

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"Test1234"}'

# Get current user (uses cookies)
curl http://localhost:5000/api/auth/user -b cookies.txt
```

## 🔒 Security Features

- **JWT Tokens**: Short-lived access tokens (15min) + long-lived refresh tokens (7 days)
- **Refresh Token Rotation**: New refresh token issued on each refresh
- **httpOnly Cookies**: Tokens stored in httpOnly cookies (not accessible via JavaScript)
- **CSRF Protection**: All state-changing operations require CSRF token
- **Rate Limiting**: 10 requests/minute on auth endpoints
- **Password Hashing**: bcrypt with 12 rounds
- **Email Verification**: Required before account activation
- **Secure Cookies**: `secure` flag in production, `sameSite` protection

## 📋 Next Steps

1. **Frontend Integration** - Update React client to use new auth endpoints
2. **Project Posting** - Implement project CRUD with approval workflow
3. **Admin Dashboard** - Build admin approval queue and moderation tools

See `AUTH_SETUP.md` for detailed setup and testing instructions.

