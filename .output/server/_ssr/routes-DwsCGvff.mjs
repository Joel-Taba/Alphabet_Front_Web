import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as useLanguage } from "./LanguageContext-Dz0s8NLr.mjs";
import { t as MobileShell } from "./MobileShell-YeJooLSD.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AmaniMascot } from "./AmaniMascot-A-Eqgs-C.mjs";
import { t as Button } from "./Button-BvEgYgmh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DwsCGvff.js
var import_jsx_runtime = require_jsx_runtime();
function Welcome() {
	const { t } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-1 flex-col items-center justify-between px-6 pt-10 pb-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[14px] font-semibold uppercase tracking-widest text-primary",
						children: t.welcome.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-[32px] leading-10 font-bold text-text-primary",
						children: t.welcome.heading
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xs text-[24px] leading-8 font-medium text-text-secondary",
						children: t.welcome.subheading
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmaniMascot, {
				pose: "accueil",
				size: "hero",
				priority: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					asChild: false,
					className: "w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/profil",
						className: "flex h-full w-full items-center justify-center",
						children: t.welcome.start
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/accueil",
					className: "text-[16px] font-semibold text-text-secondary underline-offset-4 hover:underline",
					children: t.welcome.imBack
				})]
			})
		]
	}) });
}
//#endregion
export { Welcome as component };
