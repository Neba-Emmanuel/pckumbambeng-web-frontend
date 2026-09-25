import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api-base';
import { ContentPage } from '@/components/ContentPage';
import { getAnnouncement, type AnnouncementDetail } from '@/lib/server-api';
import { pageMetadata } from '@/lib/site';

const API_URL = API_BASE_URL;

interface PageProps {
  params: Promise<{ id: string }>;
}

function announcementDescription(announcement: AnnouncementDetail): string {
  const plain = announcement.body.replace(/\s+/g, ' ').trim();
  if (plain.length > 80) {
    return `${plain.slice(0, 150).trimEnd()}…`;
  }
  return `${announcement.title} — announcement from PC Kumba-Mbeng.`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  let announcement: AnnouncementDetail | null = null;
  try {
    announcement = await getAnnouncement(id);
  } catch {
    // Backend unavailable — generic metadata; the page shows a friendly error.
  }

  if (!announcement) {
    return pageMetadata({
      title: 'Announcement not found',
      description: 'This announcement is no longer available.',
      path: `/announcements/${id}`,
      noindex: true,
    });
  }

  return pageMetadata({
    title: announcement.title,
    description: announcementDescription(announcement),
    path: `/announcements/${id}`,
    type: 'article',
  });
}

export default async function AnnouncementDetailPage({ params }: PageProps) {
  const { id } = await params;

  let announcement: AnnouncementDetail | null = null;
  let backendFailed = false;
  try {
    announcement = await getAnnouncement(id);
  } catch {
    backendFailed = true;
  }

  if (!announcement) {
    if (backendFailed) {
      return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700" role="alert">
            Unable to load this announcement. Please try again later.
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
    notFound();
  }

  return (
    <ContentPage title={announcement.title} eyebrow="Congregation announcement" description="News and updates for our church family." icon="campaign">
      <Link
        href="/announcements"
        className="inline-flex items-center text-sm font-medium text-navy-600 hover:text-navy-500"
      >
        ← Back to Announcements
      </Link>

      <article className="mx-auto mt-6 max-w-3xl rounded-2xl border border-navy-100 bg-white p-6 shadow-sm sm:p-10">
        <header>
          <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">
            {announcement.title}
          </h2>
          <time className="mt-2 block text-sm text-gray-500" dateTime={announcement.published_at}>
            {new Date(announcement.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'Africa/Douala',
            })}
          </time>
        </header>

        <div className="mt-6 whitespace-pre-wrap break-words text-gray-700 leading-8">
          {announcement.body}
        </div>

        {announcement.attachment_path && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-500">Attachment:</p>
            <a
              href={
                announcement.attachment_path.startsWith('https://')
                  ? announcement.attachment_path
                  : `${API_URL}/uploads/${announcement.attachment_path.replace(/^\/?uploads\//, '')}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center text-sm text-navy-600 hover:text-navy-500"
            >
              Download Attachment
            </a>
          </div>
        )}
      </article>
    </ContentPage>
  );
}
