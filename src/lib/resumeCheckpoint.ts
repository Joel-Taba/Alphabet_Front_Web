/**
 * Point de reprise de session (cours/exercice/évaluation) — permet de
 * proposer à l'enfant de reprendre exactement là où il en était en cas de
 * fermeture brusque de l'app, plutôt que de perdre sa place. Port fidèle de
 * `resume_checkpoint_service.dart` (même clé `localStorage`/SharedPreferences,
 * même logique) — voir ce fichier pour le détail du raisonnement.
 *
 * Alimenté automatiquement par `router.subscribe("onResolved", ...)` (voir
 * `router.tsx`) à chaque navigation : aucune route individuelle n'a besoin
 * d'appeler ce module directement.
 */

const CHECKPOINT_KEY = "amani_resume_checkpoint";

/** Préfixes de route considérés comme une "session" reprenable. */
function isResumablePathname(pathname: string): boolean {
  return (
    pathname.startsWith("/cours/") ||
    pathname.startsWith("/exercice-liste") ||
    pathname.startsWith("/exercice/")
  );
}

// Vrai une fois que l'écran d'accueil a eu l'occasion de proposer la reprise
// au tout premier chargement de l'app — avant ça, revenir à `/accueil` ne
// doit pas effacer le point de reprise (voir markResumeBootCheckDone).
let bootCheckDone = false;

/** À appeler une seule fois, une fois la proposition de reprise traitée. */
export function markResumeBootCheckDone(): void {
  bootCheckDone = true;
}

/** Appelé à chaque navigation résolue (voir `router.tsx`). */
export function trackResumeCheckpoint(pathname: string, href: string): void {
  if (typeof localStorage === "undefined") return;
  if (pathname === "/accueil") {
    if (bootCheckDone) localStorage.removeItem(CHECKPOINT_KEY);
    return;
  }
  if (isResumablePathname(pathname)) {
    localStorage.setItem(CHECKPOINT_KEY, href);
  }
}

/** Route à proposer de reprendre, ou `null` s'il n'y en a pas. */
export function getPendingResumeRoute(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(CHECKPOINT_KEY);
}

/** Efface le point de reprise (proposition déclinée). */
export function clearResumeCheckpoint(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(CHECKPOINT_KEY);
}
