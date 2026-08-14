import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Dumbbell, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { MobileShell, AmaniMascot, LetterTraceCell } from "@/components/amani";
import { useSignSpeech } from "@/hooks/useSignSpeech";
import {
  PALIER3_GROUPS,
  PALIER3_GROUP_MAP,
  wordText,
  lettersForWord,
  type WordEntry,
} from "@/data/word-catalog";
import { useLanguage, format } from "@/i18n/LanguageContext";
import { useWritingStyle } from "@/hooks/useWritingStyle";
import type { WritingStyle } from "@/data/letter-style-resolver";
import { markCoursItemViewed } from "@/lib/progress";

export const Route = createFileRoute("/cours/mots/$groupId")({
  head: ({ params }) => ({
    meta: [
      { title: `Cours de mots — Amani` },
      {
        name: "description",
        content: `Découvre comment écrire et prononcer les mots du groupe ${params.groupId}.`,
      },
    ],
  }),
  component: WordCourseScreen,
});

function WordCourseScreen() {
  const { groupId } = Route.useParams();
  const navigate = useNavigate();
  const { speak } = useSignSpeech();
  const { t, lang } = useLanguage();
  const writingStyle = useWritingStyle();

  const group = PALIER3_GROUP_MAP.get(groupId);
  const groupIdx = PALIER3_GROUPS.findIndex((g) => g.id === groupId);
  const prevGroup = groupIdx > 0 ? PALIER3_GROUPS[groupIdx - 1] : null;
  const nextGroup = groupIdx >= 0 && groupIdx < PALIER3_GROUPS.length - 1 ? PALIER3_GROUPS[groupIdx + 1] : null;

  if (!group) {
    return (
      <MobileShell>
        <div className="flex flex-col items-center justify-center flex-1 p-8 gap-4 bg-[#F5EDE0]">
          <p className="text-[#4A3B2A] text-[18px] font-bold text-center">
            &quot;{groupId}&quot; {t.coursMots.notFound}
          </p>
          <Link to="/accueil" className="px-6 py-3 rounded-full bg-[#8FBF6F] text-white font-bold text-[15px]">
            {t.coursMots.backToList}
          </Link>
        </div>
      </MobileShell>
    );
  }

  const groupTitle = group.title[lang];

  return (
    <MobileShell>
      <header className="flex items-center justify-between px-6 pt-6 pb-4 bg-[#F5EDE0] shrink-0 border-b border-[#4A3B2A]/10">
        <div className="flex items-center gap-3">
          <Link
            to="/accueil"
            aria-label={t.common.back}
            className="grid h-11 w-11 place-items-center rounded-full bg-[#FBF6EC] shadow-[0_2px_6px_rgba(74,59,42,0.12)] active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-[#4A3B2A] rtl:rotate-180" strokeWidth={2.5} />
          </Link>
          <div>
            <h1 className="text-[24px] font-bold text-[#4A3B2A] leading-tight">
              {groupTitle}
            </h1>
            <p className="text-[13px] text-[#7A6A55] font-normal">
              {format(t.coursMots.wordCount, { count: group.words.length })}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-[#F5EDE0] pb-10">
        {/* Bandeau d'explication */}
        <div className="bg-[#FBF6EC] rounded-[20px] p-4 border border-[#4A3B2A]/10 shadow-sm flex items-center gap-3.5">
          <AmaniMascot pose="demonstration" size="small" />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-[#4A3B2A] leading-snug">
              {t.coursMots.introTitle}
            </p>
            <p className="text-[12px] text-[#7A6A55] mt-0.5">
              {t.coursMots.introBody}
            </p>
          </div>
        </div>

        {/* Cartes de mots */}
        <div className="flex flex-col gap-3.5">
          {group.words.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              lang={lang}
              speak={speak}
              style={writingStyle}
              groupId={group.id}
              totalWords={group.words.length}
              palier={lang === "fr" ? 4 : 3}
              practiceWordAria={t.coursMots.practiceWordAria}
            />
          ))}
        </div>

        {/* CTA vers les exercices */}
        <div className="pt-2 flex items-end gap-2">
          <AmaniMascot pose="invitation" size="small" />
          <button
            type="button"
            onClick={() => navigate({ to: "/exercice/mots/$groupId", params: { groupId: group.id } })}
            className="flex-1 py-4 rounded-2xl bg-[#4A90E2] hover:bg-[#3A7BC8] text-white font-extrabold text-lg shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.99]"
          >
            <span>{format(t.coursMots.practiceGroup, { titre: groupTitle })}</span>
            <Play className="h-5 w-5 fill-current" />
          </button>
        </div>

        {/* Navigation entre groupes */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {prevGroup ? (
            <button
              type="button"
              onClick={() => navigate({ to: "/cours/mots/$groupId", params: { groupId: prevGroup.id } })}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#FBF6EC] border border-[#4A3B2A]/10 text-[#4A3B2A] font-bold text-[14px] shadow-sm active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              {prevGroup.title[lang]}
            </button>
          ) : <div />}
          {nextGroup ? (
            <button
              type="button"
              onClick={() => navigate({ to: "/cours/mots/$groupId", params: { groupId: nextGroup.id } })}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#4A90E2] text-white font-bold text-[14px] shadow-md active:scale-95 transition-transform"
            >
              {nextGroup.title[lang]}
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          ) : <div />}
        </div>
      </div>
    </MobileShell>
  );
}

function WordCard({
  word,
  lang,
  speak,
  style,
  groupId,
  totalWords,
  palier,
  practiceWordAria,
}: {
  word: WordEntry;
  lang: ReturnType<typeof useLanguage>["lang"];
  speak: (text: string) => void;
  style: WritingStyle;
  groupId: string;
  totalWords: number;
  palier: number;
  practiceWordAria: string;
}) {
  const navigate = useNavigate();
  const letters = lettersForWord(word, lang, style);
  const text = wordText(word, lang);

  // Le mot n'est considéré "consulté" que lorsque l'enfant en écoute la
  // prononciation — pas dès l'affichage de la carte, qui se produit pour
  // tous les mots dès l'ouverture de la page (voir markCoursItemViewed).
  const handleSpeak = () => {
    speak(text);
    markCoursItemViewed({ typeEtape: "MOT", groupCode: groupId, itemCode: word.id, totalItems: totalWords, palier });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleSpeak}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSpeak();
        }
      }}
      aria-label={text}
      className="bg-white rounded-[20px] p-4 border border-[#4A3B2A]/10 shadow-[0_2px_8px_rgba(74,59,42,0.08)] flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-transform"
    >
      <div className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1">
        {letters.map((letter, i) => (
          <LetterTraceCell key={`${word.id}-${i}`} letter={letter} size={48} isActive={false} given />
        ))}
        {letters.length === 0 && (
          <span className="text-[20px] font-extrabold text-[#4A3B2A]">{text}</span>
        )}
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          navigate({ to: "/exercice/mots/$groupId", params: { groupId }, search: { word: word.id } });
        }}
        aria-label={format(practiceWordAria, { mot: text })}
        className="w-10 h-10 shrink-0 grid place-items-center rounded-full bg-[#4A90E2]/15 text-[#2D6BBF] hover:bg-[#4A90E2] hover:text-white transition-colors"
      >
        <Dumbbell className="w-4.5 h-4.5" />
      </button>
    </div>
  );
}
