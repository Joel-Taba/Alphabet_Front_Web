import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as useLanguage, r as format } from "./LanguageContext-Dz0s8NLr.mjs";
import { U as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as MobileShell } from "./MobileShell-YeJooLSD.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as WORD_CATALOG } from "./word-catalog-DdEuxvtH.mjs";
import { n as generateCrossword, t as CrosswordPlay } from "./crosswordGenerator-DmrqXijT.mjs";
import { t as Route } from "./exercice.mots-croises._puzzleId-BJvg2GD8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exercice.mots-croises._puzzleId-BXlz5Vsf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** "lvl2" → 2 mots dans la grille, "lvl3" → 3, etc. (difficulté progressive du Palier 3). */
function parseLevel(puzzleId) {
	const m = /^lvl(\d+)$/.exec(puzzleId);
	if (!m) return null;
	const n = Number(m[1]);
	return n >= 2 && n <= 10 ? n : null;
}
function CrosswordScreen() {
	const { puzzleId } = Route.useParams();
	const { t } = useLanguage();
	const level = parseLevel(puzzleId);
	const crossword = (0, import_react.useMemo)(() => {
		if (!level) return null;
		return generateCrossword(WORD_CATALOG, level, 1e3 + level * 37);
	}, [level]);
	if (!level || !crossword) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center flex-1 p-8 gap-4 bg-[#F5EDE0]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[#4A3B2A] text-[18px] font-bold text-center",
			children: t.motsCroises.generationFailed
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/accueil",
			className: "px-6 py-3 rounded-full bg-[#8FBF6F] text-white font-bold text-[15px]",
			children: t.coursMots.backToList
		})]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "flex items-center justify-between px-6 pt-6 pb-4 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/accueil",
				"aria-label": t.common.back,
				className: "grid h-11 w-11 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
					className: "h-5 w-5 text-[#4A3B2A] rtl:rotate-180",
					strokeWidth: 2.5
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-[22px] font-bold text-[#4A3B2A] leading-tight",
				children: t.motsCroises.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13px] text-[#7A6A55] font-normal",
				children: format(t.motsCroises.levelSubtitle, {
					level,
					count: crossword.placed.length
				})
			})] })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex-1 overflow-y-auto px-4 py-5 bg-[#F5EDE0] pb-10 flex flex-col items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrosswordPlay, {
			crossword,
			puzzleId,
			level
		})
	})] });
}
//#endregion
export { CrosswordScreen as component };
