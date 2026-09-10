'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CalendarView } from '@/components/CalendarView';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface CalendarEvent {
  id: number;
  title: string;
  event_date: string;
  location: string;
  description: string;
}

export default function EventsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (y: number, m: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_URL}/api/events?year=${y}&month=${m}`,
        { credentials: 'include' }
      );

      if (!res.ok) {
        throw new Error('Failed to load events');
      }

      const data = await res.json();
      setEvents(data.data || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(year, month);
  }, [fetchEvents, year, month]);

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="mt-1 text-sm text-gray-600">
            View upcoming church events
          </p>
        </div>
        <Link
          href="/events/archive"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[44px] flex items-center"
        >
          Past Events
        </Link>
      </div>

      {isLoading && (
        <div className="mt-8 text-center text-gray-500">Loading events...</div>
      )}

      {error && (
        <div className="mt-8 rounded-md bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-6">
          <CalendarView
            events={events}
            year={year}
            month={month}
            onMonthChange={handleMonthChange}
          />
        </div>
      )}
    </div>
  );
}
