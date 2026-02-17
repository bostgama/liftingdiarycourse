# Server Components

## Core Rules

1. **All `page.tsx` files are Server Components by default.** Do NOT add `"use client"` to page files.
2. **All data fetching happens in Server Components.** Call `src/data/` helper functions directly — no `useEffect`, no `fetch()`, no Route Handlers.
3. **Server Components MUST NOT contain interactive logic.** No `useState`, `useEffect`, event handlers, or browser APIs. Delegate interactivity to colocated Client Components.
4. **Pass data as props to Client Components.** Server Components fetch data and pass it down — Client Components receive it and handle UI interactions.

## Page Structure

### Layout

Every page must render a `<main>` element with the standard layout classes:

```tsx
<main className="mx-auto max-w-2xl px-4 py-8">
  {/* page content */}
</main>
```

### Export Convention

Pages must use a default export with an `async` function (when data fetching is needed) or a plain function (when no data fetching is required):

```tsx
// With data fetching
export default async function SomePage() {
  const data = await getData();
  return <main className="mx-auto max-w-2xl px-4 py-8">...</main>;
}

// Without data fetching
export default function SomePage() {
  return <main className="mx-auto max-w-2xl px-4 py-8">...</main>;
}
```

## Dynamic Route Parameters

In Next.js 16, `params` is a `Promise`. Always type it as such and `await` it:

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // ...
}
```

## Search Parameters

`searchParams` is also a `Promise` in Next.js 16. Await it the same way:

```tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  // ...
}
```

## Data Fetching Pattern

Server Components call helper functions from `src/data/` directly. They never import `db` or call the database themselves:

```tsx
import { getWorkoutById } from "@/data/workouts";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const workout = await getWorkoutById(workoutId);
  // ...
}
```

## Handling Missing Data

When fetching a single resource by ID, call `notFound()` from `next/navigation` if the resource is `null`:

```tsx
import { notFound } from "next/navigation";

const workout = await getWorkoutById(workoutId);

if (!workout) {
  notFound();
}
```

## Composing with Client Components

Server Components handle data; Client Components handle interactivity. Colocate Client Components in the same directory as the page that uses them:

```
src/app/dashboard/workout/[workoutId]/
├── page.tsx              ← Server Component (fetches data)
├── edit-workout-form.tsx ← Client Component (handles form)
└── actions.ts            ← Server Actions (handles mutations)
```

Pass fetched data as props:

```tsx
// page.tsx (Server Component)
import { EditWorkoutForm } from "./edit-workout-form";

export default async function EditWorkoutPage({ params }) {
  const { workoutId } = await params;
  const workout = await getWorkoutById(workoutId);

  return <EditWorkoutForm workout={workout} />;
}
```

## What NOT to Do

- **No `"use client"` on page files** — pages must remain Server Components.
- **No `useState`, `useEffect`, or event handlers in pages** — delegate to Client Components.
- **No direct `db` imports in pages** — always go through `src/data/` helpers.
- **No `fetch()` calls in Server Components** — use `src/data/` helpers with Drizzle ORM.
- **No returning Response objects** — Server Components return JSX, not `NextResponse` or `Response`.
- **No forgetting to `await` params/searchParams** — these are Promises in Next.js 16.
