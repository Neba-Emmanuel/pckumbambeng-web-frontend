import type { Metadata } from 'next';
import { CommunityNewsroom } from '@/components/CommunityNewsroom';
import LegacyFacebookFeed from '@/components/LegacyFacebookFeed';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'News',
  description:
    'News and community stories connected with PC Kumba-Mbeng and the wider Kumba Presbytery.',
  path: '/news',
});

export default function NewsPage() {
  // Set FACEBOOK_NEWS_MODE=api and restart/rebuild to restore the previous feed.
  if (process.env.FACEBOOK_NEWS_MODE === 'api') return <LegacyFacebookFeed />;
  return <CommunityNewsroom />;
}
