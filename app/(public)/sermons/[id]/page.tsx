import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SermonDetailView } from '@/components/SermonDetailView';
import { getSermon, type SermonDetail } from '@/lib/server-api';
import { pageMetadata, absoluteUrl, resolveUploadUrl, SITE_URL } from '@/lib/site';

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Plain-text excerpt used for meta descriptions and JSON-LD. */
function sermonDescription(sermon: SermonDetail): string {
  const plain = (sermon.text_content ?? '')
    .replace(/[#>*_`~[\]()]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length > 80) {
    return `${plain.slice(0, 150).trimEnd()}…`;
  }
  return `${sermon.title} — a sermon by ${sermon.speaker} at PC Kumba-Mbeng. Listen to the message and read the text.`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  let sermon: SermonDetail | null = null;
  try {
    sermon = await getSermon(id);
  } catch {
    // Backend unavailable — fall back to generic metadata; the page itself
    // falls back to client-side rendering.
  }

  if (!sermon) {
    return pageMetadata({
      title: 'Sermon not found',
      description: 'This sermon is no longer available.',
      path: `/sermons/${id}`,
      noindex: true,
    });
  }

  return pageMetadata({
    title: sermon.title,
    description: sermonDescription(sermon),
    path: `/sermons/${id}`,
    image: resolveUploadUrl(sermon.preacher_image) ?? undefined,
    imageAlt: `Portrait of ${sermon.speaker}`,
    type: 'article',
  });
}

export default async function SermonDetailPage({ params }: PageProps) {
  const { id } = await params;

  let sermon: SermonDetail | null = null;
  let backendFailed = false;
  try {
    sermon = await getSermon(id);
  } catch {
    backendFailed = true;
  }
  if (!sermon && !backendFailed) notFound();

  const sermonJsonLd = sermon
    ? {
        '@context': 'https://schema.org',
        '@type': 'Sermon',
        name: sermon.title,
        url: absoluteUrl(`/sermons/${sermon.id}`),
        datePublished: sermon.sermon_date,
        description: sermonDescription(sermon),
        author: { '@type': 'Person', name: sermon.speaker },
        publisher: {
          '@type': 'Organization',
          name: 'PC Kumba-Mbeng',
          url: SITE_URL,
          logo: { '@type': 'ImageObject', url: absoluteUrl('/pcc-logo.png') },
        },
        isAccessibleForFree: true,
      }
    : null;

  return (
    <>
      {sermonJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sermonJsonLd) }}
        />
      )}
      <SermonDetailView
        key={id}
        sermonId={id}
        initialSermon={sermon ?? undefined}
      />
    </>
  );
}
