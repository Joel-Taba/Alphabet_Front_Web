import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fond quadrillé + lignes réglées façon cahier français (Seyès simplifié),
 * utilisé comme cadre pour tous les tracés de signes/lettres (cours et exercices).
 *
 * Les lignes réglées sont positionnées en % pour correspondre exactement aux
 * zones du système de coordonnées 200×200 partagé par tout le catalogue de
 * lettres (ASC_TOP=27, CORPS_TOP=77, BASELINE=149, DESC_BOT=194), afin que le
 * tracé affiché par-dessus s'aligne toujours naturellement sur les lignes.
 */
const RULED_LINES = [
  { pct: 13.5, baseline: false }, // haut de la zone hampe haute
  { pct: 38.5, baseline: false }, // haut du corps de ligne
  { pct: 74.5, baseline: true },  // ligne d'écriture (base)
  { pct: 97, baseline: false },   // bas de la zone jambe basse
];

const GRID_LINE_COLOR = "#C5D8F0";
const GRID_BG_COLOR = "#F8FBFF";
const RULED_LINE_COLOR = "#A0C0E040";
const RULED_DASH_COLOR = "#4A90E250";
const BASELINE_COLOR = "#4A90E2";

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
        backgroundImage: [
          `linear-gradient(to right, ${GRID_LINE_COLOR} 1px, transparent 1px)`,
          `linear-gradient(to bottom, ${GRID_LINE_COLOR} 1px, transparent 1px)`,
        ].join(","),
        backgroundSize: "8px 8px",
        backgroundColor: GRID_BG_COLOR,
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
            borderTop: line.baseline ? undefined : `1px dashed ${RULED_DASH_COLOR}`,
          }}
        />
      ))}
      {children}
    </div>
  );
}
