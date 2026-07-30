import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, AmaniMascot, MobileShell } from "@/components/amani";
import { useLanguage } from "@/i18n/LanguageContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amani — Bienvenue" },
      {
        name: "description",
        content:
          "Découvre Amani et pars à l'aventure des 5 signes, à ton rythme et sans pression.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { t } = useLanguage();
  return (
    <MobileShell>
      <section className="flex flex-1 flex-col items-center justify-between px-6 pt-10 pb-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <p className="text-[14px] font-semibold uppercase tracking-widest text-primary">
            {t.welcome.title}
          </p>
          <h1 className="text-[32px] leading-10 font-bold text-text-primary">
            {t.welcome.heading}
          </h1>
          <p className="max-w-xs text-[24px] leading-8 font-medium text-text-secondary">
            {t.welcome.subheading}
          </p>
        </div>

        <AmaniMascot pose="accueil" size="hero" priority />

        <div className="flex w-full flex-col gap-3">
          <Button variant="primary" asChild={false} className="w-full">
            <Link to="/profil" className="flex h-full w-full items-center justify-center">
              {t.welcome.start}
            </Link>
          </Button>
          <Link
            to="/accueil"
            className="text-[16px] font-semibold text-text-secondary underline-offset-4 hover:underline"
          >
            {t.welcome.imBack}
          </Link>
        </div>
      </section>
    </MobileShell>
  );
}

