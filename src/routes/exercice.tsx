import { createFileRoute, Navigate, Outlet, useMatchRoute } from "@tanstack/react-router";

/**
 * Page "Exercice" (palier de fin de niveau) : récapitulatif de tous les
 * signes/variantes travaillés dans le palier — c'est exactement le même
 * écran que /exercice-liste sans filtre de famille (toutes les familles
 * groupées), pour que l'apprenant les refasse tous.
 *
 * `/exercice/lettre/$char` reste une route enfant de celle-ci (Outlet),
 * donc la redirection ne doit s'appliquer que sur la correspondance exacte.
 */
export const Route = createFileRoute("/exercice")({
  head: () => ({
    meta: [
      { title: "Exercice — Flores Gong Nota" },
      { name: "description", content: "Récapitulatif des signes et variantes du palier." },
    ],
  }),
  component: ExercicePalierRecap,
});

function ExercicePalierRecap() {
  const matchRoute = useMatchRoute();
  const isExact = matchRoute({ to: "/exercice", fuzzy: false });

  if (!isExact) return <Outlet />;

  return <Navigate to="/exercice-liste" />;
}
