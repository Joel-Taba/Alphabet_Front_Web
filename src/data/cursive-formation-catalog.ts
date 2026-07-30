/**
 * CURSIVE FORMATION CATALOG — Phase 2/3, style "cursive"
 *
 * Les lettres cursives ne sont pas décrites par des chemins SVG écrits à la
 * main (contrairement au style "script" de letter-formation-catalog.ts) :
 * elles sont composées d'une séquence de "tampons" (stamps) — des formes de
 * base génériques (trait, point, courbe, crochet, double-crochet) placées,
 * tournées, mises à l'échelle et éventuellement retournées dans le repère de
 * la lettre (grille 200×200, cohérente avec le style script).
 *
 * Ce fichier convertit ces tampons paramétrés en `LetterSignStep[]` (même
 * interface que le style script), afin que TOUT le reste de l'application
 * (animation, tracé, validation, mots, mots-croisés…) fonctionne à
 * l'identique, quel que soit le style actif.
 */

import type { LetterFormation, LetterSignStep } from "@/data/letter-formation-catalog";
import type { SignFamily } from "@/data/sign-exercise-catalog";
import { reverse } from "dns/promises";

// ─── Format d'entrée (tel que fourni) ─────────────────────────────────────────

type CursiveFamily = "trait" | "point" | "courbe" | "crochet" | "double-crochet";

interface CursiveStepInput {
  family: CursiveFamily;
  /** Variante (utilisée uniquement par "double-crochet" pour l'instant) */
  variant?: string;
  /** Position d'ancrage dans la grille 200×200 (centre du signe) */
  x: number;
  y: number;
  /** Rotation en degrés, sens horaire */
  rotation: number;
  /** Échelle appliquée au gabarit unitaire */
  scale: number;
  /** Symétrie horizontale (miroir) appliquée avant rotation */
  flip: boolean;
  /** Courbure 0→1 (trait/point : ignorée) */
  curvature?: number;
  /** Pour "double-crochet" : courbure indépendante de chaque moitié */
  curvatureTop?: number;
  curvatureBottom?: number;
  /** Ordre de traçage au sein de la lettre */
  order: number;
  /** Inverse le sens de tracé de ce signe (part de l'extrémité, termine à
   * l'origine) sans changer sa forme ni sa position. */
  reverse?: boolean;
}

interface CursiveLetterInput {
  char: string;
  steps: CursiveStepInput[];
}

// ─── Gabarit géométrique unitaire ─────────────────────────────────────────────
//
// Toutes les formules ci-dessous ont été retrouvées par rétro-ingénierie à
// partir d'exports réels de l'éditeur (pathD exacts fournis pour a, b, c, d,
// e, g, h, i, j, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z), puis vérifiées
// en recalculant les mêmes pathD et en confirmant une correspondance au
// centième d'unité près. Chaque famille est échantillonnée en un tableau de
// points LOCAUX (rotation 0°, sans miroir, échelle 1, centrés sur l'ancre),
// que `transform()` retourne/met à l'échelle/tourne/translate ensuite.

/** Rayon canonique partagé par toutes les familles (confirmé sur ~10 exemples). */
const R = 30;
/** Rayon canonique du point (confirmé sur 2 exemples : "i" et "j"). */
const POINT_R = 8;

const SEGMENTS = 28;

type LocalPoint = [number, number];

/** TRAIT — segment vertical du haut (0,-R) au bas (0,+R). */
function sampleTrait(): LocalPoint[] {
  return [
    [0, -R],
    [0, R],
  ];
}

/** POINT — petit cercle presque fermé, centré sur l'ancre. */
function samplePoint(): LocalPoint[] {
  const pts: LocalPoint[] = [];
  const n = 20;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2 * 0.96;
    pts.push([POINT_R * Math.cos(a), POINT_R * Math.sin(a)]);
  }
  return pts;
}

/**
 * COURBE — cercle de rayon R centré sur l'ancre, ouvert à l'est. La courbure
 * fixe la largeur de l'ouverture ("gap") : gap = 180°×(1-courbure).
 *  - curvature = 0 → gap = 180° (simple demi-cercle).
 *  - curvature = 1 → gap ≈ 0° (cercle presque complet, ex. le "o").
 * Tracé dans le sens horaire (angle croissant), en partant du bas du "gap".
 */
function sampleCourbe(curvature: number): LocalPoint[] {
  const c = Math.max(0, Math.min(1, curvature));
  const gap = Math.PI * (1 - c);
  const start = gap / 2;
  const sweep = Math.PI * 2 - gap;
  const pts: LocalPoint[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS;
    const angle = start + t * sweep;
    pts.push([R * Math.cos(angle), R * Math.sin(angle)]);
  }
  return pts;
}

/**
 * CROCHET — tige droite du haut (0,-R) jusqu'à (0, R-rayonCrochet), puis un
 * crochet tangent à la tige qui balaie vers l'est.
 *  - rayonCrochet = 26 - 22×courbure
 *  - balayage = 90°×(1+courbure)
 * (formules vérifiées sur 4 exports indépendants : a, l, u×2)
 */
function sampleCrochet(curvature: number): LocalPoint[] {
  const c = Math.max(0, Math.min(1, curvature));
  const hookR = 26 - 22 * c;
  const lineEndY = R - hookR;
  const pts: LocalPoint[] = [
    [0, -R],
    [0, lineEndY],
  ];
  const center: LocalPoint = [hookR, lineEndY];
  const sweepDeg = 90 * (1 + c);
  const segs = Math.max(6, Math.round((SEGMENTS * sweepDeg) / 180));
  for (let i = 1; i <= segs; i++) {
    const t = i / segs;
    const angle = ((180 - t * sweepDeg) * Math.PI) / 180;
    pts.push([center[0] + hookR * Math.cos(angle), center[1] + hookR * Math.sin(angle)]);
  }
  return pts;
}

/**
 * DOUBLE-CROCHET — un crochet en haut (bombant à l'est, "haut-droite") suivi
 * d'une tige droite puis d'un crochet en bas (bombant à l'ouest,
 * "bas-gauche"), chaque moitié suivant les MÊMES formules que CROCHET mais
 * avec un rayon canonique moitié moindre (13 - 11×courbure) puisque les deux
 * crochets se partagent la même portée verticale ±R.
 * (formules vérifiées exactement sur l'export réel de "h", étape 3.)
 */
function sampleDoubleCrochet(curvatureTop: number, curvatureBottom: number): LocalPoint[] {
  const ct = Math.max(0, Math.min(1, curvatureTop));
  const cb = Math.max(0, Math.min(1, curvatureBottom));
  const topR = 13 - 11 * ct;
  const botR = 13 - 11 * cb;
  const topCenter: LocalPoint = [topR, -R + topR];
  const botCenter: LocalPoint = [-botR, R - botR];
  const topSweepDeg = 90 * (1 + ct);
  const botSweepDeg = 90 * (1 + cb);

  const pts: LocalPoint[] = [];
  const topSegs = Math.max(4, Math.round((SEGMENTS * topSweepDeg) / 360));
  for (let i = 0; i <= topSegs; i++) {
    const t = i / topSegs;
    const angle = ((180 + topSweepDeg - t * topSweepDeg) * Math.PI) / 180;
    pts.push([topCenter[0] + topR * Math.cos(angle), topCenter[1] + topR * Math.sin(angle)]);
  }
  pts.push([0, R - botR]);
  const botSegs = Math.max(4, Math.round((SEGMENTS * botSweepDeg) / 360));
  for (let i = 1; i <= botSegs; i++) {
    const t = i / botSegs;
    const angle = (t * botSweepDeg * Math.PI) / 180;
    pts.push([botCenter[0] + botR * Math.cos(angle), botCenter[1] + botR * Math.sin(angle)]);
  }
  return pts;
}

function localPoints(step: CursiveStepInput): LocalPoint[] {
  switch (step.family) {
    case "trait":
      return sampleTrait();
    case "point":
      return samplePoint();
    case "courbe":
      return sampleCourbe(step.curvature ?? 0.5);
    case "crochet":
      return sampleCrochet(step.curvature ?? 0.5);
    case "double-crochet":
      return sampleDoubleCrochet(step.curvatureTop ?? 0.5, step.curvatureBottom ?? 0.5);
  }
}

/** Applique retournement → échelle → rotation → translation à un point local. */
function transform(p: LocalPoint, step: CursiveStepInput): LocalPoint {
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

// ─── Normalisation de taille ───────────────────────────────────────────────────
//
// Les valeurs brutes de l'éditeur ne visent pas une taille de lettre
// uniforme (ex. "a" à l'échelle 0.35 contre "c"/"d"/"e" à l'échelle 1) :
// chaque lettre est donc redimensionnée après coup pour occuper une boîte
// englobante standard selon sa zone, alignée sur la même ligne de base
// (149, comme dans le style script), centrée horizontalement sur x=100.

const ZONE_TARGET: Record<LetterFormation["zone"], [number, number]> = {
  hampe: [35, 149],
  jambe: [77, 165],
  corps: [77, 149],
};
/** Majuscules avec une véritable descendante (ex. "G") : plus de hauteur totale
 * pour ne pas écraser le corps de la lettre en comprimant la queue dedans. */
const UPPERCASE_TARGET_TALL: [number, number] = [35, 165];

function normalizeLetterPoints(
  stepsPoints: LocalPoint[][],
  target: [number, number]
): LocalPoint[][] {
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
    pts.map(
      ([x, y]) =>
        [100 + (x - centerX) * scaleFactor, targetTop + (y - minY) * scaleFactor] as LocalPoint
    )
  );
}

// ─── Couleurs & familles de sortie (compatibles avec le style script) ────────

const OUTPUT_COLOR: Record<CursiveFamily, string> = {
  trait: "#4A3B2A",
  courbe: "#E05252",
  crochet: "#4A90E2",
  point: "#4A3B2A",
  "double-crochet": "#4A90E2",
};

/** "double-crochet" n'existe pas comme famille de signe de base autonome :
 * on le range sous "crochet" (même couleur/pictogramme), seule sa géométrie
 * de tracé diffère, via sa propre fonction d'échantillonnage ci-dessus. */
function outputFamily(f: CursiveFamily): SignFamily {
  return f === "double-crochet" ? "crochet" : f;
}

const FAMILY_LABEL: Record<CursiveFamily, { fr: string; en: string; es: string }> = {
  trait: { fr: "trait", en: "line", es: "trazo" },
  courbe: { fr: "courbe", en: "curve", es: "curva" },
  crochet: { fr: "crochet", en: "hook", es: "gancho" },
  point: { fr: "point", en: "dot", es: "punto" },
  "double-crochet": { fr: "boucle de liaison", en: "connecting loop", es: "bucle de enlace" },
};

/** Article espagnol genré ("el"/"la") pour chaque famille, seule "courbe" étant féminine. */
const FAMILY_ARTICLE_ES: Record<CursiveFamily, string> = {
  trait: "el",
  courbe: "la",
  crochet: "el",
  point: "el",
  "double-crochet": "el",
};

const HAMPE = new Set(["b", "d", "f", "h", "k", "l", "t"]);
const JAMBE = new Set(["g", "j", "p", "q", "y", "z"]);
/** Majuscules dotées d'une réelle descendante dans l'export (queue nette
 * sous la ligne de base) — actuellement seule "G" est concernée. */
const UPPERCASE_WITH_DESCENDER = new Set(["G"]);

function isUppercase(char: string): boolean {
  return char.length === 1 && char === char.toUpperCase() && char !== char.toLowerCase();
}

function zoneFor(char: string): LetterFormation["zone"] {
  if (isUppercase(char)) return "hampe";
  if (HAMPE.has(char)) return "hampe";
  if (JAMBE.has(char)) return "jambe";
  return "corps";
}

function normalizationTargetFor(char: string, zone: LetterFormation["zone"]): [number, number] {
  if (isUppercase(char) && UPPERCASE_WITH_DESCENDER.has(char)) return UPPERCASE_TARGET_TALL;
  return ZONE_TARGET[zone];
}

const VOWEL_CHARS = new Set(["a", "e", "i", "o", "u"]);

function familySequenceLabel(steps: CursiveStepInput[], lang: "fr" | "en" | "es"): string {
  const names = [...steps].sort((a, b) => a.order - b.order).map((s) => FAMILY_LABEL[s.family][lang]);
  if (names.length <= 1) return names[0];
  if (lang === "fr") return `${names.slice(0, -1).join(", ")} puis ${names[names.length - 1]}`;
  if (lang === "es") return `${names.slice(0, -1).join(", ")} y luego ${names[names.length - 1]}`;
  return `${names.slice(0, -1).join(", ")} then ${names[names.length - 1]}`;
}

function buildLetter(input: CursiveLetterInput): LetterFormation {
  const orderedSteps = [...input.steps].sort((a, b) => a.order - b.order);
  const zone = zoneFor(input.char);

  const rawStepsPoints = orderedSteps.map((step) => localPoints(step).map((p) => transform(p, step)));
  const target = normalizationTargetFor(input.char, zone);
  const normalizedStepsPoints = normalizeLetterPoints(rawStepsPoints, target);

  const steps: LetterSignStep[] = orderedSteps.map((step, i) => {
    const pts = step.reverse ? [...normalizedStepsPoints[i]].reverse() : normalizedStepsPoints[i];
    const pathD = toPathD(pts);
    const [startX, startY] = pts[0];
    return {
      family: outputFamily(step.family),
      variant: step.variant ?? `cursive-${step.family}`,
      pathD,
      startXY: [Number(startX.toFixed(2)), Number(startY.toFixed(2))],
      strokeColor: OUTPUT_COLOR[step.family],
      description: {
        fr: `Trace le ${FAMILY_LABEL[step.family].fr} n°${step.order}`,
        en: `Trace the ${FAMILY_LABEL[step.family].en} #${step.order}`,
        es: `Traza ${FAMILY_ARTICLE_ES[step.family]} ${FAMILY_LABEL[step.family].es} n.º${step.order}`,
      },
    };
  });

  return {
    char: input.char,
    name: { fr: `${input.char} cursif`, en: `cursive ${input.char}`, es: `${input.char} cursiva` },
    category: isUppercase(input.char) ? "majuscule" : VOWEL_CHARS.has(input.char) ? "voyelle" : "consonne",
    zone,
    steps,
    consigne: {
      fr: `En cursive, la lettre "${input.char}" s'écrit d'un geste lié : ${familySequenceLabel(orderedSteps, "fr")}.`,
      en: `In cursive, the letter "${input.char}" is written in one connected gesture: ${familySequenceLabel(orderedSteps, "en")}.`,
      es: `En cursiva, la letra "${input.char}" se escribe en un solo gesto: ${familySequenceLabel(orderedSteps, "es")}.`,
    },
  };
}

// ─── Lettres "littérales" (export réel direct, sans passer par les tampons) ──
//
// Certaines lettres ont été fournies directement sous forme de chemin SVG
// final (issu de l'éditeur, avec ses propres courbes de Bézier/arcs — pas
// nécessairement réductible aux formules "tampon" ci-dessus). Pour ces
// lettres, on stocke le pathD tel quel (comme le fait déjà le style script),
// sans passer par localPoints()/transform()/normalizeLetterPoints() : ce sont
// des géométries finales, déjà à la bonne échelle et déjà positionnées dans
// la grille 200×200.

interface CursiveLiteralStepInput {
  family: CursiveFamily;
  pathD: string;
}

interface CursiveLiteralLetterInput {
  char: string;
  zone: LetterFormation["zone"];
  steps: CursiveLiteralStepInput[];
}

function parseStartXY(pathD: string): [number, number] {
  const match = pathD.match(/^M\s*(-?[\d.]+)[ ,]+(-?[\d.]+)/);
  if (!match) return [0, 0];
  return [Number(match[1]), Number(match[2])];
}

function buildLiteralLetter(input: CursiveLiteralLetterInput): LetterFormation {
  const steps: LetterSignStep[] = input.steps.map((step, i) => {
    const order = i + 1;
    return {
      family: outputFamily(step.family),
      variant: `cursive-${step.family}`,
      pathD: step.pathD,
      startXY: parseStartXY(step.pathD),
      strokeColor: OUTPUT_COLOR[step.family],
      description: {
        fr: `Trace le ${FAMILY_LABEL[step.family].fr} n°${order}`,
        en: `Trace the ${FAMILY_LABEL[step.family].en} #${order}`,
        es: `Traza ${FAMILY_ARTICLE_ES[step.family]} ${FAMILY_LABEL[step.family].es} n.º${order}`,
      },
    };
  });

  return {
    char: input.char,
    name: { fr: `${input.char} cursif`, en: `cursive ${input.char}`, es: `${input.char} cursiva` },
    category: isUppercase(input.char) ? "majuscule" : VOWEL_CHARS.has(input.char) ? "voyelle" : "consonne",
    zone: input.zone,
    steps,
    consigne: {
      fr: `En cursive, la lettre "${input.char}" s'écrit d'un geste lié : ${input.steps
        .map((s) => FAMILY_LABEL[s.family].fr)
        .join(", ")}.`,
      en: `In cursive, the letter "${input.char}" is written in one connected gesture: ${input.steps
        .map((s) => FAMILY_LABEL[s.family].en)
        .join(", ")}.`,
      es: `En cursiva, la letra "${input.char}" se escribe en un solo gesto: ${input.steps
        .map((s) => FAMILY_LABEL[s.family].es)
        .join(", ")}.`,
    },
  };
}

const CURSIVE_LITERAL_RAW: CursiveLiteralLetterInput[] = [
  {
    char: "b",
    zone: "hampe",
    steps: [
      {
        family: "crochet",
        pathD:
          "M 69.32 124.79 L 93.79 53.73 L 94.21 52.24 L 94.47 50.71 L 94.56 49.15 L 94.48 47.60 L 94.22 46.07 L 93.80 44.57 L 93.22 43.13 L 92.49 41.76 L 91.61 40.48 L 90.59 39.31 L 89.45 38.25 L 88.20 37.33 L 86.86 36.54 L 85.44 35.91 L 83.96 35.44 L 82.44 35.14 L 80.89 35.00 L 79.34 35.03 L 77.80 35.24 L 76.29 35.61 L 74.83 36.15 L 73.44 36.84 L 72.13 37.68 L 70.92 38.66 L 69.34 40.11",
      },
      {
        family: "crochet",
        pathD:
          "M 69.34 40.11 L 69.34 136.95 L 69.41 138.32 L 69.65 139.67 L 70.03 140.98 L 70.56 142.24 L 71.23 143.43 L 72.03 144.54 L 72.95 145.55 L 73.98 146.46 L 75.10 147.23 L 76.31 147.88 L 77.58 148.39 L 78.90 148.74 L 80.25 148.95 L 81.62 149.00 L 82.98 148.90 L 84.33 148.64 L 85.63 148.23 L 86.88 147.68 L 88.06 146.98 L 89.16 146.16 L 90.15 145.22 L 91.03 144.18 L 91.79 143.04 L 92.41 141.82 L 92.89 140.54 L 93.22 139.21 L 93.44 137.86 L 93.58 136.52 L 93.65 135.18 L 93.64 133.84 L 93.55 132.50 L 93.39 131.16 L 93.16 129.82 L 92.88 128.48 L 92.68 127.14 L 92.57 125.80 L 92.57 124.79",
      },
      { family: "trait", pathD: "M 92.57 124.79 L 108.68 124.79" },
    ],
  },
  {
    char: "g",
    zone: "jambe",
    steps: [
      { family: "courbe", pathD: "M 113.44 52.31 A 27.30 27.30 0 1 0 113.44 83.20" },
      { family: "trait", pathD: "M 113.71 43.55 L 113.71 177.95" },
      { family: "crochet", pathD: "M 113.74 178.19 A 17.67 17.67 0 0 1 90.32 153.84 L 123.35 94.26" },
    ],
  },
  {
    char: "j",
    zone: "jambe",
    steps: [
      { family: "trait", pathD: "M 94.14 79.54 L 113.86 42.46" },
      { family: "trait", pathD: "M 113.71 43.55 L 113.71 177.95" },
      { family: "crochet", pathD: "M 113.74 178.19 A 17.67 17.67 0 0 1 90.32 153.84 L 123.35 94.26" },
      { family: "point", pathD: "M 114.13 18.57 A 6.16 6.16 0 1 0 114.20 18.57" },
    ],
  },
  {
    char: "m",
    zone: "corps",
    steps: [
      { family: "courbe", pathD: "M 21 77 C 21 67.6 28.6 60 38 60 C 47.4 60 55 67.6 55 77 L 55 149" },
      { family: "courbe", pathD: "M 55 77 C 55 67.6 62.6 60 72 60 C 81.4 60 89 67.6 89 77 L 89 149" },
      {
        family: "courbe",
        pathD:
          "M 89 77 C 89 67.6 96.6 60 106 60 C 115.4 60 123 67.6 123 77 L 123 140 C 123 146 126 149 130 149.3 C 133 150 138 148 139 145",
      },
    ],
  },
  {
    char: "n",
    zone: "corps",
    steps: [
      { family: "courbe", pathD: "M 55 77 C 55 67.6 62.6 60 72 60 C 81.4 60 89 67.6 89 77 L 89 149" },
      {
        family: "courbe",
        pathD:
          "M 89 77 C 89 67.6 96.6 60 106 60 C 115.4 60 123 67.6 123 77 L 123 140 C 123 146 126 149 130 149.3 C 133 150 138 148 139 145",
      },
    ],
  },
  {
    char: "ñ",
    zone: "corps",
    steps: [
      { family: "courbe", pathD: "M 55 77 C 55 67.6 62.6 60 72 60 C 81.4 60 89 67.6 89 77 L 89 149" },
      {
        family: "courbe",
        pathD:
          "M 89 77 C 89 67.6 96.6 60 106 60 C 115.4 60 123 67.6 123 77 L 123 140 C 123 146 126 149 130 149.3 C 133 150 138 148 139 145",
      },
      {
        family: "double-crochet",
        pathD: "M 99.50 75.55 A 4.55 4.55 0 0 0 94.95 71.00 L 89.00 71.00 L 83.05 71.00 A 4.55 4.55 0 0 1 78.50 66.45",
      },
    ],
  },
  {
    char: "f",
    zone: "hampe",
    steps: [
      { family: "crochet", pathD: "M 80.64 89.93 L 110.35 59.17 A 14.25 14.25 0.00 0 0 99.85 35.03" },
      { family: "crochet", pathD: "M 111.54 40.31 A 11.12 11.12 0.00 0 0 90.95 46.10 L 90.95 92.00" },
      { family: "crochet", pathD: "M 90.95 92.00 L 90.95 134.76 A 14.25 14.25 0.00 0 0 115.27 144.83" },
      { family: "crochet", pathD: "M 103.37 148.73 A 14.25 14.25 0.00 0 0 116.34 125.80 L 90.02 92.09" },
      { family: "crochet", pathD: "M 91.11 102.90 A 5.34 5.34 0.00 0 0 100.31 106.54 L 111.45 94.99" },
    ],
  },
  {
    char: "k",
    zone: "hampe",
    steps: [
      { family: "crochet", pathD: "M 83.89 104.42 L 105.30 51.45 A 11.96 11.96 0.00 0 0 86.23 38.05" },
      { family: "trait", pathD: "M 86.20 38.72 L 86.20 145.04" },
      { family: "courbe", pathD: "M 87.46 106.44 A 15.95 15.95 0.00 1 1 87.46 132.24" },
      { family: "crochet", pathD: "M 87.54 132.99 A 4.38 4.38 0.00 0 1 95.55 130.56 L 105.00 144.54" },
      { family: "crochet", pathD: "M 97.38 133.68 L 106.52 146.74 A 5.32 5.32 0.00 0 0 116.11 144.61" },
    ],
  },
  {
    char: "p",
    zone: "jambe",
    steps: [
      { family: "trait", pathD: "M 83 100 L 101 77" },
      { family: "trait", pathD: "M 101 68 L 101 180" },
      {
        family: "courbe",
        pathD:
          "M 101 95 C 101 80 110 72 123 75 C 126 76 129 79 130 82 C 131 86 131 90 131 94 C 131 100 133 103 136 103 C 136 103 140 104 142 98",
      },
    ],
  },
  {
    char: "r",
    zone: "corps",
    steps: [
      { family: "trait", pathD: "M 47 100.34 L 67 50.42" },
      { family: "crochet", pathD: "M 61.26 50.40 A 5.12 5.12 0 0 0 61.62 58.60 L 105.30 58.60" },
      { family: "crochet", pathD: "M 105.28 58.04 L 105.28 105.57 A 10.67 10.67 0 0 0 125.21 109.49" },
    ],
  },
  {
    char: "s",
    zone: "corps",
    steps: [
      { family: "trait", pathD: "M 71 124 L 107 64" },
      { family: "crochet", pathD: "M 108 63 L 129 113 A 18 18 0 0 1 106 136" },
    ],
  },
  {
    char: "t",
    zone: "hampe",
    steps: [
      {
        family: "crochet",
        pathD: "M 97 27 L 97 140 C 97 146 100 149 105 149.3 C 107 150 115 149 119 145",
      },
      { family: "trait", pathD: "M 97 51 L 117 51" },
    ],
  },
  {
    char: "u",
    zone: "corps",
    steps: [
      {
        family: "crochet",
        pathD: "M 68 60 L 68 118 C 68 140 84 150 102 150 C 120 150 132 140 132 118",
      },
      {
        family: "crochet",
        pathD: "M 132 60 L 132 140 C 133 146 137 149 141 149.6 C 145 150 149 148 150 145",
      },
    ],
  },
  {
    char: "q",
    zone: "jambe",
    steps: [
      {
        family: "courbe",
        pathD:
          "M 125 75.3 C 115.4 63.5 99.4 59 85 64.1 C 70.6 69.2 61 82.8 61 98 C 61 113.2 70.6 126.8 85 131.9 C 99.4 137 115.4 132.5 125 120",
      },
      { family: "trait", pathD: "M 125 62 L 125 195" },
      { family: "trait", pathD: "M 125 133 L 145 110" },
    ],
  },
  {
    char: "l",
    zone: "hampe",
    steps: [
      { family: "crochet", pathD: "M 86 115 L 107 36 A 11.3 11.3 0 0 0 86 28" },
      { family: "crochet", pathD: "M 86 28.5 L 86 133 A 12 12 0 0 0 110 135" },
    ],
  },
];

// ─── Données fournies (export réel de l'éditeur) ─────────────────────────────
// Minuscules cursives disponibles pour l'instant : a→z sauf f et k, qui
// arriveront dans une prochaine itération, tout comme les majuscules — voir
// getLetterFormation qui bascule automatiquement sur le style script pour
// tout caractère absent d'ici.

const CURSIVE_RAW: CursiveLetterInput[] = [
  {
    char: "a",
    steps: [
      { family: "courbe", x: 84.3, y: 137.8, rotation: 0, scale: 0.35, flip: false, curvature: 0.5, order: 1, reverse: true },
      { family: "crochet", x: 93, y: 139, rotation: 0, scale: 0.35, flip: false, curvature: 0.78, order: 2 },
    ],
  },
  {
    char: "b",
    steps: [
      { family: "crochet", x: 100.4, y: 112.8, rotation: 199, scale: 0.82, flip: false, curvature: 0.75, order: 1 },
      { family: "crochet", x: 92.4, y: 119.4, rotation: 0, scale: 1, flip: false, curvature: 0.88, order: 2 },
      { family: "trait", x: 115.7, y: 142.5, rotation: 90, scale: 0.35, flip: false, order: 3, reverse: true },
    ],
  },
  {
    char: "c",
    steps: [{ family: "courbe", x: 97, y: 119, rotation: 0, scale: 1, flip: false, curvature: 0.5, order: 1, reverse: true }],
  },
  {
    char: "d",
    steps: [
      { family: "courbe", x: 97, y: 119, rotation: 0, scale: 1, flip: false, curvature: 0.5, order: 1, reverse: true },
      { family: "crochet", x: 118.7, y: 103.6, rotation: 0, scale: 1.5, flip: false, curvature: 0.78, order: 2 },
    ],
  },
  {
    char: "e",
    steps: [
      { family: "crochet", x: 94, y: 114.7, rotation: 269, scale: 0.9, flip: false, curvature: 0.68, order: 1 },
      { family: "courbe", x: 97, y: 119, rotation: 0, scale: 1, flip: false, curvature: 0.49, order: 2, reverse: true },
    ],
  },
  {
    char: "g",
    steps: [
      { family: "courbe", x: 92, y: 91, rotation: 0, scale: 0.6, flip: false, curvature: 0.78, order: 1, reverse: true },
      { family: "trait", x: 109, y: 107.3, rotation: 0, scale: 1.1, flip: false, order: 2 },
      { family: "crochet", x: 104.7, y: 114, rotation: 33, scale: 0.85, flip: false, curvature: 0.67, order: 3, reverse: true },
    ],
  },
  {
    char: "h",
    steps: [
      { family: "crochet", x: 108.6, y: 110.7, rotation: 202, scale: 0.7, flip: false, curvature: 0.68, order: 1 },
      { family: "trait", x: 100.8, y: 118.8, rotation: 0, scale: 1, flip: false, order: 2 },
      {
        family: "double-crochet",
        variant: "hd-bg",
        x: 107.7,
        y: 139,
        rotation: 0,
        scale: 0.35,
        flip: true,
        curvatureTop: 0.26,
        curvatureBottom: 0.64,
        order: 3,
      },
    ],
  },
  {
    char: "i",
    steps: [
      { family: "crochet", x: 97.7, y: 127.7, rotation: 0, scale: 0.7, flip: false, curvature: 0.7, order: 1 },
      { family: "point", x: 97.7, y: 93, rotation: 0, scale: 0.5, flip: false, order: 2, reverse: true },
    ],
  },
  {
    char: "j",
    steps: [
      { family: "crochet", x: 97.7, y: 127.7, rotation: 0, scale: 0.7, flip: true, curvature: 0.7, order: 2 },
      { family: "trait", x: 91.3, y: 115.1, rotation: 216, scale: 0.35, flip: false, order: 1 },
      { family: "point", x: 102, y: 93, rotation: 0, scale: 0.5, flip: false, order: 3, reverse: true },
    ],
  },
  {
    char: "l",
    steps: [
      { family: "crochet", x: 88, y: 124.4, rotation: 0, scale: 0.8, flip: false, curvature: 0.7, order: 2 },
      { family: "crochet", x: 94.7, y: 118.7, rotation: 201, scale: 0.6, flip: false, curvature: 0.65, order: 1 },
    ],
  },
  {
    char: "m",
    steps: [
      { family: "crochet", x: 83, y: 128, rotation: 181, scale: 0.7, flip: false, curvature: 0.7, order: 1, reverse: true },
      { family: "crochet", x: 95.3, y: 128.2, rotation: 180, scale: 0.7, flip: false, curvature: 0.75, order: 2, reverse: true },
      {
        family: "double-crochet",
        variant: "hd-bg",
        x: 104.6,
        y: 129.3,
        rotation: 0,
        scale: 0.7,
        flip: true,
        curvatureTop: 0.24,
        curvatureBottom: 0.5,
        order: 3,
      },
    ],
  },
  {
    char: "n",
    steps: [
      { family: "crochet", x: 83, y: 128, rotation: 181, scale: 0.7, flip: false, curvature: 0.82, order: 1, reverse: true },
      {
        family: "double-crochet",
        variant: "hd-bg",
        x: 92.3,
        y: 128.4,
        rotation: 0,
        scale: 0.7,
        flip: true,
        curvatureTop: 0.35,
        curvatureBottom: 0.5,
        order: 2,
      },
    ],
  },
  {
    char: "o",
    steps: [
      { family: "courbe", x: 103.6, y: 125.1, rotation: -90, scale: 0.8, flip: false, curvature: 1, order: 1, reverse: true },
      { family: "crochet", x: 117.3, y: 118.9, rotation: 101, scale: 0.66, flip: true, curvature: 0.59, order: 2, reverse: true },
    ],
  },
  {
    char: "p",
    steps: [
      { family: "trait", x: 91.3, y: 103.3, rotation: 217, scale: 0.42, flip: false, order: 1 },
      { family: "trait", x: 99.5, y: 119.2, rotation: 0, scale: 1, flip: false, order: 2 },
      {
        family: "double-crochet",
        variant: "hd-bg",
        x: 106.1,
        y: 107.7,
        rotation: 0,
        scale: 0.53,
        flip: true,
        curvatureTop: 0.54,
        curvatureBottom: 0.32,
        order: 3,
      },
    ],
  },
  {
    char: "q",
    steps: [
      { family: "courbe", x: 86, y: 103, rotation: 0, scale: 0.55, flip: false, curvature: 0.64, order: 1, reverse: true },
      { family: "trait", x: 99.5, y: 119.2, rotation: 0, scale: 1, flip: false, order: 2 },
      { family: "crochet", x: 107.7, y: 118, rotation: 75, scale: 0.25, flip: true, curvature: 0.43, order: 3, reverse: true },
    ],
  },
  {
    char: "r",
    steps: [
      { family: "trait", x: 70, y: 132, rotation: 21, scale: 0.3, flip: false, order: 1, reverse: true },
      { family: "crochet", x: 82.3, y: 129.3, rotation: 90, scale: 0.35, flip: true, curvature: 0.8, order: 2, reverse: true },
      { family: "crochet", x: 92.7, y: 138.2, rotation: 0, scale: 0.36, flip: false, curvature: 0.76, order: 3 },
    ],
  },
  {
    char: "s",
    steps: [
      { family: "trait", x: 73, y: 140.7, rotation: 21, scale: 0.3, flip: false, order: 1, reverse: true },
      { family: "crochet", x: 83.7, y: 139.1, rotation: -44, scale: 0.35, flip: true, curvature: 0.69, order: 2 },
    ],
  },
  {
    char: "t",
    steps: [
      { family: "crochet", x: 85.4, y: 119, rotation: 0, scale: 1, flip: false, curvature: 0.65, order: 1 },
      { family: "trait", x: 86, y: 110, rotation: 90, scale: 0.6, flip: false, order: 2, reverse: true },
    ],
  },
  {
    char: "u",
    steps: [
      { family: "crochet", x: 78.3, y: 122, rotation: 0, scale: 0.9, flip: false, curvature: 0.65, order: 1 },
      { family: "crochet", x: 98.3, y: 122, rotation: 0, scale: 0.9, flip: false, curvature: 0.81, order: 2 },
    ],
  },
  {
    char: "v",
    steps: [
      { family: "crochet", x: 82.6, y: 120.6, rotation: 180, scale: 0.9, flip: false, curvature: 0.75, order: 1, reverse: true },
      { family: "crochet", x: 96, y: 124, rotation: 0, scale: 0.9, flip: true, curvature: 0.83, order: 2, reverse: true },
      { family: "courbe", x: 107.7, y: 97, rotation: 268, scale: 0.4, flip: false, curvature: 0, order: 3, reverse: true },
    ],
  },
  {
    char: "w",
    steps: [
      {
        family: "double-crochet",
        variant: "hd-bg",
        x: 73.9,
        y: 119.3,
        rotation: 0,
        scale: 1,
        flip: true,
        curvatureTop: 0.5,
        curvatureBottom: 0.5,
        order: 1,
      },
      { family: "crochet", x: 86.6, y: 119.6, rotation: 0, scale: 1, flip: false, curvature: 0.8, order: 2 },
      { family: "crochet", x: 103.4, y: 119.8, rotation: 0, scale: 1, flip: true, curvature: 0.8, order: 3, reverse: true },
      { family: "courbe", x: 112, y: 92.3, rotation: -74, scale: 0.3, flip: false, curvature: 0, order: 4, reverse: true },
    ],
  },
  {
    char: "x",
    steps: [
      { family: "courbe", x: 68.6, y: 121.3, rotation: 0, scale: 0.9, flip: true, curvature: 0.3, order: 1, reverse: true },
      { family: "courbe", x: 122.4, y: 121.5, rotation: 0, scale: 0.9, flip: false, curvature: 0.3, order: 2, reverse: true },
    ],
  },
  {
    char: "y",
    steps: [
      {
        family: "double-crochet",
        variant: "hd-bg",
        x: 85.3,
        y: 105,
        rotation: 0,
        scale: 0.5,
        flip: true,
        curvatureTop: 0.4,
        curvatureBottom: 0.38,
        order: 1,
      },
      { family: "trait", x: 93, y: 119, rotation: 0, scale: 0.95, flip: false, order: 2 },
      { family: "crochet", x: 89, y: 134, rotation: 21, scale: 0.47, flip: false, curvature: 0.78, order: 3, reverse: true },
    ],
  },
  {
    char: "z",
    steps: [
      { family: "trait", x: 75.1, y: 101.5, rotation: 37, scale: 0.25, flip: false, order: 1 },
      { family: "crochet", x: 87.4, y: 101.1, rotation: 86, scale: 0.27, flip: true, curvature: 0.5, order: 2 },
      { family: "trait", x: 91.2, y: 105.7, rotation: 43, scale: 0.21, flip: false, order: 3 },
      {
        family: "double-crochet",
        variant: "hd-bg",
        x: 94.3,
        y: 126.4,
        rotation: 0,
        scale: 0.52,
        flip: false,
        curvatureTop: 0.23,
        curvatureBottom: 0.5,
        order: 4,
      },
      { family: "trait", x: 92, y: 126.8, rotation: 23, scale: 0.48, flip: false, order: 5 },
    ],
  },
];

// ─── Majuscules cursives (export réel de l'éditeur, alphabet complet) ────────

const CURSIVE_UPPERCASE_RAW: CursiveLetterInput[] = [
  {
    char: "A",
    steps: [
      { family: "crochet", x: 90.4, y: 124, rotation: 20, scale: 1, flip: true, curvature: 0.75, order: 1, reverse: true },
      { family: "crochet", x: 111, y: 124.2, rotation: -20, scale: 1, flip: false, curvature: 0.75, order: 2 },
      { family: "trait", x: 100.6, y: 127.5, rotation: 90, scale: 0.38, flip: false, order: 3 },
    ],
  },
  {
    char: "B",
    steps: [
      {
        family: "double-crochet",
        variant: "hd-bg",
        x: 91.1,
        y: 121.9,
        rotation: 0,
        scale: 0.9,
        flip: false,
        curvatureTop: 0,
        curvatureBottom: 0.62,
        order: 1,
      },
      { family: "courbe", x: 98.8, y: 108.1, rotation: 162, scale: 0.45, flip: false, curvature: 0.49, order: 2 },
      { family: "courbe", x: 97.7, y: 135.2, rotation: 200, scale: 0.46, flip: false, curvature: 0.45, order: 3 },
    ],
  },
  {
    char: "C",
    steps: [
      { family: "courbe", x: 100.5, y: 93.3, rotation: -60, scale: 0.5, flip: false, curvature: 0, order: 1, reverse: true },
      { family: "courbe", x: 98, y: 122, rotation: 0, scale: 0.9, flip: false, curvature: 0.4, order: 2, reverse: true },
    ],
  },
  {
    char: "D",
    steps: [
      {
        family: "double-crochet",
        variant: "hd-bg",
        x: 97.3,
        y: 122.3,
        rotation: 0,
        scale: 0.9,
        flip: false,
        curvatureTop: 0.32,
        curvatureBottom: 0.48,
        order: 1,
      },
      { family: "courbe", x: 103, y: 119.1, rotation: 5, scale: 0.8, flip: true, curvature: 0.37, order: 2, reverse: true },
    ],
  },
  {
    char: "E",
    steps: [
      { family: "courbe", x: 100.3, y: 89.3, rotation: -51, scale: 0.29, flip: false, curvature: 0, order: 1, reverse: true },
      { family: "courbe", x: 97.8, y: 105.7, rotation: 14, scale: 0.5, flip: false, curvature: 0.28, order: 2, reverse: true },
      { family: "courbe", x: 99.4, y: 135.3, rotation: -18, scale: 0.5, flip: false, curvature: 0.23, order: 3, reverse: true },
    ],
  },
  {
    char: "F",
    steps: [
      { family: "crochet", x: 101, y: 124.8, rotation: 0, scale: 0.8, flip: true, curvature: 0.7, order: 1 },
      { family: "crochet", x: 108.3, y: 100.7, rotation: 92, scale: 0.8, flip: false, curvature: 0.7, order: 2, reverse: true },
      { family: "trait", x: 112.6, y: 125.2, rotation: 91, scale: 0.4, flip: false, order: 3 },
    ],
  },
  {
    char: "G",
    steps: [
      { family: "courbe", x: 97.4, y: 121.3, rotation: 0, scale: 0.9, flip: false, curvature: 0.5, order: 2, reverse: true },
      { family: "courbe", x: 105.6, y: 95.6, rotation: -55, scale: 0.41, flip: false, curvature: 0, order: 1, reverse: true },
      { family: "trait", x: 116.4, y: 149.9, rotation: 0, scale: 0.5, flip: false, order: 3 },
      { family: "crochet", x: 115.1, y: 148.7, rotation: 38, scale: 0.51, flip: false, curvature: 0.7, order: 4, reverse: true },
    ],
  },
  {
    char: "H",
    steps: [
      { family: "trait", x: 71, y: 120, rotation: 0, scale: 0.8, flip: false, order: 2 },
      { family: "crochet", x: 62.7, y: 91.3, rotation: 118, scale: 0.32, flip: false, curvature: 0.8, order: 1, reverse: true },
      { family: "crochet", x: 72, y: 124, rotation: 42, scale: 0.65, flip: false, curvature: 0.7, order: 3, reverse: true },
      { family: "crochet", x: 86.7, y: 107.4, rotation: 221, scale: 0.64, flip: false, curvature: 0.8, order: 4 },
      { family: "crochet", x: 86.8, y: 107.4, rotation: 179, scale: 0.64, flip: true, curvature: 0.8, order: 5, reverse: true },
      { family: "crochet", x: 87, y: 132.7, rotation: 0, scale: 0.4, flip: false, curvature: 0.71, order: 6 },
    ],
  },
  {
    char: "I",
    steps: [
      { family: "crochet", x: 103, y: 100, rotation: 92, scale: 0.73, flip: false, curvature: 0.64, order: 1, reverse: true },
      { family: "crochet", x: 104, y: 124, rotation: 0, scale: 0.8, flip: true, curvature: 0.65, order: 2 },
    ],
  },
  {
    char: "J",
    steps: [
      { family: "crochet", x: 104.3, y: 100, rotation: 92, scale: 0.6, flip: false, curvature: 0.64, order: 1, reverse: true },
      { family: "crochet", x: 105.4, y: 127.4, rotation: 45, scale: 0.7, flip: false, curvature: 0.69, order: 3, reverse: true },
      { family: "trait", x: 104, y: 124.5, rotation: 0, scale: 0.8, flip: false, order: 2 },
    ],
  },
  {
    char: "K",
    steps: [
      { family: "crochet", x: 96.8, y: 124.9, rotation: 0, scale: 0.8, flip: true, curvature: 0.72, order: 2 },
      { family: "crochet", x: 92.8, y: 95.6, rotation: 144, scale: 0.22, flip: false, curvature: 0.5, order: 1, reverse: true },
      { family: "trait", x: 102.4, y: 123, rotation: 90, scale: 0.16, flip: false, order: 3, reverse: true },
      { family: "crochet", x: 113.8, y: 107.5, rotation: 201, scale: 0.5, flip: true, curvature: 0.7, order: 4, reverse: true },
      { family: "crochet", x: 112.5, y: 137, rotation: -16, scale: 0.5, flip: false, curvature: 0.7, order: 5 },
    ],
  },
  {
    char: "L",
    steps: [
      { family: "courbe", x: 100.3, y: 92.3, rotation: 269, scale: 0.6, flip: false, curvature: 0, order: 1, reverse: true },
      { family: "crochet", x: 101.1, y: 110.5, rotation: 180, scale: 0.8, flip: true, curvature: 0.65, order: 2, reverse: true },
      { family: "crochet", x: 101.1, y: 137, rotation: 0, scale: 0.4, flip: true, curvature: 0.85, order: 3 },
      { family: "crochet", x: 111.1, y: 147, rotation: -90, scale: 0.5, flip: false, curvature: 0.82, order: 4 },
    ],
  },
  {
    char: "M",
    steps: [
      { family: "crochet", x: 84.1, y: 126.6, rotation: 0, scale: 0.8, flip: true, curvature: 0.76, order: 1, reverse: true },
      { family: "trait", x: 92.2, y: 116.2, rotation: -28, scale: 0.5, flip: false, order: 2 },
      { family: "trait", x: 105.9, y: 115.4, rotation: 26, scale: 0.5, flip: false, order: 3, reverse: true },
      { family: "crochet", x: 112.6, y: 125.7, rotation: 0, scale: 0.8, flip: false, curvature: 0.75, order: 4 },
    ],
  },
  {
    char: "N",
    steps: [
      { family: "crochet", x: 84.1, y: 126.6, rotation: 0, scale: 0.8, flip: true, curvature: 0.76, order: 1, reverse: true },
      { family: "trait", x: 95.7, y: 126.1, rotation: -26, scale: 0.86, flip: false, order: 2 },
      { family: "crochet", x: 106.8, y: 124.7, rotation: 180, scale: 0.8, flip: true, curvature: 0.76, order: 3 },
    ],
  },
  {
    char: "Ñ",
    steps: [
      { family: "crochet", x: 84.1, y: 126.6, rotation: 0, scale: 0.8, flip: true, curvature: 0.76, order: 1, reverse: true },
      { family: "trait", x: 95.7, y: 126.1, rotation: -26, scale: 0.86, flip: false, order: 2 },
      { family: "crochet", x: 106.8, y: 124.7, rotation: 180, scale: 0.8, flip: true, curvature: 0.76, order: 3 },
      {
        family: "double-crochet",
        variant: "hd-bg",
        x: 89,
        y: 71,
        rotation: 90,
        scale: 0.35,
        flip: false,
        curvatureTop: 0,
        curvatureBottom: 0,
        order: 4,
      },
    ],
  },
  {
    char: "O",
    steps: [
      { family: "courbe", x: 94.5, y: 124.5, rotation: -56, scale: 0.8, flip: false, curvature: 0.8, order: 1, reverse: true },
      { family: "courbe", x: 107, y: 116.6, rotation: 59, scale: 0.3, flip: false, curvature: 0, order: 2, reverse: true },
    ],
  },
  {
    char: "P",
    steps: [
      { family: "crochet", x: 102, y: 122, rotation: 0, scale: 0.9, flip: true, curvature: 0.66, order: 1 },
      { family: "courbe", x: 106.7, y: 110.7, rotation: 148, scale: 0.6, flip: false, curvature: 0.52, order: 2 },
    ],
  },
  {
    char: "Q",
    steps: [
      { family: "courbe", x: 94, y: 124.4, rotation: -77, scale: 0.8, flip: false, curvature: 0.54, order: 1, reverse: true },
      { family: "courbe", x: 104.5, y: 115.9, rotation: 63, scale: 0.35, flip: false, curvature: 0.05, order: 2, reverse: true },
      { family: "trait", x: 112, y: 143, rotation: -34, scale: 0.3, flip: false, order: 3 },
    ],
  },
  {
    char: "R",
    steps: [
      { family: "crochet", x: 92.9, y: 124.6, rotation: 0, scale: 0.8, flip: true, curvature: 0.7, order: 1 },
      { family: "courbe", x: 97.4, y: 115.5, rotation: 147, scale: 0.55, flip: false, curvature: 0.53, order: 2 },
      { family: "crochet", x: 106.9, y: 141, rotation: -31, scale: 0.35, flip: false, curvature: 0.71, order: 3 },
    ],
  },
  {
    char: "S",
    steps: [
      { family: "courbe", x: 82, y: 105, rotation: 227, scale: 0.31, flip: false, curvature: 0.43, order: 1, reverse: true },
      {
        family: "double-crochet",
        variant: "hd-bg",
        x: 91,
        y: 121,
        rotation: -35,
        scale: 0.85,
        flip: false,
        curvatureTop: 0.61,
        curvatureBottom: 0.51,
        order: 2,
      },
    ],
  },
  {
    char: "T",
    steps: [
      { family: "crochet", x: 93.2, y: 101.2, rotation: 90, scale: 0.7, flip: false, curvature: 0.78, order: 1, reverse: true },
      { family: "crochet", x: 94, y: 126, rotation: 0, scale: 0.8, flip: false, curvature: 0.71, order: 2 },
      { family: "trait", x: 94, y: 122, rotation: 90, scale: 0.4, flip: false, order: 3, reverse: true },
    ],
  },
  {
    char: "U",
    steps: [
      {
        family: "double-crochet",
        variant: "hd-bg",
        x: 83.9,
        y: 126.3,
        rotation: 0,
        scale: 0.75,
        flip: true,
        curvatureTop: 0.72,
        curvatureBottom: 0.28,
        order: 1,
      },
      { family: "crochet", x: 94.4, y: 126.9, rotation: 0, scale: 0.75, flip: false, curvature: 0.81, order: 2 },
    ],
  },
  {
    char: "V",
    steps: [
      { family: "crochet", x: 101.5, y: 125.9, rotation: 162, scale: 0.8, flip: false, curvature: 0.5, order: 1, reverse: true },
      { family: "trait", x: 115.7, y: 126.3, rotation: 16, scale: 0.77, flip: false, order: 2, reverse: true },
      { family: "trait", x: 128.2, y: 103.7, rotation: 90, scale: 0.2, flip: false, order: 3, reverse: true },
    ],
  },
  {
    char: "W",
    steps: [
      { family: "crochet", x: 73, y: 125.1, rotation: 166, scale: 0.8, flip: false, curvature: 0.5, order: 1, reverse: true },
      { family: "trait", x: 83.7, y: 129.6, rotation: 14, scale: 0.65, flip: false, order: 2 },
      { family: "trait", x: 94.8, y: 129.9, rotation: -16, scale: 0.65, flip: false, order: 3 },
      { family: "trait", x: 105.4, y: 129.5, rotation: 13, scale: 0.65, flip: false, order: 4 },
      { family: "trait", x: 114.5, y: 110.7, rotation: 90, scale: 0.15, flip: false, order: 5, reverse: true },
    ],
  },
  {
    char: "X",
    steps: [
      { family: "courbe", x: 76.2, y: 124.8, rotation: 0, scale: 0.8, flip: true, curvature: 0.3, order: 1, reverse: true },
      { family: "courbe", x: 124.6, y: 124.9, rotation: 0, scale: 0.8, flip: false, curvature: 0.3, order: 2, reverse: true },
    ],
  },
  {
    char: "Y",
    steps: [
      { family: "crochet", x: 73.6, y: 102.5, rotation: 0, scale: 0.4, flip: false, curvature: 0.35, order: 1 },
      { family: "trait", x: 85.8, y: 120.1, rotation: 0, scale: 1, flip: false, order: 2 },
      { family: "crochet", x: 85.1, y: 124.3, rotation: 40, scale: 0.8, flip: false, curvature: 0.69, order: 3, reverse: true },
    ],
  },
  {
    char: "Z",
    steps: [
      { family: "crochet", x: 94.3, y: 104.4, rotation: 75, scale: 0.5, flip: true, curvature: 0.71, order: 1, reverse: true },
      { family: "trait", x: 93.3, y: 124.1, rotation: 33, scale: 0.95, flip: false, order: 2 },
      { family: "crochet", x: 92.9, y: 143.7, rotation: 253, scale: 0.5, flip: true, curvature: 0.75, order: 3 },
      { family: "trait", x: 94, y: 123.6, rotation: 270, scale: 0.3, flip: false, order: 4 },
    ],
  },
];

const CURSIVE_LETTERS_PROCEDURAL: LetterFormation[] = [...CURSIVE_RAW, ...CURSIVE_UPPERCASE_RAW].map(buildLetter);
const CURSIVE_LITERAL_CHARS = new Set(CURSIVE_LITERAL_RAW.map((l) => l.char));
const CURSIVE_LETTERS: LetterFormation[] = [
  ...CURSIVE_LETTERS_PROCEDURAL.filter((l) => !CURSIVE_LITERAL_CHARS.has(l.char)),
  ...CURSIVE_LITERAL_RAW.map(buildLiteralLetter),
];

export const CURSIVE_VOWELS: LetterFormation[] = CURSIVE_LETTERS.filter(
  (l) => VOWEL_CHARS.has(l.char) && !isUppercase(l.char)
);
export const CURSIVE_CONSONANTS: LetterFormation[] = CURSIVE_LETTERS.filter(
  (l) => !VOWEL_CHARS.has(l.char) && !isUppercase(l.char)
);
export const CURSIVE_UPPERCASE: LetterFormation[] = CURSIVE_LETTERS.filter((l) => isUppercase(l.char));

export const CURSIVE_MAP: Map<string, LetterFormation> = new Map(CURSIVE_LETTERS.map((l) => [l.char, l]));
