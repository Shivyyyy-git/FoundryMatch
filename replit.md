# Foundry StartupMatch

## Overview

Foundry StartupMatch is a university-based networking platform designed for the University of Rochester community. The platform connects students with startup opportunities, project gigs, and team collaboration experiences. It features a modern web interface with user authentication, admin approval workflows, and dynamic content discovery.

The application follows a full-stack architecture with React on the frontend, Express on the backend, and PostgreSQL for data persistence. Authentication is handled through Replit's OIDC integration (supporting Google login and other providers), and the UI is built using shadcn/ui components with a custom University of Rochester brand theme.

## Recent Changes (October 28, 2025)

Added Replit Auth authentication system:
- Implemented OpenID Connect (OIDC) authentication through Replit
- Users can sign in with Google (and other supported providers)
- Session-based authentication with PostgreSQL session storage
- Protected routes that redirect unauthenticated users to login
- User profile management with data from OIDC claims (email, name, profile image)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- React with TypeScript for type safety and component reusability
- Vite as the build tool and development server
- Client-side routing using Wouter (lightweight alternative to React Router)

**UI Component System**
- shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling with custom University of Rochester color scheme (Royal Blue and Gold)
- CSS variables for theme management supporting light and dark modes
- Custom design tokens following the "New York" style variant

**State Management**
- TanStack Query (React Query) for server state management and API caching
- Local component state using React hooks
- Custom hooks for authentication (`useAuth`) and theme management (`useTheme`)

**Design System**
- University of Rochester brand colors (Royal Blue: 220 85% 35%, Gold accent: 40 95% 55%)
- Inter font family for all typography
- Card-based layouts inspired by LinkedIn and ProductHunt
- Responsive design with mobile-first approach

### Backend Architecture

**Server Framework**
- Express.js running on Node.js
- TypeScript for type safety across the full stack
- Session-based authentication using express-session with PostgreSQL storage

**Authentication & Authorization**
- Replit OIDC (OpenID Connect) integration for user authentication
- Google as the identity provider
- Session management with connect-pg-simple for PostgreSQL session storage
- Passport.js for OAuth strategy implementation
- Protected routes using `isAuthenticated` middleware

**API Design**
- RESTful API endpoints under `/api` prefix
- JSON request/response format
- Centralized error handling middleware
- Request logging with timing metrics

**Development Features**
- Vite middleware integration for HMR (Hot Module Replacement)
- Runtime error overlay in development
- Custom logging system with timestamps
- Replit-specific plugins for development tooling

### Data Architecture

**Database System**
- PostgreSQL as the primary database
- Neon serverless PostgreSQL for cloud-hosted deployment
- WebSocket connection support for serverless environments

**ORM & Schema Management**
- Drizzle ORM for type-safe database queries
- Schema-first approach with TypeScript inference
- Migration support through drizzle-kit
- Schema location: `shared/schema.ts` for code sharing between client and server

**Current Data Models**
- Users: Profile information from OIDC (email, name, profile image)
- Sessions: Express session storage for authentication state

**Planned Data Models** (based on requirements)
- Projects: Title, description, skills needed, compensation type, time commitment, approval status
- Teams: Team name, members, active status
- Messages: Sender, receiver, content, timestamp
- Startups: Name, founder, category, description, approval status
- Profiles: Skills, interests, availability

### Key Architectural Decisions

**Monorepo Structure**
- Single repository with client, server, and shared code
- Path aliases for clean imports (`@/` for client, `@shared/` for shared code)
- Shared schema definitions between frontend and backend for type consistency

**Authentication Flow**
- Centralized auth setup through `setupAuth` function
- User data automatically synced to database on login
- Upsert pattern for user records to handle returning users
- Session-based state management with secure cookies

**Admin Approval Workflow**
- All user-generated content (teams, projects, showcases) requires admin approval
- Approval state tracked in database with `is_approved` flags
- Separate admin interface for content moderation

**File Organization**
- Component co-location: UI components in `client/src/components/ui/`
- Feature components: Domain-specific components (StudentCard, ProjectCard, etc.)
- Page-level components: `client/src/pages/` for route handlers
- Shared types and schemas: `shared/` directory accessible to both client and server

**Build & Deployment**
- Separate build outputs: Client assets to `dist/public/`, server bundle to `dist/`
- ESBuild for server bundling with external dependencies
- Production server serves static files from build output
- Environment-based configuration (development vs production)

## External Dependencies

**Database**
- Neon PostgreSQL: Serverless PostgreSQL database with WebSocket support
- Connection pooling through `@neondatabase/serverless`
- Drizzle ORM for query building and schema management

**Authentication**
- Replit OIDC: OpenID Connect provider for user authentication
- Google OAuth as the underlying identity provider
- Express session storage in PostgreSQL

**UI Component Libraries**
- Radix UI: Headless component primitives (dialogs, dropdowns, tooltips, etc.)
- shadcn/ui: Pre-built accessible components built on Radix
- Lucide React: Icon library
- Tailwind CSS: Utility-first CSS framework

**State Management & Data Fetching**
- TanStack Query: Server state management, caching, and synchronization
- React Hook Form: Form state management (via @hookform/resolvers)

**Development Tools**
- Vite: Development server and build tool
- TypeScript: Type checking and inference
- Replit development plugins: Cartographer, dev banner, runtime error overlay

**Utilities**
- date-fns: Date manipulation and formatting
- clsx & tailwind-merge: Utility class management
- cmdk: Command palette component
- Wouter: Lightweight client-side routing

**Fonts**
- Inter: Primary typeface for all UI elements
- JetBrains Mono: Monospace font for code and tags
- Google Fonts CDN for font delivery

**Image Assets**
- Generated images stored in `attached_assets/generated_images/`
- Avatar images, hero backgrounds, and showcase photos
- Optimized for web delivery