'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContentPage } from '@/components/ContentPage';
import { PreacherPhoto } from '@/components/PreacherPhoto';
import { apiGet, ApiError } from '@/lib/api-client';
import SermonPlayer from '@/components/SermonPlayer';
import { SermonText } from '@/components/SermonText';
import type { SermonDetail } from '@/lib/server-api';

interface SermonDetailViewProps {
  sermonId: string;
  /** Sermon fetched during the server render. When absent the view fetches client-side. */
  initialSermon?: SermonDetail;
}

export function SermonDetailView({ sermonId, initialSermon }: SermonDetailViewProps) {
  const [sermon, setSermon] = useState<SermonDetail | null>(initialSermon ?? null);
  const [isLoading, setIsLoading] = useState(initialSermon === undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialSermon) {
      setSermon(initialSermon);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const fetchSermon = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiGet<SermonDetail>(`/api/sermons/${sermonId}`);
        if (!cancelled) setSermon(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError('Sermon not found.');
        } else {
          setError('Unable to load sermon content. Please try again later.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchSermon();
    return () => {
      cancelled = true;
    };
  }, [sermonId, initialSermon]);

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

  return <ContentPage title={sermon.title} eyebrow="Sermon · PC Kumba-Mbeng" description="Listen with an open heart. Return to the message throughout your week." icon="auto_stories" action={<Link href="/sermons" className="inline-flex min-h-[44px] items-center font-semibold text-gold-200">← All sermons</Link>}>
    <div className="grid items-start gap-8 lg:grid-cols-[280px_1fr]"><aside className="rounded-2xl border border-navy-100 bg-white p-6"><PreacherPhoto path={sermon.preacher_image} name={sermon.speaker} /><p className="mt-5 text-xs font-bold uppercase tracking-widest text-gold-700">Preached by</p><h2 className="mt-2 text-xl font-bold text-navy-900">{sermon.speaker}</h2><p className="mt-3 text-sm text-gray-600">{new Date(sermon.sermon_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Douala' })}</p><p className="mt-6 border-t border-navy-100 pt-5 text-sm leading-relaxed text-gray-600">Make space to reflect: what will you carry from this message into your week?</p></aside>
    <div className="min-w-0 space-y-6">{sermon.content_type === 'audio' && <SermonPlayer sermonId={sermon.id} title={sermon.title} speaker={sermon.speaker} />}{sermon.text_content ? <article className="rounded-2xl border border-navy-100 bg-white p-6 sm:p-10"><h2 className="mb-6 font-serif text-2xl text-navy-900">The message</h2><SermonText text={sermon.text_content} /></article> : sermon.content_type !== 'audio' && <p>No content available for this sermon.</p>}</div></div>
  </ContentPage>;
}
