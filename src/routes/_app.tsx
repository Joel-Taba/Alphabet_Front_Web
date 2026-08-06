import { useEffect } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNav, MobileShell } from "@/components/amani";
import { useWritingStyle } from "@/hooks/useWritingStyle";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  // La police de toute l'appli suit ce réglage (Profil > Réglages > "Format
  // d'écriture") — useWritingStyle est réactif, donc un changement se
  // répercute immédiatement, sans rechargement de page.
  const writingStyle = useWritingStyle();

  useEffect(() => {
    document.body.classList.remove("format-script", "format-cursive");
    document.body.classList.add(`format-${writingStyle}`);
  }, [writingStyle]);

  return (
    <MobileShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div id="app-main-scroll" className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
        <BottomNav />
      </div>
    </MobileShell>
  );
}
