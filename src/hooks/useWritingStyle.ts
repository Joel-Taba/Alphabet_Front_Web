import { useCallback, useEffect, useState } from "react";
import type { WritingStyle } from "@/data/letter-style-resolver";

/**
 * Réglage partagé du style d'écriture (Profil > Réglages > "Format
 * d'écriture"), lu par toutes les pages de cours/exercices de phase 2 et 3
 * (formation des lettres). Même clé localStorage que la page Profil, pour
 * que le bouton "Cursive" y reste la source de vérité unique.
 */
export const WRITING_STYLE_STORAGE_KEY = "amani_setting_format";
const CHANGE_EVENT = "amani:writing-style-changed";

function readStyle(): WritingStyle {
  if (typeof localStorage === "undefined") return "script";
  const raw = localStorage.getItem(WRITING_STYLE_STORAGE_KEY);
  return raw === "cursive" ? raw : "script";
}

export function setWritingStyle(style: WritingStyle) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(WRITING_STYLE_STORAGE_KEY, style);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: style }));
}

export function useWritingStyle(): WritingStyle {
  const [style, setStyle] = useState<WritingStyle>(() => readStyle());

  useEffect(() => {
    const onChange = () => setStyle(readStyle());
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return style;
}

/** Variante pratique lorsqu'un composant a aussi besoin de modifier le réglage. */
export function useWritingStyleState(): [WritingStyle, (s: WritingStyle) => void] {
  const style = useWritingStyle();
  const set = useCallback((s: WritingStyle) => setWritingStyle(s), []);
  return [style, set];
}
