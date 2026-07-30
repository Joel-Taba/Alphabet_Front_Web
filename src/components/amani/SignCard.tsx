import { Check, X, ArrowRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignGlyph, glyphColorByFamily } from "./SignGlyph";

export type SignFamily = "trait" | "courbe" | "point" | "crochet";
export type SignState = "default" | "selected" | "correct" | "incorrect" | "misplaced" | "locked";

interface SignCardProps {
  family: SignFamily;
  state?: SignState;
  size?: number;
  onClick?: () => void;
  label?: string;
}

export function SignCard({ family, state = "default", size = 88, onClick, label }: SignCardProps) {
  const { bg, stroke } = glyphColorByFamily[family];

  const stateRing: Record<SignState, string> = {
    default: "",
    selected: "ring-4 ring-text-primary",
    correct: "ring-4 ring-success",
    incorrect: "ring-4 ring-error animate-shake",
    misplaced: "ring-4 ring-neutral-warning",
    locked: "opacity-50 grayscale cursor-not-allowed",
  };

  const overlay: Record<SignState, React.ReactNode> = {
    default: null,
    selected: null,
    correct: <Check className="h-5 w-5 text-surface" strokeWidth={3} />,
    incorrect: <X className="h-5 w-5 text-surface" strokeWidth={3} />,
    misplaced: <ArrowRight className="h-5 w-5 text-surface" strokeWidth={3} />,
    locked: <Lock className="h-5 w-5 text-surface" strokeWidth={2.5} />,
  };

  const badgeBg: Record<SignState, string> = {
    default: "",
    selected: "",
    correct: "bg-success",
    incorrect: "bg-error",
    misplaced: "bg-neutral-warning",
    locked: "bg-text-secondary",
  };

  // Taille du SVG dans le badge : 70 % du badge lui-même
  const glyphSize = Math.round(size * 0.7);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === "locked"}
      aria-label={label ?? `Signe ${family}`}
      className={cn(
        "relative inline-flex items-center justify-center rounded-2xl transition-transform select-none",
        state !== "locked" && "hover:-translate-y-0.5 active:translate-y-0",
        stateRing[state],
      )}
      style={{
        width: size,
        height: size,
        background: bg,
        boxShadow: "0 3px 0 0 rgba(0,0,0,0.18)",
      }}
    >
      <SignGlyph
        family={family}
        stroke={stroke}
        style={{ width: glyphSize, height: glyphSize }}
      />
      {overlay[state] && (
        <span
          className={cn(
            "absolute -top-2 -right-2 grid h-7 w-7 place-items-center rounded-full",
            badgeBg[state],
          )}
        >
          {overlay[state]}
        </span>
      )}
    </button>
  );
}