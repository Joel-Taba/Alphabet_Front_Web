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
  w("cheval", "cheval", "horse", "caballo", "animaux"),
  w("mouton", "mouton", "sheep", "oveja", "animaux"),
  w("cochon", "cochon", "pig", "cerdo", "animaux"),
  w("canard", "canard", "duck", "pato", "animaux"),
  w("poule", "poule", "hen", "gallina", "animaux"),
  w("lapin", "lapin", "rabbit", "conejo", "animaux"),
  w("renard", "renard", "fox", "zorro", "animaux"),
  w("loup", "loup", "wolf", "lobo", "animaux"),

  // ─── Nourriture ───
  w("pomme", "pomme", "apple", "manzana", "nourriture"),
  w("miel", "miel", "honey", "miel", "nourriture"),
  w("orange", "orange", "orange", "naranja", "nourriture"),
  w("riz", "riz", "rice", "arroz", "nourriture"),
  w("poire", "poire", "pear", "pera", "nourriture"),
  w("cerise", "cerise", "cherry", "cereza", "nourriture"),
  w("banane", "banane", "banana", "platano", "nourriture"),
  w("tomate", "tomate", "tomato", "tomate", "nourriture"),
  w("carotte", "carotte", "carrot", "zanahoria", "nourriture"),
  w("pain", "pain", "bread", "pan", "nourriture"),
  w("lait", "lait", "milk", "leche", "nourriture"),
  w("sucre", "sucre", "sugar", "azucar", "nourriture"),
  w("fromage", "fromage", "cheese", "queso", "nourriture"),
  w("bonbon", "bonbon", "candy", "caramelo", "nourriture"),
  w("chocolat", "chocolat", "chocolate", "chocolate", "nourriture"),

  // ─── Maison ───
  w("table", "table", "table", "mesa", "maison"),
  w("lit", "lit", "bed", "cama", "maison"),
  w("porte", "porte", "door", "puerta", "maison"),
  w("chaise", "chaise", "chair", "silla", "maison"),
  w("lampe", "lampe", "lamp", "lampara", "maison"),
  w("livre", "livre", "book", "libro", "maison"),
  w("cahier", "cahier", "notebook", "cuaderno", "maison"),
  w("crayon", "crayon", "pencil", "lapiz", "maison"),
  w("stylo", "stylo", "pen", "boligrafo", "maison"),
  w("sac", "sac", "bag", "bolsa", "maison"),
  w("tasse", "tasse", "cup", "taza", "maison"),
  w("verre", "verre", "glass", "vaso", "maison"),
  w("couteau", "couteau", "knife", "cuchillo", "maison"),
  w("clef", "clef", "key", "llave", "maison"),
  w("ballon", "ballon", "balloon", "globo", "maison"),

  // ─── Vêtements ───
  w("robe", "robe", "dress", "vestido", "vetements"),
  w("veste", "veste", "jacket", "chaqueta", "vetements"),
  w("jupe", "jupe", "skirt", "falda", "vetements"),
  w("pantalon", "pantalon", "trousers", "pantalon", "vetements"),
  w("chemise", "chemise", "shirt", "camisa", "vetements"),
  w("chapeau", "chapeau", "hat", "sombrero", "vetements"),
  w("gant", "gant", "glove", "guante", "vetements"),
  w("ceinture", "ceinture", "belt", "cinturon", "vetements"),
  w("cravate", "cravate", "tie", "corbata", "vetements"),
  w("jean", "jean", "jeans", "jean", "vetements"),

  // ─── École ───
  w("classe", "classe", "class", "clase", "ecole"),
  w("gomme", "gomme", "eraser", "goma", "ecole"),
  w("ardoise", "ardoise", "slate", "pizarra", "ecole"),
  w("alphabet", "alphabet", "alphabet", "alfabeto", "ecole"),
  w("lettre", "lettre", "letter", "letra", "ecole"),
  w("mot", "mot", "word", "palabra", "ecole"),
  w("exercice", "exercice", "exercise", "ejercicio", "ecole"),
  w("feuille", "feuille", "sheet", "hoja", "ecole"),
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
  w("montagne", "montagne", "mountain", "montaña", "nature"),

  // ─── Corps ───
  w("main", "main", "hand", "mano", "corps"),
  w("nez", "nez", "nose", "nariz", "corps"),
  w("pied", "pied", "foot", "pie", "corps"),
  w("jambe", "jambe", "leg", "pierna", "corps"),
  w("oreille", "oreille", "ear", "oreja", "corps"),
  w("dos", "dos", "back", "espalda", "corps"),
  w("doigt", "doigt", "finger", "dedo", "corps"),
  w("dent", "dent", "tooth", "diente", "corps"),
  w("yeux", "yeux", "eyes", "ojos", "corps"),
  w("ventre", "ventre", "belly", "vientre", "corps"),

  // ─── Divers (véhicules, famille, couleurs) ───
  w("voiture", "voiture", "car", "coche", "divers"),
  w("train", "train", "train", "tren", "divers"),
  w("camion", "camion", "truck", "camion", "divers"),
  w("bateau", "bateau", "boat", "barco", "divers"),
  w("avion", "avion", "airplane", "avion", "divers"),
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

