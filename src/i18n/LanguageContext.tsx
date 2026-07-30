import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fr, en, es, type Dictionary } from "./translations";

export type Lang = "fr" | "en" | "es";

const STORAGE_KEY = "amani_setting_lang";

const dictionaries: Record<Lang, Dictionary> = { fr, en, es };

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "fr" || saved === "en" || saved === "es") setLangState(saved);
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

/** Remplace les {placeholders} d'une chaîne traduite par des valeurs. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

/** BCP-47 pour la synthèse vocale, par langue. */
export const SPEECH_LOCALE: Record<Lang, string> = {
  fr: "fr-FR",
  en: "en-US",
  es: "es-ES",
};
