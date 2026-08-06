import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AmaniMascot-A-Eqgs-C.js
var import_jsx_runtime = require_jsx_runtime();
var amani_accueil_default = "/assets/amani-accueil-CaLzI707.png";
var amani_demonstration_default = "/assets/amani-demonstration-CAeJeVSn.png";
var amani_encouragement_default = "/assets/amani-encouragement-CYP97xvu.png";
var amani_celebration_default = "/assets/amani-celebration-C8VYMps_.png";
var amani_reconfort_default = "/assets/amani-reconfort-DFq0B1eT.png";
var amani_reflexion_default = "/assets/amani-reflexion-CWXIPbGS.png";
var amani_veille_default = "/assets/amani-veille-DHce1rLU.png";
var amani_mini_reussite_default = "/assets/amani-mini-reussite-D0P2S-9B.png";
var amani_mini_reessai_default = "/assets/amani-mini-reessai-cqfjkg3n.png";
var amani_invitation_default = "/assets/amani-invitation-DDx8PFjy.png";
var amani_curiosite_default = "/assets/amani-curiosite-DR_FwNcV.png";
var amani_emerveillement_default = "/assets/amani-emerveillement-BZ8y7H9E.png";
var amani_victoire_palier_default = "/assets/amani-victoire-palier-CI_rSkT5.png";
var amani_podium_default = "/assets/amani-podium-B10ck-nh.png";
var amani_dessin_default = "/assets/amani-dessin-BYo8_fBz.png";
var amani_perdu_default = "/assets/amani-perdu-C62jcyCv.png";
var amani_profil_default = "/assets/amani-profil-DXMymq2U.png";
var poses = {
	accueil: amani_accueil_default,
	demonstration: amani_demonstration_default,
	encouragement: amani_encouragement_default,
	celebration: amani_celebration_default,
	reconfort: amani_reconfort_default,
	reflexion: amani_reflexion_default,
	veille: amani_veille_default,
	mini_reussite: amani_mini_reussite_default,
	mini_reessai: amani_mini_reessai_default,
	invitation: amani_invitation_default,
	curiosite: amani_curiosite_default,
	emerveillement: amani_emerveillement_default,
	victoire_palier: amani_victoire_palier_default,
	podium: amani_podium_default,
	dessin: amani_dessin_default,
	perdu: amani_perdu_default,
	profil: amani_profil_default
};
var sizes = {
	hero: 240,
	medium: 120,
	small: 72,
	avatar: 48
};
var labels = {
	accueil: "Amani te salue",
	demonstration: "Amani te montre un signe",
	encouragement: "Amani t'encourage",
	celebration: "Amani célèbre ta réussite",
	reconfort: "Amani te réconforte",
	reflexion: "Amani réfléchit",
	veille: "Amani se repose",
	mini_reussite: "Amani est ravi de ta réussite",
	mini_reessai: "Amani t'encourage à réessayer",
	invitation: "Amani t'invite à continuer",
	curiosite: "Amani est curieux",
	emerveillement: "Amani s'émerveille",
	victoire_palier: "Amani fête ton palier",
	podium: "Amani te félicite sur le podium",
	dessin: "Amani dessine",
	perdu: "Amani est perdu",
	profil: "Amani lit et prend des notes dans la forêt"
};
function AmaniMascot({ pose = "accueil", size = "medium", priority = false, waving = false }) {
	const dim = sizes[size];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: poses[pose],
		alt: labels[pose],
		width: dim,
		height: dim,
		loading: priority ? "eager" : "lazy",
		className: "select-none",
		draggable: false,
		style: {
			width: dim,
			height: dim,
			transformOrigin: waving ? "bottom center" : void 0,
			animation: waving ? "amani-wave 1.2s ease-in-out infinite alternate" : void 0
		}
	}), waving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
          @keyframes amani-wave {
            0% { transform: rotate(-10deg); }
            100% { transform: rotate(10deg); }
          }
        ` })] });
}
//#endregion
export { amani_profil_default as n, AmaniMascot as t };
