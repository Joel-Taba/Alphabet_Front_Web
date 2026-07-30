import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Volume2, RotateCcw, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { MobileShell, CahierFrame } from "@/components/amani";
import { useSignSpeech } from "@/hooks/useSignSpeech";
import { LETTER_GROUPS, type LetterFormation, type LetterSignStep } from "@/data/letter-formation-catalog";
import { getPalier2GroupMap, lettersForGroup } from "@/data/palier2-groups";
import { useLanguage, format, type Lang } from "@/i18n/LanguageContext";
import type { Dictionary } from "@/i18n/translations";
import { cn } from "@/lib/utils";
import { useWritingStyle } from "@/hooks/useWritingStyle";
import { getLetterFormation } from "@/data/letter-style-resolver";
import { useAnimationSpeed, scaleDuration } from "@/hooks/useAnimationSpeed";

export const Route = createFileRoute("/cours/lettres/formation/$char")({
  validateSearch: (search: Record<string, unknown>): { pg?: string } => ({
    pg: typeof search.pg === "string" ? search.pg : undefined,
  }),
  head: ({ params }) => ({
    meta: [
      { title: `Former la lettre "${params.char}" — Amani` },
      {
        name: "description",
        content: `Découvre comment former la lettre "${params.char}" en combinant les signes de base.`,
      },
    ],
  }),
  component: LetterFormationScreen,
});

function LetterFormationScreen() {
  const { char } = Route.useParams();
  const { pg } = Route.useSearch();
  const navigate = useNavigate();
  const { speak } = useSignSpeech();
  const { t, lang } = useLanguage();
  const writingStyle = useWritingStyle();

  const letter = getLetterFormation(char, writingStyle);

  // Navigation au sein du même groupe : le petit groupe de progression (pg) prime,
  // sinon on retombe sur les grandes catégories pédagogiques (voyelles, consonnes, etc.)
  const progressionGroup = pg ? getPalier2GroupMap(lang).get(pg) : undefined;
  const ownGroup = !progressionGroup
    ? LETTER_GROUPS.find((g) => g.letters.some((l) => l.char === char))
    : undefined;
  const allLetters: readonly LetterFormation[] = progressionGroup
    ? lettersForGroup(progressionGroup)
    : ownGroup?.letters ?? [];
  const groupTitle = progressionGroup?.title[lang] ?? ownGroup?.title[lang] ?? t.coursFormationChar.vowelsTitle;
  const currentIdx = allLetters.findIndex((l) => l.char === char);
  const prevLetter = currentIdx > 0 ? allLetters[currentIdx - 1] : null;
  const nextLetter = currentIdx < allLetters.length - 1 ? allLetters[currentIdx + 1] : null;

  if (!letter) {
    return (
      <MobileShell>
        <div className="flex flex-col items-center justify-center flex-1 p-8 gap-4 bg-[#F5EDE0]">
          <p className="text-[#4A3B2A] text-[18px] font-bold text-center">
            &quot;{char}&quot; {t.coursFormationChar.notFound}
          </p>
          <Link
            to="/accueil"
            className="px-6 py-3 rounded-full bg-[#8FBF6F] text-white font-bold text-[15px]"
          >
            {t.coursFormationChar.backToList}
          </Link>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      {/* En-tête */}
      <header className="flex items-center justify-between px-6 pt-6 pb-4 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10">
        <div className="flex items-center gap-3">
          <Link
            to="/accueil"
            aria-label={t.common.back}
            className="grid h-11 w-11 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-[#4A3B2A]" strokeWidth={2.5} />
          </Link>
          <div>
            <h1 className="text-[26px] font-bold text-[#4A3B2A] leading-tight">
              <span className="text-[#A9784F]">&quot;{letter.char}&quot;</span>
            </h1>
            <p className="text-[13px] text-[#7A6A55] font-normal">
              {format(t.coursFormation.signeCount, { count: letter.steps.length })} · {letter.name[lang]}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => speak(letter.consigne[lang])}
          aria-label={t.common.instruction}
          className="grid h-10 w-10 place-items-center rounded-full bg-[#A9784F] text-white shadow-[0_2px_6px_rgba(74,59,42,0.18)] active:scale-95 transition-transform"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 bg-[#F5EDE0] pb-10">
        {/* Zone d'animation */}
        <LetterAnimationCanvas letter={letter} speak={speak} navigate={navigate} t={t} lang={lang} pg={pg} />

        {/* Navigation entre les lettres du groupe */}
        <section>
          <h3 className="text-[14px] font-bold text-[#4A3B2A] uppercase tracking-wide mb-3 px-1">
            {groupTitle}
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {allLetters.map((l) => (
              <button
                key={l.char}
                type="button"
                onClick={() =>
                  navigate({
                    to: "/cours/lettres/formation/$char",
                    params: { char: l.char },
                    search: pg ? { pg } : undefined,
                  })
                }
                className={cn(
                  "flex flex-col items-center justify-center rounded-[16px] border aspect-square transition-all duration-200",
                  l.char === char
                    ? "bg-[#A9784F] border-[#A9784F] text-white shadow-lg scale-[1.05]"
                    : "bg-[#FBF6EC] border-[#4A3B2A]/10 text-[#4A3B2A] shadow-sm hover:border-[#A9784F]/40 hover:scale-[1.04] active:scale-[0.96]"
                )}
              >
                <span className="text-[28px] font-bold leading-none">
                  {l.char}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Flèches Précédent / Suivant */}
        <div className="flex items-center justify-between gap-3 pt-2 pb-6">
          {prevLetter ? (
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: "/cours/lettres/formation/$char",
                  params: { char: prevLetter.char },
                  search: pg ? { pg } : undefined,
                })
              }
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#FBF6EC] border border-[#4A3B2A]/10 text-[#4A3B2A] font-bold text-[14px] shadow-sm active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-4 w-4" />
              &quot;{prevLetter.char}&quot;
            </button>
          ) : (
            <div />
          )}
          {nextLetter ? (
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: "/cours/lettres/formation/$char",
                  params: { char: nextLetter.char },
                  search: pg ? { pg } : undefined,
                })
              }
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#A9784F] text-white font-bold text-[14px] shadow-md active:scale-95 transition-transform"
            >
              &quot;{nextLetter.char}&quot;
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </MobileShell>
  );
}

// ─── Composant d'animation multi-signes ──────────────────────────────────────

function LetterAnimationCanvas({
  letter,
  speak,
  navigate,
  t,
  lang,
  pg,
}: {
  letter: LetterFormation;
  speak: (text: string) => void;
  navigate: ReturnType<typeof useNavigate>;
  t: Dictionary;
  lang: Lang;
  pg?: string;
}) {
  const [replayKey, setReplayKey] = useState(0);
  const animSpeed = useAnimationSpeed();

  // Animation state
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [stepProgress, setStepProgress] = useState(0); // 0 to 1 within current step
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  // Refs for SVG path measurement
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [pathLengths, setPathLengths] = useState<number[]>([]);
  const [penPos, setPenPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const animRef = useRef<number | null>(null);

  // Measure path lengths on mount/change
  useEffect(() => {
    const lengths = pathRefs.current.map((ref) => {
      if (ref) {
        try {
          return ref.getTotalLength();
        } catch {
          return 500;
        }
      }
      return 500;
    });
    setPathLengths(lengths);
  }, [letter, replayKey]);

  // Animation loop
  useEffect(() => {
    setCurrentStepIdx(0);
    setStepProgress(0);
    setIsPlaying(true);
    setIsFinished(false);

    // Speak the consigne
    speak(letter.consigne[lang]);

    const STEP_DURATION = scaleDuration(2000, animSpeed); // 2s per sign (à vitesse normale)
    const PAUSE_DURATION = scaleDuration(400, animSpeed); // 400ms pause entre signes (à vitesse normale)
    const totalSteps = letter.steps.length;

    let stepStart = performance.now();
    let activeStep = 0;
    let isPaused = false;
    let pauseStart = 0;

    const animate = (now: number) => {
      if (isPaused) {
        // During pause between signs
        const pauseElapsed = now - pauseStart;
        if (pauseElapsed >= PAUSE_DURATION) {
          // Pause done, move to next step
          isPaused = false;
          activeStep++;
          if (activeStep >= totalSteps) {
            // All steps done
            setCurrentStepIdx(totalSteps - 1);
            setStepProgress(1);
            setIsPlaying(false);
            setIsFinished(true);
            return;
          }
          setCurrentStepIdx(activeStep);
          setStepProgress(0);
          stepStart = now;
        }
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = now - stepStart;
      const progress = Math.min(elapsed / STEP_DURATION, 1);
      setStepProgress(progress);
      setCurrentStepIdx(activeStep);

      // Update pen position
      const pathEl = pathRefs.current[activeStep];
      if (pathEl) {
        try {
          const totalLen = pathEl.getTotalLength();
          const pt = pathEl.getPointAtLength(progress * totalLen);
          setPenPos({ x: pt.x, y: pt.y });
        } catch {
          const step = letter.steps[activeStep];
          if (step) setPenPos({ x: step.startXY[0], y: step.startXY[1] });
        }
      }

      if (progress >= 1) {
        // Step complete — start pause
        if (activeStep < totalSteps - 1) {
          isPaused = true;
          pauseStart = now;
        } else {
          // Last step done
          setIsPlaying(false);
          setIsFinished(true);
          return;
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    // Initialize pen position
    const firstStep = letter.steps[0];
    if (firstStep) {
      setPenPos({ x: firstStep.startXY[0], y: firstStep.startXY[1] });
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [letter, speak, replayKey, lang, animSpeed]);

  const handleReplay = useCallback(() => {
    setReplayKey((k) => k + 1);
  }, []);

  return (
    <section className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col items-center relative overflow-hidden">
      {/* Canvas de tracé animé */}
      <CahierFrame className="relative w-[260px] h-[260px] flex items-center justify-center my-2" rounded={16}>
        {/* Point de départ du signe en cours (disparaît à la fin) */}
        {isPlaying && !isFinished && stepProgress <= 0.90 && (
          <div
            className="absolute z-20 w-3 h-3 rounded-full bg-[#8FBF6F] border border-white shadow grid place-items-center animate-pulse pointer-events-none"
            style={{
              left: `${(letter.steps[currentStepIdx].startXY[0] / 200) * 100}%`,
              top: `${(letter.steps[currentStepIdx].startXY[1] / 200) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-1 h-1 rounded-full bg-white" />
          </div>
        )}

        {/* SVG : tous les signes */}
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {letter.steps.map((step, i) => {
            const isActive = i === currentStepIdx;
            const isDone = i < currentStepIdx || isFinished;
            const isFuture = i > currentStepIdx && !isFinished;
            const len = pathLengths[i] || 500;

            return (
              <g key={`step-${i}-${replayKey}`}>
                {/* Guide en pointillés (toujours visible mais discret) */}
                <path
                  ref={(el) => { pathRefs.current[i] = el; }}
                  d={step.pathD}
                  stroke="#9BB5CC"
                  strokeWidth={14}
                  strokeLinecap="round"
                  strokeDasharray={isFuture ? "6 8" : "none"}
                  fill="none"
                  opacity={isFuture ? 0.4 : 0}
                />

                {/* Trait coloré — dessiné ou en cours d'animation */}
                {(isDone || isActive) && (
                  <path
                    d={step.pathD}
                    stroke={step.strokeColor}
                    strokeWidth={12}
                    strokeLinecap="round"
                    fill="none"
                    style={{
                      strokeDasharray: len,
                      strokeDashoffset: isDone
                        ? 0
                        : len * (1 - stepProgress),
                      transition: "none",
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Stylet / Pointe animée (disparaît complètement à la fin) */}
          {isPlaying && !isFinished && stepProgress <= 0.98 && (
            <circle
              cx={penPos.x}
              cy={penPos.y}
              r={4.5}
              fill="#A9784F"
              stroke="#FFFFFF"
              strokeWidth={2}
              className="pointer-events-none"
            />
          )}
        </svg>

        {/* Badge d'étape en cours */}
        {isPlaying && !isFinished && (
          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-white/90 border border-[#4A3B2A]/15 shadow-sm">
            <span className="text-[11px] font-bold text-[#4A3B2A]">
              {t.exerciceLettre.stepPrefix} {currentStepIdx + 1}/{letter.steps.length}
            </span>
          </div>
        )}
      </CahierFrame>

      {/* Boutons d'interaction */}
      <div className="flex flex-col gap-2.5 w-full max-w-xs mt-4 mb-1">
        <div className="flex items-center justify-center gap-2.5 w-full">
          <button
            type="button"
            onClick={handleReplay}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm bg-secondary/15 hover:bg-secondary/25 text-secondary transition-colors active:scale-95 shadow-xs border border-secondary/20"
          >
            <RotateCcw className={cn("h-4 w-4", isPlaying && "animate-spin")} /> {t.common.replay}
          </button>

          <button
            type="button"
            onClick={() => speak(letter.consigne[lang])}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 text-text-primary transition-colors active:scale-95 shadow-xs"
          >
            <Volume2 className="h-4 w-4 text-secondary" /> {t.common.instruction}
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate({
              to: "/exercice/lettre/$char",
              params: { char: letter.char },
              search: pg ? { pg } : undefined,
            })
          }
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-sm bg-secondary hover:bg-secondary/90 text-white transition-all active:scale-95 shadow-md"
        >
          <Play className="h-4 w-4 fill-current" /> {t.coursFormationChar.practice} &quot;{letter.char}&quot;
        </button>
      </div>
    </section>
  );
}
