import { useState } from "react";
import { BottomNav, type Tab } from "./components/BottomNav";
import { LessonsScreen } from "./screens/LessonsScreen";
import { VocabularyScreen } from "./screens/VocabularyScreen";
import { TestScreen } from "./screens/TestScreen";
import { DashboardScreen } from "./screens/DashboardScreen";

export default function App() {
  const [tab, setTab] = useState<Tab>("lessons");

  return (
    <div className="app-shell">
      <div className="app-content">
        {tab === "lessons" && <LessonsScreen />}
        {tab === "vocabulary" && <VocabularyScreen />}
        {tab === "test" && <TestScreen />}
        {tab === "progress" && <DashboardScreen />}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
