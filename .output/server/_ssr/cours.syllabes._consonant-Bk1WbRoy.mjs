import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as useLanguage, r as format } from "./LanguageContext-B_1DF56M.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as markCoursItemViewed } from "./progress-ColVlCyh.mjs";
import { F as ChevronLeft, P as ChevronRight, U as ArrowLeft, n as Volume2, v as RotateCcw, y as Play } from "../_libs/lucide-react.mjs";
import { t as MobileShell } from "./MobileShell-BtqEmkRS.mjs";
import { t as useWritingStyle } from "./useWritingStyle-CKn53fOs.mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as getLetterFormation } from "./letter-style-resolver-CcmIqGzX.mjs";
import { n as findSyllableGroupForConsonant, r as lettersForExampleWord, t as SYLLABLE_GROUPS } from "./syllable-catalog-BQgLw3Pq.mjs";
import { t as LetterTraceCell } from "./LetterTraceCell-D2weATol.mjs";
import { a as useSignSpeech } from "./useSignSpeech-DIVrKZjr.mjs";
import { t as CahierFrame } from "./CahierFrame-BHMoRBMv.mjs";
import { t as Route } from "./cours.syllabes._consonant-C1NeyIaK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cours.syllabes._consonant-Bk1WbRoy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SyllableLessonScreen() {
	const { consonant } = Route.useParams();
	const navigate = useNavigate();
	const { speak } = useSignSpeech();
	const { t, lang } = useLanguage();
	const writingStyle = useWritingStyle();
	const group = findSyllableGroupForConsonant(consonant);
	const [syllableIdx, setSyllableIdx] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		setSyllableIdx(0);
	}, [consonant]);
	const groupIdx = SYLLABLE_GROUPS.findIndex((g) => g.consonant === consonant);
	const nextConsonantGroup = groupIdx >= 0 && groupIdx < SYLLABLE_GROUPS.length - 1 ? SYLLABLE_GROUPS[groupIdx + 1] : null;
	if (!group) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center flex-1 p-8 gap-4 bg-[#F5EDE0]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-[#4A3B2A] text-[18px] font-bold text-center",
			children: [
				"\"",
				consonant,
				"\" ",
				t.coursSyllabes.notFound
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/accueil",
			className: "px-6 py-3 rounded-full bg-[#8FBF6F] text-white font-bold text-[15px]",
			children: t.coursSyllabes.backToList
		})]
	}) });
	const current = group.syllables[syllableIdx];
	const consonantLetter = getLetterFormation(consonant, writingStyle);
	const vowelLetter = getLetterFormation(current.vowel, writingStyle);
	const goToSyllable = (idx) => setSyllableIdx(idx);
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
				children: format(t.coursSyllabes.consonantTitle, { consonant: `"${consonant}"` })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13px] text-[#7A6A55] font-normal",
				children: format(t.coursSyllabes.syllableCount, { count: group.syllables.length })
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => speak(format(t.coursSyllabes.speakFormation, {
				consonant,
				vowel: current.vowel,
				syllable: current.syllable
			})),
			"aria-label": t.common.instruction,
			className: "grid h-10 w-10 place-items-center rounded-full bg-[#A9784F] text-white shadow-[0_2px_6px_rgba(74,59,42,0.18)] active:scale-95 transition-transform",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" })
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 overflow-y-auto px-4 py-5 space-y-6 bg-[#F5EDE0] pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SyllableCard, {
				consonantChar: consonant,
				consonantLetter,
				vowelLetter,
				entry: current,
				totalSyllables: group.syllables.length,
				speak,
				t,
				lang,
				onPractice: () => navigate({
					to: "/exercice/syllabes/$consonant",
					params: { consonant }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-5 gap-3",
				children: group.syllables.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => goToSyllable(i),
					className: cn("flex flex-col items-center justify-center rounded-[16px] border aspect-square transition-all duration-200", i === syllableIdx ? "bg-[#A9784F] border-[#A9784F] text-white shadow-lg scale-[1.05]" : "bg-[#FBF6EC] border-[#4A3B2A]/10 text-[#4A3B2A] shadow-sm hover:border-[#A9784F]/40 hover:scale-[1.04] active:scale-[0.96]"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[22px] font-bold leading-none",
						children: s.syllable
					})
				}, s.syllable))
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 pt-2 pb-6",
				children: [syllableIdx > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => goToSyllable(syllableIdx - 1),
					className: "flex items-center gap-2 px-5 py-3 rounded-full bg-[#FBF6EC] border border-[#4A3B2A]/10 text-[#4A3B2A] font-bold text-[14px] shadow-sm active:scale-95 transition-transform",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" }),
						"\"",
						group.syllables[syllableIdx - 1].syllable,
						"\""
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), syllableIdx < group.syllables.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => goToSyllable(syllableIdx + 1),
					className: "flex items-center gap-2 px-5 py-3 rounded-full bg-[#A9784F] text-white font-bold text-[14px] shadow-md active:scale-95 transition-transform",
					children: [
						"\"",
						group.syllables[syllableIdx + 1].syllable,
						"\"",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
					]
				}) : nextConsonantGroup ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => navigate({
						to: "/cours/syllabes/$consonant",
						params: { consonant: nextConsonantGroup.consonant }
					}),
					className: "flex items-center gap-2 px-5 py-3 rounded-full bg-[#A9784F] text-white font-bold text-[14px] shadow-md active:scale-95 transition-transform",
					children: [format(t.coursSyllabes.nextConsonant, { consonant: nextConsonantGroup.consonant }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})]
			})
		]
	})] });
}
function SyllableCard({ consonantChar, consonantLetter, vowelLetter, entry, totalSyllables, speak, t, lang, onPractice }) {
	const [replayKey, setReplayKey] = (0, import_react.useState)(0);
	const exampleLetters = lettersForExampleWord(entry, useWritingStyle());
	(0, import_react.useEffect)(() => {
		speak(format(t.coursSyllabes.speakFormation, {
			consonant: consonantChar,
			vowel: entry.vowel,
			syllable: entry.syllable
		}));
		markCoursItemViewed({
			typeEtape: "SYLLABE",
			groupCode: consonantChar,
			itemCode: entry.syllable,
			totalItems: totalSyllables,
			palier: 3
		});
	}, [entry.syllable, lang]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col items-center relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-3 w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniLetterFrame, {
						letter: consonantLetter,
						playKey: replayKey,
						delayMs: 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[28px] font-extrabold text-[#4A3B2A]",
						children: "+"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniLetterFrame, {
						letter: vowelLetter,
						playKey: replayKey,
						delayMs: 650
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[28px] font-extrabold text-[#4A3B2A]",
						children: "="
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[38px] font-extrabold text-[#A9784F] leading-none",
						children: entry.syllable
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full mt-6 pt-5 border-t border-[#4A3B2A]/10 flex flex-col items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] font-bold text-[#7A6A55] uppercase tracking-wide",
						children: format(t.coursSyllabes.exampleWordLabel, { syllable: entry.syllable })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1.5",
						children: exampleLetters.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LetterTraceCell, {
							letter: l,
							size: 40,
							isActive: false,
							given: true
						}, `${entry.exampleWord}-${i}`))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => speak(entry.exampleWord),
						className: "flex items-center gap-2 px-4 py-2 rounded-full bg-[#4A90E2]/15 text-[#2D6BBF] font-bold text-[13px] active:scale-95 transition-transform",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-3.5 w-3.5" }),
							" ",
							entry.exampleWord
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2.5 w-full max-w-xs mt-6 mb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-center gap-2.5 w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setReplayKey((k) => k + 1),
						className: "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm bg-secondary/15 hover:bg-secondary/25 text-secondary transition-colors active:scale-95 shadow-xs border border-secondary/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }),
							" ",
							t.common.replay
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => speak(format(t.coursSyllabes.speakFormation, {
							consonant: consonantChar,
							vowel: entry.vowel,
							syllable: entry.syllable
						})),
						className: "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 text-text-primary transition-colors active:scale-95 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4 text-secondary" }),
							" ",
							t.common.instruction
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onPractice,
					className: "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-sm bg-secondary hover:bg-secondary/90 text-white transition-all active:scale-95 shadow-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 fill-current" }),
						" ",
						t.coursSyllabes.practice
					]
				})]
			})
		]
	});
}
function MiniLetterFrame({ letter, playKey, delayMs }) {
	if (!letter) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CahierFrame, {
		className: "w-[76px] h-[76px] shrink-0",
		rounded: 12
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CahierFrame, {
		className: "w-[76px] h-[76px] shrink-0 flex items-center justify-center",
		rounded: 12,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 200 200",
			className: "w-full h-full",
			children: letter.steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedStroke, {
				pathD: step.pathD,
				color: step.strokeColor,
				delayMs: delayMs + i * 260
			}, `${letter.char}-${i}-${playKey}`))
		})
	});
}
function AnimatedStroke({ pathD, color, delayMs }) {
	const ref = (0, import_react.useRef)(null);
	const [len, setLen] = (0, import_react.useState)(null);
	const [drawn, setDrawn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setDrawn(false);
		const el = ref.current;
		if (!el) return;
		let measured = 500;
		try {
			measured = el.getTotalLength();
		} catch {}
		setLen(measured);
		const timer = setTimeout(() => setDrawn(true), 30 + delayMs);
		return () => clearTimeout(timer);
	}, [pathD, delayMs]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		ref,
		d: pathD,
		stroke: color,
		strokeWidth: 14,
		strokeLinecap: "round",
		fill: "none",
		style: {
			strokeDasharray: len ?? 500,
			strokeDashoffset: drawn ? 0 : len ?? 500,
			transition: "stroke-dashoffset 0.5s ease"
		}
	});
}
//#endregion
export { SyllableLessonScreen as component };
