import { CommunityNewsroom } from '@/components/CommunityNewsroom';
import LegacyFacebookFeed from '@/components/LegacyFacebookFeed';

export default function NewsPage() {
  // Set FACEBOOK_NEWS_MODE=api and restart/rebuild to restore the previous feed.
  if (process.env.FACEBOOK_NEWS_MODE === 'api') return <LegacyFacebookFeed />;
  return <CommunityNewsroom />;
}
