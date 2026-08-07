import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as useLanguage } from "./LanguageContext-IeRxb9no.mjs";
import { A as EyeOff, I as ChevronDown, O as Globe, R as Camera, k as Eye, w as Lock } from "../_libs/lucide-react.mjs";
import { t as MobileShell } from "./MobileShell-L36W1Wth.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as setStoredPhoto, l as setStoredName, r as getStoredPhoto, u as setStoredPassword } from "./profileAuth-wAmuDTHN.mjs";
import { t as resizeImageToDataUrl } from "./resizeImageToDataUrl-CuZ5Km1N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profil-CgCV7PeZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MIN_PASSWORD_LENGTH = 4;
function LeafIcon({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		className,
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M12 2C7 2 3 7 3 12c0 4 2.5 7.5 6 9 .5-3 2-5.5 4.5-7C16 12.5 19 10 20 7c-2 0-4 .5-5.5 2C13 7 12 4.5 12 2Z",
			fill: "#8FBF6F",
			opacity: "0.85"
		})
	});
}
function LeafAccent({ flip = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 20 28",
		fill: "none",
		width: 18,
		height: 24,
		style: { transform: flip ? "scaleX(-1)" : void 0 },
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M10 2C6 5 2 10 3 16c.5 3 2 5.5 4.5 7C8 19 9 14 10 10c1 4 2 9 2.5 13 2.5-1.5 4-4 4.5-7C18 10 14 5 10 2Z",
			fill: "#A9784F",
			opacity: "0.6"
		})
	});
}
var LANGUAGES = [
	{
		code: "fr",
		label: "Français"
	},
	{
		code: "en",
		label: "English"
	},
	{
		code: "es",
		label: "Español"
	}
];
function ProfileCreate() {
	const navigate = useNavigate();
	const { t, lang, setLang } = useLanguage();
	const [name, setName] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [langOpen, setLangOpen] = (0, import_react.useState)(false);
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const photoInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setPhoto(getStoredPhoto());
	}, []);
	const selectedLang = LANGUAGES.find((l) => l.code === lang);
	const canContinue = name.trim().length >= 2 && password.length >= MIN_PASSWORD_LENGTH;
	const handleStart = () => {
		if (!canContinue) return;
		setStoredName(name.trim());
		setStoredPassword(password);
		navigate({ to: "/accueil" });
	};
	const handlePhotoChange = async (e) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file) return;
		try {
			const dataUrl = await resizeImageToDataUrl(file);
			setStoredPhoto(dataUrl);
			setPhoto(dataUrl);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex flex-1 flex-col overflow-y-auto",
		style: { background: "linear-gradient(160deg, #F5EDE0 0%, #EEDFC8 100%)" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-2 pt-10 px-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeafIcon, { className: "w-9 h-9 mb-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeafAccent, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-[34px] font-bold leading-tight",
								style: { color: "#A9784F" },
								children: t.onboarding.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeafAccent, { flip: true })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[15px] leading-snug max-w-[240px]",
						style: { color: "#7A6A55" },
						children: t.onboarding.subtitle
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 flex justify-center",
				style: {
					marginBottom: "-56px",
					marginTop: "16px"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					style: {
						width: 140,
						height: 140
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: photo ?? "/assets/amani-inscription-ZLDCh20L.jpeg",
							alt: photo ? "" : "Amani se penche avec curiosité",
							"aria-hidden": photo ? true : void 0,
							className: "select-none",
							draggable: false,
							style: {
								width: 140,
								height: 140,
								objectFit: "cover",
								objectPosition: photo ? "center" : "top center",
								borderRadius: "50%",
								filter: "drop-shadow(0 4px 12px rgba(74,59,42,0.18))"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => photoInputRef.current?.click(),
							"aria-label": t.profileHub.photoChangeAria,
							className: "absolute bottom-1 right-1 grid h-9 w-9 place-items-center rounded-full text-white border-2 border-white shadow-sm active:scale-95 transition-transform",
							style: { background: "#A9784F" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
								className: "w-4.5 h-4.5",
								strokeWidth: 2.2
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: photoInputRef,
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: handlePhotoChange
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-0 mx-4 flex flex-col gap-5 rounded-[28px] px-6 pt-16 pb-8",
				style: {
					background: "#FBF6EC",
					boxShadow: "0 -2px 0 rgba(169,120,79,0.06), 0 8px 28px rgba(74,59,42,0.14)",
					flex: 1
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-full border-2 px-4 h-[58px] transition-all",
						style: {
							borderColor: name ? "#8FBF6F" : "#D8CFC0",
							background: "#FFFFFF"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex items-center justify-center shrink-0 rounded-full w-9 h-9 text-[20px]",
							style: { background: "#8FBF6F" },
							"aria-hidden": "true",
							children: "😊"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "name",
							type: "text",
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: t.onboarding.namePlaceholder,
							className: "flex-1 bg-transparent text-[16px] font-medium outline-none placeholder:text-[#B8A88A]",
							style: { color: "#4A3B2A" },
							autoComplete: "off"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-full border-2 px-4 h-[58px] transition-all",
							style: {
								borderColor: password ? "#8FBF6F" : "#D8CFC0",
								background: "#FFFFFF"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex items-center justify-center shrink-0 rounded-full w-9 h-9",
									style: { background: "#A9784F" },
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
										className: "w-4.5 h-4.5 text-white",
										strokeWidth: 2.2
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "password",
									type: showPassword ? "text" : "password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: t.onboarding.passwordPlaceholder,
									className: "flex-1 bg-transparent text-[16px] font-medium outline-none placeholder:text-[#B8A88A]",
									style: { color: "#4A3B2A" },
									autoComplete: "new-password"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowPassword((v) => !v),
									"aria-label": showPassword ? t.onboarding.hidePassword : t.onboarding.showPassword,
									className: "shrink-0 text-[#7A6A55]",
									children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-5 h-5" })
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[12px] px-4",
							style: { color: "#7A6A55" },
							children: t.onboarding.passwordHint
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setLangOpen((v) => !v),
							"aria-haspopup": "listbox",
							"aria-expanded": langOpen,
							className: "flex items-center gap-3 rounded-full border-2 px-4 h-[58px] w-full transition-all text-left",
							style: {
								borderColor: "#D8CFC0",
								background: "#FFFFFF"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex items-center justify-center shrink-0 rounded-full w-9 h-9",
									style: { background: "#A9784F" },
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
										className: "w-5 h-5 text-white",
										strokeWidth: 2
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 text-[16px] font-medium",
									style: { color: "#4A3B2A" },
									children: selectedLang.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
									className: "w-5 h-5 shrink-0 transition-transform",
									style: {
										color: "#7A6A55",
										transform: langOpen ? "rotate(180deg)" : "rotate(0deg)"
									},
									strokeWidth: 2.2
								})
							]
						}), langOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							role: "listbox",
							className: "absolute z-20 mt-2 w-full rounded-2xl overflow-hidden",
							style: {
								background: "#FBF6EC",
								boxShadow: "0 6px 20px rgba(74,59,42,0.16)",
								border: "1.5px solid #D8CFC0"
							},
							children: LANGUAGES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "option",
								"aria-selected": lang === l.code,
								onClick: () => {
									setLang(l.code);
									setLangOpen(false);
								},
								className: "w-full px-5 py-3 text-left text-[16px] font-medium transition-colors hover:bg-[#EFE3CE]",
								style: {
									color: lang === l.code ? "#8FBF6F" : "#4A3B2A",
									fontWeight: lang === l.code ? 700 : 500
								},
								children: l.label
							}) }, l.code))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !canContinue,
						onClick: handleStart,
						className: "mt-2 w-full h-[58px] rounded-full text-[18px] font-bold transition-all select-none",
						style: {
							background: canContinue ? "#8FBF6F" : "#D8CFC0",
							color: canContinue ? "#FBF6EC" : "#A89880",
							boxShadow: canContinue ? "0 5px 0 0 #6FA050" : "none",
							transform: "translateY(0)",
							cursor: canContinue ? "pointer" : "not-allowed",
							transition: "box-shadow 100ms, transform 100ms, background 200ms"
						},
						onMouseDown: (e) => {
							if (canContinue) {
								e.currentTarget.style.transform = "translateY(4px)";
								e.currentTarget.style.boxShadow = "0 1px 0 0 #6FA050";
							}
						},
						onMouseUp: (e) => {
							if (canContinue) {
								e.currentTarget.style.transform = "translateY(0)";
								e.currentTarget.style.boxShadow = "0 5px 0 0 #6FA050";
							}
						},
						onMouseLeave: (e) => {
							if (canContinue) {
								e.currentTarget.style.transform = "translateY(0)";
								e.currentTarget.style.boxShadow = "0 5px 0 0 #6FA050";
							}
						},
						children: t.onboarding.start
					})
				]
			})
		]
	}) });
}
//#endregion
export { ProfileCreate as component };
