import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exercice.mots._groupId-CodGf0Tk.js
var $$splitComponentImporter = () => import("./exercice.mots._groupId-BHHzUilN.mjs");
var Route = createFileRoute("/exercice/mots/$groupId")({
	validateSearch: (search) => ({ amaniEval: typeof search.amaniEval === "string" ? search.amaniEval : void 0 }),
	head: ({ params }) => ({ meta: [{ title: `Exercice de mots — Amani` }, {
		name: "description",
		content: `Exerce-toi à écrire les mots du groupe ${params.groupId}.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
