import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cours.lettres.formation._char-CCtwOcXm.js
var $$splitComponentImporter = () => import("./cours.lettres.formation._char-CiQcIVku.mjs");
var Route = createFileRoute("/cours/lettres/formation/$char")({
	validateSearch: (search) => ({ pg: typeof search.pg === "string" ? search.pg : void 0 }),
	head: ({ params }) => ({ meta: [{ title: `Former la lettre "${params.char}" — Amani` }, {
		name: "description",
		content: `Découvre comment former la lettre "${params.char}" en combinant les signes de base.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
