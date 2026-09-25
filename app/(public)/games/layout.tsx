import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Bible games',
  description:
    'Bible word search, daily word and other Bible activities for all ages from PC Kumba-Mbeng.',
  path: '/games',
});

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
