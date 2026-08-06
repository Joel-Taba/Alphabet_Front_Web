import { useEffect } from "react";
import { Timer, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCountdown } from "@/hooks/useCountdown";
import { useLanguage } from "@/i18n/LanguageContext";
import { AmaniMascot } from "@/components/amani";

/** Délai avant le retour automatique au parcours — assez long pour lire le message, assez court pour ne pas faire attendre. */
const AUTO_BACK_DELAY_MS = 3500;

/** Bandeau sticky affiché en haut d'un écran d'exercice en mode "évaluation",
 * montrant le temps restant. Vire au rouge dans les 30 dernières secondes. */
export function EvaluationTimerBadge({ remaining }: { remaining: number }) {
  const { t } = useLanguage();
  const low = remaining <= 30;

  return (
    <div
      className={cn(
        "sticky top-0 z-40 flex items-center justify-center gap-2 px-4 py-2 text-white text-[13px] font-bold shrink-0 transition-colors",
        low ? "bg-[#C03E3E]" : "bg-[#4A3B2A]"
      )}
      role="timer"
      aria-live={low ? "assertive" : "off"}
    >
      <Timer className="w-4 h-4" strokeWidth={2.5} />
      <span>
        {t.evaluation.badge} · {t.evaluation.timeLeft} {formatCountdown(remaining)}
      </span>
    </div>
  );
}

/**
 * Écran de fin d'évaluation (temps écoulé), bloquant. Reconduit
 * automatiquement vers l'accueil après un court délai — l'enfant n'a rien à
 * faire pour enchaîner sur le palier suivant — mais le bouton reste
 * disponible pour ne pas forcer l'attente.
 */
export function EvaluationCompleteOverlay({ onBack }: { onBack: () => void }) {
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(onBack, AUTO_BACK_DELAY_MS);
    return () => clearTimeout(timer);
  }, [onBack]);

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center px-6 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-live="polite"
      aria-label={t.evaluation.finishedTitle}
    >
      <div className="flex flex-col items-center gap-4 w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
        <AmaniMascot pose="celebration" size="medium" priority />
        <PartyPopper className="w-7 h-7 text-[#A9784F]" strokeWidth={2.2} />
        <div>
          <h2 className="text-[22px] font-extrabold text-[#4A3B2A]">{t.evaluation.finishedTitle}</h2>
          <p className="text-[14px] text-[#7A6A55] mt-1.5">{t.evaluation.finishedMessage}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-[#8FBF6F] hover:bg-[#7AAE5A] text-white shadow-md active:scale-95 transition-all"
        >
          {t.evaluation.backToPath}
        </button>
      </div>
    </div>
  );
}
