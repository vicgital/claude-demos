import { NextRequest, NextResponse } from "next/server";
import { getNutritionModel, IMAGE_PROMPT } from "@/lib/gemini";
import { AiNutritionResponse } from "@/types";

const SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB — Gemini inline limit

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const file = formData.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "image field is required" }, { status: 400 });
  }

  if (!SUPPORTED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported image type: ${file.type}. Use JPEG, PNG, WEBP, or GIF.` },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "Image exceeds 20 MB limit" }, { status: 400 });
  }

  try {
    const model = getNutritionModel();
    const result = await model.generateContent([
      IMAGE_PROMPT,
      {
        inlineData: {
          mimeType: file.type,
          data: buffer.toString("base64"),
        },
      },
    ]);
    const text = result.response.text();
    const data: AiNutritionResponse = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gemini request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
