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
//
// Grille à 4 lignes strictement équidistantes (intervalle = 60) — voir
// CahierFrame.tsx pour le rendu des lignes réglées correspondantes :
//   hampe/majuscule=10, corps/tête-jambe=70, base=130, bas-jambe=190.
// Pas de ligne dédiée séparée pour les majuscules : elles rejoignent la même
// ligne haute que les lettres à hampe (b/d/f/h/k/l/t), ce qui permet un
// intervalle nettement plus grand pour toutes les lettres.
//
// Les cibles ci-dessous sont retirées de 5 unités de chaque côté (demi-
// épaisseur du trait le plus épais utilisé pour tracer une lettre, 10, avec
// bouts arrondis) par rapport aux lignes réglées : le tracé SVG (squelette
// du chemin) doit être en retrait pour que l'ENCRE visible (trait + bouts
// arrondis) touche exactement la ligne sans jamais la dépasser.
const ZONE_TARGET: Record<LetterFormation["zone"], [number, number]> = {
  hampe: [15, 125],
  jambe: [75, 185],
  corps: [75, 125],
};
/** Les majuscules partagent désormais la même hauteur que les minuscules à
 * hampe (même ligne haute, plus de ligne dédiée séparée) — voir ZONE_TARGET.hampe. */
const UPPERCASE_TARGET: [number, number] = ZONE_TARGET.hampe;
/** Majuscules avec une véritable descendante (ex. "G") : rejoint le bas de la
 * zone jambe pour ne pas écraser le corps de la lettre en comprimant la queue dedans. */
const UPPERCASE_TARGET_TALL: [number, number] = [15, 185];

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

const FAMILY_LABEL: Record<CursiveFamily, { fr: string; en: string; es: string; ar: string }> = {
  trait: { fr: "trait", en: "line", es: "trazo", ar: "خط" },
  courbe: { fr: "courbe", en: "curve", es: "curva", ar: "منحنى" },
  crochet: { fr: "crochet", en: "hook", es: "gancho", ar: "خطاف" },
  point: { fr: "point", en: "dot", es: "punto", ar: "نقطة" },
  "double-crochet": { fr: "boucle de liaison", en: "connecting loop", es: "bucle de enlace", ar: "حلقة وصل" },
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
  if (isUppercase(char)) return UPPERCASE_WITH_DESCENDER.has(char) ? UPPERCASE_TARGET_TALL : UPPERCASE_TARGET;
  return ZONE_TARGET[zone];
}

const VOWEL_CHARS = new Set(["a", "e", "i", "o", "u"]);

function familySequenceLabel(steps: CursiveStepInput[], lang: "fr" | "en" | "es" | "ar"): string {
  const names = [...steps].sort((a, b) => a.order - b.order).map((s) => FAMILY_LABEL[s.family][lang]);
  if (names.length <= 1) return names[0];
  if (lang === "fr") return `${names.slice(0, -1).join(", ")} puis ${names[names.length - 1]}`;
  if (lang === "es") return `${names.slice(0, -1).join(", ")} y luego ${names[names.length - 1]}`;
  if (lang === "ar") return `${names.slice(0, -1).join("، ")} ثم ${names[names.length - 1]}`;
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
        ar: `ارسم ${FAMILY_LABEL[step.family].ar} رقم ${step.order}`,
      },
    };
  });

  return {
    char: input.char,
    name: { fr: `${input.char} cursif`, en: `cursive ${input.char}`, es: `${input.char} cursiva`, ar: `${input.char} بخط متصل` },
    category: isUppercase(input.char) ? "majuscule" : VOWEL_CHARS.has(input.char) ? "voyelle" : "consonne",
    zone,
    steps,
    consigne: {
      fr: `En cursive, la lettre "${input.char}" s'écrit d'un geste lié : ${familySequenceLabel(orderedSteps, "fr")}.`,
      en: `In cursive, the letter "${input.char}" is written in one connected gesture: ${familySequenceLabel(orderedSteps, "en")}.`,
      es: `En cursiva, la letra "${input.char}" se escribe en un solo gesto: ${familySequenceLabel(orderedSteps, "es")}.`,
      ar: `بخط الرقعة المتصل، يُكتب الحرف "${input.char}" بحركة واحدة متصلة: ${familySequenceLabel(orderedSteps, "ar")}.`,
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
        ar: `ارسم ${FAMILY_LABEL[step.family].ar} رقم ${order}`,
      },
    };
  });

  return {
    char: input.char,
    name: { fr: `${input.char} cursif`, en: `cursive ${input.char}`, es: `${input.char} cursiva`, ar: `${input.char} بخط متصل` },
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
      ar: `بخط الرقعة المتصل، يُكتب الحرف "${input.char}" بحركة واحدة متصلة: ${input.steps
        .map((s) => FAMILY_LABEL[s.family].ar)
        .join("، ")}.`,
    },
  };
}

const CURSIVE_LITERAL_RAW: CursiveLiteralLetterInput[] = [
  {
    char: "a",
    zone: "corps",
    steps: [
      { family: "trait", pathD: "M 64.17 125 L 74.46 111.3" },
      {
        family: "courbe",
        pathD: "M 115.54 84.17 C 110.89 78.36 103.83 75 96.37 75 C 82.74 75 71.71 86.03 71.71 99.66 C 71.71 113.29 82.74 124.31 96.37 124.31 C 103.83 124.31 110.89 120.96 115.54 115.14",
      },
      {
        family: "crochet",
        pathD: "M 115.54 77.06 L 115.54 118.16 C 116.23 122.26 118.29 123.63 121.03 123.63 C 123.77 123.63 125.83 120.89 125.83 120.89",
      },
    ],
  },
  {
    char: "b",
    zone: "hampe",
    steps: [
      {
        family: "crochet",
        pathD: "M 61.06 125 L 69.97 100.88 L 93.39 32.92 L 93.77 31.49 L 94.03 30.02 L 94.12 28.54 L 94.03 27.05 L 93.79 25.59 L 93.4 24.16 L 92.84 22.77 L 92.14 21.46 L 91.3 20.24 L 90.32 19.13 L 89.24 18.11 L 88.03 17.23 L 86.75 16.49 L 85.39 15.87 L 83.97 15.43 L 82.53 15.14 L 81.04 15 L 79.55 15.03 L 78.08 15.23 L 76.64 15.58 L 75.25 16.1 L 73.92 16.76 L 72.67 17.57 L 71.51 18.51 L 69.99 19.9",
      },
      {
        family: "crochet",
        pathD: "M 69.99 19.9 L 69.99 112.51 L 70.07 113.84 L 70.3 115.13 L 70.65 116.37 L 71.17 117.57 L 71.8 118.72 L 72.57 119.77 L 73.45 120.75 L 74.43 121.62 L 75.5 122.35 L 76.67 122.97 L 77.88 123.46 L 79.13 123.79 L 80.44 124 L 81.74 124.05 L 83.03 123.96 L 84.33 123.69 L 85.58 123.31 L 86.77 122.77 L 87.9 122.11 L 88.95 121.32 L 89.9 120.44 L 90.73 119.43 L 91.46 118.35 L 92.07 117.18 L 92.52 115.94 L 92.84 114.67 L 93.04 113.4 L 93.18 112.1 L 93.25 110.82 L 93.24 109.54 L 93.15 108.25 L 92.99 106.97 L 92.77 105.7 L 92.52 104.42 L 92.32 103.14 L 92.21 101.85 L 92.21 100.88",
      },
      { family: "trait", pathD: "M 92.21 100.88 L 107.62 100.88" },
    ],
  },
  {
    char: "d",
    zone: "hampe",
    steps: [
      { family: "trait", pathD: "M 54.75 125 L 68.17 107.11" },
      {
        family: "courbe",
        pathD: "M 121.83 71.61 C 113.25 61.05 98.93 57.03 86.05 61.58 C 73.18 66.15 64.58 78.32 64.58 91.92 C 64.58 105.5 73.18 117.67 86.05 122.22 C 98.93 126.79 113.25 122.76 121.83 112.21",
      },
      {
        family: "crochet",
        pathD: "M 121.83 15 L 121.83 116.05 C 122.72 121.43 125.42 123.21 128.99 123.21 C 132.57 123.21 135.25 119.64 135.25 119.64",
      },
    ],
  },
  {
    char: "e",
    zone: "corps",
    steps: [
      { family: "crochet", zIndex: 3, pathD: "M 55.31 106.25 L 97.98 100.25 A 11.93 11.93 0 0 0 104.31 79.58" },
      { family: "courbe", zIndex: 2, pathD: "M 105.37 80.58 A 25 25 0 1 0 104.68 119.96" },
    ],
  },
  {
    char: "g",
    zone: "jambe",
    steps: [
      { family: "trait", pathD: "M 66.73 114.02 L 72.24 106.13" },
      { family: "courbe", pathD: "M 108.81 84.34 A 21.5 21.5 0 1 0 108.81 108.66" },
      { family: "trait", pathD: "M 109.03 77.43 L 109.03 183.32" },
      { family: "crochet", pathD: "M 109.06 183.49 A 13.91 13.91 0 0 1 90.61 164.32 L 116.62 117.38" },
    ],
  },
  {
    char: "j",
    zone: "jambe",
    steps: [
      { family: "trait", pathD: "M 98.5 122.24 L 110.79 99.09" },
      { family: "trait", pathD: "M 110.71 99.76 L 110.71 183.67" },
      { family: "crochet", pathD: "M 110.73 183.82 A 11.04 11.04 0 0 1 96.11 168.63 L 116.73 131.43" },
      { family: "point", pathD: "M 110.97 75 A 3.85 3.85 0 1 0 111.02 75" },
    ],
  },
  {
    char: "m",
    zone: "corps",
    steps: [
      { family: "courbe", pathD: "M 47.02 84.51 C 47.02 79.24 51.27 75 56.53 75 C 61.77 75 66.03 79.24 66.03 84.51 L 66.03 124.75" },
      { family: "courbe", pathD: "M 66.03 84.51 C 66.03 79.24 70.27 75 75.53 75 C 80.79 75 85.03 79.24 85.03 84.51 L 85.03 124.75" },
      {
        family: "courbe",
        pathD: "M 85.03 84.51 C 85.03 79.24 89.27 75 94.53 75 C 99.78 75 104.04 79.24 104.04 84.51 L 104.04 119.72 C 104.04 123.07 105.71 124.75 107.95 124.92 C 109.63 125.31 112.43 124.18 112.98 122.52",
      },
    ],
  },
  {
    char: "n",
    zone: "corps",
    steps: [
      { family: "courbe", pathD: "M 73.53 84.51 C 73.53 79.24 77.77 75 83.03 75 C 88.27 75 92.53 79.24 92.53 84.51 L 92.53 124.75" },
      {
        family: "courbe",
        pathD: "M 92.53 84.51 C 92.53 79.24 96.77 75 102.03 75 C 107.28 75 111.53 79.24 111.53 84.51 L 111.53 119.72 C 111.53 123.07 113.21 124.75 115.46 124.92 C 117.13 125.31 119.93 124.18 120.47 122.52",
      },
    ],
  },
  {
    char: "ñ",
    zone: "corps",
    steps: [
      { family: "courbe", pathD: "M 73.53 84.51 C 73.53 79.24 77.77 75 83.03 75 C 88.27 75 92.53 79.24 92.53 84.51 L 92.53 124.75" },
      {
        family: "courbe",
        pathD: "M 92.53 84.51 C 92.53 79.24 96.77 75 102.03 75 C 107.28 75 111.53 79.24 111.53 84.51 L 111.53 119.72 C 111.53 123.07 113.21 124.75 115.46 124.92 C 117.13 125.31 119.93 124.18 120.47 122.52",
      },
      {
        family: "double-crochet",
        pathD: "M 98.4 83.68 A 2.54 2.54 0 0 0 95.86 81.16 L 92.53 81.16 L 89.2 81.16 A 2.54 2.54 0 0 1 86.66 78.6",
      },
    ],
  },
  {
    char: "f",
    zone: "hampe",
    steps: [
      { family: "crochet", pathD: "M 81.33 67.99 L 109.98 38.31 A 13.75 13.75 0 0 0 99.85 15" },
      { family: "crochet", pathD: "M 111.13 20.1 A 10.74 10.74 0 0 0 91.27 25.69 L 91.27 69.98" },
      { family: "crochet", pathD: "M 91.27 69.98 L 91.27 111.25 A 13.75 13.75 0 0 0 114.73 120.97" },
      { family: "crochet", pathD: "M 103.26 124.73 A 13.75 13.75 0 0 0 115.77 102.61 L 90.37 70.06" },
      { family: "crochet", pathD: "M 91.42 80.5 A 5.16 5.16 0 0 0 100.3 84.01 L 111.05 72.87" },
    ],
  },
  {
    char: "k",
    zone: "hampe",
    steps: [
      { family: "crochet", pathD: "M 84.45 81.97 L 105.11 30.88 A 11.53 11.53 0 0 0 86.72 17.95" },
      { family: "trait", pathD: "M 86.69 18.59 L 86.69 121.17" },
      { family: "courbe", pathD: "M 87.9 83.93 A 15.38 15.38 0 1 1 87.9 108.82" },
      { family: "crochet", pathD: "M 87.97 109.54 A 4.23 4.23 0 0 1 95.71 107.19 L 104.83 120.68" },
      { family: "crochet", pathD: "M 97.47 110.21 L 106.3 122.82 A 5.13 5.13 0 0 0 115.55 120.74" },
    ],
  },
  {
    char: "p",
    zone: "jambe",
    steps: [
      { family: "trait", pathD: "M 83.52 106.42 L 101.2 83.84" },
      { family: "trait", pathD: "M 101.2 75 L 101.2 185" },
      {
        family: "courbe",
        pathD: "M 101.2 101.51 C 101.2 86.78 110.05 78.92 122.81 81.88 C 125.76 82.87 128.7 85.81 129.69 88.75 C 130.68 92.67 130.68 96.62 130.68 100.53 C 130.68 106.42 132.64 109.38 135.57 109.38 C 135.57 109.38 139.51 110.37 141.49 104.47",
      },
    ],
  },
  {
    char: "r",
    zone: "corps",
    steps: [
      { family: "trait", pathD: "M 55.83 113.67 L 71.31 75.01" },
      { family: "crochet", pathD: "M 66.88 75 A 3.97 3.97 0 0 0 67.15 81.34 L 100.97 81.34" },
      { family: "crochet", pathD: "M 100.96 80.93 L 100.96 117.73 A 8.26 8.26 0 0 0 116.38 120.75" },
    ],
  },
  {
    char: "s",
    zone: "corps",
    steps: [
      { family: "trait", pathD: "M 80.59 116.19 L 104.9 75.67" },
      { family: "crochet", pathD: "M 105.57 75 L 119.76 108.77 A 12.16 12.16 0 0 1 104.22 124.29" },
    ],
  },
  {
    char: "t",
    zone: "hampe",
    steps: [
      { family: "trait", pathD: "M 77.32 125 L 97 98.17" },
      {
        family: "crochet",
        pathD: "M 97 15 L 97 116.05 C 97 121.43 99.68 124.11 104.15 124.38 C 105.95 125 113.1 124.11 116.68 120.53",
      },
      { family: "trait", pathD: "M 79.11 36.46 L 114.89 36.46" },
    ],
  },
  {
    char: "u",
    zone: "corps",
    steps: [
      { family: "trait", pathD: "M 80 125 L 85.56 113.89" },
      {
        family: "crochet",
        pathD: "M 84.44 75 L 84.44 107.23 C 84.44 119.44 93.33 125 103.33 125 C 113.33 125 120 119.44 120 107.23",
      },
      {
        family: "crochet",
        pathD: "M 120 75 L 120 119.44 C 120.56 122.77 122.77 124.44 125 124.77 C 127.23 125 129.44 123.89 130 122.23",
      },
    ],
  },
  {
    char: "l",
    zone: "hampe",
    steps: [
      { family: "crochet", pathD: "M 77.94 124.08 L 86.8 97.52 L 105.4 27.55 A 10.01 10.01 0 0 0 86.8 20.47" },
      { family: "crochet", pathD: "M 86.8 20.91 L 86.8 113.46 A 10.62 10.62 0 0 0 108.06 115.22" },
    ],
  },
  {
    char: "o",
    zone: "corps",
    steps: [
      { family: "trait", zIndex: 0, pathD: "M 58.84 121.13 L 67.44 108.83" },
      { family: "courbe", zIndex: 2, pathD: "M 96.89 75.57 A 25 25 0 1 0 99 76.13" },
      { family: "crochet", zIndex: 3, pathD: "M 98.11 75.7 A 12.5 12.5 0 0 0 102.29 98.26 L 138.83 106.68" },
    ],
  },
  {
    char: "v",
    zone: "corps",
    steps: [
      {
        family: "crochet",
        pathD: "M 67.23 78.33 L 67.48 77.79 L 67.78 77.29 L 68.16 76.83 L 68.58 76.4 L 69.04 76.03 L 69.54 75.7 L 70.05 75.44 L 70.61 75.23 L 71.18 75.09 L 71.78 75.01 L 72.37 75 L 72.97 75.04 L 73.54 75.17 L 74.11 75.34 L 74.64 75.59 L 75.15 75.87 L 75.64 76.23 L 76.07 76.64 L 76.45 77.09 L 76.78 77.57 L 77.08 78.09 L 77.3 78.64 L 77.45 79.21 L 77.55 79.79 L 77.58 80.37 L 77.55 113.67",
      },
      { family: "courbe", pathD: "M 77.55 113.67 C 77.55 113.67 77.55 116.68 78.05 118.2 C 78.57 119.69 79.57 121.71 82.08 123.21 C 86.1 125.22 87.6 125.22 90.61 124.72 C 92.12 124.21 94.64 123.21 96.14 121.71 C 97.14 120.69 98.65 118.68 99.15 113.67 L 99.15 78.33", strokeColor: "#4A90E2" },
      { family: "crochet", pathD: "M 99.15 78.33 C 99.15 78.33 98.14 76.51 95.64 78.01 C 94.64 79.03 93.64 80.53 94.64 82.53 C 95.64 84.54 97.14 85.04 99.15 85.04 L 109.19 85.04" },
    ],
  },
  {
    char: "w",
    zone: "corps",
    steps: [
      {
        family: "crochet",
        pathD: "M 77.93 78.33 L 78.19 77.79 L 78.5 77.29 L 78.86 76.83 L 79.28 76.4 L 79.74 76.03 L 80.24 75.7 L 80.76 75.44 L 81.31 75.23 L 81.88 75.09 L 82.48 75.01 L 83.07 75 L 83.67 75.04 L 84.24 75.17 L 84.81 75.34 L 85.36 75.59 L 85.86 75.87 L 86.34 76.23 L 86.77 76.64 L 87.16 77.09 L 87.5 77.57 L 87.78 78.09 L 88 78.64 L 88.16 79.21 L 88.26 79.79 L 88.28 80.37 L 88.26 113.67",
      },
      { family: "courbe", pathD: "M 88.26 113.67 C 88.26 113.67 88.26 116.68 88.76 118.2 C 89.27 119.69 90.27 121.71 92.78 123.21 C 96.8 125.22 98.31 125.22 101.33 124.72 C 102.83 124.21 105.34 123.21 106.84 121.71 C 107.85 120.69 109.35 118.68 109.85 113.67 L 109.85 78.33", strokeColor: "#4A90E2" },
      { family: "courbe", pathD: "M 109.85 113.67 C 109.85 113.67 109.85 116.68 110.35 118.2 C 110.87 119.69 111.87 121.71 114.38 123.21 C 118.38 125.22 119.89 125.22 122.91 124.72 C 124.42 124.21 126.94 123.21 128.44 121.71 C 129.44 120.69 130.94 118.68 131.45 113.67 L 131.45 78.33", strokeColor: "#4A90E2" },
      { family: "crochet", pathD: "M 131.45 78.33 C 131.45 78.33 130.44 76.51 127.94 78.01 C 126.94 79.03 125.92 80.53 126.94 82.53 C 127.94 84.54 129.44 85.04 131.45 85.04 L 141.49 85.04" },
    ],
  },
  {
    char: "y",
    zone: "jambe",
    steps: [
      {
        family: "double-crochet",
        variant: "hd-bg",
        zIndex: 1,
        pathD: "M 70.31 77.42 A 7.27 7.27 0 0 1 82.71 82.56 L 82.71 99.54 L 82.71 112.46 A 11.31 11.31 0 0 0 104.12 117.62",
      },
      { family: "trait", zIndex: 2, pathD: "M 105.16 75 L 105.16 182.79" },
      { family: "crochet", zIndex: 3, pathD: "M 104.92 183.22 A 20.13 20.13 0 0 1 83.51 149.62 L 133.39 106.28" },
    ],
  },
  {
    char: "c",
    zone: "corps",
    steps: [
      { family: "trait", pathD: "M 71.15 125 L 80.06 111.3" },
      {
        family: "courbe",
        pathD: "M 119.63 82.2 L 116.46 79.51 L 112.88 77.4 L 109 75.93 L 104.93 75.13 L 100.78 75 L 96.66 75.59 L 92.72 76.84 L 89.03 78.76 L 85.7 81.24 L 82.86 84.26 L 80.55 87.71 L 78.86 91.5 L 77.82 95.53 L 77.46 99.66 L 77.82 103.79 L 78.86 107.81 L 80.55 111.6 L 82.86 115.06 L 85.7 118.07 L 89.03 120.57 L 92.72 122.47 L 96.66 123.73 L 100.78 124.31 L 104.93 124.2 L 109 123.39 L 112.88 121.91 L 116.46 119.8 L 119.63 117.13",
      },
    ],
  },
  {
    char: "i",
    zone: "corps",
    steps: [
      { family: "trait", pathD: "M 88.46 125 L 95.06 110.34" },
      {
        family: "crochet",
        pathD: "M 95 87.13 L 95 117.71 L 95.03 118.43 L 95.16 119.16 L 95.36 119.86 L 95.64 120.53 L 95.99 121.17 L 96.4 121.77 L 96.89 122.33 L 97.43 122.81 L 98.03 123.23 L 98.66 123.59 L 99.33 123.87 L 100.03 124.09 L 100.74 124.21 L 101.47 124.27 L 102.2 124.23 L 102.92 124.13 L 103.63 123.93 L 104.3 123.67 L 104.96 123.33 L 105.56 122.91 L 106.1 122.43 L 106.6 121.9 L 107.04 121.31 L 107.4 120.67",
      },
      {
        family: "point",
        pathD: "M 92.56 75 A 2.47 2.47 0 1 0 92.57 75",
      },
    ],
  },
  {
    char: "q",
    zone: "jambe",
    steps: [
      { family: "trait", pathD: "M 51.01 128.75 L 63.51 116.25" },
      {
        family: "courbe",
        pathD: "M 114.55 88.35 L 111.31 84.13 L 107.33 80.58 L 102.77 77.82 L 97.79 75.94 L 92.55 75 L 87.21 75.04 L 82 76.05 L 77.05 78 L 72.53 80.82 L 68.61 84.41 L 65.41 88.68 L 63.04 93.45 L 61.6 98.57 L 61.12 103.88 L 61.6 109.17 L 63.04 114.3 L 65.41 119.06 L 68.61 123.33 L 72.53 126.92 L 77.05 129.75 L 82 131.71 L 87.21 132.7 L 92.55 132.74 L 97.79 131.8 L 102.77 129.92 L 107.33 127.17 L 111.31 123.61 L 114.55 119.4",
      },
      { family: "trait", pathD: "M 113.78 79.63 L 113.78 185" },
      {
        family: "crochet",
        pathD: "M 113.96 121.81 L 113.67 122.57 L 113.48 123.36 L 113.37 124.17 L 113.35 125 L 113.42 125.79 L 113.59 126.6 L 113.83 127.37 L 114.17 128.12 L 114.6 128.82 L 115.1 129.46 L 115.66 130.06 L 116.28 130.56 L 116.97 131.02 L 117.7 131.38 L 118.45 131.66 L 119.24 131.86 L 120.06 131.97 L 120.88 131.99 L 121.69 131.91 L 122.48 131.73 L 140.91 126.8",
      },
    ],
  },
  {
    char: "z",
    zone: "jambe",
    steps: [
      { family: "trait", pathD: "M 66.69 102.55 L 86.12 76.77" },
      {
        family: "courbe",
        strokeColor: "#4A90E2",
        pathD: "M 87 75 L 86.39 75.77 L 85.9 76.61 L 85.47 77.5 L 85.15 78.42 L 84.96 79.37 L 84.87 80.33 L 84.88 81.32 L 85 82.3 L 85.24 83.25 L 85.55 84.17 L 86.01 85.05 L 86.53 85.86 L 87.16 86.6 L 87.85 87.29 L 88.63 87.9 L 89.44 88.41 L 90.35 88.8 L 91.29 89.13 L 92.22 89.34 L 93.2 89.42 L 94.17 89.41 L 120.26 87.59",
      },
      { family: "trait", pathD: "M 120.26 87.59 L 101.81 108.6" },
      {
        family: "crochet",
        pathD: "M 101.81 108.6 C 107.07 106.24 111.71 103.93 118.65 108.55 C 123.28 110.86 125.59 117.8 125.59 122.44 L 125.59 171.01 C 125.59 171.01 125.59 177.96 120.96 182.58 C 114.02 187.22 104.76 184.91 101.3 177.96",
      },
      { family: "trait", strokeColor: "#4A90E2", pathD: "M 101.3 177.96 C 100.14 173.34 100.14 167.55 104.76 161.76 L 140.62 124.75" },
    ],
  },
  {
    char: "h",
    zone: "hampe",
    steps: [
      {
        family: "crochet",
        pathD: "M 71.05 125 L 87.91 89.91 L 110.6 33.77 L 111.08 32.34 L 111.39 30.88 L 111.57 29.38 L 111.56 27.88 L 111.39 26.39 L 111.08 24.93 L 110.58 23.51 L 109.95 22.15 L 109.15 20.89 L 108.25 19.69 L 107.19 18.62 L 106.03 17.67 L 104.78 16.83 L 103.43 16.16 L 102.04 15.62 L 100.59 15.26 L 99.1 15.06 L 97.59 15 L 96.1 15.11 L 94.62 15.4 L 93.19 15.84 L 91.83 16.44 L 90.52 17.17 L 89.31 18.07",
      },
      { family: "trait", pathD: "M 89.31 18.07 L 89.31 125" },
      { family: "crochet", pathD: "M 90.18 86.75 C 94 82.91 97.82 80.05 102.61 79.09 C 107.39 79.09 111.22 80.05 116 84.82 L 116.95 87.7 L 116.95 125" },
    ],
  },
  {
    char: "A",
    zone: "hampe",
    steps: [
      { family: "crochet", zIndex: 2, pathD: "M 30.36 111.94 A 17.72 17.72 0 0 0 64.55 111.93 L 90.52 15" },
      { family: "crochet", zIndex: 3, pathD: "M 91.48 15 L 117.45 111.93 A 17.72 17.72 0 0 0 151.64 111.94" },
      { family: "trait", zIndex: 1, pathD: "M 73.28 81.86 L 108.72 81.86" },
    ],
  },
  {
    char: "B",
    zone: "hampe",
    steps: [
      { family: "crochet", zIndex: 3, pathD: "M 81.8 19.48 L 81.8 109.18 A 15.84 15.84 0 0 1 52.26 117.11" },
      { family: "courbe", zIndex: 1, pathD: "M 66.18 34.42 A 25.07 25.07 0 1 1 83.27 64.04" },
      { family: "courbe", zIndex: 3, pathD: "M 87.87 65.49 A 28.04 28.04 0 1 1 62.82 104.05" },
    ],
  },
  {
    char: "D",
    zone: "hampe",
    steps: [
      {
        family: "double-crochet",
        variant: "hd-bg",
        zIndex: 1,
        pathD: "M 87.04 16.29 A 10.27 10.27 0 0 0 80.99 24.77 L 77.01 70.32 L 73.28 113.07 A 13.07 13.07 0 0 1 47.24 110.79",
      },
      { family: "courbe", zIndex: 2, pathD: "M 38.53 41.14 A 53.9 53.9 0 1 1 68.96 120.44" },
    ],
  },
  {
    char: "G",
    zone: "hampe",
    steps: [
      { family: "courbe", zIndex: 2, pathD: "M 108.02 15 A 23.64 23.64 0 1 0 134.86 46.99" },
      { family: "courbe", zIndex: 2, pathD: "M 135.22 46.03 A 43 43 0 1 0 135.22 107.87" },
      { family: "trait", zIndex: 3, pathD: "M 135.95 94.35 L 135.95 180.33" },
      { family: "crochet", zIndex: 4, pathD: "M 135.89 180.18 A 16.43 16.43 0 0 1 112.62 156.94 L 152.67 116.88" },
    ],
  },
  {
    char: "O",
    zone: "hampe",
    steps: [
      { family: "courbe", zIndex: 2, pathD: "M 116.15 17.13 A 55 55 0 1 0 140.56 31.81" },
      { family: "courbe", zIndex: 2, pathD: "M 148.92 43.23 A 22 22 0 1 0 107.09 56.83" },
    ],
  },
  {
    char: "Q",
    zone: "hampe",
    steps: [
      { family: "courbe", zIndex: 2, pathD: "M 115.74 17.07 A 53.43 53.43 0 1 0 139.44 31.32" },
      { family: "courbe", zIndex: 2, pathD: "M 147.4 41.34 A 26.05 26.05 0 1 0 99.83 62.53" },
      { family: "trait", zIndex: 3, pathD: "M 126.48 95.93 L 140.02 125" },
    ],
  },
  {
    char: "P",
    zone: "hampe",
    steps: [
      { family: "crochet", zIndex: 1, pathD: "M 86.99 19.71 L 86.99 110.07 A 14.92 14.92 0 0 1 59.27 117.76" },
      { family: "courbe", zIndex: 2, pathD: "M 68.51 38.56 A 31.09 31.09 0 1 1 87.01 74.91" },
    ],
  },
  {
    char: "R",
    zone: "hampe",
    steps: [
      { family: "crochet", zIndex: 3, pathD: "M 83.92 19.85 L 83.92 114.44 A 10.51 10.51 0 0 1 63.02 116.1" },
      { family: "courbe", zIndex: 2, pathD: "M 65.47 38.51 A 31.03 31.03 0 1 1 83.96 74.81" },
      { family: "crochet", zIndex: 1, pathD: "M 110.11 74.16 L 113.52 113.22 A 10.83 10.83 0 0 0 135.14 111.53" },
    ],
  },
  {
    char: "S",
    zone: "hampe",
    steps: [
      { family: "courbe", zIndex: 3, pathD: "M 86.51 15 A 17.87 17.87 0 1 0 118.6 30.65" },
      { family: "crochet", zIndex: 1, pathD: "M 118.49 29.93 A 18.75 18.75 0 0 0 90.17 54.53 L 113.01 80.82" },
      { family: "crochet", zIndex: 2, pathD: "M 101.22 67.19 L 123.5 92.79 A 19.65 19.65 0 0 1 93.86 118.57" },
    ],
  },
  {
    char: "U",
    zone: "hampe",
    steps: [
      {
        family: "double-crochet",
        variant: "hd-bg",
        zIndex: 1,
        pathD: "M 43.91 30.07 A 13.92 13.92 0 0 1 71.77 30.07 L 71.77 68.38 L 71.77 94.5 A 26.12 26.12 0 0 0 121.93 104.71",
      },
      { family: "crochet", zIndex: 2, pathD: "M 121.92 15 L 121.92 112.16 A 12.82 12.82 0 0 0 145.51 119.13" },
    ],
  },
  {
    char: "V",
    zone: "hampe",
    steps: [
      { family: "crochet", zIndex: 1, pathD: "M 17.89 33.31 A 31.62 31.62 0 0 1 76.26 35.86 L 108.69 125" },
      { family: "trait", zIndex: 2, pathD: "M 108.48 124.52 L 144.05 15.08" },
      { family: "trait", zIndex: 3, pathD: "M 144.17 15 L 182.11 15" },
    ],
  },
  {
    char: "W",
    zone: "hampe",
    steps: [
      { family: "crochet", zIndex: 1, pathD: "M -16.16 33.1 A 31.36 31.36 0 0 1 41.73 35.62 L 73.9 124.05" },
      { family: "trait", zIndex: 2, pathD: "M 73.7 123.57 L 108.99 15" },
      { family: "trait", zIndex: 4, pathD: "M 109.25 15 L 144.53 123.57" },
      { family: "trait", zIndex: 5, pathD: "M 184.05 17.74 L 144.99 125" },
      { family: "trait", zIndex: 3, pathD: "M 184.8 17.01 L 216.16 17.01" },
    ],
  },
  {
    char: "Y",
    zone: "hampe",
    steps: [
      {
        family: "double-crochet",
        variant: "hd-bg",
        zIndex: 1,
        pathD: "M 70.3 17.42 A 7.28 7.28 0 0 1 82.71 22.57 L 82.71 39.55 L 82.71 52.48 A 11.32 11.32 0 0 0 104.12 57.64",
      },
      { family: "trait", zIndex: 2, pathD: "M 105.16 15 L 105.16 122.81" },
      { family: "crochet", zIndex: 3, pathD: "M 104.9 123.24 A 20.13 20.13 0 0 1 83.51 89.65 L 133.4 46.28" },
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
      { family: "trait", x: 112.6, y: 125.2, rotation: 91, scale: 0.4, flip: false, order: 3, reverse: true },
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
