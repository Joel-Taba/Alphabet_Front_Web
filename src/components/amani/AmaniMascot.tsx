import accueil from "@/assets/amani-accueil.png";
import demonstration from "@/assets/amani-demonstration.png";
import encouragement from "@/assets/amani-encouragement.png";
import celebration from "@/assets/amani-celebration.png";
import reconfort from "@/assets/amani-reconfort.png";
import reflexion from "@/assets/amani-reflexion.png";
import veille from "@/assets/amani-veille.png";
import miniReussite from "@/assets/amani-mini-reussite.png";
import miniReessai from "@/assets/amani-mini-reessai.png";
import invitation from "@/assets/amani-invitation.png";
import curiosite from "@/assets/amani-curiosite.png";
import emerveillement from "@/assets/amani-emerveillement.png";
import victoirePalier from "@/assets/amani-victoire-palier.png";
import podium from "@/assets/amani-podium.png";
import dessin from "@/assets/amani-dessin.png";
import perdu from "@/assets/amani-perdu.png";
import profil from "@/assets/amani-profil.png";

export type AmaniPose =
  | "accueil"
  | "demonstration"
  | "encouragement"
  | "celebration"
  | "reconfort"
  | "reflexion"
  | "veille"
  | "mini_reussite"
  | "mini_reessai"
  | "invitation"
  | "curiosite"
  | "emerveillement"
  | "victoire_palier"
  | "podium"
  | "dessin"
  | "perdu"
  | "profil";

export type AmaniSize = "hero" | "medium" | "small" | "avatar";

const poses: Record<AmaniPose, string> = {
  accueil,
  demonstration,
  encouragement,
  celebration,
  reconfort,
  reflexion,
  veille,
  mini_reussite: miniReussite,
  mini_reessai: miniReessai,
  invitation,
  curiosite,
  emerveillement,
  victoire_palier: victoirePalier,
  podium,
  dessin,
  perdu,
  profil,
};

const sizes: Record<AmaniSize, number> = {
  hero: 240,
  medium: 120,
  small: 72,
  avatar: 48,
};

const labels: Record<AmaniPose, string> = {
  accueil: "Amani te salue",
  demonstration: "Amani te montre un signe",
  encouragement: "Amani t'encourage",
  celebration: "Amani célèbre ta réussite",
  reconfort: "Amani te réconforte",
  reflexion: "Amani réfléchit",
  veille: "Amani se repose",
  mini_reussite: "Amani est ravi de ta réussite",
  mini_reessai: "Amani t'encourage à réessayer",
  invitation: "Amani t'invite à continuer",
  curiosite: "Amani est curieux",
  emerveillement: "Amani s'émerveille",
  victoire_palier: "Amani fête ton palier",
  podium: "Amani te félicite sur le podium",
  dessin: "Amani dessine",
  perdu: "Amani est perdu",
  profil: "Amani lit et prend des notes dans la forêt",
};

export function AmaniMascot({
  pose = "accueil",
  size = "medium",
  priority = false,
  waving = false,
}: {
  pose?: AmaniPose;
  size?: AmaniSize;
  priority?: boolean;
  waving?: boolean;
}) {
  const dim = sizes[size];
  return (
    <>
      <img
        src={poses[pose]}
        alt={labels[pose]}
        width={dim}
        height={dim}
        loading={priority ? "eager" : "lazy"}
        className="select-none"
        draggable={false}
        style={{
          width: dim,
          height: dim,
          transformOrigin: waving ? "bottom center" : undefined,
          animation: waving ? "amani-wave 1.2s ease-in-out infinite alternate" : undefined,
        }}
      />
      {waving && (
        <style>{`
          @keyframes amani-wave {
            0% { transform: rotate(-10deg); }
            100% { transform: rotate(10deg); }
          }
        `}</style>
      )}
    </>
  );
}