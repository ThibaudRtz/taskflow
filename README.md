# TaskFlow

TaskFlow is a production-ready foundation for a collaborative Kanban SaaS built with modern Next.js architecture.

## Stack

- Next.js 16 (App Router, Server Components)
- TypeScript
- Tailwind CSS v4
- shadcn/ui foundations
- Prisma ORM
- PostgreSQL
- NextAuth.js (Google OAuth)
- Zod + React Hook Form

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Copy and update `.env.example`:

```bash
cp .env.example .env.local
```

### 3) Generate Prisma client

```bash
npm run db:generate
```

### 4) Start development server

```bash
npm run dev
```

Open http://localhost:3000.

## Environment Variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXTAUTH_SECRET` | NextAuth secret |
| `NEXTAUTH_URL` | Public auth callback URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_APP_URL` | Public app URL |

## Scripts

- `npm run dev` - run local dev server with Turbopack
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint
- `npm run lint:fix` - fix lint issues
- `npm run typecheck` - run TypeScript checks
- `npm run db:generate` - generate Prisma client
- `npm run db:migrate` - run Prisma migrations in development
- `npm run db:push` - push schema to database
- `npm run db:studio` - open Prisma Studio
- `npm run db:format` - format Prisma schema

## Architecture Overview

```txt
src/
  app/
    api/auth/[...nextauth]/route.ts
    dashboard/
    sign-in/
  components/
    ui/
    layout/
    forms/
    providers/
  features/
    auth/
    boards/
    columns/
    tasks/
    workspaces/
  hooks/
  services/
  prisma/
  lib/
  types/
  utils/
```

### Foundation Principles

- Feature-first organization with shared UI and lib layers
- Server Components by default, client components only for interactivity
- Auth-protected dashboard shell with middleware + server guard
- Prisma domain models for users, workspaces, boards, columns, tasks
- Ready for future drag-and-drop, realtime sync, optimistic updates, notifications, and collaboration flows
