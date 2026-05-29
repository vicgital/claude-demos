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
| AI | Google Gemini (`gemini-2.5-flash-lite`) via `@google/generative-ai` |
| State | React `useState` + `useEffect` |

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx          Root layout and metadata
│   ├── globals.css         Tailwind directives
│   ├── page.tsx            Main page — owns state, calls APIs
│   └── api/
│       ├── log/route.ts        GET (today's entries) + POST (add entry)
│       ├── log/[id]/route.ts   DELETE (remove entry)
│       ├── ai/text/route.ts    POST — text-based AI nutrition lookup
│       └── ai/image/route.ts   POST — image-based AI nutrition lookup
├── components/
│   ├── CalorieSummary.tsx  Daily totals banner
│   ├── FoodSearch.tsx      Search bar + filtered food list
│   ├── FoodCard.tsx        Single food result with Add button
│   ├── DailyLog.tsx        List of today's log entries
│   └── LogEntry.tsx        Single log row with delete button
├── lib/
│   ├── db.ts               Singleton SQLite connection + schema init
│   ├── foods.ts            Static list of 25 common foods
│   └── gemini.ts           Gemini client + shared prompts
└── types/
    └── index.ts            Shared TypeScript interfaces

data/                       Created at runtime, git-ignored
└── calorie-tracker.db      SQLite database file
```

## Key Design Decisions

- **Static food list**: 25 common foods defined in `src/lib/foods.ts`. Search filters client-side — instant, no API call needed.
- **Denormalized log rows**: Macros are stored per log entry, not joined from a food table. Historical entries remain accurate even if the food list changes.
- **SQLite via API routes**: `better-sqlite3` only runs server-side (Next.js API routes). The `serverComponentsExternalPackages` config prevents it from being bundled for the browser.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key for AI nutrition lookup |

## AI API Routes

Both routes return the same `AiNutritionResponse` shape:
```json
{
  "description": "What was analyzed",
  "items": [{ "name": "...", "servingSize": "...", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 }],
  "totals": { "calories": 0, "protein": 0, "carbs": 0, "fat": 0 }
}
```

**`POST /api/ai/text`** — Body: `{ "query": "grilled chicken and rice" }`

**`POST /api/ai/image`** — Body: `multipart/form-data` with `image` field (JPEG/PNG/WEBP/GIF, ≤20 MB)

## What's Next

- **Wire AI routes to the frontend** — add a text input and camera/file upload in the Add Food panel
- **Daily calorie goal** — set a target and show progress toward it
- **Weekly history** — view logs for past days
- **Macro targets** — set protein/carb/fat goals
- **Export to CSV** — download your log for use in a spreadsheet
