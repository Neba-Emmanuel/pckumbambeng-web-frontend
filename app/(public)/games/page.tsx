'use client';

import { useState } from 'react';
import { WordSearchBoard } from '@/components/games/WordSearchBoard';
import { DailyWordBoard } from '@/components/games/DailyWordBoard';

type GameView = 'hub' | 'word-search' | 'daily-word';

export default function GamesPage() {
  const [view, setView] = useState<GameView>('hub');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Bible Word Games</h1>
        <p className="text-navy-600 mt-1">
          Play Bible-themed word puzzles — free, no sign-in needed.
        </p>
      </div>

      {view === 'hub' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setView('daily-word')}
            className="text-left rounded-2xl bg-gradient-navy text-white p-6 shadow-md hover:shadow-glow hover:scale-[1.02] transition-all duration-300 min-h-[44px]"
          >
            <h2 className="text-lg font-bold">Daily Word</h2>
            <p className="text-white/70 text-sm mt-1">
              Guess today&apos;s hidden Bible word in 6 tries. New word every day.
            </p>
          </button>

          <button
            onClick={() => setView('word-search')}
            className="text-left rounded-2xl bg-white border border-navy-100 p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 min-h-[44px]"
          >
            <h2 className="text-lg font-bold text-navy-900">Word Search</h2>
            <p className="text-navy-600 text-sm mt-1">
              Find hidden Bible words in the grid. Play as many as you like.
            </p>
          </button>
        </div>
      )}

      {view === 'word-search' && (
        <div>
          <button
            onClick={() => setView('hub')}
            className="mb-4 text-sm text-navy-600 hover:text-navy-900 font-medium min-h-[44px] inline-flex items-center gap-1"
          >
            ← Back to games
          </button>
          <WordSearchBoard />
        </div>
      )}

      {view === 'daily-word' && (
        <div>
          <button
            onClick={() => setView('hub')}
            className="mb-4 text-sm text-navy-600 hover:text-navy-900 font-medium min-h-[44px] inline-flex items-center gap-1"
          >
            ← Back to games
          </button>
          <DailyWordBoard />
        </div>
      )}
    </div>
  );
}
