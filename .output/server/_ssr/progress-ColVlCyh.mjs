import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-ColVlCyh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var POINTS_PAR_MODALITE = {
	COURS: 5,
	EXERCICE: 10
};
var PROGRESS_STORAGE_KEY = "amani_progress_log";
var CHANGE_EVENT = "amani:progress-changed";
/** Émis uniquement quand une NOUVELLE étape rapporte des points (pas sur un doublon ignoré) — déclenche le popup "+N". */
var POINTS_AWARDED_EVENT = "amani:points-awarded";
function readLog() {
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
function writeLog(log) {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(log));
	window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}
function totalPointsOf(log) {
	return log.reduce((sum, e) => sum + e.points, 0);
}
/**
* Journalise la réussite d'une étape (cours ou exercice) et attribue ses
* points, une seule fois par (typeEtape, modalite, etapeCode) — rejouer la
* même étape ne rapporte rien de plus, exactement comme côté back-end
* (`ProgressionRepository.existsByProfilIdAndTypeEtapeAndModaliteAndEtapeCode`).
*/
function awardCompletion(input) {
	const log = readLog();
	if (log.some((e) => e.typeEtape === input.typeEtape && e.modalite === input.modalite && e.etapeCode === input.etapeCode)) return {
		pointsAwarded: 0,
		alreadyCompleted: true,
		totalPoints: totalPointsOf(log)
	};
	const points = POINTS_PAR_MODALITE[input.modalite];
	const entry = {
		...input,
		points,
		dateReussite: (/* @__PURE__ */ new Date()).toISOString()
	};
	const next = [...log, entry];
	writeLog(next);
	if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(POINTS_AWARDED_EVENT, { detail: { points } }));
	return {
		pointsAwarded: points,
		alreadyCompleted: false,
		totalPoints: totalPointsOf(next)
	};
}
function onPointsAwarded(callback) {
	if (typeof window === "undefined") return () => {};
	const handler = (e) => callback(e.detail.points);
	window.addEventListener(POINTS_AWARDED_EVENT, handler);
	return () => window.removeEventListener(POINTS_AWARDED_EVENT, handler);
}
var VIEWED_STORAGE_PREFIX = "amani_cours_viewed_";
function viewedKey(typeEtape, groupCode) {
	return `${VIEWED_STORAGE_PREFIX}${typeEtape}_${groupCode}`;
}
function readViewed(typeEtape, groupCode) {
	if (typeof localStorage === "undefined") return /* @__PURE__ */ new Set();
	try {
		const raw = localStorage.getItem(viewedKey(typeEtape, groupCode));
		const parsed = raw ? JSON.parse(raw) : [];
		return new Set(Array.isArray(parsed) ? parsed : []);
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function writeViewed(typeEtape, groupCode, viewed) {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(viewedKey(typeEtape, groupCode), JSON.stringify([...viewed]));
}
/**
* Marque un élément d'un cours comme consulté, et n'attribue les points du
* cours que lorsque TOUS ses éléments ont été vus au moins une fois — jamais
* dès l'ouverture du cours, pour ne pas récompenser un enfant qui n'irait
* pas au bout (voir aussi `Modalite.COURS` côté back-end, où le principe est
* le même : la journalisation d'un cours ne survient qu'une fois complet).
*/
function markCoursItemViewed(input) {
	const viewed = readViewed(input.typeEtape, input.groupCode);
	if (viewed.has(input.itemCode)) return;
	viewed.add(input.itemCode);
	writeViewed(input.typeEtape, input.groupCode, viewed);
	if (viewed.size >= input.totalItems) awardCompletion({
		typeEtape: input.typeEtape,
		modalite: "COURS",
		etapeCode: input.groupCode,
		palier: input.palier
	});
}
/** Même calcul que `ProgressionServiceImpl.getProgression` côté back-end. */
function getProgressStats() {
	const log = readLog();
	const signesMaitrises = new Set(log.filter((e) => e.typeEtape === "SIGNE" && e.modalite === "EXERCICE").map((e) => e.etapeCode)).size;
	const coursTermines = log.filter((e) => e.modalite === "COURS").length;
	const exercicesReussis = log.filter((e) => e.modalite === "EXERCICE").length;
	const joursAventure = new Set(log.map((e) => e.dateReussite.slice(0, 10))).size;
	return {
		totalPoints: totalPointsOf(log),
		signesMaitrises,
		coursTermines,
		exercicesReussis,
		joursAventure
	};
}
var EMPTY_STATS = {
	totalPoints: 0,
	signesMaitrises: 0,
	coursTermines: 0,
	exercicesReussis: 0,
	joursAventure: 0
};
/** Variante réactive de `getProgressStats`, pour l'affichage (Mon Profil, La Clairière). */
function useProgressStats() {
	const [stats, setStats] = (0, import_react.useState)(() => typeof localStorage !== "undefined" ? getProgressStats() : EMPTY_STATS);
	(0, import_react.useEffect)(() => {
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
//#endregion
export { useProgressStats as i, markCoursItemViewed as n, onPointsAwarded as r, awardCompletion as t };
