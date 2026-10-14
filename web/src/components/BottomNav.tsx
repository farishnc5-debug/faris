export type Tab = "lessons" | "vocabulary" | "test" | "progress";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "lessons", label: "Lessons", icon: "\u{1F4D6}" },
  { id: "vocabulary", label: "Vocabulary", icon: "\u{1F524}" },
  { id: "test", label: "Test", icon: "\u{1F3AF}" },
  { id: "progress", label: "Progress", icon: "\u{1F4CA}" }
];

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`nav-item${active === tab.id ? " active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
