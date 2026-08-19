import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ArrowLeft, ChevronRight, Lock } from "lucide-react";
import {
  MobileShell,
  AmaniMascot,
  CahierFrame,
  RepetitionRow,
  EvaluationTimerBadge,
  EvaluationCompleteOverlay,
  ExerciseCompletePopup,
  zOrderedStepIndices,
  stepZIndex,
} from "@/components/amani";
import { useSignSpeech } from "@/hooks/useSignSpeech";
import { useExerciseSettings, readEvaluationDurationMinutes } from "@/hooks/useExerciseSettings";
import { useCountdown } from "@/hooks/useCountdown";
import { VOWELS, type LetterFormation } from "@/data/letter-formation-catalog";
import { getPalier2Groups, getPalier2GroupMap, lettersForGroup, findGroupForChar } from "@/data/palier2-groups";
import { useLanguage, format } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { sampleSVGPath, validateTrace, type Point } from "@/lib/traceValidation";
import { useWritingStyle } from "@/hooks/useWritingStyle";
import { getLetterFormation } from "@/data/letter-style-resolver";
import { awardCompletion, awardRestartBonus } from "@/lib/progress";

export const Route = createFileRoute("/exercice/lettre/$char")({
  validateSearch: (search: Record<string, unknown>): { pg?: string; amaniEval?: string } => ({
    pg: typeof search.pg === "string" ? search.pg : undefined,
    // Nommé "amaniEval" — certains noms de clé courts (ex. "chrono"=1) sont
    // interceptés et redirigés silencieusement par le proxy de dev.
    amaniEval: typeof search.amaniEval === "string" ? search.amaniEval : undefined,
  }),
  head: ({ params }) => ({
    meta: [
      { title: `Exercice : Tracé de "${params.char}" — Flores Gong Nota` },
      {
        name: "description",
        content: `Exerce-toi à tracer la lettre "${params.char}" signe par signe selon la méthode Flores Gong Nota.`,
      },
    ],
  }),
  component: LetterExerciseScreen,
});

// ─── Types & Utilitaires de validation ────────────────────────────────────────

type StepStatus = "idle" | "drawing" | "success" | "retry";

interface CompletedStep {
  stepIdx: number;
  userPoints: Point[];
  strokeColor: string;
}

/** Tolérance des lettres : un peu plus souple que les signes (tracés multi-étapes plus complexes). */
const LETTER_TOLERANCE_PX = 27;

// ─── Composant Principal de l'Exercice ────────────────────────────────────────

function LetterExerciseScreen() {
  const { char } = Route.useParams();
  const { pg, amaniEval } = Route.useSearch();
  const navigate = useNavigate();
  const { speak } = useSignSpeech();
  const { t, lang } = useLanguage();
  const writingStyle = useWritingStyle();

  const letter = getLetterFormation(char, writingStyle);

  // Groupe de progression : le paramètre pg prime, sinon on le retrouve à partir du caractère.
  const progressionGroup = (pg ? getPalier2GroupMap(lang).get(pg) : undefined) ?? findGroupForChar(char, lang);
  const groupId = progressionGroup?.id ?? "l1";
  const allLetters = progressionGroup ? lettersForGroup(progressionGroup, writingStyle) : VOWELS;
  const currentIdx = allLetters.findIndex((l) => l.char === char);
  const nextLetter = currentIdx < allLetters.length - 1 ? allLetters[currentIdx + 1] : null;

  // ── Mode évaluation : chronomètre + enchaînement continu sur tout le palier ──
  const isEvaluation = amaniEval === "1";
  const evaluationSeconds = useMemo(() => readEvaluationDurationMinutes() * 60, []);
  const [evaluationExpired, setEvaluationExpired] = useState(false);
  const remaining = useCountdown(isEvaluation ? evaluationSeconds : 0, () => setEvaluationExpired(true));

  // À la fin d'un groupe, en évaluation on enchaîne sur le premier caractère du
  // groupe suivant (retour au premier groupe une fois le dernier atteint) —
  // seul le chronomètre décide de la fin de la session, pas la fin du contenu.
  const palier2Groups = getPalier2Groups(lang);
  const groupIdx = progressionGroup ? palier2Groups.findIndex((g) => g.id === progressionGroup.id) : -1;
  const nextGroup = groupIdx >= 0 ? palier2Groups[(groupIdx + 1) % palier2Groups.length] : undefined;
  const evaluationNextLetter =
    isEvaluation && !nextLetter && nextGroup ? lettersForGroup(nextGroup, writingStyle)[0] : undefined;

  // Cible du bouton "Suivant" du pop-up de fin d'exercice (hors évaluation) :
  // la lettre suivante du même groupe, sinon la première lettre du groupe
  // suivant — sans boucler à la fin du dernier groupe, contrairement au
  // comportement de l'évaluation ci-dessus.
  const nextGroupForCours = groupIdx >= 0 && groupIdx < palier2Groups.length - 1 ? palier2Groups[groupIdx + 1] : undefined;
  const nextCoursChar = nextLetter?.char ?? (nextGroupForCours ? lettersForGroup(nextGroupForCours, writingStyle)[0]?.char : undefined);
  const nextCoursPg = nextLetter ? groupId : nextGroupForCours?.id;

  // ── Réglages partagés (configurés dans Profil > Réglages) ──
  const { repetitions, tolerance } = useExerciseSettings();

  // ── Phase A : chaque signe de la lettre, exercé séparément ──
  const [doneSteps, setDoneSteps] = useState<Set<number>>(new Set());

  // ── Phase B : la lettre complète, écrite en une seule fois ──
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<CompletedStep[]>([]);
  const [stepStatus, setStepStatus] = useState<StepStatus>("idle");
  const [letterSuccess, setLetterSuccess] = useState(false);
  // Incrémenté à chaque "Recommencer" pour forcer le remontage des
  // RepetitionRow de la Phase A (elles gèrent leur propre état interne).
  const [restartKey, setRestartKey] = useState(0);
  // Vrai entre le clic sur "Recommencer" et la prochaine réussite complète :
  // le bonus n'est attribué qu'à ce moment-là (voir l'effet plus bas), jamais
  // au clic lui-même — sinon rien n'empêche de cliquer puis de sortir sans
  // rien refaire.
  const [awaitingRepeatCompletion, setAwaitingRepeatCompletion] = useState(false);

  const resetAll = useCallback(() => {
    setDoneSteps(new Set());
    setCurrentStepIdx(0);
    setCompletedSteps([]);
    setStepStatus("idle");
    setLetterSuccess(false);
  }, []);

  useEffect(() => {
    if (letterSuccess && awaitingRepeatCompletion) {
      awardRestartBonus();
      setAwaitingRepeatCompletion(false);
    }
  }, [letterSuccess, awaitingRepeatCompletion]);

  // Réinitialiser en changeant de lettre ou de réglage de répétitions
  useEffect(() => {
    resetAll();
    if (letter) {
      speak(format(t.exerciceLettre.speakStart, { name: letter.name[lang] }));
    }
  }, [letter, repetitions, speak, lang, t, resetAll]);

  if (!letter) {
    return (
      <MobileShell>
        <div className="flex flex-col items-center justify-center flex-1 p-8 gap-4 bg-[#F5EDE0]">
          <p className="text-[#4A3B2A] text-[18px] font-bold text-center">
            &quot;{char}&quot; {t.exerciceLettre.notFound}
          </p>
          <Link
            to="/exercice-liste"
            search={{ group: "l1" }}
            className="px-6 py-3 rounded-full bg-[#8FBF6F] text-white font-bold text-[15px]"
          >
            {t.exerciceLettre.backToNotebook}
          </Link>
        </div>
      </MobileShell>
    );
  }

  const allStepsDone = doneSteps.size === letter.steps.length;
  const activeStep = letter.steps[currentStepIdx];

  const handleStepSuccess = useCallback(
    (userPoints: Point[]) => {
      if (!activeStep) return;
      const newCompleted = [
        ...completedSteps,
        { stepIdx: currentStepIdx, userPoints, strokeColor: activeStep.strokeColor },
      ];
      setCompletedSteps(newCompleted);

      if (currentStepIdx + 1 < letter.steps.length) {
        speak(t.exerciceLettre.speakNextStep);
        setTimeout(() => {
          setCurrentStepIdx((idx) => idx + 1);
          setStepStatus("idle");
        }, 600);
      } else {
        speak(format(t.exerciceLettre.speakLetterDone, { name: letter.name[lang] }));
        setLetterSuccess(true);
        awardCompletion({ typeEtape: "LETTRE", modalite: "EXERCICE", etapeCode: letter.char, palier: 2 });
      }
    },
    [activeStep, completedSteps, currentStepIdx, letter, speak, t, lang]
  );

  const handleStepRetry = useCallback(() => {
    if (!activeStep) return;
    speak(format(t.exerciceLettre.speakRetryStep, { desc: activeStep.description[lang] }));
  }, [activeStep, speak, t, lang]);

  return (
    <MobileShell>
      {isEvaluation && !evaluationExpired && <EvaluationTimerBadge remaining={remaining} />}
      {isEvaluation && evaluationExpired && (
        <EvaluationCompleteOverlay onBack={() => navigate({ to: "/accueil" })} />
      )}
      {letterSuccess && !isEvaluation && (
        <ExerciseCompletePopup
          onBackHome={() => navigate({ to: "/accueil" })}
          onNext={
            nextCoursChar
              ? () =>
                  navigate({
                    to: "/cours/lettres/formation/$char",
                    params: { char: nextCoursChar },
                    search: nextCoursPg ? { pg: nextCoursPg } : undefined,
                  })
              : undefined
          }
          onRestart={() => {
            resetAll();
            setRestartKey((k) => k + 1);
            setAwaitingRepeatCompletion(true);
          }}
        />
      )}

      {/* En-tête / AppBar */}
      <header className="flex items-center justify-between px-6 pt-6 pb-4 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10">
        <div className="flex items-center gap-3">
          <Link
            to="/exercice-liste"
            search={{ group: groupId }}
            aria-label={t.exerciceLettre.backToNotebook}
            className="grid h-11 w-11 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-[#4A3B2A] rtl:rotate-180" strokeWidth={2.5} />
          </Link>
          <div>
            <h1 className="text-[24px] font-bold text-[#4A3B2A] leading-tight">
              {t.exerciceLettre.title} &quot;<span className="text-[#A9784F]">{letter.char}</span>&quot;
            </h1>
            <p className="text-[13px] text-[#7A6A55] font-normal">
              {format(t.exerciceLettre.signsReady, { done: doneSteps.size, total: letter.steps.length })} · {letter.name[lang]}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 bg-[#F5EDE0] pb-10 flex flex-col items-center">
        {/* Bandeau d'explication ou d'encouragement */}
        <div className="w-full max-w-sm bg-[#FBF6EC] rounded-[20px] p-4 border border-[#4A3B2A]/10 shadow-sm flex items-center gap-3.5">
          <div className="shrink-0">
            <AmaniMascot pose={letterSuccess ? "celebration" : allStepsDone ? "demonstration" : "encouragement"} size="small" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-[#4A3B2A] leading-snug">
              {letterSuccess ? t.exerciceLettre.successAll : allStepsDone ? t.exerciceLettre.finalTitle : t.exerciceLettre.practiceStepsTitle}
            </p>
            <p className="text-[12px] text-[#7A6A55] mt-0.5">
              {letterSuccess
                ? t.exerciceLettre.successAllSub
                : allStepsDone
                  ? t.exerciceLettre.finalHint
                  : format(t.exerciceLettre.practiceStepsHint, { reps: repetitions })}
            </p>
          </div>
        </div>

        {/* ── Phase A : chaque signe de la lettre, exercé séparément et dans l'ordre ── */}
        <div className="w-full max-w-sm flex flex-col gap-3.5">
          {letter.steps.map((step, i) => {
            const locked = i > 0 && !doneSteps.has(i - 1);
            return (
              <RepetitionRow
                key={`${letter.char}-step-${i}-r${restartKey}`}
                entry={{
                  id: `${letter.char}-step-${i}`,
                  pathD: step.pathD,
                  startXY: step.startXY,
                  strokeColor: step.strokeColor,
                }}
                label={step.description[lang]}
                badge={
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#A9784F] text-white text-[16px] font-extrabold leading-none">
                    {i + 1}
                  </span>
                }
                repetitions={repetitions}
                tolerance={tolerance}
                doneLabel={t.exerciceListe.done}
                locked={locked}
                onSpeak={() => speak(step.description[lang])}
                onAllDone={() => setDoneSteps((prev) => new Set(prev).add(i))}
              />
            );
          })}
        </div>

        {/* ── Phase B : la lettre complète, écrite d'un seul geste continu ── */}
        {!allStepsDone ? (
          <div className="w-full max-w-sm rounded-[20px] border border-dashed border-[#4A3B2A]/20 bg-[#FBF6EC]/60 p-6 flex flex-col items-center gap-2 text-center">
            <Lock className="w-6 h-6 text-[#4A3B2A]/40" />
            <p className="text-[13px] font-semibold text-[#7A6A55]">{t.exerciceLettre.finalLocked}</p>
          </div>
        ) : (
          <>
            <div className="my-2">
              <LetterDrawingCanvas
                letter={letter}
                currentStepIdx={currentStepIdx}
                completedSteps={completedSteps}
                stepStatus={stepStatus}
                onStepStatusChange={setStepStatus}
                onSuccess={handleStepSuccess}
                onRetry={handleStepRetry}
                w={270}
                h={270}
              />
            </div>

          </>
        )}
      </div>

      {/* Overlay de Célébration Finale — uniquement en évaluation, qui enchaîne
          les lettres en continu ; hors évaluation, c'est ExerciseCompletePopup
          (Suivant / Recommencer / Retour à l'accueil) qui gère la fin. */}
      {letterSuccess && isEvaluation && (
        <LetterSuccessOverlay
          letter={letter}
          nextLetter={nextLetter}
          groupId={groupId}
          isEvaluation={isEvaluation}
          evaluationNextLetter={evaluationNextLetter}
          evaluationNextGroupId={nextGroup?.id}
          onClose={() => setLetterSuccess(false)}
          onReset={resetAll}
        />
      )}
    </MobileShell>
  );
}

// ─── Canevas de Tracé Multi-Signes (`LetterDrawingCanvas`) ────────────────────

interface LetterDrawingCanvasProps {
  letter: LetterFormation;
  currentStepIdx: number;
  completedSteps: CompletedStep[];
  stepStatus: StepStatus;
  onStepStatusChange: (status: StepStatus) => void;
  onSuccess: (userPoints: Point[]) => void;
  onRetry: () => void;
  w: number;
  h: number;
}

function LetterDrawingCanvas({
  letter,
  currentStepIdx,
  completedSteps,
  stepStatus,
  onStepStatusChange,
  onSuccess,
  onRetry,
  w,
  h,
}: LetterDrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userPointsRef = useRef<Point[]>([]);
  const refPointsRef = useRef<Point[]>([]);
  const isDrawingRef = useRef(false);

  const activeStep = letter.steps[currentStepIdx];

  // Échantillonner le signe actif
  useEffect(() => {
    if (activeStep) {
      refPointsRef.current = sampleSVGPath(activeStep.pathD, 45);
    } else {
      refPointsRef.current = [];
    }
  }, [activeStep]);

  // Initialiser le canvas HD (Retina)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, [w, h]);

  // Redessiner à chaque changement d'étape ou de statut
  const drawAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);
    const sc = Math.min(w / 200, h / 200);
    const ox = (w - 200 * sc) / 2;
    const oy = (h - 200 * sc) / 2;

    // 1. Dessiner d'abord toutes les étapes déjà validées en trait plein coloré
    // (dans l'ordre de superposition trait > crochet > courbe, pas l'ordre de tracé)
    const zOrderedCompleted = [...completedSteps].sort(
      (a, b) => stepZIndex(letter.steps[a.stepIdx] ?? { family: "courbe" }) - stepZIndex(letter.steps[b.stepIdx] ?? { family: "courbe" }),
    );
    for (const completed of zOrderedCompleted) {
      const stepInfo = letter.steps[completed.stepIdx];
      if (!stepInfo) continue;
      const refPts = sampleSVGPath(stepInfo.pathD, 35);
      if (refPts.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(refPts[0].x * sc + ox, refPts[0].y * sc + oy);
      for (let i = 1; i < refPts.length; i++) {
        ctx.lineTo(refPts[i].x * sc + ox, refPts[i].y * sc + oy);
      }
      ctx.strokeStyle = completed.strokeColor;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
  }, [completedSteps, h, letter.steps, w]);

  useEffect(() => {
    drawAll();
  }, [drawAll, currentStepIdx, stepStatus]);

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
    if (!activeStep || stepStatus === "success" || stepStatus === "retry") return;
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    onStepStatusChange("drawing");
    userPointsRef.current = [];

    // Nettoyer pour recommencer le tracé de ce signe (en gardant les précédents validés via drawAll)
    drawAll();

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pt = canvasCoords(e);
    userPointsRef.current.push(svgCoords(pt));
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.strokeStyle = "#5BAA6A"; // Vert actif du tracé
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pt = canvasCoords(e);
    userPointsRef.current.push(svgCoords(pt));
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (canvasRef.current?.hasPointerCapture(e.pointerId)) {
      canvasRef.current.releasePointerCapture(e.pointerId);
    }

    // Validation avec tolérance souple de 34px (17% de 200px)
    const result = validateTrace(userPointsRef.current, refPointsRef.current, LETTER_TOLERANCE_PX);
    if (result.valid) {
      onStepStatusChange("success");
      onSuccess([...userPointsRef.current]);
    } else {
      onStepStatusChange("retry");
      onRetry();
      setTimeout(() => {
        // Effacer le tracé raté au bout de 1.2s en ré-affichant les étapes validées
        drawAll();
        onStepStatusChange("idle");
      }, 1200);
    }
  };

  // Convertir startXY en coordonnées canvas pour la pastille de départ
  const sc = Math.min(w / 200, h / 200);
  const ox = (w - 200 * sc) / 2;
  const oy = (h - 200 * sc) / 2;
  const startPx = activeStep
    ? { x: activeStep.startXY[0] * sc + ox, y: activeStep.startXY[1] * sc + oy }
    : { x: 0, y: 0 };

  return (
    <CahierFrame
      className="relative shrink-0 border-2 shadow-inner transition-all duration-300"
      rounded={16}
      style={{
        width: w,
        height: h,
        borderColor: stepStatus === "success" ? "#8FBF6F" : stepStatus === "retry" ? "#E05252" : "#A9784F40",
      }}
    >
      {/* ── Guides SVG en pointillés (Étapes futures / Etape active) ── */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full pointer-events-none">
        {zOrderedStepIndices(letter.steps).map((idx) => {
          const step = letter.steps[idx];
          const isCompleted = completedSteps.some((c) => c.stepIdx === idx);
          if (isCompleted) return null; // Les étapes validées sont dessinées sur le canvas HTML5
          const isActiveStep = idx === currentStepIdx;

          return (
            <path
              key={`guide-${idx}`}
              d={step.pathD}
              stroke={isActiveStep ? (stepStatus === "retry" ? "#E05252" : "#9BB5CC") : "#B8CCE0"}
              strokeWidth={isActiveStep ? 10 : 8}
              strokeLinecap="round"
              strokeDasharray={isActiveStep ? "8 6" : "5 7"}
              fill="none"
              opacity={isActiveStep ? 0.85 : 0.35}
            />
          );
        })}
      </svg>

      {/* ── Pastille verte indiquant le départ du geste en cours ── */}
      {(stepStatus === "idle" || stepStatus === "retry") && activeStep && (
        <div
          className="absolute w-4 h-4 rounded-full bg-[#5BAA6A] border-2 border-white shadow grid place-items-center z-10 animate-pulse pointer-events-none"
          style={{ left: startPx.x - 8, top: startPx.y - 8 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
      )}

      {/* ── Canvas HTML5 pour le dessin des tracés validés et du trait en cours ── */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={cn("absolute inset-0 w-full h-full touch-none z-20", stepStatus === "success" ? "cursor-default" : "cursor-crosshair")}
      />
    </CahierFrame>
  );
}

// ─── Overlay de Victoire Finale (`LetterSuccessOverlay`) ──────────────────────

function LetterSuccessOverlay({
  letter,
  nextLetter,
  groupId,
  isEvaluation,
  evaluationNextLetter,
  evaluationNextGroupId,
  onClose,
  onReset,
}: {
  letter: LetterFormation;
  nextLetter: LetterFormation | null;
  groupId: string;
  isEvaluation: boolean;
  evaluationNextLetter: LetterFormation | undefined;
  evaluationNextGroupId: string | undefined;
  onClose: () => void;
  onReset: () => void;
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center px-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
        <AmaniMascot pose="celebration" size="medium" priority />
        <div>
          <h2 className="text-[24px] font-extrabold text-[#4A3B2A]">
            {t.exerciceLettre.successTitle}
          </h2>
          <p className="text-[14px] text-[#7A6A55] mt-1">
            {t.exerciceLettre.successBody} <strong>&quot;{letter.char}&quot;</strong> !
          </p>
        </div>

        <div className="w-20 h-20 rounded-2xl bg-[#FBF6EC] border-2 border-[#8FBF6F] flex items-center justify-center text-[44px] font-extrabold text-[#8FBF6F] shadow-sm my-1">
          {letter.char}
        </div>

        <div className="flex flex-col gap-2.5 w-full mt-2">
          {nextLetter && (
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: "/exercice/lettre/$char",
                  params: { char: nextLetter.char },
                  search: { pg: groupId, amaniEval: isEvaluation ? "1" : undefined },
                })
              }
              className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-[#8FBF6F] hover:bg-[#7AAE5A] text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>{t.exerciceLettre.nextLetter} ({nextLetter.char})</span>
              <ChevronRight className="w-4 h-4 stroke-[3] rtl:rotate-180" />
            </button>
          )}

          {!nextLetter && isEvaluation && evaluationNextLetter && evaluationNextGroupId && (
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: "/exercice/lettre/$char",
                  params: { char: evaluationNextLetter.char },
                  search: { pg: evaluationNextGroupId, amaniEval: "1" },
                })
              }
              className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-[#8FBF6F] hover:bg-[#7AAE5A] text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>{t.exerciceLettre.nextLetter} ({evaluationNextLetter.char})</span>
              <ChevronRight className="w-4 h-4 stroke-[3] rtl:rotate-180" />
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-[#A9784F]/15 text-[#A9784F] hover:bg-[#A9784F]/25 active:scale-95 transition-all"
          >
            {t.exerciceLettre.practiceAgain}
          </button>

          <Link
            to="/exercice-liste"
            search={{ group: groupId }}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-[#7A6A55] hover:text-[#4A3B2A] transition-colors"
          >
            {t.exerciceLettre.backToNotebookLink}
          </Link>
        </div>
      </div>
    </div>
  );
}
