import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cours.mots._groupId-Du1dvKFV.js
var $$splitComponentImporter = () => import("./cours.mots._groupId-B7tvqYgG.mjs");
var Route = createFileRoute("/cours/mots/$groupId")({
	head: ({ params }) => ({ meta: [{ title: `Cours de mots — Amani` }, {
		name: "description",
		content: `Découvre comment écrire et prononcer les mots du groupe ${params.groupId}.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
