import { useState } from "react";
import { PLACEMENT_QUESTIONS, tierForScore } from "../data/placementTest";
import { store } from "../db";
import { speak } from "../tts";
import type { UserProgress } from "../types";

export function TestScreen() {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [resultCefr, setResultCefr] = useState<UserProgress["proficiencyLevel"] | null>(null);

  const question = PLACEMENT_QUESTIONS[index];
  const progressFraction = index / PLACEMENT_QUESTIONS.length;

  function selectOption(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === question.correctAnswer) setCorrectCount((c) => c + 1);
  }

  function nextQuestion() {
    const next = index + 1;
    if (next >= PLACEMENT_QUESTIONS.length) {
      const cefr = tierForScore(correctCount, PLACEMENT_QUESTIONS.length);
      setResultCefr(cefr);
      setFinished(true);
      store.setProficiency(cefr);
    } else {
      setIndex(next);
      setSelected(null);
    }
  }

  function restart() {
    setIndex(0);
    setCorrectCount(0);
    setSelected(null);
    setFinished(false);
    setResultCefr(null);
  }

  if (finished && resultCefr) {
    const description: Record<UserProgress["proficiencyLevel"], string> = {
      A1: "Beginner — we'll start you on short, simple words.",
      A2: "Elementary — you're ready for everyday vocabulary.",
      B1: "Intermediate — time for richer, multi-syllable words.",
      B2: "Upper-Intermediate — let's tackle advanced vocabulary."
    };
    return (
      <div>
        <h1 className="screen-title">Your level: {resultCefr}</h1>
        <p>{description[resultCefr]}</p>
        <button className="btn btn-primary" onClick={restart}>
          Retake test
        </button>
      </div>
    );
  }

  const sectionLabel =
    question.section === "LISTENING" ? "Listening" : question.section === "VOCAB_MATCH" ? "Vocabulary matching" : "Reading comprehension";

  return (
    <div>
      <h1 className="screen-title">Test Your Language</h1>
      <div className="progress-track" style={{ marginBottom: 16 }}>
        <div className="progress-fill" style={{ width: `${progressFraction * 100}%` }} />
      </div>

      <p style={{ fontWeight: 600 }}>{sectionLabel}</p>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <p style={{ flex: 1 }}>{question.prompt}</p>
        {question.audioWord && (
          <button className="btn-icon" onClick={() => speak(question.audioWord!)} aria-label="Play audio">
            {"\u{1F50A}"}
          </button>
        )}
      </div>

      <div className="spacer-sm" />
      {question.options.map((option) => {
        const isSelected = selected === option;
        let cls = "btn btn-outline";
        if (isSelected) cls += option === question.correctAnswer ? " correct" : " wrong";
        return (
          <div key={option} style={{ marginBottom: 8 }}>
            <button className={cls} style={{ width: "100%" }} onClick={() => selectOption(option)}>
              {option}
            </button>
          </div>
        );
      })}

      <div className="spacer-sm" />
      <button className="btn btn-primary" style={{ width: "100%" }} onClick={nextQuestion} disabled={!selected}>
        Next
      </button>
    </div>
  );
}
