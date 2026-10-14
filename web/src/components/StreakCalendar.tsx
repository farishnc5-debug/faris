import type { DailyStreakEntry } from "../types";
import { dateKeyOffset } from "../db";

interface Props {
  history: DailyStreakEntry[];
}

export function StreakCalendar({ history }: Props) {
  const completed = new Set(history.filter((e) => e.goalCompleted).map((e) => e.date));

  return (
    <div className="streak-row">
      {Array.from({ length: 7 }, (_, i) => 6 - i).map((offset) => {
        const key = dateKeyOffset(-offset);
        const done = completed.has(key);
        return <div key={key} className={`streak-dot${done ? " done" : ""}`} title={key} />;
      })}
    </div>
  );
}
