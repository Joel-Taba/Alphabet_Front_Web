export type NodeState = "locked" | "current" | "completed";

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-[14px] text-text-secondary">
        <span>Exercice {current} / {total}</span>
        <span>{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        className="h-2 w-full overflow-hidden rounded-full bg-disabled"
      >
        <div
          className="h-full rounded-full bg-secondary transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}