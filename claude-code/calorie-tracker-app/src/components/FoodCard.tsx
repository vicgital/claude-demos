"use client";

import { useState } from "react";
import { FoodItem } from "@/types";

interface Props {
  food: FoodItem;
  onAdd: (foodId: string, servings: number) => void;
}

export default function FoodCard({ food, onAdd }: Props) {
  const [servings, setServings] = useState(1);

  return (
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 hover:border-green-300 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-800 truncate">{food.name}</div>
        <div className="text-xs text-slate-500 mt-0.5">{food.servingSize}</div>
        <div className="flex gap-3 mt-1 text-xs text-slate-400">
          <span>{food.calories} kcal</span>
          <span>{food.protein}g P</span>
          <span>{food.carbs}g C</span>
          <span>{food.fat}g F</span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4 shrink-0">
        <input
          type="number"
          min="0.5"
          max="10"
          step="0.5"
          value={servings}
          onChange={(e) => setServings(Math.max(0.5, Number(e.target.value)))}
          className="w-14 text-center border border-slate-200 rounded px-1 py-1 text-sm focus:outline-none focus:border-green-400"
        />
        <button
          onClick={() => onAdd(food.id, servings)}
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
