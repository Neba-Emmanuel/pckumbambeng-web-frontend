import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Announcements',
  description:
    'Church announcements and updates for the PC Kumba-Mbeng congregation — services, fellowships and special gatherings.',
  path: '/announcements',
});

export default function AnnouncementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
