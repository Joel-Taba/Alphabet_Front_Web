import { useCallback, useEffect, useState } from "react";

/**
 * Réglage partagé de la vitesse de l'animation de démonstration des signes
 * (Profil > Réglages > "Exercices d'écriture"), lu par les écrans qui
 * animent le tracé d'un signe/lettre/chiffre à titre de modèle
 * (cours.$family.tsx, cours.lettres.formation.$char.tsx).
 */
export type AnimationSpeed = "lent" | "normal" | "rapide";

export const ANIMATION_SPEED_STORAGE_KEY = "amani_setting_anim_speed";
const CHANGE_EVENT = "amani:animation-speed-changed";

/** Multiplicateur appliqué à la durée de base d'une animation : plus il est
 * grand, plus l'animation est rapide (durée = base / multiplicateur). */
const SPEED_MULTIPLIER: Record<AnimationSpeed, number> = {
  lent: 0.6,
  normal: 1,
  rapide: 2.5,
};

function readSpeed(): AnimationSpeed {
  if (typeof localStorage === "undefined") return "normal";
  const raw = localStorage.getItem(ANIMATION_SPEED_STORAGE_KEY);
  return raw === "lent" || raw === "rapide" ? raw : "normal";
}

export function setAnimationSpeed(speed: AnimationSpeed) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(ANIMATION_SPEED_STORAGE_KEY, speed);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: speed }));
}

export function useAnimationSpeed(): AnimationSpeed {
  const [speed, setSpeed] = useState<AnimationSpeed>(() => readSpeed());

  useEffect(() => {
    const onChange = () => setSpeed(readSpeed());
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return speed;
}

/** Variante pratique lorsqu'un composant a aussi besoin de modifier le réglage. */
export function useAnimationSpeedState(): [AnimationSpeed, (s: AnimationSpeed) => void] {
  const speed = useAnimationSpeed();
  const set = useCallback((s: AnimationSpeed) => setAnimationSpeed(s), []);
  return [speed, set];
}

/** Convertit une durée de base (ms) en durée effective selon la vitesse choisie. */
export function scaleDuration(baseDurationMs: number, speed: AnimationSpeed): number {
  return baseDurationMs / SPEED_MULTIPLIER[speed];
}
