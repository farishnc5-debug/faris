/** Wraps the browser's native SpeechSynthesis API for offline-capable American English pronunciation. */
let cachedUsVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function loadVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedUsVoice = voices.find((v) => v.lang === "en-US") ?? voices.find((v) => v.lang.startsWith("en")) ?? null;
    voicesLoaded = true;
  }
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  if (!voicesLoaded) loadVoices();

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  if (cachedUsVoice) utterance.voice = cachedUsVoice;
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

export function isTtsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
