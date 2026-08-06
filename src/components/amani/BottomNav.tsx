import { Link, useRouterState } from "@tanstack/react-router";
import { Palette, User, Users, Leaf, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

const allItems = [
  { to: "/accueil", key: "accueil", icon: Leaf, isCenter: true },
  { to: "/bibliotheque", key: "bibliotheque", icon: Palette },
  { to: "/communaute", key: "communaute", icon: Users },
  { to: "/mon-profil", key: "profil", icon: User },
  { to: "/plus", key: "reglages", icon: MoreVertical },
] as const;

export function BottomNav() {
  const { t } = useLanguage();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Déterminer l'index de l'onglet actif (0 à allItems.length - 1)
  const activeIndex = allItems.findIndex(item => currentPath === item.to);

  // Calculer la position du bouton flottant (pourcentage et pixels pour SVG) :
  // les onglets sont répartis à intervalles réguliers, chaque centre au milieu
  // de sa tranche — généralisé pour ne pas dépendre d'un nombre d'onglets fixe.
  const getButtonPosition = () => {
    const n = allItems.length;
    const index = activeIndex >= 0 ? activeIndex : 0;
    const percentValue = ((2 * index + 1) / (2 * n)) * 100;
    return { percent: `${percentValue}%`, svgX: (percentValue / 100) * 350 };
  };

  const buttonPos = getButtonPosition();
  
  return (
    <nav
      aria-label={t.nav.mainNavAria}
      className="pointer-events-auto relative flex h-[110px] w-full items-end justify-center pb-4"
    >
      {/* Conteneur principal avec marges */}
      <div className="relative w-[calc(100%-32px)] max-w-[350px]">
        {/* Bouton circulaire surélevé - se déplace selon l'onglet actif */}
        <div 
          className="absolute top-0 z-20 -translate-x-1/2 transition-all duration-300 ease-in-out"
          style={{ left: buttonPos.percent }}
        >
          <div className="relative flex flex-col items-center">
            {/* Grand cercle surélevé */}
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-secondary shadow-[0_6px_20px_rgba(143,191,111,0.3)] transition-all hover:scale-105 active:scale-95">
              {activeIndex >= 0 && (() => {
                const ActiveIcon = allItems[activeIndex].icon;
                return <ActiveIcon className="h-7 w-7 text-surface" strokeWidth={2} fill={activeIndex === 0 ? "currentColor" : "none"} />;
              })()}
            </div>
            
            {/* Label en dessous, dans la barre - remonté pour éviter débordement */}
            <span className="absolute top-[58px] text-[9px] font-bold uppercase tracking-wide text-primary whitespace-nowrap">
              {activeIndex >= 0 && t.nav[allItems[activeIndex].key]}
            </span>
          </div>
        </div>

        {/* Barre flottante en forme de pilule avec encoche dynamique SVG */}
        <div className="relative mt-[22px]">
          <svg
            viewBox="0 0 350 64"
            className="h-16 w-full drop-shadow-[0_4px_16px_rgba(74,59,42,0.12)]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Forme de la barre : pilule arrondie avec encoche dynamique */}
            <path
              d={`M 32 0
                 L ${buttonPos.svgX - 35} 0
                 Q ${buttonPos.svgX - 25} 0, ${buttonPos.svgX - 20} 15
                 Q ${buttonPos.svgX - 10} 25, ${buttonPos.svgX} 25
                 Q ${buttonPos.svgX + 10} 25, ${buttonPos.svgX + 20} 15
                 Q ${buttonPos.svgX + 25} 0, ${buttonPos.svgX + 35} 0
                 L 318 0
                 Q 350 0, 350 32
                 Q 350 64, 318 64
                 L 32 64
                 Q 0 64, 0 32
                 Q 0 0, 32 0
                 Z`}
              fill="#FBF6EC"
              className="transition-all duration-300"
            />
          </svg>

          {/* Conteneur pour les onglets - superposé sur le SVG */}
          <div className="absolute inset-0 flex items-center justify-around px-6">
            {allItems.map(({ to, key, icon: Icon }, index) => {
              const label = t.nav[key];
              const isActive = currentPath === to;
              
              return (
                <Link
                  key={to}
                  to={to}
                  activeOptions={{ exact: true }}
                  className={cn(
                    "group relative flex flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 transition-all",
                    isActive && "opacity-0" // Masquer l'onglet actif car il est dans le cercle
                  )}
                >
                  {/* Indicateur actif au-dessus de l'icône */}
                  <span className="absolute -top-1 h-0.5 w-4 rounded-full bg-secondary opacity-0 transition-opacity duration-200 group-data-[status=active]:opacity-100" />
                  
                  <Icon 
                    className={cn(
                      "h-5 w-5 transition-colors",
                      "text-disabled group-data-[status=active]:text-secondary"
                    )} 
                    strokeWidth={1.8}
                  />
                  <span className={cn(
                    "mt-0.5 text-[9px] font-semibold transition-colors truncate max-w-[60px] text-center",
                    "text-disabled group-data-[status=active]:text-secondary"
                  )}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}