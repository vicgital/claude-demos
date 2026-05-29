# Wire Gemini Frontend — 2026-05-28

## What Was Added

Connected the two Gemini API routes (`/api/ai/text`, `/api/ai/image`) to the frontend. The "Add Food" panel now has three tabs — Quick Add, Describe, and Photo — replacing the previous single food search list.

### New components
- **`AiResultCard.tsx`** — shared card for a single AI-identified food item with per-item "Add to Log" button. Tracks local `added` state so the button turns to "Added ✓" after clicking, preventing accidental double-adds.
- **`AiTextSearch.tsx`** — text input that calls `POST /api/ai/text`, shows a loading spinner while waiting, renders `AiResultCard` for each item returned, and shows a red error banner on failure.
- **`AiImageSearch.tsx`** — file upload drop zone that auto-submits the image to `POST /api/ai/image` on selection, shows an image preview with a spinner overlay during analysis, and renders per-item result cards.

### Modified files
- **`src/app/api/log/route.ts`** — extended `POST` to accept either `{ foodId, servings }` (static food lookup, unchanged) or `{ foodName, calories, protein, carbs, fat }` (AI item with explicit macros). Fully backward-compatible.
- **`src/app/page.tsx`** — added `addMode` tab state, `handleAddAiItem()` callback, and rendered the three-tab panel. `FoodSearch` usage is unchanged on the Quick Add tab.

## Technical Choices

### Per-item Add buttons (not "Add All")
The spec says "show all items so the user can confirm before adding." Per-item buttons let users selectively add only the components they want (e.g., add the chicken but skip the side salad). A single "Add All" button would give less control and is harder to undo. The "Added ✓" state prevents duplicate entries without requiring any global coordination.

### AI items stored with `food_id = "ai-custom"` in the DB
The log table requires a `food_id` column (NOT NULL). Since AI items have no stable ID, a sentinel value `"ai-custom"` is used. All display-relevant data (name, macros) is denormalized into the row, so the `food_id` is never read back for display — only for potential future analytics grouping.

### Auto-submit on image select
The image tab uploads immediately when a file is chosen, with no separate "Analyze" button. This matches the expected UX: you pick a photo, you want to see results right away. The "Choose a different photo" link lets users retry without confusion.

### Error handling kept local to each tab component
Loading and error state live inside `AiTextSearch` and `AiImageSearch`, not in `page.tsx`. This keeps the page component focused on shared log state and avoids prop-drilling error state for two independent AI flows. The parent only needs `onAddEntry` to get the result.

### `POST /api/log` extension, not a new route
Adding a separate `/api/ai/log` route for AI items would have split the log write path into two places. Instead, the existing `POST /api/log` was extended with a second body shape. Any consumer that POSTs with `foodId` continues to work identically.

## Known Limitations

- AI response accuracy depends on description quality and photo clarity; estimated macros may vary from reality by 10–20%.
- No caching — the same description typed twice calls Gemini twice.
- Image drag-and-drop works but there's no visual drop-zone highlight on active drag (minor UX gap).
- Gemini may return `items: []` for abstract descriptions or very dark/blurry photos; the UI shows a "no items identified" message in this case.

## What's Next

- Cache repeated text queries in memory to reduce API cost
- Allow users to edit AI-returned macro values before adding (inline edit in `AiResultCard`)
- Add daily calorie goal with a progress bar in `CalorieSummary`
