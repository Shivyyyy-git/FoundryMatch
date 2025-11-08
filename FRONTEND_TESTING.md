# 🧪 Frontend Auth Testing Guide

## 🚀 Quick Start

**Important:** This is a monorepo - ONE command starts everything!

```bash
# From project root
cd /Users/shivamsharma/Downloads/FoundryMatch
npm run dev
```

This starts:
- ✅ Express backend on port **5001**
- ✅ Vite dev server (served through Express middleware)
- ✅ Both accessible at `http://localhost:5001`

**Access the app:** Open `http://localhost:5001` in your browser

## ✅ Testing Checklist

### 1. Registration Flow

**Steps:**
1. Navigate to `http://localhost:5001/register`
2. Fill out form:
   - Name: "Test User"
   - Email: "newuser@example.com" (use unique email each time)
   - Password: "Test1234" (must have uppercase, lowercase, number)
   - User Type: Select "Student"
3. Click "Create Account"

**Expected Results:**
- ✅ Success message appears
- ✅ Check server console (terminal) for verification token
- ✅ Form shows success state

**What to check:**
- [ ] Form validation works (try invalid email/password)
- [ ] Password requirements are clear
- [ ] Error messages display correctly
- [ ] Success message appears

### 2. Email Verification

**Steps:**
1. Copy verification token from server console
2. Navigate to: `http://localhost:5001/verify-email?token=TOKEN_FROM_CONSOLE`
3. Or manually verify in database (for testing):
   ```bash
   psql -h localhost -d foundrymatch -c "UPDATE users SET email_verified = true WHERE email = 'newuser@example.com';"
   ```

**Expected Results:**
- ✅ "Email Verified!" success message
- ✅ Redirects to `/home`
- ✅ User is logged in

**What to check:**
- [ ] Token validation works
- [ ] Expired tokens show error
- [ ] Success UI displays
- [ ] Auto-redirect works

### 3. Login Flow

**Steps:**
1. Navigate to `http://localhost:5001/login`
2. Enter credentials:
   - Email: "newuser@example.com"
   - Password: "Test1234"
3. Click "Sign In"

**Expected Results:**
- ✅ Redirects to `/home` after login
- ✅ Navigation shows user avatar/name
- ✅ Protected routes accessible
- ✅ User data loads

**What to check:**
- [ ] Loading spinner during login
- [ ] Error for wrong credentials
- [ ] "Please verify email" if not verified
- [ ] Redirect works correctly

### 4. Google OAuth

**Steps:**
1. Click "Sign in with Google" button
2. Should redirect to Google OAuth
3. After approval, redirects back

**Expected Results:**
- ✅ Redirects to `/api/auth/google`
- ✅ Google OAuth page appears
- ✅ After approval, redirects back
- ✅ User logged in automatically

**Note:** If Google OAuth not configured, button will redirect but may fail. Check `.env` for `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

### 5. Protected Routes

**Steps:**
1. Logout (if logged in)
2. Try accessing: `/home`, `/profile`, `/project-gigs`
3. Should redirect to login

**Expected Results:**
- ✅ Redirects to `/login` when not authenticated
- ✅ Can access routes after login
- ✅ Navigation shows/hides based on auth state

### 6. Session Persistence

**Steps:**
1. Login successfully
2. Refresh page (F5 or Cmd+R)
3. Check if still logged in

**Expected Results:**
- ✅ User stays logged in
- ✅ User data loads correctly
- ✅ Protected routes accessible
- ✅ Cookies set (check DevTools → Application → Cookies)

**What to check:**
- [ ] JWT cookies (`access_token`, `refresh_token`) exist
- [ ] Cookies are httpOnly
- [ ] User query refetches on load
- [ ] No auth errors in console

### 7. Logout Flow

**Steps:**
1. Click user avatar in navigation
2. Click "Log out"
3. Should redirect to landing page

**Expected Results:**
- ✅ Logs out successfully
- ✅ Redirects to `/`
- ✅ Cookies cleared
- ✅ User data cleared

## 🔍 Debugging Tools

### Browser DevTools

**Network Tab:**
- Watch API requests to `/api/auth/*`
- Check request headers (should include `X-CSRF-Token`)
- Check response status codes

**Application Tab → Cookies:**
- Should see: `csrf_token`, `access_token`, `refresh_token`
- Cookies should be httpOnly (not visible in JavaScript)

**Console Tab:**
- Check for JavaScript errors
- Look for React errors
- Check for fetch errors

### Server Console

Check terminal where `npm run dev` is running:
- API request logs: `GET /api/auth/user 200 in 5ms`
- Error messages
- Email verification tokens (if SMTP not configured)

## 🐛 Common Issues & Quick Fixes

### "CSRF token mismatch"
**Fix:** CSRF token should be fetched automatically. Check browser console for errors.

### "Authentication required" on protected routes
**Fix:** Check cookies exist in DevTools. Try logging in again.

### Google OAuth redirect fails
**Fix:** Check `.env` has Google credentials. If not configured, OAuth won't work (but email/password will).

### Email verification doesn't work
**Fix:** Check server console for token. Or manually verify:
```bash
psql -h localhost -d foundrymatch -c "UPDATE users SET email_verified = true WHERE email = 'YOUR_EMAIL';"
```

### Form doesn't submit
**Fix:** Check browser console for errors. Verify CSRF token is being fetched.

## 📋 Test Results Template

Use this to track your testing:

```
✅ Registration: [PASS/FAIL] - Notes:
✅ Email Verification: [PASS/FAIL] - Notes:
✅ Login: [PASS/FAIL] - Notes:
✅ Google OAuth: [PASS/FAIL/SKIP] - Notes:
✅ Protected Routes: [PASS/FAIL] - Notes:
✅ Session Persistence: [PASS/FAIL] - Notes:
✅ Logout: [PASS/FAIL] - Notes:

Issues Found:
1. 
2. 
3. 
```

## 🎯 Success Criteria

All flows should work:
- ✅ Registration creates account
- ✅ Email verification works (or manual DB update)
- ✅ Login works with verified account
- ✅ Protected routes require authentication
- ✅ Logout clears session
- ✅ Session persists across refreshes
- ✅ Google OAuth works (if configured)

## 🚨 Report Issues

When reporting issues, include:
1. **What you tried:** Step-by-step what you did
2. **What happened:** Actual result
3. **What you expected:** Expected result
4. **Browser console errors:** Copy any red errors
5. **Server console errors:** Copy any errors from terminal
6. **Screenshot:** If UI issue

## 🎉 Ready to Test!

Start the server and begin testing:

```bash
npm run dev
```

Then open `http://localhost:5001` and start with the registration flow!
