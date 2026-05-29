# Calorie Tracker

A single-page web app to track daily calories and macronutrients. No accounts, no cloud — everything runs locally with a SQLite database that persists across page refreshes.

## How to Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Windows note**: `better-sqlite3` requires Python and Visual Studio Build Tools for its native build step (via `node-gyp`). These are typically pre-installed on developer machines. If `npm install` fails on the native build, install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) and retry.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite via `better-sqlite3` |
| State | React `useState` + `useEffect` |

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx          Root layout and metadata
│   ├── globals.css         Tailwind directives
│   ├── page.tsx            Main page — owns state, calls APIs
│   └── api/
│       ├── log/route.ts    GET (today's entries) + POST (add entry)
│       └── log/[id]/route.ts  DELETE (remove entry)
├── components/
│   ├── CalorieSummary.tsx  Daily totals banner
│   ├── FoodSearch.tsx      Search bar + filtered food list
│   ├── FoodCard.tsx        Single food result with Add button
│   ├── DailyLog.tsx        List of today's log entries
│   └── LogEntry.tsx        Single log row with delete button
├── lib/
│   ├── db.ts               Singleton SQLite connection + schema init
│   └── foods.ts            Static list of 25 common foods
└── types/
    └── index.ts            Shared TypeScript interfaces

data/                       Created at runtime, git-ignored
└── calorie-tracker.db      SQLite database file
```

## Key Design Decisions

- **Static food list**: 25 common foods defined in `src/lib/foods.ts`. Search filters client-side — instant, no API call needed.
- **Denormalized log rows**: Macros are stored per log entry, not joined from a food table. Historical entries remain accurate even if the food list changes.
- **SQLite via API routes**: `better-sqlite3` only runs server-side (Next.js API routes). The `serverComponentsExternalPackages` config prevents it from being bundled for the browser.

## What's Next

- **AI food lookup** via Gemini API (key already in `.env`) — if a food isn't in the static list, look it up with AI
- **Daily calorie goal** — set a target and show progress toward it
- **Weekly history** — view logs for past days
- **Macro targets** — set protein/carb/fat goals
- **Export to CSV** — download your log for use in a spreadsheet
