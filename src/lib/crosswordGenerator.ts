import type { WordEntry } from "@/data/word-catalog";

export interface PlacedWord {
  word: WordEntry;
  row: number;
  col: number;
  direction: "across" | "down";
  /** Numéro de case affiché (partagé si deux mots démarrent sur la même case). */
  number: number;
  /** Mot mystère : pas d'indice ni de numéro dans la liste, révélé à la fin. */
  mystery: boolean;
}

export interface GeneratedCrossword {
  rows: number;
  cols: number;
  placed: PlacedWord[];
}

/** Petit générateur pseudo-aléatoire déterministe (pour des grilles reproductibles par niveau). */
function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface WorkingPlacement {
  word: WordEntry;
  row: number;
  col: number;
  direction: "across" | "down";
}

function attemptPlacement(
  candidates: WordEntry[],
  targetCount: number,
  rand: () => number
): { placements: WorkingPlacement[]; minRow: number; maxRow: number; minCol: number; maxCol: number } | null {
  const grid = new Map<string, string>();
  const placements: WorkingPlacement[] = [];
  let minRow = 0, maxRow = 0, minCol = 0, maxCol = 0;

  const canPlace = (chars: string[], row: number, col: number, dir: "across" | "down"): boolean => {
    for (let i = 0; i < chars.length; i++) {
      const r = dir === "down" ? row + i : row;
      const c = dir === "across" ? col + i : col;
      const key = `${r},${c}`;
      const existing = grid.get(key);
      if (existing) {
        if (existing !== chars[i]) return false;
      } else {
        const n1 = dir === "across" ? `${r - 1},${c}` : `${r},${c - 1}`;
        const n2 = dir === "across" ? `${r + 1},${c}` : `${r},${c + 1}`;
        if (grid.has(n1) || grid.has(n2)) return false;
      }
    }
    const beforeKey = dir === "across" ? `${row},${col - 1}` : `${row - 1},${col}`;
    const afterKey = dir === "across" ? `${row},${col + chars.length}` : `${row + chars.length},${col}`;
    if (grid.has(beforeKey) || grid.has(afterKey)) return false;
    return true;
  };

  const place = (word: WordEntry, row: number, col: number, dir: "across" | "down") => {
    const chars = word.fr.split("");
    chars.forEach((ch, i) => {
      const r = dir === "down" ? row + i : row;
      const c = dir === "across" ? col + i : col;
      grid.set(`${r},${c}`, ch);
      minRow = Math.min(minRow, r); maxRow = Math.max(maxRow, r);
      minCol = Math.min(minCol, c); maxCol = Math.max(maxCol, c);
    });
    placements.push({ word, row, col, direction: dir });
  };

  const first = candidates[0];
  if (!first) return null;
  place(first, 0, 0, "across");
  const used = new Set([first.id]);

  for (const word of candidates.slice(1)) {
    if (placements.length >= targetCount) break;
    if (used.has(word.id)) continue;
    const chars = word.fr.split("");
    const options: { row: number; col: number; dir: "across" | "down" }[] = [];

    for (const [key, letter] of grid.entries()) {
      const [grStr, gcStr] = key.split(",");
      const gr = Number(grStr), gc = Number(gcStr);
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] !== letter) continue;
        const acrossRow = gr, acrossCol = gc - i;
        if (canPlace(chars, acrossRow, acrossCol, "across")) {
          options.push({ row: acrossRow, col: acrossCol, dir: "across" });
        }
        const downRow = gr - i, downCol = gc;
        if (canPlace(chars, downRow, downCol, "down")) {
          options.push({ row: downRow, col: downCol, dir: "down" });
        }
      }
    }

    if (options.length === 0) continue;
    const choice = options[Math.floor(rand() * options.length)];
    place(word, choice.row, choice.col, choice.dir);
    used.add(word.id);
  }

  if (placements.length < 2) return null;
  return { placements, minRow, maxRow, minCol, maxCol };
}

/**
 * Génère une grille de mots croisés à partir d'une banque de mots : place autant de mots
 * que possible (jusqu'à `targetCount`) en les faisant s'entrecroiser sur des lettres
 * communes, désigne un mot mystère (sans indice, révélé à la fin), et numérote chaque
 * case de départ comme dans une vraie grille de mots croisés.
 */
export function generateCrossword(
  pool: WordEntry[],
  targetCount: number,
  seed: number,
  attempts = 60
): GeneratedCrossword | null {
  const rand = seededRandom(seed);
  const usable = pool.filter((w) => w.fr.length >= 2 && w.fr.length <= 9);
  if (usable.length < 2) return null;

  let best: { placements: WorkingPlacement[]; minRow: number; maxRow: number; minCol: number; maxCol: number } | null = null;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const shuffled = shuffle(usable, rand);
    // Démarre plutôt par un mot de longueur moyenne/longue pour maximiser les intersections possibles.
    shuffled.sort((a, b) => b.fr.length - a.fr.length);
    const seeded = attempt % 3 === 0 ? shuffled : shuffle(shuffled, rand);
    const result = attemptPlacement(seeded, targetCount, rand);
    if (result && result.placements.length > (best?.placements.length ?? 0)) {
      best = result;
    }
    if (best && best.placements.length >= targetCount) break;
  }

  if (!best) return null;

  const offsetRow = -best.minRow;
  const offsetCol = -best.minCol;
  const normalized = best.placements
    .map((p) => ({ ...p, row: p.row + offsetRow, col: p.col + offsetCol }))
    .sort((a, b) => a.row - b.row || a.col - b.col);

  const startNumbers = new Map<string, number>();
  let nextNumber = 1;
  const numbered: PlacedWord[] = normalized.map((p) => {
    const key = `${p.row},${p.col}`;
    if (!startNumbers.has(key)) startNumbers.set(key, nextNumber++);
    return { ...p, number: startNumbers.get(key)!, mystery: false };
  });

  const mysteryIdx = Math.floor(rand() * numbered.length);
  numbered[mysteryIdx].mystery = true;

  return {
    rows: best.maxRow - best.minRow + 1,
    cols: best.maxCol - best.minCol + 1,
    placed: numbered,
  };
}
