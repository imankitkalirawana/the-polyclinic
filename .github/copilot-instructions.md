# The Polyclinic - AI Coding Instructions

## Project Overview

Healthcare management system built with Next.js 15, NextAuth.js, MongoDB, HeroUI, and Sentry. Core entities: Users, Appointments, Doctors, Services, Drugs with role-based access (admin/staff/user).

## Architecture Patterns

### API Structure

- **REST API**: `/app/api/v1/{entity}/route.ts` with authenticated endpoints using `withAuth()` wrapper
- **Server Actions**: Functions in `/functions/server-actions/` for server-side operations
- **Services Layer**: React Query hooks in `/services/{entity}.ts` for data fetching with optimistic updates

### Data Layer

- **Models**: Mongoose schemas in `/models/` with auto-incrementing UIDs using `mongoose-sequence`
- **Database**: MongoDB connection via `/lib/db.ts` with connection pooling
- **Types**: TypeScript interfaces in `/types/` matching model schemas

### Authentication Flow

- NextAuth.js with MongoDB adapter (`auth.ts`)
- Role-based middleware in API routes: check `request.auth?.user?.role`
- Providers: Google OAuth + credentials (bcrypt for passwords)

## Key Conventions

### Component Architecture

- **HeroUI Components**: Use HeroUI design system, not shadcn/ui
- **Server Components**: Default for pages, use `'use client'` sparingly
- **Global State**: React Query for server state, local storage utilities in `/utils/`

### File Organization

```
app/                    # Next.js App Router
├── api/v1/{entity}/   # API endpoints with auth middleware
├── {feature}/page.tsx # Feature pages with layout.tsx
components/
├── {feature}/         # Feature-specific components
├── ui/               # Reusable UI components
functions/            # Server actions and utilities
services/             # React Query hooks and API calls
```

### Development Patterns

- **Validation**: Yup schemas in `/lib/validation.ts` for form validation
- **Error Handling**: Sentry integration (`Sentry.captureException()` in try/catch blocks)
- **Styling**: Tailwind with HeroUI theme, color patterns in safelist
- **Data Tables**: Custom implementation with pagination, sorting, filtering

## Critical Workflows

### Development Commands

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm lint:fix     # ESLint with auto-fix
pnpm tsc          # TypeScript check
```

### Database Operations

- Always call `await connectDB()` before Mongoose operations
- Use auto-incrementing `uid` fields for user-facing IDs (not MongoDB `_id`)
- Follow existing model patterns for timestamps and user tracking

### API Development

- Wrap routes with `auth()` for authentication
- Return consistent error responses: `NextResponse.json({ message }, { status })`
- Handle role-based permissions in route handlers

## Integration Points

### External Services

- **Email**: Nodemailer with HTML templates in `/templates/email/`
- **File Storage**: AWS S3 integration for uploads
- **Maps**: Google Maps API integration
- **AI**: Google Generative AI for chat features

### Monitoring & Analytics

- Sentry configured for error tracking and performance monitoring
- Use `Sentry.startSpan()` for custom performance tracking
- React Query DevTools enabled in development

## Common Gotchas

- HeroUI uses different prop names than standard React components
- MongoDB connection must be established in each API route/server action
- Role checks required for all protected endpoints
- Use `$FixMe` type sparingly - prefer proper typing
- Server actions require `'use server'` directive

## Type Safety

- Strict TypeScript configuration with Airbnb ESLint rules
- Custom types extend base interfaces (e.g., `Base` interface in `/lib/interface.ts`)
- Form validation schemas should match TypeScript types

Follow existing patterns in similar files when implementing new features. Prioritize consistency with established conventions over generic best practices.
