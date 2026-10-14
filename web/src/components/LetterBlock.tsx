export type SlotState = "default" | "correct" | "wrong" | "empty";

interface Props {
  letter?: string | null;
  state?: SlotState;
  onClick?: () => void;
}

export function LetterBlock({ letter, state = "default", onClick }: Props) {
  const classes = ["letter-block"];
  if (state !== "default") classes.push(state);
  if (!letter && !onClick) classes.push("empty");

  return (
    <button
      type="button"
      className={classes.join(" ")}
      onClick={onClick}
      disabled={!onClick}
      aria-label={letter ? letter : "Empty letter slot"}
    >
      {letter ?? ""}
    </button>
  );
}
