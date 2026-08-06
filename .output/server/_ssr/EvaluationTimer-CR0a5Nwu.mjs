import { n as __toESM } from "../_runtime.mjs";
import { s as performance_default } from "../_libs/h3+rou3+srvx+unenv.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as useLanguage } from "./LanguageContext-B_1DF56M.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { S as PartyPopper, l as Timer } from "../_libs/lucide-react.mjs";
import { t as AmaniMascot } from "./AmaniMascot-A-Eqgs-C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EvaluationTimer-CR0a5Nwu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Compte à rebours en secondes, basé sur le temps réel écoulé (résistant aux
* onglets mis en arrière-plan) plutôt que sur un simple décompte par tick.
* Appelle `onExpire` une seule fois lorsque le temps est écoulé.
*/
function useCountdown(durationSeconds, onExpire) {
	const [remaining, setRemaining] = (0, import_react.useState)(durationSeconds);
	const onExpireRef = (0, import_react.useRef)(onExpire);
	onExpireRef.current = onExpire;
	(0, import_react.useEffect)(() => {
		if (durationSeconds <= 0) return;
		const start = performance_default.now();
		let expired = false;
		setRemaining(durationSeconds);
		const id = window.setInterval(() => {
			const elapsed = Math.floor((performance_default.now() - start) / 1e3);
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
function formatCountdown(totalSeconds) {
	const m = Math.floor(totalSeconds / 60);
	const s = totalSeconds % 60;
	return `${m}:${String(s).padStart(2, "0")}`;
}
/** Délai avant le retour automatique au parcours — assez long pour lire le message, assez court pour ne pas faire attendre. */
var AUTO_BACK_DELAY_MS = 3500;
/** Bandeau sticky affiché en haut d'un écran d'exercice en mode "évaluation",
* montrant le temps restant. Vire au rouge dans les 30 dernières secondes. */
function EvaluationTimerBadge({ remaining }) {
	const { t } = useLanguage();
	const low = remaining <= 30;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("sticky top-0 z-40 flex items-center justify-center gap-2 px-4 py-2 text-white text-[13px] font-bold shrink-0 transition-colors", low ? "bg-[#C03E3E]" : "bg-[#4A3B2A]"),
		role: "timer",
		"aria-live": low ? "assertive" : "off",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, {
			className: "w-4 h-4",
			strokeWidth: 2.5
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
			t.evaluation.badge,
			" · ",
			t.evaluation.timeLeft,
			" ",
			formatCountdown(remaining)
		] })]
	});
}
/**
* Écran de fin d'évaluation (temps écoulé), bloquant. Reconduit
* automatiquement vers l'accueil après un court délai — l'enfant n'a rien à
* faire pour enchaîner sur le palier suivant — mais le bouton reste
* disponible pour ne pas forcer l'attente.
*/
function EvaluationCompleteOverlay({ onBack }) {
	const { t } = useLanguage();
	(0, import_react.useEffect)(() => {
		const timer = setTimeout(onBack, AUTO_BACK_DELAY_MS);
		return () => clearTimeout(timer);
	}, [onBack]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-50 flex items-center justify-center px-6 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200",
		role: "dialog",
		"aria-live": "polite",
		"aria-label": t.evaluation.finishedTitle,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4 w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmaniMascot, {
					pose: "celebration",
					size: "medium",
					priority: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartyPopper, {
					className: "w-7 h-7 text-[#A9784F]",
					strokeWidth: 2.2
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[22px] font-extrabold text-[#4A3B2A]",
					children: t.evaluation.finishedTitle
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[14px] text-[#7A6A55] mt-1.5",
					children: t.evaluation.finishedMessage
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onBack,
					className: "w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-[#8FBF6F] hover:bg-[#7AAE5A] text-white shadow-md active:scale-95 transition-all",
					children: t.evaluation.backToPath
				})
			]
		})
	});
}
//#endregion
export { EvaluationTimerBadge as n, useCountdown as r, EvaluationCompleteOverlay as t };
