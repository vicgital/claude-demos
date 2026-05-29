"use client";

import { LogEntry as LogEntryType } from "@/types";

interface Props {
  entry: LogEntryType;
  onDelete: (id: number) => void;
}

export default function LogEntry({ entry, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-slate-800 truncate">{entry.foodName}</span>
          {entry.servings !== 1 && (
            <span className="text-xs text-slate-500">×{entry.servings}</span>
          )}
        </div>
        <div className="flex gap-3 mt-1 text-xs text-slate-500">
          <span>{Math.round(entry.protein)}g protein</span>
          <span>{Math.round(entry.carbs)}g carbs</span>
          <span>{Math.round(entry.fat)}g fat</span>
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4 shrink-0">
        <span className="font-semibold text-slate-700">{Math.round(entry.calories)} kcal</span>
        <button
          onClick={() => onDelete(entry.id)}
          className="text-slate-400 hover:text-red-500 transition-colors p-1"
          aria-label="Remove entry"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
