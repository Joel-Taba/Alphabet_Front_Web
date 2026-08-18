import { useMemo, useState, useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Volume2, Check } from "lucide-react";
import { AmaniMascot } from "./AmaniMascot";
import { ExerciseCompletePopup } from "./ExerciseCompletePopup";
import type { GeneratedWordSearch, GridPos } from "@/lib/wordSearchGenerator";
import { placedWordCells } from "@/lib/wordSearchGenerator";
import { useSignSpeech } from "@/hooks/useSignSpeech";
import { useLanguage, format } from "@/i18n/LanguageContext";
import { awardCompletion, awardRestartBonus } from "@/lib/progress";
import { nextWordGroupAfterCrossword } from "@/data/word-catalog";

/** Palette cyclique — un mot trouvé = une couleur, réutilisée dans la grille et la liste. */
const WORD_PALETTE = ["#4A90E2", "#8FBF6F", "#D9A84A", "#E0715A", "#B07CC6", "#4BB3A5"];

function key(p: GridPos): string {
  return `${p.row},${p.col}`;
}

/** Cases traversées entre deux points, uniquement si l'axe est droit (horizontal, vertical
 * ou diagonal à 45°) — une sélection "en biais" quelconque est ignorée (retourne null). */
function straightLineBetween(start: GridPos, end: GridPos): GridPos[] | null {
  const dr = end.row - start.row;
  const dc = end.col - start.col;
  if (dr === 0 && dc === 0) return [start];
  const absR = Math.abs(dr);
  const absC = Math.abs(dc);
  if (dr !== 0 && dc !== 0 && absR !== absC) return null;
  const steps = Math.max(absR, absC);
  const stepR = dr === 0 ? 0 : dr / absR;
  const stepC = dc === 0 ? 0 : dc / absC;
  return Array.from({ length: steps + 1 }, (_, i) => ({ row: start.row + stepR * i, col: start.col + stepC * i }));
}

function sameCells(a: GridPos[], b: GridPos[]): boolean {
  return a.length === b.length && a.every((c, i) => c.row === b[i].row && c.col === b[i].col);
}

/**
 * `puzzleId`/`level` ne sont fournis que par l'étape du parcours (voir
 * exercice.mots-meles.$puzzleId.tsx) : c'est ce qui déclenche l'attribution de
 * points et le pop-up de fin d'exercice. Le mode libre de la bibliothèque
 * (grilles régénérées à la demande, non liées au parcours) omet ces props et
 * ne déclenche donc ni l'un ni l'autre, volontairement — même convention que
 * `CrosswordPlay`.
 */
export function WordSearchPlay({
  wordSearch,
  puzzleId,
  level,
}: {
  wordSearch: GeneratedWordSearch;
  puzzleId?: string;
  level?: number;
}) {
  const { speak } = useSignSpeech();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement>(null);

  const [found, setFound] = useState<Set<string>>(new Set());
  const [dragStart, setDragStart] = useState<GridPos | null>(null);
  const [dragCurrent, setDragCurrent] = useState<GridPos | null>(null);
  const [showCompletePopup, setShowCompletePopup] = useState(false);
  const [awaitingRepeatCompletion, setAwaitingRepeatCompletion] = useState(false);

  const wordColor = useMemo(() => {
    const m = new Map<string, string>();
    wordSearch.placed.forEach((p, i) => m.set(p.word.id, WORD_PALETTE[i % WORD_PALETTE.length]));
    return m;
  }, [wordSearch]);

  const foundCellColor = useMemo(() => {
    const m = new Map<string, string>();
    wordSearch.placed.forEach((p) => {
      if (!found.has(p.word.id)) return;
      const color = wordColor.get(p.word.id)!;
      placedWordCells(p).forEach((c) => m.set(key(c), color));
    });
    return m;
  }, [wordSearch, found, wordColor]);

  const totalWords = wordSearch.placed.length;
  const allFound = found.size === totalWords && totalWords > 0;

  useEffect(() => {
    if (!allFound || !puzzleId) return;
    awardCompletion({ typeEtape: "MOTS_MELES", modalite: "EXERCICE", etapeCode: puzzleId, palier: lang === "fr" ? 4 : 3 });
  }, [allFound, puzzleId, lang]);

  useEffect(() => {
    if (allFound && awaitingRepeatCompletion) {
      awardRestartBonus();
      setAwaitingRepeatCompletion(false);
    }
  }, [allFound, awaitingRepeatCompletion]);

  useEffect(() => {
    if (!allFound || level == null) return;
    const timer = setTimeout(() => setShowCompletePopup(true), 300);
    return () => clearTimeout(timer);
  }, [allFound, level]);

  const nextWordGroup = level != null ? nextWordGroupAfterCrossword(level) : undefined;

  const cellFromPoint = useCallback(
    (clientX: number, clientY: number): GridPos | null => {
      const el = gridRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (rect.width === 0 || rect.height === 0) return null;
      const col = Math.min(wordSearch.size - 1, Math.max(0, Math.floor((x / rect.width) * wordSearch.size)));
      const row = Math.min(wordSearch.size - 1, Math.max(0, Math.floor((y / rect.height) * wordSearch.size)));
      return { row, col };
    },
    [wordSearch.size]
  );

  const finishSelection = useCallback(
    (start: GridPos, end: GridPos) => {
      const cells = straightLineBetween(start, end);
      if (!cells || cells.length < 2) return;
      const match = wordSearch.placed.find((p) => {
        if (found.has(p.word.id)) return false;
        const wordCells = placedWordCells(p);
        return sameCells(wordCells, cells) || sameCells(wordCells, [...cells].reverse());
      });
      if (match) {
        setFound((prev) => new Set(prev).add(match.word.id));
        speak(match.word.fr);
      }
    },
    [wordSearch, found, speak]
  );

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (!cell) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragStart(cell);
    setDragCurrent(cell);
  };
  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStart) return;
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (cell) setDragCurrent(cell);
  };
  const handlePointerUp = () => {
    if (dragStart && dragCurrent) finishSelection(dragStart, dragCurrent);
    setDragStart(null);
    setDragCurrent(null);
  };

  const liveSelectionCells = dragStart && dragCurrent ? straightLineBetween(dragStart, dragCurrent) : null;
  const liveSelectionKeys = useMemo(() => new Set((liveSelectionCells ?? []).map(key)), [liveSelectionCells]);

  const cellSize = wordSearch.size >= 11 ? 28 : wordSearch.size >= 9 ? 32 : 38;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Carte de progression, façon jeu : mascotte + barre "X sur Y mots" */}
      <div
        className="w-full max-w-sm rounded-[24px] p-4 shadow-sm flex items-center gap-3.5 text-white"
        style={{ background: "linear-gradient(135deg, #4A90E2 0%, #2D6BBF 100%)" }}
      >
        <AmaniMascot pose={allFound ? "celebration" : "curiosite"} size="small" />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold leading-snug">
            {allFound ? t.motsMeles.doneTitle : t.motsMeles.hintTitle}
          </p>
          <p className="text-[12px] text-white/80 mt-0.5">
            {allFound ? t.motsMeles.doneBody : t.motsMeles.hintBody}
          </p>
          <div
            className="mt-2.5 flex items-center gap-2"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={totalWords}
            aria-valuenow={found.size}
            aria-label={format(t.motsMeles.wordsFoundLabel, { solved: found.size, total: totalWords })}
          >
            <div className="flex-1 h-2 rounded-full bg-white/25 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${totalWords ? (found.size / totalWords) * 100 : 0}%` }}
              />
            </div>
            <span className="text-[11px] font-extrabold tabular-nums shrink-0">
              {found.size}/{totalWords}
            </span>
          </div>
        </div>
      </div>

      {/* Grille */}
      <div
        className="w-full max-w-full rounded-[28px] p-3 shadow-sm overflow-x-auto"
        style={{ background: "linear-gradient(160deg, #FBF6EC 0%, #F0E4CC 100%)", border: "1px solid #4A3B2A15" }}
      >
        <div
          ref={gridRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="grid mx-auto w-fit select-none touch-none"
          style={{ gridTemplateColumns: `repeat(${wordSearch.size}, ${cellSize}px)` }}
        >
          {wordSearch.cells.map((rowLetters, row) =>
            rowLetters.map((letter, col) => {
              const k = `${row},${col}`;
              const foundColor = foundCellColor.get(k);
              const isLiveSelected = liveSelectionKeys.has(k);
              return (
                <div
                  key={k}
                  className="relative grid place-items-center font-extrabold"
                  style={{ width: cellSize, height: cellSize, fontSize: cellSize * 0.42, color: "#4A3B2A" }}
                >
                  {foundColor && (
                    <div
                      className="absolute inset-0.5 rounded-full pointer-events-none"
                      style={{ background: `${foundColor}55` }}
                    />
                  )}
                  {!foundColor && isLiveSelected && (
                    <div className="absolute inset-0.5 rounded-full pointer-events-none bg-[#4A3B2A]/15" />
                  )}
                  <span className="relative z-10">{letter}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Liste des mots à trouver : chaque mot a son bouton d'écoute et sa couleur */}
      <div className="w-full max-w-sm flex flex-col gap-2.5">
        {wordSearch.placed.map((p) => {
          const isFound = found.has(p.word.id);
          const color = wordColor.get(p.word.id)!;
          return (
            <button
              key={p.word.id}
              type="button"
              onClick={() => speak(p.word.fr)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xs active:scale-98 transition-all"
              style={{ background: isFound ? `${color}1F` : "#FBF6EC" }}
            >
              <span
                className="w-7 h-7 rounded-full text-white grid place-items-center shrink-0 transition-colors"
                style={{ background: color }}
              >
                {isFound && <Check className="w-4 h-4" strokeWidth={3} />}
              </span>
              <Volume2 className="w-4 h-4 shrink-0" style={{ color }} />
              <span
                className="text-[13px] font-semibold uppercase"
                style={{ color: isFound ? color : "#4A3B2A", textDecoration: isFound ? "line-through" : "none" }}
              >
                {p.word.fr}
              </span>
            </button>
          );
        })}
      </div>

      {showCompletePopup && (
        <ExerciseCompletePopup
          onBackHome={() => navigate({ to: "/accueil" })}
          onNext={
            nextWordGroup
              ? () => navigate({ to: "/cours/mots/$groupId", params: { groupId: nextWordGroup.id } })
              : undefined
          }
          onRestart={() => {
            setFound(new Set());
            setShowCompletePopup(false);
            setAwaitingRepeatCompletion(true);
          }}
        />
      )}
    </div>
  );
}
