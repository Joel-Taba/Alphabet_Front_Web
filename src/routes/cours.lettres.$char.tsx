import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { MobileShell, SignGlyph, CahierFrame } from "@/components/amani";
import {
  FORMULES_PAR_CARACTERE,
  COULEUR_FAMILLE,
  STROKE_FAMILLE,
  LABEL_ZONE,
  familleDominante,
  type FormuleLettre,
} from "@/data/flores-gong-nota";
import { useLanguage, type Lang } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cours/lettres/$char")({
  head: ({ params }) => ({
    meta: [
      { title: `Décomposition de "${params.char}" — Flores` },
      {
        name: "description",
        content: `Découvre les signes qui composent la lettre "${params.char}" dans la méthode Flores Gong Nota.`,
      },
    ],
  }),
  component: DecompositionScreen,
});

/** Bande des lignes Seyès avec le grand caractère rendu dessus (lecture) */
function AffichageLettreSeyès({
  formule,
  lang,
}: {
  formule: FormuleLettre;
  lang: Lang;
}) {
  const famille = familleDominante(formule);
  const strokeColor = STROKE_FAMILLE[famille] ?? "#4A3B2A";

  // Affiche le premier signe (signe principal / dominant) à grande échelle
  const signePrincipal = formule.signes[0];

  return (
    <CahierFrame className="relative w-full h-[160px] border border-[#4A3B2A]/10 shadow-inner" rounded={16}>
      {/* Grand caractère centré */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="text-[88px] font-bold leading-none select-none"
          style={{ color: strokeColor + "22" }}
          aria-hidden
        >
          {formule.caractere}
        </span>
      </div>

      {/* Signe principal SVG centré */}
      {signePrincipal && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <SignGlyph
            family={signePrincipal.famille}
            variant={signePrincipal.variante}
            stroke={strokeColor}
            strokeWidth={10}
            className="w-[110px] h-[110px] opacity-80"
          />
        </div>
      )}

      {/* Badge zone */}
      <div
        className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold"
        style={{
          backgroundColor:
            formule.zone === "corps"
              ? "#8FBF6F20"
              : formule.zone === "hampe"
                ? "#4A90E220"
                : "#E0525220",
          color:
            formule.zone === "corps"
              ? "#4A7A30"
              : formule.zone === "hampe"
                ? "#2D6BBF"
                : "#C03E3E",
        }}
      >
        {LABEL_ZONE[formule.zone][lang]}
      </div>
    </CahierFrame>
  );
}

function DecompositionScreen() {
  const { char } = Route.useParams();
  const { t, lang } = useLanguage();

  const formule = FORMULES_PAR_CARACTERE.get(char);

  if (!formule) {
    return (
      <MobileShell>
        <div className="flex flex-col items-center justify-center flex-1 p-8 gap-4 bg-[#F5EDE0]">
          <p className="text-[#4A3B2A] text-[18px] font-bold text-center">
            "{char}" {t.coursLettresChar.notFound}.
          </p>
          <Link
            to="/cours/lettres"
            className="px-6 py-3 rounded-full bg-[#8FBF6F] text-white font-bold text-[15px]"
          >
            {t.coursLettresChar.backToList}
          </Link>
        </div>
      </MobileShell>
    );
  }

  const famille = familleDominante(formule);
  const couleur = COULEUR_FAMILLE[famille] ?? COULEUR_FAMILLE.trait;
  const nom = formule.nom[lang];

  return (
    <MobileShell>
      {/* En-tête */}
      <header className="flex items-center justify-between px-6 pt-6 pb-4 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10">
        <div className="flex items-center gap-3">
          <Link
            to="/cours/lettres"
            aria-label={t.common.back}
            className="grid h-11 w-11 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-[#4A3B2A] rtl:rotate-180" strokeWidth={2.5} />
          </Link>
          <div>
            <h1 className="text-[24px] font-bold text-[#4A3B2A] leading-tight">
              <span style={{ color: couleur.text }}>"{formule.caractere}"</span>
            </h1>
            <p className="text-[13px] text-[#7A6A55] font-normal">{nom}</p>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <section className="flex-1 overflow-y-auto px-4 py-5 bg-[#F5EDE0] flex flex-col gap-6 pb-10">

        {/* Avertissement si non validée */}
        {!formule.validee && (
          <div className="bg-[#FFF3CD] border border-[#F0C040] rounded-[14px] p-3.5 flex items-start gap-2.5">
            <span className="text-[18px] shrink-0 mt-0.5">⚠️</span>
            <p className="text-[13px] text-[#7A5C00] font-medium leading-snug">
              {t.coursLettresChar.pendingWarning}
            </p>
          </div>
        )}

        {/* Affichage sur lignes Seyès */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[14px] font-bold text-[#4A3B2A] uppercase tracking-wide">
            {t.coursLettresChar.seenOnLines}
          </h2>
          <AffichageLettreSeyès formule={formule} lang={lang} />
        </div>

        {/* Note pédagogique a/d/q si applicable */}
        {["a", "d", "q"].includes(formule.caractere) && (
          <div className="bg-[#EAF4FF] border border-[#4A90E2]/30 rounded-[14px] p-3.5 flex items-start gap-2.5">
            <span className="text-[18px] shrink-0 mt-0.5">💡</span>
            <p className="text-[13px] text-[#2D5E8A] font-medium leading-snug">
              {t.coursLettresChar.adqNote}
            </p>
          </div>
        )}

        {/* Lien vers le cahier d'écriture */}
        <div className="flex flex-col gap-2">
          <Link
            to="/exercice-liste"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#8FBF6F] text-white font-bold text-[15px] shadow-[0_4px_12px_rgba(143,191,111,0.3)] active:scale-95 transition-transform"
          >
            <BookOpen className="h-5 w-5" />
            {t.coursLettresChar.practiceLink}
          </Link>
          <Link
            to="/cours/lettres"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#4A3B2A]/10 text-[#4A3B2A] font-semibold text-[14px] active:scale-95 transition-transform"
          >
            {t.coursLettresChar.seeAll}
          </Link>
        </div>
      </section>
    </MobileShell>
  );
}
