import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Lock, Leaf, Sprout, PenTool, BookOpen, Blocks, Grid3x3, Sparkle } from "lucide-react";
import { AmaniMascot } from "@/components/amani";
import victoirePalierImg from "@/assets/amani-victoire-palier-badge.png";
import { getPalier2Groups } from "@/data/palier2-groups";
import { SYLLABLE_GROUPS } from "@/data/syllable-catalog";
import { PALIER3_GROUPS } from "@/data/word-catalog";

/** Difficulté progressive des mots croisés du Palier 3 : de 2 à 10 mots par grille. */
const PALIER3_CROSSWORD_LEVELS = [2, 3, 4, 5, 6, 7, 8, 9, 10];
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

export const Route = createFileRoute("/_app/accueil")({
  head: () => ({
    meta: [
      { title: "Parcours de la branche — Amani" },
      {
        name: "description",
        content: "Suis le chemin en zigzag et fais éclore les bourgeons une étape à la fois.",
      },
    ],
  }),
  component: ParcoursBranche,
});

type StepKind = "active" | "locked" | "bonus" | "crossword" | "medal" | "header";

type Step = {
  kind: StepKind;
  iconType?: "feuille" | "branche";
  title?: string;
  subtitle?: string;
  tagline?: string;
  palierNum?: number;
  bannerBg?: string;
  bannerBorder?: string;
  /** Couleur du texte/icônes du bandeau — blanc par défaut, à surcharger pour les bandeaux très clairs. */
  bannerText?: string;
  bannerIcon?: React.ComponentType<{ className?: string }>;
};

type TargetRoute =
  | string
  | {
    pathname: string;
    search?: Record<string, unknown>;
  };

type StepEntry = { step: Step; side: -1 | 0 | 1; to?: TargetRoute };

/** Génère un chemin en zigzag dont le nombre d'ondulations suit la longueur réelle du parcours. */
function buildZigzagPath(turns: number): { d: string; height: number } {
  const stepHeight = 100;
  const startY = 40;
  let d = `M150 ${startY}`;
  let y = startY;
  for (let i = 0; i < turns; i++) {
    const controlX = i % 2 === 0 ? 60 : 240;
    const endY = y + stepHeight;
    d += ` Q ${controlX} ${y + stepHeight / 2} 150 ${endY}`;
    y = endY;
  }
  return { d, height: y };
}

// ─── Icône SVG de la Branche (d'après l'image fournie) ────────────────────────
function BrancheExerciseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" fill="currentColor" className={className} aria-hidden>
      <path
        d="M 45,115 C 47,95 51,70 57,50 C 63,32 75,18 90,10
           C 87,16 77,26 68,41 C 59,56 53,76 49,115 Z"
      />
      <path
        d="M 50,78 C 41,64 32,51 22,35 C 20,43 27,53 36,67 C 42,74 46,79 50,78 Z"
      />
      <path d="M 23,38 L 15,33 L 21,45 Z M 27,47 L 16,45 L 26,54 Z M 32,56 L 20,58 L 31,64 Z M 37,65 L 23,71 L 38,73 Z" />
      <path d="M 26,38 L 35,34 L 29,46 Z M 32,50 L 42,44 L 35,57 Z M 39,61 L 48,55 L 42,67 Z" />
      <path d="M 86,13 L 73,15 L 82,23 Z M 78,21 L 64,25 L 74,32 Z M 70,32 L 54,38 L 66,43 Z M 63,45 L 47,51 L 59,56 Z M 57,58 L 42,64 L 53,68 Z M 51,70 L 37,77 L 48,80 Z" />
      <path d="M 81,19 L 90,23 L 77,29 Z M 73,30 L 86,35 L 69,41 Z M 65,42 L 80,48 L 62,53 Z M 58,54 L 72,61 L 55,65 Z M 52,66 L 66,72 L 49,76 Z" />
    </svg>
  );
}

function ParcoursBranche() {
  const { t, lang } = useLanguage();

  const paliers = t.parcours.paliers;
  const PALIER2_GROUPS = getPalier2Groups(lang);

  // side: 0 = center, -1 = left, +1 = right
  const steps: StepEntry[] = [
    // ─── PALIER 1 : Les Signes de base ───
    {
      step: {
        kind: "header",
        title: paliers[0].title,
        subtitle: paliers[0].subtitle,
        tagline: paliers[0].tagline,
        palierNum: 1,
        bannerBg: "#8FBF6F",
        bannerBorder: "#5E8E3E",
        bannerIcon: Sprout,
      },
      side: 0,
    },
    { step: { kind: "active", iconType: "feuille" }, side: -1, to: "/cours/point" },
    { step: { kind: "active", iconType: "branche" }, side: 1, to: { pathname: "/exercice-liste", search: { family: "point" } } },
    { step: { kind: "locked", iconType: "feuille" }, side: -1, to: "/cours/courbe" },
    { step: { kind: "locked", iconType: "branche" }, side: 1, to: { pathname: "/exercice-liste", search: { family: "courbe" } } },
    { step: { kind: "locked", iconType: "feuille" }, side: -1, to: "/cours/crochet" },
    { step: { kind: "locked", iconType: "branche" }, side: 1, to: { pathname: "/exercice-liste", search: { family: "crochet" } } },
    { step: { kind: "locked", iconType: "feuille" }, side: -1, to: "/cours/trait" },
    { step: { kind: "locked", iconType: "branche" }, side: 1, to: { pathname: "/exercice-liste", search: { family: "trait" } } },
    {
      step: { kind: "medal" },
      side: 0,
      to: { pathname: "/exercice-liste", search: { amaniEval: "1" } },
    },

    // ─── PALIER 2 : Combinatoire ───
    {
      step: {
        kind: "header",
        title: paliers[1].title,
        subtitle: paliers[1].subtitle,
        tagline: paliers[1].tagline,
        palierNum: 2,
        bannerBg: "#A9784F",
        bannerBorder: "#7A5332",
        bannerIcon: PenTool,
      },
      side: 0,
    },
    ...PALIER2_GROUPS.flatMap((group, idx): StepEntry[] => {
      const kind: StepKind = idx === 0 ? "active" : "locked";
      return [
        {
          step: { kind, iconType: "feuille" },
          side: -1,
          to: { pathname: `/cours/lettres/formation/${group.chars[0]}`, search: { pg: group.id } },
        },
        {
          step: { kind, iconType: "branche" },
          side: 1,
          to: { pathname: "/exercice-liste", search: { group: group.id } },
        },
      ];
    }),
    {
      step: { kind: "medal" },
      side: 0,
      to: {
        pathname: `/exercice/lettre/${PALIER2_GROUPS[0].chars[0]}`,
        search: { pg: PALIER2_GROUPS[0].id, amaniEval: "1" },
      },
    },

    // ─── PALIER 3 : Les Syllabes (français uniquement — méthode de lecture
    // "consonne + voyelle" spécifique au français) ───
    ...(lang === "fr"
      ? ([
          {
            step: {
              kind: "header",
              title: paliers[2].title,
              subtitle: paliers[2].subtitle,
              tagline: paliers[2].tagline,
              palierNum: 3,
              bannerBg: "#F4F9FD",
              bannerBorder: "#CFE3F2",
              bannerText: "#4A7A9C",
              bannerIcon: Blocks,
            },
            side: 0,
          },
          ...SYLLABLE_GROUPS.flatMap((group, idx): StepEntry[] => {
            const kind: StepKind = idx === 0 ? "active" : "locked";
            return [
              {
                step: { kind, iconType: "feuille" },
                side: -1,
                to: { pathname: `/cours/syllabes/${group.consonant}` },
              },
              {
                step: { kind, iconType: "branche" },
                side: 1,
                to: { pathname: `/exercice/syllabes/${group.consonant}` },
              },
            ];
          }),
          {
            step: { kind: "medal" },
            side: 0,
            to: {
              pathname: `/exercice/syllabes/${SYLLABLE_GROUPS[0].consonant}`,
              search: { amaniEval: "1" },
            },
          },
        ] satisfies StepEntry[])
      : []),

    // ─── PALIER 4 : Les Mots (toujours l'entrée d'index 3 : le palier
    // "syllabes" occupe l'index 2 dans les 3 langues, même quand il n'est
    // pas affiché, pour que "Les Mots" reste toujours à l'index 3). Le
    // libellé "PALIER N"/"TIER N"/"NIVEL N" est recalculé pour refléter le
    // bon numéro selon la langue (4 en français avec les syllabes, 3 sinon),
    // en réutilisant le préfixe déjà traduit sur le Palier 1. ───
    {
      step: {
        kind: "header",
        title: paliers[3].title,
        subtitle: `${paliers[0].subtitle.replace(/\s*1$/, "")} ${lang === "fr" ? 4 : 3}`,
        tagline: paliers[3].tagline,
        palierNum: lang === "fr" ? 4 : 3,
        bannerBg: "#4A90E2",
        bannerBorder: "#2D6BBF",
        bannerIcon: BookOpen,
      },
      side: 0,
    },
    ...PALIER3_GROUPS.flatMap((group, idx): StepEntry[] => {
      const kind: StepKind = idx === 0 ? "active" : "locked";
      const entries: StepEntry[] = [
        {
          step: { kind, iconType: "feuille" },
          side: -1,
          to: { pathname: `/cours/mots/${group.id}` },
        },
        {
          step: { kind, iconType: "branche" },
          side: 1,
          to: { pathname: `/exercice/mots/${group.id}` },
        },
      ];
      // Mots croisés à difficulté progressive : un niveau (2 → 10 mots) inséré tous les deux groupes.
      if (idx % 2 === 1) {
        const levelIdx = (idx - 1) / 2;
        const level = PALIER3_CROSSWORD_LEVELS[levelIdx];
        if (level) {
          entries.push({
            step: { kind: "crossword" },
            side: 0,
            to: { pathname: `/exercice/mots-croises/lvl${level}` },
          });
        }
      }
      return entries;
    }),
    {
      step: { kind: "medal" },
      side: 0,
      to: { pathname: `/exercice/mots/${PALIER3_GROUPS[0].id}`, search: { amaniEval: "1" } },
    },
  ];

  // Chaque étape hérite de la couleur du palier (bannerBg/bannerBorder) du dernier
  // en-tête rencontré, pour que les boutons du chemin changent de couleur par phase.
  let currentColor = "#8FBF6F";
  let currentBorderColor = "#5E8E3E";
  const coloredSteps: (StepEntry & { color?: string; borderColor?: string })[] = steps.map((entry) => {
    if (entry.step.kind === "header") {
      currentColor = entry.step.bannerBg ?? currentColor;
      currentBorderColor = entry.step.bannerBorder ?? currentBorderColor;
      return entry;
    }
    return { ...entry, color: currentColor, borderColor: currentBorderColor };
  });

  const nonHeaderSteps = steps.filter((s) => s.step.kind !== "header").length;
  const zigzag = buildZigzagPath(Math.max(8, Math.ceil(nonHeaderSteps / 2)));

  const [activeStepIdx, setActiveStepIdx] = React.useState<number>(() => {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("accueil_current_step_idx");
      return saved ? Number(saved) : 1;
    }
    return 1;
  });

  React.useEffect(() => {
    if (typeof sessionStorage !== "undefined") {
      const scrollEl = document.getElementById("app-main-scroll");
      if (scrollEl) {
        const savedScroll = sessionStorage.getItem("accueil_scroll_top");
        if (savedScroll) {
          scrollEl.scrollTop = Number(savedScroll);
        }
        const handleScroll = () => {
          sessionStorage.setItem("accueil_scroll_top", String(scrollEl.scrollTop));
        };
        scrollEl.addEventListener("scroll", handleScroll);
        return () => scrollEl.removeEventListener("scroll", handleScroll);
      }
    }
  }, []);

  return (
    <div
      className="relative flex min-h-full flex-col overflow-x-hidden"
      style={{ background: "linear-gradient(180deg, #F5EDE0 0%, #EFE3CE 100%)" }}
    >
      {/* En-tête de page */}
      <header className="relative z-10 flex items-start justify-between gap-2 px-6 pt-6 pb-3">
        <div className="min-w-0">
          <h1 className="text-[24px] leading-8 font-bold" style={{ color: "#4A3B2A" }}>
            {t.parcours.title}
          </h1>
          <p className="mt-1 text-[14px] leading-snug" style={{ color: "#7A6A55" }}>
            {t.parcours.subtitle}
          </p>
        </div>
        <div className="pointer-events-none shrink-0 -mt-2 -mr-2">
          <AmaniMascot pose="encouragement" size="small" priority />
        </div>
      </header>

      {/* Chemin en zigzag sur 3 paliers */}
      <section className="relative flex-1 px-6 pt-2 pb-6">
        <svg
          viewBox={`0 0 300 ${zigzag.height + 40}`}
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          {/* Ombre portée du chemin, pour un léger relief façon sentier tracé */}
          <path
            d={zigzag.d}
            stroke="#7A5332"
            strokeOpacity="0.15"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
            transform="translate(0, 3)"
          />
          {/* Chemin principal, trait plein */}
          <path
            d={zigzag.d}
            stroke="#C9AE86"
            strokeOpacity="0.55"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={zigzag.d}
            stroke="#FBF6EC"
            strokeOpacity="0.6"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <ol className="relative flex flex-col gap-14 pt-2">
          {(() => {
            let stepNumber = 0;
            return coloredSteps.map(({ step, side, to, color, borderColor }, i) => {
              if (step.kind !== "header") stepNumber += 1;
              const number = step.kind !== "header" ? stepNumber : undefined;
              return (
                <li
                  key={i}
                  className={cn("flex", step.kind === "header" && "w-full")}
                  style={{
                    justifyContent: step.kind === "header" ? "stretch" : "center",
                  }}
                >
                  <div
                    className="flex w-full"
                    style={{
                      justifyContent: step.kind === "header" ? "stretch" : "center",
                      transform: step.kind !== "header" ? `translateX(${side * 68}px)` : undefined,
                    }}
                  >
                    <StepNode
                      step={step}
                      to={to}
                      isCurrent={i === activeStepIdx}
                      color={color}
                      borderColor={borderColor}
                      number={number}
                      t={t}
                      onActivate={() => {
                        setActiveStepIdx(i);
                        if (typeof localStorage !== "undefined") {
                          localStorage.setItem("accueil_current_step_idx", String(i));
                        }
                      }}
                    />
                  </div>
                </li>
              );
            });
          })()}
        </ol>
      </section>
    </div>
  );
}

function PalierBanner({ step }: { step: Step }) {
  const Icon = step.bannerIcon ?? Sprout;
  const textColor = step.bannerText ?? "#FFFFFF";
  return (
    <div
      className="relative z-20 mx-1 my-2 flex items-center gap-4 overflow-hidden rounded-[22px] px-5 py-4"
      style={{
        background: `linear-gradient(135deg, ${step.bannerBg} 0%, ${step.bannerBorder} 100%)`,
        boxShadow: `0 6px 0 0 ${step.bannerBorder}, 0 10px 24px rgba(74,59,42,0.22)`,
        color: textColor,
      }}
    >
      {/* Décor feuilles translucides */}
      <div className="pointer-events-none absolute -right-4 -top-6 opacity-20" style={{ color: textColor }}>
        <Leaf className="h-24 w-24 rotate-12" strokeWidth={1.5} />
      </div>

      {/* Badge icône */}
      <div
        className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl shadow-inner"
        style={{ backgroundColor: `color-mix(in srgb, ${textColor} 20%, transparent)`, boxShadow: "0 2px 0 0 rgba(0,0,0,0.12) inset" }}
      >
        <Icon className="h-7 w-7" strokeWidth={2.2} style={{ color: textColor }} />
      </div>

      <div className="relative min-w-0 flex-1">
        <p
          className="text-[11px] font-extrabold uppercase tracking-widest"
          style={{ color: `color-mix(in srgb, ${textColor} 80%, transparent)` }}
        >
          {step.subtitle}
        </p>
        <h2 className="text-[19px] font-extrabold leading-tight" style={{ color: textColor }}>
          {step.title}
        </h2>
        {step.tagline && (
          <p
            className="mt-0.5 truncate text-[12px] font-medium"
            style={{ color: `color-mix(in srgb, ${textColor} 75%, transparent)` }}
          >
            {step.tagline}
          </p>
        )}
      </div>

      {/* Numéro de palier */}
      <div
        className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-[17px] font-extrabold shadow-sm"
        style={{ backgroundColor: `color-mix(in srgb, ${textColor} 25%, transparent)`, color: textColor }}
      >
        {step.palierNum}
      </div>
    </div>
  );
}

/** Petit badge numéroté qui rappelle la position de l'étape dans le parcours. */
function NumberBadge({ number, color, muted }: { number: number; color: string; muted?: boolean }) {
  return (
    <span
      className="absolute -top-1 -right-1 z-10 grid h-6 w-6 place-items-center rounded-full border-2 bg-surface text-[11px] font-extrabold shadow-sm"
      style={{ borderColor: muted ? "#D8CCB8" : color, color: muted ? "#9C8F79" : color }}
    >
      {number}
    </span>
  );
}

/** Quelques étincelles discrètes autour de l'étape en cours, pour un léger effet ludique. */
function CurrentSparkles({ color }: { color: string }) {
  return (
    <>
      <Sparkle aria-hidden className="absolute -top-3 -left-5 h-3.5 w-3.5 -rotate-12 opacity-70" style={{ color }} />
      <Sparkle aria-hidden className="absolute top-2 -right-6 h-2.5 w-2.5 rotate-[18deg] opacity-50" style={{ color }} />
      <Sparkle aria-hidden className="absolute -bottom-1 -left-6 h-2 w-2 rotate-6 opacity-40" style={{ color }} />
    </>
  );
}

function StepNode({
  step,
  to,
  isCurrent,
  color = "#8FBF6F",
  borderColor = "#5E8E3E",
  number,
  onActivate,
  t,
}: {
  step: Step;
  to?: TargetRoute;
  isCurrent?: boolean;
  color?: string;
  borderColor?: string;
  number?: number;
  onActivate?: () => void;
  t: ReturnType<typeof useLanguage>["t"];
}) {
  const navigate = Route.useNavigate();

  const stepLabel =
    step.kind === "crossword"
      ? t.parcours.crosswordStep
      : step.iconType === "branche"
        ? t.parcours.exerciceStep
        : t.parcours.coursStep;

  const content = (() => {
    if (step.kind === "header") {
      return <PalierBanner step={step} />;
    }

    if (step.kind === "active") {
      return (
        <div className="relative flex flex-col items-center gap-2.5">
          {isCurrent && (
            <div className="relative">
              <div
                className="rounded-full border-2 bg-surface px-5 py-1.5 text-[14px] font-bold uppercase tracking-wide shadow-[var(--shadow-card)]"
                style={{ borderColor, color: borderColor }}
              >
                {t.parcours.start}
              </div>
              <span
                aria-hidden
                className="absolute left-1/2 -bottom-1.5 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 bg-surface"
                style={{ borderColor }}
              />
            </div>
          )}

          <div className="relative">
            {isCurrent && (
              <>
                <span
                  aria-hidden
                  className="absolute inset-0 -m-2 rounded-full animate-ping"
                  style={{ backgroundColor: color + "4D" }}
                />
                <CurrentSparkles color={borderColor} />
              </>
            )}
            <div
              className="relative grid h-24 w-24 place-items-center rounded-full border-4 text-surface shadow-[var(--shadow-card)]"
              style={{
                borderColor,
                background: `radial-gradient(circle at 32% 28%, color-mix(in srgb, ${color} 70%, white) 0%, ${color} 60%)`,
              }}
            >
              {step.iconType === "branche" ? (
                <BrancheExerciseIcon className="h-13 w-13" />
              ) : (
                <Leaf className="h-11 w-11" strokeWidth={2.5} />
              )}
            </div>
            {number != null && <NumberBadge number={number} color={borderColor} />}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: borderColor }}>
            {stepLabel}
          </span>
        </div>
      );
    }

    if (step.kind === "locked") {
      return (
        <div className="relative flex flex-col items-center gap-2.5">
          {isCurrent && (
            <div className="relative">
              <div
                className="rounded-full border-2 bg-surface px-5 py-1.5 text-[14px] font-bold uppercase tracking-wide shadow-[var(--shadow-card)]"
                style={{ borderColor, color: borderColor }}
              >
                {t.parcours.start}
              </div>
              <span
                aria-hidden
                className="absolute left-1/2 -bottom-1.5 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 bg-surface"
                style={{ borderColor }}
              />
            </div>
          )}
          <div className="relative">
            {isCurrent && (
              <>
                <span
                  aria-hidden
                  className="absolute inset-0 -m-2 rounded-full animate-ping"
                  style={{ backgroundColor: color + "4D" }}
                />
                <CurrentSparkles color={borderColor} />
              </>
            )}
            <div
              aria-label={t.parcours.lockedAria}
              className={cn(
                "grid place-items-center rounded-full border-4 shadow-[var(--shadow-card)]",
                isCurrent ? "h-24 w-24 text-surface" : "h-16 w-16 border-disabled bg-disabled text-text-secondary"
              )}
              style={
                isCurrent
                  ? {
                      borderColor,
                      background: `radial-gradient(circle at 32% 28%, color-mix(in srgb, ${color} 70%, white) 0%, ${color} 60%)`,
                    }
                  : undefined
              }
            >
              {step.iconType === "branche" ? (
                <BrancheExerciseIcon className={cn(isCurrent ? "h-13 w-13" : "h-8 w-8 opacity-70")} />
              ) : (
                <Leaf className={cn(isCurrent ? "h-11 w-11" : "h-7 w-7 opacity-70")} strokeWidth={2.5} />
              )}
              {!isCurrent && <Lock className="sr-only" />}
            </div>
            {number != null && <NumberBadge number={number} color={borderColor} muted={!isCurrent} />}
          </div>
          <span
            className={cn("text-[11px] font-bold uppercase tracking-wide", !isCurrent && "text-text-secondary/70")}
            style={isCurrent ? { color: borderColor } : undefined}
          >
            {stepLabel}
          </span>
        </div>
      );
    }

    if (step.kind === "crossword") {
      return (
        <div className="relative flex flex-col items-center gap-2.5">
          {isCurrent && (
            <div className="relative">
              <div
                className="rounded-full border-2 bg-surface px-5 py-1.5 text-[14px] font-bold uppercase tracking-wide shadow-[var(--shadow-card)]"
                style={{ borderColor, color: borderColor }}
              >
                {t.parcours.start}
              </div>
              <span
                aria-hidden
                className="absolute left-1/2 -bottom-1.5 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 bg-surface"
                style={{ borderColor }}
              />
            </div>
          )}
          <div className="relative">
            {isCurrent && <CurrentSparkles color={borderColor} />}
            <div
              aria-label={t.parcours.crosswordStep}
              className={cn(
                "grid place-items-center rounded-2xl border-4 shadow-[var(--shadow-card)]",
                isCurrent ? "h-20 w-20 text-surface" : "h-14 w-14 border-disabled bg-disabled text-text-secondary"
              )}
              style={
                isCurrent
                  ? {
                      borderColor,
                      background: `radial-gradient(circle at 32% 28%, color-mix(in srgb, ${color} 70%, white) 0%, ${color} 60%)`,
                    }
                  : undefined
              }
            >
              <Grid3x3 className={cn(isCurrent ? "h-9 w-9" : "h-6 w-6 opacity-70")} strokeWidth={2.2} />
            </div>
            {number != null && <NumberBadge number={number} color={borderColor} muted={!isCurrent} />}
          </div>
          <span
            className={cn("text-[11px] font-bold uppercase tracking-wide text-center", !isCurrent && "text-text-secondary/70")}
            style={isCurrent ? { color: borderColor } : undefined}
          >
            {stepLabel}
          </span>
        </div>
      );
    }

    if (step.kind === "bonus") {
      return (
        <div
          aria-label={t.parcours.bonusAria}
          className="grid h-16 w-16 place-items-center rounded-2xl border-4 border-disabled bg-disabled text-text-secondary shadow-[var(--shadow-card)]"
        >
          <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
            <path
              d="M6 16 H34 L30 34 H10 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M10 22 H30 M12 28 H28"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M12 16 C14 8 26 8 28 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    }

    return (
      <div className="relative">
        <div
          aria-label={t.parcours.medalAria}
          className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border-4 border-disabled bg-disabled shadow-[var(--shadow-card)]"
        >
          <img
            src={victoirePalierImg}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      </div>
    );
  })();

  if (to) {
    const handleNavigate = () => {
      onActivate?.();
      if (typeof sessionStorage !== "undefined") {
        const scrollEl = document.getElementById("app-main-scroll");
        if (scrollEl) {
          sessionStorage.setItem("accueil_scroll_top", String(scrollEl.scrollTop));
        }
      }
      if (typeof to === "string") {
        navigate({ to: to as any });
      } else {
        navigate({ to: to.pathname as any, search: to.search as any });
      }
    };

    return (
      <div
        role="link"
        tabIndex={0}
        onClick={handleNavigate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleNavigate();
          }
        }}
        className="no-underline block transition-transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        {content}
      </div>
    );
  }

  return content;
}
