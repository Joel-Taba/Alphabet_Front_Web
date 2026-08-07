import { n as __toESM } from "../_runtime.mjs";
import { s as performance_default } from "../_libs/h3+rou3+srvx+unenv.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as useLanguage, r as format } from "./LanguageContext-IeRxb9no.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { r as markCoursItemViewed } from "./progress-DCH5vN8F.mjs";
import { F as ChevronLeft, P as ChevronRight, U as ArrowLeft, n as Volume2, v as RotateCcw, y as Play } from "../_libs/lucide-react.mjs";
import { t as MobileShell } from "./MobileShell-L36W1Wth.mjs";
import { t as useWritingStyle } from "./useWritingStyle-CKn53fOs.mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as getLetterFormation, r as LETTER_GROUPS } from "./letter-style-resolver-CcmIqGzX.mjs";
import { i as lettersForGroup, n as getPalier2GroupMap } from "./palier2-groups-CnA-7rXZ.mjs";
import { a as useSignSpeech } from "./useSignSpeech-MSIU-G__.mjs";
import { n as useAnimationSpeed, t as scaleDuration } from "./useAnimationSpeed-8KgMYO7Q.mjs";
import { t as CahierFrame } from "./CahierFrame-BHMoRBMv.mjs";
import { t as Route } from "./cours.lettres.formation._char-DbEQPu9z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cours.lettres.formation._char-CfSQg7aw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LetterFormationScreen() {
	const { char } = Route.useParams();
	const { pg } = Route.useSearch();
	const navigate = useNavigate();
	const { speak } = useSignSpeech();
	const { t, lang } = useLanguage();
	const letter = getLetterFormation(char, useWritingStyle());
	const progressionGroup = pg ? getPalier2GroupMap(lang).get(pg) : void 0;
	const ownGroup = !progressionGroup ? LETTER_GROUPS.find((g) => g.letters.some((l) => l.char === char)) : void 0;
	const allLetters = progressionGroup ? lettersForGroup(progressionGroup) : ownGroup?.letters ?? [];
	const groupCode = progressionGroup?.id ?? `own-${ownGroup?.letters[0]?.char ?? char}`;
	const groupTitle = progressionGroup?.title[lang] ?? ownGroup?.title[lang] ?? t.coursFormationChar.vowelsTitle;
	const currentIdx = allLetters.findIndex((l) => l.char === char);
	const prevLetter = currentIdx > 0 ? allLetters[currentIdx - 1] : null;
	const nextLetter = currentIdx < allLetters.length - 1 ? allLetters[currentIdx + 1] : null;
	if (!letter) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center flex-1 p-8 gap-4 bg-[#F5EDE0]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-[#4A3B2A] text-[18px] font-bold text-center",
			children: [
				"\"",
				char,
				"\" ",
				t.coursFormationChar.notFound
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/accueil",
			className: "px-6 py-3 rounded-full bg-[#8FBF6F] text-white font-bold text-[15px]",
			children: t.coursFormationChar.backToList
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
					className: "h-5 w-5 text-[#4A3B2A]",
					strokeWidth: 2.5
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-[26px] font-bold text-[#4A3B2A] leading-tight",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[#A9784F]",
					children: [
						"\"",
						letter.char,
						"\""
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[13px] text-[#7A6A55] font-normal",
				children: [
					format(t.coursFormation.signeCount, { count: letter.steps.length }),
					" · ",
					letter.name[lang]
				]
			})] })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 overflow-y-auto px-4 py-5 space-y-6 bg-[#F5EDE0] pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LetterAnimationCanvas, {
				letter,
				speak,
				navigate,
				t,
				lang,
				pg,
				groupCode,
				totalItems: allLetters.length
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-[14px] font-bold text-[#4A3B2A] uppercase tracking-wide mb-3 px-1",
				children: groupTitle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-5 gap-3",
				children: allLetters.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => navigate({
						to: "/cours/lettres/formation/$char",
						params: { char: l.char },
						search: pg ? { pg } : void 0
					}),
					className: cn("flex flex-col items-center justify-center rounded-[16px] border aspect-square transition-all duration-200", l.char === char ? "bg-[#A9784F] border-[#A9784F] text-white shadow-lg scale-[1.05]" : "bg-[#FBF6EC] border-[#4A3B2A]/10 text-[#4A3B2A] shadow-sm hover:border-[#A9784F]/40 hover:scale-[1.04] active:scale-[0.96]"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[28px] font-bold leading-none",
						children: l.char
					})
				}, l.char))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 pt-2 pb-6",
				children: [prevLetter ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => navigate({
						to: "/cours/lettres/formation/$char",
						params: { char: prevLetter.char },
						search: pg ? { pg } : void 0
					}),
					className: "flex items-center gap-2 px-5 py-3 rounded-full bg-[#FBF6EC] border border-[#4A3B2A]/10 text-[#4A3B2A] font-bold text-[14px] shadow-sm active:scale-95 transition-transform",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" }), t.common.previous]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), nextLetter ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => navigate({
						to: "/cours/lettres/formation/$char",
						params: { char: nextLetter.char },
						search: pg ? { pg } : void 0
					}),
					className: "flex items-center gap-2 px-5 py-3 rounded-full bg-[#A9784F] text-white font-bold text-[14px] shadow-md active:scale-95 transition-transform",
					children: [t.common.next, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})]
			})
		]
	})] });
}
function LetterAnimationCanvas({ letter, speak, navigate, t, lang, pg, groupCode, totalItems }) {
	const [replayKey, setReplayKey] = (0, import_react.useState)(0);
	const animSpeed = useAnimationSpeed();
	const [currentStepIdx, setCurrentStepIdx] = (0, import_react.useState)(0);
	const [stepProgress, setStepProgress] = (0, import_react.useState)(0);
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(true);
	const [isFinished, setIsFinished] = (0, import_react.useState)(false);
	const pathRefs = (0, import_react.useRef)([]);
	const [pathLengths, setPathLengths] = (0, import_react.useState)([]);
	const [penPos, setPenPos] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const animRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const lengths = pathRefs.current.map((ref) => {
			if (ref) try {
				return ref.getTotalLength();
			} catch {
				return 500;
			}
			return 500;
		});
		setPathLengths(lengths);
	}, [letter, replayKey]);
	(0, import_react.useEffect)(() => {
		setCurrentStepIdx(0);
		setStepProgress(0);
		setIsPlaying(true);
		setIsFinished(false);
		speak(letter.consigne[lang]);
		const STEP_DURATION = scaleDuration(2e3, animSpeed);
		const PAUSE_DURATION = scaleDuration(400, animSpeed);
		const totalSteps = letter.steps.length;
		let stepStart = performance_default.now();
		let activeStep = 0;
		let isPaused = false;
		let pauseStart = 0;
		const animate = (now) => {
			if (isPaused) {
				if (now - pauseStart >= PAUSE_DURATION) {
					isPaused = false;
					activeStep++;
					if (activeStep >= totalSteps) {
						setCurrentStepIdx(totalSteps - 1);
						setStepProgress(1);
						setIsPlaying(false);
						setIsFinished(true);
						markCoursItemViewed({
							typeEtape: "LETTRE",
							groupCode,
							itemCode: letter.char,
							totalItems,
							palier: 2
						});
						return;
					}
					setCurrentStepIdx(activeStep);
					setStepProgress(0);
					stepStart = now;
				}
				animRef.current = requestAnimationFrame(animate);
				return;
			}
			const elapsed = now - stepStart;
			const progress = Math.min(elapsed / STEP_DURATION, 1);
			setStepProgress(progress);
			setCurrentStepIdx(activeStep);
			const pathEl = pathRefs.current[activeStep];
			if (pathEl) try {
				const totalLen = pathEl.getTotalLength();
				const pt = pathEl.getPointAtLength(progress * totalLen);
				setPenPos({
					x: pt.x,
					y: pt.y
				});
			} catch {
				const step = letter.steps[activeStep];
				if (step) setPenPos({
					x: step.startXY[0],
					y: step.startXY[1]
				});
			}
			if (progress >= 1) if (activeStep < totalSteps - 1) {
				isPaused = true;
				pauseStart = now;
			} else {
				setIsPlaying(false);
				setIsFinished(true);
				markCoursItemViewed({
					typeEtape: "LETTRE",
					groupCode,
					itemCode: letter.char,
					totalItems,
					palier: 2
				});
				return;
			}
			animRef.current = requestAnimationFrame(animate);
		};
		const firstStep = letter.steps[0];
		if (firstStep) setPenPos({
			x: firstStep.startXY[0],
			y: firstStep.startXY[1]
		});
		animRef.current = requestAnimationFrame(animate);
		return () => {
			if (animRef.current) cancelAnimationFrame(animRef.current);
		};
	}, [
		letter,
		speak,
		replayKey,
		lang,
		animSpeed,
		groupCode,
		totalItems
	]);
	const handleReplay = (0, import_react.useCallback)(() => {
		setReplayKey((k) => k + 1);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col items-center relative overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CahierFrame, {
			className: "relative w-[260px] h-[260px] flex items-center justify-center my-2",
			rounded: 16,
			children: [
				isPlaying && !isFinished && stepProgress <= .9 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute z-20 w-3 h-3 rounded-full bg-[#8FBF6F] border border-white shadow grid place-items-center animate-pulse pointer-events-none",
					style: {
						left: `${letter.steps[currentStepIdx].startXY[0] / 200 * 100}%`,
						top: `${letter.steps[currentStepIdx].startXY[1] / 200 * 100}%`,
						transform: "translate(-50%, -50%)"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1 h-1 rounded-full bg-white" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 200 200",
					className: "w-full h-full",
					children: [letter.steps.map((step, i) => {
						const isActive = i === currentStepIdx;
						const isDone = i < currentStepIdx || isFinished;
						const isFuture = i > currentStepIdx && !isFinished;
						const len = pathLengths[i] || 500;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							ref: (el) => {
								pathRefs.current[i] = el;
							},
							d: step.pathD,
							stroke: "#9BB5CC",
							strokeWidth: 14,
							strokeLinecap: "round",
							strokeDasharray: isFuture ? "6 8" : "none",
							fill: "none",
							opacity: isFuture ? .4 : 0
						}), (isDone || isActive) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: step.pathD,
							stroke: step.strokeColor,
							strokeWidth: 12,
							strokeLinecap: "round",
							fill: "none",
							style: {
								strokeDasharray: len,
								strokeDashoffset: isDone ? 0 : len * (1 - stepProgress),
								transition: "none"
							}
						})] }, `step-${i}-${replayKey}`);
					}), isPlaying && !isFinished && stepProgress <= .98 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: penPos.x,
						cy: penPos.y,
						r: 4.5,
						fill: "#A9784F",
						stroke: "#FFFFFF",
						strokeWidth: 2,
						className: "pointer-events-none"
					})]
				}),
				isPlaying && !isFinished && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-white/90 border border-[#4A3B2A]/15 shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] font-bold text-[#4A3B2A]",
						children: [
							t.exerciceLettre.stepPrefix,
							" ",
							currentStepIdx + 1,
							"/",
							letter.steps.length
						]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2.5 w-full max-w-xs mt-4 mb-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-2.5 w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleReplay,
					className: "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm bg-secondary/15 hover:bg-secondary/25 text-secondary transition-colors active:scale-95 shadow-xs border border-secondary/20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: cn("h-4 w-4", isPlaying && "animate-spin") }),
						" ",
						t.common.replay
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => speak(letter.consigne[lang]),
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
					to: "/exercice/lettre/$char",
					params: { char: letter.char },
					search: pg ? { pg } : void 0
				}),
				className: "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-sm bg-secondary hover:bg-secondary/90 text-white transition-all active:scale-95 shadow-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 fill-current" }),
					" ",
					t.coursFormationChar.practice,
					" \"",
					letter.char,
					"\""
				]
			})]
		})]
	});
}
//#endregion
export { LetterFormationScreen as component };
