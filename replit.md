# Foundry StartupMatch

## Overview

Foundry StartupMatch is a university-based networking platform designed for the University of Rochester community. The application connects students with startup opportunities, project gigs, and team-building experiences. It features a modern web interface built with React and TypeScript on the frontend, Express.js on the backend, and uses PostgreSQL with Drizzle ORM for data persistence.

The platform enables students to:
- Browse and create team opportunities
- Discover and post project gigs
- Showcase startups and entrepreneurial ventures
- Message other users directly
- Build professional profiles with skills and interests

All user-generated content (teams, projects, startups) requires admin approval before becoming publicly visible, ensuring quality control and community standards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework and Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing (alternative to React Router)
- TanStack Query (React Query) for server state management and caching

**UI Component System**
- shadcn/ui component library (New York style variant)
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for component variant management

**Design System**
- Custom color palette based on University of Rochester branding (Royal Blue primary, Rochester Gold accent)
- Dark mode support via ThemeProvider context
- Inter font family for all typography
- Responsive design with mobile-first approach

**State Management**
- React Query for API data fetching, caching, and synchronization
- React Context for theme management
- React Hook Form with Zod validation for form handling

**Key Routes**
- `/` - Landing page (unauthenticated) or Home dashboard (authenticated)
- `/team-matching` - Browse and filter student profiles
- `/project-gigs` - Browse and create project opportunities
- `/startup-showcase` - Showcase and discover startups
- `/messages` - Real-time messaging interface
- `/admin` - Admin panel for content moderation

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- Session-based authentication using Passport.js with OpenID Connect
- PostgreSQL session store via connect-pg-simple

**API Design**
- RESTful endpoints under `/api` namespace
- JSON request/response format
- Credential-based authentication (cookies)
- Role-based access control for admin routes

**Authentication Strategy**
- Replit Auth integration using OpenID Connect
- Session management with secure HTTP-only cookies
- User data synchronized from OIDC claims to local database
- Admin users identified via environment variable `ADMIN_USER_IDS`

**Data Access Layer**
- Storage abstraction interface (`IStorage`) for database operations
- Separation of concerns between routes, storage, and database layers
- Transaction support through Drizzle ORM

### Database Architecture

**ORM and Migrations**
- Drizzle ORM for type-safe database queries
- Schema-first approach with TypeScript definitions
- Migration system via drizzle-kit
- Neon serverless PostgreSQL driver for connection pooling

**Core Data Models**
1. **Users** - Authentication and basic profile information synced from Replit Auth
2. **Student Profiles** - Extended user data including major, year, skills, interests, portfolio links
3. **Projects** - Project gigs with skills needed, compensation type, time commitment
4. **Startups** - Startup showcases with team size, category, funding stage
5. **Teams** - Team opportunities with member relationships
6. **Messages** - Direct messaging between users with sender/receiver relationships
7. **Project Applications** - Student applications to project opportunities
8. **Sessions** - Secure session storage for authentication

**Content Moderation System**
- `isApproved` boolean flag on Projects, Startups, and Teams
- Default state is `false` (pending approval)
- Only admin users can approve/reject content
- Approved content becomes visible to all users

**Data Relationships**
- Users → Student Profiles (one-to-one, cascade delete)
- Projects → Users (creator relationship)
- Startups → Users (founder relationship)
- Teams → Team Members (one-to-many)
- Messages → Users (sender and receiver foreign keys)

### Security Considerations

**Authentication**
- OpenID Connect integration with Replit
- Session tokens stored securely with HTTP-only cookies
- CSRF protection through same-site cookie policy
- Automatic session refresh for token expiration

**Authorization**
- Route-level middleware for authenticated-only endpoints
- Admin-specific middleware checking user ID against whitelist
- Resource ownership validation for update/delete operations

**Data Validation**
- Zod schemas for input validation on both client and server
- Drizzle-zod integration for database-schema-aligned validation
- Type-safe API contracts using shared schema definitions

## External Dependencies

### Third-Party Services

**Replit Authentication**
- OpenID Connect provider for user authentication
- Configuration via `ISSUER_URL` environment variable
- Provides user claims (email, name, profile image)

**Neon Database**
- Serverless PostgreSQL hosting
- WebSocket-based connection pooling
- Configured via `DATABASE_URL` environment variable

### Key NPM Packages

**Frontend Dependencies**
- `@tanstack/react-query` - Server state management and caching
- `wouter` - Lightweight routing library
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Form validation integration
- `zod` - Schema validation
- `date-fns` - Date manipulation and formatting
- `cmdk` - Command palette component
- `class-variance-authority` - Component variant styling
- `clsx` & `tailwind-merge` - Conditional className utilities

**Backend Dependencies**
- `express` - Web application framework
- `passport` - Authentication middleware
- `openid-client` - OpenID Connect client library
- `drizzle-orm` - TypeScript ORM
- `@neondatabase/serverless` - Neon PostgreSQL driver
- `connect-pg-simple` - PostgreSQL session store
- `ws` - WebSocket library for Neon connections
- `memoizee` - Function memoization for OIDC config caching

**Development Dependencies**
- `vite` - Build tool and dev server
- `@vitejs/plugin-react` - React plugin for Vite
- `typescript` - Type checking
- `tsx` - TypeScript execution for development
- `esbuild` - Production build bundler
- `drizzle-kit` - Database migration toolkit
- `tailwindcss` - CSS framework
- `autoprefixer` & `postcss` - CSS processing

### Environment Variables

Required configuration:
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `SESSION_SECRET` - Secret key for session encryption
- `REPL_ID` - Replit client ID for OIDC
- `ISSUER_URL` - OpenID Connect issuer URL (defaults to replit.com/oidc)
- `ADMIN_USER_IDS` - Comma-separated list of admin user IDs
- `NODE_ENV` - Environment identifier (development/production)

### Asset Management

Static assets stored in `attached_assets/` directory:
- Generated images for hero sections, profiles, and showcases
- Aliased as `@assets` in Vite configuration
- Served during development and bundled for production