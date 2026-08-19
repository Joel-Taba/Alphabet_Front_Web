import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Volume2, Play, CheckCircle2, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { MobileShell, SignGlyph, CahierFrame } from "@/components/amani";
import { useSignSpeech } from "@/hooks/useSignSpeech";
import { EXERCISE_CATALOG, FAMILY_ORDER, type SignExercise, type SignFamily } from "@/data/sign-exercise-catalog";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { useAnimationSpeed, scaleDuration } from "@/hooks/useAnimationSpeed";
import { markCoursItemViewed } from "@/lib/progress";

export const Route = createFileRoute("/cours/$family")({
  head: () => ({
    meta: [
      { title: "Cours & Variantes — Flores" },
      { name: "description", content: "Découvre les variantes de signes et leur animation de tracé." },
    ],
  }),
  component: CoursFamilyScreen,
});

const familyColors: Record<string, { color: string; bg: string }> = {
  point: { color: "#4A3B2A", bg: "#FBF6EC" },
  courbe: { color: "#C03E3E", bg: "#FDEAEA" },
  crochet: { color: "#2D6BBF", bg: "#EAF1FB" },
  trait: { color: "#4A3B2A", bg: "#F5EDE0" },
};

function CoursFamilyScreen() {
  const { family } = Route.useParams();
  const navigate = useNavigate();
  const { speak } = useSignSpeech();
  const { t, lang } = useLanguage();
  const animSpeed = useAnimationSpeed();

  const entries = EXERCISE_CATALOG.filter((e) => e.family === (family as SignFamily));
  const colors = familyColors[family] || { color: "#4A3B2A", bg: "#FBF6EC" };
  const title = t.coursFamily.titles[family as keyof typeof t.coursFamily.titles] || family;
  const familyInfo = { title, ...colors };

  const familyIdx = FAMILY_ORDER.indexOf(family as SignFamily);
  const prevFamily = familyIdx > 0 ? FAMILY_ORDER[familyIdx - 1] : null;
  const nextFamily = familyIdx >= 0 && familyIdx < FAMILY_ORDER.length - 1 ? FAMILY_ORDER[familyIdx + 1] : null;

  // Signe sélectionné pour l'animation interactive
  const [selectedSign, setSelectedSign] = useState<SignExercise | null>(
    entries.length > 0 ? entries[0] : null
  );

  // Un signe qui se referme sur lui-même (point, courbe fermée) a un même
  // point de départ et d'arrivée : une seule pastille, qui alterne entre les
  // deux couleurs plutôt que d'en afficher deux superposées.
  const startEndMerged =
    !!selectedSign &&
    selectedSign.startXY[0] === selectedSign.endXY[0] &&
    selectedSign.startXY[1] === selectedSign.endXY[1];

  const [animProgress, setAnimProgress] = useState(0); // 0 à 1
  const [isPlaying, setIsPlaying] = useState(true);
  const [replayKey, setReplayKey] = useState(0);
  const [pathLength, setPathLength] = useState(1000);
  const animFrameRef = useRef<number | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [penPos, setPenPos] = useState<{ x: number; y: number }>({ x: 100, y: 100 });

  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        if (len && len > 0) setPathLength(len);
      } catch {}
    }
  }, [selectedSign]);

  // Lancer l'animation une seule fois (vitesse réduite)
  useEffect(() => {
    if (!selectedSign) return;
    speak(selectedSign.consigne[lang]);
    markCoursItemViewed({ typeEtape: "SIGNE", groupCode: family, itemCode: selectedSign.id, totalItems: entries.length, palier: 1 });
    setIsPlaying(true);
    setAnimProgress(0);

    let start = performance.now();
    const duration = scaleDuration(4000, animSpeed); // 4 secondes à vitesse normale, lent et décomposé

    const animate = (now: number) => {
      const elapsed = now - start;
      if (elapsed >= duration) {
        setAnimProgress(1);
        setIsPlaying(false);
        if (pathRef.current) {
          try {
            const totalLength = pathRef.current.getTotalLength();
            const pt = pathRef.current.getPointAtLength(totalLength);
            setPenPos({ x: pt.x, y: pt.y });
          } catch {}
        }
        return; // Arrêt à la fin : le tracé est fait une seule fois
      }

      const progress = elapsed / duration;
      setAnimProgress(progress);

      if (pathRef.current) {
        try {
          const totalLength = pathRef.current.getTotalLength();
          const pt = pathRef.current.getPointAtLength(progress * totalLength);
          setPenPos({ x: pt.x, y: pt.y });
        } catch {
          // Fallback sur startXY si SVG non calculé
          setPenPos({ x: selectedSign.startXY[0], y: selectedSign.startXY[1] });
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [selectedSign, speak, replayKey, animSpeed, family, entries.length]);

  return (
    <MobileShell>
      {/* En-tête */}
      <header
        className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0 border-b shadow-sm"
        style={{ backgroundColor: familyInfo.bg, borderColor: `${familyInfo.color}20` }}
      >
        <div className="flex items-center gap-3">
          <Link
            to="/accueil"
            aria-label={t.common.back}
            className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-md active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 rtl:rotate-180" strokeWidth={2.5} />
          </Link>
          <div>
            <h1
              className="text-[24px] font-extrabold leading-tight"
              style={{ color: familyInfo.color }}
            >
              {familyInfo.title}
            </h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 bg-background">
        {/* 1. Zone d'animation interactive pédagogique du tracé */}
        {selectedSign && (
          <section className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col items-center relative overflow-hidden animate-bloom">
            <h2 className="text-xl font-bold text-text-primary text-center mt-1 mb-3">
              {selectedSign.label[lang]}
            </h2>

            {/* Canvas de tracé animé */}
            <CahierFrame className="relative w-[240px] h-[240px] flex items-center justify-center my-2" rounded={16}>
              {/* Pastilles départ/arrivée, disparaissent complètement en fin de tracé */}
              {startEndMerged ? (
                isPlaying && animProgress <= 0.98 && (
                  <div
                    className="absolute z-20 w-3 h-3 rounded-full border border-white shadow grid place-items-center animate-start-end-alternate pointer-events-none"
                    style={{
                      left: `${(selectedSign.startXY[0] / 200) * 100}%`,
                      top: `${(selectedSign.startXY[1] / 200) * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    title="Point de départ et d'arrivée du tracé"
                  >
                    <div className="w-1 h-1 rounded-full bg-white" />
                  </div>
                )
              ) : (
                <>
                  {isPlaying && animProgress <= 0.90 && (
                    <div
                      className="absolute z-20 w-3 h-3 rounded-full bg-[#8FBF6F] border border-white shadow grid place-items-center animate-pulse pointer-events-none"
                      style={{
                        left: `${(selectedSign.startXY[0] / 200) * 100}%`,
                        top: `${(selectedSign.startXY[1] / 200) * 100}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      title="Point de départ du tracé"
                    >
                      <div className="w-1 h-1 rounded-full bg-white" />
                    </div>
                  )}
                  {isPlaying && animProgress <= 0.98 && (
                    <div
                      className="absolute z-20 w-3 h-3 rounded-full bg-[#E05252] border border-white shadow grid place-items-center animate-pulse pointer-events-none"
                      style={{
                        left: `${(selectedSign.endXY[0] / 200) * 100}%`,
                        top: `${(selectedSign.endXY[1] / 200) * 100}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      title="Point d'arrivée du tracé"
                    >
                      <div className="w-1 h-1 rounded-full bg-white" />
                    </div>
                  )}
                </>
              )}

              {/* SVG de tracé : guide en pointillés + trait animé qui se dessine + stylet */}
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Guide en pointillés (fond) */}
                <path
                  ref={pathRef}
                  d={selectedSign.pathD}
                  stroke="#9BB5CC"
                  strokeWidth={10}
                  strokeLinecap="round"
                  strokeDasharray="6 8"
                  fill={selectedSign.family === "point" ? "#9BB5CC" : "none"}
                />

                {/* Trait coloré animé : rigoureusement au rythme du stylet */}
                <path
                  d={selectedSign.pathD}
                  stroke={selectedSign.strokeColor}
                  strokeWidth={9}
                  strokeLinecap="round"
                  fill={selectedSign.family === "point" ? selectedSign.strokeColor : "none"}
                  style={{
                    strokeDasharray: pathLength,
                    strokeDashoffset: pathLength * (1 - animProgress),
                    transition: "none",
                  }}
                />

                {/* Stylet / Pointe animée (disparaît complètement à la fin) */}
                {isPlaying && animProgress <= 0.98 && (
                  <circle
                    cx={penPos.x}
                    cy={penPos.y}
                    r={4.5}
                    fill="#A9784F"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    className="shadow-sm pointer-events-none"
                  />
                )}
              </svg>
            </CahierFrame>

            {/* Boutons d'interaction sous le tracé */}
            <div className="flex flex-col gap-2.5 w-full max-w-xs mt-4 mb-1">
              <div className="flex items-center justify-center gap-2.5 w-full">
                <button
                  type="button"
                  onClick={() => setReplayKey((k) => k + 1)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm bg-secondary/15 hover:bg-secondary/25 text-secondary transition-colors active:scale-95 shadow-xs border border-secondary/20"
                >
                  <RotateCcw className={cn("h-4 w-4", isPlaying && "animate-spin")} /> {t.common.replay}
                </button>

                <button
                  type="button"
                  onClick={() => speak(selectedSign.consigne[lang])}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 text-text-primary transition-colors active:scale-95 shadow-xs"
                >
                  <Volume2 className="h-4 w-4 text-secondary" /> {t.common.instruction}
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate({
                    to: "/exercice-liste",
                    search: { family: family as SignFamily },
                  })
                }
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-sm bg-secondary hover:bg-secondary/90 text-white transition-all active:scale-95 shadow-md"
              >
                <Play className="h-4 w-4 fill-current" /> {t.coursFamily.exercer}
              </button>
            </div>
          </section>
        )}

        {/* 2. Liste / Grille des variantes de la famille */}
        <section>
          <h3 className="text-base font-bold text-text-primary uppercase tracking-wide mb-3 px-1">
            <span>{t.coursFamily.variantsTitle} ({entries.length})</span>
          </h3>

          <div className="grid grid-cols-2 gap-3.5">
            {entries.map((item) => {
              const isSelected = selectedSign?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedSign(item)}
                  className={cn(
                    "flex flex-col items-center justify-between p-3.5 rounded-2xl border-2 transition-all duration-200 text-start select-none relative overflow-hidden min-h-[170px]",
                    isSelected
                      ? "border-secondary bg-[#FBF6EC] shadow-lg scale-[1.02]"
                      : "border-gray-200 bg-white hover:border-gray-300 shadow-sm active:scale-98"
                  )}
                >
                  <div className="w-full flex items-center justify-end mb-1 z-10 min-h-[20px]">
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-secondary fill-secondary/20 shrink-0 animate-bounce" />
                    )}
                  </div>

                  {/* Glyphe vectoriel */}
                  <div className="flex-1 w-full grid place-items-center my-1">
                    <div className="w-[84px] h-[84px] rounded-full bg-[#F5EDE0] flex items-center justify-center shadow-inner">
                      <SignGlyph
                        family={item.family}
                        variant={item.variant}
                        stroke={item.strokeColor}
                        className="w-[56px] h-[56px]"
                      />
                    </div>
                  </div>

                  {/* Nom du signe */}
                  <span
                    className={cn(
                      "w-full text-center text-[13px] font-bold leading-tight mt-2 pt-2 border-t line-clamp-2",
                      isSelected ? "text-secondary border-secondary/20" : "text-gray-800 border-gray-100"
                    )}
                  >
                    {item.label[lang]}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Navigation Retour / Suivant entre les cours du Palier 1 */}
        <div className="flex items-center justify-between gap-3 pt-2 pb-8">
          {prevFamily ? (
            <button
              type="button"
              onClick={() => navigate({ to: "/cours/$family", params: { family: prevFamily } })}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#4A3B2A]/15 text-[#4A3B2A] font-bold text-[14px] shadow-sm active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              {t.common.back}
            </button>
          ) : (
            <div />
          )}
          {nextFamily ? (
            <button
              type="button"
              onClick={() => navigate({ to: "/cours/$family", params: { family: nextFamily } })}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-white font-bold text-[14px] shadow-md active:scale-95 transition-transform"
              style={{ backgroundColor: familyInfo.color }}
            >
              {t.common.next}
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </MobileShell>
  );
}
