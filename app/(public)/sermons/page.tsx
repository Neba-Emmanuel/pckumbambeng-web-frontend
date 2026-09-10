'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiGetList } from '@/lib/api-client';

interface Sermon {
  id: number;
  title: string;
  speaker: string;
  sermon_date: string;
  content_type: 'audio' | 'text';
}

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSermons = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, meta } = await apiGetList<Sermon[]>(`/api/sermons?page=${page}`);
        setSermons(data || []);
        const total = meta?.total || 0;
        const pageSize = meta?.pageSize || 20;
        setTotal(total);
        setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
      } catch {
        setError('Unable to load sermons. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSermons();
  }, [page]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">Sermons</h1>
      <p className="mt-2 text-sm text-gray-600">
        Browse and listen to church sermons
      </p>

      {error && (
        <div className="mt-6 rounded-md bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="mt-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg bg-gray-100 p-4">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : sermons.length === 0 ? (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">No sermons available at this time.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-4">
            {sermons.map((sermon) => (
              <Link
                key={sermon.id}
                href={`/sermons/${sermon.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-navy-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-navy-900">
                      {sermon.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {sermon.speaker} &middot;{' '}
                      {new Date(sermon.sermon_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      sermon.content_type === 'audio'
                        ? 'bg-gold-100 text-gold-800'
                        : 'bg-navy-100 text-navy-800'
                    }`}
                  >
                    {sermon.content_type === 'audio' ? '🎵 Audio' : '📄 Text'}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                Showing page {page} of {totalPages} ({total} sermons)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] min-w-[44px]"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] min-w-[44px]"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
