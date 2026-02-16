# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Documentation-First Rule

Before generating any code, Claude Code **MUST** first read and refer to the relevant documentation file(s) within the `/docs` directory. These docs contain project-specific conventions, patterns, and requirements that all generated code must follow. Always check `/docs` for guidance applicable to the task at hand before writing or modifying code.

- /docs/ui.md
- /docs/data-fetching.md
- /docs/auth.md
- /docs/data-mutations.md

## Commands

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (flat config, ESLint v9)

## Architecture

Next.js 16 app with React 19, TypeScript 5, and Tailwind CSS v4. Uses the App Router (`src/app/`).

- **Path alias**: `@/*` maps to `./src/*`
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`; global styles and CSS variables in `src/app/globals.css`
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google` in root layout
- **UI Components**: shadcn/ui (new-york style, RSC-enabled) with Lucide icons; components in `src/components/ui/`
- **Auth**: Clerk (`@clerk/nextjs`)
- **Database**: Neon PostgreSQL via `drizzle-orm/neon-http`; schema in `src/db/schema.ts`, client in `src/db/index.ts`
- **ORM**: Drizzle ORM with `drizzle-kit` for migrations; config in `drizzle.config.ts`, output in `./drizzle/`

## Database Schema

Four tables: `workouts`, `exercises`, `workout_exercises` (junction), and `sets`. All use UUID primary keys. Workouts are scoped by `user_id` (from Clerk). Cascading deletes on workout → workout_exercises → sets.

## Environment Variables

- `DATABASE_URL` - Neon PostgreSQL connection string (required)
- Clerk env vars for authentication
