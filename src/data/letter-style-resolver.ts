/**
 * Résolution du style d'écriture actif ("script" | "cursive" | "digitale").
 *
 * Règle pédagogique (spécifiée par le produit) :
 *  - Les lettres et chiffres non encore disponibles dans le style choisi
 *    retombent sur le style "script" (déjà complet), pour que le parcours
 *    reste toujours praticable pendant que les catalogues cursif/digital se
 *    complètent.
 *  - Les chiffres suivent la même règle que les lettres : le style cursif
 *    n'a pas (encore) de chiffres dédiés donc il retombe sur script ; le
 *    style digital a ses propres chiffres (esthétique "écran digital").
 */

import { LETTER_MAP, type LetterFormation } from "@/data/letter-formation-catalog";
import { CURSIVE_MAP } from "@/data/cursive-formation-catalog";
import { DIGITAL_MAP } from "@/data/digital-formation-catalog";

export type WritingStyle = "script" | "cursive" | "digitale";

/** Résout la forme à afficher/tracer pour un caractère donné, selon le style actif. */
export function getLetterFormation(char: string, style: WritingStyle): LetterFormation | undefined {
  if (style === "cursive") return CURSIVE_MAP.get(char) ?? LETTER_MAP.get(char);
  if (style === "digitale") return DIGITAL_MAP.get(char) ?? LETTER_MAP.get(char);
  return LETTER_MAP.get(char);
}

/** Vrai si ce caractère dispose déjà d'un tracé cursif dédié (sinon : repli script). */
export function hasCursiveFormation(char: string): boolean {
  return CURSIVE_MAP.has(char);
}

/** Vrai si ce caractère dispose déjà d'un tracé digital dédié (sinon : repli script). */
export function hasDigitalFormation(char: string): boolean {
  return DIGITAL_MAP.has(char);
}
