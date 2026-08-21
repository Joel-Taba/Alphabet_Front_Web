import accueil from "@/assets/amani-accueil.png";
import demonstration from "@/assets/amani-demonstration.png";
import encouragement from "@/assets/amani-encouragement.png";
import celebration from "@/assets/amani-celebration.png";
import reconfort from "@/assets/amani-reconfort.png";
import reflexion from "@/assets/amani-reflexion.png";
import veille from "@/assets/amani-veille.png";
import miniReussite from "@/assets/amani-mini-reussite.png";
import miniReessai from "@/assets/amani-reessai.png";
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

export type AmaniSize = "hero-lg" | "hero" | "medium" | "small" | "avatar";

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
  "hero-lg": 288,
  hero: 240,
  medium: 120,
  small: 72,
  avatar: 48,
};

const labels: Record<AmaniPose, string> = {
  accueil: "Flores Gong Nota te salue",
  demonstration: "Flores Gong Nota te montre un signe",
  encouragement: "Flores Gong Nota t'encourage",
  celebration: "Flores Gong Nota célèbre ta réussite",
  reconfort: "Flores Gong Nota te réconforte",
  reflexion: "Flores Gong Nota réfléchit",
  veille: "Flores Gong Nota se repose",
  mini_reussite: "Flores Gong Nota est ravi de ta réussite",
  mini_reessai: "Flores Gong Nota t'encourage à réessayer",
  invitation: "Flores Gong Nota t'invite à continuer",
  curiosite: "Flores Gong Nota est curieux",
  emerveillement: "Flores Gong Nota s'émerveille",
  victoire_palier: "Flores Gong Nota fête ton palier",
  podium: "Flores Gong Nota te félicite sur le podium",
  dessin: "Flores Gong Nota dessine",
  perdu: "Flores Gong Nota est perdu",
  profil: "Flores Gong Nota lit et prend des notes dans la forêt",
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