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
    ? FOODS.filter((f) =>
        f.name.toLowerCase().includes(query.toLowerCase())
      )
    : FOODS;

  return (
    <div>
      <div className="relative mb-3">
        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search foods..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-green-400 text-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-sm">No foods match &ldquo;{query}&rdquo;</div>
        ) : (
          filtered.map((food) => (
            <FoodCard key={food.id} food={food} onAdd={onAddFood} />
          ))
        )}
      </div>
    </div>
  );
}
