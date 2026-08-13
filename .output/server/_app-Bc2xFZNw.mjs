import { n as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { i as useLanguage } from "./_ssr/LanguageContext-Dz0s8NLr.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { C as Palette, E as Leaf, M as EllipsisVertical, i as User, r as Users } from "./_libs/lucide-react.mjs";
import { t as MobileShell } from "./_ssr/MobileShell-YeJooLSD.mjs";
import { t as useWritingStyle } from "./_ssr/useWritingStyle-CKn53fOs.mjs";
import { _ as Link, l as useRouterState, p as Outlet } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-Bc2xFZNw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var allItems = [
	{
		to: "/accueil",
		key: "accueil",
		icon: Leaf,
		isCenter: true
	},
	{
		to: "/bibliotheque",
		key: "bibliotheque",
		icon: Palette
	},
	{
		to: "/communaute",
		key: "communaute",
		icon: Users
	},
	{
		to: "/mon-profil",
		key: "profil",
		icon: User
	},
	{
		to: "/plus",
		key: "reglages",
		icon: EllipsisVertical
	}
];
function BottomNav() {
	const { t } = useLanguage();
	const currentPath = useRouterState().location.pathname;
	const activeIndex = allItems.findIndex((item) => currentPath === item.to);
	const getButtonPosition = () => {
		const n = allItems.length;
		const percentValue = (2 * (activeIndex >= 0 ? activeIndex : 0) + 1) / (2 * n) * 100;
		return {
			percent: `${percentValue}%`,
			svgX: percentValue / 100 * 350
		};
	};
	const buttonPos = getButtonPosition();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": t.nav.mainNavAria,
		className: "pointer-events-auto relative flex h-[110px] w-full items-end justify-center pb-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-[calc(100%-32px)] max-w-[350px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-0 z-20 -translate-x-1/2 transition-all duration-300 ease-in-out",
				style: { left: buttonPos.percent },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex flex-col items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex h-16 w-16 items-center justify-center rounded-full bg-secondary shadow-[0_6px_20px_rgba(143,191,111,0.3)] transition-all hover:scale-105 active:scale-95",
						children: activeIndex >= 0 && (() => {
							const ActiveIcon = allItems[activeIndex].icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActiveIcon, {
								className: "h-7 w-7 text-surface",
								strokeWidth: 2,
								fill: activeIndex === 0 ? "currentColor" : "none"
							});
						})()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute top-[58px] text-[9px] font-bold uppercase tracking-wide text-primary whitespace-nowrap",
						children: activeIndex >= 0 && t.nav[allItems[activeIndex].key]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-[22px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 350 64",
					className: "h-16 w-full drop-shadow-[0_4px_16px_rgba(74,59,42,0.12)]",
					preserveAspectRatio: "xMidYMid meet",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: `M 32 0
                 L ${buttonPos.svgX - 35} 0
                 Q ${buttonPos.svgX - 25} 0, ${buttonPos.svgX - 20} 15
                 Q ${buttonPos.svgX - 10} 25, ${buttonPos.svgX} 25
                 Q ${buttonPos.svgX + 10} 25, ${buttonPos.svgX + 20} 15
                 Q ${buttonPos.svgX + 25} 0, ${buttonPos.svgX + 35} 0
                 L 318 0
                 Q 350 0, 350 32
                 Q 350 64, 318 64
                 L 32 64
                 Q 0 64, 0 32
                 Q 0 0, 32 0
                 Z`,
						fill: "#FBF6EC",
						className: "transition-all duration-300"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 flex items-center justify-around px-6",
					children: allItems.map(({ to, key, icon: Icon }, index) => {
						const label = t.nav[key];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to,
							activeOptions: { exact: true },
							className: cn("group relative flex flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 transition-all", currentPath === to && "opacity-0"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -top-1 h-0.5 w-4 rounded-full bg-secondary opacity-0 transition-opacity duration-200 group-data-[status=active]:opacity-100" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: cn("h-5 w-5 transition-colors", "text-disabled group-data-[status=active]:text-secondary"),
									strokeWidth: 1.8
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("mt-0.5 text-[9px] font-semibold transition-colors truncate max-w-[60px] text-center", "text-disabled group-data-[status=active]:text-secondary"),
									children: label
								})
							]
						}, to);
					})
				})]
			})]
		})
	});
}
function AppLayout() {
	const writingStyle = useWritingStyle();
	(0, import_react.useEffect)(() => {
		document.body.classList.remove("format-script", "format-cursive");
		document.body.classList.add(`format-${writingStyle}`);
	}, [writingStyle]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: "app-main-scroll",
			className: "flex-1 overflow-y-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})]
	}) });
}
//#endregion
export { AppLayout as component };
