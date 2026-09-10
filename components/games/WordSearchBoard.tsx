'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiGet } from '@/lib/api-client';

interface WordSearchPuzzle {
  size: number;
  grid: string[][];
  words: string[];
  difficulty: string;
}

interface Cell {
  r: number;
  c: number;
}

const DIFFICULTIES = ['easy', 'medium', 'hard'];

export function WordSearchBoard() {
  const [difficulty, setDifficulty] = useState('medium');
  const [puzzle, setPuzzle] = useState<WordSearchPuzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [start, setStart] = useState<Cell | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [complete, setComplete] = useState(false);
  const startTimeRef = useRef<number>(0);

  const newPuzzle = useCallback(async (diff: string) => {
    setLoading(true);
    setFound(new Set());
    setFoundCells(new Set());
    setStart(null);
    setComplete(false);
    setElapsed(0);
    try {
      const data = await apiGet<WordSearchPuzzle>(
        `/api/games/word-search?difficulty=${diff}`
      );
      setPuzzle(data);
      startTimeRef.current = Date.now();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    newPuzzle(difficulty);
  }, [newPuzzle, difficulty]);

  // Timer
  useEffect(() => {
    if (loading || complete) return;
    const t = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, [loading, complete]);

  // Detect completion (client-side only; nothing persisted).
  useEffect(() => {
    if (!puzzle || complete) return;
    if (found.size === puzzle.words.length && puzzle.words.length > 0) {
      setComplete(true);
    }
  }, [found, puzzle, complete]);

  const cellsBetween = (a: Cell, b: Cell): Cell[] | null => {
    const dr = b.r - a.r;
    const dc = b.c - a.c;
    // Must be a straight line: horizontal, vertical, or 45° diagonal.
    const stepR = Math.sign(dr);
    const stepC = Math.sign(dc);
    const lenR = Math.abs(dr);
    const lenC = Math.abs(dc);
    if (!(lenR === 0 || lenC === 0 || lenR === lenC)) return null;
    const len = Math.max(lenR, lenC);
    const cells: Cell[] = [];
    for (let i = 0; i <= len; i++) {
      cells.push({ r: a.r + stepR * i, c: a.c + stepC * i });
    }
    return cells;
  };

  const handleCellClick = (r: number, c: number) => {
    if (!puzzle || complete) return;
    if (!start) {
      setStart({ r, c });
      return;
    }
    // Second click completes a line selection.
    const line = cellsBetween(start, { r, c });
    setStart(null);
    if (!line) return;

    const word = line.map((cell) => puzzle.grid[cell.r][cell.c]).join('');
    const reversed = word.split('').reverse().join('');
    const match = puzzle.words.find((w) => w === word || w === reversed);
    if (match && !found.has(match)) {
      setFound((prev) => new Set(prev).add(match));
      setFoundCells((prev) => {
        const next = new Set(prev);
        line.forEach((cell) => next.add(`${cell.r}-${cell.c}`));
        return next;
      });
    }
  };

  const fmtTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (loading) return <p className="text-navy-500">Generating puzzle...</p>;
  if (!puzzle) return <p className="text-red-600">Could not load puzzle.</p>;

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`min-h-[44px] px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                difficulty === d
                  ? 'bg-navy-900 text-white'
                  : 'bg-navy-50 text-navy-700 hover:bg-navy-100'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-navy-600 tabular-nums">⏱ {fmtTime(elapsed)}</span>
          <button
            onClick={() => newPuzzle(difficulty)}
            className="min-h-[44px] px-3 py-1.5 rounded-lg text-sm font-medium bg-navy-50 text-navy-700 hover:bg-navy-100"
          >
            New puzzle
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Grid */}
        <div className="overflow-x-auto">
          <div
            className="inline-grid gap-0.5 select-none"
            style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }}
            role="grid"
            aria-label="Word search grid"
          >
            {puzzle.grid.map((row, r) =>
              row.map((letter, c) => {
                const key = `${r}-${c}`;
                const isFound = foundCells.has(key);
                const isStart = start?.r === r && start?.c === c;
                return (
                  <button
                    key={key}
                    onClick={() => handleCellClick(r, c)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-sm font-bold uppercase rounded transition-colors ${
                      isFound
                        ? 'bg-emerald-500 text-white'
                        : isStart
                        ? 'bg-gold-400 text-navy-900'
                        : 'bg-white text-navy-800 hover:bg-navy-50 border border-navy-100'
                    }`}
                    aria-label={`Cell ${r + 1}, ${c + 1}: ${letter}`}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>
          <p className="text-xs text-navy-400 mt-2">
            Tap the first and last letter of a word to select it.
          </p>
        </div>

        {/* Word list */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-navy-700 mb-2">
            Words ({found.size}/{puzzle.words.length})
          </h3>
          <ul className="flex flex-wrap lg:flex-col gap-x-4 gap-y-1">
            {puzzle.words.map((w) => (
              <li
                key={w}
                className={`text-sm font-medium ${
                  found.has(w)
                    ? 'text-emerald-600 line-through'
                    : 'text-navy-800'
                }`}
              >
                {w}
              </li>
            ))}
          </ul>

          {complete && (
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <p className="text-emerald-700 font-bold">Complete! 🎉</p>
              <p className="text-sm text-emerald-600 mt-1">
                Finished in {fmtTime(elapsed)}.
              </p>
              <button
                onClick={() => newPuzzle(difficulty)}
                className="mt-3 min-h-[44px] px-4 py-2 bg-gradient-gold text-navy-900 text-sm font-bold rounded-xl hover:shadow-glow transition-all duration-300"
              >
                Play another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
