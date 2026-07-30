"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var sign_exercise_catalog_exports = {};
__export(sign_exercise_catalog_exports, {
  COURBES: () => COURBES,
  CROCHETS: () => CROCHETS,
  EXERCISE_CATALOG: () => EXERCISE_CATALOG,
  EXERCISE_MAP: () => EXERCISE_MAP,
  POINTS: () => POINTS,
  TRAITS: () => TRAITS
});
module.exports = __toCommonJS(sign_exercise_catalog_exports);
const TRAITS = [
  {
    id: "trait-vertical-full",
    label: { fr: "Trait vertical", en: "Vertical line" },
    consigne: {
      fr: "Trace le trait vertical. Pars du haut et descends jusqu'en bas d'un seul geste r\xE9gulier.",
      en: "Trace the vertical line. Start at the top and go down to the bottom in one steady motion."
    },
    family: "trait",
    variant: "vertical",
    scale: "full",
    pathD: "M 100 28 L 100 172",
    startXY: [100, 28],
    zone: "hampe",
    strokeColor: "#4A3B2A",
    badgeBg: "#F5EDE0",
    badgeText: "#4A3B2A"
  },
  {
    id: "trait-vertical-reduced",
    label: { fr: "Petit trait vertical", en: "Small vertical line" },
    consigne: {
      fr: "Trace le petit trait vertical, dans le corps de la ligne.",
      en: "Trace the small vertical line, within the body of the writing line."
    },
    family: "trait",
    variant: "vertical",
    scale: "reduced",
    pathD: "M 100 75 L 100 155",
    startXY: [100, 75],
    zone: "corps",
    strokeColor: "#4A3B2A",
    badgeBg: "#F5EDE0",
    badgeText: "#4A3B2A"
  },
  {
    id: "trait-horizontal-full",
    label: { fr: "Trait horizontal", en: "Horizontal line" },
    consigne: {
      fr: "Trace le trait horizontal. Pars de gauche \xE0 droite d'un geste stable.",
      en: "Trace the horizontal line. Go from left to right in one steady motion."
    },
    family: "trait",
    variant: "horizontal",
    scale: "full",
    pathD: "M 28 100 L 172 100",
    startXY: [28, 100],
    zone: "corps",
    strokeColor: "#4A3B2A",
    badgeBg: "#F5EDE0",
    badgeText: "#4A3B2A"
  },
  {
    id: "trait-horizontal-reduced",
    label: { fr: "Petit trait horizontal", en: "Small horizontal line" },
    consigne: {
      fr: "Trace le petit trait horizontal.",
      en: "Trace the small horizontal line."
    },
    family: "trait",
    variant: "horizontal",
    scale: "reduced",
    pathD: "M 60 115 L 140 115",
    startXY: [60, 115],
    zone: "corps",
    strokeColor: "#4A3B2A",
    badgeBg: "#F5EDE0",
    badgeText: "#4A3B2A"
  },
  {
    id: "trait-oblique-gauche-full",
    label: { fr: "Trait oblique \xE0 gauche", en: "Diagonal line to the left" },
    consigne: {
      fr: "Trace le trait oblique \xE0 gauche en partant du haut gauche et en descendant vers le bas droit.",
      en: "Trace the left diagonal line, starting at the top left and going down to the bottom right."
    },
    family: "trait",
    variant: "oblique-gauche",
    scale: "full",
    pathD: "M 40 40 L 160 160",
    startXY: [40, 40],
    zone: "hampe",
    strokeColor: "#4A3B2A",
    badgeBg: "#F5EDE0",
    badgeText: "#4A3B2A"
  },
  {
    id: "trait-oblique-droit-full",
    label: { fr: "Trait oblique \xE0 droite", en: "Diagonal line to the right" },
    consigne: {
      fr: "Trace le trait oblique \xE0 droite en partant du haut droit et en descendant vers le bas gauche.",
      en: "Trace the right diagonal line, starting at the top right and going down to the bottom left."
    },
    family: "trait",
    variant: "oblique-droit",
    scale: "full",
    pathD: "M 160 40 L 40 160",
    startXY: [160, 40],
    zone: "hampe",
    strokeColor: "#4A3B2A",
    badgeBg: "#F5EDE0",
    badgeText: "#4A3B2A"
  },
  {
    id: "trait-oblique-gauche-reduced",
    label: { fr: "Petit oblique \xE0 gauche", en: "Small left diagonal" },
    consigne: {
      fr: "Trace le petit trait oblique \xE0 gauche en partant du haut et en descendant.",
      en: "Trace the small left diagonal line, starting at the top and going down."
    },
    family: "trait",
    variant: "oblique-gauche",
    scale: "reduced",
    pathD: "M 60 60 L 140 140",
    startXY: [60, 60],
    zone: "corps",
    strokeColor: "#4A3B2A",
    badgeBg: "#F5EDE0",
    badgeText: "#4A3B2A"
  },
  {
    id: "trait-oblique-droit-reduced",
    label: { fr: "Petit oblique \xE0 droite", en: "Small right diagonal" },
    consigne: {
      fr: "Trace le petit trait oblique \xE0 droite en partant du haut et en descendant.",
      en: "Trace the small right diagonal line, starting at the top and going down."
    },
    family: "trait",
    variant: "oblique-droit",
    scale: "reduced",
    pathD: "M 140 60 L 60 140",
    startXY: [140, 60],
    zone: "corps",
    strokeColor: "#4A3B2A",
    badgeBg: "#F5EDE0",
    badgeText: "#4A3B2A"
  }
];
const COURBES = [
  {
    id: "courbe-open-right-full",
    label: { fr: "Courbe ouverte \xE0 droite", en: "Curve open to the right" },
    consigne: {
      fr: "Trace la courbe ouverte \xE0 droite, comme la lettre C.",
      en: "Trace the curve open to the right, like the letter C."
    },
    family: "courbe",
    variant: "open-right",
    scale: "full",
    pathD: "M 130 35 A 65 65 0 0 0 130 165",
    startXY: [130, 35],
    zone: "hampe",
    strokeColor: "#E05252",
    badgeBg: "#FDEAEA",
    badgeText: "#C03E3E"
  },
  {
    id: "courbe-open-right-reduced",
    label: { fr: "Petite courbe \xE0 droite", en: "Small curve to the right" },
    consigne: {
      fr: "Trace la petite courbe ouverte \xE0 droite.",
      en: "Trace the small curve open to the right."
    },
    family: "courbe",
    variant: "open-right",
    scale: "reduced",
    pathD: "M 120 65 A 40 40 0 0 0 120 135",
    startXY: [120, 65],
    zone: "corps",
    strokeColor: "#E05252",
    badgeBg: "#FDEAEA",
    badgeText: "#C03E3E"
  },
  {
    id: "courbe-open-left-full",
    label: { fr: "Courbe ouverte \xE0 gauche", en: "Curve open to the left" },
    consigne: {
      fr: "Trace la courbe ouverte \xE0 gauche.",
      en: "Trace the curve open to the left."
    },
    family: "courbe",
    variant: "open-left",
    scale: "full",
    pathD: "M 70 35 A 65 65 0 0 1 70 165",
    startXY: [70, 35],
    zone: "hampe",
    strokeColor: "#E05252",
    badgeBg: "#FDEAEA",
    badgeText: "#C03E3E"
  },
  {
    id: "courbe-open-left-reduced",
    label: { fr: "Petite courbe \xE0 gauche", en: "Small curve to the left" },
    consigne: {
      fr: "Trace la petite courbe ouverte \xE0 gauche.",
      en: "Trace the small curve open to the left."
    },
    family: "courbe",
    variant: "open-left",
    scale: "reduced",
    pathD: "M 80 65 A 40 40 0 0 1 80 135",
    startXY: [80, 65],
    zone: "corps",
    strokeColor: "#E05252",
    badgeBg: "#FDEAEA",
    badgeText: "#C03E3E"
  },
  {
    id: "courbe-closed-full",
    label: { fr: "Cercle ferm\xE9", en: "Closed circle" },
    consigne: {
      fr: "Trace le cercle complet, en partant du haut et en tournant dans le sens anti-horaire (vers la gauche).",
      en: "Trace the full circle, starting at the top and turning counter-clockwise (to the left)."
    },
    family: "courbe",
    variant: "closed",
    scale: "full",
    pathD: "M 100 32 A 68 68 0 1 0 100.1 32",
    startXY: [100, 32],
    zone: "corps",
    strokeColor: "#E05252",
    badgeBg: "#FDEAEA",
    badgeText: "#C03E3E"
  }
];
const CROCHETS = [
  {
    id: "crochet-top-right-full",
    label: { fr: "Crochet haut-droite", en: "Top-right hook" },
    consigne: {
      fr: "Trace le crochet haut droite en partant de l'extr\xE9mit\xE9 haute puis en descendant la tige vers le bas.",
      en: "Trace the top-right hook, starting at the top end then going down the stem."
    },
    family: "crochet",
    variant: "top-right",
    scale: "full",
    pathD: "M 150 70 A 45 45 0 0 0 60 70 L 60 170",
    startXY: [150, 70],
    zone: "hampe",
    strokeColor: "#4A90E2",
    badgeBg: "#EAF1FB",
    badgeText: "#2D6BBF"
  },
  {
    id: "crochet-top-left-full",
    label: { fr: "Crochet haut-gauche", en: "Top-left hook" },
    consigne: {
      fr: "Trace le crochet haut gauche en partant de l'extr\xE9mit\xE9 haute puis en descendant la tige vers le bas.",
      en: "Trace the top-left hook, starting at the top end then going down the stem."
    },
    family: "crochet",
    variant: "top-left",
    scale: "full",
    pathD: "M 50 70 A 45 45 0 0 1 140 70 L 140 170",
    startXY: [50, 70],
    zone: "hampe",
    strokeColor: "#4A90E2",
    badgeBg: "#EAF1FB",
    badgeText: "#2D6BBF"
  },
  {
    id: "crochet-bottom-right-full",
    label: { fr: "Crochet bas-droite", en: "Bottom-right hook" },
    consigne: {
      fr: "Trace le crochet bas droite : descends la tige puis courbe vers la droite en bas.",
      en: "Trace the bottom-right hook: go down the stem, then curve to the right at the bottom."
    },
    family: "crochet",
    variant: "bottom-right",
    scale: "full",
    pathD: "M 60 30 L 60 130 A 45 45 0 0 0 150 130",
    startXY: [60, 30],
    zone: "jambe",
    strokeColor: "#4A90E2",
    badgeBg: "#EAF1FB",
    badgeText: "#2D6BBF"
  },
  {
    id: "crochet-bottom-left-full",
    label: { fr: "Crochet bas-gauche", en: "Bottom-left hook" },
    consigne: {
      fr: "Trace le crochet bas gauche, comme la lettre J.",
      en: "Trace the bottom-left hook, like the letter J."
    },
    family: "crochet",
    variant: "bottom-left",
    scale: "full",
    pathD: "M 140 30 L 140 130 A 45 45 0 0 1 50 130",
    startXY: [140, 30],
    zone: "jambe",
    strokeColor: "#4A90E2",
    badgeBg: "#EAF1FB",
    badgeText: "#2D6BBF"
  },
  {
    id: "crochet-double-gauche-full",
    label: { fr: "Double-crochet gauche", en: "Left double hook" },
    consigne: {
      fr: "Trace le double-crochet gauche : courbe en haut et en bas reli\xE9es \xE0 gauche.",
      en: "Trace the left double hook: curves at the top and bottom joined on the left."
    },
    family: "crochet",
    variant: "double-crochet-gauche",
    scale: "full",
    pathD: "M 65 55 C 65 25, 130 25, 130 80 L 130 120 C 130 175, 65 175, 65 145",
    startXY: [65, 55],
    zone: "hampe",
    strokeColor: "#4A90E2",
    badgeBg: "#EAF1FB",
    badgeText: "#2D6BBF"
  },
  {
    id: "crochet-double-droit-full",
    label: { fr: "Double-crochet droit", en: "Right double hook" },
    consigne: {
      fr: "Trace le double-crochet droit : courbe en haut et en bas reli\xE9es \xE0 droite.",
      en: "Trace the right double hook: curves at the top and bottom joined on the right."
    },
    family: "crochet",
    variant: "double-crochet-droit",
    scale: "full",
    pathD: "M 135 55 C 135 25, 70 25, 70 80 L 70 120 C 70 175, 135 175, 135 145",
    startXY: [135, 55],
    zone: "hampe",
    strokeColor: "#4A90E2",
    badgeBg: "#EAF1FB",
    badgeText: "#2D6BBF"
  },
  {
    id: "crochet-double-gauche-droit-full",
    label: { fr: "Double-crochet gauche-droit", en: "Left-right double hook" },
    consigne: {
      fr: "Trace le double-crochet gauche et droit en forme de S.",
      en: "Trace the left-right double hook in an S shape."
    },
    family: "crochet",
    variant: "double-crochet-gauche-droit",
    scale: "full",
    pathD: "M 60 55 C 60 25, 100 25, 100 80 L 100 120 C 100 175, 140 175, 140 145",
    startXY: [60, 55],
    zone: "hampe",
    strokeColor: "#4A90E2",
    badgeBg: "#EAF1FB",
    badgeText: "#2D6BBF"
  },
  {
    id: "crochet-double-droit-gauche-full",
    label: { fr: "Double-crochet droit-gauche", en: "Right-left double hook" },
    consigne: {
      fr: "Trace le double-crochet droit et gauche en forme de Z adouci.",
      en: "Trace the right-left double hook in a softened Z shape."
    },
    family: "crochet",
    variant: "double-crochet-droit-gauche",
    scale: "full",
    pathD: "M 140 55 C 140 25, 100 25, 100 80 L 100 120 C 100 175, 60 175, 60 145",
    startXY: [140, 55],
    zone: "hampe",
    strokeColor: "#4A90E2",
    badgeBg: "#EAF1FB",
    badgeText: "#2D6BBF"
  }
];
const POINTS = [
  {
    id: "point-center-full",
    label: { fr: "Le Point", en: "The Dot" },
    consigne: {
      fr: "Trace le point en faisant un petit rond circulaire dans le sens anti-horaire (vers la gauche).",
      en: "Trace the dot by making a small round circle counter-clockwise (to the left)."
    },
    family: "point",
    variant: "center",
    scale: "full",
    pathD: "M 100 82 A 18 18 0 1 0 100.1 82",
    startXY: [100, 82],
    zone: "corps",
    strokeColor: "#4A3B2A",
    badgeBg: "#FBF6EC",
    badgeText: "#4A3B2A"
  }
];
const EXERCISE_CATALOG = [
  ...TRAITS,
  ...COURBES,
  ...CROCHETS,
  ...POINTS
];
const EXERCISE_MAP = new Map(EXERCISE_CATALOG.map((e) => [e.id, e]));
