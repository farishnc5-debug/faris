import { useState } from "react";
import { PLACEMENT_QUESTIONS, tierForScore } from "../data/placementTest";
import { store } from "../db";
import { speak } from "../tts";
import type { UserProgress } from "../types";
import { CheckCircleIcon, SpeakerIcon } from "../components/Icons";

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
      <div style={{ textAlign: "center", paddingTop: 40 }}>
        <div style={{ color: "var(--system-green)", display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <div style={{ width: 56, height: 56 }}>
            <CheckCircleIcon />
          </div>
        </div>
        <h1 className="large-title" style={{ textAlign: "center" }}>
          Level: {resultCefr}
        </h1>
        <p className="text-muted">{description[resultCefr]}</p>
        <button className="btn btn-primary" onClick={restart} style={{ marginTop: 8 }}>
          Retake test
        </button>
      </div>
    );
  }

  const sectionLabel =
    question.section === "LISTENING" ? "Listening" : question.section === "VOCAB_MATCH" ? "Vocabulary matching" : "Reading comprehension";

  return (
    <div>
      <div className="nav-header">
        <h1 className="large-title">Placement Test</h1>
        <div className="progress-track" style={{ marginBottom: 12 }}>
          <div className="progress-fill" style={{ width: `${progressFraction * 100}%` }} />
        </div>
      </div>

      <span className="chip accent">{sectionLabel}</span>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <p style={{ flex: 1, margin: 0, fontSize: 17 }}>{question.prompt}</p>
          {question.audioWord && (
            <button className="btn-icon" onClick={() => speak(question.audioWord!)} aria-label="Play audio">
              <SpeakerIcon />
            </button>
          )}
        </div>
      </div>

      {question.options.map((option) => {
        const isSelected = selected === option;
        let cls = "btn btn-outline btn-full";
        if (isSelected) cls += option === question.correctAnswer ? " correct" : " wrong";
        return (
          <div key={option} style={{ marginBottom: 8 }}>
            <button className={cls} onClick={() => selectOption(option)}>
              {option}
            </button>
          </div>
        );
      })}

      <div className="spacer-sm" />
      <button className="btn btn-primary btn-full" onClick={nextQuestion} disabled={!selected}>
        Next
      </button>
    </div>
  );
}
