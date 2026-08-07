import { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Volume2, Sparkles, Check } from "lucide-react";
import { LetterTraceCell } from "./LetterTraceCell";
import { AmaniMascot } from "./AmaniMascot";
import { ExerciseCompletePopup } from "./ExerciseCompletePopup";
import { getLetterFormation } from "@/data/letter-style-resolver";
import type { GeneratedCrossword, PlacedWord } from "@/lib/crosswordGenerator";
import { useSignSpeech } from "@/hooks/useSignSpeech";
import { useLanguage, format } from "@/i18n/LanguageContext";
import { useWritingStyle } from "@/hooks/useWritingStyle";
import { awardCompletion, awardRestartBonus } from "@/lib/progress";
import { nextWordGroupAfterCrossword } from "@/data/word-catalog";

interface GridCell {
  row: number;
  col: number;
  char: string;
  number?: number;
  mystery: boolean;
}

/** Clés de toutes les cases occupées par un mot placé. */
function wordCellKeys(entry: PlacedWord): string[] {
  return entry.word.fr.split("").map((_, i) => {
    const row = entry.direction === "across" ? entry.row : entry.row + i;
    const col = entry.direction === "across" ? entry.col + i : entry.col;
    return `${row},${col}`;
  });
}

/** Palette cyclique pour les pastilles d'indices, façon jeu coloré. */
const CLUE_PALETTE = [
  { bg: "#EAF1FB", text: "#2D6BBF", badge: "#4A90E2" },
  { bg: "#EFF6E9", text: "#5E8E3E", badge: "#8FBF6F" },
  { bg: "#FBF1DE", text: "#8A6800", badge: "#D9A84A" },
];

/**
 * `puzzleId`/`level` ne sont fournis que par l'étape du parcours (voir
 * exercice.mots-croises.$puzzleId.tsx) : c'est ce qui déclenche l'attribution
 * de points et le pop-up de fin d'exercice. Le mode libre de la bibliothèque
 * (grilles régénérées à la demande, non liées au parcours) omet ces props et
 * ne déclenche donc ni l'un ni l'autre, volontairement.
 */
export function CrosswordPlay({
  crossword,
  puzzleId,
  level,
}: {
  crossword: GeneratedCrossword;
  puzzleId?: string;
  level?: number;
}) {
  const { speak } = useSignSpeech();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const writingStyle = useWritingStyle();
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [justFinished, setJustFinished] = useState(false);
  const [showCompletePopup, setShowCompletePopup] = useState(false);
  // Incrémenté à chaque "Recommencer" pour forcer le remontage des
  // LetterTraceCell de la grille (elles gèrent leur propre état interne).
  const [restartKey, setRestartKey] = useState(0);
  // Vrai entre le clic sur "Recommencer" et la prochaine grille résolue en
  // entier : le bonus n'est attribué qu'à ce moment-là (voir l'effet plus
  // bas), jamais au clic lui-même.
  const [awaitingRepeatCompletion, setAwaitingRepeatCompletion] = useState(false);

  const { cells, sequence, clues, mysteryWord } = useMemo(() => {
    const byKey = new Map<string, GridCell>();
    const seq: GridCell[] = [];
    const clueList: { number: number; wordId: string }[] = [];
    let mystery: GeneratedCrossword["placed"][number] | undefined;

    for (const entry of crossword.placed) {
      if (entry.mystery) mystery = entry;
      clueList.push({ number: entry.number, wordId: entry.word.id });
      const chars = entry.word.fr.split("");
      chars.forEach((char, i) => {
        const row = entry.direction === "across" ? entry.row : entry.row + i;
        const col = entry.direction === "across" ? entry.col + i : entry.col;
        const key = `${row},${col}`;
        if (byKey.has(key)) return;
        const cell: GridCell = {
          row, col, char,
          number: i === 0 ? entry.number : undefined,
          mystery: entry.mystery,
        };
        byKey.set(key, cell);
        seq.push(cell);
      });
    }
    clueList.sort((a, b) => a.number - b.number);
    return { cells: Array.from(byKey.values()), sequence: seq, clues: clueList, mysteryWord: mystery };
  }, [crossword]);

  const activeCell = sequence.find((c) => !solved.has(`${c.row},${c.col}`));
  const allSolved = solved.size === sequence.length && sequence.length > 0;

  useEffect(() => {
    if (!allSolved || !puzzleId) return;
    awardCompletion({ typeEtape: "MOTS_CROISES", modalite: "EXERCICE", etapeCode: puzzleId, palier: lang === "fr" ? 4 : 3 });
  }, [allSolved, puzzleId, lang]);

  useEffect(() => {
    if (allSolved && awaitingRepeatCompletion) {
      awardRestartBonus();
      setAwaitingRepeatCompletion(false);
    }
  }, [allSolved, awaitingRepeatCompletion]);

  // Pop-up "Suivant / Retour à l'accueil" — seulement pour une grille du
  // parcours (level fourni). Si un mot mystère doit être révélé, on attend
  // que ce petit écran soit fermé pour ne pas superposer deux pop-ups.
  useEffect(() => {
    if (!allSolved || level == null || mysteryWord) return;
    const timer = setTimeout(() => setShowCompletePopup(true), 300);
    return () => clearTimeout(timer);
  }, [allSolved, level, mysteryWord]);

  const nextWordGroup = level != null ? nextWordGroupAfterCrossword(level) : undefined;

  // Progrès par MOT (pas par case) pour l'indicateur "X sur Y mots trouvés"
  // et le fond coloré qui met en valeur chaque mot complété dans la grille.
  const { solvedWordsCount, solvedWordCellKeys } = useMemo(() => {
    const keys = new Set<string>();
    let count = 0;
    for (const entry of crossword.placed) {
      const wordKeys = wordCellKeys(entry);
      if (wordKeys.every((k) => solved.has(k))) {
        count++;
        wordKeys.forEach((k) => keys.add(k));
      }
    }
    return { solvedWordsCount: count, solvedWordCellKeys: keys };
  }, [crossword, solved]);
  const totalWords = crossword.placed.length;

  const handleCellSolved = useCallback((key: string) => {
    setSolved((prev) => {
      const next = new Set(prev).add(key);
      if (next.size === sequence.length) setTimeout(() => setJustFinished(true), 300);
      return next;
    });
  }, [sequence.length]);

  const cellByPos = new Map(cells.map((c) => [`${c.row},${c.col}`, c]));
  const cellSize = crossword.cols >= 8 ? 40 : crossword.cols >= 6 ? 48 : 60;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Carte de progression, façon jeu : mascotte + barre "X sur Y mots" */}
      <div
        className="w-full max-w-sm rounded-[24px] p-4 shadow-sm flex items-center gap-3.5 text-white"
        style={{ background: "linear-gradient(135deg, #4A90E2 0%, #2D6BBF 100%)" }}
      >
        <AmaniMascot pose={allSolved ? "celebration" : "curiosite"} size="small" />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold leading-snug">
            {allSolved ? t.motsCroises.doneTitle : t.motsCroises.hintTitle}
          </p>
          <p className="text-[12px] text-white/80 mt-0.5">
            {allSolved ? t.motsCroises.doneBody : t.motsCroises.hintBody}
          </p>
          <div
            className="mt-2.5 flex items-center gap-2"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={totalWords}
            aria-valuenow={solvedWordsCount}
            aria-label={format(t.motsCroises.wordsFoundLabel, { solved: solvedWordsCount, total: totalWords })}
          >
            <div className="flex-1 h-2 rounded-full bg-white/25 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${totalWords ? (solvedWordsCount / totalWords) * 100 : 0}%` }}
              />
            </div>
            <span className="text-[11px] font-extrabold tabular-nums shrink-0">
              {solvedWordsCount}/{totalWords}
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
          className="grid gap-1.5 mx-auto w-fit"
          style={{ gridTemplateColumns: `repeat(${crossword.cols}, ${cellSize}px)` }}
        >
          {Array.from({ length: crossword.rows }).map((_, row) =>
            Array.from({ length: crossword.cols }).map((_, col) => {
              const cell = cellByPos.get(`${row},${col}`);
              if (!cell) {
                return <div key={`${row}-${col}`} style={{ width: cellSize, height: cellSize }} />;
              }
              const key = `${row},${col}`;
              const letter = getLetterFormation(cell.char, writingStyle);
              if (!letter) return <div key={key} style={{ width: cellSize, height: cellSize }} />;
              const isWordFound = solvedWordCellKeys.has(key);
              return (
                <div key={key} className="relative">
                  {isWordFound && (
                    <div
                      className="absolute -inset-1 rounded-[14px] pointer-events-none"
                      style={{ background: cell.mystery ? "#D9A84A2E" : "#8FBF6F2E" }}
                    />
                  )}
                  {cell.number && (
                    <span className="absolute -top-1 -left-1 z-30 text-[9px] font-extrabold text-[#4A90E2] bg-white rounded-full w-4 h-4 grid place-items-center shadow-sm">
                      {cell.number}
                    </span>
                  )}
                  {cell.mystery && solved.has(key) && (
                    <span className="absolute -top-1.5 -right-1.5 z-30 text-[#D9A84A]">
                      <Sparkles className="w-3.5 h-3.5" fill="currentColor" />
                    </span>
                  )}
                  <LetterTraceCell
                    key={`${key}-r${restartKey}`}
                    letter={letter}
                    size={cellSize}
                    isActive={activeCell?.row === row && activeCell?.col === col}
                    onSolved={() => handleCellSolved(key)}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Liste des indices : chaque mot a son numéro et son bouton d'écoute */}
      <div className="w-full max-w-sm flex flex-col gap-2.5">
        {clues.map(({ number, wordId }, i) => {
          const entry = crossword.placed.find((p) => p.word.id === wordId && p.number === number);
          if (!entry) return null;
          const isWordSolved = wordCellKeys(entry).every((k) => solved.has(k));
          const palette = CLUE_PALETTE[i % CLUE_PALETTE.length];
          return (
            <button
              key={`${wordId}-${number}`}
              type="button"
              onClick={() => speak(entry.word.fr)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xs active:scale-98 transition-all"
              style={{ background: isWordSolved ? "#8FBF6F1F" : palette.bg }}
            >
              <span
                className="w-7 h-7 rounded-full text-white text-[12px] font-extrabold grid place-items-center shrink-0 transition-colors"
                style={{ background: isWordSolved ? "#8FBF6F" : palette.badge }}
              >
                {isWordSolved ? <Check className="w-4 h-4" strokeWidth={3} /> : number}
              </span>
              <Volume2 className="w-4 h-4 shrink-0" style={{ color: isWordSolved ? "#5E8E3E" : palette.badge }} />
              <span className="text-[13px] font-semibold" style={{ color: isWordSolved ? "#4A7A30" : palette.text }}>
                {entry.direction === "across" ? t.motsCroises.across : t.motsCroises.down}
              </span>
            </button>
          );
        })}
      </div>

      {/* Célébration finale : un mot de la grille mis en avant à l'honneur */}
      {justFinished && mysteryWord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-4 w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
            <AmaniMascot pose="victoire_palier" size="medium" priority />
            <div>
              <h2 className="text-[22px] font-extrabold text-[#4A3B2A]">{t.motsCroises.featuredTitle}</h2>
              <p className="text-[13px] text-[#7A6A55] mt-1">{t.motsCroises.featuredBody}</p>
            </div>
            <div className="flex gap-1.5">
              {mysteryWord.word.fr.split("").map((ch, i) => (
                <span
                  key={i}
                  className="w-10 h-10 rounded-xl bg-[#D9A84A]/15 border-2 border-[#D9A84A] grid place-items-center text-[20px] font-extrabold text-[#8A6800]"
                >
                  {ch}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => speak(mysteryWord.word.fr)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D9A84A]/15 text-[#8A6800] font-bold text-sm active:scale-95 transition-transform"
            >
              <Volume2 className="w-4 h-4" /> {mysteryWord.word.fr}
            </button>
            <button
              type="button"
              onClick={() => {
                setJustFinished(false);
                if (level != null) setShowCompletePopup(true);
              }}
              className="w-full py-3 px-4 rounded-xl font-extrabold text-sm bg-[#8FBF6F] hover:bg-[#7AAE5A] text-white shadow-md active:scale-95 transition-all"
            >
              {t.motsCroises.continueLabel}
            </button>
          </div>
        </div>
      )}

      {showCompletePopup && (
        <ExerciseCompletePopup
          onBackHome={() => navigate({ to: "/accueil" })}
          onNext={
            nextWordGroup
              ? () => navigate({ to: "/cours/mots/$groupId", params: { groupId: nextWordGroup.id } })
              : undefined
          }
          onRestart={() => {
            setSolved(new Set());
            setJustFinished(false);
            setShowCompletePopup(false);
            setRestartKey((k) => k + 1);
            setAwaitingRepeatCompletion(true);
          }}
        />
      )}
    </div>
  );
}
