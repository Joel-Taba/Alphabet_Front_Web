//#region node_modules/.nitro/vite/services/ssr/assets/traceValidation-0BWpiBQq.js
/** Échantillonne un chemin SVG en N points régulièrement espacés. */
function sampleSVGPath(pathD, numPoints = 40) {
	if (typeof window === "undefined") return [];
	try {
		const svgNS = "http://www.w3.org/2000/svg";
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute("width", "0");
		svg.setAttribute("height", "0");
		svg.style.position = "absolute";
		svg.style.visibility = "hidden";
		const pathEl = document.createElementNS(svgNS, "path");
		pathEl.setAttribute("d", pathD);
		svg.appendChild(pathEl);
		document.body.appendChild(svg);
		const total = pathEl.getTotalLength();
		const pts = [];
		for (let i = 0; i < numPoints; i++) {
			const pt = pathEl.getPointAtLength(i / (numPoints - 1) * total);
			pts.push({
				x: pt.x,
				y: pt.y
			});
		}
		document.body.removeChild(svg);
		return pts;
	} catch {
		return [];
	}
}
var COVERAGE_MIN = .88;
var OFF_PATH_MULTIPLIER = 1.3;
var OFF_PATH_MAX_RATIO = .12;
var ORDER_BACKWARD_TOLERANCE = 2;
var ORDER_SCORE_MIN = .8;
var START_END_MULTIPLIER = 1.6;
var MIN_USER_POINTS = 6;
/** Validation rigoureuse du tracé en 5 critères, tous requis pour valider. */
function validateTrace(userPts, refPts, tolerancePx) {
	if (userPts.length < MIN_USER_POINTS || refPts.length < 2) return {
		valid: false,
		coverage: 0,
		failReason: "too_few_points"
	};
	let coveredCount = 0;
	for (const rp of refPts) for (const up of userPts) if (Math.hypot(up.x - rp.x, up.y - rp.y) <= tolerancePx) {
		coveredCount++;
		break;
	}
	const coverage = coveredCount / refPts.length;
	if (coverage < COVERAGE_MIN) return {
		valid: false,
		coverage,
		failReason: `coverage_${Math.round(coverage * 100)}%`
	};
	let offPath = 0;
	for (const up of userPts) {
		let minDist = Infinity;
		for (const rp of refPts) {
			const d = Math.hypot(up.x - rp.x, up.y - rp.y);
			if (d < minDist) minDist = d;
		}
		if (minDist > tolerancePx * OFF_PATH_MULTIPLIER) offPath++;
	}
	const offRatio = offPath / userPts.length;
	if (offRatio > OFF_PATH_MAX_RATIO) return {
		valid: false,
		coverage,
		failReason: `off_path_${Math.round(offRatio * 100)}%`
	};
	const refIndices = userPts.map((up) => {
		let minD = Infinity, best = 0;
		refPts.forEach((rp, i) => {
			const d = Math.hypot(up.x - rp.x, up.y - rp.y);
			if (d < minD) {
				minD = d;
				best = i;
			}
		});
		return best;
	});
	let backwardSteps = 0;
	for (let i = 1; i < refIndices.length; i++) if (refIndices[i] < refIndices[i - 1] - ORDER_BACKWARD_TOLERANCE) backwardSteps++;
	const orderScore = 1 - backwardSteps / Math.max(1, refIndices.length - 1);
	if (orderScore < ORDER_SCORE_MIN) return {
		valid: false,
		coverage,
		failReason: `order_${Math.round(orderScore * 100)}%`
	};
	const firstUser = userPts[0];
	const quarterIdx = Math.floor(refPts.length / 4);
	let nearStart = false;
	for (let i = 0; i <= quarterIdx; i++) if (Math.hypot(firstUser.x - refPts[i].x, firstUser.y - refPts[i].y) <= tolerancePx * START_END_MULTIPLIER) {
		nearStart = true;
		break;
	}
	if (!nearStart) return {
		valid: false,
		coverage,
		failReason: "wrong_start"
	};
	const lastUser = userPts[userPts.length - 1];
	const threeQuarterIdx = Math.floor(refPts.length * 3 / 4);
	let nearEnd = false;
	for (let i = threeQuarterIdx; i < refPts.length; i++) if (Math.hypot(lastUser.x - refPts[i].x, lastUser.y - refPts[i].y) <= tolerancePx * START_END_MULTIPLIER) {
		nearEnd = true;
		break;
	}
	if (!nearEnd) return {
		valid: false,
		coverage,
		failReason: "wrong_end"
	};
	return {
		valid: true,
		coverage
	};
}
//#endregion
export { validateTrace as n, sampleSVGPath as t };
