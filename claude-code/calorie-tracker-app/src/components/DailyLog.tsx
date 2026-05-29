"use client";

import { LogEntry as LogEntryType } from "@/types";
import LogEntry from "./LogEntry";

interface Props {
  entries: LogEntryType[];
  onDelete: (id: number) => void;
}

export default function DailyLog({ entries, onDelete }: Props) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400">
        <div className="text-3xl mb-2">🍽️</div>
        <div className="text-sm">No food logged today. Add something above!</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <LogEntry key={entry.id} entry={entry} onDelete={onDelete} />
      ))}
    </div>
  );
}
