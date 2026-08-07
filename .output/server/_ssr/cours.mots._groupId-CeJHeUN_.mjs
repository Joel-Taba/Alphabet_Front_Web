import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as useLanguage, r as format } from "./LanguageContext-IeRxb9no.mjs";
import { r as markCoursItemViewed } from "./progress-DCH5vN8F.mjs";
import { F as ChevronLeft, P as ChevronRight, U as ArrowLeft, n as Volume2, y as Play } from "../_libs/lucide-react.mjs";
import { t as MobileShell } from "./MobileShell-L36W1Wth.mjs";
import { t as useWritingStyle } from "./useWritingStyle-CKn53fOs.mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AmaniMascot } from "./AmaniMascot-A-Eqgs-C.mjs";
import { a as lettersForWord, n as PALIER3_GROUPS, r as PALIER3_GROUP_MAP, s as wordText } from "./word-catalog-C-fKc0oN.mjs";
import { t as LetterTraceCell } from "./LetterTraceCell-D2weATol.mjs";
import { a as useSignSpeech } from "./useSignSpeech-MSIU-G__.mjs";
import { t as Route } from "./cours.mots._groupId-BbUDOEfa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cours.mots._groupId-CeJHeUN_.js
var import_jsx_runtime = require_jsx_runtime();
function WordCourseScreen() {
	const { groupId } = Route.useParams();
	const navigate = useNavigate();
	const { speak } = useSignSpeech();
	const { t, lang } = useLanguage();
	const writingStyle = useWritingStyle();
	const group = PALIER3_GROUP_MAP.get(groupId);
	const groupIdx = PALIER3_GROUPS.findIndex((g) => g.id === groupId);
	const prevGroup = groupIdx > 0 ? PALIER3_GROUPS[groupIdx - 1] : null;
	const nextGroup = groupIdx >= 0 && groupIdx < PALIER3_GROUPS.length - 1 ? PALIER3_GROUPS[groupIdx + 1] : null;
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
				className: "text-[24px] font-bold text-[#4A3B2A] leading-tight",
				children: groupTitle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13px] text-[#7A6A55] font-normal",
				children: format(t.coursMots.wordCount, { count: group.words.length })
			})] })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-[#F5EDE0] pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-[#FBF6EC] rounded-[20px] p-4 border border-[#4A3B2A]/10 shadow-sm flex items-center gap-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmaniMascot, {
					pose: "demonstration",
					size: "small"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[14px] font-bold text-[#4A3B2A] leading-snug",
						children: t.coursMots.introTitle
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12px] text-[#7A6A55] mt-0.5",
						children: t.coursMots.introBody
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3.5",
				children: group.words.map((word) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WordCard, {
					word,
					lang,
					speak,
					style: writingStyle,
					groupId: group.id,
					totalWords: group.words.length,
					palier: lang === "fr" ? 4 : 3
				}, word.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-2 flex items-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmaniMascot, {
					pose: "invitation",
					size: "small"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => navigate({
						to: "/exercice/mots/$groupId",
						params: { groupId: group.id }
					}),
					className: "flex-1 py-4 rounded-2xl bg-[#4A90E2] hover:bg-[#3A7BC8] text-white font-extrabold text-lg shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.99]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: format(t.coursMots.practiceGroup, { titre: groupTitle }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-5 w-5 fill-current" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 pt-1",
				children: [prevGroup ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => navigate({
						to: "/cours/mots/$groupId",
						params: { groupId: prevGroup.id }
					}),
					className: "flex items-center gap-2 px-5 py-3 rounded-full bg-[#FBF6EC] border border-[#4A3B2A]/10 text-[#4A3B2A] font-bold text-[14px] shadow-sm active:scale-95 transition-transform",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" }), prevGroup.title[lang]]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), nextGroup ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => navigate({
						to: "/cours/mots/$groupId",
						params: { groupId: nextGroup.id }
					}),
					className: "flex items-center gap-2 px-5 py-3 rounded-full bg-[#4A90E2] text-white font-bold text-[14px] shadow-md active:scale-95 transition-transform",
					children: [nextGroup.title[lang], /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})]
			})
		]
	})] });
}
function WordCard({ word, lang, speak, style, groupId, totalWords, palier }) {
	const letters = lettersForWord(word, lang, style);
	const text = wordText(word, lang);
	const handleSpeak = () => {
		speak(text);
		markCoursItemViewed({
			typeEtape: "MOT",
			groupCode: groupId,
			itemCode: word.id,
			totalItems: totalWords,
			palier
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-[20px] p-4 border border-[#4A3B2A]/10 shadow-[0_2px_8px_rgba(74,59,42,0.08)] flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex items-center gap-1.5 overflow-x-auto py-1",
			children: [letters.map((letter, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LetterTraceCell, {
				letter,
				size: 48,
				isActive: false,
				given: true
			}, `${word.id}-${i}`)), letters.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[20px] font-extrabold text-[#4A3B2A]",
				children: text
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: handleSpeak,
			"aria-label": text,
			className: "w-10 h-10 shrink-0 grid place-items-center rounded-full bg-[#4A90E2]/15 text-[#2D6BBF] hover:bg-[#4A90E2] hover:text-white transition-colors",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-4.5 h-4.5" })
		})]
	});
}
//#endregion
export { WordCourseScreen as component };
