"use client";

import { useEffect, useRef, useState } from "react";
import { memoryPairs, peopleQuestions, quizQuestions, sequences, shuffle } from "./bible-game-data";

export type Activity = "quiz" | "people" | "memory" | "order";
export type Result = { game: Activity; score: number; total: number };
const button =
  "min-h-[44px] rounded-xl bg-navy-900 px-5 py-3 font-semibold text-white hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy-900 disabled:opacity-40";
const option =
  "min-h-[52px] rounded-xl border border-stone-300 bg-white px-4 py-3 text-left font-medium hover:border-navy-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy-900 disabled:cursor-default";

function Finished({
  score,
  total,
  onReplay,
}: {
  score: number;
  total: number;
  onReplay: () => void;
}) {
  return (
    <div className="rounded-2xl bg-navy-50 p-6 text-center" role="status">
      <p className="text-4xl" aria-hidden="true">
        ✦
      </p>
      <h3 className="mt-3 text-2xl font-bold">A little play. A little discovery.</h3>
      <p className="my-4">
        You scored {score} of {total}. Keep exploring Scripture and try again whenever you like.
      </p>
      <button className={button} onClick={onReplay}>
        Play again
      </button>
    </div>
  );
}

function Quiz({
  kind,
  onComplete,
}: {
  kind: "quiz" | "people";
  onComplete: (result: Result) => void;
}) {
  const [questions] = useState(() =>
    shuffle(kind === "quiz" ? quizQuestions : peopleQuestions).slice(0, 5)
  );
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState(false);
  const [done, setDone] = useState(false);
  const locked = useRef(false);
  if (done)
    return (
      <Finished
        score={score}
        total={questions.length}
        onReplay={() => {
          setIndex(0);
          setChosen(null);
          setScore(0);
          setHint(false);
          setDone(false);
          locked.current = false;
        }}
      />
    );
  const q = questions[index];
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm font-semibold text-stone-600">
        Question {index + 1} / {questions.length} · {score} correct
      </p>
      <progress
        aria-label="Quiz progress"
        value={index}
        max={questions.length}
        className="my-4 h-2 w-full accent-navy-900"
      />
      <h3 className="mb-6 text-2xl font-bold">{q.question}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {q.options.map((answer) => (
          <button
            key={answer}
            disabled={chosen !== null}
            className={`${option} ${chosen !== null && answer === q.answer ? "!border-green-700 !bg-green-50" : chosen === answer ? "!border-red-700 !bg-red-50" : ""}`}
            onClick={() => {
              if (locked.current) return;
              locked.current = true;
              setChosen(answer);
              if (answer === q.answer) setScore((s) => s + 1);
            }}
          >
            {answer}
            {chosen !== null && answer === q.answer
              ? " ✓ Correct answer"
              : chosen === answer
                ? " — Your choice"
                : ""}
          </button>
        ))}
      </div>
      {kind === "people" && chosen === null && (
        <button className="mt-4 min-h-[44px] font-semibold underline" onClick={() => setHint(true)}>
          Reveal a clue
        </button>
      )}
      {hint && "hint" in q && <p className="mt-2 rounded-xl bg-amber-50 p-4">{String(q.hint)}</p>}
      {chosen !== null && (
        <div className="mt-6 rounded-xl bg-stone-50 p-5" role="status">
          <p className="font-bold">
            {chosen === q.answer ? "That’s right!" : `Keep learning: the answer is ${q.answer}.`}
          </p>
          <p className="mt-2">{q.explanation}</p>
          <p className="my-3 text-sm font-semibold text-navy-900">Read {q.reference}</p>
          <button
            className={button}
            onClick={() => {
              if (index + 1 === questions.length) {
                setDone(true);
                onComplete({ game: kind, score, total: questions.length });
              } else {
                setIndex((i) => i + 1);
                setChosen(null);
                setHint(false);
                locked.current = false;
              }
            }}
          >
            {index + 1 === questions.length ? "See my result" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}

function Memory({ onComplete }: { onComplete: (result: Result) => void }) {
  const [cards] = useState(() =>
    shuffle(
      memoryPairs.flatMap(([person, item, reference], pair) => [
        { text: person, pair, reference },
        { text: item, pair, reference },
      ])
    )
  );
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("Match each Bible person to the object in their story.");
  const reported = useRef(false);
  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open;
    if (cards[a].pair === cards[b].pair) {
      setMatched((previous) => [...previous, cards[a].pair]);
      setMessage(`Matched ${cards[a].text} and ${cards[b].text}. Read ${cards[a].reference}.`);
      setOpen([]);
    } else {
      setMessage("Not a pair yet. Remember these cards and try again.");
      const timer = setTimeout(() => setOpen([]), 1200);
      return () => clearTimeout(timer);
    }
  }, [open, cards]);
  useEffect(() => {
    if (matched.length === memoryPairs.length && !reported.current) {
      reported.current = true;
      onComplete({ game: "memory", score: memoryPairs.length, total: memoryPairs.length });
    }
  }, [matched, onComplete]);
  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-4 font-semibold">
        {matched.length} / 6 pairs · {moves} turns
      </p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {cards.map((card, index) => {
          const found = matched.includes(card.pair);
          const visible = found || open.includes(index);
          return (
            <button
              key={index}
              disabled={found || open.includes(index) || open.length === 2}
              aria-label={
                visible ? `${card.text}${found ? ", matched" : ""}` : `Reveal card ${index + 1}`
              }
              className={`min-h-[100px] rounded-xl border p-2 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${found ? "border-green-700 bg-green-50 text-green-900" : visible ? "border-stone-300 bg-white text-stone-900" : "border-navy-900 bg-navy-900 text-white"}`}
              onClick={() => {
                setOpen((previous) => {
                  if (previous.length >= 2 || previous.includes(index)) return previous;
                  return [...previous, index];
                });
                if (open.length === 1) setMoves((m) => m + 1);
              }}
            >
              {visible ? (
                card.text
              ) : (
                <span aria-hidden="true" className="text-3xl">
                  ✦
                </span>
              )}
              {found && " ✓"}
            </button>
          );
        })}
      </div>
      <p role="status" className="mt-5 rounded-xl bg-stone-50 p-4">
        {matched.length === 6 ? `All pairs found in ${moves} turns! ${message}` : message}
      </p>
    </div>
  );
}

function Order({ onComplete }: { onComplete: (result: Result) => void }) {
  const [puzzle] = useState(() => sequences[Math.floor(Math.random() * sequences.length)]);
  const [items, setItems] = useState(() => {
    const mixed = shuffle(puzzle.items);
    return mixed.every((item, index) => item === puzzle.items[index])
      ? [...mixed.slice(1), mixed[0]]
      : mixed;
  });
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  function move(index: number, direction: number) {
    const next = [...items];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    setItems(next);
    setMessage("");
  }
  return (
    <div className="mx-auto max-w-2xl">
      <h3 className="text-2xl font-bold">{puzzle.title}</h3>
      <p className="mb-5 mt-2">{puzzle.prompt} Use the up and down buttons.</p>
      <ol className="space-y-3">
        {items.map((item, index) => (
          <li
            key={item}
            className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3"
          >
            <span className="font-bold text-stone-500">{index + 1}</span>
            <span className="flex-1 font-medium">{item}</span>
            <button
              className="h-11 w-11 rounded-lg bg-stone-100 disabled:opacity-25"
              aria-label={`Move ${item} up`}
              disabled={done || index === 0}
              onClick={() => move(index, -1)}
            >
              ↑
            </button>
            <button
              className="h-11 w-11 rounded-lg bg-stone-100 disabled:opacity-25"
              aria-label={`Move ${item} down`}
              disabled={done || index === items.length - 1}
              onClick={() => move(index, 1)}
            >
              ↓
            </button>
          </li>
        ))}
      </ol>
      <button
        disabled={done}
        className={`${button} mt-5`}
        onClick={() => {
          if (done) return;
          const correct = items.every((item, index) => item === puzzle.items[index]);
          setMessage(
            correct
              ? `Beautifully ordered! Explore ${puzzle.reference}.`
              : "Not quite yet. Move a few items and try again."
          );
          if (correct) {
            setDone(true);
            onComplete({ game: "order", score: items.length, total: items.length });
          }
        }}
      >
        Check my order
      </button>
      <p role="status" className="mt-4 font-medium">
        {message}
      </p>
    </div>
  );
}

export function BibleActivities({
  game,
  onComplete,
}: {
  game: Activity;
  onComplete: (result: Result) => void;
}) {
  const [round, setRound] = useState(0);
  return (
    <div>
      <div key={`${game}-${round}`}>
        {game === "quiz" || game === "people" ? (
          <Quiz kind={game} onComplete={onComplete} />
        ) : game === "memory" ? (
          <Memory onComplete={onComplete} />
        ) : (
          <Order onComplete={onComplete} />
        )}
      </div>
      <div className="mt-8 border-t border-stone-200 pt-4 text-center">
        <button
          className="min-h-[44px] px-4 text-sm font-semibold underline"
          onClick={() => setRound((r) => r + 1)}
        >
          Start a fresh round
        </button>
      </div>
    </div>
  );
}
