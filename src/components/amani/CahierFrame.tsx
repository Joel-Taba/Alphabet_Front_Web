import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fond quadrillé + lignes réglées façon cahier français (Seyès simplifié),
 * utilisé comme cadre pour tous les tracés de signes/lettres (cours et exercices).
 *
 * 4 lignes strictement équidistantes (intervalle = 60, dans le système de
 * coordonnées 200×200 partagé par tout le catalogue de lettres) :
 *   HAMPE_TOP=10, CORPS_TOP=70, BASELINE=130, JAMBE_BOT=190.
 * Les lettres courtes (corps) tiennent exactement entre CORPS_TOP et BASELINE ;
 * les lettres à hampe ET les majuscules entre HAMPE_TOP et BASELINE (2
 * intervalles, même hauteur pour les deux — pas de ligne dédiée séparée pour
 * les majuscules) ; les lettres à jambe ont leur tête entre CORPS_TOP et
 * BASELINE et leur jambage entre BASELINE et JAMBE_BOT (1 intervalle de
 * chaque côté).
 */
const RULED_LINES = [
  { pct: 5, baseline: false },    // haut de la zone hampe / majuscules
  { pct: 35, baseline: false },   // haut du corps de ligne / tête des lettres à jambe
  { pct: 65, baseline: true },    // ligne d'écriture (base)
  { pct: 95, baseline: false },   // bas de la zone jambe
];

const PAPER_BG_COLOR = "#FFFFFF";
const RULED_LINE_COLOR = "#4A90E2";
const BASELINE_COLOR = "#E05252";

export function CahierFrame({
  children,
  className,
  style,
  rounded = 16,
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  rounded?: number;
}) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        borderRadius: rounded,
        backgroundColor: PAPER_BG_COLOR,
        ...style,
      }}
    >
      {RULED_LINES.map((line) => (
        <div
          key={line.pct}
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: `${line.pct}%`,
            height: line.baseline ? 1.5 : 1,
            backgroundColor: line.baseline ? BASELINE_COLOR : RULED_LINE_COLOR,
            opacity: 0.8,
          }}
        />
      ))}
      {children}
    </div>
  );
}
