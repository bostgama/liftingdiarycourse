# Data Mutations

## Core Rules

1. **ALL mutations MUST go through helper functions in `src/data/`.** Components and server actions never call `db` directly.
2. **ALL mutations MUST use Drizzle ORM.** No raw SQL.
3. **ALL mutations MUST be scoped to the logged-in user's `user_id`** (from Clerk via `auth()`). A user must never modify another user's data.
4. **ALL mutations MUST be triggered via Server Actions.**
5. **Server Actions MUST live in colocated `actions.ts` files** next to the page that uses them.
6. **Server Action parameters MUST be explicitly typed.** Do NOT use the `FormData` type.
7. **ALL Server Actions MUST validate their arguments with Zod** before performing any mutation.
8. **Server Actions MUST NOT call `redirect()`.** Redirects must be handled client-side after the server action call resolves (e.g. using `router.push()` from `next/navigation`).

## Data Helper Functions (`src/data/`)

Mutation helpers follow the same pattern as query helpers. Each function must:

- Call `auth()` and verify `userId` exists — throw if null
- Scope every write operation by `userId`
- Use Drizzle ORM insert/update/delete builders
- Return plain data (not Response objects)

### Example

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function createWorkout(name: string, startedAt: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [workout] = await db
    .insert(workouts)
    .values({ userId, name, startedAt })
    .returning();

  return workout;
}

export async function deleteWorkout(workoutId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

## Server Actions (`actions.ts`)

### File Location

Server Actions must be defined in an `actions.ts` file colocated with the page that uses them:

```
src/app/dashboard/
├── page.tsx
└── actions.ts
```

### Structure

Every `actions.ts` file must:

1. Start with the `"use server"` directive
2. Define a Zod schema for each action's parameters
3. Parse the arguments with the Zod schema before doing anything else
4. Call the appropriate `src/data/` helper to perform the mutation
5. Call `revalidatePath()` when the mutation changes data visible on the current page

### Example

```ts
// src/app/dashboard/actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  startedAt: z.coerce.date(),
});

export async function createWorkoutAction(params: {
  name: string;
  startedAt: Date;
}) {
  const validated = createWorkoutSchema.parse(params);
  await createWorkout(validated.name, validated.startedAt);
  revalidatePath("/dashboard");
}
```

### Calling from a Client Component

```tsx
"use client";

import { createWorkoutAction } from "./actions";

export function CreateWorkoutButton() {
  async function handleClick() {
    await createWorkoutAction({
      name: "Morning Workout",
      startedAt: new Date(),
    });
  }

  return <Button onClick={handleClick}>Create Workout</Button>;
}
```

## What NOT to Do

- **No `FormData` parameters** — do not type server action params as `FormData`. Always use explicit typed objects.
- **No mutations without Zod validation** — never trust client input. Always parse with a Zod schema first.
- **No direct `db` calls in server actions** — always go through `src/data/` helpers.
- **No mutations in Client Components** — do not call `db` or `fetch()` from the client. Use server actions only.
- **No inline `"use server"` in components** — define all server actions in dedicated `actions.ts` files.
- **No Route Handlers for mutations** — do not create `app/api/*` routes for writes. Use server actions.
- **No unscoped mutations** — every write must include a `userId` condition. Never modify data belonging to other users.
- **No `redirect()` in server actions** — never call `redirect()` from a server action. Handle redirects client-side after the action resolves using `router.push()`.

## Dependencies

- **`zod`** — required for server action validation. Must be installed in the project.
