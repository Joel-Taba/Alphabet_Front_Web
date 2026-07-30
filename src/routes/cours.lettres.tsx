import { createFileRoute, Link, useNavigate, Outlet, useMatchRoute } from "@tanstack/react-router";
import { ArrowLeft, Volume2, Lock } from "lucide-react";
import { MobileShell, AmaniMascot } from "@/components/amani";
import { useSignSpeech } from "@/hooks/useSignSpeech";
import {
  MINUSCULES,
  CHIFFRES,
  MAJUSCULES,
  familleDominante,
  COULEUR_FAMILLE,
  type FormuleLettre,
} from "@/data/flores-gong-nota";
import { cn } from "@/lib/utils";
import { useLanguage, format } from "@/i18n/LanguageContext";

export const Route = createFileRoute("/cours/lettres")({
  head: () => ({
    meta: [
      { title: "Lettres & Chiffres — Amani" },
      {
        name: "description",
        content:
          "Découvre comment chaque lettre et chiffre est formé en combinant les 4 signes fondamentaux de la méthode Flores Gong Nota.",
      },
    ],
  }),
  component: LettresScreen,
});

/** Cellule d'une lettre dans la grille */
function LetterCell({
  formule,
  onNavigate,
}: {
  formule: FormuleLettre;
  onNavigate: (char: string) => void;
}) {
  const { t, lang } = useLanguage();
  const famille = familleDominante(formule);
  const couleur = COULEUR_FAMILLE[famille] ?? COULEUR_FAMILLE.trait;
  const isPending = !formule.validee;
  const nom = formule.nom[lang];

  return (
    <div
      role={isPending ? "presentation" : "button"}
      tabIndex={isPending ? -1 : 0}
      onClick={() => !isPending && onNavigate(formule.caractere)}
      onKeyDown={(e) => {
        if (!isPending && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onNavigate(formule.caractere);
        }
      }}
      aria-label={
        isPending
          ? `${nom} — ${t.coursLettres.pendingAria}`
          : format(t.coursLettres.viewAria, { name: nom })
      }
      className={cn(
        "relative flex flex-col items-center justify-center rounded-[14px] border transition-all duration-200 aspect-square",
        isPending
          ? "bg-[#F5EDE0]/60 border-[#4A3B2A]/10 cursor-not-allowed opacity-50"
          : "bg-[#FBF6EC] border-[#4A3B2A]/10 cursor-pointer shadow-[0_2px_6px_rgba(74,59,42,0.10)] hover:border-[#A9784F]/40 hover:shadow-[0_4px_12px_rgba(74,59,42,0.18)] hover:scale-[1.06] active:scale-[0.96]"
      )}
      style={
        isPending
          ? {}
          : {
              borderColor: couleur.border ? undefined : "transparent",
            }
      }
    >
      {/* Indicateur de famille (barre de couleur en haut) */}
      {!isPending && (
        <div
          className="absolute top-0 left-2 right-2 h-[3px] rounded-full mt-1.5"
          style={{ backgroundColor: couleur.text + "50" }}
        />
      )}

      {/* Verrou pour les caractères non validés */}
      {isPending && (
        <Lock
          className="absolute top-1.5 right-1.5 h-3 w-3 text-[#4A3B2A]/30"
          aria-hidden
        />
      )}

      {/* Lettre principale */}
      <span
        className="text-[26px] font-bold leading-none"
        style={{ color: isPending ? "#4A3B2A" + "40" : couleur.text }}
      >
        {formule.caractere}
      </span>

      {/* Nombre de signes */}
      {!isPending && (
        <span className="text-[10px] text-[#7A6A55] font-medium mt-0.5">
          {format(t.coursLettres.signeCount, { count: formule.signes.length })}
        </span>
      )}
    </div>
  );
}

/** Section de la grille (titre + groupe de lettres) */
function GridSection({
  titre,
  sous_titre,
  formules,
  onNavigate,
}: {
  titre: string;
  sous_titre?: string;
  formules: FormuleLettre[];
  onNavigate: (char: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-[18px] font-bold text-[#4A3B2A] leading-tight">
          {titre}
        </h2>
        {sous_titre && (
          <p className="text-[12px] text-[#7A6A55] mt-0.5">{sous_titre}</p>
        )}
      </div>
      <div className="grid grid-cols-6 gap-2">
        {formules.map((f) => (
          <LetterCell key={f.caractere} formule={f} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

function LettresScreen() {
  const { speak } = useSignSpeech();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const isExactLettres = matchRoute({ to: "/cours/lettres", fuzzy: false });

  if (!isExactLettres) {
    return <Outlet />;
  }

  const handleNavigate = (char: string) => {
    navigate({ to: "/cours/lettres/$char", params: { char } });
  };

  const familles = [
    { famille: "trait", label: t.coursLettresChar.families.trait, couleur: COULEUR_FAMILLE.trait },
    { famille: "courbe", label: t.coursLettresChar.families.courbe, couleur: COULEUR_FAMILLE.courbe },
    { famille: "crochet", label: t.coursLettresChar.families.crochet, couleur: COULEUR_FAMILLE.crochet },
    { famille: "point", label: t.coursLettresChar.families.point, couleur: COULEUR_FAMILLE.point },
  ];

  return (
    <MobileShell>
      {/* En-tête */}
      <header className="flex items-center justify-between px-6 pt-6 pb-4 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10">
        <div className="flex items-center gap-3">
          <Link
            to="/accueil"
            aria-label={t.common.back}
            className="grid h-11 w-11 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-[#4A3B2A]" strokeWidth={2.5} />
          </Link>
          <div>
            <h1 className="text-[24px] font-bold text-[#4A3B2A] leading-tight">
              {t.coursLettres.title}
            </h1>
            <p className="text-[13px] text-[#7A6A55] font-normal">
              {t.coursLettres.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <AmaniMascot pose="curiosite" size="small" />
          <button
            type="button"
            onClick={() => speak(t.coursLettres.intro)}
            aria-label={t.common.listen}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#A9784F] text-white shadow-[0_2px_6px_rgba(74,59,42,0.18)] active:scale-95 transition-transform"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Contenu — grilles */}
      <section className="flex-1 overflow-y-auto px-4 py-5 bg-[#F5EDE0] flex flex-col gap-7 pb-10">
        {/* Légende des couleurs */}
        <div className="flex flex-wrap gap-2 items-center">
          {familles.map(({ famille, label, couleur }) => (
            <div
              key={famille}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
              style={{
                backgroundColor: couleur.text + "15",
                color: couleur.text,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: couleur.text }}
              />
              {label} {t.coursLettres.legendSuffix}
            </div>
          ))}
        </div>

        {/* Minuscules — validées */}
        <GridSection
          titre={t.coursLettres.minusculesTitle}
          sous_titre={t.coursLettres.minusculesSubtitle}
          formules={MINUSCULES}
          onNavigate={handleNavigate}
        />

        {/* Chiffres */}
        <GridSection
          titre={t.coursLettres.chiffresTitle}
          sous_titre={t.coursLettres.chiffresSubtitle}
          formules={CHIFFRES}
          onNavigate={handleNavigate}
        />

        {/* Majuscules — en cours de validation */}
        <GridSection
          titre={t.coursLettres.majusculesTitle}
          sous_titre={t.coursLettres.majusculesSubtitle}
          formules={MAJUSCULES}
          onNavigate={handleNavigate}
        />
      </section>
    </MobileShell>
  );
}
