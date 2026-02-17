# Routing

## Route Structure

All application routes live under `/dashboard`. There are no top-level application routes outside of `/dashboard`.

### Current Routes

- `/dashboard` — Main dashboard page (workout list by date)
- `/dashboard/workout/new` — Create a new workout
- `/dashboard/workout/[workoutId]` — View/edit a specific workout

## Protected Routes

All `/dashboard` routes (and any sub-routes) are **protected** and accessible only to logged-in users.

### Route Protection via Middleware

Route protection is handled exclusively through **Next.js middleware** using Clerk's `clerkMiddleware()`. Do not implement route protection at the page or layout level.

- The middleware file is located at `src/proxy.ts`.
- It runs on every request (except static files) and handles session resolution automatically.
- If a user is not authenticated, Clerk middleware redirects them to sign in before they can access any `/dashboard` route.

### Rules

- **Never add unprotected pages under `/dashboard`** — every route nested under `/dashboard` must require authentication.
- **Do not use client-side auth checks for route protection** — rely solely on the middleware.
- **Do not duplicate auth guards in layouts or pages** — the middleware is the single source of truth for route access. Server-side `auth()` calls in data functions are for scoping data by `userId`, not for route protection.

## Adding New Routes

When adding a new route:

1. Place it under `src/app/dashboard/` so it is automatically protected by the middleware.
2. Follow the Next.js App Router file conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, etc.).
3. Use dynamic route segments with brackets (e.g., `[workoutId]`) for resource-specific pages.
