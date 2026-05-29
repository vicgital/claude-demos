"use client";

import { LogEntry as LogEntryType } from "@/types";

interface Props {
  entry: LogEntryType;
  onDelete: (id: number) => void;
}

export default function LogEntry({ entry, onDelete }: Props) {
  return (
    <div className="animate-slideIn group flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-slate-800 truncate text-sm">{entry.foodName}</span>
          {entry.servings !== 1 && (
            <span className="text-xs text-slate-400 shrink-0">×{entry.servings}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
          <span>{Math.round(entry.protein)}g P</span>
          <span className="text-slate-200">·</span>
          <span>{Math.round(entry.carbs)}g C</span>
          <span className="text-slate-200">·</span>
          <span>{Math.round(entry.fat)}g F</span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4 shrink-0">
        <span className="font-semibold text-slate-700 tabular-nums text-sm">{Math.round(entry.calories)} kcal</span>
        <button
          onClick={() => onDelete(entry.id)}
          className="text-slate-300 hover:text-rose-500 transition-colors p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Remove entry"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
