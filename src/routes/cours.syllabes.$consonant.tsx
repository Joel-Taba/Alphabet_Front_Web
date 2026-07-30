import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Volume2, RotateCcw, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { MobileShell, CahierFrame, LetterTraceCell } from "@/components/amani";
import { useSignSpeech } from "@/hooks/useSignSpeech";
import {
  SYLLABLE_GROUPS,
  findSyllableGroupForConsonant,
  lettersForExampleWord,
  type SyllableEntry,
} from "@/data/syllable-catalog";
import type { LetterFormation } from "@/data/letter-formation-catalog";
import { useLanguage, format } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { useWritingStyle } from "@/hooks/useWritingStyle";
import { getLetterFormation } from "@/data/letter-style-resolver";

export const Route = createFileRoute("/cours/syllabes/$consonant")({
  head: ({ params }) => ({
    meta: [
      { title: `Syllabes avec "${params.consonant}" — Amani` },
      {
        name: "description",
        content: `Apprends à former les syllabes avec la consonne "${params.consonant}".`,
      },
    ],
  }),
  component: SyllableLessonScreen,
});

function SyllableLessonScreen() {
  const { consonant } = Route.useParams();
  const navigate = useNavigate();
  const { speak } = useSignSpeech();
  const { t, lang } = useLanguage();
  const writingStyle = useWritingStyle();

  const group = findSyllableGroupForConsonant(consonant);
  const [syllableIdx, setSyllableIdx] = useState(0);

  useEffect(() => {
    setSyllableIdx(0);
  }, [consonant]);

  const groupIdx = SYLLABLE_GROUPS.findIndex((g) => g.consonant === consonant);
  const nextConsonantGroup = groupIdx >= 0 && groupIdx < SYLLABLE_GROUPS.length - 1 ? SYLLABLE_GROUPS[groupIdx + 1] : null;

  if (!group) {
    return (
      <MobileShell>
        <div className="flex flex-col items-center justify-center flex-1 p-8 gap-4 bg-[#F5EDE0]">
          <p className="text-[#4A3B2A] text-[18px] font-bold text-center">
            &quot;{consonant}&quot; {t.coursSyllabes.notFound}
          </p>
          <Link to="/accueil" className="px-6 py-3 rounded-full bg-[#8FBF6F] text-white font-bold text-[15px]">
            {t.coursSyllabes.backToList}
          </Link>
        </div>
      </MobileShell>
    );
  }

  const current = group.syllables[syllableIdx];
  const consonantLetter = getLetterFormation(consonant, writingStyle);
  const vowelLetter = getLetterFormation(current.vowel, writingStyle);

  const goToSyllable = (idx: number) => setSyllableIdx(idx);

  return (
    <MobileShell>
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
            <h1 className="text-[24px] font-bold text-[#4A3B2A] leading-tight">
              {format(t.coursSyllabes.consonantTitle, { consonant: `"${consonant}"` })}
            </h1>
            <p className="text-[13px] text-[#7A6A55] font-normal">
              {format(t.coursSyllabes.syllableCount, { count: group.syllables.length })}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            speak(format(t.coursSyllabes.speakFormation, { consonant, vowel: current.vowel, syllable: current.syllable }))
          }
          aria-label={t.common.instruction}
          className="grid h-10 w-10 place-items-center rounded-full bg-[#A9784F] text-white shadow-[0_2px_6px_rgba(74,59,42,0.18)] active:scale-95 transition-transform"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 bg-[#F5EDE0] pb-10">
        <SyllableCard
          consonantChar={consonant}
          consonantLetter={consonantLetter}
          vowelLetter={vowelLetter}
          entry={current}
          speak={speak}
          t={t}
          lang={lang}
          onPractice={() =>
            navigate({ to: "/exercice/syllabes/$consonant", params: { consonant } })
          }
        />

        {/* Toutes les syllabes de cette consonne */}
        <section>
          <div className="grid grid-cols-5 gap-3">
            {group.syllables.map((s, i) => (
              <button
                key={s.syllable}
                type="button"
                onClick={() => goToSyllable(i)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-[16px] border aspect-square transition-all duration-200",
                  i === syllableIdx
                    ? "bg-[#A9784F] border-[#A9784F] text-white shadow-lg scale-[1.05]"
                    : "bg-[#FBF6EC] border-[#4A3B2A]/10 text-[#4A3B2A] shadow-sm hover:border-[#A9784F]/40 hover:scale-[1.04] active:scale-[0.96]"
                )}
              >
                <span className="text-[22px] font-bold leading-none">{s.syllable}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Précédent / Suivant */}
        <div className="flex items-center justify-between gap-3 pt-2 pb-6">
          {syllableIdx > 0 ? (
            <button
              type="button"
              onClick={() => goToSyllable(syllableIdx - 1)}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#FBF6EC] border border-[#4A3B2A]/10 text-[#4A3B2A] font-bold text-[14px] shadow-sm active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-4 w-4" />
              &quot;{group.syllables[syllableIdx - 1].syllable}&quot;
            </button>
          ) : (
            <div />
          )}
          {syllableIdx < group.syllables.length - 1 ? (
            <button
              type="button"
              onClick={() => goToSyllable(syllableIdx + 1)}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#A9784F] text-white font-bold text-[14px] shadow-md active:scale-95 transition-transform"
            >
              &quot;{group.syllables[syllableIdx + 1].syllable}&quot;
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : nextConsonantGroup ? (
            <button
              type="button"
              onClick={() =>
                navigate({ to: "/cours/syllabes/$consonant", params: { consonant: nextConsonantGroup.consonant } })
              }
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#A9784F] text-white font-bold text-[14px] shadow-md active:scale-95 transition-transform"
            >
              {format(t.coursSyllabes.nextConsonant, { consonant: nextConsonantGroup.consonant })}
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

// ─── Carte de la syllabe : consonne + voyelle = syllabe, puis le mot ─────────

function SyllableCard({
  consonantChar,
  consonantLetter,
  vowelLetter,
  entry,
  speak,
  t,
  lang,
  onPractice,
}: {
  consonantChar: string;
  consonantLetter: LetterFormation | undefined;
  vowelLetter: LetterFormation | undefined;
  entry: SyllableEntry;
  speak: (text: string) => void;
  t: ReturnType<typeof useLanguage>["t"];
  lang: ReturnType<typeof useLanguage>["lang"];
  onPractice: () => void;
}) {
  const [replayKey, setReplayKey] = useState(0);
  const writingStyle = useWritingStyle();
  const exampleLetters = lettersForExampleWord(entry, writingStyle);

  useEffect(() => {
    speak(format(t.coursSyllabes.speakFormation, { consonant: consonantChar, vowel: entry.vowel, syllable: entry.syllable }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.syllable, lang]);

  return (
    <section className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col items-center relative overflow-hidden">
      <div className="flex items-center justify-center gap-3 w-full">
        <MiniLetterFrame letter={consonantLetter} playKey={replayKey} delayMs={0} />
        <span className="text-[28px] font-extrabold text-[#4A3B2A]">+</span>
        <MiniLetterFrame letter={vowelLetter} playKey={replayKey} delayMs={650} />
        <span className="text-[28px] font-extrabold text-[#4A3B2A]">=</span>
        <span className="text-[38px] font-extrabold text-[#A9784F] leading-none">{entry.syllable}</span>
      </div>

      <div className="w-full mt-6 pt-5 border-t border-[#4A3B2A]/10 flex flex-col items-center gap-3">
        <p className="text-[13px] font-bold text-[#7A6A55] uppercase tracking-wide">
          {format(t.coursSyllabes.exampleWordLabel, { syllable: entry.syllable })}
        </p>
        <div className="flex items-center gap-1.5">
          {exampleLetters.map((l, i) => (
            <LetterTraceCell key={`${entry.exampleWord}-${i}`} letter={l} size={40} isActive={false} given />
          ))}
        </div>
        <button
          type="button"
          onClick={() => speak(entry.exampleWord)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#4A90E2]/15 text-[#2D6BBF] font-bold text-[13px] active:scale-95 transition-transform"
        >
          <Volume2 className="h-3.5 w-3.5" /> {entry.exampleWord}
        </button>
      </div>

      <div className="flex flex-col gap-2.5 w-full max-w-xs mt-6 mb-1">
        <div className="flex items-center justify-center gap-2.5 w-full">
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm bg-secondary/15 hover:bg-secondary/25 text-secondary transition-colors active:scale-95 shadow-xs border border-secondary/20"
          >
            <RotateCcw className="h-4 w-4" /> {t.common.replay}
          </button>
          <button
            type="button"
            onClick={() =>
              speak(format(t.coursSyllabes.speakFormation, { consonant: consonantChar, vowel: entry.vowel, syllable: entry.syllable }))
            }
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 text-text-primary transition-colors active:scale-95 shadow-xs"
          >
            <Volume2 className="h-4 w-4 text-secondary" /> {t.common.instruction}
          </button>
        </div>
        <button
          type="button"
          onClick={onPractice}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-sm bg-secondary hover:bg-secondary/90 text-white transition-all active:scale-95 shadow-md"
        >
          <Play className="h-4 w-4 fill-current" /> {t.coursSyllabes.practice}
        </button>
      </div>
    </section>
  );
}

// ─── Mini-animation d'une lettre (tracé en CSS, séquencé par un délai) ───────

function MiniLetterFrame({
  letter,
  playKey,
  delayMs,
}: {
  letter: LetterFormation | undefined;
  playKey: number;
  delayMs: number;
}) {
  if (!letter) {
    return <CahierFrame className="w-[76px] h-[76px] shrink-0" rounded={12} />;
  }
  return (
    <CahierFrame className="w-[76px] h-[76px] shrink-0 flex items-center justify-center" rounded={12}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {letter.steps.map((step, i) => (
          <AnimatedStroke
            key={`${letter.char}-${i}-${playKey}`}
            pathD={step.pathD}
            color={step.strokeColor}
            delayMs={delayMs + i * 260}
          />
        ))}
      </svg>
    </CahierFrame>
  );
}

function AnimatedStroke({ pathD, color, delayMs }: { pathD: string; color: string; delayMs: number }) {
  const ref = useRef<SVGPathElement | null>(null);
  const [len, setLen] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    setDrawn(false);
    const el = ref.current;
    if (!el) return;
    let measured = 500;
    try {
      measured = el.getTotalLength();
    } catch {
      // ignore
    }
    setLen(measured);
    const timer = setTimeout(() => setDrawn(true), 30 + delayMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathD, delayMs]);

  return (
    <path
      ref={ref}
      d={pathD}
      stroke={color}
      strokeWidth={14}
      strokeLinecap="round"
      fill="none"
      style={{
        strokeDasharray: len ?? 500,
        strokeDashoffset: drawn ? 0 : len ?? 500,
        transition: "stroke-dashoffset 0.5s ease",
      }}
    />
  );
}
