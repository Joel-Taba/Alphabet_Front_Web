import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as useLanguage } from "./LanguageContext-lly5fNnz.mjs";
import { B as BookOpen, U as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as MobileShell } from "./MobileShell-DcBUhlYe.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as SignGlyph } from "./SignGlyph-BH0B_An9.mjs";
import { t as CahierFrame } from "./CahierFrame-BHMoRBMv.mjs";
import { c as familleDominante, i as LABEL_ZONE, n as COULEUR_FAMILLE, r as FORMULES_PAR_CARACTERE, s as STROKE_FAMILLE } from "./flores-gong-nota-yzkWzvbf.mjs";
import { t as Route } from "./cours.lettres._char-CSmfovq2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cours.lettres._char-CzQrLwyi.js
var import_jsx_runtime = require_jsx_runtime();
/** Bande des lignes Seyès avec le grand caractère rendu dessus (lecture) */
function AffichageLettreSeyès({ formule, lang }) {
	const strokeColor = STROKE_FAMILLE[familleDominante(formule)] ?? "#4A3B2A";
	const signePrincipal = formule.signes[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CahierFrame, {
		className: "relative w-full h-[160px] border border-[#4A3B2A]/10 shadow-inner",
		rounded: 16,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center pointer-events-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[88px] font-bold leading-none select-none",
					style: { color: strokeColor + "22" },
					"aria-hidden": true,
					children: formule.caractere
				})
			}),
			signePrincipal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center pointer-events-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignGlyph, {
					family: signePrincipal.famille,
					variant: signePrincipal.variante,
					stroke: strokeColor,
					strokeWidth: 10,
					className: "w-[110px] h-[110px] opacity-80"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold",
				style: {
					backgroundColor: formule.zone === "corps" ? "#8FBF6F20" : formule.zone === "hampe" ? "#4A90E220" : "#E0525220",
					color: formule.zone === "corps" ? "#4A7A30" : formule.zone === "hampe" ? "#2D6BBF" : "#C03E3E"
				},
				children: LABEL_ZONE[formule.zone][lang]
			})
		]
	});
}
function DecompositionScreen() {
	const { char } = Route.useParams();
	const { t, lang } = useLanguage();
	const formule = FORMULES_PAR_CARACTERE.get(char);
	if (!formule) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center flex-1 p-8 gap-4 bg-[#F5EDE0]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-[#4A3B2A] text-[18px] font-bold text-center",
			children: [
				"\"",
				char,
				"\" ",
				t.coursLettresChar.notFound,
				"."
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/cours/lettres",
			className: "px-6 py-3 rounded-full bg-[#8FBF6F] text-white font-bold text-[15px]",
			children: t.coursLettresChar.backToList
		})]
	}) });
	const couleur = COULEUR_FAMILLE[familleDominante(formule)] ?? COULEUR_FAMILLE.trait;
	const nom = formule.nom[lang];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "flex items-center justify-between px-6 pt-6 pb-4 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/cours/lettres",
				"aria-label": t.common.back,
				className: "grid h-11 w-11 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
					className: "h-5 w-5 text-[#4A3B2A]",
					strokeWidth: 2.5
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-[24px] font-bold text-[#4A3B2A] leading-tight",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					style: { color: couleur.text },
					children: [
						"\"",
						formule.caractere,
						"\""
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13px] text-[#7A6A55] font-normal",
				children: nom
			})] })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex-1 overflow-y-auto px-4 py-5 bg-[#F5EDE0] flex flex-col gap-6 pb-10",
		children: [
			!formule.validee && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-[#FFF3CD] border border-[#F0C040] rounded-[14px] p-3.5 flex items-start gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[18px] shrink-0 mt-0.5",
					children: "⚠️"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-[#7A5C00] font-medium leading-snug",
					children: t.coursLettresChar.pendingWarning
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[14px] font-bold text-[#4A3B2A] uppercase tracking-wide",
					children: t.coursLettresChar.seenOnLines
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AffichageLettreSeyès, {
					formule,
					lang
				})]
			}),
			[
				"a",
				"d",
				"q"
			].includes(formule.caractere) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-[#EAF4FF] border border-[#4A90E2]/30 rounded-[14px] p-3.5 flex items-start gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[18px] shrink-0 mt-0.5",
					children: "💡"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-[#2D5E8A] font-medium leading-snug",
					children: t.coursLettresChar.adqNote
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/exercice-liste",
					className: "flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#8FBF6F] text-white font-bold text-[15px] shadow-[0_4px_12px_rgba(143,191,111,0.3)] active:scale-95 transition-transform",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-5 w-5" }), t.coursLettresChar.practiceLink]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/cours/lettres",
					className: "flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#4A3B2A]/10 text-[#4A3B2A] font-semibold text-[14px] active:scale-95 transition-transform",
					children: t.coursLettresChar.seeAll
				})]
			})
		]
	})] });
}
//#endregion
export { DecompositionScreen as component };
