'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ContentPage } from '@/components/ContentPage';
import { Icon } from '@/components/Icon';
import { apiGetList } from '@/lib/api-client';

interface Announcement {
  body: string;
  attachment_path?: string | null;
  expires_on?: string | null;
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
    <ContentPage title="Stay close to church life." eyebrow="The congregation noticeboard" description="Updates, invitations, and the little things that keep our church family connected." icon="campaign">
      <div className="mb-8 flex items-center justify-between gap-4"><h2 className="text-2xl font-bold text-navy-900">Latest announcements</h2><span className="rounded-full bg-navy-50 px-4 py-2 text-sm text-navy-700">{total} notices</span></div>
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
          <ul className="mt-6 grid gap-5 md:grid-cols-2">
            {announcements.map((announcement) => (
              <li key={announcement.id}>
                <Link
                  href={`/announcements/${announcement.id}`}
                  className="block h-full rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition hover:border-navy-300 hover:shadow-md"
                >
                  <Icon name="campaign" className="mb-5 rounded-xl bg-navy-50 p-3 text-2xl text-navy-700" />
                  <h2 className="break-words font-serif text-2xl text-navy-900">
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
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-600">{announcement.body}</p>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><span className="text-sm font-bold text-navy-800">Read announcement →</span>{announcement.attachment_path && <span className="rounded-full bg-gold-50 px-3 py-1 text-xs font-medium text-gold-800">Attachment included</span>}</div>
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
    </ContentPage>
  );
}
