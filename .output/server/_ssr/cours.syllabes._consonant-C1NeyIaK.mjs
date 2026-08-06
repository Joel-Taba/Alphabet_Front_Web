import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cours.syllabes._consonant-C1NeyIaK.js
var $$splitComponentImporter = () => import("./cours.syllabes._consonant-Bk1WbRoy.mjs");
var Route = createFileRoute("/cours/syllabes/$consonant")({
	head: ({ params }) => ({ meta: [{ title: `Syllabes avec "${params.consonant}" — Amani` }, {
		name: "description",
		content: `Apprends à former les syllabes avec la consonne "${params.consonant}".`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
