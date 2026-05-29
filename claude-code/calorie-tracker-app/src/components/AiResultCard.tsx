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
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-800 truncate">{item.name}</div>
        <div className="text-xs text-slate-500 mt-0.5">{item.servingSize}</div>
        <div className="flex gap-3 mt-1 text-xs text-slate-400">
          <span>{Math.round(item.calories)} kcal</span>
          <span>{Math.round(item.protein)}g P</span>
          <span>{Math.round(item.carbs)}g C</span>
          <span>{Math.round(item.fat)}g F</span>
        </div>
      </div>
      <div className="ml-4 shrink-0">
        {added ? (
          <span className="text-green-600 text-sm font-medium">Added ✓</span>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
          >
            Add to Log
          </button>
        )}
      </div>
    </div>
  );
}
