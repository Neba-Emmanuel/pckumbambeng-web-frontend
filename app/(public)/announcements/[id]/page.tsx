'use client';

import { API_BASE_URL } from '@/lib/api-base';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = API_BASE_URL;

interface Announcement {
  id: number;
  title: string;
  body: string;
  published_at: string;
  attachment_path?: string;
  attachment_type?: string;
}

export default function AnnouncementDetailPage() {
  const params = useParams();
  const id = params.id;

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnnouncement() {
      setIsLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const res = await fetch(`${API_URL}/api/announcements/${id}`, {
          credentials: 'include',
        });

        if (res.status === 404) {
          setNotFound(true);
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to load announcement');
        }

        const data = await res.json();
        setAnnouncement(data.data || data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load announcement'
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center text-gray-500">Loading announcement...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-md bg-yellow-50 p-8 text-center">
          <h2 className="text-lg font-medium text-yellow-800">
            Announcement Not Found
          </h2>
          <p className="mt-2 text-sm text-yellow-700">
            The announcement you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/announcements"
            className="mt-4 inline-block rounded-md bg-navy-600 px-4 py-2 text-sm font-medium text-white hover:bg-navy-500"
          >
            Back to Announcements
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </div>
        <Link
          href="/announcements"
          className="mt-4 inline-block text-sm font-medium text-navy-600 hover:text-navy-500"
        >
          ← Back to Announcements
        </Link>
      </div>
    );
  }

  if (!announcement) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/announcements"
        className="inline-flex items-center text-sm font-medium text-navy-600 hover:text-navy-500"
      >
        ← Back to Announcements
      </Link>

      <article className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {announcement.title}
          </h1>
          <time className="mt-2 block text-sm text-gray-500">
            {new Date(announcement.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </header>

        <div className="mt-6 whitespace-pre-wrap text-gray-700 leading-relaxed">
          {announcement.body}
        </div>

        {announcement.attachment_path && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-700">Attachment:</p>
            <a
              href={announcement.attachment_path.startsWith('https://') ? announcement.attachment_path : `${API_URL}/uploads/${announcement.attachment_path.replace(/^\/?uploads\//, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center text-sm text-navy-600 hover:text-navy-500"
            >
              Download Attachment
            </a>
          </div>
        )}
      </article>
    </div>
  );
}
