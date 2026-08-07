import { AmaniMascot } from "./AmaniMascot";
import { useLanguage } from "@/i18n/LanguageContext";

/**
 * Proposition de reprendre une session (cours/exercice/évaluation) laissée
 * inachevée après une fermeture brusque de l'app — voir
 * `lib/resumeCheckpoint.ts`. Montée depuis `_app.accueil.tsx` uniquement,
 * une fois par lancement de l'app.
 */
export function ResumeSessionDialog({
  onResume,
  onDecline,
}: {
  onResume: () => void;
  onDecline: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center px-6 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-live="polite"
      aria-label={t.resumeSession.title}
    >
      <div className="flex flex-col items-center gap-4 w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
        <AmaniMascot pose="encouragement" size="medium" priority />
        <div>
          <h2 className="text-[20px] font-extrabold text-[#4A3B2A]">
            {t.resumeSession.title}
          </h2>
          <p className="text-[14px] text-[#7A6A55] mt-1.5">
            {t.resumeSession.body}
          </p>
        </div>
        <div className="flex flex-col gap-2.5 w-full">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-[#8FBF6F] hover:bg-[#7AAE5A] text-white shadow-md active:scale-95 transition-all"
          >
            {t.resumeSession.resume}
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-white border-2 border-[#4A3B2A]/15 text-[#4A3B2A] active:scale-95 transition-all"
          >
            {t.resumeSession.restart}
          </button>
        </div>
      </div>
    </div>
  );
}
