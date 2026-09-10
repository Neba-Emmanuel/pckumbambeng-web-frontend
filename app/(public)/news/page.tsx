'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FacebookPost {
  id: number;
  source_id: number;
  fb_post_id: string;
  content: string;
  posted_at: string;
  fetched_at: string;
}

interface FacebookFeedSource {
  page_name: string;
  status: 'available' | 'unavailable';
  posts: FacebookPost[];
}

interface FacebookFeedResponse {
  success: boolean;
  data: {
    sources: FacebookFeedSource[];
  };
}

export default function NewsPage() {
  const [sources, setSources] = useState<FacebookFeedSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeed() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/api/facebook/feed`, {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to load news');
        }

        const data: FacebookFeedResponse = await res.json();
        setSources(data.data.sources);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeed();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-navy-900">News</h1>
      <p className="mt-1 text-sm text-gray-600">
        Latest updates from our church pages
      </p>

      {isLoading && (
        <div className="mt-8 text-center text-gray-500">
          Loading news...
        </div>
      )}

      {error && (
        <div
          className="mt-8 rounded-md bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {!isLoading && !error && sources.length === 0 && (
        <div className="mt-8 rounded-md bg-gray-100 p-8 text-center text-gray-500">
          No news available at this time
        </div>
      )}

      {!isLoading && !error && sources.length > 0 && (
        <div className="mt-6 space-y-8">
          {sources.map((source) => (
            <section
              key={source.page_name}
              className="rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {source.page_name}
                </h2>
              </div>

              {source.status === 'unavailable' ? (
                <div className="px-6 py-8 text-center text-sm text-amber-700 bg-amber-50 rounded-b-lg">
                  Content from {source.page_name} is temporarily unavailable
                </div>
              ) : source.posts.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-gray-500">
                  No posts available from this page
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {source.posts.map((post) => (
                    <li key={post.fb_post_id} className="px-6 py-4">
                      <p className="text-sm text-gray-800 whitespace-pre-line">
                        {post.content}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                        <span>
                          {new Date(post.posted_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>{source.page_name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
