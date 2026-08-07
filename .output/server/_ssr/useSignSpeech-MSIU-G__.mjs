import { n as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as useLanguage, n as SPEECH_LOCALE } from "./LanguageContext-IeRxb9no.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useSignSpeech-MSIU-G__.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* useSignSpeech — synthèse vocale via la Web Speech API
*
* Usage :
*   const { speak, stop, isSpeaking } = useSignSpeech();
*   speak("Le Trait. Une ligne droite, comme une brindille.");
*/
/**
* Indices de qualité/genre dans le nom des voix système, toutes plateformes
* confondues (iOS/Safari, Android/Chrome, Windows/Edge, macOS, Chrome desktop).
* La Web Speech API n'expose ni genre ni "chaleur" — on ne peut que choisir
* parmi les voix déjà installées sur l'appareil et deviner via leur nom.
*/
var FEMALE_NAME_HINTS = [
	"amélie",
	"amelie",
	"audrey",
	"aurélie",
	"aurelie",
	"céline",
	"celine",
	"chantal",
	"charlotte",
	"danielle",
	"denise",
	"eloise",
	"éloise",
	"hortense",
	"julie",
	"léa",
	"lea",
	"marie",
	"virginie",
	"vivienne",
	"severine",
	"séverine",
	"samantha",
	"karen",
	"victoria",
	"zira",
	"susan",
	"aria",
	"jenny",
	"michelle",
	"joanna",
	"salli",
	"kimberly",
	"ivy",
	"kendra",
	"moira",
	"tessa",
	"female",
	"femme",
	"mónica",
	"monica",
	"paulina",
	"helena",
	"elvira",
	"lucía",
	"lucia"
];
var MALE_NAME_HINTS = [
	"thomas",
	"nicolas",
	"paul",
	"henri",
	"remy",
	"rémy",
	"guillaume",
	"bruno",
	"male",
	"homme",
	"daniel",
	"alex",
	"fred",
	"david",
	"mark",
	"guy",
	"tony",
	"matthew",
	"joey",
	"justin",
	"jorge",
	"diego",
	"juan",
	"pablo",
	"álvaro",
	"alvaro"
];
/** Indices de voix "réseau"/neuronales — nettement plus naturelles que les voix locales compactes. */
var QUALITY_NAME_HINTS = [
	"enhanced",
	"premium",
	"neural",
	"wavenet",
	"siri",
	"natural"
];
var LOW_QUALITY_NAME_HINTS = ["compact", "espeak"];
/** Découpe un nom de voix en mots (Unicode) pour éviter les faux positifs de
* sous-chaîne — ex: "male" ne doit pas matcher à l'intérieur de "female". */
function tokenize(name) {
	return name.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean);
}
function nameHasAny(name, hints) {
	const tokens = tokenize(name);
	return hints.some((h) => h.includes(" ") ? name.includes(h) : tokens.includes(h));
}
/** Cherche la meilleure voix disponible pour une locale et un genre donnés (ex: "fr-FR", "homme") */
function pickVoice(locale, gender, volume) {
	const voices = window.speechSynthesis.getVoices();
	const base = locale.split("-")[0];
	const candidates = voices.filter((v) => v.lang.startsWith(base));
	if (candidates.length === 0) return null;
	const genderHints = gender === "femme" ? FEMALE_NAME_HINTS : MALE_NAME_HINTS;
	const oppositeHints = gender === "femme" ? MALE_NAME_HINTS : FEMALE_NAME_HINTS;
	let best = null;
	let bestScore = -Infinity;
	for (const v of candidates) {
		const name = v.name.toLowerCase();
		let score = 0;
		if (nameHasAny(name, genderHints)) score += 4;
		else if (nameHasAny(name, oppositeHints)) score -= 3;
		if (nameHasAny(name, QUALITY_NAME_HINTS)) score += 3;
		if (nameHasAny(name, LOW_QUALITY_NAME_HINTS)) score -= 2;
		if (v.localService === false) score += volume >= .95 ? 1 : -2;
		if (v.lang === locale) score += 1;
		if (score > bestScore) {
			bestScore = score;
			best = v;
		}
	}
	return best;
}
var VOLUME_STORAGE_KEY = "amani_setting_volume";
var SOUND_STORAGE_KEY = "amani_setting_sound";
var VOICE_GENDER_STORAGE_KEY = "amani_setting_voice_gender";
function getStoredVoiceGender() {
	const raw = localStorage.getItem(VOICE_GENDER_STORAGE_KEY);
	return raw === "homme" || raw === "femme" ? raw : "femme";
}
function getStoredVolume() {
	const raw = localStorage.getItem(VOLUME_STORAGE_KEY);
	if (raw == null) return .85;
	const v = Number(raw);
	return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : .85;
}
function isSoundEnabled() {
	const raw = localStorage.getItem(SOUND_STORAGE_KEY);
	return raw === null ? true : raw === "true";
}
function useSignSpeech() {
	const [isSpeaking, setIsSpeaking] = (0, import_react.useState)(false);
	const utteranceRef = (0, import_react.useRef)(null);
	const { lang } = useLanguage();
	const locale = SPEECH_LOCALE[lang];
	(0, import_react.useEffect)(() => {
		const handler = () => {};
		window.speechSynthesis.addEventListener("voiceschanged", handler);
		return () => {
			window.speechSynthesis.removeEventListener("voiceschanged", handler);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			window.speechSynthesis.cancel();
		};
	}, []);
	const stop = (0, import_react.useCallback)(() => {
		window.speechSynthesis.cancel();
		setIsSpeaking(false);
	}, []);
	return {
		speak: (0, import_react.useCallback)((text, rate, pitch) => {
			window.speechSynthesis.cancel();
			if (!isSoundEnabled()) return;
			const volume = getStoredVolume();
			if (volume <= .02) return;
			const gender = getStoredVoiceGender();
			const utter = new SpeechSynthesisUtterance(text);
			utter.lang = locale;
			utter.rate = rate ?? .9;
			utter.pitch = pitch ?? (gender === "femme" ? 1.03 : .96);
			utter.volume = volume;
			const voice = pickVoice(locale, gender, volume);
			if (voice) utter.voice = voice;
			utter.onstart = () => setIsSpeaking(true);
			utter.onend = () => setIsSpeaking(false);
			utter.onerror = () => setIsSpeaking(false);
			utteranceRef.current = utter;
			window.speechSynthesis.speak(utter);
		}, [locale]),
		stop,
		isSpeaking
	};
}
//#endregion
export { useSignSpeech as a, getStoredVoiceGender as i, VOICE_GENDER_STORAGE_KEY as n, VOLUME_STORAGE_KEY as r, SOUND_STORAGE_KEY as t };
