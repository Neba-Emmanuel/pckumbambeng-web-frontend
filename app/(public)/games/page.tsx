"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { BibleActivities, type Activity, type Result } from "@/components/games/BibleActivities";

const DailyWordBoard = dynamic(
  () => import("@/components/games/DailyWordBoard").then((m) => m.DailyWordBoard),
  { loading: () => <p role="status">Loading Daily Word…</p> }
);
const WordSearchBoard = dynamic(
  () => import("@/components/games/WordSearchBoard").then((m) => m.WordSearchBoard),
  { loading: () => <p role="status">Loading Word Search…</p> }
);
const games = [
  {
    id: "quiz",
    title: "Bible Quiz",
    tag: "Discover",
    icon: "✧",
    color: "bg-navy-100",
    time: "3 min",
    description: "Five questions, little discoveries, and Scripture to explore after every answer.",
  },
  {
    id: "people",
    title: "Who Am I?",
    tag: "Discover",
    icon: "?",
    color: "bg-gold-100",
    time: "3 min",
    description: "Meet familiar Bible people through clues. Reveal a hint when you need one.",
  },
  {
    id: "memory",
    title: "Memory Match",
    tag: "Remember",
    icon: "▦",
    color: "bg-navy-50",
    time: "5 min",
    description: "Turn over cards and connect Bible people with the objects in their stories.",
  },
  {
    id: "order",
    title: "Bible Order",
    tag: "Remember",
    icon: "↕",
    color: "bg-gold-100",
    time: "3 min",
    description: "Put books and Bible stories in sequence. A little thinking goes a long way.",
  },
  {
    id: "daily-word",
    title: "Daily Word",
    tag: "Word play",
    icon: "Aa",
    color: "bg-navy-100",
    time: "5 min",
    description: "Six guesses. One hidden Bible word. Return tomorrow for another challenge.",
  },
  {
    id: "word-search",
    title: "Word Search",
    tag: "Word play",
    icon: "⌕",
    color: "bg-navy-50",
    time: "5–10 min",
    description: "Find the hidden Bible words, with three difficulty levels to explore.",
  },
] as const;
type GameId = (typeof games)[number]["id"];
type Progress = {
  rounds: number;
  best: Partial<Record<Activity, number>>;
  played: Activity[];
  days: string[];
};
const empty: Progress = { rounds: 0, best: {}, played: [], days: [] };
const storageKey = "pckm-bible-games-v1";
const activities: Activity[] = ["quiz", "people", "memory", "order"];
function localDay() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function GamesPage() {
  const [view, setView] = useState<GameId | null>(null);
  const [filter, setFilter] = useState("All games");
  const [progress, setProgress] = useState<Progress>(empty);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [daily, setDaily] = useState<Activity>("quiz");
  const [shareStatus, setShareStatus] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const day = localDay();
    setDaily(activities[Number(day.replaceAll("-", "")) % activities.length]);
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (
        stored &&
        Number.isSafeInteger(stored.rounds) &&
        stored.rounds >= 0 &&
        Array.isArray(stored.played) &&
        Array.isArray(stored.days) &&
        stored.best &&
        typeof stored.best === "object"
      ) {
        setProgress({
          rounds: stored.rounds,
          played: stored.played.filter((id: Activity) => activities.includes(id)),
          days: stored.days
            .filter((d: unknown) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d))
            .slice(-365),
          best: Object.fromEntries(
            Object.entries(stored.best).filter(
              ([key, value]) =>
                activities.includes(key as Activity) &&
                typeof value === "number" &&
                value >= 0 &&
                value <= 100
            )
          ),
        });
      }
    } catch {
      setStorageAvailable(false);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      setStorageAvailable(false);
    }
  }, [progress, ready]);
  const complete = useCallback((result: Result) => {
    const day = localDay();
    setProgress((previous) => ({
      rounds: previous.rounds + 1,
      best: {
        ...previous.best,
        [result.game]: Math.max(
          previous.best[result.game] || 0,
          Math.round((result.score / result.total) * 100)
        ),
      },
      played: Array.from(new Set([...previous.played, result.game])),
      days: Array.from(new Set([...previous.days, day])).slice(-365),
    }));
  }, []);
  function openGame(id: GameId | null) {
    setView(id);
    setShareStatus("");
    requestAnimationFrame(() => heading.current?.focus());
  }
  async function share() {
    try {
      const text = `Join me for Bible games at PC Kumba-Mbeng! ${window.location.origin}/games`;
      if (navigator.share) await navigator.share({ title: "Bible Play · PC Kumba-Mbeng", text });
      else {
        await navigator.clipboard.writeText(text);
        setShareStatus("Invitation copied. Paste it into a message to a friend.");
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError"))
        setShareStatus("Share this page by copying its address from your browser.");
    }
  }
  const current = games.find((game) => game.id === view);
  const pick = games.find((game) => game.id === daily)!;
  const badges = [
    { name: "First steps", earned: progress.rounds > 0, detail: "Complete your first new game" },
    {
      name: "Curious explorer",
      earned: progress.played.length === 4,
      detail: "Complete all four new games",
    },
    {
      name: "Keep growing",
      earned: progress.days.length >= 3,
      detail: "Play on three different days",
    },
  ];

  return (
    <div className="min-h-screen bg-warm-white text-navy-900">
      <section className="relative overflow-hidden bg-navy-900 px-4 py-12 text-white sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-200">
              PC Kumba-Mbeng · Play & grow
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-tight sm:text-6xl">
              A little play.
              <br />
              <span className="text-gold-200">A deeper connection.</span>
            </h1>
            <p className="mt-5 max-w-lg leading-relaxed text-white/80">
              Explore Scripture, spark a conversation, and discover something new. Six games for
              curious minds of every age.
            </p>
            <p className="mt-5 text-sm text-gold-200">
              Free to play · No sign-in · At your own pace
            </p>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-200">
              Today’s pick
            </p>
            <p className="my-4 font-serif text-3xl">{pick.title}</p>
            <p className="mb-6 text-sm leading-relaxed text-white/80">
              A small pause in your day. A fresh reason to open your Bible.
            </p>
            <button
              onClick={() => openGame(daily)}
              className="min-h-[48px] rounded-xl bg-gold-200 px-5 py-3 font-bold text-navy-900 hover:bg-gold-100"
            >
              Let’s play <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {view && current ? (
          <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-8">
            <button
              onClick={() => openGame(null)}
              className="mb-4 min-h-[44px] font-semibold underline"
            >
              ← All games
            </button>
            <div className="mb-7 border-b border-stone-200 pb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
                {current.tag} · {current.time}
              </p>
              <h2
                ref={heading}
                tabIndex={-1}
                className="mt-2 font-serif text-3xl focus:outline-none"
              >
                {current.title}
              </h2>
              <p className="mt-2 text-stone-600">{current.description}</p>
              <p className="mt-2 text-xs text-stone-500">
                Leaving this game starts a fresh round when you return.
              </p>
            </div>
            {view === "daily-word" ? (
              <DailyWordBoard />
            ) : view === "word-search" ? (
              <WordSearchBoard />
            ) : ready ? (
              <BibleActivities key={view} game={view} onComplete={complete} />
            ) : (
              <p role="status">Getting your game ready…</p>
            )}
          </section>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy-600">
                  Your next little adventure
                </p>
                <h2
                  ref={heading}
                  tabIndex={-1}
                  className="mt-2 font-serif text-3xl focus:outline-none"
                >
                  Find your kind of play
                </h2>
              </div>
              <div className="flex flex-wrap gap-2" aria-label="Filter games">
                {["All games", "Discover", "Remember", "Word play"].map((item) => (
                  <button
                    key={item}
                    aria-pressed={filter === item}
                    onClick={() => setFilter(item)}
                    className={`min-h-[44px] rounded-full border px-4 text-sm font-semibold ${filter === item ? "border-navy-900 bg-navy-900 text-white" : "border-stone-300 bg-white text-stone-700"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {games
                .filter((game) => filter === "All games" || game.tag === filter)
                .map((game) => (
                  <button
                    key={game.id}
                    onClick={() => openGame(game.id)}
                    className="group rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy-900"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        aria-hidden="true"
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl font-serif text-3xl ${game.color}`}
                      >
                        {game.icon}
                      </span>
                      <span className="text-xs font-medium text-stone-500">{game.time}</span>
                    </div>
                    <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-widest text-navy-600">
                      {game.tag}
                    </p>
                    <h3 className="font-serif text-2xl">{game.title}</h3>
                    <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-stone-600">
                      {game.description}
                    </p>
                    <span className="mt-5 inline-block text-sm font-bold">
                      Play now <span aria-hidden="true">↗</span>
                    </span>
                  </button>
                ))}
            </div>
          </>
        )}
        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="font-serif text-2xl">Little milestones</h2>
            <p className="mb-5 mt-2 text-sm text-stone-600">
              {ready ? progress.rounds : "…"} rounds completed across our four new games.{" "}
              {storageAvailable
                ? "Progress stays in this browser."
                : "Progress is available for this visit; browser storage is unavailable."}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {badges.map((badge) => (
                <div
                  key={badge.name}
                  className={`rounded-xl border p-4 ${badge.earned ? "border-navy-200 bg-navy-50" : "border-stone-200 bg-stone-50"}`}
                >
                  <p className="text-lg" aria-hidden="true">
                    {badge.earned ? "✦" : "○"}
                  </p>
                  <h3 className="mt-2 text-sm font-bold">{badge.name}</h3>
                  <p className="mt-1 text-xs text-stone-600">
                    {badge.earned ? "Unlocked · " : ""}
                    {badge.detail}
                  </p>
                </div>
              ))}
            </div>
            {progress.played.length > 0 && (
              <p className="mt-4 text-xs text-stone-600">
                Quiz best: {progress.best.quiz ?? "—"}
                {progress.best.quiz !== undefined ? "%" : ""} · Who Am I? best:{" "}
                {progress.best.people ?? "—"}
                {progress.best.people !== undefined ? "%" : ""}
              </p>
            )}
          </div>
          <div className="rounded-2xl bg-navy-50 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-navy-700">
              Better together
            </p>
            <h2 className="mt-3 font-serif text-2xl">Make it a family moment.</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Take turns reading the questions aloud. After each round, open one of the Scripture
              references and share something you noticed.
            </p>
            <button
              onClick={share}
              className="mt-5 min-h-[44px] rounded-xl border border-navy-900 px-4 font-semibold"
            >
              Invite someone to play
            </button>
            <p role="status" className="mt-2 text-sm">
              {shareStatus}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
