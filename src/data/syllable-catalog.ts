/**
 * PALIER "Les syllabes" — entre les lettres (Palier 2) et les mots (Palier 4)
 *
 * Méthode syllabique classique : consonne + voyelle = syllabe (ex. "b + a =
 * ba"). Un groupe par consonne, balayée sur les voyelles a/e/i/o/u — mais
 * uniquement les combinaisons réellement enseignées à l'école (certaines
 * lettres, comme "q" ou "w", n'ont quasiment aucune syllabe naturelle en
 * français en dehors de "qu"/"wa" ; les combinaisons rares comme "qe", "yi"
 * ou "zu" sont donc volontairement absentes plutôt que forcées avec un mot
 * artificiel).
 *
 * Disponible en français uniquement pour l'instant : la méthode "consonne +
 * voyelle" est une pédagogie de lecture spécifiquement française, et ce
 * palier n'apparaît donc pas dans le parcours en anglais/espagnol (voir
 * `_app.accueil.tsx`, qui filtre ce bloc par langue).
 *
 * Chaque mot-exemple respecte la même contrainte que le reste de
 * l'application : uniquement des lettres a→z sans accent, 6 lettres maximum,
 * et contient la syllabe enseignée (pas nécessairement en première
 * position).
 */

import type { LetterFormation } from "@/data/letter-formation-catalog";
import { getLetterFormation, type WritingStyle } from "@/data/letter-style-resolver";

export interface SyllableEntry {
  /** "ba" */
  syllable: string;
  consonant: string;
  vowel: string;
  /** Mot très simple (≤6 lettres, sans accent) contenant la syllabe. */
  exampleWord: string;
}

export interface SyllableGroup {
  id: string;
  consonant: string;
  syllables: SyllableEntry[];
}

function entry(consonant: string, vowel: string, exampleWord: string): SyllableEntry {
  return { syllable: `${consonant}${vowel}`, consonant, vowel, exampleWord };
}

/** Ordre pédagogique : b, c, d, f, g, h, j, k, l, m, n, p, q, r, s, t, v, w, y, z. */
export const SYLLABLE_GROUPS: SyllableGroup[] = [
  { id: "syl-b", consonant: "b", syllables: [entry("b", "a", "banane"), entry("b", "e", "bebe"), entry("b", "i", "biche"), entry("b", "o", "bobo"), entry("b", "u", "bulle")] },
  { id: "syl-c", consonant: "c", syllables: [entry("c", "a", "canard"), entry("c", "e", "cerise"), entry("c", "i", "citron"), entry("c", "o", "coco"), entry("c", "u", "cube")] },
  { id: "syl-d", consonant: "d", syllables: [entry("d", "a", "dada"), entry("d", "e", "dent"), entry("d", "i", "dix"), entry("d", "o", "dodo"), entry("d", "u", "dune")] },
  { id: "syl-f", consonant: "f", syllables: [entry("f", "a", "face"), entry("f", "e", "fee"), entry("f", "i", "fil"), entry("f", "o", "fort"), entry("f", "u", "fume")] },
  { id: "syl-g", consonant: "g", syllables: [entry("g", "a", "gare"), entry("g", "e", "genou"), entry("g", "i", "girafe"), entry("g", "o", "gomme"), entry("g", "u", "legume")] },
  { id: "syl-h", consonant: "h", syllables: [entry("h", "a", "habit"), entry("h", "e", "herbe"), entry("h", "i", "hibou"), entry("h", "o", "homme"), entry("h", "u", "huile")] },
  { id: "syl-j", consonant: "j", syllables: [entry("j", "a", "jambe"), entry("j", "e", "jeu"), entry("j", "o", "joue"), entry("j", "u", "jupe")] },
  { id: "syl-k", consonant: "k", syllables: [entry("k", "a", "kayak"), entry("k", "i", "kiwi"), entry("k", "o", "koala")] },
  { id: "syl-l", consonant: "l", syllables: [entry("l", "a", "lama"), entry("l", "e", "lettre"), entry("l", "i", "lion"), entry("l", "o", "loup"), entry("l", "u", "lune")] },
  { id: "syl-m", consonant: "m", syllables: [entry("m", "a", "maman"), entry("m", "e", "melon"), entry("m", "i", "midi"), entry("m", "o", "moto"), entry("m", "u", "mur")] },
  { id: "syl-n", consonant: "n", syllables: [entry("n", "a", "natte"), entry("n", "e", "neige"), entry("n", "i", "nid"), entry("n", "o", "note"), entry("n", "u", "nuit")] },
  { id: "syl-p", consonant: "p", syllables: [entry("p", "a", "papa"), entry("p", "e", "petit"), entry("p", "i", "pile"), entry("p", "o", "pomme"), entry("p", "u", "pull")] },
  { id: "syl-q", consonant: "q", syllables: [entry("q", "u", "quatre")] },
  { id: "syl-r", consonant: "r", syllables: [entry("r", "a", "radis"), entry("r", "e", "renard"), entry("r", "i", "riz"), entry("r", "o", "robe"), entry("r", "u", "rue")] },
  { id: "syl-s", consonant: "s", syllables: [entry("s", "a", "salade"), entry("s", "e", "sel"), entry("s", "i", "singe"), entry("s", "o", "soleil"), entry("s", "u", "sucre")] },
  { id: "syl-t", consonant: "t", syllables: [entry("t", "a", "tasse"), entry("t", "e", "tete"), entry("t", "i", "tigre"), entry("t", "o", "toto"), entry("t", "u", "tulipe")] },
  { id: "syl-v", consonant: "v", syllables: [entry("v", "a", "vache"), entry("v", "e", "verre"), entry("v", "i", "vite"), entry("v", "o", "voile"), entry("v", "u", "vue")] },
  { id: "syl-w", consonant: "w", syllables: [entry("w", "a", "wagon")] },
  { id: "syl-y", consonant: "y", syllables: [entry("y", "a", "yaourt"), entry("y", "e", "yeux"), entry("y", "o", "yoyo")] },
  { id: "syl-z", consonant: "z", syllables: [entry("z", "a", "pizza"), entry("z", "e", "zero"), entry("z", "o", "zoo")] },
];

export const SYLLABLE_GROUP_MAP: Map<string, SyllableGroup> = new Map(SYLLABLE_GROUPS.map((g) => [g.id, g]));

export function findSyllableGroupForConsonant(consonant: string): SyllableGroup | undefined {
  return SYLLABLE_GROUP_MAP.get(`syl-${consonant}`);
}

/** Formations (avec pathD) des deux lettres d'une syllabe, dans l'ordre. */
export function lettersForSyllable(syllable: string, style: WritingStyle = "script"): LetterFormation[] {
  return syllable
    .split("")
    .map((c) => getLetterFormation(c, style))
    .filter((l): l is LetterFormation => !!l);
}

/** Formations des lettres du mot-exemple, dans l'ordre (mêmes lettres a→z que le reste de l'app). */
export function lettersForExampleWord(entry: SyllableEntry, style: WritingStyle = "script"): LetterFormation[] {
  return entry.exampleWord
    .split("")
    .map((c) => getLetterFormation(c, style))
    .filter((l): l is LetterFormation => !!l);
}
