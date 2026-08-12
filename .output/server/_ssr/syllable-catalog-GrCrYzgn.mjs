import { o as getLetterFormation } from "./letter-style-resolver-C5Cp-ti3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/syllable-catalog-GrCrYzgn.js
function entry(consonant, vowel, exampleWord) {
	return {
		syllable: `${consonant}${vowel}`,
		consonant,
		vowel,
		exampleWord
	};
}
/** Ordre pédagogique : b, c, d, f, g, h, j, k, l, m, n, p, q, r, s, t, v, w, y, z. */
var SYLLABLE_GROUPS = [
	{
		id: "syl-b",
		consonant: "b",
		syllables: [
			entry("b", "a", "banane"),
			entry("b", "e", "bebe"),
			entry("b", "i", "biche"),
			entry("b", "o", "bobo"),
			entry("b", "u", "bulle")
		]
	},
	{
		id: "syl-c",
		consonant: "c",
		syllables: [
			entry("c", "a", "canard"),
			entry("c", "e", "cerise"),
			entry("c", "i", "citron"),
			entry("c", "o", "coco"),
			entry("c", "u", "cube")
		]
	},
	{
		id: "syl-d",
		consonant: "d",
		syllables: [
			entry("d", "a", "dada"),
			entry("d", "e", "dent"),
			entry("d", "i", "dix"),
			entry("d", "o", "dodo"),
			entry("d", "u", "dune")
		]
	},
	{
		id: "syl-f",
		consonant: "f",
		syllables: [
			entry("f", "a", "face"),
			entry("f", "e", "fee"),
			entry("f", "i", "fil"),
			entry("f", "o", "fort"),
			entry("f", "u", "fume")
		]
	},
	{
		id: "syl-g",
		consonant: "g",
		syllables: [
			entry("g", "a", "gare"),
			entry("g", "e", "genou"),
			entry("g", "i", "girafe"),
			entry("g", "o", "gomme"),
			entry("g", "u", "legume")
		]
	},
	{
		id: "syl-h",
		consonant: "h",
		syllables: [
			entry("h", "a", "habit"),
			entry("h", "e", "herbe"),
			entry("h", "i", "hibou"),
			entry("h", "o", "homme"),
			entry("h", "u", "huile")
		]
	},
	{
		id: "syl-j",
		consonant: "j",
		syllables: [
			entry("j", "a", "jambe"),
			entry("j", "e", "jeu"),
			entry("j", "o", "joue"),
			entry("j", "u", "jupe")
		]
	},
	{
		id: "syl-k",
		consonant: "k",
		syllables: [
			entry("k", "a", "kayak"),
			entry("k", "i", "kiwi"),
			entry("k", "o", "koala")
		]
	},
	{
		id: "syl-l",
		consonant: "l",
		syllables: [
			entry("l", "a", "lama"),
			entry("l", "e", "lettre"),
			entry("l", "i", "lion"),
			entry("l", "o", "loup"),
			entry("l", "u", "lune")
		]
	},
	{
		id: "syl-m",
		consonant: "m",
		syllables: [
			entry("m", "a", "maman"),
			entry("m", "e", "melon"),
			entry("m", "i", "midi"),
			entry("m", "o", "moto"),
			entry("m", "u", "mur")
		]
	},
	{
		id: "syl-n",
		consonant: "n",
		syllables: [
			entry("n", "a", "natte"),
			entry("n", "e", "neige"),
			entry("n", "i", "nid"),
			entry("n", "o", "note"),
			entry("n", "u", "nuit")
		]
	},
	{
		id: "syl-p",
		consonant: "p",
		syllables: [
			entry("p", "a", "papa"),
			entry("p", "e", "petit"),
			entry("p", "i", "pile"),
			entry("p", "o", "pomme"),
			entry("p", "u", "pull")
		]
	},
	{
		id: "syl-q",
		consonant: "q",
		syllables: [entry("q", "u", "quatre")]
	},
	{
		id: "syl-r",
		consonant: "r",
		syllables: [
			entry("r", "a", "radis"),
			entry("r", "e", "renard"),
			entry("r", "i", "riz"),
			entry("r", "o", "robe"),
			entry("r", "u", "rue")
		]
	},
	{
		id: "syl-s",
		consonant: "s",
		syllables: [
			entry("s", "a", "salade"),
			entry("s", "e", "sel"),
			entry("s", "i", "singe"),
			entry("s", "o", "soleil"),
			entry("s", "u", "sucre")
		]
	},
	{
		id: "syl-t",
		consonant: "t",
		syllables: [
			entry("t", "a", "tasse"),
			entry("t", "e", "tete"),
			entry("t", "i", "tigre"),
			entry("t", "o", "toto"),
			entry("t", "u", "tulipe")
		]
	},
	{
		id: "syl-v",
		consonant: "v",
		syllables: [
			entry("v", "a", "vache"),
			entry("v", "e", "verre"),
			entry("v", "i", "vite"),
			entry("v", "o", "voile"),
			entry("v", "u", "vue")
		]
	},
	{
		id: "syl-w",
		consonant: "w",
		syllables: [entry("w", "a", "wagon")]
	},
	{
		id: "syl-y",
		consonant: "y",
		syllables: [
			entry("y", "a", "yaourt"),
			entry("y", "e", "yeux"),
			entry("y", "o", "yoyo")
		]
	},
	{
		id: "syl-z",
		consonant: "z",
		syllables: [
			entry("z", "a", "pizza"),
			entry("z", "e", "zero"),
			entry("z", "o", "zoo")
		]
	}
];
var SYLLABLE_GROUP_MAP = new Map(SYLLABLE_GROUPS.map((g) => [g.id, g]));
function findSyllableGroupForConsonant(consonant) {
	return SYLLABLE_GROUP_MAP.get(`syl-${consonant}`);
}
/** Formations (avec pathD) des deux lettres d'une syllabe, dans l'ordre. */
function lettersForSyllable(syllable, style = "script") {
	return syllable.split("").map((c) => getLetterFormation(c, style)).filter((l) => !!l);
}
/** Formations des lettres du mot-exemple, dans l'ordre (mêmes lettres a→z que le reste de l'app). */
function lettersForExampleWord(entry, style = "script") {
	return entry.exampleWord.split("").map((c) => getLetterFormation(c, style)).filter((l) => !!l);
}
//#endregion
export { lettersForSyllable as i, findSyllableGroupForConsonant as n, lettersForExampleWord as r, SYLLABLE_GROUPS as t };
