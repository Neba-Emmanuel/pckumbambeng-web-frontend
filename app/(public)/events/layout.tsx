import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Events',
  description:
    'Find upcoming services, fellowships and special gatherings at PC Kumba-Mbeng, plus a full archive of past church events.',
  path: '/events',
});

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
