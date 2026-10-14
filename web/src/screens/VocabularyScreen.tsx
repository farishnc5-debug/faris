import { useMemo, useState } from "react";
import { store } from "../db";
import { speak } from "../tts";
import { useAppState } from "../hooks/useStore";
import type { WordMastery } from "../types";
import { LetterBlock, type SlotState } from "../components/LetterBlock";

const TIER_LABELS: Record<number, string> = {
  1: "Tier 1 · 2-3 letters",
  2: "Tier 2 · 4-5 letters",
  3: "Tier 3 · 6-7 letters",
  4: "Tier 4 · 8+ letters"
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface LetterSlot {
  target: string;
  candidates: string[];
  filled: string | null;
  state: SlotState;
}

function shuffled<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildSlots(word: string, stage: number): LetterSlot[] {
  return word.split("").map((target, index) => {
    if (stage === 3) {
      return { target, candidates: [], filled: null, state: "default" as SlotState };
    }
    const distractorPool = ALPHABET.filter((l) => l !== target);
    const distractors = shuffled(distractorPool, target.charCodeAt(0) + stage + index);
    const candidateCount = stage === 1 ? 2 : 3;
    const candidates = shuffled([target, ...distractors.slice(0, candidateCount - 1)], index + stage);
    return { target, candidates, filled: null, state: "default" as SlotState };
  });
}

function nextStageFor(word: WordMastery): number {
  switch (word.masteryStage) {
    case 0:
      return 1;
    case 1:
      return 2;
    case 2:
      return 3;
    default:
      return 1;
  }
}

export function VocabularyScreen() {
  const state = useAppState();
  const [tier, setTier] = useState<1 | 2 | 3 | 4>(1);
  const [activeWord, setActiveWord] = useState<WordMastery | null>(null);
  const [stage, setStage] = useState(1);
  const [slots, setSlots] = useState<LetterSlot[]>([]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [complete, setComplete] = useState(false);
  const [mastered, setMastered] = useState(false);
  const [stage3Error, setStage3Error] = useState(false);

  const words = useMemo(() => store.wordsByTier(tier), [tier, state]);

  function startPractice(word: WordMastery) {
    const startStage = nextStageFor(word);
    setActiveWord(word);
    setStage(startStage);
    setSlots(buildSlots(word.word, startStage));
    setActiveSlot(0);
    setComplete(false);
    setMastered(false);
    setStage3Error(false);
    speak(word.word);
  }

  function exitPractice() {
    setActiveWord(null);
  }

  function advanceAfterCorrect(filledIndex: number, updatedSlots: LetterSlot[]) {
    const next = filledIndex + 1;
    if (next < updatedSlots.length) {
      setActiveSlot(next);
    } else {
      onWordSolved();
    }
  }

  function onWordSolved() {
    if (!activeWord) return;
    setComplete(true);
    if (stage === 3) {
      store.setWordStage(activeWord.id, 3);
      store.recordDailyGoalCompletion(10);
      setMastered(true);
    } else {
      store.setWordStage(activeWord.id, stage as 1 | 2);
    }
  }

  function selectCandidate(index: number, letter: string) {
    if (complete || index !== activeSlot) return;
    const slot = slots[index];
    const isCorrect = letter === slot.target;
    const updated = slots.map((s, i) =>
      i === index ? { ...s, filled: letter, state: (isCorrect ? "correct" : "wrong") as SlotState } : s
    );
    setSlots(updated);
    if (isCorrect) advanceAfterCorrect(index, updated);
  }

  function submitRecallLetter(letter: string) {
    if (complete) return;
    const index = activeSlot;
    const slot = slots[index];
    const isCorrect = letter === slot.target;
    if (isCorrect) {
      const updated = slots.map((s, i) => (i === index ? { ...s, filled: letter, state: "correct" as SlotState } : s));
      setSlots(updated);
      setStage3Error(false);
      advanceAfterCorrect(index, updated);
    } else {
      setStage3Error(true);
    }
  }

  function rewindToGuided() {
    if (!activeWord) return;
    setStage(1);
    setSlots(buildSlots(activeWord.word, 1));
    setActiveSlot(0);
    setComplete(false);
    setStage3Error(false);
    speak(activeWord.word);
  }

  function advanceToNextStage() {
    if (!activeWord) return;
    const next = Math.min(stage + 1, 3);
    setStage(next);
    setSlots(buildSlots(activeWord.word, next));
    setActiveSlot(0);
    setComplete(false);
    setMastered(false);
    speak(activeWord.word);
  }

  if (!activeWord) {
    return (
      <div>
        <h1 className="screen-title">Improve Your Vocabulary</h1>
        <div className="row-wrap" style={{ marginBottom: 16 }}>
          {([1, 2, 3, 4] as const).map((t) => (
            <button
              key={t}
              className="chip"
              style={{
                border: "none",
                cursor: "pointer",
                background: tier === t ? "var(--teal)" : "var(--border)",
                color: tier === t ? "white" : "var(--text)"
              }}
              onClick={() => setTier(t)}
            >
              {TIER_LABELS[t]}
            </button>
          ))}
        </div>

        {words.map((word) => {
          const label =
            word.masteryStage === 0
              ? "Not started"
              : word.masteryStage === 1
                ? "Stage 1 passed"
                : word.masteryStage === 2
                  ? "Stage 2 passed"
                  : "Mastered!";
          return (
            <div key={word.id} className="card" style={{ cursor: "pointer" }} onClick={() => startPractice(word)}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>{word.word}</strong>
                <span className="text-muted" style={{ fontSize: 13 }}>
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const stageLabel =
    stage === 1 ? "Stage 1: Guided letter blocks" : stage === 2 ? "Stage 2: Reinforcement drill" : "Stage 3: Unassisted recall";

  return (
    <div>
      <div className="row">
        <button className="btn-icon" onClick={exitPractice} aria-label="Back to vocabulary list">
          {"←"}
        </button>
        <h1 className="screen-title" style={{ margin: 0 }}>
          {activeWord.word}
        </h1>
        <button className="btn-icon" onClick={() => speak(activeWord.word)} aria-label={`Hear pronunciation of ${activeWord.word}`}>
          {"\u{1F50A}"}
        </button>
      </div>

      <p style={{ fontWeight: 600 }}>{stageLabel}</p>
      <p className="text-muted">{activeWord.definition}</p>

      <div className="spacer-md" />
      <div className="row-wrap">
        {slots.map((slot, i) => (
          <LetterBlock key={i} letter={slot.filled} state={slot.state} />
        ))}
      </div>

      <div className="spacer-md" />

      {stage === 3 ? (
        <>
          <Stage3Keyboard onLetterTap={submitRecallLetter} />
          {stage3Error && (
            <>
              <div className="spacer-sm" />
              <p className="text-error" style={{ fontWeight: 700 }}>
                {"✗"} Try again
              </p>
              <button className="btn btn-outline" onClick={rewindToGuided}>
                Step back to guided mode
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <p>Choose the correct letter:</p>
          <div className="row-wrap">
            {slots[activeSlot]?.candidates.map((candidate) => {
              const slot = slots[activeSlot];
              const showAsCorrectHint = slot.state === "wrong" && candidate === slot.target;
              return (
                <LetterBlock
                  key={candidate}
                  letter={candidate}
                  state={showAsCorrectHint ? "correct" : "default"}
                  onClick={() => selectCandidate(activeSlot, candidate)}
                />
              );
            })}
          </div>
        </>
      )}

      <div className="spacer-md" />

      {complete && (
        mastered ? (
          <div className="card" style={{ textAlign: "center" }}>
            <p className="text-success" style={{ fontSize: 20, fontWeight: 700 }}>
              {"\u{1F389}"} {activeWord.word} Mastered!
            </p>
          </div>
        ) : (
          <div>
            <p className="text-success" style={{ fontWeight: 700 }}>
              Nice work! Ready for the next stage.
            </p>
            <button className="btn btn-primary" onClick={advanceToNextStage}>
              Continue to Stage {stage + 1}
            </button>
          </div>
        )
      )}
    </div>
  );
}

function Stage3Keyboard({ onLetterTap }: { onLetterTap: (letter: string) => void }) {
  const rows: string[][] = [];
  for (let i = 0; i < ALPHABET.length; i += 9) {
    rows.push(ALPHABET.slice(i, i + 9));
  }
  return (
    <div>
      {rows.map((row, i) => (
        <div key={i} className="row-wrap" style={{ marginBottom: 6 }}>
          {row.map((letter) => (
            <LetterBlock key={letter} letter={letter} onClick={() => onLetterTap(letter)} />
          ))}
        </div>
      ))}
    </div>
  );
}
