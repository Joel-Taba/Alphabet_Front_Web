import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { MobileShell, CrosswordPlay } from "@/components/amani";
import { WORD_CATALOG } from "@/data/word-catalog";
import { generateCrossword } from "@/lib/crosswordGenerator";
import { useLanguage, format } from "@/i18n/LanguageContext";

export const Route = createFileRoute("/exercice/mots-croises/$puzzleId")({
  head: ({ params }) => ({
    meta: [
      { title: `Mots croisés — Amani` },
      { name: "description", content: `Complète la grille de mots croisés ${params.puzzleId}.` },
    ],
  }),
  component: CrosswordScreen,
});

/** "lvl2" → 2 mots dans la grille, "lvl3" → 3, etc. (difficulté progressive du Palier 3). */
function parseLevel(puzzleId: string): number | null {
  const m = /^lvl(\d+)$/.exec(puzzleId);
  if (!m) return null;
  const n = Number(m[1]);
  return n >= 2 && n <= 10 ? n : null;
}

function CrosswordScreen() {
  const { puzzleId } = Route.useParams();
  const { t } = useLanguage();
  const level = parseLevel(puzzleId);

  const crossword = useMemo(() => {
    if (!level) return null;
    // Seed stable par niveau : même grille à chaque visite de cette étape du parcours.
    return generateCrossword(WORD_CATALOG, level, 1000 + level * 37);
  }, [level]);

  if (!level || !crossword) {
    return (
      <MobileShell>
        <div className="flex flex-col items-center justify-center flex-1 p-8 gap-4 bg-[#F5EDE0]">
          <p className="text-[#4A3B2A] text-[18px] font-bold text-center">
            {t.motsCroises.generationFailed}
          </p>
          <Link to="/accueil" className="px-6 py-3 rounded-full bg-[#8FBF6F] text-white font-bold text-[15px]">
            {t.coursMots.backToList}
          </Link>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <header className="flex items-center justify-between px-6 pt-6 pb-4 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10">
        <div className="flex items-center gap-3">
          <Link
            to="/accueil"
            aria-label={t.common.back}
            className="grid h-11 w-11 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-[#4A3B2A] rtl:rotate-180" strokeWidth={2.5} />
          </Link>
          <div>
            <h1 className="text-[22px] font-bold text-[#4A3B2A] leading-tight">
              {t.motsCroises.title}
            </h1>
            <p className="text-[13px] text-[#7A6A55] font-normal">
              {format(t.motsCroises.levelSubtitle, { level, count: crossword.placed.length })}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 bg-[#F5EDE0] pb-10 flex flex-col items-center">
        <CrosswordPlay crossword={crossword} puzzleId={puzzleId} level={level} />
      </div>
    </MobileShell>
  );
}
