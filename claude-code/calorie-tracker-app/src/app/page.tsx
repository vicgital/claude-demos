"use client";

import { useEffect, useState, useMemo } from "react";
import { AiNutritionItem, LogEntry, MealCategory } from "@/types";
import CalorieSummary from "@/components/CalorieSummary";
import FoodSearch from "@/components/FoodSearch";
import AiTextSearch from "@/components/AiTextSearch";
import AiImageSearch from "@/components/AiImageSearch";
import DailyLog from "@/components/DailyLog";

type AddMode = "quick" | "text" | "image";

const MEAL_CATEGORIES: { id: MealCategory; label: string; icon: string; activeClass: string }[] = [
  { id: "breakfast", label: "Breakfast", icon: "🌅", activeClass: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 font-semibold" },
  { id: "lunch", label: "Lunch", icon: "☀️", activeClass: "bg-amber-50 text-amber-700 ring-1 ring-amber-200 font-semibold" },
  { id: "dinner", label: "Dinner", icon: "🌙", activeClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 font-semibold" },
  { id: "snack", label: "Snack", icon: "🍎", activeClass: "bg-orange-50 text-orange-700 ring-1 ring-orange-200 font-semibold" },
];

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? "bg-emerald-600 text-white shadow-sm"
          : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

export default function Home() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [addMode, setAddMode] = useState<AddMode>("quick");
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>("breakfast");

  useEffect(() => {
    fetch("/api/log")
      .then((r) => r.json())
      .then((data) => setEntries(data))
      .finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => {
    return entries.reduce(
      (acc, e) => ({
        totalCalories: acc.totalCalories + e.calories,
        totalProtein: acc.totalProtein + e.protein,
        totalCarbs: acc.totalCarbs + e.carbs,
        totalFat: acc.totalFat + e.fat,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    );
  }, [entries]);

  async function handleAddFood(foodId: string, servings: number) {
    const res = await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foodId, servings, mealCategory: selectedCategory }),
    });
    if (!res.ok) return;
    const newEntry: LogEntry = await res.json();
    setEntries((prev) => [...prev, newEntry]);
  }

  async function handleAddAiItem(item: AiNutritionItem) {
    const res = await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        foodName: item.name,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        mealCategory: selectedCategory,
      }),
    });
    if (!res.ok) return;
    const newEntry: LogEntry = await res.json();
    setEntries((prev) => [...prev, newEntry]);
  }

  async function handleDelete(id: number) {
    const res = await fetch(`/api/log/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="h-1 bg-emerald-500" />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">NutriTrack</h1>
            <p className="text-xs text-slate-400 mt-0.5">{today}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-base">
            🥗
          </div>
        </header>

        <section className="mb-5">
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm animate-pulse">
              <div className="h-10 bg-slate-100 rounded-lg w-48 mb-3" />
              <div className="h-2 bg-slate-100 rounded-full mb-5" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-20 bg-slate-50 rounded-xl" />
                <div className="h-20 bg-slate-50 rounded-xl" />
                <div className="h-20 bg-slate-50 rounded-xl" />
              </div>
            </div>
          ) : (
            <CalorieSummary {...summary} />
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-4 mb-5 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Add Food
          </h2>

          <div className="grid grid-cols-4 gap-1.5 mb-3">
            {MEAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs transition-all ${
                  selectedCategory === cat.id
                    ? cat.activeClass
                    : "text-slate-500 font-medium hover:bg-slate-50"
                }`}
              >
                <span className="text-base mb-0.5">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-1 mb-4 bg-slate-100 rounded-xl p-1">
            <TabButton active={addMode === "quick"} onClick={() => setAddMode("quick")}>
              Quick Add
            </TabButton>
            <TabButton active={addMode === "text"} onClick={() => setAddMode("text")}>
              Describe
            </TabButton>
            <TabButton active={addMode === "image"} onClick={() => setAddMode("image")}>
              Photo
            </TabButton>
          </div>

          {addMode === "quick" && <FoodSearch onAddFood={handleAddFood} />}
          {addMode === "text" && <AiTextSearch onAddEntry={handleAddAiItem} />}
          {addMode === "image" && <AiImageSearch onAddEntry={handleAddAiItem} />}
        </section>

        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Today&apos;s Log
          </h2>
          <DailyLog entries={entries} onDelete={handleDelete} />
        </section>
      </div>
    </main>
  );
}
