globalThis.__nitro_main__ = import.meta.url;
import { a as FastResponse, n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx+unenv.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-08-12T14:34:48.976Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/Button-BBEV-fWa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c13-4ARWpyMHGrJlIVrnX9o6/fghst8\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 3091,
		"path": "../public/assets/Button-BBEV-fWa.js"
	},
	"/assets/EvaluationTimer-Bo641J9B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c47-8hbplFDfov8eNQ28NfA+pgGQvZI\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 3143,
		"path": "../public/assets/EvaluationTimer-Bo641J9B.js"
	},
	"/assets/CahierFrame-DcrCA9dq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25a-HbxT2cs6Bs82LigvMPajEo5Smps\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 602,
		"path": "../public/assets/CahierFrame-DcrCA9dq.js"
	},
	"/assets/ExerciseCompletePopup-CQNQOn_2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7ae-aaEy1m8/D04q1DR4BICyU1PiiYM\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 1966,
		"path": "../public/assets/ExerciseCompletePopup-CQNQOn_2.js"
	},
	"/assets/LetterTraceCell-jWzU3sFa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fa3-lueOBFhg6J6fef7groYmWR31BEw\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 4003,
		"path": "../public/assets/LetterTraceCell-jWzU3sFa.js"
	},
	"/assets/Match-C6ayxrJr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"befe-il4OEtbkL2t7m2pgafhlqPfR2ug\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 48894,
		"path": "../public/assets/Match-C6ayxrJr.js"
	},
	"/assets/MobileShell-CuSpUwUk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75a-NPZlL8udgUUZvC1rEoyyySmryL0\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 1882,
		"path": "../public/assets/MobileShell-CuSpUwUk.js"
	},
	"/assets/RepetitionRow-D3kZEPlS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1df0-Oakpdm5J3kx/iv94//+MSgj//RA\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 7664,
		"path": "../public/assets/RepetitionRow-D3kZEPlS.js"
	},
	"/assets/SignGlyph-BmAqa4-C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10b6-7LhV2j+P9gBTt4nhgojfOVBattE\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 4278,
		"path": "../public/assets/SignGlyph-BmAqa4-C.js"
	},
	"/assets/_app-BO9my3w1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1355-A9iLytyz4U6pEGjvrYrctV0VrbY\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 4949,
		"path": "../public/assets/_app-BO9my3w1.js"
	},
	"/assets/_app.accueil-nJtlOuTT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4046-ohsP3YoP4UglcsTqNz1Py9zifOs\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 16454,
		"path": "../public/assets/_app.accueil-nJtlOuTT.js"
	},
	"/assets/_app.bibliotheque-CtoDGhvx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"153f1-dm1ohHJFtl5XgkzeMB2f5bjj/VE\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 87025,
		"path": "../public/assets/_app.bibliotheque-CtoDGhvx.js"
	},
	"/assets/_app.communaute-CGXdyGxe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"177d-MySM19Kg84goK4zae5pjRUj7aH8\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 6013,
		"path": "../public/assets/_app.communaute-CGXdyGxe.js"
	},
	"/assets/_app.mon-profil-Caxuu9DJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5d56-R4IvcnWlxZnvR/h0c8FpjHpIT+o\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 23894,
		"path": "../public/assets/_app.mon-profil-Caxuu9DJ.js"
	},
	"/assets/_app.plus-BxZPMXDf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"123b-e3flGZTO2fbjqU1r1MLc23DLhuM\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 4667,
		"path": "../public/assets/_app.plus-BxZPMXDf.js"
	},
	"/assets/_app.reglages-BBDUPJ9F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d4-xc38iGBBpcqbR73EvhL6pP/Kblw\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 212,
		"path": "../public/assets/_app.reglages-BBDUPJ9F.js"
	},
	"/assets/amani-accueil-CaLzI707.png": {
		"type": "image/png",
		"etag": "\"591b8-TABeaI0PkxO4j/oL9R7evBvWZBQ\"",
		"mtime": "2026-08-12T14:34:47.202Z",
		"size": 364984,
		"path": "../public/assets/amani-accueil-CaLzI707.png"
	},
	"/assets/amani-celebration-C8VYMps_.png": {
		"type": "image/png",
		"etag": "\"68a4d-9gJSjzkzr4Q9aUCB67BTeGBxEOA\"",
		"mtime": "2026-08-12T14:34:47.202Z",
		"size": 428621,
		"path": "../public/assets/amani-celebration-C8VYMps_.png"
	},
	"/assets/amani-curiosite-DR_FwNcV.png": {
		"type": "image/png",
		"etag": "\"6fe66-f96GQ8y8VHmGriVG2wpogakXdGg\"",
		"mtime": "2026-08-12T14:34:47.202Z",
		"size": 458342,
		"path": "../public/assets/amani-curiosite-DR_FwNcV.png"
	},
	"/assets/amani-demonstration-CAeJeVSn.png": {
		"type": "image/png",
		"etag": "\"5500a-c3XJh6isfc31one3w9yqeWPGTbk\"",
		"mtime": "2026-08-12T14:34:47.202Z",
		"size": 348170,
		"path": "../public/assets/amani-demonstration-CAeJeVSn.png"
	},
	"/assets/amani-dessin-BYo8_fBz.png": {
		"type": "image/png",
		"etag": "\"34eb1-LjLm6Irfy24FJAKa2bq7UeWhRlE\"",
		"mtime": "2026-08-12T14:34:47.202Z",
		"size": 216753,
		"path": "../public/assets/amani-dessin-BYo8_fBz.png"
	},
	"/assets/amani-encouragement-CYP97xvu.png": {
		"type": "image/png",
		"etag": "\"60894-LlQpm8zi5lZypXmcSdpVeG6dhGU\"",
		"mtime": "2026-08-12T14:34:47.202Z",
		"size": 395412,
		"path": "../public/assets/amani-encouragement-CYP97xvu.png"
	},
	"/assets/amani-emerveillement-BZ8y7H9E.png": {
		"type": "image/png",
		"etag": "\"75070-PCHzWerrkHTNRi1dhLtPqw23YPA\"",
		"mtime": "2026-08-12T14:34:47.202Z",
		"size": 479344,
		"path": "../public/assets/amani-emerveillement-BZ8y7H9E.png"
	},
	"/assets/amani-inscription-ZLDCh20L.jpeg": {
		"type": "image/jpeg",
		"etag": "\"5727-7lnuuX+zej0R7qTxfK2OTau6988\"",
		"mtime": "2026-08-12T14:34:47.205Z",
		"size": 22311,
		"path": "../public/assets/amani-inscription-ZLDCh20L.jpeg"
	},
	"/assets/amani-invitation-DDx8PFjy.png": {
		"type": "image/png",
		"etag": "\"684b1-La/6o51Ie/bzb2I8ckx7Zqx+70g\"",
		"mtime": "2026-08-12T14:34:47.206Z",
		"size": 427185,
		"path": "../public/assets/amani-invitation-DDx8PFjy.png"
	},
	"/assets/amani-perdu-C62jcyCv.png": {
		"type": "image/png",
		"etag": "\"3001a-xn2XJ8Kb0ntFBSbzK5aASQi9vO0\"",
		"mtime": "2026-08-12T14:34:47.208Z",
		"size": 196634,
		"path": "../public/assets/amani-perdu-C62jcyCv.png"
	},
	"/assets/amani-mini-reussite-D0P2S-9B.png": {
		"type": "image/png",
		"etag": "\"6d82c-zZSJuGRtej9U0fHE7JHTt1Ckj5A\"",
		"mtime": "2026-08-12T14:34:47.208Z",
		"size": 448556,
		"path": "../public/assets/amani-mini-reussite-D0P2S-9B.png"
	},
	"/assets/amani-reconfort-DFq0B1eT.png": {
		"type": "image/png",
		"etag": "\"3e7a6-VNe9FRigzlkX8ROmoRVxoU5ZAR8\"",
		"mtime": "2026-08-12T14:34:47.209Z",
		"size": 255910,
		"path": "../public/assets/amani-reconfort-DFq0B1eT.png"
	},
	"/assets/amani-podium-B10ck-nh.png": {
		"type": "image/png",
		"etag": "\"70667-DMN5iefILu+6kgVpArKHk8uYUac\"",
		"mtime": "2026-08-12T14:34:47.208Z",
		"size": 460391,
		"path": "../public/assets/amani-podium-B10ck-nh.png"
	},
	"/assets/amani-reflexion-CWXIPbGS.png": {
		"type": "image/png",
		"etag": "\"356b0-06BzgHj7c7Eg1dqlxEx6nIDgxUM\"",
		"mtime": "2026-08-12T14:34:47.210Z",
		"size": 218800,
		"path": "../public/assets/amani-reflexion-CWXIPbGS.png"
	},
	"/assets/amani-veille-DHce1rLU.png": {
		"type": "image/png",
		"etag": "\"2fc9d-BgXCJ0/95XAPftjzRT/yOuc+Glk\"",
		"mtime": "2026-08-12T14:34:47.211Z",
		"size": 195741,
		"path": "../public/assets/amani-veille-DHce1rLU.png"
	},
	"/assets/amani-victoire-palier-CI_rSkT5.png": {
		"type": "image/png",
		"etag": "\"62239-KZwt1Z/9hLGr6fjHdTnamsfMYO4\"",
		"mtime": "2026-08-12T14:34:47.211Z",
		"size": 401977,
		"path": "../public/assets/amani-victoire-palier-CI_rSkT5.png"
	},
	"/assets/arrow-left-kdj5vCjb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-eT0YY6wUSDCFCz4ObVk5l4Jl6GE\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 165,
		"path": "../public/assets/arrow-left-kdj5vCjb.js"
	},
	"/assets/amani-victoire-palier-badge-IiJasJT_.png": {
		"type": "image/png",
		"etag": "\"5d3bf-YqCJ+HaBQKHLsCVXmOss68Yk1Tk\"",
		"mtime": "2026-08-12T14:34:47.212Z",
		"size": 381887,
		"path": "../public/assets/amani-victoire-palier-badge-IiJasJT_.png"
	},
	"/assets/baloo-2-latin-400-normal-D8VfTcZx.woff2": {
		"type": "font/woff2",
		"etag": "\"49e8-BOPqhUMK+yonaUjg+/znN8eyCN0\"",
		"mtime": "2026-08-12T14:34:47.212Z",
		"size": 18920,
		"path": "../public/assets/baloo-2-latin-400-normal-D8VfTcZx.woff2"
	},
	"/assets/baloo-2-latin-400-normal-DCk_bY-6.woff": {
		"type": "font/woff",
		"etag": "\"5a48-KlQZDPH4ixywZEcJgeeF8Ez8mWM\"",
		"mtime": "2026-08-12T14:34:47.212Z",
		"size": 23112,
		"path": "../public/assets/baloo-2-latin-400-normal-DCk_bY-6.woff"
	},
	"/assets/baloo-2-latin-600-normal-B4tNaogw.woff": {
		"type": "font/woff",
		"etag": "\"5bf8-CYLgi98oFg+ErJj5AAVqUmakF9I\"",
		"mtime": "2026-08-12T14:34:47.212Z",
		"size": 23544,
		"path": "../public/assets/baloo-2-latin-600-normal-B4tNaogw.woff"
	},
	"/assets/baloo-2-latin-600-normal-tIfxVoAe.woff2": {
		"type": "font/woff2",
		"etag": "\"4c28-C8VnKtjgmYtjokvlZImEMQG+pS0\"",
		"mtime": "2026-08-12T14:34:47.212Z",
		"size": 19496,
		"path": "../public/assets/baloo-2-latin-600-normal-tIfxVoAe.woff2"
	},
	"/assets/baloo-2-latin-700-normal-CqTg7A15.woff2": {
		"type": "font/woff2",
		"etag": "\"4bec-y/IowzmFgWqtMfLy7fXVAUHQC18\"",
		"mtime": "2026-08-12T14:34:47.212Z",
		"size": 19436,
		"path": "../public/assets/baloo-2-latin-700-normal-CqTg7A15.woff2"
	},
	"/assets/book-open-Bs_123YE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117-MnIGqA03Zncc74uf+FXeCQGGY5c\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 279,
		"path": "../public/assets/book-open-Bs_123YE.js"
	},
	"/assets/baloo-2-latin-700-normal-Ld3Zm3l2.woff": {
		"type": "font/woff",
		"etag": "\"5b70-Lb1Mu2rjN0YAfvb+hVIMBbpMZ6A\"",
		"mtime": "2026-08-12T14:34:47.212Z",
		"size": 23408,
		"path": "../public/assets/baloo-2-latin-700-normal-Ld3Zm3l2.woff"
	},
	"/assets/chevron-left-CCPPXlZl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-lexuCg4Eg045pc7szYUyAj5luo4\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 130,
		"path": "../public/assets/chevron-left-CCPPXlZl.js"
	},
	"/assets/chevron-right-CEREXFJU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-LBBY6psHQvSzkSFopbfBRungMi4\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 130,
		"path": "../public/assets/chevron-right-CEREXFJU.js"
	},
	"/assets/comic-neue-latin-300-normal-DMqQrJ-7.woff": {
		"type": "font/woff",
		"etag": "\"4114-jjtqfMldL89gIeemzYdAaJaQM7g\"",
		"mtime": "2026-08-12T14:34:47.212Z",
		"size": 16660,
		"path": "../public/assets/comic-neue-latin-300-normal-DMqQrJ-7.woff"
	},
	"/assets/comic-neue-latin-300-normal-DvCJ-eRb.woff2": {
		"type": "font/woff2",
		"etag": "\"4c30-QnCFbnQGU25VjuJwkTMK30Z3OFc\"",
		"mtime": "2026-08-12T14:34:47.212Z",
		"size": 19504,
		"path": "../public/assets/comic-neue-latin-300-normal-DvCJ-eRb.woff2"
	},
	"/assets/amani-mini-reessai-cqfjkg3n.png": {
		"type": "image/png",
		"etag": "\"7841f-+TM6H/dkMo9g91sCeJTjhcytrj8\"",
		"mtime": "2026-08-12T14:34:47.207Z",
		"size": 492575,
		"path": "../public/assets/amani-mini-reessai-cqfjkg3n.png"
	},
	"/assets/cours._family-Cha54-ZP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22d5-oTiYxCf79y2WOV+8/VGMoP4IF44\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 8917,
		"path": "../public/assets/cours._family-Cha54-ZP.js"
	},
	"/assets/cours.lettres-CZelWg-Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1335-j7CD1zcbQfGtEPHtmvLgQUpHvH8\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 4917,
		"path": "../public/assets/cours.lettres-CZelWg-Y.js"
	},
	"/assets/cours.lettres._char-DGXwmryx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"115e-sQDKf0IfF5yRBfb0nNaV77C2uIc\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 4446,
		"path": "../public/assets/cours.lettres._char-DGXwmryx.js"
	},
	"/assets/cours.lettres.formation._char-DBFQJwaz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2266-z+qYlADWcisVD/arcMhg8+Y/iQs\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 8806,
		"path": "../public/assets/cours.lettres.formation._char-DBFQJwaz.js"
	},
	"/assets/cours.mots._groupId-CIzBtJLd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13d2-YtUCeN/jGVkYb9XiMmYqdxI6M34\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 5074,
		"path": "../public/assets/cours.mots._groupId-CIzBtJLd.js"
	},
	"/assets/cours.syllabes._consonant-BLJkl4Hs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20f0-Pq1wJo7KqjJ122CqfFgS5pacFh8\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 8432,
		"path": "../public/assets/cours.syllabes._consonant-BLJkl4Hs.js"
	},
	"/assets/createLucideIcon-CwVQAepC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a0-He58XfhU2YXbMxqjMNd6Kwi00IA\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 1184,
		"path": "../public/assets/createLucideIcon-CwVQAepC.js"
	},
	"/assets/crosswordGenerator-Bs1mJM_G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2624-7KheANBJzxpIYp1/8Tu3H26vc4s\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 9764,
		"path": "../public/assets/crosswordGenerator-Bs1mJM_G.js"
	},
	"/assets/dancing-script-latin-700-normal-CX8AaSVl.woff2": {
		"type": "font/woff2",
		"etag": "\"6364-4v7Q3aXlNEjxHfk+B5xKFybg8Q0\"",
		"mtime": "2026-08-12T14:34:47.212Z",
		"size": 25444,
		"path": "../public/assets/dancing-script-latin-700-normal-CX8AaSVl.woff2"
	},
	"/assets/dancing-script-latin-700-normal-LI5MgW9m.woff": {
		"type": "font/woff",
		"etag": "\"77a8-g0rzWqDOJF5yutHEq6wVCX/ifgw\"",
		"mtime": "2026-08-12T14:34:47.212Z",
		"size": 30632,
		"path": "../public/assets/dancing-script-latin-700-normal-LI5MgW9m.woff"
	},
	"/assets/exercice-Cgo8ZWwp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"108-YXGAz0mjmKMs16GJQkSLRBJiabI\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 264,
		"path": "../public/assets/exercice-Cgo8ZWwp.js"
	},
	"/assets/exercice-intro-CpLw16ML.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e2c-E/wDYnUJSQPr4MfKRsBY1RykP0c\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 3628,
		"path": "../public/assets/exercice-intro-CpLw16ML.js"
	},
	"/assets/exercice-liste-BLp1gzH3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c9d-Sr441rPeRWZvm6vtuDb6RK/nZZc\"",
		"mtime": "2026-08-12T14:34:47.200Z",
		"size": 7325,
		"path": "../public/assets/exercice-liste-BLp1gzH3.js"
	},
	"/assets/exercice.lettre._char-BCwa-siX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2fcb-ZDEoTpqTQs+O87hsr6GpopkD5mo\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 12235,
		"path": "../public/assets/exercice.lettre._char-BCwa-siX.js"
	},
	"/assets/exercice.mots-croises._puzzleId-BkMY1wig.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7e4-9GYQN42KSpco5jqc6rqhg1IJnro\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 2020,
		"path": "../public/assets/exercice.mots-croises._puzzleId-BkMY1wig.js"
	},
	"/assets/exercice.mots._groupId-gSH45VsH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"161a-MrMp+DpWr3K+C8VGwq6T2MlZJn0\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 5658,
		"path": "../public/assets/exercice.mots._groupId-gSH45VsH.js"
	},
	"/assets/exercice.syllabes._consonant-nEzqvISp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"179e-9vjkhl5pn0ZURP2E3N+YWL5wRAU\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 6046,
		"path": "../public/assets/exercice.syllabes._consonant-nEzqvISp.js"
	},
	"/assets/flores-gong-nota-iSf8UaPN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"411a-TYwio8hW58voscCIwfDPkZ3BqAc\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 16666,
		"path": "../public/assets/flores-gong-nota-iSf8UaPN.js"
	},
	"/assets/globe-CFVq_CjJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f2-wdDeNSl5vky7cVC5M5LAsuwN7js\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 242,
		"path": "../public/assets/globe-CFVq_CjJ.js"
	},
	"/assets/jsx-runtime-Cv34UvWR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a8-hiYu40g6RHrC/bpU3zy7vcj8TsY\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 424,
		"path": "../public/assets/jsx-runtime-Cv34UvWR.js"
	},
	"/assets/leaf-C_cAhspD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-KQkIqndxOJl6AQfK1s1ChXXx64E\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 265,
		"path": "../public/assets/leaf-C_cAhspD.js"
	},
	"/assets/letter-style-resolver-BgxJAYbf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22b33-r/ycCSmFSX4g/2soXqTGKjrvV94\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 142131,
		"path": "../public/assets/letter-style-resolver-BgxJAYbf.js"
	},
	"/assets/index-3dSJwBzK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"52a9a-PQ65kv5nv7+AkVtIFwVYCmZTcVk\"",
		"mtime": "2026-08-12T14:34:47.198Z",
		"size": 338586,
		"path": "../public/assets/index-3dSJwBzK.js"
	},
	"/assets/link-DJ55Rihr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ed8-icWp8Er9/ITA5sBOQ1uMrC/SlX4\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 7896,
		"path": "../public/assets/link-DJ55Rihr.js"
	},
	"/assets/matchContext-DvHzkq2g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"291-VQnfhSDVVUr3b6LAcb+jSCQ7FX0\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 657,
		"path": "../public/assets/matchContext-DvHzkq2g.js"
	},
	"/assets/lock-BovwZ9p1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ce-tcOHZmVe7QdWu3fyv91rC8DvVso\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 206,
		"path": "../public/assets/lock-BovwZ9p1.js"
	},
	"/assets/palier2-groups-BOB5LwuM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a39-82eoV9d2UfIGm56dTTg/4OGEroU\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 2617,
		"path": "../public/assets/palier2-groups-BOB5LwuM.js"
	},
	"/assets/play-CAEV7e_x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be-sQrzAu37DuKWZGZQHZC/ZG1Fu4U\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 190,
		"path": "../public/assets/play-CAEV7e_x.js"
	},
	"/assets/profil-B1XZlQ3b.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d24-9GpAGFz1YmK4hNTnfrrdWieV/bc\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 7460,
		"path": "../public/assets/profil-B1XZlQ3b.js"
	},
	"/assets/profileAuth-B8oTjTIn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3bd-AqxSw44scizImsQq/BVAS0QGy4I\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 957,
		"path": "../public/assets/profileAuth-B8oTjTIn.js"
	},
	"/assets/react-C1VktWof.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f64-3p4bCHIDfvittea0i4AgXd8BRqs\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 8036,
		"path": "../public/assets/react-C1VktWof.js"
	},
	"/assets/progress-IxA2hePl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"afb-VN3anaexAYugKuT08e7fL6E781A\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 2811,
		"path": "../public/assets/progress-IxA2hePl.js"
	},
	"/assets/resizeImageToDataUrl-Dyon2Bub.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a0-Ax3D1OvIo/TqiNh+yNn75c3xPMI\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 1440,
		"path": "../public/assets/resizeImageToDataUrl-Dyon2Bub.js"
	},
	"/assets/rotate-ccw-C6yonuYI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c8-LZW2ThHwKQJjF9JJbaCk0h836Ck\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 200,
		"path": "../public/assets/rotate-ccw-C6yonuYI.js"
	},
	"/assets/routes-DDKzi1D-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"51b-Sg7SOrV3NexEbZncZcqUzYC9PN0\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 1307,
		"path": "../public/assets/routes-DDKzi1D-.js"
	},
	"/assets/sign-exercise-catalog-BucM2byk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3d33-RUhZRHw6xvyvDLv8hF4WrLlU3+E\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 15667,
		"path": "../public/assets/sign-exercise-catalog-BucM2byk.js"
	},
	"/assets/sparkles-Ch6KJa13.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-qbjaJ6EO1O6WWKwuYowu18GDP6E\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 494,
		"path": "../public/assets/sparkles-Ch6KJa13.js"
	},
	"/assets/sprout-nLWG70cE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135-2Y4uJ8FuRCz7N+lzkHeQ08I+Gr8\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 309,
		"path": "../public/assets/sprout-nLWG70cE.js"
	},
	"/assets/syllable-catalog-HjpzQAgc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"aca-RnvJ3+bcpdKOBJMNuNcShwKV5X8\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 2762,
		"path": "../public/assets/syllable-catalog-HjpzQAgc.js"
	},
	"/assets/styles-CQC4z2Bx.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"193a9-CDETLMecuNBJrqB3vg3kTotwK8M\"",
		"mtime": "2026-08-12T14:34:47.212Z",
		"size": 103337,
		"path": "../public/assets/styles-CQC4z2Bx.css"
	},
	"/assets/traceValidation-B5Qh4BA2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"68d-lSIfCstBp36Jms5cvSCySVTN6Ew\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 1677,
		"path": "../public/assets/traceValidation-B5Qh4BA2.js"
	},
	"/assets/useAnimationSpeed-aAy48Zzs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f9-eUW+5MCFk+eeKP5pgLnuZUrrMps\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 761,
		"path": "../public/assets/useAnimationSpeed-aAy48Zzs.js"
	},
	"/assets/useExerciseSettings-CZKXfyRT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42c-tlwMfycGBF6DOWltKZOWpgwX5LQ\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 1068,
		"path": "../public/assets/useExerciseSettings-CZKXfyRT.js"
	},
	"/assets/useRouter-Dk7LSxfP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a7-z+TecY/QmeCFjHD1CIN9NNyYJ6I\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 679,
		"path": "../public/assets/useRouter-Dk7LSxfP.js"
	},
	"/assets/useSignSpeech-IDqWu7RR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"98e-SquT0/nRiB71jFq0avaoZAQ51xo\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 2446,
		"path": "../public/assets/useSignSpeech-IDqWu7RR.js"
	},
	"/assets/useStore-CnayA-z-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4894-AZH2T6do8+XDMkZUxRdkfH10dB0\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 18580,
		"path": "../public/assets/useStore-CnayA-z-.js"
	},
	"/assets/useWritingStyle-BpIlzQgn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a3-tz+b74debdRr2cvqhJwE9Q2bIeU\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 675,
		"path": "../public/assets/useWritingStyle-BpIlzQgn.js"
	},
	"/assets/utils-BtRqtsxU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a76-JkKQpQvQjju9Gum3ePYtjWZ23Rg\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 27254,
		"path": "../public/assets/utils-BtRqtsxU.js"
	},
	"/assets/volume-2-D4p5_zJe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"186-tU5ado7EhDNQ8NTrF4XrwSx4tgc\"",
		"mtime": "2026-08-12T14:34:47.201Z",
		"size": 390,
		"path": "../public/assets/volume-2-D4p5_zJe.js"
	},
	"/assets/word-catalog-Cq-B7iv4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"159e-gtU6WzaGOjwidbo+aMMLheuFeq4\"",
		"mtime": "2026-08-12T14:34:47.202Z",
		"size": 5534,
		"path": "../public/assets/word-catalog-Cq-B7iv4.js"
	},
	"/assets/volume-x-By5CFuRZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22d-AmOXJhRVN8gtUtZbkmv9bJC8ggQ\"",
		"mtime": "2026-08-12T14:34:47.202Z",
		"size": 557,
		"path": "../public/assets/volume-x-By5CFuRZ.js"
	},
	"/assets/amani-gribouillage-BXbXNURp.png": {
		"type": "image/png",
		"etag": "\"7902af-idUEURYEtELo/yDEoMfTFVInq2k\"",
		"mtime": "2026-08-12T14:34:47.202Z",
		"size": 7930543,
		"path": "../public/assets/amani-gribouillage-BXbXNURp.png"
	},
	"/assets/amani-profil-DXMymq2U.png": {
		"type": "image/png",
		"etag": "\"5c8a90-bLe0yVY07mf+3Ndeblvi0yfnUpw\"",
		"mtime": "2026-08-12T14:34:47.208Z",
		"size": 6064784,
		"path": "../public/assets/amani-profil-DXMymq2U.png"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_8zkL7e = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_8zkL7e
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
