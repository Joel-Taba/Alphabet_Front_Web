import { n as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { i as useLanguage } from "./_ssr/LanguageContext-IeRxb9no.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { O as Globe, n as Volume2, o as Type, t as VolumeX, y as Play } from "./_libs/lucide-react.mjs";
import { n as useWritingStyleState } from "./_ssr/useWritingStyle-CKn53fOs.mjs";
import { a as useSignSpeech, r as VOLUME_STORAGE_KEY } from "./_ssr/useSignSpeech-MSIU-G__.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.plus-D_-Fbd_3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PlusScreen() {
	const { t, lang, setLang } = useLanguage();
	const { speak } = useSignSpeech();
	const [format_, setFormat] = useWritingStyleState();
	const [volume, setVolume] = (0, import_react.useState)(() => {
		if (typeof localStorage !== "undefined") {
			const raw = localStorage.getItem(VOLUME_STORAGE_KEY);
			const v = raw != null ? Number(raw) : .85;
			return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : .85;
		}
		return .85;
	});
	(0, import_react.useEffect)(() => {
		if (typeof localStorage !== "undefined") localStorage.setItem(VOLUME_STORAGE_KEY, String(volume));
	}, [volume]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6 px-5 pt-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-[24px] leading-8 font-bold",
				style: { color: "#4A3B2A" },
				children: t.plusScreen.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[14px]",
				style: { color: "#7A6A55" },
				children: t.plusScreen.subtitle
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[24px] bg-[#FBF6EC] p-5 border border-[#4A3B2A]/10 shadow-[0_2px_8px_rgba(74,59,42,0.06)] flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
						className: "w-4.5 h-4.5",
						style: { color: "#4A90E2" },
						strokeWidth: 2.5
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-[16px] font-bold text-[#4A3B2A]",
						children: t.profileHub.languageCardTitle
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-3 mt-1",
					children: [
						"fr",
						"en",
						"es"
					].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setLang(c),
						"aria-pressed": lang === c,
						className: cn("h-12 rounded-2xl border-2 text-[13px] font-bold transition-all active:scale-95 px-1", lang === c ? "border-[#4A90E2] bg-[#4A90E2]/15 text-[#2D6BBF] shadow-sm" : "border-[#4A3B2A]/15 bg-white text-[#7A6A55]"),
						children: c === "fr" ? "🇫🇷 Français" : c === "en" ? "🇬🇧 English" : "🇪🇸 Español"
					}, c))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[24px] bg-[#FBF6EC] p-5 border border-[#4A3B2A]/10 shadow-[0_2px_8px_rgba(74,59,42,0.06)] flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
							className: "w-4.5 h-4.5",
							style: { color: "#A9784F" },
							strokeWidth: 2.5
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-[16px] font-bold text-[#4A3B2A]",
							children: t.profileHub.soundCardTitle
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[14px] font-semibold text-[#4A3B2A]",
							children: t.profileHub.volumeLabel
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[13px] font-bold text-[#A9784F] tabular-nums",
							children: [Math.round(volume * 100), "%"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [volume === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, {
							className: "h-5 w-5 shrink-0 text-[#A9784F]",
							strokeWidth: 2.5
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
							className: "h-5 w-5 shrink-0 text-[#A9784F]",
							strokeWidth: 2.5
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 1,
							step: .05,
							value: volume,
							onChange: (e) => setVolume(Number(e.target.value)),
							className: "h-2 flex-1 accent-[#A9784F]",
							"aria-label": t.profileHub.volumeLabel
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => speak(t.profileHub.volumeTestPhrase),
						className: "mt-1 flex items-center justify-center gap-2 h-11 rounded-2xl border-2 border-[#A9784F]/30 bg-[#A9784F]/10 text-[14px] font-bold text-[#7A5332] transition-all active:scale-95",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
							className: "h-4 w-4",
							strokeWidth: 2.5,
							fill: "currentColor"
						}), t.profileHub.volumeTest]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[24px] bg-[#FBF6EC] p-5 border border-[#4A3B2A]/10 shadow-[0_2px_8px_rgba(74,59,42,0.06)] flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, {
						className: "w-4.5 h-4.5",
						style: { color: "#8FBF6F" },
						strokeWidth: 2.5
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-[16px] font-bold text-[#4A3B2A]",
						children: t.profileHub.formatCardTitle
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2.5",
					children: ["script", "cursive"].map((id, i) => {
						const opt = t.profileHub.formatOptions[i];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setFormat(id),
							"aria-pressed": format_ === id,
							className: cn("h-14 rounded-2xl border-2 font-bold transition-all active:scale-95 flex flex-col items-center justify-center p-1", format_ === id ? "border-[#8FBF6F] bg-[#8FBF6F]/20 text-[#4A7A30] shadow-sm" : "border-[#4A3B2A]/15 bg-white text-[#7A6A55]"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[14px] leading-tight font-extrabold",
								children: opt.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] font-medium opacity-80 leading-tight mt-0.5",
								children: [
									"(",
									opt.desc,
									")"
								]
							})]
						}, id);
					})
				})]
			})
		]
	});
}
//#endregion
export { PlusScreen as component };
