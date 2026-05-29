"use client";

import { useState } from "react";
import { AiNutritionItem, AiNutritionResponse } from "@/types";
import AiResultCard from "./AiResultCard";

interface Props {
  onAddEntry: (item: AiNutritionItem) => void;
}

export default function AiTextSearch({ onAddEntry }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AiNutritionResponse | null>(null);

  async function handleAnalyze() {
    const trimmed = query.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/ai/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. grilled chicken with rice and salad"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          disabled={loading}
          className="flex-1 px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-green-400 disabled:opacity-50"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !query.trim()}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 shrink-0"
        >
          {loading ? <Spinner /> : "Analyze"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      {results && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 italic">{results.description}</p>
          {results.items.map((item, i) => (
            <AiResultCard key={i} item={item} onAdd={() => onAddEntry(item)} />
          ))}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
