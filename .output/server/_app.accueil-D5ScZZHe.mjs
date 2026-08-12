import { n as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { i as useLanguage } from "./_ssr/LanguageContext-lly5fNnz.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { B as BookOpen, D as Grid3x3, E as Leaf, V as Blocks, b as PenTool, d as Sprout, p as Sparkle, w as Lock } from "./_libs/lucide-react.mjs";
import { t as AmaniMascot } from "./_ssr/AmaniMascot-A-Eqgs-C.mjs";
import { n as PALIER3_GROUPS, t as PALIER3_CROSSWORD_LEVELS } from "./_ssr/word-catalog-Tmy_ga3k.mjs";
import { t as Route } from "./_app.accueil-BUErnXdu.mjs";
import { r as getPalier2Groups } from "./_ssr/palier2-groups-D8KgwiFS.mjs";
import { t as SYLLABLE_GROUPS } from "./_ssr/syllable-catalog-GrCrYzgn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.accueil-D5ScZZHe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var amani_victoire_palier_badge_default = "/assets/amani-victoire-palier-badge-IiJasJT_.png";
/** Génère un chemin en zigzag dont le nombre d'ondulations suit la longueur réelle du parcours. */
function buildZigzagPath(turns) {
	const stepHeight = 100;
	const startY = 40;
	let d = `M150 ${startY}`;
	let y = startY;
	for (let i = 0; i < turns; i++) {
		const controlX = i % 2 === 0 ? 60 : 240;
		const endY = y + stepHeight;
		d += ` Q ${controlX} ${y + stepHeight / 2} 150 ${endY}`;
		y = endY;
	}
	return {
		d,
		height: y
	};
}
function BrancheExerciseIcon({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 100 120",
		fill: "currentColor",
		className,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M 45,115 C 47,95 51,70 57,50 C 63,32 75,18 90,10\n           C 87,16 77,26 68,41 C 59,56 53,76 49,115 Z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M 50,78 C 41,64 32,51 22,35 C 20,43 27,53 36,67 C 42,74 46,79 50,78 Z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M 23,38 L 15,33 L 21,45 Z M 27,47 L 16,45 L 26,54 Z M 32,56 L 20,58 L 31,64 Z M 37,65 L 23,71 L 38,73 Z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M 26,38 L 35,34 L 29,46 Z M 32,50 L 42,44 L 35,57 Z M 39,61 L 48,55 L 42,67 Z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M 86,13 L 73,15 L 82,23 Z M 78,21 L 64,25 L 74,32 Z M 70,32 L 54,38 L 66,43 Z M 63,45 L 47,51 L 59,56 Z M 57,58 L 42,64 L 53,68 Z M 51,70 L 37,77 L 48,80 Z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M 81,19 L 90,23 L 77,29 Z M 73,30 L 86,35 L 69,41 Z M 65,42 L 80,48 L 62,53 Z M 58,54 L 72,61 L 55,65 Z M 52,66 L 66,72 L 49,76 Z" })
		]
	});
}
function ParcoursBranche() {
	const { t, lang } = useLanguage();
	const paliers = t.parcours.paliers;
	const PALIER2_GROUPS = getPalier2Groups(lang);
	const steps = [
		{
			step: {
				kind: "header",
				title: paliers[0].title,
				subtitle: paliers[0].subtitle,
				tagline: paliers[0].tagline,
				palierNum: 1,
				bannerBg: "#8FBF6F",
				bannerBorder: "#5E8E3E",
				bannerIcon: Sprout
			},
			side: 0
		},
		{
			step: {
				kind: "active",
				iconType: "feuille"
			},
			side: -1,
			to: "/cours/point"
		},
		{
			step: {
				kind: "active",
				iconType: "branche"
			},
			side: 1,
			to: {
				pathname: "/exercice-liste",
				search: { family: "point" }
			}
		},
		{
			step: {
				kind: "locked",
				iconType: "feuille"
			},
			side: -1,
			to: "/cours/courbe"
		},
		{
			step: {
				kind: "locked",
				iconType: "branche"
			},
			side: 1,
			to: {
				pathname: "/exercice-liste",
				search: { family: "courbe" }
			}
		},
		{
			step: {
				kind: "locked",
				iconType: "feuille"
			},
			side: -1,
			to: "/cours/crochet"
		},
		{
			step: {
				kind: "locked",
				iconType: "branche"
			},
			side: 1,
			to: {
				pathname: "/exercice-liste",
				search: { family: "crochet" }
			}
		},
		{
			step: {
				kind: "locked",
				iconType: "feuille"
			},
			side: -1,
			to: "/cours/trait"
		},
		{
			step: {
				kind: "locked",
				iconType: "branche"
			},
			side: 1,
			to: {
				pathname: "/exercice-liste",
				search: { family: "trait" }
			}
		},
		{
			step: { kind: "medal" },
			side: 0,
			to: {
				pathname: "/exercice-liste",
				search: { amaniEval: "1" }
			}
		},
		{
			step: {
				kind: "header",
				title: paliers[1].title,
				subtitle: paliers[1].subtitle,
				tagline: paliers[1].tagline,
				palierNum: 2,
				bannerBg: "#A9784F",
				bannerBorder: "#7A5332",
				bannerIcon: PenTool
			},
			side: 0
		},
		...PALIER2_GROUPS.flatMap((group, idx) => {
			const kind = idx === 0 ? "active" : "locked";
			return [{
				step: {
					kind,
					iconType: "feuille"
				},
				side: -1,
				to: {
					pathname: `/cours/lettres/formation/${group.chars[0]}`,
					search: { pg: group.id }
				}
			}, {
				step: {
					kind,
					iconType: "branche"
				},
				side: 1,
				to: {
					pathname: "/exercice-liste",
					search: { group: group.id }
				}
			}];
		}),
		{
			step: { kind: "medal" },
			side: 0,
			to: {
				pathname: `/exercice/lettre/${PALIER2_GROUPS[0].chars[0]}`,
				search: {
					pg: PALIER2_GROUPS[0].id,
					amaniEval: "1"
				}
			}
		},
		...lang === "fr" ? [
			{
				step: {
					kind: "header",
					title: paliers[2].title,
					subtitle: paliers[2].subtitle,
					tagline: paliers[2].tagline,
					palierNum: 3,
					bannerBg: "#F4F9FD",
					bannerBorder: "#CFE3F2",
					bannerText: "#4A7A9C",
					bannerIcon: Blocks
				},
				side: 0
			},
			...SYLLABLE_GROUPS.flatMap((group, idx) => {
				const kind = idx === 0 ? "active" : "locked";
				return [{
					step: {
						kind,
						iconType: "feuille"
					},
					side: -1,
					to: { pathname: `/cours/syllabes/${group.consonant}` }
				}, {
					step: {
						kind,
						iconType: "branche"
					},
					side: 1,
					to: { pathname: `/exercice/syllabes/${group.consonant}` }
				}];
			}),
			{
				step: { kind: "medal" },
				side: 0,
				to: {
					pathname: `/exercice/syllabes/${SYLLABLE_GROUPS[0].consonant}`,
					search: { amaniEval: "1" }
				}
			}
		] : [],
		{
			step: {
				kind: "header",
				title: paliers[3].title,
				subtitle: `${paliers[0].subtitle.replace(/\s*1$/, "")} ${lang === "fr" ? 4 : 3}`,
				tagline: paliers[3].tagline,
				palierNum: lang === "fr" ? 4 : 3,
				bannerBg: "#4A90E2",
				bannerBorder: "#2D6BBF",
				bannerIcon: BookOpen
			},
			side: 0
		},
		...PALIER3_GROUPS.flatMap((group, idx) => {
			const kind = idx === 0 ? "active" : "locked";
			const entries = [{
				step: {
					kind,
					iconType: "feuille"
				},
				side: -1,
				to: { pathname: `/cours/mots/${group.id}` }
			}, {
				step: {
					kind,
					iconType: "branche"
				},
				side: 1,
				to: { pathname: `/exercice/mots/${group.id}` }
			}];
			if (idx % 2 === 1) {
				const level = PALIER3_CROSSWORD_LEVELS[(idx - 1) / 2];
				if (level) entries.push({
					step: { kind: "crossword" },
					side: 0,
					to: { pathname: `/exercice/mots-croises/lvl${level}` }
				});
			}
			return entries;
		}),
		{
			step: { kind: "medal" },
			side: 0,
			to: {
				pathname: `/exercice/mots/${PALIER3_GROUPS[0].id}`,
				search: { amaniEval: "1" }
			}
		}
	];
	let currentColor = "#8FBF6F";
	let currentBorderColor = "#5E8E3E";
	const coloredSteps = steps.map((entry) => {
		if (entry.step.kind === "header") {
			currentColor = entry.step.bannerBg ?? currentColor;
			currentBorderColor = entry.step.bannerBorder ?? currentBorderColor;
			return entry;
		}
		return {
			...entry,
			color: currentColor,
			borderColor: currentBorderColor
		};
	});
	const nonHeaderSteps = steps.filter((s) => s.step.kind !== "header").length;
	const zigzag = buildZigzagPath(Math.max(8, Math.ceil(nonHeaderSteps / 2)));
	const [activeStepIdx, setActiveStepIdx] = import_react.useState(() => {
		if (typeof localStorage !== "undefined") {
			const saved = localStorage.getItem("accueil_current_step_idx");
			return saved ? Number(saved) : 1;
		}
		return 1;
	});
	import_react.useEffect(() => {
		if (typeof sessionStorage !== "undefined") {
			const scrollEl = document.getElementById("app-main-scroll");
			if (scrollEl) {
				const savedScroll = sessionStorage.getItem("accueil_scroll_top");
				if (savedScroll) scrollEl.scrollTop = Number(savedScroll);
				const handleScroll = () => {
					sessionStorage.setItem("accueil_scroll_top", String(scrollEl.scrollTop));
				};
				scrollEl.addEventListener("scroll", handleScroll);
				return () => scrollEl.removeEventListener("scroll", handleScroll);
			}
		}
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-full flex-col overflow-x-hidden",
		style: { background: "linear-gradient(180deg, #F5EDE0 0%, #EFE3CE 100%)" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "relative z-10 flex items-start justify-between gap-2 px-6 pt-6 pb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[24px] leading-8 font-bold",
					style: { color: "#4A3B2A" },
					children: t.parcours.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[14px] leading-snug",
					style: { color: "#7A6A55" },
					children: t.parcours.subtitle
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none shrink-0 -mt-2 -mr-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmaniMascot, {
					pose: "encouragement",
					size: "small",
					priority: true
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative flex-1 px-6 pt-2 pb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: `0 0 300 ${zigzag.height + 40}`,
				className: "pointer-events-none absolute inset-0 h-full w-full",
				preserveAspectRatio: "none",
				"aria-hidden": true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: zigzag.d,
						stroke: "#7A5332",
						strokeOpacity: "0.15",
						strokeWidth: "9",
						strokeLinecap: "round",
						fill: "none",
						transform: "translate(0, 3)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: zigzag.d,
						stroke: "#C9AE86",
						strokeOpacity: "0.55",
						strokeWidth: "9",
						strokeLinecap: "round",
						fill: "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: zigzag.d,
						stroke: "#FBF6EC",
						strokeOpacity: "0.6",
						strokeWidth: "2.5",
						strokeLinecap: "round",
						fill: "none"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "relative flex flex-col gap-14 pt-2",
				children: (() => {
					let stepNumber = 0;
					return coloredSteps.map(({ step, side, to, color, borderColor }, i) => {
						if (step.kind !== "header") stepNumber += 1;
						const number = step.kind !== "header" ? stepNumber : void 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: cn("flex", step.kind === "header" && "w-full"),
							style: { justifyContent: step.kind === "header" ? "stretch" : "center" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex w-full",
								style: {
									justifyContent: step.kind === "header" ? "stretch" : "center",
									transform: step.kind !== "header" ? `translateX(${side * 68}px)` : void 0
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepNode, {
									step,
									to,
									isCurrent: i === activeStepIdx,
									color,
									borderColor,
									number,
									t,
									onActivate: () => {
										setActiveStepIdx(i);
										if (typeof localStorage !== "undefined") localStorage.setItem("accueil_current_step_idx", String(i));
									}
								})
							})
						}, i);
					});
				})()
			})]
		})]
	});
}
function PalierBanner({ step }) {
	const Icon = step.bannerIcon ?? Sprout;
	const textColor = step.bannerText ?? "#FFFFFF";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative z-20 mx-1 my-2 flex items-center gap-4 overflow-hidden rounded-[22px] px-5 py-4",
		style: {
			background: `linear-gradient(135deg, ${step.bannerBg} 0%, ${step.bannerBorder} 100%)`,
			boxShadow: `0 6px 0 0 ${step.bannerBorder}, 0 10px 24px rgba(74,59,42,0.22)`,
			color: textColor
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute -right-4 -top-6 opacity-20",
				style: { color: textColor },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, {
					className: "h-24 w-24 rotate-12",
					strokeWidth: 1.5
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl shadow-inner",
				style: {
					backgroundColor: `color-mix(in srgb, ${textColor} 20%, transparent)`,
					boxShadow: "0 2px 0 0 rgba(0,0,0,0.12) inset"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "h-7 w-7",
					strokeWidth: 2.2,
					style: { color: textColor }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-extrabold uppercase tracking-widest",
						style: { color: `color-mix(in srgb, ${textColor} 80%, transparent)` },
						children: step.subtitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[19px] font-extrabold leading-tight",
						style: { color: textColor },
						children: step.title
					}),
					step.tagline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 truncate text-[12px] font-medium",
						style: { color: `color-mix(in srgb, ${textColor} 75%, transparent)` },
						children: step.tagline
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-[17px] font-extrabold shadow-sm",
				style: {
					backgroundColor: `color-mix(in srgb, ${textColor} 25%, transparent)`,
					color: textColor
				},
				children: step.palierNum
			})
		]
	});
}
/** Petit badge numéroté qui rappelle la position de l'étape dans le parcours. */
function NumberBadge({ number, color, muted }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute -top-1 -right-1 z-10 grid h-6 w-6 place-items-center rounded-full border-2 bg-surface text-[11px] font-extrabold shadow-sm",
		style: {
			borderColor: muted ? "#D8CCB8" : color,
			color: muted ? "#9C8F79" : color
		},
		children: number
	});
}
/** Quelques étincelles discrètes autour de l'étape en cours, pour un léger effet ludique. */
function CurrentSparkles({ color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkle, {
			"aria-hidden": true,
			className: "absolute -top-3 -left-5 h-3.5 w-3.5 -rotate-12 opacity-70",
			style: { color }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkle, {
			"aria-hidden": true,
			className: "absolute top-2 -right-6 h-2.5 w-2.5 rotate-[18deg] opacity-50",
			style: { color }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkle, {
			"aria-hidden": true,
			className: "absolute -bottom-1 -left-6 h-2 w-2 rotate-6 opacity-40",
			style: { color }
		})
	] });
}
function StepNode({ step, to, isCurrent, color = "#8FBF6F", borderColor = "#5E8E3E", number, onActivate, t }) {
	const navigate = Route.useNavigate();
	const stepLabel = step.kind === "crossword" ? t.parcours.crosswordStep : step.iconType === "branche" ? t.parcours.exerciceStep : t.parcours.coursStep;
	const content = (() => {
		if (step.kind === "header") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PalierBanner, { step });
		if (step.kind === "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex flex-col items-center gap-2.5",
			children: [
				isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-full border-2 bg-surface px-5 py-1.5 text-[14px] font-bold uppercase tracking-wide shadow-[var(--shadow-card)]",
						style: {
							borderColor,
							color: borderColor
						},
						children: t.parcours.start
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: "absolute left-1/2 -bottom-1.5 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 bg-surface",
						style: { borderColor }
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							className: "absolute inset-0 -m-2 rounded-full animate-ping",
							style: { backgroundColor: color + "4D" }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentSparkles, { color: borderColor })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative grid h-24 w-24 place-items-center rounded-full border-4 text-surface shadow-[var(--shadow-card)]",
							style: {
								borderColor,
								background: `radial-gradient(circle at 32% 28%, color-mix(in srgb, ${color} 70%, white) 0%, ${color} 60%)`
							},
							children: step.iconType === "branche" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrancheExerciseIcon, { className: "h-13 w-13" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, {
								className: "h-11 w-11",
								strokeWidth: 2.5
							})
						}),
						number != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberBadge, {
							number,
							color: borderColor
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-bold uppercase tracking-wide",
					style: { color: borderColor },
					children: stepLabel
				})
			]
		});
		if (step.kind === "locked") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex flex-col items-center gap-2.5",
			children: [
				isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-full border-2 bg-surface px-5 py-1.5 text-[14px] font-bold uppercase tracking-wide shadow-[var(--shadow-card)]",
						style: {
							borderColor,
							color: borderColor
						},
						children: t.parcours.start
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: "absolute left-1/2 -bottom-1.5 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 bg-surface",
						style: { borderColor }
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							className: "absolute inset-0 -m-2 rounded-full animate-ping",
							style: { backgroundColor: color + "4D" }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentSparkles, { color: borderColor })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"aria-label": t.parcours.lockedAria,
							className: cn("grid place-items-center rounded-full border-4 shadow-[var(--shadow-card)]", isCurrent ? "h-24 w-24 text-surface" : "h-16 w-16 border-disabled bg-disabled text-text-secondary"),
							style: isCurrent ? {
								borderColor,
								background: `radial-gradient(circle at 32% 28%, color-mix(in srgb, ${color} 70%, white) 0%, ${color} 60%)`
							} : void 0,
							children: [step.iconType === "branche" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrancheExerciseIcon, { className: cn(isCurrent ? "h-13 w-13" : "h-8 w-8 opacity-70") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, {
								className: cn(isCurrent ? "h-11 w-11" : "h-7 w-7 opacity-70"),
								strokeWidth: 2.5
							}), !isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "sr-only" })]
						}),
						number != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberBadge, {
							number,
							color: borderColor,
							muted: !isCurrent
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("text-[11px] font-bold uppercase tracking-wide", !isCurrent && "text-text-secondary/70"),
					style: isCurrent ? { color: borderColor } : void 0,
					children: stepLabel
				})
			]
		});
		if (step.kind === "crossword") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex flex-col items-center gap-2.5",
			children: [
				isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-full border-2 bg-surface px-5 py-1.5 text-[14px] font-bold uppercase tracking-wide shadow-[var(--shadow-card)]",
						style: {
							borderColor,
							color: borderColor
						},
						children: t.parcours.start
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: "absolute left-1/2 -bottom-1.5 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 bg-surface",
						style: { borderColor }
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentSparkles, { color: borderColor }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"aria-label": t.parcours.crosswordStep,
							className: cn("grid place-items-center rounded-2xl border-4 shadow-[var(--shadow-card)]", isCurrent ? "h-20 w-20 text-surface" : "h-14 w-14 border-disabled bg-disabled text-text-secondary"),
							style: isCurrent ? {
								borderColor,
								background: `radial-gradient(circle at 32% 28%, color-mix(in srgb, ${color} 70%, white) 0%, ${color} 60%)`
							} : void 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, {
								className: cn(isCurrent ? "h-9 w-9" : "h-6 w-6 opacity-70"),
								strokeWidth: 2.2
							})
						}),
						number != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberBadge, {
							number,
							color: borderColor,
							muted: !isCurrent
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("text-[11px] font-bold uppercase tracking-wide text-center", !isCurrent && "text-text-secondary/70"),
					style: isCurrent ? { color: borderColor } : void 0,
					children: stepLabel
				})
			]
		});
		if (step.kind === "bonus") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-label": t.parcours.bonusAria,
			className: "grid h-16 w-16 place-items-center rounded-2xl border-4 border-disabled bg-disabled text-text-secondary shadow-[var(--shadow-card)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 40 40",
				className: "h-8 w-8",
				"aria-hidden": true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M6 16 H34 L30 34 H10 Z",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "3",
						strokeLinejoin: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M10 22 H30 M12 28 H28",
						stroke: "currentColor",
						strokeWidth: "2.5",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M12 16 C14 8 26 8 28 16",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "3",
						strokeLinecap: "round"
					})
				]
			})
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-label": t.parcours.medalAria,
				className: "grid h-20 w-20 place-items-center overflow-hidden rounded-full border-4 border-disabled bg-disabled shadow-[var(--shadow-card)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: amani_victoire_palier_badge_default,
					alt: "",
					"aria-hidden": true,
					className: "h-full w-full object-cover",
					draggable: false
				})
			})
		});
	})();
	if (to) {
		const handleNavigate = () => {
			onActivate?.();
			if (typeof sessionStorage !== "undefined") {
				const scrollEl = document.getElementById("app-main-scroll");
				if (scrollEl) sessionStorage.setItem("accueil_scroll_top", String(scrollEl.scrollTop));
			}
			if (typeof to === "string") navigate({ to });
			else navigate({
				to: to.pathname,
				search: to.search
			});
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "link",
			tabIndex: 0,
			onClick: handleNavigate,
			onKeyDown: (e) => {
				if (e.key === "Enter" || e.key === " ") handleNavigate();
			},
			className: "no-underline block transition-transform hover:scale-105 active:scale-95 cursor-pointer",
			children: content
		});
	}
	return content;
}
//#endregion
export { ParcoursBranche as component };
