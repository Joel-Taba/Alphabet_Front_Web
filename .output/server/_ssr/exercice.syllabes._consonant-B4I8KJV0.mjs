import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exercice.syllabes._consonant-B4I8KJV0.js
var $$splitComponentImporter = () => import("./exercice.syllabes._consonant-FjMrDnI9.mjs");
var Route = createFileRoute("/exercice/syllabes/$consonant")({
	validateSearch: (search) => ({ amaniEval: typeof search.amaniEval === "string" ? search.amaniEval : void 0 }),
	head: ({ params }) => ({ meta: [{ title: `Exercice de syllabes — Amani` }, {
		name: "description",
		content: `Exerce-toi à tracer les syllabes avec la consonne "${params.consonant}".`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
