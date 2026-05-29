import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = "gemini-2.5-flash-lite";

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set in environment");
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
}

export function getNutritionModel() {
  return getClient().getGenerativeModel({
    model: MODEL,
    generationConfig: {
      responseMimeType: "application/json",
    },
  });
}

export const NUTRITION_SCHEMA = `{
  "description": "string — brief description of what was analyzed",
  "items": [
    {
      "name": "string",
      "servingSize": "string (e.g. '100g', '1 cup', '1 medium')",
      "calories": "number (kcal)",
      "protein": "number (grams)",
      "carbs": "number (grams)",
      "fat": "number (grams)"
    }
  ],
  "totals": {
    "calories": "number (kcal)",
    "protein": "number (grams)",
    "carbs": "number (grams)",
    "fat": "number (grams)"
  }
}`;

export const TEXT_PROMPT = (query: string) => `
You are a nutritionist analyzing a meal description. Return structured nutrition data.

Rules:
- Use standard serving sizes and realistic estimates
- All macro values in grams, calories in kcal
- If the description is ambiguous (e.g. "rice"), assume a typical restaurant/home portion
- Include every identifiable food component as a separate item
- Compute totals by summing all items

Return ONLY valid JSON matching this schema:
${NUTRITION_SCHEMA}

Meal description: "${query}"
`.trim();

export const IMAGE_PROMPT = `
You are a nutritionist analyzing a photo of food. Identify all visible food items and estimate nutrition.

Rules:
- Estimate portion sizes from visual cues (plate size, utensils, context)
- All macro values in grams, calories in kcal
- Include every identifiable food item as a separate entry
- If an item is unclear, make a reasonable assumption and note it in the name
- Compute totals by summing all items

Return ONLY valid JSON matching this schema:
${NUTRITION_SCHEMA}
`.trim();
