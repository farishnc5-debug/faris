import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en.json";
import ar from "./ar.json";

export const RTL_LANGUAGES = new Set(["ar"]);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

function applyDirection(lng: string) {
  const dir = RTL_LANGUAGES.has(lng) ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
}

applyDirection(i18n.resolvedLanguage ?? i18n.language);
i18n.on("languageChanged", applyDirection);

export default i18n;
