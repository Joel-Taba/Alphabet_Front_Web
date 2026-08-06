import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as useLanguage, r as format } from "./LanguageContext-B_1DF56M.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as awardCompletion } from "./progress-ColVlCyh.mjs";
import { P as ChevronRight, U as ArrowLeft, n as Volume2, v as RotateCcw, w as Lock } from "../_libs/lucide-react.mjs";
import { t as MobileShell } from "./MobileShell-BtqEmkRS.mjs";
import { t as useWritingStyle } from "./useWritingStyle-CKn53fOs.mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AmaniMascot } from "./AmaniMascot-A-Eqgs-C.mjs";
import { a as VOWELS, o as getLetterFormation } from "./letter-style-resolver-CcmIqGzX.mjs";
import { i as lettersForGroup, n as getPalier2GroupMap, r as getPalier2Groups, t as findGroupForChar } from "./palier2-groups-CnA-7rXZ.mjs";
import { n as validateTrace, t as sampleSVGPath } from "./traceValidation-0BWpiBQq.mjs";
import { t as ExerciseCompletePopup } from "./ExerciseCompletePopup-CtcMpMlQ.mjs";
import { a as useSignSpeech } from "./useSignSpeech-DIVrKZjr.mjs";
import { n as useExerciseSettings, t as readEvaluationDurationMinutes } from "./useExerciseSettings-BvMMYb-T.mjs";
import { t as CahierFrame } from "./CahierFrame-BHMoRBMv.mjs";
import { t as RepetitionRow } from "./RepetitionRow-Cq_kMBrq.mjs";
import { n as EvaluationTimerBadge, r as useCountdown, t as EvaluationCompleteOverlay } from "./EvaluationTimer-CR0a5Nwu.mjs";
import { t as Route } from "./exercice.lettre._char-BzXVsP5J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exercice.lettre._char-Bz0x4ngp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Tolérance des lettres : un peu plus souple que les signes (tracés multi-étapes plus complexes). */
var LETTER_TOLERANCE_PX = 27;
function LetterExerciseScreen() {
	const { char } = Route.useParams();
	const { pg, amaniEval } = Route.useSearch();
	const navigate = useNavigate();
	const { speak } = useSignSpeech();
	const { t, lang } = useLanguage();
	const writingStyle = useWritingStyle();
	const letter = getLetterFormation(char, writingStyle);
	const progressionGroup = (pg ? getPalier2GroupMap(lang).get(pg) : void 0) ?? findGroupForChar(char, lang);
	const groupId = progressionGroup?.id ?? "l1";
	const allLetters = progressionGroup ? lettersForGroup(progressionGroup, writingStyle) : VOWELS;
	const currentIdx = allLetters.findIndex((l) => l.char === char);
	const nextLetter = currentIdx < allLetters.length - 1 ? allLetters[currentIdx + 1] : null;
	const isEvaluation = amaniEval === "1";
	const evaluationSeconds = (0, import_react.useMemo)(() => readEvaluationDurationMinutes() * 60, []);
	const [evaluationExpired, setEvaluationExpired] = (0, import_react.useState)(false);
	const remaining = useCountdown(isEvaluation ? evaluationSeconds : 0, () => setEvaluationExpired(true));
	const palier2Groups = getPalier2Groups(lang);
	const groupIdx = progressionGroup ? palier2Groups.findIndex((g) => g.id === progressionGroup.id) : -1;
	const nextGroup = groupIdx >= 0 ? palier2Groups[(groupIdx + 1) % palier2Groups.length] : void 0;
	const evaluationNextLetter = isEvaluation && !nextLetter && nextGroup ? lettersForGroup(nextGroup, writingStyle)[0] : void 0;
	const nextGroupForCours = groupIdx >= 0 && groupIdx < palier2Groups.length - 1 ? palier2Groups[groupIdx + 1] : void 0;
	const nextCoursChar = nextLetter?.char ?? (nextGroupForCours ? lettersForGroup(nextGroupForCours, writingStyle)[0]?.char : void 0);
	const nextCoursPg = nextLetter ? groupId : nextGroupForCours?.id;
	const { repetitions, tolerance } = useExerciseSettings();
	const [doneSteps, setDoneSteps] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [currentStepIdx, setCurrentStepIdx] = (0, import_react.useState)(0);
	const [completedSteps, setCompletedSteps] = (0, import_react.useState)([]);
	const [stepStatus, setStepStatus] = (0, import_react.useState)("idle");
	const [letterSuccess, setLetterSuccess] = (0, import_react.useState)(false);
	const resetAll = (0, import_react.useCallback)(() => {
		setDoneSteps(/* @__PURE__ */ new Set());
		setCurrentStepIdx(0);
		setCompletedSteps([]);
		setStepStatus("idle");
		setLetterSuccess(false);
	}, []);
	(0, import_react.useEffect)(() => {
		resetAll();
		if (letter) speak(format(t.exerciceLettre.speakStart, { name: letter.name[lang] }));
	}, [
		letter,
		repetitions,
		speak,
		lang,
		t,
		resetAll
	]);
	if (!letter) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center flex-1 p-8 gap-4 bg-[#F5EDE0]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-[#4A3B2A] text-[18px] font-bold text-center",
			children: [
				"\"",
				char,
				"\" ",
				t.exerciceLettre.notFound
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/exercice-liste",
			search: { group: "l1" },
			className: "px-6 py-3 rounded-full bg-[#8FBF6F] text-white font-bold text-[15px]",
			children: t.exerciceLettre.backToNotebook
		})]
	}) });
	const allStepsDone = doneSteps.size === letter.steps.length;
	const activeStep = letter.steps[currentStepIdx];
	const handleStepSuccess = (0, import_react.useCallback)((userPoints) => {
		if (!activeStep) return;
		const newCompleted = [...completedSteps, {
			stepIdx: currentStepIdx,
			userPoints,
			strokeColor: activeStep.strokeColor
		}];
		setCompletedSteps(newCompleted);
		if (currentStepIdx + 1 < letter.steps.length) {
			speak(t.exerciceLettre.speakNextStep);
			setTimeout(() => {
				setCurrentStepIdx((idx) => idx + 1);
				setStepStatus("idle");
			}, 600);
		} else {
			speak(format(t.exerciceLettre.speakLetterDone, { name: letter.name[lang] }));
			setLetterSuccess(true);
			awardCompletion({
				typeEtape: "LETTRE",
				modalite: "EXERCICE",
				etapeCode: letter.char,
				palier: 2
			});
		}
	}, [
		activeStep,
		completedSteps,
		currentStepIdx,
		letter,
		speak,
		t,
		lang
	]);
	const handleStepRetry = (0, import_react.useCallback)(() => {
		if (!activeStep) return;
		speak(format(t.exerciceLettre.speakRetryStep, { desc: activeStep.description[lang] }));
	}, [
		activeStep,
		speak,
		t,
		lang
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, { children: [
		isEvaluation && !evaluationExpired && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvaluationTimerBadge, { remaining }),
		isEvaluation && evaluationExpired && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvaluationCompleteOverlay, { onBack: () => navigate({ to: "/accueil" }) }),
		letterSuccess && !isEvaluation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseCompletePopup, {
			onBackHome: () => navigate({ to: "/accueil" }),
			onNext: nextCoursChar ? () => navigate({
				to: "/cours/lettres/formation/$char",
				params: { char: nextCoursChar },
				search: nextCoursPg ? { pg: nextCoursPg } : void 0
			}) : void 0
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between px-6 pt-6 pb-4 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/exercice-liste",
					search: { group: groupId },
					"aria-label": t.exerciceLettre.backToNotebook,
					className: "grid h-11 w-11 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
						className: "h-5 w-5 text-[#4A3B2A]",
						strokeWidth: 2.5
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-[24px] font-bold text-[#4A3B2A] leading-tight",
					children: [
						t.exerciceLettre.title,
						" \"",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#A9784F]",
							children: letter.char
						}),
						"\""
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[13px] text-[#7A6A55] font-normal",
					children: [
						format(t.exerciceLettre.signsReady, {
							done: doneSteps.size,
							total: letter.steps.length
						}),
						" · ",
						letter.name[lang]
					]
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => speak(letter.consigne[lang]),
				"aria-label": t.common.instruction,
				className: "grid h-10 w-10 place-items-center rounded-full bg-[#A9784F] text-white shadow-[0_2px_6px_rgba(74,59,42,0.18)] active:scale-95 transition-transform",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" })
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto px-4 py-5 space-y-5 bg-[#F5EDE0] pb-10 flex flex-col items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm bg-[#FBF6EC] rounded-[20px] p-4 border border-[#4A3B2A]/10 shadow-sm flex items-center gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmaniMascot, {
							pose: letterSuccess ? "celebration" : allStepsDone ? "demonstration" : "encouragement",
							size: "small"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[14px] font-bold text-[#4A3B2A] leading-snug",
							children: letterSuccess ? t.exerciceLettre.successAll : allStepsDone ? t.exerciceLettre.finalTitle : t.exerciceLettre.practiceStepsTitle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12px] text-[#7A6A55] mt-0.5",
							children: letterSuccess ? t.exerciceLettre.successAllSub : allStepsDone ? t.exerciceLettre.finalHint : format(t.exerciceLettre.practiceStepsHint, { reps: repetitions })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full max-w-sm flex flex-col gap-3.5",
					children: letter.steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepetitionRow, {
						entry: {
							id: `${letter.char}-step-${i}`,
							pathD: step.pathD,
							startXY: step.startXY,
							strokeColor: step.strokeColor
						},
						label: step.description[lang],
						badge: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-[#A9784F]/15 text-[#A9784F]",
							children: [
								t.exerciceLettre.stepPrefix,
								" ",
								i + 1
							]
						}),
						repetitions,
						tolerance,
						doneLabel: t.exerciceListe.done,
						onSpeak: () => speak(step.description[lang]),
						onAllDone: () => setDoneSteps((prev) => new Set(prev).add(i))
					}, `${letter.char}-step-${i}`))
				}),
				!allStepsDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-[20px] border border-dashed border-[#4A3B2A]/20 bg-[#FBF6EC]/60 p-6 flex flex-col items-center gap-2 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-6 h-6 text-[#4A3B2A]/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] font-semibold text-[#7A6A55]",
						children: t.exerciceLettre.finalLocked
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "my-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LetterDrawingCanvas, {
						letter,
						currentStepIdx,
						completedSteps,
						stepStatus,
						onStepStatusChange: setStepStatus,
						onSuccess: handleStepSuccess,
						onRetry: handleStepRetry,
						w: 270,
						h: 270
					})
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-3 w-full max-w-sm mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2.5 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: resetAll,
							className: "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-secondary/15 hover:bg-secondary/25 text-secondary transition-colors active:scale-95 border border-secondary/20 shadow-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }),
								" ",
								t.exerciceLettre.resetAll
							]
						})
					})
				})
			]
		}),
		letterSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LetterSuccessOverlay, {
			letter,
			nextLetter,
			groupId,
			isEvaluation,
			evaluationNextLetter,
			evaluationNextGroupId: nextGroup?.id,
			onClose: () => setLetterSuccess(false),
			onReset: resetAll
		})
	] });
}
function LetterDrawingCanvas({ letter, currentStepIdx, completedSteps, stepStatus, onStepStatusChange, onSuccess, onRetry, w, h }) {
	const canvasRef = (0, import_react.useRef)(null);
	const userPointsRef = (0, import_react.useRef)([]);
	const refPointsRef = (0, import_react.useRef)([]);
	const isDrawingRef = (0, import_react.useRef)(false);
	const activeStep = letter.steps[currentStepIdx];
	(0, import_react.useEffect)(() => {
		if (activeStep) refPointsRef.current = sampleSVGPath(activeStep.pathD, 45);
		else refPointsRef.current = [];
	}, [activeStep]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const dpr = window.devicePixelRatio || 1;
		canvas.width = w * dpr;
		canvas.height = h * dpr;
		const ctx = canvas.getContext("2d");
		if (ctx) ctx.scale(dpr, dpr);
	}, [w, h]);
	const drawAll = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, w, h);
		const sc = Math.min(w / 200, h / 200);
		const ox = (w - 200 * sc) / 2;
		const oy = (h - 200 * sc) / 2;
		for (const completed of completedSteps) {
			const stepInfo = letter.steps[completed.stepIdx];
			if (!stepInfo) continue;
			const refPts = sampleSVGPath(stepInfo.pathD, 35);
			if (refPts.length < 2) continue;
			ctx.beginPath();
			ctx.moveTo(refPts[0].x * sc + ox, refPts[0].y * sc + oy);
			for (let i = 1; i < refPts.length; i++) ctx.lineTo(refPts[i].x * sc + ox, refPts[i].y * sc + oy);
			ctx.strokeStyle = completed.strokeColor;
			ctx.lineWidth = 11;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.stroke();
		}
	}, [
		completedSteps,
		h,
		letter.steps,
		w
	]);
	(0, import_react.useEffect)(() => {
		drawAll();
	}, [
		drawAll,
		currentStepIdx,
		stepStatus
	]);
	const canvasCoords = (e) => {
		const r = canvasRef.current.getBoundingClientRect();
		return {
			x: e.clientX - r.left,
			y: e.clientY - r.top
		};
	};
	const svgCoords = (pt) => {
		const sc = Math.min(w / 200, h / 200);
		const ox = (w - 200 * sc) / 2;
		const oy = (h - 200 * sc) / 2;
		return {
			x: (pt.x - ox) / sc,
			y: (pt.y - oy) / sc
		};
	};
	const handlePointerDown = (e) => {
		if (!activeStep || stepStatus === "success" || stepStatus === "retry") return;
		e.preventDefault();
		canvasRef.current?.setPointerCapture(e.pointerId);
		isDrawingRef.current = true;
		onStepStatusChange("drawing");
		userPointsRef.current = [];
		drawAll();
		const ctx = canvasRef.current?.getContext("2d");
		if (!ctx) return;
		const pt = canvasCoords(e);
		userPointsRef.current.push(svgCoords(pt));
		ctx.beginPath();
		ctx.moveTo(pt.x, pt.y);
		ctx.strokeStyle = "#5BAA6A";
		ctx.lineWidth = 11;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
	};
	const handlePointerMove = (e) => {
		if (!isDrawingRef.current) return;
		e.preventDefault();
		const ctx = canvasRef.current?.getContext("2d");
		if (!ctx) return;
		const pt = canvasCoords(e);
		userPointsRef.current.push(svgCoords(pt));
		ctx.lineTo(pt.x, pt.y);
		ctx.stroke();
	};
	const handlePointerUp = (e) => {
		if (!isDrawingRef.current) return;
		isDrawingRef.current = false;
		if (canvasRef.current?.hasPointerCapture(e.pointerId)) canvasRef.current.releasePointerCapture(e.pointerId);
		if (validateTrace(userPointsRef.current, refPointsRef.current, LETTER_TOLERANCE_PX).valid) {
			onStepStatusChange("success");
			onSuccess([...userPointsRef.current]);
		} else {
			onStepStatusChange("retry");
			onRetry();
			setTimeout(() => {
				drawAll();
				onStepStatusChange("idle");
			}, 1200);
		}
	};
	const sc = Math.min(w / 200, h / 200);
	const ox = (w - 200 * sc) / 2;
	const oy = (h - 200 * sc) / 2;
	const startPx = activeStep ? {
		x: activeStep.startXY[0] * sc + ox,
		y: activeStep.startXY[1] * sc + oy
	} : {
		x: 0,
		y: 0
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CahierFrame, {
		className: "relative shrink-0 border-2 shadow-inner transition-all duration-300",
		rounded: 16,
		style: {
			width: w,
			height: h,
			borderColor: stepStatus === "success" ? "#8FBF6F" : stepStatus === "retry" ? "#E05252" : "#A9784F40"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 200 200",
				className: "absolute inset-0 w-full h-full pointer-events-none",
				children: letter.steps.map((step, idx) => {
					if (completedSteps.some((c) => c.stepIdx === idx)) return null;
					const isActiveStep = idx === currentStepIdx;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: step.pathD,
						stroke: isActiveStep ? stepStatus === "retry" ? "#E05252" : "#9BB5CC" : "#B8CCE0",
						strokeWidth: isActiveStep ? 13 : 11,
						strokeLinecap: "round",
						strokeDasharray: isActiveStep ? "8 6" : "5 7",
						fill: "none",
						opacity: isActiveStep ? .85 : .35
					}, `guide-${idx}`);
				})
			}),
			(stepStatus === "idle" || stepStatus === "retry") && activeStep && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute w-4 h-4 rounded-full bg-[#5BAA6A] border-2 border-white shadow grid place-items-center z-10 animate-pulse pointer-events-none",
				style: {
					left: startPx.x - 8,
					top: startPx.y - 8
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1.5 h-1.5 rounded-full bg-white" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				onPointerDown: handlePointerDown,
				onPointerMove: handlePointerMove,
				onPointerUp: handlePointerUp,
				onPointerLeave: handlePointerUp,
				className: cn("absolute inset-0 w-full h-full touch-none z-20", stepStatus === "success" ? "cursor-default" : "cursor-crosshair")
			})
		]
	});
}
function LetterSuccessOverlay({ letter, nextLetter, groupId, isEvaluation, evaluationNextLetter, evaluationNextGroupId, onClose, onReset }) {
	const navigate = useNavigate();
	const { t } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex items-center justify-center px-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200",
		role: "dialog",
		"aria-live": "polite",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4 w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmaniMascot, {
					pose: "celebration",
					size: "medium",
					priority: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[24px] font-extrabold text-[#4A3B2A]",
					children: t.exerciceLettre.successTitle
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[14px] text-[#7A6A55] mt-1",
					children: [
						t.exerciceLettre.successBody,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
							"\"",
							letter.char,
							"\""
						] }),
						" !"
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-20 h-20 rounded-2xl bg-[#FBF6EC] border-2 border-[#8FBF6F] flex items-center justify-center text-[44px] font-extrabold text-[#8FBF6F] shadow-sm my-1",
					children: letter.char
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2.5 w-full mt-2",
					children: [
						nextLetter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => navigate({
								to: "/exercice/lettre/$char",
								params: { char: nextLetter.char },
								search: {
									pg: groupId,
									amaniEval: isEvaluation ? "1" : void 0
								}
							}),
							className: "w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-[#8FBF6F] hover:bg-[#7AAE5A] text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								t.exerciceLettre.nextLetter,
								" (",
								nextLetter.char,
								")"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 stroke-[3]" })]
						}),
						!nextLetter && isEvaluation && evaluationNextLetter && evaluationNextGroupId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => navigate({
								to: "/exercice/lettre/$char",
								params: { char: evaluationNextLetter.char },
								search: {
									pg: evaluationNextGroupId,
									amaniEval: "1"
								}
							}),
							className: "w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-[#8FBF6F] hover:bg-[#7AAE5A] text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								t.exerciceLettre.nextLetter,
								" (",
								evaluationNextLetter.char,
								")"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 stroke-[3]" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onReset,
							className: "w-full py-3 px-4 rounded-xl font-bold text-sm bg-[#A9784F]/15 text-[#A9784F] hover:bg-[#A9784F]/25 active:scale-95 transition-all",
							children: t.exerciceLettre.practiceAgain
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/exercice-liste",
							search: { group: groupId },
							className: "w-full py-2.5 px-4 rounded-xl font-medium text-xs text-[#7A6A55] hover:text-[#4A3B2A] transition-colors",
							children: t.exerciceLettre.backToNotebookLink
						})
					]
				})
			]
		})
	});
}
//#endregion
export { LetterExerciseScreen as component };
