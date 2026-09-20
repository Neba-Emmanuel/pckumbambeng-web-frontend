"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api-client";
import { CalendarView } from "@/components/CalendarView";
import { ContentPage } from "@/components/ContentPage";
import { EventPageLink, type EventPageSettings } from "@/components/EventPageLink";
import { Icon } from "@/components/Icon";

type Event = EventPageSettings & {
  id: number;
  title: string;
  event_date: string;
  location: string;
  description: string;
};
export default function EventsPage() {
  const [date, setDate] = useState(() => new Date());
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const [view, setView] = useState<"list" | "calendar">("list");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    apiGet<Event[]>(`/api/events?year=${year}&month=${month}`, { signal: controller.signal })
      .then(setEvents)
      .catch(() => {
        if (!controller.signal.aborted) setError("Unable to load events. Please try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [year, month, retry]);
  return (
    <ContentPage
      title="Gather. Celebrate. Belong."
      eyebrow="Life in our congregation"
      description="Make room for worship, fellowship, and shared moments. Find your next gathering and join our church family."
      icon="calendar_month"
      action={
        <Link
          href="/events/archive"
          className="inline-flex min-h-[44px] items-center rounded-xl border border-white/30 px-5 py-2 font-semibold text-white hover:bg-white/10"
        >
          Explore past events →
        </Link>
      }
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <button
            aria-label="Previous month"
            className="h-11 w-11 rounded-full border border-navy-100 bg-white text-navy-900"
            onClick={() => setDate(new Date(year, month - 2, 1))}
          >
            ←
          </button>
          <h2 className="text-xl font-bold text-navy-900">
            {date.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </h2>
          <button
            aria-label="Next month"
            className="h-11 w-11 rounded-full border border-navy-100 bg-white text-navy-900"
            onClick={() => setDate(new Date(year, month, 1))}
          >
            →
          </button>
        </div>
        <div className="flex gap-2">
          {(["list", "calendar"] as const).map((mode) => (
            <button
              key={mode}
              aria-pressed={view === mode}
              onClick={() => setView(mode)}
              className={`min-h-[44px] rounded-full px-5 font-semibold capitalize ${view === mode ? "bg-navy-900 text-white" : "border border-navy-100 bg-white text-navy-700"}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <p role="status" className="rounded-2xl bg-white p-8 text-navy-600">
          Loading this month’s gatherings…
        </p>
      ) : error ? (
        <div role="alert" className="rounded-2xl bg-red-50 p-6 text-red-700">
          <p>{error}</p>
          <button
            className="mt-4 min-h-[44px] rounded-xl bg-navy-900 px-5 py-3 text-white"
            onClick={() => setRetry((r) => r + 1)}
          >
            Try again
          </button>
        </div>
      ) : view === "calendar" ? (
        <div className="rounded-2xl border border-navy-100 bg-white p-3 sm:p-6">
          <CalendarView
            events={events}
            year={year}
            month={month}
            onMonthChange={(y, m) => setDate(new Date(y, m - 1, 1))}
          />
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-200 bg-white p-10 text-center">
          <Icon name="calendar_month" className="text-4xl text-navy-400" />
          <h3 className="mt-4 text-xl font-bold text-navy-900">A little space in the calendar.</h3>
          <p className="mt-2 text-gray-600">
            No events are listed for this month. Browse another month or check back soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {[...events]
            .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
            .map((event) => (
              <article
                key={event.id}
                className="flex items-start gap-5 rounded-2xl border border-navy-100 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="min-w-[64px] shrink-0 rounded-xl bg-navy-50 p-3 text-center text-navy-900">
                  <p className="text-xs font-bold uppercase">
                    {new Date(event.event_date).toLocaleDateString("en-GB", {
                      month: "short",
                      timeZone: "Africa/Douala",
                    })}
                  </p>
                  <p className="mt-1 text-3xl font-bold">
                    {new Date(event.event_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      timeZone: "Africa/Douala",
                    })}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gold-700">
                    {new Date(event.event_date).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Africa/Douala",
                    })}{" "}
                    · Cameroon time
                  </p>
                  <h3 className="mt-2 break-words font-serif text-2xl text-navy-900">
                    {event.title}
                  </h3>
                  <p className="mt-3 flex items-center gap-2 text-sm text-navy-600">
                    <Icon name="location_on" />
                    {event.location}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-600">
                    {event.description}
                  </p>
                  <div className="mt-4">
                    <EventPageLink event={event} />
                  </div>
                </div>
              </article>
            ))}
        </div>
      )}
    </ContentPage>
  );
}
