import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resumeCheckpoint-D59OZ5_R.js
var $$splitComponentImporter = () => import("../_app.accueil-CvB0np_8.mjs");
var Route = createFileRoute("/_app/accueil")({
	head: () => ({ meta: [{ title: "Parcours de la branche — Amani" }, {
		name: "description",
		content: "Suis le chemin en zigzag et fais éclore les bourgeons une étape à la fois."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
/** Génère un chemin en zigzag dont le nombre d'ondulations suit la longueur réelle du parcours. */
/** Petit badge numéroté qui rappelle la position de l'étape dans le parcours. */
/** Quelques étincelles discrètes autour de l'étape en cours, pour un léger effet ludique. */
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
var CHECKPOINT_KEY = "amani_resume_checkpoint";
/** Préfixes de route considérés comme une "session" reprenable. */
function isResumablePathname(pathname) {
	return pathname.startsWith("/cours/") || pathname.startsWith("/exercice-liste") || pathname.startsWith("/exercice/");
}
var bootCheckDone = false;
/** À appeler une seule fois, une fois la proposition de reprise traitée. */
function markResumeBootCheckDone() {
	bootCheckDone = true;
}
/** Appelé à chaque navigation résolue (voir `router.tsx`). */
function trackResumeCheckpoint(pathname, href) {
	if (typeof localStorage === "undefined") return;
	if (pathname === "/accueil") {
		if (bootCheckDone) localStorage.removeItem(CHECKPOINT_KEY);
		return;
	}
	if (isResumablePathname(pathname)) localStorage.setItem(CHECKPOINT_KEY, href);
}
/** Route à proposer de reprendre, ou `null` s'il n'y en a pas. */
function getPendingResumeRoute() {
	if (typeof localStorage === "undefined") return null;
	return localStorage.getItem(CHECKPOINT_KEY);
}
/** Efface le point de reprise (proposition déclinée). */
function clearResumeCheckpoint() {
	if (typeof localStorage === "undefined") return;
	localStorage.removeItem(CHECKPOINT_KEY);
}
//#endregion
export { trackResumeCheckpoint as a, markResumeBootCheckDone as i, clearResumeCheckpoint as n, getPendingResumeRoute as r, Route as t };
