import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";
import { MobileShell, AmaniMascot, HelpBubble, Button } from "@/components/amani";

export const Route = createFileRoute("/exercice-intro")({
  head: () => ({
    meta: [
      { title: "Prêt·e pour l'exercice ?" },
      {
        name: "description",
        content: "Amani te présente l'exercice avant de commencer.",
      },
    ],
  }),
  component: ExerciceIntro,
});

function ExerciceIntro() {
  return (
    <MobileShell>
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-6 pt-6">
        <Link
          to="/accueil"
          aria-label="Retour"
          className="grid h-11 w-11 place-items-center rounded-full bg-surface"
        >
          <ArrowLeft className="h-5 w-5 rtl:rotate-180" strokeWidth={2.5} />
        </Link>
        <h1 className="truncate text-center text-[18px] font-bold text-text-primary">
          Prochain exercice
        </h1>
        <span className="w-11" />
      </header>

      <section className="flex flex-1 flex-col gap-6 px-6 pt-4 pb-6">
        <div className="flex flex-col items-center gap-4">
          <AmaniMascot pose="encouragement" size="hero" priority />
          <HelpBubble>
            On va <strong>reconnaître des signes</strong> ensemble !
          </HelpBubble>
        </div>

        <div className="flex items-center gap-4 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary">
            <Search className="h-8 w-8" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] uppercase tracking-wide text-text-secondary">
              Type d'exercice
            </p>
            <p className="text-[18px] font-bold text-text-primary">Reconnaissance</p>
            <p className="text-[14px] text-text-secondary">
              Trouve le bon signe parmi une petite grille.
            </p>
          </div>
        </div>

        <div
          className="rounded-3xl bg-background-alt p-4"
          aria-label="Aperçu de la grille de l'exercice"
        >
          <p className="mb-3 text-[12px] uppercase tracking-wide text-text-secondary">
            Aperçu
          </p>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                aria-hidden
                className="aspect-square rounded-2xl bg-surface shadow-[var(--shadow-card)]"
              >
                <div className="grid h-full w-full place-items-center">
                  <div className="h-3 w-8 rounded-full bg-disabled" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center gap-3">
          <Button variant="primary" asChild className="w-full">
            <Link to="/exercice">Commencer</Link>
          </Button>
          <button
            type="button"
            className="text-[14px] font-semibold text-text-secondary underline underline-offset-4"
          >
            Voir une démonstration
          </button>
        </div>
      </section>
    </MobileShell>
  );
}