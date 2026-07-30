import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarBadge({ count, total = 3 }: { count: number; total?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${count} sur ${total} étoiles`}>
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < count;
        return (
          <Star
            key={i}
            className={cn(
              "h-8 w-8",
              filled ? "fill-secondary text-secondary" : "fill-transparent text-disabled",
            )}
            strokeWidth={2}
          />
        );
      })}
    </div>
  );
}