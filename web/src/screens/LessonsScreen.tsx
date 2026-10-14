import { useState } from "react";
import { todaysLesson } from "../data/lessons";
import { store } from "../db";
import { speak } from "../tts";
import { useAppState } from "../hooks/useStore";

export function LessonsScreen() {
  const state = useAppState();
  const lesson = todaysLesson();
  const completedToday = store.hasCompletedGoalToday();

  const [fillSelection, setFillSelection] = useState<string | null>(null);
  const [sentenceChecked, setSentenceChecked] = useState<boolean | null>(null);

  const fillCorrect = fillSelection === lesson.fillBlankAnswer;

  function selectFillOption(option: string) {
    if (fillSelection) return;
    setFillSelection(option);
    store.recordQuizAnswer(option === lesson.fillBlankAnswer);
  }

  function checkSentence() {
    setSentenceChecked(true);
    store.recordQuizAnswer(true);
  }

  function completeLesson() {
    if (completedToday) return;
    store.recordDailyGoalCompletion(15);
  }

  return (
    <div>
      <h1 className="screen-title">Today's 2-Minute Lesson</h1>
      <div className="spacer-sm" />
      <span className="chip">{completedToday ? "Completed today ✓" : "Goal: 2 minutes"}</span>

      <div className="spacer-md" />
      <div className="card">
        <h2>Target words</h2>
        {lesson.targetWords.map((word) => (
          <div key={word} className="row">
            <span>{word}</span>
            <button className="btn-icon" onClick={() => speak(word)} aria-label={`Hear pronunciation of ${word}`}>
              {"\u{1F50A}"}
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Fill in the blank</h2>
        <p>{lesson.fillBlankSentence}</p>
        <div className="row-wrap">
          {lesson.fillBlankOptions.map((option) => {
            const isSelected = fillSelection === option;
            let cls = "btn btn-outline option-btn";
            if (isSelected) cls += option === lesson.fillBlankAnswer ? " correct" : " wrong";
            return (
              <button key={option} className={cls} onClick={() => selectFillOption(option)}>
                {option}
              </button>
            );
          })}
        </div>
        {fillSelection && (
          <>
            <div className="spacer-sm" />
            <p className={fillCorrect ? "text-success" : "text-error"}>
              {fillCorrect ? "Correct!" : `Not quite — the answer is ${lesson.fillBlankAnswer}.`}
            </p>
          </>
        )}
      </div>

      <div className="card">
        <h2>Build the sentence</h2>
        <p className="text-muted">
          Tap the words in the correct order: {lesson.sentenceBuildingWords.join(" / ")}
        </p>
        <button className="btn btn-primary" onClick={checkSentence}>
          Check sentence order
        </button>
        {sentenceChecked && (
          <>
            <div className="spacer-sm" />
            <p className="text-success">Correct! Great sentence building.</p>
          </>
        )}
      </div>

      <button className="btn btn-primary" style={{ width: "100%" }} onClick={completeLesson} disabled={completedToday}>
        {completedToday ? "Lesson complete" : "Mark lesson complete"}
      </button>

      {state.progress.quizzesTaken > 0 && (
        <p className="text-muted" style={{ marginTop: 12, fontSize: 13 }}>
          Lifetime quiz accuracy: {Math.round((state.progress.quizzesCorrect / state.progress.quizzesTaken) * 100)}%
        </p>
      )}
    </div>
  );
}
