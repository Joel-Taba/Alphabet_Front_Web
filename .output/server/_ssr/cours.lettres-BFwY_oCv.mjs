import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as useLanguage, r as format } from "./LanguageContext-IeRxb9no.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { U as ArrowLeft, n as Volume2, w as Lock } from "../_libs/lucide-react.mjs";
import { t as MobileShell } from "./MobileShell-L36W1Wth.mjs";
import { _ as Link, f as useMatchRoute, p as Outlet, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AmaniMascot } from "./AmaniMascot-A-Eqgs-C.mjs";
import { a as useSignSpeech } from "./useSignSpeech-MSIU-G__.mjs";
import { a as MAJUSCULES, c as familleDominante, n as COULEUR_FAMILLE, o as MINUSCULES, t as CHIFFRES } from "./flores-gong-nota-yzkWzvbf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cours.lettres-BFwY_oCv.js
var import_jsx_runtime = require_jsx_runtime();
/** Cellule d'une lettre dans la grille */
function LetterCell({ formule, onNavigate }) {
	const { t, lang } = useLanguage();
	const couleur = COULEUR_FAMILLE[familleDominante(formule)] ?? COULEUR_FAMILLE.trait;
	const isPending = !formule.validee;
	const nom = formule.nom[lang];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: isPending ? "presentation" : "button",
		tabIndex: isPending ? -1 : 0,
		onClick: () => !isPending && onNavigate(formule.caractere),
		onKeyDown: (e) => {
			if (!isPending && (e.key === "Enter" || e.key === " ")) {
				e.preventDefault();
				onNavigate(formule.caractere);
			}
		},
		"aria-label": isPending ? `${nom} — ${t.coursLettres.pendingAria}` : format(t.coursLettres.viewAria, { name: nom }),
		className: cn("relative flex flex-col items-center justify-center rounded-[14px] border transition-all duration-200 aspect-square", isPending ? "bg-[#F5EDE0]/60 border-[#4A3B2A]/10 cursor-not-allowed opacity-50" : "bg-[#FBF6EC] border-[#4A3B2A]/10 cursor-pointer shadow-[0_2px_6px_rgba(74,59,42,0.10)] hover:border-[#A9784F]/40 hover:shadow-[0_4px_12px_rgba(74,59,42,0.18)] hover:scale-[1.06] active:scale-[0.96]"),
		style: isPending ? {} : { borderColor: couleur.border ? void 0 : "transparent" },
		children: [
			!isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-0 left-2 right-2 h-[3px] rounded-full mt-1.5",
				style: { backgroundColor: couleur.text + "50" }
			}),
			isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
				className: "absolute top-1.5 right-1.5 h-3 w-3 text-[#4A3B2A]/30",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[26px] font-bold leading-none",
				style: { color: isPending ? "#4A3B2A40" : couleur.text },
				children: formule.caractere
			}),
			!isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] text-[#7A6A55] font-medium mt-0.5",
				children: format(t.coursLettres.signeCount, { count: formule.signes.length })
			})
		]
	});
}
/** Section de la grille (titre + groupe de lettres) */
function GridSection({ titre, sous_titre, formules, onNavigate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-[18px] font-bold text-[#4A3B2A] leading-tight",
			children: titre
		}), sous_titre && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[12px] text-[#7A6A55] mt-0.5",
			children: sous_titre
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-6 gap-2",
			children: formules.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LetterCell, {
				formule: f,
				onNavigate
			}, f.caractere))
		})]
	});
}
function LettresScreen() {
	const { speak } = useSignSpeech();
	const { t } = useLanguage();
	const navigate = useNavigate();
	if (!useMatchRoute()({
		to: "/cours/lettres",
		fuzzy: false
	})) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	const handleNavigate = (char) => {
		navigate({
			to: "/cours/lettres/$char",
			params: { char }
		});
	};
	const familles = [
		{
			famille: "trait",
			label: t.coursLettresChar.families.trait,
			couleur: COULEUR_FAMILLE.trait
		},
		{
			famille: "courbe",
			label: t.coursLettresChar.families.courbe,
			couleur: COULEUR_FAMILLE.courbe
		},
		{
			famille: "crochet",
			label: t.coursLettresChar.families.crochet,
			couleur: COULEUR_FAMILLE.crochet
		},
		{
			famille: "point",
			label: t.coursLettresChar.families.point,
			couleur: COULEUR_FAMILLE.point
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-center justify-between px-6 pt-6 pb-4 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/accueil",
				"aria-label": t.common.back,
				className: "grid h-11 w-11 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
					className: "h-5 w-5 text-[#4A3B2A]",
					strokeWidth: 2.5
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-[24px] font-bold text-[#4A3B2A] leading-tight",
				children: t.coursLettres.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13px] text-[#7A6A55] font-normal",
				children: t.coursLettres.subtitle
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmaniMascot, {
				pose: "curiosite",
				size: "small"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => speak(t.coursLettres.intro),
				"aria-label": t.common.listen,
				className: "grid h-10 w-10 place-items-center rounded-full bg-[#A9784F] text-white shadow-[0_2px_6px_rgba(74,59,42,0.18)] active:scale-95 transition-transform",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" })
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex-1 overflow-y-auto px-4 py-5 bg-[#F5EDE0] flex flex-col gap-7 pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2 items-center",
				children: familles.map(({ famille, label, couleur }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold",
					style: {
						backgroundColor: couleur.text + "15",
						color: couleur.text
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-2 h-2 rounded-full",
							style: { backgroundColor: couleur.text }
						}),
						label,
						" ",
						t.coursLettres.legendSuffix
					]
				}, famille))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridSection, {
				titre: t.coursLettres.minusculesTitle,
				sous_titre: t.coursLettres.minusculesSubtitle,
				formules: MINUSCULES,
				onNavigate: handleNavigate
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridSection, {
				titre: t.coursLettres.chiffresTitle,
				sous_titre: t.coursLettres.chiffresSubtitle,
				formules: CHIFFRES,
				onNavigate: handleNavigate
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridSection, {
				titre: t.coursLettres.majusculesTitle,
				sous_titre: t.coursLettres.majusculesSubtitle,
				formules: MAJUSCULES,
				onNavigate: handleNavigate
			})
		]
	})] });
}
//#endregion
export { LettresScreen as component };
