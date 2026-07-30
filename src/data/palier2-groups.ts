/**
 * PALIER 2 — Progression pas à pas (Cours → Exercices)
 *
 * Découpe les 26 minuscules, 10 chiffres et 26 majuscules en petits groupes
 * de 5 caractères (ou moins pour le dernier groupe d'une série), dans l'ordre
 * exact où ils doivent être enseignés puis exercés sur le chemin en zigzag :
 * lettres a→e, chiffres 0→4, lettres f→j, chiffres 5→9, puis le reste des
 * minuscules, puis les majuscules par groupes de 5.
 *
 * En espagnol uniquement, "ñ"/"Ñ" s'insèrent juste après "n"/"N" (groupes l3
 * et u3), l'espagnol étant la seule des trois langues de l'application à
 * utiliser cette lettre.
 */

import type { LetterFormation } from "@/data/letter-formation-catalog";
import type { LocalizedText } from "@/data/sign-exercise-catalog";
import type { Lang } from "@/i18n/LanguageContext";
import { getLetterFormation, type WritingStyle } from "@/data/letter-style-resolver";

export type ProgressionGroupKind = "lettres" | "chiffres";

export interface ProgressionGroup {
  id: string;
  kind: ProgressionGroupKind;
  chars: string[];
  title: LocalizedText;
}

function group(id: string, kind: ProgressionGroupKind, chars: string[], title: LocalizedText): ProgressionGroup {
  return { id, kind, chars, title };
}

const BASE_GROUPS: ProgressionGroup[] = [
  group("l1", "lettres", ["a", "b", "c", "d", "e"], { fr: "Lettres a → e", en: "Letters a → e", es: "Letras a → e" }),
  group("d1", "chiffres", ["0", "1", "2", "3", "4"], { fr: "Chiffres 0 → 4", en: "Digits 0 → 4", es: "Números 0 → 4" }),
  group("l2", "lettres", ["f", "g", "h", "i", "j"], { fr: "Lettres f → j", en: "Letters f → j", es: "Letras f → j" }),
  group("d2", "chiffres", ["5", "6", "7", "8", "9"], { fr: "Chiffres 5 → 9", en: "Digits 5 → 9", es: "Números 5 → 9" }),
  group("l3", "lettres", ["k", "l", "m", "n", "o"], { fr: "Lettres k → o", en: "Letters k → o", es: "Letras k → o" }),
  group("l4", "lettres", ["p", "q", "r", "s", "t"], { fr: "Lettres p → t", en: "Letters p → t", es: "Letras p → t" }),
  group("l5", "lettres", ["u", "v", "w", "x", "y"], { fr: "Lettres u → y", en: "Letters u → y", es: "Letras u → y" }),
  group("l6", "lettres", ["z"], { fr: "Lettre z", en: "Letter z", es: "Letra z" }),
  group("u1", "lettres", ["A", "B", "C", "D", "E"], { fr: "Majuscules A → E", en: "Uppercase A → E", es: "Mayúsculas A → E" }),
  group("u2", "lettres", ["F", "G", "H", "I", "J"], { fr: "Majuscules F → J", en: "Uppercase F → J", es: "Mayúsculas F → J" }),
  group("u3", "lettres", ["K", "L", "M", "N", "O"], { fr: "Majuscules K → O", en: "Uppercase K → O", es: "Mayúsculas K → O" }),
  group("u4", "lettres", ["P", "Q", "R", "S", "T"], { fr: "Majuscules P → T", en: "Uppercase P → T", es: "Mayúsculas P → T" }),
  group("u5", "lettres", ["U", "V", "W", "X", "Y"], { fr: "Majuscules U → Y", en: "Uppercase U → Y", es: "Mayúsculas U → Y" }),
  group("u6", "lettres", ["Z"], { fr: "Majuscule Z", en: "Uppercase Z", es: "Mayúscula Z" }),
];

/** Variante espagnole : "ñ"/"Ñ" insérés juste après "n"/"N" dans leurs groupes respectifs. */
const ES_GROUPS: ProgressionGroup[] = BASE_GROUPS.map((g) => {
  if (g.id === "l3") {
    return { ...g, chars: ["k", "l", "m", "n", "ñ", "o"], title: { fr: "Lettres k → o", en: "Letters k → o", es: "Letras k → o" } };
  }
  if (g.id === "u3") {
    return { ...g, chars: ["K", "L", "M", "N", "Ñ", "O"], title: { fr: "Majuscules K → O", en: "Uppercase K → O", es: "Mayúsculas K → O" } };
  }
  return g;
});

/** Groupes de progression du Palier 2, selon la langue active ("ñ"/"Ñ" en espagnol uniquement). */
export function getPalier2Groups(lang: Lang): ProgressionGroup[] {
  return lang === "es" ? ES_GROUPS : BASE_GROUPS;
}

/** @deprecated Utiliser `getPalier2Groups(lang)` — conservé pour compat (fr/en uniquement, sans "ñ"/"Ñ"). */
export const PALIER2_GROUPS: ProgressionGroup[] = BASE_GROUPS;

const GROUP_MAPS: Record<Lang, Map<string, ProgressionGroup>> = {
  fr: new Map(BASE_GROUPS.map((g) => [g.id, g])),
  en: new Map(BASE_GROUPS.map((g) => [g.id, g])),
  es: new Map(ES_GROUPS.map((g) => [g.id, g])),
};

export function getPalier2GroupMap(lang: Lang): Map<string, ProgressionGroup> {
  return GROUP_MAPS[lang];
}

/** @deprecated Utiliser `getPalier2GroupMap(lang)`. */
export const PALIER2_GROUP_MAP: Map<string, ProgressionGroup> = GROUP_MAPS.fr;

/** Formations complètes (avec pathD) pour les caractères d'un groupe, dans l'ordre. */
export function lettersForGroup(g: ProgressionGroup, style: WritingStyle = "script"): LetterFormation[] {
  return g.chars
    .map((c) => getLetterFormation(c, style))
    .filter((l): l is LetterFormation => !!l);
}

/** Retrouve le groupe de progression auquel appartient un caractère donné. */
export function findGroupForChar(char: string, lang: Lang = "fr"): ProgressionGroup | undefined {
  return getPalier2Groups(lang).find((g) => g.chars.includes(char));
}
