import { useMemo, useState, useCallback } from "react";
import { Volume2, Sparkles } from "lucide-react";
import { LetterTraceCell } from "./LetterTraceCell";
import { AmaniMascot } from "./AmaniMascot";
import { getLetterFormation } from "@/data/letter-style-resolver";
import type { GeneratedCrossword } from "@/lib/crosswordGenerator";
import { useSignSpeech } from "@/hooks/useSignSpeech";
import { useLanguage } from "@/i18n/LanguageContext";
import { useWritingStyle } from "@/hooks/useWritingStyle";

interface GridCell {
  row: number;
  col: number;
  char: string;
  number?: number;
  mystery: boolean;
}

export function CrosswordPlay({ crossword }: { crossword: GeneratedCrossword }) {
  const { speak } = useSignSpeech();
  const { t } = useLanguage();
  const writingStyle = useWritingStyle();
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [justFinished, setJustFinished] = useState(false);

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
      <div className="w-full max-w-sm bg-[#FBF6EC] rounded-[20px] p-4 border border-[#4A3B2A]/10 shadow-sm flex items-center gap-3.5">
        <AmaniMascot pose={allSolved ? "celebration" : "curiosite"} size="small" />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-[#4A3B2A] leading-snug">
            {allSolved ? t.motsCroises.doneTitle : t.motsCroises.hintTitle}
          </p>
          <p className="text-[12px] text-[#7A6A55] mt-0.5">
            {allSolved ? t.motsCroises.doneBody : t.motsCroises.hintBody}
          </p>
        </div>
      </div>

      {/* Grille */}
      <div
        className="grid gap-1 bg-[#4A3B2A]/10 p-2 rounded-2xl shadow-inner overflow-x-auto max-w-full"
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
            return (
              <div key={key} className="relative">
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

      {/* Liste des indices : chaque mot a son numéro et son bouton d'écoute */}
      <div className="w-full max-w-sm flex flex-col gap-2.5">
        {clues.map(({ number, wordId }) => {
          const entry = crossword.placed.find((p) => p.word.id === wordId && p.number === number);
          if (!entry) return null;
          return (
            <button
              key={`${wordId}-${number}`}
              type="button"
              onClick={() => speak(entry.word.fr)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-[#4A3B2A]/10 shadow-xs active:scale-98 transition-transform"
            >
              <span className="w-6 h-6 rounded-full bg-[#4A90E2]/15 text-[#2D6BBF] text-[11px] font-extrabold grid place-items-center shrink-0">
                {number}
              </span>
              <Volume2 className="w-4 h-4 text-[#4A90E2] shrink-0" />
              <span className="text-[13px] font-semibold text-[#4A3B2A]">
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
              onClick={() => setJustFinished(false)}
              className="w-full py-3 px-4 rounded-xl font-extrabold text-sm bg-[#8FBF6F] hover:bg-[#7AAE5A] text-white shadow-md active:scale-95 transition-all"
            >
              {t.motsCroises.continueLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
