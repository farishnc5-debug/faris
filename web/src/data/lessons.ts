import type { DailyLesson } from "../types";

export const DAILY_LESSONS: DailyLesson[] = [
  {
    day: 1,
    targetWords: ["GO", "IN", "SUN"],
    fillBlankSentence: "The ___ is shining brightly today.",
    fillBlankAnswer: "SUN",
    fillBlankOptions: ["SUN", "CAT", "RUN"],
    sentenceBuildingWords: ["I", "GO", "IN"],
    sentenceBuildingAnswer: "I GO IN"
  },
  {
    day: 2,
    targetWords: ["HAPPY", "SMILE", "WATER"],
    fillBlankSentence: "Drinking ___ keeps you healthy.",
    fillBlankAnswer: "WATER",
    fillBlankOptions: ["WATER", "LIGHT", "BREAD"],
    sentenceBuildingWords: ["SHE", "IS", "HAPPY"],
    sentenceBuildingAnswer: "SHE IS HAPPY"
  },
  {
    day: 3,
    targetWords: ["GARDEN", "JOURNEY", "MARKET"],
    fillBlankSentence: "We took a long ___ across the country.",
    fillBlankAnswer: "JOURNEY",
    fillBlankOptions: ["JOURNEY", "GARDEN", "MIRROR"],
    sentenceBuildingWords: ["THE", "GARDEN", "IS", "GREEN"],
    sentenceBuildingAnswer: "THE GARDEN IS GREEN"
  },
  {
    day: 4,
    targetWords: ["PERSPECTIVE", "SIGNIFICANT", "DEVELOPMENT"],
    fillBlankSentence: "Her new job was a ___ change in perspective.",
    fillBlankAnswer: "SIGNIFICANT",
    fillBlankOptions: ["SIGNIFICANT", "PHENOMENON", "CONSEQUENCE"],
    sentenceBuildingWords: ["THIS", "IS", "A", "SIGNIFICANT", "DEVELOPMENT"],
    sentenceBuildingAnswer: "THIS IS A SIGNIFICANT DEVELOPMENT"
  }
];

export function lessonForDayIndex(index: number): DailyLesson {
  return DAILY_LESSONS[index % DAILY_LESSONS.length];
}

export function todaysLesson(): DailyLesson {
  const epochDay = Math.floor(Date.now() / 86400000);
  return lessonForDayIndex(epochDay);
}
