"use client";

import { useRef, useState } from "react";
import { AiNutritionItem, AiNutritionResponse } from "@/types";
import AiResultCard from "./AiResultCard";

interface Props {
  onAddEntry: (item: AiNutritionItem) => void;
}

export default function AiImageSearch({ onAddEntry }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AiNutritionResponse | null>(null);

  async function handleFile(file: File) {
    setPreview(URL.createObjectURL(file));
    setError(null);
    setResults(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/ai/image", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Image analysis failed");
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function reset() {
    setPreview(null);
    setResults(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
      />

      {!preview ? (
        <button
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full border-2 border-dashed border-slate-200 rounded-xl py-10 text-center text-slate-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors cursor-pointer"
        >
          <div className="text-3xl mb-2">📷</div>
          <div className="text-sm font-medium">Click to upload or drag a photo</div>
          <div className="text-xs mt-1 text-slate-400">JPEG, PNG, WEBP, GIF — up to 20 MB</div>
        </button>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-slate-200">
          <img
            src={preview}
            alt="Meal preview"
            className="w-full max-h-48 object-cover"
          />
          {loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-slate-700 shadow-lg">
                <SpinnerDark />
                Analyzing with Gemini AI…
              </div>
            </div>
          )}
        </div>
      )}

      {preview && !loading && (
        <button
          onClick={reset}
          className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2"
        >
          Choose a different photo
        </button>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-2.5">
          {error}
        </div>
      )}

      {results && (
        <div className="space-y-2">
          <p className="text-xs text-slate-400 italic px-1">{results.description}</p>
          {results.items.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-sm">No food items identified. Try a clearer photo.</div>
            </div>
          ) : (
            results.items.map((item, i) => (
              <AiResultCard key={i} item={item} onAdd={() => onAddEntry(item)} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function SpinnerDark() {
  return (
    <svg className="animate-spin h-4 w-4 text-slate-600" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
