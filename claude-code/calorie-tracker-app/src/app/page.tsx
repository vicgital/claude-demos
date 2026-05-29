"use client";

import { useEffect, useState, useMemo } from "react";
import { AiNutritionItem, LogEntry } from "@/types";
import CalorieSummary from "@/components/CalorieSummary";
import FoodSearch from "@/components/FoodSearch";
import AiTextSearch from "@/components/AiTextSearch";
import AiImageSearch from "@/components/AiImageSearch";
import DailyLog from "@/components/DailyLog";

type AddMode = "quick" | "text" | "image";

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
          ? "bg-green-500 text-white"
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
      body: JSON.stringify({ foodId, servings }),
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Calorie Tracker</h1>
          <p className="text-sm text-slate-500 mt-1">{today}</p>
        </header>

        <section className="mb-6">
          {loading ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center text-slate-400 text-sm">
              Loading…
            </div>
          ) : (
            <CalorieSummary {...summary} />
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
            Add Food
          </h2>
          <div className="flex gap-1 mb-4 bg-slate-100 rounded-lg p-1">
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
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
            Today&apos;s Log
          </h2>
          <DailyLog entries={entries} onDelete={handleDelete} />
        </section>
      </div>
    </main>
  );
}
