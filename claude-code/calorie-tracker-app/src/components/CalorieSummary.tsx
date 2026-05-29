"use client";

const CALORIE_GOAL = 2000;
const MACRO_GOALS = { protein: 150, carbs: 225, fat: 65 };

interface Props {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export default function CalorieSummary({ totalCalories, totalProtein, totalCarbs, totalFat }: Props) {
  const caloriePercent = Math.min((totalCalories / CALORIE_GOAL) * 100, 100);
  const isOver = totalCalories > CALORIE_GOAL;
  const isWarning = totalCalories >= CALORIE_GOAL * 0.75;

  const progressColor = isOver ? "bg-rose-500" : isWarning ? "bg-amber-400" : "bg-emerald-500";

  const cardClass = isOver
    ? "bg-rose-50 border-rose-200"
    : "bg-gradient-to-b from-emerald-50/60 to-white border-slate-200";

  const remaining = CALORIE_GOAL - totalCalories;

  return (
    <div className={`border rounded-2xl p-5 shadow-sm transition-colors duration-500 ${cardClass}`}>
      <div className="flex items-end justify-between mb-1">
        <div>
          <span className={`text-5xl font-bold tabular-nums tracking-tight ${isOver ? "text-rose-700" : "text-slate-900"}`}>
            {Math.round(totalCalories).toLocaleString()}
          </span>
          <span className="text-slate-400 text-sm ml-2">/ {CALORIE_GOAL.toLocaleString()} kcal</span>
        </div>
        <div className={`text-sm font-semibold tabular-nums pb-1 ${isOver ? "text-rose-600" : "text-slate-400"}`}>
          {isOver
            ? `${Math.round(totalCalories - CALORIE_GOAL)} over`
            : `${Math.round(remaining)} left`}
        </div>
      </div>

      <div className="h-2 bg-black/5 rounded-full overflow-hidden mb-5">
        <div
          className={`h-full rounded-full transition-all duration-700 ${progressColor}`}
          style={{ width: `${caloriePercent}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MacroBar
          label="Protein" value={totalProtein} goal={MACRO_GOALS.protein}
          barColor="bg-blue-500" bgColor="bg-blue-50" textColor="text-blue-700"
        />
        <MacroBar
          label="Carbs" value={totalCarbs} goal={MACRO_GOALS.carbs}
          barColor="bg-amber-400" bgColor="bg-amber-50" textColor="text-amber-700"
        />
        <MacroBar
          label="Fat" value={totalFat} goal={MACRO_GOALS.fat}
          barColor="bg-orange-400" bgColor="bg-orange-50" textColor="text-orange-700"
        />
      </div>
    </div>
  );
}

function MacroBar({
  label, value, goal, barColor, bgColor, textColor,
}: {
  label: string; value: number; goal: number;
  barColor: string; bgColor: string; textColor: string;
}) {
  const percent = Math.min((value / goal) * 100, 100);
  const left = Math.max(goal - value, 0);

  return (
    <div className={`${bgColor} rounded-xl px-3 py-2.5`}>
      <div className={`text-lg font-bold tabular-nums ${textColor}`}>
        {Math.round(value)}<span className="text-xs font-normal ml-0.5">g</span>
      </div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-500">{label}</span>
        <span className={`text-xs font-semibold tabular-nums ${textColor}`}>{Math.round(percent)}%</span>
      </div>
      <div className="h-1.5 bg-white/70 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
      </div>
      <div className="text-xs text-slate-400 mt-1 tabular-nums">{Math.round(left)}g left</div>
    </div>
  );
}
