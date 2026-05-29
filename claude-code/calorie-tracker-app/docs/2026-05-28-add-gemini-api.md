# Add Gemini AI Routes — 2026-05-28

## What Was Added

Two new backend API routes that use the Gemini API (`gemini-2.5-flash-lite`) to estimate nutrition data for arbitrary foods. The frontend was not changed.

### `POST /api/ai/text`
Accepts a free-text meal description (e.g. `"grilled chicken with rice and salad"`) and returns structured nutrition data: a list of identified food items with calories and macros, plus a combined total.

### `POST /api/ai/image`
Accepts a multipart/form-data upload with an `image` field (JPEG, PNG, WEBP, or GIF; ≤20 MB). Gemini analyzes the photo and returns the same structure as the text route.

### New files
- `src/lib/gemini.ts` — Singleton `GoogleGenerativeAI` client; shared prompts and response schema description
- `src/app/api/ai/text/route.ts`
- `src/app/api/ai/image/route.ts`
- `AiNutritionItem` and `AiNutritionResponse` types added to `src/types/index.ts`

## Technical Choices

### Model: `gemini-2.5-flash-lite`
Specified by the project brief. Flash-Lite is fast and cost-efficient for this use case — the prompts are short and the responses are small JSON objects. A heavier model (Gemini Pro) would add latency and cost with no meaningful accuracy gain for common food items.

### `responseMimeType: "application/json"` in generationConfig
Setting this tells the model to return only valid JSON, eliminating the need to strip markdown fences or extract JSON substrings from prose. It's the cleanest way to get structured output from Gemini without defining a full `responseSchema` object.

### Prompt design
Both prompts are defined as constants in `gemini.ts` and include:
- Role context ("you are a nutritionist")
- Explicit rules (portion assumptions, gram units, summed totals)
- Inline JSON schema description
- Instruction to return ONLY JSON (reinforces `responseMimeType`)

This combination makes responses reliable without requiring Gemini's formal schema validation feature.

### Image: inline base64, not File API
Gemini supports both inline base64 data and the File API (for large assets). For meal photos in a calorie tracker, images will almost always be under 20 MB — well within the inline limit. Using the File API would add an extra network round-trip (upload, then reference). Inline is simpler and faster.

### Singleton Gemini client
`getClient()` in `gemini.ts` initializes `GoogleGenerativeAI` once and reuses it across requests, avoiding repeated constructor calls per request.

### Validation and error handling
- Empty/missing `query` → 400 before calling Gemini
- Unsupported MIME type → 400 before calling Gemini
- Image > 20 MB → 400 before calling Gemini
- JSON parse failure or Gemini error → 500 with the error message

## Known Limitations

- Accuracy depends on the quality of the meal description or photo. Gemini estimates are reasonable but not clinically precise.
- The text route assumes a single combined meal. Querying individual ingredients (e.g. "100g chicken") works but the model may add reasonable default serving sizes.
- No caching — the same description will call Gemini on every request.
- `responseMimeType: "application/json"` is supported by Gemini 1.5+ models. If the model ever changes to one that doesn't support it, `JSON.parse` will fail and the 500 handler will surface the error.

## What's Next

- Wire both routes to the frontend — add an AI lookup panel with a text input and image upload button
- Cache repeated text queries (e.g. in-memory LRU) to reduce API calls
- Let users confirm or edit AI-returned values before adding to the log
