import { VOCABULARY_SEED } from "./data/vocabulary";
import type { AppState, DailyStreakEntry, UserProgress, WordMastery } from "./types";

const STORAGE_KEY = "linguastep.state.v1";

function defaultProgress(): UserProgress {
  return {
    proficiencyLevel: "A1",
    totalXp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: "",
    reminderHour: 19,
    reminderMinute: 0,
    notificationsEnabled: false,
    placementTestCompleted: false,
    quizzesTaken: 0,
    quizzesCorrect: 0
  };
}

function defaultState(): AppState {
  return {
    words: VOCABULARY_SEED.map((w) => ({ ...w })),
    progress: defaultProgress(),
    streakHistory: []
  };
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.words || parsed.words.length === 0) parsed.words = defaultState().words;
    if (!parsed.progress) parsed.progress = defaultProgress();
    if (!parsed.streakHistory) parsed.streakHistory = [];
    return parsed;
  } catch {
    return defaultState();
  }
}

function save(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (private mode, quota) — fail silently, state stays in memory for this session.
  }
}

type Listener = (state: AppState) => void;

class Store {
  private state: AppState = load();
  private listeners = new Set<Listener>();

  getState(): AppState {
    return this.state;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private commit(next: AppState) {
    this.state = next;
    save(this.state);
    this.listeners.forEach((listener) => listener(this.state));
  }

  setWordStage(id: number, stage: 0 | 1 | 2 | 3) {
    const words = this.state.words.map((w) =>
      w.id === id ? { ...w, masteryStage: stage, lastPracticed: Date.now() } : w
    );
    this.commit({ ...this.state, words });
  }

  setProficiency(level: UserProgress["proficiencyLevel"]) {
    this.commit({
      ...this.state,
      progress: { ...this.state.progress, proficiencyLevel: level, placementTestCompleted: true }
    });
  }

  updateReminder(hour: number, minute: number, enabled: boolean) {
    this.commit({
      ...this.state,
      progress: { ...this.state.progress, reminderHour: hour, reminderMinute: minute, notificationsEnabled: enabled }
    });
  }

  recordQuizAnswer(correct: boolean) {
    const p = this.state.progress;
    this.commit({
      ...this.state,
      progress: {
        ...p,
        quizzesTaken: p.quizzesTaken + 1,
        quizzesCorrect: p.quizzesCorrect + (correct ? 1 : 0)
      }
    });
  }

  hasCompletedGoalToday(): boolean {
    const todayKey = todayKeyLocal();
    return this.state.streakHistory.some((e) => e.date === todayKey && e.goalCompleted);
  }

  recordDailyGoalCompletion(xpEarned: number) {
    const todayKey = todayKeyLocal();
    const yesterdayKey = dateKeyOffset(-1);
    const existing = this.state.streakHistory.find((e) => e.date === todayKey);

    let streakHistory: DailyStreakEntry[];
    let progress = this.state.progress;

    if (existing?.goalCompleted) {
      streakHistory = this.state.streakHistory.map((e) =>
        e.date === todayKey ? { ...e, xpEarned: e.xpEarned + xpEarned } : e
      );
      progress = { ...progress, totalXp: progress.totalXp + xpEarned };
    } else {
      streakHistory = [
        ...this.state.streakHistory.filter((e) => e.date !== todayKey),
        { date: todayKey, goalCompleted: true, xpEarned }
      ];
      const newStreak =
        progress.lastActiveDate === yesterdayKey || progress.lastActiveDate === todayKey
          ? progress.currentStreak + 1
          : 1;
      progress = {
        ...progress,
        totalXp: progress.totalXp + xpEarned,
        currentStreak: newStreak,
        longestStreak: Math.max(progress.longestStreak, newStreak),
        lastActiveDate: todayKey
      };
    }

    this.commit({ ...this.state, progress, streakHistory });
  }

  wordsMasteredCount(): number {
    return this.state.words.filter((w) => w.masteryStage === 3).length;
  }

  wordsByTier(tier: 1 | 2 | 3 | 4): WordMastery[] {
    return this.state.words
      .filter((w) => w.levelTier === tier)
      .sort((a, b) => a.syllables - b.syllables || a.word.localeCompare(b.word));
  }
}

function todayKeyLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dateKeyOffset(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const store = new Store();
export { todayKeyLocal, dateKeyOffset };
