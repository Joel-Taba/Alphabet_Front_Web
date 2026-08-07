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
  PALIER3_GROUPS,
  PALIER3_GROUP_MAP,
  wordText,
  lettersForWord,
  type WordEntry,
} from "@/data/word-catalog";
import { useLanguage, format } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { useWritingStyle } from "@/hooks/useWritingStyle";
import type { WritingStyle } from "@/data/letter-style-resolver";
import { readEvaluationDurationMinutes } from "@/hooks/useExerciseSettings";
import { useCountdown } from "@/hooks/useCountdown";
import { awardCompletion, awardRestartBonus } from "@/lib/progress";

export const Route = createFileRoute("/exercice/mots/$groupId")({
  validateSearch: (search: Record<string, unknown>): { amaniEval?: string } => ({
    // Nommé "amaniEval" — certains noms de clé courts (ex. "chrono"=1) sont
    // interceptés et redirigés silencieusement par le proxy de dev.
    amaniEval: typeof search.amaniEval === "string" ? search.amaniEval : undefined,
  }),
  head: ({ params }) => ({
    meta: [
      { title: `Exercice de mots — Amani` },
      { name: "description", content: `Exerce-toi à écrire les mots du groupe ${params.groupId}.` },
    ],
  }),
  component: WordExerciseScreen,
});

function WordExerciseScreen() {
  const { groupId } = Route.useParams();
  const { amaniEval } = Route.useSearch();
  const navigate = useNavigate();
  const { speak } = useSignSpeech();
  const { t, lang } = useLanguage();
  const writingStyle = useWritingStyle();

  const group = PALIER3_GROUP_MAP.get(groupId);
  const groupIdx = PALIER3_GROUPS.findIndex((g) => g.id === groupId);
  const nextGroup = groupIdx >= 0 && groupIdx < PALIER3_GROUPS.length - 1 ? PALIER3_GROUPS[groupIdx + 1] : null;

  // En évaluation, une fois le dernier groupe atteint on reboucle sur le
  // premier — seul le chronomètre décide de la fin de la session.
  const isEvaluation = amaniEval === "1";
  const evaluationNextGroup = isEvaluation && groupIdx >= 0 ? PALIER3_GROUPS[(groupIdx + 1) % PALIER3_GROUPS.length] : null;
  const evaluationSeconds = useMemo(() => readEvaluationDurationMinutes() * 60, []);
  const [evaluationExpired, setEvaluationExpired] = useState(false);
  const remaining = useCountdown(isEvaluation ? evaluationSeconds : 0, () => setEvaluationExpired(true));

  const [doneWords, setDoneWords] = useState<Set<string>>(new Set());
  // Incrémenté à chaque "Recommencer" pour forcer le remontage des
  // WordTraceRow (elles gèrent leur propre état interne, comme leurs LetterTraceCell).
  const [restartKey, setRestartKey] = useState(0);
  // Vrai entre le clic sur "Recommencer" et la prochaine réussite complète :
  // le bonus n'est attribué qu'à ce moment-là (voir l'effet plus bas), jamais
  // au clic lui-même.
  const [awaitingRepeatCompletion, setAwaitingRepeatCompletion] = useState(false);
  const allDone = !!group && doneWords.size === group.words.length;

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
            &quot;{groupId}&quot; {t.coursMots.notFound}
          </p>
          <Link to="/accueil" className="px-6 py-3 rounded-full bg-[#8FBF6F] text-white font-bold text-[15px]">
            {t.coursMots.backToList}
          </Link>
        </div>
      </MobileShell>
    );
  }

  const groupTitle = group.title[lang];

  return (
    <MobileShell>
      {isEvaluation && !evaluationExpired && <EvaluationTimerBadge remaining={remaining} />}
      {isEvaluation && evaluationExpired && (
        <EvaluationCompleteOverlay onBack={() => navigate({ to: "/accueil" })} />
      )}
      {allDone && !isEvaluation && (
        <ExerciseCompletePopup
          onBackHome={() => navigate({ to: "/accueil" })}
          onNext={nextGroup ? () => navigate({ to: "/cours/mots/$groupId", params: { groupId: nextGroup.id } }) : undefined}
          onRestart={() => {
            setDoneWords(new Set());
            setRestartKey((k) => k + 1);
            setAwaitingRepeatCompletion(true);
          }}
        />
      )}

      <header className="flex items-center justify-between px-6 pt-6 pb-4 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10">
        <div className="flex items-center gap-3">
          <Link
            to="/cours/mots/$groupId"
            params={{ groupId: group.id }}
            aria-label={t.common.back}
            className="grid h-11 w-11 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-[#4A3B2A]" strokeWidth={2.5} />
          </Link>
          <div>
            <h1 className="text-[22px] font-bold text-[#4A3B2A] leading-tight">
              {groupTitle}
            </h1>
            <p className="text-[13px] text-[#7A6A55] font-normal">
              {format(t.exerciceMots.wordsReady, { done: doneWords.size, total: group.words.length })}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-[#F5EDE0] pb-10">
        <div className="bg-[#FBF6EC] rounded-[20px] p-4 border border-[#4A3B2A]/10 shadow-sm flex items-center gap-3.5">
          <AmaniMascot pose={allDone ? "celebration" : "encouragement"} size="small" />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-[#4A3B2A] leading-snug">
              {allDone ? t.exerciceMots.allDoneTitle : t.exerciceMots.introTitle}
            </p>
            <p className="text-[12px] text-[#7A6A55] mt-0.5">
              {allDone ? t.exerciceMots.allDoneBody : t.exerciceMots.introBody}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          {group.words.map((word) => (
            <WordTraceRow
              key={`${word.id}-r${restartKey}`}
              word={word}
              lang={lang}
              speak={speak}
              done={doneWords.has(word.id)}
              onDone={() => {
                setDoneWords((prev) => new Set(prev).add(word.id));
                awardCompletion({ typeEtape: "MOT", modalite: "EXERCICE", etapeCode: word.id, palier: lang === "fr" ? 4 : 3 });
              }}
              doneLabel={t.exerciceListe.done}
              style={writingStyle}
            />
          ))}
        </div>

        {allDone && isEvaluation && evaluationNextGroup && (
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/exercice/mots/$groupId",
                params: { groupId: evaluationNextGroup.id },
                search: { amaniEval: "1" },
              })
            }
            className="w-full py-4 rounded-2xl bg-[#4A90E2] hover:bg-[#3A7BC8] text-white font-extrabold text-lg shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.99]"
          >
            <span>{format(t.exerciceMots.nextGroup, { titre: evaluationNextGroup.title[lang] })}</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </MobileShell>
  );
}

function WordTraceRow({
  word,
  lang,
  speak,
  done,
  onDone,
  doneLabel,
  style,
}: {
  word: WordEntry;
  lang: ReturnType<typeof useLanguage>["lang"];
  speak: (text: string) => void;
  done: boolean;
  onDone: () => void;
  doneLabel: string;
  style: WritingStyle;
}) {
  const letters = lettersForWord(word, lang, style);
  const text = wordText(word, lang);
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
        <span className="text-[14px] font-bold text-[#4A3B2A] capitalize">{text}</span>
        <div className="flex items-center gap-2">
          {done && <span className="text-[13px] text-[#8FBF6F] font-bold">✓ {doneLabel}</span>}
          <button
            type="button"
            onClick={() => speak(text)}
            aria-label={text}
            className="w-8 h-8 grid place-items-center rounded-full bg-[#4A90E2]/15 text-[#2D6BBF] hover:bg-[#4A90E2] hover:text-white transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-3 overflow-x-auto">
        {letters.map((letter, i) => (
          <LetterTraceCell
            key={`${word.id}-${i}`}
            letter={letter}
            size={64}
            isActive={i === activeIdx}
            onSolved={() => handleLetterSolved(i)}
          />
        ))}
      </div>
    </div>
  );
}
