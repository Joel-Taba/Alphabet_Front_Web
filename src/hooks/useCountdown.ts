import { useEffect, useRef, useState } from "react";

/**
 * Compte à rebours en secondes, basé sur le temps réel écoulé (résistant aux
 * onglets mis en arrière-plan) plutôt que sur un simple décompte par tick.
 * Appelle `onExpire` une seule fois lorsque le temps est écoulé.
 */
export function useCountdown(durationSeconds: number, onExpire: () => void): number {
  const [remaining, setRemaining] = useState(durationSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (durationSeconds <= 0) return;
    const start = performance.now();
    let expired = false;
    setRemaining(durationSeconds);

    const id = window.setInterval(() => {
      const elapsed = Math.floor((performance.now() - start) / 1000);
      const left = Math.max(0, durationSeconds - elapsed);
      setRemaining(left);
      if (left <= 0 && !expired) {
        expired = true;
        window.clearInterval(id);
        onExpireRef.current();
      }
    }, 250);

    return () => window.clearInterval(id);
  }, [durationSeconds]);

  return remaining;
}

/** Formate un nombre de secondes en "m:ss". */
export function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
