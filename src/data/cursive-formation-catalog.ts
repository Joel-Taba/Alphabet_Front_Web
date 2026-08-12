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
  /** Ordre de superposition explicite (plus grand = dessiné au-dessus) —
   * voir `LetterSignStep.zIndex`. Absent : priorité par défaut de la
   * famille (courbe < crochet < trait < point). N'affecte pas `order`. */
  zIndex?: number;
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
      zIndex: step.zIndex,
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
  /** Surcharge optionnelle de la couleur (sinon couleur de la famille). */
  strokeColor?: string;
  /** Variante explicite (ex. "hd-bg" pour un double-crochet) ; sinon un
   * identifiant générique `cursive-<famille>` est utilisé. */
  variant?: string;
  /** Ordre de superposition explicite (plus grand = dessiné au-dessus) —
   * voir `LetterSignStep.zIndex`. Absent : priorité par défaut de la
   * famille (courbe < crochet < trait < point). */
  zIndex?: number;
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
      variant: step.variant ?? `cursive-${step.family}`,
      pathD: step.pathD,
      startXY: parseStartXY(step.pathD),
      strokeColor: step.strokeColor ?? OUTPUT_COLOR[step.family],
      zIndex: step.zIndex,
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
    char: "a",
    zone: "corps",
    steps: [
      { family: "trait", pathD: "M 50 150 L 65 130" },
      {
        family: "courbe",
        pathD:
          "M 125 90.4 C 118.2 81.9 107.9 77 97 77 C 77.1 77 61 93.1 61 113 C 61 132.9 77.1 149 97 149 C 107.9 149 118.2 144.1 125 135.6",
      },
      {
        family: "crochet",
        pathD: "M 125 80 L 125 140 C 126 146 129 148 133 148 C 137 148 140 144 140 144",
      },
    ],
  },
  {
    char: "b",
    zone: "hampe",
    steps: [
      {
        family: "crochet",
        pathD:
          "M 60 150 L 69.32 124.79 L 93.79 53.73 L 94.21 52.24 L 94.47 50.71 L 94.56 49.15 L 94.48 47.60 L 94.22 46.07 L 93.80 44.57 L 93.22 43.13 L 92.49 41.76 L 91.61 40.48 L 90.59 39.31 L 89.45 38.25 L 88.20 37.33 L 86.86 36.54 L 85.44 35.91 L 83.96 35.44 L 82.44 35.14 L 80.89 35.00 L 79.34 35.03 L 77.80 35.24 L 76.29 35.61 L 74.83 36.15 L 73.44 36.84 L 72.13 37.68 L 70.92 38.66 L 69.34 40.11",
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
    char: "d",
    zone: "hampe",
    steps: [
      { family: "trait", pathD: "M 53.29 149.00 L 67.20 130.46" },
      {
        family: "courbe",
        pathD:
          "M 122.80 93.67 C 113.91 82.73 99.08 78.56 85.73 83.29 C 72.39 88.01 63.49 100.62 63.49 114.71 C 63.49 128.80 72.39 141.40 85.73 146.13 C 99.08 150.85 113.91 146.68 122.80 135.75",
      },
      {
        family: "crochet",
        pathD: "M 122.80 35.00 L 122.80 139.73 C 123.73 145.29 126.51 147.15 130.22 147.15 C 133.93 147.15 136.71 143.44 136.71 143.44",
      },
    ],
  },
  {
    char: "g",
    zone: "jambe",
    steps: [
      { family: "trait", pathD: "M 71.71 108.22 L 76.12 101.92" },
      { family: "courbe", pathD: "M 105.39 84.47 A 17.20 17.20 0 1 0 105.39 103.94" },
      { family: "trait", pathD: "M 105.56 78.95 L 105.56 163.65" },
      { family: "crochet", pathD: "M 105.58 163.80 A 11.14 11.14 0 0 1 90.82 148.46 L 111.64 110.91" },
    ],
  },
  {
    char: "j",
    zone: "jambe",
    steps: [
      { family: "trait", pathD: "M 99.41 110.22 L 110.15 90.02" },
      { family: "trait", pathD: "M 110.07 90.61 L 110.07 163.83" },
      { family: "crochet", pathD: "M 110.09 163.96 A 9.63 9.63 0 0 1 97.33 150.70 L 115.33 118.24" },
      { family: "point", pathD: "M 110.30 69.00 A 3.36 3.36 0 1 0 110.34 69.00" },
    ],
  },
  {
    char: "m",
    zone: "corps",
    steps: [
      { family: "courbe", pathD: "M 32.50 90.69 C 32.50 83.12 38.62 77.00 46.19 77.00 C 53.76 77.00 59.87 83.12 59.87 90.69 L 59.87 148.65" },
      { family: "courbe", pathD: "M 59.87 90.69 C 59.87 83.12 65.99 77.00 73.56 77.00 C 81.13 77.00 87.25 83.12 87.25 90.69 L 87.25 148.65" },
      {
        family: "courbe",
        pathD:
          "M 87.25 90.69 C 87.25 83.12 93.36 77.00 100.93 77.00 C 108.50 77.00 114.62 83.12 114.62 90.69 L 114.62 141.40 C 114.62 146.23 117.03 148.65 120.25 148.89 C 122.67 149.45 126.69 147.84 127.50 145.43",
      },
    ],
  },
  {
    char: "n",
    zone: "corps",
    steps: [
      { family: "courbe", pathD: "M 63.19 90.69 C 63.19 83.12 69.31 77.00 76.87 77.00 C 84.44 77.00 90.56 83.12 90.56 90.69 L 90.56 148.65" },
      {
        family: "courbe",
        pathD:
          "M 90.56 90.69 C 90.56 83.12 96.68 77.00 104.25 77.00 C 111.81 77.00 117.93 83.12 117.93 90.69 L 117.93 141.40 C 117.93 146.23 120.35 148.65 123.57 148.89 C 125.98 149.45 130.01 147.84 130.81 145.43",
      },
    ],
  },
  {
    char: "ñ",
    zone: "corps",
    steps: [
      { family: "courbe", pathD: "M 63.19 90.69 C 63.19 83.12 69.31 77.00 76.87 77.00 C 84.44 77.00 90.56 83.12 90.56 90.69 L 90.56 148.65" },
      {
        family: "courbe",
        pathD:
          "M 90.56 90.69 C 90.56 83.12 96.68 77.00 104.25 77.00 C 111.81 77.00 117.93 83.12 117.93 90.69 L 117.93 141.40 C 117.93 146.23 120.35 148.65 123.57 148.89 C 125.98 149.45 130.01 147.84 130.81 145.43",
      },
      {
        family: "double-crochet",
        pathD: "M 99.01 89.52 A 3.66 3.66 0 0 0 95.35 85.86 L 90.56 85.86 L 85.77 85.86 A 3.66 3.66 0 0 1 82.11 82.19",
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
      { family: "trait", pathD: "M 89.32 102.14 L 103.46 84.07" },
      { family: "trait", pathD: "M 103.46 77.00 L 103.46 165.00" },
      {
        family: "courbe",
        pathD:
          "M 103.46 98.21 C 103.46 86.43 110.54 80.14 120.75 82.50 C 123.11 83.29 125.46 85.64 126.25 88.00 C 127.04 91.14 127.04 94.29 127.04 97.43 C 127.04 102.14 128.61 104.50 130.96 104.50 C 130.96 104.50 134.11 105.29 135.68 100.57",
      },
    ],
  },
  {
    char: "r",
    zone: "corps",
    steps: [
      { family: "trait", pathD: "M 42.51 132.67 L 64.81 77.02" },
      { family: "crochet", pathD: "M 58.41 77.00 A 5.71 5.71 0 0 0 58.81 86.14 L 107.50 86.14" },
      { family: "crochet", pathD: "M 107.48 85.52 L 107.48 138.50 A 11.89 11.89 0 0 0 129.70 142.87" },
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
      { family: "trait", pathD: "M 76.61 149.00 L 97.00 121.20" },
      {
        family: "crochet",
        pathD: "M 97.00 35.00 L 97.00 139.73 C 97.00 145.29 99.78 148.07 104.41 148.35 C 106.27 149.00 113.68 148.07 117.39 144.37",
      },
      { family: "trait", pathD: "M 78.46 57.24 L 115.54 57.24" },
    ],
  },
  {
    char: "u",
    zone: "corps",
    steps: [
      { family: "trait", pathD: "M 69.00 149.00 L 77.00 133.00" },
      {
        family: "crochet",
        pathD: "M 75.40 77.00 L 75.40 123.40 C 75.40 141.00 88.20 149.00 102.60 149.00 C 117.00 149.00 126.60 141.00 126.60 123.40",
      },
      {
        family: "crochet",
        pathD: "M 126.60 77.00 L 126.60 141.00 C 127.40 145.80 130.60 148.20 133.80 148.68 C 137.00 149.00 140.20 147.40 141.00 145.00",
      },
    ],
  },
  {
    char: "l",
    zone: "hampe",
    steps: [
      { family: "crochet", pathD: "M 77.40 148.05 L 86.58 120.52 L 105.85 48.01 A 10.37 10.37 0 0 0 86.58 40.67" },
      { family: "crochet", pathD: "M 86.58 41.13 L 86.58 137.04 A 11.01 11.01 0 0 0 108.60 138.87" },
    ],
  },
  {
    char: "o",
    zone: "corps",
    steps: [
      { family: "trait", pathD: "M 62.17 119.13 L 69.06 103.81" },
      { family: "courbe", pathD: "M 100.47 77.00 A 32.17 36.00 0 1 0 100.54 77.00" },
      { family: "crochet", pathD: "M 115.79 82.36 C 113.49 85.43 112.72 88.49 114.26 93.09 C 115.79 96.15 117.32 99.21 121.91 100.74 C 126.51 102.28 129.57 99.98 131.03 99.98 L 141.83 95.38" },
    ],
  },
  {
    char: "v",
    zone: "corps",
    steps: [
      {
        family: "crochet",
        pathD:
          "M 57.99 81.79 L 58.36 81.01 L 58.80 80.29 L 59.33 79.63 L 59.93 79.02 L 60.59 78.48 L 61.31 78.01 L 62.07 77.64 L 62.87 77.34 L 63.70 77.13 L 64.54 77.02 L 65.39 77.00 L 66.25 77.07 L 67.08 77.24 L 67.90 77.50 L 68.68 77.84 L 69.41 78.27 L 70.09 78.78 L 70.72 79.36 L 71.28 80.00 L 71.76 80.70 L 72.17 81.45 L 72.49 82.24 L 72.72 83.06 L 72.86 83.90 L 72.91 84.75 L 72.87 132.69",
      },
      { family: "courbe", pathD: "M 72.87 132.69 C 72.87 132.69 72.87 137.03 73.59 139.20 C 74.32 141.37 75.76 144.26 79.38 146.43 C 85.17 149.32 87.33 149.32 91.67 148.60 C 93.84 147.87 97.46 146.43 99.63 144.26 C 101.08 142.81 103.25 139.92 103.97 132.69 L 103.97 81.79", strokeColor: "#4A90E2" },
      { family: "crochet", pathD: "M 103.97 81.79 C 103.97 81.79 102.52 79.17 98.91 81.34 C 97.46 82.79 96.01 84.96 97.46 87.85 C 98.91 90.74 101.08 91.46 103.97 91.46 L 118.43 91.46" },
    ],
  },
  {
    char: "w",
    zone: "corps",
    steps: [
      {
        family: "crochet",
        pathD:
          "M 63.94 81.79 L 64.31 81.01 L 64.76 80.29 L 65.28 79.63 L 65.88 79.02 L 66.54 78.48 L 67.26 78.01 L 68.02 77.64 L 68.82 77.34 L 69.65 77.13 L 70.49 77.02 L 71.34 77.00 L 72.20 77.07 L 73.03 77.24 L 73.85 77.50 L 74.63 77.84 L 75.36 78.27 L 76.04 78.78 L 76.67 79.36 L 77.23 80.00 L 77.72 80.70 L 78.12 81.45 L 78.44 82.24 L 78.67 83.06 L 78.81 83.90 L 78.86 84.75 L 78.82 132.69",
      },
      { family: "courbe", pathD: "M 78.82 132.69 C 78.82 132.69 78.82 137.03 79.54 139.20 C 80.27 141.37 81.71 144.26 85.33 146.43 C 91.12 149.32 93.29 149.32 97.63 148.60 C 99.79 147.87 103.41 146.43 105.58 144.26 C 107.03 142.81 109.20 139.92 109.92 132.69 L 109.92 81.79", strokeColor: "#4A90E2" },
      { family: "courbe", pathD: "M 109.92 132.69 C 109.92 132.69 109.92 137.03 110.64 139.20 C 111.37 141.37 112.81 144.26 116.43 146.43 C 122.21 149.32 124.38 149.32 128.72 148.60 C 130.89 147.87 134.51 146.43 136.68 144.26 C 138.12 142.81 140.29 139.92 141.02 132.69 L 141.02 81.79", strokeColor: "#4A90E2" },
      { family: "crochet", pathD: "M 141.02 81.79 C 141.02 81.79 139.57 79.17 135.96 81.34 C 134.51 82.79 133.06 84.96 134.51 87.85 C 135.96 90.74 138.12 91.46 141.02 91.46 L 155.48 91.46" },
    ],
  },
  {
    char: "c",
    zone: "corps",
    steps: [
      { family: "trait", pathD: "M 60 150 L 73 130" },
      {
        family: "courbe",
        pathD:
          "M 130.78 87.50 L 126.15 83.59 L 120.92 80.51 L 115.26 78.35 L 109.32 77.17 L 103.26 77.00 L 97.26 77.85 L 91.48 79.69 L 86.10 82.47 L 81.25 86.11 L 77.09 90.52 L 73.72 95.56 L 71.25 101.09 L 69.73 106.96 L 69.22 113.00 L 69.73 119.04 L 71.25 124.91 L 73.72 130.44 L 77.09 135.48 L 81.25 139.89 L 86.10 143.53 L 91.48 146.31 L 97.26 148.15 L 103.26 149.00 L 109.32 148.83 L 115.26 147.65 L 120.92 145.49 L 126.15 142.41 L 130.78 138.50",
      },
    ],
  },
  {
    char: "i",
    zone: "corps",
    steps: [
      { family: "trait", pathD: "M 85 150 L 94 130" },
      {
        family: "crochet",
        pathD:
          "M 93.93 98.33 L 93.93 140.05 L 93.98 141.04 L 94.15 142.02 L 94.42 142.98 L 94.80 143.90 L 95.28 144.78 L 95.85 145.59 L 96.51 146.34 L 97.25 147.01 L 98.06 147.59 L 98.92 148.08 L 99.84 148.47 L 100.79 148.75 L 101.77 148.93 L 102.76 149.00 L 103.76 148.96 L 104.74 148.81 L 105.70 148.54 L 106.63 148.18 L 107.51 147.71 L 108.33 147.15 L 109.09 146.50 L 109.77 145.77 L 110.36 144.97 L 110.86 144.11",
      },
      {
        family: "point",
        pathD: "M 90.59 81.80 A 3.36 3.36 0 1 0 90.63 81.80",
      },
    ],
  },
  {
    char: "q",
    zone: "jambe",
    steps: [
      { family: "trait", pathD: "M 60 120 L 70 110" },
      {
        family: "courbe",
        pathD:
          "M 110.83 87.68 L 108.23 84.30 L 105.05 81.47 L 101.41 79.26 L 97.43 77.75 L 93.23 77.00 L 88.97 77.03 L 84.79 77.84 L 80.83 79.40 L 77.22 81.65 L 74.08 84.53 L 71.52 87.94 L 69.63 91.76 L 68.47 95.85 L 68.08 100.10 L 68.47 104.34 L 69.63 108.44 L 71.52 112.25 L 74.08 115.66 L 77.22 118.54 L 80.83 120.80 L 84.79 122.36 L 88.97 123.16 L 93.23 123.19 L 97.43 122.44 L 101.41 120.93 L 105.05 118.73 L 108.23 115.89 L 110.83 112.52",
      },
      { family: "trait", pathD: "M 110.22 80.71 L 110.22 165.00" },
      {
        family: "crochet",
        pathD:
          "M 110.36 114.45 L 110.13 115.06 L 109.97 115.69 L 109.88 116.34 L 109.87 116.99 L 109.93 117.64 L 110.06 118.28 L 110.26 118.90 L 110.53 119.49 L 110.87 120.05 L 111.27 120.57 L 111.72 121.04 L 112.22 121.45 L 112.77 121.81 L 113.35 122.10 L 113.96 122.33 L 114.59 122.49 L 115.24 122.57 L 115.89 122.59 L 116.54 122.53 L 117.18 122.39 L 131.92 118.44",
      },
    ],
  },
  {
    char: "z",
    zone: "jambe",
    steps: [
      { family: "trait", pathD: "M 74.08 99.04 L 89.62 78.42" },
      {
        family: "courbe",
        strokeColor: "#4A90E2",
        pathD:
          "M 90.32 77.00 L 89.84 77.62 L 89.44 78.29 L 89.11 79.00 L 88.86 79.74 L 88.70 80.50 L 88.62 81.27 L 88.63 82.06 L 88.73 82.84 L 88.91 83.60 L 89.18 84.33 L 89.53 85.04 L 89.95 85.69 L 90.46 86.29 L 91.01 86.84 L 91.63 87.32 L 92.29 87.73 L 93.01 88.05 L 93.75 88.30 L 94.51 88.47 L 95.29 88.54 L 96.07 88.53 L 116.94 87.07",
      },
      { family: "trait", pathD: "M 116.94 87.07 L 102.17 103.89" },
      {
        family: "crochet",
        pathD:
          "M 102.17 103.89 C 106.39 101.99 110.09 100.14 115.65 103.84 C 119.35 105.69 121.20 111.24 121.20 114.95 L 121.20 153.82 C 121.20 153.82 121.20 159.37 117.50 163.07 C 111.94 166.78 104.54 164.93 101.76 159.37",
      },
      { family: "trait", strokeColor: "#4A90E2", pathD: "M 101.76 159.37 C 100.84 155.67 100.84 151.04 104.54 146.41 L 133.23 116.80" },
    ],
  },
  {
    char: "h",
    zone: "hampe",
    steps: [
      {
        family: "crochet",
        pathD:
          "M 70 150 L 87.63 113.31 L 111.35 54.62 L 111.85 53.13 L 112.19 51.60 L 112.37 50.04 L 112.36 48.47 L 112.19 46.91 L 111.85 45.38 L 111.34 43.90 L 110.67 42.48 L 109.85 41.14 L 108.89 39.91 L 107.79 38.78 L 106.58 37.78 L 105.27 36.92 L 103.87 36.21 L 102.41 35.66 L 100.89 35.27 L 99.33 35.05 L 97.76 35.00 L 96.20 35.12 L 94.66 35.42 L 93.16 35.88 L 91.72 36.51 L 90.36 37.28 L 89.09 38.21",
      },
      { family: "trait", pathD: "M 89.09 38.21 L 89.09 150" },
      { family: "crochet", pathD: "M 90 110 C 94 106 98 103 103 102 C 108 102 112 103 117 108 L 118 111 L 118 150" },
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
