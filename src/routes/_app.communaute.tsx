import { createFileRoute } from "@tanstack/react-router";
import { AmaniMascot } from "@/components/amani";
import { cn } from "@/lib/utils";
import { useLanguage, format } from "@/i18n/LanguageContext";

export const Route = createFileRoute("/_app/communaute")({
  head: () => ({
    meta: [
      { title: "Notre Communauté " },
      {
        name: "description",
        content:
          "Classement local de la semaine : les explorateurs de cette tablette et leurs étoiles.",
      },
    ],
  }),
  component: Communaute,
});

type Animal = "renard" | "hibou" | "ecureuil" | "herisson" | "panda" | "biche";

type Profil = {
  id: string;
  prenom: string;
  animal: Animal;
  score: number;
  moi?: boolean;
};

// Profils locaux de la tablette (jamais en ligne)
const profilsBruts: Profil[] = [
  { id: "1", prenom: "Sami", animal: "hibou", score: 240 },
  { id: "2", prenom: "Mia", animal: "herisson", score: 190 },
  { id: "3", prenom: "Lila", animal: "renard", score: 150, moi: true },
  { id: "4", prenom: "Noé", animal: "ecureuil", score: 110 },
  { id: "5", prenom: "Tao", animal: "biche", score: 80 },
  { id: "6", prenom: "Ava", animal: "panda", score: 45 },
];

const animalEmoji: Record<Animal, string> = {
  renard: "🦊",
  hibou: "🦉",
  ecureuil: "🐿️",
  herisson: "🦔",
  panda: "🐼",
  biche: "🦌",
};

const rankRing: Record<1 | 2 | 3, string> = {
  1: "0 0 0 4px #F3D07A, 0 6px 16px rgba(227,184,115,0.45)",
  2: "0 0 0 4px #D8CFC0, 0 6px 14px rgba(74,59,42,0.18)",
  3: "0 0 0 4px #E0A98C, 0 6px 14px rgba(224,169,140,0.35)",
};

function Avatar({
  animal,
  size = 56,
  highlight,
  rank,
}: {
  animal: Animal;
  size?: number;
  highlight?: boolean;
  rank?: 1 | 2 | 3;
}) {
  const baseShadow = rank ? rankRing[rank] : "var(--shadow-card)";
  const boxShadow = highlight ? `${baseShadow}, 0 0 0 8px rgba(143,191,111,0.55)` : baseShadow;

  return (
    <div
      className="grid place-items-center rounded-full border-4 border-primary-dark bg-surface"
      style={{ width: size, height: size, boxShadow }}
      aria-hidden
    >
      <span style={{ fontSize: size * 0.55, lineHeight: 1 }}>{animalEmoji[animal]}</span>
    </div>
  );
}

function Souche({
  height,
  width = 96,
  rank,
  ariaLabel,
}: {
  height: number;
  width?: number;
  rank: 1 | 2 | 3;
  ariaLabel: string;
}) {
  const rankColor =
    rank === 1 ? "var(--color-neutral-warning)" : rank === 2 ? "var(--color-disabled)" : "var(--color-sign-virgule)";
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Corps de la souche */}
      <rect
        x="6"
        y="14"
        width={width - 12}
        height={height - 20}
        rx="14"
        fill="var(--color-primary)"
        stroke="var(--color-primary-dark)"
        strokeWidth="3"
      />
      {/* Anneaux du bois */}
      <ellipse
        cx={width / 2}
        cy="18"
        rx={(width - 24) / 2}
        ry="10"
        fill="var(--color-primary-dark)"
      />
      <ellipse
        cx={width / 2}
        cy="18"
        rx={(width - 40) / 2}
        ry="6"
        fill="var(--color-primary)"
      />
      <circle cx={width / 2} cy="18" r="3" fill="var(--color-primary-dark)" />
      {/* Médaille rang */}
      <g transform={`translate(${width / 2 - 14} ${height - 34})`}>
        <circle cx="14" cy="14" r="14" fill={rankColor} stroke="var(--color-primary-dark)" strokeWidth="2.5" />
        <text
          x="14"
          y="19"
          textAnchor="middle"
          fontSize="15"
          fontWeight="700"
          fill="var(--color-primary-dark)"
          fontFamily="Baloo 2, sans-serif"
        >
          {rank}
        </text>
      </g>
    </svg>
  );
}

function PodiumSpot({
  profil,
  rank,
  starsSuffix,
  rankAriaLabel,
}: {
  profil: Profil;
  rank: 1 | 2 | 3;
  starsSuffix: string;
  rankAriaLabel: string;
}) {
  const heights: Record<1 | 2 | 3, number> = { 1: 130, 2: 100, 3: 80 };
  const avatarSize = rank === 1 ? 76 : 60;
  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar animal={profil.animal} size={avatarSize} highlight={profil.moi} rank={rank} />
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "text-[14px] font-bold text-text-primary",
            profil.moi && "text-primary-dark",
          )}
        >
          {profil.prenom}
        </span>
        <span className="text-[13px] font-semibold text-text-secondary">
          {profil.score} {starsSuffix}
        </span>
      </div>
      <Souche height={heights[rank]} rank={rank} ariaLabel={rankAriaLabel} />
    </div>
  );
}

function Communaute() {
  const { t } = useLanguage();
  const classement = [...profilsBruts].sort((a, b) => b.score - a.score);
  const top3 = classement.slice(0, 3);
  const reste = classement.slice(3);

  // Ordre visuel podium : 2 - 1 - 3
  type PodiumEntry = { profil: Profil; rank: 1 | 2 | 3 };
  const podiumOrdre: PodiumEntry[] = (
    [
      { profil: top3[1], rank: 2 },
      { profil: top3[0], rank: 1 },
      { profil: top3[2], rank: 3 },
    ] as PodiumEntry[]
  ).filter((x) => Boolean(x.profil));

  return (
    <div
      className="flex flex-col gap-6 px-6 pt-6 pb-8"
      style={{ background: "linear-gradient(180deg, #F5EDE0 0%, #EFE3CE 100%)" }}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-left">
          <h1 className="text-[24px] leading-8 font-bold" style={{ color: "#4A3B2A" }}>
            {t.community.title}
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: "#7A6A55" }}>
            {t.community.subtitle}
          </p>
        </div>
        <div className="shrink-0 -mt-2 -mr-2">
          <AmaniMascot pose="podium" size="small" />
        </div>
      </header>

      {/* Podium */}
      <div
        className="rounded-[28px] p-4"
        style={{ background: "#FBF6EC", boxShadow: "0 4px 16px rgba(74,59,42,0.12)" }}
      >
        <div
          className="rounded-2xl p-4"
          style={{ background: "linear-gradient(180deg, #EFE3CE 0%, #E9DABF 100%)" }}
        >
          <div className="flex items-end justify-center gap-3">
            {podiumOrdre.map(({ profil, rank }) => (
              <PodiumSpot
                key={profil.id}
                profil={profil}
                rank={rank}
                starsSuffix={t.community.starsSuffix}
                rankAriaLabel={format(t.community.stumpAria, { rank })}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Liste des suivants */}
      {reste.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="px-1 text-[16px] font-semibold text-text-secondary">
            {t.community.othersTitle}
          </h2>
          <ul className="flex flex-col gap-2">
            {reste.map((p, i) => {
              const rang = i + 4;
              return (
                <li
                  key={p.id}
                  className={cn(
                    "grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 rounded-2xl p-3",
                    p.moi
                      ? "ring-2 ring-secondary bg-secondary/10"
                      : "bg-surface shadow-[var(--shadow-card)]",
                  )}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-background-alt text-[14px] font-bold text-text-secondary">
                    {rang}
                  </span>
                  <Avatar animal={p.animal} size={44} highlight={p.moi} />
                  <span
                    className={cn(
                      "truncate text-[16px] font-semibold text-text-primary",
                      p.moi && "text-primary-dark",
                    )}
                  >
                    {p.prenom}
                    {p.moi && (
                      <span className="ml-2 rounded-full bg-secondary/30 px-2 py-0.5 text-[12px] font-semibold text-primary-dark">
                        {t.community.you}
                      </span>
                    )}
                  </span>
                  <span className="text-[14px] font-semibold text-text-secondary">
                    {p.score} {t.community.starsSuffix}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Mot d'Amani */}
      <div className="flex items-start gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
        <AmaniMascot pose="encouragement" size="medium" />
        <div className="flex-1">
          <p className="text-[16px] leading-6 text-text-primary">
            {t.community.amaniLine}
          </p>
          <p className="mt-1 text-[14px] text-text-secondary">
            — Amani : « {t.community.amaniQuote} »
          </p>
        </div>
      </div>

      <p className="text-center text-[12px] text-text-secondary">
        {t.community.footnote}
      </p>
    </div>
  );
}
