import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useWritingStyle-CKn53fOs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Réglage partagé du style d'écriture (Profil > Réglages > "Format
* d'écriture"), lu par toutes les pages de cours/exercices de phase 2 et 3
* (formation des lettres). Même clé localStorage que la page Profil, pour
* que le bouton "Cursive" y reste la source de vérité unique.
*/
var WRITING_STYLE_STORAGE_KEY = "amani_setting_format";
var CHANGE_EVENT = "amani:writing-style-changed";
function readStyle() {
	if (typeof localStorage === "undefined") return "script";
	const raw = localStorage.getItem(WRITING_STYLE_STORAGE_KEY);
	return raw === "cursive" ? raw : "script";
}
function setWritingStyle(style) {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(WRITING_STYLE_STORAGE_KEY, style);
	window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: style }));
}
function useWritingStyle() {
	const [style, setStyle] = (0, import_react.useState)(() => readStyle());
	(0, import_react.useEffect)(() => {
		const onChange = () => setStyle(readStyle());
		window.addEventListener(CHANGE_EVENT, onChange);
		window.addEventListener("storage", onChange);
		return () => {
			window.removeEventListener(CHANGE_EVENT, onChange);
			window.removeEventListener("storage", onChange);
		};
	}, []);
	return style;
}
/** Variante pratique lorsqu'un composant a aussi besoin de modifier le réglage. */
function useWritingStyleState() {
	return [useWritingStyle(), (0, import_react.useCallback)((s) => setWritingStyle(s), [])];
}
//#endregion
export { useWritingStyleState as n, useWritingStyle as t };
