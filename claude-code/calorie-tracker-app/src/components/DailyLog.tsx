"use client";

import { LogEntry as LogEntryType, MealCategory } from "@/types";
import LogEntry from "./LogEntry";

interface Props {
  entries: LogEntryType[];
  onDelete: (id: number) => void;
}

const CATEGORY_ORDER: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snack'];

const CATEGORY_META: Record<MealCategory, { label: string; icon: string }> = {
  breakfast: { label: 'Breakfast', icon: '🌅' },
  lunch: { label: 'Lunch', icon: '☀️' },
  dinner: { label: 'Dinner', icon: '🌙' },
  snack: { label: 'Snack', icon: '🍎' },
};

export default function DailyLog({ entries, onDelete }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-14 text-slate-400">
        <div className="text-4xl mb-3">🍽️</div>
        <div className="font-medium text-slate-500 text-sm">Nothing logged yet</div>
        <div className="text-xs mt-1 text-slate-400">Add your first meal using the panel above</div>
      </div>
    );
  }

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const catEntries = entries.filter((e) => (e.mealCategory ?? 'snack') === cat);
    if (catEntries.length > 0) acc[cat] = catEntries;
    return acc;
  }, {} as Partial<Record<MealCategory, LogEntryType[]>>);

  return (
    <div className="space-y-5">
      {CATEGORY_ORDER.filter((cat) => grouped[cat]).map((cat) => {
        const catEntries = grouped[cat]!;
        const catCalories = catEntries.reduce((sum, e) => sum + e.calories, 0);
        const { label, icon } = CATEGORY_META[cat];

        return (
          <div key={cat}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{icon}</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
              </div>
              <span className="text-xs text-slate-400 tabular-nums">{Math.round(catCalories)} kcal</span>
            </div>
            <div className="space-y-1.5">
              {catEntries.map((entry) => (
                <LogEntry key={entry.id} entry={entry} onDelete={onDelete} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
