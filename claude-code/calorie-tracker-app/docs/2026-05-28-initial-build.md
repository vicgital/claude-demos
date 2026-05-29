# Initial Build — 2026-05-28

## What Was Built

A single-page calorie tracker web app built from scratch on Next.js 14 with TypeScript, Tailwind CSS, and a local SQLite database.

Features shipped:
- Daily calorie + macro summary (protein, carbs, fat) at the top of the page
- Search bar filtering 25 common foods client-side (instant, no API call)
- Adjustable serving size on each food card before adding
- Daily food log with per-entry macro breakdown and delete button
- Persistence via SQLite — entries survive page refreshes and server restarts
- Database and schema auto-created on first run (no migration step)

## Technical Choices

### Next.js 14 with App Router
Chosen for its file-based routing, built-in TypeScript support, and the clean separation between server-side API routes and client components. The App Router's `"use client"` directive makes the client/server boundary explicit — important when mixing SQLite (server-only) with React state (client-only).

### better-sqlite3 for SQLite
Synchronous API is a natural fit for Next.js API route handlers, which are plain async functions. No ORM or migration layer needed — the schema is simple (one table) and initialized inline on first connection. WAL journal mode is enabled for better concurrent read performance during development.

Rejected alternatives:
- `sql.js` — runs in-memory by default; requires fragile base64 serialization to persist to disk
- `Prisma + SQLite` — adds a full migration workflow that's overkill for two columns

### Static Food List (no food database table)
All 25 foods are defined in `src/lib/foods.ts` as a TypeScript constant. Search filtering runs 100% client-side against this array — instant results, zero latency, no API roundtrip. Macros are denormalized into each `log_entries` row at insert time, so historical log entries remain accurate if the food list is later edited.

### React useState + useEffect (no state library)
The app is a single page with two pieces of state: today's log entries (fetched once on mount, updated optimistically on add/delete) and the derived summary (computed via `useMemo`). Zustand or Redux would add dependency and conceptual overhead with no benefit at this scope.

### Tailwind CSS
Utility-first approach eliminates the need for separate CSS files and makes layout visible directly in JSX. Neutral slate/gray palette with green accent for the calorie totals — readable, no distracting colors.

### No ORM, No Auth, No Accounts
Deliberate simplicity. The app is a local tool. Adding accounts would require a session layer, hashed passwords, and scoped queries — none of which is warranted for a personal tracker running on localhost.

## Known Limitations

- Food list is fixed at 25 items; adding a custom food requires editing `src/lib/foods.ts`
- No daily calorie goal or progress indicator
- No history beyond today (all queries filter to `date('now')`)
- SQLite file is stored in `data/` at the project root — not suitable for deployment to serverless platforms (Vercel, etc.) without switching to a hosted database

## Future Work

See `CLAUDE.md` → "What's Next" section.
