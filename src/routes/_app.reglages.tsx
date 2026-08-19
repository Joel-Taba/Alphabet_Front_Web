import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_app/reglages")({
  head: () => ({
    meta: [
      { title: "Réglages — Flores Gong Nota" },
      { name: "description", content: "Ajuste la langue, le son, la police et les animations." },
    ],
  }),
  component: ReglagesRedirect,
});

function ReglagesRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/mon-profil", replace: true });
  }, [navigate]);

  return null;
}
