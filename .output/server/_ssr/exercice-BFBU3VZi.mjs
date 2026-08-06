import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as useMatchRoute, p as Outlet, v as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exercice-BFBU3VZi.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Page "Exercice" (palier de fin de niveau) : récapitulatif de tous les
* signes/variantes travaillés dans le palier — c'est exactement le même
* écran que /exercice-liste sans filtre de famille (toutes les familles
* groupées), pour que l'apprenant les refasse tous.
*
* `/exercice/lettre/$char` reste une route enfant de celle-ci (Outlet),
* donc la redirection ne doit s'appliquer que sur la correspondance exacte.
*/
function ExercicePalierRecap() {
	if (!useMatchRoute()({
		to: "/exercice",
		fuzzy: false
	})) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/exercice-liste" });
}
//#endregion
export { ExercicePalierRecap as component };
