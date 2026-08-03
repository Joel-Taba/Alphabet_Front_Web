import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo, useCallback, type PointerEvent as ReactPointerEvent } from "react";
import { Eraser, Shuffle } from "lucide-react";
import {
  AmaniMascot,
  SignGlyph,
  glyphColorByFamily,
  CrosswordPlay,
  type SignFamily,
} from "@/components/amani";
import { useLanguage } from "@/i18n/LanguageContext";
import { VOWELS, CONSONANTS, UPPERCASE, DIGITS, type LetterFormation } from "@/data/letter-formation-catalog";
import { getLetterFormation } from "@/data/letter-style-resolver";
import { useWritingStyle } from "@/hooks/useWritingStyle";
import { FULL_WORD_BANK } from "@/data/word-bank-full";
import { generateCrossword, type GeneratedCrossword } from "@/lib/crosswordGenerator";
import { cn } from "@/lib/utils";
import gribouillageImg from "@/assets/amani-gribouillage.png";

export const Route = createFileRoute("/_app/bibliotheque")({
  head: () => ({
    meta: [
      { title: "Mode Libre — Amani" },
      {
        name: "description",
        content: "Dessine et exerce-toi librement, sans contrainte, pour maîtriser ton doigté.",
      },
    ],
  }),
  component: ModeLibre,
});

type Tab = "scribble" | "sign" | "letter" | "digit" | "crossword";

const SIGN_FAMILIES: SignFamily[] = ["trait", "courbe", "point", "crochet"];
/** Liste des caractères a→z puis A→Z (le style script sert uniquement à énumérer les lettres). */
const LETTER_CHARS: string[] = [
  ...[...VOWELS, ...CONSONANTS].map((l) => l.char).sort((a, b) => a.localeCompare(b)),
  ...UPPERCASE.map((l) => l.char).sort((a, b) => a.localeCompare(b)),
];

const PEN_COLORS = ["#4A3B2A", "#A9784F", "#8FBF6F", "#4A90E2", "#E05252"];

/** Curseur en forme de stylo (pointe teintée de la couleur d'encre choisie), pointe = point d'ancrage. */
function getPenCursor(color: string): string {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26'>` +
    `<polygon points='2,6.5 6.5,2 8.6,4.1 4.1,8.6' fill='#9C8F79' stroke='#4A3B2A' stroke-width='1' stroke-linejoin='round'/>` +
    `<polygon points='4.1,8.6 8.6,4.1 19.3,14.7 14.7,19.3' fill='#E8B84D' stroke='#4A3B2A' stroke-width='1' stroke-linejoin='round'/>` +
    `<polygon points='14.7,19.3 19.3,14.7 21.2,21.2' fill='${color}' stroke='#4A3B2A' stroke-width='1' stroke-linejoin='round'/>` +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 21 21, crosshair`;
}

/* ── Aperçu statique d'une lettre/chiffre (toutes les étapes combinées) ── */
function LetterPreview({ letter, size = 64 }: { letter: LetterFormation; size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden>
      {letter.steps.map((step, i) => (
        <path
          key={i}
          d={step.pathD}
          stroke={step.strokeColor}
          strokeWidth={14}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
    </svg>
  );
}

/* ── Page principale : Mode Libre ────────────────────────── */
function ModeLibre() {
  const { t, lang } = useLanguage();
  const writingStyle = useWritingStyle();

  const LETTERS = useMemo(
    () => LETTER_CHARS.map((c) => getLetterFormation(c, writingStyle)).filter((l): l is LetterFormation => !!l),
    [writingStyle]
  );

  const [tab, setTab] = useState<Tab>("scribble");
  const [selectedSign, setSelectedSign] = useState<SignFamily>(SIGN_FAMILIES[0]);
  const [selectedLetter, setSelectedLetter] = useState<string>(LETTER_CHARS[0]);
  const [selectedDigit, setSelectedDigit] = useState<string>(DIGITS[0].char);
  const [penColor, setPenColor] = useState(PEN_COLORS[0]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);
  const lastPtRef = useRef<{ x: number; y: number } | null>(null);

  // Dimensionner le canvas selon son conteneur (HiDPI)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const getPos = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    const pt = getPos(e);
    lastPtRef.current = pt;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = penColor;
    ctx.fill();
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !lastPtRef.current) return;
    const pt = getPos(e);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastPtRef.current.x, lastPtRef.current.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    lastPtRef.current = pt;
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = false;
    lastPtRef.current = null;
    if (canvasRef.current?.hasPointerCapture(e.pointerId)) {
      canvasRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  };

  const tabs: Tab[] = ["scribble", "sign", "letter", "digit", "crossword"];

  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto">
      <div className="flex flex-col gap-5 px-5 pt-6 pb-8">
        {/* En-tête : titre de page, même gabarit que "Notre Communauté" */}
        <header>
          <h1 className="text-[24px] leading-8 font-bold" style={{ color: "#4A3B2A" }}>
            {t.modeLibre.title}
          </h1>
        </header>

        {/* Image plein cadre */}
        <div
          className="w-full h-48 rounded-3xl overflow-hidden border border-[#4A3B2A]/10"
          style={{ boxShadow: "0 2px 8px rgba(74,59,42,0.14)" }}
        >
          <img
            src={gribouillageImg}
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Onglets de modèle */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {tabs.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-[14px] font-bold whitespace-nowrap transition-colors select-none",
              )}
              style={{
                background: tab === k ? "#A9784F" : "#FBF6EC",
                color: tab === k ? "#FBF6EC" : "#7A6A55",
                boxShadow: tab === k ? "0 2px 0 0 rgba(0,0,0,0.15)" : "0 1px 4px rgba(74,59,42,0.08)",
              }}
            >
              {t.modeLibre.tabs[k]}
            </button>
          ))}
        </div>

        {tab === "crossword" ? (
          <FreeCrosswordSection />
        ) : (
        <>
        {/* Sélecteur de modèle (masqué en griffonnage libre) */}
        {tab === "sign" && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {SIGN_FAMILIES.map((fam) => {
              const { bg } = glyphColorByFamily[fam];
              const isSel = selectedSign === fam;
              return (
                <button
                  key={fam}
                  type="button"
                  onClick={() => setSelectedSign(fam)}
                  aria-label={t.modeLibre.signNames[fam]}
                  className="shrink-0 w-14 h-14 rounded-2xl grid place-items-center border-2 transition-all"
                  style={{
                    background: isSel ? bg : "#FBF6EC",
                    borderColor: isSel ? "#4A3B2A30" : "transparent",
                  }}
                >
                  <SignGlyph
                    family={fam}
                    stroke={isSel ? glyphColorByFamily[fam].stroke : (fam === "trait" || fam === "point" ? "#4A3B2A" : glyphColorByFamily[fam].bg)}
                    style={{ width: 32, height: 32 }}
                  />
                </button>
              );
            })}
          </div>
        )}

        {tab === "letter" && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {LETTERS.map((l) => {
              const isSel = selectedLetter === l.char;
              return (
                <button
                  key={l.char}
                  type="button"
                  onClick={() => setSelectedLetter(l.char)}
                  aria-label={l.name[lang]}
                  className="shrink-0 w-11 h-11 rounded-xl grid place-items-center border-2 font-bold text-[18px] transition-all"
                  style={{
                    background: isSel ? "#A9784F" : "#FBF6EC",
                    color: isSel ? "#FBF6EC" : "#4A3B2A",
                    borderColor: isSel ? "#4A3B2A30" : "transparent",
                  }}
                >
                  {l.char}
                </button>
              );
            })}
          </div>
        )}

        {tab === "digit" && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {DIGITS.map((d) => {
              const isSel = selectedDigit === d.char;
              return (
                <button
                  key={d.char}
                  type="button"
                  onClick={() => setSelectedDigit(d.char)}
                  className="shrink-0 w-11 h-11 rounded-xl grid place-items-center border-2 font-bold text-[18px] transition-all"
                  style={{
                    background: isSel ? "#A9784F" : "#FBF6EC",
                    color: isSel ? "#FBF6EC" : "#4A3B2A",
                    borderColor: isSel ? "#4A3B2A30" : "transparent",
                  }}
                >
                  {d.char}
                </button>
              );
            })}
          </div>
        )}

        {/* Carte modèle de référence (pas de guide sur le dessin lui-même) */}
        <div
          className="flex items-center gap-4 rounded-3xl p-4"
          style={{ background: "#FBF6EC", boxShadow: "0 2px 8px rgba(74,59,42,0.10)" }}
        >
          <div
            className="shrink-0 w-20 h-20 rounded-2xl grid place-items-center"
            style={{ background: "#FFFFFF", boxShadow: "0 1px 6px rgba(74,59,42,0.10)" }}
          >
            {tab === "scribble" && (
              <span className="text-[32px]" aria-hidden>✏️</span>
            )}
            {tab === "sign" && (
              <SignGlyph
                family={selectedSign}
                stroke={selectedSign === "trait" || selectedSign === "point" ? "#4A3B2A" : glyphColorByFamily[selectedSign].bg}
                style={{ width: 48, height: 48 }}
              />
            )}
            {tab === "letter" && (
              <LetterPreview letter={LETTERS.find((l) => l.char === selectedLetter)!} size={56} />
            )}
            {tab === "digit" && (
              <LetterPreview letter={DIGITS.find((d) => d.char === selectedDigit)!} size={56} />
            )}
          </div>
          <div className="min-w-0">
            {tab === "scribble" ? (
              <>
                <p className="text-[15px] font-bold leading-tight" style={{ color: "#4A3B2A" }}>
                  {t.modeLibre.noModelTitle}
                </p>
                <p className="text-[13px] mt-0.5" style={{ color: "#7A6A55" }}>
                  {t.modeLibre.noModelBody}
                </p>
              </>
            ) : (
              <>
                <p className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: "#A9784F" }}>
                  {t.modeLibre.modelLabel}
                </p>
                <p className="text-[20px] font-bold leading-tight" style={{ color: "#4A3B2A" }}>
                  {tab === "sign" && t.modeLibre.signNames[selectedSign]}
                  {tab === "letter" && selectedLetter}
                  {tab === "digit" && selectedDigit}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Page blanche de dessin libre — sans aucune indication */}
        <div
          ref={containerRef}
          className="relative w-full rounded-[20px] overflow-hidden border"
          style={{
            height: 380,
            background: "#FFFFFF",
            borderColor: "#4A3B2A15",
            boxShadow: "0 2px 10px rgba(74,59,42,0.10)",
          }}
        >
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="absolute inset-0 w-full h-full touch-none"
            style={{ cursor: getPenCursor(penColor) }}
            aria-label={t.modeLibre.canvasAria}
          />
        </div>

        {/* Barre d'outils : couleurs + effacer */}
        <div
          className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3"
          style={{ background: "#FBF6EC", boxShadow: "0 2px 8px rgba(74,59,42,0.08)" }}
        >
          <div
            className="flex flex-1 items-center justify-center gap-3"
            role="group"
            aria-label={t.modeLibre.colorLabel}
          >
            {PEN_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setPenColor(c)}
                aria-label={c}
                aria-pressed={penColor === c}
                className="w-9 h-9 rounded-full border-2 transition-transform active:scale-90"
                style={{
                  background: c,
                  borderColor: penColor === c ? "#4A3B2A" : "transparent",
                  boxShadow: penColor === c ? "0 0 0 2px #FBF6EC, 0 0 0 3px #4A3B2A40" : "0 1px 3px rgba(74,59,42,0.2)",
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleClear}
            aria-label={t.modeLibre.clear}
            className="shrink-0 grid place-items-center w-11 h-11 rounded-full text-white transition-transform active:scale-90"
            style={{ background: "#E05252", boxShadow: "0 3px 0 0 rgba(0,0,0,0.15)" }}
          >
            <Eraser className="w-5 h-5" strokeWidth={2.3} />
          </button>
        </div>
        </>
        )}
      </div>
    </div>
  );
}

/* ── Section Mots Croisés du Mode Libre : grille aléatoire à volonté ────── */
function FreeCrosswordSection() {
  const { t } = useLanguage();
  const [crossword, setCrossword] = useState<GeneratedCrossword | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const newGame = useCallback(() => {
    const wordCount = Math.random() < 0.5 ? 5 : 6;
    const seed = Math.floor(Math.random() * 1_000_000);
    const result = generateCrossword(FULL_WORD_BANK, wordCount, seed);
    setCrossword(result);
    setGameKey((k) => k + 1);
  }, []);

  useEffect(() => {
    newGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex items-center gap-4 rounded-3xl p-4"
        style={{ background: "#FBF6EC", boxShadow: "0 2px 8px rgba(74,59,42,0.10)" }}
      >
        <AmaniMascot pose="curiosite" size="small" />
        <div className="min-w-0">
          <p className="text-[15px] font-bold leading-tight" style={{ color: "#4A3B2A" }}>
            {t.modeLibreCroises.title}
          </p>
          <p className="text-[13px] mt-0.5" style={{ color: "#7A6A55" }}>
            {t.modeLibreCroises.intro}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={newGame}
        className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-extrabold text-[15px] text-white transition-transform active:scale-95"
        style={{ background: "#4A90E2", boxShadow: "0 3px 0 0 #2D6BBF" }}
      >
        <Shuffle className="w-4.5 h-4.5" />
        {t.modeLibreCroises.newGame}
      </button>

      {crossword ? (
        <CrosswordPlay key={gameKey} crossword={crossword} />
      ) : (
        <p className="text-center text-[13px] text-[#7A6A55] py-8">{t.modeLibreCroises.generating}</p>
      )}
    </div>
  );
}
