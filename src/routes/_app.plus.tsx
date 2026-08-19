import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Type, Globe, Volume2, VolumeX, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage, type Lang } from "@/i18n/LanguageContext";
import { useWritingStyleState } from "@/hooks/useWritingStyle";
import { useSignSpeech, VOLUME_STORAGE_KEY } from "@/hooks/useSignSpeech";

export const Route = createFileRoute("/_app/plus")({
  head: () => ({
    meta: [
      { title: "Plus d'options — Flores Gong Nota" },
      { name: "description", content: "Réglages complémentaires : langue, volume, format d'écriture." },
    ],
  }),
  component: PlusScreen,
});

function PlusScreen() {
  const { t, lang, setLang } = useLanguage();
  const { speak } = useSignSpeech();
  const [format_, setFormat] = useWritingStyleState();

  const [volume, setVolume] = useState<number>(() => {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem(VOLUME_STORAGE_KEY);
      const v = raw != null ? Number(raw) : 0.85;
      return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.85;
    }
    return 0.85;
  });

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(VOLUME_STORAGE_KEY, String(volume));
    }
  }, [volume]);

  return (
    <div className="flex flex-col gap-6 px-5 pt-6 pb-12">
      <header>
        <h1 className="text-[24px] leading-8 font-bold" style={{ color: "#4A3B2A" }}>
          {t.plusScreen.title}
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: "#7A6A55" }}>
          {t.plusScreen.subtitle}
        </p>
      </header>

      {/* Langue */}
      <div className="rounded-[24px] bg-[#FBF6EC] p-5 border border-[#4A3B2A]/10 shadow-[0_2px_8px_rgba(74,59,42,0.06)] flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-4.5 h-4.5" style={{ color: "#4A90E2" }} strokeWidth={2.5} />
          <h3 className="text-[16px] font-bold text-[#4A3B2A]">{t.profileHub.languageCardTitle}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-1">
          {(["fr", "en", "es", "ar"] as const satisfies readonly Lang[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setLang(c)}
              aria-pressed={lang === c}
              className={cn(
                "h-12 rounded-2xl border-2 text-[13px] font-bold transition-all active:scale-95 px-1",
                lang === c
                  ? "border-[#4A90E2] bg-[#4A90E2]/15 text-[#2D6BBF] shadow-sm"
                  : "border-[#4A3B2A]/15 bg-white text-[#7A6A55]"
              )}
            >
              {c === "fr" ? "🇫🇷 Français" : c === "en" ? "🇬🇧 English" : c === "es" ? "🇪🇸 Español" : "🇸🇦 العربية"}
            </button>
          ))}
        </div>
      </div>

      {/* Volume */}
      <div className="rounded-[24px] bg-[#FBF6EC] p-5 border border-[#4A3B2A]/10 shadow-[0_2px_8px_rgba(74,59,42,0.06)] flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Volume2 className="w-4.5 h-4.5" style={{ color: "#A9784F" }} strokeWidth={2.5} />
          <h3 className="text-[16px] font-bold text-[#4A3B2A]">{t.profileHub.soundCardTitle}</h3>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[14px] font-semibold text-[#4A3B2A]">{t.profileHub.volumeLabel}</span>
          <span className="text-[13px] font-bold text-[#A9784F] tabular-nums">{Math.round(volume * 100)}%</span>
        </div>
        <div className="flex items-center gap-3">
          {volume === 0 ? (
            <VolumeX className="h-5 w-5 shrink-0 text-[#A9784F]" strokeWidth={2.5} />
          ) : (
            <Volume2 className="h-5 w-5 shrink-0 text-[#A9784F]" strokeWidth={2.5} />
          )}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-2 flex-1 accent-[#A9784F]"
            aria-label={t.profileHub.volumeLabel}
          />
        </div>
        <button
          type="button"
          onClick={() => speak(t.profileHub.volumeTestPhrase)}
          className="mt-1 flex items-center justify-center gap-2 h-11 rounded-2xl border-2 border-[#A9784F]/30 bg-[#A9784F]/10 text-[14px] font-bold text-[#7A5332] transition-all active:scale-95"
        >
          <Play className="h-4 w-4" strokeWidth={2.5} fill="currentColor" />
          {t.profileHub.volumeTest}
        </button>
      </div>

      {/* Format d'écriture */}
      <div className="rounded-[24px] bg-[#FBF6EC] p-5 border border-[#4A3B2A]/10 shadow-[0_2px_8px_rgba(74,59,42,0.06)] flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Type className="w-4.5 h-4.5" style={{ color: "#8FBF6F" }} strokeWidth={2.5} />
          <h3 className="text-[16px] font-bold text-[#4A3B2A]">{t.profileHub.formatCardTitle}</h3>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {(["script", "cursive"] as const).map((id, i) => {
            const opt = t.profileHub.formatOptions[i];
            return (
              <button
                key={id}
                type="button"
                onClick={() => setFormat(id)}
                aria-pressed={format_ === id}
                className={cn(
                  "h-14 rounded-2xl border-2 font-bold transition-all active:scale-95 flex flex-col items-center justify-center p-1",
                  format_ === id
                    ? "border-[#8FBF6F] bg-[#8FBF6F]/20 text-[#4A7A30] shadow-sm"
                    : "border-[#4A3B2A]/15 bg-white text-[#7A6A55]"
                )}
              >
                <span className="text-[14px] leading-tight font-extrabold">{opt.label}</span>
                <span className="text-[10px] font-medium opacity-80 leading-tight mt-0.5">({opt.desc})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
