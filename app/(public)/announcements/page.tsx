'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { apiGetList } from '@/lib/api-client';

interface Announcement {
  id: number;
  title: string;
  published_at: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 20;
  const totalPages = Math.ceil(total / pageSize);

  const fetchAnnouncements = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, meta } = await apiGetList<Announcement[]>(
        `/api/announcements?page=${pageNum}`
      );
      setAnnouncements(data);
      setTotal(meta?.total ?? 0);
      setPage(meta?.page ?? pageNum);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load announcements'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements(page);
  }, [fetchAnnouncements, page]);

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
      <p className="mt-1 text-sm text-gray-600">
        Stay updated with the latest church announcements
      </p>

      {isLoading && (
        <div className="mt-8 text-center text-gray-500">
          Loading announcements...
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-md bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      {!isLoading && !error && announcements.length === 0 && (
        <div className="mt-8 rounded-md bg-gray-100 p-8 text-center text-gray-500">
          No announcements at this time
        </div>
      )}

      {!isLoading && !error && announcements.length > 0 && (
        <>
          <ul className="mt-6 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm">
            {announcements.map((announcement) => (
              <li key={announcement.id}>
                <Link
                  href={`/announcements/${announcement.id}`}
                  className="block px-6 py-4 transition hover:bg-gray-50"
                >
                  <h2 className="text-lg font-medium text-gray-900">
                    {announcement.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(announcement.published_at).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={page <= 1}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] min-w-[44px]"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={page >= totalPages}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] min-w-[44px]"
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
