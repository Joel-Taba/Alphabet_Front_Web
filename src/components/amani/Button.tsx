import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children?: ReactNode;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", className, children, disabled, asChild, ...rest },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold text-[18px] leading-6 select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40";

  const variants: Record<Variant, string> = {
    primary:
      "h-14 px-6 rounded-2xl bg-primary text-primary-foreground btn-pressable",
    secondary:
      "h-14 px-6 rounded-2xl bg-secondary text-secondary-foreground btn-pressable btn-pressable-secondary",
    icon: "h-12 w-12 rounded-full bg-surface text-text-primary btn-pressable",
  };

  const disabledStyles = disabled
    ? "!bg-disabled !text-text-secondary !shadow-none cursor-not-allowed"
    : "";

  return (
    <Comp
      ref={ref}
      disabled={disabled}
      className={cn(base, variants[variant], disabledStyles, className)}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </Comp>
  );
});