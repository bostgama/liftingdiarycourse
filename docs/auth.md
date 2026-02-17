# Authentication

## Provider

This app uses **Clerk** (`@clerk/nextjs`) for all authentication. Do not introduce any other auth library or custom auth solution.

## Setup

### ClerkProvider

The `<ClerkProvider>` wraps the entire app in `src/app/layout.tsx`. All Clerk components and hooks depend on this provider being present at the root.

### Middleware

Clerk middleware is configured in `src/proxy.ts` via `clerkMiddleware()`. This runs on every request (except static files) and handles session resolution automatically.

## Clerk Components

Use Clerk's pre-built components for all auth UI:

- `<SignInButton mode="modal">` — sign-in trigger (renders as a modal)
- `<SignUpButton mode="modal">` — sign-up trigger (renders as a modal)
- `<SignedIn>` — conditionally renders children when the user is authenticated
- `<SignedOut>` — conditionally renders children when the user is not authenticated
- `<UserButton />` — user avatar with account management dropdown

Do not build custom sign-in/sign-up forms. Always use Clerk's modal mode.

## Server-Side Auth

### Getting the User ID

Use the `auth()` function from `@clerk/nextjs/server` to get the current user's ID on the server:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) throw new Error("Unauthorized");
```

### Rules

- **Every server-side data function must call `auth()` and verify `userId` exists** before querying the database.
- **Always scope queries by `userId`** — a user must never access another user's data.
- **Throw an error if `userId` is null** — do not silently return empty data.
- **Do not pass `userId` as a parameter from components.** Each data helper should call `auth()` itself to ensure the ID comes directly from Clerk's session, not from user-controllable input.

## Environment Variables

Clerk requires the following environment variables (managed in `.env.local`):

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Do not commit these values to version control.
