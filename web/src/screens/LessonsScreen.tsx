import { useState } from "react";
import { todaysLesson } from "../data/lessons";
import { store } from "../db";
import { speak } from "../tts";
import { useAppState } from "../hooks/useStore";
import { SpeakerIcon } from "../components/Icons";

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
      <div className="nav-header">
        <h1 className="large-title">Lessons</h1>
        <span className={`chip${completedToday ? " accent" : ""}`}>
          {completedToday ? "Completed today" : "Goal: 2 minutes"}
        </span>
      </div>

      <div className="group-label">Target words</div>
      <div className="inset-group">
        {lesson.targetWords.map((word, i) => (
          <div className="inset-row" key={word} style={{ borderBottom: i === lesson.targetWords.length - 1 ? "none" : undefined }}>
            <span>{word}</span>
            <button className="btn-icon" onClick={() => speak(word)} aria-label={`Hear pronunciation of ${word}`}>
              <SpeakerIcon />
            </button>
          </div>
        ))}
      </div>

      <div className="group-label">Fill in the blank</div>
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ margin: "0 0 14px" }}>{lesson.fillBlankSentence}</p>
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
          <p className={fillCorrect ? "text-success" : "text-error"} style={{ marginTop: 12, marginBottom: 0, fontWeight: 600 }}>
            {fillCorrect ? "Correct!" : `Not quite — the answer is ${lesson.fillBlankAnswer}.`}
          </p>
        )}
      </div>

      <div className="group-label">Build the sentence</div>
      <div className="card" style={{ marginBottom: 24 }}>
        <p className="text-muted" style={{ marginTop: 0 }}>
          Tap the words in the correct order: {lesson.sentenceBuildingWords.join(" / ")}
        </p>
        <button className="btn btn-primary" onClick={checkSentence}>
          Check sentence order
        </button>
        {sentenceChecked && (
          <p className="text-success" style={{ fontWeight: 600, marginBottom: 0 }}>
            Correct! Great sentence building.
          </p>
        )}
      </div>

      <button className="btn btn-primary btn-full" onClick={completeLesson} disabled={completedToday}>
        {completedToday ? "Lesson complete" : "Mark lesson complete"}
      </button>

      {state.progress.quizzesTaken > 0 && (
        <p className="text-muted" style={{ marginTop: 14, fontSize: 13, textAlign: "center" }}>
          Lifetime quiz accuracy: {Math.round((state.progress.quizzesCorrect / state.progress.quizzesTaken) * 100)}%
        </p>
      )}
    </div>
  );
}
