import { useState } from "react";
import { StreakCalendar } from "../components/StreakCalendar";
import { store } from "../db";
import { cancelDailyReminder, requestNotificationPermission, scheduleDailyReminder } from "../reminders";
import { useAppState } from "../hooks/useStore";

export function DashboardScreen() {
  const state = useAppState();
  const { progress, streakHistory } = state;
  const wordsMastered = store.wordsMasteredCount();
  const accuracyPercent =
    progress.quizzesTaken === 0 ? 0 : Math.round((progress.quizzesCorrect / progress.quizzesTaken) * 100);

  const [hour, setHour] = useState(progress.reminderHour);
  const [minute, setMinute] = useState(progress.reminderMinute);
  const [permissionDenied, setPermissionDenied] = useState(false);

  async function onToggleReminder(checked: boolean) {
    if (!checked) {
      store.updateReminder(hour, minute, false);
      cancelDailyReminder();
      return;
    }
    const granted = await requestNotificationPermission();
    if (granted) {
      store.updateReminder(hour, minute, true);
      scheduleDailyReminder(hour, minute);
      setPermissionDenied(false);
    } else {
      setPermissionDenied(true);
    }
  }

  function onTimeChange(newHour: number, newMinute: number) {
    setHour(newHour);
    setMinute(newMinute);
    store.updateReminder(newHour, newMinute, progress.notificationsEnabled);
    if (progress.notificationsEnabled) scheduleDailyReminder(newHour, newMinute);
  }

  return (
    <div>
      <h1 className="screen-title">Progress Dashboard</h1>

      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard title="Streak" value={`${progress.currentStreak}d`} colorVar="--amber" />
        <StatCard title="Mastered" value={`${wordsMastered}`} colorVar="--emerald" />
      </div>
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <StatCard title="Accuracy" value={`${accuracyPercent}%`} colorVar="--teal-dark" />
        <StatCard title="Total XP" value={`${progress.totalXp}`} colorVar="--teal-dark" />
      </div>

      <span className="chip">CEFR level: {progress.proficiencyLevel}</span>

      <div className="spacer-md" />
      <p style={{ fontWeight: 600 }}>This week</p>
      <div className="spacer-sm" />
      <StreakCalendar history={streakHistory} />

      <div className="spacer-md" />
      <div className="card">
        <h2>Daily reminder</h2>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span>
            {String(hour).padStart(2, "0")}:{String(minute).padStart(2, "0")}
          </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={progress.notificationsEnabled}
              onChange={(e) => onToggleReminder(e.target.checked)}
            />
          </label>
        </div>

        <div className="spacer-sm" />
        <input
          type="time"
          value={`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`}
          onChange={(e) => {
            const [h, m] = e.target.value.split(":").map(Number);
            onTimeChange(h, m);
          }}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "8px 10px",
            background: "var(--surface)",
            color: "var(--text)"
          }}
        />

        {permissionDenied && (
          <>
            <div className="spacer-sm" />
            <p className="text-error" style={{ fontSize: 13 }}>
              Notification permission was denied. Allow notifications for this site in your browser settings to
              enable reminders.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, colorVar }: { title: string; value: string; colorVar: string }) {
  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <p className="text-muted" style={{ margin: 0, fontSize: 13 }}>
        {title}
      </p>
      <p className="stat-value" style={{ color: `var(${colorVar})`, margin: "4px 0 0" }}>
        {value}
      </p>
    </div>
  );
}
