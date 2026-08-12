import {
  useRef, useState, useEffect, useCallback,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LetterFormation } from "@/data/letter-formation-catalog";
import { cn } from "@/lib/utils";
import { sampleSVGPath, validateTrace, type Point } from "@/lib/traceValidation";
import { stepZIndex, zOrderedStepIndices } from "./SignGlyph";

interface CompletedStep {
  stepIdx: number;
  strokeColor: string;
}

const TOLERANCE_PX = 27;

/**
 * Case carrée façon mots croisés : trace une lettre entière (tous ses signes,
 * un geste après l'autre) dans un même cadre bien centré. Utilisée à la fois
 * pour les rangées de mots et pour les grilles de mots croisés.
 */
export function LetterTraceCell({
  letter,
  size = 84,
  isActive,
  given = false,
  onSolved,
}: {
  letter: LetterFormation;
  size?: number;
  isActive: boolean;
  /** Case déjà "donnée" (résolue via un mot croisé) : lettre imprimée, non interactive. */
  given?: boolean;
  onSolved?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userPointsRef = useRef<Point[]>([]);
  const refPointsRef = useRef<Point[]>([]);
  const isDrawingRef = useRef(false);

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<CompletedStep[]>([]);
  const [status, setStatus] = useState<"idle" | "drawing" | "retry" | "solved">("idle");

  const w = size, h = size;
  const activeStep = letter.steps[currentStepIdx];
  const solved = given || status === "solved";

  // Réinitialiser si la lettre change
  useEffect(() => {
    setCurrentStepIdx(0);
    setCompletedSteps([]);
    setStatus("idle");
  }, [letter.char]);

  useEffect(() => {
    if (activeStep && !solved) {
      refPointsRef.current = sampleSVGPath(activeStep.pathD, 40);
    }
  }, [activeStep, solved]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, [w, h]);

  const drawCompleted = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    const sc = Math.min(w / 200, h / 200);
    const ox = (w - 200 * sc) / 2;
    const oy = (h - 200 * sc) / 2;
    const zOrderedCompleted = [...completedSteps].sort(
      (a, b) => stepZIndex(letter.steps[a.stepIdx] ?? { family: "courbe" }) - stepZIndex(letter.steps[b.stepIdx] ?? { family: "courbe" }),
    );
    for (const completed of zOrderedCompleted) {
      const stepInfo = letter.steps[completed.stepIdx];
      if (!stepInfo) continue;
      const refPts = sampleSVGPath(stepInfo.pathD, 35);
      if (refPts.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(refPts[0].x * sc + ox, refPts[0].y * sc + oy);
      for (let i = 1; i < refPts.length; i++) {
        ctx.lineTo(refPts[i].x * sc + ox, refPts[i].y * sc + oy);
      }
      ctx.strokeStyle = completed.strokeColor;
      ctx.lineWidth = Math.max(2, size / 12);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
  }, [completedSteps, h, letter.steps, w, size]);

  useEffect(() => {
    if (!given) drawCompleted();
  }, [drawCompleted, currentStepIdx, status, given]);

  const canvasCoords = (e: ReactPointerEvent<HTMLCanvasElement>): Point => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const svgCoords = (pt: Point): Point => {
    const sc = Math.min(w / 200, h / 200);
    const ox = (w - 200 * sc) / 2;
    const oy = (h - 200 * sc) / 2;
    return { x: (pt.x - ox) / sc, y: (pt.y - oy) / sc };
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (given || !isActive || !activeStep || solved || status === "retry") return;
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    setStatus("drawing");
    userPointsRef.current = [];
    drawCompleted();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pt = canvasCoords(e);
    userPointsRef.current.push(svgCoords(pt));
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.strokeStyle = "#5BAA6A";
    ctx.lineWidth = Math.max(2, size / 12);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pt = canvasCoords(e);
    userPointsRef.current.push(svgCoords(pt));
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (canvasRef.current?.hasPointerCapture(e.pointerId)) {
      canvasRef.current.releasePointerCapture(e.pointerId);
    }
    const result = validateTrace(userPointsRef.current, refPointsRef.current, TOLERANCE_PX);
    if (result.valid) {
      const newCompleted = [...completedSteps, { stepIdx: currentStepIdx, strokeColor: activeStep!.strokeColor }];
      setCompletedSteps(newCompleted);
      if (currentStepIdx + 1 < letter.steps.length) {
        setTimeout(() => setCurrentStepIdx((idx) => idx + 1), 350);
      } else {
        setStatus("solved");
        onSolved?.();
      }
    } else {
      setStatus("retry");
      setTimeout(() => {
        drawCompleted();
        setStatus("idle");
      }, 900);
    }
  };

  const sc = Math.min(w / 200, h / 200);
  const ox = (w - 200 * sc) / 2;
  const oy = (h - 200 * sc) / 2;
  const startPx = activeStep
    ? { x: activeStep.startXY[0] * sc + ox, y: activeStep.startXY[1] * sc + oy }
    : { x: 0, y: 0 };

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-[10px] border-2 overflow-hidden transition-colors",
        given
          ? "bg-[#FBF6EC] border-[#A9784F]/40"
          : solved
            ? "bg-white border-[#8FBF6F]"
            : isActive
              ? "bg-white border-[#A9784F]/50"
              : "bg-white border-[#4A3B2A]/12"
      )}
      style={{ width: w, height: h }}
    >
      {given ? (
        <div className="absolute inset-0 grid place-items-center">
          <span
            className="font-extrabold text-[#A9784F] leading-none select-none"
            style={{ fontSize: size * 0.5 }}
          >
            {letter.char}
          </span>
        </div>
      ) : (
        <>
          {!solved && (
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
              {zOrderedStepIndices(letter.steps).map((idx) => {
                const step = letter.steps[idx];
                const isDone = completedSteps.some((c) => c.stepIdx === idx);
                if (isDone) return null;
                const isCurrentStep = idx === currentStepIdx;
                return (
                  <path
                    key={idx}
                    d={step.pathD}
                    stroke={isCurrentStep ? (status === "retry" ? "#E05252" : "#9BB5CC") : "#B8CCE0"}
                    strokeWidth={isCurrentStep ? 10 : 7}
                    strokeLinecap="round"
                    strokeDasharray={isCurrentStep ? "8 6" : "5 7"}
                    fill="none"
                    opacity={isCurrentStep ? 0.85 : 0.3}
                  />
                );
              })}
            </svg>
          )}

          {isActive && !solved && (status === "idle" || status === "retry") && activeStep && (
            <div
              className="absolute w-3 h-3 rounded-full bg-[#5BAA6A] border-2 border-white shadow grid place-items-center z-10 animate-pulse pointer-events-none"
              style={{ left: startPx.x - 6, top: startPx.y - 6 }}
            >
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
          )}

          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={cn(
              "absolute inset-0 w-full h-full touch-none z-20",
              isActive && !solved ? "cursor-crosshair" : "cursor-default"
            )}
          />
        </>
      )}
    </div>
  );
}
