import { BookIcon, ChartIcon, LetterIcon, TargetIcon } from "./Icons";

export type Tab = "lessons" | "vocabulary" | "test" | "progress";

const TABS: { id: Tab; label: string; Icon: (p: { filled?: boolean }) => JSX.Element }[] = [
  { id: "lessons", label: "Lessons", Icon: BookIcon },
  { id: "vocabulary", label: "Vocabulary", Icon: LetterIcon },
  { id: "test", label: "Test", Icon: TargetIcon },
  { id: "progress", label: "Progress", Icon: ChartIcon }
];

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={`nav-item${active === id ? " active" : ""}`}
          onClick={() => onChange(id)}
        >
          <span className="nav-icon">
            <Icon filled={active === id} />
          </span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
