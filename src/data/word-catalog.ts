/**
 * PALIER 3 — Les Mots
 *
 * Banque de mots courts (filtrée depuis src/assets/mots.tex) : uniquement des
 * mots dont l'orthographe française, la traduction anglaise ET la traduction
 * espagnole ne comportent que des lettres a→z déjà apprises (aucun accent,
 * trait d'union ou espace), afin que chaque mot reste traçable avec les
 * signes du Palier 2 — dans les trois langues, la traduction servant ici à
 * l'internationalisation de l'application plutôt qu'à un exercice de
 * vocabulaire multilingue. Pour l'espagnol, les accents (á/é/í/ó/ú) sont donc
 * volontairement omis (ex. "avion" et non "avión") ; le ñ reste autorisé
 * puisqu'il est enseigné comme lettre à part entière.
 */

import type { LetterFormation } from "@/data/letter-formation-catalog";
import type { Lang } from "@/i18n/LanguageContext";
import { getLetterFormation, type WritingStyle } from "@/data/letter-style-resolver";

export interface WordEntry {
  id: string;
  fr: string;
  en: string;
  es: string;
  theme: string;
}

function w(id: string, fr: string, en: string, es: string, theme: string): WordEntry {
  return { id, fr, en, es, theme };
}

export const WORD_CATALOG: WordEntry[] = [
  // ─── Animaux ───
  w("chat", "chat", "cat", "gato", "animaux"),
  w("chien", "chien", "dog", "perro", "animaux"),
  w("lion", "lion", "lion", "leon", "animaux"),
  w("tigre", "tigre", "tiger", "tigre", "animaux"),
  w("ours", "ours", "bear", "oso", "animaux"),
  w("singe", "singe", "monkey", "mono", "animaux"),
  w("vache", "vache", "cow", "vaca", "animaux"),
  w("zebre", "zebre", "zebra", "cebra", "animaux"),
  w("mouton", "mouton", "sheep", "oveja", "animaux"),
  w("cochon", "cochon", "pig", "cerdo", "animaux"),
  w("canard", "canard", "duck", "pato", "animaux"),
  w("cygne", "cygne", "swan", "cisne", "animaux"),
  w("lapin", "lapin", "rabbit", "conejo", "animaux"),
  w("renard", "renard", "fox", "zorro", "animaux"),
  w("loup", "loup", "wolf", "lobo", "animaux"),

  // ─── Nourriture ───
  w("kiwi", "kiwi", "kiwi", "kiwi", "nourriture"),
  w("miel", "miel", "honey", "miel", "nourriture"),
  w("citron", "citron", "lemon", "limon", "nourriture"),
  w("riz", "riz", "rice", "arroz", "nourriture"),
  w("poire", "poire", "pear", "pera", "nourriture"),
  w("cerise", "cerise", "cherry", "cereza", "nourriture"),
  w("raisin", "raisin", "grape", "uva", "nourriture"),
  w("tomate", "tomate", "tomato", "tomate", "nourriture"),
  w("mais", "mais", "corn", "maiz", "nourriture"),
  w("pain", "pain", "bread", "pan", "nourriture"),
  w("lait", "lait", "milk", "leche", "nourriture"),
  w("sucre", "sucre", "sugar", "azucar", "nourriture"),
  w("yaourt", "yaourt", "yogurt", "yogur", "nourriture"),
  w("gateau", "gateau", "cake", "pastel", "nourriture"),
  w("creme", "creme", "cream", "crema", "nourriture"),

  // ─── Maison ───
  w("table", "table", "table", "mesa", "maison"),
  w("lit", "lit", "bed", "cama", "maison"),
  w("porte", "porte", "door", "puerta", "maison"),
  w("chaise", "chaise", "chair", "silla", "maison"),
  w("radio", "radio", "radio", "radio", "maison"),
  w("livre", "livre", "book", "libro", "maison"),
  w("papier", "papier", "paper", "papel", "maison"),
  w("crayon", "crayon", "pencil", "lapiz", "maison"),
  w("regle", "regle", "ruler", "regla", "maison"),
  w("sac", "sac", "bag", "bolsa", "maison"),
  w("tasse", "tasse", "cup", "taza", "maison"),
  w("verre", "verre", "glass", "vaso", "maison"),
  w("bol", "bol", "bowl", "bol", "maison"),
  w("clef", "clef", "key", "llave", "maison"),
  w("poupee", "poupee", "doll", "muñeca", "maison"),

  // ─── Vêtements ───
  w("short", "short", "shorts", "short", "vetements"),
  w("poncho", "poncho", "poncho", "poncho", "vetements"),
  w("jupe", "jupe", "skirt", "falda", "vetements"),
  w("botte", "botte", "boot", "bota", "vetements"),
  w("polo", "polo", "polo", "polo", "vetements"),
  w("beret", "beret", "beret", "boina", "vetements"),
  w("gant", "gant", "glove", "guante", "vetements"),
  w("noeud", "noeud", "bow", "lazo", "vetements"),
  w("bouton", "bouton", "button", "boton", "vetements"),
  w("jean", "jean", "jeans", "jean", "vetements"),

  // ─── École ───
  w("classe", "classe", "class", "clase", "ecole"),
  w("gomme", "gomme", "eraser", "goma", "ecole"),
  w("carte", "carte", "card", "carta", "ecole"),
  w("signe", "signe", "sign", "signo", "ecole"),
  w("lettre", "lettre", "letter", "letra", "ecole"),
  w("ligne", "ligne", "line", "linea", "ecole"),
  w("encre", "encre", "ink", "tinta", "ecole"),
  w("banc", "banc", "bench", "banco", "ecole"),
  w("texte", "texte", "text", "texto", "ecole"),
  w("note", "note", "note", "nota", "ecole"),

  // ─── Nature ───
  w("soleil", "soleil", "sun", "sol", "nature"),
  w("lune", "lune", "moon", "luna", "nature"),
  w("nuage", "nuage", "cloud", "nube", "nature"),
  w("pluie", "pluie", "rain", "lluvia", "nature"),
  w("neige", "neige", "snow", "nieve", "nature"),
  w("vent", "vent", "wind", "viento", "nature"),
  w("fleur", "fleur", "flower", "flor", "nature"),
  w("arbre", "arbre", "tree", "arbol", "nature"),
  w("mer", "mer", "sea", "mar", "nature"),
  w("foret", "foret", "forest", "bosque", "nature"),

  // ─── Corps ───
  w("main", "main", "hand", "mano", "corps"),
  w("nez", "nez", "nose", "nariz", "corps"),
  w("pied", "pied", "foot", "pie", "corps"),
  w("jambe", "jambe", "leg", "pierna", "corps"),
  w("coude", "coude", "elbow", "codo", "corps"),
  w("cou", "cou", "neck", "cuello", "corps"),
  w("doigt", "doigt", "finger", "dedo", "corps"),
  w("dent", "dent", "tooth", "diente", "corps"),
  w("yeux", "yeux", "eyes", "ojos", "corps"),
  w("ventre", "ventre", "belly", "panza", "corps"),

  // ─── Divers (véhicules, famille, couleurs) ───
  w("auto", "auto", "car", "coche", "divers"),
  w("train", "train", "train", "tren", "divers"),
  w("camion", "camion", "truck", "camion", "divers"),
  w("bateau", "bateau", "boat", "barco", "divers"),
  w("avion", "avion", "plane", "avion", "divers"),
  w("maman", "maman", "mom", "mami", "divers"),
  w("papa", "papa", "dad", "papi", "divers"),
  w("ami", "ami", "friend", "amigo", "divers"),
  w("bleu", "bleu", "blue", "azul", "divers"),
  w("rouge", "rouge", "red", "rojo", "divers"),
];

export const WORD_MAP: Map<string, WordEntry> = new Map(WORD_CATALOG.map((word) => [word.id, word]));

/** Texte du mot dans la langue active. */
export function wordText(word: WordEntry, lang: Lang): string {
  if (lang === "en") return word.en;
  if (lang === "es") return word.es;
  return word.fr;
}

/** Formations de lettres (avec pathD) correspondant à chaque caractère du mot dans la langue active. */
export function lettersForWord(word: WordEntry, lang: Lang, style: WritingStyle = "script"): LetterFormation[] {
  return wordText(word, lang)
    .split("")
    .map((c) => getLetterFormation(c, style))
    .filter((l): l is LetterFormation => !!l);
}

const THEME_TITLES: Record<string, { fr: string; en: string; es: string }> = {
  animaux: { fr: "Animaux", en: "Animals", es: "Animales" },
  nourriture: { fr: "Nourriture", en: "Food", es: "Comida" },
  maison: { fr: "Maison", en: "House", es: "Casa" },
  vetements: { fr: "Vêtements", en: "Clothes", es: "Ropa" },
  ecole: { fr: "École", en: "School", es: "Escuela" },
  nature: { fr: "Nature", en: "Nature", es: "Naturaleza" },
  corps: { fr: "Corps", en: "Body", es: "Cuerpo" },
  divers: { fr: "Autour de nous", en: "All around us", es: "A nuestro alrededor" },
};

export interface WordGroup {
  id: string;
  theme: string;
  title: { fr: string; en: string; es: string };
  words: WordEntry[];
}

/** Découpe chaque thème en petits groupes de 5 mots, dans l'ordre du catalogue. */
export const PALIER3_GROUPS: WordGroup[] = (() => {
  const groups: WordGroup[] = [];
  const byTheme = new Map<string, WordEntry[]>();
  for (const word of WORD_CATALOG) {
    const list = byTheme.get(word.theme) ?? [];
    list.push(word);
    byTheme.set(word.theme, list);
  }
  for (const [theme, words] of byTheme) {
    const chunkSize = 5;
    const chunkCount = Math.ceil(words.length / chunkSize);
    for (let i = 0; i < chunkCount; i++) {
      const chunk = words.slice(i * chunkSize, (i + 1) * chunkSize);
      const base = THEME_TITLES[theme] ?? { fr: theme, en: theme, es: theme };
      groups.push({
        id: `${theme.slice(0, 2)}${i + 1}`,
        theme,
        title:
          chunkCount > 1
            ? { fr: `${base.fr} ${i + 1}`, en: `${base.en} ${i + 1}`, es: `${base.es} ${i + 1}` }
            : base,
        words: chunk,
      });
    }
  }
  return groups;
})();

export const PALIER3_GROUP_MAP: Map<string, WordGroup> = new Map(PALIER3_GROUPS.map((g) => [g.id, g]));

export function findWordGroupForWord(wordId: string): WordGroup | undefined {
  return PALIER3_GROUPS.find((g) => g.words.some((w) => w.id === wordId));
}

