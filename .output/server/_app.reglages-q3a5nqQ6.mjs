import { n as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.reglages-q3a5nqQ6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function ReglagesRedirect() {
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		navigate({
			to: "/mon-profil",
			replace: true
		});
	}, [navigate]);
	return null;
}
//#endregion
export { ReglagesRedirect as component };
