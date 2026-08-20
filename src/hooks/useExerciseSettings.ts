import { useState } from "react";

/**
 * Réglages partagés des exercices de tracé (signes, lettres, chiffres), configurés
 * une fois pour toutes dans Profil > Réglages et lus par tous les écrans d'exercice.
 */

export const REPETITIONS_STORAGE_KEY = "amani_setting_repetitions";
export const TOLERANCE_STORAGE_KEY = "amani_setting_tolerance";
export const EVALUATION_DURATION_STORAGE_KEY = "amani_setting_evaluation_duration";

const DEFAULT_REPETITIONS = 3;
const DEFAULT_TOLERANCE = 10;
/** Durée par défaut d'une évaluation chronométrée, en minutes. */
const DEFAULT_EVALUATION_DURATION = 5;

const MIN_REPETITIONS = 1;
const MAX_REPETITIONS = 6;
const MIN_TOLERANCE = 1;
const MAX_TOLERANCE = 25;
const MIN_EVALUATION_DURATION = 2;
const MAX_EVALUATION_DURATION = 15;

function readNumber(key: string, fallback: number, min: number, max: number): number {
  if (typeof localStorage === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  const v = raw != null ? Number(raw) : fallback;
  return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;
}

type Updater = number | ((prev: number) => number);

export function useExerciseSettings() {
  const [repetitions, setRepetitionsState] = useState<number>(() =>
    readNumber(REPETITIONS_STORAGE_KEY, DEFAULT_REPETITIONS, MIN_REPETITIONS, MAX_REPETITIONS)
  );
  const [tolerance, setToleranceState] = useState<number>(() =>
    readNumber(TOLERANCE_STORAGE_KEY, DEFAULT_TOLERANCE, MIN_TOLERANCE, MAX_TOLERANCE)
  );
  const [evaluationDuration, setEvaluationDurationState] = useState<number>(() =>
    readNumber(
      EVALUATION_DURATION_STORAGE_KEY,
      DEFAULT_EVALUATION_DURATION,
      MIN_EVALUATION_DURATION,
      MAX_EVALUATION_DURATION
    )
  );

  const setRepetitions = (updater: Updater) => {
    setRepetitionsState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      const clamped = Math.min(MAX_REPETITIONS, Math.max(MIN_REPETITIONS, next));
      if (typeof localStorage !== "undefined") localStorage.setItem(REPETITIONS_STORAGE_KEY, String(clamped));
      return clamped;
    });
  };

  const setTolerance = (updater: Updater) => {
    setToleranceState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      const clamped = Math.min(MAX_TOLERANCE, Math.max(MIN_TOLERANCE, next));
      if (typeof localStorage !== "undefined") localStorage.setItem(TOLERANCE_STORAGE_KEY, String(clamped));
      return clamped;
    });
  };

  const setEvaluationDuration = (updater: Updater) => {
    setEvaluationDurationState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      const clamped = Math.min(MAX_EVALUATION_DURATION, Math.max(MIN_EVALUATION_DURATION, next));
      if (typeof localStorage !== "undefined")
        localStorage.setItem(EVALUATION_DURATION_STORAGE_KEY, String(clamped));
      return clamped;
    });
  };

  return {
    repetitions,
    setRepetitions,
    tolerance,
    setTolerance,
    evaluationDuration,
    setEvaluationDuration,
  };
}

/** Lecture seule de la durée d'évaluation configurée (en minutes), pour les
 * écrans qui n'ont besoin que de la consommer sans l'éditer. */
export function readEvaluationDurationMinutes(): number {
  return readNumber(
    EVALUATION_DURATION_STORAGE_KEY,
    DEFAULT_EVALUATION_DURATION,
    MIN_EVALUATION_DURATION,
    MAX_EVALUATION_DURATION
  );
}
