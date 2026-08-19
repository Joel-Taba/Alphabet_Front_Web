import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { AmaniMascot } from "@/components/amani";
import profilImg from "@/assets/amani-profil.png";
import { Sprout, Trees, Sparkles, BookOpen, Calendar, Award, Trophy, Settings as SettingsIcon, Volume2, VolumeX, Type, Globe, Play, PenLine, Lock, LockKeyholeOpen, Eye, EyeOff, ShieldCheck, Camera, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage, format, type Lang } from "@/i18n/LanguageContext";
import {
  useSignSpeech,
  VOLUME_STORAGE_KEY,
  SOUND_STORAGE_KEY,
  VOICE_GENDER_STORAGE_KEY,
  getStoredVoiceGender,
  type VoiceGender,
} from "@/hooks/useSignSpeech";
import { useExerciseSettings } from "@/hooks/useExerciseSettings";
import { useWritingStyleState } from "@/hooks/useWritingStyle";
import { useAnimationSpeedState } from "@/hooks/useAnimationSpeed";
import {
  isProfileProtected,
  isProfileUnlockedThisSession,
  markProfileUnlocked,
  lockProfile,
  getStoredPassword,
  setStoredPassword,
  getStoredPhoto,
  setStoredPhoto,
  removeStoredPhoto,
} from "@/lib/profileAuth";
import { resizeImageToDataUrl } from "@/lib/resizeImageToDataUrl";
import { useProgressStats } from "@/lib/progress";

const MIN_PASSWORD_LENGTH = 4;

export const Route = createFileRoute("/_app/mon-profil")({
  head: () => ({
    meta: [
      { title: "Mon carnet & Réglages — Flores" },
      { name: "description", content: "Le carnet de l'explorateur : progression, badges, signes appris et réglages de l'application." },
    ],
  }),
  component: MyProfile,
});

const branchMeta = [
  { id: "palier1", icon: Sprout, done: 4, total: 4, color: "#8FBF6F", bg: "#8FBF6F20" },
  { id: "palier2", icon: Trees, done: 3, total: 4, color: "#A9784F", bg: "#A9784F20" },
  { id: "palier3", icon: Sparkles, done: 1, total: 6, color: "#4A90E2", bg: "#4A90E220" },
];

function MyProfile() {
  // État "checking" par défaut (identique côté serveur et au premier rendu
  // client) : localStorage/sessionStorage ne sont pas disponibles pendant le
  // SSR, donc on ne décide "locked" vs "unlocked" qu'après montage côté
  // client, pour éviter tout mismatch d'hydratation qui laisserait passer le
  // contenu protégé.
  const [status, setStatus] = useState<"checking" | "locked" | "unlocked">("checking");

  useEffect(() => {
    setStatus(!isProfileProtected() || isProfileUnlockedThisSession() ? "unlocked" : "locked");
  }, []);

  if (status === "checking") return null;

  if (status === "locked") {
    return <ProfileLockScreen onUnlock={() => setStatus("unlocked")} />;
  }

  return <MyProfileContent onLock={() => setStatus("locked")} />;
}

function ProfileLockScreen({ onUnlock }: { onUnlock: () => void }) {
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === getStoredPassword()) {
      markProfileUnlocked();
      setError(false);
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12">
      <AmaniMascot pose="reflexion" size="medium" />
      <div className="text-center">
        <h1 className="text-[22px] font-bold text-[#4A3B2A]">{t.profileLock.title}</h1>
        <p className="text-[13px] text-[#7A6A55] mt-1.5 max-w-xs">{t.profileLock.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
        <div
          className="flex items-center gap-3 rounded-full border-2 px-4 h-[54px] transition-all"
          style={{
            borderColor: error ? "#E05252" : password ? "#8FBF6F" : "#D8CFC0",
            background: "#FFFFFF",
          }}
        >
          <Lock className="w-4.5 h-4.5 shrink-0 text-[#A9784F]" strokeWidth={2.2} />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder={t.profileLock.passwordPlaceholder}
            autoFocus
            className="flex-1 bg-transparent text-[16px] font-medium outline-none placeholder:text-[#B8A88A]"
            style={{ color: "#4A3B2A" }}
            autoComplete="current-password"
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
        {error && (
          <p className="text-[13px] text-[#E05252] font-semibold px-2">{t.profileLock.wrongPassword}</p>
        )}
        <button
          type="submit"
          disabled={password.length === 0}
          className="h-[54px] rounded-full text-[16px] font-bold transition-all active:scale-95"
          style={{
            background: password ? "#8FBF6F" : "#D8CFC0",
            color: password ? "#FBF6EC" : "#A89880",
          }}
        >
          {t.profileLock.unlockButton}
        </button>
      </form>
    </div>
  );
}

function MyProfileContent({ onLock }: { onLock: () => void }) {
  const { t, lang, setLang } = useLanguage();
  const { speak } = useSignSpeech();
  const { repetitions, setRepetitions, tolerance, setTolerance, evaluationDuration, setEvaluationDuration } =
    useExerciseSettings();
  const progressStats = useProgressStats();

  const [format_, setFormat] = useWritingStyleState();
  const [speed, setSpeed] = useAnimationSpeedState();

  const [sound, setSound] = useState<boolean>(() => {
    if (typeof localStorage !== "undefined") {
      const val = localStorage.getItem(SOUND_STORAGE_KEY);
      return val ? val === "true" : true;
    }
    return true;
  });

  const [volume, setVolume] = useState<number>(() => {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem(VOLUME_STORAGE_KEY);
      const v = raw != null ? Number(raw) : 0.85;
      return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.85;
    }
    return 0.85;
  });

  const [voiceGender, setVoiceGender] = useState<VoiceGender>(() =>
    typeof localStorage !== "undefined" ? getStoredVoiceGender() : "femme"
  );

  const [photo, setPhoto] = useState<string | null>(() =>
    typeof localStorage !== "undefined" ? getStoredPhoto() : null
  );
  const photoInputRef = useRef<HTMLInputElement>(null);

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

  const handleRemovePhoto = () => {
    removeStoredPhoto();
    setPhoto(null);
  };

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<"error-mismatch" | "error-short" | "success" | null>(null);

  const handleSavePassword = () => {
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordFeedback("error-short");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback("error-mismatch");
      return;
    }
    setStoredPassword(newPassword);
    markProfileUnlocked();
    setNewPassword("");
    setConfirmPassword("");
    setPasswordFeedback("success");
  };

  // Persistance localStorage (le format d'écriture est déjà persisté par
  // useWritingStyleState, qui écrit sous la même clé "amani_setting_format")
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(SOUND_STORAGE_KEY, String(sound));
      localStorage.setItem(VOLUME_STORAGE_KEY, String(volume));
      localStorage.setItem(VOICE_GENDER_STORAGE_KEY, voiceGender);
    }
  }, [sound, volume, voiceGender]);

  const branches = branchMeta.map((b, i) => ({ ...b, name: t.profileHub.branches[i].name }));

  return (
    <div className="flex flex-col gap-7 px-5 pt-6 pb-12 overflow-y-auto">
      {/* En-tête : titre de page, même gabarit que "Notre Communauté" */}
      <header>
        <h1 className="text-[24px] leading-8 font-bold" style={{ color: "#4A3B2A" }}>
          {t.profileHub.title}
        </h1>
      </header>

      {/* Image plein cadre */}
      <div
        className="relative w-full h-48 rounded-3xl overflow-hidden border border-[#4A3B2A]/10"
        style={{ boxShadow: "0 2px 8px rgba(74,59,42,0.14)" }}
      >
        <img
          src={profilImg}
          alt=""
          aria-hidden
          className="w-full h-full object-cover"
          draggable={false}
        />
        {isProfileProtected() && (
          <button
            type="button"
            onClick={() => { lockProfile(); onLock(); }}
            aria-label={t.profileHub.lockAction}
            className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/70 text-[#7A6A55] shadow-sm active:scale-95 transition-transform"
          >
            <LockKeyholeOpen className="w-4 h-4" strokeWidth={2.2} />
          </button>
        )}
      </div>

      {/* Photo de profil — utilisée dans le classement de la Clairière */}
      <div className="flex items-center gap-4 rounded-3xl bg-[#FBF6EC] p-4 border border-[#4A3B2A]/10 shadow-sm">
        <div className="relative shrink-0">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-[#EAE2D2] grid place-items-center border-2 border-white shadow-sm">
            {photo ? (
              <img src={photo} alt="" className="w-full h-full object-cover" draggable={false} />
            ) : (
              <UserRound className="w-7 h-7 text-[#A9784F]" strokeWidth={2} />
            )}
          </div>
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            aria-label={t.profileHub.photoChangeAria}
            className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-[#A9784F] text-white border-2 border-white shadow-sm active:scale-95 transition-transform"
          >
            <Camera className="w-3 h-3" strokeWidth={2.4} />
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-[#4A3B2A]">{t.profileHub.photoTitle}</p>
          <p className="text-[12px] text-[#7A6A55] mt-0.5">{t.profileHub.photoHint}</p>
        </div>
        {photo && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="shrink-0 text-[12px] font-semibold text-[#E05252]"
          >
            {t.profileHub.photoRemove}
          </button>
        )}
      </div>

      {/* Points totaux — la mise en avant du système de notation */}
      <div
        className="flex items-center gap-4 rounded-3xl p-5 text-white shadow-[0_6px_18px_rgba(217,168,74,0.35)]"
        style={{ background: "linear-gradient(135deg, #F6C453 0%, #D9A84A 100%)" }}
      >
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/25">
          <Trophy className="h-7 w-7" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <p className="text-[28px] leading-none font-extrabold">{progressStats.totalPoints}</p>
          <p className="text-[14px] font-bold mt-1.5">{t.profileHub.totalPointsLabel}</p>
          <p className="text-[12px] opacity-90 mt-0.5">{t.profileHub.totalPointsHint}</p>
        </div>
      </div>

      {/* Statistiques encourageantes */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label={t.profileHub.statsSignes} value={String(progressStats.signesMaitrises)} icon={BookOpen} color="#8FBF6F" />
        <Stat label={t.profileHub.statsExercices} value={String(progressStats.exercicesReussis)} icon={Award} color="#A9784F" />
        <Stat label={t.profileHub.statsDays} value={String(progressStats.joursAventure)} icon={Calendar} color="#4A90E2" />
      </div>

      {/* Progression par branches/paliers */}
      <section className="flex flex-col gap-3.5">
        <h2 className="text-[18px] leading-tight font-bold text-[#4A3B2A] px-1">
          {t.profileHub.progressionTitle}
        </h2>
        {branches.map((b) => {
          const Icon = b.icon;
          const pct = Math.round((b.done / b.total) * 100);
          return (
            <div
              key={b.id}
              className="rounded-[24px] bg-[#FBF6EC] p-4.5 border border-[#4A3B2A]/10 shadow-[0_2px_8px_rgba(74,59,42,0.06)] flex flex-col gap-3"
            >
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3.5">
                <div
                  className="grid h-12 w-12 place-items-center rounded-2xl shrink-0"
                  style={{ backgroundColor: b.bg, color: b.color }}
                >
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold text-[#4A3B2A]">{b.name}</p>
                  <p className="text-[13px] text-[#7A6A55] font-medium mt-0.5">
                    {b.done} {format(t.profileHub.stepsValidated, { total: b.total })}
                  </p>
                </div>
                <span
                  className="text-[15px] font-bold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: b.bg, color: b.color }}
                >
                  {pct}%
                </span>
              </div>

              {/* Barre de progression */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#4A3B2A]/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: b.color }}
                />
              </div>
            </div>
          );
        })}
      </section>

      {/* ─── SECTION RÉGLAGES ─── */}
      <section className="flex flex-col gap-4 pt-3 border-t border-[#4A3B2A]/15">
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-full bg-[#A9784F]/20 flex items-center justify-center text-[#A9784F]">
            <SettingsIcon className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <h2 className="text-[20px] leading-tight font-bold text-[#4A3B2A]">
            {t.profileHub.settingsTitle}
          </h2>
        </div>

        {/* Langue */}
        <SettingsCard title={t.profileHub.languageCardTitle} icon={Globe} color="#4A90E2">
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
        </SettingsCard>

        {/* Format d'écriture */}
        <SettingsCard title={t.profileHub.formatCardTitle} icon={Type} color="#8FBF6F">
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
                  <span className="text-[10px] font-medium opacity-80 leading-tight mt-0.5">
                    ({opt.desc})
                  </span>
                </button>
              );
            })}
          </div>
        </SettingsCard>

        {/* Exercices d'écriture */}
        <SettingsCard title={t.profileHub.exercisesCardTitle} icon={PenLine} color="#E05252">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[#4A3B2A]">{t.exerciceListe.repetitionsLabel}</p>
                <p className="text-[12px] text-[#7A6A55] mt-0.5">{t.exerciceListe.repetitionsHint}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setRepetitions((r) => r - 1)}
                  className="w-8 h-8 rounded-full bg-white border border-[#4A3B2A]/15 text-[#4A3B2A] font-bold text-[16px] grid place-items-center active:scale-90 transition-transform shadow-xs"
                >
                  −
                </button>
                <span className="text-[16px] font-bold text-[#4A3B2A] w-5 text-center">{repetitions}</span>
                <button
                  type="button"
                  onClick={() => setRepetitions((r) => r + 1)}
                  className="w-8 h-8 rounded-full bg-white border border-[#4A3B2A]/15 text-[#4A3B2A] font-bold text-[16px] grid place-items-center active:scale-90 transition-transform shadow-xs"
                >
                  +
                </button>
              </div>
            </div>
            <div className="pt-3 border-t border-[#4A3B2A]/10 flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[#4A3B2A]">{t.exerciceListe.toleranceLabel}</p>
                <p className="text-[12px] text-[#7A6A55] mt-0.5">{t.exerciceListe.toleranceHint}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setTolerance((v) => v - 3)}
                  className="w-8 h-8 rounded-full bg-white border border-[#4A3B2A]/15 text-[#4A3B2A] font-bold text-[16px] grid place-items-center active:scale-90 transition-transform shadow-xs"
                >
                  −
                </button>
                <span className="text-[14px] font-bold text-[#4A3B2A] w-10 text-center">{tolerance}%</span>
                <button
                  type="button"
                  onClick={() => setTolerance((v) => v + 3)}
                  className="w-8 h-8 rounded-full bg-white border border-[#4A3B2A]/15 text-[#4A3B2A] font-bold text-[16px] grid place-items-center active:scale-90 transition-transform shadow-xs"
                >
                  +
                </button>
              </div>
            </div>
            <div className="pt-3 border-t border-[#4A3B2A]/10 flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[#4A3B2A]">{t.profileHub.evaluationDurationLabel}</p>
                <p className="text-[12px] text-[#7A6A55] mt-0.5">{t.profileHub.evaluationDurationHint}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setEvaluationDuration((v) => v - 1)}
                  className="w-8 h-8 rounded-full bg-white border border-[#4A3B2A]/15 text-[#4A3B2A] font-bold text-[16px] grid place-items-center active:scale-90 transition-transform shadow-xs"
                >
                  −
                </button>
                <span className="text-[14px] font-bold text-[#4A3B2A] w-14 text-center">
                  {evaluationDuration} min
                </span>
                <button
                  type="button"
                  onClick={() => setEvaluationDuration((v) => v + 1)}
                  className="w-8 h-8 rounded-full bg-white border border-[#4A3B2A]/15 text-[#4A3B2A] font-bold text-[16px] grid place-items-center active:scale-90 transition-transform shadow-xs"
                >
                  +
                </button>
              </div>
            </div>
            <div className="pt-3 border-t border-[#4A3B2A]/10">
              <p className="text-[14px] font-semibold text-[#4A3B2A]">{t.profileHub.speedLabel}</p>
              <p className="text-[12px] text-[#7A6A55] mt-0.5">{t.profileHub.speedHint}</p>
              <div className="grid grid-cols-3 gap-2.5 mt-3">
                {(["lent", "normal", "rapide"] as const).map((id, i) => {
                  const opt = t.profileHub.speedOptions[i];
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSpeed(id)}
                      aria-pressed={speed === id}
                      className={cn(
                        "h-11 rounded-2xl border-2 text-[14px] font-bold transition-all active:scale-95",
                        speed === id
                          ? "border-[#E05252] bg-[#E05252]/15 text-[#B23A3A] shadow-sm"
                          : "border-[#4A3B2A]/15 bg-white text-[#7A6A55]"
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </SettingsCard>

        {/* Audio et Animations */}
        <SettingsCard title={t.profileHub.soundCardTitle} icon={Volume2} color="#A9784F">
          <div className="flex flex-col gap-4">
            <Toggle
              label={t.profileHub.voiceLabel}
              value={sound}
              onChange={setSound}
              color="#A9784F"
            />
            <div className="pt-3 border-t border-[#4A3B2A]/10 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[14px] font-semibold text-[#4A3B2A]">
                  {t.profileHub.volumeLabel}
                </span>
                <span className="text-[13px] font-bold text-[#A9784F] tabular-nums">
                  {Math.round(volume * 100)}%
                </span>
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
            <div className="pt-3 border-t border-[#4A3B2A]/10 flex flex-col gap-2.5">
              <p className="text-[14px] font-semibold text-[#4A3B2A]">
                {t.profileHub.voiceGenderLabel}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {(["homme", "femme"] as const satisfies readonly VoiceGender[]).map((id, i) => {
                  const opt = t.profileHub.voiceGenderOptions[i];
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setVoiceGender(id)}
                      aria-pressed={voiceGender === id}
                      className={cn(
                        "h-14 rounded-2xl border-2 font-bold transition-all active:scale-95 flex flex-col items-center justify-center p-1",
                        voiceGender === id
                          ? "border-[#A9784F] bg-[#A9784F]/20 text-[#7A5332] shadow-sm"
                          : "border-[#4A3B2A]/15 bg-white text-[#7A6A55]"
                      )}
                    >
                      <span className="text-[14px] leading-tight font-extrabold">{opt.label}</span>
                      <span className="text-[10px] font-medium opacity-80 leading-tight mt-0.5">
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => speak(t.profileHub.voiceGenderTestPhrase)}
                className="mt-1 flex items-center justify-center gap-2 h-11 rounded-2xl border-2 border-[#A9784F]/30 bg-[#A9784F]/10 text-[14px] font-bold text-[#7A5332] transition-all active:scale-95"
              >
                <Play className="h-4 w-4" strokeWidth={2.5} fill="currentColor" />
                {t.profileHub.voiceGenderTest}
              </button>
            </div>
          </div>
        </SettingsCard>

        {/* Mot de passe de Mon Profil */}
        <SettingsCard title={t.profileHub.passwordCardTitle} icon={ShieldCheck} color="#4A3B2A">
          <div className="flex flex-col gap-3">
            <div
              className="flex items-center gap-3 rounded-full border-2 px-4 h-[50px] transition-all"
              style={{ borderColor: newPassword ? "#8FBF6F" : "#D8CFC0", background: "#FFFFFF" }}
            >
              <Lock className="w-4 h-4 shrink-0 text-[#A9784F]" strokeWidth={2.2} />
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setPasswordFeedback(null); }}
                placeholder={t.profileHub.newPasswordPlaceholder}
                className="flex-1 bg-transparent text-[14px] font-medium outline-none placeholder:text-[#B8A88A]"
                style={{ color: "#4A3B2A" }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                aria-label={showNewPassword ? t.onboarding.hidePassword : t.onboarding.showPassword}
                className="shrink-0 text-[#7A6A55]"
              >
                {showNewPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
            <div
              className="flex items-center gap-3 rounded-full border-2 px-4 h-[50px] transition-all"
              style={{ borderColor: confirmPassword ? "#8FBF6F" : "#D8CFC0", background: "#FFFFFF" }}
            >
              <Lock className="w-4 h-4 shrink-0 text-[#A9784F]" strokeWidth={2.2} />
              <input
                type={showNewPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordFeedback(null); }}
                placeholder={t.profileHub.confirmPasswordPlaceholder}
                className="flex-1 bg-transparent text-[14px] font-medium outline-none placeholder:text-[#B8A88A]"
                style={{ color: "#4A3B2A" }}
                autoComplete="new-password"
              />
            </div>

            {passwordFeedback === "error-mismatch" && (
              <p className="text-[13px] text-[#E05252] font-semibold px-1">{t.profileHub.passwordMismatch}</p>
            )}
            {passwordFeedback === "error-short" && (
              <p className="text-[13px] text-[#E05252] font-semibold px-1">
                {format(t.profileHub.passwordTooShort, { count: MIN_PASSWORD_LENGTH })}
              </p>
            )}
            {passwordFeedback === "success" && (
              <p className="text-[13px] text-[#5E8E3E] font-semibold px-1">{t.profileHub.passwordSaved}</p>
            )}

            <button
              type="button"
              onClick={handleSavePassword}
              disabled={!newPassword || !confirmPassword}
              className="h-11 rounded-2xl font-bold text-[14px] transition-all active:scale-95"
              style={{
                background: newPassword && confirmPassword ? "#4A3B2A" : "#D8CFC0",
                color: newPassword && confirmPassword ? "#FBF6EC" : "#A89880",
              }}
            >
              {t.profileHub.savePassword}
            </button>
          </div>
        </SettingsCard>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-[#FBF6EC] p-3.5 border border-[#4A3B2A]/10 shadow-sm gap-1">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
        style={{ backgroundColor: color + "20", color: color }}
      >
        <Icon className="w-4 h-4" strokeWidth={2.5} />
      </div>
      <span className="text-[22px] leading-none font-bold text-[#4A3B2A]">{value}</span>
      <span className="text-center text-[11px] font-semibold text-[#7A6A55] leading-tight mt-1">{label}</span>
    </div>
  );
}

function SettingsCard({
  title,
  icon: Icon,
  color,
  children,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] bg-[#FBF6EC] p-5 border border-[#4A3B2A]/10 shadow-[0_2px_8px_rgba(74,59,42,0.06)] flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4.5 h-4.5" style={{ color: color }} strokeWidth={2.5} />
        <h3 className="text-[16px] font-bold text-[#4A3B2A]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
  color = "#8FBF6F",
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer py-1">
      <span className="text-[14px] font-semibold text-[#4A3B2A] leading-snug flex-1">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          "relative h-8 w-14 shrink-0 rounded-full border-2 overflow-hidden transition-colors",
          value ? "border-transparent" : "border-[#D8CFC0] bg-[#EAE2D2]"
        )}
        style={{
          backgroundColor: value ? color : undefined,
        }}
      >
        <span
          className={cn(
            "absolute start-1 top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform",
            value ? "translate-x-6 rtl:-translate-x-6" : "translate-x-0"
          )}
        />
      </button>
    </label>
  );
}
