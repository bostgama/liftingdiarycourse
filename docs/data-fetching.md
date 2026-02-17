# Data Fetching

## Core Rules

1. **ALL data fetching MUST happen in Server Components.** No exceptions.
2. **DO NOT** fetch data via Route Handlers, Client Components, `useEffect`, or any other method.
3. **ALL database queries MUST go through helper functions in the `src/data/` directory.**
4. **Use Drizzle ORM exclusively. DO NOT write raw SQL.**
5. **Every query MUST be scoped to the logged-in user's `user_id`.** A user must NEVER be able to access another user's data.

## Data Helper Functions (`src/data/`)

All database access is centralized in `src/data/`. Each helper function must:

- Accept or retrieve the current user's `user_id` (from Clerk via `auth()`)
- Filter every query by `user_id` — no exceptions
- Use Drizzle ORM query builders (no raw SQL, no `sql` template tags for full queries)
- Return plain data (not Response objects)

### Example

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getWorkouts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}
```

### Consuming in a Server Component

```tsx
// src/app/dashboard/page.tsx
import { getWorkouts } from "@/data/workouts";

export default async function DashboardPage() {
  const workouts = await getWorkouts();

  return <WorkoutList workouts={workouts} />;
}
```

## What NOT to Do

- **No Route Handlers for data fetching** — do not create `app/api/*` routes to read data.
- **No client-side fetching** — do not use `fetch()`, `useEffect`, React Query, SWR, or similar in Client Components to load data.
- **No raw SQL** — do not use `sql``SELECT * FROM ...`` or `db.execute()` with raw strings.
- **No unscoped queries** — every query must include a `WHERE user_id = ?` condition via Drizzle's `eq()` or equivalent. Never return data belonging to other users.

## Mutations

Server Actions (form actions / `"use server"` functions) may call the same `src/data/` helpers to perform inserts, updates, and deletes. The same rules apply: use Drizzle ORM, scope to `user_id`, no raw SQL.
