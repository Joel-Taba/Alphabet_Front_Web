import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useAnimationSpeed-8KgMYO7Q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var ANIMATION_SPEED_STORAGE_KEY = "amani_setting_anim_speed";
var CHANGE_EVENT = "amani:animation-speed-changed";
/** Multiplicateur appliqué à la durée de base d'une animation : plus il est
* grand, plus l'animation est rapide (durée = base / multiplicateur). */
var SPEED_MULTIPLIER = {
	lent: .6,
	normal: 1,
	rapide: 2.5
};
function readSpeed() {
	if (typeof localStorage === "undefined") return "normal";
	const raw = localStorage.getItem(ANIMATION_SPEED_STORAGE_KEY);
	return raw === "lent" || raw === "rapide" ? raw : "normal";
}
function setAnimationSpeed(speed) {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(ANIMATION_SPEED_STORAGE_KEY, speed);
	window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: speed }));
}
function useAnimationSpeed() {
	const [speed, setSpeed] = (0, import_react.useState)(() => readSpeed());
	(0, import_react.useEffect)(() => {
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
function useAnimationSpeedState() {
	return [useAnimationSpeed(), (0, import_react.useCallback)((s) => setAnimationSpeed(s), [])];
}
/** Convertit une durée de base (ms) en durée effective selon la vitesse choisie. */
function scaleDuration(baseDurationMs, speed) {
	return baseDurationMs / SPEED_MULTIPLIER[speed];
}
//#endregion
export { useAnimationSpeed as n, useAnimationSpeedState as r, scaleDuration as t };
