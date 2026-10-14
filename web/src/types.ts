export interface WordMastery {
  id: number;
  word: string;
  phonetic: string;
  definition: string;
  levelTier: 1 | 2 | 3 | 4;
  syllables: number;
  masteryStage: 0 | 1 | 2 | 3;
  lastPracticed: number;
}

export interface UserProgress {
  proficiencyLevel: "A1" | "A2" | "B1" | "B2";
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  reminderHour: number;
  reminderMinute: number;
  notificationsEnabled: boolean;
  placementTestCompleted: boolean;
  quizzesTaken: number;
  quizzesCorrect: number;
}

export interface DailyStreakEntry {
  date: string;
  goalCompleted: boolean;
  xpEarned: number;
}

export interface AppState {
  words: WordMastery[];
  progress: UserProgress;
  streakHistory: DailyStreakEntry[];
}

export interface DailyLesson {
  day: number;
  targetWords: string[];
  fillBlankSentence: string;
  fillBlankAnswer: string;
  fillBlankOptions: string[];
  sentenceBuildingWords: string[];
  sentenceBuildingAnswer: string;
}

export type PlacementSection = "LISTENING" | "VOCAB_MATCH" | "READING";

export interface PlacementQuestion {
  section: PlacementSection;
  prompt: string;
  audioWord?: string;
  options: string[];
  correctAnswer: string;
}
