# NutriTrack

A polished, single-page calorie and macro tracker. No accounts, no cloud — everything runs locally with a SQLite database that persists across page refreshes. Built with AI-powered food recognition via Google Gemini.

## How to Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Windows note**: `better-sqlite3` requires Python and Visual Studio Build Tools (`node-gyp`). If `npm install` fails, install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) and retry.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Inter (next/font) |
| Database | SQLite via `better-sqlite3` |
| AI | Google Gemini (`gemini-2.5-flash-lite`) |
| State | React `useState` + `useEffect` |

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx          Root layout — loads Inter font
│   ├── globals.css         Tailwind directives + custom scrollbar
│   ├── page.tsx            Main page — state, category selector, API calls
│   └── api/
│       ├── log/route.ts        GET (today's entries) + POST (add entry)
│       ├── log/[id]/route.ts   DELETE (remove entry)
│       ├── ai/text/route.ts    POST — text-based Gemini nutrition lookup
│       └── ai/image/route.ts   POST — image-based Gemini nutrition lookup
├── components/
│   ├── CalorieSummary.tsx  Goal progress bar + macro tiles with % display
│   ├── FoodSearch.tsx      Quick-add: SVG search + static food list
│   ├── FoodCard.tsx        Food result with servings input + ✓ Add state
│   ├── AiTextSearch.tsx    Describe tab: text → Gemini → result cards
│   ├── AiImageSearch.tsx   Photo tab: image upload → Gemini → result cards
│   ├── AiResultCard.tsx    AI food result with "Added ✓" state
│   ├── DailyLog.tsx        Entries grouped by meal category
│   └── LogEntry.tsx        Card with slide-in animation + hover delete
├── lib/
│   ├── db.ts               SQLite singleton + schema init + meal_category migration
│   ├── foods.ts            Static list of 25 common foods
│   └── gemini.ts           Gemini client + shared prompts
└── types/
    └── index.ts            Shared interfaces (LogEntry, MealCategory, etc.)

data/                       Created at runtime, git-ignored
└── calorie-tracker.db      SQLite database
docs/
└── 2026-05-28-design-polish.md  Design review and improvement log
```

## Key Design Decisions

- **Static food list**: 25 foods in `src/lib/foods.ts`. Client-side search — instant, no API call.
- **Denormalized log rows**: Macros stored per entry. Historical data stays accurate if the food list changes.
- **SQLite via API routes**: `better-sqlite3` is server-only. `serverComponentsExternalPackages` prevents browser bundling.
- **Meal category via DB column**: `meal_category` added with safe `ALTER TABLE … ADD COLUMN IF NOT EXISTS`-style try/catch migration.
- **Calorie goal hardcoded at 2000 kcal**: Macro goals default to 150g protein / 225g carbs / 65g fat.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key for AI food recognition |

## API Routes

**`GET /api/log`** — Today's entries ordered by meal category (breakfast→snack), then time.

**`POST /api/log`** — Body: `{ foodId, servings, mealCategory }` (quick add) or `{ foodName, calories, protein, carbs, fat, mealCategory }` (AI item).

**`DELETE /api/log/:id`** — Remove a log entry.

**`POST /api/ai/text`** — Body: `{ query: "grilled chicken with rice" }` → `AiNutritionResponse`.

**`POST /api/ai/image`** — `multipart/form-data` with `image` field (JPEG/PNG/WEBP/GIF, ≤20 MB) → `AiNutritionResponse`.

## Adding Food — Three Ways

Select a **meal category** (Breakfast / Lunch / Dinner / Snack) first, then choose a tab:

| Tab | How it works |
|-----|-------------|
| **Quick Add** | Search 25 built-in foods, set serving size, click Add (shows ✓ for 1.5s) |
| **Describe** | Plain-English meal description → Gemini → individual items with macros |
| **Photo** | Upload or drag a food photo → Gemini identifies foods → confirm per item |

## Next Steps

- **Deploy to Vercel** — add `GEMINI_API_KEY` env var; map `data/` to Turso or Postgres for persistent storage
- **Food history charts** — weekly calorie trend + 7-day macro averages (Recharts or Chart.js)
- **User preferences** — customizable calorie/macro goals persisted in SQLite or localStorage
- **Weekly log view** — browse and review past days with a date picker
- **Barcode scanning** — use `@zxing/browser` + USDA FoodData Central API to scan nutrition labels
