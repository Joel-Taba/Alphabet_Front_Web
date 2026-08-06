import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CahierFrame-BHMoRBMv.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Fond quadrillé + lignes réglées façon cahier français (Seyès simplifié),
* utilisé comme cadre pour tous les tracés de signes/lettres (cours et exercices).
*
* Les lignes réglées sont positionnées en % pour correspondre exactement aux
* zones du système de coordonnées 200×200 partagé par tout le catalogue de
* lettres (ASC_TOP=27, CORPS_TOP=77, BASELINE=149, DESC_BOT=194), afin que le
* tracé affiché par-dessus s'aligne toujours naturellement sur les lignes.
*/
var RULED_LINES = [
	{
		pct: 13.5,
		baseline: false
	},
	{
		pct: 38.5,
		baseline: false
	},
	{
		pct: 74.5,
		baseline: true
	},
	{
		pct: 97,
		baseline: false
	}
];
var PAPER_BG_COLOR = "#FFFFFF";
var RULED_LINE_COLOR = "#4A90E2";
var BASELINE_COLOR = "#E05252";
function CahierFrame({ children, className, style, rounded = 16 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden", className),
		style: {
			borderRadius: rounded,
			backgroundColor: PAPER_BG_COLOR,
			...style
		},
		children: [RULED_LINES.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute left-0 right-0 pointer-events-none",
			style: {
				top: `${line.pct}%`,
				height: line.baseline ? 1.5 : 1,
				backgroundColor: line.baseline ? BASELINE_COLOR : RULED_LINE_COLOR,
				opacity: .8
			}
		}, line.pct)), children]
	});
}
//#endregion
export { CahierFrame as t };
