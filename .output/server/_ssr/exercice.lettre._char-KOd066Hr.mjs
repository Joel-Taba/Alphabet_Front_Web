import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exercice.lettre._char-KOd066Hr.js
var $$splitComponentImporter = () => import("./exercice.lettre._char-DbmKVaHR.mjs");
var Route = createFileRoute("/exercice/lettre/$char")({
	validateSearch: (search) => ({
		pg: typeof search.pg === "string" ? search.pg : void 0,
		amaniEval: typeof search.amaniEval === "string" ? search.amaniEval : void 0
	}),
	head: ({ params }) => ({ meta: [{ title: `Exercice : Tracé de "${params.char}" — Amani` }, {
		name: "description",
		content: `Exerce-toi à tracer la lettre "${params.char}" signe par signe selon la méthode Flores Gong Nota.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
