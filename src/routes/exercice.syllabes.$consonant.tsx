import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useCallback, useMemo, useEffect } from "react";
import { ArrowLeft, Volume2, ChevronRight } from "lucide-react";
import {
  MobileShell,
  AmaniMascot,
  LetterTraceCell,
  EvaluationTimerBadge,
  EvaluationCompleteOverlay,
  ExerciseCompletePopup,
} from "@/components/amani";
import { useSignSpeech } from "@/hooks/useSignSpeech";
import {
  SYLLABLE_GROUPS,
  findSyllableGroupForConsonant,
  lettersForSyllable,
  type SyllableEntry,
} from "@/data/syllable-catalog";
import { useLanguage, format } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { useWritingStyle } from "@/hooks/useWritingStyle";
import type { WritingStyle } from "@/data/letter-style-resolver";
import { readEvaluationDurationMinutes } from "@/hooks/useExerciseSettings";
import { useCountdown } from "@/hooks/useCountdown";
import { awardCompletion, awardRestartBonus } from "@/lib/progress";

export const Route = createFileRoute("/exercice/syllabes/$consonant")({
  validateSearch: (search: Record<string, unknown>): { amaniEval?: string } => ({
    // Nommé "amaniEval" — certains noms de clé courts (ex. "chrono"=1) sont
    // interceptés et redirigés silencieusement par le proxy de dev.
    amaniEval: typeof search.amaniEval === "string" ? search.amaniEval : undefined,
  }),
  head: ({ params }) => ({
    meta: [
      { title: `Exercice de syllabes — Amani` },
      { name: "description", content: `Exerce-toi à tracer les syllabes avec la consonne "${params.consonant}".` },
    ],
  }),
  component: SyllableExerciseScreen,
});

function SyllableExerciseScreen() {
  const { consonant } = Route.useParams();
  const { amaniEval } = Route.useSearch();
  const navigate = useNavigate();
  const { speak } = useSignSpeech();
  const { t } = useLanguage();
  const writingStyle = useWritingStyle();

  const group = findSyllableGroupForConsonant(consonant);
  const groupIdx = SYLLABLE_GROUPS.findIndex((g) => g.consonant === consonant);
  const nextGroup = groupIdx >= 0 && groupIdx < SYLLABLE_GROUPS.length - 1 ? SYLLABLE_GROUPS[groupIdx + 1] : null;

  // En évaluation, une fois la dernière consonne atteinte on reboucle sur la
  // première — seul le chronomètre décide de la fin de la session.
  const isEvaluation = amaniEval === "1";
  const evaluationNextGroup = isEvaluation && groupIdx >= 0 ? SYLLABLE_GROUPS[(groupIdx + 1) % SYLLABLE_GROUPS.length] : null;
  const evaluationSeconds = useMemo(() => readEvaluationDurationMinutes() * 60, []);
  const [evaluationExpired, setEvaluationExpired] = useState(false);
  const remaining = useCountdown(isEvaluation ? evaluationSeconds : 0, () => setEvaluationExpired(true));

  const [doneSyllables, setDoneSyllables] = useState<Set<string>>(new Set());
  // Incrémenté à chaque "Recommencer" pour forcer le remontage des
  // SyllableTraceRow (elles gèrent leur propre état interne).
  const [restartKey, setRestartKey] = useState(0);
  // Vrai entre le clic sur "Recommencer" et la prochaine réussite complète :
  // le bonus n'est attribué qu'à ce moment-là (voir l'effet plus bas), jamais
  // au clic lui-même.
  const [awaitingRepeatCompletion, setAwaitingRepeatCompletion] = useState(false);
  const allDone = !!group && doneSyllables.size === group.syllables.length;

  useEffect(() => {
    if (allDone && awaitingRepeatCompletion) {
      awardRestartBonus();
      setAwaitingRepeatCompletion(false);
    }
  }, [allDone, awaitingRepeatCompletion]);

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

  return (
    <MobileShell>
      {isEvaluation && !evaluationExpired && <EvaluationTimerBadge remaining={remaining} />}
      {isEvaluation && evaluationExpired && (
        <EvaluationCompleteOverlay onBack={() => navigate({ to: "/accueil" })} />
      )}
      {allDone && !isEvaluation && (
        <ExerciseCompletePopup
          onBackHome={() => navigate({ to: "/accueil" })}
          onNext={
            nextGroup
              ? () => navigate({ to: "/cours/syllabes/$consonant", params: { consonant: nextGroup.consonant } })
              : undefined
          }
          onRestart={() => {
            setDoneSyllables(new Set());
            setRestartKey((k) => k + 1);
            setAwaitingRepeatCompletion(true);
          }}
        />
      )}

      <header className="flex items-center justify-between px-6 pt-6 pb-4 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10">
        <div className="flex items-center gap-3">
          <Link
            to="/cours/syllabes/$consonant"
            params={{ consonant }}
            aria-label={t.common.back}
            className="grid h-11 w-11 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-[#4A3B2A] rtl:rotate-180" strokeWidth={2.5} />
          </Link>
          <div>
            <h1 className="text-[22px] font-bold text-[#4A3B2A] leading-tight">
              {format(t.coursSyllabes.consonantTitle, { consonant: `"${consonant}"` })}
            </h1>
            <p className="text-[13px] text-[#7A6A55] font-normal">
              {format(t.exerciceSyllabes.syllablesReady, { done: doneSyllables.size, total: group.syllables.length })}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-[#F5EDE0] pb-10">
        <div className="bg-[#FBF6EC] rounded-[20px] p-4 border border-[#4A3B2A]/10 shadow-sm flex items-center gap-3.5">
          <AmaniMascot pose={allDone ? "celebration" : "encouragement"} size="small" />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-[#4A3B2A] leading-snug">
              {allDone ? t.exerciceSyllabes.allDoneTitle : t.exerciceSyllabes.introTitle}
            </p>
            <p className="text-[12px] text-[#7A6A55] mt-0.5">
              {allDone ? t.exerciceSyllabes.allDoneBody : t.exerciceSyllabes.introBody}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          {group.syllables.map((entry) => (
            <SyllableTraceRow
              key={`${entry.syllable}-r${restartKey}`}
              entry={entry}
              speak={speak}
              done={doneSyllables.has(entry.syllable)}
              onDone={() => {
                setDoneSyllables((prev) => new Set(prev).add(entry.syllable));
                awardCompletion({ typeEtape: "SYLLABE", modalite: "EXERCICE", etapeCode: entry.syllable, palier: 3 });
              }}
              doneLabel={t.exerciceListe.done}
              exampleWordPrefix={t.exerciceSyllabes.exampleWordPrefix}
              style={writingStyle}
            />
          ))}
        </div>

        {allDone && isEvaluation && evaluationNextGroup && (
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/exercice/syllabes/$consonant",
                params: { consonant: evaluationNextGroup.consonant },
                search: { amaniEval: "1" },
              })
            }
            className="w-full py-4 rounded-2xl bg-[#4A90E2] hover:bg-[#3A7BC8] text-white font-extrabold text-lg shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.99]"
          >
            <span>{format(t.exerciceSyllabes.nextGroup, { consonant: evaluationNextGroup.consonant })}</span>
            <ChevronRight className="h-5 w-5 rtl:rotate-180" />
          </button>
        )}
      </div>
    </MobileShell>
  );
}

function SyllableTraceRow({
  entry,
  speak,
  done,
  onDone,
  doneLabel,
  exampleWordPrefix,
  style,
}: {
  entry: SyllableEntry;
  speak: (text: string) => void;
  done: boolean;
  onDone: () => void;
  doneLabel: string;
  exampleWordPrefix: string;
  style: WritingStyle;
}) {
  const letters = lettersForSyllable(entry.syllable, style);
  const [solvedIdx, setSolvedIdx] = useState<Set<number>>(new Set());

  const handleLetterSolved = useCallback(
    (idx: number) => {
      setSolvedIdx((prev) => {
        const next = new Set(prev).add(idx);
        if (next.size === letters.length) onDone();
        return next;
      });
    },
    [letters.length, onDone]
  );

  const activeIdx = (() => {
    for (let i = 0; i < letters.length; i++) {
      if (!solvedIdx.has(i)) return i;
    }
    return -1;
  })();

  return (
    <div
      className={cn(
        "flex flex-col rounded-[20px] overflow-hidden border transition-all bg-white",
        done ? "border-[#8FBF6F]/60 shadow-[0_4px_16px_rgba(143,191,111,0.18)]" : "border-[#4A3B2A]/10 shadow-[0_2px_8px_rgba(74,59,42,0.08)]"
      )}
    >
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#FBF6EC] border-b border-[#4A3B2A]/10">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-[15px] font-bold text-[#4A3B2A]">{entry.syllable}</span>
          <span className="text-[11px] text-[#7A6A55] truncate">
            {exampleWordPrefix} « {entry.exampleWord} »
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {done && <span className="text-[13px] text-[#8FBF6F] font-bold">✓ {doneLabel}</span>}
          <button
            type="button"
            onClick={() => speak(entry.syllable)}
            aria-label={entry.syllable}
            className="w-8 h-8 grid place-items-center rounded-full bg-[#4A90E2]/15 text-[#2D6BBF] hover:bg-[#4A90E2] hover:text-white transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="relative overflow-hidden" style={{ backgroundColor: "#FFFFFF", minHeight: 72 + 24 }}>
        {/* Lignes Seyès de référence — mêmes 4 lignes équidistantes (intervalle
            60 dans l'espace lettre 0-200) que CahierFrame.tsx, converties en
            pixels ici via l'échelle des cases carrées de LetterTraceCell
            (size=72, sc=0.36, pas de décalage de centrage) plus le padding
            vertical (py-3=12px) de la rangée : pixelY = 12 + yLettre * 0.36. */}
        {[10, 70, 130, 190].map((yLettre, i) => (
          <div
            key={yLettre}
            className="absolute left-0 right-0"
            style={{
              top: 12 + yLettre * 0.36,
              height: i === 2 ? 1.5 : 1,
              backgroundColor: i === 2 ? "#E05252" : "#4A90E2",
              opacity: 0.8,
            }}
          />
        ))}
        <div className="relative z-10 flex items-center gap-2 px-3 py-3">
          {letters.map((letter, i) => (
            <LetterTraceCell
              key={`${entry.syllable}-${i}`}
              letter={letter}
              size={72}
              isActive={i === activeIdx}
              transparent
              onSolved={() => handleLetterSolved(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
