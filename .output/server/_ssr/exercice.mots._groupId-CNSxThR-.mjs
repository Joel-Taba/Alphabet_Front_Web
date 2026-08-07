import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as useLanguage, r as format } from "./LanguageContext-IeRxb9no.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as awardRestartBonus, t as awardCompletion } from "./progress-DCH5vN8F.mjs";
import { P as ChevronRight, U as ArrowLeft, n as Volume2 } from "../_libs/lucide-react.mjs";
import { t as MobileShell } from "./MobileShell-L36W1Wth.mjs";
import { t as useWritingStyle } from "./useWritingStyle-CKn53fOs.mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AmaniMascot } from "./AmaniMascot-A-Eqgs-C.mjs";
import { a as lettersForWord, n as PALIER3_GROUPS, r as PALIER3_GROUP_MAP, s as wordText } from "./word-catalog-C-fKc0oN.mjs";
import { t as LetterTraceCell } from "./LetterTraceCell-D2weATol.mjs";
import { t as ExerciseCompletePopup } from "./ExerciseCompletePopup-Df5hR0N2.mjs";
import { a as useSignSpeech } from "./useSignSpeech-MSIU-G__.mjs";
import { t as readEvaluationDurationMinutes } from "./useExerciseSettings-BvMMYb-T.mjs";
import { n as EvaluationTimerBadge, r as useCountdown, t as EvaluationCompleteOverlay } from "./EvaluationTimer-B39sOdIf.mjs";
import { t as Route } from "./exercice.mots._groupId-BbAVC6q5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exercice.mots._groupId-CNSxThR-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WordExerciseScreen() {
	const { groupId } = Route.useParams();
	const { amaniEval } = Route.useSearch();
	const navigate = useNavigate();
	const { speak } = useSignSpeech();
	const { t, lang } = useLanguage();
	const writingStyle = useWritingStyle();
	const group = PALIER3_GROUP_MAP.get(groupId);
	const groupIdx = PALIER3_GROUPS.findIndex((g) => g.id === groupId);
	const nextGroup = groupIdx >= 0 && groupIdx < PALIER3_GROUPS.length - 1 ? PALIER3_GROUPS[groupIdx + 1] : null;
	const isEvaluation = amaniEval === "1";
	const evaluationNextGroup = isEvaluation && groupIdx >= 0 ? PALIER3_GROUPS[(groupIdx + 1) % PALIER3_GROUPS.length] : null;
	const evaluationSeconds = (0, import_react.useMemo)(() => readEvaluationDurationMinutes() * 60, []);
	const [evaluationExpired, setEvaluationExpired] = (0, import_react.useState)(false);
	const remaining = useCountdown(isEvaluation ? evaluationSeconds : 0, () => setEvaluationExpired(true));
	const [doneWords, setDoneWords] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [restartKey, setRestartKey] = (0, import_react.useState)(0);
	const [awaitingRepeatCompletion, setAwaitingRepeatCompletion] = (0, import_react.useState)(false);
	const allDone = !!group && doneWords.size === group.words.length;
	(0, import_react.useEffect)(() => {
		if (allDone && awaitingRepeatCompletion) {
			awardRestartBonus();
			setAwaitingRepeatCompletion(false);
		}
	}, [allDone, awaitingRepeatCompletion]);
	if (!group) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center flex-1 p-8 gap-4 bg-[#F5EDE0]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-[#4A3B2A] text-[18px] font-bold text-center",
			children: [
				"\"",
				groupId,
				"\" ",
				t.coursMots.notFound
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/accueil",
			className: "px-6 py-3 rounded-full bg-[#8FBF6F] text-white font-bold text-[15px]",
			children: t.coursMots.backToList
		})]
	}) });
	const groupTitle = group.title[lang];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, { children: [
		isEvaluation && !evaluationExpired && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvaluationTimerBadge, { remaining }),
		isEvaluation && evaluationExpired && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvaluationCompleteOverlay, { onBack: () => navigate({ to: "/accueil" }) }),
		allDone && !isEvaluation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseCompletePopup, {
			onBackHome: () => navigate({ to: "/accueil" }),
			onNext: nextGroup ? () => navigate({
				to: "/cours/mots/$groupId",
				params: { groupId: nextGroup.id }
			}) : void 0,
			onRestart: () => {
				setDoneWords(/* @__PURE__ */ new Set());
				setRestartKey((k) => k + 1);
				setAwaitingRepeatCompletion(true);
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "flex items-center justify-between px-6 pt-6 pb-4 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/cours/mots/$groupId",
					params: { groupId: group.id },
					"aria-label": t.common.back,
					className: "grid h-11 w-11 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
						className: "h-5 w-5 text-[#4A3B2A]",
						strokeWidth: 2.5
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[22px] font-bold text-[#4A3B2A] leading-tight",
					children: groupTitle
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-[#7A6A55] font-normal",
					children: format(t.exerciceMots.wordsReady, {
						done: doneWords.size,
						total: group.words.length
					})
				})] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-[#F5EDE0] pb-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#FBF6EC] rounded-[20px] p-4 border border-[#4A3B2A]/10 shadow-sm flex items-center gap-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmaniMascot, {
						pose: allDone ? "celebration" : "encouragement",
						size: "small"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[14px] font-bold text-[#4A3B2A] leading-snug",
							children: allDone ? t.exerciceMots.allDoneTitle : t.exerciceMots.introTitle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12px] text-[#7A6A55] mt-0.5",
							children: allDone ? t.exerciceMots.allDoneBody : t.exerciceMots.introBody
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-3.5",
					children: group.words.map((word) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WordTraceRow, {
						word,
						lang,
						speak,
						done: doneWords.has(word.id),
						onDone: () => {
							setDoneWords((prev) => new Set(prev).add(word.id));
							awardCompletion({
								typeEtape: "MOT",
								modalite: "EXERCICE",
								etapeCode: word.id,
								palier: lang === "fr" ? 4 : 3
							});
						},
						doneLabel: t.exerciceListe.done,
						style: writingStyle
					}, `${word.id}-r${restartKey}`))
				}),
				allDone && isEvaluation && evaluationNextGroup && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => navigate({
						to: "/exercice/mots/$groupId",
						params: { groupId: evaluationNextGroup.id },
						search: { amaniEval: "1" }
					}),
					className: "w-full py-4 rounded-2xl bg-[#4A90E2] hover:bg-[#3A7BC8] text-white font-extrabold text-lg shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.99]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: format(t.exerciceMots.nextGroup, { titre: evaluationNextGroup.title[lang] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5" })]
				})
			]
		})
	] });
}
function WordTraceRow({ word, lang, speak, done, onDone, doneLabel, style }) {
	const letters = lettersForWord(word, lang, style);
	const text = wordText(word, lang);
	const [solvedIdx, setSolvedIdx] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const handleLetterSolved = (0, import_react.useCallback)((idx) => {
		setSolvedIdx((prev) => {
			const next = new Set(prev).add(idx);
			if (next.size === letters.length) onDone();
			return next;
		});
	}, [letters.length, onDone]);
	const activeIdx = (() => {
		for (let i = 0; i < letters.length; i++) if (!solvedIdx.has(i)) return i;
		return -1;
	})();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col rounded-[20px] overflow-hidden border transition-all bg-white", done ? "border-[#8FBF6F]/60 shadow-[0_4px_16px_rgba(143,191,111,0.18)]" : "border-[#4A3B2A]/10 shadow-[0_2px_8px_rgba(74,59,42,0.08)]"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-4 py-2.5 bg-[#FBF6EC] border-b border-[#4A3B2A]/10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[14px] font-bold text-[#4A3B2A] capitalize",
				children: text
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[13px] text-[#8FBF6F] font-bold",
					children: ["✓ ", doneLabel]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => speak(text),
					"aria-label": text,
					className: "w-8 h-8 grid place-items-center rounded-full bg-[#4A90E2]/15 text-[#2D6BBF] hover:bg-[#4A90E2] hover:text-white transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-4 h-4" })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-2 px-3 py-3 overflow-x-auto",
			children: letters.map((letter, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LetterTraceCell, {
				letter,
				size: 64,
				isActive: i === activeIdx,
				onSolved: () => handleLetterSolved(i)
			}, `${word.id}-${i}`))
		})]
	});
}
//#endregion
export { WordExerciseScreen as component };
