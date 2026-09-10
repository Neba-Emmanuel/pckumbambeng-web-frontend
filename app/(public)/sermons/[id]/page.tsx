'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiGet, ApiError } from '@/lib/api-client';
import SermonPlayer from '@/components/SermonPlayer';

interface SermonDetail {
  id: number;
  title: string;
  speaker: string;
  sermon_date: string;
  content_type: 'audio' | 'text';
  text_content: string | null;
}

export default function SermonDetailPage() {
  const params = useParams();
  const [sermon, setSermon] = useState<SermonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sermonId = params.id as string;

  useEffect(() => {
    if (!sermonId) return;

    const fetchSermon = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiGet<SermonDetail>(`/api/sermons/${sermonId}`);
        setSermon(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setError('Sermon not found.');
        } else {
          setError('Unable to load sermon content. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSermon();
  }, [sermonId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="mt-6 h-32 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </div>
        <Link
          href="/sermons"
          className="mt-4 inline-flex items-center text-sm font-medium text-navy-600 hover:text-navy-500"
        >
          ← Back to Sermons
        </Link>
      </div>
    );
  }

  if (!sermon) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/sermons"
        className="inline-flex items-center text-sm font-medium text-navy-600 hover:text-navy-500"
      >
        ← Back to Sermons
      </Link>

      <div className="mt-6">
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">
          {sermon.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span>{sermon.speaker}</span>
          <span>&middot;</span>
          <span>
            {new Date(sermon.sermon_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
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
      </div>

      <div className="mt-8">
        {sermon.content_type === 'text' && sermon.text_content ? (
          <div className="prose max-w-none rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="whitespace-pre-wrap text-gray-800">
              {sermon.text_content}
            </div>
          </div>
        ) : sermon.content_type === 'audio' ? (
          <SermonPlayer
            sermonId={sermon.id}
            title={sermon.title}
            speaker={sermon.speaker}
          />
        ) : (
          <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-600">
            No content available for this sermon.
          </div>
        )}
      </div>
    </div>
  );
}
