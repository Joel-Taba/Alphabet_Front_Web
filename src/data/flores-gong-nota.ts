/**
 * FLORES GONG NOTA — Bibliothèque de Combinatoire
 *
 * Source :
 *   - Minuscules  : CP1.pdf pp. 17–76 ✅ validée
 *   - Chiffres 0–4: CP1.pdf pp. 28/40/52/64, cE2.pdf pp. 16–17 ✅ validée
 *   - Majuscules   : cE2.pdf pp. 24–25 — ⚠️ RECONSTRUCTION VISUELLE, à valider avec M. Moussa
 *   - Chiffres 5–9 : ⚠️ RECONSTRUCTION VISUELLE, à valider avec M. Moussa
 *
 * Principe de combinatoire (source CP1/cE2/CM2, "Nota Béné") :
 *   Chaque lettre = une formule fixe de 1 à 4 signes de base, positionnés
 *   dans une zone verticale précise (corps, hampe haute, jambe basse).
 *   La géométrie du signe ne change jamais — seule sa position et son
 *   orientation varient.
 */

import type { SignFamily } from "@/components/amani";
import type { LocalizedText } from "./sign-exercise-catalog";

/** Zone verticale sur la ligne d'écriture Seyès */
export type ZoneVerticale = "corps" | "hampe" | "jambe";

/** Un signe de base positionné dans la formule d'une lettre */
export interface SigneFormulaItem {
  /** Famille du signe */
  famille: SignFamily;
  /** Variante d'orientation du signe */
  variante: string;
  /** Zone verticale où ce signe se positionne sur la ligne */
  zone: ZoneVerticale;
}

/** Formule de combinatoire d'un caractère (lettre ou chiffre) */
export interface FormuleLettre {
  /** Caractère écrit (ex: "a", "B", "3") */
  caractere: string;
  /** Nom complet pour Amani et l'accessibilité */
  nom: LocalizedText;
  /** Zone globale de la lettre (détermine les lignes Seyès utilisées) */
  zone: ZoneVerticale;
  /** Séquence ordonnée des signes de base composant la lettre */
  signes: SigneFormulaItem[];
  /**
   * true = source directe des manuels CP1/cE2, intégrée en production.
   * false = reconstruction visuelle, à valider avec Monsieur Moussa avant affichage.
   */
  validee: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// 26 MINUSCULES — Source CP1 pp. 17–76, VALIDÉES
// ─────────────────────────────────────────────────────────────────────────────

export const MINUSCULES: FormuleLettre[] = [
  {
    caractere: "a",
    nom: { fr: "a minuscule", en: "lowercase a", es: "a minúscula" },
    zone: "corps",
    signes: [
      { famille: "courbe", variante: "open-right", zone: "corps" },
      { famille: "trait",  variante: "vertical",   zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "b",
    nom: { fr: "b minuscule", en: "lowercase b", es: "b minúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait",  variante: "vertical",  zone: "hampe" },
      { famille: "courbe", variante: "open-left", zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "c",
    nom: { fr: "c minuscule", en: "lowercase c", es: "c minúscula" },
    zone: "corps",
    signes: [
      { famille: "courbe", variante: "open-right", zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "d",
    nom: { fr: "d minuscule", en: "lowercase d", es: "d minúscula" },
    zone: "hampe",
    // Même formule que "a" mais le trait vertical monte en zone hampe
    signes: [
      { famille: "courbe", variante: "open-right", zone: "corps" },
      { famille: "trait",  variante: "vertical",   zone: "hampe" },
    ],
    validee: true,
  },
  {
    caractere: "e",
    nom: { fr: "e minuscule", en: "lowercase e", es: "e minúscula" },
    zone: "corps",
    signes: [
      { famille: "trait",  variante: "horizontal",  zone: "corps" },
      { famille: "courbe", variante: "open-right",  zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "f",
    nom: { fr: "f minuscule", en: "lowercase f", es: "f minúscula" },
    zone: "hampe",
    signes: [
      { famille: "crochet", variante: "top-right",  zone: "hampe" },
      { famille: "trait",   variante: "horizontal", zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "g",
    nom: { fr: "g minuscule", en: "lowercase g", es: "g minúscula" },
    zone: "jambe",
    signes: [
      { famille: "courbe",  variante: "open-right",  zone: "corps" },
      { famille: "crochet", variante: "bottom-left", zone: "jambe" },
    ],
    validee: true,
  },
  {
    caractere: "h",
    nom: { fr: "h minuscule", en: "lowercase h", es: "h minúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait",   variante: "vertical",   zone: "hampe" },
      { famille: "crochet", variante: "top-left",   zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "i",
    nom: { fr: "i minuscule", en: "lowercase i", es: "i minúscula" },
    zone: "corps",
    signes: [
      { famille: "trait", variante: "vertical", zone: "corps" },
      { famille: "point", variante: "center",   zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "j",
    nom: { fr: "j minuscule", en: "lowercase j", es: "j minúscula" },
    zone: "jambe",
    signes: [
      { famille: "crochet", variante: "bottom-left", zone: "jambe" },
      { famille: "point",   variante: "center",      zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "k",
    nom: { fr: "k minuscule", en: "lowercase k", es: "k minúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "vertical",       zone: "hampe" },
      { famille: "trait", variante: "oblique-gauche", zone: "corps" },
      { famille: "trait", variante: "oblique-droit",  zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "l",
    nom: { fr: "l minuscule", en: "lowercase l", es: "l minúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "vertical", zone: "hampe" },
    ],
    validee: true,
  },
  {
    caractere: "m",
    nom: { fr: "m minuscule", en: "lowercase m", es: "m minúscula" },
    zone: "corps",
    signes: [
      { famille: "trait",   variante: "vertical",  zone: "corps" },
      { famille: "crochet", variante: "top-left",  zone: "corps" },
      { famille: "crochet", variante: "top-left",  zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "n",
    nom: { fr: "n minuscule", en: "lowercase n", es: "n minúscula" },
    zone: "corps",
    signes: [
      { famille: "trait",   variante: "vertical", zone: "corps" },
      { famille: "crochet", variante: "top-left", zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "o",
    nom: { fr: "o minuscule", en: "lowercase o", es: "o minúscula" },
    zone: "corps",
    signes: [
      { famille: "courbe", variante: "closed", zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "p",
    nom: { fr: "p minuscule", en: "lowercase p", es: "p minúscula" },
    zone: "jambe",
    signes: [
      { famille: "trait",  variante: "vertical",  zone: "jambe" },
      { famille: "courbe", variante: "open-left", zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "q",
    nom: { fr: "q minuscule", en: "lowercase q", es: "q minúscula" },
    zone: "jambe",
    // Même formule que "a"/"d" mais le trait vertical descend en zone jambe
    signes: [
      { famille: "courbe", variante: "open-right", zone: "corps" },
      { famille: "trait",  variante: "vertical",   zone: "jambe" },
    ],
    validee: true,
  },
  {
    caractere: "r",
    nom: { fr: "r minuscule", en: "lowercase r", es: "r minúscula" },
    zone: "corps",
    signes: [
      { famille: "trait",   variante: "vertical",   zone: "corps" },
      { famille: "crochet", variante: "top-right",  zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "s",
    nom: { fr: "s minuscule", en: "lowercase s", es: "s minúscula" },
    zone: "corps",
    signes: [
      { famille: "crochet", variante: "top-right",   zone: "corps" },
      { famille: "crochet", variante: "bottom-left", zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "t",
    nom: { fr: "t minuscule", en: "lowercase t", es: "t minúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "vertical",   zone: "hampe" },
      { famille: "trait", variante: "horizontal", zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "u",
    nom: { fr: "u minuscule", en: "lowercase u", es: "u minúscula" },
    zone: "corps",
    signes: [
      { famille: "crochet", variante: "bottom-right", zone: "corps" },
      { famille: "trait",   variante: "vertical",     zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "v",
    nom: { fr: "v minuscule", en: "lowercase v", es: "v minúscula" },
    zone: "corps",
    signes: [
      { famille: "trait", variante: "oblique-droit",  zone: "corps" },
      { famille: "trait", variante: "oblique-gauche", zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "w",
    nom: { fr: "w minuscule", en: "lowercase w", es: "w minúscula" },
    zone: "corps",
    signes: [
      { famille: "trait", variante: "oblique-droit",  zone: "corps" },
      { famille: "trait", variante: "oblique-gauche", zone: "corps" },
      { famille: "trait", variante: "oblique-droit",  zone: "corps" },
      { famille: "trait", variante: "oblique-gauche", zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "x",
    nom: { fr: "x minuscule", en: "lowercase x", es: "x minúscula" },
    zone: "corps",
    signes: [
      { famille: "trait", variante: "oblique-gauche", zone: "corps" },
      { famille: "trait", variante: "oblique-droit",  zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "y",
    nom: { fr: "y minuscule", en: "lowercase y", es: "y minúscula" },
    zone: "jambe",
    signes: [
      { famille: "trait", variante: "oblique-droit",  zone: "corps" },
      { famille: "trait", variante: "oblique-gauche", zone: "jambe" },
    ],
    validee: true,
  },
  {
    caractere: "z",
    nom: { fr: "z minuscule", en: "lowercase z", es: "z minúscula" },
    zone: "corps",
    signes: [
      { famille: "trait", variante: "horizontal",    zone: "corps" },
      { famille: "trait", variante: "oblique-gauche", zone: "corps" },
      { famille: "trait", variante: "horizontal",    zone: "corps" },
    ],
    validee: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CHIFFRES 0–4 — Source CP1 + cE2, VALIDÉS
// CHIFFRES 5–9 — ⚠️ Reconstruction visuelle — À VALIDER avec M. Moussa
// ─────────────────────────────────────────────────────────────────────────────

export const CHIFFRES: FormuleLettre[] = [
  {
    caractere: "0",
    nom: { fr: "Zéro", en: "Zero", es: "Cero" },
    zone: "corps",
    signes: [
      { famille: "courbe", variante: "closed", zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "1",
    nom: { fr: "Un", en: "One", es: "Uno" },
    zone: "corps",
    signes: [
      { famille: "trait", variante: "vertical", zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "2",
    nom: { fr: "Deux", en: "Two", es: "Dos" },
    zone: "corps",
    signes: [
      { famille: "courbe",  variante: "open-right",    zone: "corps" },
      { famille: "trait",   variante: "oblique-gauche", zone: "corps" },
      { famille: "trait",   variante: "horizontal",    zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "3",
    nom: { fr: "Trois", en: "Three", es: "Tres" },
    zone: "corps",
    signes: [
      { famille: "courbe", variante: "open-left", zone: "corps" },
      { famille: "courbe", variante: "open-left", zone: "corps" },
    ],
    validee: true,
  },
  {
    caractere: "4",
    nom: { fr: "Quatre", en: "Four", es: "Cuatro" },
    zone: "corps",
    signes: [
      { famille: "trait", variante: "oblique-gauche", zone: "corps" },
      { famille: "trait", variante: "horizontal",     zone: "corps" },
      { famille: "trait", variante: "vertical",       zone: "corps" },
    ],
    validee: true,
  },
  // ⚠️ Chiffres 5–9 — Reconstruction visuelle, non validée
  {
    caractere: "5",
    nom: { fr: "Cinq", en: "Five", es: "Cinco" },
    zone: "corps",
    signes: [
      { famille: "trait",  variante: "horizontal",  zone: "corps" },
      { famille: "trait",  variante: "vertical",    zone: "corps" },
      { famille: "courbe", variante: "open-left",   zone: "corps" },
    ],
    validee: false,
  },
  {
    caractere: "6",
    nom: { fr: "Six", en: "Six", es: "Seis" },
    zone: "corps",
    signes: [
      { famille: "crochet", variante: "top-right", zone: "corps" },
      { famille: "courbe",  variante: "closed",    zone: "corps" },
    ],
    validee: false,
  },
  {
    caractere: "7",
    nom: { fr: "Sept", en: "Seven", es: "Siete" },
    zone: "corps",
    signes: [
      { famille: "trait", variante: "horizontal",    zone: "corps" },
      { famille: "trait", variante: "oblique-gauche", zone: "corps" },
    ],
    validee: false,
  },
  {
    caractere: "8",
    nom: { fr: "Huit", en: "Eight", es: "Ocho" },
    zone: "corps",
    signes: [
      { famille: "courbe", variante: "closed", zone: "corps" },
      { famille: "courbe", variante: "closed", zone: "corps" },
    ],
    validee: false,
  },
  {
    caractere: "9",
    nom: { fr: "Neuf", en: "Nine", es: "Nueve" },
    zone: "corps",
    signes: [
      { famille: "courbe",  variante: "closed",   zone: "corps" },
      { famille: "crochet", variante: "top-right", zone: "corps" },
    ],
    validee: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAJUSCULES — ⚠️ Reconstruction visuelle depuis cE2 pp. 24–25
//              À VALIDER intégralement avec Monsieur Moussa avant affichage.
// ─────────────────────────────────────────────────────────────────────────────

export const MAJUSCULES: FormuleLettre[] = [
  {
    caractere: "A",
    nom: { fr: "A majuscule", en: "uppercase A", es: "A mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "oblique-gauche", zone: "hampe" },
      { famille: "trait", variante: "oblique-droit",  zone: "hampe" },
      { famille: "trait", variante: "horizontal",     zone: "corps" },
    ],
    validee: false,
  },
  {
    caractere: "B",
    nom: { fr: "B majuscule", en: "uppercase B", es: "B mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait",   variante: "vertical",  zone: "hampe" },
      { famille: "courbe",  variante: "open-left", zone: "hampe" },
      { famille: "courbe",  variante: "open-left", zone: "corps" },
    ],
    validee: false,
  },
  {
    caractere: "C",
    nom: { fr: "C majuscule", en: "uppercase C", es: "C mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "courbe", variante: "open-right", zone: "hampe" },
    ],
    validee: false,
  },
  {
    caractere: "D",
    nom: { fr: "D majuscule", en: "uppercase D", es: "D mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait",  variante: "vertical",  zone: "hampe" },
      { famille: "courbe", variante: "open-left", zone: "hampe" },
    ],
    validee: false,
  },
  {
    caractere: "E",
    nom: { fr: "E majuscule", en: "uppercase E", es: "E mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "vertical",   zone: "hampe" },
      { famille: "trait", variante: "horizontal", zone: "hampe" },
      { famille: "trait", variante: "horizontal", zone: "corps" },
      { famille: "trait", variante: "horizontal", zone: "corps" },
    ],
    validee: false,
  },
  {
    caractere: "F",
    nom: { fr: "F majuscule", en: "uppercase F", es: "F mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "vertical",   zone: "hampe" },
      { famille: "trait", variante: "horizontal", zone: "hampe" },
      { famille: "trait", variante: "horizontal", zone: "corps" },
    ],
    validee: false,
  },
  {
    caractere: "G",
    nom: { fr: "G majuscule", en: "uppercase G", es: "G mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "courbe", variante: "open-right", zone: "hampe" },
      { famille: "crochet", variante: "top-left",  zone: "corps" },
      { famille: "trait",  variante: "horizontal", zone: "corps" },
    ],
    validee: false,
  },
  {
    caractere: "H",
    nom: { fr: "H majuscule", en: "uppercase H", es: "H mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "vertical",   zone: "hampe" },
      { famille: "trait", variante: "horizontal", zone: "corps" },
      { famille: "trait", variante: "vertical",   zone: "hampe" },
    ],
    validee: false,
  },
  {
    caractere: "I",
    nom: { fr: "I majuscule", en: "uppercase I", es: "I mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "vertical", zone: "hampe" },
    ],
    validee: false,
  },
  {
    caractere: "J",
    nom: { fr: "J majuscule", en: "uppercase J", es: "J mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "crochet", variante: "bottom-left", zone: "jambe" },
      { famille: "trait",   variante: "vertical",    zone: "hampe" },
    ],
    validee: false,
  },
  {
    caractere: "K",
    nom: { fr: "K majuscule", en: "uppercase K", es: "K mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "vertical",       zone: "hampe" },
      { famille: "trait", variante: "oblique-gauche", zone: "corps" },
      { famille: "trait", variante: "oblique-droit",  zone: "corps" },
    ],
    validee: false,
  },
  {
    caractere: "L",
    nom: { fr: "L majuscule", en: "uppercase L", es: "L mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "vertical",   zone: "hampe" },
      { famille: "trait", variante: "horizontal", zone: "corps" },
    ],
    validee: false,
  },
  {
    caractere: "M",
    nom: { fr: "M majuscule", en: "uppercase M", es: "M mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "vertical",       zone: "hampe" },
      { famille: "trait", variante: "oblique-gauche", zone: "hampe" },
      { famille: "trait", variante: "oblique-droit",  zone: "hampe" },
      { famille: "trait", variante: "vertical",       zone: "hampe" },
    ],
    validee: false,
  },
  {
    caractere: "N",
    nom: { fr: "N majuscule", en: "uppercase N", es: "N mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "vertical",       zone: "hampe" },
      { famille: "trait", variante: "oblique-gauche", zone: "hampe" },
      { famille: "trait", variante: "vertical",       zone: "hampe" },
    ],
    validee: false,
  },
  {
    caractere: "O",
    nom: { fr: "O majuscule", en: "uppercase O", es: "O mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "courbe", variante: "closed", zone: "hampe" },
    ],
    validee: false,
  },
  {
    caractere: "P",
    nom: { fr: "P majuscule", en: "uppercase P", es: "P mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait",  variante: "vertical",  zone: "hampe" },
      { famille: "courbe", variante: "open-left", zone: "hampe" },
    ],
    validee: false,
  },
  {
    caractere: "Q",
    nom: { fr: "Q majuscule", en: "uppercase Q", es: "Q mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "courbe", variante: "closed",        zone: "hampe" },
      { famille: "trait",  variante: "oblique-gauche", zone: "corps" },
    ],
    validee: false,
  },
  {
    caractere: "R",
    nom: { fr: "R majuscule", en: "uppercase R", es: "R mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait",   variante: "vertical",       zone: "hampe" },
      { famille: "courbe",  variante: "open-left",      zone: "hampe" },
      { famille: "trait",   variante: "oblique-gauche", zone: "corps" },
    ],
    validee: false,
  },
  {
    caractere: "S",
    nom: { fr: "S majuscule", en: "uppercase S", es: "S mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "crochet", variante: "top-right",   zone: "hampe" },
      { famille: "crochet", variante: "bottom-left", zone: "corps" },
    ],
    validee: false,
  },
  {
    caractere: "T",
    nom: { fr: "T majuscule", en: "uppercase T", es: "T mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "horizontal", zone: "hampe" },
      { famille: "trait", variante: "vertical",   zone: "hampe" },
    ],
    validee: false,
  },
  {
    caractere: "U",
    nom: { fr: "U majuscule", en: "uppercase U", es: "U mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait",   variante: "vertical",      zone: "hampe" },
      { famille: "crochet", variante: "bottom-right",  zone: "corps" },
      { famille: "trait",   variante: "vertical",      zone: "hampe" },
    ],
    validee: false,
  },
  {
    caractere: "V",
    nom: { fr: "V majuscule", en: "uppercase V", es: "V mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "oblique-droit",  zone: "hampe" },
      { famille: "trait", variante: "oblique-gauche", zone: "hampe" },
    ],
    validee: false,
  },
  {
    caractere: "W",
    nom: { fr: "W majuscule", en: "uppercase W", es: "W mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "oblique-droit",  zone: "hampe" },
      { famille: "trait", variante: "oblique-gauche", zone: "hampe" },
      { famille: "trait", variante: "oblique-droit",  zone: "hampe" },
      { famille: "trait", variante: "oblique-gauche", zone: "hampe" },
    ],
    validee: false,
  },
  {
    caractere: "X",
    nom: { fr: "X majuscule", en: "uppercase X", es: "X mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "oblique-gauche", zone: "hampe" },
      { famille: "trait", variante: "oblique-droit",  zone: "hampe" },
    ],
    validee: false,
  },
  {
    caractere: "Y",
    nom: { fr: "Y majuscule", en: "uppercase Y", es: "Y mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "oblique-droit",  zone: "hampe" },
      { famille: "trait", variante: "oblique-gauche", zone: "hampe" },
      { famille: "trait", variante: "vertical",       zone: "corps" },
    ],
    validee: false,
  },
  {
    caractere: "Z",
    nom: { fr: "Z majuscule", en: "uppercase Z", es: "Z mayúscula" },
    zone: "hampe",
    signes: [
      { famille: "trait", variante: "horizontal",    zone: "hampe" },
      { famille: "trait", variante: "oblique-gauche", zone: "hampe" },
      { famille: "trait", variante: "horizontal",    zone: "corps" },
    ],
    validee: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// INDEX GLOBAL
// ─────────────────────────────────────────────────────────────────────────────

/** Index plat de tous les caractères pour un lookup O(1) */
export const FORMULES_PAR_CARACTERE: Map<string, FormuleLettre> = new Map([
  ...MINUSCULES.map((f) => [f.caractere, f] as [string, FormuleLettre]),
  ...CHIFFRES.map((f)   => [f.caractere, f] as [string, FormuleLettre]),
  ...MAJUSCULES.map((f) => [f.caractere, f] as [string, FormuleLettre]),
]);

/** Couleur de la famille dominante (premier signe) d'une formule */
export const COULEUR_FAMILLE: Record<string, { bg: string; text: string; border?: string }> = {
  trait:   { bg: "#F5EDE0", text: "#4A3B2A", border: "1px solid #4A3B2A" },
  courbe:  { bg: "#FDEAEA", text: "#C03E3E" },
  crochet: { bg: "#EAF1FB", text: "#2D6BBF" },
  point:   { bg: "#FBF6EC", text: "#4A3B2A", border: "1px solid #A9784F" },
};

/** Couleur des glyphes SVG par famille */
export const STROKE_FAMILLE: Record<string, string> = {
  trait:   "#4A3B2A",
  courbe:  "#E05252",
  crochet: "#4A90E2",
  point:   "#4A3B2A",
};

/** Famille dominante d'une formule (celle du premier signe) */
export function familleDominante(formule: FormuleLettre): string {
  return formule.signes[0]?.famille ?? "trait";
}

/** Description de zone lisible */
export const LABEL_ZONE: Record<ZoneVerticale, LocalizedText> = {
  corps: { fr: "Lettre courte (corps de ligne)", en: "Short letter (line body)", es: "Letra corta (cuerpo de línea)" },
  hampe: { fr: "Lettre haute (hampe supérieure)", en: "Tall letter (ascender)", es: "Letra alta (asta ascendente)" },
  jambe: { fr: "Lettre basse (jambe inférieure)", en: "Low letter (descender)", es: "Letra baja (asta descendente)" },
};
