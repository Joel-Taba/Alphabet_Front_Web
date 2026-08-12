import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as Volume2, v as RotateCcw, w as Lock } from "../_libs/lucide-react.mjs";
import { t as AmaniMascot } from "./AmaniMascot-A-Eqgs-C.mjs";
import { n as validateTrace, t as sampleSVGPath } from "./traceValidation-0BWpiBQq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RepetitionRow-MvHoq_Tw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OccurrenceCanvas({ entry, state, isActive, onSuccess, onRetry, w, h, tolerancePct }) {
	const canvasRef = (0, import_react.useRef)(null);
	const userPointsRef = (0, import_react.useRef)([]);
	const refPointsRef = (0, import_react.useRef)([]);
	const isDrawingRef = (0, import_react.useRef)(false);
	const [localStatus, setLocalStatus] = (0, import_react.useState)(state.status);
	(0, import_react.useEffect)(() => {
		setLocalStatus(state.status);
	}, [state.status]);
	(0, import_react.useEffect)(() => {
		refPointsRef.current = sampleSVGPath(entry.pathD, 30);
	}, [entry.pathD]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const dpr = window.devicePixelRatio || 1;
		canvas.width = w * dpr;
		canvas.height = h * dpr;
		const ctx = canvas.getContext("2d");
		if (ctx) ctx.scale(dpr, dpr);
	}, [w, h]);
	const drawSuccessPath = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, w, h);
		const sc = Math.min(w / 200, h / 200);
		const ox = (w - 200 * sc) / 2;
		const oy = (h - 200 * sc) / 2;
		const refPts = refPointsRef.current;
		if (refPts.length < 2) return;
		ctx.beginPath();
		ctx.moveTo(refPts[0].x * sc + ox, refPts[0].y * sc + oy);
		for (let i = 1; i < refPts.length; i++) ctx.lineTo(refPts[i].x * sc + ox, refPts[i].y * sc + oy);
		if (entry.family === "point") {
			ctx.closePath();
			ctx.fillStyle = entry.strokeColor;
			ctx.fill();
		}
		ctx.strokeStyle = entry.strokeColor;
		ctx.lineWidth = 3.5;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.stroke();
	}, [
		w,
		h,
		entry.strokeColor
	]);
	(0, import_react.useEffect)(() => {
		if (localStatus === "success") drawSuccessPath();
	}, [localStatus, drawSuccessPath]);
	const svgToCanvas = (pt) => {
		const sc = Math.min(w / 200, h / 200);
		const ox = (w - 200 * sc) / 2;
		const oy = (h - 200 * sc) / 2;
		return {
			x: pt.x * sc + ox,
			y: pt.y * sc + oy
		};
	};
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
		if (!isActive || localStatus === "success") return;
		e.preventDefault();
		canvasRef.current?.setPointerCapture(e.pointerId);
		isDrawingRef.current = true;
		setLocalStatus("drawing");
		userPointsRef.current = [];
		const ctx = canvasRef.current?.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, w, h);
		const pt = canvasCoords(e);
		userPointsRef.current.push(svgCoords(pt));
		ctx.beginPath();
		ctx.moveTo(pt.x, pt.y);
		ctx.strokeStyle = "#5BAA6A";
		ctx.lineWidth = 3.5;
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
		const tolerancePx = tolerancePct / 100 * 200;
		if (validateTrace(userPointsRef.current, refPointsRef.current, tolerancePx).valid) {
			setLocalStatus("success");
			setTimeout(onSuccess, 600);
		} else {
			setLocalStatus("retry");
			setTimeout(() => {
				const canvas = canvasRef.current;
				if (!canvas) return;
				canvas.getContext("2d")?.clearRect(0, 0, w, h);
				setLocalStatus("idle");
				onRetry();
			}, 1200);
		}
	};
	const handleClear = () => {
		if (localStatus === "success") return;
		(canvasRef.current?.getContext("2d"))?.clearRect(0, 0, w, h);
		userPointsRef.current = [];
		setLocalStatus("idle");
	};
	const startPx = svgToCanvas({
		x: entry.startXY[0],
		y: entry.startXY[1]
	});
	const endPx = entry.endXY ? svgToCanvas({
		x: entry.endXY[0],
		y: entry.endXY[1]
	}) : null;
	const startEndMerged = !!entry.endXY && entry.startXY[0] === entry.endXY[0] && entry.startXY[1] === entry.endXY[1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative shrink-0 rounded-[10px] overflow-hidden border",
		style: {
			width: w,
			height: h,
			borderColor: localStatus === "success" ? "#8FBF6F" : isActive ? "#A9784F40" : "#4A3B2A10",
			boxShadow: localStatus === "success" ? "0 0 0 2px #8FBF6F40" : void 0
		},
		children: [
			localStatus !== "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 200 200",
				className: "absolute inset-0 w-full h-full pointer-events-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: entry.pathD,
					stroke: localStatus === "retry" ? "#D9A84A" : "#9BB5CC",
					strokeWidth: 2.5,
					strokeDasharray: "7 5",
					strokeLinecap: "round",
					fill: entry.family === "point" ? localStatus === "retry" ? "#D9A84A" : "#9BB5CC" : "none",
					opacity: localStatus === "retry" ? .9 : .75
				})
			}),
			(localStatus === "idle" || localStatus === "retry") && isActive && (startEndMerged ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute w-2.5 h-2.5 rounded-full border border-white shadow pointer-events-none z-10 animate-start-end-alternate",
				style: {
					left: startPx.x - 5,
					top: startPx.y - 5
				},
				"aria-label": "Point de départ et d'arrivée"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute w-2.5 h-2.5 rounded-full bg-[#5BAA6A] border border-white shadow pointer-events-none z-10 animate-pulse",
				style: {
					left: startPx.x - 5,
					top: startPx.y - 5
				},
				"aria-label": "Point de départ"
			}), endPx && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute w-2.5 h-2.5 rounded-full bg-[#E05252] border border-white shadow pointer-events-none z-10 animate-pulse",
				style: {
					left: endPx.x - 5,
					top: endPx.y - 5
				},
				"aria-label": "Point d'arrivée"
			})] })),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				onPointerDown: handlePointerDown,
				onPointerMove: handlePointerMove,
				onPointerUp: handlePointerUp,
				onPointerLeave: handlePointerUp,
				className: cn("absolute inset-0 w-full h-full touch-none", !isActive || localStatus === "success" ? "cursor-default" : "cursor-crosshair"),
				"aria-label": "Zone de tracé"
			}),
			localStatus === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center bg-[#8FBF6F]/10 z-20 pointer-events-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "animate-in zoom-in duration-300",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmaniMascot, {
						pose: "mini_reussite",
						size: "avatar"
					})
				})
			}),
			localStatus === "retry" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-[#F0C040]/10 z-20 pointer-events-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmaniMascot, {
					pose: "mini_reessai",
					size: "avatar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[10px] font-bold text-[#8A6800] text-center px-1 leading-tight",
					children: [
						"Presque !",
						"\n",
						"On réessaie"
					]
				})]
			}),
			isActive && localStatus !== "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: handleClear,
				"aria-label": "Effacer le tracé",
				className: "absolute bottom-1 right-1 z-30 w-6 h-6 rounded-full bg-[#E05252]/20 text-[#E05252] flex items-center justify-center hover:bg-[#E05252] hover:text-white transition-colors",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3 h-3" })
			})
		]
	});
}
function RepetitionRow({ entry, label, onSpeak, badge, repetitions, tolerance, doneLabel, onAllDone, locked = false }) {
	const [occurrences, setOccurrences] = (0, import_react.useState)(() => Array.from({ length: repetitions }, () => ({
		status: "idle",
		attempts: 0
	})));
	const [activeIndex, setActiveIndex] = (0, import_react.useState)(0);
	const [allDone, setAllDone] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setOccurrences(Array.from({ length: repetitions }, () => ({
			status: "idle",
			attempts: 0
		})));
		setActiveIndex(0);
		setAllDone(false);
	}, [repetitions, entry.id]);
	const handleSuccess = (0, import_react.useCallback)((idx) => {
		setOccurrences((prev) => {
			const next = [...prev];
			next[idx] = {
				...next[idx],
				status: "success"
			};
			return next;
		});
		if (idx + 1 < repetitions) setActiveIndex(idx + 1);
		else {
			setAllDone(true);
			onAllDone?.();
		}
	}, [repetitions, onAllDone]);
	const handleRetry = (0, import_react.useCallback)((idx) => {
		setOccurrences((prev) => {
			const next = [...prev];
			next[idx] = {
				...next[idx],
				status: "idle",
				attempts: (next[idx].attempts || 0) + 1
			};
			return next;
		});
	}, []);
	const OCC_W = 100;
	const OCC_H = 140;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col rounded-[20px] overflow-hidden border transition-all", locked ? "border-[#4A3B2A]/10 opacity-50" : allDone ? "border-[#8FBF6F]/60 shadow-[0_4px_16px_rgba(143,191,111,0.18)]" : "border-[#4A3B2A]/10 shadow-[0_2px_8px_rgba(74,59,42,0.08)]"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-4 py-2.5 bg-[#FBF6EC] border-b border-[#4A3B2A]/10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					badge,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[14px] font-bold text-[#4A3B2A]",
						children: label
					}),
					allDone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[13px] text-[#8FBF6F] font-bold",
						children: ["✓ ", doneLabel]
					})
				]
			}), locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-8 h-8 grid place-items-center rounded-full bg-[#4A3B2A]/10 text-[#7A6A55]",
				"aria-label": "Étape verrouillée",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onSpeak,
				"aria-label": label,
				className: "w-8 h-8 grid place-items-center rounded-full bg-[#A9784F]/15 text-[#4A3B2A] hover:bg-[#A9784F] hover:text-white transition-colors",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-4 h-4" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-x-auto",
			style: {
				backgroundColor: "#FFFFFF",
				minHeight: 164
			},
			children: [[
				20,
				45,
				70,
				95,
				115,
				135
			].map((y, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-0 right-0",
				style: {
					top: y + 12,
					height: i === 3 ? 1.5 : 1,
					backgroundColor: i === 3 ? "#E05252" : "#4A90E2",
					opacity: .8
				}
			}, y)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex items-center gap-2.5 px-3 py-3",
				children: [occurrences.map((occ, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OccurrenceCanvas, {
					entry,
					state: occ,
					isActive: idx === activeIndex && !allDone && !locked,
					onSuccess: () => handleSuccess(idx),
					onRetry: () => handleRetry(idx),
					w: OCC_W,
					h: OCC_H,
					tolerancePct: tolerance
				}, `${entry.id}-occ-${idx}`)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-1.5 ml-1",
					children: occurrences.map((occ, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-2 h-2 rounded-full transition-colors",
						style: { backgroundColor: occ.status === "success" ? "#8FBF6F" : idx === activeIndex ? "#A9784F" : "#4A3B2A20" }
					}, idx))
				})]
			})]
		})]
	});
}
//#endregion
export { RepetitionRow as t };
