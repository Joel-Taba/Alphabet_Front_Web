import { type SVGProps } from "react";

export type SignFamily = "trait" | "courbe" | "point" | "crochet";

/** Épaisseur de trait normalisée : 16px sur une grille 200×200 = 8% de la largeur. */
const SW = 16;
/** Marge intérieure (padding) pour éviter la coupure aux bords. */
const PAD = 28;
/** Centre de la grille. */
const CX = 100;

/**
 * Couleurs par famille — à titre de référence ou d'usage fallback.
 */
export const glyphColorByFamily: Record<SignFamily, { bg: string; stroke: string }> = {
  trait:   { bg: "#FFFFFF", stroke: "#4A3B2A" }, // Blanc
  courbe:  { bg: "#E05252", stroke: "#FFFFFF" }, // Rouge
  point:   { bg: "#F5EDE0", stroke: "#4A3B2A" }, // Blanchet
  crochet: { bg: "#4A90E2", stroke: "#FFFFFF" }, // Bleu
};

/**
 * Ordre d'empilement (du bas vers le haut) aux points d'intersection entre
 * traits d'une même lettre : la courbe passe sous le crochet, qui passe
 * lui-même sous le trait, le point restant toujours au-dessus de tout.
 */
export const letterStrokeZOrder: Record<SignFamily, number> = {
  courbe: 0,
  crochet: 1,
  trait: 2,
  point: 3,
};

export function letterFamilyZIndex(family: string): number {
  return letterStrokeZOrder[family as SignFamily] ?? 0;
}

/**
 * Ordre d'empilement effectif d'un signe : priorité au `zIndex` explicite
 * du signe (fourni pour certaines lettres où l'ordre par famille seul ne
 * suffit pas — ex. "R", où le second trait doit passer sous la courbe),
 * sinon retombe sur la priorité par défaut de sa famille.
 */
export function stepZIndex(step: { family: string; zIndex?: number }): number {
  return step.zIndex ?? letterFamilyZIndex(step.family);
}

export function zOrderedStepIndices(steps: { family: string; zIndex?: number }[]): number[] {
  return steps
    .map((_, i) => i)
    .sort((a, b) => stepZIndex(steps[a]) - stepZIndex(steps[b]));
}

/**
 * TRAIT — supporte les variantes : "vertical", "horizontal", "oblique-gauche", "oblique-droit"
 */
export function GlyphTrait({
  stroke = "#1A1009",
  variant = "vertical",
  strokeDasharray,
  strokeWidth,
  ...props
}: SVGProps<SVGSVGElement> & { stroke?: string; variant?: string; strokeDasharray?: string; strokeWidth?: number }) {
  const w = strokeWidth ?? (strokeDasharray ? 4.5 : SW);
  let x1 = CX;
  let y1 = PAD;
  let x2 = CX;
  let y2 = 200 - PAD;

  if (variant === "horizontal") {
    x1 = PAD;
    y1 = CX;
    x2 = 200 - PAD;
    y2 = CX;
  } else if (variant === "oblique-gauche") {
    // Penché vers la gauche : descente de haut-gauche à bas-droite (\)
    x1 = 40;
    y1 = 40;
    x2 = 160;
    y2 = 160;
  } else if (variant === "oblique-droit") {
    // Penché vers la droite : descente de haut-droit à bas-gauche (/)
    x1 = 160;
    y1 = 40;
    x2 = 40;
    y2 = 160;
  }

  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden {...props}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={w}
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
      />
    </svg>
  );
}

/**
 * COURBE — supporte les variantes :
 * - "open-right" (C ouvert à droite)
 * - "open-left" (Ɔ ouvert à gauche)
 * - "bridge" (∩ en pont vers le bas)
 * - "bowl" (∪ en creux vers le haut)
 * - par défaut : deux moitiés d'arc ouvertes face à face
 */
export function GlyphCourbe({
  stroke = "#FFFFFF",
  variant = "dual",
  strokeDasharray,
  strokeWidth,
  ...props
}: SVGProps<SVGSVGElement> & { stroke?: string; variant?: string; strokeDasharray?: string; strokeWidth?: number }) {
  const w = strokeWidth ?? (strokeDasharray ? 4.5 : SW);
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden {...props}>
      {variant === "open-right" && (
        <path
          d="M 130 35 A 65 65 0 0 0 130 165"
          stroke={stroke}
          strokeWidth={w}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          fill="none"
        />
      )}
      {variant === "open-left" && (
        <path
          d="M 70 35 A 65 65 0 0 1 70 165"
          stroke={stroke}
          strokeWidth={w}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          fill="none"
        />
      )}
      {variant === "bridge" && (
        <path
          d="M 35 130 A 65 65 0 0 1 165 130"
          stroke={stroke}
          strokeWidth={w}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          fill="none"
        />
      )}
      {variant === "bowl" && (
        <path
          d="M 35 70 A 65 65 0 0 0 165 70"
          stroke={stroke}
          strokeWidth={w}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          fill="none"
        />
      )}
      {/* Variante "closed" : cercle complet, utilisée pour la lettre "o" et le chiffre "0" */}
      {variant === "closed" && (
        <circle
          cx={100}
          cy={100}
          r={68}
          fill="none"
          stroke={stroke}
          strokeWidth={w}
          strokeDasharray={strokeDasharray}
        />
      )}
      {variant !== "open-right" &&
        variant !== "open-left" &&
        variant !== "bridge" &&
        variant !== "bowl" &&
        variant !== "closed" && (
          <>
            {/* Moitié gauche : courbe ouverte vers la droite */}
            <path
              d="M 75 45 A 55 55 0 0 0 75 155"
              stroke={stroke}
              strokeWidth={w}
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              fill="none"
            />
            {/* Moitié droite : courbe ouverte vers la gauche */}
            <path
              d="M 125 45 A 55 55 0 0 1 125 155"
              stroke={stroke}
              strokeWidth={w}
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              fill="none"
            />
          </>
        )}
    </svg>
  );
}

/**
 * POINT — forme circulaire parfaite
 */
export function GlyphPoint({
  stroke = "#4A3B2A",
  variant = "center",
  strokeDasharray,
  strokeWidth,
  ...props
}: SVGProps<SVGSVGElement> & { stroke?: string; variant?: string; strokeDasharray?: string; strokeWidth?: number }) {
  const w = strokeWidth ?? (strokeDasharray ? 4.5 : SW);
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden {...props}>
      {variant === "top" ? (
        <circle cx={CX} cy={60} r={18} fill={stroke} stroke={stroke} strokeWidth={strokeDasharray ? w : 0} strokeDasharray={strokeDasharray} />
      ) : variant === "bottom" ? (
        <circle cx={CX} cy={140} r={18} fill={stroke} stroke={stroke} strokeWidth={strokeDasharray ? w : 0} strokeDasharray={strokeDasharray} />
      ) : variant === "double" ? (
        <>
          <circle cx={68} cy={100} r={16} fill={stroke} stroke={stroke} strokeWidth={strokeDasharray ? w : 0} strokeDasharray={strokeDasharray} />
          <circle cx={132} cy={100} r={16} fill={stroke} stroke={stroke} strokeWidth={strokeDasharray ? w : 0} strokeDasharray={strokeDasharray} />
        </>
      ) : (
        <circle cx={CX} cy={100} r={18} fill={strokeDasharray ? "none" : stroke} stroke={stroke} strokeWidth={strokeDasharray ? w : 0} strokeDasharray={strokeDasharray} />
      )}
    </svg>
  );
}

/**
 * CROCHET — trait incurvé à son extrémité (forme en J / canne)
 * Supporte les variantes d'orientation : "top-right", "top-left", "bottom-right", "bottom-left"
 */
export function GlyphCrochet({
  stroke = "#4A90E2",
  variant = "top-right",
  strokeDasharray,
  strokeWidth,
  ...props
}: SVGProps<SVGSVGElement> & { stroke?: string; variant?: string; strokeDasharray?: string; strokeWidth?: number }) {
  const w = strokeWidth ?? (strokeDasharray ? 4.5 : SW);
  // Par défaut : crochet orienté en haut à droite (départ par l'extrémité haute)
  let d = "M 150 70 A 45 45 0 0 0 60 70 L 60 170";

  if (variant === "top-left") {
    // Courbe en haut orientée à gauche (départ par l'extrémité haute)
    d = "M 50 70 A 45 45 0 0 1 140 70 L 140 170";
  } else if (variant === "bottom-right") {
    // Courbe en bas orientée à droite
    d = "M 60 30 L 60 130 A 45 45 0 0 0 150 130";
  } else if (variant === "bottom-left") {
    // Courbe en bas orientée à gauche (forme exacte de l'image J)
    d = "M 140 30 L 140 130 A 45 45 0 0 1 50 130";
  } else if (variant === "double-crochet-gauche") {
    // Double-crochet gauche : courbe en haut et en bas parfaitement raccordées à la tige verticale à droite
    d = "M 65 55 C 65 25, 130 25, 130 80 L 130 120 C 130 175, 65 175, 65 145";
  } else if (variant === "double-crochet-droit") {
    // Double-crochet droit : courbe en haut et en bas parfaitement raccordées à la tige verticale à gauche
    d = "M 135 55 C 135 25, 70 25, 70 80 L 70 120 C 70 175, 135 175, 135 145";
  } else if (variant === "double-crochet-gauche-droit") {
    // Double-crochet gauche-droit : forme en S parfaite avec tangentes verticales à la hampe centrale
    d = "M 60 55 C 60 25, 100 25, 100 80 L 100 120 C 100 175, 140 175, 140 145";
  } else if (variant === "double-crochet-droit-gauche") {
    // Double-crochet droit-gauche : forme en Z adouci parfaite avec tangentes verticales à la hampe centrale
    d = "M 140 55 C 140 25, 100 25, 100 80 L 100 120 C 100 175, 60 175, 60 145";
  }

  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden {...props}>
      <path
        d={d}
        stroke={stroke}
        strokeWidth={w}
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        fill="none"
      />
    </svg>
  );
}

/* ── Dispatcher principal ──────────────────────────────── */

export interface SignGlyphProps extends SVGProps<SVGSVGElement> {
  family: SignFamily;
  /** Couleur du tracé. Par défaut adapté à l'état (noir sur fond blanc, blanc sur badge coloré). */
  stroke?: string;
  /** Variante / orientation du signe (ex: "vertical", "horizontal", "top-right", "open-right", etc.) */
  variant?: string;
  /** Permet d'afficher le tracé en pointillés (ex: "10 10") pour le cahier d'écriture. */
  strokeDasharray?: string;
  /** Épaisseur personnalisée du trait (ex: 4 pour les pointillés ou modèles fins). */
  strokeWidth?: number;
}

export function SignGlyph({ family, stroke, variant, strokeDasharray, strokeWidth, ...props }: SignGlyphProps) {
  switch (family) {
    case "trait":   return <GlyphTrait   stroke={stroke} variant={variant} strokeDasharray={strokeDasharray} strokeWidth={strokeWidth} {...props} />;
    case "courbe":  return <GlyphCourbe  stroke={stroke} variant={variant} strokeDasharray={strokeDasharray} strokeWidth={strokeWidth} {...props} />;
    case "point":   return <GlyphPoint   stroke={stroke} variant={variant} strokeDasharray={strokeDasharray} strokeWidth={strokeWidth} {...props} />;
    case "crochet": return <GlyphCrochet stroke={stroke} variant={variant} strokeDasharray={strokeDasharray} strokeWidth={strokeWidth} {...props} />;
  }
}
