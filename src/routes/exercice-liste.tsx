import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowLeft, Volume2, ChevronRight } from "lucide-react";
import { MobileShell, AmaniMascot, RepetitionRow, EvaluationTimerBadge, EvaluationCompleteOverlay } from "@/components/amani";
import { useSignSpeech } from "@/hooks/useSignSpeech";
import { useExerciseSettings, readEvaluationDurationMinutes } from "@/hooks/useExerciseSettings";
import { useCountdown } from "@/hooks/useCountdown";
import { EXERCISE_CATALOG, type SignExercise } from "@/data/sign-exercise-catalog";
import { getPalier2GroupMap, lettersForGroup } from "@/data/palier2-groups";
import { useLanguage, format } from "@/i18n/LanguageContext";
import { useWritingStyle } from "@/hooks/useWritingStyle";

export const Route = createFileRoute("/exercice-liste")({
  validateSearch: (search: Record<string, unknown>): { family?: string; group?: string; amaniEval?: string } => ({
    family: typeof search.family === "string" ? search.family : undefined,
    group: typeof search.group === "string" ? search.group : undefined,
    // Nommé "amaniEval" — certains noms de clé courts (ex. "chrono"=1) sont
    // interceptés et redirigés silencieusement par le proxy de dev.
    amaniEval: typeof search.amaniEval === "string" ? search.amaniEval : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Cahier d'Écriture — Amani" },
      { name: "description", content: "Repasse sur les pointillés pour apprendre à tracer les signes de la méthode Flores Gong Nota." },
    ],
  }),
  component: ExerciceListeScreen,
});

// ─── SignExerciseRow (adapte un SignExercise à la RepetitionRow partagée) ──────
interface SignExerciseRowProps {
  entry: SignExercise;
  repetitions: number;
  tolerance: number;
  hideFamilyBadge?: boolean;
}

function SignExerciseRow({ entry, repetitions, tolerance, hideFamilyBadge }: SignExerciseRowProps) {
  const { speak } = useSignSpeech();
  const { t, lang } = useLanguage();

  const badge = (!hideFamilyBadge || entry.scale === "reduced") ? (
    <span
      className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide"
      style={{
        backgroundColor: entry.badgeBg, color: entry.badgeText,
        border: entry.badgeBg === "#F5EDE0" || entry.badgeBg === "#FBF6EC" ? "1px solid " + entry.badgeText : "none"
      }}
    >
      {entry.scale === "reduced" ? t.exerciceListe.reducedLabel : t.exerciceListe.familyNames[entry.family]}
    </span>
  ) : null;

  return (
    <RepetitionRow
      entry={entry}
      label={entry.label[lang]}
      badge={badge}
      repetitions={repetitions}
      tolerance={tolerance}
      doneLabel={t.exerciceListe.done}
      onSpeak={() => speak(entry.consigne[lang])}
      onAllDone={() => speak(t.exerciceListe.rowComplete)}
    />
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
function ExerciceListeScreen() {
  const { speak } = useSignSpeech();
  const { t, lang } = useLanguage();
  const { family, group, amaniEval } = Route.useSearch();
  const { repetitions, tolerance } = useExerciseSettings();
  const writingStyle = useWritingStyle();
  const navigate = useNavigate();

  const isEvaluation = amaniEval === "1";
  const evaluationSeconds = useMemo(() => readEvaluationDurationMinutes() * 60, []);
  const [evaluationExpired, setEvaluationExpired] = useState(false);
  const remaining = useCountdown(isEvaluation ? evaluationSeconds : 0, () => setEvaluationExpired(true));

  const progressionGroup = group ? getPalier2GroupMap(lang).get(group) : undefined;

  if (progressionGroup) {
    const groupLetters = lettersForGroup(progressionGroup, writingStyle);
    const itemPrefix = progressionGroup.kind === "chiffres" ? t.exerciceListe.digitPrefix : t.exerciceListe.letterPrefix;
    const groupSubtitle = progressionGroup.kind === "chiffres" ? t.exerciceListe.subtitleGroupDigits : t.exerciceListe.subtitleGroupLettres;

    return (
      <MobileShell>
        <header className="flex items-center justify-between px-5 pt-5 pb-3 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10">
          <div className="flex items-center gap-3">
            <Link
              to="/accueil"
              aria-label={t.exerciceListe.backAria}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform"
            >
              <ArrowLeft className="h-5 w-5 text-[#4A3B2A]" strokeWidth={2.5} />
            </Link>
            <div>
              <h1 className="text-[22px] font-bold text-[#4A3B2A] leading-tight">
                {format(t.exerciceListe.titleGroup, { titre: progressionGroup.title[lang] })}
              </h1>
              <p className="text-[12px] text-[#7A6A55]">
                {groupSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => speak(format(t.exerciceListe.introGroup, { titre: progressionGroup.title[lang] }))}
            aria-label={t.common.instruction}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#A9784F] text-white shadow active:scale-95 transition-transform"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </header>

        <div className="px-5 py-3.5 bg-[#EAF1FB]/80 border-b border-[#4A90E2]/20 flex items-center gap-3 shrink-0">
          <AmaniMascot pose="demonstration" size="small" />
          <p className="text-[12.5px] text-[#2D5E8A] font-medium leading-snug">
            {t.exerciceListe.groupHint}
          </p>
        </div>

        <section className="flex-1 overflow-y-auto bg-[#F5EDE0] px-4 py-5 flex flex-col gap-3.5 pb-12">
          {groupLetters.map((letter) => (
            <Link
              key={letter.char}
              to="/exercice/lettre/$char"
              params={{ char: letter.char }}
              search={{ pg: progressionGroup.id }}
              className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-[#4A3B2A]/15 shadow-xs hover:border-[#8FBF6F] hover:shadow-md transition-all active:scale-98"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FBF6EC] border border-[#4A3B2A]/15 flex items-center justify-center text-[28px] font-extrabold text-[#A9784F] group-hover:scale-105 transition-transform shadow-inner shrink-0">
                  {letter.char}
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[#4A3B2A]">
                    {itemPrefix} &quot;{letter.char}&quot;
                  </h3>
                  <p className="text-[12.5px] text-[#7A6A55] mt-0.5">
                    {letter.name[lang]} · {format(t.exerciceListe.gestureCount, { count: letter.steps.length })}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {letter.steps.map((st, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-[#F5EDE0] text-[#7A6A55] font-semibold border border-[#4A3B2A]/10"
                      >
                        {st.description[lang].split(" ")[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-9 h-9 rounded-full bg-[#8FBF6F]/15 group-hover:bg-[#8FBF6F] flex items-center justify-center text-[#8FBF6F] group-hover:text-white transition-colors shrink-0">
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </Link>
          ))}
        </section>
      </MobileShell>
    );
  }

  // Grouper par famille pour affichage
  const allGrouped = [
    { titre: t.exerciceListe.familyNames.point, familyKey: "point", entries: EXERCISE_CATALOG.filter((e) => e.family === "point") },
    { titre: t.exerciceListe.familyNames.courbe, familyKey: "courbe", entries: EXERCISE_CATALOG.filter((e) => e.family === "courbe") },
    { titre: t.exerciceListe.familyNames.crochet, familyKey: "crochet", entries: EXERCISE_CATALOG.filter((e) => e.family === "crochet") },
    { titre: t.exerciceListe.familyNames.trait, familyKey: "trait", entries: EXERCISE_CATALOG.filter((e) => e.family === "trait") },
  ];

  const grouped = family
    ? allGrouped.filter((g) => g.familyKey === family)
    : allGrouped;

  const activeHeaderTitle = family && grouped[0]
    ? format(t.exerciceListe.titleFamily, { titre: grouped[0].titre })
    : t.exerciceListe.title;

  return (
    <MobileShell>
      {isEvaluation && !evaluationExpired && <EvaluationTimerBadge remaining={remaining} />}
      {isEvaluation && evaluationExpired && (
        <EvaluationCompleteOverlay onBack={() => navigate({ to: "/accueil" })} />
      )}

      {/* ── En-tête ── */}
      <header className="flex items-center justify-between px-5 pt-5 pb-3 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10">
        <div className="flex items-center gap-3">
          <Link
            to="/accueil"
            aria-label={t.exerciceListe.backAria}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-[#4A3B2A]" strokeWidth={2.5} />
          </Link>
          <div>
            <h1 className="text-[22px] font-bold text-[#4A3B2A] leading-tight">
              {activeHeaderTitle}
            </h1>
            <p className="text-[12px] text-[#7A6A55]">
              {t.exerciceListe.subtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => speak(t.exerciceListe.introGeneral)}
          aria-label={t.common.instruction}
          className="grid h-9 w-9 place-items-center rounded-full bg-[#A9784F] text-white shadow active:scale-95 transition-transform"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </header>

      {/* ── Instruction ── */}
      <div className="px-5 py-3 bg-[#EAF1FB]/80 border-b border-[#4A90E2]/20 flex items-center gap-2.5 shrink-0">
        <span className="w-6 h-6 rounded-full bg-[#5BAA6A] flex items-center justify-center shrink-0">
          <span className="w-3 h-3 rounded-full bg-white" />
        </span>
        <p className="text-[12.5px] text-[#2D5E8A] font-medium leading-snug">
          {t.exerciceListe.startHint}
        </p>
      </div>

      {/* ── Contenu ── */}
      <section className="flex-1 overflow-y-auto bg-[#F5EDE0] px-3 py-4 flex flex-col gap-5 pb-12">
        {grouped.map(({ titre, entries }) => (
          <div key={titre} className="flex flex-col gap-3">
            {!family && (
              <h2 className="text-[16px] font-bold text-[#4A3B2A] px-1">{titre}</h2>
            )}
            {entries.map((entry) => (
              <SignExerciseRow
                key={entry.id}
                entry={entry}
                repetitions={repetitions}
                tolerance={tolerance}
                hideFamilyBadge={!!family}
              />
            ))}
          </div>
        ))}
      </section>
    </MobileShell>
  );
}
