"use client";

interface Props {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export default function CalorieSummary({ totalCalories, totalProtein, totalCarbs, totalFat }: Props) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-5">
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-green-700">{Math.round(totalCalories)}</div>
        <div className="text-sm text-green-600 mt-1">calories today</div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <MacroStat label="Protein" value={totalProtein} unit="g" color="blue" />
        <MacroStat label="Carbs" value={totalCarbs} unit="g" color="amber" />
        <MacroStat label="Fat" value={totalFat} unit="g" color="orange" />
      </div>
    </div>
  );
}

function MacroStat({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-700 bg-blue-50 border-blue-200",
    amber: "text-amber-700 bg-amber-50 border-amber-200",
    orange: "text-orange-700 bg-orange-50 border-orange-200",
  };
  return (
    <div className={`rounded-lg border px-3 py-2 text-center ${colorMap[color]}`}>
      <div className="text-lg font-semibold">{Math.round(value)}{unit}</div>
      <div className="text-xs mt-0.5">{label}</div>
    </div>
  );
}
