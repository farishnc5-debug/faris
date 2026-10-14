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
      <div className="nav-header">
        <h1 className="large-title">Progress</h1>
      </div>

      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard title="Streak" value={`${progress.currentStreak}d`} colorVar="--system-orange" />
        <StatCard title="Mastered" value={`${wordsMastered}`} colorVar="--system-green" />
      </div>
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <StatCard title="Accuracy" value={`${accuracyPercent}%`} colorVar="--system-blue" />
        <StatCard title="Total XP" value={`${progress.totalXp}`} colorVar="--system-blue" />
      </div>

      <span className="chip accent">CEFR level: {progress.proficiencyLevel}</span>

      <div className="group-label">This week</div>
      <div className="card">
        <StreakCalendar history={streakHistory} />
      </div>

      <div className="group-label">Daily reminder</div>
      <div className="inset-group">
        <div className="inset-row">
          <span>Reminders</span>
          <label className="switch">
            <input type="checkbox" checked={progress.notificationsEnabled} onChange={(e) => onToggleReminder(e.target.checked)} />
            <span className="track" />
            <span className="thumb" />
          </label>
        </div>
        <div className="inset-row">
          <span>Time</span>
          <input
            type="time"
            className="time-input"
            value={`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`}
            onChange={(e) => {
              const [h, m] = e.target.value.split(":").map(Number);
              onTimeChange(h, m);
            }}
          />
        </div>
      </div>

      {permissionDenied && (
        <p className="text-error" style={{ fontSize: 13, marginTop: 10 }}>
          Notification permission was denied. Allow notifications for this site in your browser settings to enable
          reminders.
        </p>
      )}
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
