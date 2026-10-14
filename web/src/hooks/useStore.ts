import { useEffect, useState } from "react";
import { store } from "../db";
import type { AppState } from "../types";

export function useAppState(): AppState {
  const [state, setState] = useState<AppState>(store.getState());

  useEffect(() => store.subscribe(setState), []);

  return state;
}
