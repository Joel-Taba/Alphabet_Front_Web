import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as useLanguage } from "./LanguageContext-lly5fNnz.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as onPointsAwarded } from "./progress-DCH5vN8F.mjs";
import { u as Star } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MobileShell-DcBUhlYe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TOAST_LIFETIME_MS = 2200;
var nextToastId = 0;
/**
* Bulle "+N ⭐" affichée brièvement à chaque cours/exercice terminé.
* Montée une seule fois dans MobileShell : les écrans n'ont qu'à appeler
* `awardCompletion(...)` (voir lib/progress.ts), ce composant s'occupe seul
* du retour visuel — volontairement sans texte à lire, pour rester lisible
* par un enfant qui ne sait pas encore lire.
*/
function PointsToastHost() {
	const { t } = useLanguage();
	const [toasts, setToasts] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		return onPointsAwarded((points) => {
			const id = nextToastId++;
			setToasts((prev) => [...prev, {
				id,
				points
			}]);
			setTimeout(() => {
				setToasts((prev) => prev.filter((toast) => toast.id !== id));
			}, TOAST_LIFETIME_MS);
		});
	}, []);
	if (toasts.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-x-0 top-5 z-50 flex flex-col items-center gap-2",
		children: toasts.map((toast) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "status",
			"aria-label": `+${toast.points} ${t.common.pointsEarnedAria}`,
			className: "animate-points-pop flex items-center gap-1.5 rounded-full px-4 py-2 shadow-[0_6px_18px_rgba(217,168,74,0.45)]",
			style: { background: "linear-gradient(135deg, #F6C453 0%, #D9A84A 100%)" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
				className: "h-4 w-4 fill-white text-white",
				strokeWidth: 2
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[15px] font-extrabold text-white",
				children: ["+", toast.points]
			})]
		}, toast.id))
	});
}
/**
* Centers app content in a phone-sized column on wider screens,
* full-bleed on mobile. Route content owns its own scroll.
*/
function MobileShell({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-background-alt flex items-center justify-center py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative flex w-full max-w-[390px] flex-col overflow-hidden bg-background shadow-[var(--shadow-modal)] rounded-[40px]", "h-[844px] max-h-[calc(100vh-2rem)]", className),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PointsToastHost, {}), children]
		})
	});
}
//#endregion
export { MobileShell as t };
