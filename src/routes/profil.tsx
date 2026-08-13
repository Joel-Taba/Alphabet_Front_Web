import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe, Lock, Eye, EyeOff, Camera } from "lucide-react";
import { MobileShell } from "@/components/amani";
import amaniInscription from "@/assets/amani-inscription.jpeg";
import { useLanguage, type Lang } from "@/i18n/LanguageContext";
import { setStoredName, setStoredPassword, getStoredPhoto, setStoredPhoto } from "@/lib/profileAuth";
import { resizeImageToDataUrl } from "@/lib/resizeImageToDataUrl";

const MIN_PASSWORD_LENGTH = 4;

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Créer mon profil — Amani" },
      {
        name: "description",
        content: "Crée ton profil d'explorateur : prénom et langue.",
      },
    ],
  }),
  component: ProfileCreate,
});

/* ── Icône feuille SVG décorative ── */
function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2C7 2 3 7 3 12c0 4 2.5 7.5 6 9 .5-3 2-5.5 4.5-7C16 12.5 19 10 20 7c-2 0-4 .5-5.5 2C13 7 12 4.5 12 2Z"
        fill="#8FBF6F"
        opacity="0.85"
      />
    </svg>
  );
}

/* ── Petite feuille accent décorative ── */
function LeafAccent({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 28"
      fill="none"
      width={18}
      height={24}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden="true"
    >
      <path
        d="M10 2C6 5 2 10 3 16c.5 3 2 5.5 4.5 7C8 19 9 14 10 10c1 4 2 9 2.5 13 2.5-1.5 4-4 4.5-7C18 10 14 5 10 2Z"
        fill="#A9784F"
        opacity="0.6"
      />
    </svg>
  );
}

const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "ar", label: "العربية" },
];

function ProfileCreate() {
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  // Initialisé à null (identique au rendu serveur) puis rempli après le montage
  // client : cette page est rendue côté serveur, où localStorage n'existe pas —
  // lire la photo dans l'initialiseur de useState créerait un mismatch d'hydratation
  // qui ferait perdre la valeur au premier rendu client.
  const [photo, setPhoto] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhoto(getStoredPhoto());
  }, []);

  const selectedLang = LANGUAGES.find((l) => l.code === lang)!;
  const canContinue = name.trim().length >= 2 && password.length >= MIN_PASSWORD_LENGTH;

  const handleStart = () => {
    if (!canContinue) return;
    setStoredName(name.trim());
    setStoredPassword(password);
    navigate({ to: "/accueil" });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setStoredPhoto(dataUrl);
      setPhoto(dataUrl);
    } catch {
      // La photo est un plus, pas un blocage : on ignore silencieusement un fichier invalide.
    }
  };

  return (
    <MobileShell>
      {/* ── Fond dégradé plein écran ── */}
      <div
        className="relative flex flex-1 flex-col overflow-y-auto"
        style={{
          background: "linear-gradient(160deg, #F5EDE0 0%, #EEDFC8 100%)",
        }}
      >
        {/* ── Zone supérieure : icône + titre ── */}
        <div className="flex flex-col items-center gap-2 pt-10 px-6 text-center">
          {/* Icône gland/feuille */}
          <LeafIcon className="w-9 h-9 mb-1" />

          {/* Titre avec accents feuille */}
          <div className="flex items-center gap-3">
            <LeafAccent />
            <h1
              className="text-[34px] font-bold leading-tight"
              style={{ color: "#A9784F" }}
            >
              {t.onboarding.title}
            </h1>
            <LeafAccent flip />
          </div>

          {/* Sous-titre */}
          <p
            className="text-[15px] leading-snug max-w-[240px]"
            style={{ color: "#7A6A55" }}
          >
            {t.onboarding.subtitle}
          </p>
        </div>

        {/* ── Mascotte (ou photo choisie) penchée par-dessus la carte ── */}
        <div className="relative z-10 flex justify-center" style={{ marginBottom: "-56px", marginTop: "16px" }}>
          <div className="relative" style={{ width: 140, height: 140 }}>
            <img
              src={photo ?? amaniInscription}
              alt={photo ? "" : "Amani se penche avec curiosité"}
              aria-hidden={photo ? true : undefined}
              className="select-none"
              draggable={false}
              style={{
                width: 140,
                height: 140,
                objectFit: "cover",
                objectPosition: photo ? "center" : "top center",
                borderRadius: "50%",
                filter: "drop-shadow(0 4px 12px rgba(74,59,42,0.18))",
              }}
            />
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              aria-label={t.profileHub.photoChangeAria}
              className="absolute bottom-1 right-1 grid h-9 w-9 place-items-center rounded-full text-white border-2 border-white shadow-sm active:scale-95 transition-transform"
              style={{ background: "#A9784F" }}
            >
              <Camera className="w-4.5 h-4.5" strokeWidth={2.2} />
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        {/* ── Carte principale ── */}
        <div
          className="relative z-0 mx-4 flex flex-col gap-5 rounded-[28px] px-6 pt-16 pb-8"
          style={{
            background: "#FBF6EC",
            boxShadow: "0 -2px 0 rgba(169,120,79,0.06), 0 8px 28px rgba(74,59,42,0.14)",
            flex: 1,
          }}
        >
          {/* ── Champ Prénom ── */}
          <div
            className="flex items-center gap-3 rounded-full border-2 px-4 h-[58px] transition-all"
            style={{
              borderColor: name ? "#8FBF6F" : "#D8CFC0",
              background: "#FFFFFF",
            }}
          >
            {/* Badge circulaire vert */}
            <span
              className="flex items-center justify-center shrink-0 rounded-full w-9 h-9 text-[20px]"
              style={{ background: "#8FBF6F" }}
              aria-hidden="true"
            >
              😊
            </span>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.onboarding.namePlaceholder}
              className="flex-1 bg-transparent text-[16px] font-medium outline-none placeholder:text-[#B8A88A]"
              style={{ color: "#4A3B2A" }}
              autoComplete="off"
            />
          </div>

          {/* ── Champ Mot de passe (protège l'accès à Mon Profil) ── */}
          <div className="flex flex-col gap-1.5">
            <div
              className="flex items-center gap-3 rounded-full border-2 px-4 h-[58px] transition-all"
              style={{
                borderColor: password ? "#8FBF6F" : "#D8CFC0",
                background: "#FFFFFF",
              }}
            >
              <span
                className="flex items-center justify-center shrink-0 rounded-full w-9 h-9"
                style={{ background: "#A9784F" }}
                aria-hidden="true"
              >
                <Lock className="w-4.5 h-4.5 text-white" strokeWidth={2.2} />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.onboarding.passwordPlaceholder}
                className="flex-1 bg-transparent text-[16px] font-medium outline-none placeholder:text-[#B8A88A]"
                style={{ color: "#4A3B2A" }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t.onboarding.hidePassword : t.onboarding.showPassword}
                className="shrink-0 text-[#7A6A55]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-[12px] px-4" style={{ color: "#7A6A55" }}>
              {t.onboarding.passwordHint}
            </p>
          </div>

          {/* ── Champ Langue ── */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              className="flex items-center gap-3 rounded-full border-2 px-4 h-[58px] w-full transition-all text-start"
              style={{
                borderColor: "#D8CFC0",
                background: "#FFFFFF",
              }}
            >
              {/* Badge circulaire globe */}
              <span
                className="flex items-center justify-center shrink-0 rounded-full w-9 h-9"
                style={{ background: "#A9784F" }}
                aria-hidden="true"
              >
                <Globe className="w-5 h-5 text-white" strokeWidth={2} />
              </span>
              <span
                className="flex-1 text-[16px] font-medium"
                style={{ color: "#4A3B2A" }}
              >
                {selectedLang.label}
              </span>
              <ChevronDown
                className="w-5 h-5 shrink-0 transition-transform"
                style={{
                  color: "#7A6A55",
                  transform: langOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
                strokeWidth={2.2}
              />
            </button>

            {/* Dropdown options */}
            {langOpen && (
              <ul
                role="listbox"
                className="absolute z-20 mt-2 w-full rounded-2xl overflow-hidden"
                style={{
                  background: "#FBF6EC",
                  boxShadow: "0 6px 20px rgba(74,59,42,0.16)",
                  border: "1.5px solid #D8CFC0",
                }}
              >
                {LANGUAGES.map((l) => (
                  <li key={l.code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={lang === l.code}
                      onClick={() => {
                        setLang(l.code);
                        setLangOpen(false);
                      }}
                      className="w-full px-5 py-3 text-start text-[16px] font-medium transition-colors hover:bg-[#EFE3CE]"
                      style={{
                        color: lang === l.code ? "#8FBF6F" : "#4A3B2A",
                        fontWeight: lang === l.code ? 700 : 500,
                      }}
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Bouton principal CTA ── */}
          <button
            type="button"
            disabled={!canContinue}
            onClick={handleStart}
            className="mt-2 w-full h-[58px] rounded-full text-[18px] font-bold transition-all select-none"
            style={{
              background: canContinue ? "#8FBF6F" : "#D8CFC0",
              color: canContinue ? "#FBF6EC" : "#A89880",
              boxShadow: canContinue
                ? "0 5px 0 0 #6FA050"
                : "none",
              transform: "translateY(0)",
              cursor: canContinue ? "pointer" : "not-allowed",
              transition: "box-shadow 100ms, transform 100ms, background 200ms",
            }}
            onMouseDown={(e) => {
              if (canContinue) {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(4px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 0 0 #6FA050";
              }
            }}
            onMouseUp={(e) => {
              if (canContinue) {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 5px 0 0 #6FA050";
              }
            }}
            onMouseLeave={(e) => {
              if (canContinue) {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 5px 0 0 #6FA050";
              }
            }}
          >
            {t.onboarding.start}
          </button>
        </div>
      </div>
    </MobileShell>
  );
}