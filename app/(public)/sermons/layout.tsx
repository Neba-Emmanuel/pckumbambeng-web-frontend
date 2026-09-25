import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Sermons',
  description:
    'Listen to sermons preached at PC Kumba-Mbeng. Browse messages by preacher and date, with audio and written transcripts available online.',
  path: '/sermons',
});

export default function SermonsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
