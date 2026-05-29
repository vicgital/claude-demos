"use client";

import { useState } from "react";
import { FOODS } from "@/lib/foods";
import FoodCard from "./FoodCard";

interface Props {
  onAddFood: (foodId: string, servings: number) => void;
}

export default function FoodSearch({ onAddFood }: Props) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? FOODS.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
    : FOODS;

  return (
    <div>
      <div className="relative mb-3">
        <svg
          className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-slate-400 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search foods…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 placeholder:text-slate-400"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-3 my-auto text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
      <div className="space-y-1.5 max-h-80 overflow-y-auto pr-0.5">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <div className="text-2xl mb-2">🔍</div>
            <div className="text-sm">No foods match &ldquo;{query}&rdquo;</div>
          </div>
        ) : (
          filtered.map((food) => (
            <FoodCard key={food.id} food={food} onAdd={onAddFood} />
          ))
        )}
      </div>
    </div>
  );
}
