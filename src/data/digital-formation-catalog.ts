/**
 * DIGITAL FORMATION CATALOG — Phase 2/3, style "digitale"
 *
 * Comme le style cursif (cursive-formation-catalog.ts), les lettres du style
 * digital sont composées d'une séquence de "tampons" (stamps) placés,
 * tournés, mis à l'échelle dans le repère de la lettre (grille 200×200).
 * Contrairement au cursif, le style digital n'utilise que des TRAITS (des
 * segments droits) — un rendu géométrique, "à la tablette", sans courbe ni
 * boucle liée.
 *
 * Même rayon canonique R=30 et même formule de transformation que le style
 * cursif (vérifié exactement sur l'export réel fourni pour "a" : un trait à
 * rotation 92°, échelle 0.35, centré sur (99,54), reproduit au centième
 * d'unité près).
 */

import type { LetterFormation, LetterSignStep } from "@/data/letter-formation-catalog";

// ─── Format d'entrée (tel que fourni) ─────────────────────────────────────────

interface DigitalStepInput {
  family: "trait";
  x: number;
  y: number;
  rotation: number;
  scale: number;
  flip: boolean;
  order: number;
  /** Inverse le sens de tracé de ce trait (part de l'extrémité, termine à
   * l'origine) sans changer sa forme ni sa position. */
  reverse?: boolean;
}

interface DigitalLetterInput {
  char: string;
  steps: DigitalStepInput[];
}

// ─── Gabarit géométrique unitaire (identique au moteur cursif) ────────────────

const R = 30;

type LocalPoint = [number, number];

function sampleTrait(): LocalPoint[] {
  return [
    [0, -R],
    [0, R],
  ];
}

function transform(p: LocalPoint, step: DigitalStepInput): LocalPoint {
  let [lx, ly] = p;
  if (step.flip) lx = -lx;
  lx *= step.scale;
  ly *= step.scale;
  const rad = (step.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const rx = lx * cos - ly * sin;
  const ry = lx * sin + ly * cos;
  return [rx + step.x, ry + step.y];
}

function toPathD(points: LocalPoint[]): string {
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
}

// ─── Normalisation de taille (même logique que le style cursif) ──────────────

const ZONE_TARGET: Record<LetterFormation["zone"], [number, number]> = {
  hampe: [35, 149],
  jambe: [77, 165],
  corps: [77, 149],
};

/** Lettres dont le rendu doit être délibérément plus petit que le reste de
 * leur zone, pour rester nettement distinguable de leur majuscule (ex. "m"
 * vs "M", "z" vs "Z", visuellement très proches en style digital). */
const REDUCED_TARGET: Partial<Record<string, [number, number]>> = {
  m: [84, 142],
  z: [84, 142],
};

function normalizationTargetFor(char: string, zone: LetterFormation["zone"]): [number, number] {
  return REDUCED_TARGET[char] ?? ZONE_TARGET[zone];
}

function normalizeLetterPoints(stepsPoints: LocalPoint[][], target: [number, number]): LocalPoint[][] {
  const all = stepsPoints.flat();
  const minY = Math.min(...all.map((p) => p[1]));
  const maxY = Math.max(...all.map((p) => p[1]));
  const minX = Math.min(...all.map((p) => p[0]));
  const maxX = Math.max(...all.map((p) => p[0]));
  const rawHeight = maxY - minY;
  if (rawHeight < 1) return stepsPoints;

  const [targetTop, targetBottom] = target;
  const scaleFactor = (targetBottom - targetTop) / rawHeight;
  const centerX = (minX + maxX) / 2;

  return stepsPoints.map((pts) =>
    pts.map(([x, y]) => [100 + (x - centerX) * scaleFactor, targetTop + (y - minY) * scaleFactor] as LocalPoint)
  );
}

// ─── Assemblage des lettres ────────────────────────────────────────────────────

const HAMPE = new Set(["b", "d", "f", "h", "k", "l", "t"]);
const JAMBE = new Set(["g", "j", "p", "q", "y", "z"]);

function isUppercase(char: string): boolean {
  return char.length === 1 && char === char.toUpperCase() && char !== char.toLowerCase();
}

function zoneFor(char: string): LetterFormation["zone"] {
  if (isUppercase(char)) return "hampe";
  if (HAMPE.has(char)) return "hampe";
  if (JAMBE.has(char)) return "jambe";
  return "corps";
}

const VOWEL_CHARS = new Set(["a", "e", "i", "o", "u"]);
const DIGIT_CHARS = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

function buildLetter(input: DigitalLetterInput): LetterFormation {
  const orderedSteps = [...input.steps].sort((a, b) => a.order - b.order);
  const zone = zoneFor(input.char);

  const rawStepsPoints = orderedSteps.map((step) => sampleTrait().map((p) => transform(p, step)));
  const target = normalizationTargetFor(input.char, zone);
  const normalizedStepsPoints = normalizeLetterPoints(rawStepsPoints, target);

  const steps: LetterSignStep[] = orderedSteps.map((step, i) => {
    const pts = step.reverse ? [...normalizedStepsPoints[i]].reverse() : normalizedStepsPoints[i];
    const pathD = toPathD(pts);
    const [startX, startY] = pts[0];
    return {
      family: "trait",
      variant: "digital-trait",
      pathD,
      startXY: [Number(startX.toFixed(2)), Number(startY.toFixed(2))],
      strokeColor: "#4A3B2A",
      description: {
        fr: `Trace le trait n°${step.order}`,
        en: `Trace the line #${step.order}`,
        es: `Traza el trazo n.º${step.order}`,
      },
    };
  });

  return {
    char: input.char,
    name: { fr: `${input.char} digital`, en: `digital ${input.char}`, es: `${input.char} digital` },
    category: DIGIT_CHARS.has(input.char)
      ? "chiffre"
      : isUppercase(input.char)
        ? "majuscule"
        : VOWEL_CHARS.has(input.char)
          ? "voyelle"
          : "consonne",
    zone,
    steps,
    consigne: {
      fr: `En digital, la lettre "${input.char}" s'écrit par segments droits, un trait après l'autre.`,
      en: `In digital style, the letter "${input.char}" is written with straight segments, one line after another.`,
      es: `En digital, la letra "${input.char}" se escribe con segmentos rectos, un trazo tras otro.`,
    },
  };
}

// ─── Données fournies (export réel de l'éditeur) ─────────────────────────────
// Minuscules et majuscules disponibles pour l'instant : a, b, c, d, q (minuscules)
// et D (majuscule) — le reste arrivera dans une prochaine itération, voir
// getLetterFormation qui bascule automatiquement sur le style script pour
// tout caractère absent d'ici.

const DIGITAL_RAW: DigitalLetterInput[] = [
  {
    char: "a",
    steps: [
      { family: "trait", x: 99, y: 54, rotation: 92, scale: 0.35, flip: false, order: 1 },
      { family: "trait", x: 81.8, y: 61, rotation: 36, scale: 0.3, flip: false, order: 2 },
      { family: "trait", x: 76, y: 80, rotation: 0, scale: 0.35, flip: false, order: 3 },
      { family: "trait", x: 83.4, y: 97, rotation: -45, scale: 0.3, flip: false, order: 4 },
      { family: "trait", x: 100.3, y: 103.2, rotation: 270, scale: 0.3, flip: false, order: 5 },
      { family: "trait", x: 111.6, y: 79.6, rotation: 0, scale: 1, flip: false, order: 6 },
    ],
  },
  {
    char: "b",
    steps: [
      { family: "trait", x: 70, y: 65, rotation: 0, scale: 1, flip: false, order: 1 },
      { family: "trait", x: 79, y: 65, rotation: 91, scale: 0.27, flip: false, order: 2, reverse: true },
      { family: "trait", x: 90.9, y: 70.3, rotation: -30, scale: 0.19, flip: false, order: 3 },
      { family: "trait", x: 93.5, y: 80, rotation: 0, scale: 0.18, flip: false, order: 4 },
      { family: "trait", x: 88, y: 90, rotation: 48, scale: 0.19, flip: false, order: 5 },
      { family: "trait", x: 77, y: 94, rotation: 90, scale: 0.22, flip: false, order: 6 },
    ],
  },
  {
    char: "c",
    steps: [
      { family: "trait", x: 96, y: 51, rotation: 91, scale: 0.5, flip: false, order: 1 },
      { family: "trait", x: 80.5, y: 69.8, rotation: 0, scale: 0.65, flip: false, order: 2 },
      { family: "trait", x: 95.5, y: 90, rotation: 90, scale: 0.5, flip: false, order: 3, reverse: true },
    ],
  },
  {
    char: "d",
    steps: [
      { family: "trait", x: 110.3, y: 67, rotation: 0, scale: 0.85, flip: false, order: 1 },
      { family: "trait", x: 103, y: 70, rotation: 90, scale: 0.18, flip: false, order: 2 },
      { family: "trait", x: 95, y: 73.8, rotation: 37, scale: 0.15, flip: false, order: 3 },
      { family: "trait", x: 91.8, y: 80.3, rotation: 3, scale: 0.1, flip: false, order: 4 },
      { family: "trait", x: 95, y: 87, rotation: 139, scale: 0.15, flip: false, order: 5, reverse: true},
      { family: "trait", x: 103, y: 90, rotation: 90, scale: 0.18, flip: false, order: 6, reverse: true },
    ],
  },
  {
    char: "q",
    steps: [
      { family: "trait", x: 112, y: 89, rotation: 134, scale: 0.15, flip: false, order: 1 },
      { family: "trait", x: 101, y: 86, rotation: 90, scale: 0.25, flip: false, order: 2 },
      { family: "trait", x: 90, y: 90, rotation: 41, scale: 0.16, flip: false, order: 3 },
      { family: "trait", x: 86, y: 104, rotation: 0, scale: 0.32, flip: false, order: 4 },
      { family: "trait", x: 89, y: 117, rotation: -38, scale: 0.15, flip: false, order: 5 },
      { family: "trait", x: 100, y: 121, rotation: 90, scale: 0.25, flip: false, order: 6, reverse: true },
      { family: "trait", x: 111.8, y: 117, rotation: 41, scale: 0.17, flip: false, order: 7, reverse: true},
      { family: "trait", x: 115.8, y: 117, rotation: 0, scale: 1.05, flip: false, order: 8 },
    ],
  },
  {
    char: "o",
    steps: [
      { family: "trait", x: 100.8, y: 86, rotation: 90, scale: 0.25, flip: false, order: 1 },
      { family: "trait", x: 89.8, y: 90, rotation: 41, scale: 0.16, flip: false, order: 2 },
      { family: "trait", x: 86, y: 103.8, rotation: 0, scale: 0.3, flip: false, order: 3 },
      { family: "trait", x: 89.3, y: 117, rotation: -38, scale: 0.15, flip: false, order: 4 },
      { family: "trait", x: 100, y: 120.5, rotation: 90, scale: 0.25, flip: false, order: 5, reverse: true},
      { family: "trait", x: 111.5, y: 116.3, rotation: 41, scale: 0.17, flip: false, order: 6, reverse: true },
      { family: "trait", x: 115, y: 102, rotation: 0, scale: 0.32, flip: false, order: 7, reverse: true },
      { family: "trait", x: 111.5, y: 88.8, rotation: 131, scale: 0.15, flip: false, order: 8 },
    ],
  },
  {
    char: "p",
    steps: [
      { family: "trait", x: 86, y: 118, rotation: 0, scale: 1, flip: false, order: 1 },
      { family: "trait", x: 89.8, y: 90, rotation: 41, scale: 0.16, flip: false, order: 2, reverse: true },
      { family: "trait", x: 101, y: 85.8, rotation: 90, scale: 0.25, flip: false, order: 3, reverse: true },
      { family: "trait", x: 112, y: 89, rotation: 134, scale: 0.15, flip: false, order: 4, reverse: true },
      { family: "trait", x: 115.3, y: 102.3, rotation: 0, scale: 0.32, flip: false, order: 5 },
      { family: "trait", x: 111.5, y: 116.5, rotation: 41, scale: 0.17, flip: false, order: 6 },
      { family: "trait", x: 100, y: 121, rotation: 90, scale: 0.25, flip: false, order: 7 },
      { family: "trait", x: 89, y: 117, rotation: -38, scale: 0.15, flip: false, order: 8, reverse: true },
    ],
  },
  {
    char: "r",
    steps: [
      { family: "trait", x: 86, y: 97.3, rotation: 0, scale: 0.5, flip: false, order: 1 },
      { family: "trait", x: 90, y: 90, rotation: 41, scale: 0.16, flip: false, order: 2, reverse: true },
      { family: "trait", x: 98.5, y: 86, rotation: 90, scale: 0.15, flip: false, order: 3, reverse: true },
      { family: "trait", x: 106.8, y: 89.3, rotation: 134, scale: 0.15, flip: false, order: 4, reverse: true },
    ],
  },
  {
    char: "e",
    steps: [
      { family: "trait", x: 104, y: 74, rotation: 90, scale: 0.43, flip: false, order: 1, reverse: true},
      { family: "trait", x: 117, y: 68, rotation: 0, scale: 0.15, flip: false, order: 2, reverse: true },
      { family: "trait", x: 114, y: 61, rotation: 135, scale: 0.15, flip: false, order: 3 },
      { family: "trait", x: 104.3, y: 58, rotation: 90, scale: 0.18, flip: false, order: 4 },
      { family: "trait", x: 94, y: 61, rotation: 54, scale: 0.15, flip: false, order: 5 },
      { family: "trait", x: 90, y: 72, rotation: 0, scale: 0.25, flip: false, order: 6 },
      { family: "trait", x: 94, y: 85, rotation: 140, scale: 0.22, flip: false, order: 7, reverse: true },
      { family: "trait", x: 107, y: 90, rotation: 90, scale: 0.26, flip: false, order: 8, reverse: true},
    ],
  },
  {
    char: "g",
    steps: [
      { family: "trait", x: 113, y: 61, rotation: 142, scale: 0.11, flip: false, order: 1 },
      { family: "trait", x: 104, y: 58, rotation: 90, scale: 0.2, flip: false, order: 2 },
      { family: "trait", x: 94, y: 61, rotation: 54, scale: 0.15, flip: false, order: 3 },
      { family: "trait", x: 90, y: 72, rotation: 0, scale: 0.25, flip: false, order: 4 },
      { family: "trait", x: 94, y: 85, rotation: 140, scale: 0.22, flip: false, order: 5, reverse: true},
      { family: "trait", x: 104, y: 90, rotation: 90, scale: 0.2, flip: false, order: 6, reverse: true },
      { family: "trait", x: 113, y: 88, rotation: 44, scale: 0.11, flip: false, order: 7, reverse: true },
      { family: "trait", x: 116, y: 93, rotation: 0, scale: 1.2, flip: false, order: 8 },
      { family: "trait", x: 113, y: 130, rotation: 90, scale: 0.12, flip: false, order: 9 },
      { family: "trait", x: 104, y: 126, rotation: 132, scale: 0.18, flip: false, order: 10 },
      { family: "trait", x: 100, y: 118, rotation: 0, scale: 0.1, flip: false, order: 11, reverse: true },
      { family: "trait", x: 110, y: 105, rotation: 45, scale: 0.45, flip: false, order: 12, reverse: true },
    ],
  },
  {
    char: "f",
    steps: [
      { family: "trait", x: 101.5, y: 55, rotation: 145, scale: 0.2, flip: false, order: 1 },
      { family: "trait", x: 89, y: 50, rotation: 90, scale: 0.3, flip: false, order: 2 },
      { family: "trait", x: 75, y: 55, rotation: 42, scale: 0.2, flip: false, order: 3 },
      { family: "trait", x: 71, y: 90, rotation: 0, scale: 1, flip: false, order: 4 },
      { family: "trait", x: 71, y: 85, rotation: 90, scale: 0.6, flip: false, order: 5, reverse: true},
    ],
  },
  {
    char: "n",
    steps: [
      { family: "trait", x: 87.3, y: 97.8, rotation: 0, scale: 0.5, flip: false, order: 1 },
      { family: "trait", x: 89.8, y: 90.3, rotation: 30, scale: 0.15, flip: false, order: 2, reverse: true },
      { family: "trait", x: 100, y: 86, rotation: 90, scale: 0.25, flip: false, order: 3, reverse: true },
      { family: "trait", x: 111, y: 89, rotation: 131, scale: 0.15, flip: false, order: 4, reverse: true },
      { family: "trait", x: 115, y: 103, rotation: 0, scale: 0.35, flip: false, order: 5 },
    ],
  },
  {
    char: "ñ",
    steps: [
      { family: "trait", x: 87.3, y: 97.8, rotation: 0, scale: 0.5, flip: false, order: 1 },
      { family: "trait", x: 89.8, y: 90.3, rotation: 30, scale: 0.15, flip: false, order: 2, reverse: true },
      { family: "trait", x: 100, y: 86, rotation: 90, scale: 0.25, flip: false, order: 3, reverse: true },
      { family: "trait", x: 111, y: 89, rotation: 131, scale: 0.15, flip: false, order: 4, reverse: true },
      { family: "trait", x: 115, y: 103, rotation: 0, scale: 0.35, flip: false, order: 5 },
      { family: "trait", x: 94, y: 70, rotation: 90, scale: 0.35, flip: false, order: 6 },
    ],
  },
  {
    char: "m",
    steps: [
      { family: "trait", x: 58, y: 96, rotation: 0, scale: 0.5, flip: false, order: 1 },
      { family: "trait", x: 61, y: 91, rotation: 36, scale: 0.15, flip: false, order: 2, reverse: true },
      { family: "trait", x: 72, y: 87, rotation: 90, scale: 0.25, flip: false, order: 3, reverse: true },
      { family: "trait", x: 83, y: 90, rotation: 131, scale: 0.15, flip: false, order: 4, reverse: true },
      { family: "trait", x: 87, y: 103, rotation: 0, scale: 0.3, flip: false, order: 5 },
      { family: "trait", x: 90, y: 90, rotation: 36, scale: 0.15, flip: false, order: 6, reverse: true },
      { family: "trait", x: 100.5, y: 86.3, rotation: 90, scale: 0.25, flip: false, order: 7, reverse: true },
      { family: "trait", x: 111.3, y: 89.3, rotation: 131, scale: 0.15, flip: false, order: 8 , reverse: true},
      { family: "trait", x: 115, y: 102, rotation: 0, scale: 0.32, flip: false, order: 9 },
    ],
  },
  {
    char: "s",
    steps: [
      { family: "trait", x: 105, y: 71, rotation: 90, scale: 0.4, flip: false, order: 1 },
      { family: "trait", x: 93, y: 84.3, rotation: 0, scale: 0.4, flip: false, order: 2 },
      { family: "trait", x: 105.3, y: 96.5, rotation: 90, scale: 0.4, flip: false, order: 3, reverse: true },
      { family: "trait", x: 117.3, y: 108.5, rotation: 0, scale: 0.4, flip: false, order: 4 },
      { family: "trait", x: 105, y: 120.5, rotation: 90, scale: 0.4, flip: false, order: 5 },
    ],
  },
  {
    char: "t",
    steps: [
      { family: "trait", x: 100, y: 85, rotation: 0, scale: 0.7, flip: false, order: 1 },
      { family: "trait", x: 101, y: 80, rotation: 90, scale: 0.4, flip: false, order: 2, reverse: true },
    ],
  },
  {
    char: "x",
    steps: [
      { family: "trait", x: 100.5, y: 89.3, rotation: 26, scale: 0.7, flip: false, order: 1 },
      { family: "trait", x: 99.5, y: 89, rotation: 154, scale: 0.7, flip: false, order: 2, reverse: true},
    ],
  },
  {
    char: "y",
    steps: [
      { family: "trait", x: 91, y: 64, rotation: 180, scale: 0.3, flip: false, order: 1, reverse: true },
      { family: "trait", x: 100, y: 74, rotation: 90, scale: 0.3, flip: false, order: 2, reverse: true },
      { family: "trait", x: 110, y: 76, rotation: 0, scale: 0.7, flip: false, order: 3 },
      { family: "trait", x: 99.5, y: 97.3, rotation: 90, scale: 0.35, flip: false, order: 4 },
    ],
  },
  {
    char: "z",
    steps: [
      { family: "trait", x: 104, y: 71, rotation: 90, scale: 0.35, flip: false, order: 1, reverse: true },
      { family: "trait", x: 102, y: 84, rotation: 45, scale: 0.6, flip: false, order: 2 },
      { family: "trait", x: 102, y: 97, rotation: 90, scale: 0.4, flip: false, order: 3, reverse: true},
    ],
  },
  {
    char: "v",
    steps: [
      { family: "trait", x: 95.8, y: 80.5, rotation: 157, scale: 0.35, flip: false, order: 1, reverse: true },
      { family: "trait", x: 104.5, y: 80.3, rotation: 25, scale: 0.35, flip: false, order: 2 },
    ],
  },
  {
    char: "w",
    steps: [
      { family: "trait", x: 85.5, y: 80.3, rotation: 157, scale: 0.35, flip: false, order: 1, reverse: true },
      { family: "trait", x: 94.5, y: 80, rotation: 25, scale: 0.35, flip: false, order: 2 },
      { family: "trait", x: 103, y: 81, rotation: 157, scale: 0.35, flip: false, order: 3, reverse: true },
      { family: "trait", x: 111.5, y: 80.8, rotation: 25, scale: 0.35, flip: false, order: 4 },
    ],
  },
  {
    char: "i",
    steps: [{ family: "trait", x: 100, y: 72, rotation: 0, scale: 0.6, flip: false, order: 1 }],
  },
  {
    char: "j",
    steps: [
      { family: "trait", x: 99.8, y: 62.8, rotation: 0, scale: 0.6, flip: false, order: 1 },
      { family: "trait", x: 96.5, y: 84.8, rotation: 40, scale: 0.15, flip: false, order: 2 },
      { family: "trait", x: 90, y: 88.8, rotation: 90, scale: 0.1, flip: false, order: 3 },
      { family: "trait", x: 84.5, y: 86, rotation: 146, scale: 0.1, flip: false, order: 4 },
    ],
  },
  {
    char: "h",
    steps: [
      { family: "trait", x: 92.3, y: 68.3, rotation: 0, scale: 0.7, flip: false, order: 1 },
      { family: "trait", x: 101, y: 70, rotation: 90, scale: 0.3, flip: false, order: 2, reverse: true},
      { family: "trait", x: 110, y: 80, rotation: 0, scale: 0.3, flip: false, order: 3 },
    ],
  },
  {
    char: "k",
    steps: [
      { family: "trait", x: 100.8, y: 71.3, rotation: 0, scale: 0.6, flip: false, order: 1 },
      { family: "trait", x: 106, y: 73, rotation: 48, scale: 0.2, flip: false, order: 2 },
      { family: "trait", x: 107.3, y: 83.3, rotation: 132, scale: 0.25, flip: false, order: 3, reverse: true },
    ],
  },
  {
    char: "l",
    steps: [{ family: "trait", x: 100, y: 71.3, rotation: 0, scale: 0.6, flip: false, order: 1 }],
  },
  {
    char: "u",
    steps: [
      { family: "trait", x: 90, y: 67.3, rotation: 0, scale: 0.4, flip: false, order: 1 },
      { family: "trait", x: 94, y: 84, rotation: -39, scale: 0.2, flip: false, order: 2 },
      { family: "trait", x: 104, y: 89.3, rotation: 90, scale: 0.2, flip: false, order: 3, reverse: true },
      { family: "trait", x: 111.5, y: 74.5, rotation: 0, scale: 0.65, flip: false, order: 4 },
    ],
  },
];

const DIGITAL_UPPERCASE_RAW: DigitalLetterInput[] = [
  {
    char: "D",
    steps: [
      { family: "trait", x: 70, y: 71, rotation: 0, scale: 0.65, flip: false, order: 1 },
      { family: "trait", x: 78, y: 51, rotation: 270, scale: 0.26, flip: false, order: 2 },
      { family: "trait", x: 90, y: 56, rotation: 142, scale: 0.2, flip: false, order: 3, reverse: true },
      { family: "trait", x: 94, y: 69, rotation: 0, scale: 0.25, flip: false, order: 4 },
      { family: "trait", x: 90, y: 83, rotation: 35, scale: 0.25, flip: false, order: 5 },
      { family: "trait", x: 78, y: 90, rotation: 90, scale: 0.25, flip: false, order: 6 },
    ],
  },
  {
    char: "F",
    steps: [
      { family: "trait", x: 71, y: 90, rotation: 0, scale: 1, flip: false, order: 1 },
      { family: "trait", x: 89, y: 60, rotation: 90, scale: 0.6, flip: false, order: 2, reverse: true},
      { family: "trait", x: 83, y: 90, rotation: 90, scale: 0.4, flip: false, order: 3, reverse: true },
    ],
  },
  {
    char: "E",
    steps: [
      { family: "trait", x: 71, y: 90, rotation: 0, scale: 1, flip: false, order: 1 },
      { family: "trait", x: 89.3, y: 120, rotation: 90, scale: 0.6, flip: false, order: 2, reverse: true },
      { family: "trait", x: 83, y: 90, rotation: 90, scale: 0.4, flip: false, order: 3, reverse: true},
      { family: "trait", x: 89, y: 60, rotation: 90, scale: 0.6, flip: false, order: 4, reverse: true },
    ],
  },
  {
    char: "I",
    steps: [
      { family: "trait", x: 88, y: 90.3, rotation: 0, scale: 1, flip: false, order: 1 },
      { family: "trait", x: 89, y: 60, rotation: 90, scale: 0.6, flip: false, order: 2, reverse: true },
      { family: "trait", x: 89, y: 121, rotation: 90, scale: 0.6, flip: false, order: 3, reverse: true },
    ],
  },
  {
    char: "H",
    steps: [
      { family: "trait", x: 80.8, y: 90, rotation: 0, scale: 1, flip: false, order: 1 },
      { family: "trait", x: 110.5, y: 89.8, rotation: 0, scale: 1, flip: false, order: 2 },
      { family: "trait", x: 96, y: 90, rotation: 90, scale: 0.47, flip: false, order: 3, reverse: true },
    ],
  },
  {
    char: "L",
    steps: [
      { family: "trait", x: 80.8, y: 90, rotation: 0, scale: 1, flip: false, order: 1 },
      { family: "trait", x: 96.3, y: 120, rotation: 90, scale: 0.5, flip: false, order: 2, reverse: true },
    ],
  },
  {
    char: "N",
    steps: [
      { family: "trait", x: 80.8, y: 90, rotation: 0, scale: 1, flip: false, order: 1 },
      { family: "trait", x: 94.8, y: 90, rotation: -25, scale: 1.1, flip: false, order: 2 },
      { family: "trait", x: 109.3, y: 90, rotation: 0, scale: 1, flip: false, order: 3 },
    ],
  },
  {
    char: "Ñ",
    steps: [
      { family: "trait", x: 80.8, y: 90, rotation: 0, scale: 1, flip: false, order: 1 },
      { family: "trait", x: 94.8, y: 90, rotation: -25, scale: 1.1, flip: false, order: 2 },
      { family: "trait", x: 109.3, y: 90, rotation: 0, scale: 1, flip: false, order: 3 },
      { family: "trait", x: 94, y: 40, rotation: 90, scale: 0.35, flip: false, order: 4 },
    ],
  },
  {
    char: "A",
    steps: [
      { family: "trait", x: 80.3, y: 94.8, rotation: 0, scale: 0.8, flip: false, order: 1 },
      { family: "trait", x: 85, y: 65.8, rotation: 44, scale: 0.22, flip: false, order: 2, reverse: true },
      { family: "trait", x: 99.8, y: 61, rotation: 90, scale: 0.33, flip: false, order: 3, reverse: true },
      { family: "trait", x: 115, y: 66, rotation: -44, scale: 0.22, flip: false, order: 4 },
      { family: "trait", x: 120, y: 95.5, rotation: 0, scale: 0.8, flip: false, order: 5 },    
      { family: "trait", x: 100, y: 95, rotation: 90, scale: 0.65, flip: false, order: 6, reverse: true },
    ],
  },
  {
    char: "C",
    steps: [
      { family: "trait", x: 101, y: 61, rotation: 90, scale: 0.35, flip: false, order: 1 },
      { family: "trait", x: 85, y: 65.8, rotation: 44, scale: 0.22, flip: false, order: 2 },
      { family: "trait", x: 80, y: 95, rotation: 0, scale: 0.8, flip: false, order: 3 },
      { family: "trait", x: 84.8, y: 124, rotation: -44, scale: 0.22, flip: false, order: 4 },
      { family: "trait", x: 100, y: 128.8, rotation: 90, scale: 0.35, flip: false, order: 5, reverse: true },
    ],
  },
  {
    char: "G",
    steps: [
      { family: "trait", x: 100.3, y: 66.8, rotation: 90, scale: 0.34, flip: false, order: 1 },
      { family: "trait", x: 85, y: 71.5, rotation: 44, scale: 0.22, flip: false, order: 2 },
      { family: "trait", x: 80, y: 98, rotation: 0, scale: 0.7, flip: false, order: 3 },
      { family: "trait", x: 84.8, y: 124, rotation: -44, scale: 0.22, flip: false, order: 4 },
      { family: "trait", x: 100, y: 128.8, rotation: 90, scale: 0.35, flip: false, order: 5, reverse: true },
      { family: "trait", x: 111, y: 119.5, rotation: 0, scale: 0.3, flip: false, order: 6, reverse: true },
      { family: "trait", x: 104.3, y: 110.5, rotation: 90, scale: 0.2, flip: false, order: 7 },
    ],
  },
  {
    char: "Q",
    steps: [
      { family: "trait", x: 100.3, y: 66.8, rotation: 90, scale: 0.34, flip: false, order: 1 },
      { family: "trait", x: 85, y: 71.5, rotation: 44, scale: 0.22, flip: false, order: 2 },
      { family: "trait", x: 80, y: 98, rotation: 0, scale: 0.7, flip: false, order: 3 },
      { family: "trait", x: 84.8, y: 124, rotation: -44, scale: 0.22, flip: false, order: 4 },
      { family: "trait", x: 100, y: 128.8, rotation: 90, scale: 0.35, flip: false, order: 5, reverse: true },
      { family: "trait", x: 115.5, y: 124, rotation: 44, scale: 0.22, flip: false, order: 6, reverse: true },
      { family: "trait", x: 120.5, y: 97.8, rotation: 0, scale: 0.7, flip: false, order: 7, reverse: true },
      { family: "trait", x: 115.8, y: 72, rotation: -45, scale: 0.22, flip: false, order: 8, reverse: true },
      { family: "trait", x: 117.3, y: 124.5, rotation: -36, scale: 0.35, flip: false, order: 9 },
    ],
  },
  {
    char: "O",
    steps: [
      { family: "trait", x: 100.3, y: 66.8, rotation: 90, scale: 0.34, flip: false, order: 1 },
      { family: "trait", x: 85, y: 71.5, rotation: 44, scale: 0.22, flip: false, order: 2 },
      { family: "trait", x: 80, y: 98, rotation: 0, scale: 0.7, flip: false, order: 3 },
      { family: "trait", x: 84.8, y: 124, rotation: -44, scale: 0.22, flip: false, order: 4 },
      { family: "trait", x: 100, y: 128.8, rotation: 90, scale: 0.35, flip: false, order: 5, reverse: true },
      { family: "trait", x: 115.5, y: 124, rotation: 44, scale: 0.22, flip: false, order: 6, reverse: true },
      { family: "trait", x: 120.5, y: 97.8, rotation: 0, scale: 0.7, flip: false, order: 7, reverse: true },
      { family: "trait", x: 115.8, y: 72, rotation: -45, scale: 0.22, flip: false, order: 8 , reverse: true},
    ],
  },
  {
    char: "U",
    steps: [
      { family: "trait", x: 80.5, y: 51.5, rotation: 0, scale: 0.6, flip: false, order: 1 },
      { family: "trait", x: 83, y: 74, rotation: -34, scale: 0.15, flip: false, order: 2 },
      { family: "trait", x: 95, y: 78, rotation: 90, scale: 0.3, flip: false, order: 3, reverse: true },
      { family: "trait", x: 107.3, y: 74.3, rotation: 42, scale: 0.15, flip: false, order: 4, reverse: true },
      { family: "trait", x: 110.3, y: 52.3, rotation: 0, scale: 0.6, flip: false, order: 5 },
    ],
  },
  {
    char: "V",
    steps: [
      { family: "trait", x: 79.8, y: 105.8, rotation: 0, scale: 0.8, flip: false, order: 1 },
      { family: "trait", x: 87.3, y: 123.8, rotation: 227, scale: 0.3, flip: false, order: 2 },
      { family: "trait", x: 94.8, y: 114.8, rotation: 17, scale: 0.1, flip: false, order: 3, reverse: true },
      { family: "trait", x: 95.8, y: 96.5, rotation: 0, scale: 0.5, flip: false, order: 4, reverse: true },
    ],
  },
  {
    char: "W",
    steps: [
      { family: "trait", x: 80.3, y: 105, rotation: 0, scale: 0.8, flip: false, order: 1 },
      { family: "trait", x: 88, y: 125, rotation: 238, scale: 0.3, flip: false, order: 2 },
      { family: "trait", x: 95.8, y: 116.8, rotation: 0, scale: 0.1, flip: false, order: 3 },
      { family: "trait", x: 102.8, y: 125, rotation: -53, scale: 0.25, flip: false, order: 4 },
      { family: "trait", x: 109.3, y: 105, rotation: 0, scale: 0.8, flip: false, order: 5 },
    ],
  },
  {
    char: "X",
    steps: [
      { family: "trait", x: 99.8, y: 89, rotation: -27, scale: 0.8, flip: false, order: 1 },
      { family: "trait", x: 100, y: 90, rotation: 206, scale: 0.8, flip: false, order: 2, reverse: true },
    ],
  },
  {
    char: "Y",
    steps: [
      { family: "trait", x: 90.5, y: 70, rotation: 0, scale: 0.3, flip: false, order: 1 },
      { family: "trait", x: 100, y: 79, rotation: 90, scale: 0.3, flip: false, order: 2, reverse: true },
      { family: "trait", x: 110, y: 84.8, rotation: 0, scale: 0.8, flip: false, order: 3 },
      { family: "trait", x: 99.5, y: 108.8, rotation: 90, scale: 0.32, flip: false, order: 4 },
    ],
  },
  {
    char: "Z",
    steps: [
      { family: "trait", x: 97.5, y: 70.3, rotation: 90, scale: 0.5, flip: false, order: 2, reverse: true },
      { family: "trait", x: 96.5, y: 90, rotation: 39, scale: 0.85, flip: false, order: 3 },
      { family: "trait", x: 95.8, y: 110, rotation: 90, scale: 0.5, flip: false, order: 4 , reverse: true},
    ],
  },
  {
    char: "K",
    steps: [
      { family: "trait", x: 80.3, y: 93.3, rotation: 0, scale: 0.85, flip: false, order: 2 },
      { family: "trait", x: 93.3, y: 86, rotation: 52, scale: 0.55, flip: false, order: 3},
      { family: "trait", x: 94, y: 105.8, rotation: 126, scale: 0.55, flip: false, order: 4 , reverse: true},
    ],
  },
  {
    char: "J",
    steps: [
      { family: "trait", x: 96.5, y: 61.3, rotation: 90, scale: 0.4, flip: false, order: 2, reverse: true },
      { family: "trait", x: 100, y: 79.8, rotation: 0, scale: 0.6, flip: false, order: 3 },
      { family: "trait", x: 96.3, y: 103.3, rotation: 35, scale: 0.2, flip: false, order: 4 },
      { family: "trait", x: 89.3, y: 108.5, rotation: 90, scale: 0.1, flip: false, order: 5 },
      { family: "trait", x: 83, y: 104.5, rotation: -38, scale: 0.15, flip: false, order: 6, reverse: true },
    ],
  },
  {
    char: "T",
    steps: [
      { family: "trait", x: 100.3, y: 72, rotation: 90, scale: 0.6, flip: false, order: 1, reverse: true },
      { family: "trait", x: 100, y: 91, rotation: 0, scale: 0.6, flip: false, order: 2 },
    ],
  },
  {
    char: "S",
    steps: [
      { family: "trait", x: 103, y: 60, rotation: 90, scale: 0.4, flip: false, order: 1 },
      { family: "trait", x: 90.8, y: 72.3, rotation: 0, scale: 0.4, flip: false, order: 2 },
      { family: "trait", x: 103.3, y: 84.5, rotation: 90, scale: 0.4, flip: false, order: 3, reverse: true },
      { family: "trait", x: 115.3, y: 96.5, rotation: 0, scale: 0.4, flip: false, order: 4 },
      { family: "trait", x: 103, y: 108.5, rotation: 90, scale: 0.4, flip: false, order: 5 },
    ],
  },
  {
    char: "P",
    steps: [
      { family: "trait", x: 91, y: 84, rotation: 0, scale: 0.8, flip: false, order: 1 },
      { family: "trait", x: 100, y: 60, rotation: 90, scale: 0.3, flip: false, order: 2 , reverse: true},
      { family: "trait", x: 111.8, y: 62.5, rotation: -39, scale: 0.1, flip: false, order: 3 },
      { family: "trait", x: 114, y: 73, rotation: 0, scale: 0.25, flip: false, order: 4 },
      { family: "trait", x: 112, y: 83, rotation: 35, scale: 0.1, flip: false, order: 5 },
      { family: "trait", x: 101, y: 86, rotation: 90, scale: 0.3, flip: false, order: 6 },
    ],
  },
  {
    char: "R",
    steps: [
      { family: "trait", x: 91, y: 84, rotation: 0, scale: 0.8, flip: false, order: 1 },
      { family: "trait", x: 100, y: 60, rotation: 90, scale: 0.3, flip: false, order: 2, reverse: true },
      { family: "trait", x: 111.8, y: 62.5, rotation: -39, scale: 0.1, flip: false, order: 3 },
      { family: "trait", x: 114, y: 73, rotation: 0, scale: 0.25, flip: false, order: 4 },
      { family: "trait", x: 110.5, y: 83.5, rotation: 51, scale: 0.15, flip: false, order: 5 },
      { family: "trait", x: 100, y: 86.3, rotation: 90, scale: 0.25, flip: false, order: 6 },
      { family: "trait", x: 105, y: 97.8, rotation: 131, scale: 0.6, flip: false, order: 7, reverse: true },
    ],
  },
  {
    char: "B",
    steps: [
      { family: "trait", x: 91, y: 87, rotation: 0, scale: 0.9, flip: false, order: 1 },
      { family: "trait", x: 100, y: 60, rotation: 90, scale: 0.3, flip: false, order: 2, reverse: true },
      { family: "trait", x: 111.8, y: 62.5, rotation: -39, scale: 0.1, flip: false, order: 3 },
      { family: "trait", x: 114, y: 73, rotation: 0, scale: 0.25, flip: false, order: 4 },
      { family: "trait", x: 110.5, y: 83.5, rotation: 51, scale: 0.15, flip: false, order: 5 },
      { family: "trait", x: 100, y: 86.3, rotation: 90, scale: 0.25, flip: false, order: 6 },
      { family: "trait", x: 110.5, y: 89.5, rotation: 131, scale: 0.15, flip: false, order: 7, reverse: true },
      { family: "trait", x: 114, y: 100.8, rotation: 0, scale: 0.25, flip: false, order: 8 },
      { family: "trait", x: 111.5, y: 111.5, rotation: 39, scale: 0.1, flip: false, order: 9 },
      { family: "trait", x: 100.3, y: 114, rotation: 90, scale: 0.3, flip: false, order: 10 },
    ],
  },
];

const DIGITAL_DIGITS_RAW: DigitalLetterInput[] = [
  {
    char: "0",
    steps: [
      { family: "trait", x: 100.3, y: 49.8, rotation: 90, scale: 0.3, flip: false, order: 1 },
      { family: "trait", x: 89, y: 52, rotation: 44, scale: 0.1, flip: false, order: 2 },
      { family: "trait", x: 86.8, y: 69.3, rotation: 0, scale: 0.5, flip: false, order: 3 },
      { family: "trait", x: 88.8, y: 87.5, rotation: -39, scale: 0.1, flip: false, order: 4 },
      { family: "trait", x: 100.3, y: 90, rotation: 90, scale: 0.3, flip: false, order: 5, reverse: true },
      { family: "trait", x: 111.3, y: 87.8, rotation: 44, scale: 0.1, flip: false, order: 6, reverse: true },
      { family: "trait", x: 113.8, y: 70.3, rotation: 0, scale: 0.5, flip: false, order: 7, reverse: true },
      { family: "trait", x: 111.8, y: 52.5, rotation: -39, scale: 0.1, flip: false, order: 8, reverse: true },
    ],
  },
  {
    char: "9",
    steps: [
      { family: "trait", x: 111.3, y: 52.5, rotation: -44, scale: 0.1, flip: false, order: 1, reverse: true },
      { family: "trait", x: 100, y: 50, rotation: 90, scale: 0.3, flip: false, order: 2 },
      { family: "trait", x: 89, y: 52, rotation: 44, scale: 0.1, flip: false, order: 3 },
      { family: "trait", x: 87, y: 60, rotation: 0, scale: 0.16, flip: false, order: 4 },
      { family: "trait", x: 89, y: 67.5, rotation: -39, scale: 0.1, flip: false, order: 5 },
      { family: "trait", x: 99.3, y: 70, rotation: 90, scale: 0.25, flip: false, order: 6, reverse: true },
      { family: "trait", x: 110, y: 67, rotation: 46, scale: 0.15, flip: false, order: 7, reverse: true },
      { family: "trait", x: 114, y: 70, rotation: 0, scale: 0.5, flip: false, order: 8 },
      { family: "trait", x: 112, y: 88, rotation: 44, scale: 0.1, flip: false, order: 9 },
      { family: "trait", x: 100, y: 90, rotation: 90, scale: 0.3, flip: false, order: 10 },
      { family: "trait", x: 88.8, y: 87.3, rotation: -39, scale: 0.1, flip: false, order: 11, reverse: true},
    ],
  },
  {
    char: "8",
    steps: [
      { family: "trait", x: 111, y: 52.8, rotation: -39, scale: 0.1, flip: false, order: 1, reverse: true },
      { family: "trait", x: 100, y: 49.8, rotation: 90, scale: 0.3, flip: false, order: 2 },
      { family: "trait", x: 89, y: 52, rotation: 44, scale: 0.1, flip: false, order: 3 },
      { family: "trait", x: 87, y: 60, rotation: 0, scale: 0.16, flip: false, order: 4 },
      { family: "trait", x: 89, y: 67.5, rotation: -39, scale: 0.1, flip: false, order: 5 },
      { family: "trait", x: 99.3, y: 70, rotation: 90, scale: 0.25, flip: false, order: 6, reverse: true },
      { family: "trait", x: 110.8, y: 73.5, rotation: -38, scale: 0.15, flip: false, order: 7 },
      { family: "trait", x: 113.3, y: 81, rotation: 0, scale: 0.13, flip: false, order: 8 },
      { family: "trait", x: 110, y: 88, rotation: 41, scale: 0.15, flip: false, order: 9 },
      { family: "trait", x: 99, y: 91.2, rotation: 90, scale: 0.25, flip: false, order: 10 },
      { family: "trait", x: 88.5, y: 88.5, rotation: -40, scale: 0.12, flip: false, order: 11, reverse: true },
      { family: "trait", x: 86, y: 81.3, rotation: 0, scale: 0.15, flip: false, order: 12, reverse: true },
      { family: "trait", x: 88, y: 73, rotation: 39, scale: 0.12, flip: false, order: 13 , reverse: true},
      { family: "trait", x: 110.3, y: 68.5, rotation: 49, scale: 0.1, flip: false, order: 14, reverse: true },
      { family: "trait", x: 113, y: 61, rotation: 0, scale: 0.17, flip: false, order: 15, reverse: true},
    ],
  },
  {
    char: "3",
    steps: [
      { family: "trait", x: 89, y: 52, rotation: 44, scale: 0.1, flip: false, order: 1, reverse: true },
      { family: "trait", x: 100, y: 49.8, rotation: 90, scale: 0.3, flip: false, order: 2, reverse: true },
      { family: "trait", x: 111, y: 53, rotation: -39, scale: 0.1, flip: false, order: 3 },
      { family: "trait", x: 113, y: 61, rotation: 0, scale: 0.17, flip: false, order: 4 },
      { family: "trait", x: 110.3, y: 68.5, rotation: 49, scale: 0.1, flip: false, order: 5 },
      { family: "trait", x: 99.3, y: 70, rotation: 90, scale: 0.25, flip: false, order: 6 },
      { family: "trait", x: 110.8, y: 73.5, rotation: -38, scale: 0.15, flip: false, order: 7 },
      { family: "trait", x: 113.3, y: 81, rotation: 0, scale: 0.13, flip: false, order: 8 },
      { family: "trait", x: 110, y: 88, rotation: 41, scale: 0.15, flip: false, order: 9 },
      { family: "trait", x: 99, y: 91.2, rotation: 90, scale: 0.25, flip: false, order: 10 },
      { family: "trait", x: 88.5, y: 88.5, rotation: -40, scale: 0.12, flip: false, order: 11, reverse: true },
    ],
  },
  {
    char: "6",
    steps: [
      { family: "trait", x: 111.5, y: 52.8, rotation: -39, scale: 0.1, flip: false, order: 1, reverse: true },
      { family: "trait", x: 100, y: 49.8, rotation: 90, scale: 0.3, flip: false, order: 2 },
      { family: "trait", x: 88.5, y: 52, rotation: 44, scale: 0.1, flip: false, order: 3 },
      { family: "trait", x: 86, y: 70, rotation: 0, scale: 0.5, flip: false, order: 4 },
      { family: "trait", x: 89, y: 88.8, rotation: -40, scale: 0.12, flip: false, order: 5 },
      { family: "trait", x: 99, y: 91.5, rotation: 90, scale: 0.25, flip: false, order: 6, reverse: true },
      { family: "trait", x: 110, y: 88, rotation: 41, scale: 0.15, flip: false, order: 7, reverse: true },
      { family: "trait", x: 113, y: 81, rotation: 0, scale: 0.13, flip: false, order: 8, reverse: true },
      { family: "trait", x: 110.3, y: 73.5, rotation: -38, scale: 0.15, flip: false, order: 9, reverse: true },
      { family: "trait", x: 99, y: 70, rotation: 90, scale: 0.25, flip: false, order: 10 },
      { family: "trait", x: 89, y: 72, rotation: 49, scale: 0.1, flip: false, order: 11 },
    ],
  },
  {
    char: "5",
    steps: [
      { family: "trait", x: 101, y: 54, rotation: 90, scale: 0.3, flip: false, order: 1 },
      { family: "trait", x: 91.5, y: 62, rotation: 0, scale: 0.25, flip: false, order: 2 },
      { family: "trait", x: 99, y: 70, rotation: 90, scale: 0.25, flip: false, order: 3, reverse: true},
      { family: "trait", x: 110, y: 74, rotation: -38, scale: 0.15, flip: false, order: 4 },
      { family: "trait", x: 112.8, y: 81.5, rotation: 0, scale: 0.13, flip: false, order: 5 },
      { family: "trait", x: 109.3, y: 89, rotation: 41, scale: 0.15, flip: false, order: 6 },
      { family: "trait", x: 98.8, y: 92.5, rotation: 90, scale: 0.25, flip: false, order: 7 },
    ],
  },
  {
    char: "2",
    steps: [
      { family: "trait", x: 88.5, y: 57.8, rotation: 41, scale: 0.15, flip: false, order: 1, reverse: true },
      { family: "trait", x: 101, y: 54, rotation: 90, scale: 0.3, flip: false, order: 2, reverse: true },
      { family: "trait", x: 113, y: 58, rotation: -38, scale: 0.15, flip: false, order: 3 },
      { family: "trait", x: 116, y: 66, rotation: 0, scale: 0.13, flip: false, order: 4 },
      { family: "trait", x: 100.3, y: 80, rotation: 57, scale: 0.6, flip: false, order: 5 },
      { family: "trait", x: 102, y: 90, rotation: 90, scale: 0.55, flip: false, order: 6, reverse: true },
    ],
  },
  {
    char: "1",
    steps: [{ family: "trait", x: 100, y: 70.3, rotation: 0, scale: 0.6, flip: false, order: 1 }],
  },
  {
    char: "7",
    steps: [
      { family: "trait", x: 90, y: 60, rotation: 90, scale: 0.3, flip: false, order: 1, reverse: true},
      { family: "trait", x: 99, y: 77, rotation: 0, scale: 0.55, flip: false, order: 2 },
    ],
  },
  {
    char: "4",
    steps: [
      { family: "trait", x: 92, y: 60.5, rotation: 0, scale: 0.3, flip: false, order: 1 },
      { family: "trait", x: 101, y: 70, rotation: 90, scale: 0.3, flip: false, order: 2, reverse: true },
      { family: "trait", x: 111, y: 68, rotation: 0, scale: 0.55, flip: false, order: 3 },
    ],
  },
];

const DIGITAL_LETTERS: LetterFormation[] = [...DIGITAL_RAW, ...DIGITAL_UPPERCASE_RAW].map(buildLetter);
const DIGITAL_DIGITS: LetterFormation[] = DIGITAL_DIGITS_RAW.map(buildLetter);

export const DIGITAL_VOWELS: LetterFormation[] = DIGITAL_LETTERS.filter(
  (l) => VOWEL_CHARS.has(l.char) && !isUppercase(l.char)
);
export const DIGITAL_CONSONANTS: LetterFormation[] = DIGITAL_LETTERS.filter(
  (l) => !VOWEL_CHARS.has(l.char) && !isUppercase(l.char)
);
export const DIGITAL_UPPERCASE: LetterFormation[] = DIGITAL_LETTERS.filter((l) => isUppercase(l.char));

export const DIGITAL_MAP: Map<string, LetterFormation> = new Map(
  [...DIGITAL_LETTERS, ...DIGITAL_DIGITS].map((l) => [l.char, l])
);
