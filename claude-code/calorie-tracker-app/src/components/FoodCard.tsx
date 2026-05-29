"use client";

import { useState } from "react";
import { FoodItem } from "@/types";

interface Props {
  food: FoodItem;
  onAdd: (foodId: string, servings: number) => void;
}

export default function FoodCard({ food, onAdd }: Props) {
  const [servings, setServings] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    onAdd(food.id, servings);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-800 truncate text-sm">{food.name}</div>
        <div className="text-xs text-slate-400 mt-0.5">{food.servingSize}</div>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
          <span className="font-medium text-slate-500">{food.calories} kcal</span>
          <span className="text-slate-200">·</span>
          <span>{food.protein}g P</span>
          <span className="text-slate-200">·</span>
          <span>{food.carbs}g C</span>
          <span className="text-slate-200">·</span>
          <span>{food.fat}g F</span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-3 shrink-0">
        <input
          type="number"
          min="0.5"
          max="10"
          step="0.5"
          value={servings}
          onChange={(e) => setServings(Math.max(0.5, Number(e.target.value)))}
          className="w-14 text-center border border-slate-200 rounded-lg px-1 py-1.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100"
        />
        <button
          onClick={handleAdd}
          className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
            justAdded
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {justAdded ? "✓" : "Add"}
        </button>
      </div>
    </div>
  );
}
