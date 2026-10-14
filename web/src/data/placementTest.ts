import type { PlacementQuestion, UserProgress } from "../types";

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    section: "LISTENING",
    prompt: "Listen and choose the word you hear.",
    audioWord: "CAT",
    options: ["CAT", "CAP", "CAR"],
    correctAnswer: "CAT"
  },
  {
    section: "LISTENING",
    prompt: "Listen and choose the word you hear.",
    audioWord: "JOURNEY",
    options: ["JOURNEY", "JOURNAL", "JOINED"],
    correctAnswer: "JOURNEY"
  },
  {
    section: "VOCAB_MATCH",
    prompt: 'Which word means "a building where people live"?',
    options: ["HOUSE", "MARKET", "MIRROR"],
    correctAnswer: "HOUSE"
  },
  {
    section: "VOCAB_MATCH",
    prompt: 'Which word means "a remarkable fact or occurrence"?',
    options: ["PHENOMENON", "CONSEQUENCE", "PERSPECTIVE"],
    correctAnswer: "PHENOMENON"
  },
  {
    section: "READING",
    prompt:
      '"Maria took a long journey to visit her grandmother in the countryside." Where did Maria go?',
    options: ["To visit her grandmother", "To a market", "To work"],
    correctAnswer: "To visit her grandmother"
  },
  {
    section: "READING",
    prompt:
      '"The significant development in her career came after years of hard work." What caused the development?',
    options: ["Years of hard work", "A short journey", "A garden"],
    correctAnswer: "Years of hard work"
  }
];

export function tierForScore(correct: number, total: number): UserProgress["proficiencyLevel"] {
  const fraction = total === 0 ? 0 : correct / total;
  if (fraction < 0.35) return "A1";
  if (fraction < 0.6) return "A2";
  if (fraction < 0.85) return "B1";
  return "B2";
}

export function startingVocabTier(cefr: UserProgress["proficiencyLevel"]): 1 | 2 | 3 | 4 {
  switch (cefr) {
    case "A1":
      return 1;
    case "A2":
      return 2;
    case "B1":
      return 3;
    default:
      return 4;
  }
}
