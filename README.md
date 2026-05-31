# Stride App

Stride App is a semester planning and progress tracking application built for students to organize academic work, stay on top of semester goals, and monitor progress from a single dashboard.

## Features

- Progress tracking.
- Calendar or planning views.
- Authentication.
- Supabase backend integration.
- Dashboard.
- Onboarding flow.
- GPA or academic performance tracking.

## Tech stack

This project is built with React, TypeScript, Vite, Supabase, Tailwind CSS, React Router, TanStack Query, Zod, Recharts, Lucide React, Vitest, Playwright.

## Project structure

- `src/` contains the application UI, routes, hooks, and feature logic.
- `public/` stores static assets served by the app.
- `supabase/` contains backend-related configuration and database resources.

## Getting started

### Prerequisites

- Node.js 18 or newer.
- npm or Bun.

### Installation

```bash
git clone https://github.com/Anurag1275/stride-app.git
cd stride-app
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Environment variables

The repository includes a `.env` file and a `supabase/` directory, which indicates that local development depends on Supabase-related configuration.
Create your own local environment file and keep secrets out of version control.

Example:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Scripts

- `dev` — `vite`
- `build` — `vite build`
- `build:dev` — `vite build --mode development`
- `lint` — `eslint .`
- `preview` — `vite preview`
- `test` — `vitest run`
- `test:watch` — `vitest`

## Deployment

The repository shows multiple production deployments, which suggests the app is actively deployed and iterated on through GitHub-linked environments.

## Contributing

1. Create a feature branch.
2. Make your changes.
3. Test locally.
4. Open a pull request.
