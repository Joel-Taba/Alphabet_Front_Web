import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exercice.mots-croises._puzzleId-BJvg2GD8.js
var $$splitComponentImporter = () => import("./exercice.mots-croises._puzzleId-BXlz5Vsf.mjs");
var Route = createFileRoute("/exercice/mots-croises/$puzzleId")({
	head: ({ params }) => ({ meta: [{ title: `Mots croisés — Amani` }, {
		name: "description",
		content: `Complète la grille de mots croisés ${params.puzzleId}.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
