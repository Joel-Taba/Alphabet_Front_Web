import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Centers app content in a phone-sized column on wider screens,
 * full-bleed on mobile. Route content owns its own scroll.
 */
export function MobileShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen bg-background-alt flex items-center justify-center py-4">
      <div
        className={cn(
          "relative flex w-full max-w-[390px] flex-col overflow-hidden bg-background shadow-[var(--shadow-modal)] rounded-[40px]",
          "h-[844px] max-h-[calc(100vh-2rem)]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}