# NutriTrack — Project Plan

## What We Built

A single-page calorie and macro tracker that runs entirely locally with no accounts or cloud dependency.

**Core capabilities:**
- Log food from a 25-item built-in library (instant, no API) with serving size control
- Describe a meal in plain English → Gemini AI breaks it into individual food items with macros
- Upload a food photo → Gemini identifies what's on the plate and estimates portions
- Persistent SQLite database — data survives page refreshes and server restarts
- Daily calorie and macro totals computed in real time

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · SQLite via `better-sqlite3` · Google Gemini (`gemini-2.5-flash-lite`)

## What We Improved

**Features added:**
- Daily calorie goal (2,000 kcal) with a progress bar that changes color: emerald (under 75%), amber (75–100%), rose (over 100%)
- Macro breakdown tiles (protein / carbs / fat) with visual progress bars and daily goals
- Meal categories — Breakfast, Lunch, Dinner, Snack — with a color-coded pill selector
- Log entries grouped by meal category with per-category calorie subtotals

**Design polish:**
- Renamed to **NutriTrack** with a brand identity (emerald accent bar, icon, Inter font)
- Consistent emerald-600 primary color replacing ad-hoc green-500
- Rounded-2xl card language throughout
- Hero calorie card with gradient background; shifts to rose tint when over goal
- Slide-in animation for new log entries
- Skeleton loading state matching the summary card shape
- "Added ✓" confirmation state on FoodCard after clicking Add
- SVG icon system replacing emoji icons in search
- Thin custom scrollbar for the food list
- Per-category active colors on the meal selector pills

## Future Roadmap

| Priority | Feature | Notes |
|----------|---------|-------|
| High | Deploy to Vercel | Add `GEMINI_API_KEY` as env var in Vercel dashboard; `data/` maps to `/tmp` or switch to Turso/Postgres for persistence |
| High | Food history charts | Weekly calorie trend line; 7-day macro averages; use Recharts or Chart.js |
| Medium | User preferences | Customizable calorie goal (default 2000); per-macro targets; persisted in SQLite or localStorage |
| Medium | Weekly log view | Browse past days' entries; date picker; read-only view for past dates |
| Medium | Barcode scanning | Use `@zxing/browser` to scan nutrition labels; map barcode to USDA FoodData Central API |
| Low | Export to CSV | Download the log for a date range; useful for sharing with nutritionists |
| Low | PWA / offline mode | Service worker + manifest; allows install to home screen with offline quick-add |
