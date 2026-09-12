import Link from 'next/link';

export interface EventPageSettings {
  detail_page_status?: 'off' | 'not_started' | 'draft' | 'published';
  detail_page_path?: string | null;
}

export function EventPageLink({ event }: { event: EventPageSettings }) {
  if (event.detail_page_status !== 'published' || !event.detail_page_path ||
    !/^\/events\/(?!archive$)[a-z0-9]+(?:-[a-z0-9]+)*$/.test(event.detail_page_path)) return null;
  return <Link href={event.detail_page_path} className="mt-3 inline-flex min-h-[44px] items-center font-semibold text-navy-700 underline underline-offset-4">View event →</Link>;
}
