import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Event archive',
  description:
    'Look back at past events, celebrations and gatherings from PC Kumba-Mbeng.',
  path: '/events/archive',
});

export default function EventsArchiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
