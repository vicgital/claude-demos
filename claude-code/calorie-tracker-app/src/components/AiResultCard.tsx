"use client";

import { useState } from "react";
import { AiNutritionItem } from "@/types";

interface Props {
  item: AiNutritionItem;
  onAdd: () => void;
}

export default function AiResultCard({ item, onAdd }: Props) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    setAdded(true);
    onAdd();
  }

  return (
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-800 truncate text-sm">{item.name}</div>
        <div className="text-xs text-slate-400 mt-0.5">{item.servingSize}</div>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
          <span className="font-medium text-slate-500">{Math.round(item.calories)} kcal</span>
          <span className="text-slate-200">·</span>
          <span>{Math.round(item.protein)}g P</span>
          <span className="text-slate-200">·</span>
          <span>{Math.round(item.carbs)}g C</span>
          <span className="text-slate-200">·</span>
          <span>{Math.round(item.fat)}g F</span>
        </div>
      </div>
      <div className="ml-4 shrink-0">
        {added ? (
          <span className="text-emerald-600 text-sm font-medium">Added ✓</span>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            Add to Log
          </button>
        )}
      </div>
    </div>
  );
}
