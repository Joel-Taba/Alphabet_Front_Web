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
		"mtime": "2026-08-06T12:10:26.581Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/Button-BBEV-fWa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c13-4ARWpyMHGrJlIVrnX9o6/fghst8\"",
		"mtime": "2026-08-06T12:10:23.863Z",
		"size": 3091,
		"path": "../public/assets/Button-BBEV-fWa.js"
	},
	"/assets/CahierFrame-DcrCA9dq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25a-HbxT2cs6Bs82LigvMPajEo5Smps\"",
		"mtime": "2026-08-06T12:10:23.863Z",
		"size": 602,
		"path": "../public/assets/CahierFrame-DcrCA9dq.js"
	},
	"/assets/EvaluationTimer-DWW2H2N6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c47-hW4GqC/uBWVWTZboziBn0yuY2P8\"",
		"mtime": "2026-08-06T12:10:23.863Z",
		"size": 3143,
		"path": "../public/assets/EvaluationTimer-DWW2H2N6.js"
	},
	"/assets/ExerciseCompletePopup-CuLZrnN2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"60f-yLuMv7mt6jvGMShW8g9gy/17zGc\"",
		"mtime": "2026-08-06T12:10:23.863Z",
		"size": 1551,
		"path": "../public/assets/ExerciseCompletePopup-CuLZrnN2.js"
	},
	"/assets/LetterTraceCell-CsKVuV0s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"efc-itN1rAB+BZwPN8YfvIIhh0d8DhQ\"",
		"mtime": "2026-08-06T12:10:23.863Z",
		"size": 3836,
		"path": "../public/assets/LetterTraceCell-CsKVuV0s.js"
	},
	"/assets/Match-C6ayxrJr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"befe-il4OEtbkL2t7m2pgafhlqPfR2ug\"",
		"mtime": "2026-08-06T12:10:23.863Z",
		"size": 48894,
		"path": "../public/assets/Match-C6ayxrJr.js"
	},
	"/assets/MobileShell-D6wDI_Da.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75a-WfgCsOqpj3oPEOl8eW2Gz7xO37k\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 1882,
		"path": "../public/assets/MobileShell-D6wDI_Da.js"
	},
	"/assets/RepetitionRow-CqSsMMeh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cda-NfBdbwn1blvP1/TdsqAXhov57pk\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 7386,
		"path": "../public/assets/RepetitionRow-CqSsMMeh.js"
	},
	"/assets/SignGlyph-Cvyq2AVi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ff7-p9OXRj+B919+hzKyBjy2HJldUhA\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 4087,
		"path": "../public/assets/SignGlyph-Cvyq2AVi.js"
	},
	"/assets/_app-Dd8atW6f.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1355-uGIN4hk3ex2l731ZTxSmTqhUaHE\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 4949,
		"path": "../public/assets/_app-Dd8atW6f.js"
	},
	"/assets/_app.accueil-BZbTJXp3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4046-KhDxZwfsQe9/TEI6cZGO4GN5exc\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 16454,
		"path": "../public/assets/_app.accueil-BZbTJXp3.js"
	},
	"/assets/_app.bibliotheque-B6fkfwH9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"153cd-31+knfqwaR0Wcr9FURuaAKC+8Po\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 86989,
		"path": "../public/assets/_app.bibliotheque-B6fkfwH9.js"
	},
	"/assets/_app.communaute-RdQJXmSN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"177c-2IqOt6Hg9ho/+VXZ154ymzpQgn8\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 6012,
		"path": "../public/assets/_app.communaute-RdQJXmSN.js"
	},
	"/assets/_app.mon-profil-Mzxl8wdo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5d1a-J2cZbEBFeyGqlYQvEB9bgsM2Pj4\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 23834,
		"path": "../public/assets/_app.mon-profil-Mzxl8wdo.js"
	},
	"/assets/_app.plus-B2TMfscp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1213-7DOn7yf+aPfgffeLx7TneLNfswg\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 4627,
		"path": "../public/assets/_app.plus-B2TMfscp.js"
	},
	"/assets/_app.reglages-CF79J_sV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d4-6u0rX5CC5BjQfiPAgxIUz4H8wjw\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 212,
		"path": "../public/assets/_app.reglages-CF79J_sV.js"
	},
	"/assets/amani-accueil-CaLzI707.png": {
		"type": "image/png",
		"etag": "\"591b8-TABeaI0PkxO4j/oL9R7evBvWZBQ\"",
		"mtime": "2026-08-06T12:10:23.866Z",
		"size": 364984,
		"path": "../public/assets/amani-accueil-CaLzI707.png"
	},
	"/assets/amani-celebration-C8VYMps_.png": {
		"type": "image/png",
		"etag": "\"68a4d-9gJSjzkzr4Q9aUCB67BTeGBxEOA\"",
		"mtime": "2026-08-06T12:10:23.866Z",
		"size": 428621,
		"path": "../public/assets/amani-celebration-C8VYMps_.png"
	},
	"/assets/amani-curiosite-DR_FwNcV.png": {
		"type": "image/png",
		"etag": "\"6fe66-f96GQ8y8VHmGriVG2wpogakXdGg\"",
		"mtime": "2026-08-06T12:10:23.866Z",
		"size": 458342,
		"path": "../public/assets/amani-curiosite-DR_FwNcV.png"
	},
	"/assets/amani-demonstration-CAeJeVSn.png": {
		"type": "image/png",
		"etag": "\"5500a-c3XJh6isfc31one3w9yqeWPGTbk\"",
		"mtime": "2026-08-06T12:10:23.866Z",
		"size": 348170,
		"path": "../public/assets/amani-demonstration-CAeJeVSn.png"
	},
	"/assets/amani-dessin-BYo8_fBz.png": {
		"type": "image/png",
		"etag": "\"34eb1-LjLm6Irfy24FJAKa2bq7UeWhRlE\"",
		"mtime": "2026-08-06T12:10:23.866Z",
		"size": 216753,
		"path": "../public/assets/amani-dessin-BYo8_fBz.png"
	},
	"/assets/amani-emerveillement-BZ8y7H9E.png": {
		"type": "image/png",
		"etag": "\"75070-PCHzWerrkHTNRi1dhLtPqw23YPA\"",
		"mtime": "2026-08-06T12:10:23.867Z",
		"size": 479344,
		"path": "../public/assets/amani-emerveillement-BZ8y7H9E.png"
	},
	"/assets/amani-encouragement-CYP97xvu.png": {
		"type": "image/png",
		"etag": "\"60894-LlQpm8zi5lZypXmcSdpVeG6dhGU\"",
		"mtime": "2026-08-06T12:10:23.867Z",
		"size": 395412,
		"path": "../public/assets/amani-encouragement-CYP97xvu.png"
	},
	"/assets/amani-inscription-ZLDCh20L.jpeg": {
		"type": "image/jpeg",
		"etag": "\"5727-7lnuuX+zej0R7qTxfK2OTau6988\"",
		"mtime": "2026-08-06T12:10:23.877Z",
		"size": 22311,
		"path": "../public/assets/amani-inscription-ZLDCh20L.jpeg"
	},
	"/assets/amani-mini-reessai-cqfjkg3n.png": {
		"type": "image/png",
		"etag": "\"7841f-+TM6H/dkMo9g91sCeJTjhcytrj8\"",
		"mtime": "2026-08-06T12:10:23.878Z",
		"size": 492575,
		"path": "../public/assets/amani-mini-reessai-cqfjkg3n.png"
	},
	"/assets/amani-invitation-DDx8PFjy.png": {
		"type": "image/png",
		"etag": "\"684b1-La/6o51Ie/bzb2I8ckx7Zqx+70g\"",
		"mtime": "2026-08-06T12:10:23.878Z",
		"size": 427185,
		"path": "../public/assets/amani-invitation-DDx8PFjy.png"
	},
	"/assets/amani-mini-reussite-D0P2S-9B.png": {
		"type": "image/png",
		"etag": "\"6d82c-zZSJuGRtej9U0fHE7JHTt1Ckj5A\"",
		"mtime": "2026-08-06T12:10:23.879Z",
		"size": 448556,
		"path": "../public/assets/amani-mini-reussite-D0P2S-9B.png"
	},
	"/assets/amani-perdu-C62jcyCv.png": {
		"type": "image/png",
		"etag": "\"3001a-xn2XJ8Kb0ntFBSbzK5aASQi9vO0\"",
		"mtime": "2026-08-06T12:10:23.879Z",
		"size": 196634,
		"path": "../public/assets/amani-perdu-C62jcyCv.png"
	},
	"/assets/amani-veille-DHce1rLU.png": {
		"type": "image/png",
		"etag": "\"2fc9d-BgXCJ0/95XAPftjzRT/yOuc+Glk\"",
		"mtime": "2026-08-06T12:10:23.886Z",
		"size": 195741,
		"path": "../public/assets/amani-veille-DHce1rLU.png"
	},
	"/assets/amani-reconfort-DFq0B1eT.png": {
		"type": "image/png",
		"etag": "\"3e7a6-VNe9FRigzlkX8ROmoRVxoU5ZAR8\"",
		"mtime": "2026-08-06T12:10:23.885Z",
		"size": 255910,
		"path": "../public/assets/amani-reconfort-DFq0B1eT.png"
	},
	"/assets/amani-reflexion-CWXIPbGS.png": {
		"type": "image/png",
		"etag": "\"356b0-06BzgHj7c7Eg1dqlxEx6nIDgxUM\"",
		"mtime": "2026-08-06T12:10:23.886Z",
		"size": 218800,
		"path": "../public/assets/amani-reflexion-CWXIPbGS.png"
	},
	"/assets/amani-podium-B10ck-nh.png": {
		"type": "image/png",
		"etag": "\"70667-DMN5iefILu+6kgVpArKHk8uYUac\"",
		"mtime": "2026-08-06T12:10:23.879Z",
		"size": 460391,
		"path": "../public/assets/amani-podium-B10ck-nh.png"
	},
	"/assets/baloo-2-latin-400-normal-D8VfTcZx.woff2": {
		"type": "font/woff2",
		"etag": "\"49e8-BOPqhUMK+yonaUjg+/znN8eyCN0\"",
		"mtime": "2026-08-06T12:10:23.887Z",
		"size": 18920,
		"path": "../public/assets/baloo-2-latin-400-normal-D8VfTcZx.woff2"
	},
	"/assets/arrow-left-kdj5vCjb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-eT0YY6wUSDCFCz4ObVk5l4Jl6GE\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 165,
		"path": "../public/assets/arrow-left-kdj5vCjb.js"
	},
	"/assets/baloo-2-latin-400-normal-DCk_bY-6.woff": {
		"type": "font/woff",
		"etag": "\"5a48-KlQZDPH4ixywZEcJgeeF8Ez8mWM\"",
		"mtime": "2026-08-06T12:10:23.887Z",
		"size": 23112,
		"path": "../public/assets/baloo-2-latin-400-normal-DCk_bY-6.woff"
	},
	"/assets/baloo-2-latin-600-normal-B4tNaogw.woff": {
		"type": "font/woff",
		"etag": "\"5bf8-CYLgi98oFg+ErJj5AAVqUmakF9I\"",
		"mtime": "2026-08-06T12:10:23.887Z",
		"size": 23544,
		"path": "../public/assets/baloo-2-latin-600-normal-B4tNaogw.woff"
	},
	"/assets/baloo-2-latin-600-normal-tIfxVoAe.woff2": {
		"type": "font/woff2",
		"etag": "\"4c28-C8VnKtjgmYtjokvlZImEMQG+pS0\"",
		"mtime": "2026-08-06T12:10:23.888Z",
		"size": 19496,
		"path": "../public/assets/baloo-2-latin-600-normal-tIfxVoAe.woff2"
	},
	"/assets/baloo-2-latin-700-normal-CqTg7A15.woff2": {
		"type": "font/woff2",
		"etag": "\"4bec-y/IowzmFgWqtMfLy7fXVAUHQC18\"",
		"mtime": "2026-08-06T12:10:23.888Z",
		"size": 19436,
		"path": "../public/assets/baloo-2-latin-700-normal-CqTg7A15.woff2"
	},
	"/assets/baloo-2-latin-700-normal-Ld3Zm3l2.woff": {
		"type": "font/woff",
		"etag": "\"5b70-Lb1Mu2rjN0YAfvb+hVIMBbpMZ6A\"",
		"mtime": "2026-08-06T12:10:23.888Z",
		"size": 23408,
		"path": "../public/assets/baloo-2-latin-700-normal-Ld3Zm3l2.woff"
	},
	"/assets/book-open-Bs_123YE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117-MnIGqA03Zncc74uf+FXeCQGGY5c\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 279,
		"path": "../public/assets/book-open-Bs_123YE.js"
	},
	"/assets/chevron-right-CEREXFJU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-LBBY6psHQvSzkSFopbfBRungMi4\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 130,
		"path": "../public/assets/chevron-right-CEREXFJU.js"
	},
	"/assets/chevron-left-CCPPXlZl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-lexuCg4Eg045pc7szYUyAj5luo4\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 130,
		"path": "../public/assets/chevron-left-CCPPXlZl.js"
	},
	"/assets/comic-neue-latin-300-normal-DMqQrJ-7.woff": {
		"type": "font/woff",
		"etag": "\"4114-jjtqfMldL89gIeemzYdAaJaQM7g\"",
		"mtime": "2026-08-06T12:10:23.888Z",
		"size": 16660,
		"path": "../public/assets/comic-neue-latin-300-normal-DMqQrJ-7.woff"
	},
	"/assets/comic-neue-latin-300-normal-DvCJ-eRb.woff2": {
		"type": "font/woff2",
		"etag": "\"4c30-QnCFbnQGU25VjuJwkTMK30Z3OFc\"",
		"mtime": "2026-08-06T12:10:23.888Z",
		"size": 19504,
		"path": "../public/assets/comic-neue-latin-300-normal-DvCJ-eRb.woff2"
	},
	"/assets/amani-victoire-palier-CI_rSkT5.png": {
		"type": "image/png",
		"etag": "\"62239-KZwt1Z/9hLGr6fjHdTnamsfMYO4\"",
		"mtime": "2026-08-06T12:10:23.886Z",
		"size": 401977,
		"path": "../public/assets/amani-victoire-palier-CI_rSkT5.png"
	},
	"/assets/amani-victoire-palier-badge-IiJasJT_.png": {
		"type": "image/png",
		"etag": "\"5d3bf-YqCJ+HaBQKHLsCVXmOss68Yk1Tk\"",
		"mtime": "2026-08-06T12:10:23.887Z",
		"size": 381887,
		"path": "../public/assets/amani-victoire-palier-badge-IiJasJT_.png"
	},
	"/assets/cours.lettres._char-Bi_-9QUj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13e5-5SUn7vb3VJxH1p26orzump6ylcs\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 5093,
		"path": "../public/assets/cours.lettres._char-Bi_-9QUj.js"
	},
	"/assets/cours.lettres.formation._char-2zmEBYaz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2331-KB7h5KqRFhPqB84Y0FGvUBON3xA\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 9009,
		"path": "../public/assets/cours.lettres.formation._char-2zmEBYaz.js"
	},
	"/assets/cours.mots._groupId-i4YkjBk0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14ec-17/EvEEHKG6iV7tIsDeyrxQVIBc\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 5356,
		"path": "../public/assets/cours.mots._groupId-i4YkjBk0.js"
	},
	"/assets/cours.syllabes._consonant-DrXt8i_g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2229-j952FWcCZQfAR3i//rjL1b2KqEw\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 8745,
		"path": "../public/assets/cours.syllabes._consonant-DrXt8i_g.js"
	},
	"/assets/createLucideIcon-CwVQAepC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a0-He58XfhU2YXbMxqjMNd6Kwi00IA\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 1184,
		"path": "../public/assets/createLucideIcon-CwVQAepC.js"
	},
	"/assets/cours._family-BixQY8zz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23f2-rPiHleswcCIMMzydYN4umht0lBw\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 9202,
		"path": "../public/assets/cours._family-BixQY8zz.js"
	},
	"/assets/crosswordGenerator-BjVKHFKB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2574-wmfzrZ8MMtN9+yYiyPxe2on37bA\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 9588,
		"path": "../public/assets/crosswordGenerator-BjVKHFKB.js"
	},
	"/assets/dancing-script-latin-700-normal-CX8AaSVl.woff2": {
		"type": "font/woff2",
		"etag": "\"6364-4v7Q3aXlNEjxHfk+B5xKFybg8Q0\"",
		"mtime": "2026-08-06T12:10:23.888Z",
		"size": 25444,
		"path": "../public/assets/dancing-script-latin-700-normal-CX8AaSVl.woff2"
	},
	"/assets/dancing-script-latin-700-normal-LI5MgW9m.woff": {
		"type": "font/woff",
		"etag": "\"77a8-g0rzWqDOJF5yutHEq6wVCX/ifgw\"",
		"mtime": "2026-08-06T12:10:23.888Z",
		"size": 30632,
		"path": "../public/assets/dancing-script-latin-700-normal-LI5MgW9m.woff"
	},
	"/assets/exercice-D0fHh7bp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"108-5R0NMiLsBN4cST2j8CsgWngA7ho\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 264,
		"path": "../public/assets/exercice-D0fHh7bp.js"
	},
	"/assets/exercice-intro-DV63Ph5R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e1d-lsG+XKE2K0cn2lovzaP/wEeqvZc\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 3613,
		"path": "../public/assets/exercice-intro-DV63Ph5R.js"
	},
	"/assets/exercice-liste-C0RKikeP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e4a-EVF0U7Fv0wTzUc2fgqpxScO3j8g\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 7754,
		"path": "../public/assets/exercice-liste-C0RKikeP.js"
	},
	"/assets/exercice.lettre._char-D9CNJeJe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31c1-6ViVLyJF7prYCgC2uuJc99hIE8E\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 12737,
		"path": "../public/assets/exercice.lettre._char-D9CNJeJe.js"
	},
	"/assets/exercice.mots-croises._puzzleId-CyUp4MmY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7d5-1I3sUaWOAVeowOfS1CAUG5WsDEI\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 2005,
		"path": "../public/assets/exercice.mots-croises._puzzleId-CyUp4MmY.js"
	},
	"/assets/exercice.mots._groupId-DRQ-srFE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"155a-bypseYZ8J760bbBYvKvrB9FSYLY\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 5466,
		"path": "../public/assets/exercice.mots._groupId-DRQ-srFE.js"
	},
	"/assets/exercice.syllabes._consonant-nuEi3INA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16ec-NVQRCbpxsPNWM1X5ZWKuNz83JKg\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 5868,
		"path": "../public/assets/exercice.syllabes._consonant-nuEi3INA.js"
	},
	"/assets/flores-gong-nota-DWMt6ut3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"39c1-fq7yooiuU/ZJwlgWWL0LRWcezew\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 14785,
		"path": "../public/assets/flores-gong-nota-DWMt6ut3.js"
	},
	"/assets/globe-CFVq_CjJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f2-wdDeNSl5vky7cVC5M5LAsuwN7js\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 242,
		"path": "../public/assets/globe-CFVq_CjJ.js"
	},
	"/assets/jsx-runtime-Cv34UvWR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a8-hiYu40g6RHrC/bpU3zy7vcj8TsY\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 424,
		"path": "../public/assets/jsx-runtime-Cv34UvWR.js"
	},
	"/assets/leaf-C_cAhspD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-KQkIqndxOJl6AQfK1s1ChXXx64E\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 265,
		"path": "../public/assets/leaf-C_cAhspD.js"
	},
	"/assets/index-Cg2U7vPv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e106-nbYD/tymZGfx1lDnAIrMmeX+KiI\"",
		"mtime": "2026-08-06T12:10:23.862Z",
		"size": 319750,
		"path": "../public/assets/index-Cg2U7vPv.js"
	},
	"/assets/letter-style-resolver-9_aYsZ4B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19b0d-OUfrQvm2u+rRSzlyDzxf/Yon1Pk\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 105229,
		"path": "../public/assets/letter-style-resolver-9_aYsZ4B.js"
	},
	"/assets/cours.lettres-wf_-RapJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1326-hQwtxkgvRa69ihvqGXEahqidweQ\"",
		"mtime": "2026-08-06T12:10:23.864Z",
		"size": 4902,
		"path": "../public/assets/cours.lettres-wf_-RapJ.js"
	},
	"/assets/link-DJ55Rihr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ed8-icWp8Er9/ITA5sBOQ1uMrC/SlX4\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 7896,
		"path": "../public/assets/link-DJ55Rihr.js"
	},
	"/assets/lock-BovwZ9p1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ce-tcOHZmVe7QdWu3fyv91rC8DvVso\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 206,
		"path": "../public/assets/lock-BovwZ9p1.js"
	},
	"/assets/matchContext-DvHzkq2g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"291-VQnfhSDVVUr3b6LAcb+jSCQ7FX0\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 657,
		"path": "../public/assets/matchContext-DvHzkq2g.js"
	},
	"/assets/palier2-groups-DJqNaGNP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"87b-E0sV7UYKY9rLC/fUZoPljbi5cho\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 2171,
		"path": "../public/assets/palier2-groups-DJqNaGNP.js"
	},
	"/assets/play-CAEV7e_x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be-sQrzAu37DuKWZGZQHZC/ZG1Fu4U\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 190,
		"path": "../public/assets/play-CAEV7e_x.js"
	},
	"/assets/profil-DR451W6K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cff-Oe9QHGo4BiMl4WBRnhRl27JMk/w\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 7423,
		"path": "../public/assets/profil-DR451W6K.js"
	},
	"/assets/profileAuth-B8oTjTIn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3bd-AqxSw44scizImsQq/BVAS0QGy4I\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 957,
		"path": "../public/assets/profileAuth-B8oTjTIn.js"
	},
	"/assets/react-C1VktWof.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f64-3p4bCHIDfvittea0i4AgXd8BRqs\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 8036,
		"path": "../public/assets/react-C1VktWof.js"
	},
	"/assets/progress-BhjyUsrV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"943-aKUvpYh6GZCRhGl1fU7IDG9Kvrs\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 2371,
		"path": "../public/assets/progress-BhjyUsrV.js"
	},
	"/assets/rotate-ccw-C6yonuYI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c8-LZW2ThHwKQJjF9JJbaCk0h836Ck\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 200,
		"path": "../public/assets/rotate-ccw-C6yonuYI.js"
	},
	"/assets/resizeImageToDataUrl-Dyon2Bub.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a0-Ax3D1OvIo/TqiNh+yNn75c3xPMI\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 1440,
		"path": "../public/assets/resizeImageToDataUrl-Dyon2Bub.js"
	},
	"/assets/routes-CRszBDT3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"51b-0Eqi5a3Vdk5jaakkLA/GFGbJWGo\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 1307,
		"path": "../public/assets/routes-CRszBDT3.js"
	},
	"/assets/sign-exercise-catalog-suW2FFWm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"308b-R2wJObpK4H8iHIN/SQ97RHw/Lss\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 12427,
		"path": "../public/assets/sign-exercise-catalog-suW2FFWm.js"
	},
	"/assets/sparkles-Ch6KJa13.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ee-qbjaJ6EO1O6WWKwuYowu18GDP6E\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 494,
		"path": "../public/assets/sparkles-Ch6KJa13.js"
	},
	"/assets/sprout-nLWG70cE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135-2Y4uJ8FuRCz7N+lzkHeQ08I+Gr8\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 309,
		"path": "../public/assets/sprout-nLWG70cE.js"
	},
	"/assets/syllable-catalog-BXLEH1X-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"aca-bG60m1Af4IZVmuGnFFdwQWrtqK0\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 2762,
		"path": "../public/assets/syllable-catalog-BXLEH1X-.js"
	},
	"/assets/traceValidation-B5Qh4BA2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"68d-lSIfCstBp36Jms5cvSCySVTN6Ew\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 1677,
		"path": "../public/assets/traceValidation-B5Qh4BA2.js"
	},
	"/assets/styles-0moBKWGk.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"19051-1VonaoGLBe0FStqjheJ0hPnT9M0\"",
		"mtime": "2026-08-06T12:10:23.888Z",
		"size": 102481,
		"path": "../public/assets/styles-0moBKWGk.css"
	},
	"/assets/useExerciseSettings-CZKXfyRT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"42c-tlwMfycGBF6DOWltKZOWpgwX5LQ\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 1068,
		"path": "../public/assets/useExerciseSettings-CZKXfyRT.js"
	},
	"/assets/useAnimationSpeed-aAy48Zzs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2f9-eUW+5MCFk+eeKP5pgLnuZUrrMps\"",
		"mtime": "2026-08-06T12:10:23.865Z",
		"size": 761,
		"path": "../public/assets/useAnimationSpeed-aAy48Zzs.js"
	},
	"/assets/useRouter-Dk7LSxfP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a7-z+TecY/QmeCFjHD1CIN9NNyYJ6I\"",
		"mtime": "2026-08-06T12:10:23.866Z",
		"size": 679,
		"path": "../public/assets/useRouter-Dk7LSxfP.js"
	},
	"/assets/useSignSpeech-DluyuySY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"98e-fHz6p7Qsra2FmMbQGVvWPTN/UJ0\"",
		"mtime": "2026-08-06T12:10:23.866Z",
		"size": 2446,
		"path": "../public/assets/useSignSpeech-DluyuySY.js"
	},
	"/assets/useStore-CnayA-z-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4894-AZH2T6do8+XDMkZUxRdkfH10dB0\"",
		"mtime": "2026-08-06T12:10:23.866Z",
		"size": 18580,
		"path": "../public/assets/useStore-CnayA-z-.js"
	},
	"/assets/useWritingStyle-BpIlzQgn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a3-tz+b74debdRr2cvqhJwE9Q2bIeU\"",
		"mtime": "2026-08-06T12:10:23.866Z",
		"size": 675,
		"path": "../public/assets/useWritingStyle-BpIlzQgn.js"
	},
	"/assets/utils-BtRqtsxU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a76-JkKQpQvQjju9Gum3ePYtjWZ23Rg\"",
		"mtime": "2026-08-06T12:10:23.866Z",
		"size": 27254,
		"path": "../public/assets/utils-BtRqtsxU.js"
	},
	"/assets/volume-2-D4p5_zJe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"186-tU5ado7EhDNQ8NTrF4XrwSx4tgc\"",
		"mtime": "2026-08-06T12:10:23.866Z",
		"size": 390,
		"path": "../public/assets/volume-2-D4p5_zJe.js"
	},
	"/assets/volume-x-By5CFuRZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22d-AmOXJhRVN8gtUtZbkmv9bJC8ggQ\"",
		"mtime": "2026-08-06T12:10:23.866Z",
		"size": 557,
		"path": "../public/assets/volume-x-By5CFuRZ.js"
	},
	"/assets/word-catalog-CLVQZdN1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14f4-BYpnkO+ka+3iUUo8Q4ZFz2XqMhc\"",
		"mtime": "2026-08-06T12:10:23.866Z",
		"size": 5364,
		"path": "../public/assets/word-catalog-CLVQZdN1.js"
	},
	"/assets/amani-profil-DXMymq2U.png": {
		"type": "image/png",
		"etag": "\"5c8a90-bLe0yVY07mf+3Ndeblvi0yfnUpw\"",
		"mtime": "2026-08-06T12:10:23.879Z",
		"size": 6064784,
		"path": "../public/assets/amani-profil-DXMymq2U.png"
	},
	"/assets/amani-gribouillage-BXbXNURp.png": {
		"type": "image/png",
		"etag": "\"7902af-idUEURYEtELo/yDEoMfTFVInq2k\"",
		"mtime": "2026-08-06T12:10:23.867Z",
		"size": 7930543,
		"path": "../public/assets/amani-gribouillage-BXbXNURp.png"
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
