'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContentPage } from '@/components/ContentPage';
import { PreacherPhoto } from '@/components/PreacherPhoto';
import { apiGetList } from '@/lib/api-client';

interface Sermon {
  preacher_image: string | null;
  text_content: string | null;
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
    <ContentPage title="The Word for everyday life." eyebrow="Listen · Reflect · Grow" description="Revisit a message, meet the preacher, and make space for Scripture throughout your week." icon="auto_stories">
      <div className="mb-8 flex items-center justify-between gap-4"><h2 className="text-2xl font-bold text-navy-900">Sermon library</h2><span className="rounded-full bg-navy-50 px-4 py-2 text-sm text-navy-700">{total} messages</span></div>
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
      ) : error ? null : sermons.length === 0 ? (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">No sermons available at this time.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sermons.map((sermon) => (
              <Link
                key={sermon.id}
                href={`/sermons/${sermon.id}`}
                className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm transition hover:border-navy-300 hover:shadow-md"
              >
                <div className="flex items-center gap-4 bg-gradient-to-br from-navy-50 to-gold-50 p-6"><PreacherPhoto path={sermon.preacher_image} name={sermon.speaker} /><div><p className="text-xs font-bold uppercase tracking-widest text-navy-600">The preacher</p><p className="mt-2 font-semibold text-navy-900">{sermon.speaker}</p></div></div>
                <div className="p-6"><p className="text-xs font-semibold text-gold-700">{new Date(sermon.sermon_date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Africa/Douala' })}</p><h2 className="mt-3 break-words font-serif text-2xl text-navy-900">{sermon.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">{sermon.text_content || 'Take a moment to listen and reflect on this message.'}</p><div className="mt-6 flex items-center justify-between gap-2"><span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-700">{sermon.content_type === 'audio' ? (sermon.text_content ? 'Audio & text' : 'Audio') : 'Written message'}</span><span className="text-sm font-bold text-navy-900">Open sermon →</span></div></div>
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
    </ContentPage>
  );
}
