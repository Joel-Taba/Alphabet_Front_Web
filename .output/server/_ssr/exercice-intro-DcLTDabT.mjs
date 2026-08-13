import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { U as ArrowLeft, _ as Search, n as Volume2 } from "../_libs/lucide-react.mjs";
import { t as MobileShell } from "./MobileShell-YeJooLSD.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AmaniMascot } from "./AmaniMascot-A-Eqgs-C.mjs";
import { t as Button } from "./Button-BvEgYgmh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exercice-intro-DcLTDabT.js
var import_jsx_runtime = require_jsx_runtime();
function HelpBubble({ children, onReplay }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative max-w-sm rounded-3xl bg-surface p-4 shadow-[var(--shadow-modal)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 text-[20px] leading-7 text-text-primary",
				children
			}), onReplay && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onReplay,
				"aria-label": "Réécouter la consigne",
				className: "grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
					className: "h-6 w-6",
					strokeWidth: 2.5
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": true,
			className: "absolute -bottom-2 left-8 h-4 w-4 rotate-45 bg-surface"
		})]
	});
}
function ExerciceIntro() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "grid grid-cols-[auto_1fr_auto] items-center gap-3 px-6 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/accueil",
				"aria-label": "Retour",
				className: "grid h-11 w-11 place-items-center rounded-full bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
					className: "h-5 w-5 rtl:rotate-180",
					strokeWidth: 2.5
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "truncate text-center text-[18px] font-bold text-text-primary",
				children: "Prochain exercice"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-11" })
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-1 flex-col gap-6 px-6 pt-4 pb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmaniMascot, {
					pose: "encouragement",
					size: "hero",
					priority: true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(HelpBubble, { children: [
					"On va ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "reconnaître des signes" }),
					" ensemble !"
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						className: "h-8 w-8",
						strokeWidth: 2.5
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12px] uppercase tracking-wide text-text-secondary",
							children: "Type d'exercice"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[18px] font-bold text-text-primary",
							children: "Reconnaissance"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[14px] text-text-secondary",
							children: "Trouve le bon signe parmi une petite grille."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-background-alt p-4",
				"aria-label": "Aperçu de la grille de l'exercice",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-[12px] uppercase tracking-wide text-text-secondary",
					children: "Aperçu"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-3",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"aria-hidden": true,
						className: "aspect-square rounded-2xl bg-surface shadow-[var(--shadow-card)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-full w-full place-items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-8 rounded-full bg-disabled" })
						})
					}, i))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto flex flex-col items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					asChild: true,
					className: "w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/exercice",
						children: "Commencer"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-[14px] font-semibold text-text-secondary underline underline-offset-4",
					children: "Voir une démonstration"
				})]
			})
		]
	})] });
}
//#endregion
export { ExerciceIntro as component };
