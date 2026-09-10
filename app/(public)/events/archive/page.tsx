'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { apiGetList } from '@/lib/api-client';

interface ArchiveEvent {
  id: number;
  title: string;
  event_date: string;
  location: string;
}

export default function EventsArchivePage() {
  const [events, setEvents] = useState<ArchiveEvent[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 20;
  const totalPages = Math.ceil(total / pageSize);

  const fetchArchive = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, meta } = await apiGetList<ArchiveEvent[]>(
        `/api/events/archive?page=${pageNum}`
      );
      setEvents(data);
      setTotal(meta?.total ?? 0);
      setPage(meta?.page ?? pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load past events');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchive(page);
  }, [fetchArchive, page]);

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Past Events</h1>
          <p className="mt-1 text-sm text-gray-600">
            Archive of past church events
          </p>
        </div>
        <Link
          href="/events"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[44px] flex items-center"
        >
          ← Back to Calendar
        </Link>
      </div>

      {isLoading && (
        <div className="mt-8 text-center text-gray-500">Loading past events...</div>
      )}

      {error && (
        <div className="mt-8 rounded-md bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      {!isLoading && !error && events.length === 0 && (
        <div className="mt-8 rounded-md bg-gray-100 p-8 text-center text-gray-500">
          No past events to display
        </div>
      )}

      {!isLoading && !error && events.length > 0 && (
        <>
          <ul className="mt-6 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm">
            {events.map((event) => (
              <li key={event.id} className="px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">{event.title}</h2>
                <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-gray-500">
                  <span>
                    {new Date(event.event_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span>📍 {event.location}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={page <= 1}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px]"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={page >= totalPages}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px]"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
