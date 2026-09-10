'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiSend, ApiError } from '@/lib/api-client';

type LetterFeedback = 'correct' | 'present' | 'absent';

interface GuessRow {
  guess: string;
  feedback: LetterFeedback[];
}

interface DailyMeta {
  date: string;
  length: number;
  maxGuesses: number;
}

interface GuessResponse {
  feedback: LetterFeedback[];
  solved: boolean;
  answer?: string;
}

const FEEDBACK_CLASS: Record<LetterFeedback, string> = {
  correct: 'bg-emerald-500 text-white border-emerald-500',
  present: 'bg-gold-400 text-navy-900 border-gold-400',
  absent: 'bg-navy-300 text-white border-navy-300',
};

export function DailyWordBoard() {
  const [meta, setMeta] = useState<DailyMeta | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Client-side game state (stateless server).
  const [guesses, setGuesses] = useState<GuessRow[]>([]);
  const [current, setCurrent] = useState('');
  const [solved, setSolved] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet<DailyMeta | null>('/api/games/daily-word');
      if (!data) {
        setUnavailable(true);
      } else {
        setMeta(data);
      }
    } catch {
      setError("Unable to load today's puzzle.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const finished = solved || (meta != null && guesses.length >= meta.maxGuesses);

  const submitGuess = async () => {
    if (!meta || finished || submitting) return;
    const guess = current.toUpperCase();
    if (guess.length !== meta.length) {
      setError(`Guess must be ${meta.length} letters`);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const { data } = await apiSend<GuessResponse>('/api/games/daily-word/guess', 'POST', {
        guess,
      });
      const nextGuesses = [...guesses, { guess, feedback: data.feedback }];
      setGuesses(nextGuesses);
      setCurrent('');

      if (data.solved) {
        setSolved(true);
        setAnswer(data.answer ?? guess);
      } else if (nextGuesses.length >= meta.maxGuesses) {
        // Out of guesses — reveal the answer via a final losing state.
        // The server only returns the answer on a correct guess, so fetch it
        // is not exposed; we simply mark the game over without the word.
        setAnswer(null);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to submit guess');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-navy-500">Loading today&apos;s puzzle...</p>;
  }

  if (unavailable) {
    return (
      <div className="rounded-2xl bg-white border border-navy-100 p-6 text-center">
        <p className="text-navy-600">Today&apos;s puzzle isn&apos;t available yet. Check back soon.</p>
      </div>
    );
  }

  if (!meta) {
    return <p className="text-red-600">{error || 'Something went wrong.'}</p>;
  }

  const rows = [];
  for (let i = 0; i < meta.maxGuesses; i++) {
    const past = guesses[i];
    const isCurrentRow = !finished && i === guesses.length;
    const letters: { ch: string; fb: LetterFeedback | null }[] = [];
    for (let j = 0; j < meta.length; j++) {
      if (past) {
        letters.push({ ch: past.guess[j], fb: past.feedback[j] });
      } else if (isCurrentRow) {
        letters.push({ ch: current[j] || '', fb: null });
      } else {
        letters.push({ ch: '', fb: null });
      }
    }
    rows.push(letters);
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="space-y-1.5 mb-4">
        {rows.map((letters, ri) => (
          <div key={ri} className="flex gap-1.5 justify-center">
            {letters.map((cell, ci) => (
              <div
                key={ci}
                className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg border-2 text-xl font-bold uppercase ${
                  cell.fb ? FEEDBACK_CLASS[cell.fb] : 'border-navy-200 text-navy-900 bg-white'
                }`}
              >
                {cell.ch}
              </div>
            ))}
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 text-center mb-3">{error}</p>}

      {finished ? (
        <div className="rounded-2xl bg-white border border-navy-100 p-5 text-center">
          {solved ? (
            <p className="text-emerald-600 font-bold text-lg">Solved! 🎉</p>
          ) : (
            <>
              <p className="text-navy-700 font-medium">Out of guesses.</p>
              {answer && (
                <p className="text-navy-900 mt-1">
                  The word was <span className="font-bold tracking-wide">{answer}</span>
                </p>
              )}
            </>
          )}
          <p className="text-sm text-navy-500 mt-2">Come back tomorrow for a new word.</p>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={current}
            onChange={(e) =>
              setCurrent(
                e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, meta.length).toUpperCase()
              )
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitGuess();
            }}
            maxLength={meta.length}
            placeholder={`${meta.length}-letter word`}
            aria-label="Your guess"
            className="flex-1 min-h-[44px] px-3 py-2 border border-navy-200 rounded-xl uppercase tracking-widest text-center focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
          />
          <button
            onClick={submitGuess}
            disabled={submitting || current.length !== meta.length}
            className="min-h-[44px] px-5 py-2 bg-gradient-gold text-navy-900 font-bold rounded-xl hover:shadow-glow transition-all duration-300 disabled:opacity-50"
          >
            {submitting ? '...' : 'Guess'}
          </button>
        </div>
      )}
    </div>
  );
}
