import { Volume2 } from "lucide-react";
import type { ReactNode } from "react";

export function HelpBubble({ children, onReplay }: { children: ReactNode; onReplay?: () => void }) {
  return (
    <div className="relative max-w-sm rounded-3xl bg-surface p-4 shadow-[var(--shadow-modal)]">
      <div className="flex items-start gap-3">
        <div className="flex-1 text-[20px] leading-7 text-text-primary">{children}</div>
        {onReplay && (
          <button
            type="button"
            onClick={onReplay}
            aria-label="Réécouter la consigne"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            <Volume2 className="h-6 w-6" strokeWidth={2.5} />
          </button>
        )}
      </div>
      <span aria-hidden className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 bg-surface" />
    </div>
  );
}