import { NextRequest, NextResponse } from "next/server";
import { getNutritionModel, TEXT_PROMPT } from "@/lib/gemini";
import { AiNutritionResponse } from "@/types";

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  try {
    const model = getNutritionModel();
    const result = await model.generateContent(TEXT_PROMPT(query.trim()));
    const text = result.response.text();
    const data: AiNutritionResponse = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gemini request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
