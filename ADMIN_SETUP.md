# Admin Access Guide

## Current Status

**By default, NO ONE has admin access.** All new users are created with `isAdmin: false`.

## How Admin Access Works

- Admin status is stored in the `users` table as `is_admin` (boolean)
- The `requireAdmin` middleware checks if `req.authUser.isAdmin === true`
- Only admins can:
  - Approve/reject projects
  - Approve/reject profiles
  - Approve/reject startup showcases
  - Access admin dashboard (`/admin`)
  - View pending content queues

## How to Make Someone an Admin

### Option 1: Using PostgreSQL (Recommended)

```bash
# Connect to your database
psql -d foundrymatch

# Make a user admin by email
UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';

# Verify it worked
SELECT email, is_admin FROM users WHERE email = 'your-email@example.com';

# Exit psql
\q
```

### Option 2: Using SQL File

```bash
psql -d foundrymatch -c "UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';"
```

### Option 3: Make Yourself Admin (if you know your email)

```bash
# Replace with your actual email
psql -d foundrymatch -c "UPDATE users SET is_admin = true WHERE email = 'shivamsharma2023@gmail.com';"
```

## Verify Admin Status

After setting admin status, you need to **log out and log back in** for the JWT token to refresh with your new admin status.

### Check if you're admin:

1. **Via API:**
```bash
curl http://localhost:5001/api/auth/user -b /tmp/cookies.txt
```

Look for `"isAdmin": true` in the response.

2. **Via Database:**
```bash
psql -d foundrymatch -c "SELECT email, is_admin FROM users WHERE email = 'your-email@example.com';"
```

## Admin Features

Once you're an admin, you can:

1. **Access Admin Dashboard:** `http://localhost:5001/admin`
2. **Approve Projects:** `PUT /api/projects/:id/approve`
3. **Reject Projects:** `PUT /api/projects/:id/reject`
4. **View Pending Projects:** `GET /api/projects/pending`
5. **Approve/Reject Profiles** (when implemented)
6. **Approve/Reject Startups** (when implemented)

## Security Notes

- Admin actions are logged in the `admin_actions` table for audit trail
- Only admins can change approval statuses
- Admin status should be granted carefully - admins have full moderation powers

## Quick Setup Script

```bash
#!/bin/bash
# Make yourself admin (replace with your email)
EMAIL="shivamsharma2023@gmail.com"
psql -d foundrymatch -c "UPDATE users SET is_admin = true WHERE email = '$EMAIL';"
echo "✅ Admin status granted to $EMAIL"
echo "⚠️  Please log out and log back in for changes to take effect"
```

