import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as useLanguage, r as format } from "./LanguageContext-IeRxb9no.mjs";
import { n as awardRestartBonus, t as awardCompletion } from "./progress-DCH5vN8F.mjs";
import { P as ChevronRight, U as ArrowLeft } from "../_libs/lucide-react.mjs";
import { t as MobileShell } from "./MobileShell-L36W1Wth.mjs";
import { t as useWritingStyle } from "./useWritingStyle-CKn53fOs.mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AmaniMascot } from "./AmaniMascot-A-Eqgs-C.mjs";
import { i as lettersForGroup, n as getPalier2GroupMap } from "./palier2-groups-CnA-7rXZ.mjs";
import { t as ExerciseCompletePopup } from "./ExerciseCompletePopup-Df5hR0N2.mjs";
import { a as useSignSpeech } from "./useSignSpeech-MSIU-G__.mjs";
import { n as useExerciseSettings, t as readEvaluationDurationMinutes } from "./useExerciseSettings-BvMMYb-T.mjs";
import { n as FAMILY_ORDER, t as EXERCISE_CATALOG } from "./sign-exercise-catalog-2qXNd-Hz.mjs";
import { t as RepetitionRow } from "./RepetitionRow-C7299EkU.mjs";
import { n as EvaluationTimerBadge, r as useCountdown, t as EvaluationCompleteOverlay } from "./EvaluationTimer-B39sOdIf.mjs";
import { t as Route } from "./exercice-liste-qvgjUdNL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exercice-liste-Bkle7JP7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignExerciseRow({ entry, repetitions, tolerance, hideFamilyBadge, onEntryDone }) {
	const { speak } = useSignSpeech();
	const { t, lang } = useLanguage();
	const badge = !hideFamilyBadge || entry.scale === "reduced" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide",
		style: {
			backgroundColor: entry.badgeBg,
			color: entry.badgeText,
			border: entry.badgeBg === "#F5EDE0" || entry.badgeBg === "#FBF6EC" ? "1px solid " + entry.badgeText : "none"
		},
		children: entry.scale === "reduced" ? t.exerciceListe.reducedLabel : t.exerciceListe.familyNames[entry.family]
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepetitionRow, {
		entry,
		label: entry.label[lang],
		badge,
		repetitions,
		tolerance,
		doneLabel: t.exerciceListe.done,
		onSpeak: () => speak(entry.consigne[lang]),
		onAllDone: () => {
			speak(t.exerciceListe.rowComplete);
			awardCompletion({
				typeEtape: "SIGNE",
				modalite: "EXERCICE",
				etapeCode: entry.id,
				palier: 1
			});
			onEntryDone?.(entry.id);
		}
	});
}
function ExerciceListeScreen() {
	const { speak } = useSignSpeech();
	const { t, lang } = useLanguage();
	const { family, group, amaniEval } = Route.useSearch();
	const { repetitions, tolerance } = useExerciseSettings();
	const writingStyle = useWritingStyle();
	const navigate = useNavigate();
	const isEvaluation = amaniEval === "1";
	const evaluationSeconds = (0, import_react.useMemo)(() => readEvaluationDurationMinutes() * 60, []);
	const [evaluationExpired, setEvaluationExpired] = (0, import_react.useState)(false);
	const remaining = useCountdown(isEvaluation ? evaluationSeconds : 0, () => setEvaluationExpired(true));
	const [doneSigns, setDoneSigns] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [restartKey, setRestartKey] = (0, import_react.useState)(0);
	const [awaitingRepeatCompletion, setAwaitingRepeatCompletion] = (0, import_react.useState)(false);
	const allGrouped = [
		{
			titre: t.exerciceListe.familyNames.point,
			familyKey: "point",
			entries: EXERCISE_CATALOG.filter((e) => e.family === "point")
		},
		{
			titre: t.exerciceListe.familyNames.courbe,
			familyKey: "courbe",
			entries: EXERCISE_CATALOG.filter((e) => e.family === "courbe")
		},
		{
			titre: t.exerciceListe.familyNames.crochet,
			familyKey: "crochet",
			entries: EXERCISE_CATALOG.filter((e) => e.family === "crochet")
		},
		{
			titre: t.exerciceListe.familyNames.trait,
			familyKey: "trait",
			entries: EXERCISE_CATALOG.filter((e) => e.family === "trait")
		}
	];
	const grouped = family ? allGrouped.filter((g) => g.familyKey === family) : allGrouped;
	const familyEntries = family ? grouped[0]?.entries ?? [] : [];
	const allFamilyDone = !!family && familyEntries.length > 0 && doneSigns.size >= familyEntries.length;
	const familyIdx = family ? FAMILY_ORDER.indexOf(family) : -1;
	const nextFamily = familyIdx >= 0 && familyIdx < FAMILY_ORDER.length - 1 ? FAMILY_ORDER[familyIdx + 1] : null;
	(0, import_react.useEffect)(() => {
		if (allFamilyDone && awaitingRepeatCompletion) {
			awardRestartBonus();
			setAwaitingRepeatCompletion(false);
		}
	}, [allFamilyDone, awaitingRepeatCompletion]);
	const progressionGroup = group ? getPalier2GroupMap(lang).get(group) : void 0;
	if (progressionGroup) {
		const groupLetters = lettersForGroup(progressionGroup, writingStyle);
		const itemPrefix = progressionGroup.kind === "chiffres" ? t.exerciceListe.digitPrefix : t.exerciceListe.letterPrefix;
		const groupSubtitle = progressionGroup.kind === "chiffres" ? t.exerciceListe.subtitleGroupDigits : t.exerciceListe.subtitleGroupLettres;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "flex items-center justify-between px-5 pt-5 pb-3 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/accueil",
						"aria-label": t.exerciceListe.backAria,
						className: "grid h-10 w-10 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
							className: "h-5 w-5 text-[#4A3B2A]",
							strokeWidth: 2.5
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-[22px] font-bold text-[#4A3B2A] leading-tight",
						children: format(t.exerciceListe.titleGroup, { titre: progressionGroup.title[lang] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12px] text-[#7A6A55]",
						children: groupSubtitle
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-3.5 bg-[#EAF1FB]/80 border-b border-[#4A90E2]/20 flex items-center gap-3 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmaniMascot, {
					pose: "demonstration",
					size: "small"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12.5px] text-[#2D5E8A] font-medium leading-snug",
					children: t.exerciceListe.groupHint
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "flex-1 overflow-y-auto bg-[#F5EDE0] px-4 py-5 flex flex-col gap-3.5 pb-12",
				children: groupLetters.map((letter) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/exercice/lettre/$char",
					params: { char: letter.char },
					search: { pg: progressionGroup.id },
					className: "group flex items-center justify-between p-4 rounded-2xl bg-white border border-[#4A3B2A]/15 shadow-xs hover:border-[#8FBF6F] hover:shadow-md transition-all active:scale-98",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-14 h-14 rounded-2xl bg-[#FBF6EC] border border-[#4A3B2A]/15 flex items-center justify-center text-[28px] font-extrabold text-[#A9784F] group-hover:scale-105 transition-transform shadow-inner shrink-0",
							children: letter.char
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-[17px] font-bold text-[#4A3B2A]",
								children: [
									itemPrefix,
									" \"",
									letter.char,
									"\""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[12.5px] text-[#7A6A55] mt-0.5",
								children: [
									letter.name[lang],
									" · ",
									format(t.exerciceListe.gestureCount, { count: letter.steps.length })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1.5 mt-1.5",
								children: letter.steps.map((st, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] px-2 py-0.5 rounded-md bg-[#F5EDE0] text-[#7A6A55] font-semibold border border-[#4A3B2A]/10",
									children: st.description[lang].split(" ")[0]
								}, i))
							})
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-9 h-9 rounded-full bg-[#8FBF6F]/15 group-hover:bg-[#8FBF6F] flex items-center justify-center text-[#8FBF6F] group-hover:text-white transition-colors shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5 stroke-[2.5]" })
					})]
				}, letter.char))
			})
		] });
	}
	const activeHeaderTitle = family && grouped[0] ? format(t.exerciceListe.titleFamily, { titre: grouped[0].titre }) : t.exerciceListe.title;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileShell, { children: [
		isEvaluation && !evaluationExpired && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvaluationTimerBadge, { remaining }),
		isEvaluation && evaluationExpired && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvaluationCompleteOverlay, { onBack: () => navigate({ to: "/accueil" }) }),
		allFamilyDone && !isEvaluation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExerciseCompletePopup, {
			onBackHome: () => navigate({ to: "/accueil" }),
			onNext: nextFamily ? () => navigate({
				to: "/cours/$family",
				params: { family: nextFamily }
			}) : void 0,
			onRestart: () => {
				setDoneSigns(/* @__PURE__ */ new Set());
				setRestartKey((k) => k + 1);
				setAwaitingRepeatCompletion(true);
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "flex items-center justify-between px-5 pt-5 pb-3 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/accueil",
					"aria-label": t.exerciceListe.backAria,
					className: "grid h-10 w-10 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
						className: "h-5 w-5 text-[#4A3B2A]",
						strokeWidth: 2.5
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[22px] font-bold text-[#4A3B2A] leading-tight",
					children: activeHeaderTitle
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12px] text-[#7A6A55]",
					children: t.exerciceListe.subtitle
				})] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 py-3 bg-[#EAF1FB]/80 border-b border-[#4A90E2]/20 flex items-center gap-2.5 shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-6 h-6 rounded-full bg-[#5BAA6A] flex items-center justify-center shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-3 h-3 rounded-full bg-white" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[12.5px] text-[#2D5E8A] font-medium leading-snug",
				children: t.exerciceListe.startHint
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "flex-1 overflow-y-auto bg-[#F5EDE0] px-3 py-4 flex flex-col gap-5 pb-12",
			children: grouped.map(({ titre, entries }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [!family && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[16px] font-bold text-[#4A3B2A] px-1",
					children: titre
				}), entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignExerciseRow, {
					entry,
					repetitions,
					tolerance,
					hideFamilyBadge: !!family,
					onEntryDone: (id) => setDoneSigns((prev) => new Set(prev).add(id))
				}, `${entry.id}-r${restartKey}`))]
			}, titre))
		})
	] });
}
//#endregion
export { ExerciceListeScreen as component };
