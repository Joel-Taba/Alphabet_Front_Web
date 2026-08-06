import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Button-BvEgYgmh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Button = (0, import_react.forwardRef)(function Button({ variant = "primary", className, children, disabled, asChild, ...rest }, ref) {
	const Comp = asChild ? Slot : "button";
	const base = "inline-flex items-center justify-center gap-2 font-semibold text-[18px] leading-6 select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40";
	const variants = {
		primary: "h-14 px-6 rounded-2xl bg-primary text-primary-foreground btn-pressable",
		secondary: "h-14 px-6 rounded-2xl bg-secondary text-secondary-foreground btn-pressable btn-pressable-secondary",
		icon: "h-12 w-12 rounded-full bg-surface text-text-primary btn-pressable"
	};
	const disabledStyles = disabled ? "!bg-disabled !text-text-secondary !shadow-none cursor-not-allowed" : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {
		ref,
		disabled,
		className: cn(base, variants[variant], disabledStyles, className),
		...rest,
		children
	});
});
//#endregion
export { Button as t };
