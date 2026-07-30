import { AmaniMascot } from "./AmaniMascot";

export function GrandArbre({ unlockedLevel = 1 }: { unlockedLevel?: 1 | 2 | 3 }) {
  const trunk = "var(--color-primary)";
  const trunkDark = "var(--color-primary-dark)";
  const leaf = "var(--color-secondary)";
  const disabled = "var(--color-disabled)";

  const bud = (level: 1 | 2 | 3, cx: number, cy: number) => {
    const unlocked = level <= unlockedLevel;
    return (
      <g>
        <circle cx={cx} cy={cy} r="22" fill={unlocked ? leaf : disabled} />
        <circle cx={cx} cy={cy} r="10" fill="var(--color-surface)" opacity={0.7} />
      </g>
    );
  };

  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg viewBox="0 0 320 380" className="h-auto w-full" role="img" aria-label="Le Grand Arbre">
        <path
          d="M150 360 C 148 300 152 240 158 180 C 162 130 154 90 160 40"
          stroke={trunk}
          strokeWidth="18"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M150 360 C 148 300 152 240 158 180"
          stroke={trunkDark}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity={0.4}
        />
        <path
          d="M155 290 Q 210 275 250 250"
          stroke={1 <= unlockedLevel ? trunk : disabled}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        {bud(1, 260, 246)}
        <path
          d="M156 200 Q 100 180 60 155"
          stroke={2 <= unlockedLevel ? trunk : disabled}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        {bud(2, 55, 150)}
        <path
          d="M160 90 Q 220 70 260 55"
          stroke={3 <= unlockedLevel ? trunk : disabled}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        {bud(3, 270, 52)}
      </svg>
      <div className="absolute bottom-4 left-4">
        <AmaniMascot pose="accueil" size="medium" priority />
      </div>
    </div>
  );
}