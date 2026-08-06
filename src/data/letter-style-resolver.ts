/**
 * Résolution du style d'écriture actif ("script" | "cursive").
 *
 * Règle pédagogique (spécifiée par le produit) :
 *  - Les lettres et chiffres non encore disponibles dans le style choisi
 *    retombent sur le style "script" (déjà complet), pour que le parcours
 *    reste toujours praticable pendant que le catalogue cursif se complète.
 *  - Les chiffres suivent la même règle : le style cursif n'a pas (encore)
 *    de chiffres dédiés donc il retombe sur script.
 */

import { LETTER_MAP, type LetterFormation } from "@/data/letter-formation-catalog";
import { CURSIVE_MAP } from "@/data/cursive-formation-catalog";

export type WritingStyle = "script" | "cursive";

/** Résout la forme à afficher/tracer pour un caractère donné, selon le style actif. */
export function getLetterFormation(char: string, style: WritingStyle): LetterFormation | undefined {
  if (style === "cursive") return CURSIVE_MAP.get(char) ?? LETTER_MAP.get(char);
  return LETTER_MAP.get(char);
}

/** Vrai si ce caractère dispose déjà d'un tracé cursif dédié (sinon : repli script). */
export function hasCursiveFormation(char: string): boolean {
  return CURSIVE_MAP.has(char);
}
