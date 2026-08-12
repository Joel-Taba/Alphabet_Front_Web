import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cours.lettres._char-CSmfovq2.js
var $$splitComponentImporter = () => import("./cours.lettres._char-CzQrLwyi.mjs");
var Route = createFileRoute("/cours/lettres/$char")({
	head: ({ params }) => ({ meta: [{ title: `Décomposition de "${params.char}" — Amani` }, {
		name: "description",
		content: `Découvre les signes qui composent la lettre "${params.char}" dans la méthode Flores Gong Nota.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
