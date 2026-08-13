import { n as __toESM } from "../_runtime.mjs";
import { s as performance_default } from "../_libs/h3+rou3+srvx+unenv.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as useLanguage } from "./LanguageContext-Dz0s8NLr.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { r as markCoursItemViewed } from "./progress-DCH5vN8F.mjs";
import { F as ChevronLeft, N as CircleCheck, P as ChevronRight, U as ArrowLeft, n as Volume2, v as RotateCcw, y as Play } from "../_libs/lucide-react.mjs";
import { t as MobileShell } from "./MobileShell-YeJooLSD.mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as SignGlyph } from "./SignGlyph-BH0B_An9.mjs";
import { a as useSignSpeech } from "./useSignSpeech-BDGf_vV1.mjs";
import { n as useAnimationSpeed, t as scaleDuration } from "./useAnimationSpeed-8KgMYO7Q.mjs";
import { t as CahierFrame } from "./CahierFrame-BHMoRBMv.mjs";
import { t as Route } from "./cours._family-D7RhBUEp.mjs";
import { n as FAMILY_ORDER, t as EXERCISE_CATALOG } from "./sign-exercise-catalog-B079etHa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cours._family-QZlFPUgr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var familyColors = {
	point: {
		color: "#4A3B2A",
		bg: "#FBF6EC"
	},
	courbe: {
		color: "#C03E3E",
		bg: "#FDEAEA"
	},
	crochet: {
		color: "#2D6BBF",
		bg: "#EAF1FB"
	},
	trait: {
		color: "#4A3B2A",
		bg: "#F5EDE0"
	}
};
function CoursFamilyScreen() {
	const { family } = Route.useParams();
	const navigate = useNavigate();
	const { speak } = useSignSpeech();
	const { t, lang } = useLanguage();
	const animSpeed = useAnimationSpeed();
	const entries = EXERCISE_CATALOG.filter((e) => e.family === family);
	const colors = familyColors[family] || {
		color: "#4A3B2A",
		bg: "#FBF6EC"
	};
	const familyInfo = {
		title: t.coursFamily.titles[family] || family,
		...colors
	};
	const familyIdx = FAMILY_ORDER.indexOf(family);
	const prevFamily = familyIdx > 0 ? FAMILY_ORDER[familyIdx - 1] : null;
	const nextFamily = familyIdx >= 0 && familyIdx < FAMILY_ORDER.length - 1 ? FAMILY_ORDER[familyIdx + 1] : null;
	const [selectedSign, setSelectedSign] = (0, import_react.useState)(entries.length > 0 ? entries[0] : null);
	const startEndMerged = !!selectedSign && selectedSign.startXY[0] === selectedSign.endXY[0] && selectedSign.startXY[1] === selectedSign.endXY[1];
	const [animProgress, setAnimProgress] = (0, import_react.useState)(0);
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(true);
	const [replayKey, setReplayKey] = (0, import_react.useState)(0);
	const [pathLength, setPathLength] = (0, import_react.useState)(1e3);
	const animFrameRef = (0, import_react.useRef)(null);
	const pathRef = (0, import_react.useRef)(null);
	const [penPos, setPenPos] = (0, import_react.useState)({
		x: 100,
		y: 100
	});
	(0, import_react.useEffect)(() => {
		if (pathRef.current) try {
			const len = pathRef.current.getTotalLength();
			if (len && len > 0) setPathLength(len);
		} catch {}
	}, [selectedSign]);
	(0, import_react.useEffect)(() => {
		if (!selectedSign) return;
		speak(selectedSign.consigne[lang]);
		markCoursItemViewed({
			typeEtape: "SIGNE",
			groupCode: family,
			itemCode: selectedSign.id,
			totalItems: entries.length,
			palier: 1
		});
		setIsPlaying(true);
		setAnimProgress(0);
		let start = performance_default.now();
		const duration = scaleDuration(4e3, animSpeed);
		const animate = (now) => {
			const elapsed = now - start;
			if (elapsed >= duration) {
				setAnimProgress(1);
				setIsPlaying(false);
				if (pathRef.current) try {
					const totalLength = pathRef.current.getTotalLength();
					const pt = pathRef.current.getPointAtLength(totalLength);
					setPenPos({
						x: pt.x,
						y: pt.y
					});
				} catch {}
				return;
			}
			const progress = elapsed / duration;
			setAnimProgress(progress);
			if (pathRef.current) try {
				const totalLength = pathRef.current.getTotalLength();
				const pt = pathRef.current.getPointAtLength(progress * totalLength);
				setPenPos({
					x: pt.x,
					y: pt.y
				});
			} catch {
				setPenPos({
					x: selectedSign.startXY[0],
					y: selectedSign.startXY[1]
				});
			}
			animFrameRef.current = requestAnimationFrame(animate);
		};
		animFrameRef.current = requestAnimationFrame(animate);
		return () => {
			if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
		};
	}, [
		selectedSign,
		speak,
		replayKey,
		animSpeed,
		family,
		entries.length
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "flex items-center justify-between px-6 pt-6 pb-4 shrink-0 border-b shadow-sm",
		style: {
			backgroundColor: familyInfo.bg,
			borderColor: `${familyInfo.color}20`
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/accueil",
				"aria-label": t.common.back,
				className: "grid h-11 w-11 place-items-center rounded-full bg-white shadow-md active:scale-95 transition-transform",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
					className: "h-5 w-5 text-gray-700 rtl:rotate-180",
					strokeWidth: 2.5
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-[24px] font-extrabold leading-tight",
				style: { color: familyInfo.color },
				children: familyInfo.title
			}) })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 overflow-y-auto px-4 py-5 space-y-6 bg-background",
		children: [
			selectedSign && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col items-center relative overflow-hidden animate-bloom",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold text-text-primary text-center mt-1 mb-3",
						children: selectedSign.label[lang]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CahierFrame, {
						className: "relative w-[240px] h-[240px] flex items-center justify-center my-2",
						rounded: 16,
						children: [startEndMerged ? isPlaying && animProgress <= .98 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute z-20 w-3 h-3 rounded-full border border-white shadow grid place-items-center animate-start-end-alternate pointer-events-none",
							style: {
								left: `${selectedSign.startXY[0] / 200 * 100}%`,
								top: `${selectedSign.startXY[1] / 200 * 100}%`,
								transform: "translate(-50%, -50%)"
							},
							title: "Point de départ et d'arrivée du tracé",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1 h-1 rounded-full bg-white" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [isPlaying && animProgress <= .9 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute z-20 w-3 h-3 rounded-full bg-[#8FBF6F] border border-white shadow grid place-items-center animate-pulse pointer-events-none",
							style: {
								left: `${selectedSign.startXY[0] / 200 * 100}%`,
								top: `${selectedSign.startXY[1] / 200 * 100}%`,
								transform: "translate(-50%, -50%)"
							},
							title: "Point de départ du tracé",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1 h-1 rounded-full bg-white" })
						}), isPlaying && animProgress <= .98 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute z-20 w-3 h-3 rounded-full bg-[#E05252] border border-white shadow grid place-items-center animate-pulse pointer-events-none",
							style: {
								left: `${selectedSign.endXY[0] / 200 * 100}%`,
								top: `${selectedSign.endXY[1] / 200 * 100}%`,
								transform: "translate(-50%, -50%)"
							},
							title: "Point d'arrivée du tracé",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1 h-1 rounded-full bg-white" })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 200 200",
							className: "w-full h-full",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									ref: pathRef,
									d: selectedSign.pathD,
									stroke: "#9BB5CC",
									strokeWidth: 10,
									strokeLinecap: "round",
									strokeDasharray: "6 8",
									fill: selectedSign.family === "point" ? "#9BB5CC" : "none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: selectedSign.pathD,
									stroke: selectedSign.strokeColor,
									strokeWidth: 9,
									strokeLinecap: "round",
									fill: selectedSign.family === "point" ? selectedSign.strokeColor : "none",
									style: {
										strokeDasharray: pathLength,
										strokeDashoffset: pathLength * (1 - animProgress),
										transition: "none"
									}
								}),
								isPlaying && animProgress <= .98 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: penPos.x,
									cy: penPos.y,
									r: 4.5,
									fill: "#A9784F",
									stroke: "#FFFFFF",
									strokeWidth: 2,
									className: "shadow-sm pointer-events-none"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2.5 w-full max-w-xs mt-4 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-2.5 w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setReplayKey((k) => k + 1),
								className: "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm bg-secondary/15 hover:bg-secondary/25 text-secondary transition-colors active:scale-95 shadow-xs border border-secondary/20",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: cn("h-4 w-4", isPlaying && "animate-spin") }),
									" ",
									t.common.replay
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => speak(selectedSign.consigne[lang]),
								className: "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 text-text-primary transition-colors active:scale-95 shadow-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4 text-secondary" }),
									" ",
									t.common.instruction
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => navigate({
								to: "/exercice-liste",
								search: { family }
							}),
							className: "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-sm bg-secondary hover:bg-secondary/90 text-white transition-all active:scale-95 shadow-md",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 fill-current" }),
								" ",
								t.coursFamily.exercer
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-bold text-text-primary uppercase tracking-wide mb-3 px-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					t.coursFamily.variantsTitle,
					" (",
					entries.length,
					")"
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3.5",
				children: entries.map((item) => {
					const isSelected = selectedSign?.id === item.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setSelectedSign(item),
						className: cn("flex flex-col items-center justify-between p-3.5 rounded-2xl border-2 transition-all duration-200 text-start select-none relative overflow-hidden min-h-[170px]", isSelected ? "border-secondary bg-[#FBF6EC] shadow-lg scale-[1.02]" : "border-gray-200 bg-white hover:border-gray-300 shadow-sm active:scale-98"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full flex items-center justify-end mb-1 z-10 min-h-[20px]",
								children: isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-secondary fill-secondary/20 shrink-0 animate-bounce" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 w-full grid place-items-center my-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-[84px] h-[84px] rounded-full bg-[#F5EDE0] flex items-center justify-center shadow-inner",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignGlyph, {
										family: item.family,
										variant: item.variant,
										stroke: item.strokeColor,
										className: "w-[56px] h-[56px]"
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("w-full text-center text-[13px] font-bold leading-tight mt-2 pt-2 border-t line-clamp-2", isSelected ? "text-secondary border-secondary/20" : "text-gray-800 border-gray-100"),
								children: item.label[lang]
							})
						]
					}, item.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 pt-2 pb-8",
				children: [prevFamily ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => navigate({
						to: "/cours/$family",
						params: { family: prevFamily }
					}),
					className: "flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#4A3B2A]/15 text-[#4A3B2A] font-bold text-[14px] shadow-sm active:scale-95 transition-transform",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4 rtl:rotate-180" }), t.common.back]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), nextFamily ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => navigate({
						to: "/cours/$family",
						params: { family: nextFamily }
					}),
					className: "flex items-center gap-2 px-5 py-3 rounded-full text-white font-bold text-[14px] shadow-md active:scale-95 transition-transform",
					style: { backgroundColor: familyInfo.color },
					children: [t.common.next, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 rtl:rotate-180" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})]
			})
		]
	})] });
}
//#endregion
export { CoursFamilyScreen as component };
