import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { onPointsAwarded } from "@/lib/progress";
import { useLanguage } from "@/i18n/LanguageContext";

interface Toast {
  id: number;
  points: number;
}

const TOAST_LIFETIME_MS = 2200;
let nextToastId = 0;

/**
 * Bulle "+N ⭐" affichée brièvement à chaque cours/exercice terminé.
 * Montée une seule fois dans MobileShell : les écrans n'ont qu'à appeler
 * `awardCompletion(...)` (voir lib/progress.ts), ce composant s'occupe seul
 * du retour visuel — volontairement sans texte à lire, pour rester lisible
 * par un enfant qui ne sait pas encore lire.
 */
export function PointsToastHost() {
  const { t } = useLanguage();
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return onPointsAwarded((points) => {
      const id = nextToastId++;
      setToasts((prev) => [...prev, { id, points }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, TOAST_LIFETIME_MS);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-5 z-50 flex flex-col items-center gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          aria-label={`+${toast.points} ${t.common.pointsEarnedAria}`}
          className="animate-points-pop flex items-center gap-1.5 rounded-full px-4 py-2 shadow-[0_6px_18px_rgba(217,168,74,0.45)]"
          style={{ background: "linear-gradient(135deg, #F6C453 0%, #D9A84A 100%)" }}
        >
          <Star className="h-4 w-4 fill-white text-white" strokeWidth={2} />
          <span className="text-[15px] font-extrabold text-white">+{toast.points}</span>
        </div>
      ))}
    </div>
  );
}
