# 🚀 Quick Start - Testing Auth System

## Start the Server

```bash
cd /Users/shivamsharma/Downloads/FoundryMatch
npm run dev
```

**Access:** Open `http://localhost:5001` in your browser

## ✅ Quick Test Flow

### 1. Registration (2 minutes)
- Go to `/register`
- Fill form: Name, Email, Password, User Type
- Submit → Check server console for verification token

### 2. Email Verification (1 minute)
- Copy token from console
- Go to `/verify-email?token=TOKEN_HERE`
- Or manually verify: `psql -d foundrymatch -c "UPDATE users SET email_verified = true WHERE email = 'YOUR_EMAIL';"`

### 3. Login (1 minute)
- Go to `/login`
- Enter credentials
- Should redirect to `/home`

### 4. Test Protected Routes (1 minute)
- Logout
- Try accessing `/home` → Should redirect to `/login`
- Login again → Should access `/home`

### 5. Session Persistence (30 seconds)
- Login
- Refresh page (F5)
- Should stay logged in

## 🐛 Quick Debugging

**Check Browser DevTools:**
- Network tab: Watch `/api/auth/*` requests
- Application → Cookies: Should see `access_token`, `refresh_token`, `csrf_token`
- Console: Check for errors

**Check Server Console:**
- API logs: `GET /api/auth/user 200 in 5ms`
- Email tokens: Printed if SMTP not configured
- Errors: Any red error messages

## 📋 What's Ready

✅ Registration form (`/register`)
✅ Login form (`/login`)
✅ Email verification (`/verify-email`)
✅ Google OAuth button (redirects to `/api/auth/google`)
✅ Protected routes (redirect to `/login` if not authenticated)
✅ Session persistence (JWT cookies)
✅ Logout functionality
✅ Navigation updates based on auth state

## 🎯 Success Criteria

- ✅ Can register new account
- ✅ Can verify email (or manually in DB)
- ✅ Can login with verified account
- ✅ Protected routes require auth
- ✅ Session persists across refreshes
- ✅ Logout clears session

## 📝 Report Issues

Include:
1. What you tried
2. What happened
3. Browser console errors
4. Server console errors

**Ready to test!** Start the server and begin with registration.

