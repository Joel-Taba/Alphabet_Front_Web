import { useEffect, useState } from "react";

/**
 * Système de points local (aucun serveur pour l'instant — voir le module
 * "progression" du back-end Spring pour l'équivalent qui prendra le relais
 * lors de la liaison front/back). Les noms et la forme des données
 * (TypeEtape, Modalite, palier, etapeCode) sont volontairement calqués sur
 * `com.methode.progression` pour que le remplacement de ce fichier par de
 * vrais appels API, plus tard, soit une substitution mécanique plutôt
 * qu'une réécriture.
 *
 * Barème : un cours (découverte guidée) rapporte moins qu'un exercice
 * (pratique active), pour valoriser l'effort — voir POINTS_PAR_MODALITE.
 * Ces points alimentent aussi bien "Mon Profil" (statistiques) que "La
 * Clairière" (classement, score de "moi").
 */

export type TypeEtape = "SIGNE" | "LETTRE" | "SYLLABE" | "MOT" | "MOTS_CROISES" | "MOTS_MELES";
export type Modalite = "COURS" | "EXERCICE";

export const POINTS_PAR_MODALITE: Record<Modalite, number> = {
  COURS: 5,
  EXERCICE: 10,
};

interface EtapeReussie {
  typeEtape: TypeEtape;
  modalite: Modalite;
  etapeCode: string;
  palier: number;
  points: number;
  dateReussite: string;
}

const PROGRESS_STORAGE_KEY = "amani_progress_log";
const CHANGE_EVENT = "amani:progress-changed";
/** Émis uniquement quand une NOUVELLE étape rapporte des points (pas sur un doublon ignoré) — déclenche le popup "+N". */
const POINTS_AWARDED_EVENT = "amani:points-awarded";

function readLog(): EtapeReussie[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLog(log: EtapeReussie[]) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(log));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export interface AwardCompletionInput {
  typeEtape: TypeEtape;
  modalite: Modalite;
  etapeCode: string;
  palier: number;
}

export interface AwardResult {
  pointsAwarded: number;
  alreadyCompleted: boolean;
  totalPoints: number;
}

function totalPointsOf(log: EtapeReussie[]): number {
  return log.reduce((sum, e) => sum + e.points, 0);
}

/**
 * Journalise la réussite d'une étape (cours ou exercice) et attribue ses
 * points, une seule fois par (typeEtape, modalite, etapeCode) — rejouer la
 * même étape ne rapporte rien de plus, exactement comme côté back-end
 * (`ProgressionRepository.existsByProfilIdAndTypeEtapeAndModaliteAndEtapeCode`).
 */
export function awardCompletion(input: AwardCompletionInput): AwardResult {
  const log = readLog();
  const dejaEnregistre = log.some(
    (e) => e.typeEtape === input.typeEtape && e.modalite === input.modalite && e.etapeCode === input.etapeCode
  );
  if (dejaEnregistre) {
    return { pointsAwarded: 0, alreadyCompleted: true, totalPoints: totalPointsOf(log) };
  }

  const points = POINTS_PAR_MODALITE[input.modalite];
  const entry: EtapeReussie = { ...input, points, dateReussite: new Date().toISOString() };
  const next = [...log, entry];
  writeLog(next);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(POINTS_AWARDED_EVENT, { detail: { points } }));
  }

  return { pointsAwarded: points, alreadyCompleted: false, totalPoints: totalPointsOf(next) };
}

export function onPointsAwarded(callback: (points: number) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => callback((e as CustomEvent<{ points: number }>).detail.points);
  window.addEventListener(POINTS_AWARDED_EVENT, handler);
  return () => window.removeEventListener(POINTS_AWARDED_EVENT, handler);
}

const BONUS_STORAGE_KEY = "amani_progress_bonus_points";
const RESTART_BONUS_MIN = 1;
const RESTART_BONUS_MAX = 2;

function readBonusTotal(): number {
  if (typeof localStorage === "undefined") return 0;
  const raw = localStorage.getItem(BONUS_STORAGE_KEY);
  const n = raw != null ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

function writeBonusTotal(total: number) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(BONUS_STORAGE_KEY, String(total));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

/**
 * Petit bonus (1 ou 2 points, au hasard) attribué à chaque reprise volontaire
 * d'un exercice déjà terminé — pour encourager à répéter, sans limite de
 * nombre de fois. Contrairement à `awardCompletion`, jamais dédupliqué : ce
 * n'est pas une nouvelle "étape réussie" (ça ne change ni coursTermines ni
 * exercicesReussis), seulement un bonus qui vient s'ajouter au score.
 */
export function awardRestartBonus(): number {
  const points = Math.random() < 0.5 ? RESTART_BONUS_MIN : RESTART_BONUS_MAX;
  writeBonusTotal(readBonusTotal() + points);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(POINTS_AWARDED_EVENT, { detail: { points } }));
  }

  return points;
}

const VIEWED_STORAGE_PREFIX = "amani_cours_viewed_";

function viewedKey(typeEtape: TypeEtape, groupCode: string): string {
  return `${VIEWED_STORAGE_PREFIX}${typeEtape}_${groupCode}`;
}

function readViewed(typeEtape: TypeEtape, groupCode: string): Set<string> {
  if (typeof localStorage === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(viewedKey(typeEtape, groupCode));
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function writeViewed(typeEtape: TypeEtape, groupCode: string, viewed: Set<string>) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(viewedKey(typeEtape, groupCode), JSON.stringify([...viewed]));
}

export interface MarkCoursItemViewedInput {
  typeEtape: TypeEtape;
  /** Identifiant du "cours" dans son ensemble (ex. famille de signe, groupe de lettres, consonne, groupe de mots). */
  groupCode: string;
  /** Identifiant du variant/lettre/syllabe/mot précis qui vient d'être consulté. */
  itemCode: string;
  /** Nombre total d'éléments à consulter pour que ce cours soit considéré terminé. */
  totalItems: number;
  palier: number;
}

/**
 * Marque un élément d'un cours comme consulté, et n'attribue les points du
 * cours que lorsque TOUS ses éléments ont été vus au moins une fois — jamais
 * dès l'ouverture du cours, pour ne pas récompenser un enfant qui n'irait
 * pas au bout (voir aussi `Modalite.COURS` côté back-end, où le principe est
 * le même : la journalisation d'un cours ne survient qu'une fois complet).
 */
export function markCoursItemViewed(input: MarkCoursItemViewedInput): void {
  const viewed = readViewed(input.typeEtape, input.groupCode);
  if (viewed.has(input.itemCode)) return;

  viewed.add(input.itemCode);
  writeViewed(input.typeEtape, input.groupCode, viewed);

  if (viewed.size >= input.totalItems) {
    awardCompletion({
      typeEtape: input.typeEtape,
      modalite: "COURS",
      etapeCode: input.groupCode,
      palier: input.palier,
    });
  }
}

export interface ProgressStats {
  totalPoints: number;
  signesMaitrises: number;
  coursTermines: number;
  exercicesReussis: number;
  joursAventure: number;
}

/** Même calcul que `ProgressionServiceImpl.getProgression` côté back-end. */
export function getProgressStats(): ProgressStats {
  const log = readLog();

  // Uniquement les exercices : les cours de signes sont journalisés au niveau
  // de la famille entière (voir markCoursItemViewed), pas par variante — les
  // mélanger fausserait ce compte de signes individuellement maîtrisés.
  const signesMaitrises = new Set(
    log.filter((e) => e.typeEtape === "SIGNE" && e.modalite === "EXERCICE").map((e) => e.etapeCode)
  ).size;
  const coursTermines = log.filter((e) => e.modalite === "COURS").length;
  const exercicesReussis = log.filter((e) => e.modalite === "EXERCICE").length;
  const joursAventure = new Set(log.map((e) => e.dateReussite.slice(0, 10))).size;

  return {
    totalPoints: totalPointsOf(log) + readBonusTotal(),
    signesMaitrises,
    coursTermines,
    exercicesReussis,
    joursAventure,
  };
}

const EMPTY_STATS: ProgressStats = {
  totalPoints: 0,
  signesMaitrises: 0,
  coursTermines: 0,
  exercicesReussis: 0,
  joursAventure: 0,
};

/** Variante réactive de `getProgressStats`, pour l'affichage (Mon Profil, La Clairière). */
export function useProgressStats(): ProgressStats {
  const [stats, setStats] = useState<ProgressStats>(() =>
    typeof localStorage !== "undefined" ? getProgressStats() : EMPTY_STATS
  );

  useEffect(() => {
    const refresh = () => setStats(getProgressStats());
    refresh();
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return stats;
}
