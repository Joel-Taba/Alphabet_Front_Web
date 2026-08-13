import { o as getLetterFormation } from "./letter-style-resolver-DOxN1AFB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/palier2-groups-Fh5LUE31.js
function group(id, kind, chars, title) {
	return {
		id,
		kind,
		chars,
		title
	};
}
var BASE_GROUPS = [
	group("l1", "lettres", [
		"a",
		"b",
		"c",
		"d",
		"e"
	], {
		fr: "Lettres a → e",
		en: "Letters a → e",
		es: "Letras a → e",
		ar: "حروف a → e"
	}),
	group("d1", "chiffres", [
		"0",
		"1",
		"2",
		"3",
		"4"
	], {
		fr: "Chiffres 0 → 4",
		en: "Digits 0 → 4",
		es: "Números 0 → 4",
		ar: "أرقام 0 → 4"
	}),
	group("l2", "lettres", [
		"f",
		"g",
		"h",
		"i",
		"j"
	], {
		fr: "Lettres f → j",
		en: "Letters f → j",
		es: "Letras f → j",
		ar: "حروف f → j"
	}),
	group("d2", "chiffres", [
		"5",
		"6",
		"7",
		"8",
		"9"
	], {
		fr: "Chiffres 5 → 9",
		en: "Digits 5 → 9",
		es: "Números 5 → 9",
		ar: "أرقام 5 → 9"
	}),
	group("l3", "lettres", [
		"k",
		"l",
		"m",
		"n",
		"o"
	], {
		fr: "Lettres k → o",
		en: "Letters k → o",
		es: "Letras k → o",
		ar: "حروف k → o"
	}),
	group("l4", "lettres", [
		"p",
		"q",
		"r",
		"s",
		"t"
	], {
		fr: "Lettres p → t",
		en: "Letters p → t",
		es: "Letras p → t",
		ar: "حروف p → t"
	}),
	group("l5", "lettres", [
		"u",
		"v",
		"w",
		"x",
		"y"
	], {
		fr: "Lettres u → y",
		en: "Letters u → y",
		es: "Letras u → y",
		ar: "حروف u → y"
	}),
	group("l6", "lettres", ["z"], {
		fr: "Lettre z",
		en: "Letter z",
		es: "Letra z",
		ar: "حرف z"
	}),
	group("u1", "lettres", [
		"A",
		"B",
		"C",
		"D",
		"E"
	], {
		fr: "Majuscules A → E",
		en: "Uppercase A → E",
		es: "Mayúsculas A → E",
		ar: "حروف كبيرة A → E"
	}),
	group("u2", "lettres", [
		"F",
		"G",
		"H",
		"I",
		"J"
	], {
		fr: "Majuscules F → J",
		en: "Uppercase F → J",
		es: "Mayúsculas F → J",
		ar: "حروف كبيرة F → J"
	}),
	group("u3", "lettres", [
		"K",
		"L",
		"M",
		"N",
		"O"
	], {
		fr: "Majuscules K → O",
		en: "Uppercase K → O",
		es: "Mayúsculas K → O",
		ar: "حروف كبيرة K → O"
	}),
	group("u4", "lettres", [
		"P",
		"Q",
		"R",
		"S",
		"T"
	], {
		fr: "Majuscules P → T",
		en: "Uppercase P → T",
		es: "Mayúsculas P → T",
		ar: "حروف كبيرة P → T"
	}),
	group("u5", "lettres", [
		"U",
		"V",
		"W",
		"X",
		"Y"
	], {
		fr: "Majuscules U → Y",
		en: "Uppercase U → Y",
		es: "Mayúsculas U → Y",
		ar: "حروف كبيرة U → Y"
	}),
	group("u6", "lettres", ["Z"], {
		fr: "Majuscule Z",
		en: "Uppercase Z",
		es: "Mayúscula Z",
		ar: "حرف كبير Z"
	})
];
/** Variante espagnole : "ñ"/"Ñ" insérés juste après "n"/"N" dans leurs groupes respectifs. */
var ES_GROUPS = BASE_GROUPS.map((g) => {
	if (g.id === "l3") return {
		...g,
		chars: [
			"k",
			"l",
			"m",
			"n",
			"ñ",
			"o"
		],
		title: {
			fr: "Lettres k → o",
			en: "Letters k → o",
			es: "Letras k → o",
			ar: "حروف k → o"
		}
	};
	if (g.id === "u3") return {
		...g,
		chars: [
			"K",
			"L",
			"M",
			"N",
			"Ñ",
			"O"
		],
		title: {
			fr: "Majuscules K → O",
			en: "Uppercase K → O",
			es: "Mayúsculas K → O",
			ar: "حروف كبيرة K → O"
		}
	};
	return g;
});
/** Groupes de progression du Palier 2, selon la langue active ("ñ"/"Ñ" en espagnol uniquement). */
function getPalier2Groups(lang) {
	return lang === "es" ? ES_GROUPS : BASE_GROUPS;
}
var GROUP_MAPS = {
	fr: new Map(BASE_GROUPS.map((g) => [g.id, g])),
	en: new Map(BASE_GROUPS.map((g) => [g.id, g])),
	es: new Map(ES_GROUPS.map((g) => [g.id, g])),
	ar: new Map(BASE_GROUPS.map((g) => [g.id, g]))
};
function getPalier2GroupMap(lang) {
	return GROUP_MAPS[lang];
}
GROUP_MAPS.fr;
/** Formations complètes (avec pathD) pour les caractères d'un groupe, dans l'ordre. */
function lettersForGroup(g, style = "script") {
	return g.chars.map((c) => getLetterFormation(c, style)).filter((l) => !!l);
}
/** Retrouve le groupe de progression auquel appartient un caractère donné. */
function findGroupForChar(char, lang = "fr") {
	return getPalier2Groups(lang).find((g) => g.chars.includes(char));
}
//#endregion
export { lettersForGroup as i, getPalier2GroupMap as n, getPalier2Groups as r, findGroupForChar as t };
