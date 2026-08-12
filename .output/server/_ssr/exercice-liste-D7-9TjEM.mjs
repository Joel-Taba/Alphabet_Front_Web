import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exercice-liste-D7-9TjEM.js
var $$splitComponentImporter = () => import("./exercice-liste-BheTbma7.mjs");
var Route = createFileRoute("/exercice-liste")({
	validateSearch: (search) => ({
		family: typeof search.family === "string" ? search.family : void 0,
		group: typeof search.group === "string" ? search.group : void 0,
		amaniEval: typeof search.amaniEval === "string" ? search.amaniEval : void 0
	}),
	head: () => ({ meta: [{ title: "Cahier d'Écriture — Amani" }, {
		name: "description",
		content: "Repasse sur les pointillés pour apprendre à tracer les signes de la méthode Flores Gong Nota."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
