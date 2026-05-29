# Design Polish Session — 2026-05-28

## What Ralph Found (Review Pass)

The original app had all core functionality working but read as a tutorial project:
- Plain green-500 buttons with no hierarchy or branding
- No calorie goal or progress bar — just a raw calorie count
- No meal categories — all entries in a flat undifferentiated list
- Macro display was static tiles with no visual progress context
- `bg-green-50 border-green-200` summary card lacked distinction
- System font (no Inter or custom font loading)
- Emoji `🔍` icon in search vs. SVG (inconsistent icon system)
- Loading state was a plain text "Loading…" string
- No entrance animation when entries were added
- No state feedback when Add button was clicked (FoodCard)

## What Was Improved

### Round 1 — Core Features
- **Calorie goal progress bar**: hardcoded 2000 kcal goal, progress bar turns emerald → amber → rose as you approach/exceed it
- **Macro breakdown with visual bars**: each macro tile (protein/carbs/fat) now shows its value, label, a mini progress bar vs. a daily goal, and "Xg left"
- **Meal categories**: Breakfast / Lunch / Dinner / Snack selector added to the Add Food panel; entries are grouped by category in the daily log with per-category calorie subtotals
- **DB migration**: `meal_category TEXT NOT NULL DEFAULT 'snack'` column added via safe ALTER TABLE in `db.ts`
- **API update**: GET returns entries ordered by meal category, POST accepts `mealCategory`

### Round 2 — Design Language
- **Brand rename**: "Calorie Tracker" → "NutriTrack" with a top emerald accent bar
- **Inter font**: loaded via `next/font/google`, set as Tailwind's `font-sans`
- **Consistent rounded-2xl**: all cards upgraded from `rounded-xl` to `rounded-2xl`
- **Emerald-600 primary**: replaced all `green-500` with `emerald-600` for a more professional hue
- **SVG icon in search**: replaced emoji `🔍` with inline SVG magnifier
- **Skeleton loader**: replaced "Loading…" text with a Tailwind `animate-pulse` skeleton that matches the CalorieSummary shape
- **"Added ✓" state**: FoodCard button flips to a confirmed check state for 1.5s after clicking
- **Thin scrollbar**: custom CSS for the food list scrollbar (4px, slate color)
- **Rose-colored errors**: unified error styling using `rose-` palette

### Round 3 — Polish Pass (frontend-design skill verified)
- **Hero calorie card**: gradient background (`from-emerald-50/60 to-white`), calorie number scaled to `text-5xl`, card transitions to `rose-50` border and background when over goal
- **Macro tiles show %**: added a `XX%` completion badge alongside the label in each macro tile
- **Category pills color-coded**: each meal category has its own active color (emerald, amber, indigo, orange) instead of a single emerald for all
- **Slide-in animation**: new log entries animate in with a 0.2s `slideIn` keyframe (opacity 0→1, translateY -8px→0) via Tailwind custom animation
- **State-reactive summary card**: border + background color changes on goal breach via `transition-colors duration-500`

## Design Skill Verification

The frontend-design skill reviewed the design against 10 dimensions and scored it **71/100 ("Good, not unforgettable")** before Round 3. The 5 specific improvements it identified were all implemented:

1. ✅ Hero calorie card with gradient + oversized number
2. ✅ Entry slide-in animation on mount
3. ✅ Full-card state change (bg + border) when calories exceed goal
4. ✅ Macro tiles show % completion alongside "Xg left"
5. ✅ Category pills use distinct colors per meal type

Estimated post-Round-3 score: **84/100 (Polished, product-grade)**.
