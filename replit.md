# MatchMeUp Foundry

## Overview

MatchMeUp Foundry is a university-based networking platform for the University of Rochester community, connecting students with startup opportunities, project gigs, and team collaboration. It features user authentication, admin approval workflows, and dynamic content discovery. The platform aims to facilitate connections within the university ecosystem, offering students practical experience and startups access to talent.

## User Preferences

- Preferred communication style: Simple, everyday language
- Design choice: Client-side filtering acceptable for MVP at 3k user scale; would need server-side filtering if data grows 10x
- Validation requirement: Profile updates accept empty strings to clear role-specific fields (major/year/availability) when switching roles, but reject whitespace-only values for required fields
- Testing requirement: All interactive elements (links, buttons) must have unique data-testid attributes for E2E testing

## System Architecture

### Frontend Architecture

The frontend uses React with TypeScript, Vite, and Wouter for client-side routing. UI components are built with shadcn/ui on Radix UI primitives, styled with Tailwind CSS and a custom University of Rochester brand theme (Royal Blue and Gold, Inter font). State management relies on TanStack Query for server state and React hooks for local state. The design system emphasizes card-based layouts and responsive design.

### Backend Architecture

The backend is built with Express.js on Node.js, using TypeScript. Authentication is handled via Replit OIDC (OpenID Connect) with Google as the identity provider, using `express-session` and `connect-pg-simple` for session management. Passport.js is used for OAuth strategy. APIs are RESTful JSON endpoints under `/api`, with centralized error handling and middleware for authentication (`isAuthenticated`) and authorization (`isAdmin`).

### Data Architecture

PostgreSQL (Neon serverless) is the primary database, managed with Drizzle ORM for type-safe queries and schema migrations. The schema includes Users (with extended profile fields and indexes for `major`, `year`, `availability`), Sessions, Projects (with `skills` GIN index, `is_approved`, `created_at` indexes), Startups (`is_approved`, `created_at` indexes), and Messages (with `sender_id`, `receiver_id`, `created_at` indexes).

### Key Architectural Decisions

- **Monorepo Structure:** Client, server, and shared code reside in a single repository with path aliases.
- **Authentication Flow:** Centralized OIDC authentication with an upsert pattern for user records and session-based state management. Email conflicts are rejected for MVP simplicity.
- **Admin Approval Workflow:** All user-generated content requires admin approval (`is_approved` flags), managed via an admin interface with role-based access control at the API level (admin middleware, ownership checks, field whitelisting).
- **Authorization Matrix:** Granular permissions for creating, reading (approved vs. all content), updating (owner or admin), deleting (admin only), and approving content (admin only).
- **File Organization:** Component co-location for UI and feature components, page-level components, and a shared directory for types and schemas.

## External Dependencies

- **Database:** Neon PostgreSQL, Drizzle ORM
- **Authentication:** Replit OIDC, Google OAuth, `express-session`, `connect-pg-simple`
- **UI Component Libraries:** Radix UI, shadcn/ui, Lucide React, Tailwind CSS
- **State Management & Data Fetching:** TanStack Query, React Hook Form
- **Development Tools:** Vite, TypeScript, Replit development plugins
- **Utilities:** `date-fns`, `clsx`, `tailwind-merge`, `cmdk`, Wouter
- **Fonts:** Inter, JetBrains Mono (via Google Fonts CDN)
- **Image Assets:** Generated images stored locally, optimized for web.