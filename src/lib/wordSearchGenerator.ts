import type { WordEntry } from "@/data/word-catalog";

export type SearchDirection = "across" | "down" | "diag-down-right" | "diag-down-left";

export interface PlacedSearchWord {
  word: WordEntry;
  row: number;
  col: number;
  /** Sens de lecture uniquement (jamais inversé), pour rester adapté aux jeunes lecteurs. */
  direction: SearchDirection;
}

export interface GeneratedWordSearch {
  /** Grille carrée size×size. */
  size: number;
  /** Lettres résolues (mots placés + remplissage aléatoire), en MAJUSCULES. */
  cells: string[][];
  placed: PlacedSearchWord[];
}

export interface GridPos {
  row: number;
  col: number;
}

/** Liste ordonnée des cases occupées par un mot placé (sens de lecture normal). */
export function placedWordCells(p: PlacedSearchWord): GridPos[] {
  const [dRow, dCol] = DIRECTION_VECTORS[p.direction];
  return p.word.fr.split("").map((_, i) => ({ row: p.row + dRow * i, col: p.col + dCol * i }));
}

const DIRECTION_VECTORS: Record<SearchDirection, [number, number]> = {
  across: [0, 1],
  down: [1, 0],
  "diag-down-right": [1, 1],
  "diag-down-left": [1, -1],
};
const DIRECTIONS = Object.keys(DIRECTION_VECTORS) as SearchDirection[];

const FILLER_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Petit générateur pseudo-aléatoire déterministe (grilles reproductibles par niveau). */
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
  direction: SearchDirection;
  chars: string[];
}

function canPlace(grid: Map<string, string>, chars: string[], row: number, col: number, dir: SearchDirection, size: number): boolean {
  const [dRow, dCol] = DIRECTION_VECTORS[dir];
  for (let i = 0; i < chars.length; i++) {
    const r = row + dRow * i;
    const c = col + dCol * i;
    if (r < 0 || r >= size || c < 0 || c >= size) return false;
    const existing = grid.get(`${r},${c}`);
    if (existing && existing !== chars[i]) return false;
  }
  return true;
}

function place(grid: Map<string, string>, chars: string[], row: number, col: number, dir: SearchDirection): void {
  const [dRow, dCol] = DIRECTION_VECTORS[dir];
  chars.forEach((ch, i) => grid.set(`${row + dRow * i},${col + dCol * i}`, ch));
}

function attemptPlacement(
  candidates: WordEntry[],
  targetCount: number,
  size: number,
  rand: () => number,
  attemptsPerWord = 250
): WorkingPlacement[] {
  const grid = new Map<string, string>();
  const placements: WorkingPlacement[] = [];

  for (const word of candidates) {
    if (placements.length >= targetCount) break;
    const chars = word.fr.toUpperCase().split("");
    let placedThisWord = false;
    for (let attempt = 0; attempt < attemptsPerWord; attempt++) {
      const dir = DIRECTIONS[Math.floor(rand() * DIRECTIONS.length)];
      const row = Math.floor(rand() * size);
      const col = Math.floor(rand() * size);
      if (!canPlace(grid, chars, row, col, dir, size)) continue;
      place(grid, chars, row, col, dir);
      placements.push({ word, row, col, direction: dir, chars });
      placedThisWord = true;
      break;
    }
    if (!placedThisWord) continue;
  }

  return placements;
}

/**
 * Génère une grille de mots mêlés : place jusqu'à `targetCount` mots en ligne droite
 * (horizontale, verticale ou diagonale descendante — jamais à l'envers, pour rester lisible
 * par de jeunes lecteurs), puis remplit les cases restantes avec des lettres aléatoires.
 */
export function generateWordSearch(
  pool: WordEntry[],
  targetCount: number,
  seed: number,
  attempts = 40
): GeneratedWordSearch | null {
  const rand = seededRandom(seed);
  const usable = pool.filter((w) => w.fr.length >= 3 && w.fr.length <= 9);
  if (usable.length < 2) return null;

  const longest = Math.max(...usable.map((w) => w.fr.length));
  const size = Math.min(12, Math.max(8, longest + 2));

  let best: WorkingPlacement[] = [];
  for (let attempt = 0; attempt < attempts; attempt++) {
    const shuffled = shuffle(usable, rand);
    shuffled.sort((a, b) => b.fr.length - a.fr.length);
    const seeded = attempt % 3 === 0 ? shuffled : shuffle(shuffled, rand);
    const result = attemptPlacement(seeded, targetCount, size, rand);
    if (result.length > best.length) best = result;
    if (best.length >= targetCount) break;
  }

  if (best.length < 2) return null;

  const grid = new Map<string, string>();
  best.forEach((p) => place(grid, p.chars, p.row, p.col, p.direction));

  const cells: string[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => grid.get(`${r},${c}`) ?? FILLER_LETTERS[Math.floor(rand() * FILLER_LETTERS.length)])
  );

  return {
    size,
    cells,
    placed: best.map(({ word, row, col, direction }) => ({ word, row, col, direction })),
  };
}
