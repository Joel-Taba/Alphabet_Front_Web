import { ChevronRight, RotateCcw } from "lucide-react";
import { AmaniMascot } from "./AmaniMascot";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * Pop-up affiché à la fin de CHAQUE exercice du parcours (hors évaluation de
 * fin de palier, qui a son propre écran de félicitations — voir
 * `EvaluationCompleteOverlay`). Laisse l'enfant choisir entre recommencer
 * l'exercice, enchaîner directement sur le cours suivant, ou revenir à
 * l'accueil — pour pouvoir parcourir tout un palier sans jamais devoir
 * repasser par l'accueil.
 *
 * `onNext` est optionnel : quand il n'y a plus de cours suivant dans le
 * palier (dernier élément), le bouton "Suivant" est simplement absent.
 * `onRestart`, lui, est toujours disponible — un exercice déjà terminé peut
 * toujours être repris (voir `awardRestartBonus` dans lib/progress.ts).
 */
export function ExerciseCompletePopup({
  onBackHome,
  onNext,
  onRestart,
}: {
  onBackHome: () => void;
  onNext?: () => void;
  onRestart: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center px-6 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-live="polite"
      aria-label={t.exerciceComplete.title}
    >
      <div className="flex flex-col items-center gap-4 w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
        <AmaniMascot pose="celebration" size="medium" priority />
        <div>
          <h2 className="text-[22px] font-extrabold text-[#4A3B2A]">{t.exerciceComplete.title}</h2>
          <p className="text-[14px] text-[#7A6A55] mt-1.5">{t.exerciceComplete.body}</p>
        </div>
        <div className="flex flex-col gap-2.5 w-full">
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-[#D9A84A]/15 hover:bg-[#D9A84A]/25 text-[#8A6800] border-2 border-[#D9A84A]/40 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
            {t.common.restart}
          </button>
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-[#8FBF6F] hover:bg-[#7AAE5A] text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {t.common.next}
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          )}
          <button
            type="button"
            onClick={onBackHome}
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-white border-2 border-[#4A3B2A]/15 text-[#4A3B2A] active:scale-95 transition-all"
          >
            {t.common.backToHome}
          </button>
        </div>
      </div>
    </div>
  );
}
