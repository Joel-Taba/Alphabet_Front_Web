import {
  useRef, useState, useEffect, useCallback, type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Volume2, RotateCcw, Lock } from "lucide-react";
import { AmaniMascot } from "./AmaniMascot";
import { cn } from "@/lib/utils";
import { sampleSVGPath, validateTrace, type Point } from "@/lib/traceValidation";

/** Un tracé unique (signe atomique ou étape de lettre/chiffre) pouvant être exercé en cahier. */
export interface TraceableEntry {
  id: string;
  pathD: string;
  startXY: [number, number];
  /** Où le tracé s'arrête. Optionnel : sans elle, seule la pastille de départ est affichée (comportement historique). */
  endXY?: [number, number];
  strokeColor: string;
  /** Le point se remplit (disque) plutôt que de rester un simple contour. */
  family?: string;
}

export type OccurrenceStatus = "idle" | "drawing" | "success" | "retry";

export interface OccurrenceState {
  status: OccurrenceStatus;
  attempts: number;
}

// ─── OccurrenceCanvas ─────────────────────────────────────────────────────────
interface OccurrenceCanvasProps {
  entry: TraceableEntry;
  state: OccurrenceState;
  isActive: boolean;
  onSuccess: () => void;
  onRetry: () => void;
  /** Dimensions de la zone de tracé (en px CSS) */
  w: number;
  h: number;
  /** Tolérance en % de la hauteur du signe */
  tolerancePct: number;
}

export function OccurrenceCanvas({
  entry, state, isActive, onSuccess, onRetry, w, h, tolerancePct,
}: OccurrenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userPointsRef = useRef<Point[]>([]);
  const refPointsRef = useRef<Point[]>([]);
  const isDrawingRef = useRef(false);
  const [localStatus, setLocalStatus] = useState<OccurrenceStatus>(state.status);

  // Synchroniser le statut externe
  useEffect(() => { setLocalStatus(state.status); }, [state.status]);

  // Échantillonner le chemin de référence lors du montage
  useEffect(() => {
    refPointsRef.current = sampleSVGPath(entry.pathD, 30);
  }, [entry.pathD]);

  // Initialiser le canvas (DPR pour Retina)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, [w, h]);

  // Dessiner le tracé de succès (chemin plein coloré) sur le canvas
  const drawSuccessPath = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    const sc = Math.min(w / 200, h / 200);
    const ox = (w - 200 * sc) / 2;
    const oy = (h - 200 * sc) / 2;
    const refPts = refPointsRef.current;
    if (refPts.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(refPts[0].x * sc + ox, refPts[0].y * sc + oy);
    for (let i = 1; i < refPts.length; i++) {
      ctx.lineTo(refPts[i].x * sc + ox, refPts[i].y * sc + oy);
    }
    if (entry.family === "point") {
      ctx.closePath();
      ctx.fillStyle = entry.strokeColor;
      ctx.fill();
    }
    ctx.strokeStyle = entry.strokeColor;
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.stroke();
  }, [w, h, entry.strokeColor]);

  // Quand succès → dessiner le tracé plein
  useEffect(() => {
    if (localStatus === "success") drawSuccessPath();
  }, [localStatus, drawSuccessPath]);

  const svgToCanvas = (pt: Point): Point => {
    const sc = Math.min(w / 200, h / 200);
    const ox = (w - 200 * sc) / 2;
    const oy = (h - 200 * sc) / 2;
    return { x: pt.x * sc + ox, y: pt.y * sc + oy };
  };
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
    if (!isActive || localStatus === "success") return;
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    setLocalStatus("drawing");
    userPointsRef.current = [];
    const ctx = canvasRef.current?.getContext("2d"); if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    const pt = canvasCoords(e);
    userPointsRef.current.push(svgCoords(pt));
    ctx.beginPath(); ctx.moveTo(pt.x, pt.y);
    ctx.strokeStyle = "#5BAA6A"; ctx.lineWidth = 3.5;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d"); if (!ctx) return;
    const pt = canvasCoords(e);
    userPointsRef.current.push(svgCoords(pt));
    ctx.lineTo(pt.x, pt.y); ctx.stroke();
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (canvasRef.current?.hasPointerCapture(e.pointerId))
      canvasRef.current.releasePointerCapture(e.pointerId);
    // Validation avec la tolérance convertie en espace 200×200
    const tolerancePx = (tolerancePct / 100) * 200;
    const result = validateTrace(
      userPointsRef.current, refPointsRef.current, tolerancePx
    );
    if (result.valid) {
      setLocalStatus("success");
      setTimeout(onSuccess, 600);
    } else {
      setLocalStatus("retry");
      setTimeout(() => {
        // Effacer automatiquement pour réessayer
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, w, h);
        setLocalStatus("idle");
        onRetry();
      }, 1200);
    }
  };

  const handleClear = () => {
    if (localStatus === "success") return;
    const ctx = canvasRef.current?.getContext("2d");
    ctx?.clearRect(0, 0, w, h);
    userPointsRef.current = [];
    setLocalStatus("idle");
  };

  // Pastilles départ/arrivée (dans l'espace CSS px)
  const startPx = svgToCanvas({ x: entry.startXY[0], y: entry.startXY[1] });
  const endPx = entry.endXY ? svgToCanvas({ x: entry.endXY[0], y: entry.endXY[1] }) : null;
  const startEndMerged =
    !!entry.endXY && entry.startXY[0] === entry.endXY[0] && entry.startXY[1] === entry.endXY[1];

  return (
    <div
      className="relative shrink-0 rounded-[10px] overflow-hidden border"
      style={{
        width: w, height: h,
        borderColor: localStatus === "success"
          ? "#8FBF6F"
          : isActive
            ? "#A9784F40"
            : "#4A3B2A10",
        boxShadow: localStatus === "success" ? "0 0 0 2px #8FBF6F40" : undefined,
      }}
    >
      {/* ── Signe modèle en pointillés (tracé exact du chemin de référence) ── */}
      {localStatus !== "success" && (
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d={entry.pathD}
            stroke={localStatus === "retry" ? "#D9A84A" : "#9BB5CC"}
            strokeWidth={2.5}
            strokeDasharray="7 5"
            strokeLinecap="round"
            fill={entry.family === "point" ? (localStatus === "retry" ? "#D9A84A" : "#9BB5CC") : "none"}
            opacity={localStatus === "retry" ? 0.9 : 0.75}
          />
        </svg>
      )}

      {/* ── Pastille(s) départ/arrivée ── */}
      {(localStatus === "idle" || localStatus === "retry") && isActive && (
        startEndMerged ? (
          <div
            className="absolute w-2.5 h-2.5 rounded-full border border-white shadow pointer-events-none z-10 animate-start-end-alternate"
            style={{ left: startPx.x - 5, top: startPx.y - 5 }}
            aria-label="Point de départ et d'arrivée"
          />
        ) : (
          <>
            <div
              className="absolute w-2.5 h-2.5 rounded-full bg-[#5BAA6A] border border-white shadow pointer-events-none z-10 animate-pulse"
              style={{ left: startPx.x - 5, top: startPx.y - 5 }}
              aria-label="Point de départ"
            />
            {endPx && (
              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-[#E05252] border border-white shadow pointer-events-none z-10 animate-pulse"
                style={{ left: endPx.x - 5, top: endPx.y - 5 }}
                aria-label="Point d'arrivée"
              />
            )}
          </>
        )
      )}

      {/* ── Canvas interactif ── */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={cn(
          "absolute inset-0 w-full h-full touch-none",
          !isActive || localStatus === "success" ? "cursor-default" : "cursor-crosshair"
        )}
        aria-label="Zone de tracé"
      />

      {/* ── Overlay succès ── */}
      {localStatus === "success" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#8FBF6F]/10 z-20 pointer-events-none">
          <div className="animate-in zoom-in duration-300">
            <AmaniMascot pose="mini_reussite" size="avatar" />
          </div>
        </div>
      )}

      {/* ── Overlay retry ── */}
      {localStatus === "retry" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-[#F0C040]/10 z-20 pointer-events-none">
          <AmaniMascot pose="mini_reessai" size="avatar" />
          <span className="text-[10px] font-bold text-[#8A6800] text-center px-1 leading-tight">
            Presque !{"\n"}On réessaie
          </span>
        </div>
      )}

      {/* ── Bouton effacer ── */}
      {isActive && localStatus !== "success" && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Effacer le tracé"
          className="absolute bottom-1 right-1 z-30 w-6 h-6 rounded-full bg-[#E05252]/20 text-[#E05252] flex items-center justify-center hover:bg-[#E05252] hover:text-white transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ─── RepetitionRow ────────────────────────────────────────────────────────────
interface RepetitionRowProps {
  entry: TraceableEntry;
  /** Libellé affiché dans l'en-tête de la ligne (ex: nom du signe, "Signe 1"...). */
  label: string;
  /** Appelé quand l'enfant touche le bouton audio (le parent gère la synthèse vocale). */
  onSpeak: () => void;
  /** Contenu optionnel affiché avant le libellé (badge de famille, numéro d'étape...). */
  badge?: ReactNode;
  repetitions: number;
  tolerance: number;
  /** Texte affiché une fois toutes les occurrences réussies. */
  doneLabel: string;
  onAllDone?: () => void;
  /** Étape verrouillée tant que la précédente n'est pas réussie (reproduction dans l'ordre). */
  locked?: boolean;
}

export function RepetitionRow({
  entry, label, onSpeak, badge, repetitions, tolerance, doneLabel, onAllDone, locked = false,
}: RepetitionRowProps) {
  const [occurrences, setOccurrences] = useState<OccurrenceState[]>(
    () => Array.from({ length: repetitions }, () => ({ status: "idle" as OccurrenceStatus, attempts: 0 }))
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [allDone, setAllDone] = useState(false);

  // Reset si repetitions ou entrée change
  useEffect(() => {
    setOccurrences(Array.from({ length: repetitions }, () => ({ status: "idle", attempts: 0 })));
    setActiveIndex(0); setAllDone(false);
  }, [repetitions, entry.id]);

  const handleSuccess = useCallback((idx: number) => {
    setOccurrences((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], status: "success" };
      return next;
    });
    if (idx + 1 < repetitions) {
      setActiveIndex(idx + 1);
    } else {
      setAllDone(true);
      onAllDone?.();
    }
  }, [repetitions, onAllDone]);

  const handleRetry = useCallback((idx: number) => {
    setOccurrences((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], status: "idle", attempts: (next[idx].attempts || 0) + 1 };
      return next;
    });
  }, []);

  // Dimensions de chaque occurrence (responsive)
  const OCC_W = 100; const OCC_H = 140;

  return (
    <div
      className={cn(
        "flex flex-col rounded-[20px] overflow-hidden border transition-all",
        locked
          ? "border-[#4A3B2A]/10 opacity-50"
          : allDone
            ? "border-[#8FBF6F]/60 shadow-[0_4px_16px_rgba(143,191,111,0.18)]"
            : "border-[#4A3B2A]/10 shadow-[0_2px_8px_rgba(74,59,42,0.08)]"
      )}
    >
      {/* En-tête de la ligne */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#FBF6EC] border-b border-[#4A3B2A]/10">
        <div className="flex items-center gap-2">
          {badge}
          <span className="text-[14px] font-bold text-[#4A3B2A]">{label}</span>
          {allDone && <span className="text-[13px] text-[#8FBF6F] font-bold">✓ {doneLabel}</span>}
        </div>
        {locked ? (
          <div
            className="w-8 h-8 grid place-items-center rounded-full bg-[#4A3B2A]/10 text-[#7A6A55]"
            aria-label="Étape verrouillée"
          >
            <Lock className="w-4 h-4" />
          </div>
        ) : (
          <button
            type="button"
            onClick={onSpeak}
            aria-label={label}
            className="w-8 h-8 grid place-items-center rounded-full bg-[#A9784F]/15 text-[#4A3B2A] hover:bg-[#A9784F] hover:text-white transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Zone du cahier, lignes réglées façon Seyès */}
      <div
        className="relative overflow-x-auto"
        style={{
          backgroundColor: "#FFFFFF",
          minHeight: OCC_H + 24,
        }}
      >
        {/* Lignes Seyès de référence — mêmes 4 lignes équidistantes (intervalle
            60 dans l'espace lettre 0-200) que CahierFrame.tsx, converties en
            pixels ici via l'échelle fixe de OccurrenceCanvas (sc=0.5, oy=20)
            plus le padding vertical (py-3=12px) de la zone d'occurrences :
            pixelY = 32 + yLettre * 0.5. */}
        {[10, 70, 130, 190].map((yLettre, i) => (
          <div
            key={yLettre}
            className="absolute left-0 right-0"
            style={{
              top: 32 + yLettre * 0.5,
              height: i === 2 ? 1.5 : 1,
              backgroundColor: i === 2 ? "#E05252" : "#4A90E2",
              opacity: 0.8,
            }}
          />
        ))}

        {/* Occurrences côte à côte */}
        <div className="relative z-10 flex items-center gap-2.5 px-3 py-3">
          {occurrences.map((occ, idx) => (
            <OccurrenceCanvas
              key={`${entry.id}-occ-${idx}`}
              entry={entry}
              state={occ}
              isActive={idx === activeIndex && !allDone && !locked}
              onSuccess={() => handleSuccess(idx)}
              onRetry={() => handleRetry(idx)}
              w={OCC_W}
              h={OCC_H}
              tolerancePct={tolerance}
            />
          ))}

          {/* Indicateurs de progression */}
          <div className="flex flex-col gap-1.5 ms-1">
            {occurrences.map((occ, idx) => (
              <div
                key={idx}
                className="w-2 h-2 rounded-full transition-colors"
                style={{
                  backgroundColor:
                    occ.status === "success"
                      ? "#8FBF6F"
                      : idx === activeIndex
                        ? "#A9784F"
                        : "#4A3B2A20",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
