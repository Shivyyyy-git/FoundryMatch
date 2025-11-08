# Next Steps - Development Roadmap

## ✅ Completed
- ✅ Custom authentication system (Google OAuth + Email/Password)
- ✅ Database schema and migrations
- ✅ JWT session management with refresh tokens
- ✅ CSRF protection
- ✅ Server running on port 5001

## 🎯 Immediate Next Steps

### 1. **Test Authentication Endpoints** (5 minutes)
Verify everything works:

```bash
# Test registration
curl -c /tmp/cookies.txt http://localhost:5001/api/auth/csrf
CSRF_TOKEN=$(curl -s -b /tmp/cookies.txt http://localhost:5001/api/auth/csrf | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)

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

# Check server logs for verification token (if email not configured)
# Then verify email:
curl "http://localhost:5001/api/auth/verify-email?token=TOKEN_FROM_CONSOLE"

# Test login
curl -X POST http://localhost:5001/api/auth/login \
  -b /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### 2. **Update React Frontend** (High Priority)
Update the client to use new auth endpoints:

**Files to update:**
- `client/src/hooks/useAuth.ts` - Replace Replit auth with new JWT-based auth
- `client/src/pages/Landing.tsx` - Add login/signup forms
- `client/src/pages/Profile.tsx` - Update to use new profile endpoints
- `client/src/App.tsx` - Add auth route protection

**Key changes needed:**
- Fetch CSRF token on app load: `GET /api/auth/csrf`
- Include CSRF token in all POST/PUT/DELETE requests
- Handle JWT cookies (httpOnly, automatically sent by browser)
- Update login/signup forms to use new endpoints
- Add Google OAuth button linking to `/api/auth/google`

### 3. **Implement Project Posting System** (Medium Priority)
Create project CRUD endpoints with approval workflow:

**Endpoints to build:**
- `POST /api/projects` - Create project (status: pending_approval)
- `GET /api/projects` - List approved projects (with filters)
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update own project
- `DELETE /api/projects/:id` - Delete own project

**Files to create/update:**
- `server/routes/projectRoutes.ts` - New project routes
- `server/services/projectService.ts` - Project business logic
- Update `server/routes.ts` to include project routes

### 4. **Build Admin Dashboard** (Medium Priority)
Create admin approval and moderation system:

**Endpoints to build:**
- `GET /api/admin/pending` - Get all pending content (profiles, projects, startups)
- `POST /api/admin/approve/:type/:id` - Approve content
- `POST /api/admin/reject/:type/:id` - Reject content with reason
- `GET /api/admin/audit-log` - View admin action history

**Files to create/update:**
- `server/routes/adminRoutes.ts` - New admin routes
- `server/services/adminService.ts` - Admin business logic
- `client/src/pages/Admin.tsx` - Admin dashboard UI

### 5. **Startup Showcase System** (Lower Priority)
Similar to projects, but for startup profiles:
- `POST /api/startups` - Create startup showcase
- `GET /api/startups` - List approved/featured startups
- Featured startups rotation system

## 📋 Recommended Order

1. **Test auth endpoints** (verify backend works)
2. **Update frontend auth** (users can log in)
3. **Project posting** (core feature)
4. **Admin dashboard** (content moderation)
5. **Startup showcase** (additional feature)

## 🚀 Quick Start Commands

```bash
# Start server
npm run dev

# Run migrations (if schema changes)
npm run db:push

# Type check
npm run check
```

## 📝 Notes

- **Email**: If SMTP not configured, verification emails log to console
- **Google OAuth**: Optional, can be added later
- **Port**: Server runs on 5001 (update CLIENT_ORIGIN in .env if needed)
- **Database**: Local PostgreSQL at `postgresql://shivamsharma@localhost:5432/foundrymatch`

## 🆘 Need Help?

- Check server logs for errors
- Test endpoints with curl first
- Verify database connection: `psql -h localhost -d foundrymatch -c "SELECT COUNT(*) FROM users;"`

